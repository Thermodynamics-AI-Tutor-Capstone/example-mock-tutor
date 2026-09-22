---
id: misc:m17-cop-treated-as-an-efficiency
kind: misconception
title: Coefficient of performance treated as an efficiency capped at 1
description: >-
  A refrigerator or heat pump COP assumed to be at most 1, like a thermal efficiency, so a COP of
  3 looks like getting more energy out than was put in.
tier: secondary
secondary_to: misc:m09-friction-is-the-only-efficiency-limit
parent: course:me300
unit: unit:u4-control-volumes-and-second-law
status: draft
audience: both
priority: 0.8
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [Q_H, Q_L, W, T_H, T_L]
misconceptions: []
examples: []
items: []
signatures:
  - "A COP of 3 means more energy out than in — that's impossible."
  - "COP is an efficiency, so it has to be less than 1."
  - "The heat pump's COP can't be over 100 %."
  - "Q_H can't be bigger than W for the heat pump, or energy isn't conserved."
  - "The fridge removes 200 kJ with only 100 kJ of work? That breaks the first law."
  - "My COP came out 4.2, so I must have flipped Q_L and W."
not_signatures:
  - "COP can exceed 1 because Q_L comes from the cold space; W only moves it."
  - "COP_HP = COP_R + 1, and the Carnot COP is the real ceiling."
  - "An engine's thermal efficiency is below 1 — below Carnot, in fact."
confusable_with:
  - id: misc:m09-friction-is-the-only-efficiency-limit
    separating_question: "Is the number you're capping a heat engine's efficiency, or a refrigerator or heat pump's COP?"
  - id: misc:m10-entropy-of-an-isolated-system
    separating_question: "Is your worry that heat can't be moved from cold to hot at all, or that the fridge moves more energy than the work put in?"
sources:
  - url: https://peer.asee.org/assessment-of-fundamental-concept-in-thermodynamics.pdf
    title: >-
      Karimi & Manteufel, "Assessment of fundamental concepts in thermodynamics", ASEE 2014, paper
      10626 (first mechanical engineering thermodynamics course, UTSA) — COP-range, heat-pump and
      refrigerator items [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Coefficient of performance treated as an efficiency capped at 1

> **Not instructor-checked.** Added by an AI research pass on 2026-09-22 from one ME source,
> Karimi & Manteufel (2014), which reports how often students missed COP items but not which wrong
> answers they chose; the signatures, the filing under
> [`misc:m09`](m09-friction-is-the-only-efficiency-limit.md), the probe and the repair move are
> this project's inference.

## The wrong belief

A coefficient of performance is an efficiency, and nothing is more than 100 % efficient, so a
COP above 1 means more energy came out than went in.

## How it sounds

- A COP of 3 means more energy out than in — that's impossible.
- COP is an efficiency, so it has to be less than 1.
- The heat pump's COP can't be over 100 %.
- Q_H can't be bigger than W for the heat pump, or energy isn't conserved.
- The fridge removes 200 kJ with only 100 kJ of work? That breaks the first law.
- My COP came out 4.2, so I must have flipped Q_L and W.

The tell is a COP above 1 read as energy created; saying the extra is heat drawn from the cold
side, with the Carnot COP as the ceiling, is correct.

## Why students hold it

Karimi and Manteufel (2014) asked students in a first mechanical engineering thermodynamics
course for the allowed range of each figure of merit. Only 35 % chose the right range for a
refrigerator's COP and 27 % for a heat pump's (n = 103), against 45 % for a power cycle's thermal
efficiency. On a later closed-book item, 41 % of 41 students accepted as true that a heat pump's
COP is never greater than 1. Given a heat pump with a COP of 2 that removes 200 kJ from the cold
region, only 10 % found the work and 14 % the heat delivered. The authors trace this to not
tracking which way heat and work cross a cycle's boundary. The paper does not report which wrong
answers were chosen, so the true/false item is the only direct evidence for "capped at 1". The
words help the error along: "efficiency" and "performance" both sound like output over input with
100 % at the top.

## Diagnostic probe

> A heat pump keeps a house warm by delivering 12 kW of heat while its compressor draws 3 kW.
> What is its COP? Does that break the first law? Where did the other 9 kW come from?

The misconception says a COP of 4 is impossible or violates energy conservation. The intended
answer: $\text{COP}_{HP} = 12/3 = 4$; no violation, because $Q_H = Q_L + W$, so 9 kW is drawn
from the cold outdoor air; the ceiling is the Carnot COP, $T_H/(T_H - T_L)$, not 1.

## Repair move

Separate the two kinds of ratio by what they divide:

- **Thermal efficiency** $\eta = W_{net}/Q_H$: the work is carved out of the same heat input, so
  $\eta < 1$ by the first law and $\eta \le 1 - T_L/T_H$ by the second.
- **COP** — $\text{COP}_R = Q_L/W$ and $\text{COP}_{HP} = Q_H/W$: the numerator is heat *moved*,
  not energy created, and $W$ only pays for moving it. Nothing caps it at 1. For the same cycle
  $\text{COP}_{HP} = \text{COP}_R + 1$, so a heat pump's COP is always above 1.
- The real ceiling is the Carnot COP: $T_L/(T_H - T_L)$ for a refrigerator, $T_H/(T_H - T_L)$
  for a heat pump, in kelvin. A fridge working between 0 °C and 25 °C could reach about 11.

Then make the first law for the cycle the check every time: $Q_H = Q_L + W$.

## Where this shows up in ME 300

Unit 4, whose objectives include using thermal efficiency and COP as definitions next to the
second-law overview (lecture 34), and the refrigeration cycles named in course objective E.
