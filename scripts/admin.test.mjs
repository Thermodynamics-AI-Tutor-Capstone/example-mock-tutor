// Tests for the admin dashboard's data layer (lib/admin.js) and the committed eval results, on a
// throwaway PGlite database. Run: node scripts/admin.test.mjs
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-admin-'));
process.env.USAGE_LOG_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-usage-'));

const { query, closeDb, ensureSchema } = await import('../lib/db.js');
await ensureSchema();
const auth = await import('../lib/auth.js');
const { isAdmin, getProfile } = auth;
const admin = await import('../lib/admin.js');

let failed = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log(`ok  ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${name}\n     ${err.stack || err.message}`);
  }
}

const people = [
  { id: 'u-admin', email: 'lead@example.edu', name: 'Ada Admin', admin: true },
  { id: 'u-real', email: 'student@psu.edu', name: 'Riley Real' },
  { id: 'u-test', email: 'test3@tutor.test', name: 'Tess Test' },
  { id: 'u-eval', email: 'kelvin-eval@thermo-tutor.test', name: 'Eve Eval' },
  { id: 'u-gone', email: 'gone@psu.edu', name: 'Gwen Gone', deactivated: true },
];
let day = 0;
for (const p of people) {
  await query(
    `INSERT INTO user_profiles (user_id, email, display_name, is_admin, deactivated_at, created_at) VALUES ($1, $2, $3, $4, $5, now() - make_interval(days => $6))`,
    [p.id, p.email, p.name, p.admin || null, p.deactivated ? new Date() : null, 10 - day++]
  );
}
const convs = {};
for (const p of people) {
  const id = crypto.randomUUID();
  convs[p.id] = id;
  await query('INSERT INTO conversations (id, title, user_id, style, deleted_at) VALUES ($1, $2, $3, $4, $5)', [id, 'Rankine cycle help', p.id, 'office-hours', p.id === 'u-real' ? new Date() : null]);
  const { rows } = await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', 'How do I find h2?') RETURNING id", [id]);
  await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'assistant', 'What do you know at state 2?')", [id]);
  await query(
    `INSERT INTO turn_decisions (conversation_id, user_id, message_id, provider, routed_style, read, policy, audit, latency_ms) VALUES ($1, $2, $3, 'jev', 'office-hours', $4::jsonb, $5::jsonb, $6::jsonb, 900)`,
    [id, p.id, rows[0].id, JSON.stringify({ intent: { label: 'stuck' }, misconceptions: [{ id: 'misc:m04-adiabatic-isentropic', p: 0.8 }] }), JSON.stringify({ ceiling: 1, tools: ['calculate'] }), JSON.stringify({ flags: [] })]
  );
  await query(
    `INSERT INTO student_evidence (user_id, conversation_id, kind, ref, source, probability) VALUES ($1, $2, 'misconception_signal', 'misc:m04-adiabatic-isentropic', 'jev', 0.8)`,
    [p.id, id]
  );
}

const forbidden = people.flatMap((p) => [p.email, p.name, p.id]);
const leaks = (payload) => {
  const text = JSON.stringify(payload);
  return forbidden.filter((f) => text.includes(f));
};

await test('isAdmin is true only for an active admin row; getProfile exposes it', async () => {
  assert.equal(await isAdmin('u-admin'), true);
  assert.equal(await isAdmin('u-real'), false);
  assert.equal(await isAdmin('nobody'), false);
  assert.equal((await getProfile('u-admin')).is_admin, true);
  assert.equal((await getProfile('u-real')).is_admin, false);
  await query('UPDATE user_profiles SET deactivated_at = now() WHERE user_id = $1', ['u-admin']);
  assert.equal(await isAdmin('u-admin'), false, 'a deactivated admin loses access');
  await query('UPDATE user_profiles SET deactivated_at = NULL WHERE user_id = $1', ['u-admin']);
});

