---
id: eq:ideal-gas-nozzle-exit-temperature
kind: equation
title: Ideal-gas nozzle exit temperature
description: Use to find the exit temperature of an ideal gas in an adiabatic nozzle or diffuser when
  velocities are known.
parent: topic:m6-02-steady-flow-energy-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: T_2 = T_1 - \frac{1}{2 c_p}(V_2^2 - V_1^2)
plain_statement: For an adiabatic, no-work, constant-cp ideal-gas nozzle with negligible potential-energy
  change, the exit temperature is obtained from the inlet temperature and velocity change.
symbols:
- T
- c_p
- V
valid_when:
- steady-flow
- control-volume
- single-inlet-single-exit
- ideal-gas
- constant-specific-heats
- adiabatic
- negligible-potential-energy
invalid_when:
- closed-system
- transient
- variable-specific-heats
misconceptions: []
sources:
- path: lectures/Module6_2_SteadyFlowEnergyConservation_annotated.pdf
  pages:
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal-gas nozzle exit temperature

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
T_2 = T_1 - \frac{1}{2 c_p}(V_2^2 - V_1^2)
$$

For an ideal gas with constant $c_p$, the nozzle/diffuser energy balance can be solved directly for exit temperature. The equation comes from replacing the enthalpy change with $c_p(T_2-T_1)$ and solving for $T_2$. Use it when the adiabatic no-work, negligible-potential assumptions hold and velocities are known or can be found. Do not use it with variable specific heats or when heat transfer cannot be neglected.

**Taught in:** M6.2 (`topic:m6-02-steady-flow-energy-conservation`)
