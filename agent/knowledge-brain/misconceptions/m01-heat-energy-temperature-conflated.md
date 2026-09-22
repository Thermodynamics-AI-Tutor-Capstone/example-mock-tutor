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
signatures:
  - "Why does the first law have both ΔU and Q? Aren't both just the heat in the gas?"
  - "The steam at 400 °C has a lot more heat in it than the water does."
  - "I'll write Q₂ − Q₁ for the change in the tank's heat."
  - "Heat, thermal energy, internal energy — they're all the same thing, right?"
  - "The hot block has more heat, so it hands some to the cold one."
not_signatures:
  - "Heat crossed the boundary, so the tank's internal energy rose; the tank doesn't contain heat."
  - "Q is energy in transit; u and T are properties of the state."
confusable_with:
  - id: misc:m06-temperature-is-internal-energy
    separating_question: "Which stores more internal energy: a bathtub of water at 40 °C or a cup of coffee at 90 °C?"
  - id: misc:m07-work-is-not-energy-transfer
    separating_question: "When the piston pushes the gas in, is that energy crossing as heat or as work?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., "Systematic literature review on the common misconceptions in
      thermodynamics, fluid mechanics, and heat transfer", ASEE 2025, paper 46085 —
      thermodynamics primary misconception #1
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
  - url: https://peer.asee.org/assessment-of-fundamental-concept-in-thermodynamics.pdf
    title: >-
      Karimi & Manteufel, "Assessment of fundamental concepts in thermodynamics", ASEE 2014, paper
      10626 (first mechanical engineering thermodynamics course, UTSA) [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Heat, energy and temperature treated as the same quantity

> **Not instructor-checked.** Statement, tier and origin are from the ASEE 2025 review; the
> signatures, added by an AI research pass on 2026-09-22, paraphrase student responses reported by
> Loverude et al. (2002) and Meltzer (2004), while the not-signatures, probe (corrected on the same
> date to a constant-pressure piston–cylinder, following Karimi & Manteufel 2014) and repair move
> are this project's.

## The wrong belief

"Heat", "thermal energy", "internal energy" and "temperature" name the same thing, so they can
be substituted for one another in a sentence or an equation.

## How it sounds

- Why does the first law have both ΔU and Q? Aren't both just the heat in the gas?
- The steam at 400 °C has a lot more heat in it than the water does.
- I'll write Q₂ − Q₁ for the change in the tank's heat.
- Heat, thermal energy, internal energy — they're all the same thing, right?
- The hot block has more heat, so it hands some to the cold one.

The tell is heat spoken of as something a body has, or that changes between states; using Q only
for energy crossing a boundary is correct.

## Why students hold it

The review names this the most-cited primary (robust) misconception in thermodynamics, found
across concept-inventory studies over twenty years. It comes from everyday language, where
"heat" is a substance a body contains and temperature is how warm something feels. Self et al.
and Foroushani report students concluding that a system's temperature must always rise when
heat is added; Saricayir et al. found heat and temperature are particularly poorly separated
during a change of state. It is *robust*, meaning ordinary instruction does not remove it — it
needs deliberate conceptual-change work.

## Diagnostic probe

> Water sits in a piston–cylinder under a freely moving weighted piston, so its pressure stays
> fixed, and is heated until half of it has boiled. Has the temperature risen? Has the internal
> energy risen? Has "the heat in the cylinder" risen?

A student holding this misconception answers yes/yes/yes. The intended answer is: temperature
is unchanged during the phase change at fixed pressure (in a sealed rigid tank it would not be —
pressure and temperature would climb together along the saturation line), internal energy has
risen, and the third question is malformed — there is no heat *in* the cylinder.

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
