---
id: ex:m5-07-example-3-energy-conservation
kind: example
title: 'Three-process air cycle: energy conservation and cycle analysis'
description: Calculate P, v, T, work, heat, and internal energy change for each process of an air cycle,
  then compute net work and thermal efficiency.
parent: topic:m5-07-example-3-energy-conservation
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.6
topics:
- topic:m5-07-example-3-energy-conservation
misconceptions:
- misc:m11-state-function-vs-path-function
- misc:m13-work-read-off-a-pv-diagram
sources:
- path: lectures/Module5_7_Example3_EnergyConservation_annotated.pptx
  slides:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
  - 10
  - 11
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Three-process air cycle: energy conservation and cycle analysis

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A 1-kg air system undergoes a cycle: 1-2 isobaric heat addition, 2-3 isochoric heat removal, 3-1 isothermal heat removal. Given $T_1=300$ K, $P_1=0.2$ MPa, $T_2=800$ K, $M=1$ kg, $R=287$ J/kg-K, $c_v=720$ J/kg-K. Calculate $P$, $v$, and $T$ at each state, work and heat for each process, change in internal energy for each process, net work, and thermal efficiency.

## Given

- Working fluid: air
- $M=1$ kg
- $T_1=300$ K
- $P_1=0.2$ MPa
- $T_2=800$ K
- $R=287$ J/kg-K
- $c_v=720$ J/kg-K (solution value; slide notation appears cut off)
- Processes: 1-2 isobaric heat addition; 2-3 isochoric heat removal; 3-1 isothermal heat removal

## Find

- $P$, $v$, $T$ at each state point
- ${}_1W_2$, ${}_2W_3$, ${}_3W_1$
- ${}_1Q_2$, ${}_2Q_3$, ${}_3Q_1$
- $\Delta U_{12}$, $\Delta U_{23}$, $\Delta U_{31}$
- $W_{net}$ and $\eta_{th}$

## Assume

- Quasi-equilibrium processes
- $\Delta KE = \Delta PE = 0$
- Ideal gas
- Constant specific heat $c_v$

## Sketch

Instructor draws a $P$-$\mathcal{V}$ diagram with state 1 at $(v_1, P_1)$, state 2 at $(v_2, P_2=P_1)$ to the right, and state 3 at $(v_3=v_2, P_3)$ below; path 1-2 is horizontal right, 2-3 is vertical down, and 3-1 follows the $T_1=T_3$ isotherm back to state 1, enclosing a positive area labeled power cycle.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Assume quasi-equilibrium, ideal gas, $\Delta KE=\Delta PE=0$, and constant $c_v$. Draw the cycle as a closed loop on a $P$-$\mathcal{V}$ diagram; since 3-1 is isothermal, $T_3=T_1=300$ K.
2. Use the ideal-gas law to find the total volumes at states 1 and 2. $\mathcal{V}_1=\frac{MRT_1}{P_1}=\frac{(1)(287)(300)}{200000}=0.431$ m$^3$. $\mathcal{V}_2=\frac{MRT_2}{P_2}=\frac{(1)(287)(800)}{200000}=1.148$ m$^3$, with $P_2=P_1=0.2$ MPa.
3. For state 3, 2-3 is isochoric so $\mathcal{V}_3=\mathcal{V}_2=1.148$ m$^3$; 3-1 is isothermal so $T_3=T_1=300$ K. The slide's $P_3$ entry is illegible; the ideal-gas relation gives $P_3=MRT_3/\mathcal{V}_3=(1)(287)(300)/1.148=75{,}000$ Pa.
4. Process 1-2, isobaric: $\Delta U_{12}=M c_v(T_2-T_1)=(1)(720)(800-300)=360000$ J. Boundary work is ${}_1W_2=\int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V}=200000(1.148-0.431)=143400$ J. First law: ${}_1Q_2=\Delta U_{12}+{}_1W_2=360000+143400=503400$ J.
5. Process 2-3, isochoric: ${}_2W_3=\int_2^3 P\,d\mathcal{V}=0$. $\Delta U_{23}=M c_v(T_3-T_2)=(1)(720)(300-800)=-360000$ J. Thus ${}_2Q_3=\Delta U_{23}=-360000$ J.
6. Process 3-1, isothermal: $\Delta U_{31}=M c_v(T_1-T_3)=0$. First law gives ${}_3Q_1={}_3W_1$. Since $P=MRT/\mathcal{V}$, ${}_3W_1=\int_{\mathcal{V}_3}^{\mathcal{V}_1}\frac{MRT}{\mathcal{V}}\,d\mathcal{V}=MRT\ln\left(\frac{\mathcal{V}_1}{\mathcal{V}_3}\right)=(1)(287)(300)\ln\left(\frac{0.431}{1.148}\right)=-84344.5$ J. Therefore ${}_3Q_1=-84344.5$ J.
7. Total cycle: $W_{net}={}_1W_2+{}_2W_3+{}_3W_1$. The slide reports $W_{net}=57050.5$ J. Since this is positive, the cycle is a power cycle. Heat input is ${}_1Q_2=503400$ J, so $\eta_{th}=W_{net}/Q_{in}=57050.5/503400=0.12$, i.e., 12%.

## Answer

- $P_1$: 0.2 MPa
- $P_2$: 0.2 MPa
- $P_3$: not legible in slide; ideal gas gives 0.075 MPa MPa
- $\mathcal{V}_1$: 0.431 m^3
- $\mathcal{V}_2$: 1.148 m^3
- $\mathcal{V}_3$: 1.148 m^3
- $T_3$: 300 K
- ${}_1W_2$: 143400 J
- ${}_2W_3$: 0 J
- ${}_3W_1$: -84344.5 J
- ${}_1Q_2$: 503400 J
- ${}_2Q_3$: -360000 J
- ${}_3Q_1$: -84344.5 J
- $\Delta U_{12}$: 360000 J
- $\Delta U_{23}$: -360000 J
- $\Delta U_{31}$: 0 J
- $W_{net}$: 57050.5 (slide; listed process works sum to 59055.5) J
- $\eta_{th}$: 0.12 (12%)

## What the instructor emphasises

- Energy balance is applied process-by-process: $\Delta U = {}_1Q_2 - {}_1W_2$ uses the same sign convention throughout.
- Work is path-dependent: constant pressure work is $P\Delta\mathcal{V}$; constant volume work is zero; isothermal ideal-gas work is $MRT\ln(\mathcal{V}_1/\mathcal{V}_3)$.
- Sign of work: because $d\mathcal{V}<0$ along 3-1, ${}_3W_1<0$; don't just assume compression/expansion from the diagram.
- For the cycle, thermal efficiency uses only the heat added: $Q_{in}={}_1Q_2$, not the net heat.
- Watch the slide arithmetic: the listed process works sum to $143400+0-84344.5=59055.5$ J, while slide 11 writes $W_{net}=57050.5$ J; the reported efficiency is 12%.
