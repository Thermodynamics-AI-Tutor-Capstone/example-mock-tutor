import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { InvalidGrantError } from '@modelcontextprotocol/sdk/server/auth/errors.js';

const dir = process.env.KELVIN_MCP_DATA_DIR || join(import.meta.dirname, 'data');
mkdirSync(dir, { recursive: true, mode: 0o700 });
const accountsPath = join(dir, 'accounts.json');
const statePath = join(dir, 'oauth-state.json');
const hex = value => createHash('sha256').update(value).digest('hex');
const secret = () => randomBytes(32).toString('base64url');
const now = () => Date.now();
function read(path, fallback) { return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback; }
function save(path, value) {
  const tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(value), { mode: 0o600 });
  renameSync(tmp, path);
}
const accounts = () => read(accountsPath, []);
const state = () => read(statePath, { clients: {}, pending: {}, codes: {}, tokens: {} });
function cleaned() {
  const data = state();
  for (const [id, pending] of Object.entries(data.pending)) if (pending.expiresAt < now()) delete data.pending[id];
  for (const [id, code] of Object.entries(data.codes)) if (code.expiresAt < now()) delete data.codes[id];
  for (const [id, token] of Object.entries(data.tokens)) if (token.refreshExpiresAt < now()) delete data.tokens[id];
  return data;
}
const passwordDigest = (password, salt) => scryptSync(password, salt, 64).toString('hex');
function constantEqual(a, b) {
  const left = Buffer.from(a || '', 'hex'), right = Buffer.from(b || '', 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}

export function addInvite(id, name, role, inviteHash) {
  if (!/^[a-zA-Z0-9_-]{3,80}$/.test(id)) throw new Error('Invalid account ID');
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 120) throw new Error('Invalid name');
  if (!['student', 'instructor'].includes(role)) throw new Error('Invalid role');
  if (!/^[a-f0-9]{64}$/.test(inviteHash)) throw new Error('Invalid invite hash');
  const data = accounts();
  if (data.some(a => a.id === id || a.inviteHash === inviteHash)) throw new Error('Account or invite already exists');
  data.push({ id, name: name.trim(), role, inviteHash, passwordHash: null, salt: null, createdAt: new Date().toISOString(), disabled: false });
  save(accountsPath, data);
  return { id, name: name.trim(), role };
}
export function accountById(id) { return accounts().find(a => a.id === id && !a.disabled && a.passwordHash) || null; }
export function sharedStudents() { return accounts().filter(a => a.role === 'student' && !a.disabled && a.passwordHash && a.shareWithInstructor)
  .map(({ id, name }) => ({ id, name })); }
export function setSharing(id, enabled) {
  const data = accounts();
  const account = data.find(a => a.id === id && a.role === 'student' && !a.disabled && a.passwordHash);
  if (!account) throw new Error('Student account unavailable');
  account.shareWithInstructor = Boolean(enabled);
  account.sharingUpdatedAt = new Date().toISOString();
  save(accountsPath, data);
  return account.shareWithInstructor;
}
function claimInvite(invite, password, shareWithInstructor) {
  if (password.length < 12 || password.length > 200) return null;
  const data = accounts();
  const found = data.find(a => !a.disabled && !a.passwordHash && constantEqual(a.inviteHash, hex(invite)));
  if (!found) return null;
  found.salt = randomBytes(16).toString('hex');
  found.passwordHash = passwordDigest(password, found.salt);
  found.inviteHash = null;
  found.shareWithInstructor = found.role === 'student' && Boolean(shareWithInstructor);
  found.sharingUpdatedAt = new Date().toISOString();
  save(accountsPath, data);
  return found;
}
function signIn(id, password) {
  const account = accounts().find(a => a.id === id && !a.disabled && a.passwordHash);
  if (!account) return null;
  return constantEqual(account.passwordHash, passwordDigest(password, account.salt)) ? account : null;
}
export function disableAccount(id) {
  const data = accounts();
  const account = data.find(a => a.id === id);
  if (!account) throw new Error('Account not found');
  account.disabled = true;
  save(accountsPath, data);
}
function tokenPair(data, clientId, accountId, scopes, resource) {
  const access = secret(), refresh = secret();
  data.tokens[hex(access)] = { clientId, accountId, scopes, resource, expiresAt: now() + 3600_000,
    refreshHash: hex(refresh), refreshExpiresAt: now() + 30 * 24 * 3600_000 };
  return { access_token: access, refresh_token: refresh, token_type: 'Bearer', expires_in: 3600, scope: scopes.join(' ') };
}
export function createOAuthProvider(resourceUrl, origin, otherResources = []) {
  const resource = resourceUrl.href;
  const allowedResources = new Set([resource, ...otherResources.map(url => url.href)]);
  const provider = {
    clientsStore: {
      getClient(clientId) { return state().clients[clientId]; },
      registerClient(client) {
        const data = cleaned();
        data.clients[client.client_id] = client;
        save(statePath, data);
        return client;
      }
    },
    async authorize(client, params, res) {
      if (!client.redirect_uris.includes(params.redirectUri)) throw new InvalidGrantError('Unregistered redirect URI');
      if (params.resource && !allowedResources.has(params.resource.href)) throw new InvalidGrantError('Wrong resource');
      const data = cleaned(), id = secret();
      data.pending[hex(id)] = { clientId: client.client_id, redirectUri: params.redirectUri,
        state: params.state, codeChallenge: params.codeChallenge, scopes: params.scopes || ['mcp:tools'],
        resource: params.resource?.href || resource, expiresAt: now() + 10 * 60_000 };
      save(statePath, data);
      res.redirect(302, `${origin}/login?request=${encodeURIComponent(id)}`);
    },
    async challengeForAuthorizationCode(client, code) {
      const found = state().codes[hex(code)];
      if (!found || found.clientId !== client.client_id || found.expiresAt < now()) throw new InvalidGrantError('Invalid code');
      return found.codeChallenge;
    },
    async exchangeAuthorizationCode(client, code, _verifier, redirectUri, requestedResource) {
      const data = cleaned(), key = hex(code), found = data.codes[key];
      if (!found || found.clientId !== client.client_id || found.expiresAt < now() ||
          (redirectUri && redirectUri !== found.redirectUri) ||
          (requestedResource && requestedResource.href !== found.resource)) throw new InvalidGrantError('Invalid code');
      delete data.codes[key];
      const pair = tokenPair(data, client.client_id, found.accountId, found.scopes, found.resource);
      save(statePath, data);
      return pair;
    },
    async exchangeRefreshToken(client, refreshToken, scopes, requestedResource) {
      const data = cleaned();
      const [key, found] = Object.entries(data.tokens).find(([,t]) => t.refreshHash === hex(refreshToken)) || [];
      if (!found || found.clientId !== client.client_id || found.refreshExpiresAt < now() ||
          (requestedResource && requestedResource.href !== found.resource) || !accountById(found.accountId)) throw new InvalidGrantError('Invalid refresh token');
      if (scopes && scopes.some(scope => !found.scopes.includes(scope))) throw new InvalidGrantError('Invalid scope');
      delete data.tokens[key];
      const pair = tokenPair(data, client.client_id, found.accountId, scopes || found.scopes, found.resource);
      save(statePath, data);
      return pair;
    },
    async verifyAccessToken(token) {
      const found = state().tokens[hex(token)];
      if (!found || found.expiresAt < now() || !accountById(found.accountId)) throw new InvalidGrantError('Invalid access token');
      return { token, clientId: found.clientId, scopes: found.scopes,
        expiresAt: Math.floor(found.expiresAt / 1000), resource: new URL(found.resource),
        extra: { accountId: found.accountId } };
    },
    async revokeToken(client, request) {
      const data = cleaned();
      for (const [key, found] of Object.entries(data.tokens)) {
        if (found.clientId === client.client_id && (key === hex(request.token) || found.refreshHash === hex(request.token))) delete data.tokens[key];
      }
      save(statePath, data);
    }
  };
  return provider;
}

