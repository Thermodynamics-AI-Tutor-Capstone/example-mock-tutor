---
id: eq:entropy-increase-isolated
kind: equation
title: Entropy increase of an isolated system
description: 'Use to test whether a process is permissible: isolated-system entropy must increase or stay
  constant.'
parent: topic:m7-07-entropy
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$dS_{sys} + dS_{surr} \ge 0$$
plain_statement: The total entropy of system plus surroundings cannot decrease; equality holds for reversible
  processes.
symbols:
- S
valid_when:
- isolated-system
invalid_when: []
misconceptions:
- misc:m10-entropy-of-an-isolated-system
sources:
- path: lectures/Module7_7_Entropy_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Entropy increase of an isolated system

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$dS_{sys} + dS_{surr} \ge 0$$
$$

The universe, or any truly isolated system, has no entropy transfer across its boundary, so the only entropy change is internal generation. Therefore the total entropy of the system plus surroundings cannot decrease; it remains constant only for reversible processes. This is the global form of the second law. A classic mistake is applying 'entropy always increases' to the system alone when heat leaves the system and decreases its entropy; the surroundings must be included. For an irreversible process, the total entropy increases.

**Taught in:** M7.7 (`topic:m7-07-entropy`)
