#!/usr/bin/env node
// Fails if this public repo tracks a course file, an exam item or a course-file (source) card, a
// reference to one, or a citation of an exam file. Those live only in the private kelvin-ingestion
// repo; homework items are public. Run: npm run brain:check
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BRAIN = 'agent/knowledge-brain/';
const COURSE_FILE = /\.(pdf|pptx?|docx?|xlsx?|key|pages)$/i;
const EXAM_PATH = /^assignments\/exams\//i;
const EXAM_ITEM_ID = /^item:(exam|final)/i;
const PRIVATE_REF = /\bsrc:[a-z0-9]|\bitem:(exam|final)/i;

const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: APP_DIR, encoding: 'utf8' }).split('\0').filter(Boolean);
const problems = [];

for (const file of tracked) {
  if (file.startsWith('agent/raw-course-files/')) problems.push(`${file}: course files belong in kelvin-ingestion`);
  else if (COURSE_FILE.test(file)) problems.push(`${file}: looks like a course file`);
  if (!file.startsWith(BRAIN) || !file.endsWith('.md')) continue;
  const rel = file.slice(BRAIN.length);
  if (/^sources\//.test(rel) || /^items\/(exam|final)/i.test(rel)) {
    problems.push(`${file}: exam items and source cards stay in kelvin-ingestion`);
    continue;
  }
  if (!fs.existsSync(path.join(APP_DIR, file))) continue;
  const text = fs.readFileSync(path.join(APP_DIR, file), 'utf8');
  if (PRIVATE_REF.test(text)) problems.push(`${file}: names an exam item or a src: card`);
  const fm = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!fm) continue;
  let data;
  try {
    data = parseYaml(fm[1]) || {};
  } catch (e) {
    problems.push(`${file}: frontmatter does not parse (${e.message.split('\n')[0]})`);
    continue;
  }
  if (data.kind === 'source') problems.push(`${file}: is a source card`);
  if (data.kind === 'item' && EXAM_ITEM_ID.test(String(data.id || ''))) problems.push(`${file}: is an exam item`);
  for (const s of Array.isArray(data.sources) ? data.sources : []) {
    if (typeof s?.path === 'string' && EXAM_PATH.test(s.path)) problems.push(`${file}: cites ${s.path}`);
  }
}

if (problems.length) {
  console.error(`Public brain check failed (${problems.length}):\n  ${problems.slice(0, 50).join('\n  ')}`);
  process.exit(1);
}
const cards = tracked.filter((f) => f.startsWith(BRAIN) && f.endsWith('.md')).length;
console.log(`Public brain check passed: ${tracked.length} tracked files, ${cards} brain files, no course files or exam content.`);
