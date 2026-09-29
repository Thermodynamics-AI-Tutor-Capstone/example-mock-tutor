---
id: item:final-2022-ii-i
kind: item
title: Final exam, problem II.i (Summer 2022) — Combined-cycle thermal efficiency
description: 'Final exam (Summer 2022), problem II.i: Students can compute the efficiency of a combined
  cycle by adding the gas and steam net powers and dividing by the total heat input.'
parent: topic:m8-01-heat-engine-cycle-analysis
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-01-heat-engine-cycle-analysis
- topic:m8-05-rankine-cycle
- topic:m8-09-brayton-cycle
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

# Final exam (Summer 2022), problem II.i: Combined-cycle thermal efficiency

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

i) What is the combined-cycle efficiency of this power plant?

## What it tests

- Students can compute the efficiency of a combined cycle by adding the gas and steam net powers and dividing by the total heat input.

## Assumptions the solution expects

- Combined-cycle net power is $\dot{W}_{GT}+\dot{W}_{ST}$.
- Total heat input is the gas-turbine heat addition.

## Where students go wrong

- Using only the gas turbine net power instead of the sum of gas and steam net powers.
- Using the wrong total heat input by including heat rejected to the steam cycle.
- Treating the combined-cycle efficiency as the product of the gas and steam cycle efficiencies.

## How it is graded

Solution awards 2 pts for writing the combined efficiency formula and 1 pt for the final 0.594.

## Final answers (hidden — for checking only)

- $\eta_{th,combined}$: 0.594
