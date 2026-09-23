#!/usr/bin/env node
// Unit tests for the parts of the tutor that decide how much help a student gets: the policy core
// (help ceiling, attempts, misconception plan), the Auto style router, the student model fold, the
// Jev request builder, and the tutoring-state tool's clamping. No network, no API key, no database.
//
// Run with: npm run agent:test
import assert from 'node:assert/strict';
import os from 'node:os';
import fsx from 'node:fs';
import pathx from 'node:path';
process.env.USAGE_LOG_DIR = fsx.mkdtempSync(pathx.join(os.tmpdir(), 'kelvin-usage-'));
import { applyPolicy, routeStyle, policySection, loadPolicy } from '../lib/policy.js';
import { foldStudentModel, studentModelSection, nextPracticeTargets, emptyModel, DEFAULTS } from '../lib/student-model.js';
import { buildState, buildQuestions, misconceptionKey, normaliseRead, heuristicRead, readTurn, INTENTS } from '../lib/decide.js';
import { evidenceFromRead, decisionSummary, finishTurn } from '../lib/turn.js';
import runUpdateState from '../lib/tools/update_tutoring_state.js';
import runPracticeResult from '../lib/tools/record_practice_result.js';

let n = 0;
const t = async (name, fn) => {
  await fn();
  n++;
  console.log('  ok', name);
};

const policy = loadPolicy();
const style = (id, maxRung = 6, extra = {}) => ({ id, name: id, enabled: true, state: { helpLadder: true, maxRung }, routeWhen: { intents: [] }, ...extra });
const read = (over = {}) => ({
  provider: 'jev',
  intent: { label: 'reply', confidence: 1 },
  kcType: { label: 'procedure', confidence: 1 },
  showsWork: 0.05,
  completeAttempt: 0.05,
  newProblem: 0.05,
  wantsAnswer: 0.05,
  givingUp: 0.01,
  frustration: { score: 0.2, confidence: 0.9 },
  beliefChange: { label: 'new_evidence', confidence: 0.9 },
  style: null,
  misconceptions: [],
  ...over,
});
const OH = style('office-hours');

console.log('policy — help ceiling');

await t('a stuck student with no problem on record starts one at the starting ceiling', () => {
  const { state, turn } = applyPolicy({ style: OH, state: {}, read: read({ intent: { label: 'stuck_on_problem', confidence: 1 } }) });
  assert.equal(state.problemPending, true);
  assert.equal(state.attempts, 0);
  assert.equal(turn.ceiling, policy.ceiling.start);
});

await t('each message with the student\'s own work raises the ceiling by one', () => {
  let s = { problem: 'turbine', attempts: 0, ceiling: 1 };
  for (let i = 1; i <= 3; i++) {
    const r = applyPolicy({ style: OH, state: s, read: read({ showsWork: 0.9 }) });
    s = r.state;
    assert.equal(r.turn.attemptCounted, true);
    assert.equal(s.attempts, i);
    assert.equal(r.turn.ceiling, Math.min(policy.ceiling.start + i, policy.ceiling.without_complete_attempt));
  }
});

await t('asking for the answer does not raise the ceiling', () => {
  const s = { problem: 'turbine', attempts: 1, ceiling: 2 };
  const { state, turn } = applyPolicy({ style: OH, state: s, read: read({ intent: { label: 'wants_answer', confidence: 1 }, wantsAnswer: 0.97 }) });
  assert.equal(state.attempts, 1);
  assert.equal(turn.ceiling, 2);
  assert.equal(turn.wantsAnswer, true);
});

await t('the contrast rungs stay locked until a complete attempt, however many attempts', () => {
  const { turn } = applyPolicy({ style: OH, state: { problem: 'p', attempts: 9, ceiling: 4 }, read: read({ showsWork: 0.9 }) });
  assert.equal(turn.ceiling, 4);
  assert.equal(turn.completeAttempt, false);
  const after = applyPolicy({ style: OH, state: { problem: 'p', attempts: 9, ceiling: 4 }, read: read({ showsWork: 0.9, completeAttempt: 0.95 }) });
  assert.equal(after.turn.completeAttempt, true);
  assert.equal(after.turn.ceiling, 6);
});

