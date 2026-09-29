---
id: eq:absolute-pressure
kind: equation
title: Absolute pressure
description: Use to convert gage pressure readings to absolute pressure before using property tables or
  the ideal-gas relation.
parent: topic:m2-08-pressure-temperature-density
unit: unit:m2-properties-states-and-processes
status: auto
audience: both
priority: 0.7
latex: P_{\mathrm{abs}} = P_{\mathrm{gage}} + P_{\mathrm{atm}}
plain_statement: Absolute pressure equals gage pressure plus local atmospheric pressure.
symbols: []
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module2_8_PressureTemperatureDensity_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Absolute pressure

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
P_{\mathrm{abs}} = P_{\mathrm{gage}} + P_{\mathrm{atm}}
$$

Gage pressure is measured relative to the surrounding atmosphere, so absolute pressure is obtained by adding the local atmospheric pressure to the gage reading. Use this relation whenever a pressure gage gives $P_{\mathrm{gage}}$ and the thermodynamic property tables or ideal-gas relation require absolute pressure. The course states the relation as $P_{\mathrm{abs}} = P_{\mathrm{gage}} + P_{\mathrm{atm}}$. Atmospheric pressure depends on location and conditions; use the local value rather than a fixed sea-level value unless the problem specifies it. This conversion is necessary before using property tables because tabulated properties are functions of absolute pressure.

**Taught in:** M2.8 (`topic:m2-08-pressure-temperature-density`)
