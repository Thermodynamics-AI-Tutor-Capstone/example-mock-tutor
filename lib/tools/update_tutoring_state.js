import { recordEvidence } from '../student-model.js';

const MAX_LIST = 20;
const LEDGER_STATUSES = ['stated', 'assumed', 'derived', 'retracted'];
const PROBLEM_STATUSES = ['working', 'finished', 'parked'];

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

// The model records what it did; it cannot move the limits. The help ceiling, the attempt count,
// "complete attempt" and new-problem resets are all set by lib/policy.js from the classifier's read
// before the model runs, so a rung above the ceiling is clamped and naming a problem never resets
// the ladder.
export default async function run(args, ctx) {
  const maxRung = ctx.style?.state?.maxRung ?? 6;
  const ceiling = Math.min(ctx.turn?.ceiling ?? maxRung, maxRung);
  let s = { ...(ctx.state || {}) };
  const notes = [];
  const evidence = [];

  if (typeof args.problem === 'string' && args.problem.trim()) {
    s.problem = args.problem.trim().slice(0, 200);
    s.problemPending = false;
    if (!s.status) s.status = 'working';
  }
  if (args.rung !== undefined) {
    const r = clampInt(args.rung, 0, maxRung);
    if (r !== null) {
      if (r > ceiling) notes.push(`rung ${r} is above this turn's ceiling (${ceiling}); recorded as ${ceiling}`);
      s.rung = Math.min(r, ceiling);
    }
  }
  if (typeof args.problem_status === 'string' && PROBLEM_STATUSES.includes(args.problem_status)) {
    s.status = args.problem_status;
    if (args.problem_status === 'finished') s.finishedAt = new Date().toISOString();
  }
  if (typeof args.diagnosed_misconception === 'string' && args.diagnosed_misconception.trim()) {
    const id = args.diagnosed_misconception.trim();
    s.misconceptions = pushUnique(s.misconceptions, id);
    evidence.push({ kind: 'misconception_confirmed', ref: id, source: 'tutor', data: { problem: s.problem || null } });
  }
  if (typeof args.resolved_misconception === 'string' && args.resolved_misconception.trim()) {
    const id = args.resolved_misconception.trim();
    s.resolved = pushUnique(s.resolved, id);
    evidence.push({ kind: 'misconception_repaired', ref: id, source: 'tutor', data: { problem: s.problem || null } });
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
  if (evidence.length && ctx.userId) {
    await recordEvidence(ctx.userId, ctx.conversationId, evidence).catch((err) => notes.push(`student model not updated: ${err.message}`));
  }
  return { ok: true, state: s, ceiling, ...(notes.length ? { notes } : {}) };
}
