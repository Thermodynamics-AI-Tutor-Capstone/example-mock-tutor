import { query } from '../db.js';
import { isModelRead } from '../decide.js';
import { STUDENT_SKILLS, SKILL_OUTCOMES, SKILL_INDEPENDENCE, SKILL_CONFIDENCE } from '../student-skills.js';
export const available = (ctx) => Boolean(ctx.userId && ctx.conversationId && ctx.userMessageId);
const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
export default async function run(args, ctx) {
  if (!available(ctx)) return { error: 'A persisted student message is required.' };
  if (!Object.hasOwn(STUDENT_SKILLS, args.skill)) return { error: 'Choose a supported skill ID.' };
  if (!SKILL_OUTCOMES.includes(args.outcome) || !SKILL_INDEPENDENCE.includes(args.independence) || !SKILL_CONFIDENCE.includes(args.confidence)) return { error: 'Invalid outcome, independence or confidence.' };
  if (!['reasoning', 'calculation', 'model_choice'].includes(args.evidence_kind)) return { error: 'Observe reasoning, calculation or model choice; not notation or transcription.' };
  const quote = normalize(args.quote), rationale = normalize(args.rationale);
  if (quote.length < 8 || quote.length > 300 || rationale.length < 12 || rationale.length > 300) return { error: 'Use an exact student quote (8–300 characters) and a concrete rationale (12–300 characters).' };
  if (isModelRead(ctx.read) && !ctx.turn?.attemptCounted && !(ctx.read.showsWork >= 0.5)) return { error: 'No student work was identified. A request for help is not a skill assessment.' };
  ctx.skillRecorded ??= new Set();
  if (ctx.skillRecorded.has(args.skill)) return { error: 'Already observed this skill on this message.' };
  if (ctx.skillRecorded.size >= 3) return { error: 'At most three distinct skill observations per student message.' };
  // Reserve before awaiting, so parallel tool calls cannot manufacture repeated evidence.
  ctx.skillRecorded.add(args.skill);
  try {
    const { rows } = await query(`SELECT m.content FROM messages m JOIN conversations c ON c.id = m.conversation_id
      WHERE m.id = $1 AND m.role = 'user' AND m.conversation_id = $2 AND c.user_id = $3 AND c.deleted_at IS NULL`,
      [ctx.userMessageId, ctx.conversationId, ctx.userId]);
    if (!rows[0] || !normalize(rows[0].content).includes(quote)) {
      ctx.skillRecorded.delete(args.skill);
      return { error: 'The quote must come from the current student message in this user’s conversation.' };
    }
    // Exact repetition of a recent tutor step cannot establish independent understanding.
    const previous = await query("SELECT content FROM messages WHERE conversation_id = $1 AND role = 'assistant' AND id < $2 ORDER BY id DESC LIMIT 3", [ctx.conversationId, ctx.userMessageId]);
    const copied = previous.rows.some((row) => normalize(row.content).includes(quote));
    const independence = copied ? 'assisted' : args.independence;
    const data = { messageId: String(ctx.userMessageId), quote, rationale, outcome: args.outcome,
      independence, confidence: args.confidence, evidenceKind: args.evidence_kind };
    const inserted = await query(`INSERT INTO student_evidence (user_id, conversation_id, kind, ref, source, data)
      SELECT $1, $2, 'skill_observation', $3, 'tutor', $4::jsonb
      WHERE (SELECT count(*) FROM student_evidence WHERE user_id = $1 AND kind = 'skill_observation' AND data->>'messageId' = $5) < 3
      ON CONFLICT DO NOTHING RETURNING id`, [ctx.userId, ctx.conversationId, args.skill, JSON.stringify(data), String(ctx.userMessageId)]);
    return inserted.rows.length ? { ok: true, skill: args.skill, observation: data, note: 'Evidence saved; this is not a mastery score or a requirement to continue.' }
      : { ok: false, note: 'This message already has that observation or has reached its three-observation limit.' };
  } catch (error) { ctx.skillRecorded.delete(args.skill); throw error; }
}
