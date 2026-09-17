#!/usr/bin/env node
// Stage 4 — entity extraction. deepseek-v4-pro, ONE call per TOPIC (not per chunk),
// plus one cheap deepseek-flash call per topic to Bloom-normalise the objectives.
//
// Two prompt shapes are taken deliberately from the L@S 2024 knowledge-component
// work, because it showed the alternatives fail:
//   1. Generate objectives FIRST, Bloom-normalise in a SECOND pass. Asking for both
//      at once collapses everything into understand/apply/analyze.
//   2. Keep the extraction prompt separate from the classify prompt (stage 3). One
//      prompt doing both silently drops items.
//
// Gleaning (GraphRAG's repeated "did you miss anything?" loop) is deliberately OFF:
// an independent token count put it at ~67% of GraphRAG's ingestion input tokens and
// nobody has published what it buys.
//
// HONESTY NOTE that must survive into the cards: `valid_when` is the highest-stakes
// field here and has the least evidence behind it. Every equation written from this
// stage ships `status: auto`, and the UI/tool layer is required to mark it unverified.

import path from 'node:path';
import {
  BASE_FLAGS,
  BLOOM_LEVELS,
  KC_TYPES,
  TaxonomyError,
  firstLine,
  fmtInt,
  loadTaxonomy,
  mergeFlagSpec,
  parseArgs,
  readJson,
  relLabel,
  resolveDirs,
  runCli,
  writeJsonAtomic,
} from './ingest-common.mjs';
import { createClient, loadPrompt, parseMaxSpend } from './deepseek.mjs';
import { UNASSIGNED } from './classify.mjs';

const TOPIC_TEXT_BUDGET = 48_000; // ~12k tokens, comfortable on a 1M window

function str(v, max = 2000) {
  return typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim().slice(0, max) : '';
}

function strList(v) {
  return Array.isArray(v) ? v.map((x) => str(x, 200)).filter(Boolean) : [];
}

function intList(v) {
  return Array.isArray(v) ? [...new Set(v.map(Number).filter((n) => Number.isInteger(n) && n >= 0))] : [];
}

/**
 * Enum-check everything the model returned. Values outside an enum are DROPPED and
 * reported, never coerced to a near neighbour — a phantom assumption that looks
 * plausible is worse than a missing one.
 */
