import crypto from 'node:crypto';
import { query } from './db.js';
import { categoryOf } from './admin.js';
import { offerNames, reserveName, claimName, releaseName, usernameOf, displayName, emailFor, parseSignInName } from './usernames.js';

// Accounts are Neon Auth (Managed Better Auth), enabled on the project's Neon database. The
// browser never talks to Neon directly: every /api/auth/* request is proxied to NEON_AUTH_BASE_URL
// so the session cookie is set on OUR origin (a cross-site cookie would be dropped by Safari's ITP).
// Our API then identifies the user by forwarding that cookie to Neon's /get-session, with a short
// in-memory cache so most requests don't pay the round trip.
//
// Neon endpoints used (checked against the live service 2026-09-21): POST /sign-up/email
// {name,email,password}, POST /sign-in/email {email,password}, POST /sign-out, GET /get-session
// (null when signed out), GET /ok.

const SESSION_CACHE_MS = 60_000;
const cache = new Map();
export const PROFILE_FIELDS = ['display_name', 'course_number', 'professor', 'section', 'semester', 'major', 'year', 'default_style'];
// On/off settings, with their value when never set. Testing switches for the capstone: use_jev
// lets a tester compare Kelvin with and without the Jev decision model; show_decisions prints
// what was decided above each reply, for demos.
export const PROFILE_SWITCHES = { use_jev: true, show_decisions: false };
// Who picks the teaching style in Auto (a testing setting): Jev, or Kelvin itself from its style
// index ("skills"). With Jev switched off it is always Kelvin.
export const STYLE_ROUTERS = ['jev', 'skills'];
const FIELD_MAX = 120;

export function authBaseUrl() {
  const url = (process.env.NEON_AUTH_BASE_URL || '').trim().replace(/\/+$/, '');
  return /^https:\/\//.test(url) ? url : null;
}

function httpError(status, message, code) {
  const err = new Error(message);
  err.status = status;
  if (code) err.code = code;
  return err;
}

function isHttps(req) {
  const proto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  return proto === 'https' || Boolean(process.env.VERCEL);
}

async function rawBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (Buffer.isBuffer(req.body)) return req.body;
    if (typeof req.body === 'string') return Buffer.from(req.body);
    return Buffer.from(JSON.stringify(req.body));
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

// Rewrite Neon's Set-Cookie so it binds to our origin: drop Domain, force Path=/, and on plain
// http (local dev) drop Secure and the __Secure- name prefix, which browsers reject over http.
function rewriteSetCookie(value, https) {
  let parts = value.split(';').map((p) => p.trim()).filter(Boolean);
  let [nameValue, ...attrs] = parts;
  // First-party now, so SameSite=Lax replaces Neon's None, and Partitioned (a cross-site feature
  // that browsers reject without Secure) is dropped.
  attrs = attrs.filter((a) => !/^(domain|path|samesite)=/i.test(a) && !/^partitioned$/i.test(a));
  attrs.push('Path=/', 'SameSite=Lax');
  if (!https) {
    nameValue = nameValue.replace(/^__Secure-/, '').replace(/^__Host-/, '');
    attrs = attrs.filter((a) => !/^secure$/i.test(a));
  }
  return [nameValue, ...attrs].join('; ');
}

// Local dev stores the cookie without the __Secure- prefix (see above); Neon expects the real name.
function upstreamCookie(req, https) {
  const cookie = String(req.headers.cookie || '');
  if (https || !cookie) return cookie;
  return cookie.replace(/(^|;\s*)(neon-auth\.|neonauth\.|better-auth\.)/g, '$1__Secure-$2');
}

// The only Neon Auth endpoints the app uses. Anything else (password reset, verification resend,
// magic links, email change) would make Neon send email, including to addresses nobody here owns
// such as made-up test addresses, so it is refused rather than proxied.
const PROXIED_AUTH_PATHS = new Set(['sign-up/email', 'sign-in/email', 'sign-out', 'get-session', 'ok']);

function proxyJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
    'Cache-Control': 'no-store',
  });
  res.end(data);
}

