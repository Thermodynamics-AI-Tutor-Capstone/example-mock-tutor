import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Thermodynamic properties of water and R-134a, read from the tables in agent/properties/ (generated
// from CoolProp by scripts/properties/generate_tables.py). Everything here interpolates those
// tables: linear in temperature along a row of constant pressure, and linear in ln P between rows
// (with ln v, since v of a gas goes as 1/P). Units are the textbook ones: °C, kPa, m³/kg, kJ/kg,
// kJ/(kg·K). scripts/properties/test.mjs measures the error against exact CoolProp values.

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PROPERTIES_DIR = path.join(APP_DIR, 'agent', 'properties');

const ALIASES = {
  water: 'water', steam: 'water', h2o: 'water',
  r134a: 'r134a', 'r-134a': 'r134a', r134: 'r134a', 'refrigerant-134a': 'r134a', 'refrigerant 134a': 'r134a', 'refrigerant134a': 'r134a',
};
export const FLUIDS = ['water', 'r134a'];
const PROPS = ['T', 'P', 'x', 'v', 'u', 'h', 's'];
const PAIRS = ['T,P', 'T,x', 'P,x', 'P,v', 'P,u', 'P,h', 'P,s', 'T,v', 'T,s'];
const SAT_TOL = 0.02;

const cache = new Map();

export function fluidId(name) {
  const key = String(name || '').trim().toLowerCase();
  return ALIASES[key] || ALIASES[key.replace(/[\s_]/g, '')] || null;
}

function segment(points) {
  const seg = { T: [], v: [], u: [], h: [], s: [] };
  for (const [T, v, u, h, s] of points) {
    seg.T.push(T);
    seg.v.push(v);
    seg.u.push(u);
    seg.h.push(h);
    seg.s.push(s);
  }
  return seg;
}

export function loadFluid(id) {
  const fid = fluidId(id);
  if (!fid) throw new Error(`Unknown fluid "${id}". Available: water, R-134a.`);
  if (cache.has(fid)) return cache.get(fid);
  const raw = JSON.parse(fs.readFileSync(path.join(PROPERTIES_DIR, `${fid}.json`), 'utf8'));
  const sat = {};
  for (const c of raw.sat.cols) sat[c] = [];
  for (const r of raw.sat.rows) raw.sat.cols.forEach((c, i) => sat[c].push(r[i]));
  sat.lnP = sat.P.map(Math.log);
  sat.lnvf = sat.vf.map(Math.log);
  sat.lnvg = sat.vg.map(Math.log);
  const rows = raw.grid.rows.map((r) => ({ P: r.P, lnP: Math.log(r.P), Tsat: r.Tsat, L: r.L.length ? segment(r.L) : null, V: segment(r.V) }));
  const F = { ...raw, id: fid, sat, rows, lnP: rows.map((r) => r.lnP) };
  delete F.grid;
  cache.set(fid, F);
  return F;
}

// Index i with xs[i] <= x <= xs[i+1] for ascending xs, clamped so the ends extrapolate.
function bracket(xs, x) {
  let lo = 0;
  let hi = xs.length - 1;
  if (hi < 1) return 0;
  if (x <= xs[0]) return 0;
  if (x >= xs[hi]) return hi - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xs[mid] <= x) lo = mid;
    else hi = mid;
  }
  return lo;
}

function lerp(xs, ys, x) {
  if (xs.length === 1) return ys[0];
  const i = bracket(xs, x);
  const t = (x - xs[i]) / (xs[i + 1] - xs[i]);
  return ys[i] + t * (ys[i + 1] - ys[i]);
}

// ---- saturation --------------------------------------------------------------------------------

function satAtT(F, T) {
  const S = F.sat;
  return {
    T,
    P: Math.exp(lerp(S.T, S.lnP, T)),
    vf: Math.exp(lerp(S.T, S.lnvf, T)),
    vg: Math.exp(lerp(S.T, S.lnvg, T)),
    uf: lerp(S.T, S.uf, T),
    ug: lerp(S.T, S.ug, T),
    hf: lerp(S.T, S.hf, T),
    hg: lerp(S.T, S.hg, T),
    sf: lerp(S.T, S.sf, T),
    sg: lerp(S.T, S.sg, T),
  };
}

