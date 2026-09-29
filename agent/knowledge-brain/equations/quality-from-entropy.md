---
id: eq:quality-from-entropy
kind: equation
title: Quality from entropy for a saturated mixture
description: Use when the exit state falls in the two-phase dome and entropy must be converted to quality.
parent: topic:m7-13-example-isentropic-turbine
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$x_2 = \frac{s_2 - s_f}{s_g - s_f}$$
plain_statement: For a saturated mixture, quality is the fraction of the entropy change from saturated
  liquid to the actual entropy.
symbols:
- x
- s
valid_when:
- saturated-mixture
- pure-substance
invalid_when:
- superheated-vapor
- compressed-liquid
misconceptions: []
sources:
- path: lectures/Module7_13_Example_IsentropicTurbine_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Quality from entropy for a saturated mixture

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$x_2 = \frac{s_2 - s_f}{s_g - s_f}$$
$$

In the saturated mixture region, any intensive property y follows y = y_f + x(y_g - y_f). Solving for x with entropy gives this expression. The denominator is s_fg = s_g - s_f. Use saturated liquid and vapor entropy values at the specified pressure or temperature. The result must be between 0 and 1; otherwise the state is not a saturated mixture. This is often used after an isentropic steam expansion into the two-phase dome.

**Taught in:** M7.13 (`topic:m7-13-example-isentropic-turbine`)