const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
export function loginPage(requestId, message = '') {
  const request = typeof requestId === 'string' ? requestId : '';
  const pending = state().pending[hex(request)];
  if (!pending || pending.expiresAt < now()) return null;
  const dashboard = pending.resource.endsWith('/dashboard-data');
  const title = dashboard ? 'Sign in to the Kelvin instructor dashboard' : 'Connect Kelvin to Claude';
  const intro = dashboard ? 'Use an instructor invite or account to view ME 300 records students chose to share.' : 'Sign in to save what you work on in ME 300. You can still use the public course tools without an account.';
  const sharing = dashboard ? '' : '<label><input name="share" type="checkbox" value="yes">My instructor can see the reflections I save, along with my name. I can turn this off later.</label>';
  const note = dashboard ? 'This account is separate from your Claude account.' : 'Kelvin only saves reflections you ask Claude to send to it. This account is separate from your Claude account.';
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in to Kelvin</title><style>body{font:16px system-ui;max-width:520px;margin:7vh auto;padding:24px;color:#1d2730}h1{font-size:1.7em}form{border:1px solid #ccd5dc;border-radius:12px;padding:20px;margin:18px 0}label{display:block;margin:12px 0}input{display:block;box-sizing:border-box;width:100%;padding:10px;margin-top:5px}input[type=checkbox]{display:inline;width:auto;margin-right:8px}button{background:#164a71;color:white;border:0;border-radius:7px;padding:11px 18px;cursor:pointer}.error{color:#a12626}.note{color:#59636b;font-size:.9em}</style><h1>${title}</h1><p>${intro}</p>${message ? `<p class="error">${escape(message)}</p>` : ''}<form method="post" action="/login"><h2>New here?</h2><input type="hidden" name="request" value="${escape(request)}"><label>${dashboard ? 'Instructor' : 'Course'} invite code<input name="invite" autocomplete="off" required></label><label>Create a password (12 characters or more)<input name="password" type="password" minlength="12" required></label>${sharing}<button name="action" value="claim">Create account and connect</button></form><form method="post" action="/login"><h2>Already have an account?</h2><input type="hidden" name="request" value="${escape(request)}"><label>Account ID<input name="account" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button name="action" value="sign-in">Sign in and connect</button></form><p class="note">${note}</p></html>`;
}
export function completeLogin(input) {
  const requestId = String(input.request || ''), data = cleaned(), pending = data.pending[hex(requestId)];
  if (!pending || pending.expiresAt < now()) return { error: 'This sign-in request expired. Start again in Claude.' };
  const password = String(input.password || '');
  const account = input.action === 'claim' ? claimInvite(String(input.invite || ''), password, input.share === 'yes')
    : input.action === 'sign-in' ? signIn(String(input.account || ''), password) : null;
  if (!account) return { error: 'The account, invite, or password was not accepted.' };
  const code = secret();
  data.codes[hex(code)] = { ...pending, accountId: account.id, expiresAt: now() + 5 * 60_000 };
  delete data.pending[hex(requestId)];
  save(statePath, data);
  const url = new URL(pending.redirectUri);
  url.searchParams.set('code', code);
  if (pending.state !== undefined) url.searchParams.set('state', pending.state);
  return { redirect: url.href };
}
