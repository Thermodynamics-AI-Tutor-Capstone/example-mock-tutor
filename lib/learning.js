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

// A readable name for a card id or a slug: the card's title if there is one, otherwise the slug in
// words ("polytropic-n-vs-k-heat-direction" → "Polytropic n vs k heat direction").
function readable(ref, titles) {
  if (titles[ref]) return titles[ref];
  const s = String(ref).replace(/^(misc|topic|eq|student):/, '').replace(/^m\d+-/, '').replace(/[-_]+/g, ' ').trim();
  return s ? s[0].toUpperCase() + s.slice(1) : String(ref);
}

const day = (d) => (d ? String(d).slice(0, 10) : '');
const BELIEF = { solid: 'you know this well', shaky: 'still shaky', misconception: 'a belief to fix', unknown: 'not sure yet' };

// The one document the student sees: everything in their record, in plain words, no ids.
export function studentDocument(model, titles = {}) {
  const miscs = Object.values(model.misconceptions || {}).sort((a, b) => String(b.lastEvidenceAt).localeCompare(String(a.lastEvidenceAt)));
  const open = miscs.filter((x) => x.status !== 'repaired');
  const fixed = miscs.filter((x) => x.status === 'repaired');
  const notes = [...(model.hypotheses || [])].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  const kcs = Object.values(model.kcs || {});
  const lines = ['# What Kelvin knows about you', '', 'Built from your chats. Kelvin uses it to decide what to check first when you ask for help.', ''];
  if (!open.length && !fixed.length && !notes.length && !kcs.length) {
    lines.push('Nothing yet. Kelvin fills this in as you chat.');
    return lines.join('\n');
  }
  const STATUS = { suspected: 'possibly', likely: 'probably', confirmed: 'confirmed', relapsed: 'came back after being fixed' };
  if (open.length) {
    lines.push('## Things you might be mixing up', '');
    for (const x of open) {
      const said = x.lastQuote ? ` You said: "${x.lastQuote.replace(/\s+/g, ' ').slice(0, 140)}"` : '';
      lines.push(`- **${readable(x.ref, titles)}**: ${STATUS[x.status] || x.status}, last noticed ${day(x.lastEvidenceAt)}.${said}`);
    }
    lines.push('');
  }
  if (notes.length) {
    lines.push('## Notes on what you know', '');
    for (const h of notes) lines.push(`- **${readable(h.about, titles)}**: ${BELIEF[h.belief] || h.belief}.${h.note ? ` ${h.note}` : ''} *(${h.source === 'student' ? 'your note' : "Kelvin's note"}, ${day(h.updatedAt)})*`);
    lines.push('');
  }
  if (kcs.length) {
    lines.push('## Practice', '');
    for (const k of kcs) lines.push(`- **${readable(k.ref, titles)}**: ${k.correct} of ${k.attempts} right, streak ${k.streak}${k.mastered ? ', mastered' : ''}.`);
    lines.push('');
  }
  if (fixed.length) {
    lines.push('## Fixed', '');
    for (const x of fixed) lines.push(`- **${readable(x.ref, titles)}**: fixed ${day(x.repairedAt)}. Kelvin will watch for it coming back.`);
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

export async function learningView(userId) {
  const model = await loadStudentModel(userId);
  const refs = [...Object.keys(model.misconceptions || {}), ...Object.keys(model.kcs || {}), ...(model.hypotheses || []).map((h) => h.about)];
  const titles = await titlesFor([...new Set(refs)]);
  return { markdown: studentDocument(model, titles), tutorMarkdown: studentModelSection(model), model, titles };
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
