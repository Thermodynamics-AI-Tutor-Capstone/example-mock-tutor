// The one DeepSeek client the KB ingest pipeline is allowed to use.
//
// Every LLM call in scripts/kb/ goes through here so that retry/backoff, token
// accounting and the hard spend guard are impossible to bypass by accident.
//
// Nothing in the Vercel build path imports this file. DeepSeek is only ever
// called from a developer machine or the GitHub Action.

import { setTimeout as sleep } from 'node:timers/promises';
import {
  estimateTokens,
  fmtInt,
  fmtUsd,
  loadDotenv,
  parseFrontmatter,
  relLabel,
  sha256,
} from './ingest-common.mjs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const PROMPTS_DIR = path.join(HERE, 'prompts');

export const DEFAULT_BASE_URL = 'https://api.deepseek.com';
export const DEFAULT_MAX_SPEND_USD = 2.0;

/**
 * DeepSeek's published prices, USD per million tokens.
 * Source: https://api-docs.deepseek.com/quick_start/pricing
 *
 * Peak rates are double off-peak. We do not know which window a CI run lands in,
 * so the spend guard always budgets at PEAK CACHE-MISS rates (the worst case) and
 * the closing report prints what the run actually cost at both rates.
 *
 * If DeepSeek changes prices this table is the single place to fix, and the
 * numbers it produces are estimates, not invoices — always check the real balance.
 */
export const PRICES = {
  'deepseek-flash': { inMiss: 0.15, inHit: 0.003, out: 0.6 },
  'deepseek-v4-pro': { inMiss: 0.66, inHit: 0.022, out: 1.98 },
};
export const PEAK_MULTIPLIER = 2;

export class SpendLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SpendLimitError';
  }
}

export class DeepSeekError extends Error {
  constructor(message, { status = null, retriable = false } = {}) {
    super(message);
    this.name = 'DeepSeekError';
    this.status = status;
    this.retriable = retriable;
  }
}

function priceFor(model) {
  const p = PRICES[model];
  if (p) return p;
  // Unknown model: charge it at the most expensive published rate so the guard
  // errs towards aborting rather than overrunning.
  return PRICES['deepseek-v4-pro'];
}

/** Cost of one call in USD. `peak` doubles the published off-peak rates. */
export function costOf({ model, promptTokens = 0, cachedTokens = 0, completionTokens = 0 }, { peak = false } = {}) {
  const p = priceFor(model);
  const mult = peak ? PEAK_MULTIPLIER : 1;
  const miss = Math.max(0, promptTokens - cachedTokens);
  return ((miss * p.inMiss + cachedTokens * p.inHit + completionTokens * p.out) / 1e6) * mult;
}

/* --------------------------------------------------------------- prompts -- */

const promptCache = new Map();

/**
 * Load scripts/kb/prompts/<name>.md.
 *
 * Frontmatter contract:
 *   prompt_version: v1        required — bump to force regeneration
 *   model: deepseek-flash     default model for this prompt
 *   max_tokens: 900           output cap, used by the spend guard
 *   temperature: 0            optional
 *
 * Body contract: an optional `## SYSTEM` section, then `## USER`. If neither
 * heading is present the whole body is the user template.
 */
