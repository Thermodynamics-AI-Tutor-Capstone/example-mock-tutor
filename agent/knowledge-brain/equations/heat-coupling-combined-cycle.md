---
id: eq:heat-coupling-combined-cycle
kind: equation
title: Heat coupling between gas turbine and steam cycle
description: Use this when linking the gas-turbine exhaust heat to the steam cycle heat input in a combined
  cycle.
parent: topic:m8-12-example-gas-turbine-engines
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \dot{Q}_{out,GT}=-\dot{Q}_{in,ST}
plain_statement: The heat rejected by the gas turbine is the heat received by the steam cycle; signs follow
  the individual cycle sign conventions.
symbols:
- \dot{Q}
valid_when:
- steady-state
- steady-flow
- open-system
invalid_when:
- transient
misconceptions:
- misc:m01-heat-energy-temperature-conflated
sources:
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
  - 6
  - 8
  - 11
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Heat coupling between gas turbine and steam cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{Q}_{out,GT}=-\dot{Q}_{in,ST}
$$

In a combined power plant, the gas turbine rejects heat at a temperature high enough to make steam in the heat-recovery steam generator. If the gas-turbine heat rejection is written as a positive number out of the cycle, and the steam-cycle heat addition is written as positive into the cycle, then the two rates are equal in magnitude. If a common sign convention is used, one is the negative of the other. Students often miscopy the sign or forget that the HRSG is the connection between the two cycles. Use this only for steady-state, steady-flow analysis and keep the individual cycle sign conventions clear.

**Taught in:** M8.12 (`topic:m8-12-example-gas-turbine-engines`)
