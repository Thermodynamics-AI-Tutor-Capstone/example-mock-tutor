---
id: eq:bulk-kinetic-potential-energy
kind: equation
title: Bulk kinetic and potential energy
description: Use for a closed mass whose center of mass has speed $\mathcal{V}$ and elevation $z$.
parent: topic:m5-01-energy
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.7
latex: $E_{\mathrm{bulk}} = KE + PE = \frac{1}{2}M\mathcal{V}^2 + Mg(z-z_{ref})$
plain_statement: Bulk energy is the whole-system kinetic energy plus gravitational potential energy relative
  to a reference height.
symbols:
- M
- \mathcal{V}
- g
- z
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module5_1_Energy_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Bulk kinetic and potential energy

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$E_{\mathrm{bulk}} = KE + PE = \frac{1}{2}M\mathcal{V}^2 + Mg(z-z_{ref})$
$$

The bulk kinetic energy uses the center-of-mass speed $\mathcal{V}$, with the whole mass $M$ moving together. Bulk potential energy uses a reference height $z_{ref}$, so only differences in elevation matter. These terms are grouped as $E_{\mathrm{bulk}}$ and are distinct from internal energy $U$. Use this expression when the problem gives elevation or velocity explicitly; neglect it only when the problem states or justifies small $\Delta KE$ and $\Delta PE$.

**Taught in:** M5.1 (`topic:m5-01-energy`)
