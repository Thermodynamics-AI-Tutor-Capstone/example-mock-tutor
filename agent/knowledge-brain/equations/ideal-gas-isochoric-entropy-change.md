---
id: eq:ideal-gas-isochoric-entropy-change
kind: equation
title: Isochoric ideal-gas entropy change
description: Use when volume is constant and the gas is ideal with constant specific heat.
parent: topic:m7-11-example-gibbs-equations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\Delta s = c_v \ln\left(\frac{T_2}{T_1}\right)$$
plain_statement: For constant-volume ideal-gas processes, only the temperature term contributes.
symbols:
- s
- c_v
- T
valid_when:
- ideal-gas
- constant-specific-heats
- isochoric
invalid_when:
- incompressible
- variable-specific-heats
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

# Isochoric ideal-gas entropy change

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\Delta s = c_v \ln\left(\frac{T_2}{T_1}\right)$$
$$

This is a special case of the ideal-gas T-v entropy-change equation. When v2=v1, ln(v2/v1)=0, so the only contribution is from the temperature change. For heating at constant volume, entropy increases. Use it for ideal-gas constant-volume processes, such as a rigid tank, when c_v is constant. Do not use c_p for constant-volume heating; c_v is correct. Do not use for liquids or when specific heat varies significantly. It is often used with the first law to track entropy in rigid tanks.

**Taught in:** M7.11 (`topic:m7-11-example-gibbs-equations`)