export function validateEntities(payload, { assumptions, misconceptionIds, sectionIndices }) {
  const problems = [];
  const drop = (what) => problems.push(what);
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, problems: ['reply was not a JSON object'] };
  }
  const assumptionSet = new Set(assumptions);
  const misconceptionSet = new Set(misconceptionIds);
  const sectionSet = new Set(sectionIndices);
  const keepSections = (v, label) => {
    const list = intList(v).filter((i) => {
      if (sectionSet.has(i)) return true;
      drop(`${label}: section index ${i} was not one of this topic's sections`);
      return false;
    });
    return list;
  };
  const keepAssumptions = (v, label) =>
    strList(v).filter((a) => {
      if (assumptionSet.has(a)) return true;
      drop(`${label}: assumption ${JSON.stringify(a)} is not in the taxonomy enum — dropped`);
      return false;
    });

  const equations = [];
  for (const [i, raw] of (Array.isArray(payload.equations) ? payload.equations : []).entries()) {
    const latex = str(raw?.latex, 600).replace(/^\$+|\$+$/g, '').trim();
    if (!latex) {
      drop(`equation ${i}: no latex — dropped`);
      continue;
    }
    const name = str(raw?.name, 160) || 'Unnamed equation';
    equations.push({
      latex,
      name,
      plain: firstLine(str(raw?.plain, 400), 300),
      symbols: strList(raw?.symbols).slice(0, 24),
      valid_when: keepAssumptions(raw?.valid_when, `equation "${name}" valid_when`),
      invalid_when: keepAssumptions(raw?.invalid_when, `equation "${name}" invalid_when`),
      sections: keepSections(raw?.sections, `equation "${name}"`),
    });
  }

  const objectives = [];
  for (const [i, raw] of (Array.isArray(payload.objectives) ? payload.objectives : []).entries()) {
    const text = firstLine(str(raw?.text, 300), 240);
    if (!text) {
      drop(`objective ${i}: no text — dropped`);
      continue;
    }
    let kcType = str(raw?.kc_type, 40).toLowerCase();
    if (!KC_TYPES.includes(kcType)) {
      drop(`objective ${i}: kc_type ${JSON.stringify(raw?.kc_type)} not in ${KC_TYPES.join('|')} — defaulted to skill`);
      kcType = 'skill';
    }
    objectives.push({ text, kc_type: kcType, bloom: null, sections: keepSections(raw?.sections, `objective ${i}`) });
  }

  const examples = [];
  for (const [i, raw] of (Array.isArray(payload.examples) ? payload.examples : []).entries()) {
    const title = firstLine(str(raw?.title, 200), 160);
    const fields = {
      known: str(raw?.known, 2000),
      find: str(raw?.find, 1000),
      sketch: str(raw?.sketch, 1500),
      assumptions: str(raw?.assumptions, 1500),
      analysis: str(raw?.analysis, 6000),
      sanity_check: str(raw?.sanity_check ?? raw?.['sanity check'], 1500),
    };
    const filled = Object.values(fields).filter(Boolean).length;
    if (!title || filled < 2) {
      drop(`example ${i}: only ${filled} of the six ME 300 fields were present — dropped`);
      continue;
    }
    examples.push({ title, ...fields, sections: keepSections(raw?.sections, `example "${title}"`) });
  }

  // Practice items: the problems a source POSES without solving them. An assignment sheet or an
  // exam paper is nothing but these, so without this branch a whole class of course file goes
  // through the pipeline and produces no card at all — the model returned the problems and the
  // validator silently threw them away.
  const items = [];
  for (const [i, raw] of (Array.isArray(payload.items) ? payload.items : []).entries()) {
    const title = firstLine(str(raw?.title, 200), 160);
    const promptText = str(raw?.prompt ?? raw?.question ?? raw?.statement, 1200);
    if (!title || !promptText) {
      drop(`item ${i}: needs both a title and a prompt (had ${title ? 'no prompt' : 'no title'}) — dropped`);
      continue;
    }
    items.push({
      title,
      prompt: promptText,
      // "" is the correct value when the source poses a problem and does not answer it. The
      // writer must never fill this in, and the card says so.
      answer: str(raw?.answer, 600),
      given: str(raw?.given ?? raw?.known, 600),
      find: firstLine(str(raw?.find, 400), 300),
      sections: keepSections(raw?.sections, `item "${title}"`),
    });
  }

  const misconceptions = strList(payload.misconceptions).filter((id) => {
    if (misconceptionSet.has(id)) return true;
    drop(`misconception id ${JSON.stringify(id)} does not exist — dropped`);
    return false;
  });

  return {
    ok: true,
    problems,
    value: {
      description: firstLine(str(payload.description, 400), 300),
      summary: str(payload.summary, 2500),
      equations,
      objectives,
      examples,
      items,
      misconceptions,
    },
  };
}

/** Pass 2: Bloom-normalise objectives that pass 1 wrote. */
export function validateBloom(payload, objectives) {
  const problems = [];
  const rows = Array.isArray(payload?.objectives) ? payload.objectives : [];
  const byIndex = new Map();
  for (const row of rows) {
    const i = Number(row?.index);
    const bloom = str(row?.bloom, 40).toLowerCase();
    if (!Number.isInteger(i) || i < 0 || i >= objectives.length) {
      problems.push(`bloom: unknown objective index ${JSON.stringify(row?.index)}`);
      continue;
    }
    if (!BLOOM_LEVELS.includes(bloom)) {
      problems.push(`bloom: ${JSON.stringify(row?.bloom)} is not a Bloom level for objective ${i}`);
      continue;
    }
    byIndex.set(i, bloom);
  }
  const missing = objectives.map((_, i) => i).filter((i) => !byIndex.has(i));
  if (missing.length) problems.push(`bloom: no level returned for objective(s) ${missing.join(', ')}`);
  return { byIndex, problems };
}

