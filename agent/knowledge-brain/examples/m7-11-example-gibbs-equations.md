---
id: ex:m7-11-example-gibbs-equations
kind: example
title: 'Constant-volume cooling of nitrogen: entropy change'
description: Calculate the entropy change of nitrogen in a rigid tank cooled from 400 K to 300 K using
  the ideal-gas constant-specific-heats entropy relation.
parent: topic:m7-11-example-gibbs-equations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.6
topics:
- topic:m7-11-example-gibbs-equations
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module7_11_Example_GibbsEOS_annotated.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Constant-volume cooling of nitrogen: entropy change

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A rigid tank with 0.3 kg of nitrogen (N2) begins at a pressure of 506625 Pa and a temperature of 400 K. Heat is removed until the temperature is equal to 300 K. Calculate the change in entropy of the nitrogen. Properties of N2: MW=28 kg/kmol, cp=1040 J/kg-K, cv=743 J/kg-K.

## Given

- Rigid tank containing $m = 0.3\ \mathrm{kg}$ of nitrogen
- $P_1 = 506625\ \mathrm{Pa}$
- $T_1 = 400\ \mathrm{K}$
- $T_2 = 300\ \mathrm{K}$
- $MW = 28\ \mathrm{kg/kmol}$
- $c_p = 1040\ \mathrm{J/kg\cdot K}$
- $c_v = 743\ \mathrm{J/kg\cdot K}$

## Find

- Total entropy change of the nitrogen, $\Delta S$

## Assume

- Ideal gas
- Constant specific heats
- Quasi-equilibrium process
- Closed system: mass of nitrogen is constant
- Rigid tank: constant volume, $v_2 = v_1$

## Sketch

The slide shows a photograph of a chrome V-twin motorcycle engine for context; the thermodynamic system is the nitrogen inside the rigid tank.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Write the ideal-gas entropy change for constant specific heats: $\Delta s = c_v \ln\left(\frac{T_2}{T_1}\right) + R \ln\left(\frac{v_2}{v_1}\right)$.
2. For a rigid tank, specific volume is constant: $v_2 = v_1$, so $\ln(v_2/v_1) = 0$.
3. The entropy change reduces to $\Delta s = c_v \ln\left(\frac{T_2}{T_1}\right)$.
4. Substitute $c_v = 743\ \mathrm{J/kg\cdot K}$, $T_2 = 300\ \mathrm{K}$, and $T_1 = 400\ \mathrm{K}$: $\Delta s = 743 \ln\left(\frac{300}{400}\right) = -213.7\ \mathrm{J/kg\cdot K}$.
5. Convert specific entropy change to total entropy change: $\Delta S = m \Delta s = 0.3\ \mathrm{kg} \left(-213.7\ \mathrm{J/kg\cdot K}\right) = -64.12\ \mathrm{J/K}$.

## Answer

- $Total entropy change of the nitrogen, $\Delta S$: -64.12 J/K

## What the instructor emphasises

- Because the tank is rigid, $v_2 = v_1$, so the $R \ln(v_2/v_1)$ term in the ideal-gas entropy-change relation is zero.
- With constant specific heats, the constant-volume entropy change is $\Delta s = c_v \ln(T_2/T_1)$.
- The specific entropy change is negative because $T_2 < T_1$; this is the system entropy change for the cooling process.
- Convert to total entropy with $\Delta S = m \Delta s$; do not report the specific value as the final answer.
- The instructor also notes $R = \bar R/MW$ and $v_1 = RT_1/P_1$; these are available if pressure or volume is needed, but not required for the constant-volume term.