// Headers for passing an upstream (Neon) response through to the browser: the rewritten cookies, the
// upstream content type, and no caching.
function upstreamHeaders(upstream, https) {
  const out = { 'Cache-Control': 'no-store' };
  const ct = upstream.headers.get('content-type');
  if (ct) out['Content-Type'] = ct;
  const setCookies = typeof upstream.headers.getSetCookie === 'function' ? upstream.headers.getSetCookie() : [];
  if (setCookies.length) out['Set-Cookie'] = setCookies.map((c) => rewriteSetCookie(c, https));
  return out;
}

// Parse the JSON body of an auth request the same way the rest of the API does.
function parseAuthBody(body) {
  const text = body ? Buffer.from(body).toString('utf8') : '{}';
  if (!text.trim()) return {};
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw httpError(400, 'Invalid JSON body');
  }
  return parsed && typeof parsed === 'object' ? parsed : {};
}

export async function proxyAuth(req, res, subpath) {
  const method = req.method || 'GET';

  // The name picker's options. Local (the pools and the usernames table), so it needs no Neon.
  if (subpath === 'name-options') {
    if (method !== 'GET') throw httpError(404, 'Not found');
    return proxyJson(res, 200, await offerNames());
  }
  if (!PROXIED_AUTH_PATHS.has(subpath)) throw httpError(404, 'Not found');
  const base = authBaseUrl();
  if (!base) throw httpError(503, 'Accounts are not configured (NEON_AUTH_BASE_URL is not set)');
  const https = isHttps(req);
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const cleanQs = qs.replace(/([?&])route=[^&]*&?/, '$1').replace(/[?&]$/, '');
  const headers = { accept: 'application/json' };
  if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
  const cookie = upstreamCookie(req, https);
  if (cookie) headers.cookie = cookie;
  if (req.headers.origin) headers.origin = req.headers.origin;
  if (req.headers['user-agent']) headers['user-agent'] = req.headers['user-agent'];
  let body = method === 'GET' || method === 'HEAD' ? undefined : await rawBody(req);

  // Sign-ups never bring their own email: the student picks a made-up name, we hold it while Neon
  // creates the account, and the name claims the account on success. Neon failures release the hold.
  if (subpath === 'sign-up/email') {
    const data = parseAuthBody(body);
    if (data.email !== undefined || data.name !== undefined) {
      return proxyJson(res, 400, { error: 'Sign up by picking a name.', code: 'NAME_REQUIRED' });
    }
    const first = typeof data.first === 'string' ? data.first.trim() : '';
    const last = typeof data.last === 'string' ? data.last.trim() : '';
    if (!first || !last || typeof data.password !== 'string' || !data.password) {
      return proxyJson(res, 400, { error: 'Pick a first and last name, and a password.', code: 'NAME_REQUIRED' });
    }
    let key = null;
    try {
      key = await reserveName(first, last);
    } catch (e) {
      if (e.status === 400) return proxyJson(res, 400, { error: e.message, code: e.code });
      throw e;
    }
    if (!key) return proxyJson(res, 409, { error: 'Someone just took that name. Pick another.', code: 'NAME_TAKEN' });
    body = Buffer.from(JSON.stringify({ name: displayName(first, last), email: emailFor(first, last), password: data.password }));
    try {
      const upstream = await fetch(`${base}/${subpath}${cleanQs}`, { method, headers, body, redirect: 'manual' });
      const buf = Buffer.from(await upstream.arrayBuffer());
      let neon = null;
      try {
        neon = JSON.parse(buf.toString('utf8') || 'null');
      } catch {}
      const neonId = neon?.user?.id ?? neon?.data?.user?.id;
      const claimed = upstream.ok && neonId ? await claimName(key, { id: String(neonId) }) : null;
      if (!claimed) await releaseName(key);
      const out = upstreamHeaders(upstream, https);
      res.writeHead(upstream.status, out);
      res.end(buf);
    } catch (e) {
      await releaseName(key).catch(() => {});
      throw e;
    }
    return;
  }

  // Existing accounts sign in by email; a student signs in with their made-up name, which is turned
  // into the derived email before it goes to Neon.
  if (subpath === 'sign-in/email') {
    const data = parseAuthBody(body);
    if (typeof data.username === 'string' && data.email === undefined) {
      const email = parseSignInName(data.username);
      if (!email) {
        return proxyJson(res, 401, { code: 'INVALID_EMAIL_OR_PASSWORD', message: 'Incorrect name or password.' });
      }
      body = Buffer.from(JSON.stringify({ email, password: data.password }));
    }
  }

  const upstream = await fetch(`${base}/${subpath}${cleanQs}`, { method, headers, body, redirect: 'manual' });
  const out = upstreamHeaders(upstream, https);
  if (subpath === 'sign-out') {
    cache.clear();
    out['Set-Cookie'] = [...(out['Set-Cookie'] || []), viewAsCookie(req, null)];
  }
  res.writeHead(upstream.status, out);
  res.end(Buffer.from(await upstream.arrayBuffer()));
}