function sectionsBlock(rows, segmentsByPath) {
  const parts = [];
  let used = 0;
  let dropped = 0;
  for (const row of rows) {
    const file = segmentsByPath.get(row.file);
    const section = file?.sections?.[row.section];
    if (!section) continue;
    const where = row.page ? `, ${row.fileType === 'pptx' ? 'slide' : 'page'} ${row.page}` : '';
    const header = `--- section ${row.section} | ${row.file}${where} | ${row.content_type} | "${row.title}" ---`;
    const body = `${header}\n${section.text}\n`;
    if (used + body.length > TOPIC_TEXT_BUDGET) {
      dropped++;
      continue;
    }
    parts.push(body);
    used += body.length;
  }
  return { text: parts.join('\n'), dropped };
}

function dryRunEntities() {
  return { summary: '', equations: [], objectives: [], examples: [], items: [], misconceptions: [] };
}

export async function extractEntities({
  segments,
  classified,
  taxonomy,
  client,
  limit = null,
  only = null,
  minConfidence = 0,
  misconceptionIds = [],
  bloomModel = null,
  onProgress = null,
}) {
  const prompt = await loadPrompt('entities');
  const bloomPrompt = await loadPrompt('bloom');
  const gen = `${prompt.model}@entities@${prompt.version}`;
  const bloomGen = `${bloomModel || bloomPrompt.model}@bloom@${bloomPrompt.version}`;

  const segmentsByPath = new Map(segments.files.map((f) => [f.path, f]));
  const byTopic = new Map();
  for (const row of classified.sections) {
    if (row.topic_id === UNASSIGNED) continue;
    if (row.confidence < minConfidence) continue;
    if (!byTopic.has(row.topic_id)) byTopic.set(row.topic_id, []);
    byTopic.get(row.topic_id).push(row);
  }

  let topicIds = [...byTopic.keys()].sort((a, b) => {
    const la = taxonomy.byTopicId.get(a)?.lecture ?? 1e9;
    const lb = taxonomy.byTopicId.get(b)?.lecture ?? 1e9;
    return la - lb || a.localeCompare(b);
  });
  if (only && only.length) {
    const wanted = new Set(only);
    topicIds = topicIds.filter((id) => wanted.has(id));
  }
  if (Number.isFinite(limit) && limit > 0) topicIds = topicIds.slice(0, limit);

  const topics = [];
  const problems = [];
  let calls = 0;

  const assumptionsText = taxonomy.assumptions.map((a) => `  ${a}`).join('\n');
  const misconceptionsText = misconceptionIds.length ? misconceptionIds.map((m) => `  ${m}`).join('\n') : '  (none authored yet — return an empty list)';

  for (const topicId of topicIds) {
    const rows = byTopic.get(topicId).sort((a, b) => a.file.localeCompare(b.file) || a.section - b.section);
    const meta = taxonomy.byTopicId.get(topicId);
    const unit = taxonomy.units.find((u) => u.id === meta?.unit) || null;
    const { text, dropped } = sectionsBlock(rows, segmentsByPath);
    if (dropped) problems.push(`${topicId}: ${dropped} section(s) did not fit the ${TOPIC_TEXT_BUDGET}-char per-topic budget and were not sent`);
    if (!text) {
      problems.push(`${topicId}: no section text available — skipped`);
      continue;
    }

    let value = null;
    try {
      const { data } = await client.complete({
        stage: 'entities',
        prompt,
        model: prompt.model,
        dryRunValue: dryRunEntities,
        vars: {
          TOPIC_ID: topicId,
          TOPIC_TITLE: meta?.title || topicId,
          UNIT_ID: unit?.id || '—',
          UNIT_TITLE: unit?.title || '—',
          ASSUMPTIONS: assumptionsText,
          MISCONCEPTIONS: misconceptionsText,
          SECTIONS: text,
        },
      });
      calls++;
      const validated = validateEntities(data, {
        assumptions: taxonomy.assumptions,
        misconceptionIds,
        sectionIndices: rows.map((r) => r.section),
      });
      for (const p of validated.problems) problems.push(`${topicId}: ${p}`);
      if (validated.ok) value = validated.value;
      else problems.push(`${topicId}: extraction returned nothing usable`);
    } catch (e) {
      if (e.name === 'SpendLimitError') throw e;
      problems.push(`${topicId}: ${e.message}`);
    }

    if (!value) {
      topics.push({ topic_id: topicId, unit: meta?.unit ?? null, lecture: meta?.lecture ?? null, sections: rows, summary: '', equations: [], objectives: [], examples: [], items: [], misconceptions: [], failed: true });
      continue;
    }

    // Pass 2 — Bloom only. Skipped when there is nothing to tag.
    if (value.objectives.length) {
      try {
        const { data } = await client.complete({
          stage: 'bloom',
          prompt: bloomPrompt,
          model: bloomModel || bloomPrompt.model,
          dryRunValue: () => ({ objectives: value.objectives.map((_, i) => ({ index: i, bloom: 'apply' })) }),
          vars: {
            TOPIC_TITLE: meta?.title || topicId,
            OBJECTIVES: value.objectives.map((o, i) => `  [${i}] (${o.kc_type}) ${o.text}`).join('\n'),
          },
        });
        calls++;
        const { byIndex, problems: bloomProblems } = validateBloom(data, value.objectives);
        for (const p of bloomProblems) problems.push(`${topicId}: ${p}`);
        value.objectives.forEach((o, i) => {
          o.bloom = byIndex.get(i) ?? null;
        });
      } catch (e) {
        if (e.name === 'SpendLimitError') throw e;
        problems.push(`${topicId}: bloom pass failed (${e.message}); objectives keep bloom: null`);
      }
    }

    topics.push({
      topic_id: topicId,
      unit: meta?.unit ?? null,
      lecture: meta?.lecture ?? null,
      title: meta?.title ?? topicId,
      sections: rows,
      ...value,
      failed: false,
    });
    if (onProgress) onProgress({ topic: topicId, of: topicIds.length });
  }

  return {
    version: 1,
    builtAt: new Date().toISOString(),
    gen,
    bloomGen,
    calls,
    topics,
    problems,
    topicsSkippedByConfidence: minConfidence > 0 ? classified.sections.filter((s) => s.topic_id !== UNASSIGNED && s.confidence < minConfidence).length : 0,
  };
}

