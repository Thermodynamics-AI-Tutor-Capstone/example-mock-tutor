---
id: eq:real-ideal-work-outlet-enthalpies
kind: equation
title: Real and ideal work from outlet enthalpies
description: Use to calculate turbine or compressor isentropic efficiency from property tables.
parent: topic:m7-14-isentropic-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\dot{W}_{real} = -\dot{m}(h_2 - h_1), \qquad \dot{W}_{ideal} = -\dot{m}(h_{2,s} - h_1)$$
plain_statement: Real work uses the actual outlet enthalpy; ideal work uses the isentropic outlet enthalpy
  at the actual outlet pressure.
symbols:
- \dot{W}
- \dot{m}
- h
valid_when:
- steady-flow
- single-inlet-single-exit
- adiabatic
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module7_14_IsentropicEfficiency_annotated.pdf
  pages:
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Real and ideal work from outlet enthalpies

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\dot{W}_{real} = -\dot{m}(h_2 - h_1), \qquad \dot{W}_{ideal} = -\dot{m}(h_{2,s} - h_1)$$
$$

These expressions are used to compute isentropic efficiency. The real outlet state 2 is the actual exit; the ideal outlet state 2s has the same entropy as the inlet, s_{2s}=s1, and the actual outlet pressure P2. For a turbine, real work is smaller than ideal; for a compressor, real work input is larger than ideal. Use property tables to find h1, h2, and h_{2s}. Do not use actual outlet entropy to evaluate h_{2s}; use s1. This equation assumes the same mass flow for both real and ideal cases.

**Taught in:** M7.14 (`topic:m7-14-isentropic-efficiency`)
