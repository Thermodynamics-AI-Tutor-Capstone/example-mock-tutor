---
id: eq:minimum-heat-pump-input-power
kind: equation
title: Minimum heat-pump input power
description: Use this when calculating the least power needed for a reversible heat pump at a specified
  heating rate.
parent: topic:m8-04-example-heat-pump-refrigerator
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \dot{W}=\frac{\dot{Q}_H}{\beta_{\max}}
plain_statement: For a given hot-side heat-transfer rate, the minimum power is the heat rate divided by
  the maximum COP.
symbols:
- \dot{W}
- \dot{Q}
- \beta
valid_when: []
invalid_when: []
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
sources:
- path: lectures/Module8_4_Example_HeatPumpRefrigerator_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Minimum heat-pump input power

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{W}=\frac{\dot{Q}_H}{\beta_{\max}}
$$

This equation follows from the heat-pump COP definition when the COP is set to its maximum possible value, usually the Carnot COP. For a fixed required hot-side heat rate \dot{Q}_H, the smallest input power is obtained with the largest possible COP. Real devices require more power because their COP is lower than the Carnot bound. Students sometimes use this with a real COP while asking for the minimum power, or they invert the ratio by writing \dot{Q}_H / \dot{W} incorrectly. Use this only when the maximum COP is specified or is being computed from reservoir temperatures.

**Taught in:** M8.4 (`topic:m8-04-example-heat-pump-refrigerator`)
