import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { INDEX_PATH, knowledgeDir, knowledgeRootLabel } from '../lib/knowledge.js';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const CHUNK_CHARS = 1500;

const TYPES = {
  '.md': 'md',
  '.txt': 'txt',
  '.csv': 'csv',
  '.json': 'json',
  '.html': 'html',
  '.htm': 'html',
  '.pdf': 'pdf',
  '.docx': 'docx',
  '.pptx': 'pptx',
};

const REASON_UNSUPPORTED = 'unsupported file type';
const REASON_TOO_LARGE = 'larger than 25 MB';
const REASON_NO_PDF_TEXT = 'no extractable text (scanned? needs OCR)';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', deg: '°', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try {
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      } catch {
        return m;
      }
    }
    const v = ENTITIES[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}

function normalizeText(text) {
  return String(text || '')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/[^\S\n]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function htmlToText(html) {
  return decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1\s*>/gi, ' ')
      .replace(/<head\b[\s\S]*?<\/head\s*>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?(p|div|section|article|header|footer|main|aside|nav|h[1-6]|ul|ol|table|thead|tbody|blockquote|pre|figure|hr)\b[^>]*>/gi, '\n\n')
      .replace(/<\/?(li|tr|dt|dd|caption)\b[^>]*>/gi, '\n')
      .replace(/<\/(td|th)\s*>/gi, '\t')
      .replace(/<[^>]+>/g, '')
  ).replace(/[ \t]+/g, ' ');
}

function hardSplit(paragraph, max) {
  const out = [];
  let rest = paragraph;
  while (rest.length > max) {
    let cut = rest.lastIndexOf('\n', max);
    if (cut < max * 0.5) {
      const sentence = Math.max(rest.lastIndexOf('. ', max), rest.lastIndexOf('? ', max), rest.lastIndexOf('! ', max));
      cut = sentence === -1 ? -1 : sentence + 1;
    }
    if (cut < max * 0.5) cut = rest.lastIndexOf(' ', max);
    if (cut < max * 0.5) {
      cut = max;
      const code = rest.charCodeAt(cut - 1);
      if (code >= 0xd800 && code <= 0xdbff) cut--;
    }
    const head = rest.slice(0, cut).trim();
    if (head) out.push(head);
    rest = rest.slice(cut).trim();
  }
  if (rest) out.push(rest);
  return out;
}

export function chunkText(text, max = CHUNK_CHARS) {
  const paragraphs = normalizeText(text)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .flatMap((p) => (p.length > max ? hardSplit(p, max) : [p]));
  const chunks = [];
  let current = '';
  for (const p of paragraphs) {
    if (current && current.length + 2 + p.length > max) {
      chunks.push(current);
      current = p;
    } else {
      current = current ? `${current}\n\n${p}` : p;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function pagesToChunks(pageTexts) {
  const chunks = [];
  pageTexts.forEach((text, i) => {
    for (const piece of chunkText(text)) chunks.push({ id: chunks.length, page: i + 1, text: piece });
  });
  return chunks;
}

function plainToChunks(text) {
  return chunkText(text).map((piece, id) => ({ id, page: null, text: piece }));
}

async function extractPdf(buffer) {
  const { getDocumentProxy, extractText } = await import('unpdf');
  const pdf = await getDocumentProxy(new Uint8Array(buffer), { verbosity: 0 });
  try {
    const { totalPages, text } = await extractText(pdf, { mergePages: false });
    const pages = Array.isArray(text) ? text : [String(text || '')];
    return { pages: totalPages, chunks: pagesToChunks(pages) };
  } finally {
    try {
      await pdf.destroy();
    } catch {}
  }
}

async function extractDocx(buffer) {
  const mammoth = (await import('mammoth')).default;
  const { value } = await mammoth.extractRawText({ buffer });
  return { pages: null, chunks: plainToChunks(value) };
}

function slideXmlText(xml) {
  const paragraphs = [];
  const cleaned = xml.replace(/<a:p\s*\/>/g, '');
  for (const m of cleaned.matchAll(/<a:p(?:\s[^>]*)?>([\s\S]*?)<\/a:p>/g)) {
    const body = m[1].replace(/<a:br\s*\/?>/g, '<a:t>\n</a:t>');
    const runs = [...body.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)].map((r) => decodeEntities(r[1]));
    const line = runs.join('').trim();
    if (line) paragraphs.push(line);
  }
  return paragraphs;
}

function relsMap(xml) {
  const map = new Map();
  if (!xml) return map;
  for (const m of xml.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
    const attrs = m[1];
    const id = attrs.match(/\bId="([^"]*)"/)?.[1];
    const target = attrs.match(/\bTarget="([^"]*)"/)?.[1];
    const type = attrs.match(/\bType="([^"]*)"/)?.[1] || '';
    if (id && target) map.set(id, { target: decodeEntities(target), type });
  }
  return map;
}

