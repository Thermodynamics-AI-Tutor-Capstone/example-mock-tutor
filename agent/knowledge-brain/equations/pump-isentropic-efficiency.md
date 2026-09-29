---
id: eq:pump-isentropic-efficiency
kind: equation
title: Pump isentropic efficiency
description: Use this to find the actual pump work from the ideal isentropic pump work or to compute the
  actual pump outlet enthalpy.
parent: topic:m8-06-example-rankine-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \eta_{isen,p}=\frac{\dot{W}_{ideal}}{\dot{W}_{real}}=\frac{h_{2s}-h_1}{h_2-h_1}
plain_statement: The pump isentropic efficiency is the ideal pump work divided by the actual pump work,
  expressed with pump inlet and outlet enthalpies.
symbols:
- \eta_s
- \dot{W}
- h
valid_when:
- steady-flow
- single-inlet-single-exit
invalid_when: []
misconceptions:
- misc:m15-adiabatic-implies-isentropic
sources:
- path: lectures/Module8_6_Example_RankineCycle_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Pump isentropic efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\eta_{isen,p}=\frac{\dot{W}_{ideal}}{\dot{W}_{real}}=\frac{h_{2s}-h_1}{h_2-h_1}
$$

This defines the isentropic efficiency of a pump. The numerator is the ideal isentropic work input from state 1 to the ideal outlet state 2s. The denominator is the actual work input from state 1 to the actual outlet state 2. Since pumps are work-absorbing devices, the ideal work is less than the actual work, so the efficiency is less than 1. In terms of enthalpies, the work magnitudes are proportional to the enthalpy rises because mass flow cancels. Use this to solve for h_2 once the isentropic state h_{2s} is known.

**Also written in the lectures as:**

- $h_2=\frac{h_{2s}-h_1}{\eta_{isen,p}}+h_1$

**Taught in:** M8.6 (`topic:m8-06-example-rankine-cycle`)
