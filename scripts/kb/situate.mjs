#!/usr/bin/env node
// Stage 2 — situate. deepseek-flash, one call per SECTION (not per chunk).
//
// Produces a <=25-word situating line for every chunk, which the runtime compiler
// prepends to the chunk text before BM25 indexing. This is the contextual-BM25
// half of Anthropic's contextual-retrieval technique — the only half available to
// us, because the other half needs an embedding provider and a reranker we do not
// have. Their headline 49%/67% numbers are for the full four-component system and
// must NOT be quoted as an expectation for this.
//
// Output is committed markdown at agent/knowledge-brain/context/<file-slug>.md so every
// regeneration is a reviewable git diff, and the list is wrapped in a kb:auto
// block so a human's edits are never overwritten.

import fsp from 'node:fs/promises';
import path from 'node:path';
import {
  AUTO_BLOCK_OUTCOME,
  BASE_FLAGS,
  applyAutoBlock,
  clampWords,
  fileSlug,
  fmtInt,
  mergeFlagSpec,
  parseArgs,
  parseFrontmatter,
  readJson,
  relLabel,
  renderCardFile,
  resolveDirs,
  runCli,
  writeJsonAtomic,
  writeTextAtomic,
} from './ingest-common.mjs';
import { createClient, loadPrompt, parseMaxSpend } from './deepseek.mjs';

export const MAX_CONTEXT_WORDS = 25;
const SECTION_TEXT_BUDGET = 9000; // chars sent per call; sections above this are truncated with a marker

function outlineText(file, { highlight = null, max = 60 } = {}) {
  const rows = file.outline.slice(0, max).map((s) => {
    const where = s.page ? ` [${file.type === 'pptx' ? 'slide' : 'page'} ${s.page}]` : '';
    const mark = highlight === s.index ? ' <-- this section' : '';
    return `  #${s.index} ${s.title}${where}${mark}`;
  });
  if (file.outline.length > max) rows.push(`  … ${file.outline.length - max} more section(s)`);
  return rows.join('\n');
}

function chunkList(section) {
  return section.chunks
    .map((c) => `  [${c.index}] ${c.text.replace(/\s+/g, ' ').slice(0, 280)}${c.text.length > 280 ? '…' : ''}`)
    .join('\n');
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n… [section truncated at ${max} characters for this call]`;
}

/** Deterministic, zero-cost stand-in used by --dry-run. */
function dryRunCaptions(section, file) {
  return {
    captions: section.chunks.map((c) => ({
      chunk: c.index,
      context: clampWords(`${file.path} ${section.title} chunk ${c.index} (dry-run placeholder, not a real caption)`, MAX_CONTEXT_WORDS),
    })),
  };
}

/**
 * Validate a captions payload against the chunks we asked about.
 * DeepSeek's JSON mode is not schema-guaranteed, so nothing is trusted.
 */
export function validateCaptions(payload, section) {
  const wanted = new Map(section.chunks.map((c) => [c.index, c]));
  const out = new Map();
  const problems = [];
  const rows = Array.isArray(payload?.captions) ? payload.captions : [];
  for (const row of rows) {
    const idx = Number(row?.chunk);
    if (!Number.isInteger(idx) || !wanted.has(idx)) {
      problems.push(`caption for unknown chunk ${JSON.stringify(row?.chunk)}`);
      continue;
    }
    const raw = typeof row?.context === 'string' ? row.context.replace(/\s+/g, ' ').trim() : '';
    if (!raw) {
      problems.push(`empty caption for chunk ${idx}`);
      continue;
    }
    const words = raw.split(/\s+/).length;
    const context = clampWords(raw.replace(/^["']|["']$/g, ''), MAX_CONTEXT_WORDS);
    if (words > MAX_CONTEXT_WORDS) problems.push(`caption for chunk ${idx} was ${words} words, trimmed to ${MAX_CONTEXT_WORDS}`);
    out.set(idx, context);
  }
  const missing = [...wanted.keys()].filter((i) => !out.has(i));
  return { captions: out, missing, problems };
}

/** Fallback caption built from committed metadata only — no model, no invention. */
export function fallbackCaption(file, section, chunk) {
  const where = chunk.page ? `${file.type === 'pptx' ? 'slide' : 'page'} ${chunk.page}` : `section ${section.index}`;
  return clampWords(`${file.path}, ${where}: ${section.title}`, MAX_CONTEXT_WORDS);
}

export function renderContextMarkdown({ file, lines, gen, existingBody = '', previouslyWritten = false }) {
  // The line format is exactly what lib/kb.js parseContextFile() reads:
  //   - [12] <situating line>
  // Nothing else may appear after the index — a trailing comment would be indexed
  // as part of the caption. Fallback chunks are recorded in the frontmatter instead.
  const body = lines.map((l) => `- [${l.index}] ${l.context}`).join('\n');
  const applied = applyAutoBlock(existingBody, 'context_lines', body, gen, {
    previouslyWritten,
    anchor: 'Situating lines',
  });
  const fallbacks = lines.filter((l) => l.source === 'fallback').map((l) => l.index);
  const frontmatter = {
    source: file.path,
    source_sha256: `sha256:${file.sha256}`,
    extractor: file.extractor,
    // The compiler must refuse to join these lines if its own chunk count for this
    // file differs — a mismatch means every caption would attach to the wrong chunk.
    chunk_count: file.chunkCount,
    section_count: file.sections.length,
    fallback_chunks: fallbacks,
    generated: { model: gen.split('@')[0], prompt_version: gen.split('@').slice(1).join('@'), at: new Date().toISOString() },
  };
  const intro =
    `<!-- Generated by scripts/kb/situate.mjs. One <=${MAX_CONTEXT_WORDS}-word situating line per chunk of\n` +
    `     \`${file.path}\`, keyed by chunk index. The compiler prepends each line to its chunk before\n` +
    `     indexing. Edit a line to correct it: edits inside the kb:auto block are detected by hash and\n` +
    `     never overwritten. Delete the markers to pin this file forever. -->`;
  return {
    text: renderCardFile(frontmatter, `${intro}\n\n${applied.body.trim()}`),
    outcome: applied.outcome,
  };
}

