// Tests for the anonymous-name system (lib/name-pool.js, lib/usernames.js and the auth proxy's
// name sign-up/sign-in) on a throwaway PGlite database. Neon Auth is never reached: global fetch is
// replaced with a stub. Run: node scripts/usernames.test.mjs
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
process.env.NEON_AUTH_BASE_URL = 'https://auth.example.test';
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-names-'));
process.env.USAGE_LOG_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-usage-'));

const { query, closeDb, ensureSchema } = await import('../lib/db.js');
await ensureSchema();
const names = await import('../lib/usernames.js');
const { FIRST_NAMES, LAST_NAMES, RETIRED_FIRST_NAMES, RETIRED_LAST_NAMES } = await import('../lib/name-pool.js');
const { categoryOf } = await import('../lib/admin.js');
const auth = await import('../lib/auth.js');

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

// PGlite's now() only moves every millisecond, so a release and an immediate re-reserve can land in
// the same tick. Real Postgres is microsecond-precise; the tests just wait a moment.
const tick = () => new Promise((r) => setTimeout(r, 5));

// ── The name pool ────────────────────────────────────────────────────────────────────────────────

await test('each pool has at least 300 unique names in the right shape', () => {
  assert.ok(FIRST_NAMES.length >= 300);
  assert.ok(LAST_NAMES.length >= 300);
  assert.equal(new Set(FIRST_NAMES).size, FIRST_NAMES.length);
  assert.equal(new Set(LAST_NAMES).size, LAST_NAMES.length);
  for (const n of FIRST_NAMES) assert.match(n, /^[A-Z][A-Za-z]{2,11}$/, n);
  for (const n of LAST_NAMES) assert.match(n, /^[A-Z][A-Za-z]{2,11}$/, n);
});

// ── Pure helpers ─────────────────────────────────────────────────────────────────────────────────

await test('nameKey, displayName and emailFor build the identity from the two words', () => {
  assert.equal(names.nameKey('Mary', 'Smith'), 'mary smith');
  assert.equal(names.nameKey('  Mary ', ' Smith  '), 'mary smith');
  assert.equal(names.displayName('Mary', 'Smith'), 'Mary Smith');
  assert.equal(names.emailFor('Mary', 'Smith'), 'mary.smith@kelvin-students.test');
  assert.equal(names.STUDENT_EMAIL_DOMAIN, 'kelvin-students.test');
  assert.equal(names.inPool('Mary', 'Smith'), true);
  assert.equal(names.inPool('mary', 'Smith'), false, 'inPool is case-sensitive');
  assert.equal(names.inPool('Nope', 'Smith'), false);
  assert.equal(names.inPool('Mary', 'Nope'), false);
});

await test("a student's derived email is never an eval account", () => {
  for (const [f, l] of [['Mary', 'Smith'], ['Tom', 'Brown'], ['Kevin', 'Jones'], ['Mia', 'Miller'], ['Claire', 'Davis']]) {
    assert.equal(categoryOf({ user_id: 'x', email: names.emailFor(f, l) }), 'real');
  }
  assert.equal(categoryOf({ user_id: 'x', email: 'mary.smith@kelvin-students.test' }), 'real');
});

await test('parseSignInName handles emails, two name words, and rejects the rest', () => {
  assert.equal(names.parseSignInName(' someone@psu.edu '), 'someone@psu.edu', 'emails pass through');
  assert.equal(names.parseSignInName('MARY smith'), 'mary.smith@kelvin-students.test', 'case-insensitive words');
  assert.equal(names.parseSignInName('  Mary   Smith '), 'mary.smith@kelvin-students.test', 'extra whitespace is fine');
  assert.equal(names.parseSignInName('mary Nope'), null, 'an unknown word');
  assert.equal(names.parseSignInName('Mary Smith Jr'), null, 'three words');
  assert.equal(names.parseSignInName('Mary'), null, 'one word');
  assert.equal(names.parseSignInName(''), null);
});

// ── offerNames ───────────────────────────────────────────────────────────────────────────────────

await test('retired names still sign in but are never offered or reservable', async () => {
  assert.ok(RETIRED_LAST_NAMES.includes('Copperleaf') && RETIRED_FIRST_NAMES.includes('Robin'));
  assert.equal(names.parseSignInName('robin copperleaf'), 'robin.copperleaf@kelvin-students.test');
  assert.equal(names.inPool('Robin', 'Copperleaf'), false);
  for (const n of RETIRED_FIRST_NAMES) assert.ok(!FIRST_NAMES.includes(n), n);
  for (const n of RETIRED_LAST_NAMES) assert.ok(!LAST_NAMES.includes(n), n);
  for (let i = 0; i < 20; i++) {
    const o = await names.offerNames();
    for (const n of o.last) assert.ok(LAST_NAMES.includes(n), n);
    for (const n of o.first) assert.ok(FIRST_NAMES.includes(n), n);
  }
});