await t("the style's max_rung caps the ceiling", () => {
  const { turn } = applyPolicy({ style: style('probe', 4), state: { problem: 'p', attempts: 9, completeAttempt: true }, read: read({ showsWork: 0.9 }) });
  assert.equal(turn.ceiling, 4);
});

await t('the ceiling never drops within a problem, and resets on a new one', () => {
  const s = { problem: 'p', attempts: 2, ceiling: 3 };
  const same = applyPolicy({ style: OH, state: s, read: read({ intent: { label: 'wants_answer', confidence: 1 } }) });
  assert.equal(same.turn.ceiling, 3);
  const fresh = applyPolicy({ style: OH, state: s, read: read({ newProblem: 0.9, intent: { label: 'stuck_on_problem', confidence: 1 } }) });
  assert.equal(fresh.state.attempts, 0);
  assert.equal(fresh.state.completeAttempt, false);
  assert.equal(fresh.turn.ceiling, policy.ceiling.start);
  assert.ok(fresh.turn.events.includes('new problem'));
});

await t('a fact question is answered directly and never counts as an attempt', () => {
  const { turn, state } = applyPolicy({ style: OH, state: { problem: 'p', attempts: 0 }, read: read({ intent: { label: 'fact', confidence: 1 }, kcType: { label: 'fact' }, showsWork: 0.9, wantsAnswer: 0.7 }) });
  assert.equal(turn.answerDirectly, true);
  assert.equal(turn.wantsAnswer, false);
  assert.equal(state.attempts, 0);
});

await t('giving up parks the problem; coming back with work un-parks it', () => {
  const parked = applyPolicy({ style: OH, state: { problem: 'p', attempts: 1 }, read: read({ givingUp: 0.97, frustration: { score: 3 } }) });
  assert.equal(parked.state.status, 'parked');
  assert.equal(parked.turn.givingUp, true);
  const back = applyPolicy({ style: OH, state: parked.state, read: read({ showsWork: 0.9 }) });
  assert.equal(back.state.status, 'working');
});

await t('frustration after an attempt adds one rung', () => {
  const calm = applyPolicy({ style: OH, state: { problem: 'p', attempts: 1, ceiling: 2 }, read: read() });
  const upset = applyPolicy({ style: OH, state: { problem: 'p', attempts: 1, ceiling: 2 }, read: read({ frustration: { score: 2.5 } }) });
  assert.equal(upset.turn.ceiling, calm.turn.ceiling + policy.ceiling.frustration_bonus);
  assert.equal(upset.turn.frustrated, true);
});

await t('with no classifier read, nothing is counted and the turn says so', () => {
  const { turn, state } = applyPolicy({ style: OH, state: { problem: 'p', attempts: 1, ceiling: 2 }, read: { provider: 'none', reason: 'OPENROUTER_API_KEY is not set', misconceptions: [] } });
  assert.equal(turn.readAvailable, false);
  assert.equal(state.attempts, 1);
  assert.equal(turn.ceiling, 2);
  assert.match(policySection({ style: OH, state, turn }), /No classifier read this turn \(OPENROUTER_API_KEY is not set\)/);
});

