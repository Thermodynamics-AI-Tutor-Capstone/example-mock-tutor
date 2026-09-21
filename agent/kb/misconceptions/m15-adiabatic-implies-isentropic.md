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
sources:
  - url: https://github.com/Thermodynamics-AI-Tutor-Capstone/thermo-tutor-research/blob/main/knowledge/PAPER.md
    title: >-
      Capstone research survey, §VI "The three named failure modes" — in a thermodynamics problem
      benchmark, every language model tested assumed reversibility on an adiabatic process where
      the problem did not state it
    retrieved: '2026-09-21'
generated: null
---

# Adiabatic assumed to mean isentropic

> **Not instructor-checked.** Authored by this project. The research survey documents the same
> unwarranted assumption in language models (§VI); that students hold it is our inference from
> how often textbooks pair the two words, not a sourced finding.

## The wrong belief

"The device is insulated, so $Q = 0$, so $\Delta s = 0$." The student writes $s_2 = s_1$ for any
adiabatic process.

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
