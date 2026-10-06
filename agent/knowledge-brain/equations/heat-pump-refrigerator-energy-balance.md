---
id: eq:heat-pump-refrigerator-energy-balance
kind: equation
title: Heat-pump/refrigerator energy balance
description: Use this overall first-law balance for heat-pump or refrigerator cycles.
parent: topic:m8-03-heat-pump-refrigerator
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: Q_H=W_{in}+Q_L
plain_statement: The heat delivered at the high temperature equals the work input plus the heat removed
  from the low temperature.
symbols:
- Q_H
- W
- Q_L
valid_when: []
invalid_when: []
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
sources:
- path: lectures/Module8_3_HeatPumpRefrigerator_annotated.pdf
  pages:
  - 2
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Heat-pump/refrigerator energy balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
Q_H=W_{in}+Q_L
$$

This is the cycle-level energy balance for a heat pump or refrigerator. The heat rejected to the hot side Q_H equals the sum of the work input W_in and the heat extracted from the cold side Q_L. This follows from the first law because the system returns to the same state each cycle. Students sometimes write Q_H = Q_L without the work term, or they confuse which Q is the desired output. For a heat pump the desired output is Q_H; for a refrigerator the desired output is Q_L. Use this balance to relate the three energy quantities before computing COP.

**Also written in the lectures as:**

- $\dot{Q}_H=\mathcal{P}+\dot{Q}_L$

**Taught in:** M8.3 (`topic:m8-03-heat-pump-refrigerator`)
