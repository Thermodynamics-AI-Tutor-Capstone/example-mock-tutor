---
id: eq:finite-time-conservation-balance
kind: equation
title: Finite-time conservation balance
description: Generic finite-time accounting template for any conserved quantity; use it to set up mass,
  energy, or entropy balances between two times.
parent: topic:m1-05-conservation-principles
unit: unit:m1-introduction-and-conservation
status: auto
audience: both
priority: 0.7
latex: \Delta X_{sys} = X(t_2) - X(t_1) = X_{in} - X_{out} + X_{gen}
plain_statement: For a system over the interval from t1 to t2, the change in a conserved quantity equals
  input minus output plus generated amount.
symbols: []
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module1_5_ConservationPrinciples_annotated.pdf
  pages:
  - 3
- path: lectures/Module4_6_CourseReview_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Finite-time conservation balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\Delta X_{sys} = X(t_2) - X(t_1) = X_{in} - X_{out} + X_{gen}
$$

Finite-time conservation balance: for a conserved quantity $X$, the change in the system from $t_1$ to $t_2$ equals net transfer plus generation, $\Delta X_{sys}=X(t_2)-X(t_1)=X_{in}-X_{out}+X_{gen}$ (M1.5 page 3). Use this as a template for mass, energy, or entropy accounting over a finite interval. Keep sign conventions consistent: $X_{in}$ and $X_{gen}$ add to the system, $X_{out}$ subtracts. Do not confuse the stored change $\Delta X_{sys}$ with the boundary transfer terms $X_{in}$ and $X_{out}$.

**Also written in the lectures as:**

- $\Delta E_{sys} = E_{in} - E_{out} + E_{gen}$
- $\Delta X_{\mathrm{sys}} = X_{\mathrm{in}} - X_{\mathrm{out}} + X_{\mathrm{gen}}$

**Taught in:** M1.5 (`topic:m1-05-conservation-principles`), M4.6 (`topic:m4-06-course-review`)
