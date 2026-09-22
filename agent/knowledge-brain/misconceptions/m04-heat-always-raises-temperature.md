---
id: misc:m04-heat-always-raises-temperature
kind: misconception
title: Adding heat must raise the temperature
description: >-
  Heat into a system assumed to always raise its temperature, so a constant-temperature phase
  change looks like no heat transfer at all.
tier: secondary
secondary_to: misc:m01-heat-energy-temperature-conflated
parent: course:me300
unit: unit:u2-nonideal-gases-and-phase-data
status: draft
audience: both
priority: 0.85
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [T, Q, h, x]
misconceptions: []
examples: []
items: []
signatures:
  - "It's boiling at constant pressure, so the temperature must go up as I add heat."
  - "The temperature didn't change, so Q = mcΔT = 0."
  - "If heat went into the water bath, its temperature would have gone up."
  - "The mixture stayed at 100 °C the whole time, so no heat went in."
  - "Condensate leaves at the same temperature it entered, so the condenser removed no heat."
  - "Temperature tells you how much heat it has, so more heat means hotter."
not_signatures:
  - "T holds at 100 °C while it boils, but q = h_fg still goes in."
  - "In the single-phase heating part, the added heat does raise T."
confusable_with:
  - id: misc:m05-adiabatic-and-isothermal-conflated
    separating_question: "While water boils at 1 atm with the burner on, is heat going in, and does its temperature rise?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — secondary to thermodynamics primary #1;
      "students often think that heat and temperature are equivalent, concluding that the
      temperature of a system must always rise due to input heat transfer" (Self et al.;
      Foroushani)
    retrieved: '2026-09-17'
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
  - url: https://peer.asee.org/assessment-of-fundamental-concept-in-thermodynamics.pdf
    title: >-
      Karimi & Manteufel, "Assessment of fundamental concepts in thermodynamics", ASEE 2014, paper
      10626 (first mechanical engineering thermodynamics course, UTSA) [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Adding heat must raise the temperature

> **Not instructor-checked.** Statement, tier and origin are from the ASEE 2025 review; the
> signatures, added by an AI research pass on 2026-09-22, paraphrase student responses in Meltzer
> (2004) and Brundage et al. (2024) and an instructor report from an ME course (Karimi & Manteufel
> 2014), while the not-signatures, probe (clarified on the same date to start from saturated liquid
> at constant pressure) and repair move are this project's.

## The wrong belief

If $Q > 0$ then $T$ must increase. Equivalently: if the temperature did not change, no heat was
transferred.

## How it sounds

- It's boiling at constant pressure, so the temperature must go up as I add heat.
- The temperature didn't change, so Q = mcΔT = 0.
- If heat went into the water bath, its temperature would have gone up.
- The mixture stayed at 100 °C the whole time, so no heat went in.
- Condensate leaves at the same temperature it entered, so the condenser removed no heat.
- Temperature tells you how much heat it has, so more heat means hotter.

The tell is Q and ΔT treated as locked together — no ΔT, no heat; holding T constant through a
phase change while heat still flows is correct.

## Why students hold it

Direct consequence of treating heat and temperature as the same quantity (see
[`misc:m01`](m01-heat-energy-temperature-conflated.md)). The review reports that Foroushani
traced phase-change confusion and adiabatic/isothermal confusion back to this belief, and
Saricayir et al. found heat and temperature are least well separated exactly during a change of
state. Everyday experience supports it: heating a pan does raise its temperature.

## Diagnostic probe

> Saturated liquid water at 100 °C is heated at a constant 1 atm until it is saturated
> vapour. What is the temperature change? What is the enthalpy change? How much heat
> was transferred?

The misconception predicts a temperature rise or no heat transfer. The intended answer:
$\Delta T = 0$, $\Delta h = h_{fg}$, and the heat transferred per unit mass is $h_{fg}$ — a
large number at zero temperature change.

## Repair move

Put the latent heat in front of them numerically. For water at 1 atm, $h_{fg} \approx 2257$
kJ/kg while $c_p \approx 4.18$ kJ/(kg·K): boiling a kilogram of water costs as much energy as
heating it through about 540 °C would, and the thermometer does not move at all. Once the
number is on the page, the belief is difficult to hold.

Then generalise: heat transfer changes the **energy** of the system. Whether that shows up as a
temperature change depends on whether the substance is changing phase, doing boundary work, or
neither.

## Where this shows up in ME 300

Unit 2, the saturation-dome lectures (13, 15) and quality calculations.
