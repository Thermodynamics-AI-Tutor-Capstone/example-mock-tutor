import { findSkill } from '../skills.js';

// Offered only when the style has at least one skill; the name enum is that style's skills.
export const available = (ctx) => ctx.skills.length > 0;

export function parameters(schema, ctx) {
  const out = structuredClone(schema);
  out.properties.name.enum = ctx.skills.map((s) => s.name);
  return out;
}

export default async function run(args, ctx) {
  const skill = findSkill(ctx.skills, args.name);
  if (!skill) return { error: `No skill named "${args.name}". Available: ${ctx.skills.map((s) => s.name).join(', ')}.` };
  return { name: skill.name, instructions: skill.body };
}
