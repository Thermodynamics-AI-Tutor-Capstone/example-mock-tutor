import crypto from 'node:crypto';
import { query } from './db.js';
import { categoryOf } from './admin.js';
import { isAdmin } from './auth.js';

// Usage limits for the student trial: about 20 students, and $40 in total for what they use. Every
// model call is already in model_usage with its user and cost (lib/usage.js), so a limit is a sum
// over that table. Students never see a dollar figure: they see the share of their trial allowance
// they've used, as a percentage, and a plain message when a limit stops them.
//
// Past 80% of any limit (their own or the whole app's), replies move to the cheaper model
// (lib/routing.js) instead of stopping. At 100% new messages are refused until the limit resets.
//
// Admins and the eval/test accounts are exempt, and their spend doesn't count toward the app's
// totals: those totals are only for real students.

export const LIMITS = {
  trialUsd: 1.6, // each student's allowance for the whole trial
  dailyUsd: 0.6, // per student per day
  dailyMessages: 60, // per student per day
  appTotalUsd: 40, // all real students together, since trialStartsAt
  appDailyUsd: 4, // all real students together, per day
  reduceAt: 0.8, // past this share of any limit, replies move to the cheaper model
  uploadsPerDay: 12, // per student
  messagesPerMinute: 5, // burst limit per student
  timeZone: 'America/New_York',
  trialStartsAt: process.env.TRIAL_STARTS_AT || '2026-10-02T00:00:00-04:00',
};

const APP_TOTALS_CACHE_MS = 30_000;

const MESSAGES = {
  trial_used: "You've used all of your Kelvin time for this trial. Thanks for trying it!",
  daily_spend: "You've reached today's limit. Kelvin will be back at midnight.",
  daily_messages: "You've reached today's limit. Kelvin will be back at midnight.",
  app_daily: 'Kelvin has reached its limit for today. It will be back at midnight.',
  app_total: "Kelvin's trial has used its whole budget, so it's paused for now.",
};
const DAILY_REASONS = new Set(['daily_spend', 'daily_messages', 'app_daily']);

// The wall-clock parts of `at` in `timeZone`.
function zonedParts(at, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at);
  const n = Object.fromEntries(parts.filter((p) => p.type !== 'literal').map((p) => [p.type, Number(p.value)]));
  return { y: n.year, m: n.month, d: n.day, h: n.hour, min: n.minute, s: n.second };
}

// How far `timeZone` is ahead of UTC at instant `at`, in ms.
function zoneOffsetMs(at, timeZone) {
  const p = zonedParts(at, timeZone);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - Math.floor(at.getTime() / 1000) * 1000;
}

// The instant of local midnight at the start of the calendar day y-m-d in `timeZone`. Midnight is
// never skipped by a US DST change (they happen at 2 a.m.), so one offset correction is exact.
function midnight(y, m, d, timeZone) {
  const guess = new Date(Date.UTC(y, m - 1, d));
  const first = new Date(guess.getTime() - zoneOffsetMs(guess, timeZone));
  return new Date(guess.getTime() - zoneOffsetMs(first, timeZone));
}

export function dayStart(now = new Date(), timeZone = LIMITS.timeZone) {
  const p = zonedParts(now, timeZone);
  return midnight(p.y, p.m, p.d, timeZone);
}

export function nextDayStart(now = new Date(), timeZone = LIMITS.timeZone) {
  const p = zonedParts(now, timeZone);
  const next = new Date(Date.UTC(p.y, p.m - 1, p.d + 1));
  return midnight(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), timeZone);
}

export async function isExempt(user) {
  if (categoryOf({ user_id: user.id, email: user.email }) === 'eval') return true;
  return isAdmin(user.id);
}

// Accounts whose spend isn't a real student's: admins and eval/test accounts.
async function exemptIds() {
  const { rows } = await query('SELECT user_id, email, is_admin FROM user_profiles');
  return rows.filter((r) => r.is_admin === true || categoryOf(r) === 'eval').map((r) => r.user_id);
}

let appTotalsCache = null;

async function appTotals(now) {
  const since = dayStart(now);
  if (appTotalsCache && appTotalsCache.until > Date.now() && appTotalsCache.since === since.getTime()) return appTotalsCache.value;
  const { rows } = await query(
    `SELECT coalesce(sum(cost_usd) FILTER (WHERE at >= $2), 0) AS total, coalesce(sum(cost_usd) FILTER (WHERE at >= $3), 0) AS today
       FROM model_usage
      WHERE user_id IS NOT NULL AND user_id <> ALL($1::text[]) AND at >= least($2::timestamptz, $3::timestamptz)`,
    [await exemptIds(), new Date(LIMITS.trialStartsAt), since]
  );
  const value = { total: Number(rows[0].total) || 0, today: Number(rows[0].today) || 0 };
  appTotalsCache = { value, since: since.getTime(), until: Date.now() + APP_TOTALS_CACHE_MS };
  return value;
}

