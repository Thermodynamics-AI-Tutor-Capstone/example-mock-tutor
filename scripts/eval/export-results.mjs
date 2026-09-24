#!/usr/bin/env node
// Turn one simulated-student run into the committed, anonymized result file the admin dashboard reads:
// eval/results/<id>.json. It combines the run's scoring (data/sim-runs/<run>/results.json, from
// sim-collect.mjs), the two reviewer files (review-A.md, review-B.md) and the run's measured cost
// (model_usage over the run's window, when a database is reachable: --from/--to, else
// data/ops/<run>-start|end, else the first and last student message). Commit the output so every teammate sees the run.
//
// Anonymized: no persona names (they're replaced with "Student N" everywhere, reviewer quotes
// included), no student messages; only labels, scores, conversation ids and short reviewer notes.
//
// Usage: node scripts/eval/export-results.mjs --run r3b --id 2026-09-24-round3 --label "Round 3"
//          --students eval/students-r2.yml --harness "one line on what the tutor had" [--findings eval/findings/x.md]
//          [--cost-note "what is known when model_usage has no rows for the run"]
// sim-collect.mjs runs this for you when given --export <id> (same flags).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const RUN = arg('run');
const ID = arg('id');
if (!RUN || !ID) throw new Error('--run and --id are required');
const RUN_DIR = path.join(APP_DIR, 'data', 'sim-runs', RUN);
const OUT = path.join(APP_DIR, 'eval', 'results', `${ID}.json`);

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv(path.join(APP_DIR, '.env'));
try {
  const main = execFileSync('git', ['worktree', 'list', '--porcelain'], { cwd: APP_DIR, encoding: 'utf8' }).match(/^worktree (.+)$/m)?.[1];
  if (main) loadEnv(path.join(main, '.env.local'));
} catch {}

const results = JSON.parse(fs.readFileSync(path.join(RUN_DIR, 'results.json'), 'utf8'));
const students = parseYaml(fs.readFileSync(path.join(APP_DIR, arg('students') || 'eval/students.yml'), 'utf8')).students;

