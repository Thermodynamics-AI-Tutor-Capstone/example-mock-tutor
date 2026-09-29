---
id: eq:heat-engine-energy-balance
kind: equation
title: Heat-engine energy balance
description: Use this as the overall first-law balance for a heat engine.
parent: topic:m7-03-heat-engines-thermal-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: Q_H=W_{net}+Q_L
plain_statement: For a heat-engine cycle, the heat added from the high-temperature reservoir equals the
  net work produced plus the heat rejected to the low-temperature reservoir.
symbols:
- Q_H
- W
- Q_L
valid_when: []
invalid_when: []
misconceptions:
- misc:m01-heat-energy-temperature-conflated
sources:
- path: lectures/Module7_3_HeatEnginesThermalEfficiency_annotated.pdf
  pages:
  - 3
- path: lectures/Module7_8_Example_Entropy_annotated.pdf
  pages:
  - 2
  - 3
- path: lectures/Module8_1_HeatEngineCycleAnalysis_annotated.pdf
  pages:
  - 2
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Heat-engine energy balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
Q_H=W_{net}+Q_L
$$

This is the cycle-level energy balance for a heat engine. It states that some of the high-temperature heat input Q_H is converted to useful net work W_net, and the remainder Q_L is rejected to the cold reservoir. The equation assumes steady cyclic operation, so the system returns to the same state each cycle. A common mistake is to set Q_H equal only to W_net and ignore the required heat rejection. Another mistake is using Celsius temperatures instead of absolute temperatures when later applying the Carnot limit. Use this balance to find one quantity when the other two are known.

**Also written in the lectures as:**

- $Q_{\text{in}} = W_{\text{net}} + Q_{\text{out}}$
- $\dot{Q}_L=\dot{Q}_H-\dot{W}_{net}$

**Taught in:** M7.3 (`topic:m7-03-heat-engines-thermal-efficiency`), M7.8 (`topic:m7-08-example-entropy`), M8.1 (`topic:m8-01-heat-engine-cycle-analysis`)
