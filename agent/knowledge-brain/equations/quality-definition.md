---
id: eq:quality-definition
kind: equation
title: Quality of a two-phase mixture
description: Use to find the mass fraction of vapor when a saturated mixture contains both liquid and
  vapor phases.
parent: topic:m4-01-phase-change
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: x = \frac{M_g}{M_f + M_g}
plain_statement: Quality is vapor mass divided by total liquid-plus-vapor mass in a saturated mixture.
symbols:
- x
- M
valid_when:
- saturated-mixture
invalid_when:
- compressed-liquid
- superheated-vapor
- ideal-gas
misconceptions: []
sources:
- path: lectures/Module4_1_PhaseChange_annotated.pdf
  pages:
  - 3
  - 5
- path: lectures/Module4_2_VaporDome_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Quality of a two-phase mixture

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
x = \frac{M_g}{M_f + M_g}
$$

Quality x is defined as the mass of saturated vapor M_g divided by the total mass of saturated liquid and vapor, M_f + M_g. It is only meaningful inside the vapor dome where both phases coexist; for a compressed liquid there is no vapor mass, and for a superheated vapor there is no liquid mass. The lecture also writes it equivalently as M_vapor/(M_vapor+M_liquid). Keep masses on a consistent basis and do not confuse quality with volume fraction.

**Taught in:** M4.1 (`topic:m4-01-phase-change`), M4.2 (`topic:m4-02-vapor-dome`)