await test('categoryOf puts every simulated-student account in eval', () => {
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'test3@tutor.test' }), 'eval');
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'test10@tutor.com' }), 'eval');
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'kelvin-eval@thermo-tutor.test' }), 'eval');
  assert.equal(admin.categoryOf({ user_id: 'eval-p1', email: null }), 'eval');
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'kelvin.demo.video2@example.com' }), 'eval');
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'kelvin.demo@example.com' }), 'real');
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'someone@psu.edu' }), 'real');
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'test@psu.edu' }), 'real');
  assert.deepEqual(admin.GROUPS, ['all', 'real', 'eval']);
});

await test('population leaves admins out and keeps deactivated accounts', async () => {
  const pop = await admin.population();
  assert.deepEqual(pop.map((s) => s.label), ['Student 1', 'Student 2', 'Student 3', 'Student 4']);
  assert.ok(!pop.some((s) => s.userId === 'u-admin'));
  assert.equal(pop.find((s) => s.userId === 'u-gone').deactivated, true);
});

await test('the group filter narrows every view', async () => {
  const all = await admin.overview('all');
  assert.equal(all.kpis.students, 4);
  assert.deepEqual(all.kpis.byCategory, { real: 2, eval: 2 });
  assert.equal(all.kpis.deletedChats, 1, 'deleted chats still count');
  assert.equal(all.kpis.deactivated, 1);
  const real = await admin.overview('real');
  assert.equal(real.kpis.students, 2);
  assert.equal(real.kpis.chats, 2);
  assert.equal((await admin.students('eval')).students.length, 2);
  await assert.rejects(() => admin.students('test'), /group must be one of/);
  assert.equal((await admin.conversations('eval')).conversations.length, 2);
  assert.equal((await admin.misconceptions('real')).misconceptions[0].students, 2);
  assert.equal((await admin.tutoring('all')).turns, 4, "the admin's own turn is not counted");
  await assert.rejects(() => admin.overview('everyone'), /group must be one of/);
});

await test('activity covers the whole window, bucketed by day or week', async () => {
  await query("INSERT INTO model_usage (provider, model, purpose, user_id, cost_usd) VALUES ('deepseek', 'deepseek-v4-pro', 'tutor', 'u-real', 0.5), ('openrouter', 'jev', 'read', 'u-test', 0.25), ('deepseek', 'deepseek-v4-pro', 'tutor', 'u-admin', 9)");
  const d7 = await admin.activity('all', '7d');
  assert.equal(d7.unit, 'day');
  assert.equal(d7.buckets.length, 7);
  const today = d7.buckets.at(-1);
  assert.deepEqual(today.messages, { real: 2, eval: 2 }, "today's messages, admin left out");
  assert.deepEqual(today.active, { real: 2, eval: 2 });
  assert.deepEqual(today.chats, { real: 2, eval: 2 }, 'deleted chats still count');
  assert.deepEqual(today.cost, { deepseek: 0.5, openrouter: 0.25 }, "the admin's own usage is left out");
  // Students joined 9, 8, 7 and 6 days ago: three before the 7-day window, one on its first day.
  assert.deepEqual(d7.buckets[0].students, { real: 2, eval: 2 });
  assert.deepEqual(today.students, { real: 2, eval: 2 });
  assert.equal(d7.totals.newStudents, 1);
  assert.deepEqual({ ...d7.totals }, { students: 4, deactivated: 1, newStudents: 1, activeStudents: 4, chats: 4, messages: 4, cost: 0.75 });
  assert.equal((await admin.activity('all', '30d')).buckets.length, 30);
  const m6 = await admin.activity('all', '6m');
  assert.equal(m6.unit, 'week');
  assert.ok(m6.buckets.length >= 26 && m6.buckets.length <= 28, `got ${m6.buckets.length} weeks`);
  assert.equal(m6.totals.messages, 4);
  assert.deepEqual(m6.buckets[0].students, { real: 0, eval: 0 });
  const real = await admin.activity('real', '7d');
  assert.equal(real.buckets.at(-1).messages.eval, 0, 'the group filter applies');
  assert.deepEqual(real.buckets.at(-1).cost, { deepseek: 0.5, openrouter: 0 });
  await assert.rejects(() => admin.activity('all', '1y'), /range must be one of/);
});

