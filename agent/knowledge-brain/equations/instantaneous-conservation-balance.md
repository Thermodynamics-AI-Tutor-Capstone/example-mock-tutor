---
id: eq:instantaneous-conservation-balance
kind: equation
title: Instantaneous conservation balance
description: Rate form of the conservation balance; use it for transient systems or time-varying flows,
  and set the storage term to zero for steady state.
parent: topic:m1-05-conservation-principles
unit: unit:m1-introduction-and-conservation
status: auto
audience: both
priority: 0.7
latex: \frac{dX_{sys}}{dt} = \dot{X}_{in} - \dot{X}_{out} + \dot{X}_{gen}
plain_statement: Time rate of change of a conserved quantity inside a system equals rate in minus rate
  out plus rate generated.
symbols: []
valid_when: []
invalid_when: []
misconceptions: []
sources:
- path: lectures/Module1_5_ConservationPrinciples_annotated.pdf
  pages:
  - 4
- path: lectures/Module4_6_CourseReview_annotated.pdf
  pages:
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Instantaneous conservation balance

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
\frac{dX_{sys}}{dt} = \dot{X}_{in} - \dot{X}_{out} + \dot{X}_{gen}
$$

Instantaneous conservation balance: $\frac{dX_{sys}}{dt}=\dot{X}_{in}-\dot{X}_{out}+\dot{X}_{gen}$ (M1.5 page 4). This is the rate form of the general balance; it applies when you need the time rate of change of a conserved quantity $X$. Use it for transient systems and for control volumes with time-varying flows. For steady state, set $dX_{sys}/dt=0$ and solve the algebraic rate balance. Convert between finite-time and instantaneous forms by integrating or differentiating with respect to time.

**Also written in the lectures as:**

- $\left.\frac{dX}{dt}\right|_{\mathrm{sys}} = \dot{X}_{\mathrm{in}} - \dot{X}_{\mathrm{out}} + \dot{X}_{\mathrm{gen}}$

**Taught in:** M1.5 (`topic:m1-05-conservation-principles`), M4.6 (`topic:m4-06-course-review`)
