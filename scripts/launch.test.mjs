// HTTP-level tests for what students can and can't do before the trial: they can't change the
// capstone team's testing switches, and a failed reply shows them a plain message instead of the
// provider's error. Through lib/app.js with a fake Neon Auth; every other network call is refused,
// so nothing paid can run. Run: node scripts/launch.test.mjs
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
delete process.env.VERCEL;
delete process.env.DEEPSEEK_API_KEY;
delete process.env.OPENROUTER_API_KEY;
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-launch-'));
process.env.USAGE_LOG_DIR = path.join(process.env.PGLITE_DIR, 'usage');
process.env.NEON_AUTH_BASE_URL = 'https://auth.launch.test';

const { ensureSchema, query, closeDb } = await import('../lib/db.js');
const { handle } = await import('../lib/app.js');

const people = {
  'u-student': { email: 'mary.smith@kelvin-students.test', name: 'Mary Smith', username: 'Mary Smith' },
  'u-team': { email: 'riley@psu.edu', name: 'Riley Team' },
  'u-admin': { email: 'lead@example.edu', name: 'Ada Admin', admin: true },
};
globalThis.fetch = async (url, options = {}) => {
  const u = String(url);
  if (!u.startsWith(process.env.NEON_AUTH_BASE_URL)) throw new Error(`network disabled in this test: ${u}`);
  const id = /session_token=([\w-]+)/.exec(options.headers?.cookie || '')?.[1];
  return Response.json(people[id] ? { user: { id, email: people[id].email, name: people[id].name } } : null);
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
const as = (id, method, p, body) =>
  fetchLocal(`${base}${p}`, { method, headers: { cookie: `__Secure-neon-auth.session_token=${id}`, 'content-type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
// The test's own requests go to the local server, past the fetch stub above.
const { request } = http;
function fetchLocal(url, { method, headers, body }) {
  return new Promise((resolve, reject) => {
    const req = request(url, { method, headers }, (res) => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (text += c));
      res.on('end', () => resolve({ status: res.statusCode, text, json: () => JSON.parse(text) }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

try {
  await ensureSchema();
  for (const [id, p] of Object.entries(people)) {
    await query('INSERT INTO user_profiles (user_id, email, display_name, username, is_admin, onboarded_at) VALUES ($1, $2, $3, $4, $5, now())', [id, p.email, p.name, p.username || null, p.admin || null]);
  }

  await test("a student can't change the testing switches; the profile fields still save", async () => {
    const r = await as('u-student', 'PUT', '/api/me/profile', { use_jev: false, show_decisions: true, style_router: 'skills', course_number: 'ME 300' });
    assert.equal(r.status, 200, r.text);
    const p = r.json().profile;
    assert.equal(p.use_jev, true);
    assert.equal(p.show_decisions, false);
    assert.equal(p.style_router, 'jev');
    assert.equal(p.course_number, 'ME 300');
  });

  await test('a team account (signs in by email) still can', async () => {
    const r = await as('u-team', 'PUT', '/api/me/profile', { use_jev: false, show_decisions: true, style_router: 'skills' });
    assert.equal(r.status, 200, r.text);
    const p = r.json().profile;
    assert.equal(p.use_jev, false);
    assert.equal(p.show_decisions, true);
    assert.equal(p.style_router, 'skills');
  });

  // With no model key configured the reply fails ("No API key found ..."): the student sees the plain
  // message, the admin sees the real reason.
  const failedReply = async (id) => {
    const conv = crypto.randomUUID();
    await query('INSERT INTO conversations (id, title, user_id) VALUES ($1, $2, $3)', [conv, 'New chat', id]);
    const r = await as(id, 'POST', `/api/conversations/${conv}/messages`, { content: 'what is enthalpy?' });
    assert.equal(r.status, 200, r.text);
    const errors = r.text.split('\n').filter((l) => l.startsWith('data: ')).map((l) => JSON.parse(l.slice(6))).filter((e) => e.type === 'error');
    assert.equal(errors.length, 1, r.text);
    return errors[0].message;
  };

  await test('a failed reply shows a student a plain message, not the provider error', async () => {
    const message = await failedReply('u-student');
    assert.match(message, /Kelvin couldn't answer just now/);
    assert.doesNotMatch(message, /API key|DEEPSEEK|environment variable/i);
  });

  await test('an admin still sees why the reply failed', async () => {
    assert.match(await failedReply('u-admin'), /No API key found/);
  });
} finally {
  server.close();
  await closeDb();
}
if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log('\nall launch tests passed');
