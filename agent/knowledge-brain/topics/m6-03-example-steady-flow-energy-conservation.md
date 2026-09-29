---
id: topic:m6-03-example-steady-flow-energy-conservation
kind: topic
title: M6.3 — Example Steady Flow Energy Conservation
description: 'Worked example applying the steady-flow energy equation to a steam turbine: property lookup
  for superheated vapor and a saturated mixture, then turbine power calculation.'
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.3
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can recall the steady-flow energy equation and identify the assumptions made for the
    turbine example.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can explain why state 1 is superheated vapor and state 2 is a saturated mixture.
  kc_type: principle
  bloom: understand
- id: '#o3'
  text: Students can use property tables to find h1 for superheated vapor and h2 for a saturated mixture.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can calculate turbine power from mass flow and enthalpy change.
  kc_type: skill
  bloom: apply
equations:
- eq:steady-flow-energy-adiabatic-single-stream
- eq:steady-flow-energy-balance
- eq:two-phase-enthalpy-mixing-rule
misconceptions: []
examples:
- ex:m6-03-example-steady-flow-energy-conservation
items:
- item:hw06-4
- item:hw06-5
sources:
- path: lectures/Module6_3_Example_SteadyFlowEnergyConservation_annotated.pdf
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

# M6.3 — Example Steady Flow Energy Conservation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This deck works one steady-flow control-volume example: a steam turbine. It reduces the steady-flow energy equation to a turbine work expression, uses property tables to evaluate the inlet and outlet enthalpies, and computes the turbine power. Open this card when a student is learning how to apply the steady-flow energy equation to a single-inlet/single-exit device with property-table lookups.

## Key ideas
- The control volume is a turbine with one inlet labeled (1) and one outlet labeled (2) (p. 2).
- The handwritten assumptions are steady flow, S.C.S., $\Delta ke=\Delta pe=0$, and $\dot{Q}=0$ (p. 2).
- From $\dot{m}(\Delta h+\Delta ke+\Delta pe)=\dot{Q}-\dot{W}$, the assumptions reduce the balance to $\dot{W}=-\dot{m}\,\Delta h$ (p. 2).
- The data on p. 2 include $\dot{m}=58.7\ \mathrm{kg/s}$, $T_1=780\ \mathrm{K}$, $P_1=10\ \mathrm{MPa}$, $T_2=520\ \mathrm{K}$, and $x_2=0.88$. Page 5 writes $T_2=320\ \mathrm{K}$; the mixture property values on p. 5 are used for that state.
- State 1 at $10\ \mathrm{MPa}$ and $780\ \mathrm{K}$ is superheated vapor because $T>T_{sat}$ at $10\ \mathrm{MPa}$ (table D.2); table D.3 gives $h_1=3392.8\ \mathrm{kJ/kg}$ (p. 4).
- State 2 is a saturated mixture because $x_2=0.88$ is given; table D.1 gives $h_2=x_2h_g+(1-x_2)h_f=2298.96\ \mathrm{kJ/kg}$ (p. 5).
- The final calculation inserts $h_1$ and $h_2$ into $\dot{W}=-\dot{m}(h_2-h_1)$. Page 5 writes the numerical result as $42331.6\ \mathrm{kJ/s}\cdot\mathrm{kW}$. Note that the arithmetic on p. 5 uses $38.7\ \mathrm{kg/s}$, while p. 2 writes $58.7\ \mathrm{kg/s}$.

## Notation used
- $\dot{m}$: mass flow rate.
- $\dot{Q}$: heat transfer rate.
- $\dot{W}$: power/work rate.
- $h$: specific enthalpy; $h_f$ and $h_g$: saturated-liquid and saturated-vapor enthalpy.
- $x$: quality.
- States 1 and 2: turbine inlet and outlet.

## Examples in this lecture
- Steam turbine: given inlet temperature and pressure, outlet quality, and mass flow, compute turbine power. This demonstrates how to reduce the steady-flow energy equation, determine phase from tables D.2/D.3, evaluate mixture enthalpy from table D.1, and compute $\dot{W}$ (p. 2–p. 5).
