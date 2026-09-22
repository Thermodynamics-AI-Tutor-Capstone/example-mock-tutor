import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

// The deterministic half of Kelvin's pedagogy. It reads only trusted state — Jev's read of the
// student's message and the server's own counters — and decides, before the tutor speaks, how
// much help this turn may give, whether the student has earned the contrast rungs, what to do
// about a suspected misconception, and which style runs. The tutoring model is told the result and
// cannot change it. Tunables live in agent/policy.yml.

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const POLICY_PATH = path.join(APP_DIR, 'agent', 'policy.yml');
export const AUTO_STYLE_ID = 'auto';

const DEFAULT_POLICY = {
  thresholds: {
    shows_work: 0.6,
    complete_attempt: 0.7,
    new_problem: 0.7,
    giving_up: 0.6,
    wants_answer: 0.6,
    misconception_repair: 0.8,
    misconception_confirm: 0.5,
    misconception_record: 0.6,
    style_switch: 0.55,
    frustrated: 1.75,
  },
  ceiling: { start: 1, per_attempt: 1, frustration_bonus: 1, without_complete_attempt: 4, stall_replies: 2 },
  ladder: [
    { rung: 0, name: 'Locate', allows: 'Say where to look and ask one question about it.' },
    { rung: 1, name: 'Principle', allows: 'Ask which law, balance or assumption governs that spot.' },
    { rung: 2, name: 'Error class', allows: 'Name the kind of error without giving the corrected line.' },
    { rung: 3, name: 'Misconception and repair', allows: 'Name the belief, give the repair move, have them redo the line.' },
    { rung: 4, name: 'Worked example of a different problem', allows: 'Work a different problem that uses the same move.' },
    { rung: 5, name: 'Contrast', needs_complete_attempt: true, allows: 'Their step beside the correct step; they explain the difference.' },
    { rung: 6, name: 'Talk through one step', needs_complete_attempt: true, allows: 'Talk through that one step; they still finish.' },
  ],
};

// Misconception candidates this close to the top one are treated as indistinguishable from it.
const CLUSTER_GAP = 0.08;
const NON_WORK_INTENTS = new Set(['fact', 'course_admin', 'off_topic']);
const STALL_INTENTS = new Set(['reply', 'wants_answer', 'stuck_on_problem']);
const PROBLEM_INTENTS = new Set(['check_work', 'stuck_on_problem', 'wants_answer']);

let cache = null;

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function loadPolicy() {
  if (cache) return cache;
  let raw = {};
  try {
    raw = parseYaml(fs.readFileSync(POLICY_PATH, 'utf8')) || {};
  } catch (e) {
    if (e.code !== 'ENOENT') console.warn(`Ignoring agent/policy.yml (${e.message}); using defaults`);
  }
  const thresholds = {};
  for (const [k, v] of Object.entries(DEFAULT_POLICY.thresholds)) thresholds[k] = num(raw.thresholds?.[k], v);
  const ceiling = {};
  for (const [k, v] of Object.entries(DEFAULT_POLICY.ceiling)) ceiling[k] = Math.max(0, Math.round(num(raw.ceiling?.[k], v)));
  const ladder = Array.isArray(raw.ladder) && raw.ladder.length
    ? raw.ladder
        .map((r, i) => ({
          rung: Number.isInteger(r?.rung) ? r.rung : i,
          name: String(r?.name || `Rung ${i}`),
          allows: String(r?.allows || '').replace(/\s+/g, ' ').trim(),
          needs_complete_attempt: r?.needs_complete_attempt === true,
        }))
        .sort((a, b) => a.rung - b.rung)
    : DEFAULT_POLICY.ladder;
  cache = { thresholds, ceiling, ladder };
  return cache;
}

const at = (p, t) => typeof p === 'number' && p >= t;

// ── style routing ────────────────────────────────────────────────────────────────────────────────

