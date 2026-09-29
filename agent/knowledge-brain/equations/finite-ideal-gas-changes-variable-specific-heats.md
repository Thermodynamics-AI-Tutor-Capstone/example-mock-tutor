---
id: eq:finite-ideal-gas-changes-variable-specific-heats
kind: equation
title: Finite ideal-gas changes with variable specific heats
description: Use when specific heats vary with temperature and you have c_v(T) or c_p(T) data.
parent: topic:m3-04-ideal-gas-calorific
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: \Delta u = \int_{T_1}^{T_2} c_v(T)\,dT, \quad \Delta h = \int_{T_1}^{T_2} c_p(T)\,dT
plain_statement: Finite changes in ideal-gas u and h are the temperature integrals of the specific heats.
symbols:
- u
- h
- c_v
- c_p
- T
valid_when:
- ideal-gas
- variable-specific-heats
invalid_when:
- constant-specific-heats
misconceptions: []
sources:
- path: lectures/Module3_4_IdealGasCalorific_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Finite ideal-gas changes with variable specific heats

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\Delta u = \int_{T_1}^{T_2} c_v(T)\,dT, \quad \Delta h = \int_{T_1}^{T_2} c_p(T)\,dT
$$

For finite temperature changes when specific heats depend on temperature, integrate the differential relations du = c_v(T)dT and dh = c_p(T)dT. The integrals are from T1 to T2. In practice, one may use tabulated ideal-gas data for u and h or evaluate these integrals. Do not replace them with a constant specific heat unless the temperature range is small enough to justify constant c_v and c_p. This form applies only to ideal gases with variable specific heats.

**Taught in:** M3.4 (`topic:m3-04-ideal-gas-calorific`)
