---
id: ex:m8-12-example-gas-turbine-engines
kind: example
title: Combined Cycle Analysis Example
description: 'Worked example: use gas-turbine exhaust to drive an ideal Rankine steam cycle, then find
  steam mass flow, combined net work, and combined efficiency.'
parent: topic:m8-12-example-gas-turbine-engines
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-12-example-gas-turbine-engines
misconceptions: []
sources:
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
  - 10
  - 11
  - 12
  - 13
  - 14
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Combined Cycle Analysis Example

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

The Taurus 70 gas turbine has a pressure ratio of 16.5, a mass flow of 26.4 kg/s, and a heat addition rate of 23790 kW. Assume an ideal air standard cycle with $T_1=300$ K and $P_1=0.1$ MPa ($R=287$ J/kg-K, $\gamma=1.4$, $c_p=1001$ J/kg-K). The exhaust from this engine powers an ideal Rankine cycle that runs between 1 MPa and 10 MPa with saturated liquid before the pump and saturated vapor coming out of the boiler. Using this information, calculate the water mass flow rate of the Rankine cycle, the net work of the combined cycle, and the efficiency of the combined cycle (Page 5).

## Given

- Gas-turbine pressure ratio $PR = 16.5$ (Page 5).
- Air mass flow rate $\dot{m}_{air}=26.4$ kg/s (Page 5).
- Gas-turbine heat addition rate $\dot{Q}_{in}=23790$ kW (Page 5).
- Ideal air-standard cycle values: $T_1=300$ K, $P_1=0.1$ MPa, $R=287$ J/kg-K, $\gamma=1.4$, $c_p=1001$ J/kg-K (Page 5).
- Rankine cycle operates between 1 MPa and 10 MPa, saturated liquid before the pump and saturated vapor leaving the boiler (Page 5).

## Find

- $\dot{m}_{H_2O}$ for the Rankine cycle (Page 6).
- $\dot{W}_{net,cc} = \dot{W}_{GT} + \dot{W}_{ST}$ (Page 6).
- $\eta_{cc}$ (Page 6).

## Assume

- Brayton cycle: air-standard ideal gas, ideal cycle (reversible), constant specific heats, steady flow (Page 9).
- Rankine cycle: ideal cycle (reversible), S.C.S., steady flow (Page 9).

## Sketch