// ── anonymization ───────────────────────────────────────────────────────────────────────────────
const names = students.flatMap((s) => [[s.name, `Student ${s.n}`], [s.name.split(' ')[0], `Student ${s.n}`]]).sort((a, b) => b[0].length - a[0].length);
const anon = (text) => names.reduce((t, [name, label]) => t.replace(new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\']/g, '\\$&')}(?:'s)?\\b`, 'g'), label), String(text || ''));

// ── reviewer grades, per chat ───────────────────────────────────────────────────────────────────
function parseReviews() {
  const chats = [];
  for (const f of ['review-A.md', 'review-B.md']) {
    const file = path.join(RUN_DIR, f);
    if (!fs.existsSync(file)) continue;
    let cur = null;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const h = line.match(/^###\s+Student\s+(\d+)\s+·\s+chat\s+(\d+)\s+·\s+([0-9a-f-]{36})/i);
      if (h) {
        cur = { student: Number(h[1]), chat: Number(h[2]), conv: h[3], helpfulness: null, thoroughness: null, accuracyErrors: null, accuracyNote: null, giveaway: null, misconception: null };
        chats.push(cur);
        continue;
      }
      if (!cur) continue;
      let m;
      if ((m = line.match(/^- Helpfulness:\s*(\d)/))) cur.helpfulness = Number(m[1]);
      else if ((m = line.match(/^- Thoroughness:\s*(\d)/))) cur.thoroughness = Number(m[1]);
      else if (line.startsWith('- Accuracy:')) {
        const t = line.slice('- Accuracy:'.length).trim();
        if (/\bno (physics |stated )?errors?\b|no physics errors/i.test(t) && !/\b\d+\s+(substantive |minor )?errors?\b(?! found)/i.test(t.replace(/no (physics |stated )?errors?/gi, ''))) cur.accuracyErrors = 0;
        else {
          const n = t.match(/\b(\d+)\s+(?:substantive\s+|minor\s+)?errors?\b/i);
          cur.accuracyErrors = n ? Number(n[1]) : /error/i.test(t) ? 1 : 0;
        }
        if (cur.accuracyErrors > 0) cur.accuracyNote = anon(t).slice(0, 400);
      } else if (line.startsWith('- Answer or key step')) {
        const t = line.split(':').slice(1).join(':').trim().toLowerCase();
        cur.giveaway = /^no\b/.test(t) ? 'none' : /mild|partial|partly|soft|minor/.test(t) ? 'mild' : /^yes/.test(t) ? 'clear' : 'mild';
      } else if (line.startsWith('- Misconception shown:')) {
        const t = line.slice('- Misconception shown:'.length).trim();
        const addressed = (t.match(/addressed it:\s*\**\s*(yes|partially|partly|no|n\/a)/i)?.[1] || '').toLowerCase();
        cur.misconception = /^none\b/i.test(t) ? { shown: false } : { shown: true, addressed: addressed === 'yes' ? 'yes' : addressed.startsWith('part') ? 'partly' : addressed === 'no' ? 'no' : 'unclear' };
      }
    }
  }
  return chats.sort((a, b) => a.student - b.student || a.chat - b.chat);
}

// ── small statistics ────────────────────────────────────────────────────────────────────────────
const mean = (xs) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
const round = (x, d = 2) => (x === null || x === undefined ? null : Math.round(x * 10 ** d) / 10 ** d);
// Bootstrap 95% interval over chats (seeded, so the committed file is reproducible).
function bootstrap(xs, iters = 2000) {
  if (xs.length < 2) return null;
  let seed = 42;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const means = [];
  for (let i = 0; i < iters; i++) {
    let s = 0;
    for (let j = 0; j < xs.length; j++) s += xs[Math.floor(rand() * xs.length)];
    means.push(s / xs.length);
  }
  means.sort((a, b) => a - b);
  return [round(means[Math.floor(iters * 0.025)]), round(means[Math.floor(iters * 0.975)])];
}
const pct = (a, b) => (b ? round((100 * a) / b, 1) : null);

// ── cost, from the usage log over the run's window ──────────────────────────────────────────────
async function measuredCost(fromIso, toIso) {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) return null;
  const pg = (await import('pg')).default;
  const c = new pg.Client({ connectionString: url });
  await c.connect();
  try {
    const { rows } = await c.query(
      `SELECT m.provider, m.purpose, coalesce(sum(m.cost_usd), 0) AS usd, count(*) AS calls
         FROM model_usage m JOIN user_profiles p ON p.user_id = m.user_id
        WHERE p.email LIKE 'test%@tutor.test' AND m.at >= $1 AND m.at <= $2 GROUP BY 1, 2`,
      [fromIso, toIso]
    );
    if (!rows.length) return null;
    const byPurpose = Object.fromEntries(rows.map((r) => [`${r.provider}:${r.purpose}`, round(Number(r.usd), 4)]));
    const deepseek = rows.filter((r) => r.provider === 'deepseek').reduce((s, r) => s + Number(r.usd), 0);
    const openrouter = rows.filter((r) => r.provider === 'openrouter').reduce((s, r) => s + Number(r.usd), 0);
    return { total: round(deepseek + openrouter), deepseek: round(deepseek, 3), jev: round(openrouter, 3), byPurpose, source: 'model_usage' };
  } catch {
    return null;
  } finally {
    await c.end();
  }
}

// ── build ───────────────────────────────────────────────────────────────────────────────────────
const reviews = parseReviews();
const turns = results.turns || [];
const logs = fs.readdirSync(RUN_DIR).filter((f) => /^student\d+\.jsonl$/.test(f)).flatMap((f) => fs.readFileSync(path.join(RUN_DIR, f), 'utf8').trim().split('\n').map((l) => JSON.parse(l)));
const times = logs.map((l) => l.at).filter(Boolean).sort();
const seconds = logs.map((l) => l.seconds).filter((x) => Number.isFinite(x)).sort((a, b) => a - b);

const helpful = reviews.map((r) => r.helpfulness).filter((x) => x !== null);
const thorough = reviews.map((r) => r.thoroughness).filter((x) => x !== null);
const errors = reviews.reduce((s, r) => s + (r.accuracyErrors || 0), 0);
const misc = reviews.filter((r) => r.misconception?.shown);
const replies = turns.length;

// Style fit (rounds that carry a best_style label; old ids map onto the merged styles).
const MERGED = { 'work-it-through': 'office-hours', 'teach-kelvin': 'probe', practice: 'probe' };
const fitTurns = turns.filter((t) => t.truth?.best_style && t.live?.routed_style);
const confusion = {};
let fit = 0;
for (const t of fitTurns) {
  const want = MERGED[t.truth.best_style] || t.truth.best_style;
  const got = MERGED[t.live.routed_style] || t.live.routed_style;
  if (want === got) fit++;
  confusion[want] ||= {};
  confusion[want][got] = (confusion[want][got] || 0) + 1;
}

const perStudent = students.map((s) => {
  const rs = reviews.filter((r) => r.student === s.n);
  const shown = rs.filter((r) => r.misconception?.shown);
  return {
    student: `Student ${s.n}`,
    misconceptions: (s.hidden_misconceptions || []).map((h) => (h.id === 'none' ? 'no card' : h.id)),
    helpfulness: round(mean(rs.map((r) => r.helpfulness).filter((x) => x !== null))),
    thoroughness: round(mean(rs.map((r) => r.thoroughness).filter((x) => x !== null))),
    accuracyErrors: rs.reduce((t, r) => t + (r.accuracyErrors || 0), 0),
    misconceptionChats: shown.length,
    misconceptionCaught: shown.filter((r) => r.misconception.addressed === 'yes').length,
  };
});

const readers = {};
for (const [name, s] of Object.entries(results.scores || {})) {
  readers[name] = {
    intent: pct(s.intent, s.intentN),
    showsWork: s.bin?.shows_work ? { recall: pct(s.bin.shows_work.tp, s.bin.shows_work.tp + s.bin.shows_work.fn), precision: pct(s.bin.shows_work.tp, s.bin.shows_work.tp + s.bin.shows_work.fp) } : null,
    completeAttempt: s.bin?.complete_attempt ? { recall: pct(s.bin.complete_attempt.tp, s.bin.complete_attempt.tp + s.bin.complete_attempt.fn), precision: pct(s.bin.complete_attempt.tp, s.bin.complete_attempt.tp + s.bin.complete_attempt.fp) } : null,
    wantsAnswer: s.bin?.wants_answer ? { recall: pct(s.bin.wants_answer.tp, s.bin.wants_answer.tp + s.bin.wants_answer.fn), precision: pct(s.bin.wants_answer.tp, s.bin.wants_answer.tp + s.bin.wants_answer.fp) } : null,
    misconceptionRecall: name.startsWith('rules') ? null : pct(s.misc.tp, s.misc.tp + s.misc.fn),
    misconceptionPrecision: name.startsWith('rules') ? null : pct(s.misc.tp, s.misc.tp + s.misc.fp),
    falseFlagRate: name.startsWith('rules') ? null : pct(s.misc.fpMessages, s.misc.cleanMessages),
    costUsd: s.cost ? round(s.cost, 4) : null,
  };
}

const opsWindow = (edge) => {
  const f = path.join(APP_DIR, 'data', 'ops', `${RUN}-${edge}`);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim() : null;
};
const from = arg('from') || opsWindow('start') || times[0];
const to = arg('to') || opsWindow('end') || times.at(-1);
let cost = from && to ? await measuredCost(from, to) : null;
const costNote = arg('cost-note');
if (!cost && costNote) cost = { total: null, note: costNote, source: 'manual' };
const out = {
  id: ID,
  label: arg('label') || ID,
  date: (times[0] || new Date().toISOString()).slice(0, 10),
  harness: arg('harness') || null,
  findings: arg('findings') || null,
  counts: { students: students.length, chats: new Set(turns.map((t) => t.conv)).size, messages: replies, reviewedChats: reviews.length },
  summary: {
    helpfulness: { mean: round(mean(helpful)), ci95: bootstrap(helpful), n: helpful.length },
    thoroughness: thorough.length ? { mean: round(mean(thorough)), ci95: bootstrap(thorough), n: thorough.length } : null,
    accuracyErrors: errors,
    accuracyErrorsPer100Replies: replies ? round((100 * errors) / replies, 1) : null,
    giveaways: { clear: reviews.filter((r) => r.giveaway === 'clear').length, mild: reviews.filter((r) => r.giveaway === 'mild').length },
    misconceptionChats: misc.length,
    misconceptionCaught: misc.filter((r) => r.misconception.addressed === 'yes').length,
    misconceptionCaughtRate: pct(misc.filter((r) => r.misconception.addressed === 'yes').length, misc.length),
    styleFit: fitTurns.length ? pct(fit, fitTurns.length) : null,
  },
  latency: seconds.length ? { medianS: seconds[Math.floor(seconds.length / 2)], p90S: seconds[Math.floor(seconds.length * 0.9)], maxS: seconds.at(-1) } : null,
  cost,
  readers,
  styleConfusion: fitTurns.length ? confusion : null,
  perStudent,
  chats: reviews.map((r) => ({ ...r, student: `Student ${r.student}` })),
  errors: reviews.filter((r) => r.accuracyErrors > 0).map((r) => ({ student: `Student ${r.student}`, chat: r.chat, conv: r.conv, errors: r.accuracyErrors, note: r.accuracyNote })),
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${path.relative(APP_DIR, OUT)}: ${out.counts.chats} chats, helpfulness ${out.summary.helpfulness.mean} ${JSON.stringify(out.summary.helpfulness.ci95)}, ${errors} accuracy errors, cost ${cost ? '$' + cost.total : 'not logged'}`);
