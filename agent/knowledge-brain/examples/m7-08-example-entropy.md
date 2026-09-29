---
id: ex:m7-08-example-entropy
kind: example
title: Entropy and the Carnot Cycle
description: Worked example computing thermal efficiency, heat rejection, and process entropy changes
  for a reversible Carnot cycle between 900 K and 300 K with 6 kJ heat addition.
parent: topic:m7-08-example-entropy
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.6
topics:
- topic:m7-08-example-entropy
misconceptions:
- misc:m02-entropy-and-the-second-law
- misc:m11-state-function-vs-path-function
- misc:m10-entropy-of-an-isolated-system
sources:
- path: lectures/Module7_8_Example_Entropy_annotated.pdf
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

# Entropy and the Carnot Cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Consider a reversible Carnot cycle:
- Process 1-2: reversible, isothermal heat addition
- Process 2-3: reversible, adiabatic expansion
- Process 3-4: reversible, isothermal heat removal
- Process 4-1: reversible, adiabatic compression

Given $Q_{in}=6$ kJ, $T_H=900$ K, $T_L=300$ K.

Find: thermal efficiency, $Q_{out}$, and the change in entropy of the working fluid for each process.

The lecture also asks: What is the change in entropy over the entire cycle?
A. $\Delta S > 0$
B. $\Delta S < 0$
C. $\Delta S = 0$
D. Not enough information

## Given

- Reversible Carnot cycle: 1-2 isothermal heat addition, 2-3 adiabatic expansion, 3-4 isothermal heat removal, 4-1 adiabatic compression
- $Q_{in}=6$ kJ
- $T_H=900$ K
- $T_L=300$ K

## Find

- Thermal efficiency $\eta_{th}$
- $Q_{out}$
- Change in entropy of the working fluid for each process
- Change in entropy over the entire cycle

## Assume

- Reversible Carnot cycle
- S.C.S. (as written in lecture)
- Quasi-equilibrium

## Sketch

A reservoir at $T_H=900$ K supplies $Q_{in}=6$ kJ to a cycle; net work $W_{net}$ leaves the cycle, and heat $Q_{out}$ is rejected to a reservoir at $T_L=300$ K.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. For a reversible Carnot cycle, $\eta_{th}=1-\frac{T_L}{T_H}$. Substitute: $\eta_{th}=1-\frac{300}{900}=\frac{2}{3}=67\%$.
2. For a reversible cycle, the heat ratio equals the temperature ratio: $\frac{Q_L}{Q_H}=\frac{T_L}{T_H}$. Thus $Q_L=Q_H\frac{T_L}{T_H}=6\left(\frac{1}{3}\right)=2$ kJ, so $Q_{out}=2$ kJ.
3. Check with the energy balance: $Q_{in}=W_{net}+Q_{out}$. Then $W_{net}=\eta_{th}Q_{in}=\left(\frac{2}{3}\right)(6)=4$ kJ, and $Q_{out}=Q_{in}-W_{net}=6-4=2$ kJ.
4. Process 1-2 (reversible isothermal heat addition): $\Delta S_{12}=\int \frac{\delta Q}{T}\big|_{rev}=\frac{Q_{in}}{T_H}=\frac{6000}{900}=6.67$ kJ/K.
5. Process 2-3 (reversible adiabatic expansion): $Q=0$, so $\Delta S_{23}=0$ kJ/K.
6. Process 3-4 (reversible isothermal heat removal): $\Delta S_{34}=\int \frac{\delta Q}{T}\big|_{rev}=\frac{Q_{out}}{T_L}=\frac{-2000}{300}=-6.67$ kJ/K.
7. Process 4-1 (reversible adiabatic compression): $\Delta S_{41}=0$ kJ/K.
8. Sum the entropy changes around the cycle: $\sum_{cycle}\Delta S=6.67+0-6.67+0=0$ kJ/K. Therefore the clicker answer is C: $\Delta S=0$.

## Answer

- $Thermal efficiency $\eta_{th}$: 67 %
- $Heat rejected $Q_{out}$: 2 kJ
- $Net work $W_{net}$: 4 kJ
- $Entropy change process 1-2 $\Delta S_{12}$: 6.67 kJ/K
- $Entropy change process 2-3 $\Delta S_{23}$: 0 kJ/K
- $Entropy change process 3-4 $\Delta S_{34}$: -6.67 kJ/K
- $Entropy change process 4-1 $\Delta S_{41}$: 0 kJ/K
- $Entropy change over entire cycle $\sum_{cycle}\Delta S$: 0 kJ/K

## What the instructor emphasises

- For a reversible Carnot cycle, thermal efficiency depends only on the two reservoir temperatures.
- For a reversible cycle, heat transfer and reservoir temperature are related by $Q_L/Q_H=T_L/T_H$.
- For reversible adiabatic processes, $Q=0$ and $\Delta S=0$.
- Heat removed from the cycle is negative in the entropy calculation.
- Entropy is a state function, so the entropy change over the whole cycle is zero: $\sum_{cycle}\Delta S=0$.
