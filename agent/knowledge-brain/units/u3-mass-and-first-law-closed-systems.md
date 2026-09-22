---
id: unit:u3-mass-and-first-law-closed-systems
kind: unit
title: 'Unit 3 — Conservation of mass and first-law analysis of closed systems'
description: >-
  Lectures 18–26, Exam 3. Conservation of mass, energy storage, identifying heat and work at a
  boundary, the first law for a closed system, the steady-flow energy balance.
  Turns & Pauley 3.2–5.3.
parent: course:me300
unit: unit:u3-mass-and-first-law-closed-systems
status: reviewed
audience: both
priority: 0.9
prerequisites:
  - unit:u2-nonideal-gases-and-phase-data
precedes:
  - unit:u4-control-volumes-and-second-law
objectives: []
equations: []
symbols: []
misconceptions:
  - misc:m07-work-is-not-energy-transfer
  - misc:m11-state-function-vs-path-function
  - misc:m12-boundary-flow-and-shaft-work-confused
  - misc:m13-work-read-off-a-pv-diagram
examples: []
items: []
sources:
  - url: https://www.me.psu.edu/assets/docs/sample-syllabus/ME-300.pdf
    title: ME 300 sample syllabus, "Anticipated Class Lecture Schedule", lectures 18–26
    retrieved: '2026-09-17'
generated: null
---

# Unit 3 — Conservation of mass and first-law analysis of closed systems

> Lecture rows, titles and readings below are **transcribed** from the published sample
> syllabus. The framing paragraphs are **authored by this project and not checked by an
> ME 300 instructor.**

Nine lectures, ending in **Exam 3**. This is where the course stops being about properties and
starts being about balances. Note the ordering the syllabus chose: two full lectures on
*identifying* heat and work interactions at a boundary (19 and 21) **before** the closed-system
energy equation (22). That ordering is the pedagogy — the hard part is not the equation, it is
deciding what crosses the boundary and with what sign.

Lecture 24 introduces the steady-flow open-system balance, which Unit 4 then spends most of its
time on.

## Lecture rows

| Lecture | Topic | Turns & Pauley |
|---|---|---|
| 18 | Conservation of mass: system, flow rates & control volumes | 3.2, 3.3, 3.4a-b |
| 19 | Energy storage, heat & work interactions at boundaries | 4.1, 4.2 |
| 20 | Examples | — |
| 21 | Identifying heat & work interactions | 4.3 |
| 22 | Energy conservation for a closed system | 5.1 |
| 23 | Examples | — |
| 24 | Energy conservation for an open system with steady flow; HW 3 submission | 5.2a |
| 25 | Energy conservation for a system: examples | 5.3 |
| 26 | **Exam 3** | — |

## What a student should be able to do by Exam 3

- Write a mass balance for a control volume, steady and unsteady, and relate $\dot{m}$,
  $\rho$, $A$ and velocity.
- Enumerate every energy interaction at a chosen boundary and assign each a sign, using **one
  stated sign convention and stating it** (this course, like most, takes heat into the system
  and work out of the system as positive — confirm against the lecture notes).
- Distinguish the forms of energy *stored* in a system ($U$, KE, PE) from the energy
  *transferred* across its boundary ($Q$, $W$).
- Apply the closed-system first law, $\Delta E = Q - W$ and per unit mass
  $\Delta u + \Delta ke + \Delta pe = q - w$, and justify dropping the KE and PE terms rather
  than silently dropping them.
- Compute moving-boundary work as $W_b = \int P\,dV$ and evaluate it for the standard
  processes (constant pressure, constant volume, isothermal ideal gas, polytropic).
- Set up the steady-flow energy equation for a single-inlet, single-exit device and say where
  the $h = u + Pv$ grouping came from.

## What bites students here

This unit carries more documented misconceptions than any other.

- **Work is not recognised as energy transfer**, so the first law is applied to heat alone.
  See [`misc:m07-work-is-not-energy-transfer`](../misconceptions/m07-work-is-not-energy-transfer.md).
- **State function vs. path function.** $\Delta u$ depends only on the endpoints; $Q$ and $W$
  do not exist at a state at all. Writing "$u_2 - u_1$" is legal; writing "$Q_2 - Q_1$" is not.
  See [`misc:m11-state-function-vs-path-function`](../misconceptions/m11-state-function-vs-path-function.md).
- **Boundary work, flow work and shaft work get merged into one $W$.** They are three
  different interactions, and which ones appear depends on whether the system is closed or a
  control volume. See
  [`misc:m12-boundary-flow-and-shaft-work-confused`](../misconceptions/m12-boundary-flow-and-shaft-work-confused.md).
- **P-v diagram area read wrongly.** Documented by Meltzer (2004) and cited in the ASEE review:
  most students who drew a P-V diagram interpreted it incorrectly when finding the work for a
  process. The syllabus mandates a SKETCH step, so this misconception is directly in the path of
  a graded step. See
  [`misc:m13-work-read-off-a-pv-diagram`](../misconceptions/m13-work-read-off-a-pv-diagram.md).
- **Constant-pressure and constant-volume assumptions swapped** when choosing between $c_p$ and
  $c_v$.

## What is not here yet

No topic, equation or worked-example cards exist for this unit — the course-file corpus is
empty. The `control-volume-energy-balance` skill in
[`agent/skills/`](../../skills/README.md) covers some of the same ground and is itself an
unreviewed starter draft.
