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
signatures:
  - "Both liquids rose by the same ΔT, so they took in the same energy."
  - "They ended at the same temperature, so they absorbed the same amount of energy."
  - "The 90 °C coffee has more internal energy than the 40 °C bathtub."
  - "Saturated liquid and vapour at 100 °C have the same u — same temperature."
  - "Internal energy is intensive like temperature, so U isn't U_A + U_B."
  - "Temperature is basically the energy content, so hotter means more energy."
not_signatures:
  - "Same substance, same mass, single phase: higher T does mean higher u."
  - "For an ideal gas Δu = c_v ΔT, so here T tracks u."
confusable_with:
  - id: misc:m01-heat-energy-temperature-conflated
    separating_question: "Which stores more internal energy: a bathtub of water at 40 °C or a cup of coffee at 90 °C?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "students don't always understand the
      differences between temperature and energy, such as internal energy, and often think of
      them as being equivalent"
    retrieved: '2026-09-17'
  - url: https://peer.asee.org/concept-inventories-meet-cognitive-psychology-using-beta-testing-as-a-mechanism-for-identifying-engineering-student-misconceptions.pdf
    title: >-
      Miller, Streveler, Nelson, Geist & Olds, "Concept inventories meet cognitive psychology: Using
      beta testing as a mechanism for identifying engineering student misconceptions" (Thermal and
      Transport Concept Inventory, junior and senior engineering students), ASEE 2005 [read — full
      text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/misconceptions-about-rate-processes-preliminary-evidence-for-the-importance-of-emergent-conceptual-schemas-in-thermal-and-transport-sciences.pdf
    title: >-
      Miller, Streveler, Olds, Chi, Nelson & Geist, "Misconceptions about rate processes:
      Preliminary evidence for the importance of emergent conceptual schemas in thermal and
      transport sciences", ASEE 2006 [full text available; only the passages quoting student
      explanations were read]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/assessment-and-repair-of-critical-misconceptions-in-engineering-heat-transfer-and-thermodynamics.pdf
    title: >-
      Prince, Vigeant & Nottis, "Assessment and repair of critical misconceptions in engineering
      heat transfer and thermodynamics", ASEE 2013, paper 6584 (HECI and CIET concept-inventory
      results) [read — full text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/assessment-of-fundamental-concept-in-thermodynamics.pdf
    title: >-
      Karimi & Manteufel, "Assessment of fundamental concepts in thermodynamics", ASEE 2014, paper
      10626 (first mechanical engineering thermodynamics course, UTSA) [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Temperature and internal energy treated as the same thing

> **Not instructor-checked.** Statement, tier and origin are from the ASEE 2025 review; the
> signatures, added by an AI research pass on 2026-09-22, paraphrase engineering students' interview
> comments from concept-inventory testing (Miller et al. 2005, 2006) and an ME exam item (Karimi &
> Manteufel 2014), with prevalence from the HECI (Prince et al. 2013), while the not-signatures,
> probe and repair move are this project's.

## The wrong belief

Higher temperature means more energy, full stop — so the hotter of two objects must contain
more energy, and comparing temperatures is the same as comparing energies.

## How it sounds

- Both liquids rose by the same ΔT, so they took in the same energy.
- They ended at the same temperature, so they absorbed the same amount of energy.
- The 90 °C coffee has more internal energy than the 40 °C bathtub.
- Saturated liquid and vapour at 100 °C have the same u — same temperature.
- Internal energy is intensive like temperature, so U isn't U_A + U_B.
- Temperature is basically the energy content, so hotter means more energy.

The tell is temperature standing in for total energy across different masses, substances or
phases; relating T to u within one phase of one substance is correct.

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
