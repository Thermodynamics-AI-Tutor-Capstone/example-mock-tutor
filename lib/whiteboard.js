import crypto from 'node:crypto';
import { query } from './db.js';
import { validateBoard } from './tools/show_on_board.js';
import { recordUsage } from './usage.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_AUDIO_BYTES = 1024 * 1024;

function fail(status, message) {
  return Object.assign(new Error(message), { status });
}

// Fractional cues belong to a short spoken segment, not wall time. The browser maps them to
// the actual audio duration. No generated code, HTML, URLs, or unbounded speech is accepted.
export function validateLesson(args) {
  if (!args || typeof args !== 'object' || Object.keys(args).some((k) => !['board', 'segments'].includes(k))) throw new Error('Use board and segments only');
  const board = validateBoard(args.board);
  if (!Array.isArray(args.segments) || !args.segments.length || args.segments.length > 8) throw new Error('Use 1–8 spoken segments');
  const targets = new Set([
    ...board.nodes.map((n) => `node:${n.id}`),
    ...board.arrows.map((_, i) => `arrow:${i}`),
    ...board.steps.map((_, i) => `step:${i}`),
  ]);
  const shown = new Set();
  let characters = 0;
  const segments = args.segments.map((segment) => {
    if (!segment || typeof segment !== 'object' || Object.keys(segment).some((k) => !['speech', 'cues'].includes(k))) throw new Error('Each segment needs speech and cues only');
    const speech = segment.speech;
    if (typeof speech !== 'string' || !speech.trim() || speech.length > 500 || /[\u0000-\u001f`]/.test(speech)) throw new Error('Speech must be 1–500 characters of plain spoken text');
    characters += speech.length;
    if (!Array.isArray(segment.cues) || segment.cues.length > 26) throw new Error('Each segment needs at most 26 cues');
    let previous = -1;
    const cues = segment.cues.map((cue) => {
      if (!cue || Object.keys(cue).some((k) => !['target', 'at'].includes(k)) || !targets.has(cue.target) || shown.has(cue.target)) throw new Error('Each cue must reveal an existing, unrevealed board target');
      if (!Number.isFinite(cue.at) || cue.at < 0 || cue.at > 0.85 || cue.at < previous) throw new Error('Cue positions must increase from 0 to 0.85');
      if (cue.target.startsWith('arrow:')) {
        const arrow = board.arrows[Number(cue.target.slice(6))];
        if (!shown.has(`node:${arrow.from}`) || !shown.has(`node:${arrow.to}`)) throw new Error('Reveal both nodes before their arrow');
      }
      shown.add(cue.target);
      previous = cue.at;
      return { target: cue.target, at: cue.at };
    });
    return { speech: speech.trim(), cues };
  });
  if (characters > 2500) throw new Error('Keep the lesson under 2500 spoken characters');
  if (shown.size !== targets.size) throw new Error('Every board node, arrow, and step must have a reveal cue');
  return { board, segments };
}

export async function saveLesson(args, { conversationId, userId }) {
  const lesson = validateLesson(args);
  const id = crypto.randomUUID();
  const { rows } = await query(
    `INSERT INTO whiteboard_lessons (id, conversation_id, user_id, lesson)
     SELECT $1, id, user_id, $4::jsonb FROM conversations
     WHERE id = $2 AND user_id = $3 AND deleted_at IS NULL RETURNING id`,
    [id, conversationId, userId, JSON.stringify(lesson)]
  );
  if (!rows.length) throw fail(404, 'Conversation not found');
  return { ...lesson.board, lesson: { id, segments: lesson.segments } };
}

export function speechSettings() {
  return {
    key: (process.env.OPENAI_API_KEY || '').trim(),
    model: (process.env.WHITEBOARD_TTS_MODEL || 'gpt-4o-mini-tts').trim(),
    voice: (process.env.WHITEBOARD_TTS_VOICE || 'coral').trim(),
  };
}

export function speechCapability() {
  return { available: Boolean(speechSettings().key), provider: 'OpenAI' };
}

async function boundedAudio(response) {
  if (!response.body || !/^audio\//i.test(response.headers.get('content-type') || '')) {
    await response.body?.cancel();
    throw fail(502, 'The voice service returned an invalid audio response. Try again.');
  }
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_AUDIO_BYTES) throw fail(502, 'The voice clip was too large. Try a shorter explanation.');
      chunks.push(Buffer.from(value));
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
  if (!length) throw fail(502, 'The voice service returned an empty clip. Try again.');
  return Buffer.concat(chunks);
}

// Only saved, owned lessons may incur speech charges. An atomic lease deduplicates requests
// across Vercel instances. Small MP3 clips are cached in Postgres alongside their lesson.
export async function lessonAudio(id, index, userId, signal) {
  if (!UUID.test(id) || !Number.isInteger(index) || index < 0 || index > 7) throw fail(404, 'Lesson not found');
  const { rows } = await query(
    `SELECT l.lesson, l.conversation_id FROM whiteboard_lessons l
     JOIN conversations c ON c.id = l.conversation_id
     WHERE l.id = $1 AND l.user_id = $2 AND c.user_id = $2 AND c.deleted_at IS NULL`, [id, userId]
  );
  const lesson = rows[0];
  const segment = lesson?.lesson?.segments?.[index];
  if (!segment) throw fail(404, 'Lesson not found');
  const { key, model, voice } = speechSettings();
  const fingerprint = crypto.createHash('sha256').update(JSON.stringify([model, voice])).digest('hex');
  const params = [id, index, fingerprint];
  const cached = await query('SELECT audio FROM whiteboard_audio WHERE lesson_id = $1 AND segment = $2 AND fingerprint = $3', params);
  if (cached.rows[0]?.audio) return Buffer.from(cached.rows[0].audio);
  if (!key) throw fail(503, 'Voice is not set up yet. You can still read the captions and use Next step.');
  signal?.throwIfAborted();
  const quota = await query(`SELECT count(*)::int AS count FROM whiteboard_audio a JOIN whiteboard_lessons l ON l.id = a.lesson_id WHERE l.user_id = $1 AND a.created_at > now() - interval '1 hour'`, [userId]);
  if (quota.rows[0].count >= 60) throw fail(429, 'Voice generation limit reached. Read the captions or try again in an hour.');
  const token = crypto.randomUUID();
  const claimed = await query(
    `INSERT INTO whiteboard_audio (lesson_id, segment, fingerprint, lease, lease_until)
     VALUES ($1, $2, $3, $4, now() + interval '90 seconds')
     ON CONFLICT (lesson_id, segment, fingerprint) DO UPDATE SET lease = $4, lease_until = now() + interval '90 seconds'
     WHERE whiteboard_audio.audio IS NULL AND whiteboard_audio.lease_until < now() RETURNING lease`, [...params, token]
  );
  if (!claimed.rows.length) {
    const ready = await query('SELECT audio FROM whiteboard_audio WHERE lesson_id = $1 AND segment = $2 AND fingerprint = $3', params);
    if (ready.rows[0]?.audio) return Buffer.from(ready.rows[0].audio);
    throw fail(409, 'This voice clip is being prepared. Press Play again in a moment.');
  }
  const start = Date.now();
  let ok = false;
  try {
    const timeout = AbortSignal.timeout(45000);
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, voice, input: segment.speech, response_format: 'mp3', instructions: 'Explain clearly and calmly as an engineering tutor. Read units and mathematical names naturally. Speak only the supplied text.' }),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw fail(response.status === 429 ? 429 : 502, 'Voice is temporarily unavailable. Read the captions or try Play again later.');
    }
    const audio = await boundedAudio(response);
    await query('UPDATE whiteboard_audio SET audio = $5 WHERE lesson_id = $1 AND segment = $2 AND fingerprint = $3 AND lease = $4', [...params, token, audio]);
    ok = true;
    return audio;
  } catch (error) {
    await query('DELETE FROM whiteboard_audio WHERE lesson_id = $1 AND segment = $2 AND fingerprint = $3 AND lease = $4 AND audio IS NULL', [...params, token]).catch(() => {});
    if (error.status) throw error;
    throw fail(502, 'Voice could not finish loading. Read the captions or try Play again.');
  } finally {
    await recordUsage({ provider: 'OpenAI', model, purpose: 'whiteboard_narration', conversationId: lesson.conversation_id, userId, latencyMs: Date.now() - start, ok, costUsd: null, costSource: 'not_reported', meta: { characters: segment.speech.length, voice } });
  }
}
