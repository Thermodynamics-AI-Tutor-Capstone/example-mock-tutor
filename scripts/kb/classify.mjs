#!/usr/bin/env node
// Stage 3 — classify into the committed taxonomy. deepseek-flash, one call per section.
//
// The taxonomy is NEVER induced. agent/knowledge-brain/taxonomy.yml is hand-transcribed from the
// published ME 300 syllabus, which already partitions the course into exam blocks and
// lecture rows. This stage only picks from that fixed enum.
//
// Expected accuracy, stated up front because it is the design's biggest managed risk:
// roughly 1 section in 4 will land on the wrong topic. That extrapolates from a
// fixed-taxonomy LLM classifier reaching ~0.73 macro-F1 on 17 labels; ME 300 has ~44,
// which is harder, and lecture slides are the text-sparse case where auto-tagging
// agreement falls. Hence: a `confidence` field, a real `unassigned` bucket instead of a
// forced guess, and low-confidence rows flagged for the PR body.

import path from 'node:path';
import {
  BASE_FLAGS,
  CONTENT_TYPES,
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

export const UNASSIGNED = 'unassigned';
export const LOW_CONFIDENCE = 0.5;
const SECTION_TEXT_BUDGET = 7000;

function outlineText(file, highlight, max = 60) {
  const rows = file.outline.slice(0, max).map((s) => {
    const mark = highlight === s.index ? ' <-- this section' : '';
    return `  #${s.index} ${s.title}${mark}`;
  });
  if (file.outline.length > max) rows.push(`  … ${file.outline.length - max} more`);
  return rows.join('\n');
}

function truncate(text, max) {
  return text.length <= max ? text : `${text.slice(0, max)}\n… [truncated at ${max} characters]`;
}

/**
 * Validate one classification payload against the taxonomy enum.
 * Structure can be right and content wrong — that is the dominant JSON-mode
 * failure — so every field is enum-checked, never merely type-checked.
 */
export function validateClassification(payload, taxonomy, contentTypes = CONTENT_TYPES) {
  const problems = [];
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, problems: ['reply was not a JSON object'] };
  }
  let topicId = typeof payload.topic_id === 'string' ? payload.topic_id.trim() : '';
  let proposedTopic = typeof payload.proposed_topic === 'string' ? payload.proposed_topic.trim() : '';

  if (topicId && topicId !== UNASSIGNED && !taxonomy.topicIds.has(topicId)) {
    // A missing `topic:` prefix is a formatting slip, not an invented topic: restoring
    // it is an exact match against the enum, not a guess. Anything that does not match
    // exactly after that becomes a proposal, never a label.
    const prefixed = `topic:${topicId.replace(/^topic:/, '')}`;
    if (taxonomy.topicIds.has(prefixed)) {
      problems.push(`topic_id ${JSON.stringify(topicId)} was missing its "topic:" prefix; matched exactly to ${prefixed}`);
      topicId = prefixed;
    } else {
      problems.push(`topic_id ${JSON.stringify(topicId)} is not in the taxonomy`);
      if (!proposedTopic) proposedTopic = topicId;
      topicId = UNASSIGNED;
    }
  }
  if (!topicId) {
    problems.push('topic_id was missing');
    topicId = UNASSIGNED;
  }

  let contentType = typeof payload.content_type === 'string' ? payload.content_type.trim().toLowerCase().replace(/[\s-]+/g, '_') : '';
  if (!contentTypes.includes(contentType)) {
    if (contentType) problems.push(`content_type ${JSON.stringify(payload.content_type)} is not in the enum`);
    else problems.push('content_type was missing');
    contentType = 'lecture';
  }

  let confidence = Number(payload.confidence);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    problems.push(`confidence ${JSON.stringify(payload.confidence)} is not a number in [0,1]`);
    confidence = 0;
  }
  if (topicId === UNASSIGNED) confidence = 0;

  return {
    ok: true,
    problems,
    value: {
      topic_id: topicId,
      confidence: Math.round(confidence * 100) / 100,
      content_type: contentType,
      evidence: typeof payload.evidence === 'string' ? firstLine(payload.evidence, 160) : '',
      proposed_topic: topicId === UNASSIGNED && proposedTopic ? firstLine(proposedTopic, 120) : null,
    },
  };
}

