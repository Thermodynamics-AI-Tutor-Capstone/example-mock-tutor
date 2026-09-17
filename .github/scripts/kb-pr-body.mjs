#!/usr/bin/env node
// Render the review pull request body for .github/workflows/kb.yml.
//
// The body is the review surface: what the pipeline wrote, how confident the
// classifier was, what it could not place, and what it refused to touch because
// a human had edited it. The card table itself comes from `reportMarkdown` in
// scripts/kb/write-cards.mjs, which owns the report format; this script frames
// it and appends the eval delta. Every piece is optional — a missing file
// degrades to a line saying so, never to a crash, because a PR that cannot be
// described is worse than one described incompletely.

import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function parseArgs(argv) {
  const args = { report: 'build/kb-report.json', eval: 'build/kb-eval.json', sha: '', out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const eq = a.startsWith('--') && a.includes('=') ? a.indexOf('=') : -1;
    const flag = eq === -1 ? a : a.slice(0, eq);
    const value = eq === -1 ? argv[++i] : a.slice(eq + 1);
    switch (flag) {
      case '--report':
        args.report = value;
        break;
      case '--eval':
        args.eval = value;
        break;
      case '--sha':
        args.sha = value || '';
        break;
      case '--out':
        args.out = value;
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
  } catch {
    return null;
  }
}

function pct(v) {
  return typeof v === 'number' ? `${(v * 100).toFixed(0)}%` : '—';
}

function evalSection(result) {
  if (!result) return ['### Retrieval eval', '', 'No `build/kb-eval.json` — the offline eval did not run or found no corpus.', ''];
  const a = result.arms?.A || {};
  const b = result.arms?.B || {};
  const lines = ['### Retrieval eval', ''];
  lines.push(`| Arm | card recall@${result.k ?? 5} | source recall@${result.k ?? 5} | cards opened to gold | input tokens to first gold |`, '|---|---:|---:|---:|---:|');
  lines.push(`| A — flat 1500-char BM25 (today) | — | ${pct(a.sourceRecallAt5)} | — | ${a.meanTokensToFirstGold == null ? '—' : Math.round(a.meanTokensToFirstGold)} |`);
  lines.push(
    `| B — KB-1 | ${pct(b.cardRecallAt5)} | ${pct(b.sourceRecallAt5)} | ${b.meanCardsOpenedToGold == null ? '—' : b.meanCardsOpenedToGold.toFixed(2)} | ${b.meanTokensToFirstGold == null ? '—' : Math.round(b.meanTokensToFirstGold)} |`
  );
  lines.push('');
  if (result.verdict?.message) lines.push(`**${String(result.verdict.status || 'info').toUpperCase()}** — ${result.verdict.message}`, '');
  if (result.questions?.placeholders) {
    lines.push(
      `> ${result.questions.placeholders} of ${result.questions.count} eval questions are still placeholders written from the public sample syllabus, so these numbers describe the harness rather than the tutor.`,
      ''
    );
  }
  return lines;
}

function fallbackReportSection(report) {
  if (!report) return ['### Cards', '', 'No `build/kb-report.json` was produced, so this PR has no machine-written card summary. Read the diff.', ''];
  const c = report.cards || {};
  const n = (x) => (Array.isArray(x) ? x.length : 0);
  return [
    '### Cards',
    '',
    `${n(c.added)} added · ${n(c.changed)} changed · ${n(c.unchanged)} unchanged · ${n(c.skippedHumanEdited)} skipped because a human had edited them · ${n(c.protectedReviewed)} protected as reviewed · ${n(c.stale)} stale.`,
    '',
    `Unassigned sections: ${n(report.unassignedSections)} · low-confidence sections: ${n(report.lowConfidenceSections)} · proposed new topics: ${n(report.proposedTopics)}.`,
    '',
  ];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = await readJson(args.report);
  const evalResult = await readJson(args.eval);

  let cardSection = null;
  if (report) {
    try {
      const mod = await import(pathToFileURL(path.join(REPO_ROOT, 'scripts', 'kb', 'write-cards.mjs')).href);
      if (typeof mod.reportMarkdown === 'function') {
        const rendered = mod.reportMarkdown(report);
        cardSection = Array.isArray(rendered) ? rendered : String(rendered).split('\n');
      }
    } catch (e) {
      console.error(`could not render the card table with scripts/kb/write-cards.mjs (${e.message}); using the counts instead`);
    }
  }
  if (!cardSection) cardSection = fallbackReportSection(report);

  const lines = [
    '## Generated course cards — needs a human review',
    '',
    `Written by \`.github/workflows/kb.yml\` from \`agent/knowledge/\` at ${args.sha ? `\`${args.sha}\`` : 'this commit'}.`,
    '',
    '**Everything in this diff was produced by an LLM unless a card says otherwise.** LLM classification into a fixed',
    'taxonomy is good but not reliable, and auto-extracted symbol meanings and prerequisite edges are worse than that.',
    'Read the cards before merging. Anything you edit by hand is protected: the writer recomputes the hash of each',
    '`kb:auto` block and leaves edited blocks alone on the next run.',
    '',
    'Things worth looking at first:',
    '',
    '- sections the classifier could not place (`unassigned`) and the topics it proposed instead,',
    '- low-confidence classifications,',
    '- equations whose `valid_when` assumptions look wrong — that join is what catches "right equation, wrong assumptions",',
    '- any symbol the pipeline could not find in `agent/kb/symbols.md`.',
    '',
    ...cardSection,
    '',
    ...evalSection(evalResult),
    '---',
    '',
    'CI has already run `scripts/kb/validate.mjs` on this branch; its gate table is in the workflow run summary.',
    'Merging this PR is what puts these cards in front of students.',
    '',
  ];

  const body = lines.join('\n');
  if (args.out) {
    await fsp.mkdir(path.dirname(path.resolve(args.out)), { recursive: true });
    await fsp.writeFile(args.out, body);
  } else {
    process.stdout.write(body);
  }
}

try {
  await main();
} catch (e) {
  console.error(`kb-pr-body failed: ${e.stack || e.message}`);
  process.exitCode = 1;
}
