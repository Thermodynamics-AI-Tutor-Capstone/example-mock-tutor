---
id: eq:net-cycle-work
kind: equation
title: Net cycle work
description: Use for a thermodynamic cycle; positive net work indicates a power cycle.
parent: topic:m5-03-example-work
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.7
latex: $W_{\mathrm{net}} = {}_1W_2 + {}_2W_3 + {}_3W_1$
plain_statement: Net cycle work is the sum of the process works around the closed loop.
symbols: []
valid_when:
- closed-system
invalid_when:
- open-system
- control-volume
misconceptions: []
sources:
- path: lectures/Module5_3_Example_Work_annotated.pdf
  pages:
  - 5
- path: lectures/Module5_7_Example3_EnergyConservation_annotated.pptx
  slides:
  - 11
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Net cycle work

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$W_{\mathrm{net}} = {}_1W_2 + {}_2W_3 + {}_3W_1$
$$

Around a cycle, the net work is the algebraic sum of the work transfers for each process. For a four-process cycle with two isochoric processes, the constant-volume work terms are zero, and the expression reduces to the two moving-boundary works. The sign of the sum determines whether the cycle produces net work.

**Taught in:** M5.3 (`topic:m5-03-example-work`), M5.7 (`topic:m5-07-example-3-energy-conservation`)
