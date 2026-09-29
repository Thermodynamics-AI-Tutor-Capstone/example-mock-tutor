---
id: item:final-2023-f
kind: item
title: Final exam, problem f (Summer 2023) — Heat rejected from the Rankine cycle
description: 'Final exam (Summer 2023), problem f: Students can compute the condenser heat transfer rate
  from the steady-flow condenser energy balance.'
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
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2023
---

# Final exam (Summer 2023), problem f: Heat rejected from the Rankine cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Steam Plant Rankine Cycle data: quality of water before pump x=0; pressure before pump=0.7 MPa; pressure after pump=10 MPa; pump isentropic efficiency=0.85; heat added in boiler=128.753 MW; turbine isentropic efficiency=1; water mass flow=50 kg/s. Vapor Compression Cycle data (ideal compression): R-134a quality at compressor inlet=1; R-134a pressure at compressor inlet=0.2 MPa; R-134a pressure at compressor outlet=1.4 MPa; R-134a quality at condenser outlet=0. f) What is the heat rejected from the Rankine cycle in MW?

## What it tests

- Students can compute the condenser heat transfer rate from the steady-flow condenser energy balance.

## Assumptions the solution expects

- Condenser is steady-flow with no work and negligible KE/PE.
- Heat rejection rate is Qdot_out = mdot(h1 - h4).
- Use values from previous states for h1 and h4.

## Where students go wrong

- Reporting heat rejected as positive when the solution sign convention gives Qdot_out negative.
- Swapping h1 and h4 in Qdot_out.
- Using the net work instead of the condenser heat transfer.
- Forgetting the water mass flow of 50 kg/s.

## How it is graded

Solutions award +2 for the equation Qdot_out = mdot(h1 - h4) and +1 for the final value -98.405 MW.

## Final answers (hidden — for checking only)

- $\dot Q_{out}$: -98.405 MW
