---
id: eq:leaky-pipe-mass-balance
kind: equation
title: Leaky-pipe mass balance
description: Control-volume mass rate balance including an unintended leak; use it when an open system
  has a leak besides the normal inlet and outlet.
parent: topic:m1-05-conservation-principles
unit: unit:m1-introduction-and-conservation
status: auto
audience: both
priority: 0.7
latex: \frac{dm_{cv}}{dt} = \dot{m}_{in} - \dot{m}_{out} - \dot{m}_{leak}
plain_statement: Control-volume mass rate of change equals mass flow in minus mass flow out minus leak
  flow out.
symbols:
- \dot{m}
valid_when:
- control-volume
- open-system
invalid_when:
- closed-system
misconceptions: []
sources:
- path: lectures/Module1_5_ConservationPrinciples_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Leaky-pipe mass balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\frac{dm_{cv}}{dt} = \dot{m}_{in} - \dot{m}_{out} - \dot{m}_{leak}
$$

Leaky-pipe mass balance: $\frac{dm_{cv}}{dt}=\dot{m}_{in}-\dot{m}_{out}-\dot{m}_{leak}$ (M1.5 page 5). This is a control-volume mass rate balance with an additional leak stream. Use it when a control volume or open system has an unintended mass leak in addition to the normal inlet and outlet. For a well-sealed control volume, set $\dot{m}_{leak}=0$. Do not use this balance if the system mass is fixed; in that case use $M_{\mathrm{sys}}=\text{const}$.

**Taught in:** M1.5 (`topic:m1-05-conservation-principles`)
