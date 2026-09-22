---
id: misc:m08-entropy-is-only-disorder
kind: misconception
title: Entropy is only a measure of disorder
description: >-
  Entropy remembered as disorder or as counting molecular collisions, which gives no way to
  compute it and blocks the entropy balance.
tier: secondary
secondary_to: misc:m02-entropy-and-the-second-law
parent: course:me300
unit: unit:u5-entropy-and-isentropic-processes
status: draft
audience: both
priority: 0.9
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [s, S, S_gen]
misconceptions: []
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — misconceptions about the definition of
      entropy lead to "the inaccurate connection of entropy with the number of intermolecular
      interactions and collisions ... and, of course, treating entropy as only a measurement
      of disorder in a physical arrangement"
    retrieved: '2026-09-17'
generated: null
---

# Entropy is only a measure of disorder

> **Not instructor-checked.** Statement, tier and origin transcribed from the ASEE 2025
> systematic review; probe and repair move authored by this project.

## The wrong belief

Entropy measures how messy or random a system is. A related form, also named in the review, is
that entropy counts intermolecular interactions and collisions.

## Why students hold it

It is what almost everyone is taught first, in chemistry or in popular science, and it is not
exactly wrong — it is a statistical-mechanics interpretation carried into a course that needs an
engineering property. The review lists it as a direct consequence of never having a working
definition of entropy. The metaphor is memorable, which is the problem: it displaces the
definition rather than supplementing it.

## Diagnostic probe

> Rank these by entropy change of the water, from most negative to most positive, and say how
> you would check: (a) water freezing in a freezer, (b) water being stirred by a paddle wheel
> in an insulated tank, (c) steam expanding reversibly and adiabatically through a turbine.

The misconception produces hand-waving about order and no check. The intended answers: (a)
negative — the water's entropy falls, because heat left it; (b) positive — $S_{gen} > 0$ from
the stirring; (c) zero — reversible and adiabatic means isentropic. All three are checkable
against a table or a balance.

## Repair move

Do not argue with the metaphor. Replace it with three concrete handles:

1. **$s$ is a tabulated property.** You look it up, like $h$. It has units of kJ/(kg·K).
2. **Entropy transfer accompanies heat transfer**, and equals $\int \delta Q / T$ across the
   boundary — so entropy can leave a system, and the system's entropy can fall.
3. **$S_{gen}$ is where the physics is.** It is produced by irreversibility — friction, mixing,
   unrestrained expansion, heat transfer across a finite temperature difference — it is never
   destroyed, and $S_{gen} \ge 0$ *is* the second law.

The interpretation can come back afterwards, attached to $S_{gen}$, where it does no harm.

## Where this shows up in ME 300

Unit 5, lectures 36–42. It is the reason a student can compute $\Delta s$ correctly and still
not know what the answer means, or state the second law fluently and not be able to use it.
