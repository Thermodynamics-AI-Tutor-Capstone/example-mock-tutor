---
id: eq:compressed-liquid-enthalpy
kind: equation
title: Enthalpy of compressed liquid
description: Use when compressed-liquid enthalpy is not directly tabulated.
parent: topic:m4-05-liquid-solid
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.7
latex: h(T,P) \approx u_f(T_{\text{sat}}) + (P - P_{\text{sat}}) v(T_{\text{sat}})
plain_statement: Enthalpy of a compressed liquid is saturated-liquid internal energy plus a pressure correction
  using saturated-liquid specific volume.
symbols:
- h
- u
- P
- v
valid_when:
- compressed-liquid
- incompressible
invalid_when:
- saturated-mixture
- superheated-vapor
misconceptions: []
sources:
- path: lectures/Module4_5_LiquidSolid_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Enthalpy of compressed liquid

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
h(T,P) \approx u_f(T_{\text{sat}}) + (P - P_{\text{sat}}) v(T_{\text{sat}})
$$

This is the compressed-liquid enthalpy approximation. The first term is the saturated-liquid internal energy at the liquid temperature, and the second term is the pressure-volume correction from the saturation pressure to the actual pressure. Because liquid specific volume is small, this correction is often modest, but it is included for accuracy. Use it only for compressed liquids; do not apply it inside the saturated mixture dome or in the superheated-vapor region.

**Taught in:** M4.5 (`topic:m4-05-liquid-solid`)
