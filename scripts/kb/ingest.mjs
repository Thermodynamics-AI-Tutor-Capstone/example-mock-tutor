#!/usr/bin/env node
// The whole ingest pipeline, stages 0–5, in one command. This is what `npm run kb:ingest`
// runs and what the GitHub Action calls.
//
// Stage 0 is the cost control: if no file's sha256 moved and neither the pipeline
// version nor any prompt version changed, this exits 0 having spent nothing. A push
// that touches only the frontend costs $0.
//
// Nothing here runs on Vercel. The compile step (scripts/build-knowledge.mjs) is
// separate, offline and LLM-free by design.

import path from 'node:path';
import {
  BASE_FLAGS,
  DEFAULT_REPORT_PATH,
  PIPELINE_VERSION,
  TaxonomyError,
  fmtInt,
  fmtUsd,
  loadTaxonomy,
  mergeFlagSpec,
  parseArgs,
  relLabel,
  resolveDirs,
  runCli,
  writeJsonAtomic,
  writeTextAtomic,
} from './ingest-common.mjs';
import { createClient, parseMaxSpend, promptVersionString } from './deepseek.mjs';
import { PIPELINE_PROMPTS, loadState, planWork, saveState, summarizePlan } from './plan.mjs';
import { extractAll, summarizeSegments } from './extract.mjs';
import { situate } from './situate.mjs';
import { classify, summarizeClassified } from './classify.mjs';
import { extractEntities, summarizeEntities } from './entities.mjs';
import { reportMarkdown, writeCards } from './write-cards.mjs';
import { AUTO_BLOCK_OUTCOME } from './ingest-common.mjs';

const FLAGS = mergeFlagSpec(BASE_FLAGS, {
  flags: { report: 'string', summary: 'string', 'min-confidence': 'number', 'bloom-model': 'string' },
  booleans: ['force', 'write-units', 'all'],
});

const USAGE = `Usage: node scripts/kb/ingest.mjs [options]

Runs stages 0–5 of the KB ingest pipeline:
  0 plan (hash, no LLM) → 1 extract (no LLM) → 2 situate (deepseek-flash)
  → 3 classify (deepseek-flash) → 4 entities (deepseek-v4-pro) → 5 write cards (no LLM)

  --knowledge-dir DIR  raw uploads          (default agent/raw-course-files)
  --kb-dir DIR         cards + state        (default agent/knowledge-brain)
  --out DIR            work dir             (default build/kb)
  --report FILE        machine-readable report (default build/kb-report.json)
  --summary FILE       append the markdown report (e.g. "$GITHUB_STEP_SUMMARY")
  --limit N            only the first N changed files
  --force              re-ingest everything, ignoring hashes
  --all                ignore the plan; ingest every file (implies --force)
  --min-confidence X   ignore sections classified below X when extracting entities
  --write-units        also draft unit cards from taxonomy.yml (off by default)
  --dry-run            no API key, no network, no spend, nothing written to agent/knowledge-brain/
  --max-spend USD      abort rather than exceed this (default 2.00, "none" to disable)
  --verbose
  --help
`;

