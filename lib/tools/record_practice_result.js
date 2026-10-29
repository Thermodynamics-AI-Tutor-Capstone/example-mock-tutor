import { isModelRead } from '../decide.js';
import { recordEvidence, loadStudentModel } from '../student-model.js';

export const available = (ctx) => Boolean(ctx.userId);

// Mastery is only as honest as its inputs, so the server holds two lines the model can't argue with:
// one result per target per student message (the persona eval caught the model recording the same
// answer three and four times in one reply, which faked mastery), and none at all on a turn where the
// classifier saw no attempt from the student.
export default async function run(args, ctx) {
  if (ctx.turn?.selfCheck && !ctx.turn.selfCheck.recordable) return { error: 'A help request or repeated self-check answer is not new practice evidence.' };
  const target = typeof args.target === 'string' ? args.target.trim().slice(0, 120) : '';
  if (!target) return { error: 'target is required: the card id or skill that was practised.' };
  if (typeof args.correct !== 'boolean' || typeof args.independent !== 'boolean') {
    return { error: 'correct and independent must both be true or false.' };
  }
  ctx.practiceRecorded ??= new Set();
  if (ctx.practiceRecorded.has(target)) {
    return { error: `Already recorded a result for ${target} on this message. Record one result per attempt, after the student answers.` };
  }
  if (isModelRead(ctx.read) && !ctx.turn?.attemptCounted && !(ctx.read.showsWork >= 0.5)) {
    return { error: "The student's message doesn't contain an attempt, so there is nothing to record yet. Record the result after they answer." };
  }
  ctx.practiceRecorded.add(target);
  const note = typeof args.note === 'string' ? args.note.trim().slice(0, 300) : '';
  const independent = args.independent && (!ctx.turn?.selfCheck || ctx.turn.selfCheck.independence === 'independent');
  await recordEvidence(ctx.userId, ctx.conversationId, [
    { kind: 'practice_result', ref: target, source: 'tutor', data: { correct: args.correct, independent, note } },
  ]);
  const model = await loadStudentModel(ctx.userId);
  return { ok: true, kc: model.kcs[target] || null };
}
