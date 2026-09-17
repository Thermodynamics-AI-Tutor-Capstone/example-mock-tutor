#!/usr/bin/env node
// Stage 0 — plan. No LLM, no API key, no network.
//
// sha256 every file under agent/knowledge/, compare against agent/kb/.kbstate.json,
// and emit the work list. When nothing changed and neither the pipeline version nor
// any prompt version moved, this exits 0 with "nothing to do" and the rest of the
// pipeline never runs. That is the whole reason a push that touches only the
// frontend costs $0.

import fsp from 'node:fs/promises';
import path from 'node:path';
import {
  BASE_FLAGS,
  DEFAULT_KB_DIR,
  PIPELINE_VERSION,
  SUPPORTED_TYPES,
  fmtInt,
  mergeFlagSpec,
  parseArgs,
  readJson,
  relLabel,
  resolveDirs,
  runCli,
  sha256,
  walkKnowledge,
  writeJsonAtomic,
} from './ingest-common.mjs';
import { promptVersionString } from './deepseek.mjs';

export const STATE_VERSION = 1;
export const PIPELINE_PROMPTS = ['situate', 'classify', 'entities', 'bloom'];

export const REASONS = {
  NEW: 'new',
  CHANGED: 'content-changed',
  PIPELINE: 'pipeline-version-changed',
  PROMPT: 'prompt-version-changed',
  MODEL: 'model-changed',
  FORCED: 'forced',
  MISSING_CONTEXT: 'context-file-missing',
};

export function emptyState() {
  return { version: STATE_VERSION, updatedAt: null, pipeline_version: null, prompt_version: null, files: {} };
}

export async function loadState(kbDir = DEFAULT_KB_DIR) {
  const file = path.join(kbDir, '.kbstate.json');
  const raw = await readJson(file, null);
  if (!raw || typeof raw !== 'object') return emptyState();
  if (raw.version !== STATE_VERSION) {
    return { ...emptyState(), _upgradedFrom: raw.version ?? 'unknown' };
  }
  return { ...emptyState(), ...raw, files: raw.files && typeof raw.files === 'object' ? raw.files : {} };
}

export async function saveState(state, kbDir = DEFAULT_KB_DIR) {
  const file = path.join(kbDir, '.kbstate.json');
  await writeJsonAtomic(file, { ...state, version: STATE_VERSION, updatedAt: new Date().toISOString() });
  return file;
}

/**
 * @returns {Promise<{
 *   pipelineVersion: string, promptVersion: string,
 *   work: Array<{path, full, sha256, bytes, type, reason, previous}>,
 *   unchanged: Array<{path, sha256}>,
 *   deleted: Array<{path, cards_written}>,
 *   unsupported: Array<{path, reason}>,
 *   nothingToDo: boolean
 * }>}
 */
