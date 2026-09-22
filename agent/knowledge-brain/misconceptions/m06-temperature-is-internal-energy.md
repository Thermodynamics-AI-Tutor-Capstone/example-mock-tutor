---
id: misc:m06-temperature-is-internal-energy
kind: misconception
title: Temperature and internal energy treated as the same thing
description: >-
  Higher temperature assumed to mean more energy, ignoring mass, phase and every other form
  energy takes.
tier: secondary
secondary_to: misc:m01-heat-energy-temperature-conflated
parent: course:me300
unit: unit:u1-concepts-and-ideal-gas-properties
status: draft
audience: both
priority: 0.8
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [T, u, U, m, c_v]
misconceptions: []
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "students don't always understand the
      differences between temperature and energy, such as internal energy, and often think of
      them as being equivalent"
    retrieved: '2026-09-17'
generated: null
---

# Temperature and internal energy treated as the same thing

> **Not instructor-checked.** Statement, tier and origin transcribed from the ASEE 2025
> systematic review; probe and repair move authored by this project.

## The wrong belief

Higher temperature means more energy, full stop — so the hotter of two objects must contain
more energy, and comparing temperatures is the same as comparing energies.

## Why students hold it

The review records this as a secondary misconception of primary #1, reported across several
concept-inventory studies. Temperature is the property students can measure and feel; internal
energy is one they can only compute. The review also notes the related failure to see that
energy is a broader concept with several forms, while temperature is one intensive property.

## Diagnostic probe

> A cup of coffee at 90 °C and a bathtub of water at 40 °C. Which has more internal energy?
> Which would cause more damage if it were poured on you, and is that the same question?

The misconception answers "the coffee" to the first. The intended answer: the bathtub, by a
very large margin, because $U = mu$ and mass dominates. The second question is about heat
transfer rate and temperature difference, which is a different question — the point is that
they come apart.

## Repair move

Insist on the intensive/extensive distinction. $T$ is intensive: it does not scale with how
much stuff there is. $U$ is extensive: $U = mu$. Then run the comparison numerically once,
with real masses, so the answer is a number rather than an intuition.

Follow with the phase case: saturated vapour and saturated liquid at the same temperature have
the same $T$ and very different $u$. That kills the belief in a way a mass argument alone does
not, because it removes mass from the comparison.

## Where this shows up in ME 300

Unit 1 (what a property is, intensive vs. extensive) and Unit 3 (writing $\Delta U$ rather than
$\Delta T$ in the first law).
