# Property tables

`water.json` and `r134a.json` hold the numbers behind the `property_lookup` and
`plot_property_diagram` tools. Kelvin never recalls a table value from memory: it reads these.

## Where the numbers come from

They were computed with [CoolProp](http://www.coolprop.org) 8.0.0, which implements the same
reference equations of state the printed textbook tables are made from:

| Fluid | Equation of state | Reference state |
|---|---|---|
| Water | IAPWS-95 | u = 0 and s = 0 for saturated liquid at the triple point |
| R-134a | Tillner-Roth & Baehr (1994) | h = 0 and s = 0 for saturated liquid at −40 °C (ASHRAE) |

The reference states match Çengel and Moran, so a value here should match the student's table to
the printed digits. Spot checks: water at 1 MPa and 300 °C gives v = 0.25799 m³/kg, u = 2793.7,
h = 3051.6 kJ/kg, s = 7.1246 kJ/(kg·K); saturated water at 10 kPa gives Tsat = 45.81 °C,
hf = 191.81, hfg = 2392.1 kJ/kg, sg = 8.1488.

The app itself does not run CoolProp. It interpolates these tables, the way a student reads a
printed table but on a far finer grid: linear in temperature along a row of constant pressure, and
linear in ln P between rows.

## What is in each file

- `sat` — the saturation table by temperature (0.5 °C steps, 0.05 °C near the critical point), with
  Psat and vf, vg, uf, ug, hf, hg, sf, sg.
- `grid` — rows of constant pressure. Each row is split at its saturation temperature into a liquid
  segment ending at saturated liquid and a vapor segment starting at saturated vapor, so no
  interpolation ever crosses the dome. Rows above the critical pressure hold one segment.
- Water covers 0.01–1300 °C and 0.61 kPa–100 MPa; R-134a covers −100 to 180 °C and 0.39 kPa–10 MPa.

## How accurate it is

`node scripts/properties/test.mjs` compares the interpolation against 1,240 exact CoolProp states
and against printed textbook values, and fails if anything drifts. Typical (95th percentile) errors:
h and u within 0.07 kJ/kg, s within 0.0001 kJ/(kg·K), v within 0.005%, and a temperature found from
(P, h) within 0.03 °C. Worst case, in the pseudo-critical region where properties bend sharply,
about 1 kJ/kg in h — still well inside what interpolating a printed table by hand would give you.
States that fall on a table row and a grid temperature are exact.

Near the critical point the tools say so in a note, because interpolation there is least reliable.

## Regenerating

```bash
python3 -m venv /tmp/cpvenv && /tmp/cpvenv/bin/pip install CoolProp==8.0.0
/tmp/cpvenv/bin/python scripts/properties/generate_tables.py
node scripts/properties/test.mjs
```

Adding a fluid (air tables, ammonia, R-22) means one more entry in `FLUIDS` in that script, plus its
alias in `lib/properties.js`. Ideal-gas air tables (the A-17 style table with h, u, s°, Pr and vr)
are not here yet: they need a different treatment, since they are tabulated against temperature alone.
