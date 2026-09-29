---
id: ex:ee01-p-v-t-equation-of-state-isobaric-and-isothermal-co
kind: example
title: 'P-v-T Equation of State: Isobaric and Isothermal Compression of Air'
description: For air in a piston-cylinder with specific volume reduced from 10 to 5 m^3/kg, draw the P-v
  diagram and compute final T and P for isobaric and isothermal processes using the ideal-gas equation.
parent: topic:m3-01-ideal-gas-p-v-t
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.6
topics:
- topic:m3-01-ideal-gas-p-v-t
- topic:m3-02-example-1-ideal-gas-p-v-t
misconceptions: []
sources:
- path: assignments/explained-examples/ME300_Su22_EE1.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# P-v-T Equation of State: Isobaric and Isothermal Compression of Air

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

An inventor is testing out different processes for cooling air in a piston-cylinder arrangement from the same initial state. In both processes, the mass-specific volume of the chamber reduces from $v_1 = 10\ \mathrm{m}^3/\mathrm{kg}$ to $v_2 = 5\ \mathrm{m}^3/\mathrm{kg}$, but Process A is isobaric and Process B is isothermal. Answer the following questions about these two processes if the temperature at state 1 is $T_1 = 1000\ \mathrm{K}$. For air, $R = 287\ \mathrm{J/kg\text{-}K}$ and $c_v = 714\ \mathrm{J/kg\text{-}K}$. List your assumptions.
a. Draw both processes on the same P-v diagram and label the state points – State 1, State 2A (after Process A), and State 2B (after process B).
b. Calculate $T_2$ and $P_2$ for both processes.

## Given

- $v_1 = 10\ \mathrm{m}^3/\mathrm{kg}$
- $v_2 = 5\ \mathrm{m}^3/\mathrm{kg}$
- $T_1 = 1000\ \mathrm{K}$
- $R = 287\ \mathrm{J/kg\text{-}K}$
- $c_v = 714\ \mathrm{J/kg\text{-}K}$
- Process A is isobaric: $P_{2A} = P_1$
- Process B is isothermal: $T_{2B} = T_1$

## Find

- P-v diagram showing Process A and Process B with State 1, State 2A, and State 2B labeled
- $T_2$ and $P_2$ for Process A
- $T_2$ and $P_2$ for Process B

## Assume

- Air is an ideal gas
- Quasi-steady process
- Sealed system, $M = \text{constant}$

## Sketch

The instructor sketches a P-v diagram with pressure on the vertical axis and mass-specific volume on the horizontal axis. Vertical dashed lines mark $v_2 = 5\ \mathrm{m}^3/\mathrm{kg}$ and $v_1 = 10\ \mathrm{m}^3/\mathrm{kg}$. State 1 is at $v_1 = 10\ \mathrm{m}^3/\mathrm{kg}$ and $P_1$. Process A is a horizontal line from State 1 left to State 2A at $v_2 = 5\ \mathrm{m}^3/\mathrm{kg}$. Process B is a curved isotherm ($T_1$), hyperbola-like, from State 1 up-left to State 2B at the same $v_2$ but a higher pressure.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. List the given information and assumptions: $v_1 = 10\ \mathrm{m}^3/\mathrm{kg}$, $v_2 = 5\ \mathrm{m}^3/\mathrm{kg}$, $T_1 = 1000\ \mathrm{K}$, $R = 287\ \mathrm{J/kg\text{-}K}$, $c_v = 714\ \mathrm{J/kg\text{-}K}$, Process A is isobaric so $P_{2A}=P_1$, and Process B is isothermal so $T_{2B}=T_1$. Air is treated as an ideal gas in a sealed, quasi-steady system. (p. 1)
2. Draw the P-v diagram. Mark vertical dashed lines at $v_2 = 5\ \mathrm{m}^3/\mathrm{kg}$ and $v_1 = 10\ \mathrm{m}^3/\mathrm{kg}$. Place State 1 at $v_1 = 10\ \mathrm{m}^3/\mathrm{kg}$ and $P_1$. For Process A, draw a horizontal constant-pressure line left to State 2A. For Process B, draw a constant-temperature curve; since $Pv = RT$, for constant $T$ the pressure follows $P = RT/v$, so $P \sim 1/v$. (p. 1)
3. For Process A, find $P_1$ from the ideal-gas equation at State 1: $P_1 = \frac{RT_1}{v_1} = \frac{(287)(1000)}{10} = 28{,}700\ \mathrm{Pa}$. Then, because Process A is isobaric, $P_2 = P_1 = 28{,}700\ \mathrm{Pa}$. (p. 1)
4. For Process A, calculate $T_2$ from $P_2 v_2 = RT_2$: $T_2 = \frac{P_2 v_2}{R} = \frac{(28{,}700)(5)}{287} = 500\ \mathrm{K}$. (p. 1)
5. For Process B, use the isothermal condition: $T_2 = T_1 = 1000\ \mathrm{K}$. Then calculate $P_2$: $P_2 = \frac{RT_2}{v_2} = \frac{(287)(1000)}{5} = 57{,}400\ \mathrm{Pa}$. (p. 2)
6. Check the result against the diagram: $P_{2B} = 57{,}400\ \mathrm{Pa}$ is greater than $P_{2A} = 28{,}700\ \mathrm{Pa}$, so State 2B should lie above State 2A on the P-v diagram. (p. 2)

## Answer

- $P_2$ for Process A$: 28,700 Pa
- $T_2$ for Process A$: 500 K
- $T_2$ for Process B$: 1000 K
- $P_2$ for Process B$: 57,400 Pa

## What the instructor emphasises

- For an ideal gas, an isobaric process is a horizontal line on a P-v diagram, while an isothermal process is a hyperbola-like curve because $P = RT/v$ with $T$ constant. (p. 1)
- Use the ideal-gas equation at known states first: with $R$, $T_1$, and $v_1$, $P_1$ is obtained directly. (p. 1)
- After computing both final states, compare them with the P-v diagram; here $P_{2B} > P_{2A}$ is consistent with State 2B being above State 2A. (p. 2)
- The instructor explicitly lists assumptions before solving: air as ideal gas, quasi-steady, sealed system with constant mass. (p. 1)
