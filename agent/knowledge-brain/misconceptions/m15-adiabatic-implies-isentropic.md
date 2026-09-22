---
id: misc:m15-adiabatic-implies-isentropic
kind: misconception
title: Adiabatic assumed to mean isentropic
description: >-
  "No heat crosses the boundary, so entropy doesn't change." Isentropic needs adiabatic AND
  reversible; a real adiabatic turbine, compressor or throttle generates entropy.
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
symbols: [s, Q]
misconceptions: []
examples: []
items: []
signatures:
  - "It's insulated, so Q = 0 and s₂ = s₁."
  - "Adiabatic turbine, so the actual exit state is at s₂ = s₁."
  - "The throttle's adiabatic, so entropy doesn't change across it."
  - "No heat can get in or out, so there's no way the entropy changes."
  - "The free expansion is adiabatic, so Δs = 0."
  - "Q = 0 in the compressor, so it's isentropic whatever the efficiency."
not_signatures:
  - "Insulated removes the heat-transfer term, but it's irreversible so s_gen > 0."
  - "s₂s = s₁ is only the ideal reference state; η then gives the actual h₂."
confusable_with:
  - id: misc:m05-adiabatic-and-isothermal-conflated
    separating_question: "For this insulated device, which do you think stays constant: the temperature or the entropy?"
sources:
  - url: https://github.com/Thermodynamics-AI-Tutor-Capstone/thermo-tutor-research/blob/main/knowledge/PAPER.md
    title: >-
      Capstone research survey, §VI "The three named failure modes" — in a thermodynamics problem
      benchmark, every language model tested assumed reversibility on an adiabatic process where
      the problem did not state it
    retrieved: '2026-09-21'
  - url: https://arxiv.org/abs/2408.00944
    title: >-
      Brundage, Meltzer & Singh, "Investigating introductory and advanced students' difficulties
      with entropy and the second law of thermodynamics using a validated instrument", Phys. Rev.
      Phys. Educ. Res. 20, 020110 (2024), arXiv:2408.00944 [read — full text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/assessment-of-fundamental-concept-in-thermodynamics.pdf
    title: >-
      Karimi & Manteufel, "Assessment of fundamental concepts in thermodynamics", ASEE 2014, paper
      10626 (first mechanical engineering thermodynamics course, UTSA) [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Adiabatic assumed to mean isentropic

> **Not instructor-checked.** That students hold this is now sourced: the signatures, added by an
> AI research pass on 2026-09-22, paraphrase introductory students' reasoning reported by Brundage
> et al. (2024) that no heat exchange means entropy cannot change, and on an ME exam item 36 % of 41
> students missed that an irreversible device with Q ≥ 0 raises exit entropy (Karimi & Manteufel
> 2014; wrong answers not broken down). The not-signatures, probe and repair move remain this
> project's inference.

## The wrong belief

"The device is insulated, so $Q = 0$, so $\Delta s = 0$." The student writes $s_2 = s_1$ for any
adiabatic process.

## How it sounds

- It's insulated, so Q = 0 and s₂ = s₁.
- Adiabatic turbine, so the actual exit state is at s₂ = s₁.
- The throttle's adiabatic, so entropy doesn't change across it.
- No heat can get in or out, so there's no way the entropy changes.
- The free expansion is adiabatic, so Δs = 0.
- Q = 0 in the compressor, so it's isentropic whatever the efficiency.

The tell is Q = 0 alone justifying Δs = 0; using s₂ = s₁ only when the process is also stated
reversible, or only for the ideal reference state, is correct.

## Why students hold it

The entropy balance for a closed system is $\Delta S = \int \delta Q/T + S_{gen}$. With $Q = 0$ the
first term vanishes, and it is easy to forget the second. Textbook examples usually model
turbines and compressors as *ideal*, so "adiabatic" and "isentropic" appear together until they
feel like synonyms.

## Diagnostic probe

> Steam expands through a well-insulated turbine with a real efficiency of 85 %. Compared with
> the inlet, the exit specific entropy is: **A** the same · **B** higher · **C** lower ·
> **D** depends on whether heat is lost

- **A** — this misconception (adiabatic ⇒ isentropic).
- **C** — "entropy always decreases when work is extracted", a different confusion about what
  carries entropy.
- **D** — ignores that the turbine is stated to be insulated.
- **B** is correct: adiabatic removes the transfer term, but irreversibility still generates
  entropy.

**Isomorphic re-test:** air is throttled through an insulated valve from 800 kPa to 100 kPa. Does
its entropy change? (Yes — it rises. Throttling is isenthalpic, not isentropic.)

## Repair move

Write the entropy balance with both terms every time, and kill them one at a time:

$$s_2 - s_1 = \underbrace{\int \frac{\delta q}{T}}_{=0 \text{ if adiabatic}} + \underbrace{s_{gen}}_{=0 \text{ only if reversible}}$$

Adiabatic kills the first term. Only *reversible* kills the second. Isentropic is the special
case where both vanish — which is why the isentropic state ($h_{2s}$) is the *ideal* reference an
efficiency is measured against, not what the real device does.

## Where this shows up in ME 300

Unit 5 — isentropic processes and device efficiencies — and any turbine, compressor, nozzle or
throttling problem where reversibility is not stated.
