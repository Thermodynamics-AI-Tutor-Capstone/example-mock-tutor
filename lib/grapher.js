import { spawn } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DIAGRAMS, diagram, fluidId, loadFluid, state } from './properties.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'scripts', 'grapher', 'render.py');
const PROPERTIES = ['T', 'P', 'x', 'v', 'u', 'h', 's'];
const PAIRS = new Set(['T,P', 'T,x', 'P,x', 'P,v', 'P,u', 'P,h', 'P,s', 'T,v', 'T,s']);
const PATHS = new Set(['isobaric', 'isentropic', 'isothermal', 'isochoric', 'isenthalpic', 'straight']);
const CONSTANTS = { isobaric: ['P', 'kPa'], isentropic: ['s', 'kJ/(kg·K)'], isothermal: ['T', '°C'], isochoric: ['v', 'm³/kg'], isenthalpic: ['h', 'kJ/kg'] };
const TYPE_NAMES = { Pv: 'pressure–specific volume', Ts: 'temperature–entropy', Ph: 'pressure–enthalpy', Hs: 'enthalpy–entropy', PT: 'pressure–temperature', Tv: 'temperature–specific volume' };
let active = 0;
const cache = new Map();
const pending = new Map();

function fail(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = statusCode;
  throw error;
}
function object(value, label, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object.`);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`Unsupported ${label} field: ${key}.`);
}
function string(value, label, max) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u001f\u007f]/u.test(value)) fail(`${label} must be nonempty text of at most ${max} characters.`);
  return value.trim();
}
function list(value, label, max, min = 0) {
  if (!Array.isArray(value) || value.length < min || value.length > max) fail(`${label} must contain ${min}–${max} items.`);
}
const number = (value) => typeof value === 'number' && Number.isFinite(value);
const fmt = (value) => Number(value.toPrecision(6)).toString();
function tolerance(key, a, b) {
  // Only rounding tolerance from the property service; this is not permission
  // for a visibly nonconstant process to be called constant.
  return key === 'T' ? 0.011 : key === 's' ? 0.00011 : key === 'h' ? 0.011 : key === 'P' ? Math.max(0.0001, Math.max(Math.abs(a), Math.abs(b)) * 0.00011) : Math.max(1e-8, Math.max(Math.abs(a), Math.abs(b)) * 0.00011);
}

export function validateGrapherSpec(input) {
  object(input, 'graph', ['fluid', 'type', 'title', 'states', 'processes', 'isobars']);
  const fluid = typeof input.fluid === 'string' && fluidId(input.fluid);
  if (!['water', 'r134a'].includes(fluid)) fail('Choose water or R-134a.');
  const F = loadFluid(fluid);
  if (typeof input.type !== 'string' || !Object.hasOwn(DIAGRAMS, input.type)) fail('Choose Pv, Ts, Ph, Hs, PT, or Tv.');
  list(input.states, 'States', 12, 1);
  list(input.processes ?? [], 'Processes', 16);
  list(input.isobars ?? [], 'Isobars', 6);
  const labels = new Set();
  const resolved = new Map();
  const states = input.states.map((item, i) => {
    object(item, `state ${i + 1}`, ['label', ...PROPERTIES]);
    const label = string(item.label, `State ${i + 1} label`, 12);
    if (labels.has(label)) fail(`State label ${label} is repeated.`);
    labels.add(label);
    const keys = PROPERTIES.filter((key) => Object.hasOwn(item, key));
    if (keys.length !== 2 || keys.some((key) => !number(item[key]))) fail(`State ${label} needs exactly two finite numeric properties.`);
    if (!PAIRS.has(keys.join(','))) fail(`State ${label}: unsupported independent-property pair ${keys.join(',')}. Supported: ${[...PAIRS].join('; ')}.`);
    const selected = Object.fromEntries(keys.map((key) => [key, item[key]]));
    if (selected.T !== undefined && (selected.T < F.limits.T_min || selected.T > F.limits.T_max)) fail(`State ${label}: T is outside the ${F.limits.T_min}–${F.limits.T_max} °C tables.`);
    if (selected.P !== undefined && (selected.P < F.limits.P_min || selected.P > F.limits.P_max)) fail(`State ${label}: P is outside the ${F.limits.P_min}–${F.limits.P_max} kPa tables.`);
    const found = state(fluid, selected);
    if (found.error) fail(`State ${label}: ${found.error}`);
    for (const key of ['T', 'P', 'v', 'h', 's']) if (!number(found[key])) fail(`State ${label} cannot be resolved safely from the tables.`);
    resolved.set(label, found);
    return { label, ...selected };
  });
  const processes = (input.processes ?? []).map((item, i) => {
    object(item, `process ${i + 1}`, ['from', 'to', 'path']);
    const from = string(item.from, `Process ${i + 1} start`, 12);
    const to = string(item.to, `Process ${i + 1} end`, 12);
    if (!labels.has(from) || !labels.has(to)) fail(`Process ${from}→${to} refers to an unknown state.`);
    if (from === to) fail('A process must connect two different state labels.');
    if (!PATHS.has(item.path)) fail(`Process ${from}→${to}: choose a supported process path.`);
    const constraint = CONSTANTS[item.path];
    if (constraint) {
      const [key, unit] = constraint;
      const a = resolved.get(from)[key], b = resolved.get(to)[key];
      const givenA = states.find((st) => st.label === from);
      const givenB = states.find((st) => st.label === to);
      // Explicit conflicting givens are not numerical interpolation error.
      if (key in givenA && key in givenB && Math.abs(givenA[key] - givenB[key]) > 1e-10 * Math.max(1, Math.abs(givenA[key]), Math.abs(givenB[key]))) fail(`Process ${from}→${to} cannot be ${item.path}: the given ${key} values differ (${givenA[key]} and ${givenB[key]} ${unit}).`);
      if (Math.abs(a - b) > tolerance(key, a, b)) fail(`Process ${from}→${to} cannot be ${item.path}: ${key} changes from ${fmt(a)} to ${fmt(b)} ${unit}. Correct the states or choose a schematic straight connection.`);
    }
    return { from, to, path: item.path };
  });
  const isobars = (input.isobars ?? []).map((p) => {
    if (!number(p) || p < F.limits.P_min || p > F.limits.P_max) fail(`Each isobar must be numeric and within ${F.limits.P_min}–${F.limits.P_max} kPa.`);
    return p;
  });
  if (new Set(isobars).size !== isobars.length) fail('Each reference isobar must be unique.');
  return { fluid, type: input.type, ...(input.title !== undefined ? { title: string(input.title, 'Title', 120) } : {}), states, processes, isobars };
}

function regionData(F, dia) {
  const t = F.limits.T_min + 0.44 * (F.critical.T - F.limits.T_min);
  const sat = state(F.id, { T: t, x: 0.5 });
  const requests = [
    ['liquid', 'Compressed /\nsubcooled liquid', { T: t, P: Math.min(F.limits.P_max, F.critical.P * 0.72) }],
    ['mixture', 'Liquid–vapor mixture\n0 < x < 1', { T: t, x: 0.5 }],
    ['vapor', 'Superheated vapor', { T: F.limits.T_min + 0.85 * (F.critical.T - F.limits.T_min), P: Math.max(F.limits.P_min * 1.5, sat.P * 0.1) }],
    ['supercritical', 'Supercritical fluid', { T: F.critical.T + (F.limits.T_max - F.critical.T) * 0.25, P: Math.min(F.limits.P_max, F.critical.P * 2) }],
  ];
  return requests.filter(([id]) => !(dia.x === 'T' && dia.y === 'P' && id === 'mixture')).map(([id, text, inputs]) => {
    const st = state(F.id, inputs);
    if (st.error) fail(`Could not place the ${id} region from the property tables.`, 503);
    return { id: `graph-region-${id}`, text, xy: [st[dia.x], st[dia.y]] };
  });
}

function buildSteps(spec, data, F, regions) {
  const steps = [];
  const add = (kind, title, text, targets = []) => steps.push({ id: `step-${steps.length + 1}`, kind, title, text, targets });
  add('axes', '1. Read the givens and choose the diagram', `Fluid: ${F.name}. Draw a ${TYPE_NAMES[spec.type]} (${spec.type}) diagram. ${spec.states.map((s) => `State ${s.label}: ${PROPERTIES.filter((p) => p in s).map((p) => `${p}=${fmt(s[p])} ${p === 'x' ? '(quality, dimensionless)' : ({ T: '°C', P: 'kPa', v: 'm³/kg', u: 'kJ/kg', h: 'kJ/kg', s: 'kJ/(kg·K)' })[p]}`).join(', ')}`).join('; ')}. These are table-based equilibrium states.`);
  add('axes', '2. Draw and label the axes', `Horizontal: ${data.axes.x.label} (${data.axes.x.unit}), ${data.axes.x.log ? 'logarithmic' : 'linear'} scale. Vertical: ${data.axes.y.label} (${data.axes.y.unit}), ${data.axes.y.log ? 'logarithmic' : 'linear'} scale. Temperature is Celsius; pressure is absolute. Log spacing represents ratios, not equal differences.`, ['graph-axis-x', 'graph-axis-y', 'graph-axis-left', 'graph-axis-bottom', 'graph-axis-right', 'graph-axis-top']);
  if (spec.type === 'PT') add('boundary', '3. Draw the liquid–vapor coexistence curve', 'On P–T, saturated liquid and saturated vapor lie on the same curve. There is no mixture area or saturation dome. At coexistence, P and T do not determine quality x. Solid-phase boundaries are outside these tables and are not shown.', ['graph-boundary-coexistence']);
  else add('boundary', '3. Draw the saturation boundaries', `Trace the saturated-liquid boundary (x=0) and saturated-vapor boundary (x=1) from the property tables. The liquid–vapor mixture region lies between the corresponding saturation states. ${spec.type === 'Hs' ? 'The h–s saturation loci have their actual table-based shape; do not assume a symmetric bell.' : 'Use the plotted axis scales when sketching the shape.'}`, ['graph-boundary-liquid', 'graph-boundary-vapor']);
  add('boundary', '4. Mark the critical point and phase regions', `Critical point: Tc=${fmt(F.critical.T)} °C, Pc=${fmt(F.critical.P)} kPa; plotted at (${fmt(F.critical[DIAGRAMS[spec.type].x])} ${data.axes.x.unit}, ${fmt(F.critical[DIAGRAMS[spec.type].y])} ${data.axes.y.unit}). Quality is undefined at and above the critical point. Region labels are placed at representative equilibrium states; the supercritical example has both T>Tc and P>Pc.`, ['graph-critical', ...regions.map((r) => r.id)]);
  for (const [i, st] of data.states.entries()) {
    const quality = st.x === null || st.x === undefined ? 'Quality is not defined in this single-phase state.' : `x=${fmt(st.x)}. For a mixture, v=vf+x(vg−vf), h=hf+x(hg−hf), and s=sf+x(sg−sf), using saturation values at the same P or T.`;
    add('state', `5.${i + 1} Locate state ${st.label}`, `${st.phase}: T=${fmt(st.T)} °C; P=${fmt(st.P)} kPa; v=${fmt(st.v)} m³/kg; h=${fmt(st.h)} kJ/kg; s=${fmt(st.s)} kJ/(kg·K). ${quality}${spec.type === 'PT' && st.x !== null && st.x !== undefined ? ' Different qualities at this saturation temperature overlap on P–T.' : ''}`, [`graph-state-${i}`]);
  }
  for (const [i, p] of spec.isobars.entries()) add('process', `6.${i + 1} Add the reference isobar`, `Reference line at P=${fmt(p)} kPa, calculated from the same fluid tables. This is a guide, not an additional cycle process.`, [`graph-isobar-${i}`]);
  for (const [i, p] of spec.processes.entries()) {
    const A = data.states.find((s) => s.label === p.from), B = data.states.find((s) => s.label === p.to);
    const constraint = CONSTANTS[p.path];
    const text = constraint ? `${constraint[0]}=${fmt(A[constraint[0]])} ${constraint[1]} is constant within table-rounding tolerance. ` : '';
    const caveat = p.path === 'straight' ? 'Dashed schematic connector: intermediate equilibrium states, heat and work cannot be inferred from this line.' : p.path === 'isenthalpic' ? 'Dashed constant-enthalpy equilibrium locus; an actual irreversible throttling device does not follow a measured quasistatic path. Do not infer boundary work from its area.' : p.path === 'isentropic' ? 'Constant entropy alone does not prove that a real process is both reversible and adiabatic.' : 'The path is an idealized sequence of equilibrium states under the stated constraint.';
    add('process', `6.${spec.isobars.length + i + 1} Draw ${p.from} → ${p.to} (${p.path})`, `${text}Follow the arrow from state ${p.from} to ${p.to}: (${fmt(A.xy[0])}, ${fmt(A.xy[1])}) → (${fmt(B.xy[0])}, ${fmt(B.xy[1])}) in the labeled axis units. ${caveat}${spec.type === 'PT' && A.xy.every((v, k) => Math.abs(v - B.xy[k]) <= 1e-5 * Math.max(1, Math.abs(v))) ? ' The endpoints overlap on this diagram; the direction is written explicitly because there is no nonzero geometric arrow to draw.' : ''}`, [`graph-process-${i}`]);
  }
  add('axes', '7. Check labels, units and physical consistency', 'Confirm every numbered state, process direction, phase, constant-property condition and unit against the problem. Table interpolation has finite accuracy, particularly near the critical point. This construction guide is not a guarantee of exam marks; use the course convention and rubric.');
  return steps;
}

function pythonRender(payload) {
  return new Promise((resolve, reject) => {
    let executable = process.env.KELVIN_PYTHON || 'python';
    if (!process.env.KELVIN_PYTHON) {
      const configuration = path.join(ROOT, '.grapher-runtime.json');
      if (fs.existsSync(configuration)) {
        try {
          if (fs.statSync(configuration).size > 8192) throw new Error('Oversize runtime settings');
          const settings = JSON.parse(fs.readFileSync(configuration, 'utf8'));
          if (typeof settings.pythonExecutable !== 'string' || !path.isAbsolute(settings.pythonExecutable)) throw new Error('Expected absolute interpreter path');
          executable = settings.pythonExecutable;
        } catch {
          reject(Object.assign(new Error('The local .grapher-runtime.json must specify an absolute pythonExecutable path.'), { statusCode: 503, status: 503 }));
          return;
        }
      }
    }
    const localPackages = path.join(ROOT, '.grapher-python');
    const pythonPath = [fs.existsSync(localPackages) ? localPackages : '', process.env.PYTHONPATH || ''].filter(Boolean).join(path.delimiter);
    let child;
    let output = '', errors = '', size = 0, done = false;
    const finish = (error, result) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (error) reject(error); else resolve(result);
    };
    const problem = (message) => Object.assign(new Error(message), { statusCode: 503, status: 503 });
    const timer = setTimeout(() => { child?.kill(); finish(problem('Python Grapher took too long. Try fewer states or processes.')); }, 30000);
    timer.unref?.();
    try {
      child = spawn(executable, [SCRIPT], { cwd: ROOT, shell: false, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, PYTHONPATH: pythonPath, MPLCONFIGDIR: path.join(os.tmpdir(), 'kelvin-grapher-matplotlib'), PYTHONIOENCODING: 'utf-8', PYTHONDONTWRITEBYTECODE: '1' } });
    } catch { finish(problem('Python Grapher is unavailable. Configure KELVIN_PYTHON with a Python interpreter that has matplotlib installed.')); return; }
    child.on('error', () => finish(problem('Python Grapher could not start. Configure KELVIN_PYTHON with a Python interpreter that has matplotlib installed.')));
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (part) => {
      size += Buffer.byteLength(part);
      if (size > 2 * 1024 * 1024) { child.kill(); finish(problem('Python Grapher exceeded its output limit.')); } else output += part;
    });
    child.stderr.on('data', (part) => { errors = (errors + part).slice(-8000); });
    child.stdin.on('error', () => {});
    child.on('close', (code) => {
      if (done) return;
      if (code !== 0) return finish(problem(/No module named ['"]matplotlib/.test(errors) ? 'Python Grapher needs matplotlib. Install scripts/grapher/requirements.txt into the configured Python environment.' : 'Python Grapher could not render this diagram. Check the configured Python environment.'));
      try {
        const result = JSON.parse(output);
        if (typeof result.svg !== 'string' || !/^<svg\b/.test(result.svg) || /<script\b|<foreignObject\b|\bon[a-z]+\s*=|(?:href|src)\s*=\s*["'](?!#)/i.test(result.svg)) throw new Error('Unsafe SVG');
        finish(null, result.svg);
      } catch { finish(problem('Python Grapher returned an invalid SVG.')); }
    });
    child.stdin.end(JSON.stringify(payload));
  });
}

export async function renderGrapher(input) {
  const spec = validateGrapherSpec(input);
  const key = JSON.stringify(spec);
  if (cache.has(key)) return structuredClone(cache.get(key));
  if (pending.has(key)) return structuredClone(await pending.get(key));
  if (active >= 2) fail('The Grapher is busy. Try again in a moment.', 429);
  active++;
  const work = (async () => {
    const F = loadFluid(spec.fluid);
    const data = diagram(spec, { strict: true });
    if (data.error) fail(data.error);
    if (data.problems.length || data.states.length !== spec.states.length || data.paths.length !== spec.processes.length) fail(data.problems.join(' ') || 'Not all graph elements could be resolved.');
    const dia = DIAGRAMS[spec.type];
    const regions = regionData(F, dia);
    const steps = buildSteps(spec, data, F, regions);
    const warnings = [
      'Values are interpolated from the local property tables; uncertainty increases near the critical point.',
      ...(spec.type === 'PT' ? ['P–T shows only liquid–vapor coexistence; solid-phase boundaries are omitted and quality cannot be read from this diagram.'] : []),
      ...(spec.processes.some((p) => p.path === 'straight' || p.path === 'isenthalpic') ? ['Dashed paths are schematic or idealized irreversible-process endpoint loci, not measured intermediate states.'] : []),
    ];
    const svg = await pythonRender({ ...data, regions, criticalProperties: F.critical });
    const ids = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    if (steps.some((step) => step.targets.some((target) => !ids.has(target)))) fail('Python Grapher returned incomplete animation targets.', 503);
    return { spec, svg, steps, states: data.states, axes: data.axes, warnings, source: data.source };
  })();
  pending.set(key, work);
  try {
    const result = await work;
    cache.set(key, result);
    while (cache.size > 16) cache.delete(cache.keys().next().value);
    return structuredClone(result);
  } finally { active--; pending.delete(key); }
}
