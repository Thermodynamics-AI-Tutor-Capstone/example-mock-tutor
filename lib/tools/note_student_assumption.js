import { recordEvidence, BELIEFS } from '../student-model.js';

export const available = (ctx) => Boolean(ctx.userId);

export function status() {
  return 'Updating learning notes';
}

export default async function run(args, ctx) {
  const about = typeof args.about === 'string' ? args.about.trim().slice(0, 120) : '';
  if (!about) return { error: 'about is required: a card id such as "topic:…" or "misc:…", or a short skill name.' };
  const retire = args.retire === true;
  const belief = typeof args.belief === 'string' ? args.belief.trim() : '';
  if (!retire && !BELIEFS.includes(belief)) return { error: `belief must be one of ${BELIEFS.join(', ')} (or pass retire: true).` };
  const confidence = Number.isFinite(Number(args.confidence)) ? Math.max(0, Math.min(1, Number(args.confidence))) : null;
  const note = typeof args.note === 'string' ? args.note.trim().slice(0, 300) : '';
  const recorded = retire ? { about, retired: true } : { about, belief, note, confidence };
  await recordEvidence(ctx.userId, ctx.conversationId, [
    { kind: retire ? 'hypothesis_retired' : 'hypothesis', ref: about, source: 'tutor', probability: confidence, data: recorded },
  ]);
  return { ok: true, recorded };
}
