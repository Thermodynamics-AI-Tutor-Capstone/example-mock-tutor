---
id: item:final-2022-ii-g
kind: item
title: Final exam, problem II.g (Summer 2022) — Rankine-cycle water mass flow rate
description: 'Final exam (Summer 2022), problem II.g: Students can use the heat rejected from the gas
  turbine as the heat input to the steam cycle and find the required steam mass flow from enthalpy values.'
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
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2022
---

# Final exam (Summer 2022), problem II.g: Rankine-cycle water mass flow rate

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

g) What is the mass flow of water through the Rankine cycle in [kg/s]?

## What it tests

- Students can use the heat rejected from the gas turbine as the heat input to the steam cycle and find the required steam mass flow from enthalpy values.

## Assumptions the solution expects

- In combined cycle, the gas-turbine heat rejection is the heat input to the steam cycle.
- Boiler is steady-flow with $\dot{Q}_{in}=\dot{m}(h_3-h_2)$.
- State 1 is saturated liquid at 0.4 MPa, so $h_1=h_f$ and $s_1=s_f$.
- Pump process is isentropic: $s_2=s_1$.
- State 3 is saturated vapor at 10 MPa, so $h_3=h_g$.
- Use steam tables D.2, D.4B as appropriate without interpolating.

## Where students go wrong

- Not recognizing that the gas-turbine heat rejection becomes the Rankine-cycle heat input.
- Using saturated liquid enthalpy instead of compressed liquid enthalpy at state 2 without using the isentropic pump relation.
- Using saturated vapor enthalpy at state 2 or saturated liquid enthalpy at state 3.
- Interpolating in superheated or subcooled tables even though the instructions say not to interpolate.

## How it is graded

Solution awards points for finding the steam-cycle heat input, using $\dot{Q}_{in}=\dot{m}(h_3-h_2)$, and for each steam-table state: state 1 enthalpy and entropy, state 2 via $s_2=s_1$, state 3 enthalpy, and the final mass flow.

## Final answers (hidden — for checking only)

- $\dot{m}_{water}$: 33.73 kg/s