function satAtP(F, P) {
  const T = lerp(F.sat.lnP, F.sat.T, Math.log(P));
  return { ...satAtT(F, T), P };
}

const below = (F, T) => T < F.critical.T;
const subcritical = (F, P) => P < F.critical.P;

// ---- single phase ------------------------------------------------------------------------------

function atT(seg, T) {
  return { T, v: lerp(seg.T, seg.v, T), u: lerp(seg.T, seg.u, T), h: lerp(seg.T, seg.h, T), s: lerp(seg.T, seg.s, T) };
}

function inverseT(seg, key, y) {
  return lerp(seg[key], seg.T, y);
}

// The row segment to read for a state in phase 'L' (liquid), 'V' (vapor) or 'S' (supercritical).
function segFor(row, phase, T) {
  if (!row.L) return row.V;
  if (phase === 'L') return row.L;
  if (phase === 'V') return row.V;
  return T < row.Tsat ? row.L : row.V;
}

function acrossP(F, P, fn) {
  const i = bracket(F.lnP, Math.log(P));
  const a = F.rows[i];
  const b = F.rows[i + 1];
  const t = (Math.log(P) - a.lnP) / (b.lnP - a.lnP);
  const A = fn(a);
  const B = fn(b);
  const out = {};
  for (const k of Object.keys(A)) {
    out[k] = k === 'v' ? Math.exp(Math.log(A.v) + t * (Math.log(B.v) - Math.log(A.v))) : A[k] + t * (B[k] - A[k]);
  }
  return out;
}

function singlePhase(F, P, T, phase) {
  const st = acrossP(F, P, (row) => atT(segFor(row, phase, T), T));
  return { ...st, T, P };
}

function phaseAtPT(F, P, T) {
  if (!subcritical(F, P)) return 'S';
  return T < satAtP(F, P).T ? 'L' : 'V';
}

// Solves f(t) = y for t in [lo, hi] by bisection; f is monotonic (rising or falling). null if y is
// outside the range. Inverse lookups go through the forward interpolation this way, so they are
// exactly as accurate as the forward ones.
function solve(f, y, lo, hi) {
  let flo = f(lo);
  const fhi = f(hi);
  const rising = fhi > flo;
  const tol = 1e-9 * Math.max(1, Math.abs(y));
  if (rising ? y < flo - tol || y > fhi + tol : y > flo + tol || y < fhi - tol) return null;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if ((fm < y) === rising) {
      lo = mid;
      flo = fm;
    } else hi = mid;
  }
  return (lo + hi) / 2;
}

// T at pressure P where property key equals y, on the given phase's side of saturation.
function TfromPy(F, P, key, y, phase) {
  const L = F.limits;
  const Tsat = subcritical(F, P) ? satAtP(F, P).T : null;
  const lo = phase === 'V' ? Tsat : L.T_min;
  const hi = phase === 'L' ? Tsat : L.T_max;
  return solve((T) => singlePhase(F, P, T, phase === 'S' ? phaseAtPT(F, P, T) : phase)[key], y, lo, hi);
}

// P at temperature T where property key equals y, on the given phase's side of saturation.
function PfromTy(F, T, key, y, phase) {
  const L = F.limits;
  const Psat = below(F, T) ? satAtT(F, T).P : null;
  const lo = Math.log(phase === 'L' ? Psat : L.P_min);
  const hi = Math.log(phase === 'V' ? Psat : L.P_max);
  const lnP = solve((q) => singlePhase(F, Math.exp(q), T, phase === 'S' ? phaseAtPT(F, Math.exp(q), T) : phase)[key], y, lo, hi);
  return lnP === null ? null : Math.exp(lnP);
}

// ---- public API -------------------------------------------------------------------------------

