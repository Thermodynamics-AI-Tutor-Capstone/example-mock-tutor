---
id: eq:ideal-gas-entropy-differential-tp
kind: equation
title: Ideal-gas entropy differential, T-P form
description: Use when pressure and temperature data are known.
parent: topic:m7-10-gibbs-equations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$ds = c_p \frac{dT}{T} - R \frac{dP}{P}$$
plain_statement: For an ideal gas, entropy change expressed with c_p and pressure has a negative sign
  on the pressure term.
symbols:
- s
- c_p
- T
- R
- P
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

# Ideal-gas entropy differential, T-P form

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$ds = c_p \frac{dT}{T} - R \frac{dP}{P}$$
$$

This pressure form comes from dh=c_p dT and Pv=RT. The negative sign on the pressure term is frequently missed. It is exact for an ideal gas, with c_p possibly depending on temperature; for constant c_p integrate to get the logarithmic T-P formula. For variable c_p, the temperature integral may be evaluated with ideal-gas tables. Do not use it for incompressible substances. A classic error is writing plus R ln(P2/P1) or using c_v instead of c_p.

**Taught in:** M7.10 (`topic:m7-10-gibbs-equations`)
