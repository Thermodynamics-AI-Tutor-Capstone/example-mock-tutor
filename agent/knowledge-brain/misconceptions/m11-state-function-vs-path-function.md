---
id: misc:m11-state-function-vs-path-function
kind: misconception
title: State functions and path functions not distinguished
description: >-
  Heat and work written as if a system possessed them at a state, and work assumed to depend
  only on the endpoints rather than the path.
tier: secondary
secondary_to: misc:m03-steady-state-vs-equilibrium
parent: course:me300
unit: unit:u3-mass-and-first-law-closed-systems
status: draft
audience: both
priority: 0.85
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [Q, W, u, h, s, Delta]
misconceptions:
  - misc:m13-work-read-off-a-pv-diagram
examples: []
items: []
signatures:
  - "Both paths start and end at the same states, so Q is the same for both."
  - "Work is a state function — the route from 1 to 2 doesn't matter."
  - "It's a cycle and we end where we started, so net Q and net W are zero."
  - "I'll write Q₂ − Q₁ for the change in the gas's heat."
  - "Heat and work are properties of the system, like P and v."
  - "A different path between the same two states changes Δu too."
not_signatures:
  - "Δu is the same for both paths; W and Q differ because the areas differ."
  - "Over a full cycle ΔU = 0, so Q_net = W_net — neither has to be zero."
confusable_with:
  - id: misc:m13-work-read-off-a-pv-diagram
    separating_question: "If you shade the area under each path on the P-v diagram, are the two areas equal?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — confusion over constant-pressure and
      constant-volume assumptions "led to misunderstandings about function of state and
      function of path" (Foroushani), reported as secondary to primary #3
    retrieved: '2026-09-17'
  - url: https://www.if.ufrj.br/~carlos/fisterm/leituras/Meltzer_AJP2004.pdf
    title: >-
      Meltzer, "Investigation of students' reasoning regarding heat, work, and the first law of
      thermodynamics in an introductory calculus-based general physics course", Am. J. Phys. 72,
      1432 (2004) [read — full text]
    retrieved: '2026-09-22'
  - url: https://www.if.ufrj.br/~carlos/fisterm/leituras/Loverude_AJP2002.pdf
    title: >-
      Loverude, Kautz & Heron, "Student understanding of the first law of thermodynamics: Relating
      work to the adiabatic compression of an ideal gas", Am. J. Phys. 70, 137 (2002) [read — full
      text]
    retrieved: '2026-09-22'
  - url: https://arxiv.org/abs/2403.03795
    title: >-
      Brundage, Meltzer & Singh, "Investigating introductory and advanced students' difficulties
      with change in internal energy, work and heat transfer using a validated instrument",
      arXiv:2403.03795 (2024) [read — full text]
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

# State functions and path functions not distinguished

> **Not instructor-checked.** Statement, tier and origin are from the ASEE 2025 review; the
> signatures, added by an AI research pass on 2026-09-22, paraphrase student responses in Meltzer
> (2004, 2008), Loverude et al. (2002) and Brundage et al. (2024) and ME exam items in Karimi &
> Manteufel (2014), while the not-signatures, probe and repair move are this project's.

## The wrong belief

Every quantity in thermodynamics belongs to a state, so all of them can be subtracted between
states. A student writes $Q_2 - Q_1$, or asks how much work a system "has".

## How it sounds

- Both paths start and end at the same states, so Q is the same for both.
- Work is a state function — the route from 1 to 2 doesn't matter.
- It's a cycle and we end where we started, so net Q and net W are zero.
- I'll write Q₂ − Q₁ for the change in the gas's heat.
- Heat and work are properties of the system, like P and v.
- A different path between the same two states changes Δu too.

The tell is endpoint reasoning applied to Q or W, or path reasoning applied to u, h or s;
keeping Δ and state subscripts for properties only is correct.

## Why students hold it

The review places this as a secondary misconception under primary #3, arising via confusion
over which process assumption is in force. Properties are introduced first and in bulk, and the
notational habit of subscripting everything by state number is established before heat and work
arrive. Nothing in the notation warns the student that two of the symbols do not take state
subscripts.

## Diagnostic probe

> A gas goes from state 1 to state 2 by two different processes: first constant pressure then
> constant volume, or first constant volume then constant pressure. For each of $\Delta u$,
> $Q$ and $W$, say whether the two routes give the same answer.

The misconception gives "same" for all three. The intended answer: $\Delta u$ is the same
because $u$ is a property; $W$ differs — it is the area under the path on a P-v diagram, and the
two paths enclose different areas; $Q$ therefore differs too, since $Q = \Delta u + W$.

## Repair move

Make the notation carry the distinction and then enforce it:

- Properties take state subscripts and $\Delta$: $u_1$, $u_2$, $\Delta u$.
- Heat and work take **no** state subscript and no $\Delta$. They are labelled by the process:
  $Q_{12}$, $W_{12}$, and in differential form $\delta Q$, $\delta W$ — inexact differentials,
  written with $\delta$ rather than $d$ precisely because they are not differences of anything.

Then run the two-path probe above with real numbers once. The area argument on the P-v diagram
is the fastest demonstration, which is why this misconception pairs with
[`misc:m13`](m13-work-read-off-a-pv-diagram.md).

## Where this shows up in ME 300

Unit 1 (what a property is), Unit 3 (every first-law problem), and the SKETCH step of the
mandated solution format.
