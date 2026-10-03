// Tests for message-to-model routing (lib/routing.js) and the prompt-cache split in lib/agent.js.
// Offline: no network, no database. Run: node scripts/routing.test.mjs
import assert from 'node:assert/strict';

const { buildStablePrompt, buildTurnContext, buildSystemPrompt, historyMessages, connectionConfig, loadConnections } = await import('../lib/agent.js');
const { routingConfig, chooseConnection } = await import('../lib/routing.js');

let failed = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log(`ok  ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${name}\n     ${err.stack || err.message}`);
  }
}

await test('historyMessages: the turn context goes right before the latest user message', () => {
  const stable = 'STABLE PROMPT';
  const turnN = historyMessages(
    stable,
    [
      { role: 'user', content: 'first question' },
      { role: 'assistant', content: 'first answer' },
      { role: 'user', content: 'second question' },
    ],
    { turnContext: 'CTX-N' }
  );
  assert.deepEqual(turnN.map((m) => m.role), ['system', 'user', 'assistant', 'system', 'user']);
  assert.equal(turnN[3].content, 'CTX-N');
  assert.equal(turnN[4].content, 'second question');
});

await test('historyMessages: everything before the turn context is byte-identical across consecutive turns', () => {
  const stable = 'STABLE PROMPT';
  const historyN = [
    { role: 'user', content: 'first question' },
    { role: 'assistant', content: 'first answer' },
    { role: 'user', content: 'second question' },
  ];
  const turnN = historyMessages(stable, historyN, { turnContext: 'CTX-N' });
  // Turn N+1: the same conversation plus one full exchange, and a new turn context.
  const turnN1 = historyMessages(
    stable,
    [...historyN, { role: 'assistant', content: 'second answer' }, { role: 'user', content: 'third question' }],
    { turnContext: 'CTX-N1' }
  );
  const at = turnN1.findIndex((m) => m.role === 'system' && m.content === 'CTX-N1');
  assert.ok(at >= 0, 'the turn context is in the request');
  assert.equal(turnN1[at + 1].role, 'user');
  assert.equal(turnN1[at + 1].content, 'third question', 'it sits right before the latest user message');
  // The prefix before it is the previous turn's request, minus that turn's context, plus the new
  // assistant message — byte for byte, which is what DeepSeek's prefix cache matches on.
  assert.deepEqual(turnN1.slice(0, at), [...turnN.filter((m) => m.content !== 'CTX-N'), { role: 'assistant', content: 'second answer' }]);
});

await test('historyMessages: an empty turn context adds nothing', () => {
  const hist = [{ role: 'user', content: 'hi' }];
  const plain = historyMessages('S', hist);
  assert.deepEqual(historyMessages('S', hist, { turnContext: '' }), plain);
  assert.deepEqual(plain, [
    { role: 'system', content: 'S' },
    { role: 'user', content: 'hi' },
  ]);
});

await test('historyMessages: consecutive same-role messages are merged before the context is placed', () => {
  const messages = historyMessages(
    'S',
    [
      { role: 'user', content: 'part one' },
      { role: 'user', content: 'part two' },
    ],
    { turnContext: 'CTX' }
  );
  assert.deepEqual(messages.map((m) => m.role), ['system', 'system', 'user']);
  assert.equal(messages[2].content, 'part one\n\npart two', 'the two user messages are one');
  assert.equal(messages[1].content, 'CTX');
});

const skills = [{ name: 'UnitCheck', description: 'Checks units.' }];
const knowledge = { l0: '## Course materials\n\nA map of ME 300.', cardCount: 3 };
const style = { name: 'Socratic', prompt: 'Ask before telling.', state: { helpLadder: true, maxRung: 3 } };
const state = { problem: 'Q1', rung: 1 };
const extras = ['## Student model\n\nMisreads "h".', '## Reference\n\nx = 42'];

