---
id: eq:reversible-heat-temperature-ratio
kind: equation
title: Reversible-cycle heat/temperature ratio
description: Use to convert between heat-transfer ratios and temperature ratios for reversible cycles.
parent: topic:m7-04-kelvin-planck
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\frac{Q_H}{Q_L} = \frac{T_H}{T_L}$$
plain_statement: For a reversible cycle, the ratio of heat transfers between two reservoirs equals the
  ratio of absolute temperatures.
symbols:
- Q_H
- Q_L
- T_H
- T_L
valid_when:
- reversible
invalid_when:
- irreversible
misconceptions: []
sources:
- path: lectures/Module7_4_KelvinPlanck_annotated.pdf
  pages:
  - 5
- path: lectures/Module7_7_Entropy_annotated.pdf
  pages:
  - 3
- path: lectures/Module7_8_Example_Entropy_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Reversible-cycle heat/temperature ratio

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\frac{Q_H}{Q_L} = \frac{T_H}{T_L}$$
$$

This relation follows from the thermodynamic temperature scale. For a reversible cycle, the heat transfers to and from the reservoirs are proportional to the reservoir absolute temperatures, so the ratio Q_H/Q_L equals T_H/T_L. It is the bridge between the first-law efficiency expression and the Carnot limit: substituting into eta = 1 - Q_L/Q_H gives 1 - T_L/T_H. Do not apply it to an irreversible cycle, where the heat-transfer ratio is not equal to the reservoir temperature ratio. The temperatures must be absolute.

**Taught in:** M7.4 (`topic:m7-04-kelvin-planck`), M7.7 (`topic:m7-07-entropy`), M7.8 (`topic:m7-08-example-entropy`)
