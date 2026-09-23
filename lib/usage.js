import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Every model call this project makes — DeepSeek (tutor replies, the Jev backup, image reading, the
// KB pipeline, simulated students) and Jev through OpenRouter — is recorded here with its tokens and
// cost, so a run's spend is a query instead of a guess. recordUsage() never throws and never delays
// the caller: a lost usage row must not cost a student their reply.
//
// Where rows go: the app's Postgres table model_usage when the process runs on Postgres (production),
// otherwise (local server, eval scripts, the KB pipeline in CI) one JSON line per call in
// data/usage/usage-YYYY-MM.jsonl, which git ignores. scripts/usage-report.mjs reads both.

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// USAGE_LOG_DIR lets tests keep their fake calls out of the real log.
const usageDir = () => process.env.USAGE_LOG_DIR || path.join(APP_DIR, 'data', 'usage');

/**
 * DeepSeek's published prices, USD per million tokens, at OFF-PEAK rates.
 * Source: https://api-docs.deepseek.com/quick_start/pricing (checked 2026-09-23). Peak rates are
 * double. Peak hours: 01:00–04:00 and 06:00–10:00 UTC, Monday to Friday. The KB pipeline's spend
 * guard uses this same table. These are estimates from token counts, not invoices: the DeepSeek
 * balance is the truth.
 */
export const DEEPSEEK_PRICES = {
  'deepseek-flash': { inMiss: 0.15, inHit: 0.003, out: 0.6 },
  'deepseek-v4-pro': { inMiss: 0.66, inHit: 0.022, out: 1.98 },
};
export const PEAK_MULTIPLIER = 2;
const PEAK_WINDOWS_UTC = [
  [1, 4],
  [6, 10],
];

export function isDeepSeekPeak(at = new Date()) {
  const day = at.getUTCDay();
  if (day === 0 || day === 6) return false;
  const h = at.getUTCHours();
  return PEAK_WINDOWS_UTC.some(([from, to]) => h >= from && h < to);
}

// Unknown models are priced at the most expensive published rate, so a total never undercounts.
export function deepseekCost({ model, promptTokens = 0, cachedTokens = 0, completionTokens = 0 }, { peak = false } = {}) {
  const p = DEEPSEEK_PRICES[model] || DEEPSEEK_PRICES['deepseek-v4-pro'];
  const miss = Math.max(0, promptTokens - cachedTokens);
  return ((miss * p.inMiss + cachedTokens * p.inHit + completionTokens * p.out) / 1e6) * (peak ? PEAK_MULTIPLIER : 1);
}

// DeepSeek's usage object → our token fields (it reports cache hits two ways, depending on version).
export function deepseekTokens(usage) {
  if (!usage || typeof usage !== 'object') return null;
  const promptTokens = Number(usage.prompt_tokens) || 0;
  const cachedTokens = Number(usage.prompt_cache_hit_tokens ?? usage.prompt_tokens_details?.cached_tokens) || 0;
  return {
    promptTokens,
    cachedTokens,
    completionTokens: Number(usage.completion_tokens) || 0,
    reasoningTokens: Number(usage.completion_tokens_details?.reasoning_tokens) || 0,
  };
}

// One DeepSeek call → a usage row with the cost for the time it was made.
export function deepseekUsageRow({ model, usage, purpose, conversationId = null, userId = null, latencyMs = null, ok = true, error = null, meta = null, at = new Date() }) {
  const t = deepseekTokens(usage);
  return {
    at,
    provider: 'deepseek',
    model,
    purpose,
    conversationId,
    userId,
    ...(t || {}),
    costUsd: t ? deepseekCost({ model, ...t }, { peak: isDeepSeekPeak(at) }) : null,
    costSource: t ? 'computed' : null,
    latencyMs,
    ok,
    error,
    meta,
  };
}

// One Jev (OpenRouter) call → a usage row. OpenRouter reports the charge itself (usage.cost).
export function jevUsageRow({ result, purpose, conversationId = null, userId = null, ok = true, error = null, latencyMs = null, model = null }) {
  const u = result?.usage || {};
  return {
    at: new Date(),
    provider: 'openrouter',
    model: result?.model || model,
    purpose,
    conversationId,
    userId,
    promptTokens: Number(u.prompt_tokens) || null,
    cachedTokens: Number(u.prompt_tokens_details?.cached_tokens) || null,
    completionTokens: Number(u.completion_tokens) || null,
    reasoningTokens: null,
    costUsd: typeof result?.costUsd === 'number' ? result.costUsd : null,
    costSource: typeof result?.costUsd === 'number' ? 'provider' : null,
    latencyMs: result?.latencyMs ?? latencyMs,
    ok,
    error,
    meta: null,
  };
}

const COLS = ['at', 'provider', 'model', 'purpose', 'conversation_id', 'user_id', 'prompt_tokens', 'cached_tokens', 'completion_tokens', 'reasoning_tokens', 'cost_usd', 'cost_source', 'latency_ms', 'ok', 'error', 'meta'];

function toRecord(r) {
  const n = (x) => (Number.isFinite(Number(x)) && x !== null ? Number(x) : null);
  return {
    at: (r.at instanceof Date ? r.at : new Date()).toISOString(),
    provider: String(r.provider || 'unknown'),
    model: r.model ? String(r.model) : null,
    purpose: String(r.purpose || 'unknown'),
    conversation_id: typeof r.conversationId === 'string' && /^[0-9a-f-]{36}$/i.test(r.conversationId) ? r.conversationId : null,
    user_id: r.userId ? String(r.userId) : null,
    prompt_tokens: n(r.promptTokens),
    cached_tokens: n(r.cachedTokens),
    completion_tokens: n(r.completionTokens),
    reasoning_tokens: n(r.reasoningTokens),
    cost_usd: n(r.costUsd),
    cost_source: r.costSource || null,
    latency_ms: n(r.latencyMs),
    ok: r.ok !== false,
    error: r.error ? String(r.error).slice(0, 500) : null,
    meta: r.meta && typeof r.meta === 'object' ? r.meta : null,
  };
}

function appendToFile(rec) {
  fs.mkdirSync(usageDir(), { recursive: true });
  fs.appendFileSync(path.join(usageDir(), `usage-${rec.at.slice(0, 7)}.jsonl`), JSON.stringify(rec) + '\n');
}

export async function recordUsage(row) {
  let rec;
  try {
    rec = toRecord(row);
    const db = await import('./db.js');
    if (db.dbKind() !== 'postgres') return appendToFile(rec);
    await db.query(
      `INSERT INTO model_usage (${COLS.join(', ')}) VALUES (${COLS.map((c, i) => (c === 'meta' ? `$${i + 1}::jsonb` : `$${i + 1}`)).join(', ')})`,
      COLS.map((c) => (c === 'meta' ? (rec.meta ? JSON.stringify(rec.meta) : null) : rec[c]))
    );
  } catch (e) {
    console.warn(`Usage not recorded (${e.message}); writing it to a file instead`);
    try {
      if (rec) appendToFile(rec);
    } catch {}
  }
}
