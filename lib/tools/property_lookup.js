import { state, fluidId, loadFluid } from '../properties.js';

export default async function run(args) {
  const fluid = fluidId(args.fluid);
  if (!fluid) return { error: 'Unknown fluid. Use "water" or "R-134a".' };
  const list = Array.isArray(args.states) && args.states.length ? args.states : [args];
  const F = loadFluid(fluid);
  return {
    fluid: F.name,
    units: 'T °C, P kPa, v m³/kg, u and h kJ/kg, s kJ/(kg·K)',
    states: list.slice(0, 8).map((s, i) => ({ label: String(s?.label ?? i + 1), ...state(fluid, s) })),
    source: `Interpolated from tables generated with ${F.source}; reference state: ${F.reference}.`,
  };
}
