// HTTP-level tests for the admin routes, share links and the admin "view as" account switcher,
// through lib/app.js with a fake Neon Auth. Never uses a real account or a paid API.
// Run: node scripts/admin-routes.test.mjs
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
delete process.env.VERCEL;
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-admin-routes-'));
process.env.USAGE_LOG_DIR = path.join(process.env.PGLITE_DIR, 'usage');
process.env.NEON_AUTH_BASE_URL = 'https://auth.admin-routes.test';

const { ensureSchema, query, closeDb } = await import('../lib/db.js');
const { handle } = await import('../lib/app.js');

const people = {
  'u-admin': { email: 'lead@example.edu', name: 'Ada Admin', admin: true },
  'u-real': { email: 'riley@psu.edu', name: 'Riley Real' },
  'u-t1': { email: 'test1@tutor.test', name: 'Jake Morrison' },
  'u-t2': { email: 'test2@tutor.test', name: 'Priya Raman' },
};
const realFetch = globalThis.fetch;
let signOuts = 0;
globalThis.fetch = async (url, options = {}) => {
  const u = String(url);
  if (u.startsWith(process.env.NEON_AUTH_BASE_URL)) {
    if (u.endsWith('/sign-out')) {
      signOuts++;
      return Response.json({ success: true });
    }
    const id = /session_token=([\w-]+)/.exec(options.headers.cookie || '')?.[1];
    return Response.json(people[id] ? { user: { id, email: people[id].email, name: people[id].name } } : null);
  }
  return realFetch(url, options);
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

try {
  await ensureSchema();
  const convs = {};
  for (const [id, p] of Object.entries(people)) {
    await query('INSERT INTO user_profiles (user_id, email, display_name, is_admin, onboarded_at) VALUES ($1, $2, $3, $4, now())', [id, p.email, p.name, p.admin || null]);
    convs[id] = crypto.randomUUID();
    await query('INSERT INTO conversations (id, title, user_id) VALUES ($1, $2, $3)', [convs[id], `Chat of ${p.name}`, id]);
    await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', $2), ($1, 'assistant', 'Hi! What is the state at the turbine inlet?')", [convs[id], `I'm ${p.name}. Help with the Rankine superheater?`]);
  }
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const call = async (url, { as, viewAs, method = 'GET', body } = {}) => {
    const cookies = [as && `session_token=${as}`, viewAs && `kelvin_view_as=${viewAs}`].filter(Boolean).join('; ');
    const r = await realFetch(origin + url, { method, headers: { ...(cookies ? { cookie: cookies } : {}), 'content-type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await r.text();
    let data = null;
    try { data = JSON.parse(text); } catch {}
    return { status: r.status, data, headers: r.headers };
  };

  await test('only admins can list and use the account switcher, and only for test accounts', async () => {
    const list = await call('/api/me/accounts', { as: 'u-admin' });
    assert.equal(list.status, 200);
    assert.deepEqual(list.data.accounts.map((a) => [a.label, a.name]), [['Test 1', 'Jake Morrison'], ['Test 2', 'Priya Raman']]);
    assert.deepEqual(list.data.self, { id: 'u-admin', name: 'Ada Admin', email: 'lead@example.edu' });
    assert.equal(list.data.current, 'u-admin');
    assert.equal((await call('/api/me/accounts', { as: 'u-real' })).status, 403);
    assert.equal((await call('/api/me/view-as', { as: 'u-real', method: 'POST', body: { userId: 'u-t1' } })).status, 403);
    assert.equal((await call('/api/me/view-as', { as: 'u-admin', method: 'POST', body: { userId: 'u-real' } })).status, 404, 'never a real student');
    const set = await call('/api/me/view-as', { as: 'u-admin', method: 'POST', body: { userId: 'u-t1' } });
    assert.equal(set.status, 200);
    assert.match(set.headers.get('set-cookie'), /^kelvin_view_as=u-t1; Max-Age=\d+; Path=\/; HttpOnly; SameSite=Lax$/);
    const back = await call('/api/me/view-as', { as: 'u-admin', viewAs: 'u-t1', method: 'POST', body: { userId: null } });
    assert.match(back.headers.get('set-cookie'), /^kelvin_view_as=; Max-Age=0/);
    assert.equal(back.data.current, 'u-admin');
  });

  await test('viewing as a test student acts as that student everywhere but the admin routes', async () => {
    const me = await call('/api/me', { as: 'u-admin', viewAs: 'u-t1' });
    assert.equal(me.data.user.id, 'u-t1');
    assert.equal(me.data.profile.display_name, 'Jake Morrison');
    assert.equal(me.data.admin, true);
    assert.deepEqual(me.data.viewer, { name: 'Ada Admin', email: 'lead@example.edu' });
    const chats = await call('/api/conversations', { as: 'u-admin', viewAs: 'u-t1' });
    assert.deepEqual(chats.data.map((c) => c.id), [convs['u-t1']]);
    const made = await call('/api/conversations', { as: 'u-admin', viewAs: 'u-t1', method: 'POST', body: {} });
    assert.equal(made.status, 201);
    const { rows } = await query('SELECT user_id FROM conversations WHERE id = $1', [made.data.id]);
    assert.equal(rows[0].user_id, 'u-t1', 'a new chat is saved to the test student');
    assert.equal((await call(`/api/conversations/${convs['u-admin']}`, { as: 'u-admin', viewAs: 'u-t1' })).status, 404, "the admin's own chats are not visible while viewing as");
    assert.equal((await call('/api/admin/overview', { as: 'u-admin', viewAs: 'u-t1' })).status, 200, 'the dashboard still works');
    const accounts = await call('/api/me/accounts', { as: 'u-admin', viewAs: 'u-t1' });
    assert.equal(accounts.data.current, 'u-t1');
    const del = await call('/api/me', { as: 'u-admin', viewAs: 'u-t1', method: 'DELETE' });
    assert.equal(del.status, 403);
    const { rows: still } = await query('SELECT deactivated_at FROM user_profiles WHERE user_id = $1', ['u-t1']);
    assert.equal(still[0].deactivated_at, null);
  });

  await test('the view-as cookie does nothing for a non-admin or a real-student target', async () => {
    const me = await call('/api/me', { as: 'u-real', viewAs: 'u-t1' });
    assert.equal(me.data.user.id, 'u-real');
    assert.equal(me.data.admin, false);
    assert.equal(me.data.viewer, null);
    const forged = await call('/api/me', { as: 'u-admin', viewAs: 'u-real' });
    assert.equal(forged.data.user.id, 'u-admin');
    assert.equal((await call('/api/admin/overview', { as: 'u-t1' })).status, 403);
  });

  await test('signing out also ends view-as', async () => {
    const r = await realFetch(origin + '/api/auth/sign-out', { method: 'POST', headers: { cookie: 'session_token=u-admin; kelvin_view_as=u-t1', 'content-type': 'application/json' }, body: '{}' });
    assert.equal(r.status, 200);
    assert.equal(signOuts, 1);
    assert.ok(r.headers.getSetCookie().some((c) => /^kelvin_view_as=; Max-Age=0/.test(c)));
  });

  await test('admins search, star and share over HTTP', async () => {
    const found = await call('/api/admin/conversations?q=superheater%20priya', { as: 'u-admin' });
    assert.equal(found.status, 200);
    assert.deepEqual(found.data.conversations.map((c) => c.id), [convs['u-t2']]);
    assert.match(found.data.conversations[0].match.snippet, /superheater/);
    assert.equal((await call(`/api/admin/conversations/${convs['u-t2']}/star`, { as: 'u-admin', method: 'PUT' })).data.starred, true);
    const starred = await call('/api/admin/conversations?filter=starred', { as: 'u-admin' });
    assert.deepEqual(starred.data.conversations.map((c) => c.id), [convs['u-t2']]);
    assert.equal((await call(`/api/admin/conversations/${convs['u-t2']}/star`, { as: 'u-admin', method: 'POST' })).status, 405);
    assert.equal((await call(`/api/admin/conversations/${convs['u-t2']}/star`, { as: 'u-real', method: 'PUT' })).status, 403);
    assert.equal((await call(`/api/admin/conversations/${convs['u-admin']}/share`, { as: 'u-admin', method: 'POST' })).status, 404);
    assert.equal((await call('/api/admin/conversations/x/y/z', { as: 'u-admin' })).status, 404);

    const link = await call(`/api/admin/conversations/${convs['u-t2']}/share`, { as: 'u-admin', method: 'POST' });
    assert.equal(link.status, 200);
    const shared = await call(`/api/share/${link.data.token}`);
    assert.equal(shared.status, 200, 'no account needed');
    assert.equal(shared.headers.get('x-robots-tag'), 'noindex, nofollow');
    const text = JSON.stringify(shared.data);
    for (const bad of ['Priya', 'Raman', 'test2', 'u-t2', convs['u-t2']]) assert.ok(!text.includes(bad), `leaked ${bad}`);
    assert.equal(shared.data.title, 'Chat of [student]');
    assert.equal(shared.data.messages[0].content, "I'm [student]. Help with the Rankine superheater?");
    const diagram = await call(`/api/share/${link.data.token}/diagram`, { method: 'POST', body: { fluid: 'water', diagram: 'nope' } });
    assert.notEqual(diagram.status, 404, 'a live link can draw diagrams');
    assert.equal((await call(`/api/share/${'a'.repeat(24)}/diagram`, { method: 'POST', body: {} })).status, 404);
    assert.equal((await call(`/api/admin/conversations/${convs['u-t2']}/share`, { as: 'u-admin', method: 'DELETE' })).status, 200);
    assert.equal((await call(`/api/share/${link.data.token}`)).status, 404);
    assert.equal((await call('/api/share/..%2F..%2Fetc')).status, 404);
  });
} finally {
  server.close();
  await closeDb();
  fs.rmSync(process.env.PGLITE_DIR, { recursive: true, force: true });
}
if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nall admin route tests passed');
