---
id: misc:m05-adiabatic-and-isothermal-conflated
kind: misconception
title: Adiabatic and isothermal used interchangeably
description: >-
  Adiabatic (no heat crosses the boundary) used interchangeably with isothermal (temperature
  unchanged). Different assumptions, rarely both at once.
tier: secondary
secondary_to: misc:m01-heat-energy-temperature-conflated
parent: course:me300
unit: null
status: draft
audience: both
priority: 0.85
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [T, Q]
misconceptions: []
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "Foroushani found that the heat vs.
      temperature misconception led to student misunderstandings between adiabatic and
      isothermal processes"
    retrieved: '2026-09-17'
generated: null
---

# Adiabatic and isothermal used interchangeably

> **Not instructor-checked.** Statement, tier and origin transcribed from the ASEE 2025
> systematic review; probe and repair move authored by this project.

## The wrong belief

"Insulated" and "constant temperature" are the same assumption, so an adiabatic process can be
analysed with $T_1 = T_2$, or a constant-temperature process can be assumed to have $Q = 0$.

## Why students hold it

The review names this as a secondary misconception arising directly from conflating heat and
temperature (Foroushani). If heat *is* temperature, then "no heat crossed the boundary" and
"the temperature did not change" say the same thing, and the two words become synonyms.

## Diagnostic probe

> Air is compressed rapidly in a well-insulated cylinder. Is the process adiabatic? Is it
> isothermal? What happens to the temperature?

The misconception produces "adiabatic, so isothermal, so nothing happens to $T$". The intended
answer: adiabatic yes, isothermal no — the temperature rises sharply, because work went in and
no energy left.

## Repair move

Attach each word to the term of the first law it kills:

- **Adiabatic** ⇒ $Q = 0$. It removes a *transfer* term.
- **Isothermal** ⇒ $\Delta T = 0$, so for an ideal gas $\Delta u = 0$. It removes a *storage*
  term.

Then show the counterexamples in both directions: the insulated compression above (adiabatic,
not isothermal) and an isothermal ideal-gas expansion where $Q = W \ne 0$ (isothermal, not
adiabatic). A process that is both is a process in which nothing happens.

## Where this shows up in ME 300

Units 2, 3 and 5 — wherever a process assumption is chosen, and especially when the student
must decide whether a device is isentropic (adiabatic **and** reversible).
