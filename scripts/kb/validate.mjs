#!/usr/bin/env node
// Kelvin AI — KB-1 validator.
//
// Ten CI gates over agent/knowledge-brain/**. No network, no LLM, no API key: this runs on
// forks and on every push. Hard failures exit 1; warnings are advisory and are
// written to $GITHUB_STEP_SUMMARY when GitHub Actions provides one.
//
// YAML: frontmatter and taxonomy.yml are parsed with the `yaml` package when it
// is installed, otherwise with the small subset parser at the bottom of this
// file (block maps, block sequences, flow [a, b] / {a: b}, quoted scalars,
// block scalars). The chosen parser is named in the output so a parse
// disagreement is visible rather than silent.

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// ---------------------------------------------------------------- constants --

const CARD_DIRS = {
  course: 'course',
  unit: 'units',
  topic: 'topics',
  eq: 'equations',
  misc: 'misconceptions',
  ex: 'examples',
  item: 'items',
  src: 'sources',
};

// The writer may spell a kind out; every spelling normalises to its id prefix.
const KIND_ALIASES = {
  course: 'course',
  unit: 'unit',
  topic: 'topic',
  eq: 'eq',
  equation: 'eq',
  misc: 'misc',
  misconception: 'misc',
  ex: 'ex',
  example: 'ex',
  worked_example: 'ex',
  'worked-example': 'ex',
  item: 'item',
  assessment_item: 'item',
  'assessment-item': 'item',
  src: 'src',
  source: 'src',
};

const ID_RE = /^(course|unit|topic|eq|misc|ex|item|src):[a-z0-9][a-z0-9-]*$/;
const OBJECTIVE_SUFFIX_RE = /^#o[0-9A-Za-z]+$/;

// Gate 6 — per-kind token caps (design: unit 1200, topic 1500, leaf 2500).
// `course` is not given a cap by the design; 2500 is this harness's choice and
// the course card is separately bounded by the L0 cap in gate 7.
const TOKEN_CAPS = { course: 2500, unit: 1200, topic: 1500, eq: 2500, misc: 2500, ex: 2500, item: 2500, src: 2500 };
const L0_TOKEN_CAP = 2000;
const MAX_CHILDREN = 30;
const MAX_DESCRIPTION_CHARS = 300;

// Arbitrated 2026-09-17 during the end-to-end verification pass. The design froze this at
// auto | reviewed | instructor-verified, but the repo needs two more and every consumer already
// carries them: `draft` for a card a human wrote but has not finished checking (14 misconception
// cards, which `auto` would mislabel as pipeline output), and `stub` for a card synthesised from
// taxonomy.yml with no course material behind it at all. lib/kb.js's CARD_STATUSES, the compiler's
// L0 honesty contract and public/browse.js all handle the five. The design document is the thing
// that is out of date, so this is the enum and there is no longer a warning for the other two.
const STATUS_VALUES = new Set(['auto', 'draft', 'reviewed', 'instructor-verified', 'stub']);
const AUDIENCE_VALUES = new Set(['model', 'student', 'both']);

// Frontmatter keys that carry card ids (gate 3 resolves every one of them).
const LINK_FIELDS = [
  'parent',
  'unit',
  'course',
  'topic',
  'topics',
  'units',
  'children',
  'prerequisites',
  'precedes',
  'equations',
  'misconceptions',
  'examples',
  'items',
  'related',
  'derives_from',
  'specializes_to',
  'secondary_to',
  'requires_objectives',
];

// Fan-out (gate 6) is measured at navigation decision points only.
const CHILD_LIST_FIELDS = ['children', 'topics', 'units'];

// Everything else in the frozen vocabulary, plus practical card fields. Keys
// outside this set are a warning, never a failure — the vocabulary can grow.
const KNOWN_KEYS = new Set([
  ...LINK_FIELDS,
  'id',
  'kind',
  'title',
  'description',
  'objectives',
  'symbols',
  'sources',
  'valid_when',
  'invalid_when',
  'status',
  'audience',
  'priority',
  'generated',
  'lecture',
  'lectures',
  'textbook',
  'section',
  'sections',
  'exam',
  'date',
  'dates',
  'tier',
  'signatures',
  'not_signatures',
  'confusable_with',
  'stale',
  'confidence',
  'latex',
  'name',
  'plain_statement',
  'sign_convention',
  'tags',
  'aliases',
  'validation',
  'term',
  'instructor',
  'kc_type',
  'bloom',
]);

// -------------------------------------------------------------- collectors --

const failures = [];
const warnings = [];
const notes = [];
const gates = [];

function fail(gate, file, message) {
  failures.push({ gate, file, message });
}
function warn(gate, file, message) {
  warnings.push({ gate, file, message });
}
function note(message) {
  notes.push(message);
}
function gate(n, title, status, detail) {
  gates.push({ n, title, status, detail });
}

const rel = (p) => {
  const r = path.relative(APP_DIR, String(p)).split(path.sep).join('/');
  return !r || r.startsWith('..') ? String(p) : r;
};

/** An estimate, not a tokenizer: characters ÷ a constant. LaTeX, tables and
 * symbol-dense text tokenize denser than prose, so a card measured near its cap
 * here may be over it in the real tokenizer. The divisor comes from lib/kb.js
 * when that module is importable, so the validator and the compiler agree; the
 * report always names the divisor it used rather than hiding it. */
let estimateTokens = (text) => Math.ceil(String(text || '').length / 3.6);
let tokenEstimatorLabel = 'chars ÷ 3.6';

// ------------------------------------------------------------------- input --

