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
signatures:
  - "With no friction and perfect insulation, this engine could hit 100 %."
  - "It's reversible, so nothing's lost — it's 100 % efficient."
  - "80 % is high but possible; only 100 % is impossible."
  - "Route the condenser's waste heat back into the boiler and get more work."
  - "Better technology will keep pushing efficiency toward 100 %."
  - "W = Q_H − Q_L checks out, so the engine works."
not_signatures:
  - "Even a frictionless engine between 500 K and 300 K tops out at 40 %."
  - "Friction pulls a real engine below Carnot; 1 − T_L/T_H is the ceiling."
confusable_with:
  - id: misc:m17-cop-treated-as-an-efficiency
    separating_question: "Is the number you're capping a heat engine's efficiency, or a refrigerator or heat pump's COP?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "Prince et al. mentions that students
      incorrectly assume that friction and heat losses are the only limitations to achieving
      100% thermal efficiency and fail to understand the impact of entropy on real systems"
    retrieved: '2026-09-17'
  - url: https://www.if.ufrj.br/~carlos/fisterm/leituras/Cochran_PhysRevPER2006.pdf
    title: >-
      Cochran & Heron, "Development and assessment of research-based tutorials on heat engines and
      the second law of thermodynamics", Am. J. Phys. 74, 734 (2006) [read — full text]
    retrieved: '2026-09-22'
  - url: https://arxiv.org/abs/2408.00944
    title: >-
      Brundage, Meltzer & Singh, "Investigating introductory and advanced students' difficulties
      with entropy and the second law of thermodynamics using a validated instrument", Phys. Rev.
      Phys. Educ. Res. 20, 020110 (2024), arXiv:2408.00944 [read — full text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/inquiry-based-activities-to-repair-misconceptions-in-thermodynamics-and-heat-transfer.pdf
    title: >-
      Vigeant, Prince & Nottis, "Inquiry-based activities to repair misconceptions in thermodynamics
      and heat transfer", ASEE 2009, AC 2009-2039 [read — full text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/assessment-and-repair-of-critical-misconceptions-in-engineering-heat-transfer-and-thermodynamics.pdf
    title: >-
      Prince, Vigeant & Nottis, "Assessment and repair of critical misconceptions in engineering
      heat transfer and thermodynamics", ASEE 2013, paper 6584 (HECI and CIET concept-inventory
      results) [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Friction and losses are the only limit on efficiency

> **Not instructor-checked.** Statement, tier and origin are from the ASEE 2025 review; the
> signatures, added by an AI research pass on 2026-09-22, paraphrase student responses in Cochran &
> Heron (2006) and Brundage et al. (2024) and a class-activity report by Vigeant et al. (2009), while
> the not-signatures, probe and repair move are this project's.

## The wrong belief

Engines fall short of 100 % efficiency because of friction, leaks and heat lost to the
surroundings. Fix all of those and you would get 100 %.

## How it sounds

- With no friction and perfect insulation, this engine could hit 100 %.
- It's reversible, so nothing's lost — it's 100 % efficient.
- 80 % is high but possible; only 100 % is impossible.
- Route the condenser's waste heat back into the boiler and get more work.
- Better technology will keep pushing efficiency toward 100 %.
- W = Q_H − Q_L checks out, so the engine works.

The tell is a ceiling of 100 % (or none at all), with rejected heat treated as waste to engineer
away; comparing against 1 − T_L/T_H is correct.

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
