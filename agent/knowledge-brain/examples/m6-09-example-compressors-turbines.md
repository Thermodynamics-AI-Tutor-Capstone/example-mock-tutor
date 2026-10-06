---
id: ex:m6-09-example-compressors-turbines
kind: example
title: Compressor power from steady-flow inlet conditions
description: 'Steady-flow air compressor example: use inlet density and area to get mass flow, then ideal-gas
  constant-$c_p$ enthalpy change to find compressor power.'
parent: topic:m6-09-example-compressors-turbines
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.6
topics:
- topic:m6-09-example-compressors-turbines
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module6_9_Example_CompressorsTurbines_annotated.pdf
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

# Compressor power from steady-flow inlet conditions

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

An air compressor running with a constant mass flow rate has the following inlet and exit conditions. Calculate the power required to drive the compressor.

$P_1 = 100\ \mathrm{kPa}$, $T_1 = 300\ \mathrm{K}$, inlet diameter $D_1 = 0.3\ \mathrm{m}$, inlet velocity $V_1 = 12\ \mathrm{m/s}$, $P_2 = 350\ \mathrm{kPa}$, $T_2 = 435\ \mathrm{K}$.

## Given

- $P_1 = 100\ \mathrm{kPa}$
- $T_1 = 300\ \mathrm{K}$
- Inlet diameter $D_1 = 0.3\ \mathrm{m}$
- Inlet velocity $V_1 = 12\ \mathrm{m/s}$
- $P_2 = 350\ \mathrm{kPa}$
- $T_2 = 435\ \mathrm{K}$
- Constant mass flow rate

## Find

- Power required to drive the compressor, $\dot{W}$

## Assume

- steady-flow
- air is an ideal gas
- $c_p = \mathrm{constant}$
- quasi-equilibrium
- $\Delta ke = \Delta pe = 0$
- $\dot{Q} = 0$

## Sketch

Instructor sketches the compressor as a trapezoid, wide at inlet state ① and narrowing to exit state ②; the inlet arrow is labeled $T_1, P_1$, a brace on the inlet face is labeled $D_1, V_1$, and the exit arrow is labeled $T_2, P_2$.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. List the assumptions and reduce the energy equation: steady-flow, ideal gas with constant $c_p$, quasi-equilibrium, $\Delta ke = \Delta pe = 0$, and $\dot{Q}=0$. These give $\dot{m}\Delta h = -\dot{W}$ (Page 2).
2. Check the assumptions: quasi-equilibrium, $\Delta KE = \Delta PE = 0$, and ideal gas are all marked appropriate, with option D circled (Page 3).
3. Find the enthalpy change using ideal-gas constant $c_p$: $\Delta h = c_p(T_2 - T_1) = 1001(435 - 300) = 136215\ \mathrm{J/kg}$ (Page 4).
4. Find the inlet density: $\rho_1 = \frac{P_1}{R T_1} = \frac{100000}{(289)(300)} = 1.153\ \mathrm{kg/m^3}$ (Page 4).
5. Find the inlet area: $A_1 = \frac{\pi}{4} D_1^2 = \frac{\pi}{4}(0.3)^2 = 0.071\ \mathrm{m^2}$ (Page 4).
6. Find the mass flow rate: $\dot{m} = \rho_1 V_1 A_1 = (1.153)(12)(0.071) = 0.982\ \mathrm{kg/s}$ (Page 4).
7. Solve for power: $\dot{W} = -\dot{m}\Delta h = -(0.982)(136215) = -133811.6\ \mathrm{W}$ (Page 5).

## Answer

- Compressor power: -133811.6 W

## What the instructor emphasises

- Both $\dot{m}$ and $\Delta h$ must be found before using $\dot{m}\Delta h = -\dot{W}$; the instructor draws small arrows under them on the slide (Page 2).
- All listed assumptions are appropriate, so the simplified steady-flow energy equation can be used (Page 3).
- The inlet density comes from the ideal-gas relation $\rho_1 = P_1/(R T_1)$, then mass flow is $\rho_1 V_1 A_1$ (Page 4).
- Slide arithmetic note: the written $1001(435-300)=136215\ \mathrm{J/kg}$ is internally inconsistent with $1001 \times 135 = 135135$; the final power calculation uses the written $136215\ \mathrm{J/kg}$ (Page 4).
