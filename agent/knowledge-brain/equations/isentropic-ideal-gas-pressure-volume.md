---
id: eq:isentropic-ideal-gas-pressure-volume
kind: equation
title: Isentropic ideal-gas P-v relation
description: Use for isentropic ideal-gas processes when pressure and volume are related.
parent: topic:m7-12-isentropic-relations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$P_1 v_1^{\gamma} = P_2 v_2^{\gamma}$$
plain_statement: For an ideal gas with constant specific heats and constant entropy, P times v to the
  gamma is constant.
symbols:
- P
- v
valid_when:
- ideal-gas
- constant-specific-heats
- isentropic
invalid_when:
- variable-specific-heats
- irreversible
misconceptions:
- misc:m15-adiabatic-implies-isentropic
sources:
- path: lectures/Module7_12_IsentropicRelations_annotated.pdf
  pages:
  - 3
  - 4
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
  pages:
  - 3
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Isentropic ideal-gas P-v relation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$P_1 v_1^{\gamma} = P_2 v_2^{\gamma}$$
$$

This is the familiar polytropic relation with n=gamma for an isentropic ideal gas. It says P v^gamma is constant along the process. For gamma>1, pressure increases faster than specific volume decreases during compression. If the process is not isentropic but polytropic, use n instead of gamma. The relation assumes constant gamma and ideal-gas behavior. Use absolute pressure, not gauge pressure.

**Also written in the lectures as:**

- $P_2=P_1\left(\frac{\mathcal{V}_1}{\mathcal{V}_2}\right)^k$

**Taught in:** M7.12 (`topic:m7-12-isentropic-relations`), M8.15 (`topic:m8-15-example-diesel-cycle`)
