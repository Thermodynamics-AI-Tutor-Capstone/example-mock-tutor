---
id: ex:ee04-steady-flow-energy-equation-for-a-hair-dryer-heat
kind: example
title: Steady-flow energy equation for a hair-dryer heat exchanger
description: 'Analyze a central heat exchanger supplying four identical dryer nozzles: find each nozzle''s
  mass flow and the air exit temperature from steady-flow energy balances.'
parent: topic:m6-02-steady-flow-energy-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.6
topics:
- topic:m6-02-steady-flow-energy-conservation
- topic:m6-06-heat-exchangers
misconceptions:
- misc:m01-heat-energy-temperature-conflated
sources:
- path: assignments/explained-examples/ME300_Su22_EE4.pdf
  pages:
  - 1
  - 2
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Steady-flow energy equation for a hair-dryer heat exchanger

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

An inventor is developing a better industrial hair dryer for salons where a central heat exchanger heats the air and disperses it to a number of different drying stations. Her prototype for a small salon has four dryers with identical nozzles. The working fluid is air and the mass flow at the entrance to the heat exchanger is a steady 8 kg/s.

(a) Redraw a sketch of the device with a control volume, showing where the mass and energy flows are, and calculate the mass flow through the end of each nozzle.

(b) Air is sucked into the heat exchanger at 300 K and 0.2 MPa. Water enters the heat exchanger as a subcooled liquid with a temperature of 500 K and a pressure of 10 MPa at 1 kg/s and leaves at the same pressure and a temperature of 380 K. Given these conditions, what is the temperature of the air leaving the heat exchanger? Make sure to list your assumptions.

## Given

- Working fluid: air
- Air inlet mass flow rate: $\dot m_a = 8\ \text{kg/s}$
- Air inlet state: $T_1 = 300\ \text{K}$, $P_1 = 0.2\ \text{MPa}$
- Water mass flow rate: $\dot m_w = 1\ \text{kg/s}$
- Water inlet state: subcooled liquid, $T_1 = 500\ \text{K}$, $P_1 = 10\ \text{MPa}$
- Water exit state: $T_2 = 380\ \text{K}$, $P_2 = P_1 = 10\ \text{MPa}$

## Find

- Mass flow rate through each of the four identical nozzles
- Air temperature leaving the heat exchanger, $T_{2,\text{air}}$

## Assume

- Air is ideal
- H₂O is S.C.S.
- Quasi-steady operation
- $\Delta ke = \Delta pe = 0$
- Passive device: $\dot W = 0$
- No heat lost to the surroundings

## Sketch

Horizontal heat-exchanger duct: air enters at the left with mass flow rate $\dot m$, heat transfer $\dot Q$ is shown into the control volume, and the right side splits into four identical nozzle outlets, each discharging $\dot m/4$.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Draw a single control volume around the heat exchanger and its outlet manifold. Show air entering at the left with $\dot m = 8\ \text{kg/s}$, heat transfer $\dot Q$ into the CV, and four equal outlet streams, each $\dot m/4$.
2. For four identical outlets and steady flow, each nozzle carries $\dot m/4 = 8/4 = 2\ \text{kg/s}$.
3. Apply the steady-flow energy equation to the air: $\dot m( \Delta h + \Delta ke + \Delta pe) = \dot Q - \dot W$. With $\Delta ke = \Delta pe = 0$ and $\dot W = 0$, this reduces to $\dot m c_p \Delta T = \dot Q$, so $T_2 = T_1 + \frac{\dot Q}{\dot m c_p}$.
4. Apply the same steady-flow energy equation to the water: with negligible kinetic and potential energy changes and no work, $\dot m \Delta h = \dot Q$. At state 1, $T_1 = 500\ \text{K}$ and $P_1 = 10\ \text{MPa}$, Table D.4B gives $h_1 = 977.18\ \text{kJ/kg}$. At state 2, $T_2 = 380\ \text{K}$ and $P_2 = 10\ \text{MPa}$, Table D.4B gives $h_2 = 458.37\ \text{kJ/kg}$.
5. Calculate the water-side heat transfer: $\dot Q_{\text{water}} = \dot m(h_2 - h_1) = (1)(458.37 - 977.18) = -521.81\ \text{kJ/s}$.
6. The water loses the heat that the air gains. Therefore $\dot Q_{\text{air}} = -\dot Q_{\text{water}} = 521.81\ \text{kJ/s} = 521810\ \text{W}$.
7. Substitute into the air temperature relation: $T_{2,\text{air}} = 300 + \frac{521810}{(8)(1001)} = 365.16\ \text{K}$.

## Answer

- Mass flow rate through each nozzle: 2 kg/s
- Air temperature leaving the heat exchanger: 365.16 K

## What the instructor emphasises

- For a steady-flow device, choose the control volume first and include every mass and energy flow crossing the boundary.
- Neglecting kinetic/potential energy changes and shaft work turns the steady-flow energy equation into an enthalpy balance.
- The sign of $\dot Q$ is important: the water stream has $\dot Q < 0$ because it cools, while the air stream has $\dot Q > 0$ because it warms.
- Use the water property tables to compute the heat transfer, then use the ideal-gas relation $\Delta h = c_p \Delta T$ for the air side.
