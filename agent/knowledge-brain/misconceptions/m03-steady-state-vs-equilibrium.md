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
signatures:
  - "The turbine's running steady, so it's in equilibrium — nothing's changing."
  - "Steady state and equilibrium are the same thing: nothing is happening."
  - "You can't have steady state without equilibrium; it's both or neither."
  - "Heat is still flowing through the wall, so it can't be at steady state."
  - "Leave it on long enough and the pot handle reaches the stove's temperature."
  - "It's steady flow, so the exit state is the same as the inlet state."
  - "The heat exchanger is at steady state, so both streams leave at the same temperature."
not_signatures:
  - "Steady means nothing changes in time at a point; T can still differ from inlet to exit."
  - "The water leaves 20 °C hotter, yet the flow is steady — steady isn't equilibrium."
confusable_with: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — thermodynamics primary misconception #3
      ("confusion between steady-state and equilibrium processes")
    retrieved: '2026-09-17'
  - url: https://peer.asee.org/concept-inventories-meet-cognitive-psychology-using-beta-testing-as-a-mechanism-for-identifying-engineering-student-misconceptions.pdf
    title: >-
      Miller, Streveler, Nelson, Geist & Olds, "Concept inventories meet cognitive psychology: Using
      beta testing as a mechanism for identifying engineering student misconceptions" (Thermal and
      Transport Concept Inventory, junior and senior engineering students), ASEE 2005 [read — full
      text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/inquiry-based-activities-to-repair-misconceptions-in-thermodynamics-and-heat-transfer.pdf
    title: >-
      Vigeant, Prince & Nottis, "Inquiry-based activities to repair misconceptions in thermodynamics
      and heat transfer", ASEE 2009, AC 2009-2039 [read — full text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/assessment-and-repair-of-critical-misconceptions-in-engineering-heat-transfer-and-thermodynamics.pdf
    title: >-
      Prince, Vigeant & Nottis, "Assessment and repair of critical misconceptions in engineering
      heat transfer and thermodynamics", ASEE 2013, paper 6584 (HECI and CIET concept-inventory
      results) [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Steady state confused with equilibrium

> **Not instructor-checked.** Statement and tier are from the ASEE 2025 review; the signatures,
> added by an AI research pass on 2026-09-22, paraphrase engineering students' interview comments
> from concept-inventory testing (Miller et al. 2005) and an activity report (Vigeant et al. 2009),
> while the two steady-flow-device signatures, the not-signatures, probe and repair move are this
> project's inference.

## The wrong belief

"Steady" and "in equilibrium" mean the same thing, so a steadily operating device can be
analysed as an equilibrium system — and, going the other way, anything not changing in time
must have no gradients in it.

## How it sounds

- The turbine's running steady, so it's in equilibrium — nothing's changing.
- Steady state and equilibrium are the same thing: nothing is happening.
- You can't have steady state without equilibrium; it's both or neither.
- Heat is still flowing through the wall, so it can't be at steady state.
- Leave it on long enough and the pot handle reaches the stove's temperature.
- It's steady flow, so the exit state is the same as the inlet state.
- The heat exchanger is at steady state, so both streams leave at the same temperature.

The tell is "nothing changes in time" stretched into "nothing differs from place to place";
saying properties are fixed in time at each point while gradients remain is correct.

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
