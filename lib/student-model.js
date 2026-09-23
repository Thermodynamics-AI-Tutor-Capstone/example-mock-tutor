import { query } from './db.js';

// What Kelvin has inferred about one student, across conversations.
//
// Two stores, on purpose (capstone research, knowledge/practice/agent-memory.md): an append-only
// evidence ledger (student_evidence) that keeps everything, and the student model itself, which is
// a pure fold over that ledger and keeps only what is currently believed. Because the model is
// recomputed from the ledger, deleting a conversation (ON DELETE CASCADE) also deletes everything
// inferred from it — nothing about a student outlives the conversation it came from.
//
// Evidence comes from three places: Jev's per-turn read (misconception signals), the tutoring
// model's tool calls (confirmed / repaired misconceptions, hypotheses, practice results), and the
// server. Every belief expires: after staleDays without new evidence it is shown as "(old)".

export const EVIDENCE_KINDS = [
  'misconception_signal',
  'misconception_confirmed',
  'misconception_repaired',
  'hypothesis',
  'hypothesis_retired',
  'practice_result',
];
export const EVIDENCE_SOURCES = ['jev', 'tutor', 'server'];
export const BELIEFS = ['solid', 'shaky', 'misconception', 'unknown'];

export const DEFAULTS = Object.freeze({
  staleDays: 21,
  reviewDays: 7,
  masteryStreak: 3,
  masteryP: 0.95,
  likelyP: 0.6,
  // Textbook default Bayesian Knowledge Tracing parameters. NOT fitted to any data: there is no
  // student data yet. Fit them (with the degeneracy guards in knowledge/concepts/knowledge-tracing.md)
  // before trusting a mastery number.
  bkt: Object.freeze({ pInit: 0.2, pLearn: 0.15, pSlip: 0.1, pGuess: 0.2 }),
});

const DAY_MS = 86_400_000;
const REF_MAX = 200;
const DATA_STRING_MAX = 300;

function clipString(v, max) {
  const s = String(v);
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

function cleanData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  const out = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    out[k] = typeof v === 'string' ? clipString(v, DATA_STRING_MAX) : v;
  }
  return out;
}

function validProbability(p) {
  const n = typeof p === 'number' ? p : p === null || p === undefined ? null : Number(p);
  return n !== null && Number.isFinite(n) && n >= 0 && n <= 1 ? n : null;
}