await t('replies without an attempt are counted as stalls, and two in a row tell the tutor to hold the step', () => {
  let s = { problem: 'p', attempts: 0, ceiling: 1 };
  let r = applyPolicy({ style: OH, state: s, read: read({ intent: { label: 'reply' }, showsWork: 0.1 }) });
  assert.equal(r.turn.stalls, 1);
  assert.equal(r.turn.stalled, false);
  r = applyPolicy({ style: OH, state: r.state, read: read({ intent: { label: 'wants_answer' }, showsWork: 0.05, wantsAnswer: 0.9 }) });
  assert.equal(r.turn.stalled, true);
  assert.equal(r.turn.ceiling, 1);
  assert.match(policySection({ style: OH, state: r.state, turn: r.turn }), /answered 2 times in a row without doing the step/);
  const worked = applyPolicy({ style: OH, state: r.state, read: read({ showsWork: 0.9 }) });
  assert.equal(worked.turn.stalls, 0);
});

console.log('policy — misconception plan');

const cards = [
  { id: 'misc:a', confusableWith: [{ id: 'misc:b', separatingQuestion: 'Does T change?' }] },
  { id: 'misc:b', confusableWith: [{ id: 'misc:a', separatingQuestion: 'Does T change?' }] },
];

await t('one clear strong signal → repair', () => {
  const { turn } = applyPolicy({ style: OH, state: {}, read: read({ misconceptions: [{ id: 'misc:a', title: 'A', p: 0.96 }, { id: 'misc:b', title: 'B', p: 0.3 }] }), cards });
  assert.equal(turn.misconceptions.action, 'repair');
  assert.deepEqual(turn.misconceptions.candidates.map((c) => c.id), ['misc:a']);
});

await t('two near-equal strong signals → confirm first, with the cards\' separating question', () => {
  const { turn } = applyPolicy({ style: OH, state: {}, read: read({ misconceptions: [{ id: 'misc:a', title: 'A', p: 0.96 }, { id: 'misc:b', title: 'B', p: 0.93 }] }), cards });
  assert.equal(turn.misconceptions.action, 'confirm');
  assert.equal(turn.misconceptions.candidates.length, 2);
  assert.deepEqual(turn.misconceptions.separating, ['Does T change?']);
});

await t('a medium signal → confirm; a weak one → none', () => {
  assert.equal(applyPolicy({ style: OH, state: {}, read: read({ misconceptions: [{ id: 'misc:a', title: 'A', p: 0.65 }] }) }).turn.misconceptions.action, 'confirm');
  assert.equal(applyPolicy({ style: OH, state: {}, read: read({ misconceptions: [{ id: 'misc:a', title: 'A', p: 0.3 }] }) }).turn.misconceptions.action, 'none');
});

await t('the prompt section names the ceiling, the next locked rung and the repair', () => {
  const { state, turn } = applyPolicy({ style: OH, state: { problem: 'turbine', attempts: 0 }, read: read({ misconceptions: [{ id: 'misc:a', title: 'A', p: 0.96 }] }), cards });
  const text = policySection({ style: OH, state, turn });
  assert.match(text, /Help ceiling: rung 1 of 6 — Principle/);
  assert.match(text, /- 2 Error class: locked/);
  assert.match(text, /Misconception — repair:.*`misc:a`/);
  assert.doesNotMatch(text, /- 3 Misconception/);
});

console.log('router');

const styles = [
  style('office-hours', 6, { routeWhen: { intents: ['concept'] } }),
  style('pinpointer', 6, { routeWhen: { intents: ['check_work'] } }),
  style('practice', 4, { routeWhen: { intents: ['practice'] } }),
];
const pick = (label, confidence, over = {}) => read({ style: { label, confidence }, ...over });

await t('a pinned style always wins', () => {
  const r = routeStyle({ pinnedId: 'practice', styles, read: pick('pinpointer', 1), state: {}, defaultId: 'office-hours' });
  assert.equal(r.style.id, 'practice');
  assert.equal(r.auto, false);
});

await t('Auto takes Jev\'s pick when nothing is running yet', () => {
  const r = routeStyle({ pinnedId: 'auto', styles, read: pick('pinpointer', 0.4), state: {}, defaultId: 'office-hours' });
  assert.equal(r.style.id, 'pinpointer');
  assert.equal(r.auto, true);
});

