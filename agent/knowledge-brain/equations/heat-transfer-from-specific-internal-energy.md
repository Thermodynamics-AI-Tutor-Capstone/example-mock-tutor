---
id: eq:heat-transfer-from-specific-internal-energy
kind: equation
title: Heat transfer from specific internal energy
description: Use for a stationary rigid tank where energy transfer is heat only.
parent: topic:m5-06-example-2-energy-conservation
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.7
latex: ${}_1Q_2 = M(u_2-u_1)$
plain_statement: For a closed system with no work and negligible KE/PE changes, heat transfer equals mass
  times specific internal energy change.
symbols:
- M
- u
valid_when:
- closed-system
- negligible-kinetic-energy
- negligible-potential-energy
invalid_when:
- open-system
- control-volume
misconceptions: []
sources:
- path: lectures/Module5_6_Example2_EnergyConservation_annotated.pptx
  slides:
  - 4
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Heat transfer from specific internal energy

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
${}_1Q_2 = M(u_2-u_1)$
$$

With no work and negligible kinetic and potential energy changes, the energy balance reduces to $\Delta U = {}_1Q_2$. Since $\Delta U = M(u_2-u_1)$, the heat transfer is obtained from the mass and the tabulated or calculated specific internal energies. This is the working equation for the rigid-tank example.

**Taught in:** M5.6 (`topic:m5-06-example-2-energy-conservation`)