Instructor sketches a combined-cycle schematic: air enters the gas-turbine compressor, is heated in the combustor, expands through the turbine, and the turbine exhaust flows through a heat exchanger that supplies heat to the Rankine steam cycle. The steam cycle shows pump → heat exchanger → steam turbine → condenser (Page 6).

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Set up the heat transfer between cycles: the gas-turbine exhaust passes through a heat exchanger that supplies heat to the Rankine steam cycle, so $\dot{Q}_{out,GT} = -\dot{Q}_{in,ST}$ (Page 6).
2. Use the combined-cycle definitions: $\dot{W}_{net,cc} = \dot{W}_{GT}+\dot{W}_{ST} = ({}_1\dot{W}_2 + {}_3\dot{W}_4)_{GT} + ({}_1\dot{W}_2 + {}_3\dot{W}_4)_{ST}$ and $\eta_{cc} = \dot{W}_{net,cc}/\dot{Q}_{in}$ (Page 8).
3. Find the steam mass flow from the energy balance on the heat exchanger: $\dot{Q}_{in,ST} = \dot{m}_{ST}(h_3-h_2)$, so $\dot{m}_{ST} = \dot{Q}_{in,ST}/(h_3-h_2)$ (Page 8).
4. For the compressor, pump, and turbines, take $\Delta ke = \Delta pe = 0$ and $\dot{Q}=0$, so $\dot{W} = -\dot{m}\Delta h$. For the air side use $\dot{W} = -\dot{m}c_p\Delta T$; for the steam side use tabulated enthalpies (Page 8).
5. Find Brayton state 2: $P_2 = 16.5P_1 = 1.65$ MPa; for the ideal air-standard compression, $T_2 = T_1(PR)^{(\gamma-1)/\gamma}=300(16.5)^{0.4/1.4}=668.3$ K (Page 10).
6. Find Brayton state 3 from the heat addition: ${}_2\dot{Q}_3=23790\times10^3$ W $=\dot{m}_{air}c_p(T_3-T_2)$, so $T_3=668.3 + 23790\times10^3/(26.4\times1001)=1568.5$ K (Page 10).
7. Find Brayton state 4: $P_4=P_1$, and for the ideal turbine expansion $T_4=T_3(1/PR)^{(\gamma-1)/\gamma}=1568.5(1/16.5)^{0.4/1.4}=704.1$ K (Page 10).
8. Compute gas-turbine net work: $\dot{W}_{GT} = {}_1\dot{W}_2 + {}_3\dot{W}_4 = -\dot{m}_{air}c_p[(T_2-T_1)+(T_4-T_3)] = -(26.4)(1001)[(668.3-300)+(704.1-1568.5)] = 13110.14$ kW (Page 11).
9. Compute gas-turbine efficiency and heat rejection: $\eta_{GT} = \dot{W}_{GT}/\dot{Q}_{in} = 13110.14/23790 = 0.551$. The magnitude of heat rejected is $|\dot{Q}_{out}| = \dot{Q}_{in} - \dot{W}_{GT} = 23790 - 13110.14 = 10679.86$ kW, which is used as $\dot{Q}_{in,ST}$ (Page 11).
10. Find Rankine state 1: $P_1=1$ MPa, $x_1=0$; Table D.2 gives $h_1=h_f=762.52$ kJ/kg and $s_1=s_f=2.1381$ kJ/kg-K (Page 12).
11. Find Rankine state 2: $P_2=10$ MPa with $s_2=s_1=2.1381$ kJ/kg-K; Table D.2 shows $s_2<s_f$, so it is compressed liquid; Table D.4B gives $h_2=773.055$ kJ/kg (Page 12).
12. Find Rankine state 3: $P_3=10$ MPa, $x_3=1$; Table D.2 gives $h_3=h_g=2725.5$ kJ/kg and $s_3=s_g=5.6160$ kJ/kg-K (Page 12).
13. Find Rankine state 4: $P_4=1$ MPa, $s_4=s_3=5.6160$ kJ/kg-K; Table D.2 gives $s_f<s_4<s_g$, so it is a mixture. Then $x_4=(s_4-s_f)/(s_g-s_f)=0.78$ and $h_4=x_4h_g+(1-x_4)h_f=2333.89$ kJ/kg (Page 12).
14. Compute steam mass flow: $\dot{m}_{ST} = \dot{Q}_{in,ST}/(h_3-h_2) = 10679.86/(2725.5-773.055) = 5.47$ kg/s (Page 13).
15. Compute steam-turbine net work: $\dot{W}_{ST} = {}_1\dot{W}_2 + {}_3\dot{W}_4 = -\dot{m}_{ST}[(h_2-h_1)+(h_4-h_3)] = -5.47[(773.055-762.52)+(2333.89-2725.5)] = 2084.5$ kW (Page 13).
16. Compute combined net work: $\dot{W}_{cc} = \dot{W}_{GT}+\dot{W}_{ST} = 13110.14+2084.5 = 15194.62$ kW (Page 14).
17. Compute combined efficiency: $\eta_{cc} = \dot{W}_{cc}/\dot{Q}_{in} = 15194.62/23790 = 0.6387$, so $\eta_{cc}=63.87\%$ (Page 14).

## Answer

- water mass flow rate of the Rankine cycle: 5.47 kg/s
- net work of the combined cycle: 15194.62 kW
- efficiency of the combined cycle: 63.87 %

## What the instructor emphasises

- The combined cycle uses the gas-turbine exhaust heat to run the Rankine cycle instead of rejecting it; the combined efficiency is 63.87%, higher than the gas turbine alone at 55.1% (Pages 11, 14).
- Use $\dot{W}=-\dot{m}c_p\Delta T$ only for the air-standard gas-turbine part; for the steam part use tabulated enthalpies, not a constant-$c_p$ ideal-gas relation (Pages 8, 12).
- For the adiabatic compressor, pump, and turbines with negligible kinetic and potential energy changes, $\dot{W}=-\dot{m}\Delta h$ (Page 8).
- The sign convention around $\dot{Q}_{out,GT}=-\dot{Q}_{in,ST}$ is easy to trip on: the slide uses the positive magnitude $10679.86$ kW as the Rankine heat input (Page 11).
- The Rankine pump exit is treated as compressed liquid; using $s_2=s_1$ sends you to compressed-liquid Table D.4B for $h_2$ (Page 12).
