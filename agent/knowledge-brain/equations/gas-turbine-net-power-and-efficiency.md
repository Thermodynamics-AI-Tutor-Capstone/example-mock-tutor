---
id: eq:gas-turbine-net-power-and-efficiency
kind: equation
title: Gas-turbine net power and efficiency
description: Use this to compute the net output and efficiency of a simple steady-flow gas-turbine cycle
  with constant specific heats.
parent: topic:m8-12-example-gas-turbine-engines
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \dot{W}_{GT}={}_1\dot{W}_2+{}_3\dot{W}_4=-\dot{m}c_p[(T_2-T_1)+(T_4-T_3)],\quad \eta_{GT}=\frac{\dot{W}_{GT}}{\dot{Q}_{in}}
plain_statement: Gas-turbine net power is the sum of compressor and turbine work rates; thermal efficiency
  is that net power divided by the combustor heat addition rate.
symbols:
- \dot{W}
- \dot{m}
- c_p
- T
- \eta_{th}
- \dot{Q}
valid_when:
- ideal-gas
- constant-specific-heats
- steady-flow
- adiabatic
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- variable-specific-heats
- transient
misconceptions:
- misc:m12-boundary-flow-and-shaft-work-confused
sources:
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
  - 11
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Gas-turbine net power and efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{W}_{GT}={}_1\dot{W}_2+{}_3\dot{W}_4=-\dot{m}c_p[(T_2-T_1)+(T_4-T_3)],\quad \eta_{GT}=\frac{\dot{W}_{GT}}{\dot{Q}_{in}}
$$

This combines the compressor and turbine work rates to get the gas-turbine net power. With constant c_p, each work term is -m_dot c_p \Delta T. The net power is the algebraic sum, accounting for the signs of the temperature differences. The thermal efficiency is the net power divided by the heat addition rate. Use this for air-standard Brayton cycles when temperatures are known or found from isentropic relations. Students sometimes forget the minus sign on the work terms and get the wrong sign for net work. Keep the station order consistent with the cycle diagram.

**Taught in:** M8.12 (`topic:m8-12-example-gas-turbine-engines`)
