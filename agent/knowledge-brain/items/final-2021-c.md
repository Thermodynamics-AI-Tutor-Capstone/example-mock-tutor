---
id: item:final-2021-c
kind: item
title: Final exam, problem c (Summer 2021) — Heat addition in the Brayton cycle
description: 'Final exam (Summer 2021), problem c: Students can compute heat addition using $\dot{Q} =
  \dot{m}c_p(T_3 - T_2)$.'
parent: topic:m8-09-brayton-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-09-brayton-cycle
- topic:m8-10-example-brayton-cycle
sources:
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2021.pdf
  pages:
  - 5
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2021_Solutions.pdf
  pages:
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2021
---

# Final exam (Summer 2021), problem c: Heat addition in the Brayton cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Given data: Gas turbine Brayton cycle — inlet temperature 300 K; inlet pressure 0.1 MPa; compressor pressure ratio 25; compressor isentropic efficiency 0.9; maximum temperature 1600 K; turbine isentropic efficiency 1; mass flow 15 kg/s; air properties $c_p=1001\ \mathrm{J/(kg\cdot K)}$, $\gamma=1.4$. Refrigerator vapor-compression cycle — pressure at compressor inlet 0.28 MPa; quality at compressor inlet 1; pressure at compressor outlet 0.9 MPa; compressor isentropic efficiency 1; quality after the condenser 0. (c) How much heat is added to the gas turbine in [MW]? Show your work. (3 points)

## What it tests

- Students can compute heat addition using $\dot{Q} = \dot{m}c_p(T_3 - T_2)$.

## Assumptions the solution expects

- Combustor is steady flow with no work and negligible $\Delta ke$ and $\Delta pe$.
- Constant $c_p$ for air.

## Where students go wrong

- Using 300 K instead of $T_2$ in the heat-addition calculation.
- Using $T_3 - T_1$ rather than $T_3 - T_2$.
- Using compressor work instead of heat addition.
- Failing to convert kJ/s to MW correctly.

## How it is graded

Points reward correct application of the combustor energy balance and unit conversion to MW.

## Final answers (hidden — for checking only)

- $\dot{Q}_{in}$: 11.97 MW
