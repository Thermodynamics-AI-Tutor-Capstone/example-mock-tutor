---
id: topic:m7-13-example-isentropic-turbine
kind: topic
title: M7.13 — Example Isentropic Turbine
description: Worked example applying the steady-flow first law and steam tables to find the steam mass
  flow rate for a 25 MW ideal isentropic turbine; use when teaching turbine work, isentropic idealizations,
  or saturated-mixture exit states.
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.13
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: 'Students can identify the modeling assumptions used for an ideal steam turbine: steady flow,
    negligible kinetic and potential energy changes, and adiabatic.'
  kc_type: principle
  bloom: understand
- id: '#o2'
  text: Students can apply the steady-flow first-law relation to compute mass flow rate from shaft power
    and specific enthalpy change.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can use steam tables to evaluate state properties, quality, and exit enthalpy for an
    isentropic turbine with a saturated-mixture exit.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can explain that a non-ideal turbine produces less work than an isentropic turbine.
  kc_type: principle
  bloom: understand
equations:
- eq:isentropic-exit-state
- eq:quality-from-entropy
- eq:steady-flow-energy-adiabatic-single-stream
- eq:two-phase-enthalpy-mixing-rule
misconceptions:
- misc:m15-adiabatic-implies-isentropic
examples:
- ex:ee07-explained-example-7-isentropic-expansion
- ex:m7-13-example-isentropic-turbine
items:
- item:exam2-2021-ii-1
- item:exam2-2022-ii-1a-1c
- item:hw09-1
sources:
- path: lectures/Module7_13_Example_IsentropicTurbine_annotated.pdf
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

# M7.13 — Example Isentropic Turbine

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This slide deck is a worked example: find the steam mass flow rate needed to produce 25 MW of shaft power from an ideal (adiabatic and reversible) steam turbine entering at 10 MPa and 720 K and exiting at 5 kPa (p. 2). It also asks clicker questions about assumptions and non-ideal turbine work (pp. 3, 7).

## Key ideas

- The turbine is modeled as a steady-flow device with negligible kinetic and potential energy changes. The word "reversible" is underlined on p. 2 because the idealization requires both adiabatic and reversible; this gives the isentropic condition $s_1=s_2$.
- The first law for this case reduces to $\dot{W} = -\dot{m}(h_2-h_1)$, so the mass flow rate is $\dot{m} = -\dot{W}/(h_2-h_1)$ (p. 2).
- State 1 is found from steam tables: at 10 MPa, $T_1 = 720$ K is above $T_{sat}=584.15$ K, so the inlet is superheated vapor; the table gives $h_1 = 3233.7$ kJ/kg and $s_1 = 6.4098$ kJ/kg (p. 4).
- State 2 is fixed by $P_2 = 5$ kPa and $s_2=s_1$. Since $s_f = 0.4716$ kJ/kg and $s_g = 8.4012$ kJ/kg at 5 kPa, $s_2$ lies between them, so the exit is a saturated mixture with quality $x_2=0.749$ (p. 5).
- The exit enthalpy is then computed from the mixture rule, $h_2 = x_2 h_g +(1-x_2)h_f = 1951.8$ kJ/kg (p. 5).
- Substituting the enthalpy change gives the final answer $\dot{m}=19.5$ kg/s (p. 6).
- The final clicker question checks that a non-ideal turbine produces less work than an isentropic turbine; the annotated answer is "Less than" (p. 7).

## Notation used

- $\dot{m}$: mass flow rate
- $\dot{W}$: shaft power
- $\Delta h = h_2-h_1$: specific enthalpy change
- $\Delta ke$, $\Delta pe$: specific kinetic and potential energy changes
- $h$, $s$: specific enthalpy and specific entropy
- $x$: quality
- $h_f$, $h_g$, $s_f$, $s_g$: saturated liquid and saturated vapor properties

## Examples in this lecture

- Determine the flow rate required to produce 25 MW from an ideal steam turbine with inlet at 10 MPa and 720 K and exit at 5 kPa. This demonstrates the steady-flow first-law reduction followed by steam-table state evaluation and saturated-mixture enthalpy calculation (pp. 2-6).
- Clicker questions ask which assumptions are appropriate (p. 3) and whether a non-ideal turbine produces greater, less than, or the same work as an isentropic turbine (p. 7).

## What students get wrong here

- The idealization is not adiabatic alone; the slide explicitly writes "ad + rev → isentropic" (p. 2), so do not let students equate adiabatic with isentropic without reversibility.
- The final clicker question corrects the idea that a non-ideal turbine might produce the same or greater work; the annotated answer is "Less than" (p. 7).
