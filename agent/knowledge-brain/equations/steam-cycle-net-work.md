---
id: eq:steam-cycle-net-work
kind: equation
title: Steam-cycle net work
description: Use this to compute the net power output of a Rankine steam cycle from pump and turbine enthalpy
  changes.
parent: topic:m8-12-example-gas-turbine-engines
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.7
latex: \dot{W}_{ST}={}_1\dot{W}_2+{}_3\dot{W}_4=-\dot{m}_{ST}[(h_2-h_1)+(h_4-h_3)]
plain_statement: The steam-cycle net power is the pump work plus turbine work, evaluated from the enthalpy
  changes around the Rankine cycle.
symbols:
- \dot{W}
- \dot{m}
- h
valid_when:
- steady-state
- steady-flow
- adiabatic
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- transient
misconceptions:
- misc:m12-boundary-flow-and-shaft-work-confused
sources:
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
  - 13
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Steam-cycle net work

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{W}_{ST}={}_1\dot{W}_2+{}_3\dot{W}_4=-\dot{m}_{ST}[(h_2-h_1)+(h_4-h_3)]
$$

This is the net power of a conventional Rankine steam cycle. The pump work is negative because h_2 > h_1, and the turbine work is positive because h_4 < h_3. The sum gives the net cycle output. This expression assumes adiabatic pump and turbine, no kinetic and potential energy changes, and one common steam mass flow through both devices. In reheat or regenerative cycles additional terms would appear. Use it to compute the Rankine contribution in a combined cycle or standalone steam plant. Keep signs consistent with the station numbering.

**Taught in:** M8.12 (`topic:m8-12-example-gas-turbine-engines`)
