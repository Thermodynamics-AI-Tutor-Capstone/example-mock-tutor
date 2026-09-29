---
id: eq:constant-pressure-heat-addition
kind: equation
title: Constant-pressure heat addition in a closed system
description: Use this for the constant-pressure heat-addition step of the Diesel cycle.
parent: topic:m8-15-example-diesel-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: '{}_iQ_f=M c_v(T_f-T_i)+{}_iW_f'
plain_statement: Heat added during a constant-pressure closed-system ideal-gas process equals the internal-energy
  change plus the boundary work.
symbols:
- M
- c_v
- T
valid_when:
- closed-system
- ideal-gas
- constant-specific-heats
- isobaric
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- open-system
- control-volume
- variable-specific-heats
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
  pages:
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Constant-pressure heat addition in a closed system

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
{}_iQ_f=M c_v(T_f-T_i)+{}_iW_f
$$

In a constant-pressure closed-system process, the first law becomes Q = \Delta U + W. For an ideal gas with constant c_v, \Delta U = M c_v \Delta T, and the boundary work is P \Delta V. If the gas also obeys the ideal-gas law, this heat transfer can be written as M c_p \Delta T, but the slide includes the explicit form with c_v plus boundary work. Use this when computing the heat added during the Diesel constant-pressure combustion process. Do not use a steady-flow heat exchanger relation here; the Diesel cylinder is a closed system.

**Taught in:** M8.15 (`topic:m8-15-example-diesel-cycle`)