await test('offerNames draws distinct names and lists taken combinations', async () => {
  const F = FIRST_NAMES;
  const L = LAST_NAMES;
  const realRandomInt = crypto.randomInt;
  let seq = 0;
  crypto.randomInt = (max) => seq++ % max;
  try {
    await query('INSERT INTO usernames (name_key, first_name, last_name, user_id) VALUES ($1, $2, $3, $4)', [names.nameKey(F[2], L[8]), F[2], L[8], 'u-taken']);
    await query("INSERT INTO usernames (name_key, first_name, last_name, reserved_until) VALUES ($1, $2, $3, now() + interval '1 hour')", [names.nameKey(F[0], L[5]), F[0], L[5]]);
    seq = 0;
    const offer = await names.offerNames();
    assert.deepEqual(offer.first, [F[0], F[1], F[2], F[3], F[4]], 'the seeded draw');
    assert.deepEqual(offer.last, [L[5], L[6], L[7], L[8], L[9]], 'the seeded draw');
    assert.equal(new Set(offer.first).size, 5);
    assert.equal(new Set(offer.last).size, 5);
    assert.deepEqual(offer.taken.sort(), [names.displayName(F[0], L[5]), names.displayName(F[2], L[8])].sort(), 'one claimed, one reserved');
    const other = await names.offerNames({ count: 3 });
    assert.equal(other.first.length, 3);
    assert.equal(other.last.length, 3);
    assert.ok(Array.isArray(other.taken));
  } finally {
    crypto.randomInt = realRandomInt;
  }
});

// ── reserve / claim / release ───────────────────────────────────────────────────────────────────

await test('reserveName holds a name, and a second attempt loses', async () => {
  assert.equal(await names.reserveName('Mary', 'Smith'), 'mary smith');
  assert.equal(await names.reserveName('Mary', 'Smith'), null);
});

await test('ten concurrent reservations of one name leave exactly one winner', async () => {
  const tries = await Promise.all(Array.from({ length: 10 }, () => names.reserveName('Leah', 'Davis')));
  assert.equal(tries.filter(Boolean).length, 1);
  assert.equal(tries.filter(Boolean)[0], 'leah davis');
});

await test('an expired reservation can be taken again', async () => {
  assert.ok(await names.reserveName('Ryan', 'Wilson'));
  await query("UPDATE usernames SET reserved_until = now() - interval '1 minute' WHERE name_key = $1", ['ryan wilson']);
  assert.equal(await names.reserveName('Ryan', 'Wilson'), 'ryan wilson');
});

await test('claimName makes the name permanent and fills the profile', async () => {
  assert.ok(await names.reserveName('Sarah', 'Brown'));
  const claimed = await names.claimName('sarah brown', { id: 'u-sarah', email: 'ignored@x.test' });
  assert.deepEqual(claimed, { name: 'Sarah Brown', email: 'sarah.brown@kelvin-students.test' });
  assert.equal(await names.usernameOf('u-sarah'), 'Sarah Brown');
  const { rows } = await query('SELECT email, display_name, username FROM user_profiles WHERE user_id = $1', ['u-sarah']);
  assert.equal(rows[0].email, 'sarah.brown@kelvin-students.test');
  assert.equal(rows[0].display_name, 'Sarah Brown');
  assert.equal(rows[0].username, 'Sarah Brown');
  assert.equal(await names.claimName('no such key', { id: 'u-none' }), null);
});

await test('a claimed name can never be reserved again', async () => {
  assert.equal(await names.reserveName('Sarah', 'Brown'), null);
});

await test('releaseName frees an unclaimed hold without deleting the row', async () => {
  assert.ok(await names.reserveName('Julie', 'Jones'));
  await names.releaseName('julie jones');
  const { rows } = await query('SELECT user_id, reserved_until FROM usernames WHERE name_key = $1', ['julie jones']);
  assert.equal(rows.length, 1, 'the row is kept');
  assert.equal(rows[0].user_id, null);
  assert.ok(new Date(rows[0].reserved_until).getTime() <= Date.now(), 'the hold is expired, not deleted');
  await tick();
  assert.equal(await names.reserveName('Julie', 'Jones'), 'julie jones');
});

