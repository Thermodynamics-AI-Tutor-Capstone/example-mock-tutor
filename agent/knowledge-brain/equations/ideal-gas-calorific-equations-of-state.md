---
id: eq:ideal-gas-calorific-equations-of-state
kind: equation
title: Ideal-gas calorific equations of state
description: Use this to simplify u and h changes whenever the ideal-gas model applies.
parent: topic:m3-04-ideal-gas-calorific
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: u = u(T), \quad h = h(T)
plain_statement: For an ideal gas, specific internal energy and specific enthalpy depend only on temperature.
symbols:
- u
- h
- T
valid_when:
- ideal-gas
invalid_when: []
misconceptions:
- misc:m06-temperature-is-internal-energy
sources:
- path: lectures/Module3_4_IdealGasCalorific_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal-gas calorific equations of state

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
u = u(T), \quad h = h(T)
$$

For an ideal gas, the only contribution to internal energy and enthalpy is molecular kinetic energy, so both u and h are functions of temperature alone. This is why property changes for ideal gases can be computed from specific heats and temperature changes. It is an ideal-gas-only statement; for a real substance u and h may also depend on pressure or specific volume. Do not use this simplification for liquid, vapor, or two-phase mixtures.

**Taught in:** M3.4 (`topic:m3-04-ideal-gas-calorific`)
