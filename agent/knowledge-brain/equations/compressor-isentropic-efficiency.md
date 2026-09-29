---
id: eq:compressor-isentropic-efficiency
kind: equation
title: Compressor isentropic efficiency
description: Use to rate adiabatic compressors; actual work input is larger than ideal.
parent: topic:m7-14-isentropic-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\eta_{isen,comp} = \frac{\dot{W}_{ideal}}{\dot{W}_{real}} < 1$$
plain_statement: Compressor isentropic efficiency is the ratio of isentropic work input to actual work
  input.
symbols:
- \eta_s
- \dot{W}
valid_when:
- steady-flow
- adiabatic
invalid_when: []
misconceptions:
- misc:m09-friction-is-the-only-efficiency-limit
sources:
- path: lectures/Module7_14_IsentropicEfficiency_annotated.pdf
  pages:
  - 7
- path: lectures/Module7_15_Example_IsentropicEfficiency_annotated.pdf
  pages:
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Compressor isentropic efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\eta_{isen,comp} = \frac{\dot{W}_{ideal}}{\dot{W}_{real}} < 1$$
$$

For a compressor, the isentropic ideal work is the minimum work input; irreversibility increases the actual work input, so ideal/real is less than 1. Be careful to invert the ratio relative to turbines. To use, find h1, h2s, and h2 from tables. A common mistake is using the turbine efficiency formula for compressors and obtaining an efficiency above 1, or using isothermal work instead of isentropic work in the denominator.

**Taught in:** M7.14 (`topic:m7-14-isentropic-efficiency`), M7.15 (`topic:m7-15-example-isentropic-efficiency`)
