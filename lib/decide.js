import { systemOne, deciderConfig, deciderProblem } from './jev.js';
import { backupSystemOne, backupConfig, backupProblem } from './backup-decider.js';

// A read that came from a model — Jev ('jev'), or the DeepSeek backup that stands in for it ('llm')
// — as opposed to keyword rules or nothing. Everything downstream treats the two alike.
export function isModelRead(read) {
  return read?.provider === 'jev' || read?.provider === 'llm';
}

// The per-turn read: one Jev call, before the tutor speaks, that answers every snap judgment the
// policy and the router need. All questions go in one request (Jev evaluates them in parallel and
// independently, so extra questions cost a few tokens and no latency). Nothing here writes to the
// database or decides anything; lib/policy.js turns these probabilities into limits.
//
// Jev's own guidance is that accuracy falls as the state fills with material a question does not
// need, so the state is kept lean: the latest message, any work the student uploaded with it, and a
// short window of recent turns.

const MAX_MESSAGE_CHARS = 2500;
const MAX_WORK_CHARS = 3000;
const MAX_TURN_CHARS = 700;
const RECENT_TURNS = 6;

const FRUSTRATION_LEVELS = [
  'Calm, neutral or positive',
  'A little impatient or unsure',
  'Clearly frustrated or annoyed',
  'Upset, discouraged, or about to give up',
];

export const INTENTS = {
  check_work: 'Shares their own solution, steps or numbers (typed, or in `student_work_uploaded`) and wants to know whether it is right or where it goes wrong',
  stuck_on_problem: 'Is working a specific homework-style problem and is stuck, or asks how to start it or what to do next',
  concept: 'Asks why or how something works, or says they do not understand an idea, without needing to finish a specific problem',
  fact: 'Wants a quick fact or convention: a property value, a definition, a unit conversion, a sign convention, which table to use',
  wants_answer: 'Asks to be given the answer, the full solution or the next step, or says "just tell me"',
  practice: 'Asks for practice problems, a quiz, a re-test, or help studying for an exam',
  teach_back: 'Wants to explain an idea back, be checked on their own explanation, or play the game where Kelvin makes a mistake for them to find',
  reply: "Answers the tutor's last question or continues the current exchange (a pick, a step, a number, 'ok', 'I think it's…')",
  course_admin: 'Asks about this course: schedule, due dates, grading, policies, exams',
  off_topic: 'Not about thermodynamics or the course, or small talk',
};

export const KC_TYPES = {
  fact: 'A fact or convention to look up or remember: a property value, a definition, a unit, a sign convention, notation',
  model_choice: 'Choosing how to model the situation: closed system or control volume, which terms vanish, which assumptions hold, ideal gas or tables, which equation applies',
  principle: 'Understanding why a law or relation holds: why entropy is generated, why h and not u, what the second law forbids',
  procedure: 'Carrying out steps already chosen: algebra, interpolation, unit handling, arithmetic',
  none: 'No thermodynamics knowledge is at stake (logistics, small talk)',
};

const BELIEF_CHANGE = {
  no_change: 'No: a lookup, logistics, a restatement, an acknowledgement or small talk',
  new_evidence: 'Yes: the student shows knowledge, or a gap, that was not visible before',
  update: 'Yes, and it corrects earlier evidence: the student now gets right something they got wrong earlier, or reverses an earlier belief',
};

