export const available = (ctx) => ctx.knowledge.fileCount > 0;

export default async function run(args, ctx) {
  return ctx.knowledge.read(args);
}
