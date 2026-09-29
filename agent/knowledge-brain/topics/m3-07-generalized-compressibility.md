---
id: topic:m3-07-generalized-compressibility
kind: topic
title: M3.7 — Generalized Compressibility
description: Introduces the compressibility factor Z=Pv/RT, reduced pressure and temperature, and generalized
  compressibility charts; open when students need to find real-gas Z from the chart.
parent: unit:m3-ideal-and-nonideal-gases
unit: unit:m3-ideal-and-nonideal-gases
lecture: M3.7
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Define the compressibility factor as Z = Pv/RT and state that Z=1 for an ideal gas.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Define reduced temperature and reduced pressure using critical properties.
  kc_type: fact
  bloom: remember
- id: '#o3'
  text: Explain why real-gas data are plotted against reduced pressure and reduced temperature.
  kc_type: principle
  bloom: understand
- id: '#o4'
  text: Calculate Z from P, v, R, and T for a given state.
  kc_type: skill
  bloom: apply
- id: '#o5'
  text: Read a compressibility factor from a generalized compressibility chart given T_R and P_R.
  kc_type: skill
  bloom: apply
equations:
- eq:compressibility-factor
- eq:gas-specific-constant-from-universal
- eq:ideal-gas-equation-of-state
- eq:reduced-pressure
- eq:reduced-temperature
misconceptions: []
examples: []
items:
- item:exam1-2023-ii-1
- item:hw04-2
sources:
- path: lectures/Module3_7_GeneralizedCompressibility_annotated.pdf
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

# M3.7 — Generalized Compressibility

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This lecture introduces the compressibility factor $Z$, shows how real gases depart from the ideal-gas value $Z=1$, and introduces reduced pressure and reduced temperature used to collapse real-gas data onto a generalized compressibility chart.

## Key ideas

- The compressibility factor is defined by $Z = \frac{Pv}{RT}$ (p. 2). When a gas behaves ideally, $Pv = RT$, so $Z = 1$ (p. 2).
- A $Z$--$P$ plot for nitrogen, water, and carbon dioxide shows curves that begin at $Z=1$ and fall below the ideal-gas dashed line as pressure increases (p. 2).
- In the example, helium at 500 K and 1 atm gives $Z=1$ because $Pv=RT$ is satisfied; water at 500 K and 2 MPa is listed as $Z=0.9$ (p. 3).
- The critical point is where liquids and gases are no longer distinguishable; critical temperature and pressure are used to make properties dimensionless (p. 4).
- Reduced temperature is $T_R = \frac{T}{T_c}$ and reduced pressure is $P_R = \frac{P}{P_c}$ (pp. 4--5).
- The generalized compressibility chart plots $Z$ against $P_R$ for lines of constant $T_R$ (p. 5). Data for many substances collapse onto common curves when plotted this way (p. 5).

## Notation used

- $Z$: compressibility factor, $Pv/RT$ (p. 2 and p. 5).
- $P_R$: reduced pressure, $P/P_c$ (pp. 4--5).
- $T_R$: reduced temperature, $T/T_c$ (pp. 4--5).
- $P_c$, $T_c$: critical pressure and critical temperature (p. 4).
- $\bar{R}$: universal gas constant; $R = \bar{R}/M$ is the gas-specific constant (p. 3).

## Examples in this lecture

- Helium at 500 K and 1 atm: use $R = \bar{R}/M$ and $Z = Pv/RT$ to show $Z=1$ (p. 3). Demonstrates an ideal-gas calculation.
- Water at 500 K and 2 MPa: given $Z=0.9$ (p. 3). Demonstrates departure from ideal-gas behavior.
