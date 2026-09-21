#!/usr/bin/env node
// Checks every tutoring style in agent/styles/ before it can reach students: the files parse,
// ids match folders, and every connection, tool and skill a style names actually exists.
// Exits non-zero on any problem. Usage: node scripts/validate-styles.mjs [--summary FILE]
import fs from 'node:fs';
import path from 'node:path';
import { loadStyles, STYLES_DIR, DEFAULT_STYLE_ID } from '../lib/styles.js';
import { loadConnections, BUILTIN_TOOL_NAMES } from '../lib/agent.js';
import { EXTRA_TOOLS } from '../lib/tools.js';
import { listSkills } from '../lib/skills.js';

const problems = [];
const { styles, errors } = loadStyles();
problems.push(...errors);

const connections = loadConnections().connections;
const skillNames = new Set((await listSkills()).map((s) => s.name));
const toolNames = new Set([...BUILTIN_TOOL_NAMES, ...Object.keys(EXTRA_TOOLS)]);
const orders = new Map();

for (const s of styles) {
  const where = `agent/styles/${s.folder}`;
  if (s.id !== s.folder) problems.push(`${where}: id "${s.id}" must match the folder name`);
  if (!s.name.trim() || !s.description.trim()) problems.push(`${where}: name and description are required`);
  if (!fs.existsSync(path.join(STYLES_DIR, s.folder, 'prompt.md')) || !s.prompt) problems.push(`${where}: prompt.md is missing or empty`);
  if (s.connection && !connections[s.connection]) {
    problems.push(`${where}: connection "${s.connection}" is not in agent/connections/connections.json (have: ${Object.keys(connections).join(', ')})`);
  }
  if (s.tools !== 'all') for (const t of s.tools) if (!toolNames.has(t)) problems.push(`${where}: unknown tool "${t}"`);
  if (s.skills !== 'all') for (const k of s.skills) if (!skillNames.has(k)) problems.push(`${where}: unknown skill "${k}"`);
  if (orders.has(s.order)) problems.push(`${where}: order ${s.order} is already used by ${orders.get(s.order)}`);
  orders.set(s.order, s.id);
}
const def = styles.find((s) => s.id === DEFAULT_STYLE_ID);
if (!def || !def.enabled) problems.push(`the default style "${DEFAULT_STYLE_ID}" must exist and be enabled`);

const lines = problems.length
  ? [`Styles: FAILED (${problems.length} problem${problems.length === 1 ? '' : 's'})`, ...problems.map((p) => `- ${p}`)]
  : [`Styles: ok — ${styles.length} checked (${styles.map((s) => s.id).join(', ')})`];
console.log(lines.join('\n'));
const i = process.argv.indexOf('--summary');
if (i > 0 && process.argv[i + 1]) fs.appendFileSync(process.argv[i + 1], `\n### Tutoring styles\n\n${lines.join('\n')}\n`);
process.exit(problems.length ? 1 : 0);
