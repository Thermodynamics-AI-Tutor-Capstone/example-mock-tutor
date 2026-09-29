---
id: eq:steady-flow-energy-balance
kind: equation
title: Steady-flow energy balance for a single stream
description: General starting equation for steady-flow devices; cancel heat, work, kinetic, or potential
  terms based on assumptions.
parent: topic:m6-02-steady-flow-energy-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: \dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}
plain_statement: For a steady-flow control volume, the energy carried by mass flow balances the net heat
  transfer rate minus the work rate.
symbols:
- \dot{m}
- h
- \dot{Q}
- \dot{W}
valid_when:
- steady-flow
- control-volume
- single-inlet-single-exit
invalid_when:
- transient
- closed-system
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
sources:
- path: lectures/Module6_2_SteadyFlowEnergyConservation_annotated.pdf
  pages:
  - 4
- path: lectures/Module6_3_Example_SteadyFlowEnergyConservation_annotated.pdf
  pages:
  - 2
- path: lectures/Module6_8_CompressorsTurbines_annotated.pdf
  pages:
  - 3
  - 5
- path: lectures/Module8_5_RankineCycle_annotated.pdf
  pages:
  - 5
- path: lectures/Module8_7_VaporCompression_annotated.pdf
  pages:
  - 5
- path: lectures/Module8_9_BraytonCycle_annotated.pdf
  pages:
  - 7
- path: lectures/Module8_11_GasTurbineEngines_annotated.pdf
  pages:
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Steady-flow energy balance for a single stream

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}
$$

For a single-stream steady control volume, the energy carried by mass flow appears as enthalpy plus kinetic and potential energy changes. The left side is the net rate of energy carried out by the mass stream, and the right side is the net heat transfer rate minus the work rate. Use this as the general starting point for nozzles, turbines, compressors, throttles, and heat exchangers, then cancel terms based on device-specific assumptions. Note that the work term here is not flow work; flow work is already embedded in enthalpy via $h = u + Pv$.

**Taught in:** M6.2 (`topic:m6-02-steady-flow-energy-conservation`), M6.3 (`topic:m6-03-example-steady-flow-energy-conservation`), M6.8 (`topic:m6-08-compressors-turbines`), M8.5 (`topic:m8-05-rankine-cycle`), M8.7 (`topic:m8-07-vapor-compression`), M8.9 (`topic:m8-09-brayton-cycle`), M8.11 (`topic:m8-11-gas-turbine-engines`)
