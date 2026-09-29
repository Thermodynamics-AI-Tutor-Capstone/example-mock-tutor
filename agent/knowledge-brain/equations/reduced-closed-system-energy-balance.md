---
id: eq:reduced-closed-system-energy-balance
kind: equation
title: Reduced closed-system energy balance
description: Use for piston-cylinder and rigid-tank problems where KE and PE changes are negligible.
parent: topic:m8-13-otto-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: $\Delta U = {}_1Q_2 - {}_1W_2$
plain_statement: For a closed system with negligible kinetic and potential energy changes, internal energy
  change equals heat transfer minus work transfer.
symbols:
- U
valid_when:
- closed-system
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- open-system
- control-volume
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
sources:
- path: lectures/Module5_5_Example1_EnergyConservation_annotated.pdf
  pages:
  - 2
  - 4
- path: lectures/Module5_7_Example3_EnergyConservation_annotated.pptx
  slides:
  - 5
  - 6
- path: lectures/Module8_2_Example_StirlingEngine_annotated.pdf
  pages:
  - 4
- path: lectures/Module8_13_OttoCycle_annotated.pdf
  pages:
  - 4
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Reduced closed-system energy balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$\Delta U = {}_1Q_2 - {}_1W_2$
$$

When the system does not move or change elevation significantly, the $\Delta KE$ and $\Delta PE$ terms vanish, leaving only internal energy. This is the usual starting equation for many closed-system problems. If there is also no work, such as in a rigid tank, it further reduces to $\Delta U = {}_1Q_2$.

**Also written in the lectures as:**

- $\Delta U=Q-W$

**Taught in:** M5.5 (`topic:m5-05-example-1-energy-conservation`), M5.7 (`topic:m5-07-example-3-energy-conservation`), M8.2 (`topic:m8-02-example-stirling-engine`), M8.13 (`topic:m8-13-otto-cycle`), M8.15 (`topic:m8-15-example-diesel-cycle`)
