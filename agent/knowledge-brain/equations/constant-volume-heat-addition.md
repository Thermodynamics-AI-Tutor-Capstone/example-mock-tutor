---
id: eq:constant-volume-heat-addition
kind: equation
title: Constant-volume heat addition
description: Use this for the constant-volume heat-addition process in the Otto cycle.
parent: topic:m8-13-otto-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: '{}_iQ_f=M c_v(T_f-T_i)'
plain_statement: For constant-volume heat addition in a closed ideal-gas system with constant specific
  heats, heat transfer equals mass times c_v times the temperature rise.
symbols:
- M
- c_v
- T
valid_when:
- closed-system
- ideal-gas
- constant-specific-heats
- isochoric
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- open-system
- variable-specific-heats
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module8_13_OttoCycle_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Constant-volume heat addition

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
{}_iQ_f=M c_v(T_f-T_i)
$$

At constant volume, no boundary work is done. The closed-system first law reduces to Q = \Delta U. For an ideal gas with constant c_v, the internal-energy change is M c_v \Delta T, so the heat addition is M c_v(T_f - T_i). This is exactly the Otto-cycle heat-addition step between states 2 and 3. Students sometimes want to use c_p because the temperature rises, but c_p is only appropriate for constant-pressure heating. Since the volume is fixed, use c_v. The mass M must match the gas mass in the cylinder.

**Taught in:** M8.13 (`topic:m8-13-otto-cycle`)
