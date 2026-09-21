import { shorten } from './util.js';

const PLURALS = {
  course: 'courses',
  unit: 'units',
  topic: 'topics',
  equation: 'equations',
  misconception: 'misconceptions',
  example: 'worked examples',
  item: 'assessment items',
  source: 'sources',
};

export const available = (ctx) => ctx.knowledge.cardCount > 0;

export function status(args) {
  const kind = typeof args?.kind === 'string' ? PLURALS[args.kind.trim().toLowerCase()] : null;
  const parent = typeof args?.parent === 'string' && args.parent.trim() ? shorten(args.parent) : null;
  if (kind && parent) return `Listing ${kind} in ${parent}`;
  if (kind) return `Listing ${kind}`;
  if (parent) return `Listing cards in ${parent}`;
  return null;
}

export default async function run(args, ctx) {
  return ctx.knowledge.listCards(args);
}
