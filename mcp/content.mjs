import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import YAML from 'yaml';

const root = resolve(import.meta.dirname, '..', 'agent');
const allowedKinds = ['course', 'units', 'topics', 'misconceptions'];
const selectedSkills = ['answer-requests', 'what-next', 'misconception-repair', 'property-tables', 'control-volume-energy-balance'];
export const provenance = "Sample ME 300 material from Dr. O'Connor's Summer 2023 section. Dates, grading, and policies may differ in your section; check your Canvas. No card is instructor-verified.";

function parseCard(path) {
  const text = readFileSync(path, 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`Bad card: ${path}`);
  return { ...YAML.parse(match[1]), body: match[2].trim() };
}

export function loadContent() {
  const cards = new Map();
  for (const folder of allowedKinds) {
    for (const file of readdirSync(join(root, 'knowledge-brain', folder)).filter(f => f.endsWith('.md'))) {
      const card = parseCard(join(root, 'knowledge-brain', folder, file));
      if (!['both', 'student', undefined, null].includes(card.audience)) continue;
      if (cards.has(card.id)) throw new Error(`Duplicate card ${card.id}`);
      cards.set(card.id, card);
    }
  }
  const skills = new Map();
  for (const name of selectedSkills) {
    const skill = parseCard(join(root, 'skills', name, 'SKILL.md'));
    skills.set(name, skill);
  }
  return { cards, skills };
}

export function metadata(card) {
  return { id: card.id, kind: card.kind, title: card.title, description: card.description,
    status: card.status, unit: card.unit, parent: card.parent };
}

export function searchCards(cards, query, kind, limit = 8) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return [...cards.values()].filter(c => !kind || c.kind === kind).map(c => {
    const haystack = `${c.title} ${c.description} ${c.body}`.toLowerCase();
    const score = terms.reduce((n, term) => n + (c.title.toLowerCase().includes(term) ? 5 : 0)
      + (c.description.toLowerCase().includes(term) ? 3 : 0) + (haystack.includes(term) ? 1 : 0), 0);
    return { card: c, score };
  }).filter(x => terms.length === 0 || x.score > 0).sort((a,b) => b.score - a.score || (b.card.priority || 0) - (a.card.priority || 0))
    .slice(0, limit).map(x => metadata(x.card));
}
