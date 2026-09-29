---
id: topic:m6-02-steady-flow-energy-conservation
kind: topic
title: M6.2 — Steady Flow Energy Conservation
description: 'Introduces the steady-flow energy equation: flow work, enthalpy, and control-volume energy
  balance; opens when analyzing steady-flow devices like nozzles and heat addition.'
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.2
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can state the steady-flow mass and energy conservation conditions for a single-stream
    control volume.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can distinguish flow work from other work in the steady-flow energy equation.
  kc_type: principle
  bloom: understand
- id: '#o3'
  text: Students can derive the steady-flow energy equation from flow work and the definition of enthalpy.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can apply the steady-flow energy equation to an adiabatic ideal-gas nozzle to find exit
    temperature.
  kc_type: skill
  bloom: apply
equations:
- eq:flow-work-rate
- eq:ideal-gas-nozzle-exit-temperature
- eq:nozzle-diffuser-energy-balance
- eq:steady-flow-energy-balance
- eq:steady-flow-mass-balance
misconceptions:
- misc:m12-boundary-flow-and-shaft-work-confused
- misc:m16-internal-energy-and-enthalpy-interchangeable
examples:
- ex:ee04-steady-flow-energy-equation-for-a-hair-dryer-heat
items:
- item:exam2-2021-iii-a-e
- item:exam2-2023-iii
- item:hw06-1
- item:hw06-2
- item:hw06-3
- item:hw06-4
- item:hw06-5
sources:
- path: lectures/Module6_2_SteadyFlowEnergyConservation_annotated.pdf
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

# M6.2 — Steady Flow Energy Conservation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture moves the energy balance from a general instantaneous control-volume form to the steady-flow form. It introduces flow work, folds flow work into enthalpy, writes the single-stream steady-flow energy equation, and applies it to an adiabatic nozzle.

## Key ideas
- Under the steady-flow assumption, $d/dt=0$, so $E_{cv}$ and $m_{cv}$ are constant; for one inlet and one exit, $\dot{E}_{in}=\dot{E}_{out}$ and $\dot{m}_{in}=\dot{m}_{out}$ (p. 2).
- Flow work is the work needed to push fluid through the control volume. The slide writes $\dot{W}_{flow}=\dot{m}Pv$; inlet flow work is positive and exit flow work is negative (p. 3).
- Combining flow work with the fluid energy $e=ke+pe+u$ leads to $h=u+Pv$ and gives the steady-flow energy equation $\dot{m}(\Delta h+\Delta ke+\Delta pe)=\dot{Q}-\dot{W}$ (p. 4).
- In the clicker question, adding heat for a given mass flow increases enthalpy (p. 5).
- Nozzle example: for steady flow, adiabatic, no work, negligible $\Delta pe$, and ideal gas with constant $c_p$, the equation reduces to $c_p\Delta T+\Delta ke=0$ (p. 8).

## Notation used
- $\dot{Q}$, $\dot{W}$: heat transfer rate and work rate (p. 2, p. 4).
- $e=E/M=ke+pe+u$: total specific energy (p. 4).
- $\dot{W}_{flow}=\dot{m}Pv$: flow work rate (p. 3).
- $h=u+Pv$: specific enthalpy (p. 4).

## Examples in this lecture
- Nozzle flow (p. 8): Given $T_1=300$ K, $V_1=10$ m/s, $V_2=250$ m/s, and $c_p=1001$ J/kg·K for air as an ideal gas, the exit temperature is found. It demonstrates an adiabatic, no-work nozzle as an enthalpy-to-kinetic-energy conversion: $T_2$ drops as $V_2$ rises.

## What students get wrong here
- The slides separate $\dot{W}_{flow}$ from the other work term $\dot{W}$; do not merge flow work with boundary or shaft work when writing the steady-flow energy equation (p. 4).
- The introduction of $h=u+Pv$ distinguishes enthalpy from internal energy; the steady-flow equation uses $\Delta h$, not simply $\Delta u$ (p. 4).
