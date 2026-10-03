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
const { FIRST_NAMES, LAST_NAMES } = await import('../lib/name-pool.js');
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
  for (const n of FIRST_NAMES) assert.match(n, /^[A-Z][A-Za-z]{2,8}$/, n);
  for (const n of LAST_NAMES) assert.match(n, /^[A-Z][A-Za-z]{4,11}$/, n);
});

// ── Pure helpers ─────────────────────────────────────────────────────────────────────────────────

await test('nameKey, displayName and emailFor build the identity from the two words', () => {
  assert.equal(names.nameKey('Maya', 'Fernhollow'), 'maya fernhollow');
  assert.equal(names.nameKey('  Maya ', ' Fernhollow  '), 'maya fernhollow');
  assert.equal(names.displayName('Maya', 'Fernhollow'), 'Maya Fernhollow');
  assert.equal(names.emailFor('Maya', 'Fernhollow'), 'maya.fernhollow@kelvin-students.test');
  assert.equal(names.STUDENT_EMAIL_DOMAIN, 'kelvin-students.test');
  assert.equal(names.inPool('Maya', 'Fernhollow'), true);
  assert.equal(names.inPool('maya', 'Fernhollow'), false, 'inPool is case-sensitive');
  assert.equal(names.inPool('Nope', 'Fernhollow'), false);
  assert.equal(names.inPool('Maya', 'Nope'), false);
});

await test("a student's derived email is never an eval account", () => {
  for (const [f, l] of [['Maya', 'Fernhollow'], ['Theo', 'Stonebrook'], ['Kai', 'Willowmere'], ['Mina', 'Ashgrove'], ['Cleo', 'Brightwater']]) {
    assert.equal(categoryOf({ user_id: 'x', email: names.emailFor(f, l) }), 'real');
  }
  assert.equal(categoryOf({ user_id: 'x', email: 'maya.fernhollow@kelvin-students.test' }), 'real');
});

await test('parseSignInName handles emails, two name words, and rejects the rest', () => {
  assert.equal(names.parseSignInName(' someone@psu.edu '), 'someone@psu.edu', 'emails pass through');
  assert.equal(names.parseSignInName('MAYA fernhollow'), 'maya.fernhollow@kelvin-students.test', 'case-insensitive words');
  assert.equal(names.parseSignInName('  Maya   Fernhollow '), 'maya.fernhollow@kelvin-students.test', 'extra whitespace is fine');
  assert.equal(names.parseSignInName('maya Nope'), null, 'an unknown word');
  assert.equal(names.parseSignInName('Maya Fernhollow Jr'), null, 'three words');
  assert.equal(names.parseSignInName('Maya'), null, 'one word');
  assert.equal(names.parseSignInName(''), null);
});

// ── offerNames ───────────────────────────────────────────────────────────────────────────────────

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
  assert.equal(await names.reserveName('Maya', 'Fernhollow'), 'maya fernhollow');
  assert.equal(await names.reserveName('Maya', 'Fernhollow'), null);
});

await test('ten concurrent reservations of one name leave exactly one winner', async () => {
  const tries = await Promise.all(Array.from({ length: 10 }, () => names.reserveName('Lea', 'Brightwater')));
  assert.equal(tries.filter(Boolean).length, 1);
  assert.equal(tries.filter(Boolean)[0], 'lea brightwater');
});

await test('an expired reservation can be taken again', async () => {
  assert.ok(await names.reserveName('Ravi', 'Copperleaf'));
  await query("UPDATE usernames SET reserved_until = now() - interval '1 minute' WHERE name_key = $1", ['ravi copperleaf']);
  assert.equal(await names.reserveName('Ravi', 'Copperleaf'), 'ravi copperleaf');
});

