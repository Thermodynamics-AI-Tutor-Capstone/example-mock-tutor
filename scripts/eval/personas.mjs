#!/usr/bin/env node
// Tutoring-behaviour eval: drives scripted student personas (eval/personas.yml) through the real
// pipeline — the decider read, Auto router, policy ceiling, tutoring model, tools, reply audit — and
// reports what happened, per turn and per persona, against each persona's expectations.
//
// Two arms, for showing what Jev adds:
//   --jev on    (default) the pipeline as deployed, with Jev reading every student message
//   --jev off   the same pipeline with Jev switched off, exactly as the Settings switch does:
//               keyword rules stand in for the read, and nothing Jev-only (misconceptions, complete
//               attempt, style picks) is available
//   --jev both  both arms on the same personas, with a side-by-side comparison at the top
// The reply AUDIT stays on Jev in both arms: it is the measuring instrument, not part of the tutor,
// and it must be the same for both arms or the comparison means nothing. Checks that only measure
// the read itself (did Jev flag the misconception?) are reported for the Jev arm and marked "n/a"
// without it; everything else is scored identically.
//
// Safety: it never touches a real database. DATABASE_URL / POSTGRES_URL are removed from the
// environment and a fresh embedded PGlite database is created under data/eval-runs/<timestamp>/.
//
// Costs money: every turn is one tutoring reply (the style's DeepSeek model), one simulated student
// message (deepseek-flash) and one or two Jev calls. The summary prints the Jev cost; check the
// DeepSeek balance before and after for the rest. The simulated students are random (temperature
// 0.7), so one run per arm is an anecdote; use --repeat for anything you would show a sponsor.
//
// Usage: npm run eval:personas -- [--jev on|off|both] [--persona id[,id]] [--repeat n] [--turns n] [--concurrency n]
//        npm run eval:compare -- [same options]        (shorthand for --jev both)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const OUT_DIR = path.join(APP_DIR, 'data', 'eval-runs', STAMP);

// ── environment: .env keys, and never a real database ──────────────────────────────────────────────
for (const line of fs.existsSync(path.join(APP_DIR, '.env')) ? fs.readFileSync(path.join(APP_DIR, '.env'), 'utf8').split('\n') : []) {
  const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}
delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
delete process.env.VERCEL;
fs.mkdirSync(OUT_DIR, { recursive: true });
process.env.PGLITE_DIR = path.join(OUT_DIR, 'pglite');

const { query, ensureSchema, dbKind, closeDb } = await import('../../lib/db.js');
const { prepareTurn, finishTurn, listDecisions } = await import('../../lib/turn.js');
const { runAgentTurn, connectionConfig, styleProblem } = await import('../../lib/agent.js');
const { loadStudentModel } = await import('../../lib/student-model.js');
const { deciderProblem } = await import('../../lib/jev.js');
const { recordUsage, deepseekUsageRow } = await import('../../lib/usage.js');

if (dbKind() !== 'pglite') throw new Error('refusing to run: the eval must use the embedded PGlite database');

// ── arguments ────────────────────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const only = arg('persona') ? new Set(arg('persona').split(',')) : null;
const turnsOverride = arg('turns') ? Number(arg('turns')) : null;
const concurrency = Math.max(1, Number(arg('concurrency') || 4));
const repeat = Math.max(1, Number(arg('repeat') || 1));
const jevArg = (arg('jev') || 'on').toLowerCase();
if (!['on', 'off', 'both'].includes(jevArg)) throw new Error('--jev must be on, off or both');
const ARMS = jevArg === 'both' ? ['on', 'off'] : [jevArg];
const ARM_LABEL = { on: 'Jev on', off: 'Jev off' };

const jevProblem = deciderProblem();
if (ARMS.includes('on') && jevProblem) throw new Error(`the "Jev on" arm needs Jev: ${jevProblem}`);
if (jevProblem) console.warn(`Note: Jev is unavailable (${jevProblem}), so replies will not be audited.`);

const spec = parseYaml(fs.readFileSync(path.join(APP_DIR, 'eval', 'personas.yml'), 'utf8'));
const personas = (spec.personas || []).filter((p) => !only || only.has(p.id));
if (!personas.length) throw new Error('no personas selected');

const hasKey = (envVar) => Boolean((process.env[envVar] || '').trim());
const usable = (style) => !styleProblem(style, hasKey);

