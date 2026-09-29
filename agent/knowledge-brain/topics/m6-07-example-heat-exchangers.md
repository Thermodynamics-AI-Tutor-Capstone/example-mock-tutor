---
id: topic:m6-07-example-heat-exchangers
kind: topic
title: M6.7 — Example Heat Exchangers
description: 'Worked heat-exchanger example: air heats water; covers steady-flow energy balances, property
  tables for water, ideal-gas relations for air, and finding heat transfer rate and exit temperature.
  Open when tutoring this example or heat exchanger problems.'
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.7
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can apply the steady-flow energy balance to one stream in a heat exchanger when Δke,
    Δpe, and shaft work are negligible.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can determine water enthalpies from property tables at given pressures and temperatures
    when the temperature is above T_sat.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can compute the exit temperature of an ideal gas with constant c_p after a known heat-transfer
    rate.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can judge whether the ideal-gas assumption is appropriate for water versus air in this
    heat-exchanger example.
  kc_type: principle
  bloom: evaluate
equations:
- eq:single-stream-heat-exchanger-energy-balance
- eq:two-stream-heat-exchanger-energy-balance
misconceptions: []
examples:
- ex:m6-07-example-heat-exchangers
items: []
sources:
- path: lectures/Module6_7_Example_HeatExchangers_annotated.pdf
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

# M6.7 — Example Heat Exchangers

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture works a single steady-flow heat-exchanger example: air at $350\,^\circ\mathrm{C}$, $0.1\ \mathrm{MPa}$, $2\ \mathrm{kg/s}$ heats water at $150\,^\circ\mathrm{C}$, $0.2\ \mathrm{MPa}$, $1\ \mathrm{kg/s}$ to $300\,^\circ\mathrm{C}$. The goal is to find the heat-transfer rate between the two fluids and the air exit temperature (p. 2).

## Key ideas
- For each single stream, the steady-flow energy balance with $\Delta ke=\Delta pe=0$ and $\dot{W}=0$ reduces to $\dot{m}\Delta h=\dot{Q}$ (p. 2).
- A clicker check asks which assumption is not appropriate for the water; the answer is ideal gas, not the otherwise acceptable assumptions (p. 3).
- For water at $0.2\ \mathrm{MPa}$, the saturation temperature is $393\ \mathrm{K}$, and the lecture reads $h_1=2768.8\ \mathrm{kJ/kg}$ and $h_2=3071.8\ \mathrm{kJ/kg}$ from tables at the given temperatures (p. 4).
- Using $\dot{m}_{\mathrm{H_2O}}=1\ \mathrm{kg/s}$, the water-side heat transfer is $\dot{Q}=303\ \mathrm{kW}$ (p. 4).
- The air-side heat transfer is the opposite: $\dot{Q}_{\mathrm{air}}=-303\ \mathrm{kW}$ (p. 5).
- Treating air as an ideal gas with constant $c_p$, the lecture uses $\dot{m}c_p(T_2-T_1)=\dot{Q}_{\mathrm{air}}$ and solves for the air exit temperature, obtaining $T_2=477.4\ \mathrm{K}$ (p. 5).

## Notation used
- $\dot{m}$: mass flow rate
- $\dot{Q}$: heat-transfer rate
- $h$: specific enthalpy
- $c_p$: constant-pressure specific heat
- $T$, $P$: temperature and pressure

## Examples in this lecture
- Air-heats-water heat exchanger: given two inlet states, one water outlet state, and both mass flow rates; find $\dot{Q}$ and the air outlet temperature. It demonstrates applying the steady-flow energy balance separately to water and air, and coupling the two streams by opposite heat-transfer signs.

## What students get wrong here
- The lecture explicitly checks whether ideal gas is appropriate for water and marks it as not appropriate (p. 3). Do not apply the ideal-gas constant-$c_p$ relation to the water; use property tables for water at the given $P$ and $T$.
- The heat-transfer rates on the two sides have opposite signs; losing that sign will break the air-side calculation.
