#!/usr/bin/env node
// Score the simulated-student chats (scripts/eval/sim-chat.mjs) against their answer keys.
//
// 1. Pulls every conversation and its logged decisions from the site, signed in as each student,
//    so the read that actually steered Kelvin (live Jev) is scored, not a reconstruction.
// 2. Replays every student message through Jev, the DeepSeek backup (what runs when Jev is off) and
//    the keyword rules with IDENTICAL inputs, so they can be compared fairly. The
//    replay has no tutoring state (current_problem is null for all three), which the live read had;
//    that is why live Jev and replayed Jev are reported separately.
// 3. Scores each against the role-player's --truth for that message, and writes
//    data/sim-runs/<run>/report.md, results.json and one transcript per student with the decisions
//    inline.
//
// Costs a little: one Jev call and one deepseek-flash call per student message.
// Usage: node scripts/eval/sim-collect.mjs [--run sims] [--no-replay]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
for (const line of fs.existsSync(path.join(APP_DIR, '.env')) ? fs.readFileSync(path.join(APP_DIR, '.env'), 'utf8').split('\n') : []) {
  const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const RUN = arg('run') || 'sims';
const REPLAY = !args.includes('--no-replay');
const RUN_DIR = path.join(APP_DIR, 'data', 'sim-runs', RUN);
const BASE = (process.env.EVAL_BASE_URL || 'https://thermo-tutor-mock.vercel.app').replace(/\/+$/, '');

const { readTurn, heuristicRead } = await import('../../lib/decide.js');
const { loadKnowledge } = await import('../../lib/knowledge.js');
const { loadStyles } = await import('../../lib/styles.js');
const { loadPolicy } = await import('../../lib/policy.js');
const T = loadPolicy().thresholds;
const knowledge = await loadKnowledge();
const styles = loadStyles().styles.filter((s) => s.enabled);
const students = parseYaml(fs.readFileSync(path.join(APP_DIR, 'eval', 'students.yml'), 'utf8')).students;

// ── fetch from the site ──────────────────────────────────────────────────────────────────────────
// Reuses the session cookie sim-chat.mjs saved, so a collect run doesn't trip Neon Auth's sign-in
// rate limit; signs in (with backoff) only when there is none or it has expired.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function signIn(n) {
  const email = n === 0 ? process.env.EVAL_EMAIL : `test${n}@tutor.test`;
  const password = n === 0 ? process.env.EVAL_PASSWORD : process.env.SIM_PASSWORD;
  for (let attempt = 0; attempt < 6; attempt++) {
    const r = await fetch(`${BASE}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: BASE },
      body: JSON.stringify({ email, password }),
    });
    if (r.status === 429) {
      await sleep(10_000 * (attempt + 1));
      continue;
    }
    if (!r.ok) throw new Error(`sign-in ${email}: ${r.status}`);
    const cookie = r.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
    fs.writeFileSync(path.join(APP_DIR, 'data', 'sim-runs', '.cookies', n === 0 ? 'eval' : `test${n}`), cookie, { mode: 0o600 });
    return cookie;
  }
  throw new Error(`sign-in ${email}: still rate-limited`);
}
async function session(n) {
  const file = path.join(APP_DIR, 'data', 'sim-runs', '.cookies', n === 0 ? 'eval' : `test${n}`);
  let cookie = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : await signIn(n);
  return async (url) => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(`${BASE}${url}`, { headers: { cookie } });
      if (res.status === 401 && attempt === 0) {
        cookie = await signIn(n);
        continue;
      }
      if (!res.ok) throw new Error(`${url}: ${res.status}`);
      return res.json();
    }
  };
}

const logs = fs
  .readdirSync(RUN_DIR)
  .filter((f) => /^student\d+\.jsonl$/.test(f))
  .map((f) => Number(f.match(/\d+/)[0]))
  .sort((a, b) => a - b);

const turns = [];
for (const n of logs) {
  const rows = fs.readFileSync(path.join(RUN_DIR, `student${n}.jsonl`), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const get = await session(n);
  const convIds = [...new Set(rows.map((r) => r.conv))];
  for (const [ci, conv] of convIds.entries()) {
    const [c, decisions] = await Promise.all([get(`/api/conversations/${conv}`), get(`/api/conversations/${conv}/decisions`)]);
    const byMessage = new Map(decisions.map((d) => [Number(d.message_id), d]));
    const msgs = c.messages;
    const logged = rows.filter((r) => r.conv === conv);
    let k = 0;
    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i].role !== 'user') continue;
      const reply = msgs[i + 1]?.role === 'assistant' ? msgs[i + 1] : null;
      k++;
      // Pair by text, not position: a send whose stream broke reaches the server but not the log.
      const li = logged.findIndex((r) => !r.used && r.message.trim() === String(msgs[i].content).trim());
      const log = li >= 0 ? logged[li] : {};
      if (li >= 0) logged[li].used = true;
      turns.push({
        student: n,
        chat: ci + 1,
        conv,
        title: c.title,
        turn: k,
        history: msgs.slice(0, i + 1).map((m) => ({ role: m.role, content: m.content })),
        message: msgs[i].content,
        reply: reply?.content || null,
        truth: log.truth || null,
        seconds: log.seconds ?? null,
        live: reply ? byMessage.get(reply.id) || null : null,
      });
    }
  }
}
console.log(`${turns.length} student messages from ${logs.length} students`);

// ── replay through the three deciders ────────────────────────────────────────────────────────────
const DECIDERS = REPLAY ? ['jev', 'backup', 'rules'] : [];
const LABEL = { jev: 'Jev (replay)', backup: 'DeepSeek backup (replay)', rules: 'rules (replay)' };
let prevStyle = new Map();
async function replay(t, decider) {
  if (decider === 'rules') return heuristicRead({ history: t.history }, 'replay');
  // enabled: false is "Jev switched off", which reads with the DeepSeek backup.
  return readTurn({ history: t.history, tutoringState: {}, styles, knowledge, currentStyleId: t.prevStyle, enabled: decider === 'jev', usage: { via: `eval_replay_${RUN}`, conversationId: t.conv } });
}
for (const t of turns) {
  t.prevStyle = prevStyle.get(t.conv) || null;
  prevStyle.set(t.conv, t.live?.routed_style || t.prevStyle);
}
const queue = [...turns];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const t = queue.shift();
      t.replays = {};
      for (const d of DECIDERS) {
        try {
          t.replays[d] = await replay(t, d);
        } catch (e) {
          t.replays[d] = { provider: 'error', reason: e.message, misconceptions: [] };
        }
      }
    }
  })
);

// ── scoring ──────────────────────────────────────────────────────────────────────────────────────
const short = (id) => String(id || '').replace(/^misc:/, '').slice(0, 3);
// A read in one flat shape, whether it came from the live decision log or a replay.
function flat(read) {
  if (!read) return null;
  return {
    provider: read.provider,
    intent: read.intent?.label ?? null,
    showsWork: read.showsWork ?? null,
    completeAttempt: read.completeAttempt ?? null,
    wantsAnswer: read.wantsAnswer ?? null,
    givingUp: read.givingUp ?? null,
    frustration: read.frustration?.score ?? null,
    misc: (read.misconceptions || []).map((m) => ({ id: short(m.id), p: m.p })),
    costUsd: read.costUsd ?? null,
    latencyMs: read.latencyMs ?? null,
  };
}
for (const t of turns) {
  t.reads = { 'live Jev': flat(t.live?.read) };
  for (const d of DECIDERS) t.reads[LABEL[d]] = flat(t.replays[d]);
}
const READERS = ['live Jev', ...DECIDERS.map((d) => (LABEL[d]))];

const truthMisc = (t) => (t.truth?.misconceptions || []).map((x) => String(x));
const flagged = (r, floor) => (r?.misc || []).filter((m) => m.p >= floor).map((m) => m.id);

function score(reader) {
  const scored = turns.filter((t) => t.truth && t.reads[reader] && t.reads[reader].provider !== 'error');
  const s = { n: scored.length, intent: 0, intentN: 0, bin: {}, frusErr: 0, frusN: 0, misc: { tp: 0, fp: 0, fn: 0, forcedOnNoCard: 0, noCardMsgs: 0, fpMessages: 0, cleanMessages: 0 }, cost: 0, latency: [] };
  const binaries = [
    ['shows_work', 'showsWork', T.shows_work],
    ['complete_attempt', 'completeAttempt', T.complete_attempt],
    ['wants_answer', 'wantsAnswer', T.wants_answer],
    ['giving_up', 'givingUp', T.giving_up],
  ];
  for (const [k] of binaries) s.bin[k] = { tp: 0, fp: 0, fn: 0, tn: 0, missing: 0 };
  for (const t of scored) {
    const r = t.reads[reader];
    if (r.intent) {
      s.intentN++;
      if (r.intent === t.truth.intent) s.intent++;
    }
    for (const [k, rk, th] of binaries) {
      const truth = Boolean(t.truth[k]);
      if (r[rk] === null || r[rk] === undefined) {
        s.bin[k].missing++;
        continue;
      }
      const pred = r[rk] >= th;
      s.bin[k][pred && truth ? 'tp' : pred ? 'fp' : truth ? 'fn' : 'tn']++;
    }
    if (typeof r.frustration === 'number' && typeof t.truth.frustration === 'number') {
      s.frusErr += Math.abs(r.frustration - t.truth.frustration);
      s.frusN++;
    }
    if (reader.startsWith('rules')) continue;
    const truthCards = truthMisc(t).filter((x) => x !== 'nocard');
    const pred = flagged(r, T.misconception_confirm);
    for (const id of pred) s.misc[truthCards.includes(id) ? 'tp' : 'fp']++;
    for (const id of truthCards) if (!pred.includes(id)) s.misc.fn++;
    if (!truthCards.length) {
      s.misc.cleanMessages++;
      if (pred.length) s.misc.fpMessages++;
    }
    if (truthMisc(t).includes('nocard')) {
      s.misc.noCardMsgs++;
      if (pred.length) s.misc.forcedOnNoCard++;
    }
    if (typeof r.costUsd === 'number') s.cost += r.costUsd;
    if (typeof r.latencyMs === 'number') s.latency.push(r.latencyMs);
  }
  return s;
}
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '—');
const scores = Object.fromEntries(READERS.map((r) => [r, score(r)]));

// Per student: did each hidden misconception ever get flagged, and how soon after it first showed?
function perStudent(reader) {
  const out = [];
  for (const s of students.filter((x) => logs.includes(x.n))) {
    const ts = turns.filter((t) => t.student === s.n);
    for (const h of s.hidden_misconceptions || []) {
      const id = h.id === 'none' ? 'nocard' : h.id;
      const shown = ts.filter((t) => truthMisc(t).includes(id));
      const caught = id === 'nocard' ? [] : ts.filter((t) => flagged(t.reads[reader], T.misconception_confirm).includes(id));
      const caughtWhenShown = id === 'nocard' ? 0 : shown.filter((t) => flagged(t.reads[reader], T.misconception_confirm).includes(id)).length;
      out.push({ student: s.n, name: s.name, id, shown: shown.length, caughtWhenShown, caughtAnywhere: caught.length });
    }
    const falseFlags = ts.flatMap((t) => flagged(t.reads[reader], T.misconception_confirm).filter((id) => !(s.hidden_misconceptions || []).some((h) => h.id === id)));
    out.push({ student: s.n, name: s.name, id: 'other cards', shown: 0, caughtWhenShown: 0, caughtAnywhere: falseFlags.length, which: [...new Set(falseFlags)].join(' ') });
  }
  return out;
}

// ── report ───────────────────────────────────────────────────────────────────────────────────────
const L = [];
L.push(`# Simulated-student eval — ${RUN}`, '');
L.push(`${turns.length} student messages, ${new Set(turns.map((t) => t.conv)).size} chats, ${logs.length} students, on ${BASE}. Every chat is in that student's history (test<N>@tutor.test).`, '');
L.push('**The answer key is the role-player\'s own label for each message** (what the student was really doing, and which hidden misconception the message expressed). It is one annotator\'s judgment, not checked by a second person.', '');
L.push(`Thresholds are the live policy's: work ≥ ${T.shows_work}, complete ≥ ${T.complete_attempt}, wants answer ≥ ${T.wants_answer}, giving up ≥ ${T.giving_up}, misconception flagged ≥ ${T.misconception_confirm} (the level at which Kelvin acts on it).`, '');
L.push('## How well each reader classified the messages', '');
L.push(`| | ${READERS.join(' | ')} |`, `|---|${READERS.map(() => '---').join('|')}|`);
const row = (label, f) => L.push(`| ${label} | ${READERS.map((r) => f(scores[r], r)).join(' | ')} |`);
row('Messages scored', (s) => s.n);
row('Intent exactly right', (s) => `${pct(s.intent, s.intentN)} (${s.intent}/${s.intentN})`);
for (const k of ['shows_work', 'complete_attempt', 'wants_answer', 'giving_up']) {
  row(`${k}: recall / precision`, (s) => {
    const b = s.bin[k];
    return b.tp + b.fp + b.fn + b.tn ? `${pct(b.tp, b.tp + b.fn)} / ${pct(b.tp, b.tp + b.fp)} (${b.tp + b.fn} true)` : '—';
  });
}
row('Frustration: mean error (0–3 scale)', (s) => (s.frusN ? (s.frusErr / s.frusN).toFixed(2) : '—'));
row('Misconception recall (shown → flagged)', (s, r) => (r.startsWith('rules') ? 'can\'t' : `${pct(s.misc.tp, s.misc.tp + s.misc.fn)} (${s.misc.tp}/${s.misc.tp + s.misc.fn})`));
row('Misconception precision (flagged → really shown)', (s, r) => (r.startsWith('rules') ? 'can\'t' : `${pct(s.misc.tp, s.misc.tp + s.misc.fp)} (${s.misc.tp}/${s.misc.tp + s.misc.fp})`));
row('Clean messages with a false flag', (s, r) => (r.startsWith('rules') ? '—' : `${pct(s.misc.fpMessages, s.misc.cleanMessages)} (${s.misc.fpMessages}/${s.misc.cleanMessages})`));
row('No-card misconception forced onto a card', (s, r) => (r.startsWith('rules') ? '—' : `${s.misc.forcedOnNoCard}/${s.misc.noCardMsgs}`));
row('Cost (all messages)', (s) => (s.cost ? `$${s.cost.toFixed(4)}` : '—'));
row('Median latency', (s) => {
  const a = [...s.latency].sort((x, y) => x - y);
  return a.length ? `${(a[Math.floor(a.length / 2)] / 1000).toFixed(2)} s` : '—';
});
L.push('');

for (const reader of READERS.filter((r) => !r.startsWith('rules'))) {
  L.push(`### Hidden misconceptions per student — ${reader}`, '');
  L.push('| Student | Misconception | Messages that showed it | Flagged on those | Flagged anywhere | ', '|---|---|---|---|---|');
  for (const x of perStudent(reader)) L.push(`| ${x.student} ${x.name} | ${x.id}${x.which ? ` (${x.which})` : ''} | ${x.shown || ''} | ${x.id === 'other cards' ? '' : x.caughtWhenShown} | ${x.caughtAnywhere} |`);
  L.push('');
}

// Intent confusion for live Jev.
const conf = {};
for (const t of turns) {
  if (!t.truth || !t.reads['live Jev']?.intent) continue;
  const k = `${t.truth.intent} → ${t.reads['live Jev'].intent}`;
  if (t.truth.intent !== t.reads['live Jev'].intent) conf[k] = (conf[k] || 0) + 1;
}
L.push('### Live Jev intent mistakes (truth → Jev)', '');
for (const [k, v] of Object.entries(conf).sort((a, b) => b[1] - a[1])) L.push(`- ${k}: ${v}`);
L.push('');

fs.writeFileSync(path.join(RUN_DIR, 'report.md'), L.join('\n'));
fs.writeFileSync(path.join(RUN_DIR, 'results.json'), JSON.stringify({ base: BASE, thresholds: T, scores, turns: turns.map(({ history, replays, ...t }) => t) }, null, 2));

// Transcripts, one file per student, with what was decided and the truth inline.
for (const n of logs) {
  const s = students.find((x) => x.n === n);
  const out = [`# Student ${n}: ${s?.name} (test${n}@tutor.test)`, '', `Hidden: ${(s?.hidden_misconceptions || []).map((h) => h.id).join(', ') || 'none (control)'}`, ''];
  let chat = 0;
  for (const t of turns.filter((x) => x.student === n)) {
    if (t.chat !== chat) {
      chat = t.chat;
      out.push(`## Chat ${chat}: ${t.title} — ${BASE}/#/c/${t.conv}`, '');
    }
    const lj = t.reads['live Jev'];
    const fmt = (r) => (r ? `${r.intent} · work ${r.showsWork ?? '-'} · done ${r.completeAttempt ?? '-'} · wants ${r.wantsAnswer ?? '-'} · misc ${(r.misc || []).filter((m) => m.p >= 0.3).map((m) => `${m.id}=${m.p}`).join(' ') || '-'}` : '—');
    out.push(`**Turn ${t.turn}** · style ${t.live?.routed_style || '-'} · ceiling ${t.live?.policy?.ceiling ?? '-'} · audit ${(t.live?.audit?.flags || []).join(',') || '-'}`);
    out.push(`- truth: ${t.truth ? `${t.truth.intent} · misc ${truthMisc(t).join(' ') || '-'} · ${t.truth.note || ''}` : '—'}`);
    out.push(`- live Jev: ${fmt(lj)}`);
    out.push('', `> **Student:** ${t.message.replace(/\n/g, '\n> ')}`, '>', `> **Kelvin:** ${(t.reply || '(no reply)').replace(/\n/g, '\n> ')}`, '');
  }
  fs.writeFileSync(path.join(RUN_DIR, `transcript-student${n}.md`), out.join('\n'));
}
console.log(`Report: ${path.relative(APP_DIR, path.join(RUN_DIR, 'report.md'))}`);
