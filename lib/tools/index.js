import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { shorten } from './util.js';

// Every tool is two files:
//   agent/tools/<name>.yml  — what the model sees: description, parameters, status message, keys.
//   lib/tools/<name>.js     — what the server runs: `export default async function run(args, ctx)`,
//                             plus optional `available(ctx)`, `parameters(schema, ctx)`, `status(args)`.
// Implementations are imported statically below so Vercel's bundler traces them. Adding a tool
// means adding both files and one line here; scripts/validate-agent.mjs fails the build if any of
// the three is missing.
import * as list_course_files from './list_course_files.js';
import * as read_course_file from './read_course_file.js';
import * as search_course_files from './search_course_files.js';
import * as open_card from './open_card.js';
import * as list_cards from './list_cards.js';
import * as load_skill from './load_skill.js';
import * as update_tutoring_state from './update_tutoring_state.js';

export const IMPLEMENTATIONS = {
  list_course_files,
  read_course_file,
  search_course_files,
  open_card,
  list_cards,
  load_skill,
  update_tutoring_state,
};

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const TOOLS_DIR = path.join(APP_DIR, 'agent', 'tools');

let cache = null;

function readDefinition(file) {
  const raw = parseYaml(fs.readFileSync(path.join(TOOLS_DIR, file), 'utf8')) || {};
  const name = String(raw.name || path.basename(file, '.yml'));
  const env = Array.isArray(raw.requires?.env) ? raw.requires.env.map(String) : [];
  return {
    name,
    file,
    description: typeof raw.description === 'string' ? raw.description.replace(/\s+/g, ' ').trim() : '',
    parameters: raw.parameters && typeof raw.parameters === 'object' ? raw.parameters : { type: 'object', properties: {} },
    status: typeof raw.status === 'string' ? raw.status : null,
    statusDefault: typeof raw.status_default === 'string' ? raw.status_default : null,
    requiresEnv: env,
    enabled: raw.enabled !== false,
  };
}

// Loaded once per process. Returns { tools: Map(name → tool), errors: [..] }; a tool whose
// definition or implementation is missing is left out and reported, not fatal.
export function loadTools() {
  if (cache) return cache;
  const tools = new Map();
  const errors = [];
  let files = [];
  try {
    files = fs.readdirSync(TOOLS_DIR).filter((f) => f.endsWith('.yml')).sort();
  } catch (e) {
    errors.push(`agent/tools: ${e.message}`);
  }
  for (const file of files) {
    try {
      const def = readDefinition(file);
      if (def.name !== path.basename(file, '.yml')) throw new Error(`name "${def.name}" must match the file name`);
      const impl = IMPLEMENTATIONS[def.name];
      if (!impl || typeof impl.default !== 'function') throw new Error(`no implementation in lib/tools/${def.name}.js registered in lib/tools/index.js`);
      if (!def.description) throw new Error('description is required');
      tools.set(def.name, { ...def, impl });
    } catch (e) {
      errors.push(`agent/tools/${file}: ${e.message}`);
    }
  }
  for (const name of Object.keys(IMPLEMENTATIONS)) {
    if (!files.includes(`${name}.yml`)) errors.push(`lib/tools/${name}.js has no agent/tools/${name}.yml`);
  }
  for (const err of errors) console.warn(`Tool problem — ${err}`);
  cache = { tools, errors };
  return cache;
}

export function toolNames() {
  return [...loadTools().tools.keys()];
}

export function missingEnvFor(name) {
  const tool = loadTools().tools.get(name);
  if (!tool) return null;
  return tool.requiresEnv.filter((v) => !(process.env[v] || '').trim());
}

// The OpenAI-style tool definitions for one reply: the style's allowed tools that are enabled and
// currently available (e.g. file tools only once files are indexed).
export function toolDefinitions(allowed, ctx) {
  const defs = [];
  for (const tool of loadTools().tools.values()) {
    if (!tool.enabled || !allowed(tool.name)) continue;
    if (typeof tool.impl.available === 'function' && !tool.impl.available(ctx)) continue;
    const parameters = typeof tool.impl.parameters === 'function' ? tool.impl.parameters(tool.parameters, ctx) : tool.parameters;
    defs.push({ type: 'function', function: { name: tool.name, description: tool.description, parameters } });
  }
  return defs;
}

export function statusFor(name, args) {
  const tool = loadTools().tools.get(name);
  if (!tool) return `Running ${shorten(name || 'tool')}`;
  const custom = typeof tool.impl.status === 'function' ? tool.impl.status(args) : null;
  if (custom) return shorten(custom);
  if (tool.status) {
    let missing = false;
    const text = tool.status.replace(/\{(\w+)\}/g, (_, key) => {
      const v = args?.[key];
      if (v === undefined || v === null || String(v).trim() === '') {
        missing = true;
        return '';
      }
      return shorten(v);
    });
    if (!missing) return shorten(text);
  }
  return tool.statusDefault || tool.status?.replace(/\s*\{\w+\}.*$/, '') || `Running ${shorten(name)}`;
}

export async function runTool(name, args, ctx) {
  const tool = loadTools().tools.get(name);
  if (!tool) return { error: `Unknown tool "${name}".` };
  try {
    return await tool.impl.default(args, ctx);
  } catch (e) {
    return { error: `Tool failed: ${e.message}` };
  }
}
