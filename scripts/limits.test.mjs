// Tests for the usage limits (lib/limits.js) on a throwaway PGlite database.
// Run: node scripts/limits.test.mjs
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-limits-'));
process.env.USAGE_LOG_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-usage-'));

const { query, closeDb, ensureSchema } = await import('../lib/db.js');
await ensureSchema();
const L = await import('../lib/limits.js');
const { LIMITS } = L;

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

// A fixed "now" in the middle of a New York day, well after the trial started.
const NOW = new Date('2026-10-14T16:00:00Z'); // 12:00 in New York (EDT)
const TODAY = new Date('2026-10-14T13:00:00Z');
const YESTERDAY = new Date('2026-10-13T13:00:00Z');

let n = 0;
async function student({ email, admin = false } = {}) {
  const id = `user-${++n}`;
  const user = { id, email: email || `maya${n}.fernhollow@kelvin-students.test`, name: `Student ${n}` };
  await query('INSERT INTO user_profiles (user_id, email, display_name, is_admin) VALUES ($1, $2, $3, $4)', [id, user.email, user.name, admin || null]);
  return user;
}
async function spend(user, usd, at = TODAY) {
  await query("INSERT INTO model_usage (at, provider, model, purpose, user_id, cost_usd) VALUES ($1, 'deepseek', 'deepseek-v4-pro', 'tutor_reply', $2, $3)", [at, user?.id ?? null, usd]);
  L.clearLimitsCache();
}
async function chat(user, { deleted = false } = {}) {
  const id = crypto.randomUUID();
  await query('INSERT INTO conversations (id, title, user_id, deleted_at) VALUES ($1, $2, $3, $4)', [id, 'chat', user.id, deleted ? TODAY : null]);
  return id;
}
async function messages(conversationId, count, at = TODAY) {
  for (let i = 0; i < count; i++) await query("INSERT INTO messages (conversation_id, role, content, created_at) VALUES ($1, 'user', 'hi', $2)", [conversationId, at]);
}
async function resetUsage() {
  await query('DELETE FROM model_usage');
  L.clearLimitsCache();
}

await test('dayStart is local midnight in New York, on a normal day and across the DST change', () => {
  assert.equal(L.dayStart(NOW).toISOString(), '2026-10-14T04:00:00.000Z');
  assert.equal(L.nextDayStart(NOW).toISOString(), '2026-10-15T04:00:00.000Z');
  // 2026-11-01: clocks go back at 2 a.m., so that day starts at EDT midnight and the next at EST.
  const dstDay = new Date('2026-11-01T15:00:00Z');
  assert.equal(L.dayStart(dstDay).toISOString(), '2026-11-01T04:00:00.000Z');
  assert.equal(L.nextDayStart(dstDay).toISOString(), '2026-11-02T05:00:00.000Z');
  // Just before midnight in New York is still the previous local day, though UTC has moved on.
  assert.equal(L.dayStart(new Date('2026-10-15T03:59:00Z')).toISOString(), '2026-10-14T04:00:00.000Z');
});

await test('admins and eval accounts are exempt', async () => {
  const admin = await student({ admin: true });
  const evalUser = await student({ email: 'test3@tutor.test' });
  await spend(admin, 50);
  await spend(evalUser, 50);
  for (const u of [admin, evalUser]) {
    const s = await L.usageStatus(u, { now: NOW });
    assert.equal(s.exempt, true);
    assert.equal(s.state, 'ok');
  }
  await resetUsage();
});

await test('a student goes ok → reduced at 80% of the trial allowance → blocked at 100%', async () => {
  const u = await student();
  assert.equal((await L.usageStatus(u, { now: NOW })).state, 'ok');
  await spend(u, LIMITS.trialUsd * 0.5, YESTERDAY);
  let s = await L.usageStatus(u, { now: NOW });
  assert.equal(s.state, 'ok');
  assert.equal(s.percent, 50);
  await spend(u, LIMITS.trialUsd * 0.35, YESTERDAY);
  s = await L.usageStatus(u, { now: NOW });
  assert.equal(s.state, 'reduced');
  assert.equal(s.percent, 85);
  assert.equal(s.message, null);
  await spend(u, LIMITS.trialUsd * 0.2, YESTERDAY);
  s = await L.usageStatus(u, { now: NOW });
  assert.equal(s.state, 'blocked');
  assert.equal(s.reason, 'trial_used');
  assert.equal(s.percent, 100);
  assert.equal(s.resetsAt, null);
  assert.ok(!/\$/.test(s.message), 'no dollar figure is shown to students');
  await resetUsage();
});

