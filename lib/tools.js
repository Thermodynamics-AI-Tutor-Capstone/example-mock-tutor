import { query } from './db.js';

// Tools beyond the built-in course-material tools in lib/agent.js. A style lists the ones it may
// use in agent/styles/<id>/style.yml. `requires.env` names environment variables the tool needs;
// a style that lists a tool whose variables are unset shows as unavailable in the picker, with
// the reason, instead of failing mid-conversation.
//
// ctx = { conversationId, style, state, emit(event), saveState(nextState) }

const MAX_LIST = 20;

function clampInt(v, lo, hi) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function pushUnique(list, value, max = MAX_LIST) {
  const out = Array.isArray(list) ? list.filter((x) => x !== value) : [];
  out.push(value);
  return out.slice(-max);
}

export const EXTRA_TOOLS = {
  update_tutoring_state: {
    description:
      'Record where this student is, so the next turn continues from here instead of starting over. Call it whenever the help rung changes, the student makes an attempt, you diagnose a misconception, or an assumption is committed or retracted. The current state is shown to you at the top of every turn under "Tutoring state".',
    parameters: {
      type: 'object',
      properties: {
        problem: { type: 'string', description: 'One line naming the problem being worked on. Setting a new problem resets the rung and attempts.' },
        rung: { type: 'integer', minimum: 0, description: 'Help rung now reached (0 = no help yet). Clamped to the style’s maximum.' },
        attempt: { type: 'boolean', description: 'true when the student has just made an attempt (counts attempts).' },
        diagnosed_misconception: { type: 'string', description: 'A misc: card id you have diagnosed, e.g. "misc:m15-adiabatic-implies-isentropic".' },
        resolved_misconception: { type: 'string', description: 'A misc: card id the student has now repaired.' },
        ledger_entry: {
          type: 'object',
          description: 'One assumption the student committed to or retracted.',
          properties: {
            assumption: { type: 'string', description: 'e.g. "adiabatic", "steady flow", "ΔKE ≈ 0", "reversible".' },
            status: { type: 'string', enum: ['stated', 'assumed', 'derived', 'retracted'] },
            justification: { type: 'string', description: 'The words in the problem, or the reasoning, that license it.' },
          },
          required: ['assumption', 'status'],
        },
      },
    },
    status: (args) => (args?.diagnosed_misconception ? `Noting misconception: ${args.diagnosed_misconception}` : 'Updating tutoring state'),
    async run(args, ctx) {
      if (!ctx.conversationId) return { error: 'No conversation to attach tutoring state to.' };
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
          status: ['stated', 'assumed', 'derived', 'retracted'].includes(e.status) ? e.status : 'assumed',
          justification: typeof e.justification === 'string' ? e.justification.trim().slice(0, 200) : '',
        };
        const ledger = (Array.isArray(s.ledger) ? s.ledger : []).filter((x) => x.assumption !== entry.assumption);
        s.ledger = [...ledger, entry].slice(-MAX_LIST);
      }
      await ctx.saveState(s);
      return { ok: true, state: s, maxRung };
    },
  },
};

export function extraToolNames() {
  return Object.keys(EXTRA_TOOLS);
}

export function missingEnvFor(name) {
  const tool = EXTRA_TOOLS[name];
  if (!tool) return null;
  return (tool.requires?.env || []).filter((v) => !(process.env[v] || '').trim());
}

export async function loadTutoringState(conversationId) {
  if (!conversationId) return {};
  const { rows } = await query('SELECT state FROM tutoring_state WHERE conversation_id = $1', [conversationId]);
  const raw = rows[0]?.state;
  if (!raw) return {};
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export async function saveTutoringState(conversationId, styleId, state) {
  await query(
    `INSERT INTO tutoring_state (conversation_id, style, state, updated_at) VALUES ($1, $2, $3::jsonb, now())
     ON CONFLICT (conversation_id) DO UPDATE SET style = EXCLUDED.style, state = EXCLUDED.state, updated_at = now()`,
    [conversationId, styleId, JSON.stringify(state)]
  );
}

export function tutoringStateSection(style, state) {
  const s = state || {};
  const lines = ['## Tutoring state', ''];
  lines.push(`- Problem: ${s.problem || '(none recorded yet)'}`);
  lines.push(`- Help rung: ${s.rung ?? 0} of ${style.state.maxRung} (the ceiling — never give more help than this rung allows on this turn; raise it by one at most, and only after a real attempt)`);
  lines.push(`- Attempts on this problem: ${s.attempts ?? 0}`);
  lines.push(`- Diagnosed misconceptions: ${s.misconceptions?.length ? s.misconceptions.join(', ') : 'none yet'}`);
  if (s.resolved?.length) lines.push(`- Repaired: ${s.resolved.join(', ')}`);
  if (s.ledger?.length) {
    lines.push('- Assumption ledger:');
    for (const e of s.ledger) lines.push(`  - ${e.assumption} — ${e.status}${e.justification ? ` (${e.justification})` : ''}`);
  } else {
    lines.push('- Assumption ledger: empty');
  }
  lines.push('', 'Call `update_tutoring_state` whenever any of this changes.');
  return lines.join('\n');
}
