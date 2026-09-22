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
signatures:
  - "All the heat goes into raising the temperature; expanding doesn't take any energy."
  - "The gas expanded, so the surroundings must have done work on it."
  - "No heat got into the insulated tank, so the paddle wheel can't warm the air."
  - "Pushing the piston in heats the gas — that's heat going in."
  - "The sign of W is just a convention; I pick whichever."
  - "The piston rose, but all 50 kJ of heat still went into the gas's internal energy."
not_signatures:
  - "Q = 0, but the paddle wheel's work goes in, so ΔU = −W > 0."
  - "With work out positive, compression gives W < 0 — energy enters the gas."
confusable_with:
  - id: misc:m05-adiabatic-and-isothermal-conflated
    separating_question: "When the piston compresses the insulated gas, does the push itself add energy to the gas?"
  - id: misc:m01-heat-energy-temperature-conflated
    separating_question: "When the piston pushes the gas in, is that energy crossing as heat or as work?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "Student misinterpretations about work as a
      form of energy resulted in confusion when applying the first law of thermodynamics"
    retrieved: '2026-09-17'
  - url: https://www.if.ufrj.br/~carlos/fisterm/leituras/Loverude_AJP2002.pdf
    title: >-
      Loverude, Kautz & Heron, "Student understanding of the first law of thermodynamics: Relating
      work to the adiabatic compression of an ideal gas", Am. J. Phys. 70, 137 (2002) [read — full
      text]
    retrieved: '2026-09-22'
  - url: https://www.if.ufrj.br/~carlos/fisterm/leituras/Meltzer_AJP2004.pdf
    title: >-
      Meltzer, "Investigation of students' reasoning regarding heat, work, and the first law of
      thermodynamics in an introductory calculus-based general physics course", Am. J. Phys. 72,
      1432 (2004) [read — full text]
    retrieved: '2026-09-22'
  - url: https://arxiv.org/abs/2403.03795
    title: >-
      Brundage, Meltzer & Singh, "Investigating introductory and advanced students' difficulties
      with change in internal energy, work and heat transfer using a validated instrument",
      arXiv:2403.03795 (2024) [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Work not recognised as a form of energy transfer

> **Not instructor-checked.** Statement, tier and origin are from the ASEE 2025 review; the
> signatures, added by an AI research pass on 2026-09-22, paraphrase student responses in Loverude
> et al. (2002), Meltzer (2004) and Brundage et al. (2024), while the not-signatures, probe and
> repair move are this project's.

## The wrong belief

Energy enters and leaves a system as heat. Work is something mechanical that happens alongside,
and it does not belong in the energy balance — or it belongs there with an arbitrary sign.

## How it sounds

- All the heat goes into raising the temperature; expanding doesn't take any energy.
- The gas expanded, so the surroundings must have done work on it.
- No heat got into the insulated tank, so the paddle wheel can't warm the air.
- Pushing the piston in heats the gas — that's heat going in.
- The sign of W is just a convention; I pick whichever.
- The piston rose, but all 50 kJ of heat still went into the gas's internal energy.

The tell is an energy balance that counts only heat, or a sign on W picked without asking which
way energy crossed; stating a convention and applying it consistently is correct.

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
