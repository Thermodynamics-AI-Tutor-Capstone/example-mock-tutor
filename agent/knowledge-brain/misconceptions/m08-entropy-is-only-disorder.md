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
signatures:
  - "The gas expands, so there's more room and more disorder — entropy goes up."
  - "Compression packs the particles into less space, so entropy increases."
  - "Steam's more disordered than water; that's all I need to rank them."
  - "Gas molecules move fast and chaotically, so any gas expansion raises entropy."
  - "You can't get order from disorder, so freezing water can't lower its entropy."
  - "Stirring doesn't make the tank messier, so its entropy doesn't change."
not_signatures:
  - "The volume grows in the isentropic turbine, but Δs = 0 — reversible and adiabatic."
  - "Disorder is one picture; I checked s₂ − s₁ in the steam tables."
confusable_with:
  - id: misc:m02-entropy-and-the-second-law
    separating_question: "How would you check your answer: with s values from the tables, or by how disordered the molecules are?"
  - id: misc:m10-entropy-of-an-isolated-system
    separating_question: "Why must it increase: because the molecules get more disordered, or because entropy can never go down?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — misconceptions about the definition of
      entropy lead to "the inaccurate connection of entropy with the number of intermolecular
      interactions and collisions ... and, of course, treating entropy as only a measurement
      of disorder in a physical arrangement"
    retrieved: '2026-09-17'
  - url: https://arxiv.org/abs/2408.00944
    title: >-
      Brundage, Meltzer & Singh, "Investigating introductory and advanced students' difficulties
      with entropy and the second law of thermodynamics using a validated instrument", Phys. Rev.
      Phys. Educ. Res. 20, 020110 (2024), arXiv:2408.00944 [read — full text]
    retrieved: '2026-09-22'
  - url: https://www.physicseducation.net/docs/Christensen_AJP_final.pdf
    title: >-
      Christensen, Meltzer & Ogilvie, "Student ideas regarding entropy and the second law of
      thermodynamics in an introductory physics course", Am. J. Phys. 77, 907 (2009), author-hosted
      copy [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Entropy is only a measure of disorder

> **Not instructor-checked.** Statement, tier and origin are from the ASEE 2025 review; the
> signatures, added by an AI research pass on 2026-09-22, paraphrase student responses in Brundage
> et al. (2024) and Christensen et al. (2009) except the stirred-tank one, which is our inference, as
> are the not-signatures, probe and repair move.

## The wrong belief

Entropy measures how messy or random a system is. A related form, also named in the review, is
that entropy counts intermolecular interactions and collisions.

## How it sounds

- The gas expands, so there's more room and more disorder — entropy goes up.
- Compression packs the particles into less space, so entropy increases.
- Steam's more disordered than water; that's all I need to rank them.
- Gas molecules move fast and chaotically, so any gas expansion raises entropy.
- You can't get order from disorder, so freezing water can't lower its entropy.
- Stirring doesn't make the tank messier, so its entropy doesn't change.

The tell is a disorder or crowding story standing in for a calculation; using the picture
alongside table values or an entropy balance is correct.

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