// ── the simulated student ─────────────────────────────────────────────────────────────────────────
const SIM = connectionConfig('deepseek-flash');

async function studentSays(persona, transcript) {
  const system = [
    'You are role-playing a student in Penn State ME 300 (engineering thermodynamics) who is chatting with an AI tutor called Kelvin. Stay in character for the whole conversation.',
    `Your problem or situation: ${persona.problem}`,
    `Your character: ${persona.character}`,
    'Reply with ONLY your next chat message to the tutor: no narration, no quotation marks, no labels. Usually one to three short sentences, typed like a real student. Never be more capable than your character, and only understand something once the tutor has actually helped you get there. When the tutor asks you to do a step, do it the way your character would, mistakes included.',
  ].join('\n\n');
  const messages = [{ role: 'system', content: system }];
  for (const m of transcript) messages.push({ role: m.role === 'user' ? 'assistant' : 'user', content: m.content });
  const res = await fetch(`${SIM.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env[SIM.apiKeyEnvVar]}` },
    body: JSON.stringify({ model: SIM.model, messages, temperature: 0.7, max_tokens: 300 }),
  });
  if (!res.ok) {
    await recordUsage(deepseekUsageRow({ model: SIM.model, usage: null, purpose: 'eval_sim_student', ok: false, error: `HTTP ${res.status}` }));
    throw new Error(`simulated student: ${res.status} ${(await res.text()).slice(0, 200)}`);
  }
  const j = await res.json();
  await recordUsage(deepseekUsageRow({ model: SIM.model, usage: j.usage, purpose: 'eval_sim_student', meta: { persona: persona.id } }));
  return String(j.choices?.[0]?.message?.content || '').trim().replace(/^["']|["']$/g, '') || 'ok';
}

// ── one persona, one arm ─────────────────────────────────────────────────────────────────────────
async function runPersona(persona, arm, rep) {
  const userId = `eval-${persona.id}-${arm}-${rep}-${STAMP}`;
  const conversationId = crypto.randomUUID();
  await query('INSERT INTO conversations (id, title, style, user_id) VALUES ($1, $2, $3, $4)', [conversationId, `${persona.id} (${ARM_LABEL[arm]})`, persona.style || 'auto', userId]);
  const history = [];
  const turns = [];
  const n = turnsOverride || persona.turns || 4;
  const tag = `${persona.id} [${ARM_LABEL[arm]}${repeat > 1 ? ` #${rep}` : ''}]`;
  for (let i = 0; i < n; i++) {
    const said = i === 0 ? persona.opening : await studentSays(persona, history);
    history.push({ role: 'user', content: said });
    await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', $2)", [conversationId, said]);

    const started = Date.now();
    const prepared = await prepareTurn({ conversationId, userId, pinnedStyleId: persona.style || 'auto', history, usable, useJev: arm === 'on' });
    const conn = connectionConfig(prepared.style?.connection);
    const statuses = [];
    const agent = await runAgentTurn({
      history,
      apiKey: process.env[conn.apiKeyEnvVar],
      emit: (e) => {
        if (e.type === 'status') statuses.push(e.message);
      },
      style: prepared.style,
      conversationId,
      userId,
      attachments: [],
      knowledge: prepared.knowledge,
      tutoringState: prepared.state,
      stateSection: prepared.stateSection,
      turn: prepared.turn,
      read: prepared.read,
      extraSections: prepared.extraSections,
    });
    const reply = agent.text || '';
    const { rows } = await query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'assistant', $2) RETURNING id", [conversationId, reply || '(no reply)']);
    const { audit } = await finishTurn({ prepared, conversationId, userId, messageId: rows[0]?.id ?? null, history, reply, agent, audit: true });
    history.push({ role: 'assistant', content: reply || '(no reply)' });

    turns.push({
      turn: i + 1,
      student: said,
      tutor: reply,
      error: agent.error || agent.exception?.message || null,
      seconds: Math.round((Date.now() - started) / 100) / 10,
      style: prepared.style?.id,
      route: prepared.route.reason,
      read: {
        provider: prepared.read.provider,
        intent: prepared.read.intent?.label,
        showsWork: prepared.read.showsWork,
        completeAttempt: prepared.read.completeAttempt,
        wantsAnswer: prepared.read.wantsAnswer,
        givingUp: prepared.read.givingUp,
        frustration: prepared.read.frustration?.score ?? null,
        topMisconceptions: prepared.read.misconceptions.slice(0, 3),
        costUsd: prepared.read.costUsd ?? null,
      },
      policy: {
        ceiling: prepared.turn.ceiling,
        completeAttempt: prepared.turn.completeAttempt,
        misconception: prepared.turn.misconceptions.action,
        misconceptionIds: prepared.turn.misconceptions.candidates.map((c) => c.id),
        stalled: prepared.turn.stalled,
        events: prepared.turn.events,
      },
      tools: (agent.toolLog || []).map((t) => t.name),
      audit,
      statuses,
    });
    process.stdout.write(`  ${tag} turn ${i + 1}/${n}: ${prepared.style?.id} ceiling ${prepared.turn.ceiling}${audit?.flags?.length ? ` flags ${audit.flags.join(',')}` : ''}\n`);
  }
  const { rows: stateRows } = await query('SELECT state FROM tutoring_state WHERE conversation_id = $1', [conversationId]);
  const finalState = stateRows[0]?.state ? (typeof stateRows[0].state === 'string' ? JSON.parse(stateRows[0].state) : stateRows[0].state) : {};
  const studentModel = await loadStudentModel(userId);
  return { persona, arm, rep, conversationId, turns, finalState, studentModel, decisions: await listDecisions(conversationId) };
}

