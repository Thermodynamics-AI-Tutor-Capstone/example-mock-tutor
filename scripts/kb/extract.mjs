#!/usr/bin/env node
// Stage 1 — structure-aware split. No LLM, no API key, no network.
//
// ⚠ THE ONE THING THAT MATTERS IN THIS FILE: the chunk indices it assigns must be
// byte-for-byte the indices scripts/build-knowledge.mjs assigns at Vercel build
// time. agent/knowledge-brain/context/<file-slug>.md keys its situating lines to those indices,
// and if the two ever disagree every caption attaches to the wrong chunk — silently,
// and in a way no test would notice without a corpus.
//
// So this stage does NOT have its own chunker. It imports `segmentExtraction` from
// the compiler (read-only; the compiler is owned by the runtime side and is never
// edited here) and groups the compiler's own output into sections for the per-section
// LLM calls. The only thing duplicated is raw text extraction — unpdf/mammoth/jszip
// — because the compiler does not export it. Those three functions are kept
// character-identical to the compiler's, including the `form` discriminator they
// return, so `segmentExtraction` sees exactly what it would see at build time.

import fsp from 'node:fs/promises';
import path from 'node:path';
import { segmentExtraction } from '../build-knowledge.mjs';
import {
  BASE_FLAGS,
  SUPPORTED_TYPES,
  firstLine,
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

export const EXTRACTOR_VERSION = 'kb-extract@1';
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

// One LLM call covers one section. A section longer than this is split into
// consecutive parts so a 200-slide deck cannot produce one enormous call.
export const MAX_CHUNKS_PER_SECTION = 10;

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', deg: '°', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };

function decodeEntities(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
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

function htmlToText(html) {
  return decodeEntities(
    String(html)
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

/* ------------------------------------------------------------ extractors - */
// Kept identical to scripts/build-knowledge.mjs. If that file's extractors change,
// these must change with them; the `form` field is the contract segmentExtraction
// dispatches on.

async function extractPdf(buffer) {
  const { getDocumentProxy, extractText } = await import('unpdf');
  const pdf = await getDocumentProxy(new Uint8Array(buffer), { verbosity: 0 });
  try {
    const { totalPages, text } = await extractText(pdf, { mergePages: false });
    const pages = Array.isArray(text) ? text : [String(text || '')];
    return { pages: totalPages, form: 'pages', pageTexts: pages };
  } finally {
    try {
      await pdf.destroy();
    } catch {}
  }
}

async function extractDocx(buffer) {
  const mammoth = (await import('mammoth')).default;
  try {
    const { value } = await mammoth.convertToHtml({ buffer });
    if (value && /<h[1-6][\s>]/i.test(value)) return { pages: null, form: 'html', html: value };
    if (value) return { pages: null, form: 'text', text: htmlToText(value) };
  } catch {}
  const { value } = await mammoth.extractRawText({ buffer });
  return { pages: null, form: 'text', text: value };
}

function slideXmlText(xml) {
  const paragraphs = [];
  const cleaned = String(xml).replace(/<a:p\s*\/>/g, '');
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
  for (const m of String(xml).matchAll(/<Relationship\b([^>]*)\/?>/g)) {
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
  return { pages: slidePaths.length, form: 'slides', pageTexts: pages };
}

async function extractRaw(type, buffer) {
  switch (type) {
    case 'pdf':
      return extractPdf(buffer);
    case 'docx':
      return extractDocx(buffer);
    case 'pptx':
      return extractPptx(buffer);
    case 'html':
      return { pages: null, form: 'html', html: buffer.toString('utf8') };
    case 'csv':
      return { pages: null, form: 'csv', text: buffer.toString('utf8') };
    default:
      return { pages: null, form: 'text', text: buffer.toString('utf8') };
  }
}

/* ------------------------------------------------------------ sectioning - */

/**
 * Group the compiler's flat chunk list into sections.
 *
 * A section is a run of consecutive chunks that share a structural identity:
 * the detected section heading when there is one (so a numbered section that spans
 * pages stays one section), otherwise the page or slide. Runs longer than
 * MAX_CHUNKS_PER_SECTION are split into numbered parts so one call stays bounded.
 *
 * This regrouping affects only which chunks share an LLM call. It never changes a
 * chunk's index, its text, or its page.
 */
export function groupSections(chunks, { maxChunks = MAX_CHUNKS_PER_SECTION } = {}) {
  const sections = [];
  let current = null;
  const keyOf = (c) => (c.section ? `sec:${c.section}` : `page:${c.page ?? 0}`);

  chunks.forEach((chunk, index) => {
    const key = keyOf(chunk);
    if (!current || current.key !== key || current.chunks.length >= maxChunks) {
      const continued = current && current.key === key;
      current = {
        index: sections.length,
        key,
        title: chunk.section || firstLine(chunk.text, 90) || `Part ${sections.length + 1}`,
        kind: chunk.section ? 'section' : chunk.page ? 'page' : 'document',
        page: chunk.page ?? null,
        endPage: chunk.page ?? null,
        continuedFrom: continued ? sections.length - 1 : null,
        chunks: [],
      };
      sections.push(current);
    }
    current.chunks.push({ index, id: index, page: chunk.page ?? null, section: sections.length - 1, chars: chunk.text.length, text: chunk.text });
    if (chunk.page != null) current.endPage = chunk.page;
    if (current.page == null && chunk.page != null) current.page = chunk.page;
  });

  for (const section of sections) {
    section.text = section.chunks.map((c) => c.text).join('\n\n');
    section.chars = section.text.length;
    if (section.continuedFrom !== null) section.title = `${section.title} (cont.)`;
  }
  return sections;
}

export async function extractFile({ relPath, full, type, buffer = null }) {
  const bytes = buffer ?? (await fsp.readFile(full));
  if (bytes.length > MAX_FILE_BYTES) throw new Error('larger than 25 MB');
  const digest = sha256(bytes);

  const extracted = await extractRaw(type, bytes);
  // The compiler's own splitter, imported rather than reimplemented.
  const chunks = segmentExtraction(type, extracted).filter((c) => c.text && c.text.trim());
  const sections = groupSections(chunks);

  return {
    path: relPath,
    type,
    bytes: bytes.length,
    sha256: digest,
    pages: extracted.pages ?? null,
    form: extracted.form,
    chars: chunks.reduce((n, c) => n + c.text.length, 0),
    chunkCount: chunks.length,
    extractor: EXTRACTOR_VERSION,
    outline: sections.map((s) => ({ index: s.index, title: s.title, kind: s.kind, page: s.page })),
    sections,
  };
}

export async function extractAll({ knowledgeDir, files = null, limit = null } = {}) {
  let targets = files;
  if (!targets) {
    const entries = await walkKnowledge(knowledgeDir);
    targets = entries
      .filter((e) => !e.symlink)
      .map((e) => ({ path: e.path, full: e.full, type: SUPPORTED_TYPES[path.extname(e.path).toLowerCase()] }))
      .filter((e) => e.type);
  }
  if (Number.isFinite(limit) && limit > 0) targets = targets.slice(0, limit);

  const out = [];
  const skipped = [];
  for (const target of targets) {
    try {
      const result = await extractFile({ relPath: target.path, full: target.full, type: target.type });
      if (!result.chunkCount) {
        skipped.push({ path: target.path, reason: target.type === 'pdf' ? 'no extractable text (scanned? needs OCR)' : 'no extractable text' });
        continue;
      }
      out.push(result);
    } catch (e) {
      skipped.push({ path: target.path, reason: String(e?.message || e).replace(/\s+/g, ' ').slice(0, 300) });
    }
  }
  return {
    version: 1,
    extractor: EXTRACTOR_VERSION,
    segmenter: 'scripts/build-knowledge.mjs segmentExtraction (imported, not duplicated)',
    builtAt: new Date().toISOString(),
    files: out,
    skipped,
  };
}

export function summarizeSegments(segments) {
  const lines = [];
  const sections = segments.files.reduce((n, f) => n + f.sections.length, 0);
  const chunks = segments.files.reduce((n, f) => n + f.chunkCount, 0);
  lines.push(`${fmtInt(segments.files.length)} file(s) → ${fmtInt(sections)} section(s) → ${fmtInt(chunks)} chunk(s).`);
  for (const f of segments.files) {
    const kinds = [...new Set(f.sections.map((s) => s.kind))].join('+');
    lines.push(`  + ${f.path} (${f.type}/${f.form}, ${f.pages ?? '—'} pages) → ${fmtInt(f.sections.length)} ${kinds} section(s), ${fmtInt(f.chunkCount)} chunks`);
  }
  for (const s of segments.skipped) lines.push(`  ! ${s.path}: ${s.reason}`);
  return lines.join('\n');
}

const FLAGS = mergeFlagSpec(BASE_FLAGS, { booleans: ['all'], flags: { plan: 'string' } });

const USAGE = `Usage: node scripts/kb/extract.mjs [options]

Stage 1 of the KB ingest pipeline. Delegates chunking to the compiler's own
segmentExtraction() so the chunk indices the situating lines are keyed to are
exactly the ones Vercel will build. No network, no API key.

  --knowledge-dir DIR  raw uploads   (default agent/raw-course-files)
  --out DIR            work dir      (default build/kb; writes segments.json)
  --plan FILE          only extract the files in this plan.json (default build/kb/plan.json)
  --all                ignore the plan and extract everything
  --limit N            stop after N files
  --help
`;

runCli(import.meta.url, async (argv) => {
  const args = parseArgs(argv, FLAGS);
  if (args.help) {
    console.log(USAGE);
    return 0;
  }
  const { knowledgeDir, workDir } = resolveDirs(args);

  let files = null;
  if (!args.all) {
    const planPath = args.plan ? path.resolve(args.plan) : path.join(workDir, 'plan.json');
    const plan = await readJson(planPath, null);
    if (plan) {
      files = plan.work.map((w) => ({ path: w.path, full: w.full ?? path.join(knowledgeDir, w.path), type: w.type }));
      if (!files.length) {
        console.log('[extract] nothing to do — the plan is empty. Use --all to re-extract every file.');
        return 0;
      }
    }
  }

  const segments = await extractAll({ knowledgeDir, files, limit: args.limit });
  // build/ is gitignored and ephemeral, so it is written even on a dry run.
  // --dry-run means "no LLM calls, and nothing written under agent/knowledge-brain/".
  const out = path.join(workDir, 'segments.json');
  await writeJsonAtomic(out, segments);
  console.log(`[extract] wrote ${relLabel(out)}`);
  console.log(`[extract] ${summarizeSegments(segments)}`);
  return 0;
});
