---
id: eq:two-phase-enthalpy-mixing-rule
kind: equation
title: Two-phase enthalpy mixing rule
description: Use to get the specific enthalpy of a saturated mixture when quality is known.
parent: topic:m4-04-example-phase-decision-tree
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: h = x h_g + (1-x) h_f
plain_statement: Mixture specific enthalpy is the quality-weighted average of saturated-vapor and saturated-liquid
  enthalpies.
symbols:
- h
- x
valid_when:
- saturated-mixture
invalid_when:
- compressed-liquid
- superheated-vapor
misconceptions: []
sources:
- path: lectures/Module4_4_Example_PhaseDecisionTree_annotated.pdf
  pages:
  - 2
- path: lectures/Module6_3_Example_SteadyFlowEnergyConservation_annotated.pdf
  pages:
  - 5
- path: lectures/Module7_13_Example_IsentropicTurbine_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Two-phase enthalpy mixing rule

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
h = x h_g + (1-x) h_f
$$

This is the quality-weighted mixing rule for enthalpy. The mixture vapor mass fraction is x, so its specific enthalpy is the vapor contribution x h_g plus the liquid contribution (1-x) h_f. Both phases are evaluated at the same saturation temperature or pressure. Use it only inside the saturated-mixture dome; do not apply it to compressed liquid or superheated vapor.

**Also written in the lectures as:**

- $h_2 = x_2 h_g + (1-x_2) h_f$

**Taught in:** M4.4 (`topic:m4-04-example-phase-decision-tree`), M6.3 (`topic:m6-03-example-steady-flow-energy-conservation`), M7.13 (`topic:m7-13-example-isentropic-turbine`)
