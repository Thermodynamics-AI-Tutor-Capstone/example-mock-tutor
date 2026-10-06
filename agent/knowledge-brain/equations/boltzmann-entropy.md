---
id: eq:boltzmann-entropy
kind: equation
title: Boltzmann entropy relation
description: Use to recognize the statistical meaning of entropy, not as a macroscopic process equation.
parent: topic:m7-07-entropy
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$S = k \ln \Omega$$
plain_statement: Entropy is proportional to the natural logarithm of the number of microscopic states
  Omega.
symbols:
- S
- k
valid_when: []
invalid_when: []
misconceptions:
- misc:m08-entropy-is-only-disorder
sources:
- path: lectures/Module7_7_Entropy_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Boltzmann entropy relation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$S = k \ln \Omega$$
$$

This microscopic definition connects entropy to the number of accessible molecular configurations Omega. A larger Omega means more ways to realize the macrostate and higher entropy. k is Boltzmann's constant. It explains why isolated systems evolve toward more probable macrostates and why entropy increases. In macroscopic ME300 problems, entropy changes are usually computed from property relations or the reversible heat-transfer integral. Do not confuse Omega with volume or probability; it is a count of microstates. It also helps show that entropy is not only a vague measure of disorder.

**Taught in:** M7.7 (`topic:m7-07-entropy`)
