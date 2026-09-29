---
id: item:final-2023-e
kind: item
title: Final exam, problem e (Summer 2023) — Thermal efficiency of the Rankine cycle
description: 'Final exam (Summer 2023), problem e: Students can compute thermal efficiency from net power
  and heat addition rate.'
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

# Final exam (Summer 2023), problem e: Thermal efficiency of the Rankine cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Steam Plant Rankine Cycle data: quality of water before pump x=0; pressure before pump=0.7 MPa; pressure after pump=10 MPa; pump isentropic efficiency=0.85; heat added in boiler=128.753 MW; turbine isentropic efficiency=1; water mass flow=50 kg/s. Vapor Compression Cycle data (ideal compression): R-134a quality at compressor inlet=1; R-134a pressure at compressor inlet=0.2 MPa; R-134a pressure at compressor outlet=1.4 MPa; R-134a quality at condenser outlet=0. e) What is the thermal efficiency of the Rankine cycle?

## What it tests

- Students can compute thermal efficiency from net power and heat addition rate.

## Assumptions the solution expects

- Use previous net power and boiler heat addition.
- Thermal efficiency is defined as net work output divided by heat input.

## Where students go wrong

- Using heat rejected in the denominator.
- Using net heat addition instead of boiler heat addition.
- Using an incorrect sign or units for Wdot_net or Qdot_in.
- Reporting efficiency as a percentage without converting correctly.

## How it is graded

Solutions award +2 for the ratio Wdot_net/Qdot_in and +1 for the final value 0.236.

## Final answers (hidden — for checking only)

- $\eta_{th}$: 0.236