function num(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function round(v, key) {
  if (v === null || v === undefined || !Number.isFinite(v)) return v ?? null;
  if (key === 'T') return Math.round(v * 100) / 100;
  if (key === 'P') return Number(v.toPrecision(v >= 100 ? 5 : 4));
  if (key === 'v' || key === 'vf' || key === 'vg') return Number(v.toPrecision(5));
  if (key === 's' || key === 'sf' || key === 'sg' || key === 'x') return Math.round(v * 10000) / 10000;
  return Math.round(v * 100) / 100;
}

function nearCritical(F, T, P) {
  const c = F.critical;
  return Math.abs(T - c.T) < 0.04 * (c.T + 273.15) && Math.abs(P - c.P) < 0.25 * c.P;
}

function twoPhase(F, sat, x) {
  return {
    T: sat.T,
    P: sat.P,
    x,
    v: sat.vf + x * (sat.vg - sat.vf),
    u: sat.uf + x * (sat.ug - sat.uf),
    h: sat.hf + x * (sat.hg - sat.hf),
    s: sat.sf + x * (sat.sg - sat.sf),
  };
}

function describe(F, st, sat, how) {
  const name = F.id === 'water' ? 'water' : 'R-134a';
  let phase;
  let table;
  if (st.x !== null && st.x !== undefined) {
    phase = st.x <= 1e-9 ? 'saturated liquid' : st.x >= 1 - 1e-9 ? 'saturated vapor' : 'saturated liquid-vapor mixture';
    table = `saturated ${name} (${how === 'P' ? 'pressure' : 'temperature'} table)`;
  } else if (!subcritical(F, st.P) && !below(F, st.T)) {
    phase = 'supercritical fluid';
    table = F.id === 'water' ? 'superheated water (supercritical pressure)' : 'superheated R-134a (supercritical pressure)';
  } else if (sat && st.T < sat.T) {
    phase = 'compressed liquid';
    table = `compressed liquid ${name}`;
  } else if (!subcritical(F, st.P)) {
    phase = 'compressed liquid';
    table = `compressed liquid ${name}`;
  } else {
    phase = 'superheated vapor';
    table = `superheated ${name} vapor`;
  }
  const out = { fluid: F.name, phase, table };
  for (const k of ['T', 'P', 'v', 'u', 'h', 's']) out[k] = round(st[k], k);
  out.x = st.x === undefined || st.x === null ? null : round(st.x, 'x');
  if (sat) {
    out.saturation = {};
    for (const k of ['T', 'P', 'vf', 'vg', 'uf', 'ug', 'hf', 'hg', 'sf', 'sg']) out.saturation[k === 'T' ? 'Tsat' : k === 'P' ? 'Psat' : k] = round(sat[k], k === 'T' ? 'T' : k === 'P' ? 'P' : k);
    out.saturation.hfg = round(sat.hg - sat.hf, 'h');
  }
  const notes = [];
  if (nearCritical(F, st.T, st.P)) notes.push('Near the critical point: properties change very fast here, so these interpolated values are less accurate than usual.');
  if (phase === 'compressed liquid' && sat) {
    notes.push(`Textbook shortcut for comparison: saturated liquid at ${round(st.T, 'T')} °C gives v ≈ ${round(satAtT(F, st.T).vf, 'v')} m³/kg, h ≈ ${round(satAtT(F, st.T).hf, 'h')} kJ/kg.`);
  }
  if (notes.length) out.notes = notes;
  return out;
}

function rangeError(F, T, P) {
  const L = F.limits;
  if (T !== undefined && (T < L.T_min - 1e-6 || T > L.T_max + 1e-6)) return `T = ${T} °C is outside the ${F.name} tables (${L.T_min} to ${L.T_max} °C).`;
  if (P !== undefined && (P < L.P_min * 0.999 || P > L.P_max * 1.001)) return `P = ${P} kPa is outside the ${F.name} tables (${L.P_min} to ${L.P_max} kPa).`;
  return null;
}

// state('water', { P: 1000, T: 300 }) → the full state, or { error }. Give exactly two of
// T (°C), P (kPa), x, v (m³/kg), u, h (kJ/kg), s (kJ/(kg·K)).
export function state(fluid, inputs) {
  let F;
  try {
    F = loadFluid(fluid);
  } catch (e) {
    return { error: e.message };
  }
  const given = {};
  for (const k of PROPS) {
    const v = num(inputs?.[k]);
    if (v === undefined) continue;
    if (Number.isNaN(v)) return { error: `${k} must be a number.` };
    given[k] = v;
  }
  const keys = PROPS.filter((k) => k in given);
  if (keys.length !== 2) return { error: `Give exactly two properties (got ${keys.join(', ') || 'none'}). Supported pairs: ${PAIRS.join('; ')}.` };
  const pair = keys.join(',');
  if (!PAIRS.includes(pair)) return { error: `The pair ${pair} is not supported. Supported pairs: ${PAIRS.join('; ')}.` };
  const { T, P, x } = given;
  const bad = rangeError(F, T, P);
  if (bad) return { error: bad };
  if (x !== undefined && (x < 0 || x > 1)) return { error: 'Quality x must be between 0 and 1.' };

  if (pair === 'T,x') {
    if (!below(F, T)) return { error: `A quality only exists below the critical temperature (${F.critical.T} °C).` };
    const sat = satAtT(F, T);
    return describe(F, twoPhase(F, sat, x), sat, 'T');
  }
  if (pair === 'P,x') {
    if (!subcritical(F, P)) return { error: `A quality only exists below the critical pressure (${F.critical.P} kPa).` };
    const sat = satAtP(F, P);
    return describe(F, twoPhase(F, sat, x), sat, 'P');
  }
  if (pair === 'T,P') {
    const sat = subcritical(F, P) ? satAtP(F, P) : null;
    if (sat && Math.abs(T - sat.T) < SAT_TOL) {
      return { error: `T = ${T} °C is the saturation temperature at ${P} kPa, so T and P don't fix the state. Give a quality x (or v, h, s) instead.`, saturation: describe(F, twoPhase(F, sat, 0), sat, 'P').saturation };
    }
    return describe(F, singlePhase(F, P, T, phaseAtPT(F, P, T)), sat, 'P');
  }
  const key = keys.find((k) => k !== 'T' && k !== 'P');
  const y = given[key];
  if (key === 'v' && y <= 0) return { error: 'v must be positive.' };
  if (P !== undefined) {
    let phase = 'S';
    let sat = null;
    if (subcritical(F, P)) {
      sat = satAtP(F, P);
      const f = sat[key + 'f'];
      const g = sat[key + 'g'];
      if (y >= f && y <= g) return describe(F, { ...twoPhase(F, sat, (y - f) / (g - f)), [key]: y }, sat, 'P');
      phase = y < f ? 'L' : 'V';
    }
    const Tq = TfromPy(F, P, key, y, phase);
    if (Tq === null) return { error: `No ${F.name} state in the tables (${F.limits.T_min} to ${F.limits.T_max} °C) has P = ${P} kPa and ${key} = ${y}.` };
    const st = singlePhase(F, P, Tq, phase === 'S' ? phaseAtPT(F, P, Tq) : phase);
    return describe(F, { ...st, [key]: y }, sat, 'P');
  }
  // T with v or s
  let phase = 'S';
  let sat = null;
  if (below(F, T)) {
    sat = satAtT(F, T);
    const f = sat[key + 'f'];
    const g = sat[key + 'g'];
    if (y >= f && y <= g) return describe(F, { ...twoPhase(F, sat, (y - f) / (g - f)), [key]: y }, sat, 'T');
    phase = y < f ? 'L' : 'V';
  }
  if (phase === 'L') {
    return { error: `At ${T} °C this is a compressed liquid, and a liquid's ${key} barely changes with pressure, so T and ${key} can't fix the pressure. Give P and T instead (or approximate it as saturated liquid at ${T} °C: ${key}f = ${round(sat[key + 'f'], key)}).` };
  }
  const Pq = PfromTy(F, T, key, y, phase);
  if (!Pq || rangeError(F, undefined, Pq)) return { error: `No ${F.name} state in the tables has T = ${T} °C and ${key} = ${y}.` };
  const satP = subcritical(F, Pq) ? satAtP(F, Pq) : null;
  const st = singlePhase(F, Pq, T, phase === 'S' ? phaseAtPT(F, Pq, T) : phase);
  return describe(F, { ...st, [key]: y }, satP, 'T');
}

// Raw, unrounded state for plotting: { T, P, v, u, h, s } or null.
function rawState(F, inputs) {
  const r = state(F.id, inputs);
  if (r.error) return null;
  return r;
}

// ---- diagrams ---------------------------------------------------------------------------------

export const DIAGRAMS = {
  Ts: { x: 's', y: 'T', xlog: false, ylog: false },
  Pv: { x: 'v', y: 'P', xlog: true, ylog: true },
  Ph: { x: 'h', y: 'P', xlog: false, ylog: true },
  Tv: { x: 'v', y: 'T', xlog: true, ylog: false },
};
const PATHS = ['isobaric', 'isentropic', 'isothermal', 'isochoric', 'isenthalpic', 'straight'];
const AXIS = {
  T: { label: 'T', unit: '°C' },
  P: { label: 'P', unit: 'kPa' },
  v: { label: 'v', unit: 'm³/kg' },
  h: { label: 'h', unit: 'kJ/kg' },
  s: { label: 's', unit: 'kJ/(kg·K)' },
};

function spaced(a, b, n, log) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push(log ? Math.exp(Math.log(a) + t * (Math.log(b) - Math.log(a))) : a + t * (b - a));
  }
  return out;
}

