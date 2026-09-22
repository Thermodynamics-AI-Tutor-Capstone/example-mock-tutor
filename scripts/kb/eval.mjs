#!/usr/bin/env node
// Kelvin AI — offline retrieval eval.
//
// No LLM, no API key, no network, no cost. It answers one question: does KB-1
// retrieve better than the flat 1500-character BM25 chunking it replaces?
//
//   arm A — today's behaviour: 1500-char chunks per page, no situating lines,
//           no cards. Reconstructed from the compiled index so the comparison
//           runs from one build.
//   arm B — KB-1 as compiled: structural chunks with committed context lines,
//           plus card text in the same BM25 pool.
//
// Both arms are scored through the SAME scorer (lib/knowledge.js), so what is
// being measured is the data layout, not two different implementations.
//
// Metrics (all @5 by default):
//   card recall     — did a gold card surface as a card hit
//   source recall   — did the gold slide/page surface as a chunk hit  ← the gate
//   cards opened    — how many open_card calls the scripted policy needed
//   input tokens    — L0 + results + opened card bodies, to the first gold hit
//
// The only failing condition is a >10% relative regression in arm B source
// recall@5 against eval/baseline.json. Everything else is reported and not
// enforced, because a metric that fails noisily gets switched off.

import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEFAULT_K = 5;
const DEFAULT_OPEN_BUDGET = 8;
const REGRESSION_TOLERANCE = 0.9; // fail below 90% of the baseline
const CHARS_PER_TOKEN = 4;

const QUESTION_TYPES = new Set(['lookup', 'procedure', 'conceptual', 'course-admin', 'misconception']);

const rel = (p) => {
  const r = path.relative(APP_DIR, String(p)).split(path.sep).join('/');
  return !r || r.startsWith('..') ? String(p) : r;
};

const estimateTokens = (text) => Math.ceil(String(text || '').length / CHARS_PER_TOKEN);

// ------------------------------------------------------------------- input --

