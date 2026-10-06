---
id: eq:adiabatic-closed-system-work
kind: equation
title: Adiabatic closed-system ideal-gas work
description: Use this for adiabatic compression and expansion processes in a closed system when the working
  fluid is an ideal gas with constant c_v.
parent: topic:m8-13-otto-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: '{}_iW_f=-M c_v(T_f-T_i)'
plain_statement: For an adiabatic closed-system ideal-gas process with constant specific heats, work equals
  the negative of the internal-energy change.
symbols:
- M
- c_v
- T
valid_when:
- closed-system
- ideal-gas
- constant-specific-heats
- adiabatic
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

# Adiabatic closed-system ideal-gas work

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
{}_iW_f=-M c_v(T_f-T_i)
$$

In an adiabatic closed-system process, there is no heat transfer, so the first law gives W = -\Delta U. For an ideal gas with constant c_v, \Delta U = M c_v \Delta T, so the work is -M c_v(T_f - T_i). This is used for the compression and expansion strokes of the Otto cycle. The sign convention is that if the temperature rises during compression, the work is negative, meaning work input. A common mistake is using c_p instead of c_v or using this formula for a steady-flow compressor, where enthalpy would be appropriate.

**Taught in:** M8.13 (`topic:m8-13-otto-cycle`)
