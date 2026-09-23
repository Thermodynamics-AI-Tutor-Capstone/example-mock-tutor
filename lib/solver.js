import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectionConfig, loadConnections } from './agent.js';
import { toolDefinitions, runTool } from './tools/index.js';
import { recordUsage, deepseekUsageRow } from './usage.js';
import { query } from './db.js';

// "Solve first" (eval/findings/2026-09-23-round2.md): when a student starts a new problem, the server
// solves it once, out of sight, with the verified tools only (property_lookup, calculate,
// check_constraints), and keeps the result for the rest of that problem. The tutor then checks the
// student's work, and its own numbers, against a solution that was computed rather than recalled.
// Evidence: separating verification from the tutoring reply improved feedback correctness
// (Verify-then-Generate, EMNLP 2024), and the Harvard physics tutor stayed accurate only once
// pre-written solutions went into its prompt (Kestin et al. 2025).
//
// The solution lives in its own table, so a tutoring-state write during the same turn can't drop it,
// and it is tied to the problem by time: it counts for the problem that started at or before it.

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROMPT_PATH = path.join(APP_DIR, 'agent', 'solver-prompt.md');
const SOLVER_TOOLS = new Set(['property_lookup', 'calculate', 'check_constraints']);
const MAX_ROUNDS = 10;
const ROUND_TIMEOUT_MS = 60_000;
const PROBLEM_INTENTS = new Set(['check_work', 'stuck_on_problem', 'wants_answer']);
const SECTION_MAX_CHARS = 3500;

export function solverConfig(connections = loadConnections()) {
  const s = connections.solver || {};
  return { ...connectionConfig(s.connection || null, connections), enabled: s.enabled !== false };
}

function readPrompt() {
  try {
    return fs.readFileSync(PROMPT_PATH, 'utf8').replace(/<!--[\s\S]*?-->/g, '').trim();
  } catch {
    return 'Solve the student problem with the tools and reply with JSON only.';
  }
}

// The latest solution for the problem in progress, or null. `since` is when that problem started.
export async function loadReference(conversationId, since = null) {
  if (!conversationId) return null;
  const { rows } = await query(
    `SELECT id, ok, solution, error, created_at FROM reference_solutions
      WHERE conversation_id = $1 AND ($2::timestamptz IS NULL OR created_at >= $2::timestamptz)
      ORDER BY created_at DESC LIMIT 1`,
    [conversationId, since]
  );
  const r = rows[0];
  if (!r) return null;
  return { ...r, solution: typeof r.solution === 'string' ? JSON.parse(r.solution) : r.solution };
}

// Worth solving: a problem-shaped message, a problem in progress, numbers to work with, and no attempt
// yet for this problem (a failed attempt isn't retried every turn).
export function shouldSolve({ prepared, history, existing }) {
  if (existing) return false;
  if (!solverConfig().enabled) return false;
  const intent = prepared?.turn?.intent;
  const state = prepared?.state || {};
  if (!PROBLEM_INTENTS.has(intent) && !(state.problemPending && intent !== 'concept')) return false;
  const text = (history || []).filter((m) => m.role === 'user').slice(-6).map((m) => m.content).join('\n');
  return (text.match(/\d+(\.\d+)?/g) || []).length >= 2;
}

function parseJson(text) {
  const s = String(text || '').replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('no JSON object in the reply');
  return JSON.parse(s.slice(start, end + 1));
}

async function chat({ config, apiKey, body, signal }) {
  const timeout = AbortSignal.timeout(ROUND_TIMEOUT_MS);
  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${config.provider} returned ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

// Solve the problem in `history`, save the result (or the failure) and return it.
export async function solveProblem({ history, attachmentsText = '', conversationId = null, userId = null, signal, config = solverConfig() } = {}) {
  const apiKey = (process.env[config.apiKeyEnvVar] || '').trim();
  const started = Date.now();
  let result = { ok: false, solution: null, error: null };
  try {
    if (!apiKey) throw new Error(`${config.apiKeyEnvVar} is not set`);
    const ctx = { conversationId, userId, toolLog: [] };
    const tools = toolDefinitions((name) => SOLVER_TOOLS.has(name), ctx);
    const studentText = (history || [])
      .filter((m) => m.role === 'user')
      .slice(-6)
      .map((m, i) => `Student message ${i + 1}:\n${String(m.content).slice(0, 3000)}`)
      .join('\n\n');
    const messages = [
      { role: 'system', content: readPrompt() },
      { role: 'user', content: `${studentText}${attachmentsText ? `\n\nWork the student uploaded:\n${attachmentsText.slice(0, 4000)}` : ''}` },
    ];
    for (let round = 1; round <= MAX_ROUNDS; round++) {
      const last = round === MAX_ROUNDS;
      const body = { model: config.model, messages, ...(last ? {} : { tools }) };
      const roundStarted = Date.now();
      const data = await chat({ config, apiKey, body, signal });
      await recordUsage(deepseekUsageRow({ model: config.model, usage: data.usage, purpose: 'solver', conversationId, userId, latencyMs: Date.now() - roundStarted, meta: { round } }));
      const msg = data.choices?.[0]?.message || {};
      const calls = Array.isArray(msg.tool_calls) ? msg.tool_calls : [];
      if (!calls.length) {
        result = { ok: true, solution: parseJson(msg.content), error: null };
        break;
      }
      messages.push({ role: 'assistant', content: msg.content || '', reasoning_content: msg.reasoning_content || '', tool_calls: calls });
      for (const call of calls) {
        let args = {};
        try {
          args = JSON.parse(call.function?.arguments || '{}');
        } catch {}
        const name = call.function?.name;
        const output = SOLVER_TOOLS.has(name) ? await runTool(name, args, ctx) : { error: `unknown tool ${name}` };
        messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(output).slice(0, 12000) });
      }
    }
    if (!result.ok && !result.error) result.error = 'no answer within the round limit';
    if (result.ok && result.solution?.well_posed === false) result = { ok: false, solution: result.solution, error: 'not a well-posed problem' };
  } catch (e) {
    result = { ok: false, solution: null, error: e.message };
  }
  if (conversationId) {
    await query('INSERT INTO reference_solutions (conversation_id, user_id, ok, solution, error, latency_ms) VALUES ($1, $2, $3, $4::jsonb, $5, $6)', [
      conversationId,
      userId,
      result.ok,
      result.solution ? JSON.stringify(result.solution) : null,
      result.error,
      Date.now() - started,
    ]).catch((e) => console.warn(`Reference solution not saved: ${e.message}`));
  }
  return result;
}

// The block the tutor sees. Only a successful solve is shown.
export function referenceSection(ref) {
  if (!ref?.ok || !ref.solution) return '';
  let body = JSON.stringify(ref.solution);
  if (body.length > SECTION_MAX_CHARS) body = body.slice(0, SECTION_MAX_CHARS) + '…';
  return [
    '## Reference solution (server-checked, hidden from the student)',
    '',
    "The server solved the student's current problem before this turn, with the verified property tables, a calculator and the constraint checker. Its numbers are already verified with the tools, so use them directly: don't look them up or recompute them again, and call tools only for numbers it doesn't contain. Use it to find the earliest step where the student's work departs from it: when your recall or arithmetic disagrees with it, it wins. Never paste it or reveal more of it than the help ceiling allows. If it lists ambiguities, ask the student how their problem reads instead of assuming.",
    '',
    body,
  ].join('\n');
}
