---
id: topic:m3-05-example-ideal-gas-calorific
kind: topic
title: M3.5 — Example Ideal Gas Calorific
description: 'Worked example: a three-process air cycle modeled as an ideal gas, using $P v = R T$, constant
  specific heats, and the calorific relations to find states and compute internal-energy and enthalpy
  changes.'
parent: unit:m3-ideal-and-nonideal-gases
unit: unit:m3-ideal-and-nonideal-gases
lecture: M3.5
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can apply the ideal-gas equation of state to determine unknown P, v, or T at a state
    from known states and process constraints.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can compute specific internal-energy and enthalpy changes for an ideal gas with constant
    specific heats.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can identify the constraints that isothermal, isochoric, and isobaric processes impose
    on state properties in a cycle.
  kc_type: skill
  bloom: understand
- id: '#o4'
  text: Students can explain why the sums of internal-energy and enthalpy changes around a closed cycle
    are zero because u and h are properties.
  kc_type: principle
  bloom: understand
equations:
- eq:constant-specific-heat-ideal-gas-changes
- eq:cycle-sums-of-u-and-h
- eq:ideal-gas-equation-of-state
- eq:isothermal-ideal-gas-property-changes
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
- misc:m06-temperature-is-internal-energy
examples:
- ex:m3-05-example-ideal-gas-calorific
items:
- item:hw04-1
sources:
- path: lectures/Module3_5_Example_IdealGasCalorific_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M3.5 — Example Ideal Gas Calorific

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This deck is a worked example of an ideal-gas cycle for air. The lecture solves a three-process cycle for $P$, $T$, and $v$ at every state using the ideal-gas equation of state, then computes the specific internal-energy and enthalpy changes for each process with constant specific heats.

## Key ideas

- The working fluid is air, modeled as an ideal gas with $R=287$ J/kg-K, $c_v=714$ J/kg-K, and $c_p=1001$ J/kg-K (p. 2).
- The cycle is: 1-2 isothermal expansion, 2-3 isochoric heat addition, and 3-1 isobaric compression (p. 2).
- Process constraints fix unknown states: 1-2 isothermal gives $T_2=T_1$, 2-3 isochoric gives $v_3=v_2$, and 3-1 isobaric gives $P_3=P_1$ (p. 4).
- The ideal-gas equation is used at each state to compute the missing pressure or temperature (p. 4).
- For an ideal gas with constant specific heats, the calorific relations are $\Delta u = c_v \Delta T$ and $\Delta h = c_p \Delta T$ (p. 5).
- In the isothermal process 1-2, $\Delta T = 0$, so $\Delta u = 0$ and $\Delta h = 0$ (p. 7).
- Around the complete cycle, the sums of $\Delta u$ and $\Delta h$ are zero because internal energy and enthalpy are properties and the working fluid returns to its initial state (p. 7).
- Note: p. 2 lists $T_1=300$ K, but the state table and subsequent calculations use $T_1=800$ K; the worked arithmetic is consistent with 800 K (pp. 3-7).

## Notation used

- $P$: pressure; $T$: temperature; $v$: specific volume; $R$: ideal-gas constant for air (p. 2).
- $c_v$: constant-volume specific heat; $c_p$: constant-pressure specific heat (p. 2).
- $u$: specific internal energy; $h$: specific enthalpy; $\Delta u$, $\Delta h$: changes in those properties (p. 5).

## Examples in this lecture

- Three-step air cycle: given $T_1$, $v_1$, $v_2$, $R$, and the process constraints, find all states and then compute $\Delta u$ and $\Delta h$ for processes 1-2, 2-3, and 3-1 (pp. 2-7).

## What students get wrong here

- The deck pauses on the isothermal step with a clicker question about the change in internal energy for process 1-2. The expected result is zero; the annotation states that $\Delta T=0$ gives $\Delta u=0$ and $\Delta h=0$ for this ideal gas (pp. 6-7).
