---
id: topic:m6-04-nozzle-diffuser
kind: topic
title: M6.4 — Nozzle Diffuser
description: Introduces nozzles (decreasing area, increasing velocity) and diffusers (increasing area,
  decreasing velocity) and derives the steady-flow energy equation for an adiabatic, passive device.
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.4
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: State the area-change and velocity-change signatures of a nozzle and a diffuser.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Reduce the steady-flow energy equation for an adiabatic, passive nozzle or diffuser with negligible
    potential-energy change to the enthalpy–kinetic-energy balance.
  kc_type: skill
  bloom: apply
equations:
- eq:nozzle-diffuser-energy-balance
misconceptions: []
examples: []
items:
- item:exam2-2022-i-3a-3c
- item:hw06-2
sources:
- path: lectures/Module6_4_NozzleDiffuser_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M6.4 — Nozzle Diffuser

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This short deck defines nozzles and diffusers as steady-flow devices. It gives the geometric and velocity signature of each device and reduces the steady-flow energy equation using the assumptions $\dot{W}=0$, $\dot{Q}=0$, and negligible potential-energy change.

## Key ideas
- A nozzle is a duct whose area decreases in the flow direction: $A_2 < A_1$. Its goal is to speed up the flow, so $V_2 > V_1$. (p. 2)
- A nozzle is treated as passive, $\dot{W}=0$, and adiabatic, $\dot{Q}=0$. (p. 2)
- A diffuser is a duct whose area increases: $A_2 > A_1$. Its goal is to slow the flow down, so $V_2 < V_1$. (p. 3)
- A diffuser is also treated as passive and adiabatic: $\dot{W}=0$, $\dot{Q}=0$. (p. 3)
- For the steady-flow energy equation, the potential-energy term is cancelled, the heat-transfer term is cancelled, and the work term is set to zero. The result is $\Delta h + \Delta ke = 0$. (p. 4)
- In expanded form, the nozzle/diffuser energy balance is $(h_2-h_1)+\tfrac12\left(V_2^{\,2}-V_1^{\,2}\right)=0$. (p. 4)

## Notation used
- $\dot{m}$: mass flow rate through the control volume (p. 2–4)
- $\dot{Q}$: rate of heat transfer, cancelled for this adiabatic device (p. 2–4)
- $\dot{W}$: rate of work/power, set to zero for this passive device (p. 2–4)
- $h$: specific enthalpy (p. 4)
- $V$: velocity (p. 2–4)
- $A$: cross-sectional area (p. 2–3)
- $\Delta ke$: change in specific kinetic energy (p. 4)
