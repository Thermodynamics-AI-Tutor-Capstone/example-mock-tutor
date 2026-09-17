import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_KNOWLEDGE_DIR = path.join(APP_DIR, 'agent', 'knowledge');
export const INDEX_PATH = path.join(APP_DIR, 'build', 'knowledge-index.json');

const DEFAULT_RESULTS = 5;
const MAX_RESULTS = 8;
const DEFAULT_READ_CHARS = 6000;
const MIN_READ_CHARS = 500;
const MAX_READ_CHARS = 12000;
const SNIPPET_CHARS = 400;
const BM25_K1 = 1.2;
const BM25_B = 0.75;

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
  return { builtAt: null, root, files: [], skipped: [] };
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
  for (const prefix of ['agent/knowledge/', 'knowledge/']) {
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

class KnowledgeBase {
  constructor(index) {
    this.index = {
      builtAt: typeof index?.builtAt === 'string' ? index.builtAt : null,
      root: typeof index?.root === 'string' ? index.root : knowledgeRootLabel(),
      files: Array.isArray(index?.files) ? index.files : [],
      skipped: Array.isArray(index?.skipped) ? index.skipped : [],
    };
    this.byPath = new Map();
    this.byLowerPath = new Map();
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
        for (const t of tf.keys()) this.df.set(t, (this.df.get(t) || 0) + 1);
        totalLen += tokens.length;
        this.postings.push({ file, chunk, position: i, tf, length: tokens.length, pathTerms });
      });
    }
    this.avgLen = this.postings.length ? totalLen / this.postings.length : 0;
  }

  get fileCount() {
    return this.index.files.length;
  }

  get skippedCount() {
    return this.index.skipped.length;
  }

  get builtAt() {
    return this.index.builtAt;
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

  search({ query, max_results } = {}) {
    if (typeof query !== 'string' || !query.trim()) return { error: 'query must be a non-empty string' };
    const limit = clampInt(max_results, DEFAULT_RESULTS, 1, MAX_RESULTS);
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
      let score = 0;
      let matched = 0;
      for (const t of terms) {
        const tf = post.tf.get(t);
        if (tf) {
          matched++;
          const norm = BM25_K1 * (1 - BM25_B + (BM25_B * post.length) / (this.avgLen || 1));
          score += idf.get(t) * ((tf * (BM25_K1 + 1)) / (tf + norm));
        } else if (post.pathTerms.has(t)) {
          matched++;
          score += idf.get(t) * 0.5;
        }
      }
      if (!score) continue;
      if (terms.length > 1) score *= 0.5 + (0.5 * matched) / terms.length;
      if (terms.length > 1 && phrase.length > 3 && post.chunk.text.toLowerCase().replace(/\s+/g, ' ').includes(phrase)) {
        score *= 1.5;
      }
      scored.push({ post, score });
    }
    scored.sort((a, b) => b.score - a.score || a.post.file.path.localeCompare(b.post.file.path) || a.post.position - b.post.position);
    const rawTerms = [...new Set((query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter((t) => t.length > 1))];
    return scored.slice(0, limit).map(({ post }) => ({
      path: post.file.path,
      page: post.chunk.page ?? null,
      chunk: post.position,
      snippet: makeSnippet(post.chunk.text, [...rawTerms, ...terms], terms.length > 1 ? phrase : ''),
    }));
  }

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
    return { path: file.path, text, next_chunk: i < chunks.length ? i : null };
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