function parseArgs(argv) {
  const args = {
    index: null,
    questions: null,
    baseline: null,
    summary: process.env.GITHUB_STEP_SUMMARY || null,
    json: null,
    updateBaseline: false,
    k: DEFAULT_K,
    budget: DEFAULT_OPEN_BUDGET,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const eq = a.startsWith('--') && a.includes('=') ? a.indexOf('=') : -1;
    const flag = eq === -1 ? a : a.slice(0, eq);
    const inline = eq === -1 ? undefined : a.slice(eq + 1);
    const take = (name) => {
      const v = inline ?? argv[++i];
      if (v === undefined) throw new Error(`${name} needs a value`);
      return v;
    };
    switch (flag) {
      case '--index':
        args.index = take(flag);
        break;
      case '--questions':
        args.questions = take(flag);
        break;
      case '--baseline':
        args.baseline = take(flag);
        break;
      case '--summary':
        args.summary = take(flag);
        break;
      case '--json':
        args.json = take(flag);
        break;
      case '--update-baseline':
        args.updateBaseline = true;
        break;
      case '--k':
        args.k = Number.parseInt(take(flag), 10);
        if (!Number.isFinite(args.k) || args.k < 1 || args.k > 8) throw new Error('--k must be between 1 and 8');
        break;
      case '--budget':
        args.budget = Number.parseInt(take(flag), 10);
        if (!Number.isFinite(args.budget) || args.budget < 1) throw new Error('--budget must be a positive integer');
        break;
      case '--help':
      case '-h':
        console.log(
          [
            'Usage: node scripts/kb/eval.mjs [options]',
            '',
            '  --index <file>      compiled index (default build/knowledge-index.json)',
            '  --questions <file>  question set (default eval/questions.jsonl)',
            '  --baseline <file>   committed baseline (default eval/baseline.json)',
            '  --update-baseline   overwrite the baseline with this run',
            '  --summary <file>    markdown summary target (default $GITHUB_STEP_SUMMARY)',
            '  --json <file>       write the full result object here',
            '  --k <n>             results per search (default 5, max 8)',
            '  --budget <n>        max cards the scripted policy may open (default 8)',
          ].join('\n')
        );
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

async function readJson(file) {
  try {
    return JSON.parse(await fsp.readFile(file, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw new Error(`${rel(file)}: ${e.message}`);
  }
}

async function readQuestions(file) {
  let raw;
  try {
    raw = await fsp.readFile(file, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return { questions: [], raw: '', missing: true, problems: [] };
    throw e;
  }
  const questions = [];
  const problems = [];
  raw.split('\n').forEach((line, i) => {
    const text = line.trim();
    if (!text || text.startsWith('//') || text.startsWith('#')) return;
    let row;
    try {
      row = JSON.parse(text);
    } catch (e) {
      problems.push(`line ${i + 1}: not valid JSON (${e.message})`);
      return;
    }
    if (!row || typeof row !== 'object') return problems.push(`line ${i + 1}: not a JSON object`);
    if (typeof row.id !== 'string' || !row.id.trim()) return problems.push(`line ${i + 1}: no "id"`);
    if (typeof row.q !== 'string' || !row.q.trim()) return problems.push(`${row.id}: no "q"`);
    if (row.type && !QUESTION_TYPES.has(row.type)) problems.push(`${row.id}: type "${row.type}" is not one of ${[...QUESTION_TYPES].join(', ')}`);
    questions.push({
      id: row.id.trim(),
      q: row.q.trim(),
      type: row.type || 'lookup',
      gold_cards: Array.isArray(row.gold_cards) ? row.gold_cards.filter((x) => typeof x === 'string') : [],
      gold_source: row.gold_source && typeof row.gold_source === 'object' ? row.gold_source : null,
      placeholder: row.placeholder === true,
    });
  });
  return { questions, raw, missing: false, problems };
}

// ------------------------------------------------------------ arm plumbing --

function normalizePath(p) {
  let s = String(p || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');
  for (const prefix of ['agent/raw-course-files/', 'knowledge/']) {
    if (s.toLowerCase().startsWith(prefix)) {
      s = s.slice(prefix.length);
      break;
    }
  }
  return s.toLowerCase();
}

/** Rebuild arm A — flat 1500-char chunks per page, no context lines, no cards —
 * from the compiled v2 index, so both arms come from one build of one corpus. */
async function buildFlatIndex(index, chunkText) {
  const files = [];
  for (const file of index.files || []) {
    const byPage = new Map();
    for (const chunk of file.chunks || []) {
      const page = chunk.page ?? null;
      if (!byPage.has(page)) byPage.set(page, []);
      // `text` only: the committed situating line is half of what arm B adds.
      byPage.get(page).push(String(chunk.text || ''));
    }
    const chunks = [];
    for (const [page, pieces] of byPage) {
      for (const piece of chunkText(pieces.join('\n\n'))) chunks.push({ id: chunks.length, page, text: piece });
    }
    files.push({
      path: file.path,
      type: file.type,
      bytes: file.bytes ?? null,
      pages: file.pages ?? null,
      chars: chunks.reduce((n, c) => n + c.text.length, 0),
      chunks,
    });
  }
  return { builtAt: index.builtAt || null, root: index.root || 'agent/raw-course-files', files, skipped: [] };
}

/** Last-resort 1500-char splitter, used only if scripts/build-knowledge.mjs
 * stops exporting chunkText. Reported in the output when it is used. */
function fallbackChunkText(text, max = 1500) {
  const paragraphs = String(text || '')
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const chunks = [];
  let current = '';
  for (const p of paragraphs) {
    let rest = p;
    while (rest.length > max) {
      chunks.push(rest.slice(0, max));
      rest = rest.slice(max);
    }
    if (current && current.length + 2 + rest.length > max) {
      chunks.push(current);
      current = rest;
    } else {
      current = current ? `${current}\n\n${rest}` : rest;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function isCardHit(hit) {
  if (!hit || typeof hit !== 'object') return false;
  if (hit.kind === 'card') return true;
  return typeof hit.id === 'string' && !hit.path;
}

function renderHitTokens(hit) {
  const parts = [hit.id || hit.path || '', hit.page != null ? `[${hit.page}]` : '', hit.title || '', hit.description || '', hit.snippet || ''];
  return estimateTokens(parts.filter(Boolean).join(' '));
}

function matchesSource(hit, gold) {
  if (!gold || isCardHit(hit)) return { hit: false, pageCompared: false };
  const goldPath = normalizePath(gold.path || '');
  if (!goldPath || normalizePath(hit.path) !== goldPath) return { hit: false, pageCompared: false };
  const pages = Array.isArray(gold.slides) ? gold.slides : Array.isArray(gold.pages) ? gold.pages : [];
  if (!pages.length) return { hit: true, pageCompared: false };
  if (hit.page == null) return { hit: true, pageCompared: false };
  return { hit: pages.map(Number).includes(Number(hit.page)), pageCompared: true };
}

const LINK_ORDER = ['children', 'topics', 'units', 'equations', 'misconceptions', 'examples', 'items', 'prerequisites', 'precedes', 'related'];

function linkedIds(card) {
  const out = [];
  const links = card?.links && typeof card.links === 'object' ? card.links : card || {};
  for (const field of LINK_ORDER) {
    const value = links[field] ?? card?.[field];
    if (!value) continue;
    for (const entry of Array.isArray(value) ? value : [value]) {
      const id = typeof entry === 'string' ? entry.split('#')[0] : typeof entry?.id === 'string' ? entry.id.split('#')[0] : null;
      if (id && !out.includes(id)) out.push(id);
    }
  }
  return out;
}

/** Scripted greedy policy, standing in for the model: open the top card hit,
 * then follow its links one level. Deterministic by construction. */
function runPolicy({ results, cardsById, goldCards, budget }) {
  const opened = [];
  const seen = new Set();
  const queue = results.filter(isCardHit).map((r) => r.id);
  let reachedAt = null;
  let followed = false;
  while (queue.length && opened.length < budget) {
    const id = queue.shift();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const card = cardsById.get(id);
    if (!card) continue;
    opened.push(card);
    if (goldCards.includes(id)) {
      reachedAt = opened.length;
      break;
    }
    if (!followed) {
      // "follow its links once" — only the first opened card expands.
      for (const next of linkedIds(card)) if (!seen.has(next)) queue.push(next);
      followed = true;
    }
  }
  return { opened, reachedAt };
}

// -------------------------------------------------------------------- run ---

function runArm({ name, kb, questions, k, budget, cardsById, l0Tokens }) {
  const rows = [];
  for (const question of questions) {
    const raw = kb.search({ query: question.q, max_results: k, kind: 'any' });
    const results = Array.isArray(raw) ? raw : [];
    const searchError = Array.isArray(raw) ? null : raw?.error || 'search returned no array';

    let cardRecall = false;
    let sourceRecall = false;
    let pageCompared = false;
    let tokensToFirstGold = null;
    let runningTokens = l0Tokens;

    results.forEach((hit) => {
      runningTokens += renderHitTokens(hit);
      const cardGold = isCardHit(hit) && question.gold_cards.includes(hit.id);
      const sourceMatch = matchesSource(hit, question.gold_source);
      if (cardGold) cardRecall = true;
      if (sourceMatch.hit) {
        sourceRecall = true;
        pageCompared = pageCompared || sourceMatch.pageCompared;
      }
      if ((cardGold || sourceMatch.hit) && tokensToFirstGold === null) tokensToFirstGold = runningTokens;
    });

    const policy = question.gold_cards.length ? runPolicy({ results, cardsById, goldCards: question.gold_cards, budget }) : { opened: [], reachedAt: null };
    // If no search hit was gold, the cost of reaching gold is the whole result
    // set plus every card the policy had to open.
    if (tokensToFirstGold === null && policy.reachedAt !== null) {
      const openedTokens = policy.opened.reduce((n, c) => n + (Number.isFinite(c.bodyTokens) ? c.bodyTokens : estimateTokens(c.body || '')) + estimateTokens(c.description || ''), 0);
      tokensToFirstGold = runningTokens + openedTokens;
    }

    rows.push({
      id: question.id,
      type: question.type,
      results: results.length,
      searchError,
      cardRecall,
      sourceRecall,
      pageCompared,
      cardsOpened: policy.reachedAt,
      tokensToFirstGold,
    });
  }

  const scorableCards = questions.filter((q) => q.gold_cards.length).length;
  const scorableSources = questions.filter((q) => q.gold_source && q.gold_source.path).length;
  const mean = (values) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : null);

  return {
    arm: name,
    questions: questions.length,
    scorableCards,
    scorableSources,
    cardRecallAt5: scorableCards ? rows.filter((r) => r.cardRecall).length / scorableCards : null,
    sourceRecallAt5: scorableSources ? rows.filter((r) => r.sourceRecall).length / scorableSources : null,
    meanCardsOpenedToGold: mean(rows.filter((r) => r.cardsOpened !== null).map((r) => r.cardsOpened)),
    goldReachedByPolicy: rows.filter((r) => r.cardsOpened !== null).length,
    meanTokensToFirstGold: mean(rows.filter((r) => r.tokensToFirstGold !== null).map((r) => r.tokensToFirstGold)),
    anyCardHits: rows.some((r) => r.cardRecall),
    rows,
  };
}

function pct(v) {
  return v === null || v === undefined ? '—' : `${(v * 100).toFixed(0)}%`;
}
function num(v, digits = 1) {
  return v === null || v === undefined ? '—' : Number(v).toFixed(digits);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const indexPath = path.resolve(APP_DIR, args.index || path.join('build', 'knowledge-index.json'));
  const questionsPath = path.resolve(APP_DIR, args.questions || path.join('eval', 'questions.jsonl'));
  const baselinePath = path.resolve(APP_DIR, args.baseline || path.join('eval', 'baseline.json'));

  const index = await readJson(indexPath);
  const fileCount = index?.files?.length || 0;
  const cardCount = index?.cards?.length || 0;
  const { questions, raw: questionsRaw, missing, problems } = await readQuestions(questionsPath);
  for (const p of problems) console.warn(`questions: ${p}`);

  if (!index || (fileCount === 0 && cardCount === 0)) {
    const why = !index ? `${rel(indexPath)} does not exist — run \`npm run knowledge\` first` : `${rel(indexPath)} holds no files and no cards`;
    console.log('no corpus — nothing to evaluate');
    console.log(`(${why})`);
    if (args.updateBaseline) {
      // Still commit a baseline, so the file exists and says honestly that it
      // was taken against an empty corpus.
      await fsp.mkdir(path.dirname(baselinePath), { recursive: true });
      await fsp.writeFile(
        baselinePath,
        JSON.stringify(
          {
            version: 1,
            generatedAt: new Date().toISOString(),
            k: args.k,
            budget: args.budget,
            corpus: { files: fileCount, chunks: 0, cards: cardCount, sha256: null },
            questions: { count: questions.length, placeholders: questions.filter((q) => q.placeholder).length, sha256: crypto.createHash('sha256').update(questionsRaw).digest('hex') },
            arms: {},
            unscorable: [],
            note: `Written with no corpus (${why}). There are no metrics to regress from, so the eval gate is inert until this file is regenerated against real course materials with \`node scripts/kb/eval.mjs --update-baseline\`.`,
          },
          null,
          2
        ) + '\n'
      );
      console.log(`baseline written to ${rel(baselinePath)} (no metrics — the gate stays inert until there is a corpus)`);
    }
    await writeSummary(args.summary, ['## Kelvin AI — retrieval eval', '', `**no corpus — nothing to evaluate** (${why}).`, '']);
    return 0;
  }

  if (missing || !questions.length) {
    console.log(`no questions — nothing to evaluate (${missing ? `${rel(questionsPath)} does not exist` : `${rel(questionsPath)} holds no usable rows`})`);
    await writeSummary(args.summary, ['## Kelvin AI — retrieval eval', '', `**no questions** in \`${rel(questionsPath)}\`.`, '']);
    return 0;
  }

  // The scorer, shared by both arms.
  const { knowledgeFromIndex } = await import(pathToFileURL(path.join(APP_DIR, 'lib', 'knowledge.js')).href);
  let chunkText = null;
  try {
    const mod = await import(pathToFileURL(path.join(APP_DIR, 'scripts', 'build-knowledge.mjs')).href);
    if (typeof mod.chunkText === 'function') chunkText = mod.chunkText;
  } catch {
    /* fall through to the local splitter */
  }
  const chunkerLabel = chunkText ? 'chunkText from scripts/build-knowledge.mjs' : "this harness's fallback 1500-char splitter";
  if (!chunkText) chunkText = fallbackChunkText;

  const cards = Array.isArray(index.cards) ? index.cards : [];
  const cardsById = new Map(cards.map((c) => [c.id, c]));
  const l0Tokens = Number.isFinite(index.l0Tokens) ? index.l0Tokens : estimateTokens(index.l0 || '');

  const armAIndex = await buildFlatIndex(index, chunkText);
  const armA = runArm({ name: 'A — flat 1500-char BM25 (today)', kb: knowledgeFromIndex(armAIndex), questions, k: args.k, budget: args.budget, cardsById: new Map(), l0Tokens: 0 });
  const armB = runArm({ name: 'B — KB-1', kb: knowledgeFromIndex(index), questions, k: args.k, budget: args.budget, cardsById, l0Tokens });

  // Which questions cannot be scored against this corpus at all.
  const knownPaths = new Set((index.files || []).map((f) => normalizePath(f.path)));
  const unscorable = [];
  for (const q of questions) {
    const missingCards = q.gold_cards.filter((id) => !cardsById.has(id));
    const missingSource = q.gold_source?.path && !knownPaths.has(normalizePath(q.gold_source.path)) ? q.gold_source.path : null;
    if (missingCards.length || missingSource) unscorable.push({ id: q.id, missingCards, missingSource });
  }

  const corpusFingerprint = crypto
    .createHash('sha256')
    .update(JSON.stringify({ files: (index.files || []).map((f) => [f.path, f.chars, (f.chunks || []).length]).sort(), cards: cards.map((c) => c.id).sort() }))
    .digest('hex');
  const questionsFingerprint = crypto.createHash('sha256').update(questionsRaw).digest('hex');

  const result = {
    version: 1,
    generatedAt: new Date().toISOString(),
    k: args.k,
    budget: args.budget,
    corpus: { files: fileCount, chunks: (index.files || []).reduce((n, f) => n + (f.chunks?.length || 0), 0), cards: cardCount, sha256: corpusFingerprint },
    questions: { count: questions.length, placeholders: questions.filter((q) => q.placeholder).length, sha256: questionsFingerprint },
    arms: { A: stripRows(armA), B: stripRows(armB) },
    unscorable,
  };

  // ---- baseline gate --------------------------------------------------------
  const baseline = await readJson(baselinePath);
  let verdict = { status: 'info', message: '' };
  if (args.updateBaseline) {
    await fsp.mkdir(path.dirname(baselinePath), { recursive: true });
    await fsp.writeFile(
      baselinePath,
      JSON.stringify(
        {
          ...result,
          note:
            'Committed baseline for scripts/kb/eval.mjs. The eval fails only on a >10% relative regression in arm B source recall@5 against this file, and only while the question set and the source corpus are unchanged. Regenerate with `node scripts/kb/eval.mjs --update-baseline` and say in the PR why the numbers moved.',
        },
        null,
        2
      ) + '\n'
    );
    verdict = { status: 'info', message: `baseline written to ${rel(baselinePath)}` };
  } else if (!baseline) {
    verdict = { status: 'info', message: `no baseline at ${rel(baselinePath)} — run \`node scripts/kb/eval.mjs --update-baseline\` to commit one` };
  } else {
    const before = baseline.arms?.B?.sourceRecallAt5;
    const after = result.arms.B.sourceRecallAt5;
    const sameQuestions = baseline.questions?.sha256 === result.questions.sha256;
    const sameCorpus = baseline.corpus?.sha256 === result.corpus.sha256;
    if (typeof before !== 'number' || before <= 0) {
      verdict = { status: 'info', message: 'the baseline records no arm B source recall to regress from' };
    } else if (typeof after !== 'number') {
      verdict = { status: 'info', message: 'this run scored no question for source recall' };
    } else if (after < before * REGRESSION_TOLERANCE) {
      const drop = `${pct(before)} → ${pct(after)}`;
      if (sameQuestions && sameCorpus) verdict = { status: 'fail', message: `arm B source recall@${args.k} regressed ${drop}, more than the 10% relative tolerance` };
      else
        verdict = {
          status: 'warn',
          message: `arm B source recall@${args.k} moved ${drop}, but the ${!sameQuestions ? 'question set' : 'corpus'} changed since the baseline was written, so this is not a like-for-like comparison — re-baseline with --update-baseline and say why in the PR`,
        };
    } else {
      verdict = { status: 'pass', message: `arm B source recall@${args.k} ${pct(after)} against a baseline of ${pct(before)}` };
    }
  }
  result.verdict = verdict;

  if (args.json) {
    await fsp.mkdir(path.dirname(path.resolve(APP_DIR, args.json)), { recursive: true });
    await fsp.writeFile(path.resolve(APP_DIR, args.json), JSON.stringify(result, null, 2) + '\n');
  }

  console.log(renderText({ result, armA, armB, chunkerLabel, questionsPath, indexPath }));
  await writeSummary(args.summary, renderMarkdown({ result, armA, armB, chunkerLabel }));
  return verdict.status === 'fail' ? 1 : 0;
}

function stripRows(arm) {
  const { rows, ...rest } = arm;
  return { ...rest, byType: byType(rows) };
}

function byType(rows) {
  const out = {};
  for (const row of rows) {
    if (!out[row.type]) out[row.type] = { n: 0, cardRecall: 0, sourceRecall: 0 };
    out[row.type].n++;
    if (row.cardRecall) out[row.type].cardRecall++;
    if (row.sourceRecall) out[row.type].sourceRecall++;
  }
  return out;
}

function renderText({ result, armA, armB, chunkerLabel, questionsPath, indexPath }) {
  const lines = [];
  lines.push(`Kelvin AI — offline retrieval eval (${result.questions.count} questions from ${rel(questionsPath)}, index ${rel(indexPath)})`);
  lines.push(`corpus: ${result.corpus.files} files / ${result.corpus.chunks} chunks / ${result.corpus.cards} cards · arm A rebuilt with ${chunkerLabel}`);
  lines.push('');
  const table = [
    ['arm', 'card recall@' + result.k, 'source recall@' + result.k, 'cards opened to gold', 'input tokens to first gold'],
    [armA.arm, '— (no cards)', pct(armA.sourceRecallAt5), '—', num(armA.meanTokensToFirstGold, 0)],
    [armB.arm, pct(armB.cardRecallAt5), pct(armB.sourceRecallAt5), num(armB.meanCardsOpenedToGold, 2), num(armB.meanTokensToFirstGold, 0)],
  ];
  const widths = table[0].map((_, i) => Math.max(...table.map((r) => String(r[i]).length)));
  for (const row of table) lines.push('  ' + row.map((c, i) => String(c).padEnd(widths[i])).join('  '));
  lines.push('');
  lines.push(`  arm B reached a gold card with the scripted policy on ${armB.goldReachedByPolicy}/${armB.scorableCards} card-scored questions.`);
  if (result.corpus.cards && !armB.anyCardHits) {
    lines.push('  NOTE: the index holds cards but no card ever surfaced in arm B search results.');
    lines.push('        Either lib/knowledge.js does not yet put card text in the BM25 pool, or BM25 never ranked one in the top k.');
  }
  if (result.questions.placeholders) {
    lines.push(`  NOTE: ${result.questions.placeholders}/${result.questions.count} questions are marked placeholder. These were written against the`);
    lines.push('        public ME 300 sample syllabus structure, not against real course materials, and their gold ids');
    lines.push('        are guesses. Until the team replaces them, these numbers describe the harness, not the tutor.');
  }
  if (result.unscorable.length) {
    lines.push(`  NOTE: ${result.unscorable.length} question(s) reference gold ids or files that are not in this index:`);
    for (const u of result.unscorable.slice(0, 12)) {
      const bits = [...u.missingCards, ...(u.missingSource ? [u.missingSource] : [])].join(', ');
      lines.push(`        ${u.id}: ${bits}`);
    }
    if (result.unscorable.length > 12) lines.push(`        …and ${result.unscorable.length - 12} more`);
  }
  lines.push('');
  lines.push(`verdict: ${result.verdict.status.toUpperCase()} — ${result.verdict.message}`);
  lines.push('Token figures are estimates (chars ÷ 4), not a tokenizer count. Arm B pays L0 on every turn; arm A has no L0.');
  return lines.join('\n');
}

function renderMarkdown({ result, armA, armB, chunkerLabel }) {
  const lines = ['## Kelvin AI — offline retrieval eval', ''];
  lines.push(`${result.questions.count} questions · corpus ${result.corpus.files} files / ${result.corpus.chunks} chunks / ${result.corpus.cards} cards`, '');
  lines.push(`| Arm | card recall@${result.k} | source recall@${result.k} | cards opened to gold | input tokens to first gold |`, '|---|---:|---:|---:|---:|');
  lines.push(`| ${armA.arm} | — | ${pct(armA.sourceRecallAt5)} | — | ${num(armA.meanTokensToFirstGold, 0)} |`);
  lines.push(`| ${armB.arm} | ${pct(armB.cardRecallAt5)} | ${pct(armB.sourceRecallAt5)} | ${num(armB.meanCardsOpenedToGold, 2)} | ${num(armB.meanTokensToFirstGold, 0)} |`);
  lines.push('');
  const icon = { pass: '✅', info: 'ℹ️', warn: '⚠️', fail: '❌' }[result.verdict.status] || '';
  lines.push(`${icon} **${result.verdict.status.toUpperCase()}** — ${result.verdict.message}`, '');
  if (result.questions.placeholders) {
    lines.push(
      `> ${result.questions.placeholders} of ${result.questions.count} questions are **placeholders** written against the public ME 300 sample syllabus structure. ` +
        'Until the team writes 30 real ones from actual course materials, this table measures the harness, not the tutor.',
      ''
    );
  }
  if (result.unscorable.length) {
    lines.push(`> ${result.unscorable.length} question(s) reference gold ids or files that are not in this index, so they can only score 0.`, '');
  }
  lines.push(`Arm A was rebuilt from the same compiled index with ${chunkerLabel}; both arms are scored by the same BM25 in \`lib/knowledge.js\`.`, '');
  lines.push('Token figures are estimates (chars ÷ 4), not a tokenizer count. Arm B pays L0 on every turn; arm A has no L0.', '');
  return lines;
}

async function writeSummary(target, lines) {
  if (!target) return;
  try {
    await fsp.appendFile(target, (Array.isArray(lines) ? lines.join('\n') : String(lines)) + '\n');
  } catch (e) {
    console.warn(`Could not write the step summary to ${target}: ${e.message}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    process.exitCode = await main();
  } catch (e) {
    console.error(`kb eval failed to run: ${e.stack || e.message}`);
    process.exitCode = 1;
  }
}
