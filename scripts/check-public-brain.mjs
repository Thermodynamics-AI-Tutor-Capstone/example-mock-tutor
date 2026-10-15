#!/usr/bin/env node
// Fails if this public repo tracks a course file, an exam card (an exam item, or the summary of an
// exam file), a reference to one, or a citation of an exam file. Those live only in the private
// kelvin-ingestion repo; homework items and the other summaries are public. Run: npm run brain:check
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BRAIN = 'agent/knowledge-brain/';
const COURSE_FILE = /\.(pdf|pptx?|docx?|xlsx?|key|pages)$/i;
const EXAM_PATH = /^assignments\/exams\//i;
const EXAM_CARD_ID = /^(item:(exam|final)|src:assignments-exams-)/i;
const PRIVATE_REF = /\b(item:(exam|final)|src:assignments-exams-)/i;

const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: APP_DIR, encoding: 'utf8' }).split('\0').filter(Boolean);
const problems = [];

for (const file of tracked) {
  if (file.startsWith('agent/raw-course-files/')) problems.push(`${file}: course files belong in kelvin-ingestion`);
  else if (COURSE_FILE.test(file)) problems.push(`${file}: looks like a course file`);
  if (!file.startsWith(BRAIN) || !file.endsWith('.md')) continue;
  const rel = file.slice(BRAIN.length);
  if (/^sources\/assignments-exams-/i.test(rel) || /^items\/(exam|final)/i.test(rel)) {
    problems.push(`${file}: exam cards stay in kelvin-ingestion`);
    continue;
  }
  if (!fs.existsSync(path.join(APP_DIR, file))) continue;
  const text = fs.readFileSync(path.join(APP_DIR, file), 'utf8');
  if (PRIVATE_REF.test(text)) problems.push(`${file}: names an exam card`);
  const fm = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!fm) continue;
  let data;
  try {
    data = parseYaml(fm[1]) || {};
  } catch (e) {
    problems.push(`${file}: frontmatter does not parse (${e.message.split('\n')[0]})`);
    continue;
  }
  if (EXAM_CARD_ID.test(String(data.id || ''))) problems.push(`${file}: is an exam card`);
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
