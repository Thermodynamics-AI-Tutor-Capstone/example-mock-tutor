---
id: eq:ideal-brayton-cycle-thermal-efficiency
kind: equation
title: Ideal Brayton cycle thermal efficiency
description: Use this for an air-standard ideal Brayton cycle with constant specific heats when only the
  pressure ratio is known.
parent: topic:m8-09-brayton-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \eta_{th}=1-\mathrm{OPR}^{(1-\gamma)/\gamma}
plain_statement: The ideal Brayton cycle thermal efficiency is one minus the overall pressure ratio raised
  to the power (1 minus gamma) over gamma.
symbols:
- \eta_{th}
valid_when:
- ideal-gas
- constant-specific-heats
- reversible
- steady-flow
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module8_9_BraytonCycle_annotated.pdf
  pages:
  - 8
- path: lectures/Module8_10_Example_BraytonCycle_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal Brayton cycle thermal efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\eta_{th}=1-\mathrm{OPR}^{(1-\gamma)/\gamma}
$$

This is the air-standard ideal Brayton cycle efficiency. It depends only on the overall pressure ratio and the specific-heat ratio. Because OPR is greater than 1 and gamma is greater than 1, the exponent is negative, so increasing OPR raises the efficiency. The formula assumes ideal gas with constant specific heats, reversible compression and expansion, and constant-pressure heat addition and rejection. It is the ideal gas-turbine cycle limit. A common mistake is to treat this as valid for real cycles with compressor and turbine losses, or to use it for a Rankine cycle. Use it to show the pressure-ratio trend, then apply component isentropic efficiencies for real analysis.

**Taught in:** M8.9 (`topic:m8-09-brayton-cycle`), M8.10 (`topic:m8-10-example-brayton-cycle`)
