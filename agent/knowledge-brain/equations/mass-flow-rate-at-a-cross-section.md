---
id: eq:mass-flow-rate-at-a-cross-section
kind: equation
title: Mass flow rate at a cross section
description: Use to convert among density, velocity, area, and mass flow rate at a flow cross section.
parent: topic:m6-01-mass-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: \dot{m} = \rho V A
plain_statement: Mass flow rate equals density times cross-sectional area times average flow velocity.
symbols:
- \dot{m}
- \rho
- V
- A
valid_when:
- one-dimensional-flow
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module6_1_MassConservation_annotated.pdf
  pages:
  - 3
- path: lectures/Module6_9_Example_CompressorsTurbines_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Mass flow rate at a cross section

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{m} = \rho V A
$$

Mass flow rate is the amount of mass crossing a flow area per unit time. For one-dimensional flow, use density times average velocity times cross-sectional area. If the velocity varies across the section, replace the velocity by the area-averaged velocity so the relation remains correct. Use this equation to convert between velocity, area, density, and mass flow rate at inlets or exits. It appears frequently when a problem gives a pipe diameter and velocity but asks for mass flow rate, or vice versa.

**Taught in:** M6.1 (`topic:m6-01-mass-conservation`), M6.9 (`topic:m6-09-example-compressors-turbines`)
