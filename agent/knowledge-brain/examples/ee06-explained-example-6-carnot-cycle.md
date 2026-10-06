---
id: ex:ee06-explained-example-6-carnot-cycle
kind: example
title: Explained Example 6 – Carnot Cycle
description: 'Solved Carnot heat engine example: find thermal efficiency, net power from an 800 kW heat
  input between 1200 K and 300 K reservoirs, and the fluid entropy rate for each process.'
parent: topic:m7-05-carnot-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.6
topics:
- topic:m7-05-carnot-efficiency
misconceptions:
- misc:m02-entropy-and-the-second-law
sources:
- path: assignments/explained-examples/ME300_Su22_EE6.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Explained Example 6 – Carnot Cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A factory has an engine that runs a reversible Carnot cycle, detailed below. The engine runs between two temperature reservoirs at 1200 K and 300 K.

- Process 1-2: Isentropic compression
- Process 2-3: Isothermal heat addition
- Process 3-4: Isentropic expansion
- Process 4-1: Isothermal heat rejection

a) Draw a heat engine diagram of this cycle, identifying the reservoirs and heat and work flows.
b) What is the thermal efficiency of this cycle?
c) An 800 kW heater is used to provide the heat for process 2-3. What is the net work produced by the engine?
d) What is the rate of change of entropy of the fluid during each of the four processes (dS/dt in kJ/K-s)?

## Given

- $T_H = 1200\ \text{K}$
- $T_L = 300\ \text{K}$
- $\dot{Q}_{in} = 800\ \text{kW}$

## Find

- $\eta_{th}$
- $\dot{W}_{net}$
- $\dot{S}$ for each process

## Assume

- ideal (reversible) cycle
- quasi-steady

## Sketch

Heat engine diagram: a $T_H$ reservoir at the top supplies $\dot{Q}_{in}$ downward into the cycle; the cycle outputs $\dot{W}_{net}$ to the right and rejects $\dot{Q}_{out}$ downward into the $T_L$ reservoir at the bottom.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Given from the problem: $T_H = 1200\ \text{K}$, $T_L = 300\ \text{K}$, $\dot{Q}_{in} = 800\ \text{kW}$. Assumptions are an ideal (reversible) cycle and quasi-steady operation (p. 1).
2. Part (a): Draw the heat engine diagram: the high-temperature reservoir at $T_H$ supplies $\dot{Q}_{in}$ to the cycle; the cycle produces net work $\dot{W}_{net}$; the low-temperature reservoir at $T_L$ receives $\dot{Q}_{out}$ (p. 1).
3. Part (b): For this reversible Carnot cycle, $\eta_{th} = \eta_{Carnot} = 1 - \frac{T_L}{T_H} = 1 - \frac{300}{1200}$, so $\eta_{th} = 0.75$ (p. 1).
4. Part (c): Use $\eta_{th} = \frac{\dot{W}_{net}}{\dot{Q}_{in}}$, so $\dot{W}_{net} = \eta_{th}\dot{Q}_{in} = (0.75)(800) = 600\ \text{kW}$ (p. 1).
5. Part (d), Process 1-2 (isentropic compression): $\dot{S} = 0\ \text{W/K}$ (p. 2).
6. Process 2-3 (isothermal heat addition): $\dot{S} = \int (\delta \dot{Q}/T)|_{rev} = \dot{Q}_{in}/T_H = 800/1200$, so $\dot{S} = 0.67\ \text{kW/K}$ (p. 2).
7. Process 3-4 (isentropic expansion): $\dot{S} = 0\ \text{W/K}$ (p. 2).
8. Process 4-1 (isothermal heat rejection): $\dot{S} = \int (\delta \dot{Q}/T)|_{rev} = \dot{Q}_{out}/T_L$. First get $\dot{Q}_{out} = \dot{Q}_{in} - \dot{W}_{net} = 800 - 600 = 200\ \text{kW}$, and heat out is negative, so $\dot{S} = -200/300 = -0.67\ \text{kW/K}$ (p. 2).

## Answer

- thermal efficiency: 0.75
- net work produced: 600 kW
- rate of entropy change of fluid, process 1-2: 0 W/K
- rate of entropy change of fluid, process 2-3: 0.67 kW/K
- rate of entropy change of fluid, process 3-4: 0 W/K
- rate of entropy change of fluid, process 4-1: -0.67 kW/K

## What the instructor emphasises

- Use $\eta_{th} = 1 - T_L/T_H$ only because the cycle is reversible (Carnot) (p. 1).
- For isentropic processes, the entropy change rate of the fluid is zero (p. 2).
- For reversible isothermal heat transfer, write $\dot{S}$ as $\dot{Q}/T$ and use the reservoir temperature (p. 2).
- Track the sign of heat rejection: $\dot{Q}_{out}$ is negative, so the entropy change rate in process 4-1 is negative (p. 2).
