---
id: misc:m01-heat-energy-temperature-conflated
kind: misconception
title: Heat, energy and temperature treated as the same quantity
description: >-
  Heat, energy and temperature used as one quantity. Heat is a transfer, internal energy is
  stored, temperature is a state property. Primary (robust) misconception.
tier: primary
secondary_to: null
parent: course:me300
unit: null
status: draft
audience: both
priority: 0.95
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [T, u, U, Q, q]
misconceptions:
  - misc:m04-heat-always-raises-temperature
  - misc:m05-adiabatic-and-isothermal-conflated
  - misc:m06-temperature-is-internal-energy
  - misc:m07-work-is-not-energy-transfer
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., "Systematic literature review on the common misconceptions in
      thermodynamics, fluid mechanics, and heat transfer", ASEE 2025, paper 46085 —
      thermodynamics primary misconception #1
    retrieved: '2026-09-17'
generated: null
---

# Heat, energy and temperature treated as the same quantity

> **Not instructor-checked.** The statement, the primary/secondary tier and "why students hold
> it" are transcribed from the ASEE 2025 systematic review cited above. The **probe** and the
> **repair move** were authored by this project and no ME 300 instructor has seen them.

## The wrong belief

"Heat", "thermal energy", "internal energy" and "temperature" name the same thing, so they can
be substituted for one another in a sentence or an equation.

## Why students hold it

The review names this the most-cited primary (robust) misconception in thermodynamics, found
across concept-inventory studies over twenty years. It comes from everyday language, where
"heat" is a substance a body contains and temperature is how warm something feels. Self et al.
and Foroushani report students concluding that a system's temperature must always rise when
heat is added; Saricayir et al. found heat and temperature are particularly poorly separated
during a change of state. It is *robust*, meaning ordinary instruction does not remove it — it
needs deliberate conceptual-change work.

## Diagnostic probe

> A sealed rigid tank of water is heated until half of it has boiled. Has the temperature
> risen? Has the internal energy risen? Has "the heat in the tank" risen?

A student holding this misconception answers yes/yes/yes. The intended answer is: temperature
is unchanged during the phase change at fixed pressure, internal energy has risen, and the
third question is malformed — there is no heat *in* the tank.

## Repair move

Force the three words apart by where they live:

- **Temperature** is a property **of a state**. It has a value right now.
- **Internal energy** is also a property of the state, and it is what is **stored**.
- **Heat** is a **transfer across a boundary** during a process. A system never contains heat,
  so $Q_2 - Q_1$ is meaningless while $u_2 - u_1$ is fine.

Then make the student label a specific boundary and say which of the three could be written on
each side of it. The review reports that Prince et al. got measurable improvement on exactly
this misconception using inquiry-based activities rather than re-explanation, so ask before
telling.

## Where this shows up in ME 300

Everywhere from Unit 1 onward; it does its worst damage in Unit 2 (phase change) and Unit 3
(writing the first law).
