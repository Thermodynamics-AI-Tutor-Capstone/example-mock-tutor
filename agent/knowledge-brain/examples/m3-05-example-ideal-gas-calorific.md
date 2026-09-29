---
id: ex:m3-05-example-ideal-gas-calorific
kind: example
title: 'Ideal-gas air cycle: isothermal–isochoric–isobaric states and $\Delta u$, $\Delta h$'
description: 'Worked ideal-gas cycle example (p. 2): determine $P$, $T$, and $v$ at all states of an isothermal–isochoric–isobaric
  air cycle and compute constant-specific-heat internal-energy and enthalpy changes.'
parent: topic:m3-05-example-ideal-gas-calorific
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.6
topics:
- topic:m3-05-example-ideal-gas-calorific
misconceptions:
- misc:m11-state-function-vs-path-function
- misc:m14-cp-and-cv-chosen-by-process-name
- misc:m16-internal-energy-and-enthalpy-interchangeable
sources:
- path: lectures/Module3_5_Example_IdealGasCalorific_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal-gas air cycle: isothermal–isochoric–isobaric states and $\Delta u$, $\Delta h$

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Consider a three-step cycle with air as the working fluid, treated as an ideal gas (p. 2). Process 1-2 is isothermal expansion, process 2-3 is isochoric heat addition, and process 3-1 is isobaric compression (p. 2). Known states: $T_1=800$ K, $v_1=1$ m$^3$/kg, and $v_2=2$ m$^3$/kg (p. 3). Air properties: $R=287$ J/(kg·K), $c_v=714$ J/(kg·K), and $c_p=1001$ J/(kg·K) (p. 2). Solve for $P$, $T$, and $v$ at all states, and find the change in internal energy and enthalpy for each process (p. 2, p. 7).

## Given

- $T_1=800$ K, $v_1=1$ m$^3$/kg, $v_2=2$ m$^3$/kg (p. 3)
- $R=287$ J/(kg·K), $c_v=714$ J/(kg·K), $c_p=1001$ J/(kg·K) for air (p. 2)
- Process 1-2: isothermal expansion; process 2-3: isochoric heat addition; process 3-1: isobaric compression (p. 2)

## Find

- $P$, $T$, and $v$ at states 1, 2, and 3 (p. 2)
- $\Delta u$ and $\Delta h$ for each process of the cycle (p. 2, p. 7)

## Assume

- Ideal gas (p. 3)
- Quasi-steady process (p. 3)
- Constant specific heats, $c_v$ and $c_p$ (p. 3)

## Sketch

P-v diagram with $P$ vertical and $v$ horizontal; dashed vertical lines at $v=1$ and $v=2$; a lower horizontal line through state 2 at $P_2$, and an upper horizontal line through states 1 and 3 at $P_3=P_1$; a dashed constant-temperature dome is sketched above/around the states; arrows follow 1→2→3→1 (p. 3).

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Set up the state table from the process definitions: $T_1=800$ K and $v_1=1$ m$^3$/kg; process 1-2 is isothermal, so $T_2=T_1=800$ K; given $v_2=2$ m$^3$/kg; process 2-3 is isochoric, so $v_3=v_2=2$ m$^3$/kg; process 3-1 is isobaric, so $P_3=P_1$ (p. 3).
2. State 1: apply the ideal-gas equation $P_1 v_1 = R T_1$; therefore $P_1 = R T_1/v_1 = 287(800)/1 = 229600$ Pa (p. 4).
3. State 2: $T_2=800$ K and $v_2=2$ m$^3$/kg; $P_2 = R T_2/v_2 = 287(800)/2 = 114800$ Pa (p. 4).
4. State 3: $v_3=2$ m$^3$/kg and $P_3=P_1=229600$ Pa; $T_3 = P_3 v_3/R = 229600(2)/287 = 1600$ K (p. 4).
5. For an ideal gas with constant specific heats, use $\Delta u = c_v \Delta T$ and $\Delta h = c_p \Delta T$ (p. 5). For process 1-2, $\Delta T = 0$, so $\Delta u_{12}=0$ and $\Delta h_{12}=0$ (p. 7).
6. Process 2-3: $\Delta u_{23} = c_v(T_3-T_2) = 714(1600-800) = 571200$ J/kg and $\Delta h_{23} = c_p(T_3-T_2) = 1001(1600-800) = 800800$ J/kg (p. 7).
7. Process 3-1: $\Delta u_{31} = c_v(T_1-T_3) = 714(800-1600) = -571200$ J/kg and $\Delta h_{31} = c_p(T_1-T_3) = 1001(800-1600) = -800800$ J/kg (p. 7).
8. Cycle check: $\sum \Delta u = 0 + 571200 - 571200 = 0$ and $\sum \Delta h = 0 + 800800 - 800800 = 0$, as expected for property changes around a cycle (p. 7).

## Answer

- $T_1$: 800 K
- $v_1$: 1 m$^3$/kg
- $P_1$: 229600 Pa
- $T_2$: 800 K
- $v_2$: 2 m$^3$/kg
- $P_2$: 114800 Pa
- $T_3$: 1600 K
- $v_3$: 2 m$^3$/kg
- $P_3$: 229600 Pa
- $\Delta u_{12}$: 0 J/kg
- $\Delta h_{12}$: 0 J/kg
- $\Delta u_{23}$: 571200 J/kg
- $\Delta h_{23}$: 800800 J/kg
- $\Delta u_{31}$: -571200 J/kg
- $\Delta h_{31}$: -800800 J/kg

## What the instructor emphasises

- Use the process definitions (isothermal, isochoric, isobaric) to carry known values to the next state before applying the ideal-gas law (p. 3).
- In $Pv=RT$, with $T$ in kelvin and $v$ in m$^3$/kg, pressure comes out in Pa (p. 4).
- For ideal gases with constant specific heats, $\Delta u$ uses $c_v$ and $\Delta h$ uses $c_p$; do not pick $c_p$ or $c_v$ from the process name (p. 5).
- Isothermal means $\Delta T=0$, so for an ideal gas $\Delta u = c_v \Delta T = 0$ and $\Delta h = c_p \Delta T = 0$ (p. 7).
- Internal energy and enthalpy are properties, so their changes sum to zero around a complete cycle (p. 7).