function clip(text, max) {
  const s = String(text ?? '').replace(/\s+\n/g, '\n').trim();
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

function asList(value) {
  return Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : [];
}

// Misconception cards, with the detection fields from their frontmatter (carried through the
// compiler in card.extra).
export function misconceptionCards(knowledge) {
  const cards = knowledge?.index?.cards || [];
  return cards
    .filter((c) => c.kind === 'misconception')
    .map((c) => ({
      id: c.id,
      title: c.title || c.id,
      description: c.description || '',
      signatures: asList(c.extra?.signatures),
      notSignatures: asList(c.extra?.not_signatures),
      confusableWith: Array.isArray(c.extra?.confusable_with)
        ? c.extra.confusable_with
            .filter((x) => x && typeof x.id === 'string')
            .map((x) => ({ id: x.id, separatingQuestion: typeof x.separating_question === 'string' ? x.separating_question : '' }))
        : [],
      status: c.status,
    }));
}

export function misconceptionKey(id) {
  return `misc_${String(id).replace(/^misc:/, '').replace(/[^a-z0-9]+/gi, '_').toLowerCase()}`;
}

// The student message this turn is about is the last user message in history.
export function buildState({ history, attachmentsText = '', tutoringState = {}, currentStyleId = null }) {
  const msgs = (history || []).filter((m) => m.role === 'user' || m.role === 'assistant');
  let lastUser = -1;
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === 'user') {
      lastUser = i;
      break;
    }
  }
  const latest = lastUser >= 0 ? msgs[lastUser].content : '';
  const recent = msgs.slice(Math.max(0, lastUser - RECENT_TURNS), Math.max(0, lastUser)).map((m) => ({
    speaker: m.role === 'user' ? 'student' : 'tutor',
    text: clip(m.content, MAX_TURN_CHARS),
  }));
  const state = {
    student_message: clip(latest, MAX_MESSAGE_CHARS),
    recent_conversation: recent,
    current_problem: tutoringState.problem || null,
    tutor_style_now: currentStyleId,
  };
  if (attachmentsText && attachmentsText.trim()) state.student_work_uploaded = clip(attachmentsText, MAX_WORK_CHARS);
  return state;
}

function styleCriteria(styles) {
  const out = {};
  for (const s of styles) {
    const r = s.routeWhen || {};
    out[s.id] = {
      name: s.name,
      use_for: r.use_for || s.description,
      ...(r.not_for ? { not_for: r.not_for } : {}),
      ...(Array.isArray(r.examples) && r.examples.length ? { examples: r.examples } : {}),
    };
  }
  return out;
}

export function buildQuestions({ styles = [], misconceptions = [] }) {
  const questions = {
    intent: {
      type: 'choice',
      instructions: 'What is the student doing in `student_message`? Use `recent_conversation` only for context.',
      criteria: INTENTS,
    },
    kc_type: {
      type: 'choice',
      instructions: 'What kind of thermodynamics knowledge does the student need right now, judging from `student_message`?',
      criteria: KC_TYPES,
    },
    shows_work: {
      type: 'noul',
      instructions:
        "`student_message` or `student_work_uploaded` contains the student's OWN work on a problem: an equation they set up, a number they computed, an assumption they chose, a property value they looked up, or a step they tried. A restated problem statement, a bare question, or \"I don't know\" is not work.",
    },
    complete_attempt: {
      type: 'noul',
      instructions:
        "The student has carried their OWN attempt at the current problem through to a final answer (a number or expression for what the problem asks for), right or wrong, somewhere in `student_message`, `student_work_uploaded` or the student turns of `recent_conversation`. A partial setup does not count, and neither does an answer the tutor gave.",
    },
    new_problem: {
      type: 'noul',
      instructions:
        '`student_message` starts a different problem from `current_problem`: a new problem statement, a different device, or different given numbers. A follow-up about the same problem does not count.',
    },
    wants_answer: {
      type: 'noul',
      instructions:
        "In `student_message` the student asks to be handed the answer, the solution or the next step rather than helped to find it (\"just give me the answer\", \"what's the final number\", \"can you solve it\", \"what do I do next\").",
    },
    giving_up: {
      type: 'noul',
      instructions:
        "In `student_message` the student signals they are giving up or leaving: \"forget it\", \"I give up\", \"I'll just use ChatGPT\", \"I don't have time for this\", \"never mind\".",
    },
    frustration: {
      type: 'score',
      instructions: 'How frustrated or discouraged does the student sound in `student_message`?',
      criteria: FRUSTRATION_LEVELS,
    },
    belief_change: {
      type: 'choice',
      instructions: 'Does `student_message` tell us something new about what this student knows or misunderstands?',
      criteria: BELIEF_CHANGE,
    },
  };
  if (styles.length >= 2) {
    questions.style = {
      type: 'choice',
      instructions:
        'Which teaching approach fits what the student needs right now, given `student_message`? `tutor_style_now` is the approach in use; keep it when the student is simply continuing the same exchange.',
      criteria: styleCriteria(styles),
    };
  }
  for (const m of misconceptions) {
    const doesNotCount = [...m.notSignatures, 'the tutor saying it', 'the problem statement', 'the student correctly rejecting it'];
    questions[misconceptionKey(m.id)] = {
      type: 'noul',
      instructions: {
        question:
          "Do the student's own words or work in `student_message` (or `student_work_uploaded`) show this belief? Use `recent_conversation` only to understand what they are referring to; a belief shown only in earlier turns does not count.",
        belief: m.title,
        explanation: m.description,
        ...(m.signatures.length ? { sounds_like: m.signatures } : {}),
        does_not_count: doesNotCount,
      },
      criteria: {
        true: 'The student expresses or relies on this belief',
        false: 'The belief is absent, appears only in tutor turns or the problem statement, or the student rejects it',
      },
    };
  }
  return questions;
}

