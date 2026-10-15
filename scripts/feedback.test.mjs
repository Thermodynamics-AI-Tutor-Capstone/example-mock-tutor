// HTTP-level tests for students' feedback on Kelvin (lib/feedback.js) and the admin Feedback tab
// (lib/admin.js feedback), through lib/app.js with a fake Neon Auth and a scripted fake of DeepSeek.
// Every other network call is refused, so nothing paid can run. Run: node scripts/feedback.test.mjs
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
delete process.env.VERCEL;
delete process.env.OPENROUTER_API_KEY;
delete process.env.DEEPSEEK_BASE_URL;
process.env.DEEPSEEK_API_KEY = 'test-key';
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-feedback-'));
process.env.USAGE_LOG_DIR = path.join(process.env.PGLITE_DIR, 'usage');
process.env.NEON_AUTH_BASE_URL = 'https://auth.feedback.test';

const { ensureSchema, query, closeDb } = await import('../lib/db.js');
const { handle } = await import('../lib/app.js');
const { FEEDBACK_PER_DAY, FEEDBACK_MAX_CHARS } = await import('../lib/feedback.js');

const people = {
  'u-mary': { email: 'mary.smith@kelvin-students.test', name: 'Mary Smith', username: 'Mary Smith' },
  'u-john': { email: 'john.jones@kelvin-students.test', name: 'John Jones', username: 'John Jones' },
  'u-test': { email: 'test4@tutor.test', name: 'Tess Test' },
  'u-admin': { email: 'lead@example.edu', name: 'Ada Admin', admin: true },
};
const REPLY = 'Enthalpy is $h = u + Pv$. What do you already know about the state?';
globalThis.fetch = async (url, options = {}) => {
  const u = String(url);
  if (u.startsWith(process.env.NEON_AUTH_BASE_URL)) {
    const id = /session_token=([\w-]+)/.exec(options.headers?.cookie || '')?.[1];
    return Response.json(people[id] ? { user: { id, email: people[id].email, name: people[id].name } } : null);
  }
  if (u.startsWith('https://api.deepseek.com') && u.endsWith('/chat/completions')) {
    const body = JSON.parse(options.body);
    if (!body.stream) return Response.json({ choices: [{ message: { role: 'assistant', content: 'Enthalpy' }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 1 } });
    const lines = [{ choices: [{ delta: { content: REPLY } }] }, { choices: [{ delta: {}, finish_reason: 'stop' }] }];
    const sse = lines.map((l) => `data: ${JSON.stringify(l)}\n\n`).join('') + 'data: [DONE]\n\n';
    return new Response(sse, { headers: { 'content-type': 'text/event-stream' } });
  }
  throw new Error(`network disabled in this test: ${u}`);
};
const server = http.createServer((req, res) => handle(req, res));

let failed = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log(`ok  ${name}`);
  } catch (error) {
    failed++;
    console.error(`FAIL ${name}\n${error.stack}`);
  }
}

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const { request } = http;
function call(id, method, p, body) {
  const headers = { 'content-type': 'application/json', ...(id ? { cookie: `__Secure-neon-auth.session_token=${id}` } : {}) };
  return new Promise((resolve, reject) => {
    const req = request(`${base}${p}`, { method, headers }, (res) => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (text += c));
      res.on('end', () => {
        let data = null;
        try { data = JSON.parse(text); } catch {}
        resolve({ status: res.statusCode, text, data });
      });
    });
    req.on('error', reject);
    req.end(body === undefined ? undefined : JSON.stringify(body));
  });
}
const send = (id, body) => call(id, 'POST', '/api/feedback', body);

const forbidden = Object.entries(people).flatMap(([id, p]) => [id, p.email, p.name]);
const leaks = (payload) => forbidden.filter((f) => JSON.stringify(payload).includes(f));

