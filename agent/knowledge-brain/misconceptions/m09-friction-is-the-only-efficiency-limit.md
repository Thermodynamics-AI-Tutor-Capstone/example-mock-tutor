---
id: misc:m09-friction-is-the-only-efficiency-limit
kind: misconception
title: Friction and losses are the only limit on efficiency
description: >-
  A frictionless, perfectly insulated engine assumed to reach 100 percent efficiency, missing
  the Carnot ceiling that binds even a reversible machine.
tier: secondary
secondary_to: misc:m02-entropy-and-the-second-law
parent: course:me300
unit: unit:u4-control-volumes-and-second-law
status: draft
audience: both
priority: 0.9
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [eta_th, T_H, T_L, Q_H, Q_L]
misconceptions: []
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "Prince et al. mentions that students
      incorrectly assume that friction and heat losses are the only limitations to achieving
      100% thermal efficiency and fail to understand the impact of entropy on real systems"
    retrieved: '2026-09-17'
generated: null
---

# Friction and losses are the only limit on efficiency

> **Not instructor-checked.** Statement, tier and origin transcribed from the ASEE 2025
> systematic review; probe and repair move authored by this project.

## The wrong belief

Engines fall short of 100 % efficiency because of friction, leaks and heat lost to the
surroundings. Fix all of those and you would get 100 %.

## Why students hold it

The review attributes it to Prince et al., tied to not understanding the impact of entropy on
real systems. It is a reasonable engineering instinct — most inefficiencies a student has met
really are losses that better design removes — and nothing before the second law tells them
some limits are not losses at all.

## Diagnostic probe

> A heat engine operates between a 500 K source and a 300 K sink. Suppose every bearing is
> frictionless, every surface perfectly insulated, and every component ideal. What is the
> highest thermal efficiency it can reach, and where does the rest of the energy go?

The misconception answers "100 %, nowhere". The intended answer: $1 - 300/500 = 40\%$, and 60 %
of $Q_H$ must be rejected to the cold sink. Not lost — *rejected*, by necessity.

## Repair move

Separate two different kinds of shortfall, and name them differently every time:

- **Irreversibilities** — friction, mixing, finite-temperature-difference heat transfer. These
  are avoidable in principle and show up as $S_{gen} > 0$.
- **The Carnot limit** — $\eta_{th} \le 1 - T_L/T_H$. This binds a *perfectly reversible*
  engine. It is not a loss and no engineering removes it.

Then make the Kelvin-Planck statement do the work: no cycle can take heat from a single
reservoir and convert it entirely to work. Rejecting heat to a cold sink is not a design flaw,
it is the price of the cycle closing.

## Where this shows up in ME 300

Unit 4 lecture 34 (Kelvin-Planck), Unit 5 lecture 36 (Carnot efficiency), and everywhere a
student compares a real device against an ideal one.
