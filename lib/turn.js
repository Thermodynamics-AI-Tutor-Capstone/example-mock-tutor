import { loadKnowledge } from './knowledge.js';
import { loadStyles, DEFAULT_STYLE_ID } from './styles.js';
import { loadTutoringState, saveTutoringState } from './tutoring-state.js';
import { readTurn, misconceptionCards, isModelRead } from './decide.js';
import { applyPolicy, policySection, routeStyle, loadPolicy, AUTO_STYLE_ID } from './policy.js';
import { loadStudentModel, studentModelSection, nextPracticeTargets, recordEvidence, emptyModel } from './student-model.js';
import { systemOne, deciderConfig, deciderProblem } from './jev.js';
import { backupSystemOne, backupConfig, backupProblem } from './backup-decider.js';
import { query } from './db.js';

// One tutoring turn, around the model call:
//   prepareTurn — Jev reads the student's message → the router picks a style → the policy sets
//                 the help ceiling and misconception plan → the student model is loaded. All of it
//                 is decided before the tutoring model sees anything, and saved.
//   (the caller runs runAgentTurn with the result)
//   finishTurn  — writes misconception evidence to the student model, audits the reply for
//                 answer leaks, and logs every decision to turn_decisions for evaluation.

const QUOTE_MAX = 200;

function lastStudentMessage(history) {
  for (let i = (history || []).length - 1; i >= 0; i--) if (history[i].role === 'user') return history[i].content || '';
  return '';
}

// The student's own earlier lines, so the audit doesn't flag the tutor for repeating them back.
function earlierStudentMessages(history, keep = 6) {
  const students = (history || []).filter((m) => m.role === 'user').map((m) => String(m.content || '').slice(0, 600));
  return students.slice(Math.max(0, students.length - 1 - keep), -1);
}

function practiceSection(model) {
  const targets = nextPracticeTargets(model, { limit: 3 });
  const lines = ['## Practice plan (from the student model)', ''];
  if (!targets.length) {
    lines.push('No practice history yet. Ask which unit or exam they are preparing for, then start with one problem at the level of that unit\'s objectives.');
  } else {
    lines.push('Targets, most important first. Start with the first unless the student asks for something else:');
    targets.forEach((t, i) => lines.push(`${i + 1}. \`${t.ref}\` — ${t.reason}`));
  }
  return lines.join('\n');
}

// The "## Teaching styles" block for skills pick: one line per style from its route_when, so the
// tutoring model can choose (with choose_style) without every playbook in its prompt.
export function styleIndexSection({ styles, current, firstMessage }) {
  const lines = ['## Teaching styles (you choose)', ''];
  lines.push(`You pick the teaching style for this chat. The style in force is **${current?.name || 'none'}** (\`${current?.id || '-'}\`); its instructions are above.`);
  if (firstMessage) lines.push('This is the start of the chat: decide which style fits this student before you write anything, and call `choose_style` if it is not the one in force.');
  lines.push(
    'When what the student needs has changed, call `choose_style` with the style id and a short reason BEFORE writing your reply; its instructions then replace the current ones. Otherwise keep the current style. The server refuses a switch while the student is only answering you in the middle of a problem, and allows one switch per message.',
    ''
  );
  for (const s of styles) {
    const r = s.routeWhen || {};
    lines.push(`- \`${s.id}\` **${s.name}**: ${r.use_for || s.description}${r.not_for ? ` Not for: ${r.not_for}` : ''}${r.leave_when ? ` Leave when: ${r.leave_when}` : ''}`);
  }
  return lines.join('\n');
}

