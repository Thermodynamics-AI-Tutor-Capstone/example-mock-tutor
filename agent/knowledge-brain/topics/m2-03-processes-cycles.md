---
id: topic:m2-03-processes-cycles
kind: topic
title: M2.3 — Processes Cycles
description: 'Introduces thermodynamic processes and cycles: process-type labels (isothermal, isobaric,
  isochoric, isentropic, adiabatic, no-work), flow-process state changes, thermodynamic path, and closed-loop
  cycles.'
parent: unit:m2-properties-states-and-processes
unit: unit:m2-properties-states-and-processes
lecture: M2.3
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify a process type from its constraint on a property or transfer, such as isothermal
    or adiabatic.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Students can interpret a flow process with a control volume by comparing inlet and outlet states.
  kc_type: skill
  bloom: understand
- id: '#o3'
  text: Students can distinguish a thermodynamic path from a cycle and recognize a cycle as a closed loop
    that returns to the original state.
  kc_type: fact
  bloom: understand
equations: []
misconceptions:
- misc:m15-adiabatic-implies-isentropic
examples: []
items:
- item:exam1-2021-i-3
- item:exam1-2022-conflict-iii
- item:exam1-2022-regular-iii
- item:exam1-2023-i-1
- item:hw02-1
- item:hw02-2a
- item:hw02-2b
- item:hw02-2c
- item:hw02-2d
- item:hw02-2e
- item:hw02-2f
- item:hw02-3a-3d
sources:
- path: lectures/Module2_3_ProcessesCycles_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M2.3 — Processes Cycles

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This deck defines a thermodynamic process as a change from state 1 to state 2, lists common process labels, uses a furnace flow example ("blobby") to show how state properties change, and introduces paths and cycles.

## Key ideas
- A process is a transition from state 1 to state 2 (p. 2).
- The slide lists process types: isothermal = constant $T$, isobaric = constant $P$, isochoric = constant total volume $\mathcal{V}$, isentropic = constant entropy $S$, adiabatic = no heat transfer, and a no-work process (transcribed as "passive") (p. 3).
- Adiabatic and isentropic are listed separately: adiabatic is a heat-transfer condition, isentropic is an entropy condition (p. 3).
- In the flow-process example, heat is added to "blobby" as it flows through a control volume; the exit state has $T_2 > T_1$, $P_2 \approx P_1$, and $\rho_2 < \rho_1$ (p. 4). The slide asks what happens to blobby in the furnace (p. 5).
- A thermodynamic path is the succession of states the system passes through during a process; different paths can connect the same end states, and the shape of the path in $T$-$P$ coordinates is tied to the equation of state (p. 7).
- A thermodynamic cycle is a sequence of processes by which the working fluid returns to its original state; the working fluid is inside the system/control volume, and a cycle is shown as a closed loop on a $P$-$\mathcal{V}$ diagram (pp. 8-9).

## Notation used
- $1, 2$: end states of a process (p. 2)
- $\mathcal{V}$: total volume (p. 3)
- $T, P, \rho$: temperature, pressure, density (p. 4)
- $S$: entropy (p. 3)

## Examples in this lecture
- "What happens to blobby as it goes through the furnace?" (pp. 4-5) — demonstrates a flow process with heat addition at approximately constant pressure, producing a higher temperature and lower density at the outlet.

## What students get wrong here
- Adiabatic is not the same as isentropic. The slide deliberately lists "adiabatic = no heat transfer" and "isentropic = constant entropy" as separate process types (p. 3).
