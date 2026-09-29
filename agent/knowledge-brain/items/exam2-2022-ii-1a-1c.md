---
id: item:exam2-2022-ii-1a-1c
kind: item
title: Exam 2, problem II.1a-1c (Summer 2022) — Isentropic turbine exit temperature and power
description: 'Exam 2 (Summer 2022), problem II.1a-1c: Students can apply the isentropic ideal-gas relation
  with constant specific heats between pressure and temperature.; Students can use the steady-flow energy
  equation for a turbine with negligible heat, kinetic energy, and potential energy changes.'
parent: topic:m7-12-isentropic-relations
unit: unit:m7-second-law-and-entropy
status: auto
audience: model
priority: 0.5
topics:
- topic:m7-12-isentropic-relations
- topic:m7-13-example-isentropic-turbine
- topic:m6-08-compressors-turbines
sources:
- path: assignments/exams/exam-2-practice/OConnor_ME300_Exam2_Summer2022.pdf
  pages:
  - 4
- path: assignments/exams/exam-2-practice/OConnor_ME300_Exam2_Summer2022_Solutions.pdf
  pages:
  - 4
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: exam2-2022
---

# Exam 2 (Summer 2022), problem II.1a-1c: Isentropic turbine exit temperature and power

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Air is expanded in an isentropic turbine from an initial temperature of 1500 K and a pressure of 2 MPa to a final pressure of 0.1 MPa at a steady flow rate of 20 kg/s. Use the following properties for air: gamma = 1.4 and c_p = 1001 J/kg-K.

a) What is the final temperature of the air at the exit of the turbine in [K]?

b) What is the power produced by this turbine in [kW]?

c) Draw this process on both a P-v and T-s diagram, labeling both states.

## What it tests

- Students can apply the isentropic ideal-gas relation with constant specific heats between pressure and temperature.
- Students can use the steady-flow energy equation for a turbine with negligible heat, kinetic energy, and potential energy changes.
- Students can sketch the expansion on P-v and T-s diagrams.

## Assumptions the solution expects

- air is an ideal gas
- c_p is constant
- quasi-equilibrium process
- steady flow
- isentropic, Delta s = 0
- Delta ke = Delta pe = Qdot = 0

## Where students go wrong

- Using the wrong exponent or inverting P2/P1 in the isentropic relation.
- Treating the process as non-isentropic or using a polytropic exponent when the problem says isentropic.
- Using c_v instead of c_p in the power calculation.
- Forgetting the mass flow rate when calculating turbine power, or using closed-system boundary work instead of steady-flow shaft work.
- Getting the sign of Wdot wrong by forgetting the turbine does work outward.

## How it is graded

Points were awarded for listed assumptions (1/2 each), the isentropic temperature relation (+3 then +2), steady-flow energy equation setup (+2, +2, +2), and final power (+2). Diagram labels and path were scored separately.

## Final answers (hidden — for checking only)

- $T_2$: 637.34 K
- $Wdot_turbine$: 17.27 MW
- P-v and T-s diagrams: P-v: curved expansion from state 1 at high P/low v to state 2 at low P/high v; T-s: vertical downward line from T1 to T2
