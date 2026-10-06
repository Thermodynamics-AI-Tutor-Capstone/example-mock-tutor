---
id: eq:entropy-balance-generation
kind: equation
title: Entropy balance with generation
description: Use as the general second-law bookkeeping equation; entropy generation is zero for internally
  reversible processes.
parent: topic:m7-07-entropy
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\Delta S_{sys} = S_{in} - S_{out} + \Phi$$
plain_statement: System entropy change equals net entropy transferred in plus entropy generated within
  the system.
symbols:
- S
- \Phi
valid_when: []
invalid_when: []
misconceptions:
- misc:m02-entropy-and-the-second-law
- misc:m10-entropy-of-an-isolated-system
sources:
- path: lectures/Module7_7_Entropy_annotated.pdf
  pages:
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Entropy balance with generation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\Delta S_{sys} = S_{in} - S_{out} + \Phi$$
$$

This is the entropy bookkeeping equation. Entropy can cross the boundary with heat or mass flow, but entropy is not conserved: irreversibilities generate Phi. For a closed system with heat transfer Q at boundary temperature T, the entropy transfer by heat is Q/T; for an adiabatic closed system only Phi contributes. Phi is zero for internally reversible processes and positive for irreversible processes; it cannot be negative. Use this equation to check whether a process is allowed. In this course the generation term is written Phi.

**Taught in:** M7.7 (`topic:m7-07-entropy`)
