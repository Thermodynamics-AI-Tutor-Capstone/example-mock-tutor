// Measures lib/properties.js against exact CoolProp values (scripts/properties/checkpoints.json,
// written by generate_tables.py) and against printed textbook values. Exits 1 if any error is
// larger than the tolerance a student would notice when checking against their own table.
//   node scripts/properties/test.mjs [--verbose]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { state, diagram } from '../../lib/properties.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const verbose = process.argv.includes('--verbose');
const { fluids } = JSON.parse(fs.readFileSync(path.join(HERE, 'checkpoints.json'), 'utf8'));

// Largest acceptable error. Printed tables give h to 0.01-0.1 kJ/kg and s to 0.0001-0.001.
const TOL = { h: 0.5, u: 0.5, s: 0.0015, v: 0.004, T: 0.25, P: 0.006, x: 0.002 };
const rel = new Set(['v', 'P']);
// Above about a third of the critical pressure and within 200 °C of the critical temperature,
// properties bend sharply (the pseudo-critical region), so linear interpolation is looser there.
// Printed tables step 25-50 °C in this region, so a student interpolating by hand is further off.
const TOL_HIGH_P = { h: 1.2, u: 1.2, v: 0.006, T: 0.5 };
const CRIT = {
  water: { T: 373.946, P: 22064 },
  r134a: { T: 101.06, P: 4059.3 },
};
const highP = (fluid, T, P) => P >= 0.35 * CRIT[fluid].P && T <= CRIT[fluid].T + 200;

let failures = 0;
const stats = new Map();
const fail = (msg) => {
  failures++;
  if (failures <= 25 || verbose) console.log(`FAIL ${msg}`);
};
function check(label, key, got, want, where, loose) {
  const err = rel.has(key) ? Math.abs(got - want) / Math.abs(want) : Math.abs(got - want);
  const tol = (loose && TOL_HIGH_P[key]) || TOL[key];
  const k = `${label} ${key}`;
  if (!stats.has(k)) stats.set(k, []);
  stats.get(k).push(err);
  if (!(err <= tol)) fail(`${k}: got ${got}, want ${want} (${where})`);
}

for (const [fluid, points] of Object.entries(fluids)) {
  for (const { kind, state: w } of points) {
    const where = `${fluid} T=${w.T} P=${w.P}${kind === 'two' ? ` x=${w.x}` : ''}`;
    if (kind === 'single') {
      const f = state(fluid, { T: w.T, P: w.P });
      if (f.error) { fail(`${where}: ${f.error}`); continue; }
      const loose = highP(fluid, w.T, w.P);
      for (const k of ['v', 'u', 'h', 's']) check(`${fluid} (T,P)`, k, f[k], w[k], where, loose);
      const liquid = f.phase === 'compressed liquid';
      for (const k of ['h', 's', 'v']) {
        // Liquid water's v has a minimum near 4 °C, so v alone can't tell the temperature there.
        if (k === 'v' && liquid && fluid === 'water' && w.T < 15) continue;
        const r = state(fluid, { P: w.P, [k]: w[k] });
        if (r.error) { fail(`(P,${k}) ${where}: ${r.error}`); continue; }
        check(`${fluid} (P,${k})`, 'T', r.T, w.T, where, loose);
      }
      for (const k of ['v', 's']) {
        if (liquid) continue;
        const r = state(fluid, { T: w.T, [k]: w[k] });
        if (r.error) { fail(`(T,${k}) ${where}: ${r.error}`); continue; }
        check(`${fluid} (T,${k})`, 'P', r.P, w.P, where, loose);
      }
    } else {
      const f = state(fluid, { T: w.T, x: w.x });
      for (const k of ['P', 'v', 'u', 'h', 's']) check(`${fluid} (T,x)`, k, f[k], w[k], where);
      const g = state(fluid, { P: w.P, h: w.h });
      check(`${fluid} (P,h) 2-phase`, 'x', g.x, w.x, where);
      check(`${fluid} (P,h) 2-phase`, 'T', g.T, w.T, where);
    }
  }
}

// Printed values (Çengel & Boles; IAPWS-95 for water, ASHRAE reference for R-134a).
const BOOK = [
  ['water', { T: 100, x: 0 }, { P: 101.42, h: 419.17, s: 1.3072 }],
  ['water', { T: 100, x: 1 }, { h: 2675.6, s: 7.3542, v: 1.6720 }],
  ['water', { P: 1000, x: 0 }, { T: 179.88, h: 762.51 }],
  ['water', { P: 1000, T: 300 }, { v: 0.25799, u: 2793.7, h: 3051.6, s: 7.1246 }],
  ['water', { P: 10000, T: 500 }, { v: 0.032811, h: 3375.1, s: 6.5995 }],
  ['water', { P: 5000, T: 80 }, { v: 0.0010268, h: 338.96 }],
  ['water', { P: 75, x: 0 }, { T: 91.76, h: 384.44 }],
  ['r134a', { T: -10, x: 1 }, { P: 200.6, h: 244.51, s: 0.93766 }],
];
for (const [fluid, inputs, want] of BOOK) {
  const r = state(fluid, inputs);
  for (const [k, v] of Object.entries(want)) {
    const tol = k === 'T' ? 0.02 : k === 's' ? 0.0006 : rel.has(k) ? 0.001 : 0.15;
    const err = rel.has(k) ? Math.abs(r[k] - v) / v : Math.abs(r[k] - v);
    if (!(err <= tol)) {
      failures++;
      console.log(`FAIL book ${fluid} ${JSON.stringify(inputs)} ${k}: got ${r[k]}, book ${v}`);
    }
  }
}

const d = diagram({ fluid: 'water', type: 'Ts', states: [{ label: '1', P: 10, x: 0 }, { label: '2', P: 8000, s: 0.6492 }, { label: '3', P: 8000, T: 480 }, { label: '4', P: 10, s: 6.6586 }], processes: [{ from: '1', to: '2', path: 'isentropic' }, { from: '2', to: '3', path: 'isobaric' }, { from: '3', to: '4', path: 'isentropic' }, { from: '4', to: '1', path: 'isobaric' }] });
if (d.error || d.states.length !== 4 || d.paths.length !== 4 || d.paths.some((p) => p.points.length < 2)) {
  failures++;
  console.log('FAIL diagram: Rankine T-s did not build', d.error || d.problems);
}

const pct = (a, q) => a.slice().sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(q * a.length))];
for (const [k, errs] of stats) {
  const key = k.split(' ').at(-1);
  const fmt = (e) => (rel.has(key) ? `${(e * 100).toFixed(3)}%` : e.toFixed(4));
  console.log(`${k.padEnd(26)} n=${String(errs.length).padStart(3)}  p95 ${fmt(pct(errs, 0.95)).padStart(9)}  max ${fmt(Math.max(...errs)).padStart(9)}  (tol ${fmt(TOL[key])})`);
}
console.log(failures ? `\n${failures} check(s) failed` : '\nAll property checks passed');
process.exit(failures ? 1 : 0);
