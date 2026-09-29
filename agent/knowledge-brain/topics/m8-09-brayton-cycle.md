---
id: topic:m8-09-brayton-cycle
kind: topic
title: M8.9 — Brayton Cycle
description: Introduces the ideal air-standard Brayton cycle, its P-v and T-s diagrams, component energy
  balances, and thermal-efficiency dependence on overall pressure ratio. Open when reviewing gas-turbine
  power cycles.
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.9
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: 'State the air-standard idealizations for the Brayton cycle: air as ideal gas, constant specific
    heats, closed-cycle treatment, and combustion as heat addition.'
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Sketch and label the four ideal Brayton processes on P-v and T-s diagrams.
  kc_type: skill
  bloom: understand
- id: '#o3'
  text: Apply the steady-flow energy equation to the compressor, combustor, turbine, and heat-rejection
    processes using constant specific heats.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Write the thermal efficiency of the ideal Brayton cycle in terms of the overall pressure ratio.
  kc_type: principle
  bloom: apply
equations:
- eq:ideal-brayton-cycle-thermal-efficiency
- eq:ideal-gas-specific-heat-ratio
- eq:ideal-gas-steady-flow-work
- eq:isentropic-ideal-gas-temp-pressure
- eq:overall-pressure-ratio
- eq:single-stream-heat-exchanger-energy-balance
- eq:steady-flow-energy-adiabatic-single-stream
- eq:steady-flow-energy-balance
misconceptions: []
examples: []
items:
- item:final-2021-a
- item:final-2021-b
- item:final-2021-c
- item:final-2021-d
- item:final-2021-e
- item:final-2021-f
- item:final-2022-2
- item:final-2022-5
- item:final-2022-ii-a
- item:final-2022-ii-b
- item:final-2022-ii-c
- item:final-2022-ii-d
- item:final-2022-ii-e
- item:final-2022-ii-f
- item:final-2022-ii-i
- item:final-2023-4
- item:hw10-1
- item:hw10-3
sources:
- path: lectures/Module8_9_BraytonCycle_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M8.9 — Brayton Cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This deck defines the ideal air-standard Brayton cycle for gas-turbine power plants and develops the component energy balances and thermal-efficiency relations for the cycle.

## Key ideas
- The Brayton cycle is introduced as an ideal air-standard cycle: air is the working fluid, air is an ideal gas with constant $c_v$ and $c_p$, the cycle is treated as closed, and combustion is modeled as heat addition (p. 6).
- The overall pressure ratio is $\mathrm{OPR}=P_2/P_1$ (p. 6).
- The four processes are: 1-2 isentropic compression in the compressor; 2-3 isobaric heat addition in the combustor; 3-4 isentropic expansion in the turbine; and 4-1 isobaric heat rejection (p. 6).
- The P-v and T-s diagrams show the cycle direction $1\to2\to3\to4\to1$, with vertical isentropic lines and constant-pressure heat-transfer lines (p. 6).
- The cycle analysis starts from the one-inlet one-exit steady-flow energy equation and writes a separate energy balance for each component (p. 7).
- For constant specific heats, enthalpy changes are written as $c_p\Delta T$ in the component balances (p. 7).
- Thermal efficiency is defined as net work output over heat input; the slide reduces this to a temperature form and then to a pressure-ratio form (p. 8).
- The slide annotations flag the work signs: ${}_1\dot{W}_2<0$ and ${}_3\dot{W}_4>0$ (p. 8). The temperature numerator as written on p. 8 needs a leading minus sign to be consistent with the component balances on p. 7.
- The final efficiency expression shows that increasing the overall pressure ratio increases the ideal Brayton thermal efficiency (p. 8).

## Notation used
- $\mathrm{OPR}=P_2/P_1$: overall pressure ratio
- $\gamma=c_p/c_v$: specific-heat ratio
- $\dot{m}$, $h$, $c_p$, $T$, $P$: mass flow rate, specific enthalpy, constant-pressure specific heat, temperature, pressure
- Pre-subscript process quantities such as ${}_1\dot{W}_2$, ${}_2\dot{Q}_3$, ${}_3\dot{W}_4$, ${}_4\dot{Q}_1$
- $\eta_{th}$: thermal efficiency

## What students get wrong here
- Watch the work signs: compressor work is negative and turbine work is positive. The slide writes ${}_1\dot{W}_2<0$ and ${}_3\dot{W}_4>0$ (p. 8). The temperature expression as written on p. 8 has the opposite sign unless a leading minus sign is restored from the p. 7 component balances.
