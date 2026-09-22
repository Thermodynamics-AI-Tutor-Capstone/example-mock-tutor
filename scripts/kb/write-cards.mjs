#!/usr/bin/env node
// Stage 5 — merge and write cards. No LLM, no API key, no network.
//
// Three jobs:
//   1. Dedupe equations by normalised-LaTeX hash. The real duplicate problem here is
//      the steady-flow energy equation restated on eight slides, not web-scale near
//      duplicates, so this is an exact-match registry and not MinHash/LSH.
//   2. Propose `precedes` edges from lecture order and drop the transitively implied
//      ones, so a human never re-answers a question the graph already implies.
//   3. Write cards under agent/knowledge-brain/ honouring the NO-CLOBBER rule, and emit
//      build/kb-report.json for the Action's PR body.
//
// WHAT THIS STAGE DELIBERATELY DOES NOT DO:
//   * It does not write `prerequisites[]`. Auto-extracted prerequisite edges run
//     around 46% precision in the published work; emitting them as if they were
//     known would be exactly the fake capability the project rules forbid. They are
//     left empty for a human.
//   * It does not write symbol definitions. agent/knowledge-brain/symbols.md is hand-authored and
//     authoritative; cards may only reference it.
//   * It does not create course or unit cards unless asked (--write-units), because
//     those are the always-resident L0 surface and belong to a human.
//
// ID / FILENAME NOTE (a resolved conflict in the design):
//   CI gate 1 requires ids to match ^(course|unit|topic|eq|misc|ex|item|src):[a-z0-9][a-z0-9-]*$
//   — no underscores. The design's illustrative source-card filename used the `__`
//   path separator (`sources/lectures__lec27-entropy-pptx.md`). Source CARD ids and
//   filenames here use hyphens only so id <-> filename stays 1:1 and gate 1 passes.
//   The CONTEXT files (agent/knowledge-brain/context/) keep the `__` spelling: they are not ids.

import fsp from 'node:fs/promises';
import path from 'node:path';
import {
  AUTO_BLOCK_OUTCOME,
  BASE_FLAGS,
  CARD_DIR_BY_KIND,
  DEFAULT_REPORT_PATH,
  PIPELINE_VERSION,
  applyAutoBlock,
  applyFrontmatterField,
  blockHash,
  firstLine,
  fmtInt,
  loadTaxonomy,
  mergeFlagSpec,
  parseArgs,
  parseFrontmatter,
  readJson,
  relLabel,
  renderCardFile,
  resolveDirs,
  runCli,
  slugify,
  TaxonomyError,
  writeJsonAtomic,
  writeTextAtomic,
} from './ingest-common.mjs';
import { PIPELINE_PROMPTS, loadState, saveState } from './plan.mjs';
import { promptVersionString } from './deepseek.mjs';

export const MAX_DESCRIPTION_CHARS = 300;
// Provenance tag for blocks this stage derives itself. It is not a model, and
// labelling deterministic output with a model name would be a small lie in the
// one place — the card's own `generated:` block — a reviewer goes to check.
export const DETERMINISTIC_GEN = 'deterministic@write-cards@1';
export const MAX_CHILDREN = 30; // CI gate 6 (fan-out rule)

/* ------------------------------------------------------------- equations - */

/**
 * Normalise LaTeX for exact-duplicate detection. Deliberately conservative:
 * it removes layout, not content. Case is NEVER folded — in thermodynamics `S`
 * (entropy) and `s` (specific entropy) are different quantities.
 */
export function normalizeLatex(latex) {
  return String(latex ?? '')
    .replace(/\$+/g, '')
    .replace(/\\(?:left|right|displaystyle|textstyle|limits|!)\b/g, '')
    .replace(/\\(?:quad|qquad|,|;|:|\s)/g, ' ')
    .replace(/\\mathrm\{d\}/g, 'd')
    .replace(/\\mathrm\{([^{}]*)\}/g, '$1')
    .replace(/\\text\{([^{}]*)\}/g, '$1')
    .replace(/\{\s*([A-Za-z0-9])\s*\}/g, '$1')
    .replace(/\s+/g, '')
    .trim();
}

export function equationKey(latex) {
  return blockHash(normalizeLatex(latex));
}

/**
 * A deliberately looser key, used ONLY to raise a "these might be the same equation"
 * warning in the PR body. It additionally drops grouping delimiters, which is not a
 * safe basis for merging — `a(b+c)` and `ab+c` are different equations — so nothing
 * is ever merged on it. A human decides.
 *
 * What the strict key DOES catch: the same equation restated on eight slides with
 * different spacing, `$` wrapping, `\left`/`\right` sizing or `\mathrm{}`. What it
 * does NOT catch: algebraic rearrangement, renamed symbols, or optional parentheses.
 * That limit is intentional — an over-eager merge silently deletes an equation card.
 */
export function relaxedEquationKey(latex) {
  return blockHash(normalizeLatex(latex).replace(/[(){}[\]|]/g, ''));
}

/* --------------------------------------------------------------- symbols - */

/**
 * agent/knowledge-brain/symbols.md is hand-authored and AUTHORITATIVE. The pipeline may only
 * reference it, never add to it: the best published benchmark for auto-extracting
 * variable → meaning → units tops out around F1 0.49, and a wrong unit is exactly
 * the error a student trusts and carries into an exam.
 *
 * Parsing matches scripts/kb/validate.mjs gate 5 (first table column, `$`/backticks
 * stripped, case-sensitive) so the writer and the validator cannot disagree.
 */
