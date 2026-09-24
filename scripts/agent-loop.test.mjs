#!/usr/bin/env node
// The tool-round loop in lib/agent.js, against a scripted fake of DeepSeek's streaming API. Each test
// is a failure the simulated-student eval (eval/findings/2026-09-23-simulated-students.md) found in
// production replies. No network, no API key; the database is a throwaway embedded PGlite.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-loop-'));
process.env.DEEPSEEK_API_KEY ||= 'test-key';
process.env.USAGE_LOG_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-usage-'));

const { runAgentTurn } = await import('../lib/agent.js');
const { loadStyles } = await import('../lib/styles.js');
const { ensureSchema, query, closeDb } = await import('../lib/db.js');
const { default: runUpdateState } = await import('../lib/tools/update_tutoring_state.js');
const { default: runChooseStyle } = await import('../lib/tools/choose_style.js');
const { styleIndexSection } = await import('../lib/turn.js');
const { deepseekCost, isDeepSeekPeak, deepseekUsageRow } = await import('../lib/usage.js');
const { checkConstraints } = await import('../lib/constraints.js');
const { default: runCalculate } = await import('../lib/tools/calculate.js');
const { resolveStyleId } = await import('../lib/styles.js');
const { shouldSolve, solveProblem, loadReference, referenceSection } = await import('../lib/solver.js');
const { learningView, applyLearningEdit } = await import('../lib/learning.js');
const { recordEvidence } = await import('../lib/student-model.js');

let n = 0;
const t = async (name, fn) => {
  await fn();
  n++;
  console.log('  ok', name);
};

// A fake /chat/completions: each call streams the next scripted round. A round is
// { text: [...pieces], tools: [{ name, arguments }] }.
function fakeUpstream(rounds) {
  const calls = [];
  const real = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (!String(url).endsWith('/chat/completions')) return real(url, init);
    calls.push(JSON.parse(init.body));
    const r = rounds[calls.length - 1] || { text: ['(unexpected extra round)'] };
    const lines = [];
    for (const piece of r.text || []) lines.push({ choices: [{ delta: { content: piece } }] });
    (r.tools || []).forEach((tc, i) => lines.push({ choices: [{ delta: { tool_calls: [{ index: i, id: `call_${i}`, function: { name: tc.name, arguments: JSON.stringify(tc.arguments || {}) } }] } }] }));
    lines.push({ choices: [{ delta: {}, finish_reason: r.tools?.length ? 'tool_calls' : 'stop' }] });
    const body = lines.map((l) => `data: ${JSON.stringify(l)}\n\n`).join('') + 'data: [DONE]\n\n';
    return new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream' } });
  };
  const fetcher = globalThis.fetch;
  return { calls, fetch: fetcher, restore: () => (globalThis.fetch = real) };
}

function usageLines() {
  const dir = process.env.USAGE_LOG_DIR;
  return fs.readdirSync(dir).filter((f) => f.startsWith('usage-')).flatMap((f) => fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)));
}

await ensureSchema();
const pinpointer = loadStyles().styles.find((s) => s.id === 'pinpointer');
const conversationId = crypto.randomUUID();
await query('INSERT INTO conversations (id, title, style, user_id) VALUES ($1, $2, $3, $4)', [conversationId, 't', 'pinpointer', 'u1']);
const turnFor = (over = {}) => ({ ceiling: 2, completeAttempt: false, misconceptions: { action: 'none', candidates: [] }, events: [], ...over });

async function run(rounds, turn = turnFor(), extra = {}) {
  const fake = fakeUpstream(rounds);
  const shown = [];
  try {
    const out = await runAgentTurn({
      history: [{ role: 'user', content: 'I got h2 = 275.4, is that right?' }],
      apiKey: 'k',
      emit: (e) => e.type === 'delta' && shown.push(e.content),
      style: pinpointer,
      conversationId,
      userId: 'u1',
      turn,
      tutoringState: {},
      ...extra,
    });
    return { out, shown: shown.join(''), calls: fake.calls.length, bodies: fake.calls };
  } finally {
    fake.restore();
  }
}

console.log('agent loop');

await t('a reply followed only by bookkeeping ends there (no second closing line)', async () => {
  const { out, shown, calls } = await run([
    { text: ['Look at the state-2 row you used. Which pressure is it for?'], tools: [{ name: 'update_tutoring_state', arguments: { rung: 1 } }] },
    { text: ['Waiting on your answer.'] },
  ]);
  assert.equal(calls, 1);
  assert.equal(shown, 'Look at the state-2 row you used. Which pressure is it for?');
  assert.equal(out.text, shown);
});

