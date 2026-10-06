---
id: eq:gas-specific-constant-from-universal
kind: equation
title: Gas-specific constant from universal gas constant
description: Use to obtain R for a particular gas when the universal gas constant and molar mass are known.
parent: topic:m3-01-ideal-gas-p-v-t
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: R = \frac{\bar{R}}{\mathcal{M}}
plain_statement: The mass-based gas constant is the universal gas constant divided by molar mass.
symbols:
- R
valid_when:
- pure-substance
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module3_1_IdealGasPvT_annotated.pdf
  pages:
  - 5
- path: lectures/Module3_3_Example2_IdealGasPvT_annotated.pdf
  pages:
  - 5
- path: lectures/Module3_7_GeneralizedCompressibility_annotated.pdf
  pages:
  - 3
- path: lectures/Module7_11_Example_GibbsEOS_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Gas-specific constant from universal gas constant

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
R = \frac{\bar{R}}{\mathcal{M}}
$$

The gas-specific constant R is the universal gas constant divided by the molar mass of the gas. Some slides write the universal gas constant as R_u and the molar mass as M or script M. Use consistent units: R has energy per mass per temperature. It appears with the mass-specific ideal-gas equation Pv = RT. Use absolute temperature in any ideal-gas calculation involving R.

**Also written in the lectures as:**

- $R = \frac{\bar{R}}{MW}$

**Taught in:** M3.1 (`topic:m3-01-ideal-gas-p-v-t`), M3.3 (`topic:m3-03-example-2-ideal-gas-p-v-t`), M3.7 (`topic:m3-07-generalized-compressibility`), M7.11 (`topic:m7-11-example-gibbs-equations`)
