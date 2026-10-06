---
id: topic:m7-11-example-gibbs-equations
kind: topic
title: M7.11 — Example Gibbs Equations
description: 'Worked example: a rigid tank of nitrogen is cooled from 400 K to 300 K; the lecture applies
  ideal-gas Gibbs relations to compute entropy change and shows the constant-volume reduction.'
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.11
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can recognize that a rigid tank means constant specific volume and reduce the ideal-gas
    entropy relation accordingly.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can calculate the specific entropy change of an ideal gas with constant specific heats
    using temperature data.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can convert a specific entropy change to the total entropy change of a fixed mass.
  kc_type: skill
  bloom: apply
equations:
- eq:gas-specific-constant-from-universal
- eq:ideal-gas-entropy-change-tp
- eq:ideal-gas-entropy-change-tv
- eq:ideal-gas-isochoric-entropy-change
- eq:total-entropy-from-specific
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
examples:
- ex:m7-11-example-gibbs-equations
items:
- item:exam2-2023-i-2
- item:hw08-3
- item:hw08-4
- item:hw08-6
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

# M7.11 — Example Gibbs Equations

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture works one example: nitrogen in a rigid tank is cooled from 400 K to 300 K by heat removal, and the entropy change is computed from ideal-gas Gibbs relations (p. 2).

## Key ideas
- The given data are 0.3 kg N2, $P_1=506625$ Pa, $T_1=400$ K, $T_2=300$ K, $MW=28$ kg/kmol, $c_p=1040$ J/(kg K), and $c_v=743$ J/(kg K) (p. 2).
- The slide's handwritten assumptions are ideal gas, constant $c_p$ and $c_v$, quasi-equilibrium, fixed mass, and constant specific volume ($\Delta v = 0$) (p. 2).
- For a rigid tank, $v_2=v_1$, so the $R\ln(v_2/v_1)$ term in the constant-$c_v$ Gibbs relation drops out (p. 2).
- The specific entropy change is computed as $\Delta s = c_v \ln(T_2/T_1) = 743\ln(300/400) = -213.7$ J/(kg K) (p. 2).
- The total entropy change is then $\Delta S = M \Delta s$; the slide records the final answer as $\Delta S = -64.12$ kJ (p. 2).
- The slide also lists ideal-gas state relations: $R=\bar{R}/MW$, $v_1=RT_1/P_1$, and $P_2=RT_2/v_2$ with $v_2=v_1$ (p. 2).

## Notation used
- $M$ = fixed mass of nitrogen as written on the slide; molecular weight is $MW$.
- $s$ = specific entropy; $S$ = total entropy.
- $c_p$, $c_v$ = constant-pressure and constant-volume specific heats.
- $R$ = gas constant for nitrogen; $\bar{R}$ = universal gas constant; $MW$ = molecular weight.
- $v$ = specific volume.

## Examples in this lecture
- Rigid-tank nitrogen cooling from 400 K to 300 K: demonstrates the constant-volume reduction of the ideal-gas Gibbs equation and conversion from specific to total entropy change (p. 2).

## What students get wrong here
- The slide's $\Delta v=0$ and $v_2=v_1$ annotations highlight the rigid-tank simplification; a student who skips this may carry the $R\ln(v_2/v_1)$ term when it should be zero (p. 2).
