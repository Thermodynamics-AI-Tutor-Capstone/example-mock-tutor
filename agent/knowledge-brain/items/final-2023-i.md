---
id: item:final-2023-i
kind: item
title: Final exam, problem i (Summer 2023) — Refrigerant enthalpy after throttled expansion
description: 'Final exam (Summer 2023), problem i: Students can apply constant enthalpy across a throttling
  valve and use R-134a tables to find the enthalpy after the throttle.'
parent: topic:m8-07-vapor-compression
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-07-vapor-compression
- topic:m8-08-example-vapor-compression
sources:
- path: assignments/exams/final/OConnor_ME300_FinalExam_Summer2023.pdf
  pages:
  - 6
- path: assignments/exams/final/OConnor_ME300_FinalExam_Summer2023_Solutions.pdf
  pages:
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2023
---

# Final exam (Summer 2023), problem i: Refrigerant enthalpy after throttled expansion

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Vapor Compression Cycle data (assume ideal compression): R-134a quality at compressor inlet x=1; R-134a pressure at compressor inlet=0.2 MPa; R-134a pressure at compressor outlet=1.4 MPa; R-134a quality at condenser outlet x=0. i) What is the mass-specific enthalpy of the refrigerant after its throttled expansion in kJ/kg?

## What it tests

- Students can apply constant enthalpy across a throttling valve and use R-134a tables to find the enthalpy after the throttle.

## Assumptions the solution expects

- The throttle is adiabatic with no work and negligible kinetic and potential energy changes, so h4 = h3.
- Condenser outlet is saturated liquid at 1.4 MPa.
- R-134a tables are used for h3 = h_f at 1.4 MPa.

## Where students go wrong

- Treating the throttle as isentropic and setting s4 = s3.
- Using h_g at 1.4 MPa instead of h_f for saturated liquid.
- Using the compressor outlet enthalpy h2 as the throttle inlet enthalpy.
- Not identifying the condenser outlet quality x=0 as saturated liquid.
- Trying to find h4 from pressure and quality instead of using constant enthalpy.

## How it is graded

Solutions award credit for identifying state 3 as saturated liquid at 1.4 MPa, finding h3 = h_f, and using h4 = h3 across the throttle.

## Final answers (hidden — for checking only)

- $h_4$: 275.4 kJ/kg
