---
id: eq:quality-from-specific-internal-energy
kind: equation
title: Quality from specific internal energy
description: Use when a saturated mixture's specific internal energy is known and quality is needed.
parent: topic:m4-02-vapor-dome
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: x = \frac{u - u_f}{u_g - u_f}
plain_statement: Within the dome, quality is the internal-energy distance from saturated liquid divided
  by the saturated vapor-liquid difference.
symbols:
- x
- u
valid_when:
- saturated-mixture
invalid_when:
- compressed-liquid
- superheated-vapor
misconceptions: []
sources:
- path: lectures/Module4_2_VaporDome_annotated.pdf
  pages:
  - 3
- path: lectures/Module4_4_Example_PhaseDecisionTree_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Quality from specific internal energy

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
x = \frac{u - u_f}{u_g - u_f}
$$

This is the energy-based form of the quality calculation. For a two-phase mixture, the mixture internal energy u lies between the saturated liquid value u_f and the saturated vapor value u_g at the same temperature or pressure. The numerator measures how far the mixture internal energy is above saturated liquid, and the denominator measures the full saturated liquid-to-vapor span. Use it when the mixture internal energy is known, generally after an energy balance. It is not valid outside the saturated-mixture region.

**Taught in:** M4.2 (`topic:m4-02-vapor-dome`), M4.4 (`topic:m4-04-example-phase-decision-tree`)
