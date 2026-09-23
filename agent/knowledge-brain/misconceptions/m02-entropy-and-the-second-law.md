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
signatures:
  - "The hot block loses entropy and the cold block gains the same amount, so the total doesn't change."
  - "Entropy is conserved like energy — system plus surroundings stays constant."
  - "Two different processes between the same two states give different Δs."
  - "After a full Rankine cycle the water's entropy is higher, because heat went in."
  - "I can't really check entropy with a table — it's more of a concept."
not_signatures:
  - "Energy is conserved between the blocks, but total entropy rises because S_gen > 0."
  - "Over a full cycle the working fluid's Δs is zero; the entropy change shows up in the reservoirs."
  - "Describing entropy as disorder or messiness (that belief is m08, not this card)."
  - "Saying one object's own entropy can't go down, or that a cooling cup or freezing water breaks the second law (that is m10)."
  - "Blaming the gap below 100% efficiency on friction or losses (that is m09)."
  - "Correct entropy bookkeeping: Δs from the tables, s_gen ≥ 0, Δs = 0 over a cycle for the working fluid."
confusable_with:
  - id: misc:m10-entropy-of-an-isolated-system
    separating_question: "As a can of soda cools in the fridge, does the soda's own entropy go up or down, and what about soda plus kitchen together?"
  - id: misc:m08-entropy-is-only-disorder
    separating_question: "How would you check your answer: with s values from the tables, or by how disordered the molecules are?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — thermodynamics primary misconception #2
      ("misunderstandings related to entropy and its implications with the 2nd law")
    retrieved: '2026-09-17'
  - url: https://www.physicseducation.net/docs/Christensen_AJP_final.pdf
    title: >-
      Christensen, Meltzer & Ogilvie, "Student ideas regarding entropy and the second law of
      thermodynamics in an introductory physics course", Am. J. Phys. 77, 907 (2009), author-hosted
      copy [read — full text]
    retrieved: '2026-09-22'
  - url: https://arxiv.org/abs/2408.00944
    title: >-
      Brundage, Meltzer & Singh, "Investigating introductory and advanced students' difficulties
      with entropy and the second law of thermodynamics using a validated instrument", Phys. Rev.
      Phys. Educ. Res. 20, 020110 (2024), arXiv:2408.00944 [read — full text]
    retrieved: '2026-09-22'
  - url: https://arxiv.org/abs/1508.04104
    title: >-
      Smith, Christensen, Mountcastle & Thompson, "Identifying student difficulties with entropy,
      heat engines, and the Carnot cycle", Phys. Rev. ST Phys. Educ. Res. 11, 020116 (2015),
      arXiv:1508.04104 [read — full text]
    retrieved: '2026-09-22'
  - url: https://peer.asee.org/assessment-of-fundamental-concept-in-thermodynamics.pdf
    title: >-
      Karimi & Manteufel, "Assessment of fundamental concepts in thermodynamics", ASEE 2014, paper
      10626 (first mechanical engineering thermodynamics course, UTSA) [read — full text]
    retrieved: '2026-09-22'
generated: null
---

# Entropy and the second law misunderstood

> **Not instructor-checked.** Statement and tier are from the ASEE 2025 review; the signatures,
> added by an AI research pass on 2026-09-22, paraphrase student responses in Christensen et al.
> (2009), Smith et al. (2015) and Brundage et al. (2024) and an ME exam item in Karimi & Manteufel
> (2014), while the not-signatures, probe and repair move are this project's.

## The wrong belief

Entropy is a qualitative property of matter — a vague "messiness" — rather than a state
property with units of kJ/(kg·K) that is tabulated, computed, and balanced like mass or energy.
The second law is remembered as a slogan rather than as a usable constraint.

## How it sounds

- The hot block loses entropy and the cold block gains the same amount, so the total doesn't change.
- Entropy is conserved like energy — system plus surroundings stays constant.
- Two different processes between the same two states give different Δs.
- After a full Rankine cycle the water's entropy is higher, because heat went in.
- I can't really check entropy with a table — it's more of a concept.

The tell is entropy handled as a conserved quantity with no generation term, or as something
that cannot be computed; an entropy balance with S_gen ≥ 0 and table values is correct.

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
