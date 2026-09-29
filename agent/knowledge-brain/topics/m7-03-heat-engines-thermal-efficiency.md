---
id: topic:m7-03-heat-engines-thermal-efficiency
kind: topic
title: M7.3 — Heat Engines Thermal Efficiency
description: 'Introduces cyclic heat engines through the Kelvin-Planck implication: net work equals heat
  added minus heat rejected, and thermal efficiency cannot reach 1 because heat is rejected to the low-temperature
  reservoir. Open when tutoring heat-engine efficiency or cyclic devices.'
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.3
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can calculate net work or heat rejection for a cyclic heat engine using Q_H = W_net +
    Q_L.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can compute thermal efficiency from Q_H and Q_L or from W_net and Q_H.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can explain why the thermal efficiency of a cyclic heat engine cannot equal 1.
  kc_type: principle
  bloom: understand
equations:
- eq:heat-engine-energy-balance
- eq:thermal-efficiency
misconceptions:
- misc:m02-entropy-and-the-second-law
- misc:m09-friction-is-the-only-efficiency-limit
examples: []
items:
- item:exam2-2021-i-1
- item:exam2-2021-ii-2
- item:exam2-2022-i-1
- item:exam2-2022-ii-2a-2d
- item:exam2-2023-i-1
- item:exam2-2023-ii-2
- item:hw07-5
- item:hw07-6
sources:
- path: lectures/Module7_3_HeatEnginesThermalEfficiency_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M7.3 — Heat Engines Thermal Efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This short deck defines a heat engine as a cyclically operating device. It writes the cycle energy balance and introduces thermal efficiency, then checks whether the efficiency can equal 1.

## Key ideas

- A heat engine is a cycle that receives heat $Q_H$ from a high-temperature reservoir, produces net work $W_{net}$, and rejects heat $Q_L$ to a low-temperature reservoir (p. 2).
- The slide title places this arrangement in the context of the Kelvin-Planck statement, so heat rejection is part of the cyclic heat-engine model, not an avoidable afterthought (p. 2).
- Energy conservation around the cycle gives $Q_H = W_{net} + Q_L$, so $W_{net} = Q_H - Q_L$ (p. 3).
- The Stirling engine drawing shows the physical locations of $Q_H$, $W_{net}$, and $Q_L$: heating at one end, work through the power piston, and cooling/rejection at the other end (p. 4).
- Thermal efficiency is net work divided by heat input: $\eta_{th}=W_{net}/Q_H$. Substituting the energy balance gives $\eta_{th}=1-Q_L/Q_H$ (p. 5).
- The clicker answer is No: thermal efficiency cannot equal 1 for a cyclic heat engine. That means $Q_L$ cannot be zero in this cycle model (p. 6).

## Notation used

- $Q_H$: heat addition from the high-temperature reservoir
- $Q_L$: heat rejection to the low-temperature reservoir
- $W_{net}$: net work output from the cycle
- $\eta_{th}$: thermal efficiency

## Examples in this lecture

- Stirling engine schematic: identifies $Q_H$, $W_{net}$, and $Q_L$ in a device geometry (p. 4).
- Clicker question "Can the thermal efficiency ever be equal to 1?": annotated answer is No, reinforcing that a cyclic heat engine must reject heat (p. 6).

## What students get wrong here

- A common mistake is to set $Q_L=0$ and claim $\eta_{th}=1$. The marked clicker answer corrects this: for a cyclic heat engine, the answer is No (p. 6).
