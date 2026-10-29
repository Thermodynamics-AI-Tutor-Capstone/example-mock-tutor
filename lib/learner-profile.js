import { STUDENT_SKILLS, KNOWLEDGE_TYPES } from './student-skills.js';

const STATE = {
  unknown: 'Not enough evidence', assisted: 'With help', independent: 'Demonstrated independently',
  support: 'A useful next practice', mixed: 'Mixed evidence',
};
const sourceName = (source) => source === 'student' ? 'Your correction' : source === 'jev' ? 'Possible pattern noticed by Kelvin' : source === 'server' ? 'Recorded activity' : 'Tutor observation';
const date = (value) => value ? String(value).slice(0, 10) : null;
const label = (ref, titles) => titles[ref] || STUDENT_SKILLS[ref] || String(ref).replace(/^(misc|topic|eq|student):/, '').replace(/[-_]+/g, ' ');

function summarize(observations, now) {
  const fresh = observations.filter((o) => now.getTime() - new Date(o.at).getTime() <= 21 * 86400000);
  const clear = fresh.filter((o) => o.confidence !== 'low');
  const success = clear.some((o) => o.outcome === 'success' && o.independence === 'independent');
  const support = clear.some((o) => o.outcome === 'needs_support');
  const state = success && support ? 'mixed' : support ? 'support' : success ? 'independent'
    : clear.some((o) => o.outcome === 'success' && o.independence === 'assisted') ? 'assisted' : 'unknown';
  const stale = observations.length > 0 && fresh.length === 0;
  return { state, statusLabel: stale ? 'Older evidence—check again' : STATE[state], evidenceCount: observations.length, stale,
    confidence: clear.length >= 3 && state !== 'mixed' ? 'Several observations' : 'Tentative',
    lastEvidenceAt: observations.at(-1)?.at || null };
}

// A presentation of the existing account-scoped ledger, never a second learner model or a grade.
// An evidence kind (e.g. calculation) does not prove a knowledge type: old untagged rows stay unclassified.
export function learnerProfile(model, titles = {}, rows = [], { now = new Date() } = {}) {
  const topics = Object.entries(model.skills || {}).map(([ref, skill]) => {
    const evidence = (skill.observations || []).map((o) => ({ ...o, sourceLabel: sourceName(o.source) }));
    const summary = summarize(evidence, now);
    return { ref, label: skill.label || label(ref, titles), ...summary, stale: Boolean(skill.stale) || summary.stale, evidence,
      dimensions: Object.entries(KNOWLEDGE_TYPES).map(([id, meaning]) => ({ id, ...meaning,
        ...summarize(evidence.filter((o) => o.knowledgeType === id), now) })),
      unclassifiedCount: evidence.filter((o) => !o.knowledgeType).length };
  }).sort((a, b) => String(b.lastEvidenceAt).localeCompare(String(a.lastEvidenceAt)));
  const last = new Map();
  for (const row of rows) if (row.kind.startsWith('misconception_')) last.set(row.ref, row);
  const misconceptions = Object.values(model.misconceptions || {}).map((m) => {
    const latest = last.get(m.ref);
    const studentResolved = m.status === 'repaired' && latest?.source === 'student';
    const statuses = { suspected: 'Possible pattern', likely: 'Pattern to check', confirmed: 'Observed in discussion',
      relapsed: 'Worth revisiting', repaired: studentResolved ? 'You marked this resolved' : 'Tutor recorded a successful revisit' };
    return { ref: m.ref, label: label(m.ref, titles), status: m.status, statusLabel: statuses[m.status] || 'Possible pattern',
      quote: m.lastQuote || '', at: m.lastEvidenceAt, stale: Boolean(m.stale), sourceLabel: sourceName(latest?.source),
      evidenceNote: studentResolved ? 'Your update is recorded as self-report, not independent assessment.'
        : m.status === 'repaired' ? 'This record does not establish mastery in a new situation.' : 'This is a revisable interpretation of your work.' };
  }).sort((a, b) => String(b.at).localeCompare(String(a.at)));
  const notes = (model.hypotheses || []).map((h) => ({ ref: h.ref, label: label(h.about, titles), note: h.note,
    sourceLabel: h.source === 'student' ? 'Your note' : 'Kelvin’s working hypothesis', at: h.updatedAt, stale: Boolean(h.stale) }));
  const practice = Object.values(model.kcs || {}).map((k) => ({ ref: k.ref, label: label(k.ref, titles),
    attempts: k.attempts, independentAttempts: k.independentAttempts, lastPracticedAt: k.lastPracticedAt }));
  return { version: 1, topics, misconceptions, notes, practice, evidenceCount: model.evidenceCount || 0,
    strengths: topics.filter((t) => t.state === 'independent' && !t.stale).map((t) => t.ref),
    nextPractice: topics.filter((t) => ['support', 'mixed', 'assisted'].includes(t.state) || t.stale).map((t) => t.ref),
    latestDate: date([...topics.map((t) => t.lastEvidenceAt), ...misconceptions.map((m) => m.at), ...notes.map((n) => n.at)].filter(Boolean).sort().at(-1)) };
}