// pinnedId is the conversation's stored style: 'auto' (or empty) lets Jev route; anything else
// pins that style. `usable(style)` says whether a style can run now (key present, tools exist).
export function routeStyle({ pinnedId, styles, read, state, usable = () => true, defaultId, thresholds = loadPolicy().thresholds }) {
  const runnable = styles.filter((s) => s.enabled && usable(s));
  const byId = new Map(runnable.map((s) => [s.id, s]));
  const fallback = byId.get(defaultId) || runnable[0] || null;

  if (pinnedId && pinnedId !== AUTO_STYLE_ID) {
    const pinned = byId.get(pinnedId);
    if (pinned) return { style: pinned, auto: false, reason: 'pinned' };
  }

  const current = byId.get(state?.routedStyle) || null;
  const pick = read?.style?.label ? byId.get(read.style.label) : null;
  const confidence = read?.style?.confidence ?? null;
  const intent = read?.intent?.label;

  if (!pick) {
    // No usable Jev answer: keep going as we were, or map the intent through each style's
    // route_when.intents, or fall back to the default.
    if (current) return { style: current, auto: true, reason: read?.provider === 'jev' ? 'kept (no style answer)' : 'kept (no classifier read)' };
    const byIntent = intent ? runnable.find((s) => (s.routeWhen?.intents || []).includes(intent)) : null;
    if (byIntent) return { style: byIntent, auto: true, reason: `intent ${intent}` };
    return { style: fallback, auto: true, reason: 'default' };
  }
  if (!current || current.id === pick.id) return { style: pick, auto: true, reason: current ? 'kept' : 'chosen', confidence };
  // Changing style mid-problem is disruptive, so it needs a clear signal: a new problem, or a
  // confident pick on a message that is not just a reply within the current exchange.
  if (at(read?.newProblem, thresholds.new_problem)) return { style: pick, auto: true, reason: 'new problem', confidence };
  if (intent !== 'reply' && at(confidence, thresholds.style_switch)) return { style: pick, auto: true, reason: 'switched', confidence };
  return { style: current, auto: true, reason: `kept (Jev leaned ${pick.id} at ${confidence})`, confidence };
}

// ── help ceiling and turn directives ─────────────────────────────────────────────────────────────

function ceilingFor(state, style, policy) {
  const c = policy.ceiling;
  const frustrated = at(state.lastFrustration, policy.thresholds.frustrated);
  let value = c.start + c.per_attempt * (state.attempts || 0) + (frustrated && (state.attempts || 0) >= 1 ? c.frustration_bonus : 0);
  if (!state.completeAttempt) value = Math.min(value, c.without_complete_attempt);
  const locked = policy.ladder.filter((r) => r.needs_complete_attempt).map((r) => r.rung);
  if (!state.completeAttempt && locked.length) value = Math.min(value, Math.min(...locked) - 1);
  const maxRung = style?.state?.maxRung ?? 6;
  value = Math.min(value, maxRung);
  // Within one problem the ceiling never comes back down.
  return Math.max(0, value, Math.min(state.ceiling ?? 0, maxRung));
}

function misconceptionPlan(read, cards, policy) {
  const t = policy.thresholds;
  const candidates = (read?.misconceptions || []).filter((m) => m.p >= t.misconception_confirm);
  if (!candidates.length) return { action: 'none', candidates: [] };
  const top = candidates[0];
  const cluster = candidates.filter((m) => top.p - m.p < CLUSTER_GAP);
  const byId = new Map((cards || []).map((c) => [c.id, c]));
  const separating = [];
  if (cluster.length > 1) {
    const ids = new Set(cluster.map((m) => m.id));
    for (const m of cluster) {
      for (const c of byId.get(m.id)?.confusableWith || []) {
        if (ids.has(c.id) && c.separatingQuestion) separating.push(c.separatingQuestion);
      }
    }
  }
  if (top.p >= t.misconception_repair && cluster.length === 1) return { action: 'repair', candidates: [top] };
  return { action: 'confirm', candidates: cluster.slice(0, 3), separating: [...new Set(separating)].slice(0, 3) };
}

