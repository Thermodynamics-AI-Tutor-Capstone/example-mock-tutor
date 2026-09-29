---
id: ex:m8-10-example-brayton-cycle
kind: example
title: 'Ideal Brayton cycle: gas turbine efficiency and net power'
description: 'Worked example: ideal Brayton cycle gas turbine with steady mass flow 30 kg/s, inlet temperature
  300 K, maximum temperature 1050 K, and pressure ratio 8.5; find the thermal efficiency and net power.'
parent: topic:m8-10-example-brayton-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-10-example-brayton-cycle
misconceptions: []
sources:
- path: lectures/Module8_10_Example_BraytonCycle_annotated.pdf
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

# Ideal Brayton cycle: gas turbine efficiency and net power

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A gas turbine running an ideal Brayton cycle has a steady mass flow of 30 kg/s. The inlet temperature is 300 K and the max temperature is 1050 K. If the pressure ratio of the cycle is 8.5, determine the thermal efficiency and the net power produced.

## Given

- Ideal Brayton cycle gas turbine
- Steady mass flow: $\dot{m}=30$ kg/s
- Inlet temperature: $T_1=300$ K
- Maximum temperature: $T_{max}=1050$ K
- Pressure ratio: $P_2/P_1=8.5$

## Find

- Thermal efficiency $\eta_{th}$
- Net power $\dot{W}_{net}$

## Assume

- Air standard analysis
- Ideal Brayton cycle (ideal / reversible processes)
- Steady-flow, quasi-steady operation

## Sketch

Turbofan jet engine photo introduces the gas-turbine application. Instructor marks cycle states 1→2→3→4→1 and identifies $T_3$ as the maximum temperature.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Use the ideal Brayton-cycle efficiency formula (Page 3): $\eta_{th}=1-\mathrm{OPR}^{(1-\gamma)/\gamma}$. With $\gamma=1.4$ and $\mathrm{OPR}=8.5$, $\eta_{th}=1-(8.5)^{-0.4/1.4}=0.46$.
2. Identify the highest temperature in the cycle as $T_3$, so $T_3=1050$ K (Page 4).
3. For the isentropic process 1→2, $\Delta s=0$: $T_1 P_1^{(1-\gamma)/\gamma}=T_2 P_2^{(1-\gamma)/\gamma}$. Solve: $T_2=T_1(P_2/P_1)^{(\gamma-1)/\gamma}=300(8.5)^{0.4/1.4}=553$ K (Page 5).
4. For the isentropic process 3→4, $\Delta s=0$: $T_3 P_3^{(1-\gamma)/\gamma}=T_4 P_4^{(1-\gamma)/\gamma}$. With $P_3=8.5P_1$ and $P_4=P_1$, $T_4=1050(1/8.5)^{0.4/1.4}=570$ K (Page 5).
5. Use steady-flow ideal-gas work with $c_p=1001$ J/kg-K (Page 5). Compressor power: ${}_1\dot{W}_2=-\dot{m}c_p(T_2-T_1)=-(30)(1001)(553-300)=-7.6\ \mathrm{MW}$; the annotated page writes $-7.5\ \mathrm{MW}$, but the multiplication gives $-7.6\ \mathrm{MW}$ (Page 6).
6. Turbine power: ${}_3\dot{W}_4=-\dot{m}c_p(T_4-T_3)=-(30)(1001)(570-1050)=14.4\ \mathrm{MW}$ (Page 6).
7. Net power: $\dot{W}_{net}={}_1\dot{W}_2+{}_3\dot{W}_4=-7.6+14.4=6.8\ \mathrm{MW}$ (Page 6).

## Answer

- $Thermal efficiency, $\eta_{th}$: 0.46 dimensionless
- $Net power, $\dot{W}_{net}$: 6.8 MW

## What the instructor emphasises

- For an ideal Brayton cycle, thermal efficiency is determined by the pressure ratio alone under the air-standard/constant-$\gamma$ model.
- The maximum cycle temperature is $T_3$, not $T_2$ or $T_4$.
- The two isentropic relations are used with $\Delta s=0$ to find $T_2=553$ K and $T_4=570$ K.
- Each steady-flow work term is calculated from $\dot{W}=-\dot{m}c_p\Delta T$; the net power is the algebraic sum of turbine and compressor powers.
- Small arithmetic slip on the slide: $30(1001)(553-300)=7.6$ MW, not 7.5 MW; unrounded values give the boxed 6.8 MW.
