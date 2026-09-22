import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  childrenOf,
  indexCardsById,
  nearestIds,
  normalizeKind,
  resolveIds,
} from './kb.js';

export const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_KNOWLEDGE_DIR = path.join(APP_DIR, 'agent', 'raw-course-files');
export const INDEX_PATH = path.join(APP_DIR, 'build', 'knowledge-index.json');

const DEFAULT_RESULTS = 5;
const MAX_RESULTS = 8;
const DEFAULT_READ_CHARS = 6000;
const MIN_READ_CHARS = 500;
const MAX_READ_CHARS = 12000;
const SNIPPET_CHARS = 400;
const BM25_K1 = 1.2;
const BM25_B = 0.75;
const MAX_LIST_CARDS = 30;

// One flat BM25 pool holds card text and leaf chunks together — RAPTOR's "collapsed tree" result,
// which beat strict top-down traversal, reproduced here with no embeddings. Two knobs make the
// mixture behave:
//
//   CARD_FIELD_WEIGHTS — a card's title and description are the parts a human wrote to be matched
//   on, so their terms count 3× and 2× against 1× for the body. Without this a long body drowns the
//   one line that actually identifies the card.
//
//   CARD_SCORE_BOOST = 1.25 — BM25's length normalisation (b=0.75) penalises documents longer than
//   the pool average, and a card (title + description + body) is several times a ~800-char chunk, so
//   in a mixed pool cards are systematically under-scored for reasons that have nothing to do with
//   relevance. 1.25 is enough to let a card outrank a marginally better raw chunk — and a card hit
//   is the cheaper next step, since open_card returns a bounded card while read_course_file returns
//   up to 6,000 characters. It is deliberately small: anything larger would starve the raw-text hits
//   that quoting a slide depends on, and RAPTOR's finding is that mixing summaries with leaves helps,
//   not that summaries should dominate.
//
// Honest caveat: 1.25 is a reasoned guess, not a measured value. Nothing in this repo has been
// evaluated against a question set yet (there is no question set), and the arm-A/arm-B harness in
// the design is what would actually settle it.
const CARD_SCORE_BOOST = 1.25;
const CARD_FIELD_WEIGHTS = { title: 3, description: 2, body: 1 };

export function knowledgeDir() {
  const override = (process.env.KNOWLEDGE_DIR || '').trim();
  return override ? path.resolve(APP_DIR, override) : DEFAULT_KNOWLEDGE_DIR;
}

export function knowledgeRootLabel(dir = knowledgeDir()) {
  const rel = path.relative(APP_DIR, dir);
  if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) return rel.split(path.sep).join('/');
  return dir;
}

export function emptyIndex(root = knowledgeRootLabel()) {
  return { version: 2, builtAt: null, root, l0: '', l0Tokens: 0, files: [], cards: [], skipped: [] };
}

function stem(token) {
  if (token.length <= 3 || /^\d+$/.test(token)) return token;
  if (token.endsWith('ies') && token.length > 4) return token.slice(0, -3) + 'y';
  if (token.endsWith('sses')) return token.slice(0, -2);
  if (/(?:s|x|z|ch|sh)es$/.test(token)) return token.slice(0, -2);
  if (token.endsWith('s') && !/(?:ss|us|is)$/.test(token)) return token.slice(0, -1);
  return token;
}

export function tokenize(text) {
  const raw = String(text || '').toLowerCase().normalize('NFKC').match(/[\p{L}\p{N}]+/gu) || [];
  const out = [];
  for (const t of raw) {
    if (t.length < 2 && !/\d/.test(t)) continue;
    out.push(stem(t));
  }
  return out;
}

