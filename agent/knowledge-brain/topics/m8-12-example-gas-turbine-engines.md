---
id: topic:m8-12-example-gas-turbine-engines
kind: topic
title: M8.12 — Example Gas Turbine Engines
description: 'Worked combined Brayton-Rankine example: using ideal air-standard gas-turbine data and Rankine
  steam-table states, it finds steam mass flow, combined net work, and combined-cycle efficiency.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.12
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can set up a combined Brayton-Rankine cycle by coupling the gas-turbine exhaust heat
    to a Rankine steam cycle.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can calculate Brayton cycle states and net power using ideal-gas isentropic relations
    and constant c_p.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can calculate Rankine cycle states, steam mass flow, and net work from steam table data.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can compute combined-cycle thermal efficiency as total net power divided by gas-turbine
    heat input.
  kc_type: skill
  bloom: apply
equations:
- eq:combined-cycle-net-power-and-efficiency
- eq:gas-turbine-net-power-and-efficiency
- eq:heat-coupling-combined-cycle
- eq:ideal-gas-steady-flow-work
- eq:isentropic-ideal-gas-temp-pressure
- eq:saturated-mixture-quality-enthalpy
- eq:single-stream-heat-exchanger-energy-balance
- eq:steady-flow-energy-adiabatic-single-stream
- eq:steam-cycle-net-work
misconceptions: []
examples:
- ex:ee10-turbojet-engine-turbine-exit-temperature
- ex:m8-12-example-gas-turbine-engines
items: []
sources:
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
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
  - 12
  - 13
  - 14
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M8.12 — Example Gas Turbine Engines

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This lecture works a combined Brayton-Rankine cycle example. Given air-standard Taurus 70 gas-turbine data ($PR=16.5$, $\dot{m}_{air}=26.4$ kg/s, $\dot{Q}_{in}=23790$ kW, $T_1=300$ K, $P_1=0.1$ MPa), the lecture finds the Brayton states, couples the gas-turbine exhaust to an ideal Rankine cycle, and calculates steam mass flow, combined net work, and combined-cycle efficiency.

## Key ideas

- The combined cycle links a gas-turbine Brayton cycle to a Rankine steam cycle through the HRSG; gas-turbine exhaust heat is the Rankine heat input (p. 3, p. 6).
- The heat-coupling statement is $\dot{Q}_{out,GT} = -\dot{Q}_{in,ST}$ (p. 6).
- For compressor, pump, and turbine: $\dot{Q}=0$, $\Delta ke = \Delta pe = 0$, so $\dot{W} = -\dot{m}\Delta h$; air uses $c_p\Delta T$, steam uses table enthalpies (p. 8).
- Brayton assumptions: air-standard ideal gas, ideal reversible cycle, constant $c_p,c_v$, steady flow (p. 9).
- Rankine assumptions: ideal reversible cycle, S.C.S., steady flow (p. 9).
- Brayton states use the isentropic ideal-gas relation for compressor and turbine and constant-$c_p$ heat addition for the combustor (p. 10).
- Brayton results: $\dot{W}_{GT}=13110.14$ kW, $\eta_{GT}=0.551$, and heat rejected $=10679.86$ kW (p. 11).
- Rankine states are evaluated with steam tables; the turbine exit is a saturated mixture with $x_4=0.78$ (p. 12).
- Steam mass flow and net work are $\dot{m}_{ST}=5.47$ kg/s and $\dot{W}_{ST}=2084.5$ kW (p. 13).
- Combined results: $\dot{W}_{cc}=15194.62$ kW and $\eta_{cc}=63.87\%$ (p. 14).

## Notation used

- $\dot{m}$: mass flow rate.
- $\dot{W}$, $\dot{Q}$: power and heat-transfer rate.
- $PR$: pressure ratio; $c_p$: constant-pressure specific heat; $\gamma$: specific-heat ratio.
- $h$, $s$, $x$: enthalpy, entropy, quality.
- Subscripts $GT$, $ST$, $cc$: gas turbine, steam cycle, combined cycle.
- Process quantities use pre-subscripts, e.g. ${}_1\dot{W}_2$ for work rate from state 1 to state 2.

## Examples in this lecture

The Taurus 70 combined-cycle example asks for water mass flow rate, net work of the combined cycle, and efficiency (p. 5). It demonstrates state-by-state Brayton and Rankine solutions combined through the HRSG heat coupling.

## What students get wrong here

The slide-11 line $\dot{Q}_{out} = \dot{Q}_{in} - \dot{W}_{net} = -\dot{Q}_{in,ST}$ mixes sign conventions: the computed $10679.86$ kW is then used as a positive $\dot{Q}_{in,ST}$. Have students assign a consistent sign convention before substituting.
