---
id: eq:area-averaged-velocity
kind: equation
title: Area-averaged velocity
description: Use when the velocity profile is nonuniform and a single average velocity is needed.
parent: topic:m6-01-mass-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: V_{av} = \frac{1}{A} \int_A V \, dA
plain_statement: The area-averaged velocity over a cross section is the integral of the velocity over
  the area divided by the area.
symbols:
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
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Area-averaged velocity

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
V_{av} = \frac{1}{A} \int_A V \, dA
$$

Average velocity over a cross section is defined so that the one-dimensional mass-flow-rate relation remains correct. Integrate the actual velocity profile over the area and divide by the total area. Use this when the velocity varies across the section but the mass-flow-rate equation requires a single representative velocity. Do not simply average a few measured velocities arithmetically; area weighting is required when the profile is nonuniform.

**Taught in:** M6.1 (`topic:m6-01-mass-conservation`)