export function summarizeEntities(entities) {
  const eq = entities.topics.reduce((n, t) => n + t.equations.length, 0);
  const obj = entities.topics.reduce((n, t) => n + t.objectives.length, 0);
  const ex = entities.topics.reduce((n, t) => n + t.examples.length, 0);
  const items = entities.topics.reduce((n, t) => n + (t.items?.length || 0), 0);
  const noBloom = entities.topics.reduce((n, t) => n + t.objectives.filter((o) => !o.bloom).length, 0);
  const lines = [
    `${fmtInt(entities.topics.length)} topic(s) → ${fmtInt(eq)} equation(s), ${fmtInt(obj)} objective(s), ${fmtInt(ex)} worked example(s), ${fmtInt(items)} practice item(s).`,
  ];
  if (noBloom) lines.push(`  ${fmtInt(noBloom)} objective(s) have no Bloom level (the second pass did not return one).`);
  const failed = entities.topics.filter((t) => t.failed);
  if (failed.length) lines.push(`  ${fmtInt(failed.length)} topic(s) failed extraction: ${failed.map((t) => t.topic_id).join(', ')}`);
  return lines.join('\n');
}

const FLAGS = mergeFlagSpec(BASE_FLAGS, {
  flags: { segments: 'string', classified: 'string', 'min-confidence': 'number', 'bloom-model': 'string', topic: 'string' },
});

