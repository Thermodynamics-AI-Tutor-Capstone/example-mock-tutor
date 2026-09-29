---
id: eq:isothermal-ideal-gas-boundary-work
kind: equation
title: Isothermal ideal-gas boundary work
description: Use for a quasi-equilibrium isothermal process of an ideal gas in a closed system.
parent: topic:m5-03-example-work
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.7
latex: ${}_1W_2 = M R T \ln\left(\frac{\mathcal{V}_2}{\mathcal{V}_1}\right)$
plain_statement: For an isothermal process of an ideal gas, boundary work equals mass times gas constant
  times absolute temperature times the log of the volume ratio.
symbols:
- M
- R
- T
- \mathcal{V}
valid_when:
- closed-system
- ideal-gas
- isothermal
- quasi-equilibrium
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module5_3_Example_Work_annotated.pdf
  pages:
  - 4
- path: lectures/Module5_7_Example3_EnergyConservation_annotated.pptx
  slides:
  - 10
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Isothermal ideal-gas boundary work

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
${}_1W_2 = M R T \ln\left(\frac{\mathcal{V}_2}{\mathcal{V}_1}\right)$
$$

For an ideal gas with $T$ constant, the ideal-gas relation gives $P = MRT/\mathcal{V}$. Substituting into the boundary-work integral and integrating yields the logarithmic form. The temperature must be absolute. The sign depends on the volume ratio: expansion gives positive work out, compression gives negative work.

**Taught in:** M5.3 (`topic:m5-03-example-work`), M5.7 (`topic:m5-07-example-3-energy-conservation`)