function parseArgs(argv) {
  const args = { kb: null, knowledge: null, index: null, summary: process.env.GITHUB_STEP_SUMMARY || null, strict: false, quiet: false, parser: 'auto' };
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
      case '--kb':
        args.kb = take(flag);
        break;
      case '--knowledge':
        args.knowledge = take(flag);
        break;
      case '--index':
        args.index = take(flag);
        break;
      case '--summary':
        args.summary = take(flag);
        break;
      case '--parser':
        args.parser = take(flag);
        if (!['auto', 'yaml', 'builtin'].includes(args.parser)) throw new Error('--parser must be auto, yaml or builtin');
        break;
      case '--strict':
        args.strict = true;
        break;
      case '--quiet':
        args.quiet = true;
        break;
      case '--help':
      case '-h':
        console.log(
          [
            'Usage: node scripts/kb/validate.mjs [options]',
            '',
            '  --kb <dir>         knowledge-base directory (default agent/knowledge-brain)',
            '  --knowledge <dir>  raw course files (default agent/raw-course-files)',
            '  --index <file>     compiled index for the L0 check (default build/knowledge-index.json)',
            '  --summary <file>   markdown summary target (default $GITHUB_STEP_SUMMARY)',
            '  --parser <which>   auto (default) | yaml | builtin — which YAML parser to use',
            '  --strict           treat warnings as failures',
            '  --quiet            only print the verdict',
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

/**
 * The compiler, the card writer and this validator must agree, so where
 * lib/kb.js already owns a constant or a canonicalisation, defer to it and say
 * so in the output. Every piece is optional: if lib/kb.js cannot be imported
 * (mid-edit, or a fork with a trimmed tree) the built-in fallbacks below are
 * used and the report names them.
 */
async function loadKbLib() {
  const fallback = {
    source: 'built-in fallbacks (lib/kb.js not importable)',
    estimateTokens: (t) => Math.ceil(String(t || '').length / 3.6),
    charsPerToken: 3.6,
    statuses: new Set(STATUS_VALUES),
    audiences: new Set(AUDIENCE_VALUES),
    findAutoBlocks: null,
    autoBlockEdited: null,
  };
  try {
    const kb = await import(pathToFileURL(path.join(APP_DIR, 'lib', 'kb.js')).href);
    return {
      source: 'lib/kb.js',
      estimateTokens: typeof kb.estimateTokens === 'function' ? kb.estimateTokens : fallback.estimateTokens,
      charsPerToken: typeof kb.CHARS_PER_TOKEN === 'number' ? kb.CHARS_PER_TOKEN : fallback.charsPerToken,
      statuses: new Set([...STATUS_VALUES, ...(Array.isArray(kb.CARD_STATUSES) ? kb.CARD_STATUSES : [])]),
      audiences: new Set([...AUDIENCE_VALUES, ...(Array.isArray(kb.CARD_AUDIENCES) ? kb.CARD_AUDIENCES : [])]),
      findAutoBlocks: typeof kb.findAutoBlocks === 'function' ? kb.findAutoBlocks : null,
      autoBlockEdited: typeof kb.autoBlockEdited === 'function' ? kb.autoBlockEdited : null,
    };
  } catch {
    return fallback;
  }
}

async function loadYamlParser(which = 'auto') {
  if (which === 'builtin') return { name: 'built-in YAML subset parser (forced)', parse: parseYamlSubset };
  try {
    const mod = await import('yaml');
    const parse = mod.parse || mod.default?.parse;
    if (typeof parse === 'function') return { name: 'yaml package', parse: (t) => parse(t) };
  } catch (e) {
    if (which === 'yaml') throw new Error(`--parser yaml was requested but the \`yaml\` package is not installed: ${e.message}`);
  }
  if (which === 'yaml') throw new Error('--parser yaml was requested but the `yaml` package exports no parse()');
  return { name: 'built-in YAML subset parser', parse: parseYamlSubset };
}

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await fsp.readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === 'ENOENT') return out;
    throw e;
  }
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function splitFrontmatter(raw) {
  const text = raw.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const after = text.indexOf('\n', end + 1);
  return {
    frontmatter: text.slice(4, end + 1),
    body: after === -1 ? '' : text.slice(after + 1),
  };
}

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

// ------------------------------------------------------------------- gates --

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const kbDir = path.resolve(APP_DIR, args.kb || path.join('agent', 'knowledge-brain'));
  const knowledgeDir = path.resolve(APP_DIR, args.knowledge || path.join('agent', 'raw-course-files'));
  const indexPath = path.resolve(APP_DIR, args.index || path.join('build', 'knowledge-index.json'));
  const yaml = await loadYamlParser(args.parser);
  const kblib = await loadKbLib();
  estimateTokens = kblib.estimateTokens;
  tokenEstimatorLabel = `chars ÷ ${kblib.charsPerToken}`;

  const kbExists = fs.existsSync(kbDir);
  const allFiles = kbExists ? await walk(kbDir) : [];
  const mdFiles = allFiles.filter((f) => f.endsWith('.md'));
  const cardFiles = mdFiles.filter((f) => {
    const r = path.relative(kbDir, f).split(path.sep);
    if (r[0] === 'context') return false;
    const base = r[r.length - 1];
    return base !== 'INDEX.md' && base !== 'README.md' && base !== 'symbols.md';
  });

  if (!kbExists || cardFiles.length === 0) {
    const reason = !kbExists ? `${rel(kbDir)}/ does not exist yet` : `${rel(kbDir)}/ holds no card files yet`;
    console.log(`kb validate: no knowledge base to validate — ${reason}.`);
    console.log('All ten gates are reported as SKIPPED. This is a pass, not a clean bill of health.');
    await writeSummary(args.summary, [
      '## Kelvin AI — knowledge base validation',
      '',
      `No knowledge base to validate: ${reason}. All ten gates skipped.`,
      '',
    ]);
    return 0;
  }

  // ---- parse every card (gate 1) -------------------------------------------
  const cards = [];
  const parseErrors = [];
  for (const file of cardFiles) {
    const raw = await fsp.readFile(file, 'utf8');
    const split = splitFrontmatter(raw);
    if (!split) {
      parseErrors.push({ file, message: 'no YAML frontmatter (a card must start with a `---` block)' });
      continue;
    }
    let fm;
    try {
      fm = yaml.parse(split.frontmatter);
    } catch (e) {
      parseErrors.push({ file, message: `frontmatter did not parse: ${String(e.message || e).replace(/\s+/g, ' ').slice(0, 200)}` });
      continue;
    }
    if (!fm || typeof fm !== 'object' || Array.isArray(fm)) {
      parseErrors.push({ file, message: 'frontmatter is not a YAML mapping' });
      continue;
    }
    cards.push({ file, raw, fm, body: split.body, kind: null, id: typeof fm.id === 'string' ? fm.id.trim() : null });
  }
  for (const e of parseErrors) fail(1, e.file, e.message);

  // required frontmatter
  for (const card of cards) {
    const { fm, file } = card;
    const kindRaw = typeof fm.kind === 'string' ? fm.kind.trim() : '';
    const kind = KIND_ALIASES[kindRaw.toLowerCase()] || null;
    card.kind = kind;
    if (!kindRaw) fail(1, file, 'missing required frontmatter key `kind`');
    else if (!kind) fail(1, file, `unknown \`kind\`: ${JSON.stringify(kindRaw)} (expected one of ${Object.keys(CARD_DIRS).join(', ')})`);
    if (!card.id) fail(1, file, 'missing required frontmatter key `id`');
    if (typeof fm.title !== 'string' || !fm.title.trim()) fail(1, file, 'missing required frontmatter key `title`');
    const description = typeof fm.description === 'string' ? fm.description.trim() : '';
    if (!description) fail(1, file, 'missing required frontmatter key `description` (the always-resident one-liner)');
    else if (description.length > MAX_DESCRIPTION_CHARS) {
      warn(1, file, `description is ${description.length} chars; the design budget is ${MAX_DESCRIPTION_CHARS} (it is always resident)`);
    }
    if (kind === 'topic' && !fm.unit) fail(1, file, 'a topic card must name its `unit`');
    if (kind === 'unit' && !fm.parent) fail(1, file, 'a unit card must name its `parent` (the course card)');
    if (!asArray(fm.sources).length && kind !== 'course') {
      warn(1, file, 'no `sources[]` — the design wants every card to carry at least one citation');
    }
    for (const key of Object.keys(fm)) {
      if (!KNOWN_KEYS.has(key)) warn(1, file, `frontmatter key \`${key}\` is outside the frozen link vocabulary`);
    }
  }
  gate(1, 'cards parse and carry required frontmatter', failures.some((f) => f.gate === 1) ? 'FAIL' : 'PASS', `${cards.length} card${cards.length === 1 ? '' : 's'} parsed`);

  // ---- gate 2: ids unique, well formed, matching the filename slug ----------
  const byId = new Map();
  for (const card of cards) {
    const { id, file, kind } = card;
    if (!id) continue;
    if (!ID_RE.test(id)) {
      fail(2, file, `id ${JSON.stringify(id)} does not match ^(course|unit|topic|eq|misc|ex|item|src):[a-z0-9][a-z0-9-]*$`);
      continue;
    }
    const [prefix, slug] = [id.slice(0, id.indexOf(':')), id.slice(id.indexOf(':') + 1)];
    if (kind && prefix !== kind) fail(2, file, `id prefix \`${prefix}:\` does not match kind \`${kind}\``);
    const base = path.basename(file, '.md');
    if (base !== slug) {
      // The design's own example file name for a source card uses `__` where
      // the id regex only allows `-`, so that one substitution is a warning
      // rather than a failure. Anything else is a real mismatch.
      if (base.replace(/[_-]+/g, '-') === slug.replace(/-+/g, '-')) warn(2, file, `filename is \`${base}.md\` but the id slug is \`${slug}\`; rename the file to \`${slug}.md\``);
      else fail(2, file, `filename slug \`${base}\` does not match the id slug \`${slug}\``);
    }
    const dir = path.basename(path.dirname(file));
    if (kind && CARD_DIRS[kind] && dir !== CARD_DIRS[kind]) {
      warn(2, file, `a \`${kind}\` card is expected under ${CARD_DIRS[kind]}/, found under ${dir}/`);
    }
    if (byId.has(id)) fail(2, file, `duplicate id ${id} (also in ${rel(byId.get(id).file)})`);
    else byId.set(id, card);
  }
  gate(2, 'ids unique, well formed, matching the filename slug', failures.some((f) => f.gate === 2) ? 'FAIL' : 'PASS', `${byId.size} unique id${byId.size === 1 ? '' : 's'}`);

  // objective ids declared by each card, for #oN resolution
  const objectivesById = new Map();
  for (const card of cards) {
    if (!card.id) continue;
    const ids = new Set();
    for (const obj of asArray(card.fm.objectives)) {
      let oid = null;
      if (typeof obj === 'string') oid = obj.trim();
      else if (obj && typeof obj === 'object') oid = typeof obj.id === 'string' ? obj.id.trim() : null;
      if (!oid) {
        warn(1, card.file, 'an `objectives[]` entry has no stable `id` (expected `#o<id>`)');
        continue;
      }
      const suffix = oid.includes('#') ? oid.slice(oid.indexOf('#')) : oid;
      if (!OBJECTIVE_SUFFIX_RE.test(suffix)) warn(1, card.file, `objective id ${JSON.stringify(oid)} is not of the form #o<id>`);
      ids.add(suffix);
    }
    objectivesById.set(card.id, ids);
  }

  // ---- gate 3: every link target exists ------------------------------------
  let linkCount = 0;
  for (const card of cards) {
    for (const field of LINK_FIELDS) {
      const value = card.fm[field];
      if (value === undefined || value === null) continue;
      for (const entry of asArray(value)) {
        const target = typeof entry === 'string' ? entry.trim() : typeof entry?.id === 'string' ? entry.id.trim() : null;
        if (!target) {
          fail(3, card.file, `\`${field}\` holds a value that is not a card id: ${JSON.stringify(entry)}`);
          continue;
        }
        if (target === 'unassigned') continue;
        linkCount++;
        const hash = target.indexOf('#');
        const cardId = hash === -1 ? target : target.slice(0, hash);
        const objective = hash === -1 ? null : target.slice(hash);
        if (!byId.has(cardId)) {
          fail(3, card.file, `\`${field}\` → ${target} does not resolve: no card has id ${cardId}`);
          continue;
        }
        if (objective && !(objectivesById.get(cardId) || new Set()).has(objective)) {
          fail(3, card.file, `\`${field}\` → ${target} does not resolve: ${cardId} declares no objective ${objective}`);
        }
      }
    }
  }
  gate(3, 'every cross-reference resolves', failures.some((f) => f.gate === 3) ? 'FAIL' : 'PASS', `${linkCount} link${linkCount === 1 ? '' : 's'} checked`);

  // ---- gate 4: prerequisites / precedes graph is acyclic --------------------
  const edges = new Map(); // from -> Set(to)
  const addEdge = (from, to) => {
    if (!byId.has(from) || !byId.has(to)) return;
    if (!edges.has(from)) edges.set(from, new Set());
    edges.get(from).add(to);
  };
  for (const card of cards) {
    if (!card.id) continue;
    for (const p of asArray(card.fm.prerequisites)) {
      const t = typeof p === 'string' ? p.trim().split('#')[0] : null;
      if (t) addEdge(t, card.id); // prerequisite comes first
    }
    for (const p of asArray(card.fm.precedes)) {
      const t = typeof p === 'string' ? p.trim().split('#')[0] : null;
      if (t) addEdge(card.id, t);
    }
  }
  const cycle = findCycle(edges);
  if (cycle) fail(4, byId.get(cycle[0])?.file || kbDir, `prerequisite/precedes cycle: ${cycle.join(' → ')}`);
  const edgeCount = [...edges.values()].reduce((n, s) => n + s.size, 0);
  gate(4, 'prerequisite/precedes graph is acyclic', cycle ? 'FAIL' : 'PASS', `${edgeCount} edge${edgeCount === 1 ? '' : 's'}`);

  // ---- gate 5: equation symbols exist in symbols.md -------------------------
  const symbolsPath = path.join(kbDir, 'symbols.md');
  const equationCards = cards.filter((c) => c.kind === 'eq');
  const referencedSymbols = equationCards.flatMap((c) => asArray(c.fm.symbols).map((s) => ({ card: c, symbol: s })));
  if (!referencedSymbols.length) {
    gate(5, 'equation symbols exist in symbols.md', 'SKIP', 'no equation card references a symbol');
  } else if (!fs.existsSync(symbolsPath)) {
    fail(5, symbolsPath, `${equationCards.length} equation card(s) reference symbols but ${rel(symbolsPath)} does not exist`);
    gate(5, 'equation symbols exist in symbols.md', 'FAIL', 'symbols.md missing');
  } else {
    const glossary = parseSymbols(await fsp.readFile(symbolsPath, 'utf8'));
    if (!glossary.size) {
      fail(5, symbolsPath, 'no symbols could be read from symbols.md (expected a markdown table whose first column is the glyph, or `- `x` — meaning` lines)');
    }
    for (const { card, symbol } of referencedSymbols) {
      const glyph = normalizeSymbol(symbol);
      if (!glyph) {
        fail(5, card.file, `\`symbols[]\` holds a value that is not a symbol: ${JSON.stringify(symbol)}`);
        continue;
      }
      if (!glossary.has(glyph)) fail(5, card.file, `symbol \`${glyph}\` is not in ${rel(symbolsPath)} (symbol comparison is case-sensitive: v, V and V̇ are different symbols)`);
    }
    gate(5, 'equation symbols exist in symbols.md', failures.some((f) => f.gate === 5) ? 'FAIL' : 'PASS', `${referencedSymbols.length} reference(s) against ${glossary.size} glossary entries`);
  }

  // ---- gate 6: token caps and fan-out --------------------------------------
  const childCounts = new Map();
  for (const card of cards) {
    const parent = typeof card.fm.parent === 'string' ? card.fm.parent.trim() : null;
    if (parent) childCounts.set(parent, (childCounts.get(parent) || 0) + 1);
  }
  for (const card of cards) {
    const kind = card.kind;
    const cap = TOKEN_CAPS[kind] ?? 2500;
    // Measured on the body, which is what `bodyTokens` in the compiled index
    // and the layer budgets in the design both refer to.
    const tokens = estimateTokens(card.body);
    card.tokens = tokens;
    card.fileTokens = estimateTokens(card.raw);
    if (tokens > cap) fail(6, card.file, `body is ~${tokens} estimated tokens, over the ${kind || 'card'} cap of ${cap} (~${card.fileTokens} including frontmatter)`);
    const declared = CHILD_LIST_FIELDS.reduce((n, f) => n + asArray(card.fm[f]).length, 0);
    const reverse = card.id ? childCounts.get(card.id) || 0 : 0;
    const children = Math.max(declared, reverse);
    if (children > MAX_CHILDREN) fail(6, card.file, `${children} children at one decision point exceeds the fan-out limit of ${MAX_CHILDREN}`);
    for (const f of ['equations', 'examples', 'items', 'misconceptions']) {
      const n = asArray(card.fm[f]).length;
      if (n > MAX_CHILDREN) warn(6, card.file, `\`${f}\` lists ${n} ids; past ~${MAX_CHILDREN} entries a list stops being a usable decision point`);
    }
  }
  gate(6, 'per-kind token caps and the ≤30 fan-out rule', failures.some((f) => f.gate === 6) ? 'FAIL' : 'PASS', `caps measured on the card body; largest is ~${Math.max(0, ...cards.map((c) => c.tokens || 0))} tokens`);

  // ---- gate 7: rendered L0 within budget -----------------------------------
  let l0 = null;
  let l0Source = null;
  if (fs.existsSync(indexPath)) {
    try {
      const index = JSON.parse(await fsp.readFile(indexPath, 'utf8'));
      if (typeof index.l0 === 'string' && index.l0.trim()) {
        l0 = index.l0;
        l0Source = `${rel(indexPath)} (compiled)`;
      }
    } catch (e) {
      warn(7, indexPath, `could not read the compiled index: ${e.message}`);
    }
  }
  if (l0 === null) {
    const indexMd = path.join(kbDir, 'INDEX.md');
    if (fs.existsSync(indexMd)) {
      l0 = await fsp.readFile(indexMd, 'utf8');
      l0Source = `${rel(indexMd)} (uncompiled source — the compiled L0 may differ)`;
    }
  }
  if (l0 === null) {
    gate(7, `rendered L0 ≤ ${L0_TOKEN_CAP} tokens`, 'SKIP', 'no compiled `l0` and no agent/knowledge-brain/INDEX.md');
  } else {
    const tokens = estimateTokens(l0);
    if (tokens > L0_TOKEN_CAP) fail(7, l0Source, `L0 is ~${tokens} estimated tokens, over the hard cap of ${L0_TOKEN_CAP}`);
    gate(7, `rendered L0 ≤ ${L0_TOKEN_CAP} tokens`, tokens > L0_TOKEN_CAP ? 'FAIL' : 'PASS', `~${tokens} tokens from ${l0Source}`);
  }

  // ---- gate 8: taxonomy membership -----------------------------------------
  const taxonomyPath = path.join(kbDir, 'taxonomy.yml');
  const usedTopics = new Set();
  for (const card of cards) {
    if (card.kind === 'topic' && card.id) usedTopics.add(card.id);
    for (const field of ['topic', 'topics', 'unit', 'parent', 'prerequisites', 'precedes', 'related']) {
      for (const entry of asArray(card.fm[field])) {
        const t = typeof entry === 'string' ? entry.trim().split('#')[0] : null;
        if (t && t.startsWith('topic:')) usedTopics.add(t);
      }
    }
  }
  let taxonomy = null;
  if (!fs.existsSync(taxonomyPath)) {
    if (usedTopics.size) {
      fail(8, taxonomyPath, `${usedTopics.size} topic id(s) are used by cards but ${rel(taxonomyPath)} does not exist`);
      gate(8, 'every topic id used by a card exists in taxonomy.yml', 'FAIL', 'taxonomy.yml missing');
    } else {
      gate(8, 'every topic id used by a card exists in taxonomy.yml', 'SKIP', 'no taxonomy.yml and no topic ids in use');
    }
  } else {
    const rawTaxonomy = await fsp.readFile(taxonomyPath, 'utf8');
    let parsed = null;
    try {
      parsed = yaml.parse(rawTaxonomy);
    } catch (e) {
      fail(8, taxonomyPath, `taxonomy.yml did not parse: ${String(e.message || e).replace(/\s+/g, ' ').slice(0, 200)}`);
    }
    taxonomy = collectTaxonomy(parsed, rawTaxonomy);
    for (const t of [...usedTopics].sort()) {
      if (!taxonomy.topics.has(t)) {
        const where = byId.get(t)?.file || taxonomyPath;
        fail(8, where, `topic ${t} is used by a card but is not declared in ${rel(taxonomyPath)}`);
      }
    }
    for (const card of cards) {
      if (card.kind !== 'unit' || !card.id) continue;
      if (taxonomy.units.size && !taxonomy.units.has(card.id)) warn(8, card.file, `unit ${card.id} is not declared in ${rel(taxonomyPath)}`);
    }
    if (taxonomy.conditions.size) {
      for (const card of cards) {
        for (const field of ['valid_when', 'invalid_when']) {
          for (const entry of asArray(card.fm[field])) {
            const v = typeof entry === 'string' ? entry.trim() : null;
            if (v && !taxonomy.conditions.has(v)) warn(8, card.file, `\`${field}\` value \`${v}\` is not in the taxonomy.yml condition enum`);
          }
        }
      }
    } else {
      note('taxonomy.yml declares no valid_when/assumptions enum, so condition values were not checked.');
    }
    gate(
      8,
      'every topic id used by a card exists in taxonomy.yml',
      failures.some((f) => f.gate === 8) ? 'FAIL' : 'PASS',
      `${usedTopics.size} topic id(s) used, ${taxonomy.topics.size} declared`
    );
  }

  // ---- gate 9: kb:auto blocks are well formed ------------------------------
  let blockCount = 0;
  for (const card of cards) {
    const result = checkAutoBlocks(card.raw);
    blockCount += result.blocks;
    for (const problem of result.problems) fail(9, card.file, problem);
  }
  gate(9, 'kb:auto blocks are well formed and their hashes parse', failures.some((f) => f.gate === 9) ? 'FAIL' : 'PASS', `${blockCount} generated block(s)`);
  if (blockCount) {
    if (kblib.findAutoBlocks && kblib.autoBlockEdited) {
      let edited = 0;
      for (const card of cards) {
        for (const block of kblib.findAutoBlocks(card.raw)) if (kblib.autoBlockEdited(block)) edited++;
      }
      note(
        `Gate 9 checks marker syntax. Of ${blockCount} generated block(s), ${edited} no longer match their recorded hash — by lib/kb.js's canonicalisation those have been edited by a human and the writer must leave them alone. That is information, not a failure.`
      );
    } else {
      note(
        'Gate 9 checks marker syntax only. Whether a block still matches its recorded hash — the no-clobber test — is owned by lib/kb.js and scripts/kb/write-cards.mjs, which define the canonicalisation; this validator does not second-guess it.'
      );
    }
  }

  // ---- gate 10: status / audience enums ------------------------------------
  const statusCounts = new Map();
  const offEnumStatus = new Map();
  for (const card of cards) {
    const status = card.fm.status === undefined || card.fm.status === null ? null : String(card.fm.status).trim();
    if (status === null) warn(10, card.file, 'no `status` — a card with no status cannot be told apart from a reviewed one');
    else if (!kblib.statuses.has(status)) fail(10, card.file, `status \`${status}\` is not one of ${[...kblib.statuses].join(' | ')}`);
    else {
      statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
      if (!STATUS_VALUES.has(status)) {
        if (!offEnumStatus.has(status)) offEnumStatus.set(status, []);
        offEnumStatus.get(status).push(card.file);
      }
    }
    const audience = card.fm.audience === undefined || card.fm.audience === null ? 'both' : String(card.fm.audience).trim();
    if (!kblib.audiences.has(audience)) fail(10, card.file, `audience \`${audience}\` is not one of ${[...kblib.audiences].join(' | ')}`);
  }
  // One warning per off-enum value, not one per card: 14 identical lines is noise.
  for (const [status, files] of offEnumStatus) {
    const sample = files.slice(0, 3).map((f) => rel(f)).join(', ');
    warn(
      10,
      files[0],
      `${files.length} card(s) use status \`${status}\`, which lib/kb.js accepts but the design's frozen enum (${[...STATUS_VALUES].join(' | ')}) does not — one of the two should change. e.g. ${sample}${files.length > 3 ? ', …' : ''}`
    );
  }
  gate(
    10,
    'status and audience values are from the allowed enums',
    failures.some((f) => f.gate === 10) ? 'FAIL' : 'PASS',
    [...statusCounts].map(([k, v]) => `${v} ${k}`).join(', ') || 'no status values recorded'
  );

  // ---- advisory: source paths, orphans, sibling descriptions ---------------
  const knowledgeFiles = new Set();
  if (fs.existsSync(knowledgeDir)) {
    for (const f of await walk(knowledgeDir)) {
      const r = path.relative(knowledgeDir, f).split(path.sep).join('/');
      if (path.basename(r) !== 'README.md') knowledgeFiles.add(r.toLowerCase());
    }
  }
  const corpusPresent = knowledgeFiles.size > 0;
  for (const card of cards) {
    for (const source of asArray(card.fm.sources)) {
      const p = typeof source === 'string' ? source : typeof source?.path === 'string' ? source.path : null;
      if (!p) {
        // A card may cite an external document by `url` instead of a corpus file.
        if (!(source && typeof source === 'object' && typeof source.url === 'string' && source.url.trim())) {
          warn(0, card.file, `a \`sources[]\` entry has neither \`path\` nor \`url\`: ${JSON.stringify(source)}`);
        }
        continue;
      }
      const norm = p.replace(/^\.?\//, '').replace(/^agent\/knowledge\//i, '').toLowerCase();
      if (corpusPresent && !knowledgeFiles.has(norm)) {
        warn(0, card.file, `sources[].path \`${p}\` is not a file under ${rel(knowledgeDir)}/`);
      }
    }
  }
  if (!corpusPresent) note(`${rel(knowledgeDir)}/ holds no course files, so sources[].path values were not checked against the corpus.`);

  const siblings = new Map();
  for (const card of cards) {
    const parent = typeof card.fm.parent === 'string' ? card.fm.parent.trim() : `(${card.kind || 'unknown'})`;
    if (!siblings.has(parent)) siblings.set(parent, []);
    siblings.get(parent).push(card);
  }
  for (const [parent, group] of siblings) {
    if (group.length < 2 || group.length > 200) continue;
    const grams = group.map((c) => trigrams(String(c.fm.description || '')));
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const sim = jaccard(grams[i], grams[j]);
        if (sim > 0.8) {
          warn(0, group[i].file, `description is ${(sim * 100).toFixed(0)}% trigram-identical to ${group[j].id} (siblings under ${parent}); the model routes on these one-liners, so near-duplicates cost recall`);
        }
      }
    }
  }

  // ---- report ---------------------------------------------------------------
  const hard = failures.length + (args.strict ? warnings.length : 0);
  if (!args.quiet) console.log(renderText({ gates, failures, warnings, notes, cards, yamlName: yaml.name, kbDir, kblibSource: kblib.source }));
  else console.log(hard ? `kb validate: ${failures.length} failure(s)` : 'kb validate: all gates pass');
  await writeSummary(args.summary, renderMarkdown({ gates, failures, warnings, notes, cards, yamlName: yaml.name, kblibSource: kblib.source }));
  return hard ? 1 : 0;
}