export async function planWork({
  knowledgeDir,
  kbDir = DEFAULT_KB_DIR,
  pipelineVersion = PIPELINE_VERSION,
  promptVersion = null,
  force = false,
  limit = null,
  model = null,
} = {}) {
  const state = await loadState(kbDir);
  const resolvedPromptVersion = promptVersion ?? (await promptVersionString(PIPELINE_PROMPTS));

  const entries = await walkKnowledge(knowledgeDir);
  const work = [];
  const unchanged = [];
  const unsupported = [];
  const onDisk = new Set();

  for (const entry of entries) {
    if (entry.symlink) {
      unsupported.push({ path: entry.path, reason: 'symbolic link (not followed)' });
      continue;
    }
    const type = SUPPORTED_TYPES[path.extname(entry.path).toLowerCase()];
    if (!type) {
      unsupported.push({ path: entry.path, reason: `unsupported file type (${path.extname(entry.path) || 'no extension'})` });
      continue;
    }
    onDisk.add(entry.path);
    const buffer = await fsp.readFile(entry.full);
    const digest = sha256(buffer);
    const previous = state.files[entry.path] || null;

    let reason = null;
    if (force) reason = REASONS.FORCED;
    else if (!previous) reason = REASONS.NEW;
    else if (previous.sha256 !== digest) reason = REASONS.CHANGED;
    else if (String(previous.pipeline_version ?? '') !== String(pipelineVersion)) reason = REASONS.PIPELINE;
    else if (String(previous.prompt_version ?? '') !== String(resolvedPromptVersion)) reason = REASONS.PROMPT;
    else if (model && previous.model_id && previous.model_id !== model) reason = REASONS.MODEL;

    if (reason) work.push({ path: entry.path, full: entry.full, sha256: digest, bytes: buffer.length, type, reason, previous });
    else unchanged.push({ path: entry.path, sha256: digest });
  }

  const deleted = Object.entries(state.files)
    .filter(([p]) => !onDisk.has(p))
    .map(([p, v]) => ({ path: p, cards_written: Array.isArray(v?.cards_written) ? v.cards_written : [] }));

  const limited = Number.isFinite(limit) && limit > 0 ? work.slice(0, limit) : work;

  return {
    pipelineVersion: String(pipelineVersion),
    promptVersion: resolvedPromptVersion,
    knowledgeDir,
    kbDir,
    generatedAt: new Date().toISOString(),
    stateUpgradedFrom: state._upgradedFrom ?? null,
    work: limited,
    workTruncated: limited.length < work.length ? work.length - limited.length : 0,
    unchanged,
    deleted,
    unsupported,
    nothingToDo: limited.length === 0 && deleted.length === 0,
  };
}

export function summarizePlan(plan) {
  const lines = [];
  if (plan.stateUpgradedFrom !== null) {
    lines.push(`State file was written by an older pipeline (version ${plan.stateUpgradedFrom}); treating every file as new.`);
  }
  if (plan.nothingToDo) {
    lines.push(
      `nothing to do — ${fmtInt(plan.unchanged.length)} file(s) unchanged at pipeline ${plan.pipelineVersion}, prompts ${plan.promptVersion}.`
    );
  } else {
    lines.push(`${fmtInt(plan.work.length)} file(s) to ingest, ${fmtInt(plan.unchanged.length)} unchanged.`);
    for (const w of plan.work) lines.push(`  + ${w.path} (${w.type}, ${fmtInt(w.bytes)} bytes) — ${w.reason}`);
    if (plan.workTruncated) lines.push(`  … ${fmtInt(plan.workTruncated)} more withheld by --limit`);
    for (const d of plan.deleted) lines.push(`  - ${d.path} — gone from disk (${d.cards_written.length} card(s) still reference it)`);
  }
  for (const u of plan.unsupported) lines.push(`  ! ${u.path}: ${u.reason}`);
  return lines.join('\n');
}

const FLAGS = mergeFlagSpec(BASE_FLAGS, { booleans: ['force', 'json'] });

const USAGE = `Usage: node scripts/kb/plan.mjs [options]

Stage 0 of the KB ingest pipeline. Hashes agent/knowledge/** and decides what
needs regenerating. Makes no network calls and needs no API key.

  --knowledge-dir DIR  raw uploads to hash        (default agent/knowledge)
  --kb-dir DIR         committed cards + state    (default agent/kb)
  --out DIR            where plan.json is written (default build/kb)
  --limit N            only plan the first N changed files
  --force              re-ingest everything, ignoring hashes
  --dry-run            print the plan, write nothing
  --json               print the plan as JSON instead of prose
  --help
`;

runCli(import.meta.url, async (argv) => {
  const args = parseArgs(argv, FLAGS);
  if (args.help) {
    console.log(USAGE);
    return 0;
  }
  const { knowledgeDir, kbDir, workDir } = resolveDirs(args);
  const plan = await planWork({
    knowledgeDir,
    kbDir,
    force: Boolean(args.force),
    limit: args.limit,
    model: args.model || null,
  });

  if (!args.dryRun) {
    const out = path.join(workDir, 'plan.json');
    await writeJsonAtomic(out, plan);
    if (!args.json) console.log(`[plan] wrote ${relLabel(out)}`);
  }
  if (args.json) {
    console.log(JSON.stringify(plan, null, 2));
  } else {
    console.log(`[plan] ${summarizePlan(plan)}`);
  }
  return 0;
});