try {
  await ensureSchema();
  const chats = {};
  const replies = {};
  const asks = {};
  for (const [i, [id, p]] of Object.entries(people).entries()) {
    await query('INSERT INTO user_profiles (user_id, email, display_name, username, is_admin, onboarded_at) VALUES ($1, $2, $3, $4, $5, now())', [id, p.email, p.name, p.username || null, p.admin || null]);
    chats[id] = crypto.randomUUID();
    await query('INSERT INTO conversations (id, title, user_id) VALUES ($1, $2, $3)', [chats[id], `Rankine help #${i + 1}`, id]);
    const { rows } = await query(
      "INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', 'How do I find h2?'), ($1, 'assistant', 'What do you know at state 2? Look at the turbine inlet first.') RETURNING id, role",
      [chats[id]]
    );
    asks[id] = Number(rows.find((r) => r.role === 'user').id);
    replies[id] = Number(rows.find((r) => r.role === 'assistant').id);
  }

  await test('a student rates one of Kelvin\'s replies and says why', async () => {
    const r = await send('u-mary', { conversationId: chats['u-mary'], messageId: replies['u-mary'], rating: 'down', text: '  It gave me the answer straight away.  ' });
    assert.equal(r.status, 201, r.text);
    assert.equal(r.data.rating, 'down');
    assert.equal(r.data.messageId, replies['u-mary']);
    const { rows } = await query('SELECT user_id, conversation_id, message_id, rating, body FROM feedback WHERE id = $1', [r.data.id]);
    assert.deepEqual({ ...rows[0], message_id: Number(rows[0].message_id) }, {
      user_id: 'u-mary', conversation_id: chats['u-mary'], message_id: replies['u-mary'], rating: 'down', body: 'It gave me the answer straight away.',
    });
  });

  await test('feedback can be about a whole chat, or about Kelvin with no chat open', async () => {
    const chat = await send('u-mary', { conversationId: chats['u-mary'], text: 'The hints were good but slow.' });
    assert.equal(chat.status, 201, chat.text);
    const general = await send('u-mary', { rating: 'up' });
    assert.equal(general.status, 201, general.text);
    const { rows } = await query('SELECT conversation_id, message_id, rating, body FROM feedback WHERE id = ANY($1::bigint[]) ORDER BY id', [[chat.data.id, general.data.id]]);
    assert.deepEqual(rows, [
      { conversation_id: chats['u-mary'], message_id: null, rating: null, body: 'The hints were good but slow.' },
      { conversation_id: null, message_id: null, rating: 'up', body: '' },
    ]);
  });

  await test('a rating or a comment is required, and both are checked', async () => {
    const bad = [
      [{}, 400],
      [{ text: '   ' }, 400],
      [{ rating: 'meh' }, 400],
      [{ rating: 'up', text: 42 }, 400],
      [{ text: 'x'.repeat(FEEDBACK_MAX_CHARS + 1) }, 400],
      [{ messageId: replies['u-mary'], rating: 'up' }, 400],
    ];
    for (const [body, status] of bad) assert.equal((await send('u-mary', body)).status, status, JSON.stringify(body).slice(0, 80));
    assert.equal((await send('u-mary', { text: 'x'.repeat(FEEDBACK_MAX_CHARS) })).status, 201);
  });

  await test('nobody can leave feedback on someone else\'s chat or reply, a question, or a deleted chat', async () => {
    assert.equal((await send('u-mary', { conversationId: chats['u-john'], rating: 'up' })).status, 404);
    assert.equal((await send('u-mary', { conversationId: chats['u-mary'], messageId: replies['u-john'], rating: 'up' })).status, 404);
    assert.equal((await send('u-mary', { conversationId: chats['u-mary'], messageId: asks['u-mary'], rating: 'up' })).status, 404);
    assert.equal((await send('u-mary', { conversationId: 'not-a-uuid', rating: 'up' })).status, 404);
    assert.equal((await send('u-mary', { conversationId: chats['u-mary'], messageId: 'abc', rating: 'up' })).status, 404);
    const gone = crypto.randomUUID();
    await query('INSERT INTO conversations (id, title, user_id, deleted_at) VALUES ($1, $2, $3, now())', [gone, 'Deleted chat', 'u-mary']);
    assert.equal((await send('u-mary', { conversationId: gone, rating: 'up' })).status, 404);
    const { rows } = await query("SELECT count(*) AS n FROM feedback WHERE user_id = 'u-mary' AND conversation_id IN ($1, $2)", [chats['u-john'], gone]);
    assert.equal(Number(rows[0].n), 0);
  });

  await test('signed out, or the wrong method, is refused', async () => {
    assert.equal((await send(null, { rating: 'up' })).status, 401);
    assert.equal((await call('u-mary', 'GET', '/api/feedback')).status, 405);
  });

  await test(`at most ${FEEDBACK_PER_DAY} a day per student; older feedback doesn't count`, async () => {
    const { rows } = await query("SELECT count(*) AS n FROM feedback WHERE user_id = 'u-john'");
    for (let i = Number(rows[0].n); i < FEEDBACK_PER_DAY; i++) {
      await query("INSERT INTO feedback (user_id, conversation_id, rating) VALUES ('u-john', $1, 'up')", [chats['u-john']]);
    }
    const capped = await send('u-john', { conversationId: chats['u-john'], rating: 'up' });
    assert.equal(capped.status, 429, capped.text);
    assert.match(capped.data.error, /a lot of feedback today/);
    await query("UPDATE feedback SET created_at = now() - interval '2 days' WHERE user_id = 'u-john'");
    assert.equal((await send('u-john', { conversationId: chats['u-john'], rating: 'up' })).status, 201);
    await query("DELETE FROM feedback WHERE user_id = 'u-john'");
  });

  await test('a finished reply tells the browser its message id, so its thumbs can rate it', async () => {
    const conv = crypto.randomUUID();
    await query('INSERT INTO conversations (id, title, user_id) VALUES ($1, $2, $3)', [conv, 'New chat', 'u-john']);
    const r = await call('u-john', 'POST', `/api/conversations/${conv}/messages`, { content: 'what is enthalpy?' });
    assert.equal(r.status, 200, r.text);
    const events = r.text.split('\n').filter((l) => l.startsWith('data: ')).map((l) => JSON.parse(l.slice(6)));
    const done = events.find((e) => e.type === 'done');
    assert.ok(done, r.text);
    const { rows } = await query("SELECT id, content FROM messages WHERE conversation_id = $1 AND role = 'assistant'", [conv]);
    assert.equal(rows.length, 1);
    assert.equal(done.messageId, Number(rows[0].id));
    assert.equal(rows[0].content, REPLY);
    const fb = await send('u-john', { conversationId: conv, messageId: done.messageId, rating: 'up', text: 'Clear.' });
    assert.equal(fb.status, 201, fb.text);
  });

  await test('admins see every student\'s feedback, newest first, with the chat and reply it is about', async () => {
    await send('u-test', { conversationId: chats['u-test'], messageId: replies['u-test'], rating: 'down', text: 'Wrong steam table value.' });
    await send('u-admin', { conversationId: chats['u-admin'], rating: 'up', text: 'Admin trying the button.' });
    const r = await call('u-admin', 'GET', '/api/admin/feedback');
    assert.equal(r.status, 200, r.text);
    const list = r.data.feedback;
    assert.equal(r.data.total, list.length);
    assert.ok(list.every((f, i) => i === 0 || new Date(list[i - 1].at) >= new Date(f.at)), 'newest first');
    assert.ok(!list.some((f) => f.text === 'Admin trying the button.'), 'admins are left out, as everywhere in the dashboard');
    const mine = list.find((f) => f.text === 'It gave me the answer straight away.');
    assert.equal(mine.rating, 'down');
    assert.match(mine.student, /^Student \d+$/);
    assert.equal(mine.category, 'real');
    assert.deepEqual(mine.conversation, { id: chats['u-mary'], title: 'Rankine help #1', deleted: false, missing: false });
    assert.equal(mine.messageId, replies['u-mary']);
    assert.match(mine.reply, /^What do you know at state 2\?/);
    const general = list.find((f) => f.conversation === null && f.rating === 'up');
    assert.ok(general && general.rating === 'up' && general.reply === null);
    assert.equal(list.find((f) => f.text === 'Wrong steam table value.').category, 'eval');
    assert.deepEqual(leaks(r.data), []);
    assert.equal(r.data.down, list.filter((f) => f.rating === 'down').length);
    assert.equal(r.data.up, list.filter((f) => f.rating === 'up').length);
  });

  await test('the admin group filter and paging work', async () => {
    const real = (await call('u-admin', 'GET', '/api/admin/feedback?group=real')).data;
    const ev = (await call('u-admin', 'GET', '/api/admin/feedback?group=eval')).data;
    const all = (await call('u-admin', 'GET', '/api/admin/feedback')).data;
    assert.ok(real.feedback.every((f) => f.category === 'real'));
    assert.deepEqual(ev.feedback.map((f) => f.text), ['Wrong steam table value.']);
    assert.equal(real.total + ev.total, all.total);
    const page2 = (await call('u-admin', 'GET', '/api/admin/feedback?offset=2')).data;
    assert.deepEqual(page2.feedback.map((f) => f.id), all.feedback.slice(2).map((f) => f.id));
  });

  await test('only admins can read feedback', async () => {
    assert.equal((await call('u-mary', 'GET', '/api/admin/feedback')).status, 403);
    assert.equal((await call(null, 'GET', '/api/admin/feedback')).status, 401);
  });

  await test('the admin chat view shows each piece of feedback with the reply it is about', async () => {
    const r = await call('u-admin', 'GET', `/api/admin/conversations/${chats['u-mary']}`);
    assert.equal(r.status, 200, r.text);
    const reply = r.data.messages.find((m) => m.role === 'assistant');
    assert.equal(reply.id, replies['u-mary']);
    const onReply = r.data.feedback.filter((f) => f.messageId === reply.id);
    assert.deepEqual(onReply.map((f) => [f.rating, f.text]), [['down', 'It gave me the answer straight away.']]);
    assert.ok(r.data.feedback.some((f) => f.messageId === null && f.text === 'The hints were good but slow.'));
    assert.deepEqual(leaks(r.data), []);
  });
} finally {
  server.close();
  await closeDb();
}
if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log('\nall feedback tests passed');
