---
id: eq:thermal-efficiency
kind: equation
title: Thermal efficiency
description: Use for power cycles; identify only the positive heat transfer into the cycle as $Q_{in}$.
parent: topic:m7-03-heat-engines-thermal-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $\eta_{th} = \frac{W_{\mathrm{net}}}{Q_{\mathrm{in}}}$
plain_statement: Thermal efficiency equals net work divided by heat input.
symbols:
- \eta_{th}
valid_when:
- closed-system
invalid_when: []
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
sources:
- path: lectures/Module5_7_Example3_EnergyConservation_annotated.pptx
  slides:
  - 11
- path: lectures/Module7_3_HeatEnginesThermalEfficiency_annotated.pdf
  pages:
  - 5
- path: lectures/Module7_4_KelvinPlanck_annotated.pdf
  pages:
  - 5
- path: lectures/Module8_1_HeatEngineCycleAnalysis_annotated.pdf
  pages:
  - 2
  - 3
- path: lectures/Module8_2_Example_StirlingEngine_annotated.pdf
  pages:
  - 3
- path: lectures/Module8_5_RankineCycle_annotated.pdf
  pages:
  - 6
- path: lectures/Module8_6_Example_RankineCycle_annotated.pdf
  pages:
  - 6
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
  pages:
  - 2
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Thermal efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$\eta_{th} = \frac{W_{\mathrm{net}}}{Q_{\mathrm{in}}}$
$$

Thermal efficiency measures how much of the heat added to a cycle is converted to net work. The denominator is the heat transfer into the system, not the sum of all heat transfer magnitudes. For the cycle studied, ${}_1Q_2$ is the heat input and $W_{\mathrm{net}}$ is the sum of the process works.

**Also written in the lectures as:**

- $\eta_{th} = \frac{W_{\text{net}}}{Q_H} = \frac{Q_H - Q_L}{Q_H} = 1 - \frac{Q_L}{Q_H}$
- $\eta_{th}=\frac{W_{net}}{Q_{in}}$

**Taught in:** M5.7 (`topic:m5-07-example-3-energy-conservation`), M7.3 (`topic:m7-03-heat-engines-thermal-efficiency`), M7.4 (`topic:m7-04-kelvin-planck`), M8.1 (`topic:m8-01-heat-engine-cycle-analysis`), M8.2 (`topic:m8-02-example-stirling-engine`), M8.5 (`topic:m8-05-rankine-cycle`), M8.6 (`topic:m8-06-example-rankine-cycle`), M8.15 (`topic:m8-15-example-diesel-cycle`)
