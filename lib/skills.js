import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SKILLS_DIR = path.join(APP_DIR, 'agent', 'skills');

const warned = new Set();

function warnOnce(message) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(message);
}

function unquote(value) {
  const v = value.trim();
  if (v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
    return v.slice(1, -1).trim();
  }
  return v;
}

export function parseSkill(text, slug) {
  const lines = String(text).replace(/^\uFEFF/, '').split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return { error: 'does not start with a --- frontmatter line' };
  const end = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
  if (end === -1) return { error: 'frontmatter has no closing --- line' };
  const fields = {};
  const extra = [];
  for (const line of lines.slice(1, end)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) return { error: `frontmatter line is not "key: value": ${line.trim().slice(0, 80)}` };
    const key = m[1];
    if (key in fields) return { error: `frontmatter repeats "${key}"` };
    fields[key] = unquote(m[2]);
    if (key !== 'name' && key !== 'description') extra.push(key);
  }
  if (!fields.name) return { error: 'frontmatter is missing name:' };
  if (fields.name !== slug) return { error: `name "${fields.name}" does not match its folder "${slug}"` };
  if (!fields.description || fields.description === '|' || fields.description === '>') {
    return { error: 'frontmatter is missing a one-line description:' };
  }
  const body = lines.slice(end + 1).join('\n').trim();
  return { name: fields.name, description: fields.description, body, extra };
}

export async function listSkills(dir = SKILLS_DIR) {
  let entries;
  try {
    entries = await fsp.readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code !== 'ENOENT') warnOnce(`Could not read skills folder: ${e.message}`);
    return [];
  }
  const skills = [];
  const dirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.')).map((e) => e.name).sort();
  for (const slug of dirs) {
    const file = path.join(dir, slug, 'SKILL.md');
    let text;
    try {
      text = await fsp.readFile(file, 'utf8');
    } catch (e) {
      warnOnce(`Skipping skill "${slug}": ${e.code === 'ENOENT' ? 'no SKILL.md' : e.message}`);
      continue;
    }
    const parsed = parseSkill(text, slug);
    if (parsed.error) {
      warnOnce(`Skipping skill "${slug}": SKILL.md ${parsed.error}`);
      continue;
    }
    if (parsed.extra.length) {
      warnOnce(`Skill "${slug}": ignoring extra frontmatter keys (${parsed.extra.join(', ')}); only name and description are used`);
    }
    skills.push({ name: parsed.name, description: parsed.description, body: parsed.body });
  }
  return skills;
}

export function findSkill(skills, name) {
  if (typeof name !== 'string') return null;
  const wanted = name.trim();
  return skills.find((s) => s.name === wanted) || skills.find((s) => s.name.toLowerCase() === wanted.toLowerCase()) || null;
}