function dryRunClassification(taxonomy) {
  return {
    topic_id: UNASSIGNED,
    confidence: 0,
    content_type: 'lecture',
    evidence: 'dry run — no model was called',
    proposed_topic: null,
    _taxonomySize: taxonomy.topics.length,
  };
}

export async function classify({ segments, taxonomy, client, limit = null, onProgress = null }) {
  const prompt = await loadPrompt('classify');
  const gen = `${prompt.model}@classify@${prompt.version}`;

  const unitsText = taxonomy.units.length
    ? taxonomy.units.map((u) => `  ${u.id} — ${u.title}${u.exam ? ` (exam ${u.exam})` : ''}`).join('\n')
    : '  (taxonomy.yml declares no units)';
  const topicsText = taxonomy.topics
    .map((t) => `  ${t.id} — ${t.title}${t.lecture ? ` (lecture ${t.lecture})` : ''}`)
    .join('\n');

  const files = Number.isFinite(limit) && limit > 0 ? segments.files.slice(0, limit) : segments.files;
  const sections = [];
  const problems = [];
  const proposedTopics = new Map();
  let calls = 0;
  let retried = 0;

  for (const file of files) {
    for (const section of file.sections) {
      const vars = {
        UNITS: unitsText,
        TOPICS: topicsText,
        CONTENT_TYPES: taxonomy.contentTypes.join(', '),
        FILE_PATH: file.path,
        FILE_TYPE: file.type,
        OUTLINE: outlineText(file, section.index),
        SECTION_INDEX: section.index,
        SECTION_TITLE: section.title,
        SECTION_KIND: section.kind,
        SECTION_PAGE: section.page ? `, ${file.type === 'pptx' ? 'slide' : 'page'} ${section.page}` : '',
        SECTION_TEXT: truncate(section.text, SECTION_TEXT_BUDGET),
      };

      let value = null;
      let attemptProblems = [];
      // One retry on unusable JSON, then unassigned. Never a third guess.
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const { data } = await client.complete({
            stage: 'classify',
            prompt,
            vars,
            dryRunValue: () => dryRunClassification(taxonomy),
          });
          calls++;
          const validated = validateClassification(data, taxonomy, taxonomy.contentTypes);
          attemptProblems = validated.problems;
          if (validated.ok) {
            value = validated.value;
            break;
          }
        } catch (e) {
          if (e.name === 'SpendLimitError') throw e;
          attemptProblems = [e.message];
        }
        if (attempt === 0) retried++;
      }

      if (!value) {
        value = { topic_id: UNASSIGNED, confidence: 0, content_type: 'lecture', evidence: '', proposed_topic: null };
        attemptProblems.push('marked unassigned after a failed retry rather than guessing');
      }
      for (const p of attemptProblems) problems.push(`${file.path} §${section.index} "${section.title}": ${p}`);
      if (value.proposed_topic) {
        const key = value.proposed_topic.toLowerCase();
        const row = proposedTopics.get(key) || { title: value.proposed_topic, sections: [] };
        row.sections.push(`${file.path} §${section.index}`);
        proposedTopics.set(key, row);
      }

      sections.push({
        file: file.path,
        fileType: file.type,
        section: section.index,
        title: section.title,
        kind: section.kind,
        page: section.page,
        endPage: section.endPage,
        chunks: section.chunks.map((c) => c.index),
        chars: section.chars,
        ...value,
      });
      if (onProgress) onProgress({ file: file.path, section: section.index });
    }
  }

  const assigned = sections.filter((s) => s.topic_id !== UNASSIGNED);
  return {
    version: 1,
    builtAt: new Date().toISOString(),
    gen,
    taxonomy: taxonomy.label,
    topicCount: taxonomy.topics.length,
    calls,
    retried,
    sections,
    lowConfidence: assigned.filter((s) => s.confidence < LOW_CONFIDENCE).map((s) => ({ file: s.file, section: s.section, topic_id: s.topic_id, confidence: s.confidence })),
    unassigned: sections.filter((s) => s.topic_id === UNASSIGNED).map((s) => ({ file: s.file, section: s.section, title: s.title, proposed_topic: s.proposed_topic })),
    proposedTopics: [...proposedTopics.values()],
    problems,
  };
}

