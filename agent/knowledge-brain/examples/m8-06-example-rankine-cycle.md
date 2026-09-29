---
id: ex:m8-06-example-rankine-cycle
kind: example
title: 'Rankine cycle example: nonideal pump and turbine'
description: Given a Rankine cycle with specified states and isentropic pump/turbine efficiencies, fill
  the state properties and compute pump work, boiler/condenser heat, turbine work, net work, and thermal
  efficiency.
parent: topic:m8-06-example-rankine-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-06-example-rankine-cycle
misconceptions:
- misc:m15-adiabatic-implies-isentropic
sources:
- path: lectures/Module8_6_Example_RankineCycle_annotated.pdf
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

# Rankine cycle example: nonideal pump and turbine

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Rankine cycle with a mass flow of $\dot{m}=25\ \mathrm{kg/s}$ and the following isentropic efficiencies: $\eta_{isen,t}=0.93$ (turbine), $\eta_{isen,p}=0.85$ (pump). Fill in the state table and calculate the $W_{pump}$, $Q_{boiler}$, $W_{turbine}$, $\dot{W}_{net}$, $Q_{condenser}$, and the overall thermal efficiency.

| State | T (K) | P (MPa) |
|---|---|---|
| 1 | 290 | 0.15 |
| 2 | | 20 |
| 3 | 990 | 19.5 |
| 4 | | 0.2 |

## Given

- $\dot{m}=25\ \mathrm{kg/s}$
- $\eta_{isen,t}=0.93$ (turbine)
- $\eta_{isen,p}=0.85$ (pump)
- State 1: $T_1=290\ \mathrm{K}$, $P_1=0.15\ \mathrm{MPa}$
- State 2: $P_2=20\ \mathrm{MPa}$
- State 3: $T_3=990\ \mathrm{K}$, $P_3=19.5\ \mathrm{MPa}$
- State 4: $P_4=0.2\ \mathrm{MPa}$

## Find

- State properties $h_1, s_1, h_2, h_3, s_3, h_4$
- Ideal isentropic states $T_{2s}, h_{2s}, x_{4s}, h_{4s}$
- $\dot{W}_{pump}$, $\dot{Q}_{boiler}$, $\dot{W}_{turbine}$, $\dot{W}_{net}$, $\dot{Q}_{condenser}$
- Overall thermal efficiency $\eta_{th}$

## Assume

- S.C.S.
- steady-flow
- quasi-equilibrium
- $\Delta KE = \Delta PE = 0$

## Sketch

T-s diagram: saturation dome with states 1 and 2 on a left dashed vertical line and states 3 and 4 on a right dashed vertical line; process paths are 1→2 upward, 2→3 to the right, 3→4 downward, and 4→1 to the left.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. State 1: At $P_1=0.15\ \mathrm{MPa}$ and $T_1=290\ \mathrm{K}$, $P_{sat}=1.92\ \mathrm{kPa}$. Since $P_1>P_{sat}$, state 1 is liquid. NIST gives $h_1=70.7\ \mathrm{kJ/kg}$ and $s_1=0.25\ \mathrm{kJ/(kg\cdot K)}$. (p. 3)
2. State 2s: For the ideal pump, $P_2=20\ \mathrm{MPa}$ and $s_{2s}=s_1=0.25\ \mathrm{kJ/(kg\cdot K)}$. From Table D.2, $s_{2s}<s_f$, so state 2s is liquid. NIST gives $T_{2s}=290.26\ \mathrm{K}$ and $h_{2s}=90.654\ \mathrm{kJ/kg}$. (p. 3)
3. Actual pump exit: $\eta_p=\frac{\dot{W}_{ideal}}{\dot{W}_{real}}=\frac{h_{2s}-h_1}{h_2-h_1}$. Solving, $h_2=\frac{h_{2s}-h_1}{\eta_p}+h_1=\frac{90.654-70.7}{0.85}+70.7=94.175\ \mathrm{kJ/kg}$. (p. 3)
4. State 3: At $P_3=19.5\ \mathrm{MPa}$ and $T_3=990\ \mathrm{K}$, $T_3>T_{sat}$, so state 3 is vapor. NIST gives $h_3=3854.9\ \mathrm{kJ/kg}$ and $s_3=6.858\ \mathrm{kJ/(kg\cdot K)}$. (p. 4)
5. State 4s: For the ideal turbine, $P_4=0.2\ \mathrm{MPa}$ and $s_{4s}=s_3=6.858\ \mathrm{kJ/(kg\cdot K)}$. From D.2, state 4s is a mixture. $x_{4s}=\frac{s_{4s}-s_f}{s_g-s_f}=0.952$. Then $h_{4s}=x_{4s}h_g+(1-x_{4s})h_f=2600.5\ \mathrm{kJ/kg}$. (p. 4)
6. Actual turbine exit: $\eta_{turb}=\frac{\dot{W}_{real}}{\dot{W}_{ideal}}=\frac{h_4-h_3}{h_{4s}-h_3}$. Solving, $h_4=\eta_{turb}(h_{4s}-h_3)+h_3=0.93(2600.5-3854.9)+3854.9=2688.308\ \mathrm{kJ/kg}$. (p. 4)
7. Cycle work and heat: $\dot{W}_{pump}=-\dot{m}(h_2-h_1)=-25(94.18-70.7)=-584.3\ \mathrm{kW}$; $\dot{W}_{turb}=-\dot{m}(h_4-h_3)=-25(2688.3-3854.9)=29215\ \mathrm{kW}$; $\dot{Q}_{in}=\dot{m}(h_3-h_2)=25(3854.9-94.18)=94019\ \mathrm{kW}$; $\dot{Q}_{out}=\dot{m}(h_1-h_4)=25(70.7-2688.3)=-65386\ \mathrm{kW}$. (p. 6)
8. Thermal efficiency: $\eta_{th}=\frac{\dot{W}_{pump}+\dot{W}_{turb}}{\dot{Q}_{in}}$, giving $\eta_{th}=0.3$. (p. 6)

## Answer

- $h_1$: 70.7 kJ/kg
- $s_1$: 0.25 kJ/(kg·K)
- $T_{2s}$: 290.26 K
- $h_{2s}$: 90.654 kJ/kg
- $h_2$: 94.175 kJ/kg
- $h_3$: 3854.9 kJ/kg
- $s_3$: 6.858 kJ/(kg·K)
- $x_{4s}$: 0.952
- $h_{4s}$: 2600.5 kJ/kg
- $h_4$: 2688.308 kJ/kg
- $\dot{W}_{pump}$: -584.3 kW
- $\dot{W}_{turbine}$: 29215 kW
- $\dot{Q}_{boiler} = \dot{Q}_{in}$: 94019 kW
- $\dot{Q}_{condenser} = \dot{Q}_{out}$: -65386 kW
- $\eta_{th}$: 0.3

## What the instructor emphasises

- For the compressed-liquid states, compare $P$ with $P_{sat}$ for the given $T$ before choosing property tables or NIST.
- Find the ideal isentropic pump/turbine outlet first ($2s$ or $4s$) and then use the isentropic efficiency to compute the actual outlet enthalpy.
- At state 4s, use entropy to determine quality: $x=(s-s_f)/(s_g-s_f)$.
- Sign convention: pump work is negative, turbine work is positive, and condenser heat rejection is negative.
- The slide arithmetic as transcribed has small inconsistencies with the displayed enthalpy values; use the stated equations and state values rather than relying on the rounded intermediate numbers.
