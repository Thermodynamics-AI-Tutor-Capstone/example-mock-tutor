---
id: item:final-2022-ii-h
kind: item
title: Final exam, problem II.h (Summer 2022) — Rankine-cycle net power
description: 'Final exam (Summer 2022), problem II.h: Students can compute pump work, turbine work, and
  net Rankine-cycle power using steam-table states.'
parent: topic:m8-05-rankine-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-05-rankine-cycle
- topic:m8-06-example-rankine-cycle
sources:
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2022.pdf
  pages:
  - 5
- path: assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2022_Solutions.pdf
  pages:
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2022
---

# Final exam (Summer 2022), problem II.h: Rankine-cycle net power

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

h) What is the power produced by the Rankine cycle [MW]?

## What it tests

- Students can compute pump work, turbine work, and net Rankine-cycle power using steam-table states.

## Assumptions the solution expects

- Steady-flow, quasi-equilibrium pump and turbine with $\Delta ke=\Delta pe=\dot{Q}=0$.
- Turbine is reversible, so $s_4=s_3$.
- State 4 at 0.4 MPa is a saturated mixture; use quality from $s_4$, $s_f$, and $s_g$.
- Use $\dot{W}=-\dot{m}\Delta h$ for pump and turbine.

## Where students go wrong

- Not computing state 4 by using $s_4=s_3$ and the saturated mixture relations.
- Using saturated vapor or saturated liquid enthalpy for state 4 without finding quality.
- Sign error when adding pump work and turbine work.
- Using the gas-turbine mass flow instead of the Rankine-cycle water mass flow.

## How it is graded

Solution awards points for writing $\dot{W}_{net}=\dot{W}_{pump}+\dot{W}_{turb}$, for $\dot{W}=-\dot{m}\Delta h$, for finding state 4 via $s_4=s_3$, for computing quality and enthalpy at state 4, and for the final net power.

## Final answers (hidden — for checking only)

- $\dot{W}_{net,Rankine}$: 167.12 MW
