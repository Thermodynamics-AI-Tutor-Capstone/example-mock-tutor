---
id: misc:m07-work-is-not-energy-transfer
kind: misconception
title: Work not recognised as a form of energy transfer
description: >-
  Work not recognised as energy transfer, so the first law is applied to heat alone or work is
  given an arbitrary sign.
tier: secondary
secondary_to: misc:m01-heat-energy-temperature-conflated
parent: course:me300
unit: unit:u3-mass-and-first-law-closed-systems
status: draft
audience: both
priority: 0.85
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [W, Q, U, W_b]
misconceptions: []
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "Student misinterpretations about work as a
      form of energy resulted in confusion when applying the first law of thermodynamics"
    retrieved: '2026-09-17'
generated: null
---

# Work not recognised as a form of energy transfer

> **Not instructor-checked.** Statement, tier and origin transcribed from the ASEE 2025
> systematic review; probe and repair move authored by this project.

## The wrong belief

Energy enters and leaves a system as heat. Work is something mechanical that happens alongside,
and it does not belong in the energy balance — or it belongs there with an arbitrary sign.

## Why students hold it

The review reports that misinterpreting work as a form of energy produced confusion in applying
the first law. Students arrive having seen $W = Fd$ in mechanics as a quantity about forces, not
about energy crossing a boundary, and having seen energy conservation stated without any
boundary at all.

## Diagnostic probe

> A rigid insulated tank of air contains a paddle wheel driven by a falling weight. No heat can
> enter or leave. After the weight has fallen, is the air's temperature higher, lower, or the
> same? What is $Q$? What is $W$?

The misconception gives "same, because $Q = 0$ and nothing was heated". The intended answer:
temperature is higher, $Q = 0$, and $W$ is negative under the convention that work out is
positive — work went **in**, so $\Delta U = -W > 0$.

## Repair move

Rebuild the first law as a boundary accounting statement: **exactly two things can cross the
boundary of a closed system, heat and work, and both are energy.** Have the student draw the
boundary, list every arrow crossing it, and label each one $Q$ or $W$ before writing any
equation. Lecture 21 of ME 300 is devoted to this identification step.

Then nail the sign convention down in writing — heat in positive, work out positive,
$\Delta E = Q - W$ — and require it to be stated in the ASSUMPTIONS line, because half of the
errors here are sign errors rather than conceptual ones.

## Where this shows up in ME 300

Unit 3, lectures 19–25, and every closed-system first-law problem thereafter.