/**
 * @param {{ segments, kbDir, client, limit?, onProgress? }} opts
 */
export async function situate({ segments, kbDir, client, limit = null, onProgress = null }) {
  const prompt = await loadPrompt('situate');
  const gen = `${prompt.model}@situate@${prompt.version}`;
  const files = Number.isFinite(limit) && limit > 0 ? segments.files.slice(0, limit) : segments.files;

  const result = { gen, files: [], contexts: {}, skippedHumanEdited: [], problems: [], calls: 0, fallbacks: 0 };

  for (const file of files) {
    const slug = fileSlug(file.path);
    const target = path.join(kbDir, 'context', `${slug}.md`);
    let existingBody = '';
    let previouslyWritten = false;
    try {
      const raw = await fsp.readFile(target, 'utf8');
      const parsed = parseFrontmatter(raw);
      existingBody = parsed.body;
      previouslyWritten = true;
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }

    const lines = [];
    for (const section of file.sections) {
      let captions = new Map();
      try {
        const { data } = await client.complete({
          stage: 'situate',
          prompt,
          dryRunValue: () => dryRunCaptions(section, file),
          vars: {
            FILE_PATH: file.path,
            FILE_TYPE: file.type,
            FILE_PAGES: file.pages ? `, ${file.pages} ${file.type === 'pptx' ? 'slides' : 'pages'}` : '',
            OUTLINE: outlineText(file, { highlight: section.index }),
            SECTION_INDEX: section.index,
            SECTION_TITLE: section.title,
            SECTION_KIND: section.kind,
            SECTION_PAGE: section.page ? `, ${file.type === 'pptx' ? 'slide' : 'page'} ${section.page}` : '',
            SECTION_TEXT: truncate(section.text, SECTION_TEXT_BUDGET),
            CHUNKS: chunkList(section),
          },
        });
        result.calls++;
        const validated = validateCaptions(data, section);
        captions = validated.captions;
        for (const p of validated.problems) result.problems.push(`${file.path} §${section.index}: ${p}`);
        if (validated.missing.length) {
          result.problems.push(`${file.path} §${section.index}: no caption returned for chunk(s) ${validated.missing.join(', ')}`);
        }
      } catch (e) {
        if (e.name === 'SpendLimitError') throw e;
        result.problems.push(`${file.path} §${section.index}: ${e.message}`);
      }
      for (const chunk of section.chunks) {
        const context = captions.get(chunk.index);
        if (context) lines.push({ index: chunk.index, context, source: 'model' });
        else {
          lines.push({ index: chunk.index, context: fallbackCaption(file, section, chunk), source: 'fallback' });
          result.fallbacks++;
        }
      }
      if (onProgress) onProgress({ file: file.path, section: section.index, of: file.sections.length });
    }

    lines.sort((a, b) => a.index - b.index);
    // NOTE: `force` re-runs the model, but it deliberately does NOT weaken the
    // no-clobber rule. --force means "ignore the content hashes and regenerate";
    // it never means "overwrite what a human wrote".
    const rendered = renderContextMarkdown({ file, lines, gen, existingBody, previouslyWritten });
    result.files.push({ path: file.path, slug, target, outcome: rendered.outcome, chunks: lines.length, text: rendered.text });
    if (rendered.outcome === AUTO_BLOCK_OUTCOME.SKIPPED_HUMAN_EDITED || rendered.outcome === AUTO_BLOCK_OUTCOME.SKIPPED_PINNED) {
      result.skippedHumanEdited.push({ path: file.path, target: relLabel(target), outcome: rendered.outcome });
    }
    result.contexts[file.path] = Object.fromEntries(lines.map((l) => [l.index, l.context]));
  }
  return result;
}

