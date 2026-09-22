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
signatures:
  - "Entropy always increases, so the soda's entropy has to go up as it cools."
  - "I got a negative Δs across the condenser — that must be a mistake."
  - "A refrigerator can't work — heat doesn't flow from cold to hot."
  - "It's irreversible, so the gas's entropy has to go up, even though it's losing heat to the surroundings."
  - "Even over a reversible cycle, the working fluid's entropy goes up."
  - "Isothermal compression can't lower the gas's entropy; entropy never decreases."
not_signatures:
  - "The soda's entropy falls, but soda plus kitchen rises — no violation."
  - "S_gen ≥ 0 always; the system's Δs can be negative when heat leaves."
  - "The device is insulated and irreversible, so s₂ > s₁: with no heat transfer, Δs = s_gen > 0."
confusable_with:
  - id: misc:m02-entropy-and-the-second-law
    separating_question: "As a can of soda cools in the fridge, does the soda's own entropy go up or down, and what about soda plus kitchen together?"
  - id: misc:m08-entropy-is-only-disorder
    separating_question: "Why must it increase: because the molecules get more disordered, or because entropy can never go down?"
  - id: misc:m17-cop-treated-as-an-efficiency
    separating_question: "Is your worry that heat can't be moved from cold to hot at all, or that the fridge moves more energy than the work put in?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — misconceptions about the definition of
      entropy lead to "mistakes with entropy changes in an isolated system"
    retrieved: '2026-09-17'
  - url: https://www.physicseducation.net/docs/Christensen_AJP_final.pdf
    title: >-
      Christensen, Meltzer & Ogilvie, "Student ideas regarding entropy and the second law of
      thermodynamics in an introductory physics course", Am. J. Phys. 77, 907 (2009), author-hosted
      copy [read — full text]
    retrieved: '2026-09-22'
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
  - url: https://www.physicseducation.net/docs/ASEE_2008_published.pdf
    title: >-
      Meltzer, "Investigating and addressing learning difficulties in thermodynamics", ASEE 2008, AC
      2008-1505; about 90% of the introductory sample were engineering majors [read — full text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/assessment-of-fundamental-concept-in-thermodynamics.pdf
    title: >-
      Karimi & Manteufel, "Assessment of fundamental concepts in thermodynamics", ASEE 2014, paper
      10626 (first mechanical engineering thermodynamics course, UTSA) [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# "Entropy always increases" applied to the wrong system

> **Not instructor-checked.** Statement, tier and origin are from the ASEE 2025 review; the
> signatures, added by an AI research pass on 2026-09-22, paraphrase student responses in Christensen
> et al. (2009), Cochran & Heron (2006) and Brundage et al. (2024), with an ME exam item in Karimi &
> Manteufel (2014), while the not-signatures, probe and repair move are this project's.

## The wrong belief

Entropy always increases, for everything. So a calculated $\Delta S < 0$ must be an arithmetic
mistake, and a refrigerator is a violation of the second law.

## How it sounds

- Entropy always increases, so the soda's entropy has to go up as it cools.
- I got a negative Δs across the condenser — that must be a mistake.
- A refrigerator can't work — heat doesn't flow from cold to hot.
- It's irreversible, so the gas's entropy has to go up, even though it's losing heat to the surroundings.
- Even over a reversible cycle, the working fluid's entropy goes up.
- Isothermal compression can't lower the gas's entropy; entropy never decreases.

The tell is "must increase" applied to one system or device; applying it to S_gen or to an
isolated system (system plus surroundings) is correct.

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
