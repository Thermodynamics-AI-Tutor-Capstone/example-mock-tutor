---
id: eq:constant-specific-heat-ideal-gas-changes
kind: equation
title: Constant-specific-heat ideal-gas changes
description: Use the simplified finite form when the temperature range is small enough to treat c_v and
  c_p as constant.
parent: topic:m3-04-ideal-gas-calorific
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: \Delta u = c_v \Delta T, \quad \Delta h = c_p \Delta T
plain_statement: For an ideal gas with constant specific heats, finite changes are the specific heat times
  the temperature difference.
symbols:
- u
- h
- c_v
- c_p
- T
valid_when:
- ideal-gas
- constant-specific-heats
invalid_when:
- variable-specific-heats
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module3_4_IdealGasCalorific_annotated.pdf
  pages:
  - 3
- path: lectures/Module3_5_Example_IdealGasCalorific_annotated.pdf
  pages:
  - 5
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Constant-specific-heat ideal-gas changes

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\Delta u = c_v \Delta T, \quad \Delta h = c_p \Delta T
$$

When the ideal-gas specific heats can be treated as constant, the integrals simplify to delta u = c_v delta T and delta h = c_p delta T. Use absolute temperature units; the temperature difference is the same in K or degrees C. Do not use c_p for delta u or c_v for delta h. Use only for an ideal gas with constant specific heats; for large temperature changes use the variable-specific-heat integrals.

**Taught in:** M3.4 (`topic:m3-04-ideal-gas-calorific`), M3.5 (`topic:m3-05-example-ideal-gas-calorific`)