const round = (x) => (typeof x === 'number' && Number.isFinite(x) ? Math.round(x * 1000) / 1000 : null);

function choiceOut(a) {
  if (!a || a.type !== 'choice') return null;
  const probabilities = {};
  for (const [k, v] of Object.entries(a.probabilities || {})) probabilities[k] = round(v);
  return { label: a.choice, confidence: round(a.confidence), probabilities };
}

function noulOut(a) {
  return a && a.type === 'noul' ? round(a.noul) : null;
}

export function emptyRead(reason) {
  return {
    provider: 'none',
    reason,
    intent: null,
    kcType: null,
    showsWork: null,
    completeAttempt: null,
    newProblem: null,
    wantsAnswer: null,
    givingUp: null,
    frustration: null,
    beliefChange: null,
    style: null,
    misconceptions: [],
  };
}

export function normaliseRead(result, misconceptions, provider = 'jev') {
  const a = result.answers || {};
  const found = [];
  for (const m of misconceptions) {
    const p = noulOut(a[misconceptionKey(m.id)]);
    if (p !== null) found.push({ id: m.id, title: m.title, p });
  }
  found.sort((x, y) => y.p - x.p);
  const f = a.frustration && a.frustration.type === 'score' ? { score: round(a.frustration.score), confidence: round(a.frustration.confidence) } : null;
  return {
    provider,
    model: result.model,
    latencyMs: result.latencyMs,
    costUsd: result.costUsd,
    intent: choiceOut(a.intent),
    kcType: choiceOut(a.kc_type),
    showsWork: noulOut(a.shows_work),
    completeAttempt: noulOut(a.complete_attempt),
    newProblem: noulOut(a.new_problem),
    wantsAnswer: noulOut(a.wants_answer),
    givingUp: noulOut(a.giving_up),
    frustration: f,
    beliefChange: choiceOut(a.belief_change),
    style: choiceOut(a.style),
    misconceptions: found,
  };
}

