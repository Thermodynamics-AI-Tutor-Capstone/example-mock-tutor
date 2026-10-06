---
id: eq:turbine-isentropic-efficiency
kind: equation
title: Turbine isentropic efficiency
description: Use to rate adiabatic turbines by comparing real work to the reversible adiabatic ideal.
parent: topic:m7-14-isentropic-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\eta_{isen,t} = \frac{\dot{W}_{real}}{\dot{W}_{ideal}} < 1$$
plain_statement: Turbine isentropic efficiency is the ratio of actual work output to isentropic work output.
symbols:
- \eta_s
- \dot{W}
valid_when:
- steady-flow
- adiabatic
invalid_when: []
misconceptions:
- misc:m09-friction-is-the-only-efficiency-limit
- misc:m15-adiabatic-implies-isentropic
sources:
- path: lectures/Module7_14_IsentropicEfficiency_annotated.pdf
  pages:
  - 4
- path: lectures/Module8_6_Example_RankineCycle_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Turbine isentropic efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\eta_{isen,t} = \frac{\dot{W}_{real}}{\dot{W}_{ideal}} < 1$$
$$

This definition applies to adiabatic turbines. The ideal work corresponds to the same pressure ratio but with no entropy generation. Real turbines produce less work because of irreversibilities, so the ratio is less than 1. To compute, find h1 and h2s from tables, calculate ideal work, then use the actual work or actual outlet enthalpy. A common mistake is reversing the numerator and denominator, which gives a turbine efficiency greater than 1. Isentropic efficiency is not the same as thermal efficiency.

**Also written in the lectures as:**

- $\eta_{isen,t}=\frac{\dot{W}_{real}}{\dot{W}_{ideal}}=\frac{h_4-h_3}{h_{4s}-h_3}$
- $h_4=\eta_{isen,t}(h_{4s}-h_3)+h_3$

**Taught in:** M7.14 (`topic:m7-14-isentropic-efficiency`), M8.6 (`topic:m8-06-example-rankine-cycle`)