function resolveZipPath(baseDir, target) {
  if (target.startsWith('/')) return target.slice(1);
  return path.posix.normalize(path.posix.join(baseDir, target));
}

async function extractPptx(buffer) {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(buffer);
  const read = async (name) => {
    const entry = zip.file(name);
    return entry ? entry.async('string') : null;
  };

  let slidePaths = [];
  const presentation = await read('ppt/presentation.xml');
  const presRels = relsMap(await read('ppt/_rels/presentation.xml.rels'));
  if (presentation) {
    for (const m of presentation.matchAll(/<p:sldId\b[^>]*\br:id="([^"]+)"/g)) {
      const rel = presRels.get(m[1]);
      if (rel) {
        const p = resolveZipPath('ppt', rel.target);
        if (zip.file(p)) slidePaths.push(p);
      }
    }
  }
  if (!slidePaths.length) {
    slidePaths = Object.keys(zip.files)
      .map((name) => ({ name, n: Number(name.match(/^ppt\/slides\/slide(\d+)\.xml$/)?.[1]) }))
      .filter((s) => Number.isFinite(s.n))
      .sort((a, b) => a.n - b.n)
      .map((s) => s.name);
  }

  const pages = [];
  for (const slidePath of slidePaths) {
    const lines = slideXmlText((await read(slidePath)) || '');
    const dir = path.posix.dirname(slidePath);
    const rels = relsMap(await read(`${dir}/_rels/${path.posix.basename(slidePath)}.rels`));
    for (const rel of rels.values()) {
      if (!rel.type.endsWith('/notesSlide')) continue;
      const notesXml = await read(resolveZipPath(dir, rel.target));
      const notes = notesXml ? slideXmlText(notesXml).filter((l) => !/^\d+$/.test(l)) : [];
      if (notes.length) lines.push('', `Speaker notes: ${notes.join('\n')}`);
    }
    pages.push(lines.join('\n'));
  }
  return { pages: slidePaths.length, chunks: pagesToChunks(pages) };
}

async function extractFile(type, buffer) {
  switch (type) {
    case 'pdf':
      return extractPdf(buffer);
    case 'docx':
      return extractDocx(buffer);
    case 'pptx':
      return extractPptx(buffer);
    case 'html':
      return { pages: null, chunks: plainToChunks(htmlToText(buffer.toString('utf8'))) };
    default:
      return { pages: null, chunks: plainToChunks(buffer.toString('utf8')) };
  }
}

function isIgnoredName(name) {
  return name.startsWith('.') || name.toLowerCase() === 'readme.md';
}

async function walk(dir, rel, out) {
  let entries;
  try {
    entries = await fsp.readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (!rel && e.code === 'ENOENT') return false;
    if (!rel) throw e;
    out.push({ relPath: rel, error: `could not read folder: ${e.message}` });
    return true;
  }
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, relPath, out);
    else if (entry.isSymbolicLink()) out.push({ relPath, full, symlink: true });
    else if (entry.isFile() && !isIgnoredName(entry.name)) out.push({ relPath, full });
  }
  return true;
}

