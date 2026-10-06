---
id: topic:m4-04-example-phase-decision-tree
kind: topic
title: M4.4 — Example Phase Decision Tree
description: 'Worked examples for the phase decision tree: using steam tables D.1/D.2 to identify phase
  and find P, T, v, h, u, and quality x for water states.'
parent: unit:m4-phase-change-and-property-tables
unit: unit:m4-phase-change-and-property-tables
lecture: M4.4
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can use saturated-water tables to determine the phase of a pure substance from two independent
    properties.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can compute missing properties such as P, T, v, h, and x for saturated mixtures using
    quality relations.
  kc_type: skill
  bloom: apply
equations:
- eq:quality-from-specific-internal-energy
- eq:quality-from-specific-volume
- eq:saturation-pressure-two-phase-mixture
- eq:saturation-temperature-two-phase-mixture
- eq:two-phase-enthalpy-mixing-rule
- eq:two-phase-specific-volume-mixing-rule
misconceptions: []
examples:
- ex:ee02-explained-example-2-determining-phase-and-internal
- ex:m4-04-example-phase-decision-tree
items:
- item:hw04-3a-3g
- item:hw04-6
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

# M4.4 — Example Phase Decision Tree

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This slide deck is a set of six worked examples for the phase-decision tree in Module 4. It shows how to decide whether water is compressed liquid, saturated liquid, saturated mixture, or vapor using the saturated-water tables (D.1/D.2), then use that phase decision to find missing properties (p. 1–10).

## Key ideas
- Use the known saturation property: for a given T or P, look up saturation values such as $v_f$, $v_g$, $u_f$, $u_g$, $h_f$, and $h_g$ before deciding the phase (p. 2, 3, 5, 6, 9).
- If $v_f < v < v_g$ at the given T, the state is a two-phase mixture; pressure is $P_{sat}(T)$, and quality is found from specific volume (p. 2).
- For a saturated mixture, any mixture property is obtained from quality: $h = x h_g + (1-x) h_f$, and $v = x v_g + (1-x) v_f$ (p. 2, 5).
- The same logic applies when internal energy $u$ is given: compare $u$ to $u_f$ and $u_g$, then compute $x = (u-u_f)/(u_g-u_f)$ and use it to find other properties (p. 5).
- If $v = v_f$ at a given P, the phase is saturated liquid and $T = T_{sat}(P)$ (p. 3).
- If $v > v_g$ at the given T, the state is vapor; go to the superheated table for P (p. 6).
- If P and T are both given, compare T with $T_{sat}(P)$, or compare P with $P_{sat}(T)$: $P > P_{sat}(T)$ and $T < T_{sat}(P)$ identify compressed liquid (p. 9).
- The deck includes three phase-identification prompts with options saturated vapor, saturated liquid, vapor, and liquid; no answers are marked, so the phase decision must come from saturation comparisons (p. 4, 7, 10).

## Notation used
- $x$: quality
- $v$, $u$, $h$: specific volume, internal energy, and enthalpy
- $f$ and $g$ subscripts: saturated liquid and saturated vapor values
- $T_{sat}$, $P_{sat}$: saturation temperature and pressure
- D.1 and D.2: saturated-water temperature and pressure tables used in these examples

## Examples in this lecture
- Example 1: Given $T=310$ K and $v=15$ m³/kg, find P and h. Demonstrates a saturated mixture and quality-based enthalpy (p. 2).
- Example 2: Given $P=40$ kPa and $v=0.0010264$ m³/kg, find phase and T. Demonstrates saturated liquid when $v=v_f$ (p. 3).
- Example 3: Given $T=286$ K and $u=100$ kJ/kg, find phase, P, and v. Demonstrates mixture determination from internal energy and quality-based volume (p. 5).
- Example 4: Given $T=500$ K and $v=1.5289$ m³/kg, find phase and P. Demonstrates vapor when $v>v_g$ (p. 6).
- Example 5: Given $P=5$ MPa and $h=117.2$ kJ/kg, find phase and T. No annotation is shown (p. 8).
- Example 6: Given $P=5$ MPa and $T=420$ K, find phase. Demonstrates compressed liquid using $P>P_{sat}$ and $T<T_{sat}$ (p. 9).
