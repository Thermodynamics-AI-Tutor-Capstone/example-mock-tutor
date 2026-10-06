---
id: eq:ideal-gas-differential-calorific-relations
kind: equation
title: Ideal-gas differential internal-energy and enthalpy relations
description: Use as the differential form before integrating to find finite ideal-gas property changes.
parent: topic:m3-04-ideal-gas-calorific
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: du = c_v(T)\,dT, \quad dh = c_p(T)\,dT
plain_statement: For an ideal gas, infinitesimal changes in u and h are c_v dT and c_p dT.
symbols:
- u
- h
- c_v
- c_p
- T
valid_when:
- ideal-gas
invalid_when: []
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

# Ideal-gas differential internal-energy and enthalpy relations

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
du = c_v(T)\,dT, \quad dh = c_p(T)\,dT
$$

Because u = u(T) and h = h(T) for an ideal gas, infinitesimal changes are du = c_v(T)dT and dh = c_p(T)dT. The specific heats are written as possible functions of temperature; this is the differential form used before integrating. At constant volume, the heat added to a closed system equals du, which motivates c_v; at constant pressure, dh appears in flow-energy balances, which motivates c_p. The functional dependence may come from tables or polynomial fits. Use only after confirming the ideal-gas assumption.

**Taught in:** M3.4 (`topic:m3-04-ideal-gas-calorific`)
