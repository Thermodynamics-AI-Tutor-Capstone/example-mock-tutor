---
id: item:final-2023-c
kind: item
title: Final exam, problem c (Summer 2023) — Maximum temperature of the Rankine cycle
description: 'Final exam (Summer 2023), problem c: Students can use a boiler energy balance to find the
  turbine inlet enthalpy and then use superheated steam tables to determine the maximum cycle temperature.'
parent: topic:m8-05-rankine-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-05-rankine-cycle
- topic:m8-06-example-rankine-cycle
sources:
- path: assignments/exams/final/OConnor_ME300_FinalExam_Summer2023.pdf
  pages:
  - 5
- path: assignments/exams/final/OConnor_ME300_FinalExam_Summer2023_Solutions.pdf
  pages:
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2023
---

# Final exam (Summer 2023), problem c: Maximum temperature of the Rankine cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Steam Plant Rankine Cycle data: quality of water before pump x=0; pressure before pump=0.7 MPa; pressure after pump=10 MPa; pump isentropic efficiency=0.85; heat added in boiler=128.753 MW; turbine isentropic efficiency=1; water mass flow=50 kg/s. Vapor Compression Cycle data (ideal compression): R-134a quality at compressor inlet=1; R-134a pressure at compressor inlet=0.2 MPa; R-134a pressure at compressor outlet=1.4 MPa; R-134a quality at condenser outlet=0. c) What is the maximum temperature of the Rankine cycle in K?

## What it tests

- Students can use a boiler energy balance to find the turbine inlet enthalpy and then use superheated steam tables to determine the maximum cycle temperature.

## Assumptions the solution expects

- Boiler is steady-flow with no work and negligible kinetic and potential energy changes.
- State 3 is at the boiler pressure P3 = 10 MPa.
- Use previous pump exit enthalpy h2 from part b.
- Boiler heat addition is Qdot_in = 128.753 MW and water mass flow is 50 kg/s.

## Where students go wrong

- Using h2 directly as turbine inlet enthalpy without adding Qdot/mdot.
- Using the wrong state for the boiler exit, e.g. saturated vapor instead of checking whether h3 > h_g.
- Reading the superheated table at the wrong pressure.
- Using K inconsistently with table temperatures or not converting to K.
- Incorrectly converting MW to kJ/s.

## How it is graded

Solutions award points for the boiler energy balance Qdot = mdot(h3 - h2), for computing h3, and for looking up T3 in the superheated table at 10 MPa.

## Final answers (hidden — for checking only)

- $T_3$: 740 K
