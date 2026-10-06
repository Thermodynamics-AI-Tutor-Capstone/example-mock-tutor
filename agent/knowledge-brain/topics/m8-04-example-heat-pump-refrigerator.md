---
id: topic:m8-04-example-heat-pump-refrigerator
kind: topic
title: M8.4 — Example Heat Pump Refrigerator
description: Use when students work the heat-pump house-heating example or ask how minimum power relates
  to maximum COP; the lecture computes the Carnot COP and the minimum input power.
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.4
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can explain why minimum input power requires the maximum, not minimum, COP for a heat
    pump.
  kc_type: principle
  bloom: understand
- id: '#o2'
  text: Students can compute the Carnot heat-pump COP from absolute hot- and cold-reservoir temperatures.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can calculate the minimum power required to meet a steady heating load.
  kc_type: skill
  bloom: apply
equations:
- eq:carnot-heat-pump-cop
- eq:heat-pump-cop
- eq:minimum-heat-pump-input-power
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
examples:
- ex:ee09-combined-engine-refrigerator-cycle-ratio-of-heat-i
- ex:m8-04-example-heat-pump-refrigerator
items:
- item:final-2021-1
- item:final-2023-1
- item:hw09-3
- item:hw09-4
sources:
- path: lectures/Module8_4_Example_HeatPumpRefrigerator_annotated.pdf
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

# M8.4 — Example Heat Pump Refrigerator

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This is a one-example lecture. It sets up a heat pump heating a house at constant $T_H$ with a steady heat loss, asks whether minimum power needs minimum or maximum COP, then computes the Carnot COP and the minimum power (p. 2–4).

## Key ideas

- The house is at constant temperature, so the heat pump must balance the steady loss: $\dot{Q}_H = \dot{Q}_{loss} = 30\ \text{kW}$ (p. 2).
- Convert both temperatures to absolute before using the Carnot relation: $T_H = 20.3^\circ\text{C} = 293.45\ \text{K}$ and $T_L = -10^\circ\text{C} = 263.15\ \text{K}$ (p. 2).
- The slide poses the key concept question: minimum power requires maximum COP, not minimum COP (p. 3).
- The best possible COP is the Carnot COP: $\beta_{\max} = \beta_{\mathrm{Carnot}} = \frac{T_H}{T_H - T_L}$ (p. 4).
- With $\beta_{\max} = 9.68$, the minimum input power is $\dot{W}_{\min} = 30/9.68 = 3.1\ \text{kW}$ (p. 4).
- Caution on the page 4 annotation: the handwritten denominator reads $293.45 - 268.15$, but the page 2 conversion gives $T_L = 263.15\ \text{K}$; the stated $9.68$ and final answer follow from $263.15\ \text{K}$.

## Notation used

- $\beta$: heat-pump coefficient of performance, $\dot{Q}_H/\dot{W}$.
- $\dot{Q}_H$: heat rate delivered to the house.
- $\dot{Q}_{loss}$: steady heat-loss rate through the roof.
- $\dot{W}$: power input to the heat pump; the figure on p. 2 labels the same input arrow as $\dot{P}$.
- $T_H$, $T_L$: absolute hot- and cold-reservoir temperatures.
- $\beta_{\max}$, $\beta_{\mathrm{Carnot}}$: maximum/Carnot heat-pump COP.

## Examples in this lecture

- House heated by a Carnot heat pump: given $\dot{Q}_{loss} = 30\ \text{kW}$, $T_H = 20.3^\circ\text{C}$, and $T_L = -10^\circ\text{C}$; demonstrates steady heat balance, conversion to kelvin, Carnot COP, and the minimum-power calculation (p. 2, 4).

## What students get wrong here

- The lecture explicitly asks whether minimum power corresponds to minimum or maximum COP; the correct answer is maximum COP, so students should not pair "minimum power" with "minimum COP" (p. 3).