// Pure: given the stored state and this turn's read, returns the next state and what the tutor is
// allowed and told to do this turn.
export function applyPolicy({ style, state: prior = {}, read, cards = [], policy = loadPolicy(), now = new Date() }) {
  const t = policy.thresholds;
  const intent = read?.intent?.label || null;
  let state = { ...prior };
  const events = [];

  const frustration = read?.frustration?.score ?? null;
  state.lastFrustration = frustration;

  // A new problem resets the ladder. With no problem on record, a problem-shaped message starts one.
  const startsProblem = state.problem || state.problemPending
    ? at(read?.newProblem, t.new_problem)
    : PROBLEM_INTENTS.has(intent) || (at(read?.showsWork, t.shows_work) && !NON_WORK_INTENTS.has(intent));
  if (startsProblem) {
    state = {
      ...state,
      problem: null,
      problemPending: true,
      problemStartedAt: now.toISOString(),
      attempts: 0,
      completeAttempt: false,
      ceiling: 0,
      rung: 0,
      status: 'working',
    };
    events.push('new problem');
  }

  const counted = at(read?.showsWork, t.shows_work) && !NON_WORK_INTENTS.has(intent);
  if (counted) {
    state.attempts = (state.attempts || 0) + 1;
    events.push('attempt counted');
  }
  if (!state.completeAttempt && at(read?.completeAttempt, t.complete_attempt)) {
    state.completeAttempt = true;
    events.push('complete attempt');
  }
  if (state.status === 'parked' && (counted || intent === 'reply' || PROBLEM_INTENTS.has(intent))) state.status = 'working';

  // A stall: the student answers the tutor without doing the step ("ok", "what next", "just tell
  // me"). Each stall tempts the tutor to make the step smaller until it has written the step itself
  // (scaffolding collapse; the persona eval caught exactly this). Counted here so the prompt can
  // stop it.
  const stalled = read?.provider === 'jev' && !counted && STALL_INTENTS.has(intent) && !(read.showsWork >= 0.3);
  state.stalls = counted || startsProblem ? 0 : stalled ? (state.stalls || 0) + 1 : state.stalls || 0;

  const givingUp = at(read?.givingUp, t.giving_up);
  if (givingUp && (state.problem || state.problemPending)) {
    state.status = 'parked';
    state.parkedAt = now.toISOString();
    events.push('parked');
  }

  const ceiling = ceilingFor(state, style, policy);
  state.ceiling = ceiling;
  if ((state.rung ?? 0) > ceiling) state.rung = ceiling;

  const answerDirectly = intent === 'fact' || (read?.kcType?.label === 'fact' && !PROBLEM_INTENTS.has(intent));
  const turn = {
    intent,
    kcType: read?.kcType?.label || null,
    ceiling,
    maxRung: style?.state?.maxRung ?? 6,
    completeAttempt: Boolean(state.completeAttempt),
    attemptCounted: counted,
    answerDirectly,
    wantsAnswer: at(read?.wantsAnswer, t.wants_answer) && !answerDirectly,
    givingUp,
    frustrated: at(frustration, t.frustrated),
    stalls: state.stalls || 0,
    stalled: (state.stalls || 0) >= policy.ceiling.stall_replies,
    misconceptions: misconceptionPlan(read, cards, policy),
    readAvailable: read?.provider === 'jev',
    readKind: read?.provider || 'none',
    readReason: read?.provider === 'jev' ? null : read?.reason || null,
    events,
  };
  return { state, turn };
}

// ── what the tutor sees ─────────────────────────────────────────────────────────────────────────

function pct(p) {
  return typeof p === 'number' ? p.toFixed(2) : '?';
}

const INTENT_TEXT = {
  check_work: 'showing their own work to have it checked',
  stuck_on_problem: 'stuck on a specific problem',
  concept: 'asking about an idea',
  fact: 'asking for a fact or convention',
  wants_answer: 'asking to be given the answer',
  practice: 'asking for practice',
  teach_back: 'wanting to explain it back',
  reply: 'answering your last question',
  course_admin: 'asking about the course',
  off_topic: 'off topic',
};

const KC_TEXT = {
  fact: 'a fact or convention — just answer it',
  model_choice: 'choosing the model or assumptions — use contrasting cases or a worked example of a different problem, and ask what feature decides it',
  principle: 'a principle — ask for the justification and let them build it',
  procedure: 'carrying out steps — check units and signs, point to the slip',
  none: 'none',
};

