export const available = (ctx) => ctx.knowledge.cardCount > 0;

export default async function run(args, ctx) {
  const card = ctx.knowledge.openCard(args);
  // Tell the page which card was actually opened, so the student can go and check it.
  if (card && !card.error && card.id) ctx.emit({ type: 'card', id: card.id, title: card.title, status: card.status });
  return card;
}
