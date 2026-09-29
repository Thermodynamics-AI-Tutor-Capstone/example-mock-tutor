---
id: eq:van-der-waals-eos
kind: equation
title: Van der Waals equation of state
description: Use as a simple real-gas alternative to the ideal-gas model when Z is not approximately 1.
parent: topic:m3-06-non-ideal-gases
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: \left(P+\frac{a}{\bar{v}^2}\right)(\bar{v}-b)=R_uT, \quad P=\frac{R_uT}{\bar{v}-b}-\frac{a}{\bar{v}^2}
plain_statement: A real-gas equation of state with a pressure-correction term a/v-bar squared for intermolecular
  attraction and a volume-correction term b for molecular size.
symbols:
- P
- R_u
- T
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module3_6_NonIdealGases_annotated.pdf
  pages:
  - 3
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Van der Waals equation of state

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\left(P+\frac{a}{\bar{v}^2}\right)(\bar{v}-b)=R_uT, \quad P=\frac{R_uT}{\bar{v}-b}-\frac{a}{\bar{v}^2}
$$

The van der Waals equation corrects the ideal-gas molar equation of state. The coefficient a accounts for intermolecular attraction in the pressure term, b accounts for finite molecular volume, and v-bar is molar volume. The pressure form is the same relation solved for P. Use absolute temperature. This is a real-gas model; it can be used when ideal-gas behavior is not accurate. Ensure v-bar is molar, not mass-specific, and use constants for the gas.

**Taught in:** M3.6 (`topic:m3-06-non-ideal-gases`)
