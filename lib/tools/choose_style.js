// Skills pick: the tutoring model chooses its own teaching style. The server keeps the guardrails
// (one switch per message, no switching while the student is only answering mid-problem) and the
// help ceiling stays exactly what the policy set this turn, whatever style is chosen.
export const available = (ctx) => Array.isArray(ctx.styleChoices) && ctx.styleChoices.length > 1 && typeof ctx.switchStyle === 'function';

export function status() {
  return 'Choosing an approach';
}

export default async function run(args, ctx) {
  const id = typeof args.style === 'string' ? args.style.trim() : '';
  const reason = typeof args.reason === 'string' ? args.reason.trim().slice(0, 200) : '';
  const target = ctx.styleChoices.find((s) => s.id === id);
  if (!target) return { error: `Unknown style "${id}". Choose one of: ${ctx.styleChoices.map((s) => s.id).join(', ')}.` };
  if (target.id === ctx.style?.id) return { ok: true, style: target.id, note: 'Already the style in force; carry on.' };
  if (ctx.styleSwitch) return { error: `Already switched to ${ctx.styleSwitch.style.id} for this message; one switch per message.` };
  const midProblem = Boolean(ctx.state?.problem) && (ctx.state?.status || 'working') === 'working';
  const newProblem = (ctx.read?.newProblem ?? 0) >= 0.7;
  if (midProblem && ctx.turn?.intent === 'reply' && !newProblem) {
    return { error: 'Not switching: the student is answering you in the middle of a problem. Keep the current style.' };
  }
  await ctx.switchStyle(target, reason || 'no reason given');
  return { ok: true, style: target.id, note: `Now in ${target.name}. Its instructions are in your system prompt; write your reply under them.` };
}
