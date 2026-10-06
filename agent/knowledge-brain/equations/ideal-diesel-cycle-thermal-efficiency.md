---
id: eq:ideal-diesel-cycle-thermal-efficiency
kind: equation
title: Ideal Diesel cycle thermal efficiency
description: Use this for an air-standard Diesel cycle with constant-pressure heat addition and constant-volume
  heat rejection.
parent: topic:m8-14-diesel-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \eta_{th}=1-\frac{1}{r^{\gamma-1}}\left(\frac{\alpha^{\gamma}-1}{\gamma(\alpha-1)}\right)
plain_statement: The ideal Diesel-cycle thermal efficiency expressed in terms of compression ratio, cutoff
  ratio, and the specific-heat ratio.
symbols:
- \eta_{th}
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module8_14_DieselCycle_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal Diesel cycle thermal efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\eta_{th}=1-\frac{1}{r^{\gamma-1}}\left(\frac{\alpha^{\gamma}-1}{\gamma(\alpha-1)}\right)
$$

This is the ideal Diesel-cycle efficiency for an air-standard model with constant specific heats. It depends on the compression ratio, cutoff ratio, and specific-heat ratio. The cutoff-ratio factor makes the Diesel efficiency lower than the Otto efficiency for the same compression ratio when alpha is greater than 1. The formula assumes isentropic compression and expansion, constant-pressure heat addition, and constant-volume heat rejection. Use it when you know r and alpha and need the ideal efficiency. Do not treat it as a general real-engine efficiency.

**Taught in:** M8.14 (`topic:m8-14-diesel-cycle`)
