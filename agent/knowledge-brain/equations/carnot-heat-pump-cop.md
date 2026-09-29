---
id: eq:carnot-heat-pump-cop
kind: equation
title: Carnot heat-pump COP
description: Use this to find the maximum possible heat-pump COP between two reservoirs.
parent: topic:m8-03-heat-pump-refrigerator
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \beta_{\text{Carnot, heat pump}}=\frac{T_H}{T_H-T_L}
plain_statement: The reversible heat-pump COP is the hot reservoir absolute temperature divided by the
  difference between hot and cold reservoir absolute temperatures.
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
  - 2
- path: lectures/Module8_4_Example_HeatPumpRefrigerator_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Carnot heat-pump COP

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\beta_{\text{Carnot, heat pump}}=\frac{T_H}{T_H-T_L}
$$

This is the Carnot COP for a reversible heat pump operating between reservoirs at absolute temperatures T_H and T_L. It is the upper limit for a real heat pump between the same reservoirs. The denominator is the temperature lift, so the COP gets larger when the indoor and outdoor temperatures are close. Students often use Celsius temperatures, which is incorrect; use kelvin or rankine. They also sometimes confuse this with the Carnot refrigerator COP, which uses T_L in the numerator. Use this formula to set a maximum and to check whether a claimed COP is physically reasonable.

**Taught in:** M8.3 (`topic:m8-03-heat-pump-refrigerator`), M8.4 (`topic:m8-04-example-heat-pump-refrigerator`)
