---
id: eq:mass-specific-volume
kind: equation
title: Mass-specific volume
description: Use when property tables list specific volume v or when converting between density and specific
  volume.
parent: topic:m2-07-assumptions
unit: unit:m2-properties-states-and-processes
status: auto
audience: both
priority: 0.7
latex: v = \frac{\mathcal{V}}{M} = \frac{1}{\rho}
plain_statement: Mass-specific volume is total volume per unit mass and is the reciprocal of density.
symbols:
- v
- \mathcal{V}
- M
- \rho
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module2_7_Assumptions_annotated.pdf
  pages:
  - 5
- path: lectures/Module2_8_PressureTemperatureDensity_annotated.pdf
  pages:
  - 3
- path: lectures/Module5_6_Example2_EnergyConservation_annotated.pptx
  slides:
  - 4
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Mass-specific volume

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
v = \frac{\mathcal{V}}{M} = \frac{1}{\rho}
$$

Mass-specific volume is volume per unit mass, $v = \mathcal{V}/M$, and is the reciprocal of density. This is the property usually tabulated as $v$ in property tables and used in specific property relations such as $h = u + Pv$. Use it when you are given total volume and mass and need an intensive property, or when a table provides $v$ and you need density. The lowercase symbol $v$ denotes mass-specific volume; do not confuse it with total volume $\mathcal{V}$ or with velocity. Since it is intensive, it does not scale with system size.

**Also written in the lectures as:**

- $\rho = \frac{M}{\mathcal{V}}$
- $\mathcal{V} = Mv$

**Taught in:** M2.7 (`topic:m2-07-assumptions`), M2.8 (`topic:m2-08-pressure-temperature-density`), M5.6 (`topic:m5-06-example-2-energy-conservation`)
