---
id: eq:entropy-change-reversible-heat
kind: equation
title: Entropy change for reversible heat transfer
description: Use to compute entropy changes from heat paths that are internally reversible.
parent: topic:m7-07-entropy
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$dS = \left.\frac{\delta Q}{T}\right|_{\text{reversible}}, \qquad \Delta S = \int_1^2 \left.\frac{\delta
  Q}{T}\right|_{\text{reversible}}$$
plain_statement: The entropy differential is reversible heat transfer divided by absolute temperature;
  integrate along a reversible path for finite change.
symbols:
- S
- Q
- T
valid_when:
- reversible
invalid_when:
- irreversible
misconceptions:
- misc:m02-entropy-and-the-second-law
- misc:m11-state-function-vs-path-function
sources:
- path: lectures/Module7_7_Entropy_annotated.pdf
  pages:
  - 3
- path: lectures/Module7_8_Example_Entropy_annotated.pdf
  pages:
  - 2
  - 4
- path: lectures/Module8_7_VaporCompression_annotated.pdf
  pages:
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Entropy change for reversible heat transfer

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$dS = \left.\frac{\delta Q}{T}\right|_{\text{reversible}}, \qquad \Delta S = \int_1^2 \left.\frac{\delta Q}{T}\right|_{\text{reversible}}$$
$$

Entropy is defined through this relation. The temperature must be the absolute temperature of the boundary where heat transfer occurs. For an irreversible actual process, do not simply use actual Q/T; evaluate entropy change along a reversible path between the same end states or use property relations. Because entropy is a state function, Delta S depends only on the end states, but the integral must be taken along a reversible path. The differential form is used to derive property relations like the Gibbs equations. A classic misuse is dividing actual irreversible heat by actual temperature and calling the result entropy change.

**Also written in the lectures as:**

- $\delta Q=T\,ds\Big|_{\mathrm{rev}}$

**Taught in:** M7.7 (`topic:m7-07-entropy`), M7.8 (`topic:m7-08-example-entropy`), M8.7 (`topic:m8-07-vapor-compression`)
