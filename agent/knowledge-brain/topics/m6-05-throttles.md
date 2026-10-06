---
id: topic:m6-05-throttles
kind: topic
title: M6.5 — Throttles
description: Introduces throttles as passive, adiabatic devices; derives $h_2=h_1$ from the steady-flow
  energy balance and notes $P_2<P_1$. Use before assigning throttle-related steady-flow problems.
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.5
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: 'State the throttle modeling assumptions: no work, adiabatic, and negligible kinetic and potential
    energy changes.'
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Reduce the steady-flow energy equation for a throttle to the result h_2 = h_1.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Relate specific enthalpy to internal energy, pressure, and specific volume using h = u + Pv.
  kc_type: fact
  bloom: understand
equations:
- eq:enthalpy-definition
- eq:throttle-enthalpy-equality
misconceptions: []
examples: []
items:
- item:exam2-2022-i-3a-3c
- item:hw06-3
sources:
- path: lectures/Module6_5_Throttles_annotated.pdf
  pages:
  - 1
  - 2
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M6.5 — Throttles

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This three-slide deck introduces the throttle. Page 2 shows real hardware examples: an industrial globe valve, an automotive throttle body, and a sintered plate filter. Page 3 writes the throttle assumptions and reduces the energy equation to $\Delta h=0$, giving $\boxed{h_2=h_1}$ and $P_2<P_1$.

## Key ideas
- A throttle is passive: the work/power term is zero, $\dot{W}=0$ (p. 3).
- A throttle is modeled as adiabatic: $\dot{Q}=0$ (p. 3).
- Kinetic and potential energy changes are neglected: $\Delta ke=0$ and $\Delta pe=0$ (p. 3).
- The slide cancels those terms in the energy balance:
  $$\dot{m}\left(\Delta h + \cancel{\Delta ke}^{0} + \cancel{\Delta pe}^{0}\right) = \cancel{\dot{Q}}^{0} - \cancel{\dot{W}}^{0}$$ (p. 3).
- What remains is $\Delta h=0$, so the exit and inlet specific enthalpies are equal: $h_2=h_1$ (p. 3).
- Enthalpy is composed of internal energy plus the $Pv$ term: $h=u+Pv$ (p. 3).
- The pressure drops from inlet to exit: $P_2<P_1$ (p. 3).

## Notation used
- $\dot{m}$: mass flow rate (p. 3)
- $\dot{Q},\dot{W}$: heat transfer rate and work/power rate (p. 3)
- $\Delta ke,\Delta pe$: changes in specific kinetic and potential energy (p. 3)
- $h,u,P,v$: specific enthalpy, specific internal energy, pressure, specific volume (p. 3)

## Examples in this lecture
No worked numerical examples are shown. Page 2 gives hardware examples: a globe valve, an automotive throttle body, and a sintered plate filter.
