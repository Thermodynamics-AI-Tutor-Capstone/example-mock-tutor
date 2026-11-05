import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const delay = ms => new Promise(r => setTimeout(r, ms));
async function ready(url) {
  for (let i=0; i<40; i++) { try { if ((await fetch(url)).ok) return; } catch {} await delay(100); }
  throw new Error('Server did not start');
}
async function call(base, token, name, args = {}) {
  const client = new Client({ name: 'kelvin-test', version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(`${base}/mcp`), { requestInit: { headers: token ? { Authorization: `Bearer ${token}` } : {} } });
  await client.connect(transport);
  try { return await client.callTool({ name, arguments: args }); }
  finally { await client.close(); }
}
function parse(reply) { return JSON.parse(reply.content[0].text); }

test('MCP authenticates, reads cards, isolates students, and suppresses small cohorts', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'kelvin-mcp-test-'));
  const port = 34000 + Math.floor(Math.random()*1000);
  const modelPort = port + 1000;
  const model = createServer(async (req,res) => {
    const chunks=[]; for await (const chunk of req) chunks.push(chunk);
    const payload=JSON.parse(Buffer.concat(chunks).toString());
    assert.equal(req.headers.authorization, 'Bearer fake-test-key');
    assert.ok(!JSON.stringify(payload).includes('student-one'));
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ topics: ['topic:m7-07-entropy'], misconceptions: [], summary: 'Studied entropy.' }) } }] }));
  });
  await new Promise(resolve => model.listen(modelPort, '127.0.0.1', resolve));
  const env = { ...process.env, KELVIN_MCP_DATA_DIR: dir, PORT: String(port), DEEPSEEK_API_KEY: 'fake-test-key', DEEPSEEK_BASE_URL: `http://127.0.0.1:${modelPort}` };
  async function admin(...args) {
    const child = spawn(process.execPath, ['admin.mjs', ...args], { cwd: import.meta.dirname + '/..', env });
    let output=''; for await (const chunk of child.stdout) output += chunk;
    assert.equal(await new Promise(resolve => child.on('exit', resolve)), 0);
    return JSON.parse(output);
  }
  const student = await admin('provision-student', 'student-one');
  const other = await admin('provision-student', 'student-two');
  const instructor = await admin('provision-instructor', 'teacher-one');
  const child = spawn(process.execPath, ['server.mjs'], { cwd: import.meta.dirname + '/..', env });
  try {
    await ready(`http://127.0.0.1:${port}/health`);
    const base=`http://127.0.0.1:${port}`;
    const publicMap=parse(await call(base, null, 'course_map'));
    assert.equal(publicMap.units.length, 9);
    assert.match(publicMap.provenance, /real Penn State ME 300 Engineering Thermodynamics materials/);
    assert.equal(publicMap.course.sourceMaterial, 'actual Penn State course files');
    const publicClient = new Client({ name: 'public-test', version: '1.0.0' });
    await publicClient.connect(new StreamableHTTPClientTransport(new URL(`${base}/mcp`)));
    assert.match(publicClient.getServerVersion().title, /Engineering Thermodynamics/);
    assert.match(publicClient.getInstructions(), /thermodynamics questions.*course_map.*search_course.*get_card/i);
    const listedTools = (await publicClient.listTools()).tools;
    const publicTools = listedTools.map(x => x.name);
    for (const name of ['course_map', 'search_course', 'get_card']) {
      assert.match(listedTools.find(tool => tool.name === name).description, /thermodynamics/i);
    }
    assert.doesNotMatch(publicClient.getInstructions(), /sample|placeholder|unverified/i);
    assert.doesNotMatch(listedTools.map(tool => tool.description).join(' '), /sample|placeholder|unverified/i);
    assert.ok(publicTools.includes('search_course'));
    assert.ok(!publicTools.includes('record_learning'));
    assert.ok(!publicTools.includes('course_trends'));
    await publicClient.close();
    const denied = await fetch(`${base}/mcp`, { method: 'POST', headers: { Authorization: 'Bearer wrong' } });
    assert.equal(denied.status, 401);
    const map=parse(await call(base, student.token, 'course_map'));
    assert.equal(map.units.length, 9);
    const matches=parse(await call(base, student.token, 'search_course', { query: 'entropy', kind: 'topic' }));
    assert.ok(matches.matches.some(x => x.id === 'topic:m7-07-entropy'));
    const card=parse(await call(base, student.token, 'get_card', { id: 'topic:m7-07-entropy' }));
    assert.match(card.content, /entropy/i);
    assert.ok(card.provenance.includes('Summer 2023'));
    assert.equal(card.sourceMaterial, 'actual Penn State course files');
    const misconception=parse(await call(base, student.token, 'get_card', { id: 'misc:m01-heat-energy-temperature-conflated' }));
    assert.equal(misconception.sourceMaterial, 'cited thermodynamics education research');
    const hidden=await call(base, student.token, 'get_card', { id: 'item:exam1-2021-i-1' });
    assert.equal(hidden.isError, true);
    const saved=parse(await call(base, student.token, 'record_learning', { statement: 'I studied entropy balances today and am still practicing.', consent: true }));
    assert.equal(saved.saved, true);
    assert.deepEqual(saved.topics, ['topic:m7-07-entropy']);
    assert.equal(parse(await call(base, other.token, 'my_learning')).total, 0);
    assert.equal(parse(await call(base, student.token, 'my_learning')).total, 1);
    assert.equal(parse(await call(base, instructor.token, 'course_trends')).suppressed, true);
  } finally {
    child.kill(); model.close(); rmSync(dir, { recursive: true, force: true });
  }
});
