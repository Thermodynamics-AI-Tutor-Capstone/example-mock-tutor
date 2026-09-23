#!/usr/bin/env node
// What this project has spent on models, from the usage log (lib/usage.js): production's model_usage
// table plus the local data/usage/*.jsonl files, grouped by provider, model and purpose, and by day.
// Also prints what the providers themselves report right now: the DeepSeek balance and this
// OpenRouter key's usage. Logged costs are estimates from token counts (DeepSeek) or OpenRouter's own
// per-call charge (Jev); the provider numbers are the truth to reconcile against.
//
// Usage: node scripts/usage-report.mjs [--since 2026-09-23] [--until 2026-09-24] [--accounts 'test%@tutor.test']
//                                       [--snapshot "before sim run"] [--json]
//   --snapshot  also saves the provider numbers to data/usage/balances.jsonl, so a run can be
//               measured as the difference between two snapshots.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const USAGE_DIR = path.join(APP_DIR, 'data', 'usage');

// .env for keys; the production DATABASE_URL lives in the main checkout's .env.local (vercel env pull).
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv(path.join(APP_DIR, '.env'));
loadEnv(path.join(APP_DIR, '.env.local'));
try {
  const main = execFileSync('git', ['worktree', 'list', '--porcelain'], { cwd: APP_DIR, encoding: 'utf8' }).match(/^worktree (.+)$/m)?.[1];
  if (main) loadEnv(path.join(main, '.env.local'));
} catch {}

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const since = arg('since') ? new Date(arg('since')) : new Date(0);
const until = arg('until') ? new Date(arg('until')) : new Date('9999-12-31T00:00:00Z');
const accounts = arg('accounts');
const asJson = args.includes('--json');

// ── rows ──────────────────────────────────────────────────────────────────────────────────────────
const rows = [];
let dbNote = 'no DATABASE_URL: production rows not included';
const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (dbUrl) {
  const c = new pg.Client({ connectionString: dbUrl });
  await c.connect();
  try {
    const params = [since.toISOString(), until.toISOString()];
    let where = 'm.at >= $1 AND m.at < $2';
    if (accounts) {
      params.push(accounts);
      where += ` AND m.user_id IN (SELECT id::text FROM neon_auth."user" WHERE email LIKE $3)`;
    }
    const { rows: r } = await c.query(`SELECT m.*, 'production' AS source FROM model_usage m WHERE ${where}`, params);
    rows.push(...r);
    dbNote = `${r.length} production rows`;
  } catch (e) {
    dbNote = `production rows unavailable: ${e.message}`;
  }
  await c.end();
}
let fileRows = 0;
if (fs.existsSync(USAGE_DIR) && !accounts) {
  for (const f of fs.readdirSync(USAGE_DIR).filter((f) => /^usage-.*\.jsonl$/.test(f))) {
    for (const line of fs.readFileSync(path.join(USAGE_DIR, f), 'utf8').split('\n').filter(Boolean)) {
      const r = JSON.parse(line);
      const at = new Date(r.at);
      if (at >= since && at < until) {
        rows.push({ ...r, source: 'local' });
        fileRows++;
      }
    }
  }
}

// ── provider numbers ──────────────────────────────────────────────────────────────────────────────
async function providerNumbers() {
  const out = { at: new Date().toISOString() };
  if (process.env.DEEPSEEK_API_KEY) {
    const r = await fetch('https://api.deepseek.com/user/balance', { headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` } }).then((x) => x.json()).catch(() => null);
    const usd = r?.balance_infos?.find((b) => b.currency === 'USD');
    out.deepseekBalanceUsd = usd ? Number(usd.total_balance) : null;
  }
  if (process.env.OPENROUTER_API_KEY) {
    const r = await fetch('https://openrouter.ai/api/v1/key', { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } }).then((x) => x.json()).catch(() => null);
    if (r?.data) out.openrouterKey = { usageUsd: r.data.usage, dailyUsd: r.data.usage_daily, weeklyUsd: r.data.usage_weekly, monthlyUsd: r.data.usage_monthly };
  }
  return out;
}
const live = await providerNumbers();
if (arg('snapshot')) {
  fs.mkdirSync(USAGE_DIR, { recursive: true });
  fs.appendFileSync(path.join(USAGE_DIR, 'balances.jsonl'), JSON.stringify({ label: arg('snapshot'), ...live }) + '\n');
}

// ── report ────────────────────────────────────────────────────────────────────────────────────────
const group = (keyOf) => {
  const m = new Map();
  for (const r of rows) {
    const k = keyOf(r);
    const g = m.get(k) || { calls: 0, failed: 0, promptTokens: 0, cachedTokens: 0, completionTokens: 0, costUsd: 0, uncosted: 0 };
    g.calls++;
    if (r.ok === false) g.failed++;
    g.promptTokens += Number(r.prompt_tokens) || 0;
    g.cachedTokens += Number(r.cached_tokens) || 0;
    g.completionTokens += Number(r.completion_tokens) || 0;
    if (r.cost_usd === null || r.cost_usd === undefined) g.uncosted++;
    else g.costUsd += Number(r.cost_usd);
    m.set(k, g);
  }
  return [...m.entries()].sort((a, b) => b[1].costUsd - a[1].costUsd);
};
const byPurpose = group((r) => `${r.provider} · ${r.model || '?'} · ${r.purpose}`);
const byDay = group((r) => `${String(r.at instanceof Date ? r.at.toISOString() : r.at).slice(0, 10)} · ${r.provider}`);
const total = rows.reduce((s, r) => s + (Number(r.cost_usd) || 0), 0);

if (asJson) {
  console.log(JSON.stringify({ since, until, accounts, total, byPurpose, byDay, live, dbNote, fileRows }, null, 2));
  process.exit(0);
}
const usd = (x) => `$${x.toFixed(4)}`;
const tok = (x) => (x >= 1e6 ? `${(x / 1e6).toFixed(2)}M` : x >= 1e3 ? `${(x / 1e3).toFixed(1)}k` : String(x));
console.log(`Model usage ${arg('since') || 'all time'} → ${arg('until') || 'now'}${accounts ? ` for accounts like ${accounts}` : ''}`);
console.log(`Sources: ${dbNote}; ${fileRows} local rows${accounts ? ' (local rows skipped when filtering by account)' : ''}\n`);
console.log('Calls  Failed  In (cached)       Out      Cost      Provider · model · purpose');
for (const [k, g] of byPurpose) {
  console.log(`${String(g.calls).padStart(5)}  ${String(g.failed).padStart(6)}  ${`${tok(g.promptTokens)} (${tok(g.cachedTokens)})`.padEnd(16)}  ${tok(g.completionTokens).padStart(6)}  ${usd(g.costUsd).padStart(9)}  ${k}${g.uncosted ? `  [${g.uncosted} without a cost]` : ''}`);
}
console.log(`\nLogged total: ${usd(total)}\n\nBy day:`);
for (const [k, g] of byDay.sort((a, b) => a[0].localeCompare(b[0]))) console.log(`  ${k}: ${usd(g.costUsd)} over ${g.calls} calls`);
console.log('\nWhat the providers report now:');
if ('deepseekBalanceUsd' in live) console.log(`  DeepSeek balance: $${live.deepseekBalanceUsd}`);
if (live.openrouterKey) console.log(`  OpenRouter (this key): $${live.openrouterKey.usageUsd.toFixed(4)} all time, $${live.openrouterKey.dailyUsd.toFixed(4)} today (UTC)`);
if (arg('snapshot')) console.log(`\nSaved snapshot "${arg('snapshot')}" to data/usage/balances.jsonl`);