await t('a reply within the exchange keeps the current style even on a confident pick', () => {
  const r = routeStyle({ pinnedId: null, styles, read: pick('practice', 0.9, { intent: { label: 'reply' } }), state: { routedStyle: 'pinpointer' }, defaultId: 'office-hours' });
  assert.equal(r.style.id, 'pinpointer');
});

await t('a confident pick on a new kind of request switches; a weak one does not', () => {
  const strong = routeStyle({ pinnedId: null, styles, read: pick('practice', 0.9, { intent: { label: 'practice' } }), state: { routedStyle: 'pinpointer' }, defaultId: 'office-hours' });
  assert.equal(strong.style.id, 'practice');
  const weak = routeStyle({ pinnedId: null, styles, read: pick('practice', 0.3, { intent: { label: 'practice' } }), state: { routedStyle: 'pinpointer' }, defaultId: 'office-hours' });
  assert.equal(weak.style.id, 'pinpointer');
});

await t('a new problem switches regardless of confidence', () => {
  const r = routeStyle({ pinnedId: null, styles, read: pick('office-hours', 0.2, { newProblem: 0.9, intent: { label: 'concept' } }), state: { routedStyle: 'pinpointer' }, defaultId: 'office-hours' });
  assert.equal(r.style.id, 'office-hours');
});

await t('with no read: keep the current style, else map the intent, else the default', () => {
  const none = { provider: 'none', misconceptions: [] };
  assert.equal(routeStyle({ styles, read: none, state: { routedStyle: 'practice' }, defaultId: 'office-hours' }).style.id, 'practice');
  assert.equal(routeStyle({ styles, read: read({ intent: { label: 'check_work' } }), state: {}, defaultId: 'office-hours' }).style.id, 'pinpointer');
  assert.equal(routeStyle({ styles, read: none, state: {}, defaultId: 'office-hours' }).style.id, 'office-hours');
});

await t('an unusable style is never chosen', () => {
  const r = routeStyle({ pinnedId: null, styles, read: pick('pinpointer', 1), state: {}, usable: (s) => s.id !== 'pinpointer', defaultId: 'office-hours' });
  assert.equal(r.style.id, 'office-hours');
});

console.log('student model');

const at = (d) => new Date(`2026-09-${String(d).padStart(2, '0')}T12:00:00Z`);
const row = (d, kind, ref, extra = {}) => ({ created_at: at(d), kind, ref, source: 'tutor', probability: null, data: {}, ...extra });
const NOW = at(22);

await t('BKT: independent correct raises P(known), independent incorrect lowers it, helped leaves it alone', () => {
  const up = foldStudentModel([row(1, 'practice_result', 'k', { data: { correct: true, independent: true } })], { now: NOW });
  assert.ok(up.kcs.k.pKnown > DEFAULTS.bkt.pInit);
  const down = foldStudentModel([row(1, 'practice_result', 'k', { data: { correct: false, independent: true } })], { now: NOW });
  assert.ok(down.kcs.k.pKnown < up.kcs.k.pKnown);
  const helped = foldStudentModel([row(1, 'practice_result', 'k', { data: { correct: true, independent: false } })], { now: NOW });
  assert.equal(helped.kcs.k.pKnown, DEFAULTS.bkt.pInit);
  assert.equal(helped.kcs.k.streak, 0);
  assert.equal(helped.kcs.k.attempts, 1);
});

await t('three independent correct in a row is mastery; an independent miss resets the streak', () => {
  const ok = (d) => row(d, 'practice_result', 'k', { data: { correct: true, independent: true } });
  const m = foldStudentModel([ok(18), ok(19), ok(20)], { now: NOW });
  assert.equal(m.kcs.k.streak, 3);
  assert.equal(m.kcs.k.mastered, true);
  assert.equal(m.kcs.k.due, false);
  const miss = foldStudentModel([ok(18), ok(19), row(20, 'practice_result', 'k', { data: { correct: false, independent: true } })], { now: NOW });
  assert.equal(miss.kcs.k.streak, 0);
  assert.equal(miss.kcs.k.mastered, false);
});

