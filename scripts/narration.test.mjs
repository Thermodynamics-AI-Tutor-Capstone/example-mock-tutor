// Real schema/routes and a fake speech provider; never uses a paid API or a real account.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { lessonInput } from './fixtures/narrated-lesson.mjs';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
delete process.env.OPENAI_API_KEY;
delete process.env.WHITEBOARD_TTS_MODEL;
delete process.env.WHITEBOARD_TTS_VOICE;
delete process.env.VERCEL;
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-narration-'));
process.env.USAGE_LOG_DIR = path.join(process.env.PGLITE_DIR, 'usage');
process.env.NEON_AUTH_BASE_URL = 'https://auth.narration.test';

const { ensureSchema, query, closeDb } = await import('../lib/db.js');
const { validateLesson, saveLesson, lessonAudio, speechCapability } = await import('../lib/whiteboard.js');
const { default: explain, available } = await import('../lib/tools/explain_on_whiteboard.js');
const { handle } = await import('../lib/app.js');
const { runAgentTurn } = await import('../lib/agent.js');
const { findStyle } = await import('../lib/styles.js');
const realFetch = globalThis.fetch;
let speechCalls = 0, speechMode = 'ok', releaseSpeech, modelRound = 0;
const bytes = Buffer.from('ID3-fake-mp3-for-server-tests');
const requests = [];
globalThis.fetch = async (url, options = {}) => {
  if (String(url).startsWith(process.env.NEON_AUTH_BASE_URL)) {
    const cookie = options.headers.cookie;
    return Response.json({ user: { id: cookie.includes('other') ? 'other' : 'student', email: 'test@example.test' } });
  }
  if (String(url) === 'https://api.openai.com/v1/audio/speech') {
    speechCalls++;
    requests.push(JSON.parse(options.body));
    if (speechMode === 'wait') await new Promise((resolve) => { releaseSpeech = resolve; });
    if (speechMode === 'failure') return new Response('secret provider error should not leak', { status: 401 });
    if (speechMode === 'oversize') return new Response(Buffer.alloc(1024 * 1024 + 1), { headers: { 'Content-Type': 'audio/mpeg' } });
    if (speechMode === 'empty') return new Response('', { headers: { 'Content-Type': 'audio/mpeg' } });
    if (speechMode === 'invalid') return Response.json({ bad: true });
    return new Response(bytes, { headers: { 'Content-Type': 'audio/mpeg' } });
  }
  if (String(url).endsWith('/chat/completions')) {
    const delta = modelRound++ === 0
      ? { tool_calls: [{ index: 0, id: 'lesson-call', function: { name: 'explain_on_whiteboard', arguments: JSON.stringify(lessonInput) } }] }
      : { content: 'Which words justify steady state?' };
    return new Response('data: ' + JSON.stringify({ choices: [{ delta }] }) + '\n\ndata: [DONE]\n\n');
  }
  return realFetch(url, options);
};
const server = http.createServer((req, res) => handle(req, res));
let failed = 0;
async function test(name, fn) {
  try { await fn(); console.log(`ok  ${name}`); }
  catch (error) { failed++; console.error(`FAIL ${name}\n${error.stack}`); }
}

