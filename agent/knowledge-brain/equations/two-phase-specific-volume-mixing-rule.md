---
id: eq:two-phase-specific-volume-mixing-rule
kind: equation
title: Two-phase specific-volume mixing rule
description: Use to get the specific volume of a saturated mixture when quality is known.
parent: topic:m4-02-vapor-dome
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: v = x v_g + (1-x) v_f
plain_statement: Mixture specific volume is the quality-weighted average of saturated-vapor and saturated-liquid
  specific volumes.
symbols:
- v
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
- path: lectures/Module4_4_Example_PhaseDecisionTree_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Two-phase specific-volume mixing rule

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
v = x v_g + (1-x) v_f
$$

This is the quality-weighted mixing rule. The mixture vapor mass fraction is x, so its specific volume is the vapor contribution x v_g plus the liquid contribution (1-x) v_f, because both phases share the same temperature and pressure. The same pattern appears for internal energy and enthalpy. It is only valid for a saturated mixture, not for compressed liquid or superheated vapor.

**Taught in:** M4.2 (`topic:m4-02-vapor-dome`), M4.4 (`topic:m4-04-example-phase-decision-tree`)