await test('claimName makes the name permanent and fills the profile', async () => {
  assert.ok(await names.reserveName('Sofia', 'Stonebrook'));
  const claimed = await names.claimName('sofia stonebrook', { id: 'u-sofia', email: 'ignored@x.test' });
  assert.deepEqual(claimed, { name: 'Sofia Stonebrook', email: 'sofia.stonebrook@kelvin-students.test' });
  assert.equal(await names.usernameOf('u-sofia'), 'Sofia Stonebrook');
  const { rows } = await query('SELECT email, display_name, username FROM user_profiles WHERE user_id = $1', ['u-sofia']);
  assert.equal(rows[0].email, 'sofia.stonebrook@kelvin-students.test');
  assert.equal(rows[0].display_name, 'Sofia Stonebrook');
  assert.equal(rows[0].username, 'Sofia Stonebrook');
  assert.equal(await names.claimName('no such key', { id: 'u-none' }), null);
});

await test('a claimed name can never be reserved again', async () => {
  assert.equal(await names.reserveName('Sofia', 'Stonebrook'), null);
});

await test('releaseName frees an unclaimed hold without deleting the row', async () => {
  assert.ok(await names.reserveName('Yuki', 'Willowmere'));
  await names.releaseName('yuki willowmere');
  const { rows } = await query('SELECT user_id, reserved_until FROM usernames WHERE name_key = $1', ['yuki willowmere']);
  assert.equal(rows.length, 1, 'the row is kept');
  assert.equal(rows[0].user_id, null);
  assert.ok(new Date(rows[0].reserved_until).getTime() <= Date.now(), 'the hold is expired, not deleted');
  await tick();
  assert.equal(await names.reserveName('Yuki', 'Willowmere'), 'yuki willowmere');
});

await test('a name outside the pools is refused with a 400', async () => {
  await assert.rejects(() => names.reserveName('Bogus', 'Name'), (err) => err.status === 400 && err.code === 'NAME_NOT_IN_POOL');
  await assert.rejects(() => names.reserveName('Maya', 'Bogus'), (err) => err.status === 400 && err.code === 'NAME_NOT_IN_POOL');
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
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Hana', last: 'Ashgrove', password: 'kelvin-rule-1' }), res, 'sign-up/email');
  assert.equal(res.status, 200);
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].url, 'https://auth.example.test/sign-up/email');
  assert.deepEqual(JSON.parse(fetchCalls[0].opts.body.toString('utf8')), {
    name: 'Hana Ashgrove',
    email: 'hana.ashgrove@kelvin-students.test',
    password: 'kelvin-rule-1',
  });
  const { rows } = await query('SELECT user_id, reserved_until FROM usernames WHERE name_key = $1', ['hana ashgrove']);
  assert.equal(rows[0].user_id, 'neon-1');
  assert.equal(rows[0].reserved_until, null);
  assert.equal(await names.usernameOf('neon-1'), 'Hana Ashgrove');
});

await test('sign-up also accepts a top-level user id and keeps the profile in sync', async () => {
  resetFetch();
  fetchQueue.push({ status: 200, body: { user: { id: 'neon-2' } } });
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Kai', last: 'Willowmere', password: 'kelvin-rule-2' }), res, 'sign-up/email');
  assert.equal(res.status, 200);
  assert.equal(await names.usernameOf('neon-2'), 'Kai Willowmere');
  const profile = await auth.getProfile('neon-2');
  assert.equal(profile.username, 'Kai Willowmere');
  assert.equal(profile.display_name, 'Kai Willowmere');
});

await test('sign-up releases the name when Neon answers with an error', async () => {
  resetFetch();
  fetchQueue.push({ status: 422, body: { code: 'USER_ALREADY_EXISTS' } });
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Cleo', last: 'Brightwater', password: 'kelvin-rule-3' }), res, 'sign-up/email');
  assert.equal(res.status, 422);
  const { rows } = await query('SELECT user_id, reserved_until FROM usernames WHERE name_key = $1', ['cleo brightwater']);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].user_id, null);
  assert.ok(new Date(rows[0].reserved_until).getTime() <= Date.now(), 'the hold is released');
  await tick();
  assert.equal(await names.reserveName('Cleo', 'Brightwater'), 'cleo brightwater', 'and can be taken again');
});