// The signed-in user for this request, or null. Cached briefly by cookie so a chat turn that makes
// several API calls asks Neon once.
export async function currentUser(req) {
  const base = authBaseUrl();
  if (!base) return null;
  const https = isHttps(req);
  const cookie = upstreamCookie(req, https);
  if (!cookie || !/session_token/.test(cookie)) return null;
  const key = crypto.createHash('sha256').update(cookie).digest('hex');
  const hit = cache.get(key);
  if (hit && hit.until > Date.now()) return hit.user;
  let user = null;
  try {
    const r = await fetch(`${base}/get-session`, { headers: { cookie, accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
    const data = r.ok ? await r.json() : null;
    if (data?.user?.id) user = { id: String(data.user.id), email: data.user.email || null, name: data.user.name || null };
  } catch (e) {
    console.error('Neon Auth get-session failed:', e.message);
    return null;
  }
  cache.set(key, { user, until: Date.now() + SESSION_CACHE_MS });
  if (cache.size > 5000) cache.delete(cache.keys().next().value);
  return user;
}

function cleanField(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') throw httpError(400, 'Profile fields must be text');
  const v = value.replace(/\s+/g, ' ').trim().slice(0, FIELD_MAX);
  return v || null;
}

// Accounts are never deleted: "delete my account" deactivates it. Everything the student made is
// kept for the capstone team, and a deactivated account can't use the API (403 account_inactive).
export async function accountInactive(userId) {
  const { rows } = await query('SELECT 1 FROM user_profiles WHERE user_id = $1 AND deactivated_at IS NOT NULL', [userId]);
  return rows.length > 0;
}

export async function deactivateAccount(user) {
  await query(
    `INSERT INTO user_profiles (user_id, email, display_name, deactivated_at, updated_at) VALUES ($1, $2, $3, now(), now())
     ON CONFLICT (user_id) DO UPDATE SET deactivated_at = COALESCE(user_profiles.deactivated_at, now()), updated_at = now()`,
    [user.id, user.email, user.name]
  );
  cache.clear();
}

export async function isAdmin(userId) {
  const { rows } = await query('SELECT 1 FROM user_profiles WHERE user_id = $1 AND is_admin IS TRUE AND deactivated_at IS NULL', [userId]);
  return rows.length > 0;
}

// View as: an admin can use the app as one of the test students (the simulated-student accounts and
// the eval account, never a real student) without signing out. The choice is a cookie holding that
// student's user id. It only takes effect while the signed-in session is an active admin's, so for
// anyone else it does nothing. The admin dashboard and the switcher always use the real account.
export const VIEW_AS_COOKIE = 'kelvin_view_as';
const VIEW_AS_MAX_AGE_S = 12 * 60 * 60;

function readCookie(req, name) {
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) {
      try {
        return decodeURIComponent(part.slice(i + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function viewAsCookie(req, userId) {
  const attrs = ['Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (isHttps(req)) attrs.push('Secure');
  return userId
    ? `${VIEW_AS_COOKIE}=${encodeURIComponent(userId)}; Max-Age=${VIEW_AS_MAX_AGE_S}; ${attrs.join('; ')}`
    : `${VIEW_AS_COOKIE}=; Max-Age=0; ${attrs.join('; ')}`;
}

const testNumber = (email) => {
  const m = /^test(\d+)@/i.exec(String(email || ''));
  return m ? Number(m[1]) : null;
};

// Every account an admin may switch to, Test 1…N first, then the eval account.
export async function switchableAccounts() {
  const { rows } = await query('SELECT user_id, email, display_name FROM user_profiles WHERE email IS NOT NULL AND is_admin IS NOT TRUE AND deactivated_at IS NULL');
  return rows
    .filter((r) => categoryOf(r) === 'eval')
    .map((r) => ({ id: r.user_id, email: r.email, name: r.display_name || r.email, label: testNumber(r.email) ? `Test ${testNumber(r.email)}` : 'Eval' }))
    .sort((a, b) => (testNumber(a.email) ?? Infinity) - (testNumber(b.email) ?? Infinity) || a.email.localeCompare(b.email));
}

// The account this request acts as: the signed-in user, or the test student an admin switched to
// (with `viewer` set to the admin).
export async function actingUser(req, sessionUser) {
  const target = readCookie(req, VIEW_AS_COOKIE);
  if (!target || target === sessionUser.id) return sessionUser;
  if (!(await isAdmin(sessionUser.id))) return sessionUser;
  const account = (await switchableAccounts()).find((a) => a.id === target);
  if (!account) return sessionUser;
  return { id: account.id, email: account.email, name: account.name, viewer: sessionUser };
}

export async function getProfile(userId) {
  const switches = Object.keys(PROFILE_SWITCHES);
  const { rows } = await query(`SELECT ${[...PROFILE_FIELDS, ...switches].join(', ')}, username, style_router, is_admin, onboarded_at FROM user_profiles WHERE user_id = $1`, [userId]);
  const row = rows[0];
  if (!row) return null;
  const out = {};
  for (const f of PROFILE_FIELDS) out[f] = row[f] ?? null;
  for (const [f, fallback] of Object.entries(PROFILE_SWITCHES)) out[f] = typeof row[f] === 'boolean' ? row[f] : fallback;
  out.style_router = STYLE_ROUTERS.includes(row.style_router) ? row.style_router : 'jev';
  out.is_admin = row.is_admin === true;
  out.onboarded = Boolean(row.onboarded_at);
  out.username = row.username ?? null;
  return out;
}

// Partial update: only fields present in `body` change. `onboard: true` marks the sign-up
// questions as answered. A display name is always required.
export async function saveProfile(user, body, { validStyle } = {}) {
  const existing = await getProfile(user.id);
  // A student's made-up name is their identity: it was fixed at sign-up, so for them any
  // display_name in the request is ignored and theirs is kept.
  const username = existing?.username || (await usernameOf(user.id));
  const next = { ...(existing || { display_name: user.name || null }) };
  for (const f of PROFILE_FIELDS) {
    if (f === 'display_name' && username) continue;
    const v = cleanField(body[f]);
    if (v !== undefined) next[f] = v;
  }
  if (username) next.display_name = username;
  for (const [f, fallback] of Object.entries(PROFILE_SWITCHES)) {
    if (body[f] === undefined) {
      if (typeof next[f] !== 'boolean') next[f] = fallback;
      continue;
    }
    if (typeof body[f] !== 'boolean') throw httpError(400, `${f} must be true or false`);
    next[f] = body[f];
  }
  if (body.style_router !== undefined) {
    if (!STYLE_ROUTERS.includes(body.style_router)) throw httpError(400, `style_router must be one of ${STYLE_ROUTERS.join(', ')}`);
    next.style_router = body.style_router;
  }
  if (!STYLE_ROUTERS.includes(next.style_router)) next.style_router = 'jev';
  if (!next.display_name) throw httpError(400, 'Please enter your name', 'name_required');
  if (next.default_style && validStyle && !validStyle(next.default_style)) throw httpError(400, `Unknown style "${next.default_style}"`);
  const cols = [...PROFILE_FIELDS, ...Object.keys(PROFILE_SWITCHES), 'style_router'];
  await query(
    `INSERT INTO user_profiles (user_id, email, ${cols.join(', ')}, onboarded_at, updated_at)
     VALUES ($1, $2, ${cols.map((_, i) => `$${i + 3}`).join(', ')}, CASE WHEN $${cols.length + 3}::boolean THEN now() END, now())
     ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email, ${cols.map((c) => `${c} = EXCLUDED.${c}`).join(', ')},
       onboarded_at = COALESCE(user_profiles.onboarded_at, EXCLUDED.onboarded_at), updated_at = now()`,
    [user.id, user.email, ...cols.map((c) => next[c] ?? null), body.onboard === true]
  );
  return getProfile(user.id);
}
