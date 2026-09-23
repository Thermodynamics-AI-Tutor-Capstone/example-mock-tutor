import { state as propertyState } from './properties.js';

// Physical constraints as code, the way CyclePad verified (Research/knowledge/concepts/
// grounding-and-verification.md): a claim that breaks a law is a detectable contradiction, not a
// plausible sentence. The tutoring model and the server's solver pass in the numbers a claim rests
// on; this says which laws they break. Deterministic, no model involved.
//
// Every group is optional. Temperatures are kelvin. Specific quantities are kJ/kg or kJ/(kg·K).

const REL_TOL = 0.01;

const num = (x) => (typeof x === 'number' && Number.isFinite(x) ? x : null);
const pct = (x) => `${Math.round(x * 1000) / 10}%`;

export function checkConstraints(claims = {}) {
  const violations = [];
  const passed = [];
  const note = (ok, label, message) => (ok ? passed : violations).push(ok ? label : `${label}: ${message}`);

  for (const q of claims.qualities || []) {
    const x = num(q.x);
    if (x === null) continue;
    note(x >= -1e-9 && x <= 1 + 1e-9, `quality ${q.label || ''}`.trim(), `x = ${x} is outside 0 ≤ x ≤ 1 (quality is the VAPOR mass fraction; outside the dome there is no quality)`);
  }

  for (const t of claims.temperatures_K || []) {
    const T = num(t.T);
    if (T === null) continue;
    note(T > 0, `temperature ${t.label || ''}`.trim(), `T = ${T} K is not above absolute zero (a °C value used as K?)`);
  }

  for (const s of claims.entropy_generation || []) {
    const g = num(s.s_gen);
    if (g === null) continue;
    note(g >= -1e-6, `entropy generation ${s.label || ''}`.trim(), `s_gen = ${g} < 0 violates the second law (check signs and which system the balance is drawn around)`);
  }

  for (const e of claims.efficiencies || []) {
    const v = num(e.value);
    if (v === null) continue;
    const label = `${e.kind || 'efficiency'} ${e.label || ''}`.trim();
    if (v <= 0 || v > 1 + 1e-9) {
      note(false, label, `${v} is outside (0, 1]${v > 1 ? ' (an efficiency above 100%: is this really a COP, or a ratio written upside down?)' : ''}`);
      continue;
    }
    const TH = num(e.T_hot_K);
    const TL = num(e.T_cold_K);
    if (e.kind === 'thermal' && TH && TL && TH > TL) {
      const carnot = 1 - TL / TH;
      note(v <= carnot * (1 + 1e-6), label, `${pct(v)} exceeds the Carnot limit ${pct(carnot)} between ${TL} K and ${TH} K`);
    } else note(true, label);
  }

  for (const c of claims.cops || []) {
    const v = num(c.value);
    if (v === null) continue;
    const label = `COP ${c.kind || ''} ${c.label || ''}`.replace(/\s+/g, ' ').trim();
    if (v <= 0) {
      note(false, label, `COP = ${v} must be positive`);
      continue;
    }
    if (c.kind === 'heat_pump' && v < 1 - 1e-9) {
      note(false, label, `a heat pump's COP is at least 1 (Q_H = Q_L + W), got ${v}`);
      continue;
    }
    const TH = num(c.T_hot_K);
    const TL = num(c.T_cold_K);
    if (TH && TL && TH > TL) {
      const max = c.kind === 'heat_pump' ? TH / (TH - TL) : TL / (TH - TL);
      note(v <= max * (1 + 1e-6), label, `${v} exceeds the Carnot COP ${Math.round(max * 100) / 100} between ${TL} K and ${TH} K`);
    } else note(true, label);
  }

  // A real compressor or pump needs MORE work than the isentropic one: h2 − h1 ≥ h2s − h1 (for an
  // ideal gas with constant cp, T2 ≥ T2s). A real turbine or nozzle delivers LESS: h1 − h2 ≤ h1 − h2s.
  for (const c of claims.compressors || []) {
    const [a, b, i] = [num(c.h1 ?? c.T1), num(c.h2 ?? c.T2), num(c.h2s ?? c.T2s)];
    if (a === null || b === null || i === null) continue;
    const label = `compressor ${c.label || ''}`.trim();
    note(b - a >= (i - a) * (1 - 1e-6), label, `actual rise ${Math.round((b - a) * 100) / 100} is smaller than the isentropic rise ${Math.round((i - a) * 100) / 100}: the real exit must be hotter than the ideal one (η_c = (h2s − h1)/(h2 − h1), not the inverse)`);
  }
  for (const t of claims.turbines || []) {
    const [a, b, i] = [num(t.h1 ?? t.T1), num(t.h2 ?? t.T2), num(t.h2s ?? t.T2s)];
    if (a === null || b === null || i === null) continue;
    const label = `${t.device || 'turbine'} ${t.label || ''}`.trim();
    note(a - b <= (a - i) * (1 + 1e-6), label, `actual drop ${Math.round((a - b) * 100) / 100} exceeds the isentropic drop ${Math.round((a - i) * 100) / 100}: a real expansion can't beat the isentropic one`);
  }

  for (const h of claims.heat_flows || []) {
    const [from, to] = [num(h.from_T_K), num(h.to_T_K)];
    if (from === null || to === null) continue;
    const label = `heat flow ${h.label || ''}`.trim();
    note(h.with_work === true || from >= to, label, `heat flowing on its own from ${from} K to a hotter ${to} K violates the second law (Clausius) unless work drives it`);
  }

  for (const b of claims.energy_balances || []) {
    const sum = (xs) => (Array.isArray(xs) ? xs.map(num).filter((x) => x !== null).reduce((s, x) => s + x, 0) : 0);
    const inn = sum(b.in);
    const out = sum(b.out);
    const storage = num(b.storage_change) ?? 0;
    const residual = inn - out - storage;
    const scale = Math.max(Math.abs(inn), Math.abs(out), Math.abs(storage), 1e-9);
    const tol = num(b.tolerance) ?? REL_TOL * scale;
    note(Math.abs(residual) <= tol, `energy balance ${b.label || ''}`.trim(), `in − out − ΔE = ${Math.round(residual * 1000) / 1000} (in ${inn}, out ${out}, ΔE ${storage}): the balance doesn't close`);
  }

  // Stated property values against the verified tables (agent/properties). Catches a value recalled
  // from memory: the round-2 eval's "s_g at 10 kPa = 7.50" (the table gives 8.1488).
  for (const p of claims.property_values || []) {
    const st = propertyState(p.fluid || 'water', p.given || {});
    const label = `${p.fluid || 'water'} ${p.label || JSON.stringify(p.given || {})}`;
    if (st.error) {
      violations.push(`${label}: can't check (${st.error})`);
      continue;
    }
    for (const [k, v] of Object.entries(p.stated || {})) {
      const claimed = num(v);
      const truth = num(st[k] ?? st.saturation?.[k]);
      if (claimed === null || truth === null) continue;
      const tol = Math.max(Math.abs(truth) * 0.005, k === 'x' ? 0.005 : k === 's' ? 0.002 : 0.5);
      note(Math.abs(claimed - truth) <= tol, `${label} ${k}`, `stated ${claimed}, the tables give ${Math.round(truth * 10000) / 10000}`);
    }
  }

  return { ok: violations.length === 0, violations, checked: passed.length + violations.length };
}
