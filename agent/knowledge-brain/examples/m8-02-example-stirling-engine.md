---
id: ex:m8-02-example-stirling-engine
kind: example
title: 'Stirling Cycle: State Points, Work, Heat, and Thermal Efficiency'
description: For a Stirling cycle with isothermal compression/expansion and constant-volume heat transfer,
  determine state points, work and heat, and the correct thermal-efficiency expression.
parent: topic:m8-02-example-stirling-engine
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-02-example-stirling-engine
misconceptions:
- misc:m04-heat-always-raises-temperature
- misc:m11-state-function-vs-path-function
sources:
- path: lectures/Module8_2_Example_StirlingEngine_annotated.pdf
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

# Stirling Cycle: State Points, Work, Heat, and Thermal Efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

An ideal gas of mass $M$ executes a Stirling cycle: $1\to2$ isothermal compression at $T_L$ ($\Delta T=0$), $2\to3$ constant-volume heat addition ($\Delta \mathcal{V}=0$), $3\to4$ isothermal expansion at $T_H$ ($\Delta T=0$), and $4\to1$ constant-volume heat rejection ($\Delta \mathcal{V}=0$). The total volumes at the two extreme states are $\mathcal{V}_1$ and $\mathcal{V}_2$, with $T_1=T_2=T_L$ and $T_3=T_4=T_H$. Find the state points, the work and heat transfers, and the thermal efficiency $\eta_{th}$.

## Given

- Cycle processes: $1\to2$ isothermal compression, $2\to3$ constant-volume heat addition, $3\to4$ isothermal expansion, $4\to1$ constant-volume heat rejection
- Temperatures: $T_1=T_2=T_L$; $T_3=T_4=T_H$
- Total volumes: $\mathcal{V}_1=\mathcal{V}_4$; $\mathcal{V}_2=\mathcal{V}_3$
- Mass $M$ of ideal gas; ideal gas law $P=MRT/\mathcal{V}$

## Find

- State point table ($T$, $\mathcal{V}$, $P$)
- Work and heat for the processes, including ${}_1W_2$ and ${}_3W_4$
- Thermal efficiency expression $\eta_{th}$

## Assume

- Ideal gas with constant specific heats, $c_v=\text{const}$
- Negligible kinetic and potential energy changes: $\Delta KE=\Delta PE=0$
- The mass $M$ is fixed
- Constant-volume processes have no boundary work; only the isothermal legs contribute to $W_{net}$

## Sketch

$P$--$\mathcal{V}$ diagram with dashed isotherms $T_H$ (upper) and $T_L$ (lower), vertical constant-volume lines at $\mathcal{V}_2$ and $\mathcal{V}_1$, states 1-4 on the corners, arrows $1\to2\to3\to4\to1$, and the hatched enclosed area labeled $W_{net}$.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Set up the state table from the cycle definition. States 1 and 2 lie on the low-temperature isotherm, $T_1=T_2=T_L$; states 3 and 4 lie on the high-temperature isotherm, $T_3=T_4=T_H$. The total volumes are $\mathcal{V}_1$ for states 1 and 4, and $\mathcal{V}_2$ for states 2 and 3. For an ideal gas, each pressure is $P_i = MRT_i/\mathcal{V}_i$ (Page 2).
2. Choose the thermal-efficiency expression. By definition $\eta_{th}=W_{net}/Q_{in}$. The net work is the sum of the boundary work on the two isothermal legs, ${}_1W_2+{}_3W_4$; the constant-volume legs add no boundary work. The heat input is the sum of the constant-volume heat addition and the isothermal expansion heat, ${}_2Q_3+{}_3Q_4$. Therefore the correct expression is $\eta_{th}=({}_1W_2+{}_3W_4)/({}_2Q_3+{}_3Q_4)$ (Page 3).
3. Compute the isothermal compression work. With $P=MRT/\mathcal{V}$ for an ideal gas, ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V} = \int_{\mathcal{V}_1}^{\mathcal{V}_2} \frac{MRT}{\mathcal{V}}\,d\mathcal{V} = MRT_1\ln\left(\frac{\mathcal{V}_2}{\mathcal{V}_1}\right)$ (Page 4).
4. Compute the isothermal expansion work: ${}_3W_4 = MRT_3\ln\left(\frac{\mathcal{V}_1}{\mathcal{V}_2}\right)$ (Page 4).
5. Apply the first law to get heat transfers. With $\Delta KE=\Delta PE=0$, $\Delta U = {}_1Q_2 - {}_1W_2$, so ${}_1Q_2 = \Delta U + {}_1W_2$. For an ideal gas with constant $c_v$, $\Delta U = M c_v\Delta T$ (Page 4). Thus isothermal legs have $\Delta U=0$ and $Q=W$; constant-volume legs have zero boundary work and $Q=\Delta U$.

## Answer

- State point pressure: $P_i = \frac{MRT_i}{\mathcal{V}_i}$
- Isothermal compression work: ${}_1W_2 = MRT_L\ln\left(\frac{\mathcal{V}_2}{\mathcal{V}_1}\right)$
- Isothermal expansion work: ${}_3W_4 = MRT_H\ln\left(\frac{\mathcal{V}_1}{\mathcal{V}_2}\right)$
- Thermal efficiency expression: $\eta_{th} = \frac{{}_1W_2 + {}_3W_4}{{}_2Q_3 + {}_3Q_4}$

## What the instructor emphasises

- The cycle efficiency is always $W_{net}/Q_{in}$, not a ratio of one expansion work to one heat addition.
- This cycle has two heat inputs, ${}_2Q_3$ and ${}_3Q_4$; both must appear in the denominator of $\eta_{th}$.
- Constant-volume processes contribute no boundary work, so only the two isothermal legs appear in $W_{net}$.
- Use total volume $\mathcal{V}$ in the ideal-gas law and boundary-work integrals because the problem works with mass $M$.
