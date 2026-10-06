---
id: topic:m8-08-example-vapor-compression
kind: topic
title: M8.8 — Example Vapor Compression
description: 'Worked example of an ideal R-134a vapor-compression refrigerator: state fixing, property
  lookup, steady-flow energy balances, and COP calculation.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.8
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify the four processes and state-property relations in an ideal vapor-compression
    cycle.
  kc_type: principle
  bloom: understand
- id: '#o2'
  text: Students can apply steady-flow energy balances to calculate heat and work rates from enthalpy
    changes.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can compute the coefficient of performance from the heat-removal rate and compressor
    power.
  kc_type: skill
  bloom: apply
equations:
- eq:isentropic-exit-state
- eq:single-stream-heat-exchanger-energy-balance
- eq:steady-flow-energy-adiabatic-single-stream
- eq:throttle-enthalpy-equality
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
examples:
- ex:m8-08-example-vapor-compression
items:
- item:final-2021-g
- item:final-2021-h
- item:final-2021-i
- item:final-2021-j
- item:final-2022-6
- item:final-2023-5
- item:final-2023-h
- item:final-2023-i
- item:final-2023-j
- item:hw10-2
sources:
- path: lectures/Module8_8_Example_VaporCompression_annotated.pdf
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

# M8.8 — Example Vapor Compression

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This worked example finds the heat-removal rate, compressor power, heat-rejection rate, and coefficient of performance for an ideal vapor-compression refrigerator using R-134a between 0.14 MPa and 0.8 MPa.

## Key ideas

- The four states are fixed by two pressures and two phase conditions: State 1 is saturated vapor at the low pressure, and State 3 is saturated liquid at the high pressure (p. 2, p. 4).
- The ideal-cycle assumptions listed on p. 2 (reversible, S.C.S., steady-flow, quasi-steady) give the cycle relations $s_2=s_1$ for the compressor and $h_4=h_3$ for the throttle (p. 4).
- Table A.2 supplies $h_1=387.32$ kJ/kg, $s_1=1.7402$ kJ/kg-K, and $h_3=243.65$ kJ/kg; matching $P_2=0.8$ MPa with $s_2=s_1$ identifies State 2 as vapor and gives $h_2=424.59$ kJ/kg (p. 3-4).
- Steady-flow device balances become ${}_1\dot W_2=-\dot m(h_2-h_1)$, ${}_2\dot Q_3=\dot m(h_3-h_2)$, and ${}_4\dot Q_1=\dot m(h_1-h_4)$ in this example (p. 5).
- The computed rates are ${}_1\dot W_2=-1.86$ kW, ${}_2\dot Q_3=-9.047$ kW (heat rejection), and ${}_4\dot Q_1=7.1835$ kW (heat absorption from the cold space) (p. 5).
- The COP is the desired heat-removal rate divided by positive compressor power: $\beta=3.86$ (p. 5).

## Notation used

- $\dot m$ = mass flow rate; $\dot Q$ and $\dot W$ are energy-transfer rates; pre-subscripts denote the process endpoints.
- $P$ is pressure, $x$ is quality, $h$ is specific enthalpy, and $s$ is specific entropy.
- $\beta$ is coefficient of performance.

## Examples in this lecture

- Refrigerator with R-134a: given $P_1=P_4=0.14$ MPa, $P_2=P_3=0.8$ MPa, $x_1=1$, $x_3=0$, and $\dot m=0.05$ kg/s. Demonstrates state-property lookup in Table A.2 and steady-flow calculation of $\dot Q$, $\dot W$, and $\beta$.