function normalizePath(p) {
  let s = String(p || '').trim().replace(/\\/g, '/');
  s = s.replace(/^\.\//, '').replace(/^\/+/, '');
  for (const prefix of ['agent/raw-course-files/', 'knowledge/']) {
    if (s.toLowerCase().startsWith(prefix)) {
      s = s.slice(prefix.length);
      break;
    }
  }
  return s;
}

function clampInt(value, fallback, min, max) {
  const n = Number(value);
  if (value === undefined || value === null || !Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

function unitLabel(file) {
  return file.type === 'pptx' ? 'slide' : 'page';
}

function makeSnippet(text, terms, phrase) {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= SNIPPET_CHARS) return flat;
  const lower = flat.toLowerCase();
  let pos = phrase ? lower.indexOf(phrase) : -1;
  if (pos === -1) {
    for (const t of terms) {
      const i = lower.indexOf(t);
      if (i !== -1 && (pos === -1 || i < pos)) pos = i;
    }
  }
  if (pos === -1) pos = 0;
  const budget = SNIPPET_CHARS - 2;
  let start = Math.max(0, pos - 120);
  if (start + budget > flat.length) start = Math.max(0, flat.length - budget);
  if (start > 0) {
    const space = flat.indexOf(' ', start);
    if (space !== -1 && space - start < 30) start = space + 1;
  }
  let end = Math.min(flat.length, start + budget);
  if (end < flat.length) {
    const space = flat.lastIndexOf(' ', end);
    if (space > start + budget - 40) end = space;
  }
  return (start > 0 ? '…' : '') + flat.slice(start, end).trim() + (end < flat.length ? '…' : '');
}

const UNVERIFIED = {
  auto: 'This card was drafted by an AI from the course files and has not been checked by an instructor. Say so if you use an assumption or a validity condition from it.',
  draft: 'This card was written by a project member, not by anyone who teaches ME 300. Say so if you use an assumption or a validity condition from it.',
  stub: 'This card is a placeholder synthesised from the course taxonomy. No course material has been assigned to it, so it contains no course content.',
};

class KnowledgeBase {
  constructor(index) {
    this.index = {
      version: Number(index?.version) || 1,
      builtAt: typeof index?.builtAt === 'string' ? index.builtAt : null,
      root: typeof index?.root === 'string' ? index.root : knowledgeRootLabel(),
      l0: typeof index?.l0 === 'string' ? index.l0 : '',
      l0Tokens: Number.isFinite(index?.l0Tokens) ? index.l0Tokens : 0,
      files: Array.isArray(index?.files) ? index.files : [],
      cards: Array.isArray(index?.cards) ? index.cards : [],
      skipped: Array.isArray(index?.skipped) ? index.skipped : [],
      l0Truncation: index?.l0Truncation ?? null,
      kbWarnings: Array.isArray(index?.kbWarnings) ? index.kbWarnings : [],
    };
    this.byPath = new Map();
    this.byLowerPath = new Map();
    this.cardById = indexCardsById(this.index.cards);
    this.postings = [];
    this.df = new Map();
    let totalLen = 0;

    for (const file of this.index.files) {
      if (!Array.isArray(file.chunks)) file.chunks = [];
      this.byPath.set(file.path, file);
      if (!this.byLowerPath.has(file.path.toLowerCase())) this.byLowerPath.set(file.path.toLowerCase(), file);
      const pathTerms = new Set(tokenize(file.path));
      file.chunks.forEach((chunk, i) => {
        const tf = new Map();
        const tokens = tokenize(chunk.text);
        for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
        // The committed situating line and the detected section heading are indexed with the chunk:
        // that is the contextual half of Anthropic's contextual-retrieval technique, and it is the
        // only part of it available without an embedding provider.
        for (const t of tokenize(`${chunk.context || ''} ${chunk.section || ''}`)) tf.set(t, (tf.get(t) || 0) + 1);
        for (const t of tf.keys()) this.df.set(t, (this.df.get(t) || 0) + 1);
        totalLen += tokens.length;
        this.postings.push({ kind: 'chunk', file, chunk, position: i, tf, length: tokens.length, extraTerms: pathTerms });
      });
    }

    for (const card of this.index.cards) {
      const tf = new Map();
      let length = 0;
      for (const [field, weight] of Object.entries(CARD_FIELD_WEIGHTS)) {
        for (const t of tokenize(card[field])) {
          tf.set(t, (tf.get(t) || 0) + weight);
          length += weight;
        }
      }
      if (!tf.size) continue;
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) || 0) + 1);
      totalLen += length;
      this.postings.push({ kind: 'card', card, tf, length, extraTerms: new Set(tokenize(card.id.replace(/[:-]/g, ' '))) });
    }

    this.avgLen = this.postings.length ? totalLen / this.postings.length : 0;
  }

  get fileCount() {
    return this.index.files.length;
  }

  get cardCount() {
    return this.index.cards.length;
  }

  get skippedCount() {
    return this.index.skipped.length;
  }

  get builtAt() {
    return this.index.builtAt;
  }

  get l0() {
    return this.index.l0;
  }

  get l0Tokens() {
    return this.index.l0Tokens;
  }

  countsByFolder() {
    const counts = new Map();
    for (const f of this.index.files) {
      const slash = f.path.indexOf('/');
      const folder = slash === -1 ? '' : f.path.slice(0, slash);
      counts.set(folder, (counts.get(folder) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => (a[0] === '' ? 1 : b[0] === '' ? -1 : a[0].localeCompare(b[0])))
      .map(([folder, count]) => ({ folder, count }));
  }

  publicIndex() {
    return {
      builtAt: this.index.builtAt,
      files: this.index.files.map(({ path: p, type, pages, chars }) => ({ path: p, type, pages, chars })),
      skipped: this.index.skipped.map(({ path: p, reason }) => ({ path: p, reason })),
    };
  }

  list() {
    return {
      files: this.index.files.map(({ path: p, type, pages, chars }) => ({ path: p, type, pages, chars })),
      skipped: this.index.skipped.map(({ path: p, reason }) => ({ path: p, reason })),
    };
  }

  findFile(requested) {
    const p = normalizePath(requested);
    return this.byPath.get(p) || this.byLowerPath.get(p.toLowerCase()) || null;
  }

  findCard(id) {
    if (typeof id !== 'string') return null;
    const wanted = id.trim();
    if (!wanted) return null;
    return this.cardById.get(wanted) || this.cardById.get(wanted.toLowerCase()) || null;
  }

  /** Every card a student may see: the audience filter for /api/kb and /api/kb/card. */
  studentCards() {
    return this.index.cards.filter((c) => c.audience === 'student' || c.audience === 'both');
  }

  // ── search ─────────────────────────────────────────────────────────────────────────────────────

  search({ query, max_results, kind } = {}) {
    if (typeof query !== 'string' || !query.trim()) return { error: 'query must be a non-empty string' };
    const limit = clampInt(max_results, DEFAULT_RESULTS, 1, MAX_RESULTS);
    const want = typeof kind === 'string' && kind.trim() ? kind.trim().toLowerCase() : 'any';
    if (!['any', 'card', 'chunk'].includes(want)) {
      return { error: `kind must be "card", "chunk" or "any" (got "${kind}")` };
    }
    const terms = [...new Set(tokenize(query))];
    if (!terms.length) return [];

    const n = this.postings.length;
    const idf = new Map();
    for (const t of terms) {
      const df = this.df.get(t) || 0;
      idf.set(t, Math.log(1 + (n - df + 0.5) / (df + 0.5)));
    }
    const phrase = query.toLowerCase().replace(/\s+/g, ' ').trim();

    const scored = [];
    for (const post of this.postings) {
      if (want !== 'any' && post.kind !== want) continue;
      let score = 0;
      let matched = 0;
      for (const t of terms) {
        const tf = post.tf.get(t);
        if (tf) {
          matched++;
          const norm = BM25_K1 * (1 - BM25_B + (BM25_B * post.length) / (this.avgLen || 1));
          score += idf.get(t) * ((tf * (BM25_K1 + 1)) / (tf + norm));
        } else if (post.extraTerms.has(t)) {
          matched++;
          score += idf.get(t) * 0.5;
        }
      }
      if (!score) continue;
      if (terms.length > 1) score *= 0.5 + (0.5 * matched) / terms.length;
      const text = post.kind === 'card' ? `${post.card.title} ${post.card.description} ${post.card.body}` : post.chunk.text;
      if (terms.length > 1 && phrase.length > 3 && text.toLowerCase().replace(/\s+/g, ' ').includes(phrase)) {
        score *= 1.5;
      }
      if (post.kind === 'card') score *= CARD_SCORE_BOOST;
      scored.push({ post, score });
    }

    const sortKey = (p) => (p.kind === 'card' ? p.card.id : `${p.file.path}#${String(p.position).padStart(6, '0')}`);
    scored.sort((a, b) => b.score - a.score || sortKey(a.post).localeCompare(sortKey(b.post)));

    let chosen = scored.slice(0, limit);
    // With kind:'any' the model asked for the mixed pool, so give it one: if a whole type is missing
    // from the result set only because it ranked just below the cut, swap the weakest hit for the
    // best hit of the missing type. At the default limit of 5 this moves at most one row.
    if (want === 'any' && limit >= 2 && scored.length > chosen.length) {
      for (const missing of ['card', 'chunk']) {
        if (chosen.some((s) => s.post.kind === missing)) continue;
        const best = scored.find((s) => s.post.kind === missing);
        if (!best) continue;
        chosen = [...chosen.slice(0, limit - 1), best];
      }
    }

    const rawTerms = [...new Set((query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter((t) => t.length > 1))];
    const snippetTerms = [...rawTerms, ...terms];
    const snippetPhrase = terms.length > 1 ? phrase : '';
    return chosen.map(({ post }) => {
      if (post.kind === 'card') {
        return {
          kind: 'card',
          id: post.card.id,
          title: post.card.title,
          description: post.card.description,
          status: post.card.status,
          snippet: makeSnippet(post.card.body || post.card.description || '', snippetTerms, snippetPhrase),
        };
      }
      return {
        kind: 'chunk',
        path: post.file.path,
        page: post.chunk.page ?? null,
        chunk: post.position,
        topic: post.chunk.card ?? null,
        snippet: makeSnippet(post.chunk.text, snippetTerms, snippetPhrase),
      };
    });
  }

  // ── cards ──────────────────────────────────────────────────────────────────────────────────────

  openCard({ id, include } = {}) {
    if (typeof id !== 'string' || !id.trim()) return { error: 'id must be a non-empty string' };
    const card = this.findCard(id);
    if (!card) {
      if (!this.index.cards.length) {
        return { error: `No knowledge cards have been compiled, so there is no card "${id}". Use search_course_files and read_course_file instead.` };
      }
      const near = nearestIds(id.trim(), [...this.cardById.keys()], 3);
      return {
        error: `No card with id "${id}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''} Call list_cards to enumerate them.`,
      };
    }

    const requested = Array.isArray(include) ? include.map((v) => String(v).toLowerCase()) : ['children'];
    const allowed = new Set(['children', 'equations', 'sources', 'objectives']);
    const unknown = requested.filter((v) => !allowed.has(v));
    if (unknown.length) return { error: `include may only contain children, equations, sources, objectives (got ${unknown.join(', ')})` };
    const want = new Set(requested);

    const out = {
      id: card.id,
      kind: card.kind,
      title: card.title,
      description: card.description,
      status: card.status,
      body: card.body,
      links: card.links,
      sources: card.sources.map((s) => ({ ...s })),
    };
    if (card.unit) out.unit = card.unit;
    if (card.parent) out.parent = card.parent;
    if (card.extra) out.fields = card.extra;
    if (card.generated) out.generated = card.generated;
    if (UNVERIFIED[card.status]) out.unverified = UNVERIFIED[card.status];

    if (want.has('children')) {
      out.children = childrenOf(this.index.cards, card.id).map((c) => ({ id: c.id, title: c.title, description: c.description }));
    }
    if (want.has('equations')) {
      out.equations = resolveIds(card.links.equations, this.cardById);
    }
    if (want.has('objectives')) {
      out.objectives = card.links.objectives.map((o) => ({ ...o }));
    }
    if (want.has('sources')) {
      out.sources = out.sources.map((s) => {
        if (!s.path) return s;
        const file = this.findFile(s.path);
        return { ...s, exists: Boolean(file), type: file?.type ?? null, chunks: file ? file.chunks.length : 0 };
      });
    }
    return out;
  }

  listCards({ kind, parent } = {}) {
    let kindName = null;
    if (kind !== undefined && kind !== null && String(kind).trim()) {
      kindName = normalizeKind(kind);
      if (!kindName) return { error: `Unknown kind "${kind}". Use one of: course, unit, topic, equation, misconception, example, item, source.` };
    }
    let parentId = null;
    if (parent !== undefined && parent !== null && String(parent).trim()) {
      parentId = String(parent).trim();
      if (!this.cardById.has(parentId)) {
        const near = nearestIds(parentId, [...this.cardById.keys()], 3);
        return { error: `No card with id "${parentId}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''}` };
      }
    }
    const matches = this.index.cards.filter(
      (c) => (!kindName || c.kind === kindName) && (!parentId || c.parent === parentId || c.unit === parentId)
    );
    matches.sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
    const out = matches.slice(0, MAX_LIST_CARDS).map((c) => ({ id: c.id, title: c.title, description: c.description, status: c.status }));
    if (matches.length > MAX_LIST_CARDS) {
      return { cards: out, truncated: true, total: matches.length, note: `Showing the first ${MAX_LIST_CARDS} of ${matches.length}. Narrow it with kind or parent.` };
    }
    return out;
  }

  // ── raw source text ────────────────────────────────────────────────────────────────────────────

  read({ path: requested, start_chunk, max_chars } = {}) {
    if (typeof requested !== 'string' || !requested.trim()) return { error: 'path must be a non-empty string' };
    const file = this.findFile(requested);
    if (!file) {
      return { error: `No course file at "${requested}". Call list_course_files to see the available paths.` };
    }
    const chunks = file.chunks;
    if (!chunks.length) return { path: file.path, text: '', next_chunk: null };
    const start = clampInt(start_chunk, 0, 0, Number.MAX_SAFE_INTEGER);
    if (start >= chunks.length) {
      return { error: `start_chunk ${start} is out of range: ${file.path} has ${chunks.length} chunks (0-${chunks.length - 1}).` };
    }
    const budget = clampInt(max_chars, DEFAULT_READ_CHARS, MIN_READ_CHARS, MAX_READ_CHARS);
    const label = unitLabel(file);
    let text = '';
    let lastPage = null;
    let i = start;
    while (i < chunks.length) {
      const chunk = chunks[i];
      let piece = '';
      if (chunk.page != null && chunk.page !== lastPage) piece += `[${label} ${chunk.page}]\n`;
      // The committed situating line from agent/knowledge-brain/context/<file-slug>.md, prefixed so it can never
      // be mistaken for the slide's own words.
      if (chunk.context) piece += `Context: ${chunk.context}\n`;
      piece += chunk.text;
      const sep = text ? '\n\n' : '';
      if (text && text.length + sep.length + piece.length > budget) break;
      if (!text && piece.length > budget) {
        text = piece.slice(0, budget);
        i++;
        break;
      }
      text += sep + piece;
      lastPage = chunk.page ?? lastPage;
      i++;
    }
    const cards = [...new Set(chunks.slice(start, i).map((c) => c.card).filter(Boolean))];
    const out = { path: file.path, text, next_chunk: i < chunks.length ? i : null };
    if (cards.length) out.cards = cards;
    return out;
  }
}

let current = null;
let pending = null;

async function readIndexFile() {
  try {
    const raw = await fsp.readFile(INDEX_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    if (e.code !== 'ENOENT') console.warn(`Could not read ${path.relative(APP_DIR, INDEX_PATH)}: ${e.message}`);
    return null;
  }
}

async function loadIndex() {
  if (!process.env.VERCEL) {
    try {
      const { buildKnowledgeIndex } = await import(pathToFileURL(path.join(APP_DIR, 'scripts', 'build-knowledge.mjs')).href);
      return await buildKnowledgeIndex({ dir: knowledgeDir(), out: INDEX_PATH });
    } catch (e) {
      console.warn(`Could not rebuild the course materials index (${e.message}); using the last built index if there is one`);
    }
  }
  const index = await readIndexFile();
  if (!index) {
    if (process.env.VERCEL) console.warn('No course materials index found in the deployment; course-file tools are off');
    return emptyIndex();
  }
  return index;
}

export async function loadKnowledge() {
  if (current) return current;
  if (!pending) {
    pending = loadIndex()
      .then((index) => {
        current = new KnowledgeBase(index);
        return current;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

export function knowledgeFromIndex(index) {
  return new KnowledgeBase(index);
}
