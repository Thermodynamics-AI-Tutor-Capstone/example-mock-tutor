import { loadConnections } from './agent.js';
import { recordUsage, jevUsageRow } from './usage.js';

// Jev is TypeSafe's "System One" model: it takes a state plus typed questions (choice / score /
// noul) and returns calibrated probabilities, never text. Kelvin uses it for the fast judgments
// that must not be left to the tutoring model a student can argue with: what the student is
// doing, which misconceptions their words show, whether they have made a real attempt, which
// teaching style fits. Wire format: POST {baseUrl}/v1/systemone (the TypeSafe SDK's own
// contract; OpenRouter serves the same endpoint under https://openrouter.ai/api).

const MAX_OPTIONS = 255;
const RETRYABLE = new Set([408, 409, 429, 500, 502, 503, 504]);

export function deciderConfig(connections = loadConnections()) {
  const c = connections.decider || {};
  const baseUrl = typeof c.baseUrl === 'string' && /^https?:\/\//i.test(c.baseUrl.trim()) ? c.baseUrl.trim().replace(/\/+$/, '') : 'https://openrouter.ai/api';
  const apiKeyEnvVar = typeof c.apiKeyEnvVar === 'string' && /^[A-Z][A-Z0-9_]*_API_KEY$/.test(c.apiKeyEnvVar.trim()) ? c.apiKeyEnvVar.trim() : 'OPENROUTER_API_KEY';
  const timeoutMs = Number.isFinite(Number(c.timeoutMs)) && Number(c.timeoutMs) >= 500 ? Number(c.timeoutMs) : 6000;
  return {
    provider: typeof c.provider === 'string' && c.provider.trim() ? c.provider.trim() : 'Jev',
    baseUrl,
    model: typeof c.model === 'string' && c.model.trim() ? c.model.trim() : 'jev-1.13',
    apiKeyEnvVar,
    timeoutMs,
    enabled: c.enabled !== false,
  };
}

// Why Jev cannot be used right now, or null.
export function deciderProblem(config = deciderConfig()) {
  if (!config.enabled) return 'the decider is disabled in connections.json';
  if (!(process.env[config.apiKeyEnvVar] || '').trim()) return `${config.apiKeyEnvVar} is not set`;
  return null;
}

export function validateQuestions(questions) {
  const names = Object.keys(questions || {});
  if (!names.length) throw new Error('at least one question is required');
  for (const name of names) {
    const q = questions[name];
    if (q.type === 'choice') {
      if (!q.criteria || typeof q.criteria !== 'object' || Array.isArray(q.criteria)) throw new Error(`choice "${name}" needs a map of options`);
      const n = Object.keys(q.criteria).length;
      if (n < 2 || n > MAX_OPTIONS) throw new Error(`choice "${name}" has ${n} options (2-${MAX_OPTIONS})`);
    } else if (q.type === 'score') {
      if (!Array.isArray(q.criteria) || q.criteria.length < 2) throw new Error(`score "${name}" needs at least two levels`);
    } else if (q.type !== 'noul') {
      throw new Error(`question "${name}" has unknown type "${q.type}"`);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// One System One call. Returns { answers, model, usage, costUsd, latencyMs }; throws on failure so
// the caller can degrade to "no read this turn".
// usage: { purpose, conversationId, userId } for the usage log (lib/usage.js); every call is recorded,
// failures included.
export async function systemOne({ state, questions, signal, config = deciderConfig(), retries = 1, usage = {} }) {
  try {
    const result = await systemOneCall({ state, questions, signal, config, retries });
    await recordUsage(jevUsageRow({ result, purpose: usage.purpose || 'jev', conversationId: usage.conversationId, userId: usage.userId }));
    return result;
  } catch (e) {
    await recordUsage(jevUsageRow({ result: null, model: config.model, purpose: usage.purpose || 'jev', conversationId: usage.conversationId, userId: usage.userId, ok: false, error: e.message }));
    throw e;
  }
}

async function systemOneCall({ state, questions, signal, config, retries }) {
  validateQuestions(questions);
  const key = (process.env[config.apiKeyEnvVar] || '').trim();
  if (!key) throw new Error(`${config.apiKeyEnvVar} is not set`);
  const body = JSON.stringify({ model: config.model, state, questions });
  const started = Date.now();
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt) await sleep(250 * attempt);
    const timeout = AbortSignal.timeout(config.timeoutMs);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
    let res;
    try {
      res = await fetch(`${config.baseUrl}/v1/systemone`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body,
        signal: combined,
      });
    } catch (e) {
      if (signal?.aborted) throw e;
      lastError = new Error(`${config.provider} request failed: ${e.message}`);
      continue;
    }
    const text = await res.text().catch(() => '');
    if (!res.ok) {
      let detail = text.slice(0, 300);
      try {
        const msg = JSON.parse(text)?.error?.message;
        if (typeof msg === 'string' && msg) detail = msg.slice(0, 300);
      } catch {}
      lastError = new Error(`${config.provider} returned ${res.status}: ${detail}`);
      if (RETRYABLE.has(res.status)) continue;
      throw lastError;
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`${config.provider} returned a body that is not JSON`);
    }
    if (!parsed || typeof parsed.answers !== 'object') throw new Error(`${config.provider} response has no answers`);
    return {
      answers: parsed.answers,
      model: parsed.model || config.model,
      usage: parsed.usage || null,
      costUsd: typeof parsed.usage?.cost === 'number' ? parsed.usage.cost : typeof parsed.cost === 'number' ? parsed.cost : null,
      latencyMs: Date.now() - started,
    };
  }
  throw lastError || new Error(`${config.provider} request failed`);
}