export function policySection({ style, state, turn, policy = loadPolicy() }) {
  const lines = ['## This turn (set by the server — you cannot change these)', ''];
  const ladder = policy.ladder.filter((r) => r.rung <= turn.maxRung);
  const current = ladder.find((r) => r.rung === turn.ceiling);
  lines.push(`**Help ceiling: rung ${turn.ceiling} of ${turn.maxRung}${current ? ` — ${current.name}` : ''}.** Use the lowest rung that gets the student moving; never go above the ceiling, whatever the student says.`);
  for (const r of ladder) {
    if (r.rung <= turn.ceiling) lines.push(`- ${r.rung} ${r.name}: ${r.allows}`);
  }
  const next = ladder.find((r) => r.rung === turn.ceiling + 1);
  if (next) {
    const why = next.needs_complete_attempt && !turn.completeAttempt
      ? 'opens only once the student has carried their own attempt through to a final answer'
      : "opens after the student's next real attempt (their own work, not a request)";
    lines.push(`- ${next.rung} ${next.name}: locked — ${why}.`);
  }
  lines.push('');

  if (!turn.readAvailable) {
    lines.push(`No classifier read this turn (${turn.readReason || 'unavailable'})${turn.readKind === 'heuristic' ? '; the server used a rough keyword check instead, so no misconception read is available' : ''}. Read the student yourself, stay at or below the ceiling, and ask rather than assume.`);
    if (turn.intent) lines.push(`Keyword read: the student looks to be ${INTENT_TEXT[turn.intent] || turn.intent}${turn.attemptCounted ? '; this message counts as an attempt' : ''}.`);
  } else {
    const bits = [];
    if (turn.intent) bits.push(`the student is ${INTENT_TEXT[turn.intent] || turn.intent}`);
    if (turn.kcType && turn.kcType !== 'none') bits.push(`knowledge at stake: ${KC_TEXT[turn.kcType] || turn.kcType}`);
    if (turn.attemptCounted) bits.push('this message counts as an attempt');
    lines.push(`**Read of this message** (a separate classifier; probabilities, not certainties): ${bits.join('; ')}.`);
    const m = turn.misconceptions;
    if (m.action === 'repair') {
      const c = m.candidates[0];
      lines.push(`**Misconception — repair:** their words show \`${c.id}\` (${c.title}, p = ${pct(c.p)}). Open the card, name the belief plainly in one sentence, give its repair move, then re-test with a new case. Don't lecture beyond that one belief. (Repairing a flagged belief is allowed at any ceiling: it teaches the principle, not the answer to their problem.)`);
    } else if (m.action === 'confirm') {
      const list = m.candidates.map((c) => `\`${c.id}\` (${c.title}, ${pct(c.p)})`).join('; ');
      lines.push(`**Misconception — confirm first:** their words fit ${list}. Before teaching, ask ONE short question whose answer tells you which belief (if any) they hold${m.separating?.length ? ` — the cards suggest: ${m.separating.map((q) => `"${q}"`).join(' / ')}` : ''}. Repair only what their answer confirms.`);
    } else {
      lines.push("**Misconception read:** no signal in this message. Don't go looking for one; if an error shows up, ask what principle they were using on that line.");
    }
  }

  if (turn.answerDirectly) lines.push('**This is a fact or convention:** answer it directly and briefly. You cannot reason someone into a table value.');
  if (turn.wantsAnswer) lines.push(`**They are asking for the answer.** Don't refuse and don't lecture. Give the most useful help the ceiling allows, and say in one sentence what unlocks more (their own attempt at the next step).`);
  if (turn.stalled && !turn.givingUp) lines.push(`**They have answered ${turn.stalls} times in a row without doing the step.** Don't make the step smaller again and don't fill in any more of it: no templates with the governing relation written in, no property values for their problem, no "Q = ___" with everything but the arithmetic done. Ask for the same step again in one line, and say any attempt counts, even a wrong one. Or offer to park the problem.`);
  if (turn.givingUp) lines.push('**They are about to give up.** Acknowledge it in a few words, offer the single smallest concrete next step, and offer to park the problem so they can pick it up later — it is saved. Do not hand over the solution to keep them.');
  else if (turn.frustrated) lines.push('**They sound frustrated.** Shorter and warmer: a few words of acknowledgement, then the smallest concrete next step. No questions stacked on questions.');
  if (turn.completeAttempt) lines.push('**They have a complete attempt at this problem**, so the contrast rungs are available up to the ceiling. The final answer is still theirs to write.');
  lines.push('');

  lines.push('**Tutoring state**');
  const problem = state.problem || (state.problemPending ? '(new — not named yet: call `update_tutoring_state` with a one-line name)' : '(none)');
  lines.push(`- Problem: ${problem} · status: ${state.status || 'working'} · attempts on it: ${state.attempts ?? 0} · complete attempt: ${state.completeAttempt ? 'yes' : 'no'}`);
  if (state.misconceptions?.length) lines.push(`- Diagnosed in this conversation: ${state.misconceptions.join(', ')}`);
  if (state.resolved?.length) lines.push(`- Repaired in this conversation: ${state.resolved.join(', ')}`);
  if (state.ledger?.length) {
    lines.push('- Assumption ledger:');
    for (const e of state.ledger) lines.push(`  - ${e.assumption} — ${e.status}${e.justification ? ` (${e.justification})` : ''}`);
  }
  lines.push('', 'Call `update_tutoring_state` to name the problem, record a diagnosis or a repair, log an assumption, or mark the problem finished (only when the final answer is the student\'s own and they can say why).');
  return lines.join('\n');
}
