---
id: eq:steady-flow-energy-adiabatic-single-stream
kind: equation
title: Steady-flow energy for adiabatic single-stream devices
description: Use as the energy balance for turbines, compressors, pumps, and nozzles when heat and kinetic/potential
  changes are negligible.
parent: topic:m6-08-compressors-turbines
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: $$\dot{W} = -\dot{m}(h_2 - h_1)$$
plain_statement: For steady, adiabatic, one-inlet/one-exit flow with negligible kinetic and potential
  energy changes, shaft power equals negative mass flow times enthalpy change.
symbols:
- \dot{W}
- \dot{m}
- h
valid_when:
- steady-flow
- single-inlet-single-exit
- adiabatic
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- transient
misconceptions:
- misc:m12-boundary-flow-and-shaft-work-confused
sources:
- path: lectures/Module6_3_Example_SteadyFlowEnergyConservation_annotated.pdf
  pages:
  - 2
  - 5
- path: lectures/Module6_8_CompressorsTurbines_annotated.pdf
  pages:
  - 3
  - 5
- path: lectures/Module6_9_Example_CompressorsTurbines_annotated.pdf
  pages:
  - 2
  - 5
- path: lectures/Module7_13_Example_IsentropicTurbine_annotated.pdf
  pages:
  - 2
  - 6
- path: lectures/Module7_14_IsentropicEfficiency_annotated.pdf
  pages:
  - 7
- path: lectures/Module7_15_Example_IsentropicEfficiency_annotated.pdf
  pages:
  - 2
- path: lectures/Module8_6_Example_RankineCycle_annotated.pdf
  pages:
  - 6
- path: lectures/Module8_7_VaporCompression_annotated.pdf
  pages:
  - 5
- path: lectures/Module8_8_Example_VaporCompression_annotated.pdf
  pages:
  - 5
- path: lectures/Module8_9_BraytonCycle_annotated.pdf
  pages:
  - 7
- path: lectures/Module8_10_Example_BraytonCycle_annotated.pdf
  pages:
  - 6
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Steady-flow energy for adiabatic single-stream devices

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\dot{W} = -\dot{m}(h_2 - h_1)$$
$$

This is the reduced steady-flow energy equation for a single stream, obtained from the control-volume first law with Qdot=0, one inlet/outlet, and negligible kinetic and potential energy changes. For a turbine h2<h1 so Wdot is positive; for a compressor h2>h1 so Wdot is negative. The sign convention matters: Wdot is positive for work done by the control volume. Do not use this form if heat transfer is significant or if there are multiple streams. It is the starting point for isentropic-efficiency calculations.

**Also written in the lectures as:**

- $\dot{m}(h_2 - h_1) = -\dot{W}$
- ${}_i\dot{W}_f=-\dot{m}(h_f-h_i)$

**Taught in:** M6.3 (`topic:m6-03-example-steady-flow-energy-conservation`), M6.8 (`topic:m6-08-compressors-turbines`), M6.9 (`topic:m6-09-example-compressors-turbines`), M7.13 (`topic:m7-13-example-isentropic-turbine`), M7.14 (`topic:m7-14-isentropic-efficiency`), M7.15 (`topic:m7-15-example-isentropic-efficiency`), M8.6 (`topic:m8-06-example-rankine-cycle`), M8.7 (`topic:m8-07-vapor-compression`), M8.8 (`topic:m8-08-example-vapor-compression`), M8.9 (`topic:m8-09-brayton-cycle`), M8.10 (`topic:m8-10-example-brayton-cycle`), M8.12 (`topic:m8-12-example-gas-turbine-engines`)
