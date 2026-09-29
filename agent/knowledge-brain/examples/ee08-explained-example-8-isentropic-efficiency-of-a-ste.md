---
id: ex:ee08-explained-example-8-isentropic-efficiency-of-a-ste
kind: example
title: 'Explained Example 8: Isentropic Efficiency of a Steam Turbine'
description: Given inlet conditions, exit pressure, mass flow, and actual turbine work output, find the
  exit temperature and isentropic efficiency for steady adiabatic operation.
parent: topic:m7-14-isentropic-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.6
topics:
- topic:m7-14-isentropic-efficiency
- topic:m7-15-example-isentropic-efficiency
misconceptions:
- misc:m15-adiabatic-implies-isentropic
sources:
- path: assignments/explained-examples/ME300_Su22_EE8.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Explained Example 8: Isentropic Efficiency of a Steam Turbine

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A steam turbine operates with an inlet temperature of $780\ \text{K}$ and inlet pressure of $3\ \text{MPa}$. The exit pressure of the turbine is $0.7\ \text{MPa}$. If the mass flow is $450\ \text{kg/s}$, the work output of the turbine is $177.7\ \text{MW}$. Assuming steady, adiabatic operation, what is the final temperature of the fluid and the isentropic efficiency of the turbine?

## Given

- $T_1 = 780\ \text{K}$
- $P_1 = 3\ \text{MPa}$
- $P_2 = 0.7\ \text{MPa}$
- $\dot{m} = 450\ \text{kg/s}$
- $\dot{W}_{\text{out}} = 177.7\ \text{MW}$
- Steady, adiabatic operation

## Find

- $T_2$
- $\eta_{\text{turb}}$

## Assume

- Steady-flow
- $\Delta ke = \Delta pe = 0$
- $\dot{Q} = 0$

## Sketch

Control volume around the turbine with inlet state 1 and exit state 2; steady flow, no heat transfer.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Use the steady-flow energy equation for an adiabatic turbine with negligible kinetic and potential energy changes: $$\dot{m}\Delta h = -\dot{W}_{\text{out}}$$ so $$h_2 = h_1 - \frac{\dot{W}_{\text{out}}}{\dot{m}}.$$ (Page 1)
2. State 1: at $P_1 = 3\ \text{MPa}$ and $T_1 = 780\ \text{K}$, Table D.2 gives $T_1 > T_{\text{sat}}$, so the inlet is superheated vapor. Table D.3L gives $h_1 = 3472.6\ \text{kJ/kg}$ and $s_1 = 7.2557\ \text{kJ/(kg}\cdot\text{K)}$. (Page 1)
3. Compute the actual exit enthalpy: $$h_2 = 3472.6\ \frac{\text{kJ}}{\text{kg}} - \frac{177.7\ \text{MW}}{450\ \text{kg/s}} = 3472.6\ \frac{\text{kJ}}{\text{kg}} - 394.9\ \frac{\text{kJ}}{\text{kg}} = 3077.7\ \frac{\text{kJ}}{\text{kg}}.$$ (Page 1)
4. State 2: at $P_2 = 0.7\ \text{MPa}$, Table D.2 shows $h_2 > h_g$, so the exit is superheated vapor. Using Table D.3H with $h_2 = 3077.7\ \text{kJ/kg}$, the closest temperature is $T_2 \approx 580\ \text{K}$. (Page 2)
5. Define turbine isentropic efficiency: $$\eta_{\text{turb}} = \frac{\dot{W}_{\text{act}}}{\dot{W}_{\text{ideal}}},$$ where $$\dot{W}_{\text{ideal}} = -\dot{m}(h_{2s} - h_1)$$ and $h_{2s}$ is the exit enthalpy for an isentropic expansion. (Page 2)
6. State 2s: at $P_2 = 0.7\ \text{MPa}$ and $s_{2s} = s_1 = 7.2557\ \text{kJ/(kg}\cdot\text{K)}$, Table D.2 shows $s_{2s} > s_g$, so state 2s is superheated vapor. Table D.3H gives $h_{2s} \approx 3031.9\ \text{kJ/kg}$. (Page 2)
7. Calculate the ideal work: $$\dot{W}_{\text{ideal}} = -450\ (3031.9 - 3472.6) = 198{,}315\ \text{kW}.$$ (Page 2)
8. Calculate the isentropic efficiency: $$\eta_{\text{turb}} = \frac{177.7\ \text{MW}}{198{,}315\ \text{kW}} = \frac{177{,}700}{198{,}315} = 0.896.$$ (Page 2)

## Answer

- $T_2$: \approx 580 K
- $\eta_{\text{turb}}$: 0.896 dimensionless

## What the instructor emphasises

- Use the steady-flow energy equation with zero heat and negligible KE/PE to relate actual turbine work to the enthalpy drop.
- Find the actual exit state from $h_2$ and $P_2$, not from a direct formula for $T_2$.
- Adiabatic does not mean isentropic; the isentropic efficiency compares actual work to the ideal isentropic work.
- Always check phase with saturation tables before using superheated-vapor tables at state 2 and state 2s.
- Watch the unit conversion between MW, kg/s, and kJ/kg when computing the specific enthalpy change.
