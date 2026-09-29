---
id: ex:m8-08-example-vapor-compression
kind: example
title: Ideal vapor-compression refrigeration cycle with R-134a
description: A refrigerator using R-134a operates on an ideal vapor-compression cycle; find the heat removal,
  compressor power, heat rejection, and COP.
parent: topic:m8-08-example-vapor-compression
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-08-example-vapor-compression
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
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

# Ideal vapor-compression refrigeration cycle with R-134a

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A refrigerator uses refrigerant R-134a as the working fluid and operates on an ideal vapor compression cycle between 0.14 and 0.8 MPa, with State 1 as a saturated vapor and State 3 as a saturated liquid. If the mass flow rate of the refrigerant is 0.05 kg/s, determine: the rate of heat removal from the refrigerated space, the power input to the compressor, the rate of heat rejection to the environment, and the coefficient of performance. (p. 2)

## Given

- \(P_1 = P_4 = 0.14\ \text{MPa}\) (p. 2)
- \(P_2 = P_3 = 0.8\ \text{MPa}\) (p. 2)
- State 1 is saturated vapor, \(x_1 = 1\) (p. 2)
- State 3 is saturated liquid, \(x_3 = 0\) (p. 2)
- \(\dot{m} = 0.05\ \text{kg/s}\) (p. 2)

## Find

- Rate of heat removal from the refrigerated space, \({}_4\dot{Q}_1\) (p. 2)
- Power input to the compressor, \({}_1\dot{W}_2\) (p. 2)
- Rate of heat rejection to the environment, \({}_2\dot{Q}_3\) (p. 2)
- Coefficient of performance, \(\beta\) (p. 2)

## Assume

- Ideal vapor-compression cycle (p. 2)
- Reversible (p. 2)
- Steady-flow (p. 2)
- Quasi-steady (p. 2)

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. At State 1, \(P_1 = 0.14\ \text{MPa}\) and \(x_1 = 1\). From the R-134a saturation table, \(h_1 = h_g = 387.32\ \text{kJ/kg}\) and \(s_1 = s_g = 1.7402\ \text{kJ/kg-K}\). (p. 4, p. 3)
2. For the reversible compression to State 2, \(s_2 = s_1 = 1.7402\ \text{kJ/kg-K}\). At \(P_2 = 0.8\ \text{MPa}\), the saturation table gives \(s_g = 1.7140\ \text{kJ/kg-K}\). Since \(s_2 > s_g\), State 2 is superheated vapor; the example gives \(h_2 = 424.59\ \text{kJ/kg}\). (p. 4, p. 3)
3. At State 3, \(P_3 = 0.8\ \text{MPa}\) and \(x_3 = 0\), so it is saturated liquid: \(h_3 = h_f = 243.65\ \text{kJ/kg}\). (p. 4)
4. For the expansion to State 4, \(h_4 = h_3 = 243.65\ \text{kJ/kg}\) at \(P_4 = 0.14\ \text{MPa}\). (p. 4)
5. Compressor power input: \({}_1\dot{W}_2 = -\dot{m}(h_2 - h_1) = -0.05(424.59 - 387.32) = -1.86\ \text{kW}\). The negative sign indicates work input. (p. 5)
6. Rate of heat rejection: \({}_2\dot{Q}_3 = \dot{m}(h_3 - h_2) = 0.05(243.65 - 424.59) = -9.047\ \text{kW}\). The negative sign indicates heat rejection to the environment. (p. 5)
7. Rate of heat removal from the refrigerated space: \({}_4\dot{Q}_1 = \dot{m}(h_1 - h_4) = 0.05(387.32 - 243.65) = 7.1835\ \text{kW}\). (p. 5)
8. Coefficient of performance: \(\beta = \frac{{}_4\dot{Q}_1}{-{}_1\dot{W}_2} = \frac{7.1835}{1.86} = 3.86\). (p. 5)

## Answer

- $Rate of heat removal from refrigerated space, \({}_4\dot{Q}_1\) (p. 5)$: 7.1835 kW
- $Compressor power input, \(-{}_1\dot{W}_2\) (p. 5)$: 1.86 kW
- $Rate of heat rejection to the environment, \(-{}_2\dot{Q}_3\) (p. 5)$: 9.047 kW
- $Coefficient of performance, \(\beta\) (p. 5)$: 3.86 dimensionless

## What the instructor emphasises

- Use the R-134a saturation table for saturation states: \(h_g, s_g\) at State 1 and \(h_f\) at State 3. (p. 4, p. 3)
- For the ideal/reversible compressor stage, \(s_2 = s_1\). Compare \(s_2\) with \(s_g\) at \(P_2\) to identify whether State 2 is superheated. (p. 4)
- The expansion device is modeled as constant enthalpy: \(h_4 = h_3\). (p. 4)
- Watch sign conventions: negative \({}_1\dot{W}_2\) is compressor work input; negative \({}_2\dot{Q}_3\) is heat rejected. Use magnitudes in the COP calculation. (p. 5)
