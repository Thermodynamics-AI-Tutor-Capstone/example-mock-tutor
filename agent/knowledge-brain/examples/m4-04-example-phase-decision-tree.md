---
id: ex:m4-04-example-phase-decision-tree
kind: example
title: 'Phase Change Decision Tree: Worked Examples'
description: Given T, P, v, u, or h, determine the phase and missing properties for six pure-substance
  states using the phase decision tree and Tables D.1/D.2.
parent: topic:m4-04-example-phase-decision-tree
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.6
topics:
- topic:m4-04-example-phase-decision-tree
misconceptions: []
sources:
- path: lectures/Module4_4_Example_PhaseDecisionTree_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
  - 10
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Phase Change Decision Tree: Worked Examples

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Use the phase decision tree to determine the phase and any missing properties for the following states:
1. $T=310$ K, $v=15$ m³/kg → find $P$, $h$ (Page 2).
2. $P=40$ kPa, $v=0.0010264$ m³/kg → find phase, $T$ (Page 3).
3. $T=286$ K, $u=100$ kJ/kg → find phase, $P$, $v$ (Page 5).
4. $T=500$ K, $v=1.5289$ m³/kg → find phase, $P$ (Page 6).
5. $P=5$ MPa, $h=117.2$ kJ/kg → find phase, $T$ (Page 8; not annotated).
6. $P=5$ MPa, $T=420$ K → find phase (Page 9).

## Given

- Example 1: $T=310$ K, $v=15$ m³/kg (Page 2)
- Example 2: $P=40$ kPa, $v=0.0010264$ m³/kg (Page 3)
- Example 3: $T=286$ K, $u=100$ kJ/kg (Page 5)
- Example 4: $T=500$ K, $v=1.5289$ m³/kg (Page 6)
- Example 5: $P=5$ MPa, $h=117.2$ kJ/kg (Page 8)
- Example 6: $P=5$ MPa, $T=420$ K (Page 9)

## Find

- Example 1: $P$, $h$
- Example 2: phase, $T$
- Example 3: phase, $P$, $v$
- Example 4: phase, $P$
- Example 5: phase, $T$
- Example 6: phase

## Assume

- Tables D.1 and D.2 are used for property data, as selected in the solution.

## Sketch

The instructor refers to a phase-decision flowchart (Page 1) and, for Example 6, sketches two T-v diagrams comparing the state temperature with $T_{sat}$ and the state pressure with $P_{sat}$ (Page 9).

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Example 1 (Page 2): With $T=310$ K, use Table D.1 to compare $v$ with $v_f$ and $v_g$. Since $v_f < v < v_g$, the state is a saturated mixture. Therefore $P=P_{sat}=6.231199$ kPa. Calculate quality: $x=\frac{v-v_f}{v_g-v_f}=\frac{15-0.001}{22.903-0.001}=0.655$. Then $h=x h_g+(1-x)h_f=(0.655)(2567.9)+(1-0.655)(154.4)=1735.25$ kJ/kg, and the result obeys $h_f < h < h_g$.
2. Example 2 (Page 3): With $P=40$ kPa, use Table D.2. The given $v$ equals $v_f$ ($v=0.0010264$ m³/kg), so the phase is saturated liquid and $T=T_{sat}=349.01$ K.
3. Example 3 (Page 5): With $T=286$ K and $u=100$ kJ/kg, use Table D.1. Since $u_f < u < u_g$, the state is a saturated mixture, so $P=P_{sat}=1.4836$ kPa. Quality is $x=\frac{u-u_f}{u_g-u_f}=\frac{100-53.971}{2392.6-53.971}=0.0197$. Then $v=x v_g+(1-x)v_f=(0.0197)(88.884)+(1-0.0197)(0.0010006)=1.75$ m³/kg.
4. Example 4 (Page 6): With $T=500$ K and $v=1.5289$ m³/kg, use Table D.1. Since $v > v_g$, the phase is vapor and $P=0.15$ MPa.
5. Example 5 (Page 8): The slide states $P=5$ MPa, $h=117.2$ kJ/kg and asks for phase and $T$, but the page contains no annotations; no solution is provided in the transcript.
6. Example 6 (Page 9): With $P=5$ MPa and $T=420$ K, use Table D.2 to compare $T$ with $T_{sat}$: the handwritten note gives $T < T_{sat}$, so the phase is liquid. Equivalently, from Table D.1, $P > P_{sat}$, indicating compressed liquid.

## Answer

- Example 1 $P: 6.231199 kPa
- Example 1 $h: 1735.25 kJ/kg
- Example 2 phase: saturated liquid
- Example 2 $T: 349.01 K
- Example 3 phase: saturated mixture
- Example 3 $P: 1.4836 kPa
- Example 3 $v: 1.75 m³/kg
- Example 4 phase: vapor
- Example 4 $P: 0.15 MPa
- Example 5 phase and $T: not solved in transcript
- Example 6 phase: liquid

## What the instructor emphasises

- Temperature-given states use Table D.1; pressure-given states use Table D.2.
- Compare the given intensive property ($v$ or $u$) to the saturated liquid and saturated vapor values from the table to determine the phase.
- For a saturated mixture, pressure is the saturation pressure; quality is based on the given property, and the missing property is a quality-weighted average.
- A state with $v=v_f$ is saturated liquid; $v>v_g$ is vapor; $T<T_{sat}$ or $P>P_{sat}$ indicates liquid/compressed liquid.