await t('narration before a lookup tool is not shown; the reply after it is', async () => {
  const { shown, calls } = await run([
    { text: ['Let me check the course materials…'], tools: [{ name: 'list_cards', arguments: {} }] },
    { text: ['Which table did you read state 2 from?'] },
  ]);
  assert.equal(calls, 2);
  assert.equal(shown, 'Which table did you read state 2 from?');
});

await t('a long opening before a lookup is a real reply and is kept', async () => {
  const long = 'Your energy balance is set up correctly for a steady-flow compressor: one inlet, one outlet, heat loss to the surroundings, and negligible kinetic and potential energy changes. ';
  const { shown } = await run([
    { text: [long, long], tools: [{ name: 'list_cards', arguments: {} }] },
    { text: ['Which row did you read?'] },
  ]);
  assert.ok(shown.startsWith(long + long));
  assert.ok(shown.endsWith('Which row did you read?'));
});

await t('a round with no tools streams unchanged', async () => {
  const { shown, calls } = await run([{ text: ['What does ', 'x mean here?'] }]);
  assert.equal(calls, 1);
  assert.equal(shown, 'What does x mean here?');
});

await t('a tool call written as text markup is never shown, and it is run as a real call', async () => {
  const markup = 'Checking that.\n<\uFF5C\uFF5CDSML\uFF5C\uFF5Ctool_calls>\n<\uFF5C\uFF5CDSML\uFF5C\uFF5Cinvoke name="calculate">\n<\uFF5C\uFF5CDSML\uFF5C\uFF5Cparameter name="expressions" string="false">["131.06 / 42.13"]</\uFF5C\uFF5CDSML\uFF5C\uFF5Cparameter>\n</\uFF5C\uFF5CDSML\uFF5C\uFF5Cinvoke>\n</\uFF5C\uFF5CDSML\uFF5C\uFF5Ctool_calls>';
  const { out, shown, bodies } = await run([{ text: markup.match(/[\s\S]{1,17}/g) }, { text: ['Your COP is 3.11.'] }]);
  assert.ok(!shown.includes('DSML') && !shown.includes('\uFF5C'), shown);
  assert.equal(out.toolLog[0].name, 'calculate');
  const toolMsg = bodies[1].messages.find((m) => m.role === 'tool');
  assert.match(toolMsg.content, /3\.11/);
  assert.ok(shown.endsWith('Your COP is 3.11.'));
});

