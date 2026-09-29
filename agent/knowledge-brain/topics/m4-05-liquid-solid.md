---
id: topic:m4-05-liquid-solid
kind: topic
title: M4.5 — Liquid Solid
description: 'Introduces incompressible liquid and solid property models: v and u as temperature-only
  for liquids, compressed-liquid enthalpy correction, phase-change P-T diagram, and cv=cp for solids.
  Open for Module 4.5.'
parent: unit:m4-phase-change-and-property-tables
unit: unit:m4-phase-change-and-property-tables
lecture: M4.5
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can state the incompressible-liquid approximations $v(T,P)\approx v(T)$ and $u(T,P)\approx
    u(T)$.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can approximate compressed-liquid properties from saturated-liquid data and apply the
    enthalpy pressure correction.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can locate melting, boiling, and sublimation regions on a P-T phase diagram.
  kc_type: fact
  bloom: understand
- id: '#o4'
  text: Students can use $v=1/\rho=\text{constant}$ and $c_v=c_p=c$ for incompressible solids.
  kc_type: principle
  bloom: apply
equations:
- eq:compressed-liquid-enthalpy
- eq:incompressible-liquid-v-u-approximation
- eq:incompressible-solid-specific-heats
misconceptions: []
examples: []
items:
- item:hw05-1
- item:hw05-4
- item:hw05-5
sources:
- path: lectures/Module4_5_LiquidSolid_annotated.pdf
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

# M4.5 — Liquid Solid

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This slide set introduces the incompressible-substance property models used for liquids and solids. It shows how to approximate compressed-liquid properties from saturated-liquid data and reviews the P-T phase diagram for water.

## Key ideas

- Liquids are modeled as incompressible: specific volume and internal energy depend essentially only on temperature, $v(T,P) \approx v(T)$ and $u(T,P) \approx u(T)$ (p. 2).
- For compressed liquid, use saturated-liquid properties at the same temperature: $v(T,P) \approx v_f(T_{\text{sat}})$ and $u(T,P) \approx u_f(T_{\text{sat}})$; enthalpy still has an explicit pressure correction (p. 2).
- A hand-sketched T-v diagram shows two constant-pressure lines nearly coinciding with the saturated-liquid line on the compressed-liquid side (p. 2).
- The numerical comparison at $T = 320$ K and $P = 10$ MPa vs $5$ MPa shows $v$ and $u$ change only slightly with pressure (p. 3).
- The water P-T phase diagram labels ice, liquid water, water vapor, triple point, critical point, melting, boiling, and sublimation (p. 4).
- Solids are modeled as incompressible with constant $v=1/\rho$, which gives $c_v = c_p = c$ (p. 5).

## Notation used

- $v$ specific volume, $u$ internal energy, $h$ enthalpy, $P$ pressure, $T$ temperature.
- $v_f, u_f$ saturated-liquid properties; $P_{\text{sat}}$ saturation pressure at $T$.
- $\rho$ density; $c_v, c_p, c$ specific heats.

## Examples in this lecture

- Compressed-liquid comparison: water at $T = 320$ K and $P = 10$ MPa vs $5$ MPa has nearly identical $v$ and $u$, illustrating the pressure independence of liquid $v$ and $u$ (p. 3).
- Phase-change diagram: a water P-T diagram demonstrates where melting, boiling, and sublimation occur (p. 4).

## What students get wrong here

- The annotation $h(T,P)=h(T,P)$ on page 2 emphasizes that liquid enthalpy keeps its pressure dependence; $u$ and $v$ are approximated as $T$-only, but $h$ is not treated as pressure-independent.
