---
id: eq:nozzle-diffuser-energy-balance
kind: equation
title: Nozzle and diffuser energy balance
description: Use for an adiabatic nozzle or diffuser to relate exit velocity or temperature to the inlet
  state.
parent: topic:m6-02-steady-flow-energy-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: (h_2 - h_1) + \frac{1}{2}(V_2^2 - V_1^2) = 0
plain_statement: For an adiabatic, no-work steady-flow device with negligible potential-energy change,
  the enthalpy change balances the kinetic-energy change.
symbols:
- h
- V
valid_when:
- steady-flow
- control-volume
- single-inlet-single-exit
- adiabatic
- negligible-potential-energy
invalid_when:
- closed-system
- transient
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
sources:
- path: lectures/Module6_2_SteadyFlowEnergyConservation_annotated.pdf
  pages:
  - 8
- path: lectures/Module6_4_NozzleDiffuser_annotated.pdf
  pages:
  - 4
- path: lectures/Module8_11_GasTurbineEngines_annotated.pdf
  pages:
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Nozzle and diffuser energy balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
(h_2 - h_1) + \frac{1}{2}(V_2^2 - V_1^2) = 0
$$

For an adiabatic, no-work steady-flow device with negligible potential-energy change, the steady-flow energy equation reduces to a balance between enthalpy change and kinetic-energy change. A nozzle increases velocity and drops enthalpy; a diffuser does the opposite. Use this to find exit velocity or exit enthalpy after cancellations. The equation assumes no heat transfer and no work; it also assumes potential energy changes are negligible compared with kinetic changes.

**Also written in the lectures as:**

- $\Delta h+\Delta ke=0$

**Taught in:** M6.2 (`topic:m6-02-steady-flow-energy-conservation`), M6.4 (`topic:m6-04-nozzle-diffuser`), M8.11 (`topic:m8-11-gas-turbine-engines`)
