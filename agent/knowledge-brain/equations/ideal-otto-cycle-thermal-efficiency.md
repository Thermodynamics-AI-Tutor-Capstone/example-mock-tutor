---
id: eq:ideal-otto-cycle-thermal-efficiency
kind: equation
title: Ideal Otto cycle thermal efficiency
description: Use this for an air-standard Otto cycle with isentropic compression/expansion and constant-volume
  heat addition/rejection.
parent: topic:m8-13-otto-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \eta_{th}=1-\frac{1}{r^{\gamma-1}}
plain_statement: The ideal Otto-cycle thermal efficiency depends only on compression ratio and specific-heat
  ratio.
symbols:
- \eta_{th}
valid_when:
- closed-system
- ideal-gas
- constant-specific-heats
- isentropic
- isochoric
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- open-system
- variable-specific-heats
- irreversible
misconceptions: []
sources:
- path: lectures/Module8_13_OttoCycle_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal Otto cycle thermal efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\eta_{th}=1-\frac{1}{r^{\gamma-1}}
$$

This is the air-standard thermal efficiency of an ideal Otto cycle. It shows that efficiency increases with compression ratio r and with the specific-heat ratio gamma. The derivation assumes ideal gas with constant specific heats, reversible adiabatic compression and expansion, and constant-volume heat addition and rejection. It is independent of the heat addition amount. Real Otto engines have lower efficiency due to irreversibilities and incomplete combustion. Use this formula to compare cycles or to see the trend with compression ratio, not as a precise real-engine efficiency.

**Taught in:** M8.13 (`topic:m8-13-otto-cycle`)
