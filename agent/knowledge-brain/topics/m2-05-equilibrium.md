---
id: topic:m2-05-equilibrium
kind: topic
title: M2.5 — Equilibrium
description: Introduces thermodynamic equilibrium as the absence of unbalanced potentials, covers thermal,
  mechanical, phase, and chemical equilibrium, and defines quasi-equilibrium.
parent: unit:m2-properties-states-and-processes
unit: unit:m2-properties-states-and-processes
lecture: M2.5
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: List the four types of equilibrium introduced and the condition that defines each type.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Explain the conditions for thermal, mechanical, phase, and chemical equilibrium in their own words.
  kc_type: principle
  bloom: understand
- id: '#o3'
  text: Interpret a simple force balance or pressure equalization as a mechanical equilibrium condition.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Explain why a quasi-static process requires the equilibration time to be much shorter than the
    process timescale.
  kc_type: principle
  bloom: understand
equations:
- eq:pressure-definition
misconceptions: []
examples: []
items:
- item:hw02-3a-3d
sources:
- path: lectures/Module2_5_Equilibrium_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M2.5 — Equilibrium

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This slide deck defines thermodynamic equilibrium as a state with no unbalanced potentials (p. 2) and separates it into four types: thermal, mechanical, phase, and chemical (p. 2). It ends by defining a quasi-equilibrium process through the timescale comparison $t_{ef} << t_{process}$ (p. 8).

## Key ideas

- A system in equilibrium has no unbalanced potentials (p. 2).
- The four categories introduced are thermal, mechanical, phase, and chemical equilibrium (p. 2).
- Thermal equilibrium means the system temperature is uniform and equals the surroundings temperature; the slide contrasts a nonuniform $T$-$x$ profile with a uniform equilibrium profile (p. 3).
- Mechanical equilibrium means no unbalanced forces. For the block on the slide, $\sum F = F_N - Mg = 0$; for the pump-and-pipe sketch, turning off the pump or capping the pipe gives $P_1 = P_2$ (p. 4).
- Phase equilibrium means the amount of each phase is unchanging in time; liquid-vapor exchange can still occur with no net change in phase amounts (p. 6).
- Chemical equilibrium means the amount of each species is constant. For $\mathrm{CO} + \mathrm{H_2O} \rightleftharpoons \mathrm{CO_2} + \mathrm{H_2}$, the slide writes $k_1 = k_2$ as the equilibrium condition (p. 7).
- A quasi-equilibrium, or quasi-static, process is slow enough that the time for the system to achieve equilibrium is much shorter than the process timescale, written $t_{ef} << t_{process}$ (p. 8).

## Notation used

- $F_N$: normal force; $M$: mass; $g$: gravitational acceleration; $F$: force; $P$: pressure; $A$: area (p. 4).
- $k_1$, $k_2$: forward and reverse reaction rate constants in the chemical-equilibrium condition (p. 7).
- $t_{ef}$: time for the system to achieve equilibrium; $t_{process}$: process timescale (p. 8).

## Examples in this lecture

- Ball on a ramp and piston-cylinder/battery diagrams: introduce unbalanced potentials (p. 2).
- Hot/cold cylinder with $T$-$x$ profiles: nonuniform temperature profile versus uniform thermal-equilibrium profile (p. 3).
- Block with normal force and weight: direct force-balance mechanical equilibrium (p. 4).
- Pump-and-pipe sketch: pressure difference $P_2 < P_1$ while the pump is on; mechanical equilibrium restored when pump is off or pipe is capped so $P_1 = P_2$ (p. 4).
- Liquid-vapor container: phase equilibrium as an unchanging amount of each phase (p. 6).
- $\mathrm{CO} + \mathrm{H_2O} \rightleftharpoons \mathrm{CO_2} + \mathrm{H_2}$: chemical equilibrium when reaction rates balance (p. 7).
