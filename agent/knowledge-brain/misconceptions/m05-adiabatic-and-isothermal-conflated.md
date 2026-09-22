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
signatures:
  - "It's insulated, so the temperature inside stays the same."
  - "The insulation holds the heat in, so the gas can't warm up."
  - "Isothermal means no heat transfer, since the temperature doesn't change."
  - "Adiabatic expansion: no heat in or out, so the internal energy stays constant."
  - "Adiabatic means no heat, so there's no work either."
  - "The compressor's insulated, so the air leaves at the inlet temperature."
not_signatures:
  - "Adiabatic only sets Q = 0; the compression work still raises T."
  - "Isothermal ideal gas: ΔU = 0, so Q = W and heat does cross."
confusable_with:
  - id: misc:m04-heat-always-raises-temperature
    separating_question: "While water boils at 1 atm with the burner on, is heat going in, and does its temperature rise?"
  - id: misc:m15-adiabatic-implies-isentropic
    separating_question: "For this insulated device, which do you think stays constant: the temperature or the entropy?"
  - id: misc:m07-work-is-not-energy-transfer
    separating_question: "When the piston compresses the insulated gas, does the push itself add energy to the gas?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "Foroushani found that the heat vs.
      temperature misconception led to student misunderstandings between adiabatic and
      isothermal processes"
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

# Adiabatic and isothermal used interchangeably

> **Not instructor-checked.** Statement, tier and origin are from the ASEE 2025 review; the
> signatures, added by an AI research pass on 2026-09-22, paraphrase student responses in Loverude
> et al. (2002), Meltzer (2004) and Brundage et al. (2024), while the not-signatures, probe and
> repair move are this project's (the "nothing happens" line was qualified on the same date for free
> expansion, following Brundage et al. 2024).

## The wrong belief

"Insulated" and "constant temperature" are the same assumption, so an adiabatic process can be
analysed with $T_1 = T_2$, or a constant-temperature process can be assumed to have $Q = 0$.

## How it sounds

- It's insulated, so the temperature inside stays the same.
- The insulation holds the heat in, so the gas can't warm up.
- Isothermal means no heat transfer, since the temperature doesn't change.
- Adiabatic expansion: no heat in or out, so the internal energy stays constant.
- Adiabatic means no heat, so there's no work either.
- The compressor's insulated, so the air leaves at the inlet temperature.

The tell is one word used to delete both the heat term and the temperature change; naming the
single term each assumption removes is correct.

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
adiabatic). For a quasi-static ideal-gas process, being both means nothing happens
($Q = W = 0$). The exception students meet is an unresisted free expansion: adiabatic and no work,
so $T$ is unchanged, yet the volume and the entropy grow.

## Where this shows up in ME 300

Units 2, 3 and 5 — wherever a process assumption is chosen, and especially when the student
must decide whether a device is isentropic (adiabatic **and** reversible).
