---
id: eq:ideal-gas-specific-heat-ratio
kind: equation
title: Specific-heat ratio
description: Use this to define the parameter appearing in isentropic ideal-gas relations and air-standard
  cycle efficiencies.
parent: topic:m8-09-brayton-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \gamma=\frac{c_p}{c_v}
plain_statement: The ratio of constant-pressure to constant-volume specific heats for an ideal gas with
  constant specific heats.
symbols:
- c_p
- c_v
valid_when:
- ideal-gas
- constant-specific-heats
invalid_when:
- incompressible
- compressed-liquid
misconceptions: []
sources:
- path: lectures/Module8_9_BraytonCycle_annotated.pdf
  pages:
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Specific-heat ratio

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\gamma=\frac{c_p}{c_v}
$$

The specific-heat ratio is used in isentropic ideal-gas relations and in gas-turbine, Otto, and Diesel cycle formulas. It is always greater than 1 for gases. For air near room temperature, gamma is about 1.4. The relation assumes constant specific heats, so the resulting formulas are air-standard approximations. Students sometimes confuse gamma with the gas constant R or use it for liquids, where it is not meaningful. Use this definition when the problem states constant specific heats or air-standard analysis.

**Taught in:** M8.9 (`topic:m8-09-brayton-cycle`)