// ------------------------------------------------------------- rendering ----

function renderText({ gates: g, failures: f, warnings: w, notes: n, cards, yamlName, kbDir, kblibSource }) {
  const lines = [];
  lines.push(`Kelvin AI — knowledge base validation (${rel(kbDir)}/, ${cards.length} cards, parsed with the ${yamlName})`);
  lines.push(`Token estimator: ${tokenEstimatorLabel}, from ${kblibSource}.`);
  lines.push('');
  for (const item of g) {
    const mark = item.status === 'PASS' ? 'ok  ' : item.status === 'FAIL' ? 'FAIL' : 'skip';
    lines.push(`  [${mark}] gate ${String(item.n).padStart(2)}  ${item.title}${item.detail ? ` — ${item.detail}` : ''}`);
  }
  lines.push('');
  if (f.length) {
    lines.push(`${f.length} hard failure${f.length === 1 ? '' : 's'}:`);
    for (const x of f) lines.push(`  gate ${x.gate}  ${rel(String(x.file))}: ${x.message}`);
    lines.push('');
  }
  if (w.length) {
    lines.push(`${w.length} warning${w.length === 1 ? '' : 's'}:`);
    for (const x of w) lines.push(`  ${x.gate ? `gate ${x.gate}  ` : ''}${rel(String(x.file))}: ${x.message}`);
    lines.push('');
  }
  for (const x of n) lines.push(`note: ${x}`);
  if (n.length) lines.push('');
  lines.push(`Token figures are estimates (${tokenEstimatorLabel}), not a tokenizer count; LaTeX and tables tokenize denser than prose, so a card near its cap here may be over it in the real tokenizer.`);
  lines.push(f.length ? `FAILED — ${f.length} hard failure${f.length === 1 ? '' : 's'}.` : 'PASSED — no hard failures.');
  return lines.join('\n');
}

