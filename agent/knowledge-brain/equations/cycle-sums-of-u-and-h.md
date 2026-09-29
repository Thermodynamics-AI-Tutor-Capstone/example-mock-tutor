---
id: eq:cycle-sums-of-u-and-h
kind: equation
title: Cycle sums of internal energy and enthalpy changes
description: Use when analyzing a complete thermodynamic cycle to enforce state-function return.
parent: topic:m3-05-example-ideal-gas-calorific
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: \sum \Delta u = 0, \quad \sum \Delta h = 0
plain_statement: Over a closed cycle the working fluid returns to its initial state, so the sums of u
  and h changes are zero.
symbols:
- u
- h
valid_when:
- closed-system
invalid_when: []
misconceptions:
- misc:m11-state-function-vs-path-function
sources:
- path: lectures/Module3_5_Example_IdealGasCalorific_annotated.pdf
  pages:
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Cycle sums of internal energy and enthalpy changes

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\sum \Delta u = 0, \quad \sum \Delta h = 0
$$

Internal energy and enthalpy are state functions, so their change over a full cycle is zero because the working fluid returns to its initial state. This is true for closed systems; the sum of delta u around the cycle equals zero, and the sum of delta h equals zero. Use this to check cycle calculations or to relate process property changes. It does not say the total external heat or work sums are zero.

**Taught in:** M3.5 (`topic:m3-05-example-ideal-gas-calorific`)
