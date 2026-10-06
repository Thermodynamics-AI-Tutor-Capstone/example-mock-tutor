import { query, ensureSchema } from './db.js';
import { recordUsage } from './usage.js';

export const MAX_DICTATION_BYTES = 3 * 1024 * 1024;
const fail = (status, message) => Object.assign(new Error(message), { status });
export function dictationCapability() {
  return { available: Boolean(process.env.OPENAI_API_KEY?.trim()), maxBytes: MAX_DICTATION_BYTES, maxSeconds: 120 };
}

export async function transcribeDictation({ buffer, contentType, userId, signal }, deps = {}) {
  if (!userId || typeof userId !== 'string') throw fail(401, 'Sign in to use voice input.');
  if (signal?.aborted) throw fail(499, 'Voice transcription was cancelled.');
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) throw fail(503, 'Voice input is not configured yet. You can still type your question.');
  const mime = String(contentType || '').split(';')[0].trim().toLowerCase();
  const extension = { 'audio/webm': 'webm', 'audio/mp4': 'mp4' }[mime];
  if (!extension) throw fail(415, 'Please record audio in WebM or MP4 format.');
  if (!Buffer.isBuffer(buffer)) throw fail(400, 'No audio was recorded. Please try again.');
  if (!buffer.length) throw fail(400, 'No audio was recorded. Please try again.');
  if (buffer.length > MAX_DICTATION_BYTES) throw fail(413, 'That recording is too large. Try a shorter explanation.');
  const valid = extension === 'webm'
    ? buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
    : buffer.subarray(4, 8).toString() === 'ftyp';
  if (!valid) throw fail(400, 'The recording could not be read. Please try again.');

  // Atomic across serverless instances; rejected/provider-failed attempts also count.
  await (deps.ensureSchema || ensureSchema)();
  if (signal?.aborted) throw fail(499, 'Voice transcription was cancelled.');
  const quota = await (deps.query || query)(`INSERT INTO dictation_limits (user_id, started_at, attempts)
    VALUES ($1, now(), 1) ON CONFLICT (user_id) DO UPDATE SET
    started_at = CASE WHEN dictation_limits.started_at <= now() - interval '1 hour' THEN now() ELSE dictation_limits.started_at END,
    attempts = CASE WHEN dictation_limits.started_at <= now() - interval '1 hour' THEN 1 ELSE dictation_limits.attempts + 1 END
    WHERE dictation_limits.started_at <= now() - interval '1 hour' OR dictation_limits.attempts < 20
    RETURNING attempts`, [userId]);
  if (!quota.rows.length) throw fail(429, 'You have reached the hourly voice-input limit. Please type for now and try again later.');

  const model = 'gpt-4o-mini-transcribe';
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mime }), `dictation.${extension}`);
  form.append('model', model);
  form.append('prompt', 'Thermodynamics tutoring. Terms may include enthalpy, entropy, isentropic, adiabatic, Rankine cycle, control volume, steam quality, kilopascals, and kilojoules per kilogram. Transcribe the spoken words; do not solve the problem or add explanations.');
  const requestSignal = AbortSignal.any([signal || new AbortController().signal, AbortSignal.timeout(deps.timeoutMs || 60_000)]);
  const started = Date.now();
  let ok = false;
  try {
    const response = await (deps.fetch || fetch)('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form,
      signal: requestSignal,
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw fail(response.status === 429 ? 429 : 502, 'Voice transcription is unavailable right now. Please try again or type your question.');
    }
    const result = await response.json();
    if (typeof result.text !== 'string' || result.text.length > 20000) throw fail(502, 'The voice service returned an invalid transcript. Please try again.');
    if (!result.text.trim()) throw fail(422, 'No speech was detected. Please try again closer to the microphone.');
    ok = true;
    return { text: result.text.trim() };
  } catch (error) {
    if (error.status) throw error;
    if (signal?.aborted) throw fail(499, 'Voice transcription was cancelled.');
    if (requestSignal.aborted) throw fail(504, 'Voice transcription timed out. Please try a shorter recording.');
    throw fail(502, 'Voice transcription did not finish. Please try again or type your question.');
  } finally {
    await (deps.recordUsage || recordUsage)({ provider: 'openai', model, purpose: 'dictation', userId,
      latencyMs: Date.now() - started, ok, costUsd: null, costSource: 'not_reported', meta: { bytes: buffer.length } });
  }
}
