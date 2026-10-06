---
id: item:final-2023-j
kind: item
title: Final exam, problem j (Summer 2023) — Refrigerant mass flow needed to cool the Rankine condenser
  water
description: 'Final exam (Summer 2023), problem j: Students can couple the Rankine condenser heat rejection
  to the vapor-compression evaporator and solve for the required refrigerant mass flow.'
parent: topic:m8-05-rankine-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-05-rankine-cycle
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

# Final exam (Summer 2023), problem j: Refrigerant mass flow needed to cool the Rankine condenser water

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Vapor Compression Cycle data (assume ideal compression): R-134a quality at compressor inlet x=1; R-134a pressure at compressor inlet=0.2 MPa; R-134a pressure at compressor outlet=1.4 MPa; R-134a quality at condenser outlet x=0. j) If the heat rejected from the Rankine cycle is equal to the heat absorbed into the vapor compression cycle, what is the mass flow of refrigerant necessary to cool the water in kg/s?

## What it tests

- Students can couple the Rankine condenser heat rejection to the vapor-compression evaporator and solve for the required refrigerant mass flow.

## Assumptions the solution expects

- The heat rejected from the Rankine cycle is equal in magnitude to the heat absorbed into the vapor compression cycle.
- Evaporator heat input is Qdot_in,VCS = mdot_refrigerant(h1 - h4).
- Use previous values for Rankine heat rejection and refrigerant h1 and h4.

## Where students go wrong

- Not handling the sign of Rankine Qdot_out when setting it equal to the vapor compression heat absorbed.
- Using h2 - h4 or other wrong enthalpy difference in the evaporator.
- Using the steam mass flow instead of solving for refrigerant mass flow.
- Forgetting to convert kW and MW consistently.
- Using h2 and h1 from the wrong cycle.

## How it is graded

Solutions award credit for equating the Rankine heat transfer to the vapor-compression heat input, writing Qdot_in,VCS = mdot_refrigerant(h1 - h4), and computing the final refrigerant mass flow.

## Final answers (hidden — for checking only)

- $\dot m_{refrigerant}$: 839.5 kg/s
