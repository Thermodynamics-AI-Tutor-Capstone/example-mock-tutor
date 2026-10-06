---
id: eq:constant-pressure-specific-heat
kind: equation
title: Constant-pressure specific heat
description: Use to relate enthalpy changes to temperature changes at constant pressure.
parent: topic:m2-09-energy-properties
unit: unit:m2-properties-states-and-processes
status: auto
audience: both
priority: 0.7
latex: c_p = \left(\frac{\partial h}{\partial T}\right)_P, \quad \bar{c}_p = \left(\frac{\partial \bar{h}}{\partial
  T}\right)_P
plain_statement: Constant-pressure specific heat is the partial derivative of specific enthalpy with respect
  to temperature at fixed pressure.
symbols:
- c_p
- h
- T
- P
valid_when: []
invalid_when: []
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module2_9_EnergyProperties_annotated.pdf
  pages:
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Constant-pressure specific heat

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
c_p = \left(\frac{\partial h}{\partial T}\right)_P, \quad \bar{c}_p = \left(\frac{\partial \bar{h}}{\partial T}\right)_P
$$

Constant-pressure specific heat is defined as the partial derivative of specific enthalpy with respect to temperature at fixed pressure; the molar form uses $\bar{h}$. Use this definition when relating enthalpy changes to temperature changes in a constant-pressure process, or when finding $c_p$ from tables. Do not choose $c_p$ only because the process is called constant pressure; it is a property derivative. The constraint in the partial derivative is fixed pressure. For ideal gases with constant specific heats, these derivatives simplify, but the definition is general.

**Taught in:** M2.9 (`topic:m2-09-energy-properties`)
