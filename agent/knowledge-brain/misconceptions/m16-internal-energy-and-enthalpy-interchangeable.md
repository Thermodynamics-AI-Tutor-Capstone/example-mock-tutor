---
id: misc:m16-internal-energy-and-enthalpy-interchangeable
kind: misconception
title: Internal energy and enthalpy used interchangeably
description: >-
  u and h treated as the same property, or h read as "heat content": u used for a flowing stream,
  h for a rigid closed tank, or Δh taken as the heat whatever the process.
tier: secondary
secondary_to: misc:m12-boundary-flow-and-shaft-work-confused
parent: course:me300
unit: unit:u4-control-volumes-and-second-law
status: draft
audience: both
priority: 0.85
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [u, h, P, v, Q]
misconceptions: []
examples: []
items: []
signatures:
  - "Across the throttling valve the internal energy stays the same."
  - "Enthalpy is just the heat content, so Δh is the heat added to the steam."
  - "For the sealed rigid tank I'll use Q = m(h₂ − h₁)."
  - "I took u from the steam table for the turbine inlet — u and h are basically the same."
  - "Air fills the evacuated tank, so the tank ends at the supply-line temperature."
  - "Pv is a tiny correction, so h ≈ u for the air."
not_signatures:
  - "Piston–cylinder at constant pressure: Q = ΔH, because the boundary work PΔV folds into it."
  - "For compressed liquid water h ≈ u, because Pv is tiny."
  - "Across the throttle h₁ = h₂, while u and T can both change."
confusable_with:
  - id: misc:m12-boundary-flow-and-shaft-work-confused
    separating_question: "For the stream crossing the inlet, are you using u or h, and did you also add a separate Pv work term?"
  - id: misc:m14-cp-and-cv-chosen-by-process-name
    separating_question: "Is the question which property goes in the balance (u or h), or which specific heat turns ΔT into it (c_v or c_p)?"
sources:
  - url: https://peer.asee.org/assessment-and-repair-of-critical-misconceptions-in-engineering-heat-transfer-and-thermodynamics.pdf
    title: >-
      Prince, Vigeant & Nottis, "Assessment and repair of critical misconceptions in engineering
      heat transfer and thermodynamics", ASEE 2013, paper 6584 — lists "internal energy and
      enthalpy are interchangeable" as a critical misconception; CIET results [read — full text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/inquiry-based-activities-to-repair-misconceptions-in-thermodynamics-and-heat-transfer.pdf
    title: >-
      Vigeant, Prince & Nottis, "Inquiry-based activities to repair misconceptions in
      thermodynamics and heat transfer", ASEE 2009, AC 2009-2039 — evacuated-tank and fan items
      [read — full text]
    retrieved: '2026-09-22'
  - url: https://arxiv.org/abs/1407.5533
    title: >-
      Dreyfus, Geller, Meltzer & Sawtelle, "Resource Letter TTSM-1: Teaching thermodynamics and
      statistical mechanics in introductory physics, chemistry, and biology", arXiv:1407.5533
      [read — full text; its summary of Nilsson & Niedderer 2014 is second-hand, as that paper
      could not be opened]
    retrieved: '2026-09-22'
generated: null
---

# Internal energy and enthalpy used interchangeably

> **Not instructor-checked.** Added by an AI research pass on 2026-09-22: that engineering
> students treat u and h as interchangeable is sourced to concept-inventory work by Prince, Vigeant
> and Nottis (2009, 2013), and the heat–enthalpy conflation to a resource letter's summary of
> chemistry-education research, while the signatures, the filing under
> [`misc:m12`](m12-boundary-flow-and-shaft-work-confused.md), the probe and the repair move are
> this project's inference.

## The wrong belief

Internal energy and enthalpy are two names for the energy a substance holds, so either can go
into an energy balance. A common companion: enthalpy is the substance's "heat content", so a
change in $h$ is the heat added, whatever the process.

## How it sounds

- Across the throttling valve the internal energy stays the same.
- Enthalpy is just the heat content, so Δh is the heat added to the steam.
- For the sealed rigid tank I'll use Q = m(h₂ − h₁).
- I took u from the steam table for the turbine inlet — u and h are basically the same.
- Air fills the evacuated tank, so the tank ends at the supply-line temperature.
- Pv is a tiny correction, so h ≈ u for the air.

The tell is u and h swapped without asking whether mass crosses the boundary; choosing h for
flowing streams, u for closed systems, and Q = ΔH only for constant-pressure closed systems is
correct.

## Why students hold it

Prince, Vigeant and Nottis list "internal energy and enthalpy are interchangeable" among five
critical thermodynamics misconceptions. On their Concept Inventory for Engineering
Thermodynamics, given in 26 engineering courses (about a third of the students mechanical
engineers), it was the lowest-scoring area: 26.5 % before and 38.5 % after a course taught
without their activities (N = 271 and 231). Vigeant et al. report that the hardest item on the
concept was an insulated, evacuated tank filling from a pressurised line. Two things feed it.
Chemistry courses dwell on constant-pressure processes, where $\Delta H = Q$, and a physics
education resource letter notes the resulting conflation of heat and enthalpy. And $h = u + Pv$
looks like a small correction, which for liquids it is.

## Diagnostic probe

> Refrigerant-134a passes through an adiabatic throttling valve. Which property is the same at
> inlet and exit, $u$ or $h$? Then a sealed rigid tank of the same refrigerant receives 10 kJ of
> heat. Is that 10 kJ equal to $\Delta U$ or to $\Delta H$?

The misconception answers "either" or "$u$" to the first and "$\Delta H$" to the second. The
intended answer: $h_1 = h_2$ across the throttle, because the flow work $Pv$ is part of what each
kilogram carries, while $u$ generally changes; the rigid tank has no boundary work and no mass
flow, so $Q = \Delta U$, not $\Delta H$.

## Repair move

Tie each property to the system type:

- A **closed system** stores $u$ (plus kinetic and potential energy). Its first law uses
  $\Delta U$.
- Each kilogram **crossing a boundary** carries $h = u + Pv$, because $Pv$ is the flow work
  needed to push it in or out. Steady-flow balances use $h$.
- $Q = \Delta H$ is a special case: a closed system at constant pressure whose only work is
  boundary work, so $W_b = P\,\Delta V$ folds into $\Delta H$.

Then put a number on $Pv$ so it stops looking like a correction: for air at 300 K,
$Pv = RT \approx 86$ kJ/kg, which is not a rounding error. For liquid water near 1 atm,
$Pv \approx 0.1$ kJ/kg, which is why $h \approx u$ is fair for liquids and wrong for gases.

## Where this shows up in ME 300

Unit 4, every steady-flow device (lectures 27–33), where $h$ replaces $u$ and the throttle gives
$h_1 = h_2$; and Unit 3 closed-system heating at constant pressure, where $Q = \Delta H$ is
legitimately true.
