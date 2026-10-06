---
id: ex:m5-06-example-2-energy-conservation
kind: example
title: Energy Conservation with Phase Change in a Rigid Tank
description: 'Worked example: calculate the heat removed from H2O in a rigid tank cooled from 500 K and
  1 MPa to 400 K, using energy conservation and property tables to handle phase change.'
parent: topic:m5-06-example-2-energy-conservation
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.6
topics:
- topic:m5-06-example-2-energy-conservation
misconceptions: []
sources:
- path: lectures/Module5_6_Example2_EnergyConservation_annotated.pptx
  slides:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Energy Conservation with Phase Change in a Rigid Tank

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

H2O is contained in a rigid tank at 500 K and 1 MPa. A cooling coil removes energy from the steam as heat until a final temperature of 400 K is reached. The tank volume is 0.15 m³. Determine the amount of heat removed.

## Given

- $T_1 = 500\ \mathrm{K}$
- $P_1 = 1\ \mathrm{MPa}$
- $T_2 = 400\ \mathrm{K}$
- $\mathcal{V} = 0.15\ \mathrm{m^3}$
- Rigid tank containing H2O

## Find

- Heat removed, ${}_1Q_2$

## Assume

- Closed system: no mass crosses the tank boundary
- Rigid tank, so no boundary work: ${}_1W_2=0$
- Negligible kinetic and potential energy changes: $\Delta KE = \Delta PE = 0$
- Ideal gas is not appropriate; property tables are used for H2O

## Sketch

A cylindrical rigid tank is drawn with a helical cooling coil wrapped around the outside. The coil removes energy as heat from the H2O inside the tank.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Apply energy conservation to the closed system. With $\Delta KE = \Delta PE = 0$ and ${}_1W_2=0$ for the rigid tank, the balance reduces to ${}_1Q_2 = \Delta U = M(u_2-u_1)$ (Slide 4).
2. Determine State 1 from property tables. At $P_1 = 1\ \mathrm{MPa}$, $T_1 = 500\ \mathrm{K}$ is greater than $T_{\text{sat}}$, so State 1 is superheated vapor; tables give $v_1 = 0.22064\ \mathrm{m^3/kg}$ and $u_1 = 2670.6\ \mathrm{kJ/kg}$ (Slides 5, 7).
3. Calculate the mass of H2O in the tank: $M = \mathcal{V}/v_1 = 0.15 / 0.22064 = 0.6798\ \mathrm{kg}$ (Slide 7).
4. Determine State 2. Because the tank is rigid, $v_2 = v_1 = 0.22064\ \mathrm{m^3/kg}$. At $T_2 = 400\ \mathrm{K}$, table values give $v_f < v_2 < v_g$, so State 2 is a saturated mixture (Slide 8).
5. Find the quality at State 2: $x_2 = \frac{v_2-v_f}{v_g-v_f} = 0.3011$ (Slide 8).
6. Calculate $u_2$ from the mixture relation: $u_2 = x_2 u_g + (1-x_2)u_f = 0.3011(2536.2) + 0.6989(532.69) = 1135.9\ \mathrm{kJ/kg}$ (Slide 8).
7. Compute the heat transfer: ${}_1Q_2 = M(u_2-u_1) = 0.6798(1135.9 - 2670.6) = -1043.3\ \mathrm{kJ}$. The negative sign indicates heat is removed from the H2O (Slide 8).

## Answer

- $Heat transfer to the H2O, ${}_1Q_2$: -1043.3 kJ
- Amount of heat removed: 1043.3 kJ

## What the instructor emphasises

- A rigid tank means no boundary work, so ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V} = 0$ (Slide 2).
- Neglecting kinetic and potential energy changes reduces the energy balance to ${}_1Q_2 = \Delta U = M(u_2-u_1)$ (Slide 4).
- For a closed rigid tank, specific volume is constant, so $v_2 = v_1$ (Slide 8).
- Do not treat the H2O as an ideal gas; use property tables to find $v$ and $u$ (Slides 3, 5-8).
- Phase must be checked at each state: State 1 is superheated vapor, while State 2 is a saturated mixture (Slides 5-8).
- For a saturated mixture, use quality $x$ to calculate properties such as $u_2$ (Slide 8).
- A negative ${}_1Q_2$ means heat is removed from the system (Slide 8).