await test('misconceptions only count evidence inside the window', async () => {
  await query(
    `INSERT INTO student_evidence (user_id, conversation_id, kind, ref, source, probability, created_at) VALUES ('u-test', $1, 'misconception_signal', 'misc:m17-cop-treated-as-an-efficiency', 'jev', 0.9, now() - interval '60 days')`,
    [convs['u-test']]
  );
  const refs = async (r) => (await admin.misconceptions('all', r)).misconceptions.map((m) => m.ref);
  assert.ok(!(await refs('30d')).includes('misc:m17-cop-treated-as-an-efficiency'));
  assert.ok((await refs('6m')).includes('misc:m17-cop-treated-as-an-efficiency'));
  assert.ok((await refs('7d')).includes('misc:m04-adiabatic-isentropic'));
  await assert.rejects(() => admin.misconceptions('all', 'forever'), /range must be one of/);
});

await test('no payload carries a name, email or raw user id', async () => {
  const s = (await admin.students('all')).students;
  const payloads = [
    await admin.overview('all'),
    await admin.activity('all', '6m'),
    { students: s },
    await admin.student(s[0].key),
    await admin.conversations('all'),
    await admin.conversation(convs['u-real']),
    await admin.misconceptions('all'),
    await admin.tutoring('all'),
    await admin.usage('all'),
  ];
  for (const p of payloads) assert.deepEqual(leaks(p), []);
});

await test("an admin's own conversation is not reachable", async () => {
  await assert.rejects(() => admin.conversation(convs['u-admin']), /No such conversation/);
  await assert.rejects(() => admin.student('0000000000'), /No such student/);
});

