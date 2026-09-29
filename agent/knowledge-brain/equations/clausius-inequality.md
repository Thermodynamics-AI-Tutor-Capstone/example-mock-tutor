---
id: eq:clausius-inequality
kind: equation
title: Clausius inequality
description: Use to distinguish reversible from irreversible cycles and to prove entropy increase.
parent: topic:m7-07-entropy
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\oint_{\text{cycle}} \frac{\delta Q}{T} \le 0$$
plain_statement: The cyclic integral of delta Q over T is zero for reversible cycles and negative for
  irreversible cycles.
symbols:
- Q
- T
valid_when: []
invalid_when: []
misconceptions:
- misc:m02-entropy-and-the-second-law
sources:
- path: lectures/Module7_7_Entropy_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Clausius inequality

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\oint_{\text{cycle}} \frac{\delta Q}{T} \le 0$$
$$

This inequality is the second-law statement for cycles. Equality holds for reversible cycles; irreversibility makes the cyclic integral negative. Here T is the boundary temperature at each heat-transfer location. In a reversible cycle, the heat-temperature ratios sum to zero, which leads to the Carnot efficiency and the thermodynamic temperature scale. In a real irreversible cycle, the negative integral indicates entropy generation. Do not reverse the inequality or apply it to a single non-cyclic process as a conservation law; only the cyclic integral has this sign constraint.

**Taught in:** M7.7 (`topic:m7-07-entropy`)
