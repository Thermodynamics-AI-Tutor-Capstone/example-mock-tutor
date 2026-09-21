// Offered only when at least one course file has been indexed.
export const available = (ctx) => ctx.knowledge.fileCount > 0;

export default async function run(args, ctx) {
  return ctx.knowledge.list();
}
