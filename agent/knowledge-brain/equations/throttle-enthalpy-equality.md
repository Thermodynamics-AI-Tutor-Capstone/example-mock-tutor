---
id: eq:throttle-enthalpy-equality
kind: equation
title: Throttle enthalpy equality
description: Use for an adiabatic throttling valve to fix the exit state when the exit pressure is known.
parent: topic:m6-05-throttles
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: h_2 = h_1
plain_statement: For an adiabatic throttle with no work and negligible kinetic and potential energy changes,
  the specific enthalpy entering and leaving is the same.
symbols:
- h
valid_when:
- control-volume
- steady-flow
- throttling
- adiabatic
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- closed-system
- transient
misconceptions:
- misc:m15-adiabatic-implies-isentropic
sources:
- path: lectures/Module6_5_Throttles_annotated.pdf
  pages:
  - 3
- path: lectures/Module8_7_VaporCompression_annotated.pdf
  pages:
  - 3
  - 5
- path: lectures/Module8_8_Example_VaporCompression_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Throttle enthalpy equality

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
h_2 = h_1
$$

Under the throttle assumptions, the steady-flow energy balance leaves only the enthalpy-change term. Heat transfer, work, kinetic energy change, and potential energy change are all canceled. Therefore the specific enthalpy at the exit equals that at the inlet, even though the pressure drops through the throttle. Use $h_2=h_1$ to fix state 2 when $P_2$ is known. This does not mean the temperature remains constant; for real substances temperature can change during throttling.

**Also written in the lectures as:**

- $h_f=h_i$

**Taught in:** M6.5 (`topic:m6-05-throttles`), M8.7 (`topic:m8-07-vapor-compression`), M8.8 (`topic:m8-08-example-vapor-compression`)
