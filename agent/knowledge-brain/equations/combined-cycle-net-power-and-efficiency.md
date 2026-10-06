---
id: eq:combined-cycle-net-power-and-efficiency
kind: equation
title: Combined-cycle net power and efficiency
description: Use this to evaluate a combined gas-turbine/steam power plant.
parent: topic:m8-12-example-gas-turbine-engines
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \dot{W}_{cc}=\dot{W}_{GT}+\dot{W}_{ST},\quad \eta_{cc}=\frac{\dot{W}_{cc}}{\dot{Q}_{in}}
plain_statement: Combined-cycle net power is the sum of gas-turbine and steam-cycle net powers; combined-cycle
  efficiency is that total power divided by the gas-turbine heat addition rate.
symbols:
- \dot{W}
- \eta_{th}
- \dot{Q}
valid_when:
- steady-state
- steady-flow
invalid_when:
- transient
misconceptions: []
sources:
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
  - 7
  - 8
  - 14
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Combined-cycle net power and efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{W}_{cc}=\dot{W}_{GT}+\dot{W}_{ST},\quad \eta_{cc}=\frac{\dot{W}_{cc}}{\dot{Q}_{in}}
$$

In a combined cycle, the net power is the sum of the gas-turbine net power and the steam-cycle net power. The efficiency is based on the total net power divided by the heat addition rate to the gas turbine, because the steam cycle receives its heat from the gas-turbine exhaust rather than a separate external source. This is why combined-cycle efficiencies are higher than either cycle alone. Students sometimes count the HRSG heat input twice or include the steam-cycle heat rejection in Q_in. Use only the external heat addition to the first cycle in the denominator.

**Taught in:** M8.12 (`topic:m8-12-example-gas-turbine-engines`)