await t('a later hypothesis about the same thing replaces the earlier one; retire removes it', () => {
  const h = (d, belief) => row(d, 'hypothesis', 'topic:x', { data: { about: 'topic:x', belief, note: belief } });
  const m = foldStudentModel([h(1, 'shaky'), h(5, 'solid')], { now: NOW });
  assert.equal(m.hypotheses.length, 1);
  assert.equal(m.hypotheses[0].belief, 'solid');
  assert.equal(m.hypotheses[0].createdAt, at(1).toISOString());
  const gone = foldStudentModel([h(1, 'shaky'), row(5, 'hypothesis_retired', 'topic:x')], { now: NOW });
  assert.equal(gone.hypotheses.length, 0);
});

await t('misconception status: suspected → likely → confirmed → repaired → relapsed → repaired', () => {
  const sig = (d, p = 0.9) => ({ created_at: at(d), kind: 'misconception_signal', ref: 'misc:m', source: 'jev', probability: p, data: { quote: 'insulated so s2 = s1' } });
  const steps = [sig(1)];
  assert.equal(foldStudentModel(steps, { now: NOW }).misconceptions['misc:m'].status, 'suspected');
  steps.push(sig(2));
  assert.equal(foldStudentModel(steps, { now: NOW }).misconceptions['misc:m'].status, 'likely');
  steps.push(row(3, 'misconception_confirmed', 'misc:m'));
  assert.equal(foldStudentModel(steps, { now: NOW }).misconceptions['misc:m'].status, 'confirmed');
  steps.push(row(4, 'misconception_repaired', 'misc:m'));
  assert.equal(foldStudentModel(steps, { now: NOW }).misconceptions['misc:m'].status, 'repaired');
  steps.push(sig(10));
  assert.equal(foldStudentModel(steps, { now: NOW }).misconceptions['misc:m'].status, 'relapsed');
  steps.push(row(11, 'misconception_repaired', 'misc:m'));
  const m = foldStudentModel(steps, { now: NOW }).misconceptions['misc:m'];
  assert.equal(m.status, 'repaired');
  assert.equal(m.repairedAt, at(11).toISOString());
});

await t('weak signals do not count toward "likely"', () => {
  const sig = (d) => ({ created_at: at(d), kind: 'misconception_signal', ref: 'misc:m', source: 'jev', probability: 0.4, data: {} });
  const m = foldStudentModel([sig(1), sig(2), sig(3)], { now: NOW }).misconceptions['misc:m'];
  assert.equal(m.signals, 0);
  assert.equal(m.status, 'suspected');
});

await t('beliefs without new evidence for staleDays are marked old', () => {
  const m = foldStudentModel([row(1, 'misconception_confirmed', 'misc:m')], { now: new Date('2026-10-30T00:00:00Z') });
  assert.equal(m.misconceptions['misc:m'].stale, true);
  assert.match(studentModelSection(m), /\*\*Confirmed:\*\* `misc:m` \(2026-09-01\) \(old\)/);
});

await t('the prompt section orders by priority and truncates with a count', () => {
  const rows = [
    row(1, 'misconception_repaired', 'misc:r'),
    row(2, 'misconception_confirmed', 'misc:c'),
    row(3, 'hypothesis', 'topic:h', { data: { about: 'topic:h', belief: 'shaky', note: 'mixes h and u' } }),
  ];
  const text = studentModelSection(foldStudentModel(rows, { now: NOW }));
  assert.ok(text.indexOf('Confirmed') < text.indexOf('Hypothesis'));
  assert.ok(text.indexOf('Hypothesis') < text.indexOf('Repaired'));
  const cut = studentModelSection(foldStudentModel(rows, { now: NOW }), { maxLines: 1 });
  assert.match(cut, /…and 2 more\./);
  assert.match(studentModelSection(emptyModel()), /Nothing recorded yet/);
});

