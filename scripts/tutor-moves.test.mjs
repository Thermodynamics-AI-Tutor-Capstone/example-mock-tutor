import assert from 'node:assert/strict';
import { chooseTutoringMove, tutoringMoveSection } from '../lib/tutor-moves.js';
import { buildQuestions, normaliseRead, emptyRead } from '../lib/decide.js';
import { applyPolicy, policySection } from '../lib/policy.js';
import { loadStyles } from '../lib/styles.js';

const read = (label, confidence = 0.9) => ({ provider: 'jev', learningNeed: { label, confidence } });
const pick = (label, turn = {}) => chooseTutoringMove({ read: read(label), turn });
assert.equal(pick('clarify_task', { wantsAnswer: true, frustrated: true }).move, 'clarify', 'a full-solution request must not invent a missing given');
assert.equal(pick('clarify_reasoning').move, 'ask');
assert.equal(pick('clarify_reasoning', { answerDirectly: true }).move, 'answer', 'a lookup should not become a reasoning quiz');
for (const flag of ['stalled', 'frustrated', 'givingUp', 'wantsAnswer']) {
  assert.equal(pick('clarify_reasoning', { [flag]: true }).move, 'demonstrate', `change approach for ${flag}`);
}
assert.equal(pick('hint').move, 'hint');
assert.equal(pick('explain_concept').move, 'explain');
assert.equal(pick('independent_check').move, 'invite_attempt');
assert.equal(pick('check_work').move, 'feedback');
assert.equal(chooseTutoringMove({ read: read('clarify_reasoning', 0.51) }).move, 'explain', 'uncertain classification does not force a quiz');
assert.equal(chooseTutoringMove({ read: { ...read('clarify_reasoning'), provider: 'heuristic' } }).move, 'explain', 'keywords must not diagnose the learner');
assert.equal(chooseTutoringMove({ read: read('invented_diagnosis') }).move, 'explain');
assert.equal(chooseTutoringMove({ read: read('clarify_reasoning', 1.5) }).move, 'explain');
assert.equal(chooseTutoringMove({ read: emptyRead('unavailable'), turn: { intent: 'practice' } }).move, 'invite_attempt', 'explicit practice still works without classifier');
assert.equal(chooseTutoringMove().move, 'explain');
for (const [action, move] of [['hint', 'hint'], ['explain', 'demonstrate'], ['answer', 'feedback'], ['finish', 'summarize']]) {
  assert.equal(pick('explain_concept', { selfCheck: { action } }).move, move, 'explicit self-check action overrides inferred need');
}
console.log('ok needed clarification, useful questions, direct help, hints, practice, and uncertain-read fallbacks');

const questions = buildQuestions({});
assert.equal(questions.learning_need.type, 'choice');
const raw = { answers: { learning_need: { type: 'choice', choice: 'clarify_reasoning', confidence: 0.52, probabilities: { clarify_reasoning: 0.52, explain_concept: 0.48 } } } };
const normalized = normaliseRead(raw, []);
assert.deepEqual(normalized.learningNeed.probabilities, { clarify_reasoning: 0.52, explain_concept: 0.48 });
assert.equal(normaliseRead({ answers: {} }, []).learningNeed, null, 'older and partial classifier responses remain supported');
assert.equal(emptyRead('off').learningNeed, null);

const style = loadStyles().styles.find(s => s.enabled);
const result = applyPolicy({ style, state: { problem: 'adiabatic turbine' }, read: { ...read('explain_concept'), intent: { label: 'concept' }, showsWork: 0 } });
assert.equal(result.turn.tutoringMove.move, 'explain');
assert.equal(result.turn.ceiling, 6, 'support remains available before an attempt');
assert.equal(result.state.attempts, undefined, 'selecting support manufactures no evidence');
assert.equal(result.state.misconceptions, undefined, 'selecting support does not record a diagnosis');
const prompt = policySection({ style, state: result.state, turn: result.turn });
assert.match(prompt, /Next tutoring move: explain/);
assert.match(prompt, /not a learner diagnosis/);
const selfCheckPrompt = policySection({ style, state: result.state, turn: { ...result.turn, selfCheck: { action: 'hint' } } });
assert.match(selfCheckPrompt, /Next tutoring move: hint/, 'late self-check context is honored by the final prompt');
assert.match(tutoringMoveSection(pick('check_work')), /independent application/);
console.log('ok optional classifier compatibility, retained alternatives, guided policy integration, and no invented learner evidence');
