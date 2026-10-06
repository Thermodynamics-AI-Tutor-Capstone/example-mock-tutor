---
id: eq:incompressible-liquid-v-u-approximation
kind: equation
title: Incompressible liquid v and u approximation
description: Use when modeling a compressed liquid where pressure dependence of v and u can be neglected.
parent: topic:m4-05-liquid-solid
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: v(T,P) \approx v(T), \quad u(T,P) \approx u(T)
plain_statement: For an incompressible or compressed liquid, specific volume and internal energy are approximated
  as functions of temperature only.
symbols:
- v
- u
- T
- P
valid_when:
- compressed-liquid
- incompressible
invalid_when:
- saturated-mixture
- superheated-vapor
misconceptions: []
sources:
- path: lectures/Module4_5_LiquidSolid_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Incompressible liquid v and u approximation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
v(T,P) \approx v(T), \quad u(T,P) \approx u(T)
$$

For a compressed liquid, specific volume and internal energy vary only weakly with pressure, so the lecture approximates them as functions of temperature alone. In table-based calculations, this means using saturated-liquid values at the given temperature: v(T,P) is read as v_f(T) and u(T,P) as u_f(T). This approximation fails for saturated mixtures and superheated vapors, where phase composition or pressure dependence cannot be ignored.

**Taught in:** M4.5 (`topic:m4-05-liquid-solid`)
