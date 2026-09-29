---
id: item:final-2022-ii-b
kind: item
title: Final exam, problem II.b (Summer 2022) — Gas turbine compressor exit temperature
description: 'Final exam (Summer 2022), problem II.b: Students can apply the ideal-gas isentropic pressure-temperature
  relation and then correct with compressor isentropic efficiency.'
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

# Final exam (Summer 2022), problem II.b: Gas turbine compressor exit temperature

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

b) What is the temperature of the air after the compressor in the gas turbine in [K]?

## What it tests

- Students can apply the ideal-gas isentropic pressure-temperature relation and then correct with compressor isentropic efficiency.

## Assumptions the solution expects

- Air is an ideal gas with constant $c_p$ and $\gamma$.
- Compressor is quasi-equilibrium, steady-flow, with $\Delta ke=\Delta pe=\dot{Q}=0$.
- Use $T_{2s}=T_1(P_2/P_1)^{(\gamma-1)/\gamma}$.
- Use $\eta_c=(T_{2s}-T_1)/(T_2-T_1)$.

## Where students go wrong

- Using $T_{2s}=T_1(P_2/P_1)^\gamma$ instead of $T_{2s}=T_1(P_2/P_1)^{(\gamma-1)/\gamma}$.
- Forgetting to divide the isentropic temperature rise by the compressor isentropic efficiency.
- Using $c_p$ inconsistently in J vs kJ when evaluating temperatures.

## How it is graded

Solution awards 2 pts for the isentropic relation giving $T_{2s}=725.52$ K, 2 pts for the compressor efficiency equation, and 2 pts for the final $T_2=800.66$ K.

## Final answers (hidden — for checking only)

- $T_2$: 800.66 K
