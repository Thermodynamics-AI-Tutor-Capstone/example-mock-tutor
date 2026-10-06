---
id: topic:m4-02-vapor-dome
kind: topic
title: M4.2 — Vapor Dome
description: Introduces the vapor dome on a T-v diagram, defines quality, shows two-phase mixing relations,
  and demonstrates phase determination and saturation-table use.
parent: unit:m4-phase-change-and-property-tables
unit: unit:m4-phase-change-and-property-tables
lecture: M4.2
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify saturated liquid, saturated vapor, mixture, compressed/subcooled liquid,
    superheated vapor, and the critical point on a T-v diagram.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can define quality and apply quality-based mixing rules to evaluate saturated mixture
    properties.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can choose the correct property table and determine phase and pressure from given temperature
    and specific volume.
  kc_type: skill
  bloom: apply
equations:
- eq:quality-definition
- eq:quality-from-specific-internal-energy
- eq:quality-from-specific-volume
- eq:two-phase-internal-energy-mixing-rule
- eq:two-phase-specific-volume-mixing-rule
misconceptions: []
examples: []
items:
- item:exam1-2021-i-2
- item:exam1-2021-ii-1
- item:exam1-2022-conflict-i-2
- item:exam1-2022-regular-i-2
- item:exam1-2023-i-2
- item:hw04-4
- item:hw04-5
sources:
- path: lectures/Module4_2_VaporDome_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M4.2 — Vapor Dome

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This lecture introduces the two-phase liquid-vapor region on a $T$-$v$ diagram, labels the key states around the vapor dome, defines quality $x$, gives the mixing relations used to evaluate mixture properties from saturation tables, and walks through a table lookup example.

## Key ideas

- The dome on a $T$-$v$ diagram is bounded by saturated-liquid and saturated-vapor lines; the apex is the critical point $(T_c, P_c, v_c)$ (p. 2).
- The saturated liquid line is labeled with $f$ properties; the saturated vapor line is labeled with $g$ properties (p. 2).
- Inside the dome is a liquid-vapor mixture; the region left of the dome is subcooled liquid; the region right of the dome is superheated vapor (p. 2).
- Quality $x$ is the mass fraction of vapor in a two-phase mixture: $x = M_g/(M_f+M_g)$ (p. 3).
- For a mixture, a specific property such as $v$ or $u$ is obtained from the saturated values and quality: $v = x v_g + (1-x)v_f$; the analogous relation for $u$ is also written (p. 3).
- Saturation tables D.1 (temperature) and D.2 (pressure) give saturated liquid/vapor properties; superheated vapor table D.3 and compressed/subcooled liquid table D.4 are used outside the dome (p. 3).
- Example: at $T=310\ \mathrm{K}$ and $v=22.905\ \mathrm{m^3/kg}$, Table D.1 gives saturated vapor, so $P = P_{\mathrm{sat}} = 6.231199\ \mathrm{kPa}$ (p. 4).
- The slide 5 question asks for a phase without giving a state on the dome; it targets the difference between generic labels such as vapor/liquid and specific saturated-vapor/saturated-liquid/mixture labels (p. 5).

## Notation used

- $T$, $P$, $v$, $u$, $h$, $s$: temperature, pressure, specific volume, internal energy, enthalpy, entropy
- $T_c$, $P_c$: critical-point temperature and pressure
- $T_{\mathrm{sat}}$, $P_{\mathrm{sat}}$: saturation temperature and pressure
- subscripts $f$ and $g$: saturated liquid and saturated vapor
- $x$: quality, vapor mass fraction
- $M_f$, $M_g$: mass of saturated liquid, mass of saturated vapor

## Examples in this lecture

- Table lookup: given $T=310\ \mathrm{K}$ and $v=22.905\ \mathrm{m^3/kg}$, find $P$ and phase. It demonstrates comparing a given specific volume with saturation values in Table D.1 to identify saturated vapor and then read the saturation pressure (p. 4).
- Concept check: "What phase is this fluid?" with answer choices; it tests whether students apply dome definitions rather than choosing a generic vapor or liquid label (p. 5).