function pathPoints(F, A, B, kind, dia) {
  const n = 40;
  const pts = [];
  const push = (st) => {
    if (st && !st.error) pts.push(st);
  };
  if (kind === 'straight') return [A, B];
  if (kind === 'isobaric') {
    const via = dia.x === 'h' ? 'h' : dia.x === 's' ? 's' : 'v';
    for (const y of spaced(A[via], B[via], n, via === 'v')) push(state(F.id, { P: A.P, [via]: y }));
  } else if (kind === 'isentropic') {
    for (const p of spaced(A.P, B.P, n, true)) push(state(F.id, { P: p, s: A.s }));
  } else if (kind === 'isenthalpic') {
    for (const p of spaced(A.P, B.P, n, true)) push(state(F.id, { P: p, h: A.h }));
  } else if (kind === 'isothermal') {
    const via = dia.x === 'v' ? 'v' : 's';
    for (const y of spaced(A[via], B[via], n, via === 'v')) push(state(F.id, { T: A.T, [via]: y }));
  } else if (kind === 'isochoric') {
    for (const t of spaced(A.T, B.T, n, false)) push(state(F.id, { T: t, v: A.v }));
  }
  return pts.length >= 2 ? [A, ...pts.slice(1, -1), B] : [A, B];
}

function isobarPoints(F, P, dia, Tmax) {
  const pts = [];
  const L = F.limits;
  const top = Math.min(Tmax, L.T_max);
  if (subcritical(F, P)) {
    const sat = satAtP(F, P);
    for (const t of spaced(L.T_min, sat.T, 30, false).slice(0, -1)) pts.push(singlePhase(F, P, t, 'L'));
    pts.push(twoPhase(F, sat, 0), twoPhase(F, sat, 1));
    if (top > sat.T) for (const t of spaced(sat.T, top, 40, false).slice(1)) pts.push(singlePhase(F, P, t, 'V'));
  } else {
    for (const t of spaced(L.T_min, top, 70, false)) pts.push(singlePhase(F, P, t, phaseAtPT(F, P, t)));
  }
  return pts;
}