await t('practice targets: misconceptions first, then weakest due skills, then shaky hypotheses, no duplicates', () => {
  const rows = [
    row(1, 'practice_result', 'topic:weak', { data: { correct: false, independent: true } }),
    row(1, 'practice_result', 'topic:ok', { data: { correct: true, independent: true } }),
    row(2, 'misconception_confirmed', 'misc:c'),
    row(3, 'hypothesis', 'misc:c', { data: { about: 'misc:c', belief: 'misconception' } }),
  ];
  const targets = nextPracticeTargets(foldStudentModel(rows, { now: NOW }), { limit: 5 });
  assert.deepEqual(targets.map((x) => x.ref), ['misc:c', 'topic:weak', 'topic:ok']);
});

console.log('decider request');

await t('the state is the last student message plus a short window of earlier turns', () => {
  const history = [
    { role: 'user', content: 'first' },
    { role: 'assistant', content: 'q?' },
    { role: 'user', content: 'latest' },
  ];
  const s = buildState({ history, tutoringState: { problem: 'turbine' }, currentStyleId: 'pinpointer', attachmentsText: '## work' });
  assert.equal(s.student_message, 'latest');
  assert.deepEqual(s.recent_conversation.map((x) => x.speaker), ['student', 'tutor']);
  assert.equal(s.current_problem, 'turbine');
  assert.equal(s.student_work_uploaded, '## work');
});

await t('one noul per misconception card, carrying its signatures; one style choice when there are styles', () => {
  const qs = buildQuestions({
    styles: [style('a', 6, { routeWhen: { use_for: 'x', examples: ['e'] } }), style('b', 6, { routeWhen: { use_for: 'y' } })],
    misconceptions: [{ id: 'misc:m15-x', title: 'T', description: 'D', signatures: ['s1'], notSignatures: ['n1'] }],
  });
  const key = misconceptionKey('misc:m15-x');
  assert.equal(key, 'misc_m15_x');
  assert.equal(qs[key].type, 'noul');
  assert.deepEqual(qs[key].instructions.sounds_like, ['s1']);
  assert.ok(qs[key].instructions.does_not_count.includes('n1'));
  assert.deepEqual(Object.keys(qs.style.criteria), ['a', 'b']);
  assert.deepEqual(Object.keys(qs.intent.criteria), Object.keys(INTENTS));
  assert.equal(buildQuestions({ styles: [style('a')], misconceptions: [] }).style, undefined);
});

await t('answers are normalised and misconceptions sorted by probability', () => {
  const r = normaliseRead(
    {
      model: 'jev',
      latencyMs: 200,
      answers: {
        intent: { type: 'choice', choice: 'check_work', confidence: 1, probabilities: { check_work: 1 } },
        shows_work: { type: 'noul', noul: 0.9612 },
        misc_a: { type: 'noul', noul: 0.2 },
        misc_b: { type: 'noul', noul: 0.8 },
      },
    },
    [{ id: 'misc:a', title: 'A' }, { id: 'misc:b', title: 'B' }]
  );
  assert.equal(r.intent.label, 'check_work');
  assert.equal(r.showsWork, 0.961);
  assert.deepEqual(r.misconceptions.map((m) => m.id), ['misc:b', 'misc:a']);
});

await t('evidence: strong signals are written; a "no change" turn writes only repair-strength ones', () => {
  const history = [{ role: 'user', content: 'insulated so s2 = s1' }];
  const r = read({ misconceptions: [{ id: 'misc:a', p: 0.95 }, { id: 'misc:b', p: 0.7 }, { id: 'misc:c', p: 0.3 }] });
  assert.deepEqual(evidenceFromRead(r, history).map((e) => e.ref), ['misc:a', 'misc:b']);
  const quiet = { ...r, beliefChange: { label: 'no_change', confidence: 0.9 } };
  assert.deepEqual(evidenceFromRead(quiet, history).map((e) => e.ref), ['misc:a']);
  assert.equal(evidenceFromRead({ provider: 'none', misconceptions: [] }, history).length, 0);
});

