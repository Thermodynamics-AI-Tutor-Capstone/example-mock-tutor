---
id: misc:m11-state-function-vs-path-function
kind: misconception
title: State functions and path functions not distinguished
description: >-
  Heat and work written as if a system possessed them at a state, and work assumed to depend
  only on the endpoints rather than the path.
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
symbols: [Q, W, u, h, s, Delta]
misconceptions:
  - misc:m13-work-read-off-a-pv-diagram
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — confusion over constant-pressure and
      constant-volume assumptions "led to misunderstandings about function of state and
      function of path" (Foroushani), reported as secondary to primary #3
    retrieved: '2026-09-17'
generated: null
---

# State functions and path functions not distinguished

> **Not instructor-checked.** Statement, tier and origin transcribed from the ASEE 2025
> systematic review; probe and repair move authored by this project.

## The wrong belief

Every quantity in thermodynamics belongs to a state, so all of them can be subtracted between
states. A student writes $Q_2 - Q_1$, or asks how much work a system "has".

## Why students hold it

The review places this as a secondary misconception under primary #3, arising via confusion
over which process assumption is in force. Properties are introduced first and in bulk, and the
notational habit of subscripting everything by state number is established before heat and work
arrive. Nothing in the notation warns the student that two of the symbols do not take state
subscripts.

## Diagnostic probe

> A gas goes from state 1 to state 2 by two different processes: first constant pressure then
> constant volume, or first constant volume then constant pressure. For each of $\Delta u$,
> $Q$ and $W$, say whether the two routes give the same answer.

The misconception gives "same" for all three. The intended answer: $\Delta u$ is the same
because $u$ is a property; $W$ differs — it is the area under the path on a P-v diagram, and the
two paths enclose different areas; $Q$ therefore differs too, since $Q = \Delta u + W$.

## Repair move

Make the notation carry the distinction and then enforce it:

- Properties take state subscripts and $\Delta$: $u_1$, $u_2$, $\Delta u$.
- Heat and work take **no** state subscript and no $\Delta$. They are labelled by the process:
  $Q_{12}$, $W_{12}$, and in differential form $\delta Q$, $\delta W$ — inexact differentials,
  written with $\delta$ rather than $d$ precisely because they are not differences of anything.

Then run the two-path probe above with real numbers once. The area argument on the P-v diagram
is the fastest demonstration, which is why this misconception pairs with
[`misc:m13`](m13-work-read-off-a-pv-diagram.md).

## Where this shows up in ME 300

Unit 1 (what a property is), Unit 3 (every first-law problem), and the SKETCH step of the
mandated solution format.
