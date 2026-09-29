---
id: topic:m5-08-course-review-2
kind: topic
title: M5.8 — Course Review 2
description: 'Reviews the standard ME 300 assumptions: substance models (continuum, simple compressible,
  pure, ideal gas, constant specific heats) and process constraints (quasi-equilibrium, negligible KE/PE,
  sealed, rigid, passive, adiabatic).'
parent: unit:m5-energy-heat-work-closed-systems
unit: unit:m5-energy-heat-work-closed-systems
lecture: M5.8
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can state the substance and process assumptions listed in the review deck (p. 2-3).
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can identify when the ideal-gas and constant-specific-heats assumptions are appropriate
    from the stated conditions (p. 2).
  kc_type: skill
  bloom: understand
- id: '#o3'
  text: Students can translate qualitative process descriptors such as sealed, rigid, passive, and adiabatic
    into mathematical constraints (p. 3).
  kc_type: principle
  bloom: apply
equations:
- eq:simple-compressible-substance
misconceptions: []
examples: []
items:
- item:hw06-6
sources:
- path: lectures/Module5_8_CourseReview2_annotated.pptx
  slides:
  - 1
  - 2
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M5.8 — Course Review 2

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This three-slide review lists the standard assumptions for substances and processes that ME 300 uses to turn real devices into solvable models. Use it as a quick reference when translating a problem statement into governing equations.

## Key ideas
- The continuum assumption is always applied, and a simple compressible substance is always assumed, so specific volume is a state function of pressure and temperature: $v=f(P,T)$ (p. 2).
- Pure substance is also listed as always assumed (p. 2).
- Ideal-gas behavior is only a "sometimes" assumption; the slide gives the conditions $T \gg T_c$ and $P \ll P_c$ (p. 2).
- Constant specific heats are also a "sometimes" assumption and are tied to small temperature changes, $\Delta T$ small (p. 2).
- Process modeling always assumes quasi-equilibrium/quasi-static behavior (p. 3).
- Negligible kinetic and potential energy, $\Delta KE=0$ and $\Delta PE=0$, is associated with piston-cylinder and rigid-tank problems (p. 3).
- Qualitative process descriptors map to constraints: the label transcribed as "scaled" (possibly "sealed") gives $M=\text{const}$; "rigid" gives $\mathcal{V}=\text{const}$; "passive" gives $\dot W=0$; and "adiabatic" gives $\dot Q=0$ (p. 3).

## Notation used
- $v$: specific volume
- $P,T$: pressure and temperature; $T_c,P_c$: critical temperature and pressure
- $c_v,c_p$: constant-volume and constant-pressure specific heats
- $M$: mass; $\mathcal{V}$: total volume
- $\dot W,\dot Q$: work and heat transfer rates
- $KE,PE$: kinetic and potential energy
