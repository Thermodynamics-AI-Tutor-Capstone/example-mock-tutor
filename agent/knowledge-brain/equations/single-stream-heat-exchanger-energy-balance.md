---
id: eq:single-stream-heat-exchanger-energy-balance
kind: equation
title: Single-stream heat exchanger energy balance
description: Use for one fluid stream in a steady-flow heat exchanger to relate heat transfer to enthalpy
  change.
parent: topic:m6-06-heat-exchangers
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: \dot{m}(h_2 - h_1) = \dot{Q}
plain_statement: For one steady stream with negligible kinetic and potential energy changes and no work,
  the heat-transfer rate equals the mass flow rate times the enthalpy change.
symbols:
- \dot{m}
- h
- \dot{Q}
valid_when:
- control-volume
- steady-flow
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- closed-system
- transient
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
sources:
- path: lectures/Module6_6_HeatExchangers_annotated.pdf
  pages:
  - 3
- path: lectures/Module6_7_Example_HeatExchangers_annotated.pdf
  pages:
  - 2
  - 4
- path: lectures/Module8_5_RankineCycle_annotated.pdf
  pages:
  - 5
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
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
  - 8
  - 10
  - 13
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Single-stream heat exchanger energy balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{m}(h_2 - h_1) = \dot{Q}
$$

For one stream in a steady-flow heat exchanger with no work and negligible kinetic and potential energy changes, the enthalpy change is due only to heat transfer. Use this separately for each stream to relate the heat-transfer rate to that stream's enthalpy change. The sign of $\dot{Q}$ depends on whether the stream absorbs or rejects heat. In a two-stream heat exchanger, the heat-transfer rates for the two streams are opposite in sign when the exchanger is adiabatic to the surroundings.

**Also written in the lectures as:**

- ${}_i\dot{Q}_f=\dot{m}(h_f-h_i)$
- $\dot{m}_{ST}=\frac{\dot{Q}_{in,ST}}{h_3-h_2}$

**Taught in:** M6.6 (`topic:m6-06-heat-exchangers`), M6.7 (`topic:m6-07-example-heat-exchangers`), M8.5 (`topic:m8-05-rankine-cycle`), M8.6 (`topic:m8-06-example-rankine-cycle`), M8.7 (`topic:m8-07-vapor-compression`), M8.8 (`topic:m8-08-example-vapor-compression`), M8.9 (`topic:m8-09-brayton-cycle`), M8.12 (`topic:m8-12-example-gas-turbine-engines`)
