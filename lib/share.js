import { query } from './db.js';

// Read-only share links for one conversation (/share?t=<token>). An admin makes the link on the
// dashboard (lib/admin.js share/unshare); anyone holding it can read the chat without signing in.
// What a link shows is only the conversation: its title and each message, as "Student" and
// "Kelvin". No account, label, time, style decision, cost or attachment. The student's name, email
// local part and professor are replaced wherever they appear in the text, and so are any email
// addresses and phone numbers.

export const TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/;

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
// Only separator-written US numbers (814-555-0123, 814.555.0123, (814) 555-0123), so the numbers
// in a thermodynamics answer are left alone.
const PHONE_RE = /(?<![\d.])(?:\+?1[-.\s])?(?:\(\d{3}\)\s?|\d{3}[-.])\d{3}[-.]\d{4}(?![\d])/g;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Words never treated as a name on their own: the tutor's name and the words test accounts are
// named with ("Kelvin Eval"), and titles ("Dr."). A full name containing them is still replaced as a whole.
const NOT_NAMES = new Set(['kelvin', 'eval', 'test', 'student', 'admin', 'user', 'the', 'dr', 'prof', 'professor', 'mr', 'mrs', 'ms']);

function namePatterns(value, replacement) {
  const whole = String(value || '').replace(/\s+/g, ' ').trim();
  if (!whole) return [];
  const words = new Set([whole, ...whole.split(/[\s,]+/)]);
  const out = [];
  for (const w of words) {
    const word = w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
    if (word.length < 2 || (word !== whole && NOT_NAMES.has(word.toLowerCase()))) continue;
    // Two-letter names only match as written ("Li", not "li"), so ordinary words survive.
    out.push({ word, re: new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(word)}(?![\\p{L}\\p{N}])`, word.length < 3 ? 'gu' : 'giu'), replacement });
  }
  return out;
}

// A function that removes one student's identifying details from any text.
export function redactor({ name, email, professor } = {}) {
  const local = String(email || '').split('@')[0];
  const patterns = [...namePatterns(name, '[student]'), ...namePatterns(professor, '[instructor]')]
    .sort((a, b) => b.word.length - a.word.length);
  if (local.length >= 3 && !NOT_NAMES.has(local.toLowerCase())) patterns.unshift({ word: local, re: new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(local)}(?![\\p{L}\\p{N}])`, 'giu'), replacement: '[student]' });
  return (text) => {
    let s = String(text ?? '').replace(EMAIL_RE, '[email]').replace(PHONE_RE, '[phone]');
    for (const p of patterns) s = s.replace(p.re, p.replacement);
    return s;
  };
}

// The live share for a token, or null (unknown, turned off, or a chat that isn't a student's).
async function liveShare(token) {
  if (!TOKEN_RE.test(String(token || ''))) return null;
  const { rows } = await query(
    `SELECT c.id, c.title, c.user_id, p.email, p.display_name, p.professor, coalesce(p.is_admin, false) AS is_admin
       FROM conversation_shares s
       JOIN conversations c ON c.id = s.conversation_id
       LEFT JOIN user_profiles p ON p.user_id = c.user_id
      WHERE s.token = $1 AND s.revoked_at IS NULL`,
    [token]
  );
  const r = rows[0];
  return r && !r.is_admin ? r : null;
}

export async function isLiveShare(token) {
  return Boolean(await liveShare(token));
}

export async function sharedConversation(token) {
  const c = await liveShare(token);
  if (!c) return null;
  const clean = redactor({ name: c.display_name, email: c.email, professor: c.professor });
  const { rows } = await query('SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY id', [c.id]);
  return {
    title: clean(c.title),
    messages: rows.map((m) => ({ role: m.role, content: clean(m.content) })),
  };
}
