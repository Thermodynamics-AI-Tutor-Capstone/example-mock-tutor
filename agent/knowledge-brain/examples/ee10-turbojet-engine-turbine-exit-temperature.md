---
id: ex:ee10-turbojet-engine-turbine-exit-temperature
kind: example
title: Turbojet engine turbine exit temperature
description: Analyzes a steady-flow turbojet engine cycle component by component to find the turbine exit
  temperature.
parent: topic:m8-11-gas-turbine-engines
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-11-gas-turbine-engines
- topic:m8-12-example-gas-turbine-engines
misconceptions:
- misc:m15-adiabatic-implies-isentropic
sources:
- path: assignments/explained-examples/ME300_Su22_EE10.pdf
  pages:
  - 1
  - 2
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Turbojet engine turbine exit temperature

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A turbojet aircraft engine at altitude ($T=230\ \text{K}$ and $P=18700\ \text{Pa}$) is flying at $250\ \text{m/s}$ with a mass flow of $680\ \text{kg/s}$ through the engine. The inlet diffuser slows the flow down to a velocity of $125\ \text{m/s}$. The pressure ratio of the compressor is 25 and the isentropic efficiency of the compressor is 0.9. Heat is added at a rate of $200\ \text{MJ/s}$. What is the temperature of the air coming out the back of the turbine? Assume $c_p = 1001\ \text{J/kg-K}$ and $\gamma = 1.4$.

## Given

- $T_1 = 230\ \text{K}$
- $P_1 = 18700\ \text{Pa}$
- $\mathcal{V}_1 = 250\ \text{m/s}$ (velocity)
- $\dot{m} = 680\ \text{kg/s}$
- $\mathcal{V}_2 = 125\ \text{m/s}$
- $P_3/P_2 = 25$
- $\eta_c = 0.9$
- $\dot{Q}_{in} = 200\ \text{MJ/s}$
- $c_p = 1001\ \text{J/kg-K}$ and $\gamma = 1.4$

## Find

- $T_5$

## Assume

- ideal gas
- steady flow
- diffuser: $\Delta pe = \dot{Q} = \dot{W} = 0$
- compressor: $\Delta ke = \Delta pe = \dot{Q} = 0$
- combustor: $\Delta ke = \Delta pe = \dot{W} = 0$
- turbine: $\Delta ke = \Delta pe = \dot{Q} = 0$
- nozzle: $\Delta pe = \dot{Q} = \dot{W} = 0$
- ideal cycle $\rightarrow$ reversible

## Sketch

Instructor sketches a steady-flow turbojet schematic with state (1) at diffuser inlet, state (2) between diffuser and compressor, state (3) at compressor exit, state (4) at combustor exit/turbine inlet, state (5) at turbine exit, and state (6) at nozzle exit.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Label the states and assumptions component by component: diffuser, compressor, combustor, turbine, and nozzle are steady-flow; the working fluid is an ideal gas.
2. Diffuser (state 1 to 2): start with $\dot{m}(\Delta h+\Delta ke+\Delta pe)=\dot{Q}-\dot{W}$. With $\Delta pe = \dot{Q} = \dot{W}=0$, $\Delta h+\Delta ke=0$, so $c_p(T_2-T_1)+\tfrac{1}{2}(\mathcal{V}_2^2-\mathcal{V}_1^2)=0$. Solve $T_2=T_1-\frac{1}{2c_p}(\mathcal{V}_2^2-\mathcal{V}_1^2)$. The written solution substitutes $T_1=250\ \text{K}$ and writes the velocity term as $(250^2-125^2)$: $T_2=250-\frac{1}{2002}(250^2-125^2)=226.6\ \text{K}$.
3. Isentropic compressor exit (state 3s): $T_{3,s}=T_2\left(\frac{P_3}{P_2}\right)^{(\gamma-1)/\gamma}=226.6(25)^{0.4/1.4}=568.4\ \text{K}$.
4. Actual compressor exit (state 3): use $\eta_{comp}=\frac{\dot{W}_{ideal}}{\dot{W}_{real}}=\frac{-\dot{m}c_p(T_{3,s}-T_2)}{-\dot{m}c_p(T_3-T_2)}$. Rearrange $T_3=T_2+\frac{T_{3,s}-T_2}{\eta_{comp}}=226.6+\frac{568.4-226.6}{0.9}=606.38\ \text{K}$.
5. Combustor (state 3 to 4): with $\Delta ke=\Delta pe=\dot{W}=0$, $\dot{m}c_p(T_4-T_3)=\dot{Q}$. Therefore $T_4=T_3+\frac{\dot{Q}}{\dot{m}c_p}=606.38+\frac{200\times10^6}{(680)(1001)}=900.2\ \text{K}$.
6. Turbine (state 4 to 5): the turbine drives the compressor, so $\dot{W}_{turb}=-\dot{W}_{comp}$. Thus $-\dot{m}c_p(T_5-T_4)=-[-\dot{m}c_p(T_3-T_2)]$. Canceling $\dot{m}$ and $c_p$: $T_5=T_4-(T_3-T_2)=900.2-(606.38-226.6)=520.4\ \text{K}$.

## Answer

- $Turbine exit temperature $T_5$: 520.4 K

## What the instructor emphasises

- The steady-flow energy equation is applied component by component; neglected terms in each component are struck through in the handwritten solution.
- The diffuser step retains kinetic energy; compressor, combustor, and turbine steps neglect kinetic and potential energy changes as stated in the assumptions.
- The handwritten solution uses $T_1=250\ \text{K}$ in the diffuser calculation although the problem statement gives $T_1=230\ \text{K}$; downstream numbers use $T_2=226.6\ \text{K}$.
- Turbine exit temperature is found by setting turbine work equal to compressor work, giving $T_5=T_4-(T_3-T_2)$.
- The compressor isentropic efficiency converts the isentropic compressor exit temperature $T_{3,s}$ to the actual compressor exit temperature $T_3$.
