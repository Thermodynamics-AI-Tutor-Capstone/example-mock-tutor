import { shorten } from './util.js';

// One pool covers cards and file passages, so it is offered as soon as there is either.
export const available = (ctx) => ctx.knowledge.fileCount > 0 || ctx.knowledge.cardCount > 0;

export function status(args) {
  if (typeof args?.query !== 'string' || !args.query.trim()) return null;
  const where = args.kind === 'card' ? ' cards' : args.kind === 'chunk' ? ' course files' : '';
  return `Searching${where} for “${shorten(args.query)}”`;
}

export default async function run(args, ctx) {
  return ctx.knowledge.search(args);
}
