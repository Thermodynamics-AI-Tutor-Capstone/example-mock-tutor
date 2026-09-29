---
id: eq:ideal-gas-entropy-change-tv
kind: equation
title: Ideal-gas entropy change, constant c_v
description: Use for ideal-gas calculations when c_v is constant and the specific volume ratio is known.
parent: topic:m7-10-gibbs-equations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\Delta s = c_v \ln\left(\frac{T_2}{T_1}\right) + R \ln\left(\frac{v_2}{v_1}\right)$$
plain_statement: Integrated entropy change for an ideal gas with constant specific heat, using temperature
  and specific-volume endpoints.
symbols:
- s
- c_v
- T
- R
- v
valid_when:
- ideal-gas
- constant-specific-heats
invalid_when:
- variable-specific-heats
- incompressible
misconceptions: []
sources:
- path: lectures/Module7_10_GibbsEOS_annotated.pdf
  pages:
  - 4
- path: lectures/Module7_11_Example_GibbsEOS_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal-gas entropy change, constant c_v

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\Delta s = c_v \ln\left(\frac{T_2}{T_1}\right) + R \ln\left(\frac{v_2}{v_1}\right)$$
$$

This finite form assumes constant c_v over the temperature interval. If c_v varies significantly, use an average value or ideal-gas tables. The two logarithmic terms are independent: at constant temperature, increasing volume raises entropy; at constant volume, heating raises entropy. Use this equation for closed or flowing ideal-gas systems when v2/v1 and temperatures are known. If v2/v1=1, only the temperature term remains. Do not use for water or other two-phase/incompressible substances.

**Taught in:** M7.10 (`topic:m7-10-gibbs-equations`), M7.11 (`topic:m7-11-example-gibbs-equations`)
