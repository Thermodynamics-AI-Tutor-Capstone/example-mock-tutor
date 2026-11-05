import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const hash = value => createHash('sha256').update(value).digest('hex');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function ready(url) {
  for (let i = 0; i < 40; i++) { try { if ((await fetch(url)).ok) return; } catch {} await delay(100); }
  throw new Error('Server did not start');
}
test('invited student signs in through OAuth PKCE and receives private records', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'kelvin-oauth-test-'));
  const port = 35000 + Math.floor(Math.random() * 1000);
  const origin = `http://127.0.0.1:${port}`;
  const env = { ...process.env, KELVIN_MCP_DATA_DIR: dir, PORT: String(port), KELVIN_PUBLIC_ORIGIN: origin,
    KELVIN_DASHBOARD_ORIGIN: 'https://dashboard.example' };
  const invite = 'test-invite-secret-123456789';
  const admin = spawn(process.execPath, ['admin.mjs', 'invite-hash', 'student-1', 'Student One', 'student', hash(invite)],
    { cwd: import.meta.dirname + '/..', env });
  assert.equal(await new Promise(resolve => admin.on('exit', resolve)), 0);
  const child = spawn(process.execPath, ['server.mjs'], { cwd: import.meta.dirname + '/..', env });
  try {
    await ready(`${origin}/health`);
    const resource = `${origin}/mcp/account`;
    const metadata = await fetch(`${origin}/.well-known/oauth-protected-resource/mcp/account`);
    assert.equal(metadata.status, 200);
    assert.equal((await metadata.json()).resource, resource);
    const challenge = await fetch(resource, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    assert.equal(challenge.status, 401);
    assert.match(challenge.headers.get('www-authenticate'), /resource_metadata/);
    const registered = await fetch(`${origin}/register`, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ client_name: 'Kelvin OAuth test', redirect_uris: [`${origin}/callback`],
        grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'], token_endpoint_auth_method: 'none' }) });
    assert.equal(registered.status, 201);
    const { client_id } = await registered.json();
    const verifier = 'a'.repeat(64);
    const codeChallenge = createHash('sha256').update(verifier).digest('base64url');
    const auth = new URL('/authorize', origin);
    for (const [key, value] of Object.entries({ response_type: 'code', client_id, redirect_uri: `${origin}/callback`,
      code_challenge: codeChallenge, code_challenge_method: 'S256', scope: 'mcp:tools', state: 'test-state', resource })) auth.searchParams.set(key, value);
    const authorize = await fetch(auth, { redirect: 'manual' });
    assert.equal(authorize.status, 302);
    const loginUrl = new URL(authorize.headers.get('location'), origin);
    assert.equal((await fetch(loginUrl)).status, 200);
    const login = await fetch(`${origin}/login`, { method: 'POST', redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'claim', request: loginUrl.searchParams.get('request'), invite, password: 'strong-password-123', share: 'yes' }) });
    assert.equal(login.status, 302);
    const callback = new URL(login.headers.get('location'));
    assert.equal(callback.searchParams.get('state'), 'test-state');
    const tokens = await fetch(`${origin}/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', client_id, code: callback.searchParams.get('code'),
        code_verifier: verifier, redirect_uri: `${origin}/callback`, resource }) });
    assert.equal(tokens.status, 200);
    const { access_token, refresh_token } = await tokens.json();
    assert.ok(access_token && refresh_token);
    const replay = await fetch(`${origin}/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', client_id, code: callback.searchParams.get('code'),
        code_verifier: verifier, redirect_uri: `${origin}/callback`, resource }) });
    assert.equal(replay.status, 400);
    const client = new Client({ name: 'test-client', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(resource), { requestInit: { headers: { Authorization: `Bearer ${access_token}` } } }));
    const tools = (await client.listTools()).tools.map(x => x.name);
    assert.ok(tools.includes('record_learning'));
    const account = await client.callTool({ name: 'my_account', arguments: {} });
    assert.equal(JSON.parse(account.content[0].text).id, 'student-1');
    assert.equal(JSON.parse(account.content[0].text).shareWithInstructor, true);
    const sharing = await client.callTool({ name: 'share_with_instructor', arguments: { enabled: false } });
    assert.equal(JSON.parse(sharing.content[0].text).shareWithInstructor, false);
    await client.callTool({ name: 'share_with_instructor', arguments: { enabled: true } });
    const saved = await client.callTool({ name: 'record_learning', arguments: { statement: 'I studied entropy balance today.', consent: true } });
    assert.equal(JSON.parse(saved.content[0].text).saved, true);
    const instructorInvite = 'instructor-invite-secret-123456789';
    const instructorAdmin = spawn(process.execPath, ['admin.mjs', 'invite-hash', 'instructor-1', 'Professor One', 'instructor', hash(instructorInvite)],
      { cwd: import.meta.dirname + '/..', env });
    assert.equal(await new Promise(resolve => instructorAdmin.on('exit', resolve)), 0);
    const instructorAuthorize = await fetch(auth, { redirect: 'manual' });
    assert.equal(instructorAuthorize.status, 302);
    const instructorLoginUrl = new URL(instructorAuthorize.headers.get('location'), origin);
    const instructorLogin = await fetch(`${origin}/login`, { method: 'POST', redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'claim', request: instructorLoginUrl.searchParams.get('request'),
        invite: instructorInvite, password: 'another-strong-password-123' }) });
    assert.equal(instructorLogin.status, 302);
    const instructorCode = new URL(instructorLogin.headers.get('location')).searchParams.get('code');
    const instructorTokens = await fetch(`${origin}/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', client_id, code: instructorCode,
        code_verifier: verifier, redirect_uri: `${origin}/callback`, resource }) });
    assert.equal(instructorTokens.status, 200);
    const instructorAccess = (await instructorTokens.json()).access_token;
    const instructor = new Client({ name: 'instructor-test', version: '1.0.0' });
    await instructor.connect(new StreamableHTTPClientTransport(new URL(resource), { requestInit: { headers: { Authorization: `Bearer ${instructorAccess}` } } }));
    const students = await instructor.callTool({ name: 'shared_students', arguments: {} });
    assert.deepEqual(JSON.parse(students.content[0].text), [{ id: 'student-1', name: 'Student One' }]);
    const learning = await instructor.callTool({ name: 'student_learning', arguments: { student_id: 'student-1' } });
    assert.equal(JSON.parse(learning.content[0].text).total, 1);
    const dashboardResource = `${origin}/dashboard-data`;
    const dashboardAuth = new URL(auth);
    dashboardAuth.searchParams.set('resource', dashboardResource);
    const dashboardAuthorize = await fetch(dashboardAuth, { redirect: 'manual' });
    assert.equal(dashboardAuthorize.status, 302);
    const dashboardLoginUrl = new URL(dashboardAuthorize.headers.get('location'), origin);
    const dashboardLogin = await fetch(`${origin}/login`, { method: 'POST', redirect: 'manual',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'sign-in', request: dashboardLoginUrl.searchParams.get('request'),
        account: 'instructor-1', password: 'another-strong-password-123' }) });
    assert.equal(dashboardLogin.status, 302);
    const dashboardCode = new URL(dashboardLogin.headers.get('location')).searchParams.get('code');
    const dashboardTokens = await fetch(`${origin}/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', client_id, code: dashboardCode,
        code_verifier: verifier, redirect_uri: `${origin}/callback`, resource: dashboardResource }) });
    assert.equal(dashboardTokens.status, 200);
    const dashboardAccess = (await dashboardTokens.json()).access_token;
    const dashboardResponse = await fetch(dashboardResource, { headers: { Authorization: `Bearer ${dashboardAccess}`, Origin: 'https://dashboard.example' } });
    assert.equal(dashboardResponse.status, 200);
    assert.equal(dashboardResponse.headers.get('access-control-allow-origin'), 'https://dashboard.example');
    assert.deepEqual((await dashboardResponse.json()).students, [{ id: 'student-1', name: 'Student One' }]);
    const wrongAudience = await fetch(dashboardResource, { headers: { Authorization: `Bearer ${instructorAccess}` } });
    assert.equal(wrongAudience.status, 401);
    await client.callTool({ name: 'share_with_instructor', arguments: { enabled: false } });
    const hidden = await instructor.callTool({ name: 'student_learning', arguments: { student_id: 'student-1' } });
    assert.equal(hidden.isError, true);
    const hiddenDashboard = await fetch(`${dashboardResource}?student_id=student-1`, { headers: { Authorization: `Bearer ${dashboardAccess}` } });
    assert.equal(hiddenDashboard.status, 404);
    await instructor.close();
    await client.close();
  } finally { child.kill(); rmSync(dir, { recursive: true, force: true }); }
});
