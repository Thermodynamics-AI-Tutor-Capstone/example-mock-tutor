---
id: ex:m8-04-example-heat-pump-refrigerator
kind: example
title: Minimum power for a Carnot heat pump heating a house
description: Find the minimum power input for a heat pump that maintains a house at 20.3°C while it loses
  30 kW to -10°C outside air, using the maximum Carnot COP.
parent: topic:m8-04-example-heat-pump-refrigerator
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-04-example-heat-pump-refrigerator
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
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

# Minimum power for a Carnot heat pump heating a house

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A heat pump is used to heat a house. The outside air is $T = -10^\circ\text{C}$ and the inside is a constant $20.3^\circ\text{C}$. The heat loss through the roof of the house is a steady $30\ \text{kW}$. Determine the minimum power required to run a heat pump to keep the house at this temperature.

## Given

- Outside air temperature $T_L = -10^\circ\text{C} = 263.15\ \text{K}$
- Indoor temperature $T_H = 20.3^\circ\text{C} = 293.45\ \text{K}$
- Steady roof heat loss $\dot{Q}_{loss} = 30\ \text{kW}$

## Find

- Minimum power required $\dot{W}_{min}$

## Assume

- The house is held at constant indoor temperature $T_H = 20.3^\circ\text{C}$.
- Steady operation, so $\dot{Q}_H = \dot{Q}_{loss} = 30\ \text{kW}$.
- Minimum power corresponds to the maximum COP, $\beta_{max} = \beta_{Carnot}$.

## Sketch

A house is drawn with a wavy arrow $\dot{Q}_{loss}=30\ \text{kW}$ leaving it. A heat pump circle below receives $\dot{Q}_L$ from the ground, receives power $\dot{P}$ from the right, and delivers $\dot{Q}_H$ upward into the house.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Write the two reservoir temperatures in kelvin: $T_H = 20.3^\circ\text{C} = 293.45\ \text{K}$ and $T_L = -10^\circ\text{C} = 263.15\ \text{K}$ (p. 2).
2. Because the indoor temperature is constant, the heat-pump heat delivery balances the steady roof loss: $\dot{Q}_H = \dot{Q}_{loss} = 30\ \text{kW}$ (p. 2).
3. For minimum required power, use the maximum possible COP. The slide asks whether minimum power requires minimum or maximum COP; the Carnot COP is the maximum: $\beta_{max} = \beta_{Carnot} = \frac{T_H}{T_H - T_L}$ (p. 3, p. 4).
4. Substitute the Kelvin temperatures: $\beta_{max} = \frac{293.45\ \text{K}}{293.45\ \text{K} - 263.15\ \text{K}} = 9.68$ (p. 4). The page image writes $268.15\ \text{K}$ in the denominator, but the computed value uses $263.15\ \text{K}$.
5. Use the COP definition $\beta = \dot{Q}_H/\dot{W}$ to get the minimum power: $\dot{W}_{min} = \frac{\dot{Q}_H}{\beta_{max}} = \frac{30\ \text{kW}}{9.68} = 3.1\ \text{kW}$ (p. 4).

## Answer

- Maximum coefficient of performance: 9.68 dimensionless
- Minimum required power input: 3.1 kW

## What the instructor emphasises

- Minimum power requires the maximum COP, not the minimum COP (p. 3).
- Temperatures in the Carnot COP expression must be absolute temperatures, so both are converted to kelvin (p. 2).
- For a house held at constant temperature, $\dot{Q}_H$ is set equal to the steady heat loss, $30\ \text{kW}$ (p. 2).
- The Carnot COP gives an upper limit; using it gives the minimum possible power input (p. 4).
- Note the handwritten denominator on Page 4 lists $268.15\ \text{K}$, but Page 2 lists $T_L = 263.15\ \text{K}$; the numeric COP follows $263.15\ \text{K}$.
