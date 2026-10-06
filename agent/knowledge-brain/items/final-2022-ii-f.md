---
id: item:final-2022-ii-f
kind: item
title: Final exam, problem II.f (Summer 2022) — Gas turbine heat rejection rate
description: 'Final exam (Summer 2022), problem II.f: Students can calculate heat rejection from the gas
  turbine using $\dot{Q}_{out}=\dot{Q}_{in}-\dot{W}_{net}$.'
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
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2022
---

# Final exam (Summer 2022), problem II.f: Gas turbine heat rejection rate

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

f) What is the heat rejected from the gas turbine in [MW]?

## What it tests

- Students can calculate heat rejection from the gas turbine using $\dot{Q}_{out}=\dot{Q}_{in}-\dot{W}_{net}$.

## Assumptions the solution expects

- Use the first law for the gas-turbine cycle: $\dot{Q}_{out}=\dot{Q}_{in}-\dot{W}_{net}$.

## Where students go wrong

- Forgetting the sign convention and reporting heat rejection as positive when the solution writes it as negative.
- Using heat added or net power incorrectly due to transcription errors in the given values.

## How it is graded

Solution awards credit for the first-law balance and for the final boxed value $-701.12$ MW.

## Final answers (hidden — for checking only)

- $\dot{Q}_{out,gas turbine}$: -701.12 MW
