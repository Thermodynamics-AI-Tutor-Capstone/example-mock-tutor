---
id: misc:m13-work-read-off-a-pv-diagram
kind: misconception
title: P-v diagram misread when finding work
description: >-
  P-v diagram misread when finding work: wrong region, wrong sign, or endpoints treated as
  enough. The mandated SKETCH step makes this a graded step.
tier: secondary
secondary_to: misc:m11-state-function-vs-path-function
parent: course:me300
unit: unit:u3-mass-and-first-law-closed-systems
status: draft
audience: both
priority: 0.8
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [P, v, V, W_b]
misconceptions: []
examples: []
items: []
signatures:
  - "Pressure rises along the vertical line, so the work is positive."
  - "It's a closed loop with the same start and end volume, so net work is zero."
  - "Both paths go from V₁ to V₂, so they do the same work."
  - "The adiabatic curve drops more pressure, so it does more work."
  - "I used W = PΔV with the final pressure for the curved path."
  - "Positive work going out, negative coming back — over the cycle they cancel."
not_signatures:
  - "Work is the area under the path to the v-axis; the isobaric path has more."
  - "Constant volume, so W_b = 0 even though P rises."
  - "For the cycle, net work is the enclosed area — clockwise means net work out."
confusable_with:
  - id: misc:m11-state-function-vs-path-function
    separating_question: "If you shade the area under each path on the P-v diagram, are the two areas equal?"
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085, introduction — "Meltzer found that the
      majority of students that drew a P-V diagram interpreted it incorrectly when trying to
      solve problems related to the work done for a process"
    retrieved: '2026-09-17'
  - url: https://www.me.psu.edu/assets/docs/sample-syllabus/ME-300.pdf
    title: >-
      ME 300 sample syllabus — the mandated SKETCH step requires "schematic diagram and
      relevant graphs (P-v, T-s diagrams, etc.)"
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
generated: null
---

# P-v diagram misread when finding work

> **Not instructor-checked.** The finding is Meltzer (2004), now read directly as well as via
> the ASEE 2025 review, and filing it under [`misc:m11`](m11-state-function-vs-path-function.md) is
> our inference; the signatures, added by an AI research pass on 2026-09-22, paraphrase student
> responses in Meltzer (2004), Loverude et al. (2002) and Brundage et al. (2024), while the
> not-signatures, probe and repair move are this project's.

## The wrong belief

The work of a process can be read off a P-v diagram without attending to the path: from the
endpoints alone, or from the area to the left of the curve, or without a sign.

## How it sounds

- Pressure rises along the vertical line, so the work is positive.
- It's a closed loop with the same start and end volume, so net work is zero.
- Both paths go from V₁ to V₂, so they do the same work.
- The adiabatic curve drops more pressure, so it does more work.
- I used W = PΔV with the final pressure for the curved path.
- Positive work going out, negative coming back — over the cycle they cancel.

The tell is work read from endpoints, a pressure change or the net volume change instead of the
area under the path; shading that area with a direction-set sign is correct.

## Why students hold it

Meltzer (2004), cited in the review's introduction, found that the *majority* of students who
drew a P-V diagram interpreted it incorrectly when solving for the work of a process. The
diagram looks like a graph of a function, and students read graphs of functions by their
endpoints. Nothing about the picture signals that the area, not the shape, is the quantity.

This one matters more in ME 300 than the raw finding suggests, because the syllabus **mandates
a SKETCH step with P-v and T-s diagrams on every homework and exam problem.** The diagram is not
optional scaffolding here — it is a graded step, so a misread diagram costs marks directly.

## Diagnostic probe

> Sketch a gas expanding at constant pressure from $V_1$ to $V_2$, then a gas going between the
> same two states along a curved path that dips below. On your sketch, shade the work for each.
> Which is larger? What would make the work negative?

The misconception shades the same region twice, or cannot answer the third part. The intended
answer: the area **under** each path down to the $v$-axis, between $v_1$ and $v_2$; the
constant-pressure path is larger; the work is negative when the process runs right to left, i.e.
compression.

## Repair move

Three rules, applied in order, every time:

1. Work is the **area under the path**, down to the volume axis — not the area to the left, not
   the area between two curves unless the process is a cycle.
2. **Direction sets the sign.** Left to right (expansion) is work out, positive under the
   convention used here. Right to left is work in.
3. For a **cycle**, the work is the **enclosed** area; clockwise is net work out.

Then require the shading on the sketch itself rather than in the analysis, so the interpretation
is committed before the arithmetic starts.

## Where this shows up in ME 300

Unit 3 (boundary work, lectures 19–25), Unit 5 (T-s and P-v diagrams for isentropic and
polytropic processes, lecture 42), and the SKETCH step of every solution.
