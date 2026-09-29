---
id: item:final-2021-a
kind: item
title: Final exam, problem a (Summer 2021) — Assumptions for Brayton and vapor-compression cycles
description: 'Final exam (Summer 2021), problem a: Students can list working-fluid and device assumptions
  needed for ideal air-standard Brayton and vapor-compression cycle analysis.'
parent: topic:m8-07-vapor-compression
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-07-vapor-compression
- topic:m8-09-brayton-cycle
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

# Final exam (Summer 2021), problem a: Assumptions for Brayton and vapor-compression cycles

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Given data: Gas turbine Brayton cycle — inlet temperature 300 K; inlet pressure 0.1 MPa; compressor pressure ratio 25; compressor isentropic efficiency 0.9; maximum temperature 1600 K; turbine isentropic efficiency 1; mass flow 15 kg/s; air properties $c_p=1001\ \mathrm{J/(kg\cdot K)}$, $\gamma=1.4$. Refrigerator vapor-compression cycle — pressure at compressor inlet 0.28 MPa; quality at compressor inlet 1; pressure at compressor outlet 0.9 MPa; compressor isentropic efficiency 1; quality after the condenser 0. (a) What assumptions must be made about both the working fluid and the devices in this factory in order to solve for the state points? Make sure to list all devices. (5 points)

## What it tests

- Students can list working-fluid and device assumptions needed for ideal air-standard Brayton and vapor-compression cycle analysis.

## Assumptions the solution expects

- Air: ideal gas with constant $c_p$.
- R-134a: S.C.S.
- Gas turbine cycle: air-standard; compressor steady flow with $\dot{Q}=\dot{W}=\Delta ke=\Delta pe=0$; combustor with $\Delta ke=\Delta pe=\dot{W}=0$; turbine with $\Delta ke=\Delta pe=\dot{Q}=0$.
- Refrigeration cycle: steady flow; ideal cycle; compressor with $\dot{Q}=\Delta ke=\Delta pe=0$; evaporator and condenser with $\dot{W}=\Delta ke=\Delta pe=0$.

## Where students go wrong

- Omitting the combustor or evaporator/condenser assumptions while listing only the compressor and turbine.
- Forgetting to set $\Delta ke$ and $\Delta pe$ zero for steady-flow devices.
- Applying air-standard cycle assumptions to the R-134a loop.
- Using water tables instead of R-134a tables, despite the exam note not to use water tables.
- Treating the vapor-compression compressor as isothermal even though its isentropic efficiency is given as 1.

## How it is graded

Points awarded for listing assumptions for each device and working fluid; the solution emphasizes both cycles and all devices.

## Final answers (hidden — for checking only)

(no posted solution)
