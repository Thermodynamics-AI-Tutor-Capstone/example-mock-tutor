// Tests for the admin dashboard's data layer (lib/admin.js) and the committed eval results, on a
// throwaway PGlite database. Run: node scripts/admin.test.mjs
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-admin-'));
process.env.USAGE_LOG_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-usage-'));

const { query, closeDb, ensureSchema } = await import('../lib/db.js');
await ensureSchema();
const { isAdmin, getProfile } = await import('../lib/auth.js');
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

await test('categoryOf splits real, test and eval accounts', () => {
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'test3@tutor.test' }), 'test');
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'test10@tutor.com' }), 'test');
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'kelvin-eval@thermo-tutor.test' }), 'eval');
  assert.equal(admin.categoryOf({ user_id: 'eval-p1', email: null }), 'eval');
  assert.equal(admin.categoryOf({ user_id: 'x', email: 'someone@psu.edu' }), 'real');
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
  assert.deepEqual(all.kpis.byCategory, { real: 2, test: 1, eval: 1 });
  assert.equal(all.kpis.deletedChats, 1, 'deleted chats still count');
  assert.equal(all.kpis.deactivated, 1);
  const real = await admin.overview('real');
  assert.equal(real.kpis.students, 2);
  assert.equal(real.kpis.chats, 2);
  assert.equal((await admin.students('test')).students.length, 1);
  assert.equal((await admin.conversations('eval')).conversations.length, 1);
  assert.equal((await admin.misconceptions('real')).misconceptions[0].students, 2);
  assert.equal((await admin.tutoring('all')).turns, 4, "the admin's own turn is not counted");
  await assert.rejects(() => admin.overview('everyone'), /group must be one of/);
});

await test('no payload carries a name, email or raw user id', async () => {
  const s = (await admin.students('all')).students;
  const payloads = [
    await admin.overview('all'),
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
  const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'eval', 'results');
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

await closeDb();
fs.rmSync(process.env.PGLITE_DIR, { recursive: true, force: true });
fs.rmSync(process.env.USAGE_LOG_DIR, { recursive: true, force: true });
if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nall admin tests passed');
