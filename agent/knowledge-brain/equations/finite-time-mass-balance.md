---
id: eq:finite-time-mass-balance
kind: equation
title: Finite-time mass balance
description: Use when integrating a mass balance over a known time interval with total inlet and outlet
  masses.
parent: topic:m6-01-mass-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: \Delta M_{sys} = M(t_2) - M(t_1) = M_{in} - M_{out}
plain_statement: The change in mass of a system over a time interval is the total mass entering minus
  the total mass leaving.
symbols:
- M
valid_when:
- open-system
- closed-system
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module6_1_MassConservation_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Finite-time mass balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\Delta M_{sys} = M(t_2) - M(t_1) = M_{in} - M_{out}
$$

Over a finite interval, the change in system mass is the mass that entered minus the mass that left. The course writes this without a generation term because mass is conserved. Use the finite-time form when you integrate a rate problem over a known time interval or when inlet and outlet masses are given. For a closed system, both mass-flow terms are zero, so the relation says the system mass is constant. Keep the signs clear: inflow increases system mass and outflow decreases it.

**Taught in:** M6.1 (`topic:m6-01-mass-conservation`)
