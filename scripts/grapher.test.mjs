import assert from 'node:assert/strict';
import { renderGrapher, validateGrapherSpec } from '../lib/grapher.js';
import { diagram, loadFluid, state } from '../lib/properties.js';

const base = { fluid: 'water', type: 'Ts', states: [{ label: '1', P: 1000, x: 0 }, { label: '2', P: 1000, x: 1 }], processes: [{ from: '1', to: '2', path: 'isobaric' }] };
const bad = (change, pattern) => assert.throws(() => validateGrapherSpec({ ...base, ...change }), (e) => e.statusCode === 400 && pattern.test(e.message));
bad({ type: '__proto__' }, /Choose/);
bad({ fluid: '__proto__' }, /Choose/);
bad({ fluid: 'constructor' }, /Choose/);
bad({ states: [{ label: '1', P: '1000', x: 0 }] }, /numeric/);
bad({ states: [{ label: '1', P: 1000, x: 0, T: 100 }] }, /exactly two/);
bad({ states: [{ label: '1', P: null, x: 0 }] }, /numeric/);
bad({ states: [{ label: '1', P: Infinity, x: 0 }] }, /numeric/);
bad({ states: [{ label: '1', h: 2000, s: 5 }] }, /unsupported/);
bad({ states: [{ label: '1', P: 1e9, T: 200 }] }, /outside/);
bad({ states: [{ label: '1', P: 0.6115, x: 0 }] }, /outside/);
bad({ states: [{ label: '1', P: 100, x: 1.1 }] }, /Quality/);
bad({ states: [{ label: '1', P: 1000, x: 0 }, { label: '1', P: 1000, x: 1 }] }, /repeated/);
bad({ states: Array.from({ length: 13 }, (_, i) => ({ label: `${i}`, P: 1000, x: 0 })) }, /1–12/);
bad({ processes: [{ from: '1', to: 'missing', path: 'straight' }] }, /unknown state/);
bad({ processes: [{ from: '1', to: '2', path: 'fake' }] }, /supported/);
bad({ processes: [{ from: '1', to: '1', path: 'straight' }] }, /different/);
bad({ isobars: [1e9] }, /within/);
bad({ isobars: [100, 100] }, /unique/);
bad({ python: 'print(1)' }, /Unsupported/);
bad({ states: [{ label: '1', T: 179.88, P: 1000 }] }, /don't fix/);
bad({ states: [{ label: '1', P: 1000, T: 300 }, { label: '2', P: 2000, T: 400 }] }, /cannot be isobaric/);
bad({ states: [{ label: '1', P: 1000, T: 300 }, { label: '2', P: 1000.01, T: 400 }] }, /given P values differ/);
for (const path of ['isentropic', 'isothermal', 'isochoric', 'isenthalpic']) {
  bad({ processes: [{ from: '1', to: '2', path }], states: [{ label: '1', P: 1000, T: 300 }, { label: '2', P: 500, T: 450 }] }, new RegExp(`cannot be ${path}`));
}

const F = loadFluid('water');
const origin = state('water', { P: 1000, T: 400 });
for (const [path, key, inputs] of [
  ['isobaric', 'P', { P: origin.P, T: 500 }],
  ['isentropic', 's', { P: 500, s: origin.s }],
  ['isothermal', 'T', { T: origin.T, P: 500 }],
  ['isochoric', 'v', { P: 500, v: origin.v }],
  ['isenthalpic', 'h', { P: 500, h: origin.h }],
]) {
  const spec = validateGrapherSpec({ ...base, states: [{ label: '1', P: 1000, T: 400 }, { label: '2', ...inputs }], processes: [{ from: '1', to: '2', path }] });
  // Choose a diagram whose visible axis is the constrained quantity.
  const type = { P: 'Pv', s: 'Ts', T: 'Tv', v: 'Pv', h: 'Ph' }[key];
  const d = diagram({ ...spec, type }, { strict: true });
  assert.equal(d.error, undefined, `${path}: ${d.error}`);
  assert.ok(d.paths[0].points.length > 20, `${path} should be table-sampled`);
  const index = d.axes.x.label === key ? 0 : 1;
  for (const p of d.paths[0].points) assert.ok(Math.abs(p[index] - origin[key]) <= Math.max(0.011, Math.abs(origin[key]) * .00012), `${path} violated constant ${key}`);
}
const pt = diagram({ ...base, type: 'PT' }, { strict: true });
assert.equal(pt.axes.x.label, 'T');
assert.equal(pt.axes.x.unit, '°C');
assert.equal(pt.axes.y.label, 'P');
assert.equal(pt.dome.liquid.length, 0);
assert.equal(pt.dome.vapor.length, 0);
assert.ok(pt.coexistence.length > 100);
assert.deepEqual(pt.states[0].xy, pt.states[1].xy, 'qualities must overlap in P–T');
assert.deepEqual(pt.critical, [F.critical.T, F.critical.P]);
const hs = diagram({ ...base, type: 'Hs' }, { strict: true });
assert.equal(hs.axes.x.label, 's');
assert.equal(hs.axes.y.label, 'h');
assert.equal(hs.axes.y.unit, 'kJ/kg');
assert.ok(hs.dome.vapor.length > 100);

if (!process.argv.includes('--validation-only')) {
  for (const fluid of ['water', 'r134a']) {
    for (const type of ['Pv', 'Ts', 'Ph', 'Hs', 'PT', 'Tv']) {
      const result = await renderGrapher({ ...base, fluid, type });
      assert.match(result.svg, /^<svg\b/);
      assert.match(result.svg, /graph-critical/);
      assert.doesNotMatch(result.svg, /mathdefault|\\mathdefault/, 'tick labels must not expose mathtext source');
      assert.match(result.svg, /Arial, sans-serif/, 'SVG text needs a browser font fallback');
      assert.match(result.svg, /graph-region-liquid/);
      assert.match(result.svg, /graph-region-supercritical/);
      assert.equal(result.states.length, 2);
      assert.ok(result.steps.length >= 8);
      assert.ok(result.steps.some((s) => s.text.includes('kPa')));
      assert.ok(result.steps.at(-1).text.includes('rubric'));
      if (type === 'PT') {
        assert.match(result.svg, /graph-boundary-coexistence/);
        assert.doesNotMatch(result.svg, /graph-boundary-liquid|graph-boundary-vapor|graph-region-mixture/);
        assert.ok(result.warnings.some((s) => s.includes('solid-phase')));
      } else {
        assert.match(result.svg, /graph-boundary-liquid/);
        assert.match(result.svg, /graph-boundary-vapor/);
        assert.match(result.svg, /graph-region-mixture/);
      }
      const ids = [...result.svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
      assert.equal(new Set(ids).size, ids.length, 'SVG IDs must be unique');
      for (const step of result.steps) for (const target of step.targets) assert.ok(ids.includes(target), `Missing ${target}`);
      assert.doesNotMatch(result.svg, /<script\b|<foreignObject\b|(?:href|src)\s*=\s*["'](?!#)/i);
    }
  }
  const old = process.env.KELVIN_PYTHON;
  const retrySpec = { ...base, title: 'Missing interpreter check' };
  try {
    process.env.KELVIN_PYTHON = 'definitely-no-such-kelvin-python';
    for (let i = 0; i < 2; i++) await assert.rejects(renderGrapher(retrySpec), (e) => e.statusCode === 503 && /could not start/.test(e.message));
  } finally {
    if (old === undefined) delete process.env.KELVIN_PYTHON; else process.env.KELVIN_PYTHON = old;
  }
  assert.match((await renderGrapher(retrySpec)).svg, /graph-critical/, 'failed work must be retryable');
  const concurrentSpec = { ...base, title: 'Concurrent render A' };
  const renderA = renderGrapher(concurrentSpec);
  const duplicateA = renderGrapher(concurrentSpec);
  const renderB = renderGrapher({ ...base, title: 'Concurrent render B' });
  await assert.rejects(renderGrapher({ ...base, title: 'Concurrency limit' }), (e) => e.statusCode === 429);
  const [first, duplicate] = await Promise.all([renderA, duplicateA, renderB]);
  assert.equal(first.svg, duplicate.svg, 'identical in-flight work shares one render');
  first.spec.states[0].P = 999;
  assert.equal((await renderGrapher(concurrentSpec)).spec.states[0].P, 1000, 'callers cannot mutate cached results');
}
console.log(process.argv.includes('--validation-only') ? 'Grapher validation, units, constraint paths, and phase boundary checks passed (Python rendering not requested).' : 'Grapher validation, units, constraint paths, phase boundaries, 12 diagram renders, and concurrency/cache/recovery checks passed.');
