---
id: eq:internal-energy-gibbs-equation
kind: equation
title: Internal-energy Gibbs relation
description: Use for reversible simple compressible substances when relating u, s and v derivatives.
parent: topic:m7-10-gibbs-equations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$d\tilde{U} = T\,dS - P\,d\mathcal{V}, \qquad du = T\,ds - P\,dv$$
plain_statement: The differential internal energy change is temperature times entropy change minus pressure
  times volume change.
symbols:
- T
- S
- P
- \mathcal{V}
- u
- s
- v
valid_when:
- closed-system
- pure-substance
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

# Internal-energy Gibbs relation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$d\tilde{U} = T\,dS - P\,d\mathcal{V}, \qquad du = T\,ds - P\,dv$$
$$

This is the combined first and second law for a simple compressible substance undergoing a quasi-equilibrium reversible process. T dS is reversible heat transfer and P dV is boundary work. Because u, s, and v are properties, the relation also holds between equilibrium states even if the actual process is irreversible, but the differential interpretation is for quasi-equilibrium reversible paths. The specific form uses internal energy per unit mass. This form has no flow terms, so do not use it for open-system flow work. It is the starting point for ideal-gas entropy relations.

**Taught in:** M7.10 (`topic:m7-10-gibbs-equations`)
