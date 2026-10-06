---
id: eq:isothermal-ideal-gas-property-changes
kind: equation
title: Isothermal ideal-gas internal-energy and enthalpy changes
description: Use to avoid unnecessarily integrating specific heats in an isothermal ideal-gas process.
parent: topic:m3-05-example-ideal-gas-calorific
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: \Delta T = 0 \Rightarrow \Delta u = 0, \; \Delta h = 0
plain_statement: For an ideal gas, if temperature is constant, u and h do not change.
symbols:
- T
- u
- h
valid_when:
- ideal-gas
- isothermal
invalid_when: []
misconceptions:
- misc:m04-heat-always-raises-temperature
sources:
- path: lectures/Module3_5_Example_IdealGasCalorific_annotated.pdf
  pages:
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Isothermal ideal-gas internal-energy and enthalpy changes

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\Delta T = 0 \Rightarrow \Delta u = 0, \; \Delta h = 0
$$

An ideal gas has u = u(T) and h = h(T). If the process is isothermal, delta T = 0, so both delta u and delta h are zero regardless of changes in pressure or volume. This does not mean no heat or work occurs in the process; it only constrains the property changes. Do not apply this to real fluids, where internal energy or enthalpy can change at constant temperature during a phase change.

**Taught in:** M3.5 (`topic:m3-05-example-ideal-gas-calorific`)
