---
id: ex:m6-07-example-heat-exchangers
kind: example
title: 'Steady-flow heat exchanger: water heated by air'
description: 'Worked example: hot air heats water in a steady-flow heat exchanger; find the heat-transfer
  rate and air exit temperature from water property tables and an ideal-gas air energy balance.'
parent: topic:m6-07-example-heat-exchangers
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.6
topics:
- topic:m6-07-example-heat-exchangers
misconceptions: []
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

# Steady-flow heat exchanger: water heated by air

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Water is heated by air in a heat exchanger. The water enters at \(150\,^\circ\mathrm{C}\) and \(0.2\ \mathrm{MPa}\) and leaves at \(300\,^\circ\mathrm{C}\) and \(0.2\ \mathrm{MPa}\). The mass flow rate of the water is \(1\ \mathrm{kg/s}\). The air enters at \(350\,^\circ\mathrm{C}\) and \(0.1\ \mathrm{MPa}\) at a rate of \(2\ \mathrm{kg/s}\). Determine the heat-transfer rate between the two fluids and the exit temperature of the air.

## Given

- Water enters at \(150\,^\circ\mathrm{C}\), \(0.2\ \mathrm{MPa}\)
- Water leaves at \(300\,^\circ\mathrm{C}\), \(0.2\ \mathrm{MPa}\)
- \(\dot{m}_{\mathrm{H_2O}}=1\ \mathrm{kg/s}\)
- Air enters at \(350\,^\circ\mathrm{C}\), \(0.1\ \mathrm{MPa}\)
- \(\dot{m}_{\mathrm{air}}=2\ \mathrm{kg/s}\)

## Find

- \(\dot{Q}\), the heat-transfer rate between the two fluids
- \(T_{2,\mathrm{air}}\), the exit temperature of the air

## Assume

- Steady-flow
- Quasi-equilibrium
- Negligible kinetic and potential energy changes, \(\Delta ke=\Delta pe=0\)
- No work, \(\dot{W}=0\)
- Air is modeled as an ideal gas

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Write the steady-flow energy balance and cancel the zero terms: \(\dot{m}(\Delta h+\Delta ke+\Delta pe)=\dot{Q}-\dot{W}\). With \(\Delta ke=\Delta pe=0\) and \(\dot{W}=0\), this reduces to \(\dot{m}\Delta h=\dot{Q}\).
2. Identify that the ideal-gas assumption is not appropriate for the water; use property tables for the water.
3. Find the water inlet enthalpy. At \(P_1=0.2\ \mathrm{MPa}\), \(T_1=150\,^\circ\mathrm{C}=423\ \mathrm{K}\). The table gives \(T_{\mathrm{sat}}\) at \(0.2\ \mathrm{MPa}=393\ \mathrm{K}<T_1\), so \(h_1=2768.8\ \mathrm{kJ/kg}\).
4. Find the water outlet enthalpy. \(T_2=300\,^\circ\mathrm{C}=573\ \mathrm{K}\), so \(h_2=3071.8\ \mathrm{kJ/kg}\).
5. Apply the reduced energy balance to the water: \(\dot{Q}=\dot{m}(h_2-h_1)=(1)(3071.8-2768.8)=303\ \mathrm{kW}\).
6. Relate the air side to the water side: \(\dot{Q}_{\mathrm{H_2O}}=-\dot{Q}_{\mathrm{air}}\), so \(\dot{Q}_{\mathrm{air}}=-303\ \mathrm{kW}\).
7. Use the ideal-gas constant-\(c_p\) energy balance for air: \(\dot{m}c_p(T_2-T_1)=\dot{Q}_{\mathrm{air}}\). Solve \(T_2=T_1+\frac{\dot{Q}_{\mathrm{air}}}{\dot{m}c_p}=623+\frac{-303000}{(2)(1001)}\), giving \(T_2=477.4\ \mathrm{K}\).

## Answer

- Heat-transfer rate between the two fluids: 303 kW
- Exit temperature of the air: 477.4 K

## What the instructor emphasises

- Ideal gas is not an appropriate assumption for the water; air is modeled as an ideal gas.
- The water side gives a positive heat-transfer rate because it is heated, while the air side has the negative of that rate because the air is cooled.
- The steady-flow energy balance reduces to \(\dot{m}\Delta h=\dot{Q}\) after neglecting kinetic energy, potential energy, and work.
- The transcript notes that the final written substitution does not reproduce \(477.4\ \mathrm{K}\) exactly; \(623-303000/2002\approx 471.7\ \mathrm{K}\), but the solution is transcribed as written.
