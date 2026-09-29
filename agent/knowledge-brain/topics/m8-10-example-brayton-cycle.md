---
id: topic:m8-10-example-brayton-cycle
kind: topic
title: M8.10 — Example Brayton Cycle
description: 'Open this card when teaching the Module 8.10 worked ideal Brayton-cycle example: thermal
  efficiency from pressure ratio, isentropic state temperatures, and net power.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.10
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can calculate the thermal efficiency of an ideal Brayton cycle from the pressure ratio.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can find unknown Brayton-cycle state temperatures using isentropic ideal-gas relations.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can compute compressor work, turbine work, and net power from mass flow and c_p.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can identify T3 as the maximum temperature state in a Brayton cycle.
  kc_type: fact
  bloom: remember
equations:
- eq:ideal-brayton-cycle-thermal-efficiency
- eq:ideal-gas-steady-flow-work
- eq:isentropic-ideal-gas-temp-pressure
- eq:steady-flow-energy-adiabatic-single-stream
misconceptions: []
examples:
- ex:m8-10-example-brayton-cycle
items:
- item:final-2021-b
- item:final-2021-c
- item:final-2021-d
- item:final-2021-e
- item:final-2021-f
- item:final-2022-5
- item:final-2022-ii-b
- item:final-2022-ii-c
- item:final-2022-ii-d
- item:final-2022-ii-e
- item:final-2022-ii-f
- item:final-2023-4
- item:hw10-3
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

# M8.10 — Example Brayton Cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This is a worked example of an ideal Brayton-cycle gas turbine. It starts from a steady-flow, air-standard, reversible model, finds the thermal efficiency from the pressure ratio, builds a state table from isentropic relations, and then computes compressor work, turbine work, and net power.

## Key ideas

- The problem gives $\dot{m}=30$ kg/s, $T_1=300$ K, $T_{\max}=1050$ K, and $P_2/P_1=8.5$; assumptions are air-standard, ideal/reversible, steady-flow, quasi-steady (p. 2).
- The ideal Brayton efficiency is $\eta_{th}=1-\mathrm{OPR}^{(1-\gamma)/\gamma}$; with $\gamma=1.4$ and $\mathrm{OPR}=8.5$, the result is $\eta_{th}=0.46$ (p. 3).
- The highest temperature in the cycle is $T_3$, at turbine inlet (p. 4).
- The state table gives temperatures at all four states: $T_1=300$ K, $T_2=553$ K, $T_3=1050$ K, and $T_4=570$ K (p. 5).
- States 1–2 and 3–4 are isentropic, so the ideal-gas isentropic relation is used to obtain $T_2$ and $T_4$; the lecture uses $c_p=1001$ J/kg-K (p. 5).
- Compressor power is ${}_1\dot{W}_2=-7.5$ MW and turbine power is ${}_3\dot{W}_4=14.4$ MW, giving $\dot{W}_{net}=6.8$ MW (p. 6).

## Notation used

- $\mathrm{OPR}$: pressure ratio $P_2/P_1$
- $\gamma$: ratio of specific heats
- $c_p$: constant-pressure specific heat
- $\dot{m}$: mass flow rate
- ${}_1\dot{W}_2$: power for process 1–2 (pre-subscript process notation)

## Examples in this lecture

- Gas-turbine ideal Brayton cycle with specified $\dot{m}$, $T_1$, $T_{\max}$, and pressure ratio: the example demonstrates using the pressure-ratio efficiency, isentropic state relations, and steady-flow power sums to find $\eta_{th}$ and $\dot{W}_{net}$ (pp. 2–6).
