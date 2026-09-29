---
id: eq:ideal-gas-entropy-change-tp
kind: equation
title: Ideal-gas entropy change, constant c_p
description: Use for ideal gases when c_p is constant and the pressure ratio is known.
parent: topic:m7-10-gibbs-equations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\Delta s = c_p \ln\left(\frac{T_2}{T_1}\right) - R \ln\left(\frac{P_2}{P_1}\right)$$
plain_statement: Integrated entropy change for an ideal gas with constant specific heat, using temperature
  and pressure endpoints.
symbols:
- s
- c_p
- T
- R
- P
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
- path: lectures/Module7_12_IsentropicRelations_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal-gas entropy change, constant c_p

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\Delta s = c_p \ln\left(\frac{T_2}{T_1}\right) - R \ln\left(\frac{P_2}{P_1}\right)$$
$$

This is the integrated pressure form, valid for constant c_p. The temperature term is positive for heating; the pressure term is negative for compression. For an isothermal process, only the pressure term remains, Delta s = -R ln(P2/P1). For an isobaric process, only the temperature term remains. Use absolute pressure in the log. If c_p varies, use ideal-gas tables or an average c_p. A common mistake is using c_v in this formula or reversing the sign of the pressure term.

**Taught in:** M7.10 (`topic:m7-10-gibbs-equations`), M7.11 (`topic:m7-11-example-gibbs-equations`), M7.12 (`topic:m7-12-isentropic-relations`)
