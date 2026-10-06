---
id: eq:refrigerator-cop
kind: equation
title: Refrigerator COP
description: Use this when the desired output is the heat removed from the cold space.
parent: topic:m8-03-heat-pump-refrigerator
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \beta_{\text{frig}}=\frac{Q_L}{W_{in}}
plain_statement: The refrigerator COP is the low-temperature heat removal divided by the work input.
symbols:
- \beta
- Q_L
- W
valid_when: []
invalid_when: []
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
sources:
- path: lectures/Module8_3_HeatPumpRefrigerator_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Refrigerator COP

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\beta_{\text{frig}}=\frac{Q_L}{W_{in}}
$$

For a refrigerator or air conditioner, the desired energy output is Q_L, the heat removed from the refrigerated space. The required input is the work W_in. The refrigerator COP is therefore Q_L divided by W_in. This COP can be greater than 1 when the heat removed is larger than the work input. Students sometimes use the heat-pump numerator Q_H instead, so the COP value changes. Also, the Carnot refrigerator COP uses absolute temperatures. Use this definition before applying the solid-property or reversible limits.

**Taught in:** M8.3 (`topic:m8-03-heat-pump-refrigerator`)
