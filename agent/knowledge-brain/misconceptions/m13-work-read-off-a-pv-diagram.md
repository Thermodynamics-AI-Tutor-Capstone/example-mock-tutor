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
generated: null
---

# P-v diagram misread when finding work

> **Not instructor-checked.** The finding is transcribed from the ASEE 2025 systematic review's
> introduction, which cites Meltzer (2004). Note that the review does **not** place this in its
> primary/secondary tiering — filing it under
> [`misc:m11`](m11-state-function-vs-path-function.md) is this project's inference, not the
> review's claim. Probe and repair move authored by this project.

## The wrong belief

The work of a process can be read off a P-v diagram without attending to the path: from the
endpoints alone, or from the area to the left of the curve, or without a sign.

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