export async function recordEvidence(userId, conversationId, events) {
  if (!userId || !Array.isArray(events)) return 0;
  let inserted = 0;
  for (const e of events) {
    if (!e || !EVIDENCE_KINDS.includes(e.kind) || !EVIDENCE_SOURCES.includes(e.source)) continue;
    if (typeof e.ref !== 'string' || !e.ref.trim()) continue;
    await query(
      `INSERT INTO student_evidence (user_id, conversation_id, kind, ref, source, probability, data)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
      [userId, conversationId || null, e.kind, e.ref.trim().slice(0, REF_MAX), e.source, validProbability(e.probability), JSON.stringify(cleanData(e.data))]
    );
    inserted++;
  }
  return inserted;
}

export async function loadEvidence(userId, { limit = 500 } = {}) {
  if (!userId) return [];
  const { rows } = await query(
    `SELECT id, conversation_id, kind, ref, source, probability, data, created_at
       FROM student_evidence e
      WHERE e.user_id = $1
        -- A chat the student deleted stops counting toward what Kelvin thinks they know (so deleting
        -- still corrects the model), though its evidence is kept.
        AND NOT EXISTS (SELECT 1 FROM conversations c WHERE c.id = e.conversation_id AND c.deleted_at IS NOT NULL)
      ORDER BY created_at DESC, id DESC LIMIT $2`,
    [userId, limit]
  );
  return rows.reverse().map((r) => ({ ...r, data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data || {} }));
}

const iso = (d) => new Date(d).toISOString();
const r3 = (x) => Math.round(x * 1000) / 1000;
const olderThan = (when, days, now) => Boolean(when) && now.getTime() - new Date(when).getTime() > days * DAY_MS;

export function emptyModel() {
  return { misconceptions: {}, hypotheses: [], kcs: {}, evidenceCount: 0 };
}

function bktStep(p, correct, { pLearn, pSlip, pGuess }) {
  const posterior = correct
    ? (p * (1 - pSlip)) / (p * (1 - pSlip) + (1 - p) * pGuess)
    : (p * pSlip) / (p * pSlip + (1 - p) * (1 - pGuess));
  return posterior + (1 - posterior) * pLearn;
}

// Pure. Rows must be oldest first.
export function foldStudentModel(rows, { now = new Date(), config = DEFAULTS } = {}) {
  const miscs = new Map();
  const hyps = new Map();
  const kcs = new Map();

  const misc = (ref) => {
    if (!miscs.has(ref)) {
      miscs.set(ref, { ref, signals: 0, lastSignalP: null, confirmed: false, repaired: false, repairedAt: null, relapsed: false, lastEvidenceAt: null, lastQuote: null });
    }
    return miscs.get(ref);
  };

  for (const row of rows || []) {
    const at = iso(row.created_at);
    const data = row.data || {};
    const p = validProbability(row.probability);
    switch (row.kind) {
      case 'misconception_signal': {
        const m = misc(row.ref);
        m.lastEvidenceAt = at;
        m.lastSignalP = p;
        if (typeof data.quote === 'string' && data.quote.trim()) m.lastQuote = data.quote.trim();
        if (p !== null && p >= config.likelyP) {
          m.signals += 1;
          if (m.repaired) m.relapsed = true;
        }
        break;
      }
      case 'misconception_confirmed': {
        const m = misc(row.ref);
        m.lastEvidenceAt = at;
        m.confirmed = true;
        if (m.repaired) m.relapsed = true;
        break;
      }
      case 'misconception_repaired': {
        const m = misc(row.ref);
        m.lastEvidenceAt = at;
        m.repaired = true;
        m.repairedAt = at;
        m.relapsed = false;
        break;
      }
      case 'hypothesis': {
        const prev = hyps.get(row.ref);
        hyps.set(row.ref, {
          about: typeof data.about === 'string' && data.about.trim() ? data.about.trim() : row.ref,
          belief: BELIEFS.includes(data.belief) ? data.belief : 'unknown',
          note: typeof data.note === 'string' ? data.note : '',
          confidence: validProbability(data.confidence ?? p),
          createdAt: prev ? prev.createdAt : at,
          updatedAt: at,
        });
        break;
      }
      case 'hypothesis_retired':
        hyps.delete(row.ref);
        break;
      case 'practice_result': {
        if (!kcs.has(row.ref)) {
          kcs.set(row.ref, { ref: row.ref, attempts: 0, independentAttempts: 0, correct: 0, streak: 0, pKnown: config.bkt.pInit, lastPracticedAt: null });
        }
        const k = kcs.get(row.ref);
        const correct = data.correct === true;
        k.attempts += 1;
        if (correct) k.correct += 1;
        if (data.independent === true) {
          k.independentAttempts += 1;
          k.pKnown = bktStep(k.pKnown, correct, config.bkt);
          k.streak = correct ? k.streak + 1 : 0;
        }
        k.lastPracticedAt = at;
        break;
      }
      default:
        break;
    }
  }

  const misconceptions = {};
  for (const m of miscs.values()) {
    let status;
    if (m.repaired && m.relapsed) status = 'relapsed';
    else if (m.repaired) status = 'repaired';
    else if (m.confirmed) status = 'confirmed';
    else if (m.signals >= 2) status = 'likely';
    else status = 'suspected';
    misconceptions[m.ref] = {
      ref: m.ref,
      signals: m.signals,
      lastSignalP: m.lastSignalP === null ? null : r3(m.lastSignalP),
      confirmed: m.confirmed,
      repaired: m.repaired && !m.relapsed,
      repairedAt: m.repairedAt,
      lastEvidenceAt: m.lastEvidenceAt,
      lastQuote: m.lastQuote,
      status,
      stale: olderThan(m.lastEvidenceAt, config.staleDays, now),
    };
  }

  const hypotheses = [...hyps.values()].map((h) => ({ ...h, stale: olderThan(h.updatedAt, config.staleDays, now) }));

  const kcOut = {};
  for (const k of kcs.values()) {
    const mastered = k.pKnown >= config.masteryP || k.streak >= config.masteryStreak;
    kcOut[k.ref] = {
      ...k,
      pKnown: r3(k.pKnown),
      mastered,
      due: !mastered || olderThan(k.lastPracticedAt, config.reviewDays, now),
    };
  }

  return { misconceptions, hypotheses, kcs: kcOut, evidenceCount: (rows || []).length };
}

export async function loadStudentModel(userId, opts) {
  if (!userId) return emptyModel();
  return foldStudentModel(await loadEvidence(userId), opts);
}

const day = (d) => (d ? String(d).slice(0, 10) : '?');
const quote = (q) => (q ? ` ("${clipString(q.replace(/\s+/g, ' '), 80)}")` : '');
const old = (x) => (x.stale ? ' (old)' : '');

export function studentModelSection(model, { maxLines = 14 } = {}) {
  const m = model || emptyModel();
  const miscs = Object.values(m.misconceptions || {});
  const byStatus = (s) => miscs.filter((x) => x.status === s).sort((a, b) => String(b.lastEvidenceAt).localeCompare(String(a.lastEvidenceAt)));
  const kcs = Object.values(m.kcs || {});
  const lines = [];
  for (const x of byStatus('relapsed')) lines.push(`- **Relapsed:** \`${x.ref}\` — repaired ${day(x.repairedAt)}, seen again ${day(x.lastEvidenceAt)}${quote(x.lastQuote)}${old(x)}`);
  for (const x of byStatus('confirmed')) lines.push(`- **Confirmed:** \`${x.ref}\` (${day(x.lastEvidenceAt)})${quote(x.lastQuote)}${old(x)}`);
  for (const x of byStatus('likely')) lines.push(`- **Likely:** \`${x.ref}\` — ${x.signals} signals, last ${day(x.lastEvidenceAt)}${quote(x.lastQuote)}${old(x)}`);
  for (const h of [...(m.hypotheses || [])].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))) {
    const conf = typeof h.confidence === 'number' ? `confidence ${h.confidence}, ` : '';
    lines.push(`- **Hypothesis:** about \`${h.about}\` — ${h.belief}${h.note ? `: ${h.note}` : ''} (${conf}${day(h.updatedAt)})${old(h)}`);
  }
  for (const k of kcs.filter((k) => k.due).sort((a, b) => a.pKnown - b.pKnown)) {
    lines.push(`- **Practice due:** \`${k.ref}\` — P(known) ${k.pKnown}, streak ${k.streak}${k.mastered ? ' (mastered, due for review)' : ''}`);
  }
  for (const x of byStatus('suspected')) lines.push(`- **Suspected:** \`${x.ref}\` (${x.signals} signal${x.signals === 1 ? '' : 's'}, ${day(x.lastEvidenceAt)})${old(x)}`);
  for (const x of byStatus('repaired')) lines.push(`- **Repaired:** \`${x.ref}\` (${day(x.repairedAt)}) — watch for relapse${old(x)}`);
  for (const k of kcs.filter((k) => k.mastered && !k.due)) lines.push(`- **Mastered:** \`${k.ref}\``);

  const head = [
    '## What Kelvin has inferred about this student',
    '',
    'These are drafts built from earlier sessions — hypotheses, not facts. Confirm one with the student before relying on it, and never mention this list to them.',
    '',
  ];
  if (!lines.length) {
    return [
      '## What Kelvin has inferred about this student',
      '',
      'Nothing recorded yet. When you learn something durable about what this student knows or gets wrong, record it with `note_student_assumption`.',
    ].join('\n');
  }
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) shown.push(`- …and ${lines.length - maxLines} more.`);
  return [...head, ...shown].join('\n');
}

export function nextPracticeTargets(model, { limit = 3 } = {}) {
  const m = model || emptyModel();
  const out = [];
  const seen = new Set();
  const add = (ref, reason) => {
    if (seen.has(ref)) return;
    seen.add(ref);
    out.push({ ref, reason });
  };
  const miscs = Object.values(m.misconceptions || {});
  for (const status of ['relapsed', 'confirmed', 'likely']) {
    for (const x of miscs.filter((x) => x.status === status)) add(x.ref, 're-test misconception');
  }
  for (const k of Object.values(m.kcs || {}).filter((k) => k.due).sort((a, b) => a.pKnown - b.pKnown)) {
    add(k.ref, k.mastered ? 'due for review' : 'not yet mastered');
  }
  for (const h of (m.hypotheses || []).filter((h) => h.belief === 'shaky' || h.belief === 'misconception')) add(h.about, 'hypothesis to check');
  return out.slice(0, limit);
}
