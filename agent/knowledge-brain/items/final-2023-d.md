---
id: item:final-2023-d
kind: item
title: Final exam, problem d (Summer 2023) — Net power of the Rankine cycle
description: 'Final exam (Summer 2023), problem d: Students can determine the turbine exit state for an
  isentropic steam turbine and compute the net cycle power from pump and turbine work.'
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

# Final exam (Summer 2023), problem d: Net power of the Rankine cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Steam Plant Rankine Cycle data: quality of water before pump x=0; pressure before pump=0.7 MPa; pressure after pump=10 MPa; pump isentropic efficiency=0.85; heat added in boiler=128.753 MW; turbine isentropic efficiency=1; water mass flow=50 kg/s. Vapor Compression Cycle data (ideal compression): R-134a quality at compressor inlet=1; R-134a pressure at compressor inlet=0.2 MPa; R-134a pressure at compressor outlet=1.4 MPa; R-134a quality at condenser outlet=0. d) What is the net power of the Rankine cycle in MW?

## What it tests

- Students can determine the turbine exit state for an isentropic steam turbine and compute the net cycle power from pump and turbine work.

## Assumptions the solution expects

- Turbine is isentropic, so s4 = s3.
- Turbine exit pressure is P4 = 0.7 MPa.
- State 4 is a saturated mixture at 0.7 MPa.
- Net power is pump work plus turbine work with steady-flow, negligible KE/PE.

## Where students go wrong

- Treating the turbine exit as superheated vapor instead of a saturated mixture.
- Computing quality with s_f and s_g at the wrong pressure.
- Using h4 = h_g or h4 = h_f instead of the mixture enthalpy.
- Sign errors in the net work expression when adding pump and turbine work.
- Using only turbine work and neglecting pump work.

## How it is graded

Solutions award credit for P4, identifying the mixture, quality x4, h4, the net work equation, and the final net power.

## Final answers (hidden — for checking only)

- $\dot W_{net}$: 30.380 MW
