import crypto from 'node:crypto';
import { query } from './db.js';

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

export async function proxyAuth(req, res, subpath) {
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
  const method = req.method || 'GET';
  const body = method === 'GET' || method === 'HEAD' ? undefined : await rawBody(req);
  const upstream = await fetch(`${base}/${subpath}${cleanQs}`, { method, headers, body, redirect: 'manual' });
  const out = { 'Cache-Control': 'no-store' };
  const ct = upstream.headers.get('content-type');
  if (ct) out['Content-Type'] = ct;
  const setCookies = typeof upstream.headers.getSetCookie === 'function' ? upstream.headers.getSetCookie() : [];
  if (setCookies.length) out['Set-Cookie'] = setCookies.map((c) => rewriteSetCookie(c, https));
  if (subpath === 'sign-out') cache.clear();
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

export async function getProfile(userId) {
  const switches = Object.keys(PROFILE_SWITCHES);
  const { rows } = await query(`SELECT ${[...PROFILE_FIELDS, ...switches].join(', ')}, style_router, onboarded_at FROM user_profiles WHERE user_id = $1`, [userId]);
  const row = rows[0];
  if (!row) return null;
  const out = {};
  for (const f of PROFILE_FIELDS) out[f] = row[f] ?? null;
  for (const [f, fallback] of Object.entries(PROFILE_SWITCHES)) out[f] = typeof row[f] === 'boolean' ? row[f] : fallback;
  out.style_router = STYLE_ROUTERS.includes(row.style_router) ? row.style_router : 'jev';
  out.onboarded = Boolean(row.onboarded_at);
  return out;
}

// Partial update: only fields present in `body` change. `onboard: true` marks the sign-up
// questions as answered. A display name is always required.
export async function saveProfile(user, body, { validStyle } = {}) {
  const next = { ...((await getProfile(user.id)) || { display_name: user.name || null }) };
  for (const f of PROFILE_FIELDS) {
    const v = cleanField(body[f]);
    if (v !== undefined) next[f] = v;
  }
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