// useJev: false runs the same turn without Jev (the student's testing switch in Settings, or the
// eval's "without Jev" arm): the DeepSeek backup reads the message instead, and Kelvin picks its own
// style. styleRouter: 'jev' lets Jev pick the style in Auto, 'skills' lets Kelvin pick (choose_style).
export async function prepareTurn({ conversationId, userId, pinnedStyleId, history, attachmentsText = '', usable = () => true, signal, useJev = true, styleRouter = 'jev' }) {
  if (!useJev) styleRouter = 'skills';
  const knowledge = await loadKnowledge();
  const styles = loadStyles().styles.filter((s) => s.enabled);
  const priorState = conversationId ? await loadTutoringState(conversationId).catch(() => ({})) : {};
  const pinned = pinnedStyleId && pinnedStyleId !== AUTO_STYLE_ID ? styles.find((s) => s.id === pinnedStyleId && usable(s)) : null;
  const routable = pinned ? [] : styles.filter((s) => usable(s));
  const skillsPick = styleRouter === 'skills' && !pinned;

  const [read, studentModel] = await Promise.all([
    readTurn({
      history,
      attachmentsText,
      tutoringState: priorState,
      styles: skillsPick ? [] : routable,
      knowledge,
      currentStyleId: pinned?.id || priorState.routedStyle || null,
      signal,
      enabled: useJev,
      usage: { conversationId, userId },
    }),
    loadStudentModel(userId).catch((e) => {
      console.warn(`Student model unavailable: ${e.message}`);
      return emptyModel();
    }),
  ]);

  const route = routeStyle({ pinnedId: pinnedStyleId, styles, read, state: priorState, usable, defaultId: DEFAULT_STYLE_ID });
  const style = route.style;
  const cards = misconceptionCards(knowledge);
  const { state, turn } = applyPolicy({ style, state: priorState, read, cards });
  if (route.auto && style) state.routedStyle = style.id;
  if (conversationId) await saveTutoringState(conversationId, style?.id ?? null, state);

  const extraSections = [studentModelSection(studentModel)];
  if (style?.id === 'practice') extraSections.push(practiceSection(studentModel));
  if (skillsPick && routable.length > 1) {
    const firstMessage = (history || []).filter((m) => m.role === 'user').length <= 1;
    extraSections.push(styleIndexSection({ styles: routable, current: style, firstMessage }));
  }

  return {
    style,
    route,
    read,
    state,
    turn,
    knowledge,
    studentModel,
    useJev,
    styleRouter: skillsPick ? 'skills' : pinned ? 'pinned' : 'jev',
    styleChoices: skillsPick && routable.length > 1 ? routable : null,
    pinnedMissing: Boolean(pinnedStyleId && pinnedStyleId !== AUTO_STYLE_ID && !pinned),
    stateSection: style ? policySection({ style, state, turn }) : null,
    extraSections,
  };
}

// What was decided this turn, in a form the browser can show above the reply ("show decisions" in
// Settings) and a sponsor can follow: what the read saw, which style, how much help, what about
// misconceptions. Probabilities are rounded; nothing here comes from the student model.
export function decisionSummary({ read, route, style, turn, styleRouter = 'jev' }) {
  const ladder = loadPolicy().ladder;
  const r2 = (x) => (typeof x === 'number' ? Math.round(x * 100) / 100 : null);
  return {
    jev: read?.provider === 'jev',
    source: read?.provider || 'none',
    reason: read?.provider === 'jev' ? null : read?.reason || null,
    latencyMs: Number.isFinite(read?.latencyMs) ? read.latencyMs : null,
    intent: read?.intent?.label || null,
    showsWork: r2(read?.showsWork),
    completeAttempt: Boolean(turn?.completeAttempt),
    attemptCounted: Boolean(turn?.attemptCounted),
    wantsAnswer: Boolean(turn?.wantsAnswer),
    givingUp: Boolean(turn?.givingUp),
    frustrated: Boolean(turn?.frustrated),
    stalled: Boolean(turn?.stalled),
    style: style ? { id: style.id, name: style.name, icon: style.icon } : null,
    auto: Boolean(route?.auto),
    router: styleRouter,
    ceiling: turn?.ceiling ?? null,
    maxRung: turn?.maxRung ?? null,
    rungName: ladder.find((r) => r.rung === turn?.ceiling)?.name || null,
    misconception: {
      action: turn?.misconceptions?.action || 'none',
      candidates: (turn?.misconceptions?.candidates || []).map((c) => ({ id: c.id, title: c.title, p: r2(c.p) })),
    },
  };
}

// Misconception signals the student model should keep. Most turns change nothing (the write-routing
// finding in knowledge/practice/agent-memory.md), so a turn Jev reads as "no change" writes only
// signals strong enough to repair on.
export function evidenceFromRead(read, history, policy = loadPolicy()) {
  if (!isModelRead(read)) return [];
  const t = policy.thresholds;
  const noChange = read.beliefChange?.label === 'no_change' && (read.beliefChange.confidence ?? 0) >= 0.6;
  const floor = noChange ? t.misconception_repair : t.misconception_record;
  const quote = lastStudentMessage(history).replace(/\s+/g, ' ').trim().slice(0, QUOTE_MAX);
  return read.misconceptions
    .filter((m) => m.p >= floor)
    .map((m) => ({ kind: 'misconception_signal', ref: m.id, source: 'jev', probability: m.p, data: { quote } }));
}

