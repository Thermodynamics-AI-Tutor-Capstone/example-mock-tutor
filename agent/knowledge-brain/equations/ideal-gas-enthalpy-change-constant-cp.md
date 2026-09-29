---
id: eq:ideal-gas-enthalpy-change-constant-cp
kind: equation
title: Ideal-gas constant-cp enthalpy change
description: Use for ideal-gas constant-cp processes to compute enthalpy changes from temperature changes.
parent: topic:m6-09-example-compressors-turbines
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: \Delta h = c_p (T_2 - T_1)
plain_statement: For an ideal gas with constant specific heats, the specific enthalpy change is cp times
  the temperature change.
symbols:
- h
- c_p
- T
valid_when:
- ideal-gas
- constant-specific-heats
invalid_when:
- variable-specific-heats
misconceptions: []
sources:
- path: lectures/Module6_9_Example_CompressorsTurbines_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal-gas constant-cp enthalpy change

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\Delta h = c_p (T_2 - T_1)
$$

For an ideal gas with constant specific heat, enthalpy is a function of temperature only, and the change is $c_p$ times the temperature change. Use this for air or other gases when the constant-specific-heat ideal-gas model is acceptable. Do not use it across a phase change or when variable specific heats are required. The constant $c_p$ is the specific heat at constant pressure, but for an ideal-gas enthalpy change it is used regardless of whether the process is constant-pressure.

**Taught in:** M6.9 (`topic:m6-09-example-compressors-turbines`)
