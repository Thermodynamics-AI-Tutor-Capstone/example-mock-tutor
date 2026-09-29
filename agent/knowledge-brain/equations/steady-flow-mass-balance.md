---
id: eq:steady-flow-mass-balance
kind: equation
title: Steady-flow mass balance for a single stream
description: Use for a single-inlet, single-exit steady device to equate entering and leaving mass flow
  rates.
parent: topic:m6-02-steady-flow-energy-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: \dot{m}_{in} = \dot{m}_{out}
plain_statement: For steady flow with a single stream, the entering and leaving mass flow rates are equal.
symbols:
- \dot{m}
valid_when:
- steady-flow
- control-volume
- single-inlet-single-exit
invalid_when:
- transient
- closed-system
misconceptions: []
sources:
- path: lectures/Module6_2_SteadyFlowEnergyConservation_annotated.pdf
  pages:
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Steady-flow mass balance for a single stream

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\dot{m}_{in} = \dot{m}_{out}
$$

For steady flow through a single-inlet, single-exit control volume, the mass inside is not changing, so the entering and leaving mass flow rates must be equal. This is a quick consistency check and eliminates one unknown when the same stream flows steadily through a device. It is not valid during start-up or shut-down transients and does not apply to a closed system, where there is no mass crossing the boundary. Use it together with the mass-flow-rate relation to find one unknown velocity, area, or density.

**Taught in:** M6.2 (`topic:m6-02-steady-flow-energy-conservation`)
