---
id: eq:constant-volume-specific-heat
kind: equation
title: Constant-volume specific heat
description: Use to relate internal-energy changes to temperature changes at constant specific volume.
parent: topic:m2-09-energy-properties
unit: unit:m2-properties-states-and-processes
status: auto
audience: both
priority: 0.7
latex: c_v = \left(\frac{\partial u}{\partial T}\right)_v, \quad \bar{c}_v = \left(\frac{\partial \bar{u}}{\partial
  T}\right)_{\bar{v}}
plain_statement: Constant-volume specific heat is the partial derivative of specific internal energy with
  respect to temperature at fixed specific volume.
symbols:
- c_v
- u
- T
- v
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

# Constant-volume specific heat

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
c_v = \left(\frac{\partial u}{\partial T}\right)_v, \quad \bar{c}_v = \left(\frac{\partial \bar{u}}{\partial T}\right)_{\bar{v}}
$$

Constant-volume specific heat is defined as the partial derivative of specific internal energy with respect to temperature at fixed specific volume; the molar form uses $\bar{u}$ and $\bar{v}$. Use this definition when relating small changes in internal energy to temperature changes in a fixed-volume process, or when using tables of $c_v$. Do not choose $c_v$ just because the process is named constant volume; it is a thermodynamic property derivative. The notation shows that the constraint is fixed $v$, not necessarily a process path.

**Taught in:** M2.9 (`topic:m2-09-energy-properties`)
