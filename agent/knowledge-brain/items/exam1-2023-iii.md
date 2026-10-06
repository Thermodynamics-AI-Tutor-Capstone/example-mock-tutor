---
id: item:exam1-2023-iii
kind: item
title: Exam 1, problem III (Summer 2023) — Argon four-step cycle analysis
description: 'Exam 1 (Summer 2023), problem III: Students can apply the ideal-gas equation of state to
  complete a state table.; Students can evaluate work for isothermal and isochoric processes.'
parent: topic:m2-04-example-processes-cycles
unit: unit:m2-properties-states-and-processes
status: auto
audience: model
priority: 0.5
topics:
- topic:m2-04-example-processes-cycles
- topic:m3-01-ideal-gas-p-v-t
- topic:m5-03-example-work
sources:
- path: assignments/exams/exam-1/OConnor_ME300_Exam1_Summer2023.pdf
  pages:
  - 8
- path: assignments/exams/exam-1/OConnor_ME300_Exam1_Summer2023_Solutions.pdf
  pages:
  - 8
  - 9
  - 10
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: exam1-2023
---

# Exam 1 (Summer 2023), problem III: Argon four-step cycle analysis

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Argon undergoes a four-step cycle to produce power for a small factory. The argon is sealed in a piston-cylinder device with a mass of 10 kg. Assume the following properties for argon: $R=208$ J/kg-K and $c_v=312$ J/kg-K.

Process 1-2: Isothermal compression
Process 2-3: Isochoric heating
Process 3-4: Isothermal expansion
Process 4-1: Isochoric cooling

a) List the assumptions needed to solve for the state points and the first-law quantities.
b) Fill in the remaining state points in the table:

| State | Pressure [MPa] | Volume [m^3/kg] | Temperature [K] |
|---|---|---|---|
| 1 | 0.15 |  | 350 |
| 2 | 3 |  |  |
| 3 |  |  | 800 |
| 4 |  |  |  |

c) What is the net work of the cycle?
d) Draw this cycle on a P-V diagram, labeling all state points.

## What it tests

- Students can apply the ideal-gas equation of state to complete a state table.
- Students can evaluate work for isothermal and isochoric processes.
- Students can compute net work for a cycle and sketch it on a P-v diagram.

## Assumptions the solution expects

- ideal gas
- constant $c_v$
- quasi-equilibrium process
- $\Delta KE = \Delta PE = 0$

## Where students go wrong

- Using specific volume instead of total volume in the ideal-gas relation; the solution uses $\mathcal{V} = MRT/P$ with $M=10$ kg.
- Forgetting to convert MPa to Pa before computing volumes or pressures.
- Giving nonzero work for the isochoric processes, even though $\mathcal{V}_2 = \mathcal{V}_3$ and $\mathcal{V}_4 = \mathcal{V}_1$.
- Sign errors in the isothermal steps, especially for compression where $\ln(\mathcal{V}_2/\mathcal{V}_1) < 0$.
- Using $c_v$ to compute work for an isothermal or isochoric step instead of using $P\,d\mathcal{V}$.
- Omitting mass when using the ideal-gas equation of state.

## How it is graded

Part a +4 for the assumptions. Part b awards +1 for each solved state value as marked in the solution. Part c gives credit for identifying zero work for isochoric processes, for the isothermal work integrals, and for the net-work final. Part d awards +8 for a labeled P-v diagram showing the four states and paths.

## Final answers (hidden — for checking only)

- $P_1$: 0.15 MPa
- $\mathcal{V}_1$: 4.853 m^3
- $T_1$: 350 K
- $P_2$: 3 MPa
- $\mathcal{V}_2$: 0.2427 m^3
- $T_2$: 350 K
- $P_3$: 6.857 MPa
- $\mathcal{V}_3$: 0.2427 m^3
- $T_3$: 800 K
- $P_4$: 0.3429 MPa
- $\mathcal{V}_4$: 4.853 m^3
- $T_4$: 800 K
- Net work of the cycle: 2803.81 kJ
