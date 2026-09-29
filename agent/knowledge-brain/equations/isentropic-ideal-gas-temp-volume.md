---
id: eq:isentropic-ideal-gas-temp-volume
kind: equation
title: Isentropic ideal-gas T-v relation
description: Use for isentropic ideal-gas processes when specific volumes are known.
parent: topic:m7-12-isentropic-relations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$T_1 v_1^{\gamma-1} = T_2 v_2^{\gamma-1}$$
plain_statement: For an ideal gas with constant specific heats and constant entropy, T times v to the
  (gamma minus 1) is constant.
symbols:
- T
- v
valid_when:
- ideal-gas
- constant-specific-heats
- isentropic
invalid_when:
- variable-specific-heats
- irreversible
misconceptions: []
sources:
- path: lectures/Module7_12_IsentropicRelations_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Isentropic ideal-gas T-v relation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$T_1 v_1^{\gamma-1} = T_2 v_2^{\gamma-1}$$
$$

This is the T-v version of the isentropic ideal-gas relations, obtained by setting the T-v entropy change to zero. For an isentropic expansion, temperature falls as specific volume increases. The exponent is gamma-1, not gamma. The relation assumes constant gamma and an ideal gas. It is often used together with the P-v relation and the ideal-gas law. Do not apply it to an irreversible process. Use absolute temperature.

**Taught in:** M7.12 (`topic:m7-12-isentropic-relations`)
