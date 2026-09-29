---
id: eq:specific-heat-definitions
kind: equation
title: Specific heat definitions
description: Use to define and interpret the specific heats before choosing ideal-gas property relations.
parent: topic:m3-04-ideal-gas-calorific
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: c_v = \left(\frac{\partial u}{\partial T}\right)_v, \quad c_p = \left(\frac{\partial h}{\partial
  T}\right)_P
plain_statement: c_v is the temperature derivative of u at constant v; c_p is the temperature derivative
  of h at constant P.
symbols:
- c_v
- c_p
- u
- h
- T
- v
- P
valid_when: []
invalid_when: []
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module3_4_IdealGasCalorific_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Specific heat definitions

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
c_v = \left(\frac{\partial u}{\partial T}\right)_v, \quad c_p = \left(\frac{\partial h}{\partial T}\right)_P
$$

These definitions show that c_v is the temperature derivative of specific internal energy at constant specific volume, and c_p is the temperature derivative of specific enthalpy at constant pressure. They are partial derivatives, not ordinary derivatives, because the constraint matters. Do not choose c_v or c_p by the name of a process; choose the property relation needed. This definition is general and does not require ideal gas.

**Taught in:** M3.4 (`topic:m3-04-ideal-gas-calorific`)