function renderMarkdown({ gates: g, failures: f, warnings: w, notes: n, cards, yamlName, kblibSource }) {
  const cell = (s) => String(s).replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
  const lines = ['## Kelvin AI — knowledge base validation', ''];
  lines.push(f.length ? `**FAILED** — ${f.length} hard failure${f.length === 1 ? '' : 's'} across ${cards.length} cards.` : `**Passed** — ${cards.length} cards, no hard failures.`);
  lines.push('', '| Gate | Check | Result | Detail |', '|---:|---|---|---|');
  for (const item of g) lines.push(`| ${item.n} | ${cell(item.title)} | ${item.status === 'PASS' ? 'pass' : item.status === 'FAIL' ? '**fail**' : 'skipped'} | ${cell(item.detail || '')} |`);
  lines.push('');
  if (f.length) {
    lines.push('### Hard failures', '', '| Gate | File | Problem |', '|---:|---|---|');
    for (const x of f) lines.push(`| ${x.gate} | \`${cell(rel(String(x.file)))}\` | ${cell(x.message)} |`);
    lines.push('');
  }
  if (w.length) {
    lines.push('### Warnings', '', '| File | Warning |', '|---|---|');
    for (const x of w) lines.push(`| \`${cell(rel(String(x.file)))}\` | ${cell(x.message)} |`);
    lines.push('');
  }
  for (const x of n) lines.push(`> ${cell(x)}`, '');
  lines.push(`Parsed with the ${yamlName}; shared constants from ${kblibSource}. Token figures are estimates (${tokenEstimatorLabel}), not a tokenizer count — LaTeX and tables tokenize denser than prose.`, '');
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

// -------------------------------------------------------------- utilities ---

function findCycle(edges) {
  const WHITE = 0;
  const GREY = 1;
  const BLACK = 2;
  const colour = new Map();
  const stack = [];
  const nodes = [...new Set([...edges.keys(), ...[...edges.values()].flatMap((s) => [...s])])].sort();
  for (const n of nodes) colour.set(n, WHITE);
  let found = null;
  const visit = (node) => {
    if (found) return;
    colour.set(node, GREY);
    stack.push(node);
    for (const next of [...(edges.get(node) || [])].sort()) {
      if (found) break;
      const c = colour.get(next) ?? WHITE;
      if (c === GREY) {
        found = stack.slice(stack.indexOf(next)).concat(next);
        break;
      }
      if (c === WHITE) visit(next);
    }
    stack.pop();
    colour.set(node, BLACK);
  };
  for (const n of nodes) {
    if ((colour.get(n) ?? WHITE) === WHITE) visit(n);
    if (found) break;
  }
  return found;
}

function normalizeSymbol(value) {
  if (typeof value !== 'string') {
    if (value && typeof value === 'object' && typeof value.symbol === 'string') return normalizeSymbol(value.symbol);
    return null;
  }
  let s = value.trim();
  s = s.replace(/^sym:/, '');
  s = s.replace(/^[`$]+/, '').replace(/[`$]+$/, '');
  s = s.replace(/^\\\((.*)\\\)$/, '$1');
  return s.trim() || null;
}

/** symbols.md is hand-authored; accept a markdown table (first column is the
 * glyph) and `- `x` — meaning` bullet lines. Comparison is case-sensitive. */
function parseSymbols(text) {
  const out = new Set();
  for (const line of String(text).replace(/\r\n?/g, '\n').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map((c) => c.trim());
      if (!cells.length) continue;
      const first = cells[0];
      if (!first || /^:?-{2,}:?$/.test(first)) continue;
      if (/^(symbol|glyph)$/i.test(first)) continue;
      const glyph = normalizeSymbol(first);
      if (glyph) out.add(glyph);
      continue;
    }
    const bullet = trimmed.match(/^[-*+]\s+(?:\*\*)?(?:`([^`]+)`|\$([^$]+)\$|([^\s—–:-]+))(?:\*\*)?/);
    if (bullet) {
      const glyph = normalizeSymbol(bullet[1] || bullet[2] || bullet[3] || '');
      if (glyph) out.add(glyph);
    }
  }
  return out;
}

/** Collect the ids the taxonomy declares. Shape-agnostic on purpose: the
 * taxonomy is hand-authored and this validator must not dictate its layout. */
function collectTaxonomy(parsed, raw) {
  const topics = new Set();
  const units = new Set();
  const conditions = new Set();
  const visit = (node, keyPath) => {
    if (node === null || node === undefined) return;
    if (typeof node === 'string') {
      const v = node.trim();
      if (/^topic:[a-z0-9][a-z0-9-]*$/.test(v)) topics.add(v);
      else if (/^unit:[a-z0-9][a-z0-9-]*$/.test(v)) units.add(v);
      else if (/^(valid_when|invalid_when|assumptions|conditions|assumption_tags)$/.test(keyPath.at(-1) || '')) conditions.add(v);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) visit(item, keyPath);
      return;
    }
    if (typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (/^topic:[a-z0-9][a-z0-9-]*$/.test(k)) topics.add(k);
        if (/^unit:[a-z0-9][a-z0-9-]*$/.test(k)) units.add(k);
        visit(v, [...keyPath, k]);
      }
    }
  };
  visit(parsed, []);
  // Belt and braces: ids the parser may have missed because of an unexpected layout.
  for (const m of String(raw).matchAll(/\btopic:[a-z0-9][a-z0-9-]*/g)) topics.add(m[0]);
  for (const m of String(raw).matchAll(/\bunit:[a-z0-9][a-z0-9-]*/g)) units.add(m[0]);
  return { topics, units, conditions };
}

const AUTO_START_RE = /<!--\s*kb:auto\s+start\b([^>]*?)-->/g;
const AUTO_END_RE = /<!--\s*kb:auto\s+end\s*-->/g;

function checkAutoBlocks(raw) {
  const problems = [];
  const markers = [];
  for (const m of raw.matchAll(AUTO_START_RE)) markers.push({ type: 'start', at: m.index, attrs: m[1] || '', text: m[0] });
  for (const m of raw.matchAll(AUTO_END_RE)) markers.push({ type: 'end', at: m.index, text: m[0] });
  markers.sort((a, b) => a.at - b.at);
  let open = null;
  let blocks = 0;
  for (const marker of markers) {
    if (marker.type === 'start') {
      if (open) {
        problems.push('a `kb:auto start` marker opens inside another one — generated blocks may not nest');
        continue;
      }
      const field = /\bfield=([^\s]+)/.exec(marker.attrs);
      const hash = /\bhash=(\S+)/.exec(marker.attrs);
      const gen = /\bgen=(\S+?)@(\S+?)\s*$/.exec(marker.attrs.trim()) || /\bgen=(\S+)@(\S+)/.exec(marker.attrs);
      if (!field || !field[1]) problems.push(`\`kb:auto start\` marker has no \`field=<name>\`: ${marker.text.trim()}`);
      if (!hash) problems.push(`\`kb:auto start\` marker has no \`hash=sha256:<hex>\`: ${marker.text.trim()}`);
      else if (!/^sha256:[0-9a-f]{64}$/i.test(hash[1])) problems.push(`\`kb:auto start\` hash \`${hash[1]}\` does not parse as sha256:<64 hex chars>`);
      if (!gen) problems.push(`\`kb:auto start\` marker has no \`gen=<model>@<prompt_version>\`: ${marker.text.trim()}`);
      open = marker;
    } else {
      if (!open) problems.push('a `kb:auto end` marker has no matching `kb:auto start`');
      else blocks++;
      open = null;
    }
  }
  if (open) problems.push(`\`kb:auto start\` marker is never closed: ${open.text.trim()}`);
  return { problems, blocks };
}

