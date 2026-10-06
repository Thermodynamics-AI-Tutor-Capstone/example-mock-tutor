---
id: topic:m3-01-ideal-gas-p-v-t
kind: topic
title: M3.1 — Ideal Gas P-v-T
description: Use this card when teaching the state principle for a simple compressible substance and the
  ideal-gas P-v-T equation of state in its specific-volume, density, total-mass, and molar forms, plus
  P-v, P-T, T-v diagrams.
parent: unit:m3-ideal-and-nonideal-gases
unit: unit:m3-ideal-and-nonideal-gases
lecture: M3.1
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: State the state principle for a simple compressible substance and explain why the two specifying
    properties must be independent and intensive.
  kc_type: principle
  bloom: understand
- id: '#o2'
  text: Write the ideal-gas equation of state in specific-volume, density, total-volume, and molar forms.
  kc_type: fact
  bloom: remember
- id: '#o3'
  text: Relate the particular gas constant R to the universal gas constant and molar mass.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Identify constant-property ideal-gas processes on P-v, P-T, and T-v diagrams.
  kc_type: skill
  bloom: understand
- id: '#o5'
  text: State the assumptions of the ideal-gas model.
  kc_type: fact
  bloom: remember
equations:
- eq:gas-specific-constant-from-universal
- eq:ideal-gas-equation-of-state
- eq:state-postulate-for-simple-compressible-substances
misconceptions: []
examples:
- ex:ee01-p-v-t-equation-of-state-isobaric-and-isothermal-co
items:
- item:exam1-2021-i-1
- item:exam1-2021-iii
- item:exam1-2022-conflict-i-1
- item:exam1-2022-conflict-ii-1
- item:exam1-2022-regular-i-1
- item:exam1-2022-regular-ii-1
- item:exam1-2023-i-1
- item:exam1-2023-ii-1
- item:exam1-2023-iii
- item:hw03-1
- item:hw03-3
- item:hw03-4
- item:hw03-5
- item:hw03-6
sources:
- path: lectures/Module3_1_IdealGasPvT_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M3.1 — Ideal Gas P-v-T

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This lecture establishes the state principle for a simple compressible substance and introduces the ideal-gas P-v-T equation of state. It gives the specific-volume, density, total-volume, and molar forms, states the ideal-gas assumptions, and shows how constant-property processes are represented on P-v, P-T, and T-v diagrams (p. 2–8).

## Key ideas

- The state of a simple compressible substance is fixed by two independent, intensive properties; a third property follows from an equation of state (p. 2).
- Density and specific volume are not independent because $\rho = 1/v$ (p. 2).
- For a simple compressible substance, the P-v-T relation is $P=f_1(T,v)$, with $v$ in $\text{m}^3/\text{kg}$; calorific equations give $u$ and $h$, and Gibbs relations give $s$ (p. 3).
- The ideal-gas P-v-T relation is $Pv=RT$; $P$ has units Pa, $T$ is in K, and $v$ is in $\text{m}^3/\text{kg}$ (p. 5).
- The gas-specific constant is $R=R_u/\mathcal{M}$, with $R_u=8314.472$ J/kmol-K and $\mathcal{M}$ in kg/kmol (p. 5).
- The ideal-gas relation can be written for density, fixed total mass, moles, or per mole: $P=\rho RT$, $P\mathcal{V}=MRT$, $P\mathcal{V}=NR_uT$, and $P\bar{v}=R_uT$ (p. 5).
- The ideal-gas assumptions are molecules far apart with infrequent collisions, elastic collisions, and negligible intermolecular forces (p. 6).
- On a $P$-$v$ plot, constant $T$ is a hyperbola ($P\sim 1/v$); on a $P$-$T$ plot, constant $v$ is a straight line; on a $T$-$v$ plot, constant $P$ is a straight line (p. 7).
- An isothermal compression $1\to 2$ appears as a hyperbola on $P$-$v$, a horizontal line on $T$-$v$, and a vertical line on $P$-$T$ (p. 8).

## Notation used

- $\Phi$: a generic thermodynamic property placeholder.
- $P$: pressure, Pa.
- $T$: temperature, K.
- $v$: specific volume, $\text{m}^3/\text{kg}$.
- $\rho$: density (reciprocal of specific volume).
- $\mathcal{M}$: molar mass, kg/kmol.
- $R$: particular gas constant.
- $R_u$: universal gas constant, 8314.472 J/kmol-K.
- $M$: total mass.
- $\mathcal{V}$: total volume, $\text{m}^3$.
- $N$: amount of substance, mol.
- $\bar{v}$: molar specific volume, $\text{m}^3/\text{mol}$.

## What students get wrong here

- It is tempting to pick any two properties to define a state, but the annotations stress that the two properties must be independent and intensive. For example, $\rho$ and $v$ carry the same information, so they are not independent choices (p. 2).
