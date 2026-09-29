---
id: eq:ideal-gas-entropy-differential-tv
kind: equation
title: Ideal-gas entropy differential, T-v form
description: Use as the starting point for ideal-gas entropy changes when volume or density data are available.
parent: topic:m7-10-gibbs-equations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$ds = c_v \frac{dT}{T} + R \frac{dv}{v}$$
plain_statement: For an ideal gas, the entropy differential splits into a temperature term with c_v and
  a volume term with R.
symbols:
- s
- c_v
- T
- R
- v
valid_when:
- ideal-gas
invalid_when:
- incompressible
misconceptions: []
sources:
- path: lectures/Module7_10_GibbsEOS_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal-gas entropy differential, T-v form

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$ds = c_v \frac{dT}{T} + R \frac{dv}{v}$$
$$

Start from du=c_v dT and the ideal-gas law to convert the Gibbs relation into this form. The entropy differential is a state function, so integration between two states depends only on the endpoints, not the path. For variable c_v, this differential still holds if c_v is a function of temperature. For constant c_v, integrate to get the logarithmic T-v equation. Do not use it for liquids or two-phase mixtures. A common error is dropping the volume term or using c_p instead of c_v in the T-v expression.

**Taught in:** M7.10 (`topic:m7-10-gibbs-equations`)