function domePoints(F, dia) {
  const S = F.sat;
  const n = S.T.length;
  const idx = [];
  for (let i = 0; i < n; i++) if (i % 6 === 0 || i > n - 60) idx.push(i);
  if (idx.at(-1) !== n - 1) idx.push(n - 1);
  const pick = (i, side) => ({ T: S.T[i], P: S.P[i], v: side === 'f' ? S.vf[i] : S.vg[i], h: side === 'f' ? S.hf[i] : S.hg[i], s: side === 'f' ? S.sf[i] : S.sg[i] });
  return { liquid: idx.map((i) => pick(i, 'f')), vapor: idx.map((i) => pick(i, 'g')) };
}

// diagram({ fluid, type, states: [{ label, T, P, x, ... }], processes: [{ from, to, path }], isobars: [kPa] })
// → the data a browser needs to draw it, or { error }. States use the same inputs as state().
export function diagram(spec) {
  let F;
  try {
    F = loadFluid(spec?.fluid);
  } catch (e) {
    return { error: e.message };
  }
  const dia = DIAGRAMS[spec?.type];
  if (!dia) return { error: `Unknown diagram type "${spec?.type}". Use one of: ${Object.keys(DIAGRAMS).join(', ')}.` };
  const statesIn = Array.isArray(spec.states) ? spec.states.slice(0, 12) : [];
  if (!statesIn.length) return { error: 'Give at least one state.' };
  const problems = [];
  const states = [];
  const byLabel = new Map();
  for (const [i, s] of statesIn.entries()) {
    const label = String(s?.label ?? i + 1).slice(0, 12);
    const st = state(F.id, s);
    if (st.error) {
      problems.push(`State ${label}: ${st.error}`);
      continue;
    }
    const out = { label, ...st };
    states.push(out);
    byLabel.set(label, out);
  }
  const paths = [];
  for (const p of Array.isArray(spec.processes) ? spec.processes.slice(0, 16) : []) {
    const A = byLabel.get(String(p?.from));
    const B = byLabel.get(String(p?.to));
    const kind = PATHS.includes(p?.path) ? p.path : 'straight';
    if (!A || !B) {
      problems.push(`Process ${p?.from}→${p?.to}: unknown state label.`);
      continue;
    }
    if (kind === 'isobaric' && Math.abs(A.P - B.P) > 0.02 * A.P) problems.push(`Process ${A.label}→${B.label} is marked isobaric but P${A.label} = ${A.P} kPa and P${B.label} = ${B.P} kPa.`);
    if (kind === 'isentropic' && Math.abs(A.s - B.s) > 0.01) problems.push(`Process ${A.label}→${B.label} is marked isentropic but s${A.label} = ${A.s} and s${B.label} = ${B.s}.`);
    if (kind === 'isothermal' && Math.abs(A.T - B.T) > 0.5) problems.push(`Process ${A.label}→${B.label} is marked isothermal but T${A.label} = ${A.T} °C and T${B.label} = ${B.T} °C.`);
    if (kind === 'isochoric' && Math.abs(A.v - B.v) > 0.01 * A.v) problems.push(`Process ${A.label}→${B.label} is marked constant-volume but v${A.label} ≠ v${B.label}.`);
    if (kind === 'isenthalpic' && Math.abs(A.h - B.h) > 1) problems.push(`Process ${A.label}→${B.label} is marked throttling (constant h) but h${A.label} ≠ h${B.label}.`);
    paths.push({ from: A.label, to: B.label, path: kind, dashed: kind === 'straight' || kind === 'isenthalpic', points: pathPoints(F, A, B, kind, dia) });
  }
  const Tmax = Math.max(F.critical.T + 30, ...states.map((s) => s.T + 40));
  const isobars = [];
  for (const p of Array.isArray(spec.isobars) ? spec.isobars.slice(0, 6) : []) {
    const P = Number(p);
    if (!Number.isFinite(P) || rangeError(F, undefined, P)) {
      problems.push(`Isobar ${p} kPa is outside the tables.`);
      continue;
    }
    isobars.push({ label: P >= 1000 ? `${Number((P / 1000).toPrecision(4))} MPa` : `${Number(P.toPrecision(4))} kPa`, points: isobarPoints(F, P, dia, Tmax) });
  }
  const xy = (st) => [st[dia.x], st[dia.y]];
  const dome = domePoints(F, dia);
  return {
    fluid: F.name,
    type: spec.type,
    title: typeof spec.title === 'string' ? spec.title.slice(0, 120) : `${dia.y}–${dia.x} diagram, ${F.name}`,
    axes: { x: { ...AXIS[dia.x], log: dia.xlog }, y: { ...AXIS[dia.y], log: dia.ylog } },
    dome: { liquid: dome.liquid.map(xy), vapor: dome.vapor.map(xy) },
    critical: xy(F.critical),
    states: states.map((s) => ({ label: s.label, xy: xy(s), phase: s.phase, T: s.T, P: s.P, v: s.v, h: s.h, s: s.s, x: s.x })),
    paths: paths.map((p) => ({ from: p.from, to: p.to, path: p.path, dashed: p.dashed, points: p.points.map(xy) })),
    isobars: isobars.map((i) => ({ label: i.label, points: i.points.map(xy) })),
    problems,
    source: F.source,
  };
}
