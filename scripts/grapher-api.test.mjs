import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';

delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
delete process.env.VERCEL;
const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-grapher-api-'));
process.env.PGLITE_DIR = testDirectory;
process.env.NEON_AUTH_BASE_URL = 'https://auth.grapher.test';
const { handle } = await import('../lib/app.js');
const { ensureSchema, closeDb } = await import('../lib/db.js');
const originalFetch = globalThis.fetch;
globalThis.fetch = async url => {
  assert.ok(String(url).startsWith(process.env.NEON_AUTH_BASE_URL), 'Unexpected network access');
  return Response.json({ user: { id: 'grapher-test', email: 'grapher@example.test' } });
};
const server = http.createServer((req, res) => { void handle(req, res); });
const spec = { fluid: 'water', type: 'Ts', states: [{ label: '1', P: 100, x: 0 }, { label: '2', P: 100, x: 1 }], processes: [{ from: '1', to: '2', path: 'isobaric' }] };
try {
  await ensureSchema();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/grapher/render`;
  const request = (body, extra = {}) => originalFetch(url, { method: 'POST', headers: { cookie: 'session_token=test', 'content-type': 'application/json' }, body: JSON.stringify(body), ...extra });
  assert.equal((await request(spec, { headers: { 'content-type': 'application/json' } })).status, 401);
  assert.equal((await request(undefined, { method: 'GET' })).status, 405);
  assert.equal((await request(spec, { headers: { cookie: 'session_token=test', 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await request({ ...spec, python: 'print("unsupported")' })).status, 400);
  assert.equal((await request({ ...spec, states: [{ label: '1', P: 100, x: 2 }] })).status, 400);
  const good = await request(spec);
  assert.equal(good.status, 200);
  const graph = await good.json();
  assert.match(graph.svg, /^<svg\b/);
  assert.equal(graph.states.length, 2);
  assert.ok(graph.steps.some(step => /critical point/i.test(step.title)));
  assert.ok(graph.steps.some(step => /Draw 1/.test(step.title)));
  const old = await originalFetch(url.replace('/grapher/render', '/properties/diagram'), { method: 'POST', headers: { cookie: 'session_token=test', 'content-type': 'application/json' }, body: JSON.stringify(spec) });
  assert.equal(old.status, 200, 'Existing static diagram API must still work');
  console.log('Grapher API: authentication, method/media checks, invalid requests, actual Python SVG and legacy route passed.');
} finally {
  await new Promise(resolve => server.close(resolve));
  await closeDb();
  globalThis.fetch = originalFetch;
  assert.equal(path.dirname(path.resolve(testDirectory)), path.resolve(os.tmpdir()));
  assert.ok(path.basename(testDirectory).startsWith('kelvin-grapher-api-'));
  fs.rmSync(testDirectory, { recursive: true, force: true });
}