const USAGE = `Usage: node scripts/kb/entities.mjs [options]

Stage 4 of the KB ingest pipeline. One deepseek-v4-pro call per topic over all of
that topic's sections, then one cheap deepseek-flash pass to Bloom-normalise the
objectives it wrote (a separate pass on purpose — see the header comment).

  --segments FILE      segments.json    (default build/kb/segments.json)
  --classified FILE    classified.json  (default build/kb/classified.json)
  --kb-dir DIR         taxonomy.yml + misconception cards (default agent/kb)
  --out DIR            work dir         (default build/kb; writes entities.json)
  --limit N            only the first N topics
  --topic ID[,ID]      only these topic ids (for debugging one topic cheaply)
  --min-confidence X   ignore sections classified below X (default 0 — keep all)
  --bloom-model M      model for the Bloom pass (default deepseek-flash)
  --dry-run            no API key, no network, no spend
  --max-spend USD      abort rather than exceed this (default 2.00, "none" to disable)
  --verbose
  --help
`;

/** Misconception ids the model is allowed to reference: whatever cards a human has written. */
async function readMisconceptionIds(kbDir) {
  const fsp = await import('node:fs/promises');
  const dir = path.join(kbDir, 'misconceptions');
  let names;
  try {
    names = await fsp.readdir(dir);
  } catch {
    return [];
  }
  const ids = [];
  for (const name of names) {
    if (!name.endsWith('.md')) continue;
    try {
      const raw = await fsp.readFile(path.join(dir, name), 'utf8');
      const m = raw.match(/^\s*id:\s*(misc:[a-z0-9][a-z0-9-]*)\s*$/m);
      if (m) ids.push(m[1]);
    } catch {}
  }
  return [...new Set(ids)].sort();
}

runCli(import.meta.url, async (argv) => {
  const args = parseArgs(argv, FLAGS);
  if (args.help) {
    console.log(USAGE);
    return 0;
  }
  const { kbDir, workDir } = resolveDirs(args);
  const segPath = args.segments ? path.resolve(args.segments) : path.join(workDir, 'segments.json');
  const clsPath = args.classified ? path.resolve(args.classified) : path.join(workDir, 'classified.json');
  const segments = await readJson(segPath, null);
  const classified = await readJson(clsPath, null);
  if (!segments) throw new Error(`No segments at ${relLabel(segPath)} — run scripts/kb/extract.mjs first.`);
  if (!classified) throw new Error(`No classifications at ${relLabel(clsPath)} — run scripts/kb/classify.mjs first.`);

  let taxonomy;
  try {
    taxonomy = await loadTaxonomy(kbDir);
  } catch (e) {
    if (e instanceof TaxonomyError) throw new Error(e.message);
    throw e;
  }
  const misconceptionIds = taxonomy.misconceptions.length ? taxonomy.misconceptions : await readMisconceptionIds(kbDir);

  const client = createClient({
    dryRun: Boolean(args.dryRun),
    maxSpend: parseMaxSpend(args.maxSpend),
    verbose: Boolean(args.verbose),
  });

  const entities = await extractEntities({
    segments,
    classified,
    taxonomy,
    client,
    limit: args.limit,
    only: args.topic ? args.topic.split(',').map((t) => t.trim()).filter(Boolean) : null,
    minConfidence: Number.isFinite(args.minConfidence) ? args.minConfidence : 0,
    misconceptionIds,
    bloomModel: args.bloomModel || null,
  });

  const out = path.join(workDir, 'entities.json');
  await writeJsonAtomic(out, entities);
  console.log(`[entities] wrote ${relLabel(out)}`);
  console.log(`[entities] ${summarizeEntities(entities)}`);
  for (const p of entities.problems.slice(0, 25)) console.log(`  ! ${p}`);
  if (entities.problems.length > 25) console.log(`  … ${entities.problems.length - 25} more`);
  client.printSummary('entities — DeepSeek usage');
  return 0;
});