// ── expectations ────────────────────────────────────────────────────────────────────────────────
// Each check: { name, pass, detail, jevOnly }. A jevOnly check measures the read itself, so in the
// "Jev off" arm it is recorded as n/a (pass: null) and left out of the pass count.
function check(result) {
  const e = result.persona.expect || {};
  const t = result.turns;
  const jev = result.arm === 'on';
  const out = [];
  const add = (name, pass, detail, jevOnly = false) => out.push({ name, pass: jevOnly && !jev ? null : pass, detail: jevOnly && !jev ? 'n/a without Jev' : detail, jevOnly });
  const flagged = (flag) => t.filter((x) => x.audit?.flags?.includes(flag)).map((x) => x.turn);
  if (e.first_style_in) add(`first style ∈ {${e.first_style_in.join(', ')}}`, e.first_style_in.includes(t[0]?.style), t[0]?.style);
  if (e.no_leak) {
    const leaks = flagged('answer_leak');
    add('no answer leak', leaks.length === 0, leaks.length ? `turns ${leaks.join(', ')}` : 'none');
  }
  if (e.no_key_step_leak) {
    const leaks = flagged('key_step_leak');
    add('no key-step leak', leaks.length === 0, leaks.length ? `turns ${leaks.join(', ')}` : 'none');
  }
  if (e.max_ceiling_at_most !== undefined) {
    const max = Math.max(...t.map((x) => x.policy.ceiling));
    add(`ceiling ≤ ${e.max_ceiling_at_most}`, max <= e.max_ceiling_at_most, `max ${max}`);
  }
  const seen = (id) => t.some((x) => x.read.topMisconceptions.some((m) => m.id === id && m.p >= 0.5));
  const tops = t.map((x) => x.read.topMisconceptions[0]?.id?.replace('misc:', '') || '-').join(' / ');
  const corrected = t.filter((x) => (x.audit?.correctsBelief ?? 0) >= 0.7).map((x) => x.turn);
  if (e.misconception) add(`read flags ${e.misconception}`, seen(e.misconception), tops, true);
  if (e.misconception_any) add('read flags one of the expected misconceptions', e.misconception_any.some(seen), tops, true);
  if (e.misconception || e.misconception_any) add('tutor corrects the wrong belief', corrected.length > 0, corrected.length ? `turns ${corrected.join(', ')}` : 'never');
  if (e.no_misconception_action) {
    const acted = t.filter((x) => x.policy.misconception !== 'none').map((x) => `${x.turn}:${x.policy.misconception} ${x.policy.misconceptionIds.join(',')}`);
    add('read raises no misconception (false-positive check)', acted.length === 0, acted.join('; ') || 'none', true);
    add('tutor invents no misconception', corrected.length === 0, corrected.length ? `turns ${corrected.join(', ')}` : 'none');
  }
  if (e.tool) add(`calls ${e.tool}`, t.some((x) => x.tools.includes(e.tool)), [...new Set(t.flatMap((x) => x.tools))].join(', ') || 'no tools');
  if (e.parked) add('problem parked', result.finalState.status === 'parked' || t.some((x) => x.policy.events.includes('parked')), result.finalState.status || '-');
  return out;
}

