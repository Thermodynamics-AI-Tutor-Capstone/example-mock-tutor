---
id: item:exam1-2022-conflict-iii
kind: item
title: Exam 1, problem Conflict III (Summer 2022) — Waste-heat piston-cylinder cycle with water
description: 'Exam 1 (Summer 2022), problem Conflict III: Students can fill in missing state properties
  using process relations and water tables.; Students can compute net work for a multi-process cycle.'
parent: topic:m2-03-processes-cycles
unit: unit:m2-properties-states-and-processes
status: auto
audience: model
priority: 0.5
topics:
- topic:m2-03-processes-cycles
- topic:m4-01-phase-change
- topic:m5-02-heat-work
sources:
- path: assignments/exams/exam-1-practice/OConnor_ME300_Exam1_Summer2022_Solutions.pdf
  pages:
  - 18
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: exam1-2022
---

# Exam 1 (Summer 2022), problem Conflict III: Waste-heat piston-cylinder cycle with water

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

A lot of large industrial processes have waste heat that comes off of the process that can't be used. In this problem, that waste heat runs a cycle with water to produce extra power. Assume that 10 kg of water executes this cycle in a piston-cylinder device.

Processes:
- Process 1-2: Isochoric heating
- Process 2-3: Isobaric expansion
- Process 3-4: Isochoric cooling
- Process 4-1: Isobaric compression

Known state information:

| State | Pressure [MPa] | Volume [m$^3$/kg] | Temperature [K] |
|---|---|---|---|
| 1 | 1.4 | blank | blank |
| 2 | 3 | 0.0012167 | blank |
| 3 | blank | blank | 920 |
| 4 | blank | blank | blank |

a) List the assumptions you'll need to solve for the state points as well as the first-law quantities.

b) Use the state points below to solve for the remainder of the states.

c) What is the net work of the cycle?

d) Draw this cycle on a T-v diagram, labeling all the state points.

## What it tests

- Students can fill in missing state properties using process relations and water tables.
- Students can compute net work for a multi-process cycle.
- Students can draw a four-process cycle on a T-v diagram.

## Assumptions the solution expects

- Water is S.C.S.
- Quasi-equilibrium processes.
- $\Delta ke = \Delta pe = 0$.
- $M=10$ kg.

## Where students go wrong

- For State 1, not recognizing $v_1=v_2$ because Process 1-2 is isochoric.
- Using the saturation temperature at the wrong pressure.
- For State 2, not recognizing $v_2=v_f$ at 3 MPa.
- For State 3, using $T_3$ to find pressure instead of using $P_3=P_2$.
- For State 4, forgetting $P_4=P_1$ from isobaric compression.
- Including nonzero work for the isochoric processes.
- Using MPa without converting to Pa when computing work.
- Using specific volume instead of total volume in the work integral.

## How it is graded

Conflict exam solution says 'See regular exam solutions.' Same problem and point distribution as regular Part III.

## Final answers (hidden — for checking only)

- $v_1$: 0.0012167 m^3/kg
- $T_1$: 468.19 K
- $T_2$: 507 K
- $P_3$: 3 MPa
- $v_3$: 0.13995 m^3/kg
- $P_4$: 1.4 MPa
- $v_4$: 0.13995 m^3/kg
- $T_4$: 468.19 K
- $W_net$: 2.22 MJ
