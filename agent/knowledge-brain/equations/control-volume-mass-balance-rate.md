---
id: eq:control-volume-mass-balance-rate
kind: equation
title: Rate form of the control-volume mass balance
description: Use for filling, draining, or multi-stream control-volume mass balances; there is no mass-generation
  term.
parent: topic:m6-01-mass-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: both
priority: 0.7
latex: \frac{dM}{dt}\Big|_{cv} = \dot{m}_{in} - \dot{m}_{out}
plain_statement: The rate of mass accumulation inside a control volume equals the inlet mass flow rate
  minus the outlet mass flow rate.
symbols:
- \dot{m}
valid_when:
- control-volume
invalid_when:
- closed-system
misconceptions: []
sources:
- path: lectures/Module6_1_MassConservation_annotated.pdf
  pages:
  - 2
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Rate form of the control-volume mass balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\frac{dM}{dt}\Big|_{cv} = \dot{m}_{in} - \dot{m}_{out}
$$

This is the instantaneous mass balance for a control volume. The left side is the rate at which mass accumulates inside the control volume; the right side is the net rate mass crosses the boundary by inlet and outlet streams. Mass is conserved, so no generation term appears. Use it when the problem asks about filling or draining rates, when several streams enter or leave, or when checking whether mass flow rates are consistent. For a closed system the flow terms are zero and the equation says the system mass is constant. Do not add a mass-generation term; mass cannot be created or destroyed in this balance.

**Taught in:** M6.1 (`topic:m6-01-mass-conservation`)