export function summarizeClassified(classified) {
  const total = classified.sections.length;
  const assigned = total - classified.unassigned.length;
  const mean = assigned
    ? classified.sections.filter((s) => s.topic_id !== UNASSIGNED).reduce((n, s) => n + s.confidence, 0) / assigned
    : 0;
  const lines = [
    `${fmtInt(assigned)}/${fmtInt(total)} section(s) assigned to a topic (mean confidence ${mean.toFixed(2)}), ` +
      `${fmtInt(classified.unassigned.length)} unassigned, ${fmtInt(classified.lowConfidence.length)} below ${LOW_CONFIDENCE}.`,
  ];
  if (classified.retried) lines.push(`  ${fmtInt(classified.retried)} section(s) needed a retry.`);
  for (const p of classified.proposedTopics) lines.push(`  ? proposed new topic: "${p.title}" (${p.sections.length} section(s))`);
  return lines.join('\n');
}

const FLAGS = mergeFlagSpec(BASE_FLAGS, { flags: { segments: 'string' } });

const USAGE = `Usage: node scripts/kb/classify.mjs [options]

Stage 3 of the KB ingest pipeline. One deepseek-flash call per section; assigns a
topic id from agent/knowledge-brain/taxonomy.yml (never an invented one) plus a content_type and
an honest confidence.

  --segments FILE   segments.json from stage 1 (default build/kb/segments.json)
  --kb-dir DIR      where taxonomy.yml lives   (default agent/knowledge-brain)
  --out DIR         work dir                   (default build/kb; writes classified.json)
  --limit N         only the first N files
  --dry-run         no API key, no network, no spend; everything comes back unassigned
  --max-spend USD   abort rather than exceed this (default 2.00, "none" to disable)
  --verbose
  --help
`;

runCli(import.meta.url, async (argv) => {
  const args = parseArgs(argv, FLAGS);
  if (args.help) {
    console.log(USAGE);
    return 0;
  }
  const { kbDir, workDir } = resolveDirs(args);
  const segPath = args.segments ? path.resolve(args.segments) : path.join(workDir, 'segments.json');
  const segments = await readJson(segPath, null);
  if (!segments) throw new Error(`No segments at ${relLabel(segPath)} — run scripts/kb/extract.mjs first.`);
  if (!segments.files.length) {
    console.log('[classify] nothing to do — segments.json holds no files.');
    return 0;
  }

  let taxonomy;
  try {
    taxonomy = await loadTaxonomy(kbDir);
  } catch (e) {
    if (e instanceof TaxonomyError) throw new Error(`${e.message}\n  (classify cannot run without it — the enum is the whole point of this stage.)`);
    throw e;
  }

  const client = createClient({
    dryRun: Boolean(args.dryRun),
    maxSpend: parseMaxSpend(args.maxSpend),
    verbose: Boolean(args.verbose),
  });

  const classified = await classify({ segments, taxonomy, client, limit: args.limit });
  // build/ is gitignored and ephemeral, so work-dir artefacts are written even on a
  // dry run. --dry-run means "no LLM calls, and nothing written under agent/knowledge-brain/".
  const out = path.join(workDir, 'classified.json');
  await writeJsonAtomic(out, classified);
  console.log(`[classify] wrote ${relLabel(out)}`);
  console.log(`[classify] ${summarizeClassified(classified)}`);
  for (const p of classified.problems.slice(0, 20)) console.log(`  ! ${p}`);
  if (classified.problems.length > 20) console.log(`  … ${classified.problems.length - 20} more`);
  client.printSummary('classify — DeepSeek usage');
  return 0;
});
