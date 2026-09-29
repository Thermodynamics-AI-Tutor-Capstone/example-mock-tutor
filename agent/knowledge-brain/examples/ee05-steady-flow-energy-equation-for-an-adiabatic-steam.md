---
id: ex:ee05-steady-flow-energy-equation-for-an-adiabatic-steam
kind: example
title: Steady-flow energy equation for an adiabatic steam turbine
description: Calculate the power output of an adiabatic steam turbine from inlet and exit states using
  the steady-flow first law.
parent: topic:m6-08-compressors-turbines
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.6
topics:
- topic:m6-08-compressors-turbines
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
- misc:m12-boundary-flow-and-shaft-work-confused
sources:
- path: assignments/explained-examples/ME300_Su22_EE5.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Steady-flow energy equation for an adiabatic steam turbine

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

(p. 1) An adiabatic steam turbine extracts power from a stream of steam steadily flowing at 38.7 kg/s. At the inlet to the turbine, the steam is at a temperature of 780 K and a pressure of 10 MPa. At the exit, the fluid has a temperature of 320 K and a quality of 0.88. Calculate the power output of this turbine.

## Given

- Steam mass flow rate: $\dot{m}=38.7\ \mathrm{kg/s}$ (p. 1)
- Inlet state 1: $T_1=780\ \mathrm{K}$, $P_1=10\ \mathrm{MPa}$ (p. 1)
- Exit state 2: $T_2=320\ \mathrm{K}$, $x_2=0.88$ (p. 1)
- Steady flow, adiabatic turbine (p. 1)

## Find

- Turbine power output, ${}_1\dot{W}_2$ (p. 1)

## Assume

- Steady flow (p. 1)
- Negligible kinetic and potential energy changes: $\Delta ke = \Delta pe = 0$ (p. 1)
- Adiabatic turbine: ${}_1\dot{Q}_2=0$ (p. 1)

## Sketch

A turbine control volume with steam entering at state 1 and leaving at state 2.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. p. 1: Write the steady-flow first law for a single-inlet/single-exit control volume: $\dot{m}(\Delta h+\Delta ke+\Delta pe)={}_1\dot{Q}_2-{}_1\dot{W}_2$. With $\Delta ke=\Delta pe=0$ and ${}_1\dot{Q}_2=0$, this becomes $\dot{m}\Delta h=-{}_1\dot{W}_2$, so ${}_1\dot{W}_2=-\dot{m}(h_2-h_1)$.
2. p. 1: Fix state 1 using $T_1=780\ \mathrm{K}$ and $P_1=10\ \mathrm{MPa}$. From Table D.2, $T_1>T_{\mathrm{sat}}$ at 10 MPa, so the steam is superheated vapor; use Table D.3P to get $h_1=3392.8\ \mathrm{kJ/kg}$.
3. p. 1: Fix state 2 using $T_2=320\ \mathrm{K}$ and $x_2=0.88$. The quality indicates a saturated mixture, so use Table D.1: $h_2=x_2 h_g+(1-x_2)h_f=(0.88)(2585.17)+(0.12)(190.17)=2298.96\ \mathrm{kJ/kg}$.
4. p. 2: Substitute into the first-law result: ${}_1\dot{W}_2=-(38.7\ \mathrm{kg/s})(2298.96-3392.8)\ \mathrm{kJ/kg}=42,331\ \mathrm{kW}$.

## Answer

- $Turbine power output, ${}_1\dot{W}_2$: 42,331 kW

## What the instructor emphasises

- The steady-flow energy equation uses enthalpy, not internal energy, because flow work is already included (p. 1).
- For the adiabatic turbine, the heat-transfer term drops; with negligible KE and PE, only the enthalpy change remains (p. 1).
- At state 1, compare $T_1$ to $T_{\mathrm{sat}}$ before choosing the property table; 780 K at 10 MPa is superheated vapor (p. 1).
- At state 2, $x_2=0.88$ means a saturated mixture, so $h_2$ is computed from $h_f$ and $h_g$ (p. 1).
- The positive sign of ${}_1\dot{W}_2$ means work is delivered by the turbine (p. 2).
- Check units: $\dot{m}\Delta h$ has units kg/s × kJ/kg = kJ/s = kW (p. 2).