runCli(import.meta.url, async (argv) => {
  const args = parseArgs(argv, FLAGS);
  if (args.help) {
    console.log(USAGE);
    return 0;
  }
  const { knowledgeDir, kbDir, workDir } = resolveDirs(args);
  const dryRun = Boolean(args.dryRun);
  const started = Date.now();

  // ── stage 0 ────────────────────────────────────────────────────────────────
  const promptVersion = await promptVersionString(PIPELINE_PROMPTS);
  const plan = await planWork({
    knowledgeDir,
    kbDir,
    promptVersion,
    force: Boolean(args.force || args.all),
    limit: args.limit,
  });
  await writeJsonAtomic(path.join(workDir, 'plan.json'), plan);
  console.log(`[plan] ${summarizePlan(plan)}`);
  if (plan.nothingToDo) {
    console.log('[ingest] nothing to do — no DeepSeek call was made and nothing was spent.');
    return 0;
  }

  let taxonomy;
  try {
    taxonomy = await loadTaxonomy(kbDir);
  } catch (e) {
    if (e instanceof TaxonomyError) throw new Error(e.message);
    throw e;
  }
  for (const w of taxonomy.warnings) console.log(`[taxonomy] ! ${w}`);
  console.log(
    `[taxonomy] ${fmtInt(taxonomy.units.length)} unit(s), ${fmtInt(taxonomy.topics.length)} topic(s), ` +
      `${fmtInt(taxonomy.assumptions.length)} assumption(s) from ${taxonomy.assumptionsSource}.`
  );

  // ── stage 1 ────────────────────────────────────────────────────────────────
  const files = plan.work.map((w) => ({ path: w.path, full: w.full, type: w.type }));
  const segments = await extractAll({ knowledgeDir, files });
  await writeJsonAtomic(path.join(workDir, 'segments.json'), segments);
  console.log(`[extract] ${summarizeSegments(segments)}`);
  if (!segments.files.length) {
    console.log('[ingest] no file yielded extractable text; stopping before any DeepSeek call.');
    return 0;
  }

  // One client for the whole run, so --max-spend is a budget for the RUN and not
  // per stage. That is the only way the guard can actually bound a cold rebuild.
  const client = createClient({
    dryRun,
    maxSpend: parseMaxSpend(args.maxSpend),
    verbose: Boolean(args.verbose),
  });

  // ── stage 2 ────────────────────────────────────────────────────────────────
  const situated = await situate({ segments, kbDir, client });
  for (const f of situated.files) {
    if (f.outcome === AUTO_BLOCK_OUTCOME.WRITTEN) {
      if (dryRun) console.log(`[situate] would write ${relLabel(f.target)}`);
      else {
        await writeTextAtomic(f.target, f.text);
        console.log(`[situate] wrote ${relLabel(f.target)} (${fmtInt(f.chunks)} lines)`);
      }
    } else if (f.outcome !== AUTO_BLOCK_OUTCOME.UNCHANGED) {
      console.log(`[situate] LEFT ALONE ${relLabel(f.target)} — ${f.outcome}`);
    }
  }
  await writeJsonAtomic(path.join(workDir, 'context.json'), {
    version: 1,
    gen: situated.gen,
    contexts: situated.contexts,
    problems: situated.problems,
  });
  console.log(`[situate] ${fmtInt(situated.calls)} call(s), ${fmtInt(situated.fallbacks)} fallback caption(s), ${fmtInt(situated.problems.length)} problem(s).`);

  // ── stage 3 ────────────────────────────────────────────────────────────────
  const classified = await classify({ segments, taxonomy, client });
  await writeJsonAtomic(path.join(workDir, 'classified.json'), classified);
  console.log(`[classify] ${summarizeClassified(classified)}`);

  // ── stage 4 ────────────────────────────────────────────────────────────────
  const misconceptionIds = await readMisconceptionIds(kbDir);
  const entities = await extractEntities({
    segments,
    classified,
    taxonomy,
    client,
    misconceptionIds,
    minConfidence: Number.isFinite(args.minConfidence) ? args.minConfidence : 0,
    bloomModel: args.bloomModel || null,
  });
  await writeJsonAtomic(path.join(workDir, 'entities.json'), entities);
  console.log(`[entities] ${summarizeEntities(entities)}`);

  // ── stage 5 ────────────────────────────────────────────────────────────────
  const state = await loadState(kbDir);
  const { cards, report } = await writeCards({
    kbDir,
    segments,
    classified,
    entities,
    taxonomy,
    state,
    gen: entities.gen,
    writeUnits: Boolean(args.writeUnits),
    promptVersion,
  });

  let written = 0;
  for (const card of cards) {
    if (!card.changed) continue;
    if (dryRun) {
      console.log(`[write-cards] would ${card.outcome} ${relLabel(card.file)}`);
      continue;
    }
    await writeTextAtomic(card.file, card.text);
    written++;
  }

  if (!dryRun) {
    const cardsByFile = new Map();
    for (const card of cards) {
      state.cards[card.id] = {
        kind: card.kind,
        file: relLabel(card.file),
        status: card.status,
        fields: card.fields || [],
        source_sha256: card.sourceSha256 ?? null,
      };
      for (const p of card.sourcePaths || []) {
        if (!cardsByFile.has(p)) cardsByFile.set(p, new Set());
        cardsByFile.get(p).add(card.id);
      }
    }
    for (const file of segments.files) {
      state.files[file.path] = {
        path: file.path,
        sha256: file.sha256,
        bytes: file.bytes,
        pipeline_version: PIPELINE_VERSION,
        model_id: entities.gen.split('@')[0],
        prompt_version: promptVersion,
        cards_written: [...(cardsByFile.get(file.path) || [])].sort(),
        ingestedAt: new Date().toISOString(),
      };
    }
    state.pipeline_version = PIPELINE_VERSION;
    state.prompt_version = promptVersion;
    await saveState(state, kbDir);
    console.log(`[write-cards] wrote ${fmtInt(written)} card file(s); state updated.`);
  }

  const usage = client.summary();
  report.usage = usage;
  const reportPath = args.report ? path.resolve(args.report) : DEFAULT_REPORT_PATH;
  await writeJsonAtomic(reportPath, report);
  console.log(`[ingest] wrote ${relLabel(reportPath)}`);
  if (args.summary) {
    const md =
      reportMarkdown(report) +
      `\n### Cost\n\n${usage.dryRun ? 'Dry run — nothing spent.' : `${fmtInt(usage.calls)} DeepSeek call(s): ${fmtUsd(usage.costOffPeakUsd)} off-peak / ${fmtUsd(usage.costPeakUsd)} peak (estimated from published prices, not an invoice).`}\n`;
    const fsp = await import('node:fs/promises');
    await fsp.appendFile(path.resolve(args.summary), md + '\n');
  }

  client.printSummary('ingest — DeepSeek usage');
  console.log(`[ingest] done in ${((Date.now() - started) / 1000).toFixed(1)}s.`);
  return 0;
});

async function readMisconceptionIds(kbDir) {
  const fsp = await import('node:fs/promises');
  let names;
  try {
    names = await fsp.readdir(path.join(kbDir, 'misconceptions'));
  } catch {
    return [];
  }
  const ids = [];
  for (const name of names) {
    if (!name.endsWith('.md')) continue;
    try {
      const raw = await fsp.readFile(path.join(kbDir, 'misconceptions', name), 'utf8');
      const m = raw.match(/^\s*id:\s*(misc:[a-z0-9][a-z0-9-]*)\s*$/m);
      if (m) ids.push(m[1]);
    } catch {}
  }
  return [...new Set(ids)].sort();
}
