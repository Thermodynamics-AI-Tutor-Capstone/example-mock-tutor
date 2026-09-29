---
id: eq:enthalpy-gibbs-equation
kind: equation
title: Enthalpy Gibbs relation
description: Use for property relations involving h, s and P, especially when pressure changes matter.
parent: topic:m7-10-gibbs-equations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$dH = T\,dS + \mathcal{V}\,dP, \qquad dh = T\,ds + v\,dP$$
plain_statement: The differential enthalpy change is temperature times entropy change plus volume times
  pressure change.
symbols:
- H
- T
- S
- \mathcal{V}
- P
- h
- s
- v
valid_when:
- pure-substance
- closed-system
- reversible
- quasi-equilibrium
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module7_10_GibbsEOS_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Enthalpy Gibbs relation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$dH = T\,dS + \mathcal{V}\,dP, \qquad dh = T\,ds + v\,dP$$
$$

This follows from H=U+PV and the internal-energy Gibbs relation. The plus sign on VdP is important. It is convenient for constant-pressure processes, where dP=0 and dh=T ds. Like the internal-energy form, this is a property relation for a reversible simple compressible substance. The specific form uses v rather than total volume. Classic misuse includes losing the VdP sign or applying the equation to non-equilibrium processes. For ideal gases it leads to the T-P entropy formulas with c_p and R.

**Taught in:** M7.10 (`topic:m7-10-gibbs-equations`)
