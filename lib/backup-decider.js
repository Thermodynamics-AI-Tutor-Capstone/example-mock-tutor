import { loadConnections } from './agent.js';
import { validateQuestions } from './jev.js';

// The backup for Jev. Production may not always be able to use Jev (TypeSafe via OpenRouter), and
// everything Jev decides — the per-turn read that sets the help ceiling, the misconception read, the
// reply audit — still has to happen. So when Jev is switched off or unreachable, the same typed
// questions go to a small DeepSeek model through DeepSeek's own API (never OpenRouter), and the
// answers come back in Jev's shape so nothing downstream changes. Keyword rules are the last resort
// only if this fails too.

const RETRYABLE = new Set([408, 409, 429, 500, 502, 503, 504]);

export function backupConfig(connections = loadConnections()) {
  const c = connections.backupDecider || {};
  const baseUrl = typeof c.baseUrl === 'string' && /^https?:\/\//i.test(c.baseUrl.trim()) ? c.baseUrl.trim().replace(/\/+$/, '') : 'https://api.deepseek.com';
  const apiKeyEnvVar = typeof c.apiKeyEnvVar === 'string' && /^[A-Z][A-Z0-9_]*_API_KEY$/.test(c.apiKeyEnvVar.trim()) ? c.apiKeyEnvVar.trim() : 'DEEPSEEK_API_KEY';
  const timeoutMs = Number.isFinite(Number(c.timeoutMs)) && Number(c.timeoutMs) >= 500 ? Number(c.timeoutMs) : 12000;
  return {
    provider: typeof c.provider === 'string' && c.provider.trim() ? c.provider.trim() : 'DeepSeek (backup for Jev)',
    baseUrl,
    model: typeof c.model === 'string' && c.model.trim() ? c.model.trim() : 'deepseek-flash',
    apiKeyEnvVar,
    timeoutMs,
    enabled: c.enabled !== false,
  };
}

export function backupProblem(config = backupConfig()) {
  if (!config.enabled) return 'the backup decider is disabled in connections.json';
  if (!(process.env[config.apiKeyEnvVar] || '').trim()) return `${config.apiKeyEnvVar} is not set`;
  return null;
}

const SYSTEM = [
  'You classify one message from a student to a thermodynamics tutor (or one tutor reply, when the questions say so). You are given the conversation state and a set of typed questions.',
  "Answer every question from the evidence in the state, following each question's instructions exactly. Reply with one JSON object and nothing else, with one key per question name:",
  '- "choice" questions: {"probabilities": {"<option>": <0-1>, ...}} covering every option, summing to 1.',
  '- "noul" questions: {"p": <0-1>}, the probability that the statement is true.',
  '- "score" questions: {"level": <number>}, where 0 is the first criterion and the last criterion is the highest; fractions allowed.',
].join('\n');

function describe(questions) {
  const out = {};
  for (const [name, q] of Object.entries(questions)) {
    out[name] = { type: q.type, instructions: q.instructions };
    if (q.type === 'choice') out[name].options = q.criteria;
    else if (q.criteria) out[name].criteria = q.criteria;
  }
  return out;
}

const clamp01 = (x) => (typeof x === 'number' && Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : null);

// The model's JSON → Jev's answer shape. Anything missing or malformed is left out, exactly as a
// question Jev didn't answer would be.
export function toJevAnswers(raw, questions) {
  const answers = {};
  for (const [name, q] of Object.entries(questions)) {
    const a = raw?.[name];
    if (!a || typeof a !== 'object') continue;
    if (q.type === 'choice') {
      const options = Object.keys(q.criteria);
      const probs = {};
      let total = 0;
      for (const o of options) {
        probs[o] = clamp01(Number(a.probabilities?.[o])) ?? 0;
        total += probs[o];
      }
      if (!(total > 0)) continue;
      let best = options[0];
      for (const o of options) {
        probs[o] /= total;
        if (probs[o] > probs[best]) best = o;
      }
      answers[name] = { type: 'choice', choice: best, confidence: probs[best], probabilities: probs };
    } else if (q.type === 'noul') {
      const p = clamp01(Number(a.p ?? a.noul));
      if (p !== null) answers[name] = { type: 'noul', noul: p };
    } else if (q.type === 'score') {
      const level = Number(a.level ?? a.score);
      if (Number.isFinite(level)) answers[name] = { type: 'score', score: Math.min(q.criteria.length - 1, Math.max(0, level)), confidence: null };
    }
  }
  return answers;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Same contract as jev.js systemOne: { answers, model, usage, costUsd, latencyMs }; throws on failure.
export async function backupSystemOne({ state, questions, signal, config = backupConfig(), retries = 1 }) {
  validateQuestions(questions);
  const key = (process.env[config.apiKeyEnvVar] || '').trim();
  if (!key) throw new Error(`${config.apiKeyEnvVar} is not set`);
  const body = JSON.stringify({
    model: config.model,
    temperature: 0,
    // A snap judgment, not a problem to solve: without thinking, deepseek-flash answers in about 1-3 s
    // instead of 7-10 s. max_tokens leaves room for every question's answer (~30 with the cards).
    thinking: { type: 'disabled' },
    max_tokens: 3000,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: JSON.stringify({ state, questions: describe(questions) }) },
    ],
  });
  const started = Date.now();
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt) await sleep(250 * attempt);
    const timeout = AbortSignal.timeout(config.timeoutMs);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
    let res;
    try {
      res = await fetch(`${config.baseUrl}/chat/completions`, {
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
      lastError = new Error(`${config.provider} returned ${res.status}: ${text.slice(0, 300)}`);
      if (RETRYABLE.has(res.status)) continue;
      throw lastError;
    }
    let parsed;
    let raw;
    try {
      parsed = JSON.parse(text);
      raw = JSON.parse(String(parsed.choices?.[0]?.message?.content || '').replace(/^```(?:json)?\s*|\s*```$/g, ''));
    } catch {
      lastError = new Error(`${config.provider} returned a reply that is not JSON`);
      continue;
    }
    return { answers: toJevAnswers(raw, questions), model: parsed.model || config.model, usage: parsed.usage || null, costUsd: null, latencyMs: Date.now() - started };
  }
  throw lastError || new Error(`${config.provider} request failed`);
}
