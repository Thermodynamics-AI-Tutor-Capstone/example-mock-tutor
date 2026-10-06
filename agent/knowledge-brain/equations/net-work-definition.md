---
id: eq:net-work-definition
kind: equation
title: Net work definition
description: Use this sign convention when a cycle has identified work output and work input terms.
parent: topic:m8-01-heat-engine-cycle-analysis
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: W_{net}=W_{out}-W_{in}
plain_statement: Net work delivered by a cycle equals work output minus work input.
symbols:
- W
valid_when: []
invalid_when: []
misconceptions:
- misc:m11-state-function-vs-path-function
sources:
- path: lectures/Module8_1_HeatEngineCycleAnalysis_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Net work definition

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
W_{net}=W_{out}-W_{in}
$$

This defines net work for a thermodynamic cycle. For a heat engine, expansion work is usually the output and compression work is the input, so W_out is larger than W_in and W_net is positive. For refrigerators and heat pumps, the net work is an input, and the same expression is negative unless you assign signs consistently. The important point is that W_net is the net cyclic work, not the work from one process. Students sometimes combine all work terms with the wrong signs or confuse process work with cycle net work. Use this before applying efficiency, COP, or energy-balance relations.

**Taught in:** M8.1 (`topic:m8-01-heat-engine-cycle-analysis`)
