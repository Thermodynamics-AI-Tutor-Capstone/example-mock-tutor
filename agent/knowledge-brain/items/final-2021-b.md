---
id: item:final-2021-b
kind: item
title: Final exam, problem b (Summer 2021) — Brayton compressor exit temperature
description: 'Final exam (Summer 2021), problem b: Students can compute $T_{2s}$ for an isentropic air
  compressor and use isentropic efficiency to find actual exit temperature.'
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

# Final exam (Summer 2021), problem b: Brayton compressor exit temperature

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Given data: Gas turbine Brayton cycle — inlet temperature 300 K; inlet pressure 0.1 MPa; compressor pressure ratio 25; compressor isentropic efficiency 0.9; maximum temperature 1600 K; turbine isentropic efficiency 1; mass flow 15 kg/s; air properties $c_p=1001\ \mathrm{J/(kg\cdot K)}$, $\gamma=1.4$. Refrigerator vapor-compression cycle — pressure at compressor inlet 0.28 MPa; quality at compressor inlet 1; pressure at compressor outlet 0.9 MPa; compressor isentropic efficiency 1; quality after the condenser 0. (b) What is the temperature of the air after the compressor in the gas turbine in [K]? Show your work. (8 points)

## What it tests

- Students can compute $T_{2s}$ for an isentropic air compressor and use isentropic efficiency to find actual exit temperature.

## Assumptions the solution expects

- Air is an ideal gas with constant specific heats.
- Compressor is steady flow with negligible kinetic and potential energy changes.
- Compressor isentropic efficiency is 0.9.

## Where students go wrong

- Using the wrong exponent, such as $\gamma/(\gamma-1)$ instead of $(\gamma-1)/\gamma$.
- Skipping the isentropic outlet state and applying efficiency directly to pressures.
- Reversing the efficiency formula, for example multiplying instead of dividing by 0.9.
- Using $T_2 = \eta_{isen} T_{2s}$ instead of $T_2 = T_1 + (T_{2s}-T_1)/\eta_{isen}$.

## How it is graded

Points reward finding $T_{2s}$ and then correct use of the compressor isentropic efficiency. Final answer boxed in solution as 802.8 K.

## Final answers (hidden — for checking only)

- $T_{2s}$: 752.55 K
- $T_2$: 802.8 K
