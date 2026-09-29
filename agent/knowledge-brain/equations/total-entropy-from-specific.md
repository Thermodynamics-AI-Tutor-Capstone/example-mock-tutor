---
id: eq:total-entropy-from-specific
kind: equation
title: Total entropy change from specific entropy
description: Use to convert between specific property changes and extensive entropy changes for a closed
  system.
parent: topic:m7-11-example-gibbs-equations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\Delta S = M \Delta s$$
plain_statement: Total entropy change of a fixed mass equals mass times specific entropy change.
symbols:
- S
- M
- s
valid_when:
- closed-system
invalid_when:
- open-system
- control-volume
misconceptions: []
sources:
- path: lectures/Module7_11_Example_GibbsEOS_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Total entropy change from specific entropy

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\Delta S = M \Delta s$$
$$

This is mass scaling for a fixed mass. After computing the specific entropy change from tables or ideal-gas relations, multiply by M to get the extensive entropy change. In control-volume analysis with inflows and outflows, this simple relation does not hold. Use it when combining entropy changes for system plus surroundings or when the total mass is known. Students sometimes use volume instead of mass or forget to convert specific entropy to total entropy before taking differences.

**Taught in:** M7.11 (`topic:m7-11-example-gibbs-equations`)