await test('a name outside the pools is refused with a 400', async () => {
  await assert.rejects(() => names.reserveName('Bogus', 'Name'), (err) => err.status === 400 && err.code === 'NAME_NOT_IN_POOL');
  await assert.rejects(() => names.reserveName('Mary', 'Bogus'), (err) => err.status === 400 && err.code === 'NAME_NOT_IN_POOL');
});

// ── proxyAuth with a stubbed Neon ────────────────────────────────────────────────────────────────

const fetchCalls = [];
let fetchQueue = [];
globalThis.fetch = async (url, opts) => {
  fetchCalls.push({ url: String(url), opts: opts || {} });
  const next = fetchQueue.shift() || { status: 200, body: {} };
  if (next.throw) throw new Error(next.throw);
  const body = typeof next.body === 'string' ? next.body : JSON.stringify(next.body ?? {});
  return new Response(body, { status: next.status || 200, headers: { 'content-type': 'application/json', ...(next.headers || {}) } });
};
const resetFetch = () => {
  fetchCalls.length = 0;
  fetchQueue.length = 0;
};
function fakeRes() {
  const res = { status: 0, headers: {}, chunks: [] };
  res.writeHead = (status, headers) => {
    res.status = status;
    Object.assign(res.headers, headers || {});
  };
  res.end = (data) => {
    if (data !== undefined) res.chunks.push(Buffer.from(data));
  };
  Object.defineProperty(res, 'body', { get: () => Buffer.concat(res.chunks).toString('utf8') });
  Object.defineProperty(res, 'json', { get: () => (res.body ? JSON.parse(res.body) : null) });
  return res;
}
const authReq = (subpath, body) => ({ method: 'POST', url: `/api/auth/${subpath}`, headers: {}, body: body ? JSON.stringify(body) : undefined });

await test('GET name-options serves the pools without touching Neon', async () => {
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth({ method: 'GET', url: '/api/auth/name-options', headers: {} }, res, 'name-options');
  assert.equal(res.status, 200);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.ok(res.json.first.length >= 5);
  assert.ok(res.json.last.length >= 5);
  assert.ok(Array.isArray(res.json.taken));
  assert.equal(fetchCalls.length, 0);
});

await test('sign-up sends the derived name and email to Neon and claims the name', async () => {
  resetFetch();
  fetchQueue.push({ status: 200, body: { data: { user: { id: 'neon-1' } } } });
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Hannah', last: 'Miller', password: 'kelvin-rule-1' }), res, 'sign-up/email');
  assert.equal(res.status, 200);
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].url, 'https://auth.example.test/sign-up/email');
  assert.deepEqual(JSON.parse(fetchCalls[0].opts.body.toString('utf8')), {
    name: 'Hannah Miller',
    email: 'hannah.miller@kelvin-students.test',
    password: 'kelvin-rule-1',
  });
  const { rows } = await query('SELECT user_id, reserved_until FROM usernames WHERE name_key = $1', ['hannah miller']);
  assert.equal(rows[0].user_id, 'neon-1');
  assert.equal(rows[0].reserved_until, null);
  assert.equal(await names.usernameOf('neon-1'), 'Hannah Miller');
});

await test('sign-up also accepts a top-level user id and keeps the profile in sync', async () => {
  resetFetch();
  fetchQueue.push({ status: 200, body: { user: { id: 'neon-2' } } });
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Kevin', last: 'Jones', password: 'kelvin-rule-2' }), res, 'sign-up/email');
  assert.equal(res.status, 200);
  assert.equal(await names.usernameOf('neon-2'), 'Kevin Jones');
  const profile = await auth.getProfile('neon-2');
  assert.equal(profile.username, 'Kevin Jones');
  assert.equal(profile.display_name, 'Kevin Jones');
});

await test('sign-up releases the name when Neon answers with an error', async () => {
  resetFetch();
  fetchQueue.push({ status: 422, body: { code: 'USER_ALREADY_EXISTS' } });
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Claire', last: 'Davis', password: 'kelvin-rule-3' }), res, 'sign-up/email');
  assert.equal(res.status, 422);
  const { rows } = await query('SELECT user_id, reserved_until FROM usernames WHERE name_key = $1', ['claire davis']);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].user_id, null);
  assert.ok(new Date(rows[0].reserved_until).getTime() <= Date.now(), 'the hold is released');
  await tick();
  assert.equal(await names.reserveName('Claire', 'Davis'), 'claire davis', 'and can be taken again');
});

