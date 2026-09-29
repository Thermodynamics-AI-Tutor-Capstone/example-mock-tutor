---
id: eq:two-phase-internal-energy-mixing-rule
kind: equation
title: Two-phase internal-energy mixing rule
description: Use to get the internal energy of a saturated mixture when quality is known.
parent: topic:m4-02-vapor-dome
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: u = x u_g + (1-x) u_f
plain_statement: Mixture specific internal energy is the quality-weighted average of saturated-vapor and
  saturated-liquid internal energies.
symbols:
- u
- x
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
- path: lectures/Module5_6_Example2_EnergyConservation_annotated.pptx
  slides:
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Two-phase internal-energy mixing rule

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
u = x u_g + (1-x) u_f
$$

This is the quality-weighted mixing rule for internal energy. The mixture vapor mass fraction is x, so its specific internal energy is the vapor contribution x u_g plus the liquid contribution (1-x) u_f. Both phases are evaluated at the same saturation temperature or pressure. Use it only inside the saturated-mixture dome; do not apply it to compressed liquid or superheated vapor.

**Taught in:** M4.2 (`topic:m4-02-vapor-dome`), M5.6 (`topic:m5-06-example-2-energy-conservation`)
