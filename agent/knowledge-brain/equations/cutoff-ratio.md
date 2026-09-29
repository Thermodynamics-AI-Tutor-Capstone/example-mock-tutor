---
id: eq:cutoff-ratio
kind: equation
title: Cutoff ratio
description: Use this in Diesel-cycle analysis to account for the constant-pressure combustion duration.
parent: topic:m8-14-diesel-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \alpha=\frac{v_3}{v_2}
plain_statement: The cutoff ratio is the specific volume after isobaric heat addition divided by the specific
  volume before isobaric heat addition.
symbols:
- v
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module8_14_DieselCycle_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Cutoff ratio

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\alpha=\frac{v_3}{v_2}
$$

The cutoff ratio is a Diesel-cycle parameter. It is the volume after the constant-pressure heat-addition stroke divided by the volume before it. Larger cutoff ratio means more fuel is admitted during combustion, and the cycle behaves differently from an Otto cycle. The ideal Diesel efficiency formula uses both the compression ratio and the cutoff ratio. Students sometimes set the cutoff ratio equal to 1, which simplifies the Diesel efficiency to the Otto efficiency. Use this definition when states 2 and 3 are labeled at the start and end of the constant-pressure heat addition.

**Taught in:** M8.14 (`topic:m8-14-diesel-cycle`)
