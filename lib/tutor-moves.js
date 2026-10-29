// A next teaching move, not a diagnosis or grade. The optional classifier read
// preserves its alternatives; missing or uncertain reads fall back to useful help.
// This beta threshold is a routing heuristic, not a calibrated learner probability.
const NEED_CONFIDENCE = 0.65;
const MOVES = {
  clarify_task: ['clarify', 'A missing given or condition changes the answer.', 'Ask one focused clarification. Explain the setup already supported by the givens, and label any conditional result.'],
  clarify_reasoning: ['ask', 'Different plausible readings of the student’s reasoning call for different help.', 'Ask one short question that separates those readings. Do not name a misconception before the evidence supports it.'],
  explain_concept: ['explain', 'The student needs meaning or a missing prerequisite.', 'Give a concise explanation with a concrete example or representation. Do not ask the student to derive a prerequisite they have not learned.'],
  demonstrate_step: ['demonstrate', 'The student needs a usable next step or plan.', 'Demonstrate the next useful step of their actual problem and explain why it applies. Offer an optional step for them to try.'],
  hint: ['hint', 'The student wants a cue while retaining the work.', 'Give one targeted hint linked to their current step. Offer a demonstration if the hint does not help.'],
  check_work: ['feedback', 'The student has supplied reasoning to check.', 'Identify what is supported, explain the first consequential error if present, and give a concrete next action. Verify calculations before confirming them.'],
  independent_check: ['invite_attempt', 'The student chose to probe their understanding.', 'Offer one relevant question or new case, then wait for their attempt. Give hints or explanations whenever requested; record that assistance honestly.'],
};

export function chooseTutoringMove({ read, turn = {} } = {}) {
  const need = read?.learningNeed;
  const trustedRead = read?.provider === 'jev' || read?.provider === 'llm';
  const selected = trustedRead && Number.isFinite(need?.confidence) && need.confidence >= NEED_CONFIDENCE && need.confidence <= 1
    && Object.hasOwn(MOVES, need.label) ? need.label : null;
  const make = (key, source = 'context') => {
    const [move, reason, instruction] = MOVES[key];
    return { move, reason, instruction, source };
  };

  // The explicit self-check controls are server-owned task context and take
  // precedence over a classifier's guess about the requested help.
  if (turn.selfCheck) {
    const action = turn.selfCheck.action;
    if (action === 'hint') return make('hint', 'self-check');
    if (action === 'explain') return make('demonstrate_step', 'self-check');
    if (action === 'finish') return {
      move: 'summarize', source: 'self-check', reason: 'The student finished this self-check.',
      instruction: 'Briefly summarize the observed reasoning and assistance. Offer another case or a return to About Me; do not manufacture a score or mastery.',
    };
    if (action === 'answer') return make('check_work', 'self-check');
  }

  // Necessary problem information still matters during frustration or a request
  // for a full solution. A learner hypothesis never licenses invented givens.
  if (selected === 'clarify_task') return make(selected, 'classifier');
  if (turn.answerDirectly) return {
    move: 'answer', reason: 'This is a fact or convention.', source: 'context',
    instruction: 'Answer directly and briefly, using the appropriate lookup or calculation. No diagnostic question is needed.',
  };
  if (turn.stalled || turn.frustrated || turn.givingUp || turn.wantsAnswer) return make('demonstrate_step');
  if (selected) return make(selected, 'classifier');
  if (turn.intent === 'practice' || turn.intent === 'teach_back') return make('independent_check');
  if (turn.intent === 'check_work') return make('check_work');
  if (turn.intent === 'stuck_on_problem') return make('demonstrate_step');
  return make('explain_concept', 'fallback');
}

export function tutoringMoveSection(move) {
  return [
    `## Next tutoring move: ${move.move}`,
    `${move.reason} ${move.instruction}`,
    'This is a provisional choice, not a learner diagnosis. Reconcile it with the actual message, task, and recent evidence in the student profile; never treat a classifier score as a grade.',
    'Ask a question only when it resolves an ambiguity that changes the help, supports a useful reasoning step, or checks understanding during practice. Do not append a question by habit. A missing fact, typing shortcut, or request for help is not a misconception.',
    'Use the knowledge dimensions as complementary lenses: situational (recognize conditions), conceptual (explain meaning), procedural (carry out steps), and strategic (plan and monitor). Verbal/pictorial and general/domain-specific describe representations and scope, not rankings or fixed learning styles.',
    'After a response, revise the working hypothesis using the student’s own reasoning. Separate assistance from independent application, retain uncertainty, and change approach when the current help is not working. Offer a new-case check when useful; never require one before helping.',
  ].join('\n\n');
}