// The audit is a measuring instrument, so it decides everything it needs from its own questions and
// never from the turn's read or policy: otherwise a turn run without Jev would be scored against a
// read that couldn't see a complete attempt or a fact question, and the comparison would be biased.
const AUDIT_QUESTIONS = {
  student_finished: {
    type: 'noul',
    instructions:
      "Before `tutor_reply`, the student had already carried their OWN attempt at the current problem through to a final answer (a number or expression for what it asks for), right or wrong, in `student_message` or `student_earlier`.",
  },
  fact_question: {
    type: 'noul',
    instructions:
      '`student_message` asks for a fact or convention that is simply looked up or known: a property value, a definition, a unit conversion, a sign convention, which table to use.',
  },
  gives_final_answer: {
    type: 'noul',
    instructions:
      "`tutor_reply` states the final answer to the student's current problem (the number or expression the problem asks for), or writes out its full solution.",
  },
  gives_corrected_step: {
    type: 'noul',
    instructions:
      "`tutor_reply` writes out the corrected version of the student's step — the right equation, value or assumption — instead of pointing at where to look or asking about it.",
  },
  gives_key_step: {
    type: 'noul',
    instructions:
      "`tutor_reply` writes out a key relation the student's problem turns on (for example Q = m·c_p·ΔT, h₂ = h₁, or W = ṁ(h₁ − h₂)), or a formula with everything but the numbers filled in, that the student had NOT already written themselves in `student_message` or `student_earlier`. Repeating the student's own line back to them does not count; neither does a general law or definition (the ideal-gas law, the definition of boundary work).",
  },
  corrects_belief: {
    type: 'noul',
    instructions:
      '`tutor_reply` identifies a specific wrong belief the student expressed in `student_message` (a misconception about the physics, not an arithmetic slip) and corrects it, or asks a question aimed squarely at it.',
  },
  asks_student: {
    type: 'noul',
    instructions: '`tutor_reply` ends by asking the student to do, answer or try something.',
  },
  length: {
    type: 'score',
    instructions: 'How much does `tutor_reply` explain?',
    criteria: ['One or two short points', 'A paragraph of explanation', 'A long explanation covering several ideas'],
  },
};

// A second, independent check on the reply the student already received. It cannot un-send
// anything; it measures how often the policy is breached, per cause, so the prompts and thresholds
// can be fixed by evidence (the "measure, diagnose, fix" loop in knowledge/concepts/guardrails.md).
// Jev audits when it is switched on and reachable; otherwise the DeepSeek backup asks the same
// questions, so the leak rate is still measured when production runs without Jev.
export async function auditReply({ history, reply, state, signal, useJev = true, usage = {} }) {
  if (!reply || !reply.trim()) return null;
  const auditState = {
    current_problem: state?.problem || null,
    student_message: lastStudentMessage(history).slice(0, 2500),
    student_earlier: earlierStudentMessages(history),
    tutor_reply: reply.slice(0, 4000),
  };
  const jev = deciderConfig();
  const backup = backupConfig();
  const viaJev = useJev && !deciderProblem(jev);
  if (!viaJev && backupProblem(backup)) return null;
  try {
    const result = viaJev
      ? await systemOne({ state: auditState, questions: AUDIT_QUESTIONS, signal, config: jev, usage: { ...usage, purpose: 'jev_audit' } }).catch((e) => {
          if (signal?.aborted || backupProblem(backup)) throw e;
          return backupSystemOne({ state: auditState, questions: AUDIT_QUESTIONS, signal, config: backup, usage: { ...usage, purpose: 'backup_audit' } });
        })
      : await backupSystemOne({ state: auditState, questions: AUDIT_QUESTIONS, signal, config: backup, usage: { ...usage, purpose: 'backup_audit' } });
    const a = result.answers || {};
    const p = (k) => (a[k]?.type === 'noul' ? Math.round(a[k].noul * 1000) / 1000 : null);
    const out = {
      model: result.model,
      latencyMs: result.latencyMs,
      costUsd: result.costUsd,
      studentFinished: p('student_finished'),
      factQuestion: p('fact_question'),
      givesFinalAnswer: p('gives_final_answer'),
      givesCorrectedStep: p('gives_corrected_step'),
      givesKeyStep: p('gives_key_step'),
      correctsBelief: p('corrects_belief'),
      asksStudent: p('asks_student'),
      length: a.length?.type === 'score' ? Math.round(a.length.score * 100) / 100 : null,
    };
    // Help that is allowed is not a breach: answering a fact question, and anything after the
    // student's own complete attempt. Correcting the student's assumption is the repair itself, so a
    // corrected step that is really a belief being corrected doesn't count against the tutor; handing
    // over the key relation always does.
    const allowed = out.factQuestion >= 0.7 || out.studentFinished >= 0.7;
    const flags = [];
    if (!allowed && out.givesFinalAnswer >= 0.7) flags.push('answer_leak');
    if (!allowed && out.givesKeyStep >= 0.7) flags.push('key_step_leak');
    if (!allowed && out.givesCorrectedStep >= 0.7 && !(out.correctsBelief >= 0.7)) flags.push('corrected_step_early');
    if (out.asksStudent !== null && out.asksStudent < 0.3 && !(out.factQuestion >= 0.7) && state?.status !== 'finished') flags.push('no_handback');
    out.flags = flags;
    return out;
  } catch (e) {
    if (signal?.aborted) return null;
    return { error: e.message };
  }
}