const FLAGS = mergeFlagSpec(BASE_FLAGS, { flags: { segments: 'string' } });

const USAGE = `Usage: node scripts/kb/situate.mjs [options]

Stage 2 of the KB ingest pipeline. One deepseek-flash call per section; writes a
<=${MAX_CONTEXT_WORDS}-word situating line per chunk to agent/knowledge-brain/context/<file-slug>.md.

  --segments FILE   segments.json from stage 1 (default build/kb/segments.json)
  --kb-dir DIR      committed cards          (default agent/knowledge-brain)
  --out DIR         work dir                 (default build/kb; writes context.json)
  --limit N         only the first N files
  --dry-run         no API key, no network, no spend; writes placeholder captions
  --max-spend USD   abort rather than exceed this (default 2.00, "none" to disable)
  --verbose
  --help

Human edits inside the kb:auto block are detected by hash and left alone.
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
    console.log('[situate] nothing to do — segments.json holds no files.');
    return 0;
  }

  const client = createClient({
    dryRun: Boolean(args.dryRun),
    maxSpend: parseMaxSpend(args.maxSpend),
    verbose: Boolean(args.verbose),
    label: 'kb',
  });

  const result = await situate({ segments, kbDir, client, limit: args.limit });

  for (const f of result.files) {
    if (f.outcome === AUTO_BLOCK_OUTCOME.WRITTEN) {
      // --dry-run never touches agent/knowledge-brain/.
      if (args.dryRun) console.log(`[situate] would write ${relLabel(f.target)} (${fmtInt(f.chunks)} lines)`);
      else {
        await writeTextAtomic(f.target, f.text);
        console.log(`[situate] wrote ${relLabel(f.target)} (${fmtInt(f.chunks)} lines)`);
      }
    } else if (f.outcome === AUTO_BLOCK_OUTCOME.UNCHANGED) {
      console.log(`[situate] unchanged ${relLabel(f.target)}`);
    } else {
      console.log(`[situate] LEFT ALONE ${relLabel(f.target)} — ${f.outcome}; the proposal is in the report, not on disk`);
    }
  }
  await writeJsonAtomic(path.join(workDir, 'context.json'), {
    version: 1,
    builtAt: new Date().toISOString(),
    gen: result.gen,
    contexts: result.contexts,
    skippedHumanEdited: result.skippedHumanEdited,
    problems: result.problems,
  });

  console.log(
    `[situate] ${fmtInt(result.calls)} call(s) over ${fmtInt(result.files.length)} file(s); ` +
      `${fmtInt(result.fallbacks)} chunk(s) fell back to a metadata-only caption; ${fmtInt(result.problems.length)} problem(s).`
  );
  for (const p of result.problems.slice(0, 20)) console.log(`  ! ${p}`);
  if (result.problems.length > 20) console.log(`  … ${result.problems.length - 20} more`);
  client.printSummary('situate — DeepSeek usage');
  return 0;
});
