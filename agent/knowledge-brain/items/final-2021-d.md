---
id: item:final-2021-d
kind: item
title: Final exam, problem d (Summer 2021) — Net power of the gas turbine
description: 'Final exam (Summer 2021), problem d: Students can find turbine exit temperature under isentropic
  expansion and combine compressor and turbine work to get net power.'
parent: topic:m8-09-brayton-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-09-brayton-cycle
- topic:m8-10-example-brayton-cycle
- topic:m8-11-gas-turbine-engines
sources:
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2021.pdf
  pages:
  - 5
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2021_Solutions.pdf
  pages:
  - 7
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2021
---

# Final exam (Summer 2021), problem d: Net power of the gas turbine

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Given data: Gas turbine Brayton cycle — inlet temperature 300 K; inlet pressure 0.1 MPa; compressor pressure ratio 25; compressor isentropic efficiency 0.9; maximum temperature 1600 K; turbine isentropic efficiency 1; mass flow 15 kg/s; air properties $c_p=1001\ \mathrm{J/(kg\cdot K)}$, $\gamma=1.4$. Refrigerator vapor-compression cycle — pressure at compressor inlet 0.28 MPa; quality at compressor inlet 1; pressure at compressor outlet 0.9 MPa; compressor isentropic efficiency 1; quality after the condenser 0. (d) What is the net power of the gas turbine in [MW]? Show your work. (7 points)

## What it tests

- Students can find turbine exit temperature under isentropic expansion and combine compressor and turbine work to get net power.

## Assumptions the solution expects

- Turbine isentropic efficiency is 1, so expansion is isentropic.
- Compressor and turbine work are given by $\dot{W} = -\dot{m}c_p \Delta T$.
- Steady flow, ideal gas, constant specific heats.

## Where students go wrong

- Using the wrong pressure ratio direction for the turbine, e.g. $25$ instead of $1/25$.
- Adding magnitudes of compressor and turbine work without signs; net power is the sum of negative compressor work and positive turbine work.
- Treating turbine efficiency as less than 1 even though the problem states turbine isentropic efficiency is 1.
- Using only compressor power or only turbine power as the net power.

## How it is graded

Solution awards +1 for final net power; earlier points for $T_4$ and correct signed work sum.

## Final answers (hidden — for checking only)

- $T_4$: 637.8 K
- $\dot{W}_{net}$: 6.9 MW