export function parseSymbolTable(text) {
  const out = new Set();
  for (const line of String(text || '').replace(/\r\n?/g, '\n').split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map((c) => c.trim());
      const first = normalizeSymbol(cells[0]);
      if (first && !/^-+$/.test(first) && first.toLowerCase() !== 'symbol') out.add(first);
    } else {
      const m = trimmed.match(/^[-*+]\s+[`$]([^`$]+)[`$]/);
      if (m) {
        const sym = normalizeSymbol(m[1]);
        if (sym) out.add(sym);
      }
    }
  }
  return out;
}

export function normalizeSymbol(value) {
  if (typeof value !== 'string') return null;
  return value.trim().replace(/^sym:/, '').replace(/^[`$]+/, '').replace(/[`$]+$/, '').trim() || null;
}

/** `T_C` → `T`, `y_{fg}` → `y`, `\\bar{v}` → `\\bar{v}`. Subscripts index an instance of a quantity. */
export function baseSymbol(sym) {
  return String(sym || '')
    .replace(/[_^]\{[^{}]*\}$/, '')
    .replace(/[_^][A-Za-z0-9]$/, '')
    .trim();
}

/**
 * Keep only symbols that exist in the table. A subscripted instance (`T_C`) is
 * recorded as its base quantity (`T`) when that is in the table. Everything else is
 * DROPPED and listed in the PR body as a proposal — the same discipline classify
 * applies to topic ids. The pipeline never invents a symbol.
 */
export function filterSymbols(symbols, table) {
  const kept = [];
  const dropped = [];
  for (const raw of symbols || []) {
    const sym = normalizeSymbol(raw);
    if (!sym) continue;
    if (table.has(sym)) {
      if (!kept.includes(sym)) kept.push(sym);
      continue;
    }
    const base = baseSymbol(sym);
    if (base && base !== sym && table.has(base)) {
      if (!kept.includes(base)) kept.push(base);
      continue;
    }
    dropped.push(sym);
  }
  return { kept, dropped };
}

/* -------------------------------------------------------------- precedes - */

/**
 * Propose `precedes` edges from lecture order, then take the transitive reduction.
 *
 * Lecture order is a strong prior the prerequisite-extraction literature did not
 * have, and it is the only edge source here that is not a guess. Every pair
 * (a before b) is a candidate; reduction removes any edge implied by a path,
 * which for a strict lecture ordering leaves the consecutive chain.
 *
 * @param {Array<{id: string, lecture: number|null}>} topics
 * @returns {Array<[string,string]>}
 */
export function proposePrecedes(topics) {
  const withLecture = topics.filter((t) => Number.isFinite(t.lecture)).sort((a, b) => a.lecture - b.lecture || a.id.localeCompare(b.id));
  const edges = [];
  for (let i = 0; i < withLecture.length; i++) {
    for (let j = 0; j < withLecture.length; j++) {
      if (withLecture[i].lecture < withLecture[j].lecture) edges.push([withLecture[i].id, withLecture[j].id]);
    }
  }
  return transitiveReduction(edges);
}

export function transitiveReduction(edges) {
  const adj = new Map();
  for (const [u, v] of edges) {
    if (!adj.has(u)) adj.set(u, new Set());
    adj.get(u).add(v);
  }
  const reachableExcluding = (start, skipTo) => {
    const seen = new Set();
    const stack = [...(adj.get(start) || [])].filter((n) => n !== skipTo);
    while (stack.length) {
      const n = stack.pop();
      if (seen.has(n)) continue;
      seen.add(n);
      for (const m of adj.get(n) || []) stack.push(m);
    }
    return seen;
  };
  const kept = [];
  for (const [u, v] of edges) {
    if (!reachableExcluding(u, v).has(v)) kept.push([u, v]);
  }
  return kept;
}

/* ---------------------------------------------------------------- source - */

function sourceRef(fileType, path_, pages) {
  const list = [...new Set(pages.filter((p) => Number.isInteger(p) && p > 0))].sort((a, b) => a - b);
  const ref = { path: path_ };
  if (list.length) ref[fileType === 'pptx' ? 'slides' : 'pages'] = list;
  return ref;
}

function mergeSources(rows) {
  const byPath = new Map();
  for (const row of rows) {
    if (!row?.file) continue;
    const entry = byPath.get(row.file) || { file: row.file, type: row.fileType, pages: [] };
    for (let p = row.page; p && row.endPage && p <= row.endPage; p++) entry.pages.push(p);
    if (row.page && !row.endPage) entry.pages.push(row.page);
    byPath.set(row.file, entry);
  }
  return [...byPath.values()].map((e) => sourceRef(e.type, e.file, e.pages));
}

/* ----------------------------------------------------------------- cards - */

function cardPath(kbDir, kind, slug) {
  return path.join(kbDir, CARD_DIR_BY_KIND[kind], `${slug}.md`);
}

async function readCard(file) {
  let raw;
  try {
    raw = await fsp.readFile(file, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return { exists: false, raw: '', frontmatter: {}, body: '' };
    throw e;
  }
  try {
    const { frontmatter, body } = parseFrontmatter(raw);
    return { exists: true, raw, frontmatter, body };
  } catch (e) {
    // A card a human broke (an unquoted colon typed in the GitHub web editor is the
    // usual cause) must not abort the whole run, and must certainly not be
    // overwritten — we cannot tell what was in it. Report it and leave it alone.
    return { exists: true, raw, frontmatter: {}, body: '', parseError: e.message.split('\n')[0] };
  }
}

function uniqueIds(list) {
  return [...new Set((list || []).filter(Boolean))];
}

const GENERATED_NOTE =
  '<!-- Drafted by scripts/kb/write-cards.mjs from the course files, then reviewed by a human in a PR.\n' +
  '     Anything inside a kb:auto block is regenerated; edit it and the hash stops matching, which tells\n' +
  '     the writer to leave your text alone. Delete the markers to pin the text forever.\n' +
  '     `prerequisites` and symbol meanings are NOT auto-generated — they are yours to fill in. -->';

/**
 * Build one card, apply the no-clobber rules against whatever is on disk, and
 * return the text to write plus a per-field outcome map.
 */
async function buildCard({ kbDir, kind, id, slug, frontmatterFields, blocks, gen, state, sourceSha256, managedFields = ['description'] }) {
  const file = cardPath(kbDir, kind, slug);
  const existing = await readCard(file);
  const previous = state.cards?.[id] || null;
  const outcomes = [];
  const skipped = [];

  const sourcePaths = (frontmatterFields.sources || []).map((s) => s?.path).filter(Boolean);
  if (existing.parseError) {
    return {
      id, kind, file, text: existing.raw, changed: false, created: false,
      outcome: 'unparseable', status: 'unknown', outcomes: [],
      skipped: [{ field: '*', reason: `card frontmatter is not valid YAML (${existing.parseError}) — left untouched` }],
      sourceSha256, sourcePaths, fields: previous?.fields || [],
    };
  }
  const status = existing.exists ? String(existing.frontmatter.status || 'auto') : 'auto';
  // Reviewed cards are never rewritten. If their source moved they go stale instead.
  if (existing.exists && (status === 'reviewed' || status === 'instructor-verified')) {
    const priorSha = previous?.source_sha256 ?? null;
    const moved = sourceSha256 && priorSha && priorSha !== sourceSha256;
    let text = existing.raw;
    if (moved && existing.frontmatter.stale !== true) {
      const fm = { ...existing.frontmatter, stale: true };
      text = renderCardFile(fm, existing.body);
    }
    return {
      id,
      kind,
      file,
      text,
      changed: text !== existing.raw,
      created: false,
      outcome: moved ? 'stale' : 'protected-reviewed',
      status,
      outcomes,
      skipped: [{ field: '*', reason: `card is status: ${status} — never rewritten` }],
      sourceSha256,
      sourcePaths,
      // Keep the recorded field list. Dropping it would make the next run think the
      // pipeline had never written these fields, so a deleted marker would stop
      // counting as "pinned by a human".
      fields: previous?.fields || [],
    };
  }

  let frontmatter = existing.exists ? { ...existing.frontmatter } : {};
  frontmatter.id = id;
  frontmatter.kind = kind;
  for (const [field, value] of Object.entries(frontmatterFields)) {
    if (value === undefined) continue;
    if (!managedFields.includes(field)) {
      // Derived fields — link arrays, and any title that comes from the
      // hand-authored taxonomy rather than from a model — are rebuilt every run, so
      // a re-ingest can never leave a dangling reference or a stale taxonomy title
      // behind. Only fields a model actually wrote get the no-clobber treatment.
      frontmatter[field] = value;
      continue;
    }
    const res = applyFrontmatterField(frontmatter, field, value, { previouslyWritten: Boolean(previous?.fields?.includes(field)) });
    frontmatter = res.frontmatter;
    outcomes.push({ field, outcome: res.outcome });
    if (res.outcome === AUTO_BLOCK_OUTCOME.SKIPPED_HUMAN_EDITED || res.outcome === AUTO_BLOCK_OUTCOME.SKIPPED_PINNED) {
      skipped.push({ field, reason: res.outcome, proposal: firstLine(String(res.proposal ?? ''), 200) });
    }
  }
  frontmatter.status = status;
  if (!frontmatter.audience) frontmatter.audience = 'both';
  if (frontmatter.stale === true && sourceSha256 && previous?.source_sha256 === sourceSha256) delete frontmatter.stale;

  let body = existing.exists ? existing.body : `${GENERATED_NOTE}\n`;
  for (const block of blocks) {
    if (block.content === undefined || block.content === null) continue;
    const res = applyAutoBlock(body, block.field, block.content, gen, {
      previouslyWritten: Boolean(previous?.fields?.includes(block.field)),
      anchor: block.heading,
    });
    body = res.body;
    outcomes.push({ field: block.field, outcome: res.outcome });
    if (res.outcome === AUTO_BLOCK_OUTCOME.SKIPPED_HUMAN_EDITED || res.outcome === AUTO_BLOCK_OUTCOME.SKIPPED_PINNED) {
      skipped.push({ field: block.field, reason: res.outcome, proposal: firstLine(String(res.proposal ?? ''), 200) });
    }
  }

  const keepAt = existing.exists ? existing.frontmatter?.generated?.at : null;
  frontmatter.generated = {
    ...(frontmatter.generated || {}),
    model: gen.split('@')[0],
    prompt_version: gen.split('@').slice(1).join('@'),
    at: keepAt || new Date().toISOString(),
  };
  let text = renderCardFile(orderFrontmatter(frontmatter), body);
  if (existing.exists && text !== existing.raw) {
    // Something really changed, so the timestamp moves. Otherwise it stays put and
    // a no-op re-run produces a zero-line diff.
    frontmatter.generated.at = new Date().toISOString();
    text = renderCardFile(orderFrontmatter(frontmatter), body);
  }

  return {
    id,
    kind,
    file,
    text,
    changed: text !== existing.raw,
    created: !existing.exists,
    outcome: !existing.exists ? 'created' : text !== existing.raw ? 'updated' : 'unchanged',
    status,
    outcomes,
    skipped,
    sourceSha256,
    sourcePaths,
    fields: [...Object.keys(frontmatterFields).filter((f) => managedFields.includes(f)), ...blocks.map((b) => b.field)],
  };
}

const FRONTMATTER_ORDER = [
  'id', 'kind', 'title', 'description', 'unit', 'parent', 'lecture', 'section',
  'prerequisites', 'precedes', 'objectives', 'equations', 'symbols', 'misconceptions',
  'examples', 'items', 'topics', 'requires_objectives', 'derives_from', 'specializes_to',
  'valid_when', 'invalid_when', 'sources', 'status', 'audience', 'priority', 'stale',
  'validation', 'generated',
];

function orderFrontmatter(fm) {
  const out = {};
  for (const key of FRONTMATTER_ORDER) if (fm[key] !== undefined) out[key] = fm[key];
  for (const key of Object.keys(fm)) if (out[key] === undefined && fm[key] !== undefined) out[key] = fm[key];
  return out;
}

/* ------------------------------------------------------------------ main - */

export async function writeCards({
  kbDir,
  segments,
  classified,
  entities,
  taxonomy,
  state,
  gen,
  writeUnits = false,
  promptVersion = '',
}) {
  const report = {
    version: 1,
    builtAt: new Date().toISOString(),
    pipeline_version: PIPELINE_VERSION,
    prompt_version: promptVersion,
    gen,
    cards: { added: [], changed: [], unchanged: [], skippedHumanEdited: [], protectedReviewed: [], stale: [], unparseable: [] },
    equations: { extracted: 0, unique: 0, merged: [] },
    precedes: [],
    confidences: [],
    unassignedSections: classified.unassigned || [],
    lowConfidenceSections: classified.lowConfidence || [],
    proposedTopics: classified.proposedTopics || [],
    warnings: [],
    notes: [],
  };

  const segmentsByPath = new Map(segments.files.map((f) => [f.path, f]));
  let symbolTable = new Set();
  try {
    symbolTable = parseSymbolTable(await fsp.readFile(path.join(kbDir, 'symbols.md'), 'utf8'));
  } catch {
    report.warnings.push('agent/knowledge-brain/symbols.md is missing; every extracted symbol was dropped (CI gate 5 requires the table).');
  }
  const proposedSymbols = new Map();
  const cards = [];
  state.cards = state.cards || {};
  state.registry = state.registry || { equations: {}, examples: {}, objectives: {} };
  // Added after the registry shape was already on disk in state.json, so it is filled in rather
  // than assumed: an older state file has no `items` key and must not crash the writer.
  state.registry.items = state.registry.items || {};

  /* ---- equations: dedupe across topics by normalised LaTeX --------------- */

  const equationByKey = new Map();
  for (const topic of entities.topics) {
    for (const eq of topic.equations) {
      report.equations.extracted++;
      const key = equationKey(eq.latex);
      const existing = equationByKey.get(key);
      const rows = eq.sections
        .map((si) => topic.sections.find((s) => s.section === si))
        .filter(Boolean);
      if (!existing) {
        equationByKey.set(key, {
          key,
          latex: eq.latex,
          name: eq.name,
          plain: eq.plain,
          symbols: uniqueIds(eq.symbols),
          valid_when: uniqueIds(eq.valid_when),
          invalid_when: uniqueIds(eq.invalid_when),
          topics: [topic.topic_id],
          rows,
          names: [eq.name],
        });
        continue;
      }
      existing.symbols = uniqueIds([...existing.symbols, ...eq.symbols]);
      existing.valid_when = uniqueIds([...existing.valid_when, ...eq.valid_when]);
      existing.invalid_when = uniqueIds([...existing.invalid_when, ...eq.invalid_when]);
      existing.topics = uniqueIds([...existing.topics, topic.topic_id]);
      existing.rows.push(...rows);
      existing.names.push(eq.name);
      if (!existing.plain && eq.plain) existing.plain = eq.plain;
      report.equations.merged.push({ latex: eq.latex, mergedInto: existing.name, fromTopic: topic.topic_id });
    }
  }
  report.equations.unique = equationByKey.size;

  // Near-duplicate warning. Not a merge: two equations that survive the strict key
  // but collide on the relaxed one are flagged for a human to look at.
  const byRelaxed = new Map();
  for (const eq of equationByKey.values()) {
    const rk = relaxedEquationKey(eq.latex);
    if (!byRelaxed.has(rk)) byRelaxed.set(rk, []);
    byRelaxed.get(rk).push(eq);
  }
  report.equations.possibleDuplicates = [...byRelaxed.values()]
    .filter((group) => group.length > 1)
    .map((group) => ({
      note: 'these differ only by grouping delimiters; the writer did NOT merge them — check whether they are the same equation',
      equations: group.map((e) => ({ name: e.name, latex: e.latex, topics: e.topics })),
    }));

  // Stable ids: minted once per normalised-LaTeX hash and then reused for ever, so
  // renaming an equation does not orphan its card.
  const usedEquationSlugs = new Set(Object.values(state.registry.equations));
  for (const eq of equationByKey.values()) {
    let id = state.registry.equations[eq.key];
    if (!id) {
      const base = `eq:${slugify(eq.name, { max: 52 })}`;
      id = base;
      let n = 2;
      while (usedEquationSlugs.has(id)) id = `${base}-${n++}`;
      state.registry.equations[eq.key] = id;
    }
    usedEquationSlugs.add(id);
    eq.id = id;
  }

  const equationIdsByTopic = new Map();
  for (const eq of equationByKey.values()) {
    for (const t of eq.topics) {
      if (!equationIdsByTopic.has(t)) equationIdsByTopic.set(t, []);
      equationIdsByTopic.get(t).push(eq.id);
    }
  }

  /* ---- worked examples --------------------------------------------------- */

  const examples = [];
  const usedExampleIds = new Set(Object.values(state.registry.examples));
  for (const topic of entities.topics) {
    for (const ex of topic.examples) {
      const key = blockHash(`${topic.topic_id}|${ex.title}`);
      let id = state.registry.examples[key];
      if (!id) {
        const base = `ex:${slugify(ex.title, { max: 52 })}`;
        id = base;
        let n = 2;
        while (usedExampleIds.has(id)) id = `${base}-${n++}`;
        state.registry.examples[key] = id;
      }
      usedExampleIds.add(id);
      const rows = ex.sections.map((si) => topic.sections.find((s) => s.section === si)).filter(Boolean);
      examples.push({ ...ex, id, topic: topic.topic_id, unit: topic.unit, rows: rows.length ? rows : topic.sections });
    }
  }
  const exampleIdsByTopic = new Map();
  for (const ex of examples) {
    if (!exampleIdsByTopic.has(ex.topic)) exampleIdsByTopic.set(ex.topic, []);
    exampleIdsByTopic.get(ex.topic).push(ex.id);
  }

  /* ---- practice items ---------------------------------------------------- */
  //
  // The mirror image of a worked example: a problem the source POSES and does not solve. A
  // problem set or an exam paper is made of nothing else, so before this existed those files
  // ran the whole pipeline and produced no `item:` card at all.

  const items = [];
  const usedItemIds = new Set(Object.values(state.registry.items));
  for (const topic of entities.topics) {
    for (const item of topic.items || []) {
      const key = blockHash(`${topic.topic_id}|${item.title}`);
      let id = state.registry.items[key];
      if (!id) {
        const base = `item:${slugify(item.title, { max: 52 })}`;
        id = base;
        let n = 2;
        while (usedItemIds.has(id)) id = `${base}-${n++}`;
        state.registry.items[key] = id;
      }
      usedItemIds.add(id);
      const rows = item.sections.map((si) => topic.sections.find((s) => s.section === si)).filter(Boolean);
      items.push({ ...item, id, topic: topic.topic_id, unit: topic.unit, rows: rows.length ? rows : topic.sections });
    }
  }
  const itemIdsByTopic = new Map();
  for (const item of items) {
    if (!itemIdsByTopic.has(item.topic)) itemIdsByTopic.set(item.topic, []);
    itemIdsByTopic.get(item.topic).push(item.id);
  }

  /* ---- precedes ---------------------------------------------------------- */

  // Which topic cards will actually exist after this run: the ones we are writing
  // now, plus the ones already committed from an earlier (incremental) run. A link
  // to anything else would dangle, which CI gate 3 treats as a hard failure — and
  // which would hand the model a card id that resolves to nothing.
  const resolvableTopics = new Set(entities.topics.filter((t) => !t.failed).map((t) => t.topic_id));
  try {
    for (const name of await fsp.readdir(path.join(kbDir, 'topics'))) {
      if (name.endsWith('.md')) resolvableTopics.add(`topic:${name.replace(/\.md$/, '')}`);
    }
  } catch {}

  const topicMeta = entities.topics.filter((t) => !t.failed).map((t) => ({ id: t.topic_id, lecture: t.lecture }));
  const edges = proposePrecedes(topicMeta).filter(([a, b]) => resolvableTopics.has(a) && resolvableTopics.has(b));
  const precedesByTopic = new Map();
  for (const [a, b] of edges) {
    if (!precedesByTopic.has(a)) precedesByTopic.set(a, []);
    precedesByTopic.get(a).push(b);
  }
  report.precedes = edges.map(([from, to]) => ({ from, to, basis: 'lecture order (transitively reduced)' }));

  /* ---- topic cards ------------------------------------------------------- */

  for (const topic of entities.topics) {
    if (topic.failed) {
      report.warnings.push(`${topic.topic_id}: entity extraction failed; no topic card was written`);
      continue;
    }
    const meta = taxonomy.byTopicId.get(topic.topic_id);
    const slug = topic.topic_id.replace(/^topic:/, '');
    const confidences = topic.sections.map((s) => s.confidence);
    const meanConfidence = confidences.length ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0;
    report.confidences.push({
      id: topic.topic_id,
      sections: topic.sections.length,
      meanConfidence: Math.round(meanConfidence * 100) / 100,
      minConfidence: confidences.length ? Math.min(...confidences) : 0,
    });

    // Stable #oN ids, minted per objective text so a reordered list keeps its ids.
    state.registry.objectives[topic.topic_id] = state.registry.objectives[topic.topic_id] || {};
    const objRegistry = state.registry.objectives[topic.topic_id];
    // The id form is `#oN` — that is what CI gate 1 enforces and what an
    // assessment item's `requires_objectives: [topic:t12-…#o2]` resolves against.
    let nextObjective = Object.values(objRegistry).reduce((n, v) => Math.max(n, Number(String(v).replace(/^#?o/, '')) || 0), 0);
    const objectives = topic.objectives.map((o) => {
      const key = blockHash(o.text);
      if (!objRegistry[key]) objRegistry[key] = `#o${++nextObjective}`;
      // Registries written before the #-prefix was adopted are upgraded in place,
      // which keeps a card's objective ids stable across the change.
      if (!objRegistry[key].startsWith('#')) objRegistry[key] = `#${objRegistry[key]}`;
      return { id: objRegistry[key], text: o.text, kc_type: o.kc_type, bloom: o.bloom ?? null };
    });

    const eqIds = uniqueIds(equationIdsByTopic.get(topic.topic_id));
    const exIds = uniqueIds(exampleIdsByTopic.get(topic.topic_id));
    const itemIds = uniqueIds(itemIdsByTopic.get(topic.topic_id));
    if (eqIds.length > MAX_CHILDREN) {
      report.warnings.push(`${topic.topic_id} links ${eqIds.length} equations, over the ${MAX_CHILDREN}-child fan-out rule (CI gate 6)`);
    }

    // Prefer the model's explicit one-liner. Falling back to the first SENTENCE of
    // the summary (not its first 300 characters) keeps the description a sentence
    // rather than a truncated paragraph ending in an ellipsis.
    const firstSentence = (topic.summary || '').split(/(?<=[.!?])\s+/)[0] || '';
    const description = firstLine(
      topic.description || firstSentence || meta?.description || meta?.title || topic.topic_id,
      MAX_DESCRIPTION_CHARS
    );
    const sources = mergeSources(topic.sections);
    const sourceSha = blockHash(uniqueIds(topic.sections.map((s) => segmentsByPath.get(s.file)?.sha256 || '')).sort().join('|'));

    const objectivesBody = objectives.length
      ? objectives.map((o) => `- **${o.id}** (${o.kc_type}${o.bloom ? ` · ${o.bloom}` : ' · bloom not assigned'}) ${o.text}`).join('\n')
      : '_No objectives were extracted from the sections assigned to this topic._';
    const wrongMoves = topic.misconceptions.length
      ? topic.misconceptions.map((m) => `- ${m}`).join('\n')
      : '_No misconception card matched these sections. Misconception cards are hand-authored; the pipeline only links to ones that already exist._';

    cards.push(
      await buildCard({
        kbDir,
        kind: 'topic',
        id: topic.topic_id,
        slug,
        gen,
        state,
        sourceSha256: sourceSha,
        frontmatterFields: {
          title: meta?.title || topic.topic_id,
          description,
          unit: topic.unit || null,
          parent: topic.unit || null,
          lecture: topic.lecture ?? null,
          // The frozen vocabulary spells the textbook reference `section`, not `reading`.
          section: meta?.reading ?? null,
          prerequisites: [],
          precedes: uniqueIds(precedesByTopic.get(topic.topic_id)),
          objectives,
          equations: eqIds,
          misconceptions: uniqueIds(topic.misconceptions),
          examples: exIds,
          items: itemIds,
          sources,
          priority: 2,
          validation: 'none (no student response data)',
        },
        blocks: [
          { field: 'summary', heading: 'What this covers', content: topic.summary || '_No summary was extracted._' },
          { field: 'objectives_body', heading: 'Objectives', content: objectivesBody },
          { field: 'wrong_moves', heading: 'Common wrong moves', content: wrongMoves },
        ],
      })
    );
  }

  /* ---- equation cards ---------------------------------------------------- */

  for (const eq of equationByKey.values()) {
    const slug = eq.id.replace(/^eq:/, '');
    const { kept, dropped } = filterSymbols(eq.symbols, symbolTable);
    for (const d of dropped) {
      const row = proposedSymbols.get(d) || { symbol: d, equations: [] };
      row.equations.push(eq.id);
      proposedSymbols.set(d, row);
    }
    eq.symbols = kept;
    const sources = mergeSources(eq.rows);
    if (!sources.length) {
      report.warnings.push(`${eq.id} has no source reference; CI gate 8 requires at least one. Skipped.`);
      continue;
    }
    const validWhen = eq.valid_when.length
      ? eq.valid_when.map((v) => `- \`${v}\``).join('\n')
      : '_The source text did not state the assumptions explicitly, so none were recorded._';
    const body =
      `\`\`\`latex\n${eq.latex}\n\`\`\`\n\n` +
      `${eq.plain || '_No plain-language statement was extracted._'}\n\n` +
      `**Holds when** (auto-extracted, NOT checked by an instructor — do not rely on this on an exam):\n${validWhen}\n` +
      (eq.invalid_when.length ? `\n**Does not hold when:**\n${eq.invalid_when.map((v) => `- \`${v}\``).join('\n')}\n` : '') +
      `\n**Symbols:** ${eq.symbols.length ? eq.symbols.map((s) => `\`${s}\``).join(', ') : '_none recorded_'} ` +
      `— meanings live in \`agent/knowledge-brain/symbols.md\`, which is hand-authored and authoritative.\n`;

    cards.push(
      await buildCard({
        kbDir,
        kind: 'equation',
        managedFields: ['description', 'title'],
        id: eq.id,
        slug,
        gen,
        state,
        sourceSha256: blockHash(eq.latex),
        frontmatterFields: {
          title: eq.name,
          description: firstLine(eq.plain || eq.name, MAX_DESCRIPTION_CHARS),
          parent: eq.topics[0] || null,
          unit: entities.topics.find((t) => t.topic_id === eq.topics[0])?.unit ?? null,
          symbols: eq.symbols,
          valid_when: eq.valid_when,
          invalid_when: eq.invalid_when,
          derives_from: null,
          specializes_to: [],
          sources,
          priority: 2,
        },
        blocks: [{ field: 'equation_body', heading: 'Equation', content: body }],
      })
    );
  }

  /* ---- worked-example cards --------------------------------------------- */

  const SIX_FIELDS = [
    ['known', 'KNOWN'],
    ['find', 'FIND'],
    ['sketch', 'SKETCH'],
    ['assumptions', 'ASSUMPTIONS'],
    ['analysis', 'ANALYSIS'],
    ['sanity_check', 'SANITY CHECK'],
  ];
  for (const ex of examples) {
    const slug = ex.id.replace(/^ex:/, '');
    const sources = mergeSources(ex.rows);
    if (!sources.length) {
      report.warnings.push(`${ex.id} has no source reference; CI gate 8 requires at least one. Skipped.`);
      continue;
    }
    const body = SIX_FIELDS.map(([key, label]) =>
      `### ${label}\n\n${ex[key] ? ex[key] : '_Not present in the source. Not invented._'}`
    ).join('\n\n');
    cards.push(
      await buildCard({
        kbDir,
        kind: 'example',
        managedFields: ['description', 'title'],
        id: ex.id,
        slug,
        gen,
        state,
        sourceSha256: blockHash(`${ex.title}|${ex.analysis}`),
        frontmatterFields: {
          title: ex.title,
          description: firstLine(ex.find || ex.title, MAX_DESCRIPTION_CHARS),
          parent: ex.topic,
          unit: ex.unit ?? null,
          equations: uniqueIds(equationIdsByTopic.get(ex.topic)),
          sources,
          priority: 3,
        },
        blocks: [{ field: 'worked_example', heading: 'Worked example', content: body }],
      })
    );
  }

  /* ---- practice-item cards ----------------------------------------------- */
  //
  // An item card is a QUESTION, not an answer. `answer` is written only when the source states
  // one; the pipeline never computes it, because a confidently wrong worked answer on a practice
  // problem is the failure mode this project cannot afford. The card says so in its own body so
  // the model cannot mistake an empty answer for "no answer exists".

  for (const item of items) {
    const slug = item.id.replace(/^item:/, '');
    const sources = mergeSources(item.rows);
    if (!sources.length) {
      report.warnings.push(`${item.id} has no source reference; CI gate 8 requires at least one. Skipped.`);
      continue;
    }
    const parts = [`### PROMPT\n\n${item.prompt}`];
    if (item.given) parts.push(`### GIVEN\n\n${item.given}`);
    if (item.find) parts.push(`### FIND\n\n${item.find}`);
    parts.push(
      item.answer
        ? `### ANSWER (as stated by the source)\n\n${item.answer}`
        : '### ANSWER\n\n_The source does not give one, and the pipeline does not compute one. Work it through ' +
          'with the student; do not present a number from this card as the answer key._'
    );
    parts.push(
      '_This is a practice item: a problem posed by the course material, not a solution. Use the ' +
        'six-part KNOWN / FIND / SKETCH / ASSUMPTIONS / ANALYSIS / SANITY CHECK format when working it._'
    );
    cards.push(
      await buildCard({
        kbDir,
        kind: 'item',
        managedFields: ['description', 'title'],
        id: item.id,
        slug,
        gen,
        state,
        sourceSha256: blockHash(`${item.title}|${item.prompt}`),
        frontmatterFields: {
          title: item.title,
          description: firstLine(item.find || item.title, MAX_DESCRIPTION_CHARS),
          parent: item.topic,
          unit: item.unit ?? null,
          equations: uniqueIds(equationIdsByTopic.get(item.topic)),
          sources,
          priority: 4,
        },
        blocks: [{ field: 'practice_item', heading: 'Practice item', content: parts.join('\n\n') }],
      })
    );
  }

  /* ---- source cards ------------------------------------------------------ */

  const topicsByFile = new Map();
  for (const row of classified.sections) {
    if (row.topic_id === 'unassigned') continue;
    if (!topicsByFile.has(row.file)) topicsByFile.set(row.file, new Set());
    topicsByFile.get(row.file).add(row.topic_id);
  }
  for (const file of segments.files) {
    // `lectures/lec27-entropy.pptx` → `src:lectures-lec27-entropy-pptx`.
    // Hyphens only: CI gate 1's id pattern forbids the `__` that lib/kb.js's
    // fileSlug() uses for CONTEXT filenames. Card ids and card filenames stay 1:1.
    const idSlug = slugify(file.path.replace(/\//g, '-'), { max: 70 });
    const id = `src:${idSlug}`;
    const unit = file.type === 'pptx' ? 'slides' : 'pages';
    const allTopicIds = uniqueIds([...(topicsByFile.get(file.path) || [])]).sort();
    const topicIds = allTopicIds.filter((t) => resolvableTopics.has(t));
    for (const missing of allTopicIds.filter((t) => !resolvableTopics.has(t))) {
      report.warnings.push(`${file.path}: sections were classified as ${missing}, but that topic has no card (extraction failed), so the source card does not link to it`);
    }
    const topicTitles = topicIds.map((t) => taxonomy.byTopicId.get(t)?.title || t);
    const outline = file.outline
      .slice(0, 80)
      .map((s) => `- ${s.page ? `[${unit === 'slides' ? 'slide' : 'page'} ${s.page}] ` : ''}§${s.index} ${s.title}`)
      .join('\n');
    cards.push(
      await buildCard({
        kbDir,
        kind: 'source',
        id,
        slug: idSlug,
        gen: DETERMINISTIC_GEN,
        state,
        sourceSha256: file.sha256,
        frontmatterFields: {
          title: file.path,
          // Distinctive by construction. A formulaic "PPTX, 6 slides, 6 sections"
          // description makes every source card a near-duplicate of every other, and
          // the model routes on exactly these one-liners (CI gate 9 warns about it).
          // Naming the file and what is actually in it is what makes them separable.
          description: firstLine(
            `${file.path} — ${file.type}${file.pages ? `, ${file.pages} ${unit}` : ''}. ` +
              (topicTitles.length
                ? `Covers ${topicTitles.slice(0, 4).join('; ')}${topicTitles.length > 4 ? `; +${topicTitles.length - 4} more` : ''}.`
                : `No topic has been assigned to it yet.`),
            MAX_DESCRIPTION_CHARS
          ),
          topics: topicIds,
          sources: [{ path: file.path }],
          priority: 4,
          audience: 'model',
        },
        blocks: [
          {
            field: 'source_outline',
            heading: 'Outline',
            content:
              `\`${file.path}\` — ${file.type}, ${file.pages ?? '—'} ${unit}, ${file.chunkCount} chunks ` +
              `(sha256 \`${file.sha256.slice(0, 16)}…\`).\n\n${outline || '_No sections._'}`,
          },
        ],
      })
    );
  }

  /* ---- unit cards (opt-in) ---------------------------------------------- */

  if (writeUnits) {
    for (const unit of taxonomy.units) {
      const topicIds = taxonomy.topics.filter((t) => t.unit === unit.id).map((t) => t.id);
      const covered = topicIds.filter((t) => entities.topics.some((e) => e.topic_id === t && !e.failed));
      if (!covered.length) continue;
      const eqIds = uniqueIds(covered.flatMap((t) => equationIdsByTopic.get(t) || []));
      const exIds = uniqueIds(covered.flatMap((t) => exampleIdsByTopic.get(t) || []));
      const itemIds = uniqueIds(covered.flatMap((t) => itemIdsByTopic.get(t) || []));
      const sources = mergeSources(classified.sections.filter((s) => covered.includes(s.topic_id)));
      if (topicIds.length > MAX_CHILDREN) report.warnings.push(`${unit.id} has ${topicIds.length} topics, over the ${MAX_CHILDREN}-child fan-out rule`);
      cards.push(
        await buildCard({
          kbDir,
          kind: 'unit',
          id: unit.id,
          slug: unit.id.replace(/^unit:/, ''),
          gen: DETERMINISTIC_GEN,
          state,
          sourceSha256: blockHash(covered.join('|')),
          frontmatterFields: {
            title: unit.title,
            description: firstLine(unit.description || `${unit.title}.${unit.lectures ? ` Lectures ${unit.lectures}.` : ''}${unit.exam ? ` Exam ${unit.exam}.` : ''}`, MAX_DESCRIPTION_CHARS),
            parent: 'course:me300',
            topics: topicIds,
            equations: eqIds,
            examples: exIds,
            items: itemIds,
            sources,
            priority: 1,
          },
          blocks: [
            {
              field: 'unit_children',
              heading: 'What is in this unit',
              content:
                topicIds
                  .map((t) => {
                    const meta = taxonomy.byTopicId.get(t);
                    const done = covered.includes(t);
                    return `- \`${t}\` — ${meta?.title || t}${meta?.lecture ? ` (lecture ${meta.lecture})` : ''}${done ? '' : ' _(no course material ingested for this topic yet)_'}`;
                  })
                  .join('\n') || '_No topics._',
            },
          ],
        })
      );
    }
  } else {
    report.notes.push('Unit and course cards were not touched (pass --write-units to let the pipeline draft unit cards). They are the always-resident L0 surface and belong to a human.');
  }

  report.notes.push('`prerequisites[]` is left empty on every card on purpose: auto-extracted prerequisite edges run around 46% precision in the published work, so they are a human job.');
  report.proposedSymbols = [...proposedSymbols.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
  report.notes.push('Symbol meanings are never auto-extracted. `agent/knowledge-brain/symbols.md` is hand-authored and authoritative; cards only reference it.');
  report.notes.push('Every `valid_when` on a `status: auto` card is unverified. The card body says so and the tool layer must pass that on.');

  for (const card of cards) {
    const row = {
      id: card.id,
      kind: card.kind,
      file: relLabel(card.file),
      status: card.status,
      skipped: card.skipped,
    };
    if (card.outcome === 'created') report.cards.added.push(row);
    else if (card.outcome === 'updated') report.cards.changed.push(row);
    else if (card.outcome === 'unchanged') report.cards.unchanged.push(row);
    else if (card.outcome === 'protected-reviewed') report.cards.protectedReviewed.push(row);
    else if (card.outcome === 'stale') report.cards.stale.push(row);
    else if (card.outcome === 'unparseable') {
      report.cards.unparseable.push(row);
      report.warnings.push(`${card.id}: ${relLabel(card.file)} has unparseable frontmatter and was left untouched — fix it by hand`);
    }
    if (card.skipped.length && card.outcome !== 'protected-reviewed') report.cards.skippedHumanEdited.push(row);
  }

  return { cards, report };
}

export function reportMarkdown(report) {
  const lines = ['## Kelvin AI — knowledge base update', ''];
  lines.push(
    `${report.cards.added.length} card(s) added, ${report.cards.changed.length} changed, ${report.cards.unchanged.length} unchanged, ` +
      `${report.cards.skippedHumanEdited.length} left alone because a human edited them, ${report.cards.protectedReviewed.length} protected (reviewed), ` +
      `${report.cards.stale.length} marked stale.`
  );
  lines.push('');
  const rows = [...report.cards.added.map((r) => ({ ...r, what: 'added' })), ...report.cards.changed.map((r) => ({ ...r, what: 'changed' }))];
  if (rows.length) {
    const conf = new Map(report.confidences.map((c) => [c.id, c]));
    lines.push('| card | kind | change | mean confidence | status |', '|---|---|---|---:|---|');
    for (const r of rows.slice(0, 200)) {
      const c = conf.get(r.id);
      lines.push(`| \`${r.id}\` | ${r.kind} | ${r.what} | ${c ? c.meanConfidence.toFixed(2) : '—'} | ${r.status} |`);
    }
    if (rows.length > 200) lines.push(`| … ${rows.length - 200} more | | | | |`);
    lines.push('');
  }
  if (report.cards.skippedHumanEdited.length) {
    lines.push('### Left alone (a human edited these)', '');
    for (const r of report.cards.skippedHumanEdited) {
      for (const s of r.skipped) lines.push(`- \`${r.id}\` field \`${s.field}\` (${s.reason}). Proposal: ${s.proposal || '—'}`);
    }
    lines.push('');
  }
  if (report.lowConfidenceSections.length) {
    lines.push('### Low-confidence classifications (check these first)', '');
    for (const s of report.lowConfidenceSections.slice(0, 50)) lines.push(`- \`${s.topic_id}\` ← ${s.file} §${s.section} (confidence ${s.confidence})`);
    lines.push('');
  }
  if (report.unassignedSections.length) {
    lines.push('### Unassigned sections', '');
    for (const s of report.unassignedSections.slice(0, 50)) lines.push(`- ${s.file} §${s.section} "${s.title}"${s.proposed_topic ? ` — would have wanted: _${s.proposed_topic}_` : ''}`);
    lines.push('');
  }
  if (report.proposedTopics.length) {
    lines.push('### Proposed new topics (the taxonomy is hand-authored — add them there or leave them unassigned)', '');
    for (const p of report.proposedTopics) lines.push(`- **${p.title}** — ${p.sections.length} section(s): ${p.sections.slice(0, 5).join(', ')}`);
    lines.push('');
  }
  if (report.equations.merged.length) {
    lines.push(`### Duplicate equations merged: ${report.equations.merged.length} (${report.equations.extracted} extracted → ${report.equations.unique} unique)`, '');
  }
  if (report.equations.possibleDuplicates?.length) {
    lines.push('### Possible duplicate equations — NOT merged, please check', '');
    for (const group of report.equations.possibleDuplicates) {
      lines.push(`- ${group.equations.map((e) => `\`${e.latex}\` (${e.name})`).join(' **vs** ')}`);
    }
    lines.push('');
  }
  if (report.proposedSymbols?.length) {
    lines.push('### Symbols dropped because they are not in `agent/knowledge-brain/symbols.md`', '');
    lines.push('That file is hand-authored and authoritative. Add a row for any of these that is real, then re-run.', '');
    for (const p of report.proposedSymbols) lines.push(`- \`${p.symbol}\` — wanted by ${p.equations.join(', ')}`);
    lines.push('');
  }
  if (report.warnings.length) {
    lines.push('### Warnings', '');
    for (const w of report.warnings) lines.push(`- ${w}`);
    lines.push('');
  }
  if (report.notes.length) {
    lines.push('### What this pipeline deliberately does not do', '');
    for (const n of report.notes) lines.push(`- ${n}`);
    lines.push('');
  }
  return lines.join('\n');
}

const FLAGS = mergeFlagSpec(BASE_FLAGS, {
  flags: { segments: 'string', classified: 'string', entities: 'string', report: 'string', summary: 'string' },
  booleans: ['write-units'],
});

const USAGE = `Usage: node scripts/kb/write-cards.mjs [options]

Stage 5 of the KB ingest pipeline. Dedupes equations, proposes precedes edges from
lecture order, and writes cards under agent/knowledge-brain/ without ever clobbering a human
edit. No network, no API key.

  --segments FILE    segments.json   (default build/kb/segments.json)
  --classified FILE  classified.json (default build/kb/classified.json)
  --entities FILE    entities.json   (default build/kb/entities.json)
  --kb-dir DIR       cards + state   (default agent/knowledge-brain)
  --out DIR          work dir        (default build/kb)
  --report FILE      machine-readable report (default build/kb-report.json)
  --summary FILE     append the markdown report here (e.g. "$GITHUB_STEP_SUMMARY")
  --write-units      also draft unit cards from taxonomy.yml (off by default)
  --dry-run          print what would change, write nothing
  --help
`;

runCli(import.meta.url, async (argv) => {
  const args = parseArgs(argv, FLAGS);
  if (args.help) {
    console.log(USAGE);
    return 0;
  }
  const { kbDir, workDir } = resolveDirs(args);
  const segments = await readJson(args.segments ? path.resolve(args.segments) : path.join(workDir, 'segments.json'), null);
  const classified = await readJson(args.classified ? path.resolve(args.classified) : path.join(workDir, 'classified.json'), null);
  const entities = await readJson(args.entities ? path.resolve(args.entities) : path.join(workDir, 'entities.json'), null);
  if (!segments) throw new Error('No segments.json — run scripts/kb/extract.mjs first.');
  if (!classified) throw new Error('No classified.json — run scripts/kb/classify.mjs first.');
  if (!entities) throw new Error('No entities.json — run scripts/kb/entities.mjs first.');

  let taxonomy;
  try {
    taxonomy = await loadTaxonomy(kbDir);
  } catch (e) {
    if (e instanceof TaxonomyError) throw new Error(e.message);
    throw e;
  }

  const state = await loadState(kbDir);
  const promptVersion = await promptVersionString(PIPELINE_PROMPTS);
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
    if (args.dryRun) {
      console.log(`[write-cards] would ${card.outcome} ${relLabel(card.file)}`);
      continue;
    }
    await writeTextAtomic(card.file, card.text);
    written++;
  }

  if (!args.dryRun) {
    // State: what we ingested, and which cards each file produced. A card belongs to
    // a file when it cites it — the same relation CI gate 3 checks — rather than any
    // guess from id spelling.
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
      const produced = new Set([...(cardsByFile.get(file.path) || [])]);
      state.files[file.path] = {
        path: file.path,
        sha256: file.sha256,
        bytes: file.bytes,
        pipeline_version: PIPELINE_VERSION,
        model_id: entities.gen.split('@')[0],
        prompt_version: promptVersion,
        cards_written: [...produced].sort(),
        ingestedAt: new Date().toISOString(),
      };
    }
    state.pipeline_version = PIPELINE_VERSION;
    state.prompt_version = promptVersion;
    const stateFile = await saveState(state, kbDir);
    console.log(`[write-cards] wrote ${fmtInt(written)} card file(s) and updated ${relLabel(stateFile)}`);
  }

  const reportPath = args.report ? path.resolve(args.report) : DEFAULT_REPORT_PATH;
  await writeJsonAtomic(reportPath, report);
  console.log(`[write-cards] wrote ${relLabel(reportPath)}`);
  if (args.summary) await fsp.appendFile(path.resolve(args.summary), reportMarkdown(report) + '\n');

  console.log(
    `[write-cards] ${fmtInt(report.cards.added.length)} added, ${fmtInt(report.cards.changed.length)} changed, ` +
      `${fmtInt(report.cards.unchanged.length)} unchanged, ${fmtInt(report.cards.skippedHumanEdited.length)} left alone (human-edited), ` +
      `${fmtInt(report.cards.protectedReviewed.length)} protected, ${fmtInt(report.cards.stale.length)} stale.`
  );
  console.log(
    `[write-cards] equations ${fmtInt(report.equations.extracted)} extracted → ${fmtInt(report.equations.unique)} unique; ` +
      `${fmtInt(report.precedes.length)} precedes edge(s) after transitive reduction.`
  );
  for (const w of report.warnings.slice(0, 20)) console.log(`  ! ${w}`);
  return 0;
});
