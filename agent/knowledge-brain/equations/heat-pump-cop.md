---
id: eq:heat-pump-cop
kind: equation
title: Heat-pump COP
description: Use this when the desired output is the heat supplied to the warm space.
parent: topic:m8-03-heat-pump-refrigerator
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \beta_{\text{heat pump}}=\frac{Q_H}{W_{in}}
plain_statement: The heat-pump COP is the high-temperature heat transfer divided by the work input.
symbols:
- \beta
- Q_H
- W
valid_when: []
invalid_when: []
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
sources:
- path: lectures/Module8_3_HeatPumpRefrigerator_annotated.pdf
  pages:
  - 2
- path: lectures/Module8_4_Example_HeatPumpRefrigerator_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Heat-pump COP

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\beta_{\text{heat pump}}=\frac{Q_H}{W_{in}}
$$

For a heat pump, the desired energy output is Q_H, the heat delivered to the heated space. The required input is the work W_in. The COP is therefore Q_H divided by W_in. Since Q_H is larger than W_in by the amount Q_L, the heat-pump COP is always greater than 1. Students sometimes use Q_L in the numerator, which is the refrigerator COP, or they use total heat rejection instead of desirable output. Use the correct numerator based on the application and remember that the course calls this \beta.

**Taught in:** M8.3 (`topic:m8-03-heat-pump-refrigerator`), M8.4 (`topic:m8-04-example-heat-pump-refrigerator`)
