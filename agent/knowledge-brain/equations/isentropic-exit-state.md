---
id: eq:isentropic-exit-state
kind: equation
title: Isentropic exit state / ideal outlet state
description: Use to fix the ideal state after an adiabatic turbine, compressor, or nozzle before computing
  isentropic efficiency.
parent: topic:m7-14-isentropic-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$s_{2,s} = s_1 \quad (\text{at } P_2)$$
plain_statement: A reversible adiabatic process has constant entropy; the ideal outlet state has the inlet
  entropy at the actual outlet pressure.
symbols:
- s
- P
valid_when:
- adiabatic
- internally-reversible
invalid_when:
- irreversible
misconceptions:
- misc:m15-adiabatic-implies-isentropic
sources:
- path: lectures/Module7_13_Example_IsentropicTurbine_annotated.pdf
  pages:
  - 2
  - 4
  - 5
- path: lectures/Module7_14_IsentropicEfficiency_annotated.pdf
  pages:
  - 4
  - 7
- path: lectures/Module8_8_Example_VaporCompression_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Isentropic exit state / ideal outlet state

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$s_{2,s} = s_1 \quad (\text{at } P_2)$$
$$

For an adiabatic and internally reversible process, entropy is constant, so s2=s1. In isentropic-efficiency calculations the real outlet state is irreversible, so the ideal outlet state 2s is defined at the actual outlet pressure P2 and the inlet entropy s1. This fixes h_{2s} and the ideal work. The actual adiabatic irreversible outlet has s2>s1, so do not set s2 equal to s1 for the measured state. A common error is using inlet pressure for the ideal exit or using actual T2 to find h_{2s}; use P2 and s1.

**Also written in the lectures as:**

- $s_{out}=s_{in}$

**Taught in:** M7.13 (`topic:m7-13-example-isentropic-turbine`), M7.14 (`topic:m7-14-isentropic-efficiency`), M8.8 (`topic:m8-08-example-vapor-compression`)
