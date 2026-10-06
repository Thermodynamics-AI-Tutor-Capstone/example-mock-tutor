---
id: topic:m8-01-heat-engine-cycle-analysis
kind: topic
title: M8.1 — Heat Engine Cycle Analysis
description: Introduces heat-engine schematics, the first-law cycle balance, thermal efficiency, Carnot
  efficiency as a reversible bound, and a steady-flow maximum-power example; open before students try
  cycle-analysis problems.
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.1
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify heat and work interactions on a heat-engine schematic and write the overall
    cycle energy balance.
  kc_type: skill
  bloom: understand
- id: '#o2'
  text: Students can compute the maximum thermal efficiency from reservoir temperatures using the Carnot
    relation.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can calculate maximum net power and rejected heat rate for a steady-flow heat engine.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can use signed work terms to describe net work in cycle analysis.
  kc_type: skill
  bloom: understand
equations:
- eq:carnot-efficiency
- eq:heat-engine-energy-balance
- eq:net-work-definition
- eq:thermal-efficiency
misconceptions: []
examples: []
items:
- item:final-2021-3
- item:final-2022-3
- item:final-2022-4
- item:final-2022-ii-i
- item:final-2023-2
- item:final-2023-3
- item:hw09-5
sources:
- path: lectures/Module8_1_HeatEngineCycleAnalysis_annotated.pdf
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

# M8.1 — Heat Engine Cycle Analysis

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This deck introduces the heat-engine model: a cycle receives heat from a hot reservoir at $T_H$, produces net work, and rejects heat to a cold reservoir at $T_L$. It defines thermal and Carnot efficiency and works a steady-flow maximum-power problem.

## Key ideas

- A heat engine is drawn as a cycle with $Q_H=Q_{in}$ from $T_H$, $Q_L=Q_{out}$ to $T_L$, and net work $W_{net}$ (p. 2).
- The net work is $W_{net}=W_{out}-W_{in}$; page 5 later uses signed work terms where $W_{in}<0$ and $W_{out}>0$ (pp. 2, 5).
- The overall energy balance for the cycle is $Q_H = W_{net} + Q_L$; the rate version $\dot{Q}_H=\dot{W}_{net}+\dot{Q}_L$ is used for the steady-flow example (pp. 2, 4).
- Thermal efficiency is defined as $\eta_{th}=W_{net}/Q_H$ and in rate form $\eta_{th}=\dot{W}_{net}/\dot{Q}_{in}$ (pp. 2–3).
- The maximum efficiency for a reversible cycle is the Carnot efficiency $\eta_{carnot}=1-T_L/T_H$ (p. 2).
- In the example, setting $\eta_{th}=\eta_{carnot}$ gives $\eta_{th,max}=0.6$, then $\dot{W}_{net,max}=1.26$ kW (p. 3).
- The rejected heat rate is found from the energy balance, giving $\dot{Q}_L=0.84$ kW (p. 4).
- Cycle analysis labels processes 1-2 as work input, 2-3 as heat input, 3-4 as work output, and 4-1 as heat rejection (p. 5).
- Page 6 lists simple cycle patterns by process constraints—Stirling, Carnot, Rankine, Brayton, Diesel, Otto—but does not analyze them in detail.

## Notation used

- $Q_H, Q_{in}$: heat addition from the hot reservoir/into the cycle
- $Q_L, Q_{out}$: heat rejection to the cold reservoir/out of the cycle
- $W_{in}, W_{out}, W_{net}$: work input, work output, and net work; page 5 uses $W_{in}<0$, so $W_{net}=W_{in}+W_{out}>0$
- $\eta_{th}, \eta_{carnot}$: thermal efficiency and Carnot thermal efficiency
- $T_H, T_L$: high- and low-temperature reservoir temperatures
- Dots denote rates, e.g. $\dot{Q}_H, \dot{W}_{net}$ (pp. 3–4)

## Examples in this lecture

- High-temperature reservoir at $T_H=750$ K supplies heat at $\dot{Q}_H=2.1$ kW and the engine rejects to $T_L=300$ K; find the maximum power and the heat rejection rate. Demonstrates combining the Carnot bound with the first-law balance (pp. 3–4).
