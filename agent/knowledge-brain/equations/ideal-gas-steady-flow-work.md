---
id: eq:ideal-gas-steady-flow-work
kind: equation
title: Ideal-gas steady-flow work
description: Use to estimate turbine or compressor power when the gas may be modeled as an ideal gas with
  constant specific heat.
parent: topic:m8-09-brayton-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: $$\dot{W} = -\dot{m} c_p (T_2 - T_1)$$
plain_statement: For an ideal gas with constant c_p, steady adiabatic shaft power is mass flow times c_p
  times temperature change with a negative sign.
symbols:
- \dot{W}
- \dot{m}
- c_p
- T
valid_when:
- steady-flow
- adiabatic
- ideal-gas
- constant-specific-heats
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when: []
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module7_15_Example_IsentropicEfficiency_annotated.pdf
  pages:
  - 2
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

# Ideal-gas steady-flow work

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\dot{W} = -\dot{m} c_p (T_2 - T_1)$$
$$

This specializes the steady-flow energy balance by replacing h2-h1 with c_p(T2-T1). It requires the ideal-gas model with constant c_p. For compressors, T2>T1 and Wdot is negative; for turbines, T2<T1 and Wdot is positive. Use only when the device is adiabatic and kinetic/potential effects are negligible. If c_p varies significantly, use enthalpy from ideal-gas tables. If the process is isentropic, T2 can be computed from the isentropic relation; otherwise use efficiency to find the real outlet.

**Also written in the lectures as:**

- ${}_i\dot{W}_f=-\dot{m}c_p(T_f-T_i)$

**Taught in:** M7.15 (`topic:m7-15-example-isentropic-efficiency`), M8.9 (`topic:m8-09-brayton-cycle`), M8.10 (`topic:m8-10-example-brayton-cycle`), M8.12 (`topic:m8-12-example-gas-turbine-engines`)
