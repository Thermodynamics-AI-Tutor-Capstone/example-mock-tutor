---
id: misc:m03-steady-state-vs-equilibrium
kind: misconception
title: Steady state confused with equilibrium
description: >-
  Steady flow assumed to be equilibrium. Steady zeroes the time derivative; equilibrium zeroes
  the gradients that drive the flow. Primary misconception.
tier: primary
secondary_to: null
parent: course:me300
unit: unit:u4-control-volumes-and-second-law
status: draft
audience: both
priority: 0.9
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: []
misconceptions:
  - misc:m11-state-function-vs-path-function
  - misc:m12-boundary-flow-and-shaft-work-confused
  - misc:m14-cp-and-cv-chosen-by-process-name
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — thermodynamics primary misconception #3
      ("confusion between steady-state and equilibrium processes")
    retrieved: '2026-09-17'
generated: null
---

# Steady state confused with equilibrium

> **Not instructor-checked.** Statement and tier transcribed from the ASEE 2025 systematic
> review; probe and repair move authored by this project.

## The wrong belief

"Steady" and "in equilibrium" mean the same thing, so a steadily operating device can be
analysed as an equilibrium system — and, going the other way, anything not changing in time
must have no gradients in it.

## Why students hold it

The review names this primary misconception #3 and traces its origin to *equilibrium* as taught
in chemistry, where the word is attached to reaction equilibrium. Vigeant et al. report students
confusing reaction rate with reaction equilibrium and not understanding the descriptions
underlying either. The word arrives in thermodynamics already loaded with the wrong meaning.

## Diagnostic probe

> Water flows steadily through a pipe and comes out 20 °C hotter than it went in. Nothing about
> the flow is changing with time. Is the water in the pipe in thermal equilibrium? Explain.

A student holding the misconception says yes, because nothing is changing. The intended answer:
no — there is a temperature gradient along the pipe, which is precisely why heat is flowing.
Steady means $\partial/\partial t = 0$, not $\nabla = 0$.

## Repair move

Separate the two words by what each one zeroes:

- **Steady state** zeroes the *time* derivative. Properties at a given point do not change.
  Nothing is said about two different points.
- **Equilibrium** zeroes the *gradients*. No unbalanced driving potential anywhere, so nothing
  happens at all.

Then make the consequence explicit: a device in true equilibrium produces no power and transfers
no heat. Every useful device in Unit 4 is steady and **not** in equilibrium. Quasi-equilibrium is
a third, separate idea — a process slow enough that each intermediate state is *near* equilibrium
— and it is the assumption that makes $W_b = \int P\,dV$ legal.

## Where this shows up in ME 300

Unit 4, every steady-flow device (lectures 27–33), and in the ASSUMPTIONS line of nearly every
control-volume problem.
