// Isolated database and fake provider: no paid API calls or real student data.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
delete process.env.VERCEL;
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-dictation-'));
process.env.USAGE_LOG_DIR = path.join(process.env.PGLITE_DIR, 'usage');
process.env.NEON_AUTH_BASE_URL = 'https://auth.dictation.test';
process.env.OPENAI_API_KEY = 'fake-key';
const { transcribeDictation, dictationCapability, MAX_DICTATION_BYTES } = await import('../lib/dictation.js');
const { query, closeDb } = await import('../lib/db.js');
const { handle } = await import('../lib/app.js');
const realFetch = globalThis.fetch;
const audio = Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0]);
const rows = [], requests = [];
let mode = 'ok';
const provider = async (url, options) => {
  requests.push(options);
  assert.equal(url, 'https://api.openai.com/v1/audio/transcriptions');
  assert.equal(options.body.get('model'), 'gpt-4o-mini-transcribe');
  assert.equal(options.headers.Authorization, 'Bearer fake-key');
  if (mode === 'wait') return new Promise((resolve, reject) => {
    if (options.signal.aborted) reject(options.signal.reason);
    else options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  });
  if (mode === 'failure') return new Response('secret provider detail', { status: 401 });
  if (mode === 'rate') return new Response('rate limited', { status: 429 });
  if (mode === 'empty') return Response.json({ text: '  ' });
  if (mode === 'bad') return Response.json({ text: 123 });
  return Response.json({ text: '  My enthalpy is 200 kilojoules per kilogram.  ' });
};
const deps = { fetch: provider, recordUsage: async row => rows.push(row) };
const input = { buffer: audio, contentType: 'audio/webm;codecs=opus', userId: 'student' };
let failed = 0;
const test = async (name, fn) => {
  try { await fn(); console.log(`ok  ${name}`); }
  catch (error) { failed++; console.error(`FAIL ${name}\n${error.stack}`); }
};
const rejects = (fn, status) => assert.rejects(fn, error => error.status === status);
const server = http.createServer((req, res) => handle(req, res));
try {
  await test('first transcription initializes its own schema and fixes the selected model', async () => {
    const result = await transcribeDictation(input, deps);
    assert.equal(result.text, 'My enthalpy is 200 kilojoules per kilogram.');
    assert.equal(rows[0].ok, true);
    assert.equal(rows[0].purpose, 'dictation');
    assert.equal(rows[0].model, 'gpt-4o-mini-transcribe');
    assert.deepEqual(rows[0].meta, { bytes: audio.length });
    assert.equal(rows[0].costUsd, null);
    assert.equal((await query('SELECT attempts FROM dictation_limits WHERE user_id = $1', ['student'])).rows[0].attempts, 1);
  });
  await test('missing authentication, disabled service and invalid audio never call provider', async () => {
    const count = requests.length;
    await rejects(() => transcribeDictation({ ...input, userId: null }, deps), 401);
    delete process.env.OPENAI_API_KEY;
    assert.equal(dictationCapability().available, false);
    await rejects(() => transcribeDictation(input, deps), 503);
    process.env.OPENAI_API_KEY = 'fake-key';
    for (const [change, status] of [
      [{ buffer: null }, 400], [{ buffer: Buffer.alloc(0) }, 400],
      [{ buffer: Buffer.alloc(MAX_DICTATION_BYTES + 1) }, 413],
      [{ buffer: Buffer.from('bad') }, 400], [{ contentType: 'audio/wav' }, 415],
      [{ contentType: 'audio/mp4' }, 400],
    ]) await rejects(() => transcribeDictation({ ...input, ...change }, deps), status);
    assert.equal(requests.length, count);
  });
  await test('MP4 accepted and provider errors are safe, with failed usage recorded', async () => {
    await transcribeDictation({ ...input, contentType: 'audio/mp4', buffer: Buffer.from('\x00\x00\x00\x18ftypmp42') }, deps);
    for (const [nextMode, status] of [['failure', 502], ['rate', 429], ['empty', 422], ['bad', 502]]) {
      mode = nextMode;
      await assert.rejects(() => transcribeDictation(input, deps), error => error.status === status && !error.message.includes('secret'));
      assert.equal(rows.at(-1).ok, false);
    }
    mode = 'ok';
  });
  await test('cancellation stops provider work and timeout returns 504', async () => {
    const controller = new AbortController();
    controller.abort();
    const count = requests.length;
    await rejects(() => transcribeDictation({ ...input, signal: controller.signal }, deps), 499);
    assert.equal(requests.length, count);
    mode = 'wait';
    const active = new AbortController();
    const pending = transcribeDictation({ ...input, signal: active.signal }, deps);
    setTimeout(() => active.abort(), 30);
    await rejects(() => pending, 499);
    await rejects(() => transcribeDictation(input, { ...deps, timeoutMs: 20 }), 504);
    mode = 'ok';
  });
  await test('atomic quota caps concurrent requests per user and resets after one hour', async () => {
    const limited = { ...input, userId: 'concurrent' };
    const results = await Promise.allSettled(Array.from({ length: 22 }, () => transcribeDictation(limited, deps)));
    assert.equal(results.filter(result => result.status === 'fulfilled').length, 20);
    assert.equal(results.filter(result => result.reason?.status === 429).length, 2);
    assert.equal((await query('SELECT attempts FROM dictation_limits WHERE user_id = $1', ['concurrent'])).rows[0].attempts, 20);
    await transcribeDictation({ ...input, userId: 'separate-user' }, deps);
    await query("UPDATE dictation_limits SET started_at = now() - interval '61 minutes' WHERE user_id = $1", ['concurrent']);
    await transcribeDictation(limited, deps);
    assert.equal((await query('SELECT attempts FROM dictation_limits WHERE user_id = $1', ['concurrent'])).rows[0].attempts, 1);
  });
  globalThis.fetch = async (url, options = {}) => {
    if (String(url).startsWith(process.env.NEON_AUTH_BASE_URL)) return Response.json({ user: { id: 'http-student', email: 'test@example.test' } });
    return provider(url, options);
  };
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const endpoint = `http://127.0.0.1:${server.address().port}/api/dictation`;
  await test('GET and POST require sign-in; authenticated capability is private', async () => {
    assert.equal((await realFetch(endpoint)).status, 401);
    assert.equal((await realFetch(endpoint, { method: 'POST', body: audio })).status, 401);
    const response = await realFetch(endpoint, { headers: { cookie: 'session_token=test' } });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('cache-control'), /no-store/);
    assert.deepEqual(await response.json(), { available: true, maxBytes: MAX_DICTATION_BYTES, maxSeconds: 120 });
  });
  await test('authenticated route transcribes without saving audio or transcript', async () => {
    const response = await realFetch(endpoint, { method: 'POST', headers: { cookie: 'session_token=test', 'content-type': 'audio/webm' }, body: audio });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).text, 'My enthalpy is 200 kilojoules per kilogram.');
    assert.equal((await query('SELECT count(*)::int AS n FROM messages')).rows[0].n, 0);
    assert.equal((await query('SELECT count(*)::int AS n FROM attachments')).rows[0].n, 0);
    const response405 = await realFetch(endpoint, { method: 'DELETE', headers: { cookie: 'session_token=test' } });
    assert.equal(response405.status, 405);
  });
} finally {
  globalThis.fetch = realFetch;
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  await closeDb();
  // Only the temporary directory created above is removed.
  const cleanupPath = path.resolve(process.env.PGLITE_DIR);
  assert.equal(path.dirname(cleanupPath), path.resolve(os.tmpdir()));
  assert.ok(path.basename(cleanupPath).startsWith('kelvin-dictation-'));
  fs.rmSync(cleanupPath, { recursive: true, force: true });
}
if (failed) process.exitCode = 1;
