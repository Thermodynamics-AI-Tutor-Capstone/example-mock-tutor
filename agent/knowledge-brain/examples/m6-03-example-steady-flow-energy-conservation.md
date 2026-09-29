---
id: ex:m6-03-example-steady-flow-energy-conservation
kind: example
title: Steady-Flow Energy Equation for an Adiabatic Steam Turbine
description: Given the inlet and exit states of an adiabatic steam turbine, use the steady-flow energy
  equation with negligible kinetic and potential energy changes to compute the power produced.
parent: topic:m6-03-example-steady-flow-energy-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.6
topics:
- topic:m6-03-example-steady-flow-energy-conservation
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
sources:
- path: lectures/Module6_3_Example_SteadyFlowEnergyConservation_annotated.pdf
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

# Steady-Flow Energy Equation for an Adiabatic Steam Turbine

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Steam enters a turbine at $P_1=10$ MPa and $T_1=780$ K and leaves at $T_2=320$ K with quality $x_2=0.88$. The turbine operates at steady flow with negligible kinetic and potential energy changes and is adiabatic. The mass flow rate is $\dot{m}=38.7$ kg/s. Find the power produced.

## Given

- $P_1=10$ MPa, $T_1=780$ K
- $T_2=320$ K, $x_2=0.88$
- $\dot{m}=38.7$ kg/s, as used in the slide 5 calculation; the slide 2 annotation is transcribed as 58.7 kg/s
- Adiabatic, steady flow, $\Delta ke = \Delta pe = 0$

## Find

- Turbine power output $\dot{W}$

## Assume

- steady-flow
- S.C.S.
- $\Delta ke = \Delta pe = 0$
- $\dot{Q}=0$
- turbine produces work

## Sketch

Turbine sketched as a rounded trapezoid/triangle with inlet state ① on the left and outlet state ② at the upper-right; an additional exit arrow is shown on the right side.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Write the steady-flow energy equation for a single-inlet/single-exit turbine with negligible kinetic and potential energy changes and adiabatic operation: $\dot{m}(\Delta h+\cancel{\Delta ke}+\cancel{\Delta pe})=\cancel{\dot{Q}}-\dot{W}$, so $\dot{m}\Delta h=-\dot{W}$ and $\dot{W}=-\dot{m}(h_2-h_1)$.
2. Determine state 1: at $10$ MPa and $780$ K, $T>T_{sat}$, so the steam is superheated vapor; use table D.3 at $10$ MPa to get $h_1=3392.8$ kJ/kg.
3. Determine state 2: at $T_2=320$ K and $x_2=0.88$, the steam is a saturated mixture; use table D.1: $h_2=x_2h_g+(1-x_2)h_f=(0.88)(2585.7)+(0.12)(196.17)=2298.96$ kJ/kg.
4. Substitute into the work expression: $\dot{W}=-(38.7)(2298.96-3392.8)$.
5. Calculate: $\dot{W}=42331.6$ kJ/s $=42331.6$ kW.

## Answer

- Turbine power output: 42331.6 kW

## What the instructor emphasises

- The instructor cancels $\dot{Q}$ and the kinetic and potential energy terms before solving, leaving $\dot{W}=-\dot{m}(h_2-h_1)$.
- For a turbine, the enthalpy drop across the machine is converted to work; the sign convention makes $\dot{W}$ positive when $h_2<h_1$.
- Property tables are used twice: once for the superheated vapor inlet (D.3) and once for the two-phase mixture exit (D.1 with quality $x_2$).
- The slide 2 annotations show $58.7$ kg/s and $520$ K, but slide 5 explicitly uses $38.7$ kg/s and $320$ K; the calculation follows slide 5.