await t('without Jev, the keyword read counts visible work but not a pasted problem statement', () => {
  const h = (content) => heuristicRead({ history: [{ role: 'user', content }] }, 'no key');
  assert.equal(h('I used W = m(h1 - h2) and got 1403 kW').showsWork >= policy.thresholds.shows_work, true);
  assert.equal(h('A turbine has P1 = 3 MPa and T1 = 400 C. Find the power.').showsWork < policy.thresholds.shows_work, true);
  assert.equal(h('I have a turbine problem, 3 MPa 400C in, 50 kPa x=0.95 out, 2 kg/s. what do I do first?').showsWork < policy.thresholds.shows_work, true);
  assert.equal(h('just give me the answer').wantsAnswer >= policy.thresholds.wants_answer, true);
  assert.equal(h('forget it, I give up').givingUp >= policy.thresholds.giving_up, true);
  const r = h('I used W = m(h1 - h2) and got 1403 kW');
  assert.equal(r.provider, 'heuristic');
  assert.deepEqual(r.misconceptions, []);
  assert.equal(r.completeAttempt, null);
  const { turn } = applyPolicy({ style: OH, state: { problem: 'p', attempts: 0 }, read: r });
  assert.equal(turn.attemptCounted, true);
  assert.equal(turn.completeAttempt, false);
});

console.log('the "Use Jev" switch');

// A fake network: DeepSeek's API answers every question with fixed values; anything else fails.
function fakeDeepSeek(answer) {
  const urls = [];
  const real = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    urls.push(String(url));
    if (!String(url).startsWith('https://api.deepseek.com')) throw new Error(`unexpected request to ${url}`);
    const asked = JSON.parse(JSON.parse(init.body).messages[1].content).questions;
    const out = {};
    for (const [name, q] of Object.entries(asked)) out[name] = answer(name, q);
    return new Response(JSON.stringify({ model: 'deepseek-flash', choices: [{ message: { content: JSON.stringify(out) } }] }), { status: 200 });
  };
  return { urls, restore: () => (globalThis.fetch = real) };
}
const withKey = async (fn) => {
  const had = process.env.DEEPSEEK_API_KEY;
  process.env.DEEPSEEK_API_KEY = 'test-key';
  try {
    await fn();
  } finally {
    if (had === undefined) delete process.env.DEEPSEEK_API_KEY;
    else process.env.DEEPSEEK_API_KEY = had;
  }
};

await t('with the switch off, Jev is never asked; the DeepSeek backup reads the message instead', async () =>
  withKey(async () => {
    const net = fakeDeepSeek((name, q) => (q.type === 'choice' ? { probabilities: { [Object.keys(q.options)[0]]: 1 } } : q.type === 'score' ? { level: 0 } : { p: name === 'shows_work' ? 0.9 : 0.1 }));
    try {
      const r = await readTurn({ history: [{ role: 'user', content: 'I used W = m(h1 - h2) and got 1403 kW' }], enabled: false, styles: [], knowledge: null });
      assert.ok(net.urls.length === 1 && net.urls[0].startsWith('https://api.deepseek.com'));
      assert.equal(r.provider, 'llm');
      assert.equal(r.showsWork, 0.9);
      assert.equal(r.reason, 'Jev is turned off in settings');
    } finally {
      net.restore();
    }
  }));