try {
  await ensureSchema();
  const conversationId = crypto.randomUUID();
  await query('INSERT INTO conversations (id, title, user_id) VALUES ($1, $2, $3)', [conversationId, 'Narration test', 'student']);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const req = (url, { user = 'student', method = 'POST' } = {}) => realFetch(origin + url, { method, headers: user ? { cookie: `session_token=${user}` } : {} });
  const ctx = { userId: 'student', conversationId };
  let board;

  await test('bounded lesson validation rejects absent, duplicate, out-of-order and unknown drawing cues', () => {
    assert.equal(validateLesson(lessonInput).segments.length, 3);
    const alter = (fn) => { const copy = structuredClone(lessonInput); fn(copy); return copy; };
    assert.throws(() => validateLesson(alter((x) => x.segments.pop())), /Every board/);
    assert.throws(() => validateLesson(alter((x) => x.segments[0].cues.push({ target: 'node:turbine', at: .8 }))), /unrevealed/);
    assert.throws(() => validateLesson(alter((x) => x.segments[0].cues[0].target = 'node:missing')), /existing/);
    assert.throws(() => validateLesson(alter((x) => x.segments[0].cues[0].target = 'arrow:0')), /both nodes/);
    assert.throws(() => validateLesson(alter((x) => x.segments[0].cues[1].at = -1)), /positions/);
    assert.throws(() => validateLesson(alter((x) => x.segments[0].speech = 'a'.repeat(501))), /500/);
    assert.throws(() => validateLesson({ ...lessonInput, html: 'bad' }), /only/);
  });
  await test('the tool saves an owned lesson without a key and prevents duplicate boards', async () => {
    assert.equal(available(ctx), true);
    assert.equal(available({}), false);
    assert.deepEqual(speechCapability(), { available: false, provider: 'OpenAI' });
    const out = await explain(lessonInput, ctx);
    assert.ok(out.figure, out.error);
    board = JSON.parse(out.figure.split('\n')[1]);
    assert.equal(board.lesson.segments.length, 3);
    assert.match((await explain(lessonInput, ctx)).error, /already shown/);
    assert.equal((await query('SELECT count(*)::int AS n FROM whiteboard_lessons')).rows[0].n, 1);
    await assert.rejects(saveLesson(lessonInput, { ...ctx, userId: 'other' }), { status: 404 });
  });
  const audioPath = () => `/api/whiteboard/${board.lesson.id}/audio/0`;
  await test('routes enforce authentication, ownership, methods and a useful missing-key fallback', async () => {
    assert.equal((await req(audioPath(), { user: null })).status, 401);
    assert.equal((await req(audioPath(), { user: 'other' })).status, 404);
    assert.equal((await req(audioPath(), { method: 'GET' })).status, 405);
    const missing = await req(audioPath());
    assert.equal(missing.status, 503);
    assert.match((await missing.json()).error, /Next step/);
    assert.equal(speechCalls, 0);
    const capability = await req('/api/whiteboard/voice', { method: 'GET' });
    assert.equal((await capability.json()).available, false);
  });
  await test('adding a key enables audio without recreating the lesson; replays use the cache', async () => {
    process.env.OPENAI_API_KEY = 'fake-test-key';
    const response = await req(audioPath());
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'audio/mpeg');
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
    assert.equal(speechCalls, 1);
    assert.equal(requests[0].input, lessonInput.segments[0].speech);
    assert.equal(requests[0].model, 'gpt-4o-mini-tts');
    assert.equal((await req(audioPath())).status, 200);
    assert.equal(speechCalls, 1);
    delete process.env.OPENAI_API_KEY;
    assert.equal((await req(audioPath())).status, 200, 'cached clips still play without a key');
    process.env.OPENAI_API_KEY = 'fake-test-key';
  });
  await test('parallel requests cannot pay twice for one clip', async () => {
    speechMode = 'wait';
    const first = lessonAudio(board.lesson.id, 1, 'student');
    while (!releaseSpeech) await new Promise((resolve) => setTimeout(resolve, 10));
    await assert.rejects(lessonAudio(board.lesson.id, 1, 'student'), { status: 409 });
    releaseSpeech();
    assert.deepEqual(await first, bytes);
    speechMode = 'ok';
  });
  await test('failed, invalid, empty and oversized speech responses are retryable and do not expose provider errors', async () => {
    for (speechMode of ['failure', 'invalid', 'empty', 'oversize']) {
      await assert.rejects(lessonAudio(board.lesson.id, 2, 'student'), (e) => e.status === 502 && !e.message.includes('secret'));
      assert.equal((await query('SELECT count(*)::int AS n FROM whiteboard_audio WHERE segment = 2')).rows[0].n, 0);
    }
    speechMode = 'ok';
    assert.deepEqual(await lessonAudio(board.lesson.id, 2, 'student'), bytes);
  });
  await test('changing the voice creates a distinct cached clip', async () => {
    const before = speechCalls;
    process.env.WHITEBOARD_TTS_VOICE = 'alloy';
    await lessonAudio(board.lesson.id, 0, 'student');
    assert.equal(speechCalls, before + 1);
    assert.equal(requests.at(-1).voice, 'alloy');
    delete process.env.WHITEBOARD_TTS_VOICE;
  });
  await test('an expired generation lease is recoverable after a worker stops', async () => {
    const fingerprint = crypto.createHash('sha256').update(JSON.stringify(['gpt-4o-mini-tts', 'coral'])).digest('hex');
    const fresh = await saveLesson(lessonInput, ctx);
    await query(`INSERT INTO whiteboard_audio (lesson_id, segment, fingerprint, lease, lease_until) VALUES ($1, 0, $2, $3, now() - interval '1 second')`, [fresh.lesson.id, fingerprint, crypto.randomUUID()]);
    assert.deepEqual(await lessonAudio(fresh.lesson.id, 0, 'student'), bytes);
  });
  await test('the agent streams a persistent narrated figure before its follow-up question', async () => {
    const emitted = [];
    const result = await runAgentTurn({
      history: [{ role: 'user', content: 'Explain this on the narrated whiteboard.' }],
      apiKey: 'fake-deepseek-key', style: findStyle('office-hours'), ...ctx,
      skills: [], knowledge: { fileCount: 0, cards: [], l0: '', summary: '' }, tutoringState: {},
      emit: (event) => emitted.push(event),
    });
    assert.equal(result.error, null);
    assert.match(result.text, /```kelvin-board\n/);
    assert.match(result.text, /"lesson":/);
    assert.match(result.text, /Which words justify steady state\?$/);
    assert.equal(emitted.filter((e) => e.type === 'delta').map((e) => e.content).join(''), result.text);
  });
  await test('hidden conversations and deactivated accounts cannot retrieve even cached narration', async () => {
    await query('UPDATE conversations SET deleted_at = now() WHERE id = $1', [conversationId]);
    assert.equal((await req(audioPath())).status, 404);
    await query('UPDATE conversations SET deleted_at = NULL WHERE id = $1', [conversationId]);
    await query('INSERT INTO user_profiles (user_id, deactivated_at) VALUES ($1, now())', ['student']);
    assert.equal((await req(audioPath())).status, 403);
  });
  await test('generation limits protect new clips while cached audio remains usable', async () => {
    await query('UPDATE user_profiles SET deactivated_at = NULL WHERE user_id = $1', ['student']);
    await query(`INSERT INTO whiteboard_audio (lesson_id, segment, fingerprint, lease, lease_until, audio)
      SELECT $1, 0, 'quota-' || i, $2, now(), $3 FROM generate_series(1, 60) AS i`, [board.lesson.id, crypto.randomUUID(), bytes]);
    const fresh = await saveLesson(lessonInput, ctx);
    await assert.rejects(lessonAudio(fresh.lesson.id, 0, 'student'), { status: 429 });
    assert.deepEqual(await lessonAudio(board.lesson.id, 0, 'student'), bytes);
  });
} finally {
  globalThis.fetch = realFetch;
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  await closeDb();
  assert.equal(path.dirname(path.resolve(process.env.PGLITE_DIR)), path.resolve(os.tmpdir()));
  assert.ok(path.basename(process.env.PGLITE_DIR).startsWith('kelvin-narration-'));
  fs.rmSync(process.env.PGLITE_DIR, { recursive: true, force: true });
}
if (failed) process.exitCode = 1;
