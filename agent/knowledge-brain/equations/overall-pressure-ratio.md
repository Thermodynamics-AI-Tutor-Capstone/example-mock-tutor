---
id: eq:overall-pressure-ratio
kind: equation
title: Overall pressure ratio
description: Use this to parameterize a gas-turbine or Brayton cycle; station labels vary, e.g. P_3/P_1
  or P_2/P_1.
parent: topic:m8-09-brayton-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \mathrm{OPR}=\frac{P_{\mathrm{out}}}{P_{\mathrm{in}}}
plain_statement: Overall pressure ratio is the compressor discharge pressure divided by the compressor
  inlet pressure.
symbols: []
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module8_9_BraytonCycle_annotated.pdf
  pages:
  - 6
- path: lectures/Module8_11_GasTurbineEngines_annotated.pdf
  pages:
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Overall pressure ratio

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\mathrm{OPR}=\frac{P_{\mathrm{out}}}{P_{\mathrm{in}}}
$$

The overall pressure ratio is a key cycle parameter in gas-turbine analysis. It is the compressor exit pressure divided by the compressor inlet pressure. Depending on how the cycle stations are numbered, the lecture writes OPR = P_3/P_1 in one cycle and OPR = P_2/P_1 in another. The definition is the same: high-side pressure over low-side pressure. Higher OPR increases the ideal Brayton efficiency. Use this parameter to compute isentropic temperature ratios and the ideal Brayton efficiency. Do not confuse it with the volume compression ratio in Otto or Diesel cycles.

**Taught in:** M8.9 (`topic:m8-09-brayton-cycle`), M8.11 (`topic:m8-11-gas-turbine-engines`)