await t('with the switch off and no backup key, the keyword read takes over and says why', async () => {
  const had = process.env.DEEPSEEK_API_KEY;
  delete process.env.DEEPSEEK_API_KEY;
  const realFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    throw new Error('network must not be used');
  };
  try {
    const r = await readTurn({ history: [{ role: 'user', content: 'I used W = m(h1 - h2) and got 1403 kW' }], enabled: false, styles: [], knowledge: null });
    assert.equal(calls, 0);
    assert.equal(r.provider, 'heuristic');
    assert.ok(r.reason.startsWith('Jev is turned off in settings'));
    assert.equal(r.showsWork >= policy.thresholds.shows_work, true);
  } finally {
    globalThis.fetch = realFetch;
    if (had !== undefined) process.env.DEEPSEEK_API_KEY = had;
  }
});

await t('the decision summary says who decided, what, and how much help', () => {
  const r = read({ intent: { label: 'check_work' }, showsWork: 0.9, latencyMs: 312, misconceptions: [{ id: 'misc:a', title: 'A', p: 0.961 }] });
  const { turn } = applyPolicy({ style: OH, state: { problem: 'p', attempts: 0 }, read: r });
  const s = decisionSummary({ read: r, route: { auto: true }, style: { id: 'office-hours', name: 'Office Hours', icon: 'x' }, turn });
  assert.equal(s.jev, true);
  assert.equal(s.attemptCounted, true);
  assert.equal(s.ceiling, 2);
  assert.equal(s.rungName, 'Error class');
  assert.deepEqual(s.misconception, { action: 'repair', candidates: [{ id: 'misc:a', title: 'A', p: 0.96 }] });
  const off = decisionSummary({ read: heuristicRead({ history: [{ role: 'user', content: 'hi' }] }, 'Jev is turned off in settings'), route: { auto: true }, style: null, turn });
  assert.equal(off.jev, false);
  assert.equal(off.reason, 'Jev is turned off in settings');
});

await t('with the switch off, the reply is still audited, by the backup and never by Jev', async () =>
  withKey(async () => {
    const net = fakeDeepSeek((name) => ({ p: name === 'gives_final_answer' ? 0.95 : 0.05 }));
    try {
      const history = [{ role: 'user', content: 'just give me the answer' }];
      const r = heuristicRead({ history }, 'Jev is turned off in settings');
      const { turn, state } = applyPolicy({ style: OH, state: {}, read: r });
      const out = await finishTurn({ prepared: { read: r, state, turn, route: { auto: true }, style: OH, useJev: false }, conversationId: null, userId: null, history, reply: 'The answer is 42 kJ.' });
      assert.ok(net.urls.every((u) => u.startsWith('https://api.deepseek.com')));
      assert.deepEqual(out.audit.flags, ['answer_leak', 'no_handback']);
    } finally {
      net.restore();
    }
  }));

console.log('update_tutoring_state');

await t('the model cannot record a rung above the ceiling, and naming a problem does not reset the ladder', async () => {
  let saved = null;
  const ctx = {
    style: OH,
    turn: { ceiling: 2 },
    state: { problemPending: true, attempts: 2, ceiling: 2, completeAttempt: false },
    saveState: async (s) => {
      saved = s;
    },
  };
  const out = await runUpdateState({ rung: 6, problem: 'Steam turbine power' }, ctx);
  assert.equal(saved.rung, 2);
  assert.equal(saved.attempts, 2);
  assert.equal(saved.problem, 'Steam turbine power');
  assert.equal(saved.problemPending, false);
  assert.match(out.notes[0], /above this turn's ceiling/);
});

console.log('record_practice_result');

await t('one result per target per message, and none on a message with no attempt', async () => {
  const dup = await runPracticeResult({ target: 'misc:m15', correct: true, independent: true }, { userId: 'u', practiceRecorded: new Set(['misc:m15']) });
  assert.match(dup.error, /Already recorded/);
  const none = await runPracticeResult(
    { target: 'misc:m15', correct: true, independent: true },
    { userId: 'u', read: { provider: 'jev', showsWork: 0.1 }, turn: { attemptCounted: false } }
  );
  assert.match(none.error, /doesn't contain an attempt/);
});

console.log(`\n${n} passed`);
