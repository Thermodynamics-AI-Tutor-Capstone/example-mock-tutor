import { shorten } from './util.js';

export const available = (ctx) => ctx.knowledge.cardCount > 0;

export function status(args) {
  if (typeof args?.query !== 'string' || !args.query.trim()) return null;
  return `Searching the knowledge brain for “${shorten(args.query)}”`;
}

export default async function run(args, ctx) {
  return ctx.knowledge.search({ query: args?.query, max_results: args?.max_results, kind: 'card' });
}
