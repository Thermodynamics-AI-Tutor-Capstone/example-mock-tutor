---
id: eq:cop-definition
kind: equation
title: Coefficient of performance
description: Use this to define COP for either a heat pump or a refrigerator before choosing the numerator.
parent: topic:m8-03-heat-pump-refrigerator
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \beta=\frac{\text{desired energy}}{\text{input energy}}
plain_statement: COP is the desired energy transfer divided by the input energy.
symbols:
- \beta
valid_when: []
invalid_when: []
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
sources:
- path: lectures/Module8_3_HeatPumpRefrigerator_annotated.pdf
  pages:
  - 2
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Coefficient of performance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\beta=\frac{\text{desired energy}}{\text{input energy}}
$$

The coefficient of performance measures the ratio of the desired energy output to the energy input. For a heat pump, the desired output is Q_H, the heat delivered to the warm space. For a refrigerator, the desired output is Q_L, the heat removed from the cold space. The input is the work or electrical energy required. This definition is intentionally general; do not confuse COP with efficiency, because COP can be greater than 1. The course notation uses \beta for COP. Choose the numerator based on the device you are analyzing.

**Taught in:** M8.3 (`topic:m8-03-heat-pump-refrigerator`)
