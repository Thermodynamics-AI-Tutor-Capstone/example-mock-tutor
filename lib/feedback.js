import { query } from './db.js';

// Students' feedback on Kelvin: a thumbs up or down, a comment, or both. It is about one reply
// (conversationId + messageId), a whole chat (conversationId), or Kelvin in general (neither).
// Admins read it in the dashboard (lib/admin.js feedback).

export const FEEDBACK_MAX_CHARS = 4000;
export const FEEDBACK_PER_DAY = 50;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function saveFeedback(userId, body = {}) {
  const rating = body.rating ?? null;
  if (rating !== null && rating !== 'up' && rating !== 'down') throw httpError(400, "rating must be 'up', 'down' or null");
  if (body.text !== undefined && body.text !== null && typeof body.text !== 'string') throw httpError(400, 'text must be a string');
  const text = String(body.text ?? '').trim();
  if (!rating && !text) throw httpError(400, 'Choose thumbs up or down, or write a few words.');
  if (Array.from(text).length > FEEDBACK_MAX_CHARS) throw httpError(400, `Feedback can be at most ${FEEDBACK_MAX_CHARS} characters.`);

  const conversationId = body.conversationId ?? null;
  const messageId = body.messageId ?? null;
  if (messageId !== null && conversationId === null) throw httpError(400, 'messageId needs a conversationId');
  if (conversationId !== null) {
    if (typeof conversationId !== 'string' || !UUID_RE.test(conversationId)) throw httpError(404, 'Conversation not found');
    const { rows } = await query('SELECT 1 FROM conversations WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL', [conversationId, userId]);
    if (!rows.length) throw httpError(404, 'Conversation not found');
  }
  let replyId = null;
  if (messageId !== null) {
    replyId = Number(messageId);
    if (!Number.isSafeInteger(replyId) || replyId <= 0) throw httpError(404, 'Reply not found');
    const { rows } = await query("SELECT 1 FROM messages WHERE id = $1 AND conversation_id = $2 AND role = 'assistant'", [replyId, conversationId]);
    if (!rows.length) throw httpError(404, 'Reply not found');
  }

  const { rows: recent } = await query("SELECT count(*) AS n FROM feedback WHERE user_id = $1 AND created_at > now() - interval '1 day'", [userId]);
  if (Number(recent[0].n) >= FEEDBACK_PER_DAY) throw httpError(429, "You've sent a lot of feedback today. Thank you! Please try again tomorrow.");

  const { rows } = await query(
    'INSERT INTO feedback (user_id, conversation_id, message_id, rating, body) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at',
    [userId, conversationId, replyId, rating, text]
  );
  return { id: Number(rows[0].id), createdAt: rows[0].created_at, rating, conversationId, messageId: replyId };
}
