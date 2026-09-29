---
id: eq:flow-work-rate
kind: equation
title: Flow work rate
description: Use to identify the Pv mass-flow work term embedded in enthalpy in control-volume energy
  balances.
parent: topic:m6-02-steady-flow-energy-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: \dot{W}_{flow} = \dot{m} P v
plain_statement: Flow work rate is the product of mass flow rate, pressure, and specific volume.
symbols:
- \dot{W}
- \dot{m}
- P
- v
valid_when:
- steady-flow
- control-volume
- single-inlet-single-exit
invalid_when:
- closed-system
misconceptions:
- misc:m12-boundary-flow-and-shaft-work-confused
sources:
- path: lectures/Module6_2_SteadyFlowEnergyConservation_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Flow work rate

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{W}_{flow} = \dot{m} P v
$$

Flow work is the work required to push mass across the control-volume boundary. At a cross section it is the product of mass flow rate and $Pv$. At the inlet the sign is positive for the control volume; at the exit the sign is negative because the control volume must push the fluid out. Flow work is not shaft work. It is embedded in the enthalpy term of the steady-flow energy equation when the energy balance is written in terms of enthalpy.

**Taught in:** M6.2 (`topic:m6-02-steady-flow-energy-conservation`)
