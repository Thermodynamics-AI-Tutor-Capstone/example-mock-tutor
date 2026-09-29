---
id: topic:m8-07-vapor-compression
kind: topic
title: M8.7 — Vapor Compression
description: 'Vapor-compression refrigeration cycle: components, ideal 1-2-3-4 process paths, T-s diagram,
  component steady-flow energy balances, and refrigeration COP. Open when teaching refrigeration/heat-pump
  cycles.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.7
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify the four components of a vapor-compression refrigeration cycle and the process
    represented by each leg in the loop.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can apply the steady-flow energy balance to the compressor, condenser, expansion valve,
    and evaporator.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can express the refrigeration coefficient of performance as β = Q_L/W.
  kc_type: principle
  bloom: understand
equations:
- eq:entropy-change-reversible-heat
- eq:single-stream-heat-exchanger-energy-balance
- eq:steady-flow-energy-adiabatic-single-stream
- eq:steady-flow-energy-balance
- eq:throttle-enthalpy-equality
misconceptions:
- misc:m15-adiabatic-implies-isentropic
- misc:m17-cop-treated-as-an-efficiency
examples: []
items:
- item:final-2021-a
- item:final-2021-g
- item:final-2021-h
- item:final-2021-i
- item:final-2021-j
- item:final-2022-6
- item:final-2023-5
- item:final-2023-a
- item:final-2023-h
- item:final-2023-i
- item:final-2023-j
- item:hw10-2
sources:
- path: lectures/Module8_7_VaporCompression_annotated.pdf
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

# M8.7 — Vapor Compression

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This slide deck introduces the ideal vapor-compression refrigeration cycle. It shows the four-component loop, labels states 1 through 4, draws the process on a T–s diagram, writes the steady-flow energy balance for each component, and defines the refrigeration coefficient of performance.

## Key ideas

- A vapor-compression cycle connects a compressor, condenser, expansion valve, and evaporator in a closed loop: 1 → 2 → 3 → 4 → 1 (p. 3).
- Process 1–2 is isentropic compression; the annotation specifies adiabatic and reversible, with the working fluid as vapor (p. 3).
- Process 2–3 is isobaric heat rejection in the condenser, taking vapor to liquid (p. 3).
- Process 3–4 is expansion through the valve, with $h_3 = h_4$; the fluid goes from liquid to mixture (p. 3).
- Process 4–1 is isobaric heat addition in the evaporator, taking mixture to vapor (p. 3).
- On the T–s diagram, compression appears as a vertical rise, condensation as a horizontal segment, expansion as a dotted path, and evaporation as a horizontal return; heat rejection is greater than heat addition, and reversible heat transfer is $\delta Q = T\,ds\big|_{\mathrm{rev}}$ (p. 4).
- Energy balances reduce for each component: compressor, condenser, expansion valve, and evaporator; these combine to give $\beta = \dot{Q}_L/\dot{W} = {}_4\dot{Q}_1/\left|{}_1\dot{W}_2\right|$ (p. 5).

## Notation used

- $\beta$: refrigeration coefficient of performance (p. 2).
- $\dot{Q}_L$, $\dot{Q}_H$, $\dot{Q}_{\mathrm{in}}$, $\dot{Q}_{\mathrm{out}}$: low- and high-temperature or component heat transfer rates (pp. 2–4).
- ${}_1\dot{W}_2$: compressor work input between states 1 and 2 (p. 5).
- ${}_2\dot{Q}_3$ and ${}_4\dot{Q}_1$: condenser and evaporator heat transfer rates between the indicated states (p. 5).

## What students get wrong here

- Do not call process 1–2 isentropic simply because it is adiabatic. The slide makes it isentropic by requiring adiabatic and reversible compression; adiabatic alone would not be enough (p. 3).
- Do not treat the refrigeration coefficient of performance as a cycle efficiency. This lecture defines it as the low-temperature heat transfer rate divided by work input: $\beta = \dot{Q}_L/\dot{W}$ (p. 2, p. 5).
