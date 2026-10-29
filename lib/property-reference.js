import { state, fluidId, loadFluid } from './properties.js';

const UNITS = { P: 'kPa', T: '°C', x: 'dimensionless', v: 'm³/kg', u: 'kJ/kg', h: 'kJ/kg', s: 'kJ/(kg·K)' };
export function propertyReference(body) {
  const fluid = fluidId(body?.fluid);
  if (!fluid) return { error: 'Choose water or R-134a.' };
  const inputs = body?.properties;
  if (!inputs || typeof inputs !== 'object' || Array.isArray(inputs)) return { error: 'Supply two known properties.' };
  const keys = Object.keys(inputs);
  if (keys.length !== 2 || keys.some((key) => !Object.hasOwn(UNITS, key))) return { error: 'Choose exactly two supported properties: P, T, x, v, u, h or s.' };
  if (keys.some((key) => typeof inputs[key] !== 'number' || !Number.isFinite(inputs[key]))) return { error: 'Both property values must be finite numbers in the displayed units.' };
  const result = state(fluid, inputs);
  if (result.error) return { error: result.error };
  if (['P','T','v','u','h','s'].some((key) => !Number.isFinite(result[key]))) return { error: 'A finite state could not be found in the installed tables. Check the properties and their units.' };
  const source = loadFluid(fluid);
  return { kind: 'interpolated-property-reference', fluid: result.fluid, inputs: { ...inputs }, state: result, units: UNITS,
    source: `Interpolated from tables generated with ${source.source}; reference state: ${source.reference}.`,
    note: 'Numeric reference from KELVIN’s installed property data. These are not transcriptions of the course-page scans. Interpolation and reference-state differences may affect comparison with printed tables.' };
}