await test('sign-up releases the name when the Neon request fails', async () => {
  resetFetch();
  fetchQueue.push({ throw: 'network down' });
  const res = fakeRes();
  await assert.rejects(() => auth.proxyAuth(authReq('sign-up/email', { first: 'Zoe', last: 'Copperleaf', password: 'kelvin-rule-4' }), res, 'sign-up/email'), /network down/);
  await tick();
  assert.equal(await names.reserveName('Zoe', 'Copperleaf'), 'zoe copperleaf', 'the hold is released');
});

await test('sign-up with a claimed name answers 409 without calling Neon', async () => {
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Sofia', last: 'Stonebrook', password: 'kelvin-rule-5' }), res, 'sign-up/email');
  assert.equal(res.status, 409);
  assert.deepEqual(res.json, { error: 'Someone just took that name. Pick another.', code: 'NAME_TAKEN' });
  assert.equal(fetchCalls.length, 0);
});

await test('sign-up with a reserved (in-flight) name answers 409 without calling Neon', async () => {
  await names.reserveName('Edie', 'Fernhollow');
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Edie', last: 'Fernhollow', password: 'kelvin-rule-6' }), res, 'sign-up/email');
  assert.equal(res.status, 409);
  assert.equal(fetchCalls.length, 0);
});

await test('sign-up that brings an email or name is refused', async () => {
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Hana', last: 'Ashgrove', password: 'x', email: 'a@b.c' }), res, 'sign-up/email');
  assert.equal(res.status, 400);
  assert.deepEqual(res.json, { error: 'Sign up by picking a name.', code: 'NAME_REQUIRED' });
  assert.equal(fetchCalls.length, 0);
  const res2 = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { name: 'Hana Ashgrove', password: 'x' }), res2, 'sign-up/email');
  assert.equal(res2.status, 400);
  assert.equal(fetchCalls.length, 0);
});

await test('sign-up with missing parts is refused', async () => {
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-up/email', { first: 'Hana', password: 'x' }), res, 'sign-up/email');
  assert.equal(res.status, 400);
  assert.equal(res.json.code, 'NAME_REQUIRED');
  assert.equal(fetchCalls.length, 0);
});

await test('sign-in with a name forwards the derived email', async () => {
  resetFetch();
  fetchQueue.push({ status: 200, body: {} });
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-in/email', { username: 'maya fernhollow', password: 'pw-123456' }), res, 'sign-in/email');
  assert.equal(res.status, 200);
  assert.deepEqual(JSON.parse(fetchCalls[0].opts.body.toString('utf8')), { email: 'maya.fernhollow@kelvin-students.test', password: 'pw-123456' });
});

await test('sign-in with an unknown name answers 401 without calling Neon', async () => {
  resetFetch();
  const res = fakeRes();
  await auth.proxyAuth(authReq('sign-in/email', { username: 'maya fernhollow jr', password: 'x' }), res, 'sign-in/email');
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
  const user = { id: 'u-sofia', email: 'sofia.stonebrook@kelvin-students.test', name: 'Sofia Stonebrook' };
  const saved = await auth.saveProfile(user, { display_name: 'Totally Different Name', major: 'Mechanical Engineering' });
  assert.equal(saved.display_name, 'Sofia Stonebrook', 'the display_name change is ignored');
  assert.equal(saved.username, 'Sofia Stonebrook');
  assert.equal(saved.major, 'Mechanical Engineering', 'other fields still save');
  const profile = await auth.getProfile('u-sofia');
  assert.equal(profile.display_name, 'Sofia Stonebrook');
  assert.equal(profile.username, 'Sofia Stonebrook');
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
