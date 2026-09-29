---
id: topic:m8-06-example-rankine-cycle
kind: topic
title: M8.6 — Example Rankine Cycle
description: 'Worked Rankine-cycle example: fill a four-state steam table with nonideal pump/turbine isentropic
  efficiencies, then compute pump/turbine work, boiler/condenser heat, and thermal efficiency.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.6
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can set up a four-state Rankine cycle table from the given temperatures, pressures, and
    device efficiencies.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can use pump and turbine isentropic efficiency definitions to find actual outlet enthalpies
    from ideal isentropic outlet enthalpies.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can identify compressed liquid, saturated mixture, and vapor states from the given P
    and T data.
  kc_type: principle
  bloom: understand
- id: '#o4'
  text: Students can calculate pump work, turbine work, boiler heat, condenser heat, and overall thermal
    efficiency for a steady-flow Rankine cycle.
  kc_type: skill
  bloom: apply
equations:
- eq:pump-isentropic-efficiency
- eq:saturated-mixture-quality-enthalpy
- eq:single-stream-heat-exchanger-energy-balance
- eq:steady-flow-energy-adiabatic-single-stream
- eq:thermal-efficiency
- eq:turbine-isentropic-efficiency
misconceptions:
- misc:m15-adiabatic-implies-isentropic
examples:
- ex:m8-06-example-rankine-cycle
items:
- item:final-2022-ii-g
- item:final-2022-ii-h
- item:final-2022-ii-j
- item:final-2023-b
- item:final-2023-c
- item:final-2023-d
- item:final-2023-e
- item:final-2023-f
- item:final-2023-g
sources:
- path: lectures/Module8_6_Example_RankineCycle_annotated.pdf
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

# M8.6 — Example Rankine Cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture works a single Rankine-cycle example with a steam mass flow rate of 25 kg/s and nonideal pump and turbine isentropic efficiencies. It fills a four-state table for the pump inlet, pump outlet, turbine inlet, and turbine outlet, then computes pump work, boiler heat, turbine work, condenser heat, and overall thermal efficiency (p. 2). The handwritten assumptions are steady-flow, quasi-equilibrium, and negligible kinetic and potential energy changes (p. 2).

## Key ideas
- States 1 and 3 are set by $T$ and $P$; states 2 and 4 are not isentropic, so the cycle uses ideal intermediate states $2s$ and $4s$ with $s_{2s}=s_1$ and $s_{4s}=s_3$ (p. 2).
- At state 1, $P_1=0.15$ MPa and $T_1=290$ K; since $P_1>P_{\text{sat}}=1.92$ kPa, it is a liquid. The given table/NIST values are $h_1=70.7$ kJ/kg and $s_1=0.25$ kJ/kg·K (p. 3).
- For the pump ideal outlet $2s$: $P_2=20$ MPa and $s_{2s}=s_1$. Since $s_{2s}<s_f$, it remains liquid; $T_{2s}=290.26$ K and $h_{2s}=90.654$ kJ/kg. The actual pump outlet uses the isentropic efficiency to give $h_2=94.175$ kJ/kg (p. 3).
- At state 3, $P_3=19.5$ MPa and $T_3=990$ K; $T_3>T_{\text{sat}}$ so it is vapor. Table values are $h_3=3854.9$ kJ/kg and $s_3=6.858$ kJ/kg·K (p. 4).
- For the ideal turbine outlet $4s$, $P_4=0.2$ MPa and $s_{4s}=s_3$; the state is a two-phase mixture with $x_{4s}=0.952$ and $h_{4s}=2600.5$ kJ/kg. The actual turbine outlet follows from the turbine isentropic efficiency as $h_4=2688.308$ kJ/kg (p. 4).
- The $T$–$s$ diagram shows ①→② as pump compression, ②→③ as heat addition, ③→④ as expansion, and ④→① as heat rejection/condensation (p. 5).
- The work and heat expressions on p. 6 use the steady-flow energy terms with the given enthalpies; the boxed $\eta_{th}=0.3$ is the slide's answer, but the arithmetic on that page is not internally consistent (p. 6).

## Notation used
- $\dot{m}$ is the mass flow rate; $h$ is specific enthalpy; $s$ is specific entropy; $x$ is quality.
- $\eta_{isen,p}$ and $\eta_{isen,t}$ are the pump and turbine isentropic efficiencies; subscripts $2s$ and $4s$ denote ideal isentropic outlet states.
- $\dot{W}$ and $\dot{Q}$ are work and heat transfer rates; subscripts label the device or direction.

## Examples in this lecture
- Four-state Rankine cycle with specified 25 kg/s flow and nonideal pump/turbine: compute each state and then $\dot{W}_{pump}$, $\dot{Q}_{boiler}$, $\dot{W}_{turbine}$, $\dot{W}_{net}$, $\dot{Q}_{condenser}$, and $\eta_{th}$ (p. 2). This demonstrates combining steam-table state data with isentropic-efficiency corrections.
