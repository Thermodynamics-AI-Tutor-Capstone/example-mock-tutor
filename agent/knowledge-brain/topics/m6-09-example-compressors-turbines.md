---
id: topic:m6-09-example-compressors-turbines
kind: topic
title: M6.9 — Example Compressors Turbines
description: 'Worked steady-flow air-compressor example: reduce the steady-flow energy balance, find the
  enthalpy change and mass flow rate, and compute required shaft power.'
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.9
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can reduce the steady-flow energy equation for an adiabatic compressor with negligible
    kinetic and potential energy changes.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can compute shaft power from inlet/exit states using constant-cp ideal-gas enthalpy change
    and mass flow rate.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can justify modeling assumptions such as quasi-equilibrium, ideal gas, and negligible
    KE/PE for a steady-flow compressor.
  kc_type: skill
  bloom: analyze
equations:
- eq:ideal-gas-enthalpy-change-constant-cp
- eq:ideal-gas-equation-of-state
- eq:mass-flow-rate-at-a-cross-section
- eq:steady-flow-energy-adiabatic-single-stream
misconceptions: []
examples:
- ex:m6-09-example-compressors-turbines
items:
- item:exam2-2022-iii-a-3e
- item:hw07-2
- item:hw07-3
sources:
- path: lectures/Module6_9_Example_CompressorsTurbines_annotated.pdf
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

# M6.9 — Example Compressors Turbines

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture works one steady-flow air-compressor example: given inlet and exit pressures/temperatures, inlet diameter, and inlet velocity, it calculates the power required. It also pauses to check whether the stated assumptions are appropriate. Although the title is “Example: Compressors and Turbines,” the annotated slides contain only the compressor portion.

## Key ideas
- The problem specifies a constant mass flow rate air compressor and supplies state data at inlet and exit: $P_1=100\ \mathrm{kPa}$, $T_1=300\ \mathrm{K}$, $D_1=0.3\ \mathrm{m}$, $V_1=12\ \mathrm{m/s}$, $P_2=350\ \mathrm{kPa}$, $T_2=435\ \mathrm{K}$ (p. 2).
- The handwritten assumptions reduce the problem: steady-flow, air as ideal gas with constant $c_p$, quasi-equilibrium, $\Delta KE = \Delta PE = 0$, and $\dot{Q}=0$. The resulting relation is $\dot{m}\Delta h = -\dot{W}$ (p. 2).
- The assumption check in Slide 3 lists quasi-equilibrium, negligible kinetic/potential energy change, and ideal gas. All are marked appropriate; the answer to “NOT appropriate” is option D, “They are all appropriate” (p. 3).
- The enthalpy change uses the constant-$c_p$ ideal-gas path: $\Delta h = c_p \Delta T = c_p(T_2 - T_1)$. With $c_p = 1001\ \mathrm{J/(kg\,K)}$ and temperatures 300 K and 435 K, the slide writes $\Delta h = 136215\ \mathrm{J/kg}$ (p. 4).
- Inlet mass flow is built up from density, velocity, and area: $\dot{m} = \rho_1 V_1 A_1$. Density comes from the ideal gas law, $\rho_1 = P_1/(R T_1) = 1.153\ \mathrm{kg/m^3}$; the inlet area is $A_1 = \pi D_1^2/4 = 0.071\ \mathrm{m^2}$; so $\dot{m}=0.982\ \mathrm{kg/s}$ (p. 4).
- The final step is $\dot{W} = -\dot{m}\Delta h = -(0.982)(136215)$, giving $\dot{W} = -133811.6\ \mathrm{W}$ (p. 5).

## Notation used
- $\dot{m}$: mass flow rate
- $\Delta h$: specific enthalpy change
- $\dot{W}$: shaft power
- $c_p$: constant-pressure specific heat
- $\rho$: density
- $R$: ideal-gas constant for air
- $D_1$, $V_1$, $A_1$: inlet diameter, velocity, and cross-sectional area

## Examples in this lecture
- Compressor power calculation: air enters at 100 kPa and 300 K through a 0.3 m diameter inlet at 12 m/s and exits at 350 kPa and 435 K. It demonstrates how to combine the reduced steady-flow energy balance, an ideal-gas $\Delta h$ calculation, and a density-based mass-flow calculation to obtain the required shaft power.