function trigrams(text) {
  const s = String(text).toLowerCase().replace(/\s+/g, ' ').trim();
  const out = new Set();
  for (let i = 0; i + 3 <= s.length; i++) out.add(s.slice(i, i + 3));
  return out;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

// ------------------------------------------------- built-in YAML subset ------
// Supports what card frontmatter and a hand-authored taxonomy need: block maps,
// block sequences (of scalars or maps), flow sequences and maps, quoted and
// bare scalars, `|`/`>` block scalars, comments. It is NOT a YAML 1.2 parser:
// anchors, aliases and complex keys throw, and a bare `---` line is ignored
// rather than starting a second document.

export function parseYamlSubset(text) {
  const lines = [];
  const src = String(text).replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  for (let i = 0; i < src.length; i++) {
    const raw = src[i];
    if (/^\s*(#|$)/.test(raw)) continue;
    if (/^(---|\.\.\.)\s*$/.test(raw)) continue;
    if (/^\s*[&*]\w/.test(raw)) throw new Error(`anchors and aliases are not supported (line ${i + 1})`);
    lines.push({ indent: raw.match(/^\s*/)[0].length, raw, no: i + 1 });
  }
  if (!lines.length) return {};
  const state = { i: 0, lines, src };
  const value = parseNode(state, lines[0].indent);
  if (state.i < lines.length) throw new Error(`unexpected indentation at line ${lines[state.i].no}`);
  return value;
}

function lineContent(line) {
  return stripComment(line.raw.slice(line.indent));
}

function stripComment(s) {
  let quote = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) {
      if (c === '\\' && quote === '"') i++;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '#' && (i === 0 || /\s/.test(s[i - 1]))) return s.slice(0, i).trimEnd();
  }
  return s.trimEnd();
}

function parseNode(state, indent) {
  const line = state.lines[state.i];
  if (!line) return null;
  const content = lineContent(line);
  if (content.startsWith('- ') || content === '-') return parseSeq(state, indent);
  return parseMap(state, indent);
}

function parseSeq(state, indent) {
  const out = [];
  while (state.i < state.lines.length) {
    const line = state.lines[state.i];
    if (line.indent !== indent) break;
    const content = lineContent(line);
    if (!(content.startsWith('- ') || content === '-')) break;
    const afterDash = content.slice(1);
    const lead = afterDash.length - afterDash.trimStart().length;
    const offset = line.indent + 1 + lead;
    const rest = afterDash.trim();
    if (!rest) {
      state.i++;
      const next = state.lines[state.i];
      out.push(next && next.indent > indent ? parseNode(state, next.indent) : null);
      continue;
    }
    if (isMapEntry(rest)) {
      // Re-enter the item as a map whose first line starts at `offset`.
      state.lines[state.i] = { indent: offset, raw: ' '.repeat(offset) + rest, no: line.no };
      out.push(parseMap(state, offset));
      continue;
    }
    out.push(parseScalar(rest));
    state.i++;
  }
  return out;
}

function isMapEntry(s) {
  if (s.startsWith('[') || s.startsWith('{')) return false;
  const m = /^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^:#]+?)\s*:(\s|$)/.exec(s);
  return Boolean(m);
}

function parseMap(state, indent) {
  const out = {};
  while (state.i < state.lines.length) {
    const line = state.lines[state.i];
    if (line.indent < indent) break;
    if (line.indent > indent) throw new Error(`unexpected indentation at line ${line.no}`);
    const content = lineContent(line);
    if (content.startsWith('- ') || content === '-') break;
    const m = /^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*'|[^:#]+?)\s*:(?:\s+([\s\S]*))?$/.exec(content);
    if (!m) throw new Error(`line ${line.no} is not \`key: value\`: ${content.slice(0, 80)}`);
    const key = parseScalar(m[1]);
    const inline = (m[2] || '').trim();
    state.i++;
    if (inline === '|' || inline === '|-' || inline === '>' || inline === '>-' || inline === '|+' || inline === '>+') {
      out[key] = parseBlockScalar(state, indent, inline);
      continue;
    }
    if (inline) {
      out[key] = parseScalar(inline);
      continue;
    }
    const next = state.lines[state.i];
    if (!next) {
      out[key] = null;
      continue;
    }
    if (next.indent > indent) out[key] = parseNode(state, next.indent);
    else if (next.indent === indent && (lineContent(next).startsWith('- ') || lineContent(next) === '-')) out[key] = parseSeq(state, indent);
    else out[key] = null;
  }
  return out;
}

function parseBlockScalar(state, indent, style) {
  const pieces = [];
  let blockIndent = null;
  while (state.i < state.lines.length) {
    const line = state.lines[state.i];
    if (line.indent <= indent) break;
    if (blockIndent === null) blockIndent = line.indent;
    pieces.push(line.raw.slice(blockIndent));
    state.i++;
  }
  const folded = style.startsWith('>');
  let text = folded ? pieces.join(' ') : pieces.join('\n');
  if (style.endsWith('-')) text = text.replace(/\n+$/, '');
  return text;
}

function splitFlow(inner) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let current = '';
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (quote) {
      current += c;
      if (c === '\\' && quote === '"') {
        current += inner[++i] ?? '';
      } else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      current += c;
      continue;
    }
    if (c === '[' || c === '{') depth++;
    if (c === ']' || c === '}') depth--;
    if (c === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += c;
  }
  if (current.trim()) parts.push(current);
  return parts.map((p) => p.trim()).filter((p) => p.length);
}

