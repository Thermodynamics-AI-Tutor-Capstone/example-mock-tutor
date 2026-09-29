---
id: item:final-2022-ii-c
kind: item
title: Final exam, problem II.c (Summer 2022) — Maximum gas turbine cycle temperature
description: 'Final exam (Summer 2022), problem II.c: Students can use the heat addition rate in the combustor
  and the mass flow to find the turbine inlet temperature.'
parent: topic:m8-09-brayton-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-09-brayton-cycle
- topic:m8-10-example-brayton-cycle
sources:
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2022.pdf
  pages:
  - 5
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2022_Solutions.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2022
---

# Final exam (Summer 2022), problem II.c: Maximum gas turbine cycle temperature

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

The story: Combined cycle power generation is currently the most thermally efficient way to produce large amounts of electricity (on the order of gigawatts). In this problem, analyze one of the world's newest combined cycle power plants, installed in Ostroleka, Poland. Use the information below. Identify any tables you use at each step. If you use a superheated vapor or subcooled liquid table, do not interpolate between values — use the closest value on the table.

Note: This question builds on itself; write down the method if stuck, because most credit is for the method.

Gas Turbine Brayton Cycle:
- Inlet air temperature: 300 K
- Inlet air pressure: 0.1 MPa
- Compressor pressure ratio: 22
- Compressor isentropic efficiency: 0.85
- Heat added during combustion: 1323 MW
- Turbine isentropic efficiency: 0.9
- Air mass flow: 980 kg/s
- Properties for air: $c_p=1001$ J/kg-K, $\gamma=1.4$

Steam Turbine (assume reversible):
- Water quality at pump inlet: 0
- Water pressure at pump inlet: 0.4 MPa
- Water pressure at pump outlet: 10 MPa
- Water quality at boiler outlet: 1

c) What is the maximum temperature of the cycle in [K]?

## What it tests

- Students can use the heat addition rate in the combustor and the mass flow to find the turbine inlet temperature.

## Assumptions the solution expects

- Steady-flow combustor with $\Delta ke=\Delta pe=\dot{W}=0$.
- Heat addition is $\dot{Q}=\dot{m}c_p(T_3-T_2)$.
- $T_{\max}=T_3$.

## Where students go wrong

- Not recognizing that the maximum temperature is the combustor outlet/turbine inlet temperature $T_3$.
- Using $c_p$ in kJ/kg-K without converting, or mixing mass-flow values, causing a different $T_3$.
- Forgetting to add $T_2$ to the temperature rise from $\dot{Q}/\dot{m}c_p$.

## How it is graded

Solution awards 2 pts for the combustor steady-flow energy balance and 1 pt for the final $T_3=2149.3$ K.

## Final answers (hidden — for checking only)

- $T_3$: 2149.3 K
