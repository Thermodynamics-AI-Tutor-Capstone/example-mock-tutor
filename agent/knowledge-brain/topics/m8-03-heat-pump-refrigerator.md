---
id: topic:m8-03-heat-pump-refrigerator
kind: topic
title: M8.3 — Heat Pump Refrigerator
description: Covers heat pump and refrigerator energy balances, COP definitions and Carnot COP expressions,
  plus two worked COP examples.
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.3
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: State the heat-pump and refrigerator COP definitions and identify the desired energy in each case.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Apply the energy balance and the appropriate COP definition to find an unknown heat or work rate.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Interpret COP values, including values greater than 1, as ratios of desired energy transfer to
    input energy.
  kc_type: principle
  bloom: understand
equations:
- eq:carnot-heat-pump-cop
- eq:carnot-refrigerator-cop
- eq:cop-definition
- eq:heat-pump-cop
- eq:heat-pump-refrigerator-energy-balance
- eq:refrigerator-cop
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
examples:
- ex:ee09-combined-engine-refrigerator-cycle-ratio-of-heat-i
items:
- item:final-2021-1
- item:final-2022-1
- item:final-2022-3
- item:final-2023-1
- item:hw09-3
- item:hw09-4
sources:
- path: lectures/Module8_3_HeatPumpRefrigerator_annotated.pdf
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

# M8.3 — Heat Pump Refrigerator

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This slide deck introduces heat pumps and refrigerators as cycles that use work input to move heat from a low-temperature region to a high-temperature region. It states the common energy balance, defines the coefficient of performance for each device, gives the Carnot COP expressions, and works one heat-pump and one refrigerator example. The examples use rate notation $\dot{Q}$ and electrical power $\mathcal{P}$.

## Key ideas

- A heat pump’s goal is to heat the high-temperature space, so the desired energy is $Q_H$; its COP is $\beta_{\text{heat pump}} = Q_H / W_{in}$ (p. 2).
- A refrigerator’s goal is to remove heat from the cold space, so the desired energy is $Q_L$; its COP is $\beta_{\text{frig}} = Q_L / W_{in}$ (p. 4).
- Both devices obey the same energy conservation: $Q_H = W_{in} + Q_L$ (p. 2).
- The Carnot COP expressions are $\beta_{\text{Carnot, heat pump}} = T_H/(T_H - T_L)$ and $\beta_{\text{Carnot, frig}} = T_L/(T_H - T_L)$ (p. 2 and p. 4), but the slide does not derive them.
- In the worked heat-pump example, $\dot{Q}_H = 13.37$ kW and $\dot{Q}_L = 10.05$ kW give $\mathcal{P} = 3.32$ kW and $\beta = 4.03$ (p. 5).
- In the worked refrigerator example, $\beta = 4.2$ and $\mathcal{P} = 700$ W give $\dot{Q}_L = 2.94$ kW and $\dot{Q}_H = 3.64$ kW (p. 6).

## Notation used

- $\beta$: coefficient of performance.
- $Q_H$: heat transfer to the high-temperature reservoir/space; $\dot{Q}_H$ is its rate.
- $Q_L$: heat transfer from the low-temperature reservoir/space; $\dot{Q}_L$ is its rate.
- $W_{in}$: work input to the cycle.
- $\mathcal{P}$: electrical power input used in the examples.
- $T_H$ and $T_L$: high- and low-temperature reservoir temperatures.

## Examples in this lecture

- Heat pump example: given a residential ground-source heat pump that delivers 13.37 kW to the house and removes 10.05 kW from the ground, find the electrical power required and the COP. Demonstrates the energy balance and heat-pump COP (p. 5).
- Refrigerator example: given a refrigerator COP of 4.2 and an electrical input of 700 W, find the cold-space heat-transfer rate and the heat-rejection rate. Demonstrates refrigerator COP and watt-to-kilowatt conversion (p. 6).
