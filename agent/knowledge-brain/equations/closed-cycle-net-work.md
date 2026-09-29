---
id: eq:closed-cycle-net-work
kind: equation
title: Closed-cycle net work
description: Use this when summing process work terms around a closed four-process cycle.
parent: topic:m8-15-example-diesel-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: W_{net}={}_1W_2+{}_2W_3+{}_3W_4+{}_4W_1
plain_statement: The net work output of a closed cycle is the sum of the work transfers for the four processes.
symbols:
- W
valid_when:
- closed-system
invalid_when:
- open-system
- control-volume
misconceptions:
- misc:m07-work-is-not-energy-transfer
sources:
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Closed-cycle net work

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
W_{net}={}_1W_2+{}_2W_3+{}_3W_4+{}_4W_1
$$

This defines the net work for a closed cycle as the algebraic sum of the work interactions in each process. The signs are determined by the process direction: expansion work is positive, compression work is negative. In cycles like Otto and Diesel, some of the process work terms may be zero or negligible. Students sometimes add only the expansion work and ignore the compression work, which overstates net work. Use this sum before dividing by heat input to find the thermal efficiency. The notation with pre-subscripts such as {}_1W_2 keeps process endpoints clear.

**Taught in:** M8.15 (`topic:m8-15-example-diesel-cycle`)