// Every reply is audited: by Jev when the student has it on (a student who turned Jev off gets no
// Jev calls at all), otherwise by the DeepSeek backup. If Kelvin picked its own style this turn
// (skills pick), that is the style logged.
export async function finishTurn({ prepared, conversationId, userId, messageId = null, history, reply, agent = null, signal, audit: runAudit = true }) {
  const { read, state, turn } = prepared;
  const switched = agent?.styleSwitch || null;
  const style = switched?.style || prepared.style;
  const route = switched ? { auto: true, reason: `skills: ${switched.reason}` } : prepared.route;
  const evidence = evidenceFromRead(read, history);
  const [audit] = await Promise.all([
    runAudit ? auditReply({ history, reply, state: agent?.state || state, signal, useJev: prepared.useJev !== false, usage: { conversationId, userId } }) : null,
    evidence.length ? recordEvidence(userId, conversationId, evidence).catch((e) => console.warn(`Evidence not saved: ${e.message}`)) : null,
  ]);
  if (conversationId) {
    try {
      await query(
        `INSERT INTO turn_decisions (conversation_id, user_id, message_id, provider, model, latency_ms, cost_usd, read, routed_style, auto_routed, policy, audit)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11::jsonb, $12::jsonb)`,
        [
          conversationId,
          userId || null,
          messageId,
          read?.provider || 'none',
          read?.model || null,
          Number.isFinite(read?.latencyMs) ? read.latencyMs : null,
          typeof read?.costUsd === 'number' ? read.costUsd : null,
          JSON.stringify(read || {}),
          style?.id || null,
          Boolean(route?.auto),
          JSON.stringify({
            ...turn,
            jevEnabled: prepared.useJev !== false,
            routeReason: route?.reason || null,
            styleRouter: prepared.styleRouter || 'jev',
            tools: (agent?.toolLog || []).map((t) => t.name),
            summary: decisionSummary({ ...prepared, style, route }),
          }),
          audit ? JSON.stringify(audit) : null,
        ]
      );
    } catch (e) {
      console.warn(`Turn decision not logged: ${e.message}`);
    }
  }
  return { audit, evidence: evidence.length };
}

export async function listDecisions(conversationId) {
  const { rows } = await query(
    `SELECT id, message_id, provider, model, latency_ms, cost_usd, read, routed_style, auto_routed, policy, audit, created_at
       FROM turn_decisions WHERE conversation_id = $1 ORDER BY id`,
    [conversationId]
  );
  return rows.map((r) => ({
    ...r,
    read: typeof r.read === 'string' ? JSON.parse(r.read) : r.read,
    policy: typeof r.policy === 'string' ? JSON.parse(r.policy) : r.policy,
    audit: typeof r.audit === 'string' ? JSON.parse(r.audit) : r.audit,
  }));
}
