---
id: eq:enthalpy-definition
kind: equation
title: Enthalpy definition
description: Use when evaluating energy balances involving flow work or when property tables provide h.
parent: topic:m2-09-energy-properties
unit: unit:m2-properties-states-and-processes
status: auto
audience: both
priority: 0.7
latex: H = U + P\mathcal{V}, \quad h = u + Pv, \quad \bar{h} = \bar{u} + P\bar{v}
plain_statement: Enthalpy is internal energy plus pressure times volume, in extensive, mass-specific,
  and molar forms.
symbols:
- H
- U
- P
- \mathcal{V}
- h
- u
- v
valid_when: []
invalid_when: []
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
sources:
- path: lectures/Module2_9_EnergyProperties_annotated.pdf
  pages:
  - 5
- path: lectures/Module3_4_IdealGasCalorific_annotated.pdf
  pages:
  - 2
- path: lectures/Module6_5_Throttles_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Enthalpy definition

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
H = U + P\mathcal{V}, \quad h = u + Pv, \quad \bar{h} = \bar{u} + P\bar{v}
$$

Enthalpy is defined as internal energy plus the pressure-volume product. The extensive form is $H = U + P\mathcal{V}$; the mass-specific form is $h = u + Pv$; the molar form is $\bar{h} = \bar{u} + P\bar{v}$. Use enthalpy when energy balances involve flow work or when property tables provide $h$. It is a defined property, not the same as internal energy. Do not interchange $h$ and $u$; they differ by the $Pv$ product, which is significant for gases at high temperature or high pressure.

**Also written in the lectures as:**

- $h = u + P v$

**Taught in:** M2.9 (`topic:m2-09-energy-properties`), M3.4 (`topic:m3-04-ideal-gas-calorific`), M6.5 (`topic:m6-05-throttles`)
