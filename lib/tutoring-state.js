import { query } from './db.js';

// Per-conversation tutoring state (help rung, attempts, diagnosed misconceptions, assumption
// ledger) for styles with state.help_ladder. Written by the update_tutoring_state tool, shown to
// the model every turn by tutoringStateSection().

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