await test('sign-up releases the name when the Neon request fails', async () => {
  resetFetch();
  fetchQueue.push({ throw: 'network down' });
  const res = fakeRes();
  await assert.rejects(() => auth.proxyAuth(authReq('sign-up/email', { first: 'Zoe', last: 'Wilson', password: 'kelvin-rule-4' }), res, 'sign-up/email'), /network down/);
  await tick();
  assert.equal(await names.reserveName('Zoe', 'Wilson'), 'zoe wilson', 'the hold is released');
});

await test('sign-up with a claimed name answers 409 without calling Neon', async () => {
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Sarah', last: 'Brown', password: 'kelvin-rule-5' }), res, 'sign-up/email');
  assert.equal(res.status, 409);
  assert.deepEqual(res.json, { error: 'Someone just took that name. Pick another.', code: 'NAME_TAKEN' });
  assert.equal(fetchCalls.length, 0);
});

await test('sign-up with a reserved (in-flight) name answers 409 without calling Neon', async () => {
  await names.reserveName('Emily', 'Smith');
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Emily', last: 'Smith', password: 'kelvin-rule-6' }), res, 'sign-up/email');
  assert.equal(res.status, 409);
  assert.equal(fetchCalls.length, 0);
});

await test('sign-up that brings an email or name is refused', async () => {
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Hannah', last: 'Miller', password: 'x', email: 'a@b.c' }), res, 'sign-up/email');
  assert.equal(res.status, 400);
  assert.deepEqual(res.json, { error: 'Sign up by picking a name.', code: 'NAME_REQUIRED' });
  assert.equal(fetchCalls.length, 0);
  const res2 = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { name: 'Hannah Miller', password: 'x' }), res2, 'sign-up/email');
  assert.equal(res2.status, 400);
  assert.equal(fetchCalls.length, 0);
});

await test('sign-up with missing parts is refused', async () => {
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Hannah', password: 'x' }), res, 'sign-up/email');
  assert.equal(res.status, 400);
  assert.equal(res.json.code, 'NAME_REQUIRED');
  assert.equal(fetchCalls.length, 0);
});

await test('sign-in with a name forwards the derived email', async () => {
  resetFetch();
  fetchQueue.push({ status: 200, body: {} });
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-in/email', { username: 'mary smith', password: 'pw-123456' }), res, 'sign-in/email');
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(fetchCalls[0].opts.body.toString('utf8')), { email: 'mary.smith@kelvin-students.test', password: 'pw-123456' });
});

await test('sign-in with an unknown name answers 401 without calling Neon', async () => {
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-in/email', { username: 'mary smith jr', password: 'x' }), res, 'sign-in/email');
  assert.equal(res.status, 401);
  assert.deepEqual(res.json, { code: 'INVALID_EMAIL_OR_PASSWORD', message: 'Incorrect name or password.' });
  assert.equal(fetchCalls.length, 0);
});

await test('sign-in with an email passes through unchanged', async () => {
  resetFetch();
  fetchQueue.push({ status: 200, body: {} });
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-in/email', { email: 'admin@psu.edu', password: 'pw-123456' }), res, 'sign-in/email');
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(fetchCalls[0].opts.body.toString('utf8')), { email: 'admin@psu.edu', password: 'pw-123456' });
});

// ── Profiles ────────────────────────────────────────────────────────────────────────────────────

await test('saveProfile keeps the made-up name no matter what the request says', async () => {
  const user = { id: 'u-sarah', email: 'sarah.brown@kelvin-students.test', name: 'Sarah Brown' };
  const saved = await auth.saveProfile(user, { display_name: 'Totally Different Name', major: 'Mechanical Engineering' });
  assert.equal(saved.display_name, 'Sarah Brown', 'the display_name change is ignored');
  assert.equal(saved.username, 'Sarah Brown');
  assert.equal(saved.major, 'Mechanical Engineering', 'other fields still save');
  const profile = await auth.getProfile('u-sarah');
  assert.equal(profile.display_name, 'Sarah Brown');
  assert.equal(profile.username, 'Sarah Brown');
});

await test('accounts without a made-up name keep today\'s behaviour', async () => {
  const saved = await auth.saveProfile({ id: 'u-plain', email: 'plain@psu.edu', name: 'Plain Person' }, { display_name: 'Plain Person' });
  assert.equal(saved.display_name, 'Plain Person');
  assert.equal(saved.username, null);
});

await closeDb();
fs.rmSync(process.env.PGLITE_DIR, { recursive: true, force: true });
fs.rmSync(process.env.USAGE_LOG_DIR, { recursive: true, force: true });
if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nall usernames tests passed');