export async function loadPrompt(name, { dir = PROMPTS_DIR } = {}) {
  if (promptCache.has(name)) return promptCache.get(name);
  const file = path.join(dir, `${name}.md`);
  let text;
  try {
    text = await fsp.readFile(file, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') throw new Error(`No prompt at ${relLabel(file)}`);
    throw e;
  }
  const { frontmatter, body } = parseFrontmatter(text);
  const version = String(frontmatter.prompt_version || '').trim();
  if (!version) throw new Error(`${relLabel(file)} has no prompt_version in its frontmatter`);

  let system = '';
  let user = body.trim();
  const sysMatch = body.match(/^##\s*SYSTEM\s*\n([\s\S]*?)(?=^##\s*USER\s*$|\Z)/m);
  const userMatch = body.match(/^##\s*USER\s*\n([\s\S]*)$/m);
  if (sysMatch) system = sysMatch[1].trim();
  if (userMatch) user = userMatch[1].trim();

  const prompt = {
    name,
    file,
    version,
    model: frontmatter.model ? String(frontmatter.model) : null,
    maxTokens: Number.isFinite(Number(frontmatter.max_tokens)) ? Number(frontmatter.max_tokens) : 1024,
    temperature: frontmatter.temperature === undefined || frontmatter.temperature === null ? null : Number(frontmatter.temperature),
    system,
    user,
    // The hash is informational: prompt_version is what plan.mjs compares, so an
    // edit without a version bump shows up as a hash change in the report.
    hash: sha256(text).slice(0, 12),
  };
  promptCache.set(name, prompt);
  return prompt;
}

export function renderTemplate(template, vars) {
  return String(template).replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, (m, key) => {
    if (!(key in vars)) throw new Error(`prompt template referenced {{${key}}} but no value was supplied`);
    const v = vars[key];
    return v === null || v === undefined ? '' : String(v);
  });
}

/** `situate=v1;classify=v1` — what plan.mjs stores as prompt_version in .kbstate.json. */
export async function promptVersionString(names, opts) {
  const parts = [];
  for (const name of names) {
    const p = await loadPrompt(name, opts);
    parts.push(`${name}=${p.version}`);
  }
  return parts.join(';');
}

/* ---------------------------------------------------------------- client -- */

function nowIso() {
  return new Date().toISOString();
}

export function createClient(options = {}) {
  const {
    dryRun = false,
    maxSpend = DEFAULT_MAX_SPEND_USD,
    baseUrl = (process.env.DEEPSEEK_BASE_URL || '').trim() || DEFAULT_BASE_URL,
    apiKeyEnvVar = 'DEEPSEEK_API_KEY',
    maxRetries = 4,
    timeoutMs = 120_000,
    verbose = false,
    label = 'kb',
  } = options;

  if (!dryRun) loadDotenv();
  const apiKey = dryRun ? null : (process.env[apiKeyEnvVar] || '').trim();
  if (!dryRun && !apiKey) {
    throw new Error(
      `${apiKeyEnvVar} is not set. Put it in .env (it is gitignored) or export it. ` +
        `Run with --dry-run to exercise the pipeline without a key and without spending anything.`
    );
  }

  const usage = {
    dryRun,
    startedAt: nowIso(),
    calls: 0,
    retries: 0,
    failures: 0,
    promptTokens: 0,
    cachedTokens: 0,
    completionTokens: 0,
    estimatedTokens: 0, // dry-run only
    costOffPeak: 0,
    costPeak: 0,
    byStage: new Map(),
  };

  const bump = (stage, model, patch) => {
    const key = `${stage}:${model}`;
    const row = usage.byStage.get(key) || {
      stage,
      model,
      calls: 0,
      retries: 0,
      promptTokens: 0,
      cachedTokens: 0,
      completionTokens: 0,
      estimatedTokens: 0,
      costOffPeak: 0,
      costPeak: 0,
    };
    for (const [k, v] of Object.entries(patch)) row[k] = (row[k] || 0) + v;
    usage.byStage.set(key, row);
  };

  /** Worst-case cost of a call we have not made yet: peak rates, no cache hits, full output cap. */
  function worstCase({ model, system, user, maxTokens }) {
    const promptTokens = estimateTokens(`${system}\n${user}`, { conservative: true }) + 32;
    return {
      promptTokens,
      cost: costOf({ model, promptTokens, cachedTokens: 0, completionTokens: maxTokens }, { peak: true }),
    };
  }

  function assertBudget(stage, projection) {
    if (maxSpend === Infinity) return;
    const projected = usage.costPeak + projection.cost;
    if (projected > maxSpend) {
      throw new SpendLimitError(
        `--max-spend guard tripped in stage "${stage}": this call would take the run to about ` +
          `${fmtUsd(projected)} at peak cache-miss rates, over the ${fmtUsd(maxSpend)} cap. ` +
          `Nothing was sent. Spent so far: ${fmtUsd(usage.costPeak)} (peak) / ${fmtUsd(usage.costOffPeak)} (off-peak) ` +
          `over ${usage.calls} call(s). Raise --max-spend deliberately, or narrow the run with --limit.`
      );
    }
  }

  async function post(body, signal) {
    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
    if (res.ok) return res.json();
    const text = await res.text().catch(() => '');
    let detail = text.slice(0, 400);
    try {
      const msg = JSON.parse(text)?.error?.message;
      if (typeof msg === 'string' && msg) detail = msg.slice(0, 400);
    } catch {}
    const retriable = res.status === 429 || res.status >= 500;
    let hint = '';
    if (res.status === 401) hint = ' (the DeepSeek API key was rejected)';
    if (res.status === 402) hint = ' (the DeepSeek account needs a top-up at platform.deepseek.com)';
    throw new DeepSeekError(`DeepSeek returned ${res.status}: ${detail}${hint}`, { status: res.status, retriable });
  }

  /**
   * One JSON-mode completion.
   *
   * DeepSeek's JSON mode is not schema-guaranteed, so this returns the parsed
   * value and leaves validation to the caller — every stage enum-checks its own
   * fields before anything is written.
   *
   * @returns {Promise<{ data: any, raw: string, usage: object, dryRun: boolean }>}
   */
  async function complete({
    stage = 'unknown',
    prompt,
    vars = {},
    model = null,
    maxTokens = null,
    temperature = undefined,
    json = true,
    dryRunValue = null,
    signal = null,
  }) {
    const chosenModel = model || prompt.model || 'deepseek-flash';
    const cap = maxTokens || prompt.maxTokens;
    const system = prompt.system ? renderTemplate(prompt.system, vars) : '';
    const user = renderTemplate(prompt.user, vars);
    const projection = worstCase({ model: chosenModel, system, user, maxTokens: cap });

    assertBudget(stage, projection);

    if (dryRun) {
      usage.calls++;
      usage.estimatedTokens += projection.promptTokens;
      // A dry run costs nothing, but it still accrues against the guard's peak
      // counter so `--dry-run --max-spend` tells you whether the real run fits.
      usage.costPeak += projection.cost;
      usage.costOffPeak += costOf(
        { model: chosenModel, promptTokens: projection.promptTokens, completionTokens: cap },
        { peak: false }
      );
      bump(stage, chosenModel, {
        calls: 1,
        estimatedTokens: projection.promptTokens,
        costPeak: projection.cost,
        costOffPeak: costOf({ model: chosenModel, promptTokens: projection.promptTokens, completionTokens: cap }, { peak: false }),
      });
      if (verbose) console.log(`[${label}/${stage}] dry-run call (${fmtInt(projection.promptTokens)} est. input tokens)`);
      return { data: typeof dryRunValue === 'function' ? dryRunValue(vars) : dryRunValue, raw: '', usage: null, dryRun: true };
    }

    const body = {
      model: chosenModel,
      messages: [...(system ? [{ role: 'system', content: system }] : []), { role: 'user', content: user }],
      max_tokens: cap,
      stream: false,
    };
    if (json) body.response_format = { type: 'json_object' };
    const temp = temperature === undefined ? prompt.temperature : temperature;
    if (temp !== null && temp !== undefined && Number.isFinite(temp)) body.temperature = temp;

    let lastError = null;
    // A reply truncated at max_tokens is not a transient fault: repeating the same
    // request truncates it again. Grow the cap once instead, then give up.
    let grownOnce = false;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        const backoff = Math.min(30_000, 800 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 400);
        if (verbose) console.log(`[${label}/${stage}] retry ${attempt}/${maxRetries} in ${backoff}ms — ${lastError?.message ?? ''}`);
        usage.retries++;
        bump(stage, chosenModel, { retries: 1 });
        await sleep(backoff);
      }
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(new Error(`timed out after ${timeoutMs}ms`)), timeoutMs);
      const composite = signal ? AbortSignal.any([signal, ac.signal]) : ac.signal;
      try {
        const payload = await post(body, composite);
        const u = payload?.usage || {};
        const promptTokens = Number(u.prompt_tokens) || 0;
        const cachedTokens = Number(u.prompt_cache_hit_tokens ?? u.prompt_tokens_details?.cached_tokens ?? 0) || 0;
        const completionTokens = Number(u.completion_tokens) || 0;
        const offPeak = costOf({ model: chosenModel, promptTokens, cachedTokens, completionTokens }, { peak: false });
        const peak = costOf({ model: chosenModel, promptTokens, cachedTokens, completionTokens }, { peak: true });

        usage.calls++;
        usage.promptTokens += promptTokens;
        usage.cachedTokens += cachedTokens;
        usage.completionTokens += completionTokens;
        usage.costOffPeak += offPeak;
        usage.costPeak += peak;
        bump(stage, chosenModel, { calls: 1, promptTokens, cachedTokens, completionTokens, costOffPeak: offPeak, costPeak: peak });

        const raw = payload?.choices?.[0]?.message?.content ?? '';
        const finish = payload?.choices?.[0]?.finish_reason;
        if (finish === 'length') {
          if (!grownOnce) {
            grownOnce = true;
            body.max_tokens = Math.min(cap * 2, 16384);
            throw new DeepSeekError(`the reply hit max_tokens (${cap}); retrying once at ${body.max_tokens}`, { retriable: true });
          }
          throw new DeepSeekError(`the reply hit max_tokens (${body.max_tokens}) and is still truncated`, { retriable: false });
        }
        let data = null;
        if (json) {
          try {
            data = parseJsonLoose(raw);
          } catch (e) {
            throw new DeepSeekError(`could not parse the JSON reply: ${e.message}`, { retriable: true });
          }
        }
        return { data, raw, usage: { promptTokens, cachedTokens, completionTokens, costOffPeak: offPeak, costPeak: peak }, dryRun: false };
      } catch (e) {
        lastError = e;
        const retriable = e instanceof DeepSeekError ? e.retriable : e.name === 'AbortError' || e.name === 'TypeError';
        if (!retriable || attempt === maxRetries) {
          usage.failures++;
          throw e;
        }
      } finally {
        clearTimeout(timer);
      }
    }
    usage.failures++;
    throw lastError ?? new DeepSeekError('exhausted retries');
  }

  function summary() {
    const rows = [...usage.byStage.values()].sort((a, b) => b.costPeak - a.costPeak);
    return {
      dryRun,
      startedAt: usage.startedAt,
      finishedAt: nowIso(),
      calls: usage.calls,
      retries: usage.retries,
      failures: usage.failures,
      promptTokens: usage.promptTokens,
      cachedTokens: usage.cachedTokens,
      completionTokens: usage.completionTokens,
      estimatedTokens: usage.estimatedTokens,
      costOffPeakUsd: round6(usage.costOffPeak),
      costPeakUsd: round6(usage.costPeak),
      maxSpendUsd: maxSpend === Infinity ? null : maxSpend,
      byStage: rows.map((r) => ({
        stage: r.stage,
        model: r.model,
        calls: r.calls,
        retries: r.retries,
        promptTokens: r.promptTokens,
        cachedTokens: r.cachedTokens,
        completionTokens: r.completionTokens,
        estimatedTokens: r.estimatedTokens,
        costOffPeakUsd: round6(r.costOffPeak),
        costPeakUsd: round6(r.costPeak),
      })),
      priceSource: 'https://api-docs.deepseek.com/quick_start/pricing',
    };
  }

  function printSummary(title = 'DeepSeek usage') {
    const s = summary();
    const lines = [];
    lines.push('');
    lines.push(`── ${title} ${'─'.repeat(Math.max(0, 52 - title.length))}`);
    if (s.dryRun) {
      lines.push(`  DRY RUN — no request was sent, nothing was spent.`);
      lines.push(`  ${fmtInt(s.calls)} call(s) would have been made, ~${fmtInt(s.estimatedTokens)} input tokens (conservative chars/3.0 estimate).`);
      lines.push(`  Projected worst case: ${fmtUsd(s.costPeakUsd)} peak / ${fmtUsd(s.costOffPeakUsd)} off-peak, assuming every reply fills max_tokens.`);
    } else {
      for (const r of s.byStage) {
        lines.push(
          `  ${r.stage.padEnd(10)} ${r.model.padEnd(16)} ${String(r.calls).padStart(4)} calls  ` +
            `in ${fmtInt(r.promptTokens).padStart(9)} (cached ${fmtInt(r.cachedTokens)})  out ${fmtInt(r.completionTokens).padStart(7)}  ` +
            `${fmtUsd(r.costOffPeakUsd)} off-peak / ${fmtUsd(r.costPeakUsd)} peak`
        );
      }
      lines.push(
        `  TOTAL      ${''.padEnd(16)} ${String(s.calls).padStart(4)} calls  ` +
          `in ${fmtInt(s.promptTokens).padStart(9)} (cached ${fmtInt(s.cachedTokens)})  out ${fmtInt(s.completionTokens).padStart(7)}`
      );
      lines.push(`  COST       ${fmtUsd(s.costOffPeakUsd)} off-peak / ${fmtUsd(s.costPeakUsd)} peak  (${s.retries} retries, ${s.failures} failures)`);
      lines.push(`  Estimated from published prices, not an invoice: ${s.priceSource}`);
    }
    if (s.maxSpendUsd !== null) lines.push(`  Guard: --max-spend ${fmtUsd(s.maxSpendUsd)} (budgeted at peak cache-miss rates)`);
    lines.push('');
    console.log(lines.join('\n'));
    return s;
  }

  return { complete, summary, printSummary, usage, dryRun, maxSpend, baseUrl };
}

function round6(n) {
  return Math.round((Number(n) || 0) * 1e6) / 1e6;
}

/**
 * DeepSeek in JSON mode usually returns clean JSON, but it sometimes wraps it in
 * a ```json fence or prefixes a sentence. Recover from both before giving up.
 */
export function parseJsonLoose(text) {
  const s = String(text ?? '').trim();
  if (!s) throw new Error('empty reply');
  try {
    return JSON.parse(s);
  } catch {}
  const fence = s.match(/```(?:json)?\s*\n([\s\S]*?)```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1].trim());
    } catch {}
  }
  const first = s.search(/[[{]/);
  const last = Math.max(s.lastIndexOf(']'), s.lastIndexOf('}'));
  if (first !== -1 && last > first) {
    try {
      return JSON.parse(s.slice(first, last + 1));
    } catch {}
  }
  throw new Error(`not JSON (starts with ${JSON.stringify(s.slice(0, 60))})`);
}

/* --------------------------------------------------------------- helpers -- */

export function parseMaxSpend(value) {
  if (value === undefined || value === null) return DEFAULT_MAX_SPEND_USD;
  if (value === 'none' || value === Infinity) return Infinity;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw new Error(`--max-spend must be a non-negative number of US dollars (got ${value})`);
  return n;
}