// Fallback when Jev can't be reached: a deterministic keyword read, so a student's visible work
// still raises the ceiling and "just tell me" / "forget it" are still caught. It never claims a
// misconception, a complete attempt or a style — those stay with Jev — so the contrast rungs stay
// locked and routing keeps the current style. Deliberately rough; logged as provider "heuristic".
const ANSWER_RE = /\b(just (give|tell|show) me|give me the (answer|solution|number)|what(?:'?s| is) the (final )?(answer|number|solution)|(can|could) you (just )?(solve|do) (it|this)|solve (it|this) for me)\b/i;
const QUIT_RE = /\b(forget it|i give up|never ?mind|i(?:'?ll| will) just (use|ask) (chat ?gpt|google|someone)|i don'?t have time)\b/i;
// Not "I have" or "I think": "I have a turbine problem, 3 MPa…" is a problem statement, not work.
const FIRST_PERSON_RE = /\b(i got|i used|i found|i wrote|i set|i did|my answer|so i)\b/i;
const EQUATION_RE = /(=\s*[-+(]?\s*[\d.a-z]|\\(frac|Delta|dot))/i;
const PROBLEM_STATEMENT_RE = /\b(find|determine|calculate|compute)\b/i;
const HOW_TO_START_RE = /\b(what do i do|how do i (start|begin|do)|where do i start|what'?s the first|no idea how)\b/i;

export function heuristicRead({ history, attachmentsText = '' }, reason) {
  const latest = buildState({ history }).student_message;
  const text = `${latest}\n${attachmentsText || ''}`;
  const digits = (text.match(/\d/g) || []).length >= 2;
  const work = digits && (FIRST_PERSON_RE.test(text) || (EQUATION_RE.test(text) && !PROBLEM_STATEMENT_RE.test(text) && !HOW_TO_START_RE.test(latest)));
  const wantsAnswer = ANSWER_RE.test(latest);
  const givingUp = QUIT_RE.test(latest);
  return {
    ...emptyRead(reason),
    provider: 'heuristic',
    intent: work ? { label: 'check_work', confidence: null, probabilities: {} } : wantsAnswer ? { label: 'wants_answer', confidence: null, probabilities: {} } : null,
    showsWork: work ? 0.7 : 0.1,
    wantsAnswer: wantsAnswer ? 0.8 : 0.1,
    givingUp: givingUp ? 0.8 : 0.05,
  };
}

// Never throws. Jev reads the message when it is switched on and reachable; otherwise the DeepSeek
// backup answers the same questions; only if both fail does the turn fall back to the keyword read
// above, with the policy at its most conservative for everything keywords can't see.
export async function readTurn({ history, attachmentsText, tutoringState, styles, knowledge, currentStyleId, signal, enabled = true, usage = {} }) {
  const misconceptions = misconceptionCards(knowledge);
  const state = buildState({ history, attachmentsText, tutoringState, currentStyleId });
  if (!state.student_message && !state.student_work_uploaded) return emptyRead('no student message');
  const questions = buildQuestions({ styles, misconceptions });
  const why = [];
  if (enabled) {
    const config = deciderConfig();
    const problem = deciderProblem(config);
    if (problem) why.push(`Jev: ${problem}`);
    else {
      try {
        return normaliseRead(await systemOne({ state, questions, signal, config, usage: { ...usage, purpose: `${usage.via ? `${usage.via}:` : ''}jev_read` } }), misconceptions, 'jev');
      } catch (e) {
        if (signal?.aborted) throw e;
        console.warn(`Jev unavailable this turn, using the backup: ${e.message}`);
        why.push(`Jev: ${e.message}`);
      }
    }
  } else why.push('Jev is turned off in settings');
  const backup = backupConfig();
  const problem = backupProblem(backup);
  if (!problem) {
    try {
      const read = normaliseRead(await backupSystemOne({ state, questions, signal, config: backup, usage: { ...usage, purpose: `${usage.via ? `${usage.via}:` : ''}backup_read` } }), misconceptions, 'llm');
      read.reason = why.join('; ');
      return read;
    } catch (e) {
      if (signal?.aborted) throw e;
      console.warn(`Backup decider unavailable this turn: ${e.message}`);
      why.push(`backup: ${e.message}`);
    }
  } else why.push(`backup: ${problem}`);
  return heuristicRead({ history, attachmentsText }, why.join('; '));
}
