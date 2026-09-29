---
id: item:final-2021-g
kind: item
title: Final exam, problem g (Summer 2021) — Mass flow of R-134a coolant through vapor-compression cycle
description: 'Final exam (Summer 2021), problem g: Students can use R-134a tables to find compressor inlet
  and outlet enthalpies.; Students can couple the gas-turbine net power to the vapor-compression compressor
  work.'
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
  - 8
  - 9
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2021
---

# Final exam (Summer 2021), problem g: Mass flow of R-134a coolant through vapor-compression cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Given data: Gas turbine Brayton cycle — inlet temperature 300 K; inlet pressure 0.1 MPa; compressor pressure ratio 25; compressor isentropic efficiency 0.9; maximum temperature 1600 K; turbine isentropic efficiency 1; mass flow 15 kg/s; air properties $c_p=1001\ \mathrm{J/(kg\cdot K)}$, $\gamma=1.4$. Refrigerator vapor-compression cycle — pressure at compressor inlet 0.28 MPa; quality at compressor inlet 1; pressure at compressor outlet 0.9 MPa; compressor isentropic efficiency 1; quality after the condenser 0. (g) What is the mass flow of coolant through the vapor compression cycle in [kg/s]? Show your work. (11 points)

## What it tests

- Students can use R-134a tables to find compressor inlet and outlet enthalpies.
- Students can couple the gas-turbine net power to the vapor-compression compressor work.
- Students can solve for coolant mass flow from $\dot{W}_{comp} = -\dot{m}_c(h_2-h_1)$.

## Assumptions the solution expects

- Compressor in vapor-compression cycle is isentropic ($s_2=s_1$).
- Steady flow with negligible $\Delta ke$ and $\Delta pe$.
- The net gas-turbine power equals the vapor-compression compressor work input.
- State 1 is saturated vapor at 0.28 MPa; state 2 is superheated vapor at 0.9 MPa with $s_2=s_1$; use closest table value, no interpolation.

## Where students go wrong

- Using water tables instead of R-134a tables.
- Mishandling the sign when equating gas-turbine net power to vapor-compression compressor work.
- Using $h_1 = h_g$ at the wrong pressure or treating state 1 as superheated.
- Looking up state 2 as a saturated mixture instead of checking that $s_2 > s_g$ at 0.9 MPa.
- Mixing kJ and J in the denominator without converting $\dot{W}_{net}$ from MW to W or enthalpy difference from kJ/kg to J/kg.
- Using the solution's apparent denominator typo 399.89 instead of the listed $h_1=397.89$.

## How it is graded

Solution awards points for the cycle coupling equation (+2), compressor work relation (+2), state 1 lookup (+2), state 2 entropy lookup (+2), state 2 enthalpy lookup (+2), and final mass flow (+1).

## Final answers (hidden — for checking only)

- $h_1$: 397.89 kJ/kg
- $s_1=s_2$: 1.7278 kJ/(kg-K)
- $h_2$: 422.32 kJ/kg
- $\dot{m}_c$: 282.4 kg/s