await test('committed eval results are anonymized and complete', () => {
  const dir = fileURLToPath(new URL('../eval/results/', import.meta.url));
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  assert.ok(files.length >= 3);
  const personaNames = ['students.yml', 'students-r2.yml'].flatMap((f) => {
    const text = fs.readFileSync(path.join(dir, '..', f), 'utf8');
    return [...text.matchAll(/^\s*name:\s*(.+)$/gm)].map((m) => m[1].trim().replace(/^['"]|['"]$/g, ''));
  });
  assert.ok(personaNames.length >= 10);
  for (const f of files) {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const r = JSON.parse(text);
    for (const key of ['id', 'label', 'date', 'counts', 'summary', 'perStudent', 'chats', 'errors']) assert.ok(key in r, `${f} is missing ${key}`);
    assert.equal(r.id, f.replace(/\.json$/, ''));
    assert.ok(r.summary.helpfulness.n > 0);
    assert.ok(!/@tutor\.(test|com)/.test(text), `${f} contains an account email`);
    for (const name of personaNames) {
      const first = name.split(' ')[0];
      assert.ok(!new RegExp(`\\b${first}\\b`).test(text), `${f} contains the persona name ${first}`);
    }
    assert.ok(!r.chats.some((c) => 'message' in c || 'reply' in c), `${f} carries message text`);
  }
  const runs = admin.evalRuns().runs;
  assert.deepEqual(runs.map((r) => r.id), [...runs.map((r) => r.id)].sort());
  assert.equal(admin.evalRun(runs[0].id).id, runs[0].id);
  assert.throws(() => admin.evalRun('../package'), /No such eval run/);
});

await test('search matches every word across title, messages and the student label', async () => {
  await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', 'Is the throttling valve isenthalpic? 100% sure_not')", [convs['u-test']]);
  const ids = async (q, group = 'all') => (await admin.conversations(group, { q })).conversations.map((c) => c.id);
  assert.deepEqual(await ids('throttling'), [convs['u-test']]);
  assert.deepEqual(await ids('THROTTLING valve'), [convs['u-test']], 'case-insensitive, every word');
  assert.deepEqual(await ids('throttling rankine'), [convs['u-test']], 'words may be in the title and a message');
  assert.deepEqual(await ids('throttling nozzle'), [], 'a missing word excludes the chat');
  assert.deepEqual(await ids('"isenthalpic valve"'), [], 'a quoted phrase must appear as written');
  assert.deepEqual(await ids('"throttling valve"'), [convs['u-test']]);
  assert.deepEqual(await ids('100%'), [convs['u-test']], 'LIKE wildcards are literal');
  assert.deepEqual(await ids('sure_not'), [convs['u-test']]);
  assert.deepEqual(await ids('0%'), [convs['u-test']]);
  assert.deepEqual(await ids('x_y%z'), []);
  assert.deepEqual(await ids('throttling', 'real'), [], 'the group filter still applies');
  const label = (await admin.population()).find((s) => s.userId === 'u-real').label;
  assert.deepEqual(await ids(`"${label.toLowerCase()}"`), [convs['u-real']]);
  const hit = (await admin.conversations('all', { q: 'valve' })).conversations[0].match;
  assert.equal(hit.role, 'user');
  assert.equal(hit.messages, 1);
  assert.match(hit.snippet, /throttling valve/);
  assert.equal(admin.snippetOf('a '.repeat(200) + 'needle ' + 'b '.repeat(200), ['needle']).length <= 162, true);
  assert.deepEqual(admin.searchTerms(' "A  b" c c '), ['a b', 'c']);
  assert.equal((await admin.conversations('all', { q: 'h2?' })).conversations.length, 4);
});

await test('stars are per admin and filter the list', async () => {
  await admin.setStar('u-admin', convs['u-real'], true);
  await admin.setStar('u-admin', convs['u-real'], true);
  const mine = await admin.conversations('all', { filter: 'starred', adminId: 'u-admin' });
  assert.deepEqual(mine.conversations.map((c) => c.id), [convs['u-real']]);
  assert.equal(mine.conversations[0].starred, true);
  assert.equal((await admin.conversations('all', { filter: 'starred', adminId: 'u-other' })).conversations.length, 0);
  assert.equal((await admin.conversation(convs['u-real'], { adminId: 'u-admin' })).starred, true);
  assert.equal((await admin.conversation(convs['u-real'], { adminId: 'u-other' })).starred, false);
  await admin.setStar('u-admin', convs['u-real'], false);
  assert.equal((await admin.conversations('all', { filter: 'starred', adminId: 'u-admin' })).conversations.length, 0);
  await assert.rejects(() => admin.setStar('u-admin', convs['u-admin'], true), /No such conversation/);
  await assert.rejects(() => admin.conversations('all', { filter: 'mine' }), /filter must be one of/);
});

const share = await import('../lib/share.js');
await test('a share link shows only the anonymized conversation, until it is turned off', async () => {
  await query('UPDATE user_profiles SET professor = $2 WHERE user_id = $1', ['u-test', 'Dr. Quill']);
  await query('UPDATE conversations SET title = $2 WHERE id = $1', [convs['u-test'], 'Tess needs Rankine help']);
  await query(
    "INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', 'I am Tess Test (test3@tutor.test, 814-555-0123). Prof. Quill said so.'), ($1, 'assistant', 'Good question, TESS. Tess''s valve: h1 = 2800.5 kJ/kg at 101.325 kPa, 1-800-555, 300 K.')",
    [convs['u-test']]
  );
  const link = await admin.share('u-admin', convs['u-test']);
  assert.match(link.token, share.TOKEN_RE);
  assert.equal(link.url, `/share?t=${link.token}`);
  assert.equal((await admin.share('u-admin', convs['u-test'])).token, link.token, 'sharing again returns the same link');
  assert.equal((await admin.conversation(convs['u-test'])).share.token, link.token);
  assert.equal((await admin.conversations('all', { filter: 'shared' })).conversations[0].id, convs['u-test']);
  const view = await share.sharedConversation(link.token);
  assert.deepEqual(Object.keys(view).sort(), ['messages', 'title']);
  assert.ok(view.messages.every((m) => Object.keys(m).sort().join() === 'content,role'));
  const text = JSON.stringify(view);
  for (const bad of ['Tess', 'TESS', 'test3', 'tutor.test', '814-555-0123', 'Quill', 'u-test', convs['u-test']]) assert.ok(!text.includes(bad), `leaked ${bad}`);
  assert.equal(view.title, '[student] needs Rankine help');
  assert.match(text, /I am \[student\] \(\[email\], \[phone\]\)\. Prof\. \[instructor\] said so\./);
  assert.match(text, /h1 = 2800\.5 kJ\/kg at 101\.325 kPa, 1-800-555, 300 K/, 'numbers are untouched');
  assert.match(text, /Good question, \[student\]\. \[student\]'s valve/);
  assert.equal(await share.isLiveShare(link.token), true);
  await admin.unshare(convs['u-test']);
  assert.equal(await share.sharedConversation(link.token), null);
  assert.equal(await share.isLiveShare(link.token), false);
  assert.equal((await admin.conversation(convs['u-test'])).share, null);
  const again = await admin.share('u-admin', convs['u-test']);
  assert.notEqual(again.token, link.token, 'a revoked link never comes back');
  assert.equal(await share.sharedConversation('short'), null);
  assert.equal(await share.sharedConversation("x' OR 1=1 --aaaaaaaaaaaaaaaa"), null);
  await assert.rejects(() => admin.share('u-admin', convs['u-admin']), /No such conversation/);
});

await test('the redactor keeps the tutor name and ordinary words', () => {
  const clean = share.redactor({ name: 'Kelvin Eval', email: 'kelvin-eval@thermo-tutor.test' });
  assert.equal(clean('Kelvin says: eval the test. Kelvin Eval wrote.'), 'Kelvin says: eval the test. [student] wrote.');
  const li = share.redactor({ name: 'Al Li' });
  assert.equal(li('Al Li asked about li-ion. Li was right, al fine.'), '[student] asked about li-ion. [student] was right, al fine.');
  assert.equal(share.redactor({})('mail me at a.b@c.edu or (814) 555-0123'), 'mail me at [email] or [phone]');
});

await test('admins can view as test accounts only; everyone else is themselves', async () => {
  await query("INSERT INTO user_profiles (user_id, email, display_name) VALUES ('u-test10', 'test10@tutor.test', 'Tenth Test')");
  const accounts = await auth.switchableAccounts();
  assert.deepEqual(accounts.map((a) => [a.id, a.label]), [['u-test', 'Test 3'], ['u-test10', 'Test 10'], ['u-eval', 'Eval']]);
  const req = (target, proto = 'http') => ({ headers: { cookie: `x=1; ${auth.VIEW_AS_COOKIE}=${encodeURIComponent(target)}; y=2`, 'x-forwarded-proto': proto } });
  const admin_ = { id: 'u-admin', email: 'lead@example.edu', name: 'Ada Admin' };
  const acting = await auth.actingUser(req('u-test'), admin_);
  assert.equal(acting.id, 'u-test');
  assert.equal(acting.email, 'test3@tutor.test');
  assert.equal(acting.viewer, admin_);
  assert.equal((await auth.actingUser(req('u-real'), admin_)).id, 'u-admin', 'never a real student');
  assert.equal((await auth.actingUser(req('u-admin'), admin_)).id, 'u-admin');
  assert.equal((await auth.actingUser({ headers: {} }, admin_)).id, 'u-admin');
  const student = { id: 'u-real', email: 'student@psu.edu' };
  assert.equal(await auth.actingUser(req('u-test'), student), student, 'the cookie does nothing for a non-admin');
  await query('UPDATE user_profiles SET deactivated_at = now() WHERE user_id = $1', ['u-test10']);
  assert.equal((await auth.actingUser(req('u-test10'), admin_)).id, 'u-admin', 'not a deactivated account');
  assert.match(auth.viewAsCookie(req('x'), 'u-test'), /^kelvin_view_as=u-test; Max-Age=\d+; Path=\/; HttpOnly; SameSite=Lax$/);
  assert.match(auth.viewAsCookie(req('x', 'https'), null), /^kelvin_view_as=; Max-Age=0; .*Secure$/);
});

await closeDb();
fs.rmSync(process.env.PGLITE_DIR, { recursive: true, force: true });
fs.rmSync(process.env.USAGE_LOG_DIR, { recursive: true, force: true });
if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nall admin tests passed');
