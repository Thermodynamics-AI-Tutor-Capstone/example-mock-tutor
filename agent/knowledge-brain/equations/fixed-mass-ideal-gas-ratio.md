---
id: eq:fixed-mass-ideal-gas-ratio
kind: equation
title: Fixed-mass ideal-gas process relation
description: Use for a closed ideal-gas system when one of the six end-state values is unknown.
parent: topic:m3-02-example-1-ideal-gas-p-v-t
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: \frac{P_1\mathcal{V}_1}{T_1} = \frac{P_2\mathcal{V}_2}{T_2}
plain_statement: For a fixed mass and fixed gas constant, P V divided by T is equal at states 1 and 2.
symbols:
- P
- \mathcal{V}
- T
valid_when:
- ideal-gas
- closed-system
invalid_when:
- open-system
- control-volume
misconceptions: []
sources:
- path: lectures/Module3_2_Example1_IdealGasPvT_annotated.pdf
  pages:
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Fixed-mass ideal-gas process relation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\frac{P_1\mathcal{V}_1}{T_1} = \frac{P_2\mathcal{V}_2}{T_2}
$$

Start from P V = M R T. For a closed system with fixed mass and fixed gas identity, M and R do not change, so P V / T is constant between states 1 and 2. Use this to find a missing pressure, volume, or temperature when no mass crosses the boundary. If the system is a control volume or mass changes, this ratio is invalid because M is not constant.

**Taught in:** M3.2 (`topic:m3-02-example-1-ideal-gas-p-v-t`)