await test('buildSystemPrompt output is unchanged: the stable prompt plus the turn context', async () => {
  const full = await buildSystemPrompt({ skills, knowledge, style, tutoringState: state, extraSections: extras });
  const stable = await buildStablePrompt({ skills, knowledge, style });
  const context = buildTurnContext({ style, tutoringState: state, extraSections: extras });
  assert.equal(full, stable + '\n\n---\n\n' + context + '\n');
  assert.match(context, /^## This turn\n\nThese are the server\u2019s notes for answering the student\u2019s latest message\./);
  assert.ok(context.includes('## Tutoring state'));
  assert.ok(context.includes('## Student model'));
  assert.ok(context.includes('## Reference'));
});

await test('buildSystemPrompt with nothing per-turn is just the stable prompt; the turn context is empty', async () => {
  const bare = { name: 'Plain', prompt: 'Be direct.' };
  const stable = await buildStablePrompt({ skills, knowledge, style: bare });
  assert.equal(await buildSystemPrompt({ skills, knowledge, style: bare }), stable + '\n');
  assert.equal(buildTurnContext({ style: bare, extraSections: [null, ''] }), '');
});

const conns = {
  defaultConnection: 'pro',
  connections: {
    pro: { provider: 'DeepSeek', model: 'deepseek-v4-pro' },
    flash: { provider: 'DeepSeek', model: 'deepseek-flash' },
    light: { provider: 'DeepSeek', model: 'deepseek-flash' },
  },
  routing: { enabled: true, intent_connections: { fact: 'flash', practice: 'flash' }, budget_connection: 'light' },
};
const stylePro = { connection: 'pro' };

await test('chooseConnection: routing disabled falls back to the style', () => {
  assert.deepEqual(routingConfig(conns), conns.routing);
  const off = { ...conns, routing: { enabled: false, intent_connections: conns.routing.intent_connections, budget_connection: 'light' } };
  assert.deepEqual(chooseConnection({ read: { intent: { label: 'fact' } }, style: stylePro, connections: off }), { connection: 'pro', reason: 'style' });
  assert.deepEqual(chooseConnection({ read: { intent: { label: 'fact' } }, style: null, connections: off }), { connection: null, reason: 'style' });
});

await test('chooseConnection: past 80% of a usage limit uses the budget connection', () => {
  assert.deepEqual(chooseConnection({ read: { intent: { label: 'stuck_on_problem' } }, style: stylePro, reduced: true, connections: conns }), { connection: 'light', reason: 'budget' });
});

await test('chooseConnection: a mapped intent picks its connection, before the style', () => {
  assert.deepEqual(chooseConnection({ read: { intent: { label: 'fact' } }, style: stylePro, connections: conns }), { connection: 'flash', reason: 'intent:fact' });
  assert.deepEqual(chooseConnection({ read: { intent: { label: 'stuck_on_problem' } }, style: stylePro, connections: conns }), { connection: 'pro', reason: 'style' });
  assert.deepEqual(chooseConnection({ read: null, style: stylePro, connections: conns }), { connection: 'pro', reason: 'style' });
});

await test('chooseConnection: caller overrides win over intent_connections', () => {
  assert.deepEqual(chooseConnection({ read: { intent: { label: 'fact' } }, style: stylePro, overrides: { fact: 'pro' }, connections: conns }), { connection: 'pro', reason: 'intent:fact' });
});

await test('connectionConfig: thinking and reasoning_effort appear only when the connection sets them', () => {
  const cs = {
    defaultConnection: 't',
    connections: {
      t: { provider: 'DeepSeek', model: 'm', thinking: 'enabled', reasoning_effort: 'low' },
      u: { provider: 'DeepSeek', model: 'm' },
    },
  };
  const t = connectionConfig('t', cs);
  assert.equal(t.thinking, 'enabled');
  assert.equal(t.reasoningEffort, 'low');
  const u = connectionConfig('u', cs);
  assert.equal(u.thinking, null);
  assert.equal(u.reasoningEffort, null);
});

await test('loadConnections keeps the routing block and the new connection', () => {
  const c = loadConnections();
  assert.equal(c.routing.enabled, true);
  assert.deepEqual(c.routing.intent_connections, {
    off_topic: 'deepseek-flash-light',
    course_admin: 'deepseek-flash-light',
    fact: 'deepseek-flash',
    practice: 'deepseek-flash',
    teach_back: 'deepseek-flash',
  });
  assert.equal(c.routing.budget_connection, 'deepseek-flash');
  assert.ok(c.connections['deepseek-flash-light'], 'deepseek-flash-light exists');
  assert.equal(c.connections['deepseek-flash-light'].reasoning_effort, 'low');
});

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log('\nall routing tests passed');
