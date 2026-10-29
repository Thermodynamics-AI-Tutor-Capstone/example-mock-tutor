import crypto from 'node:crypto';
import { query } from './db.js';

import { selfCheckCase as selectedCase } from './self-check-cases.js';
export { selfCheckCatalog } from './self-check-cases.js';

const normalized = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
const parse = (value) => typeof value === 'string' ? JSON.parse(value) : value || {};
const fail = (message, status = 400) => Object.assign(new Error(message), { status });

function publicState(state) {
  if (!state?.topicId) return null;
  const { topic, item } = selectedCase(state.topicId, state.caseId);
  return { topicId: topic.id, caseId: item.id, title: topic.title, question: item.question, active: state.active !== false,
    assisted: state.assisted === true, attempted: state.attempted === true };
}

export async function createSelfCheck(userId, topicId, caseId) {
  const { topic, item } = selectedCase(topicId, caseId);
  const id = crypto.randomUUID();
  const title = 'Self-check · ' + topic.title;
  const selfCheck = { topicId: topic.id, caseId: item.id, active: true, assisted: false, attempted: false };
  const content = `**Check my understanding: ${topic.title}**\n\n${item.question}\n\nTry explaining your reasoning in your own words. A hint or explanation is available whenever you want one. This is practice, not a course grade.`;
  const { rows } = await query(`INSERT INTO conversations (id, title, style, user_id) VALUES ($1, $2, 'office-hours', $3)
    RETURNING created_at, updated_at`, [id, title, userId]);
  await query(`INSERT INTO tutoring_state (conversation_id, style, state) VALUES ($1, 'office-hours', $2::jsonb)`, [id, JSON.stringify({ selfCheck })]);
  const message = await query(`INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'assistant', $2) RETURNING id, created_at`, [id, content]);
  return { id, title, style: 'office-hours', createdAt: new Date(rows[0].created_at).toISOString(), updatedAt: new Date(rows[0].updated_at).toISOString(),
    messages: [{ id: Number(message.rows[0].id), role: 'assistant', content, createdAt: new Date(message.rows[0].created_at).toISOString() }],
    pendingAttachments: [], selfCheck: publicState(selfCheck) };
}

export async function selfCheckView(conversationId, userId) {
  const { rows } = await query(`SELECT t.state FROM tutoring_state t JOIN conversations c ON c.id = t.conversation_id
    WHERE c.id = $1 AND c.user_id = $2 AND c.deleted_at IS NULL`, [conversationId, userId]);
  return publicState(parse(rows[0]?.state).selfCheck);
}

// Called before the message is inserted, under the existing per-user reply lock. Client strings
// cannot supply scores, independence, evidence, or trusted teaching instructions.
export async function prepareSelfCheckMessage(conversationId, userId, content, action) {
  const { rows } = await query(`SELECT t.state FROM tutoring_state t JOIN conversations c ON c.id = t.conversation_id
    WHERE c.id = $1 AND c.user_id = $2 AND c.deleted_at IS NULL`, [conversationId, userId]);
  const state = parse(rows[0]?.state), saved = state.selfCheck;
  if (!saved || saved.active === false) {
    if (action !== undefined) throw fail('This conversation has no active self-check.');
    return { content, turn: null, view: publicState(saved) };
  }
  if (action !== undefined && !['answer', 'hint', 'explain', 'finish'].includes(action)) throw fail('Choose an available self-check action.');
  const kind = action || 'answer';
  const { topic, item } = selectedCase(saved.topicId, saved.caseId);
  if (kind === 'answer' && !String(content).trim()) throw fail('Write your attempt, or choose a hint or explanation.');
  if (kind === 'hint') content = 'Please give me a hint for this self-check.';
  if (kind === 'explain') content = 'Please explain this self-check with the reasoning.';
  if (kind === 'finish') content = 'Finish this self-check and briefly summarize what my attempt showed and what I could practice next.';
  const history = await query(`SELECT m.content, c.id AS conversation_id FROM messages m
    JOIN conversations c ON c.id = m.conversation_id JOIN tutoring_state t ON t.conversation_id = c.id
    WHERE c.user_id = $1 AND c.deleted_at IS NULL AND m.role = 'user'
      AND t.state->'selfCheck'->>'topicId' = $2 AND t.state->'selfCheck'->>'caseId' = $3`, [userId, topic.id, item.id]);
  const duplicate = kind === 'answer' && history.rows.some((row) => normalized(row.content) === normalized(content));
  const independence = saved.assisted || saved.attempted || kind === 'hint' || kind === 'explain' ? 'assisted'
    : history.rows.length ? 'unknown' : 'independent';
  const recordable = kind === 'answer' && !duplicate;
  const turn = { topicId: topic.id, caseId: item.id, skill: topic.skill, knowledgeType: topic.knowledgeType,
    action: kind, recordable, independence, duplicate };
  if (kind === 'hint' || kind === 'explain') saved.assisted = true;
  if (kind === 'answer') saved.attempted = true;
  if (kind === 'finish') saved.active = false;
  await query(`UPDATE tutoring_state SET state = $2::jsonb, updated_at = now() WHERE conversation_id = $1`, [conversationId, JSON.stringify(state)]);
  return { content, turn, view: publicState(saved) };
}

export function selfCheckSection(turn) {
  if (!turn) return '';
  const { topic, item } = selectedCase(turn.topicId, turn.caseId);
  return [
    '## Student-selected self-check',
    `Topic: ${topic.title}. Knowledge dimension: ${topic.knowledgeType}. Related skill: ${topic.skill}.`,
    `Case: ${item.question}`,
    `Reference for feedback: ${item.focus}`,
    'The student chose to probe their understanding. Offer feedback on their actual reasoning. Ask one question only when it helps discriminate a meaningful ambiguity or invites a useful next reasoning step. Explanations and demonstrations remain available immediately; no attempt gates or repeated-question loop.',
    turn.action === 'hint' ? `They explicitly requested a hint. Give a useful cue now, such as: ${item.hint} Do not record the request as skill evidence.`
      : turn.action === 'explain' ? 'They explicitly requested an explanation. Explain the full conceptual reasoning now; use a diagram only when useful. Do not withhold it behind a question. This request is not skill evidence.'
      : turn.action === 'finish' ? 'The self-check is now finished. Summarize only what their actual attempt supports, distinguish assistance, and suggest an optional next step. Do not create new evidence from this request or claim a grade.'
      : 'Assess the submitted explanation against the case. Identify a specific sound step and, if present, the first consequential gap. If a prerequisite is missing, teach it directly. Offer an optional new case after useful feedback; do not automatically start a quiz.',
    `Server evidence status: ${turn.recordable ? 'new answer; only meaningful reasoning may be recorded' : 'not recordable on this turn'}; independence ${turn.independence}${turn.duplicate ? '; repeated answer does not add evidence' : ''}.`,
    'Use record_skill_observation only for a supported observation from their own words; use the topic knowledge_type when it applies. A first answer is eligible for independent evidence, not automatically correct. Guided revisions are assisted. Acknowledgment, self-reported confidence, a request, and repeated answers are not new mastery evidence.',
    'If the student says they used help elsewhere, mark their work assisted. Be transparent about uncertainty. A short beta self-check cannot certify mastery or diagnose a fixed learner trait.',
  ].join('\n\n');
}
