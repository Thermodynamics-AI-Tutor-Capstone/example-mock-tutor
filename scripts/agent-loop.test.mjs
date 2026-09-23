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
  const target = byId('teach-kelvin');
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

await closeDb();
fs.rmSync(process.env.PGLITE_DIR, { recursive: true, force: true });
console.log(`\n${n} passed`);
process.exit(0);
