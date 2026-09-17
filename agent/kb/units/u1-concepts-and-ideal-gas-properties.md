---
id: unit:u1-concepts-and-ideal-gas-properties
kind: unit
title: 'Unit 1 — Concepts, units, and ideal-gas properties'
description: >-
  Lectures 1–9, Exam 1. Definitions and system framing, dimensions and units, properties and
  state relationships, the ideal gas law, the calorific equation of state. Turns & Pauley 1.1–2.5.
parent: course:me300
unit: unit:u1-concepts-and-ideal-gas-properties
status: reviewed
audience: both
priority: 0.9
prerequisites: []
precedes:
  - unit:u2-nonideal-gases-and-phase-data
objectives: []
equations: []
symbols: []
misconceptions:
  - misc:m01-heat-energy-temperature-conflated
  - misc:m06-temperature-is-internal-energy
  - misc:m11-state-function-vs-path-function
examples: []
items: []
sources:
  - url: https://www.me.psu.edu/assets/docs/sample-syllabus/ME-300.pdf
    title: ME 300 sample syllabus, "Anticipated Class Lecture Schedule", lectures 1–9
    retrieved: '2026-09-17'
generated: null
---

# Unit 1 — Concepts, units, and ideal-gas properties

> Lecture rows, titles and readings below are **transcribed** from the published sample
> syllabus. The framing paragraphs ("what this unit is for", "what bites students here") are
> **authored by this project and not checked by an ME 300 instructor.**

Nine lectures, ending in **Exam 1**. This is the unit that sets the vocabulary the rest of the
course is written in: system vs. surroundings, property vs. process, intensive vs. extensive,
state vs. path. Students who get through it by memorising $Pv = RT$ and skipping the
definitions pay for it in Unit 3, where "is this a closed system or a control volume?" decides
which energy balance is even legal.

## Lecture rows

| Lecture | Topic | Turns & Pauley |
|---|---|---|
| 1 | Introduction to course | 1.1, 1.2 |
| 2 | Physical frameworks & introduction to thermodynamics; key concepts and definitions | 1.3, 1.4, 1.5 |
| 3 | Dimensions and units / problem solving methodology / mathematical skills | 1.6-1.8 |
| 4 | Motivation for study of properties; common thermodynamic properties | 2.1, 2.2 |
| 5 | Properties, state relationships | 2.3, 2.4 |
| 6 | Ideal gas law | 2.5 |
| 7 | Calorific equation of state; P-v, T-v, u-T, h-T plots for ideal gases | 2.5 |
| 8 | Examples; HW 1 submission | — |
| 9 | **Exam 1** | — |

Topic ids are `topic:t01-…` through `topic:t09-…`; see [`taxonomy.yml`](../taxonomy.yml).

## What a student should be able to do by Exam 1

- Draw a system boundary and say whether the system is closed, open, or isolated, and why.
- Carry units through a calculation and convert cleanly between SI and US customary, including
  the ones that trip people up: kPa·m³ = kJ, and the difference between a gauge and an absolute
  pressure.
- Say what makes a quantity a *property* and what makes a change a *process*, and recognise
  that work and heat are neither.
- Use $Pv = RT$ (and $PV = mRT$, $P\bar{v} = R_u T$) and know the specific gas constant is
  $R = R_u / M$.
- Use the calorific equation of state: $\Delta u = c_v \Delta T$ and $\Delta h = c_p \Delta T$
  **for an ideal gas**, and read a P-v, T-v, u-T or h-T plot for one.
- Write a solution in the six-part KNOWN / FIND / SKETCH / ASSUMPTIONS / ANALYSIS /
  SANITY CHECK format — lecture 3 is explicitly about the method, not only the mathematics.

## What bites students here

- Heat, energy and temperature get used as if they were the same quantity. This is the
  best-documented misconception in the whole subject; see
  [`misc:m01-heat-energy-temperature-conflated`](../misconceptions/m01-heat-energy-temperature-conflated.md).
- $\Delta u = c_v \Delta T$ gets applied to liquids, to saturated mixtures, and to constant-
  pressure processes where students think $c_v$ is disallowed. Both are assumption errors, not
  algebra errors, and they are why equation cards carry `valid_when`.
- Notation collisions start immediately: $v$ (specific volume) against $V$ (volume) against
  $V$ or $\mathcal{V}$ (velocity) against $\dot{V}$ (volumetric flow rate). See
  [`symbols.md`](../symbols.md), which is authoritative over anything a slide deck implies.

## What is not here yet

No topic, equation or worked-example cards exist for this unit — the course-file corpus is
empty. When real lecture files land in `agent/knowledge/`, the pipeline drafts those cards and
opens a pull request; until then Kelvin has only this card and the schedule.
