---
id: misc:m02-entropy-and-the-second-law
kind: misconception
title: Entropy and the second law misunderstood
description: >-
  Entropy treated as a vague quality rather than a tabulated property that appears in a balance
  with a generation term. Primary (robust) misconception.
tier: primary
secondary_to: null
parent: course:me300
unit: unit:u5-entropy-and-isentropic-processes
status: draft
audience: both
priority: 0.95
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [s, S, S_gen]
misconceptions:
  - misc:m08-entropy-is-only-disorder
  - misc:m09-friction-is-the-only-efficiency-limit
  - misc:m10-entropy-of-an-isolated-system
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — thermodynamics primary misconception #2
      ("misunderstandings related to entropy and its implications with the 2nd law")
    retrieved: '2026-09-17'
generated: null
---

# Entropy and the second law misunderstood

> **Not instructor-checked.** Statement and tier transcribed from the ASEE 2025 systematic
> review; probe and repair move authored by this project.

## The wrong belief

Entropy is a qualitative property of matter — a vague "messiness" — rather than a state
property with units of kJ/(kg·K) that is tabulated, computed, and balanced like mass or energy.
The second law is remembered as a slogan rather than as a usable constraint.

## Why students hold it

The review lists this as primary misconception #2, persistent across the concept-inventory
literature (Prince et al., Streveler et al., Foroushani, Kesidou & Duit). Entropy is introduced
in most students' prior chemistry or physics as a statistical-mechanics idea, with no
calculation attached, years before they meet an entropy balance. Nothing in that first encounter
gives them a reason to think of entropy as a number they can look up in a table.

## Diagnostic probe

> Steam expands through a well-insulated turbine. Write down whether the entropy of the steam
> goes up, down, or stays the same — and say how you would check your answer with a table.

A student holding the misconception argues from "disorder" and cannot name the check. The
intended answer: for an adiabatic device $s_2 \ge s_1$, equal only if reversible; check by
reading $s_1$ and $s_2$ from the steam tables at the two states.

## Repair move

Make entropy computable before making it meaningful:

1. Read $s$ out of a property table for two states. It is a number with units, like $h$.
2. Write the entropy balance as an accounting statement with the same shape as the mass and
   energy balances the student already trusts — in, out, generated, stored.
3. Only then attach the interpretation, and attach it to $S_{gen}$ rather than to $s$:
   **$S_{gen} \ge 0$ is the second law**, and $S_{gen} > 0$ is exactly the amount of
   irreversibility in the process.

The order matters. Explaining what entropy "means" before the student can compute it is what
produced the misconception in the first place.

## Where this shows up in ME 300

Unit 5 (lectures 36–43) is built on it, and Unit 4's second-law overview (lecture 34) is where
it first becomes visible.