export async function buildKnowledgeIndex({ dir = knowledgeDir(), out = INDEX_PATH } = {}) {
  const root = knowledgeRootLabel(dir);
  const found = [];
  const exists = await walk(dir, '', found);
  const files = [];
  const skipped = [];

  for (const item of found) {
    if (item.error) {
      skipped.push({ path: item.relPath, reason: item.error });
      continue;
    }
    if (item.symlink) {
      skipped.push({ path: item.relPath, reason: 'symbolic link (not followed)' });
      continue;
    }
    const type = TYPES[path.extname(item.relPath).toLowerCase()];
    if (!type) {
      skipped.push({ path: item.relPath, reason: REASON_UNSUPPORTED });
      continue;
    }
    try {
      const stat = await fsp.stat(item.full);
      if (stat.size > MAX_FILE_BYTES) {
        skipped.push({ path: item.relPath, reason: REASON_TOO_LARGE });
        continue;
      }
      const buffer = await fsp.readFile(item.full);
      const { pages, chunks } = await extractFile(type, buffer);
      const chars = chunks.reduce((n, c) => n + c.text.length, 0);
      if (!chars) {
        skipped.push({ path: item.relPath, reason: type === 'pdf' ? REASON_NO_PDF_TEXT : 'no extractable text' });
        continue;
      }
      files.push({ path: item.relPath, type, bytes: stat.size, pages: pages ?? null, chars, chunks });
    } catch (e) {
      const message = String(e?.message || e).replace(/\s+/g, ' ').slice(0, 300);
      skipped.push({ path: item.relPath, reason: `could not extract text: ${message}` });
    }
  }

  const index = { builtAt: new Date().toISOString(), root, files, skipped };
  if (out) {
    await fsp.mkdir(path.dirname(out), { recursive: true });
    const tmp = `${out}.${process.pid}.${Date.now()}.tmp`;
    await fsp.writeFile(tmp, JSON.stringify(index));
    await fsp.rename(tmp, out);
  }
  Object.defineProperty(index, 'folderMissing', { value: !exists, enumerable: false });
  return index;
}

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-US') : '—');

function mdCell(s) {
  const text = String(s).replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
  return text.includes('`') ? text : `\`${text}\``;
}

function mdText(s) {
  return String(s).replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
}

export function summaryMarkdown(index) {
  const lines = ['## Kelvin AI course materials', ''];
  const chunks = index.files.reduce((n, f) => n + f.chunks.length, 0);
  const chars = index.files.reduce((n, f) => n + f.chars, 0);
  if (index.files.length) {
    lines.push('| File | Type | Pages | Characters |', '|---|---|---:|---:|');
    for (const f of index.files) lines.push(`| ${mdCell(f.path)} | ${f.type} | ${fmt(f.pages)} | ${fmt(f.chars)} |`);
  } else {
    lines.push(`No course materials were indexed. Add files to \`${index.root}/\` (for example with **Add file → Upload files** on GitHub).`);
  }
  lines.push('');
  if (index.skipped.length) {
    lines.push('### Skipped files', '', '| File | Reason |', '|---|---|');
    for (const s of index.skipped) lines.push(`| ${mdCell(s.path)} | ${mdText(s.reason)} |`);
    lines.push('');
  }
  lines.push(
    `**Totals:** ${fmt(index.files.length)} file${index.files.length === 1 ? '' : 's'} indexed ` +
      `(${fmt(chars)} characters in ${fmt(chunks)} chunks), ${fmt(index.skipped.length)} skipped.`,
    ''
  );
  return lines.join('\n');
}

export function summaryText(index, out) {
  const chunks = index.files.reduce((n, f) => n + f.chunks.length, 0);
  const chars = index.files.reduce((n, f) => n + f.chars, 0);
  const lines = [];
  if (index.folderMissing) lines.push(`Knowledge folder ${index.root} does not exist; writing an empty index.`);
  lines.push(
    `Indexed ${index.files.length} course file${index.files.length === 1 ? '' : 's'} from ${index.root} ` +
      `(${fmt(chars)} characters, ${fmt(chunks)} chunks); skipped ${index.skipped.length}.`
  );
  for (const f of index.files) lines.push(`  + ${f.path} (${f.type}, ${f.pages ?? '-'} pages, ${fmt(f.chars)} chars)`);
  for (const s of index.skipped) lines.push(`  - ${s.path}: ${s.reason}`);
  if (out) lines.push(`Wrote ${path.relative(process.cwd(), out) || out}`);
  return lines.join('\n');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const [flag, inline] = a.startsWith('--') && a.includes('=') ? [a.slice(0, a.indexOf('=')), a.slice(a.indexOf('=') + 1)] : [a, undefined];
    if (flag === '--summary' || flag === '--dir' || flag === '--out') {
      const value = inline ?? argv[++i];
      if (value === undefined) throw new Error(`${flag} needs a value`);
      args[flag.slice(2)] = value;
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const dir = args.dir ? path.resolve(args.dir) : knowledgeDir();
    const out = args.out ? path.resolve(args.out) : INDEX_PATH;
    const index = await buildKnowledgeIndex({ dir, out });
    console.log(summaryText(index, out));
    if (args.summary) fs.appendFileSync(args.summary, summaryMarkdown(index) + '\n');
  } catch (e) {
    console.error(`build-knowledge failed: ${e.message}`);
    process.exit(1);
  }
}
