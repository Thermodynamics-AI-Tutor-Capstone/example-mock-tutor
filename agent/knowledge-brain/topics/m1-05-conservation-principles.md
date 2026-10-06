---
id: topic:m1-05-conservation-principles
kind: topic
title: M1.5 — Conservation Principles
description: Introduces generic finite-time and instantaneous rate-form conservation balances for mass
  and energy, then applies the mass-rate balance to a leaky-pipe control volume.
parent: unit:m1-introduction-and-conservation
unit: unit:m1-introduction-and-conservation
lecture: M1.5
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can write the finite-time and instantaneous conservation balance for a system and identify
    the meaning of each term.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can apply the mass-rate balance to a control volume with multiple outflow paths, such
    as a leaky pipe.
  kc_type: skill
  bloom: apply
equations:
- eq:finite-time-conservation-balance
- eq:instantaneous-conservation-balance
- eq:leaky-pipe-mass-balance
misconceptions: []
examples: []
items:
- item:hw01-3a
- item:hw01-3b
- item:hw01-3c
- item:hw01-3d
- item:hw01-3e
sources:
- path: lectures/Module1_5_ConservationPrinciples_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M1.5 — Conservation Principles

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture introduces conservation principles as generic accounting balances. It shows the finite-time form, the instantaneous rate form, and a leaky-pipe control-volume mass balance.

## Key ideas
- Conservation principles are introduced for energy and mass, with both finite-time and instantaneous views (p. 2).
- In finite-time form, the system change of a conserved quantity is written as $\Delta X_{sys} = X(t_2)-X(t_1) = X_{in}-X_{out}+X_{gen}$; the slide labels the terms change, in, out, and generated inside system (p. 3).
- The energy version is $\Delta E_{sys}=E_{in}-E_{out}+E_{gen}$, but the $E_{gen}$ term is crossed out, so energy generation is zero in this balance (p. 3).
- The instantaneous or rate form is $\frac{dX_{sys}}{dt}=\dot{X}_{in}-\dot{X}_{out}+\dot{X}_{gen}$, with units per second; the slide notes rates are useful for flow, leakage, and transfer (p. 4).
- A leaky-pipe control volume gives $\frac{dm_{cv}}{dt}=\dot{m}_{in}-\dot{m}_{out}-\dot{m}_{leak}$, showing rate added minus rate subtracted with two outflow terms (p. 5).

## Notation used
- $X$: a conserved quantity; $E$: energy; $m$: mass.
- Subscripts $sys$, $in$, $out$, and $gen$: system, entering, leaving, and generated inside the system.
- Dots, e.g. $\dot{X}$ or $\dot{m}$: rates, with units per second.
- $t_1$, $t_2$, and $\Delta t$: initial time, final time, and finite time interval.
- $m_{cv}$: mass inside the control volume; C.V. denotes control volume.

## Examples in this lecture
- Leaky pipe: a horizontal pipe drawn as a C.V. with $\dot{m}_{in}$ entering and $\dot{m}_{out}$ plus $\dot{m}_{leak}$ leaving; writing this mass-rate balance demonstrates how multiple outflow rates appear as subtracted terms (p. 5).
