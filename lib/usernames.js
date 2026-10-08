import crypto from 'node:crypto';
import { query } from './db.js';
import { FIRST_NAMES, LAST_NAMES, RETIRED_FIRST_NAMES, RETIRED_LAST_NAMES } from './name-pool.js';

// Sign-in also accepts names from the retired pool, which some accounts already hold.
const SIGN_IN_FIRST = [...FIRST_NAMES, ...RETIRED_FIRST_NAMES];
const SIGN_IN_LAST = [...LAST_NAMES, ...RETIRED_LAST_NAMES];

// Anonymous student accounts (lib/name-pool.js has the full story): a student's identity is a made-up
// name they picked at sign-up. Every account's email is derived from that name (so it can be signed in
// to with Neon Auth), the name_key is the single place the name lives, and the usernames table's
// primary key makes sure no two accounts can ever hold the same name. Rows with no user_id are
// sign-ups in flight, held for a while by reserved_until.

export const STUDENT_EMAIL_DOMAIN = 'kelvin-students.test';

const httpError = (status, message, code) => {
  const err = new Error(message);
  err.status = status;
  if (code) err.code = code;
  return err;
};

export function nameKey(first, last) {
  return `${String(first).trim()} ${String(last).trim()}`.toLowerCase();
}

export function displayName(first, last) {
  return `${String(first).trim()} ${String(last).trim()}`;
}

export function emailFor(first, last) {
  return `${String(first).trim()}.${String(last).trim()}@${STUDENT_EMAIL_DOMAIN}`.toLowerCase();
}

export function inPool(first, last) {
  return FIRST_NAMES.includes(String(first).trim()) && LAST_NAMES.includes(String(last).trim());
}

// Sign-in accepts an email (accounts from before the name picker, and admins) or the student's made-up
// name, as two words matched against the pools case-insensitively.
export function parseSignInName(text) {
  const t = String(text || '').trim();
  if (!t) return null;
  if (t.includes('@')) return t;
  const words = t.split(/\s+/);
  if (words.length !== 2) return null;
  const first = SIGN_IN_FIRST.find((n) => n.toLowerCase() === words[0].toLowerCase());
  const last = SIGN_IN_LAST.find((n) => n.toLowerCase() === words[1].toLowerCase());
  if (!first || !last) return null;
  return emailFor(first, last);
}

// Draw a first-name list and a last-name list (all distinct) for the sign-up page to offer.
function pickN(list, n) {
  const out = [];
  const used = new Set();
  while (out.length < n) {
    const i = crypto.randomInt(list.length);
    if (!used.has(i)) {
      used.add(i);
      out.push(list[i]);
    }
  }
  return out;
}

export async function offerNames({ count = 5 } = {}) {
  const first = pickN(FIRST_NAMES, count);
  const last = pickN(LAST_NAMES, count);
  const keys = first.flatMap((f) => last.map((l) => nameKey(f, l)));
  const { rows } = await query(
    `SELECT name_key FROM usernames WHERE name_key = ANY($1::text[]) AND (user_id IS NOT NULL OR reserved_until > now())`,
    [keys]
  );
  const taken = new Set(rows.map((r) => r.name_key));
  return {
    first,
    last,
    taken: first.flatMap((f) => last.filter((l) => taken.has(nameKey(f, l))).map((l) => displayName(f, l))),
  };
}

// Hold a name while Neon creates the account. Returns the name_key, or null when the name is already
// claimed or reserved. One statement, so two sign-ups racing for the same name can't both win: the
// second insert conflicts and its WHERE clause fails against the first's fresh reservation.
export async function reserveName(first, last, { holdS = 120 } = {}) {
  if (!inPool(first, last)) throw httpError(400, 'That name is not on the list. Pick one of the offered names.', 'NAME_NOT_IN_POOL');
  const key = nameKey(first, last);
  const { rows } = await query(
    `INSERT INTO usernames (name_key, first_name, last_name, reserved_until) VALUES ($1, $2, $3, now() + make_interval(secs => $4))
     ON CONFLICT (name_key) DO UPDATE SET reserved_until = EXCLUDED.reserved_until
       WHERE usernames.user_id IS NULL AND (usernames.reserved_until IS NULL OR usernames.reserved_until < now())
     RETURNING name_key`,
    [key, String(first).trim(), String(last).trim(), holdS]
  );
  return rows.length ? rows[0].name_key : null;
}

// The account is created in Neon: make the name permanent. The profile row's display_name and username
// are both the name, and are the only places it is ever written again.
export async function claimName(key, user) {
  const { rows } = await query('UPDATE usernames SET user_id = $2, reserved_until = NULL WHERE name_key = $1 AND user_id IS NULL RETURNING first_name, last_name', [key, user.id]);
  const row = rows[0];
  if (!row) return null;
  const name = displayName(row.first_name, row.last_name);
  await query(
    `INSERT INTO user_profiles (user_id, email, display_name, username, updated_at) VALUES ($1, $2, $3, $3, now())
     ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email, display_name = EXCLUDED.display_name, username = EXCLUDED.username, updated_at = now()`,
    [user.id, emailFor(row.first_name, row.last_name), name]
  );
  return { name, email: emailFor(row.first_name, row.last_name) };
}

// Give back a reservation Neon never used. The row stays (names are never deleted); an expired
// reservation is exactly what frees it.
export async function releaseName(key) {
  await query('UPDATE usernames SET reserved_until = now() WHERE name_key = $1 AND user_id IS NULL', [key]);
}

export async function usernameOf(userId) {
  const { rows } = await query('SELECT first_name, last_name FROM usernames WHERE user_id = $1', [userId]);
  const row = rows[0];
  return row ? displayName(row.first_name, row.last_name) : null;
}
