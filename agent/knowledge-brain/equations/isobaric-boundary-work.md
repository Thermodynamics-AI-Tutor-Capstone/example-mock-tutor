---
id: eq:isobaric-boundary-work
kind: equation
title: Isobaric boundary work
description: Use when the pressure is held constant during a moving-boundary process.
parent: topic:m5-03-example-work
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.7
latex: ${}_1W_2 = P(\mathcal{V}_2-\mathcal{V}_1)$
plain_statement: For a constant-pressure quasi-equilibrium process, boundary work is pressure times the
  total volume change.
symbols:
- P
- \mathcal{V}
valid_when:
- closed-system
- quasi-equilibrium
- isobaric
invalid_when:
- isochoric
- open-system
- control-volume
misconceptions:
- misc:m13-work-read-off-a-pv-diagram
sources:
- path: lectures/Module5_3_Example_Work_annotated.pdf
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
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Isobaric boundary work

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
${}_1W_2 = P(\mathcal{V}_2-\mathcal{V}_1)$
$$

Because $P$ is constant, it comes out of the boundary-work integral. The work is then proportional to the volume change. This is a special case of the general boundary-work integral. It is not valid for a constant-volume process because $\mathcal{V}_2-\mathcal{V}_1=0$ gives zero boundary work.

**Also written in the lectures as:**

- ${}_iW_f=P(\mathcal{V}_f-\mathcal{V}_i)$

**Taught in:** M5.3 (`topic:m5-03-example-work`), M5.5 (`topic:m5-05-example-1-energy-conservation`), M5.7 (`topic:m5-07-example-3-energy-conservation`), M8.15 (`topic:m8-15-example-diesel-cycle`)
