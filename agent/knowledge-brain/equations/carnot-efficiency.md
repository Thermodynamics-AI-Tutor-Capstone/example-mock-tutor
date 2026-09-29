---
id: eq:carnot-efficiency
kind: equation
title: Carnot (reversible) efficiency limit
description: Use this upper bound for any heat engine operating between the same two thermal reservoirs.
parent: topic:m7-04-kelvin-planck
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\eta_{th,rev} = \eta_{th,max} = 1 - \frac{T_L}{T_H}$$
plain_statement: The maximum thermal efficiency of a reversible cycle is determined only by the absolute
  hot and cold reservoir temperatures.
symbols:
- \eta_{th,rev}
- \eta_{th}
- T_H
- T_L
valid_when:
- reversible
invalid_when:
- irreversible
misconceptions:
- misc:m02-entropy-and-the-second-law
- misc:m09-friction-is-the-only-efficiency-limit
sources:
- path: lectures/Module7_4_KelvinPlanck_annotated.pdf
  pages:
  - 5
- path: lectures/Module7_5_CarnotEffiency_annotated.pdf
  pages:
  - 2
  - 3
- path: lectures/Module7_8_Example_Entropy_annotated.pdf
  pages:
  - 2
  - 3
- path: lectures/Module8_1_HeatEngineCycleAnalysis_annotated.pdf
  pages:
  - 2
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Carnot (reversible) efficiency limit

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\eta_{th,rev} = \eta_{th,max} = 1 - \frac{T_L}{T_H}$$
$$

This is the Carnot efficiency. It is the upper bound for any heat engine operating between two thermal reservoirs at absolute temperatures T_H and T_L. Real irreversible engines fall below this limit. Temperatures must be absolute; using Celsius or Fahrenheit can produce negative or badly wrong efficiencies. The limit exists even for a frictionless reversible engine because heat must be rejected to the low-temperature reservoir; friction is not the only reason real engines are less efficient. Use this expression only when the cycle is reversible.

**Also written in the lectures as:**

- $\eta_{carnot}=1-\frac{T_L}{T_H}$

**Taught in:** M7.4 (`topic:m7-04-kelvin-planck`), M7.5 (`topic:m7-05-carnot-efficiency`), M7.8 (`topic:m7-08-example-entropy`), M8.1 (`topic:m8-01-heat-engine-cycle-analysis`)
