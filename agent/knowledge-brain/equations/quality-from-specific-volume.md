---
id: eq:quality-from-specific-volume
kind: equation
title: Quality from specific volume
description: Use when a saturated mixture's specific volume is known and you need quality.
parent: topic:m4-02-vapor-dome
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: x = \frac{v - v_f}{v_g - v_f}
plain_statement: Within the dome, quality is the specific volume distance from saturated liquid divided
  by the saturated vapor-liquid difference.
symbols:
- x
- v
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
- path: lectures/Module4_3_PhaseDecisionTree_annotated.pdf
  pages:
  - 3
- path: lectures/Module4_4_Example_PhaseDecisionTree_annotated.pdf
  pages:
  - 2
- path: lectures/Module5_6_Example2_EnergyConservation_annotated.pptx
  slides:
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Quality from specific volume

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
x = \frac{v - v_f}{v_g - v_f}
$$

For a two-phase mixture, any specific property can be used to find quality because the mixture value lies between the saturated liquid value f and saturated vapor value g. The specific volume v is the mixture average, v_f is saturated liquid specific volume, and v_g is saturated vapor specific volume at the same T or P. The numerator is the excess volume above liquid; the denominator is the full liquid-to-vapor span. This linear interpolation is valid only inside the dome, not for compressed liquid or superheated vapor.

**Taught in:** M4.2 (`topic:m4-02-vapor-dome`), M4.3 (`topic:m4-03-phase-decision-tree`), M4.4 (`topic:m4-04-example-phase-decision-tree`), M5.6 (`topic:m5-06-example-2-energy-conservation`)
