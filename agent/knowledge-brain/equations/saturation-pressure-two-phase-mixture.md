---
id: eq:saturation-pressure-two-phase-mixture
kind: equation
title: Saturation pressure for a two-phase mixture
description: Use to find P if a two-phase mixture is at a known temperature.
parent: topic:m4-03-phase-decision-tree
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: P = P_{\text{sat}}(T)
plain_statement: For a saturated mixture at a known temperature, the pressure is the saturation pressure.
symbols:
- P
- T
valid_when:
- saturated-mixture
invalid_when:
- compressed-liquid
- superheated-vapor
misconceptions: []
sources:
- path: lectures/Module4_3_PhaseDecisionTree_annotated.pdf
  pages:
  - 4
- path: lectures/Module4_4_Example_PhaseDecisionTree_annotated.pdf
  pages:
  - 2
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Saturation pressure for a two-phase mixture

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
P = P_{\text{sat}}(T)
$$

Inside the saturation dome, pressure and temperature are not independent. If the mixture is known to be two-phase liquid-vapor at temperature T, the pressure must be the saturation pressure corresponding to that temperature. This is read from the saturation tables. The relation fails for compressed liquid or superheated vapor, where T and P are independent and must be specified separately.

**Taught in:** M4.3 (`topic:m4-03-phase-decision-tree`), M4.4 (`topic:m4-04-example-phase-decision-tree`)