// Numbers per run, for the comparison: all from the same audit in both arms.
function metrics(r) {
  const t = r.turns;
  const flag = (f) => t.filter((x) => x.audit?.flags?.includes(f)).length;
  const scored = r.checks.filter((c) => c.pass !== null);
  return {
    passed: scored.filter((c) => c.pass).length,
    scored: scored.length,
    answerLeaks: flag('answer_leak'),
    keyStepLeaks: flag('key_step_leak'),
    correctedStepEarly: flag('corrected_step_early'),
    noHandback: flag('no_handback'),
    corrected: t.filter((x) => (x.audit?.correctsBelief ?? 0) >= 0.7).length,
    styles: [...new Set(t.map((x) => x.style))].join(' → ') || '—',
    ceilings: t.map((x) => x.policy.ceiling).join('·') || '—',
    turns: t.length,
  };
}

// ── run ─────────────────────────────────────────────────────────────────────────────────────────
await ensureSchema();
const jobs = [];
for (let rep = 1; rep <= repeat; rep++) for (const p of personas) for (const arm of ARMS) jobs.push({ p, arm, rep });
console.log(`Persona eval → ${path.relative(APP_DIR, OUT_DIR)} (${personas.length} persona${personas.length === 1 ? '' : 's'} × ${ARMS.map((a) => ARM_LABEL[a]).join(' + ')} × ${repeat}, concurrency ${concurrency})`);
const results = [];
const queue = [...jobs];
await Promise.all(
  Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const { p, arm, rep } = queue.shift();
      try {
        const r = await runPersona(p, arm, rep);
        r.checks = check(r);
        results.push(r);
      } catch (err) {
        console.error(`  ${p.id} [${ARM_LABEL[arm]}] FAILED: ${err.message}`);
        results.push({ persona: p, arm, rep, error: err.message, turns: [], checks: [{ name: 'ran', pass: false, detail: err.message }] });
      }
    }
  })
);
const order = (r) => personas.indexOf(r.persona) * 1000 + ARMS.indexOf(r.arm) * 100 + r.rep;
results.sort((a, b) => order(a) - order(b));
for (const r of results) r.metrics = metrics(r);

// ── report ──────────────────────────────────────────────────────────────────────────────────────
const lines = [
  `# Persona eval — ${STAMP}`,
  '',
  `Arms: ${ARMS.map((a) => ARM_LABEL[a]).join(', ')} · ${repeat} run${repeat === 1 ? '' : 's'} per persona per arm. Replies are audited by Jev in every arm (the same instrument), and checks marked n/a only measure Jev's own read.`,
  '',
  'Automatic checks are Jev judgments and counts, not ground truth. The simulated students are random, so small differences between arms can be noise. Read the transcripts below.',
  '',
];
let jevCost = 0;
for (const r of results) for (const t of r.turns) jevCost += (t.read.costUsd || 0) + (t.audit?.costUsd || 0);

const totals = {};
for (const arm of ARMS) {
  const rs = results.filter((r) => r.arm === arm);
  const sum = (k) => rs.reduce((s, r) => s + (r.metrics[k] || 0), 0);
  totals[arm] = { runs: rs.length, passed: sum('passed'), scored: sum('scored'), answerLeaks: sum('answerLeaks'), keyStepLeaks: sum('keyStepLeaks'), correctedStepEarly: sum('correctedStepEarly'), noHandback: sum('noHandback'), corrected: sum('corrected'), turns: sum('turns') };
}