export function clearLimitsCache() {
  appTotalsCache = null;
}

export async function usageStatus(user, { now = new Date() } = {}) {
  if (await isExempt(user)) return { exempt: true, state: 'ok', reason: null, percent: 0, message: null, resetsAt: null };
  const since = dayStart(now);
  const [spend, messages, app] = await Promise.all([
    query(
      `SELECT coalesce(sum(cost_usd), 0) AS total, coalesce(sum(cost_usd) FILTER (WHERE at >= $2), 0) AS today
         FROM model_usage WHERE user_id = $1`,
      [user.id, since]
    ),
    // Deleted chats still count, or deleting one would reset the limit.
    query(
      `SELECT count(*) AS n FROM messages m JOIN conversations c ON c.id = m.conversation_id
        WHERE c.user_id = $1 AND m.role = 'user' AND m.created_at >= $2`,
      [user.id, since]
    ),
    appTotals(now),
  ]);
  const fractions = {
    app_total: app.total / LIMITS.appTotalUsd,
    trial_used: (Number(spend.rows[0].total) || 0) / LIMITS.trialUsd,
    app_daily: app.today / LIMITS.appDailyUsd,
    daily_spend: (Number(spend.rows[0].today) || 0) / LIMITS.dailyUsd,
    daily_messages: Number(messages.rows[0].n) / LIMITS.dailyMessages,
  };
  const percent = Math.min(100, Math.round(fractions.trial_used * 100));
  // The keys above are in priority order: the first limit that is used up is the one reported.
  const reason = Object.keys(fractions).find((k) => fractions[k] >= 1) || null;
  if (reason) {
    return { exempt: false, state: 'blocked', reason, percent, message: MESSAGES[reason], resetsAt: DAILY_REASONS.has(reason) ? nextDayStart(now).toISOString() : null };
  }
  const reduced = Object.values(fractions).some((f) => f >= LIMITS.reduceAt);
  return { exempt: false, state: reduced ? 'reduced' : 'ok', reason: null, percent, message: null, resetsAt: null };
}

export async function checkBurst(user, { now = new Date() } = {}) {
  if (await isExempt(user)) return { ok: true };
  const { rows } = await query(
    `SELECT count(*) AS n, min(m.created_at) AS oldest FROM messages m JOIN conversations c ON c.id = m.conversation_id
      WHERE c.user_id = $1 AND m.role = 'user' AND m.created_at > $2`,
    [user.id, new Date(now.getTime() - 60_000)]
  );
  if (Number(rows[0].n) < LIMITS.messagesPerMinute) return { ok: true };
  const oldest = rows[0].oldest ? new Date(rows[0].oldest).getTime() : now.getTime();
  const retryAfterS = Math.max(1, Math.ceil((oldest + 60_000 - now.getTime()) / 1000));
  return { ok: false, retryAfterS, message: 'Slow down a little — try again in a few seconds.' };
}

export async function checkUploads(user, { now = new Date() } = {}) {
  if (await isExempt(user)) return { ok: true };
  const { rows } = await query('SELECT count(*) AS n FROM attachments WHERE user_id = $1 AND created_at >= $2', [user.id, dayStart(now)]);
  if (Number(rows[0].n) < LIMITS.uploadsPerDay) return { ok: true };
  return { ok: false, message: "You've reached today's upload limit. You can upload more after midnight.", resetsAt: nextDayStart(now).toISOString() };
}

// One reply at a time per account: a second message while Kelvin is still answering is refused.
// The lock is a row with an expiry, so a crashed reply can't hold it for longer than ttlS.
export async function acquireReplyLock(userId, { ttlS = 330 } = {}) {
  const { rows } = await query(
    `INSERT INTO reply_locks (user_id, holder, until) VALUES ($1, $2, now() + make_interval(secs => $3))
     ON CONFLICT (user_id) DO UPDATE SET holder = EXCLUDED.holder, until = EXCLUDED.until WHERE reply_locks.until < now()
     RETURNING holder`,
    [userId, crypto.randomUUID(), ttlS]
  );
  return rows[0]?.holder ?? null;
}

export async function releaseReplyLock(userId, holder) {
  try {
    await query("UPDATE reply_locks SET until = now() - interval '1 second' WHERE user_id = $1 AND holder = $2", [userId, holder]);
  } catch (e) {
    console.warn(`Reply lock not released (${e.message}); it expires on its own`);
  }
}
