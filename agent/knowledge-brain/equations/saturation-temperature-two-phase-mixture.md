---
id: eq:saturation-temperature-two-phase-mixture
kind: equation
title: Saturation temperature for a two-phase mixture
description: Use to find T if a two-phase mixture is at a known pressure.
parent: topic:m4-03-phase-decision-tree
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: T = T_{\text{sat}}(P)
plain_statement: For a saturated mixture at a known pressure, the temperature is the saturation temperature.
symbols:
- T
- P
valid_when:
- saturated-mixture
invalid_when:
- compressed-liquid
- superheated-vapor
misconceptions: []
sources:
- path: lectures/Module4_3_PhaseDecisionTree_annotated.pdf
  pages:
  - 3
- path: lectures/Module4_4_Example_PhaseDecisionTree_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Saturation temperature for a two-phase mixture

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
T = T_{\text{sat}}(P)
$$

Inside the saturation dome, pressure and temperature are not independent. If the mixture is known to be two-phase liquid-vapor at pressure P, the temperature must be the saturation temperature corresponding to that pressure. This is read from the saturation tables. The relation fails for compressed liquid or superheated vapor, where T and P are independent and must be specified separately.

**Taught in:** M4.3 (`topic:m4-03-phase-decision-tree`), M4.4 (`topic:m4-04-example-phase-decision-tree`)
