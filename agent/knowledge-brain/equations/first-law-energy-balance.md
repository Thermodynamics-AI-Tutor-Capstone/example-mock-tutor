---
id: eq:first-law-energy-balance
kind: equation
title: First law energy balance
description: Use to relate a closed system's energy change to heat and work transfers between states or
  over time.
parent: topic:m5-04-energy-conservation
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.7
latex: $$\Delta E = {}_1Q_2 - {}_1W_2, \qquad \frac{dE}{dt} = \dot{Q} - \dot{W}$$
plain_statement: The change in system energy equals net heat transfer in minus net work transfer out;
  the rate form replaces finite changes by rates.
symbols:
- E
- \dot{Q}
- \dot{W}
valid_when:
- closed-system
invalid_when:
- open-system
- control-volume
misconceptions:
- misc:m07-work-is-not-energy-transfer
- misc:m11-state-function-vs-path-function
sources:
- path: lectures/Module5_4_EnergyConservation_annotated.pdf
  pages:
  - 2
- path: lectures/Module5_6_Example2_EnergyConservation_annotated.pptx
  slides:
  - 4
- path: lectures/Module7_1_SecondLaw_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# First law energy balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\Delta E = {}_1Q_2 - {}_1W_2, \qquad \frac{dE}{dt} = \dot{Q} - \dot{W}$$
$$

This is the bookkeeping form of the first law. For a fixed mass, the total energy change equals the heat added across the boundary minus the work done by the system. The pre-subscript notation records the end states of the process, while the rate form replaces finite transfers with heat-transfer and power rates. It is the starting point for closed-system analysis; do not use the finite form when mass crosses the boundary unless mass-transport terms are added. The sign convention matters: heat into the system is positive, work out of the system is positive. Mixing these signs flips the direction of computed heat or work.

**Also written in the lectures as:**

- $dE_{sys} = \delta Q_{in,net} - \delta W_{out,net}$
- $\Delta E = \Delta KE + \Delta PE + \Delta U = {}_1Q_2 - {}_1W_2$

**Taught in:** M5.4 (`topic:m5-04-energy-conservation`), M5.6 (`topic:m5-06-example-2-energy-conservation`), M7.1 (`topic:m7-01-second-law`)
