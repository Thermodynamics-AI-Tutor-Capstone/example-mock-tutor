---
id: topic:m6-06-heat-exchangers
kind: topic
title: M6.6 — Heat Exchangers
description: 'Introduces steady-flow heat exchangers: no work, negligible KE/PE, no heat loss to surroundings,
  and the hot/cold stream enthalpy balance.'
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.6
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can apply the steady-flow energy balance to a heat exchanger by setting work and kinetic/potential
    energy changes to zero.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can write the two-stream energy balance relating hot and cold stream enthalpy changes.
  kc_type: skill
  bloom: apply
equations:
- eq:single-stream-heat-exchanger-energy-balance
- eq:two-stream-heat-exchanger-energy-balance
misconceptions: []
examples:
- ex:ee04-steady-flow-energy-equation-for-a-hair-dryer-heat
items:
- item:exam2-2022-iii-a-3e
- item:exam2-2023-iii
- item:hw07-1
sources:
- path: lectures/Module6_6_HeatExchangers_annotated.pdf
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

# M6.6 — Heat Exchangers

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This short lecture introduces the steady-flow heat exchanger as a control volume in which two fluid streams exchange heat. The annotations reduce the steady-flow energy equation to a two-stream enthalpy balance.

## Key ideas
- A heat exchanger is treated as a steady-flow control volume; the handwritten assumptions are $\dot{W}=0$, $\Delta ke=0$, $\Delta pe=0$, and no heat lost to the surroundings (p. 3).
- Applying these assumptions gives $\dot{m}\Delta h = \dot{Q}$ for each stream (p. 3).
- The heat leaving the hot stream is equal and opposite to the heat entering the cold stream: $\dot{Q}_{in,fluid1} = -\dot{Q}_{out,fluid2}$ (p. 3).
- Combining the hot and cold stream balances gives $\dot{m}_h(h_{h2}-h_{h1}) = -\dot{m}_c(h_{c2}-h_{c1})$ (p. 3).
- The slide shows a shell-and-tube heat exchanger with labelled steam and process fluid inlets and outlets, illustrating the two-stream geometry (p. 2).

## Notation used
- $\dot{m}$: mass flow rate
- $\dot{Q}$: heat transfer rate
- $\dot{W}$: power
- $h$: specific enthalpy
- $\Delta ke$, $\Delta pe$: kinetic and potential energy changes in the handwritten energy equation
- subscripts $h$, $c$: hot and cold streams; subscripts 1, 2: inlet and outlet
