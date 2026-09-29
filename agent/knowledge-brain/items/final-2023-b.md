---
id: item:final-2023-b
kind: item
title: Final exam, problem b (Summer 2023) — Mass-specific enthalpy after the Rankine pump
description: 'Final exam (Summer 2023), problem b: Students can compute the actual pump exit enthalpy
  using saturated liquid data, the isentropic pump exit state, and the pump isentropic efficiency.'
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
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2023
---

# Final exam (Summer 2023), problem b: Mass-specific enthalpy after the Rankine pump

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Steam Plant Rankine Cycle data: quality of water before pump x=0; pressure before pump=0.7 MPa; pressure after pump=10 MPa; pump isentropic efficiency=0.85; heat added in boiler=128.753 MW; turbine isentropic efficiency=1; water mass flow=50 kg/s. Vapor Compression Cycle data (ideal compression): R-134a quality at compressor inlet=1; R-134a pressure at compressor inlet=0.2 MPa; R-134a pressure at compressor outlet=1.4 MPa; R-134a quality at condenser outlet=0. b) What is the mass-specific enthalpy of the water after the pump in the Rankine cycle in kJ/kg?

## What it tests

- Students can compute the actual pump exit enthalpy using saturated liquid data, the isentropic pump exit state, and the pump isentropic efficiency.

## Assumptions the solution expects

- Steady-flow, adiabatic pump with negligible Δke and Δpe.
- State 1 is saturated liquid at P1 = 0.7 MPa.
- Isentropic pump exit state 2s has s2s = s1.
- Pump isentropic efficiency relates ideal and actual pump work.

## Where students go wrong

- Using h2s directly as the actual exit enthalpy instead of applying pump efficiency.
- Misapplying the pump efficiency formula, e.g. multiplying h2s instead of using h2 = h1 + (h2s - h1)/η_pump.
- Using the wrong table for compressed/subcooled liquid.
- Not setting s2s = s1 for the isentropic pump state.
- Incorrectly interpolating when the problem says to use the closest table value.

## How it is graded

Solutions award credit for h1 and s1 at P=0.7 MPa, s2s=s1, identifying that state 2s is liquid, finding h2s from the compressed liquid table, writing the pump efficiency relation, and the final h2.

## Final answers (hidden — for checking only)

- $h_2$: 712.29 kJ/kg
