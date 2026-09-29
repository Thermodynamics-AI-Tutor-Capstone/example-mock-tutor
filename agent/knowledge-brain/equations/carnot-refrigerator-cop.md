---
id: eq:carnot-refrigerator-cop
kind: equation
title: Carnot refrigerator COP
description: Use this to find the maximum possible refrigerator COP between two reservoirs.
parent: topic:m8-03-heat-pump-refrigerator
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \beta_{\text{Carnot, frig}}=\frac{T_L}{T_H-T_L}
plain_statement: The reversible refrigerator COP is the cold reservoir absolute temperature divided by
  the difference between hot and cold reservoir absolute temperatures.
symbols:
- \beta
- T_H
- T_L
valid_when:
- reversible
invalid_when:
- irreversible
misconceptions:
- misc:m02-entropy-and-the-second-law
sources:
- path: lectures/Module8_3_HeatPumpRefrigerator_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Carnot refrigerator COP

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\beta_{\text{Carnot, frig}}=\frac{T_L}{T_H-T_L}
$$

This is the Carnot COP for a reversible refrigerator operating between reservoirs at absolute temperatures T_H and T_L. It gives the upper limit for a real refrigerator between the same reservoirs. The numerator is the low temperature, reflecting that the desired effect is heat removal from the cold space. A small temperature lift gives a large COP. Students sometimes use the heat-pump Carnot formula instead, which has T_H in the numerator, or they use Celsius temperatures. Use absolute temperatures and this formula to bound or check a refrigerator COP.

**Taught in:** M8.3 (`topic:m8-03-heat-pump-refrigerator`)
