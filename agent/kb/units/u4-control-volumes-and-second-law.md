---
id: unit:u4-control-volumes-and-second-law
kind: unit
title: 'Unit 4 — Control volumes, steady-flow devices, and the second law'
description: >-
  Lectures 27–35, Exam 4. Control-volume energy analysis, the steady-flow devices (nozzles,
  diffusers, throttles, pumps, compressors, turbines, heat exchangers), then the second law and
  Kelvin-Planck. Turns & Pauley 5.3, 8.1–8.6, 6.1–6.3a.
parent: course:me300
unit: unit:u4-control-volumes-and-second-law
status: reviewed
audience: both
priority: 0.9
prerequisites:
  - unit:u3-mass-and-first-law-closed-systems
precedes:
  - unit:u5-entropy-and-isentropic-processes
objectives: []
equations: []
symbols: []
misconceptions:
  - misc:m03-steady-state-vs-equilibrium
  - misc:m09-friction-is-the-only-efficiency-limit
  - misc:m12-boundary-flow-and-shaft-work-confused
examples: []
items: []
sources:
  - url: https://www.me.psu.edu/assets/docs/sample-syllabus/ME-300.pdf
    title: ME 300 sample syllabus, "Anticipated Class Lecture Schedule", lectures 27–35
    retrieved: '2026-09-17'
generated: null
---

# Unit 4 — Control volumes, steady-flow devices, and the second law

> Lecture rows, titles and readings below are **transcribed** from the published sample
> syllabus. The framing paragraphs are **authored by this project and not checked by an
> ME 300 instructor.**

Nine lectures, ending in **Exam 4**. Two thirds of it is one long idea worked through six
device types: *take the general control-volume energy balance, and delete the terms this
particular device lets you delete.* A nozzle is the balance with $\dot{W} = 0$ and KE kept; a
throttle is the same balance reduced all the way to $h_1 = h_2$. Learning eight device formulas
separately is the failure mode; learning one balance and eight sets of assumptions is the
outcome.

Note that this unit reaches **into a different chapter range** than its neighbours: the
schedule jumps to Turns & Pauley chapter 8 for devices, then back to chapter 6 for the second
law at lecture 34. A card that says "chapter 8" without a section number is useless here.

## Lecture rows

| Lecture | Topic | Turns & Pauley |
|---|---|---|
| 27 | Energy conservation for a control volume / examples | 5.3 |
| 28 | Steady flow processes and devices | 5.3, 8.1-8.3 |
| 29 | Examples | — |
| 30 | Steady-flow devices: nozzles, diffusers & throttles | 8.2-8.3 |
| 31 | Steady-flow devices: pumps, compressors, fans & turbines | 8.4-8.5 |
| 32 | Examples (also the Late Drop Deadline) | — |
| 33 | Steady-flow devices: heat exchangers; HW 4 submission | 8.6 |
| 34 | 2nd law of thermodynamics: overview, Kelvin-Planck statement, consequences | 6.1-6.3a |
| 35 | **Exam 4** | — |

## What a student should be able to do by Exam 4

- Write the general control-volume energy balance and reduce it for a named device, stating
  each deletion as an assumption rather than performing it silently.
- Handle the standard devices:
  - **nozzle / diffuser** — no work, usually adiabatic, kinetic energy is the point;
  - **throttle** — no work, adiabatic, negligible KE change, so $h_1 = h_2$ (and know that
    this is *not* an isentropic process);
  - **pump / compressor / fan** — work input, usually negligible KE and PE;
  - **turbine** — work output;
  - **heat exchanger** — two streams, choose the boundary so that $\dot{Q}$ is either the
    answer or zero.
- Say why $h$ rather than $u$ appears in a flowing-stream balance: the flow work $Pv$ needed to
  push mass across the boundary is folded into enthalpy.
- State the Kelvin-Planck statement of the second law and what it forbids: no cycle can take
  heat from a single reservoir and produce an equivalent amount of work.
- Use thermal efficiency and coefficient of performance as definitions, and say why 100 %
  thermal efficiency is impossible for a reason that is not friction.

## What bites students here

- **Steady state confused with equilibrium.** The third of the three primary thermodynamics
  misconceptions in the ASEE review, and this unit is where it does its damage — a steady-flow
  device is emphatically not in equilibrium; properties are constant *in time at a point*, not
  uniform in space. See
  [`misc:m03-steady-state-vs-equilibrium`](../misconceptions/m03-steady-state-vs-equilibrium.md).
- **"Efficiency is limited by friction and losses."** Prince et al. found students assume
  friction and heat losses are the only barriers to 100 % efficiency and miss that the second
  law imposes a ceiling on a perfectly frictionless machine. This unit's Kelvin-Planck lecture
  is aimed exactly at that belief. See
  [`misc:m09-friction-is-the-only-efficiency-limit`](../misconceptions/m09-friction-is-the-only-efficiency-limit.md).
- **Throttling treated as isentropic** because "nothing is lost". A throttle is isenthalpic and
  strongly irreversible — entropy rises. Unit 5 makes this checkable.
- **Device formulas memorised out of context**, then applied to a device with different
  assumptions. This is the `valid_when` / `invalid_when` case the whole card schema exists for.

## What is not here yet

No topic, equation or worked-example cards exist for this unit — the course-file corpus is
empty. The `control-volume-energy-balance` skill in
[`agent/skills/`](../../skills/README.md) is the closest existing artefact and is an unreviewed
starter draft.
