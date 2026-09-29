---
id: item:final-2023-a
kind: item
title: Final exam, problem a (Summer 2023) — Assumptions for Rankine vapor power plant and vapor compression
  cycle devices
description: 'Final exam (Summer 2023), problem a: Students can identify steady-flow, quasi-equilibrium
  and device-specific assumptions for a Rankine power plant and an ideal vapor compression cycle.'
parent: topic:m8-05-rankine-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-05-rankine-cycle
- topic:m8-07-vapor-compression
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

# Final exam (Summer 2023), problem a: Assumptions for Rankine vapor power plant and vapor compression cycle devices

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

The story: Many nuclear power plants are located next to rivers or the ocean because they use the cold water from these bodies to cool the working fluid in big heat exchangers in the final step of the Rankine cycle. Scientists have recently suggested that cooling the water used in this final step with river or ocean water is actually bad for the aquatic life because the water gets too warm for them when it is returned. To avoid this, we are going to use a vapor compression cycle to cool the water in the final step of the Rankine cycle to save the fish. In this problem, you are going to do the Rankine cycle analysis and then figure out how much refrigerant mass flow is necessary to run the refrigeration cycle necessary to cool down that water in the last step of the Rankine cycle. Identify any tables you use at each step. If you use a superheated vapor or subcooled liquid table, do not interpolate between values—use the closest value on the table. Steam Plant Rankine Cycle data: quality of water before pump x=0; pressure before pump=0.7 MPa; pressure after pump=10 MPa; pump isentropic efficiency=0.85; heat added in boiler=128.753 MW; turbine isentropic efficiency=1; water mass flow=50 kg/s. Vapor Compression Cycle data (assume ideal compression): R-134a quality at compressor inlet=1; R-134a pressure at compressor inlet=0.2 MPa; R-134a pressure at compressor outlet=1.4 MPa; R-134a quality at condenser outlet=0. a) What assumptions must be made about both the working fluid and the devices in this power plant in order to solve for the state points? Make sure to list all devices!

## What it tests

- Students can identify steady-flow, quasi-equilibrium and device-specific assumptions for a Rankine power plant and an ideal vapor compression cycle.

## Assumptions the solution expects

- Steady-state.
- Steady-flow.
- Quasi-equilibrium.
- Compressors, pumps, and turbines: Δke = Δpe = 0 and Qdot = 0.
- Heat exchangers: Δke = Δpe = 0 and Wdot = 0.
- Throttle: Δke = Δpe = 0, Qdot = 0, and Wdot = 0.

## Where students go wrong

- Forgetting to list all devices, especially the throttle.
- Not distinguishing heat exchangers as having no work versus turbines/pumps/compressors as having no heat transfer.
- Omitting steady-state or steady-flow.
- Omitting quasi-equilibrium.
- Assigning kinetic or potential energy changes to devices when they are negligible.

## How it is graded

Solutions award points for steady-state, steady-flow, quasi-equilibrium, and for the device-specific simplifications for pumps/compressors/turbines, heat exchangers, and the throttle.

## Final answers (hidden — for checking only)

- assumptions: steady-state; steady-flow; quasi-equilibrium; pumps/compressors/turbines: Δke=Δpe=0 and Qdot=0; heat exchangers: Δke=Δpe=0 and Wdot=0; throttle: Δke=Δpe=0, Qdot=0, Wdot=0
