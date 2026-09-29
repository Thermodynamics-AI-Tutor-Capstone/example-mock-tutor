---
id: eq:saturated-mixture-quality-enthalpy
kind: equation
title: Saturated mixture quality and enthalpy
description: Use this when a turbine exit or other state is in the saturated mixture region and entropy
  is known.
parent: topic:m8-06-example-rankine-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: x=\frac{s-s_f}{s_g-s_f},\quad h=x h_g+(1-x)h_f
plain_statement: For a saturated mixture, quality is the entropy difference above saturated liquid divided
  by the entropy of vaporization; enthalpy is the corresponding mass-weighted mixture value.
symbols:
- x
- s
- h
valid_when:
- saturated-mixture
- pure-substance
invalid_when:
- compressed-liquid
- superheated-vapor
misconceptions:
- misc:m11-state-function-vs-path-function
sources:
- path: lectures/Module8_6_Example_RankineCycle_annotated.pdf
  pages:
  - 4
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
  - 12
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Saturated mixture quality and enthalpy

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
x=\frac{s-s_f}{s_g-s_f},\quad h=x h_g+(1-x)h_f
$$

For a state in the two-phase saturated-mixture region, quality is computed from the known entropy using the saturated liquid and saturated vapor values. Once quality is known, the specific enthalpy is the mass-weighted mixture value h_f + x(h_g - h_f). This is used to find the ideal turbine exit state in Rankine cycles, often denoted h_{4s}. Students sometimes apply this formula to compressed liquid or superheated vapor states, where quality is not defined. Also, if the property used to find quality is enthalpy rather than entropy, use the corresponding h_f and h_g difference rather than s_f and s_g.

**Taught in:** M8.6 (`topic:m8-06-example-rankine-cycle`), M8.12 (`topic:m8-12-example-gas-turbine-engines`)
