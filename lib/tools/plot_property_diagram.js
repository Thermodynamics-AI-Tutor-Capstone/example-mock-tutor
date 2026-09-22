import { diagram, fluidId } from '../properties.js';

const INPUTS = ['T', 'P', 'x', 'v', 'u', 'h', 's'];

// The figure block holds only what was asked for; the browser sends it to /api/properties/diagram
// to get the curves, so a saved message redraws from the same tables.
function figureSpec(args, fluid) {
  const spec = { fluid, type: args.type };
  if (typeof args.title === 'string' && args.title.trim()) spec.title = args.title.trim().slice(0, 120);
  spec.states = (args.states || []).slice(0, 12).map((s, i) => {
    const out = { label: String(s?.label ?? i + 1).slice(0, 12) };
    for (const k of INPUTS) if (s?.[k] !== undefined && s[k] !== null && s[k] !== '') out[k] = Number(s[k]);
    return out;
  });
  if (Array.isArray(args.processes) && args.processes.length) {
    spec.processes = args.processes.slice(0, 16).map((p) => ({ from: String(p?.from), to: String(p?.to), path: p?.path || 'straight' }));
  }
  if (Array.isArray(args.isobars) && args.isobars.length) spec.isobars = args.isobars.slice(0, 6).map(Number);
  return spec;
}

export default async function run(args) {
  const fluid = fluidId(args.fluid);
  if (!fluid) return { error: 'Unknown fluid. Use "water" or "R-134a".' };
  const spec = figureSpec(args, fluid);
  const d = diagram(spec);
  if (d.error) return { error: d.error };
  if (!d.states.length) return { error: 'None of the states could be placed.', problems: d.problems };
  return {
    figure: '```kelvin-diagram\n' + JSON.stringify(spec) + '\n```',
    how_to_show: 'Copy the figure block into your reply exactly as it is, on its own lines. Do not describe it as an image you cannot show; the student will see it drawn.',
    states: d.states.map(({ label, phase, T, P, v, h, s, x }) => ({ label, phase, T, P, v, h, s, x })),
    problems: d.problems,
  };
}
