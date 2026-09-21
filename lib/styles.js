import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const STYLES_DIR = path.join(APP_DIR, 'agent', 'styles');
export const DEFAULT_STYLE_ID = 'classic';

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let cache = null;

function asList(value) {
  if (value === 'all') return 'all';
  return Array.isArray(value) ? value.map(String) : [];
}

function readStyle(dir) {
  const ymlPath = path.join(STYLES_DIR, dir, 'style.yml');
  const promptPath = path.join(STYLES_DIR, dir, 'prompt.md');
  const raw = parseYaml(fs.readFileSync(ymlPath, 'utf8')) || {};
  let prompt = '';
  try {
    prompt = fs.readFileSync(promptPath, 'utf8').replace(/<!--[\s\S]*?-->/g, '').trim();
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  const state = raw.state && typeof raw.state === 'object' ? raw.state : {};
  const ui = raw.ui && typeof raw.ui === 'object' ? raw.ui : {};
  return {
    id: String(raw.id || dir),
    folder: dir,
    name: String(raw.name || dir),
    description: String(raw.description || ''),
    icon: String(raw.icon || ''),
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 100,
    connection: raw.connection ? String(raw.connection) : null,
    tools: asList(raw.tools),
    skills: raw.skills === undefined ? 'all' : asList(raw.skills),
    maxToolRounds: Number.isInteger(raw.max_tool_rounds) && raw.max_tool_rounds > 0 ? raw.max_tool_rounds : null,
    state: {
      helpLadder: state.help_ladder === true,
      maxRung: Number.isInteger(state.max_rung) && state.max_rung > 0 ? state.max_rung : 6,
    },
    ui: { figures: ui.figures === true, mermaid: ui.mermaid === true },
    enabled: raw.enabled !== false,
    prompt,
  };
}

// Styles are read from disk once per process. On Vercel they are bundled with the function via
// vercel.json includeFiles; locally a server restart picks up edits.
export function loadStyles() {
  if (cache) return cache;
  const styles = [];
  const errors = [];
  let dirs = [];
  try {
    dirs = fs.readdirSync(STYLES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch (e) {
    if (e.code !== 'ENOENT') errors.push(`agent/styles: ${e.message}`);
  }
  for (const dir of dirs.sort()) {
    try {
      const style = readStyle(dir);
      if (!ID_RE.test(style.id)) throw new Error(`id "${style.id}" must be lowercase-hyphenated`);
      styles.push(style);
    } catch (e) {
      if (e.code === 'ENOENT') continue;
      errors.push(`agent/styles/${dir}: ${e.message}`);
    }
  }
  for (const err of errors) console.warn(`Skipping style — ${err}`);
  styles.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  cache = { styles, errors };
  return cache;
}

export function findStyle(id) {
  return loadStyles().styles.find((s) => s.id === id) || null;
}

// check(style) is supplied by the agent runtime, which knows which connections, keys and tools
// exist; it returns null when the style can run, or a short human-readable reason when it cannot.
export function listStyles(check) {
  return loadStyles()
    .styles.filter((s) => s.enabled)
    .map((s) => {
      const reason = check ? check(s) : null;
      return {
        id: s.id,
        name: s.name,
        description: s.description,
        icon: s.icon,
        order: s.order,
        ui: s.ui,
        available: !reason,
        ...(reason ? { unavailableReason: reason } : {}),
        default: s.id === DEFAULT_STYLE_ID,
      };
    });
}

// Always returns a runnable style: the requested one if it exists, is enabled and passes check,
// otherwise the default. `fellBack` tells the caller to say so.
export function resolveStyle(id, check) {
  const wanted = id ? findStyle(id) : null;
  if (wanted && wanted.enabled && !(check && check(wanted))) return { style: wanted, fellBack: false };
  const fallback = findStyle(DEFAULT_STYLE_ID) || loadStyles().styles.find((s) => s.enabled) || null;
  const reason = !id ? null : !wanted ? `no style "${id}"` : !wanted.enabled ? 'disabled' : check(wanted);
  return { style: fallback, fellBack: Boolean(id && id !== fallback?.id), reason };
}
