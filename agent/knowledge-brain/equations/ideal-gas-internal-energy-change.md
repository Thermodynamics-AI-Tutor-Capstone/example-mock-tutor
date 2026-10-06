---
id: eq:ideal-gas-internal-energy-change
kind: equation
title: Ideal-gas internal energy change
description: Use for an ideal gas with constant specific heats to evaluate $\Delta U$.
parent: topic:m7-02-first-statement-second-law
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $\Delta U = M c_v \Delta T$
plain_statement: For an ideal gas with constant specific heat, internal energy change is mass times $c_v$
  times temperature change.
symbols:
- U
- M
- c_v
- T
valid_when:
- closed-system
- ideal-gas
- constant-specific-heats
invalid_when:
- variable-specific-heats
- open-system
- control-volume
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module5_7_Example3_EnergyConservation_annotated.pptx
  slides:
  - 6
  - 7
- path: lectures/Module7_2_FirstStatementSecondLaw_annotated.pdf
  pages:
  - 6
- path: lectures/Module8_2_Example_StirlingEngine_annotated.pdf
  pages:
  - 4
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
  pages:
  - 2
  - 5
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal-gas internal energy change

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$\Delta U = M c_v \Delta T$
$$

For an ideal gas, internal energy depends only on temperature. If $c_v$ is constant over the temperature range, the change in internal energy is simply $M c_v \Delta T$. The temperature change can be in K or °C because it is a difference; the absolute scale is not required for $\Delta T$.

**Also written in the lectures as:**

- $\Delta u = c_v \Delta T$

**Taught in:** M5.7 (`topic:m5-07-example-3-energy-conservation`), M7.2 (`topic:m7-02-first-statement-second-law`), M8.2 (`topic:m8-02-example-stirling-engine`), M8.15 (`topic:m8-15-example-diesel-cycle`)
