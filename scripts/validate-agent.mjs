#!/usr/bin/env node
// Checks the agent configuration before it can reach students:
//   tools  — every agent/tools/<name>.yml parses, has a description and an object schema, and has
//            its implementation lib/tools/<name>.js registered in lib/tools/index.js (and vice versa);
//   styles — every agent/styles/<id>/ parses, its id matches the folder, and every connection,
//            tool and skill it names exists; every enabled style tells the Auto router when it fits
//            (route_when.use_for) and names only known intents;
//   policy — agent/policy.yml thresholds are in range and the help ladder is well formed.
// Exits non-zero on any problem. Usage: node scripts/validate-agent.mjs [--summary FILE]
import fs from 'node:fs';
import path from 'node:path';
import { loadStyles, STYLES_DIR, DEFAULT_STYLE_ID } from '../lib/styles.js';
import { loadConnections } from '../lib/agent.js';
import { loadTools } from '../lib/tools/index.js';
import { listSkills } from '../lib/skills.js';
import { loadPolicy } from '../lib/policy.js';
import { INTENTS } from '../lib/decide.js';

const problems = [];

// Tools
const { tools, errors: toolErrors } = loadTools();
problems.push(...toolErrors);
for (const t of tools.values()) {
  const where = `agent/tools/${t.file}`;
  if (t.parameters.type !== 'object' || typeof t.parameters.properties !== 'object') {
    problems.push(`${where}: parameters must be a JSON-schema object with "properties"`);
  }
  for (const req of t.parameters.required || []) {
    if (!(req in (t.parameters.properties || {}))) problems.push(`${where}: required parameter "${req}" is not in properties`);
  }
  for (const v of t.requiresEnv) if (!/^[A-Z][A-Z0-9_]*$/.test(v)) problems.push(`${where}: requires.env "${v}" is not an env var name`);
  if (t.status && /\{(\w+)\}/.test(t.status)) {
    for (const [, key] of t.status.matchAll(/\{(\w+)\}/g)) {
      if (!(key in (t.parameters.properties || {}))) problems.push(`${where}: status mentions {${key}}, which is not a parameter`);
    }
  }
}

// Styles
const { styles, errors } = loadStyles();
problems.push(...errors);

const connections = loadConnections().connections;
const skillNames = new Set((await listSkills()).map((s) => s.name));
const toolNames = new Set(tools.keys());
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
  if (s.enabled && !s.routeWhen.use_for) problems.push(`${where}: route_when.use_for is required, so the Auto router knows when this style fits`);
  for (const intent of s.routeWhen.intents) {
    if (!(intent in INTENTS)) problems.push(`${where}: route_when.intents has unknown intent "${intent}" (known: ${Object.keys(INTENTS).join(', ')})`);
  }
  if (s.id === 'auto') problems.push(`${where}: "auto" is reserved for automatic routing`);
}

// Policy
const policy = loadPolicy();
for (const [k, v] of Object.entries(policy.thresholds)) {
  const max = k === 'frustrated' ? 3 : 1;
  if (!(v >= 0 && v <= max)) problems.push(`agent/policy.yml: thresholds.${k} = ${v} is outside 0–${max}`);
}
if (policy.thresholds.misconception_confirm > policy.thresholds.misconception_repair) {
  problems.push('agent/policy.yml: thresholds.misconception_confirm must not exceed misconception_repair');
}
policy.ladder.forEach((r, i) => {
  if (r.rung !== i) problems.push(`agent/policy.yml: ladder rungs must be numbered 0, 1, 2… in order (found ${r.rung} at position ${i})`);
  if (!r.allows) problems.push(`agent/policy.yml: ladder rung ${r.rung} needs an "allows" description`);
});
const def = styles.find((s) => s.id === DEFAULT_STYLE_ID);
if (!def || !def.enabled) problems.push(`the default style "${DEFAULT_STYLE_ID}" must exist and be enabled`);

const lines = problems.length
  ? [`Agent config: FAILED (${problems.length} problem${problems.length === 1 ? '' : 's'})`, ...problems.map((p) => `- ${p}`)]
  : [
      `Tools: ok — ${tools.size} checked (${[...tools.keys()].join(', ')})`,
      `Styles: ok — ${styles.length} checked (${styles.map((s) => s.id + (s.enabled ? '' : ' [disabled]')).join(', ')})`,
      `Policy: ok — ${policy.ladder.length}-rung ladder, ${Object.keys(policy.thresholds).length} thresholds`,
    ];
console.log(lines.join('\n'));
const i = process.argv.indexOf('--summary');
if (i > 0 && process.argv[i + 1]) fs.appendFileSync(process.argv[i + 1], `\n### Tools and teaching styles\n\n${lines.join('\n')}\n`);
process.exit(problems.length ? 1 : 0);
