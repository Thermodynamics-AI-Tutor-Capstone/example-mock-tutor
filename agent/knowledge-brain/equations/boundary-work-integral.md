---
id: eq:boundary-work-integral
kind: equation
title: Boundary work integral
description: Use for a quasi-equilibrium closed-system process; evaluate the area under the process curve
  on a P-$\mathcal{V}$ diagram.
parent: topic:m5-02-heat-work
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.7
latex: ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V}$
plain_statement: Total boundary work is the integral of pressure with respect to total volume along the
  process path.
symbols:
- P
- \mathcal{V}
valid_when:
- closed-system
- quasi-equilibrium
invalid_when:
- open-system
- control-volume
misconceptions:
- misc:m12-boundary-flow-and-shaft-work-confused
- misc:m13-work-read-off-a-pv-diagram
sources:
- path: lectures/Module5_2_HeatWork_annotated.pdf
  pages:
  - 7
- path: lectures/Module5_4_EnergyConservation_annotated.pdf
  pages:
  - 3
- path: lectures/Module5_5_Example1_EnergyConservation_annotated.pdf
  pages:
  - 4
- path: lectures/Module5_7_Example3_EnergyConservation_annotated.pptx
  slides:
  - 5
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Boundary work integral

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V}$
$$

This is the finite-process form of moving-boundary work. It is valid only when the process is quasi-equilibrium so the pressure at the boundary is well defined. Work is path dependent: the value is the area under the process path on a $P$-$\mathcal{V}$ diagram, not just a function of the end states. For special paths, such as constant pressure or isothermal ideal gas, the integral can be evaluated directly.

**Also written in the lectures as:**

- $\delta W = P\,d\mathcal{V}$
- $W=\int P\,d\mathcal{V}$

**Taught in:** M5.2 (`topic:m5-02-heat-work`), M5.4 (`topic:m5-04-energy-conservation`), M5.5 (`topic:m5-05-example-1-energy-conservation`), M5.7 (`topic:m5-07-example-3-energy-conservation`), M8.15 (`topic:m8-15-example-diesel-cycle`)
