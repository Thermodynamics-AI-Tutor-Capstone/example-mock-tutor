---
id: item:final-2021-h
kind: item
title: Final exam, problem h (Summer 2021) — Heat removed by the evaporator in the vapor-compression cycle
description: 'Final exam (Summer 2021), problem h: Students can evaluate evaporator heat transfer using
  $\dot{Q}_{evap} = \dot{m}_c(h_1-h_4)$ and determine $h_4=h_3$ across the throttle.'
parent: topic:m8-07-vapor-compression
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-07-vapor-compression
- topic:m8-08-example-vapor-compression
sources:
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2021.pdf
  pages:
  - 5
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2021_Solutions.pdf
  pages:
  - 9
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2021
---

# Final exam (Summer 2021), problem h: Heat removed by the evaporator in the vapor-compression cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Given data: Gas turbine Brayton cycle — inlet temperature 300 K; inlet pressure 0.1 MPa; compressor pressure ratio 25; compressor isentropic efficiency 0.9; maximum temperature 1600 K; turbine isentropic efficiency 1; mass flow 15 kg/s; air properties $c_p=1001\ \mathrm{J/(kg\cdot K)}$, $\gamma=1.4$. Refrigerator vapor-compression cycle — pressure at compressor inlet 0.28 MPa; quality at compressor inlet 1; pressure at compressor outlet 0.9 MPa; compressor isentropic efficiency 1; quality after the condenser 0. (h) What is the heat removed from the cold space by the evaporator in the vapor compression cycle in [MW]? Show your work. (7 points)

## What it tests

- Students can evaluate evaporator heat transfer using $\dot{Q}_{evap} = \dot{m}_c(h_1-h_4)$ and determine $h_4=h_3$ across the throttle.

## Assumptions the solution expects

- Throttle is isenthalpic, so $h_4 = h_3$.
- State 3 is saturated liquid at 0.9 MPa ($x_3=0$).
- Evaporator is steady flow with negligible kinetic and potential energy changes and no work.

## Where students go wrong

- Treating the throttle as isentropic instead of isenthalpic.
- Taking $h_4$ as saturated vapor enthalpy at the low pressure instead of carrying $h_3$ through the throttle.
- Using the compressor discharge enthalpy instead of the evaporator outlet enthalpy.
- Forgetting unit conversion from kJ/kg to MW.

## How it is graded

Points for evaporator energy balance (+2), throttle relation (+2), state 3 lookup (+2), and final value (+1).

## Final answers (hidden — for checking only)

- $h_3=h_4$: 249.78 kJ/kg
- $\dot{Q}_{evap}$: 41.83 MW