function parseScalar(token) {
  const s = String(token).trim();
  if (!s) return null;
  if (s.startsWith('"') && s.endsWith('"') && s.length > 1) {
    return s
      .slice(1, -1)
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
  if (s.startsWith("'") && s.endsWith("'") && s.length > 1) return s.slice(1, -1).replace(/''/g, "'");
  if (s.startsWith('[') && s.endsWith(']')) return splitFlow(s.slice(1, -1)).map(parseScalar);
  if (s.startsWith('{') && s.endsWith('}')) {
    const out = {};
    for (const part of splitFlow(s.slice(1, -1))) {
      const idx = part.indexOf(':');
      if (idx === -1) throw new Error(`flow mapping entry is not \`key: value\`: ${part}`);
      out[parseScalar(part.slice(0, idx))] = parseScalar(part.slice(idx + 1));
    }
    return out;
  }
  if (s === 'null' || s === '~') return null;
  if (s === 'true' || s === 'True') return true;
  if (s === 'false' || s === 'False') return false;
  if (/^-?\d+$/.test(s)) return Number.parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return Number.parseFloat(s);
  return s;
}

// ------------------------------------------------------------------- entry --

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    process.exitCode = await main();
  } catch (e) {
    console.error(`kb validate failed to run: ${e.stack || e.message}`);
    process.exitCode = 1;
  }
}
