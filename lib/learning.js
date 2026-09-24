import { loadStudentModel, recordEvidence, studentModelSection, BELIEFS } from './student-model.js';
import { loadKnowledge } from './knowledge.js';

// Settings → "What Kelvin knows": everything the student model holds about this student, the exact
// Markdown block the tutor is given each turn, and the student's corrections. Corrections are new
// evidence with source "student" (lib/student-model.js), never deletions: the ledger keeps all of it.

const NOTE_MAX = 300;
const ABOUT_MAX = 120;

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function titlesFor(refs) {
  const knowledge = await loadKnowledge().catch(() => null);
  const out = {};
  for (const ref of refs) {
    const card = knowledge?.findCard?.(ref);
    if (card?.title) out[ref] = card.title;
  }
  return out;
}

export async function learningView(userId) {
  const model = await loadStudentModel(userId);
  const refs = [...Object.keys(model.misconceptions || {}), ...Object.keys(model.kcs || {}), ...(model.hypotheses || []).map((h) => h.about)];
  return { model, markdown: studentModelSection(model), titles: await titlesFor([...new Set(refs)]) };
}

const text = (v, max) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

// One correction from the student. Only items that are in their model can be changed.
export async function applyLearningEdit(userId, body = {}) {
  const model = await loadStudentModel(userId);
  const action = String(body.action || '');
  const ref = typeof body.ref === 'string' ? body.ref : '';
  const note = (h) => (model.hypotheses || []).find((x) => x.ref === h || x.about === h);
  let event;
  if (action === 'dismiss_misconception' || action === 'repair_misconception') {
    if (!model.misconceptions?.[ref]) throw httpError(404, 'That misconception is not in your record.');
    event = { kind: action === 'dismiss_misconception' ? 'misconception_dismissed' : 'misconception_repaired', ref, data: { by: 'student' } };
  } else if (action === 'edit_note' || action === 'add_note') {
    const belief = BELIEFS.includes(body.belief) ? body.belief : null;
    if (!belief) throw httpError(400, `belief must be one of ${BELIEFS.join(', ')}`);
    const noteText = text(body.note, NOTE_MAX);
    let about;
    let target;
    if (action === 'edit_note') {
      const existing = note(ref);
      if (!existing) throw httpError(404, 'That note is not in your record.');
      target = existing.ref || existing.about;
      about = existing.about;
    } else {
      about = text(body.about, ABOUT_MAX);
      if (!about) throw httpError(400, 'Say what the note is about.');
      target = `student:${about.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'note'}`;
    }
    event = { kind: 'hypothesis', ref: target, data: { about, belief, note: noteText, by: 'student' } };
  } else if (action === 'remove_note') {
    const existing = note(ref);
    if (!existing) throw httpError(404, 'That note is not in your record.');
    event = { kind: 'hypothesis_retired', ref: existing.ref || existing.about, data: { by: 'student' } };
  } else if (action === 'reset_practice') {
    if (!model.kcs?.[ref]) throw httpError(404, 'That practice record is not in your record.');
    event = { kind: 'practice_reset', ref, data: { by: 'student' } };
  } else {
    throw httpError(400, 'Unknown action.');
  }
  await recordEvidence(userId, null, [{ ...event, source: 'student' }]);
  return learningView(userId);
}
