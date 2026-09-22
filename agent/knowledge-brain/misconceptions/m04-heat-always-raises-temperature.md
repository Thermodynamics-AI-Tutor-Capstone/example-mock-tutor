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
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — secondary to thermodynamics primary #1;
      "students often think that heat and temperature are equivalent, concluding that the
      temperature of a system must always rise due to input heat transfer" (Self et al.;
      Foroushani)
    retrieved: '2026-09-17'
generated: null
---

# Adding heat must raise the temperature

> **Not instructor-checked.** Statement, tier and origin transcribed from the ASEE 2025
> systematic review; probe and repair move authored by this project.

## The wrong belief

If $Q > 0$ then $T$ must increase. Equivalently: if the temperature did not change, no heat was
transferred.

## Why students hold it

Direct consequence of treating heat and temperature as the same quantity (see
[`misc:m01`](m01-heat-energy-temperature-conflated.md)). The review reports that Foroushani
traced phase-change confusion and adiabatic/isothermal confusion back to this belief, and
Saricayir et al. found heat and temperature are least well separated exactly during a change of
state. Everyday experience supports it: heating a pan does raise its temperature.

## Diagnostic probe

> A saturated liquid–vapour mixture of water at 100 °C and 1 atm is heated until it is
> saturated vapour. What is the temperature change? What is the enthalpy change? How much heat
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
