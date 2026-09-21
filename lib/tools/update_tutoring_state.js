const MAX_LIST = 20;
const LEDGER_STATUSES = ['stated', 'assumed', 'derived', 'retracted'];

function clampInt(v, lo, hi) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function pushUnique(list, value) {
  const out = Array.isArray(list) ? list.filter((x) => x !== value) : [];
  out.push(value);
  return out.slice(-MAX_LIST);
}

// Needs a conversation to attach to; styles without a help ladder shouldn't list it.
export const available = (ctx) => Boolean(ctx.conversationId);

export function status(args) {
  return args?.diagnosed_misconception ? `Noting misconception: ${args.diagnosed_misconception}` : null;
}

export default async function run(args, ctx) {
  const maxRung = ctx.style?.state?.maxRung ?? 6;
  let s = { ...(ctx.state || {}) };
  if (typeof args.problem === 'string' && args.problem.trim() && args.problem.trim() !== s.problem) {
    s = { ...s, problem: args.problem.trim().slice(0, 200), rung: 0, attempts: 0 };
  }
  if (args.rung !== undefined) {
    const r = clampInt(args.rung, 0, maxRung);
    if (r !== null) s.rung = r;
  }
  if (args.attempt === true) s.attempts = (s.attempts || 0) + 1;
  if (typeof args.diagnosed_misconception === 'string' && args.diagnosed_misconception.trim()) {
    s.misconceptions = pushUnique(s.misconceptions, args.diagnosed_misconception.trim());
  }
  if (typeof args.resolved_misconception === 'string' && args.resolved_misconception.trim()) {
    s.resolved = pushUnique(s.resolved, args.resolved_misconception.trim());
  }
  const e = args.ledger_entry;
  if (e && typeof e.assumption === 'string' && e.assumption.trim()) {
    const entry = {
      assumption: e.assumption.trim().slice(0, 80),
      status: LEDGER_STATUSES.includes(e.status) ? e.status : 'assumed',
      justification: typeof e.justification === 'string' ? e.justification.trim().slice(0, 200) : '',
    };
    const ledger = (Array.isArray(s.ledger) ? s.ledger : []).filter((x) => x.assumption !== entry.assumption);
    s.ledger = [...ledger, entry].slice(-MAX_LIST);
  }
  await ctx.saveState(s);
  return { ok: true, state: s, maxRung };
}