await test('daily spend limit, counting only today', async () => {
  const u = await student();
  await spend(u, LIMITS.dailyUsd, YESTERDAY);
  assert.equal((await L.usageStatus(u, { now: NOW })).reason, null);
  await spend(u, LIMITS.dailyUsd, TODAY);
  const s = await L.usageStatus(u, { now: NOW });
  assert.equal(s.state, 'blocked');
  assert.equal(s.reason, 'daily_spend');
  assert.equal(s.resetsAt, '2026-10-15T04:00:00.000Z');
  await resetUsage();
});

await test('daily message limit, including messages in deleted chats', async () => {
  const u = await student();
  await messages(await chat(u), LIMITS.dailyMessages - 10, YESTERDAY);
  await messages(await chat(u), LIMITS.dailyMessages - 10);
  assert.equal((await L.usageStatus(u, { now: NOW })).state, 'reduced');
  await messages(await chat(u, { deleted: true }), 10);
  const s = await L.usageStatus(u, { now: NOW });
  assert.equal(s.state, 'blocked');
  assert.equal(s.reason, 'daily_messages');
});

await test('app totals count real students only, and the app total wins over other reasons', async () => {
  const a = await student();
  const b = await student();
  const admin = await student({ admin: true });
  const evalUser = await student({ email: 'kelvin-eval@thermo-tutor.test' });
  await spend(admin, 100);
  await spend(evalUser, 100);
  await spend(null, 100);
  assert.equal((await L.usageStatus(a, { now: NOW })).state, 'ok');
  await spend(b, LIMITS.appDailyUsd);
  let s = await L.usageStatus(a, { now: NOW });
  assert.equal(s.reason, 'app_daily');
  assert.ok(s.resetsAt);
  await spend(b, LIMITS.appTotalUsd, YESTERDAY);
  await spend(a, LIMITS.trialUsd, YESTERDAY);
  s = await L.usageStatus(a, { now: NOW });
  assert.equal(s.reason, 'app_total');
  assert.equal(s.resetsAt, null);
  await resetUsage();
});

await test('spend before the trial started is not in the app total', async () => {
  const u = await student();
  await spend(u, 1000, new Date('2026-09-20T12:00:00Z'));
  const other = await student();
  assert.equal((await L.usageStatus(other, { now: NOW })).state, 'ok');
  await resetUsage();
});

await test('checkBurst stops the sixth message in a minute', async () => {
  const u = await student();
  const c = await chat(u);
  const recent = new Date(NOW.getTime() - 20_000);
  await messages(c, LIMITS.messagesPerMinute - 1, recent);
  assert.equal((await L.checkBurst(u, { now: NOW })).ok, true);
  await messages(c, 1, recent);
  const b = await L.checkBurst(u, { now: NOW });
  assert.equal(b.ok, false);
  assert.ok(b.retryAfterS >= 1 && b.retryAfterS <= 60, `retryAfterS ${b.retryAfterS}`);
  const admin = await student({ admin: true });
  assert.equal((await L.checkBurst(admin, { now: NOW })).ok, true);
});

await test('checkUploads stops after the daily upload limit, deleted uploads included', async () => {
  const u = await student();
  const c = await chat(u);
  for (let i = 0; i < LIMITS.uploadsPerDay; i++) {
    await query(
      `INSERT INTO attachments (id, user_id, conversation_id, filename, mime, bytes, kind, source, status, storage, storage_key, created_at, deleted_at)
       VALUES ($1, $2, $3, 'work.png', 'image/png', 10, 'vision', 'upload', 'ready', 'db', 'k', $4, $5)`,
      [crypto.randomUUID(), u.id, c, TODAY, i === 0 ? TODAY : null]
    );
    if (i === LIMITS.uploadsPerDay - 2) assert.equal((await L.checkUploads(u, { now: NOW })).ok, true);
  }
  const r = await L.checkUploads(u, { now: NOW });
  assert.equal(r.ok, false);
  assert.equal(r.resetsAt, '2026-10-15T04:00:00.000Z');
});

await test('one reply at a time: acquire, refuse, release, expire', async () => {
  const id = 'lock-user';
  const holder = await L.acquireReplyLock(id);
  assert.ok(holder);
  assert.equal(await L.acquireReplyLock(id), null);
  await L.releaseReplyLock(id, crypto.randomUUID());
  assert.equal(await L.acquireReplyLock(id), null, 'only the holder can release');
  await L.releaseReplyLock(id, holder);
  const again = await L.acquireReplyLock(id);
  assert.ok(again && again !== holder);
  await query("UPDATE reply_locks SET until = now() - interval '1 minute' WHERE user_id = $1", [id]);
  assert.ok(await L.acquireReplyLock(id), 'an expired lock can be taken');
});

await test('concurrent acquires: exactly one wins', async () => {
  const results = await Promise.all(Array.from({ length: 5 }, () => L.acquireReplyLock('race-user')));
  assert.equal(results.filter(Boolean).length, 1);
});

await closeDb();
if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log('\nall limits tests passed');