await t('after a mid-reply lookup, the model is told to continue rather than repeat what is on screen', async () => {
  const long = 'Your energy balance is set up correctly for a steady-flow compressor: one inlet, one outlet, heat loss to the surroundings, and negligible kinetic and potential energy changes. ';
  const { bodies } = await run([{ text: [long, long], tools: [{ name: 'calculate', arguments: { expressions: ['2+2'] } }] }, { text: ['Which row did you read?'] }]);
  assert.ok(bodies[1].messages.some((m) => m.role === 'system' && /already on the student's screen/.test(m.content)));
  const { bodies: quiet } = await run([{ text: ['Hmm.'], tools: [{ name: 'calculate', arguments: { expressions: ['2+2'] } }] }, { text: ['Which row?'] }]);
  assert.ok(!quiet[1].messages.some((m) => m.role === 'system' && /already on the student's screen/.test(m.content)));
});

console.log('update_tutoring_state');

await t('"finished" is refused before the student has a complete attempt', async () => {
  let saved = null;
  const ctx = { turn: turnFor({ completeAttempt: false }), state: { status: 'working' }, saveState: async (s) => (saved = s) };
  const out = await runUpdateState({ problem_status: 'finished' }, ctx);
  assert.equal(saved.status, 'working');
  assert.match(out.notes[0], /not marked finished/);
  await runUpdateState({ problem_status: 'finished' }, { ...ctx, turn: turnFor({ completeAttempt: true }) });
  assert.equal(saved.status, 'finished');
});

console.log('skills pick (choose_style)');

const styles = loadStyles().styles.filter((x) => x.enabled);
const byId = (id) => styles.find((x) => x.id === id);

await t('the style index lists every style with when to use it, and flags the first message', () => {
  const text = styleIndexSection({ styles, current: byId('office-hours'), firstMessage: true });
  for (const x of styles) assert.ok(text.includes(`\`${x.id}\``), x.id);
  assert.match(text, /start of the chat/);
  assert.doesNotMatch(styleIndexSection({ styles, current: byId('office-hours'), firstMessage: false }), /start of the chat/);
});

await t('choose_style refuses unknown styles, a second switch, and a switch while the student is just answering mid-problem', async () => {
  const switched = [];
  const base = { styleChoices: styles, style: byId('office-hours'), state: {}, turn: { intent: 'check_work' }, read: { newProblem: 0.1 }, switchStyle: async (x) => switched.push(x.id) };
  assert.match((await runChooseStyle({ style: 'nope' }, base)).error, /Unknown style/);
  assert.match((await runChooseStyle({ style: 'pinpointer' }, { ...base, styleSwitch: { style: byId('probe') } })).error, /one switch per message/);
  const mid = { ...base, state: { problem: 'turbine', status: 'working' }, turn: { intent: 'reply' } };
  assert.match((await runChooseStyle({ style: 'pinpointer' }, mid)).error, /middle of a problem/);
  assert.ok((await runChooseStyle({ style: 'pinpointer' }, { ...mid, read: { newProblem: 0.9 } })).ok);
  assert.ok((await runChooseStyle({ style: 'pinpointer', reason: 'shared work' }, base)).ok);
  assert.deepEqual(switched, ['pinpointer', 'pinpointer']);
});

await t('after choose_style the rest of the reply runs under the new playbook, and the switch is reported', async () => {
  const oh = byId('office-hours');
  const target = byId('probe');
  const { out, shown, bodies } = await run(
    [{ text: [], tools: [{ name: 'choose_style', arguments: { style: target.id, reason: 'wants to explain it back' } }] }, { text: ['Go ahead, teach me.'] }],
    turnFor({ intent: 'teach_back' }),
    { style: oh, styleChoices: styles }
  );
  assert.equal(shown, 'Go ahead, teach me.');
  assert.equal(out.styleSwitch.style.id, target.id);
  assert.equal(out.styleSwitch.from, oh.id);
  const firstLine = target.prompt.split('\n').find((l) => l.trim().length > 20);
  assert.ok(bodies[1].messages[0].content.includes(firstLine), 'second round uses the new style prompt');
  assert.ok(bodies[0].tools.some((x) => x.function.name === 'choose_style'));
});

console.log('usage log');

await t('DeepSeek cost: cache hits are cheap, peak hours double it, unknown models are priced high', () => {
  const tokens = { promptTokens: 1_000_000, cachedTokens: 400_000, completionTokens: 100_000 };
  assert.ok(Math.abs(deepseekCost({ model: 'deepseek-flash', ...tokens }) - (0.6 * 0.15 + 0.4 * 0.003 + 0.1 * 0.6)) < 1e-9);
  assert.ok(Math.abs(deepseekCost({ model: 'deepseek-flash', ...tokens }, { peak: true }) - 2 * deepseekCost({ model: 'deepseek-flash', ...tokens })) < 1e-9);
  assert.equal(deepseekCost({ model: 'new-model', ...tokens }), deepseekCost({ model: 'deepseek-v4-pro', ...tokens }));
  assert.equal(isDeepSeekPeak(new Date('2026-09-23T07:30:00Z')), true);
  assert.equal(isDeepSeekPeak(new Date('2026-09-23T05:30:00Z')), false);
  assert.equal(isDeepSeekPeak(new Date('2026-09-26T07:30:00Z')), false);
});

await t('every tutor round is logged with its tokens and cost', async () => {
  const before = usageLines().length;
  const fake = fakeUpstream([{ text: ['Which row?'] }]);
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    const res = await fake.fetch(url, init);
    const body = await res.text();
    const withUsage = body.replace('data: [DONE]', `data: ${JSON.stringify({ choices: [], usage: { prompt_tokens: 1000, prompt_cache_hit_tokens: 200, completion_tokens: 50 } })}\n\ndata: [DONE]`);
    return new Response(withUsage, { status: 200 });
  };
  try {
    await runAgentTurn({ history: [{ role: 'user', content: 'hi' }], apiKey: 'k', emit: () => {}, style: pinpointer, conversationId, userId: 'u1', turn: turnFor(), tutoringState: {} });
  } finally {
    globalThis.fetch = realFetch;
    fake.restore();
  }
  const rows = usageLines().slice(before);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].purpose, 'tutor_reply');
  assert.equal(rows[0].conversation_id, conversationId);
  assert.equal(rows[0].prompt_tokens, 1000);
  assert.ok(rows[0].cost_usd > 0);
  const expected = deepseekUsageRow({ model: rows[0].model, usage: { prompt_tokens: 1000, prompt_cache_hit_tokens: 200, completion_tokens: 50 }, purpose: 'x', at: new Date(rows[0].at) }).costUsd;
  assert.ok(Math.abs(rows[0].cost_usd - expected) < 1e-12);
});

console.log('settings: what Kelvin knows');

await t('students see their record and the exact Markdown, and every correction is kept', async () => {
  const u = 'learn-user';
  await recordEvidence(u, null, [
    { kind: 'misconception_signal', ref: 'misc:m16-internal-energy-and-enthalpy-interchangeable', source: 'jev', probability: 0.9, data: { quote: 'used h for the tank' } },
    { kind: 'misconception_signal', ref: 'misc:m16-internal-energy-and-enthalpy-interchangeable', source: 'jev', probability: 0.8 },
    { kind: 'hypothesis', ref: 'topic:steam-tables', source: 'tutor', data: { about: 'topic:steam-tables', belief: 'shaky', note: 'reads the wrong column' } },
    { kind: 'practice_result', ref: 'misc:m15', source: 'tutor', data: { correct: true, independent: true } },
  ]);
  let v = await learningView(u);
  assert.equal(v.model.misconceptions['misc:m16-internal-energy-and-enthalpy-interchangeable'].status, 'likely');
  assert.match(v.markdown, /Likely/);
  assert.equal(v.model.hypotheses[0].source, 'tutor');

  v = await applyLearningEdit(u, { action: 'dismiss_misconception', ref: 'misc:m16-internal-energy-and-enthalpy-interchangeable' });
  assert.equal(Object.keys(v.model.misconceptions).length, 0);
  assert.doesNotMatch(v.markdown, /m16/);

  v = await applyLearningEdit(u, { action: 'edit_note', ref: 'topic:steam-tables', belief: 'solid', note: 'I use the pressure table now' });
  assert.equal(v.model.hypotheses[0].belief, 'solid');
  assert.equal(v.model.hypotheses[0].source, 'student');
  assert.match(v.markdown, /solid: I use the pressure table now/);

  v = await applyLearningEdit(u, { action: 'add_note', about: 'Rankine cycles', belief: 'shaky', note: 'reheat confuses me' });
  assert.equal(v.model.hypotheses.length, 2);
  v = await applyLearningEdit(u, { action: 'remove_note', ref: 'student:rankine-cycles' });
  assert.equal(v.model.hypotheses.length, 1);

  v = await applyLearningEdit(u, { action: 'reset_practice', ref: 'misc:m15' });
  assert.equal(Object.keys(v.model.kcs).length, 0);

  await assert.rejects(applyLearningEdit(u, { action: 'dismiss_misconception', ref: 'misc:nope' }), /not in your record/);
  await assert.rejects(applyLearningEdit(u, { action: 'add_note', about: 'x', belief: 'great' }), /belief must be/);
  const { rows } = await query("SELECT count(*)::int AS n, count(*) FILTER (WHERE source = 'student')::int AS s FROM student_evidence WHERE user_id = $1", [u]);
  assert.deepEqual(rows[0], { n: 9, s: 5 });
});

console.log('accuracy tools');

await t('check_constraints flags the laws round 2 broke, and passes correct numbers', () => {
  const bad = checkConstraints({
    qualities: [{ label: 'q', x: 1.2 }],
    compressors: [{ label: 'flipped efficiency', T1: 300, T2: 520, T2s: 543.4 }],
    property_values: [{ fluid: 'water', given: { P: 10, x: 1 }, stated: { sg: 7.5 } }],
    heat_flows: [{ from_T_K: 280, to_T_K: 300 }],
    cops: [{ kind: 'refrigerator', value: 9, T_cold_K: 253, T_hot_K: 313 }],
    energy_balances: [{ in: [100], out: [60], storage_change: 10 }],
    efficiencies: [{ kind: 'thermal', value: 1.2 }],
  });
  assert.equal(bad.violations.length, 7);
  assert.match(bad.violations.join(' '), /tables give 8\.1488/);
  const good = checkConstraints({
    qualities: [{ x: 0.94 }],
    compressors: [{ T1: 300, T2: 586.4, T2s: 543.4 }],
    turbines: [{ T1: 1300, T2: 787.5, T2s: 717.6 }],
    property_values: [{ fluid: 'water', given: { P: 10, x: 1 }, stated: { sg: 8.149 } }],
    cops: [{ kind: 'refrigerator', value: 3.11, T_cold_K: 253, T_hot_K: 313 }],
    efficiencies: [{ kind: 'thermal', value: 0.317, T_hot_K: 1300, T_cold_K: 300 }],
    energy_balances: [{ in: [717.2], out: [489.9], storage_change: 227.3 }],
  });
  assert.deepEqual(good.violations, []);
});

await t('calculate does exact arithmetic with units and refuses what mathjs flags as unsafe', async () => {
  const { results } = await runCalculate({ expressions: ['T2s = 300 K * 8^(0.4/1.4)', 'to(1.005 kJ/(kg K) * (T2s - 300 K), kJ/kg)', 'import({a: 1})'] });
  assert.equal(results[0].result, '543.434 K');
  assert.equal(results[1].result, '244.651 kJ / kg');
  assert.match(results[2].error, /disabled/);
});

await t('merged styles answer to their old ids', () => {
  assert.equal(resolveStyleId('work-it-through'), 'office-hours');
  assert.equal(resolveStyleId('teach-kelvin'), 'probe');
  assert.equal(resolveStyleId('practice'), 'probe');
  assert.equal(resolveStyleId('pinpointer'), 'pinpointer');
  assert.equal(resolveStyleId('auto'), 'auto');
});

await t('solve first: only problem-shaped messages with numbers, once per problem', () => {
  const history = [{ role: 'user', content: 'R-134a at -20 C, 1000 kPa condenser, COP 3.6?' }];
  assert.equal(shouldSolve({ prepared: { turn: { intent: 'check_work' }, state: {} }, history, existing: null }), true);
  assert.equal(shouldSolve({ prepared: { turn: { intent: 'check_work' }, state: {} }, history, existing: { ok: false } }), false);
  assert.equal(shouldSolve({ prepared: { turn: { intent: 'concept' }, state: {} }, history, existing: null }), false);
  assert.equal(shouldSolve({ prepared: { turn: { intent: 'stuck_on_problem' }, state: {} }, history: [{ role: 'user', content: 'where do i start' }], existing: null }), false);
});

await t('the solver runs its tools, saves a solution for the problem, and the tutor sees it', async () => {
  const conv = crypto.randomUUID();
  const replies = [
    { tool_calls: [{ id: 'c1', type: 'function', function: { name: 'calculate', arguments: JSON.stringify({ expressions: ['131.06 / 42.13'] }) } }] },
    { content: JSON.stringify({ problem: 'fridge COP', well_posed: true, answers: [{ quantity: 'COP', value: 3.11, unit: '-' }], constraint_check: 'passed' }) },
  ];
  const real = globalThis.fetch;
  const seen = [];
  globalThis.fetch = async (url, init) => {
    const body = JSON.parse(init.body);
    seen.push(body);
    const msg = replies[seen.length - 1];
    return new Response(JSON.stringify({ model: body.model, choices: [{ message: { role: 'assistant', ...msg } }], usage: { prompt_tokens: 100, completion_tokens: 20 } }), { status: 200 });
  };
  try {
    const r = await solveProblem({ history: [{ role: 'user', content: 'COP of my fridge cycle is 3.6?' }], conversationId: conv, userId: 'u1' });
    assert.equal(r.ok, true);
    assert.equal(r.solution.answers[0].value, 3.11);
  } finally {
    globalThis.fetch = real;
  }
  assert.deepEqual(seen[0].tools.map((x) => x.function.name).sort(), ['calculate', 'check_constraints', 'property_lookup']);
  assert.match(seen[1].messages.at(-1).content, /3\.110/);
  const ref = await loadReference(conv);
  assert.equal(ref.ok, true);
  assert.match(referenceSection(ref), /Reference solution/);
  assert.equal(referenceSection({ ok: false, solution: null }), '');
});

await closeDb();
fs.rmSync(process.env.PGLITE_DIR, { recursive: true, force: true });
console.log(`\n${n} passed`);
process.exit(0);
