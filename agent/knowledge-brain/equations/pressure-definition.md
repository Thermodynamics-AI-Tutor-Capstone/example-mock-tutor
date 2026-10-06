---
id: eq:pressure-definition
kind: equation
title: Pressure definition
description: Use when converting between normal force and pressure, or defining local fluid pressure.
parent: topic:m2-02-dimensions
unit: unit:m2-properties-states-and-processes
status: auto
audience: both
priority: 0.7
latex: P = \frac{F_{\mathrm{normal}}}{A}, \quad P = \lim_{\Delta A \to 0}\frac{F_{\mathrm{normal}}}{\Delta
  A}
plain_statement: Pressure is normal force per unit area; the intensive definition uses the limit as area
  shrinks to zero.
symbols:
- P
- A
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module2_2_Dimensions_annotated.pdf
  pages:
  - 3
- path: lectures/Module2_5_Equilibrium_annotated.pdf
  pages:
  - 4
- path: lectures/Module2_8_PressureTemperatureDensity_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Pressure definition

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
P = \frac{F_{\mathrm{normal}}}{A}, \quad P = \lim_{\Delta A \to 0}\frac{F_{\mathrm{normal}}}{\Delta A}
$$

Pressure is defined as the normal force per unit area. The first form, $P = F_{\mathrm{normal}}/A$, is appropriate when the force is uniformly distributed over a finite area. The second form takes the limit as $\Delta A$ goes to zero, which gives the local pressure at a point in a fluid. Use only the component of force perpendicular to the surface; shear forces do not contribute to pressure. The course introduces this in the context of force balance and later uses the same definition for fluid pressure. Do not confuse pressure with the total force; if the force is not uniform, use the limiting definition or integrate over the surface.

**Taught in:** M2.2 (`topic:m2-02-dimensions`), M2.5 (`topic:m2-05-equilibrium`), M2.8 (`topic:m2-08-pressure-temperature-density`)
