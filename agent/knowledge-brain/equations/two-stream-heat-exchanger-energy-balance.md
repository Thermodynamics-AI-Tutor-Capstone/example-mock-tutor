---
id: eq:two-stream-heat-exchanger-energy-balance
kind: equation
title: Two-stream heat exchanger energy balance
description: Use for an adiabatic heat exchanger to couple the hot and cold streams and solve for one
  unknown.
parent: topic:m6-06-heat-exchangers
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: \dot{m}_h (h_{h2} - h_{h1}) = -\dot{m}_c (h_{c2} - h_{c1})
plain_statement: The rate of enthalpy decrease of the hot stream equals the rate of enthalpy increase
  of the cold stream when there is no heat loss to the surroundings.
symbols:
- \dot{m}
- h
valid_when:
- control-volume
- steady-flow
- negligible-kinetic-energy
- negligible-potential-energy
- adiabatic
invalid_when:
- closed-system
- transient
misconceptions: []
sources:
- path: lectures/Module6_6_HeatExchangers_annotated.pdf
  pages:
  - 3
- path: lectures/Module6_7_Example_HeatExchangers_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Two-stream heat exchanger energy balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{m}_h (h_{h2} - h_{h1}) = -\dot{m}_c (h_{c2} - h_{c1})
$$

If the heat exchanger is adiabatic to the surroundings, the hot-stream enthalpy decrease equals the cold-stream enthalpy increase. The sign convention is important: the hot side loses energy so its enthalpy change is negative, while the cold side gains energy. Use this relation to couple the two streams and solve for one unknown mass flow rate, exit enthalpy, or exit temperature. It assumes no work and negligible kinetic and potential energy changes for both streams.

**Taught in:** M6.6 (`topic:m6-06-heat-exchangers`), M6.7 (`topic:m6-07-example-heat-exchangers`)