if (ARMS.length === 2) {
  lines.push('## Jev on vs. Jev off', '');
  lines.push('| | Jev on | Jev off |', '|---|---|---|');
  const row = (label, f) => lines.push(`| ${label} | ${f(totals.on)} | ${f(totals.off)} |`);
  row('Checks passed (scored in both arms)', (x) => `${x.passed}/${x.scored}`);
  row('Replies that gave the final answer before a complete attempt', (x) => `${x.answerLeaks} of ${x.turns}`);
  row('Replies that handed over the key step', (x) => `${x.keyStepLeaks} of ${x.turns}`);
  row('Replies that wrote out the corrected step before a complete attempt', (x) => `${x.correctedStepEarly} of ${x.turns}`);
  row('Replies that did not hand the work back', (x) => `${x.noHandback} of ${x.turns}`);
  row('Replies that corrected a wrong belief (neither good nor bad on its own: read the transcripts)', (x) => `${x.corrected} of ${x.turns}`);
  lines.push('');
  lines.push('| Persona | Jev on | Jev off |', '|---|---|---|');
  for (const p of personas) {
    const cell = (arm) =>
      results
        .filter((r) => r.persona === p && r.arm === arm)
        .map((r) => {
          const m = r.metrics;
          const failed = r.checks.filter((c) => c.pass === false).map((c) => `❌ ${c.name}`);
          return `${m.passed}/${m.scored} checks · ${m.styles} · ceiling ${m.ceilings}${m.answerLeaks + m.keyStepLeaks ? ` · ⚠ ${m.answerLeaks + m.keyStepLeaks} leak${m.answerLeaks + m.keyStepLeaks === 1 ? '' : 's'}` : ''}${failed.length ? `<br>${failed.join('<br>')}` : ''}`;
        })
        .join('<hr>');
    lines.push(`| ${p.id} | ${cell('on')} | ${cell('off')} |`);
  }
  lines.push('');
} else {
  lines.push('| Persona | Styles | Ceiling path | Flags | Checks |', '|---|---|---|---|---|');
  for (const r of results) {
    const flags = r.turns.flatMap((t) => (t.audit?.flags || []).map((f) => `${t.turn}:${f}`)).join(' ') || '—';
    const checks = r.checks.map((c) => `${c.pass === null ? '➖' : c.pass ? '✅' : '❌'} ${c.name}`).join('<br>');
    lines.push(`| ${r.persona.id}${repeat > 1 ? ` #${r.rep}` : ''} | ${r.metrics.styles} | ${r.metrics.ceilings} | ${flags} | ${checks} |`);
  }
  lines.push('');
}
const allScored = results.flatMap((r) => r.checks).filter((c) => c.pass !== null);
const passed = allScored.filter((c) => c.pass).length;
lines.push(`**${passed}/${allScored.length} checks passed** across all arms. Jev cost: $${jevCost.toFixed(5)}.`, '');

for (const r of results) {
  lines.push(`## ${r.persona.id} — ${ARM_LABEL[r.arm]}${repeat > 1 ? ` #${r.rep}` : ''}`, '');
  for (const c of r.checks) lines.push(`- ${c.pass === null ? '➖' : c.pass ? '✅' : '❌'} ${c.name} — ${c.detail}`);
  if (r.error) lines.push(`- run failed: ${r.error}`);
  lines.push('');
  for (const t of r.turns) {
    lines.push(`**Turn ${t.turn}** · ${t.style} (${t.route}) · ceiling ${t.policy.ceiling}${t.policy.completeAttempt ? ' · complete attempt' : ''}${t.policy.stalled ? ' · stalled' : ''} · read: ${t.read.provider} ${t.read.intent || ''} work=${t.read.showsWork} · misconception: ${t.policy.misconception}${t.policy.misconceptionIds.length ? ` ${t.policy.misconceptionIds.join(', ')}` : ''}${t.audit?.flags?.length ? ` · ⚠ ${t.audit.flags.join(', ')}` : ''}${t.tools.length ? ` · tools: ${t.tools.join(', ')}` : ''}`);
    lines.push('', `> **Student:** ${t.student.replace(/\n/g, '\n> ')}`, '>', `> **Kelvin:** ${(t.tutor || `(no reply${t.error ? `: ${t.error}` : ''})`).replace(/\n/g, '\n> ')}`, '');
  }
}
fs.writeFileSync(path.join(OUT_DIR, 'report.md'), lines.join('\n'));
fs.writeFileSync(path.join(OUT_DIR, 'results.json'), JSON.stringify({ arms: ARMS, repeat, totals, results }, null, 2));
if (ARMS.length === 2) {
  for (const arm of ARMS) {
    const x = totals[arm];
    console.log(`${ARM_LABEL[arm].padEnd(8)} ${x.passed}/${x.scored} checks · answer leaks ${x.answerLeaks} · key-step leaks ${x.keyStepLeaks} · beliefs corrected ${x.corrected} (of ${x.turns} replies)`);
  }
}
console.log(`\n${passed}/${allScored.length} checks passed. Report: ${path.relative(APP_DIR, path.join(OUT_DIR, 'report.md'))}`);
await closeDb();
process.exit(0);
