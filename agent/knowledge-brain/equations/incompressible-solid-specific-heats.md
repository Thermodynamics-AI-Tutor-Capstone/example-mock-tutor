---
id: eq:incompressible-solid-specific-heats
kind: equation
title: Incompressible solid specific heats
description: Use when modeling a solid as incompressible to simplify internal-energy and enthalpy calculations.
parent: topic:m4-05-liquid-solid
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: v = \frac{1}{\rho} = \text{constant} \quad \Rightarrow \quad c_v = c_p = c
plain_statement: For an incompressible solid, specific volume is constant and cv equals cp.
symbols:
- v
- \rho
- c_v
- c_p
- c
valid_when:
- incompressible
invalid_when:
- ideal-gas
- superheated-vapor
misconceptions: []
sources:
- path: lectures/Module4_5_LiquidSolid_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Incompressible solid specific heats

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
v = \frac{1}{\rho} = \text{constant} \quad \Rightarrow \quad c_v = c_p = c
$$

An incompressible solid has constant specific volume, so density is constant. As a result the constant-pressure and constant-volume specific heats become equal, written as a single c. This removes the distinction between c_p and c_v for such substances. Use this approximation only for incompressible solids; gases and superheated vapors generally require the appropriate ideal-gas specific-heat relations.

**Taught in:** M4.5 (`topic:m4-05-liquid-solid`)
