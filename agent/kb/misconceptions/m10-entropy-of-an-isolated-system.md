---
id: misc:m10-entropy-of-an-isolated-system
kind: misconception
title: '"Entropy always increases" applied to the wrong system'
description: >-
  The rule that entropy never decreases applied to any system. It holds for an isolated system;
  a system's own entropy falls whenever it is cooled.
tier: secondary
secondary_to: misc:m02-entropy-and-the-second-law
parent: course:me300
unit: unit:u5-entropy-and-isentropic-processes
status: draft
audience: both
priority: 0.9
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [S, S_gen, s]
misconceptions: []
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — misconceptions about the definition of
      entropy lead to "mistakes with entropy changes in an isolated system"
    retrieved: '2026-09-17'
generated: null
---

# "Entropy always increases" applied to the wrong system

> **Not instructor-checked.** Statement, tier and origin transcribed from the ASEE 2025
> systematic review; probe and repair move authored by this project.

## The wrong belief

Entropy always increases, for everything. So a calculated $\Delta S < 0$ must be an arithmetic
mistake, and a refrigerator is a violation of the second law.

## Why students hold it

The review lists errors with entropy change in an isolated system as a consequence of not
having a working definition of entropy. The slogan is what survives from a previous course, and
the qualifier "of an isolated system" is exactly the part that gets dropped, because slogans
shed qualifiers.

## Diagnostic probe

> A can of soda is put in a fridge and cools from 25 °C to 5 °C. Does the entropy of the soda
> increase or decrease? Does this violate the second law? What else would you have to include
> to answer properly?

The misconception insists the soda's entropy must rise. The intended answer: the soda's entropy
**falls**, because heat left it; no violation; you must include the fridge and the kitchen — the
total for soda plus surroundings rises, by $S_{gen} \ge 0$.

## Repair move

Make the student name the system boundary out loud before quoting the rule. Then state the rule
in its two correct forms and refuse the short one:

- For an **isolated** system: $\Delta S_{isolated} \ge 0$.
- For **any** system: $\Delta S_{sys} = \underbrace{\textstyle\int \delta Q/T}_{\text{transfer, either sign}} + \underbrace{S_{gen}}_{\ge 0}$.

The second form covers the first and is the one that generalises. "Entropy always increases" is
true of $S_{gen}$ accumulated in the universe, and of nothing else.

## Where this shows up in ME 300

Unit 5, lecture 37 (entropy balances) onward; also whenever a student sanity-checks a negative
$\Delta s$ from a table and assumes they misread it.
