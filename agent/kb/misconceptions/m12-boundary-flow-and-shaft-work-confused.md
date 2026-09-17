---
id: misc:m12-boundary-flow-and-shaft-work-confused
kind: misconception
title: Boundary work, flow work and shaft work merged into one W
description: >-
  One W used for boundary, flow and shaft work, so flow work is double-counted alongside h or
  boundary work is applied to a control volume.
tier: secondary
secondary_to: misc:m03-steady-state-vs-equilibrium
parent: course:me300
unit: unit:u3-mass-and-first-law-closed-systems
status: draft
audience: both
priority: 0.85
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [W, W_b, W_flow, W_shaft, h, u]
misconceptions: []
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "knowing the differences between boundary
      work, flow work, and shaft work when finding entropy", reported as secondary to
      primary #3 (Foroushani)
    retrieved: '2026-09-17'
generated: null
---

# Boundary work, flow work and shaft work merged into one W

> **Not instructor-checked.** Statement, tier and origin transcribed from the ASEE 2025
> systematic review; probe and repair move authored by this project.

## The wrong belief

Work is work. One symbol $W$ covers a piston moving, a fluid being pushed across an inlet, and
a turbine shaft turning, and the same expression can be used for all three.

## Why students hold it

The review reports this among the secondary misconceptions traced to confusion over which
process assumption applies. The three are introduced across different lectures and different
system types, and the course's own notation uses the same letter for all of them. The most
damaging consequence is silent: flow work has already been absorbed into enthalpy, so writing it
again as a $W$ term double-counts it and the error never announces itself.

## Diagnostic probe

> Steam flows steadily through an insulated turbine and drives a generator. Name every work
> interaction. Which of them appears explicitly in the steady-flow energy equation, and where
> did the others go?

The misconception produces one undifferentiated $W$, or adds a $P\,dV$ term. The intended
answer: shaft work is the explicit $\dot{W}$; flow work at the inlet and exit is already inside
$h = u + Pv$; there is no moving-boundary work because the control volume does not change
shape.

## Repair move

Tie each kind of work to the system type that admits it:

- **Boundary work** $W_b = \int P\,dV$ — a **closed** system whose volume changes, and only for
  a quasi-equilibrium process.
- **Flow work** $Pv$ per unit mass — the work to push mass across a **control surface**. Never
  written separately; it is why $h$ rather than $u$ appears in flowing-stream balances.
- **Shaft work** $\dot{W}_{shaft}$ — a rotating shaft crossing the boundary. The one that is
  usually the answer.

Then make the check routine: if the balance uses $h$, flow work is already counted. If a
control volume is rigid, there is no $W_b$. Say both in the ASSUMPTIONS line.

## Where this shows up in ME 300

Unit 3 lectures 19–24 and the whole of Unit 4, where the same reduction is done eight times for
eight devices.
