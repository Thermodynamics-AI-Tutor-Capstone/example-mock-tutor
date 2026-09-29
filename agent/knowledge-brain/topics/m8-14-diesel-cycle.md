---
id: topic:m8-14-diesel-cycle
kind: topic
title: M8.14 — Diesel Cycle
description: 'Covers the ideal Diesel cycle: four processes, P–v diagram, compression and cutoff ratios,
  thermal-efficiency relation, and an Otto-vs-Diesel comparison.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.14
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can list the four ideal Diesel cycle processes in order and identify each as isentropic,
    isobaric, or isochoric.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can interpret the Diesel P–v diagram and compute compression ratio and cutoff ratio from
    specific volumes.
  kc_type: skill
  bloom: understand
- id: '#o3'
  text: Students can apply the ideal Diesel thermal-efficiency equation in terms of r, α, and γ.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can compare Diesel and Otto cycle thermal efficiency for the same compression ratio.
  kc_type: principle
  bloom: analyze
equations:
- eq:compression-ratio
- eq:cutoff-ratio
- eq:ideal-diesel-cycle-thermal-efficiency
misconceptions: []
examples: []
items:
- item:final-2021-2
- item:hw10-4
sources:
- path: lectures/Module8_14_DieselCycle_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M8.14 — Diesel Cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This deck introduces the ideal Diesel cycle through a labeled engine photo and a P–v diagram. It defines the four cycle processes, gives the compression and cutoff ratios, writes the thermal-efficiency definition and the efficiency relation in terms of $r$, $\alpha$, and $\gamma$, and ends with a comparison against the Otto cycle.

## Key ideas

- The slide marks the Diesel cycle as *Ideal* and labels the four processes: 1→2 isentropic compression; 2→3 isobaric heat addition with $\Delta P=0$; 3→4 isentropic expansion; 4→1 isochoric heat rejection with $\Delta \mathcal{V}=0$ (p. 2).
- On the P–v diagram, 2→3 is the horizontal constant-pressure segment, and 4→1 is the vertical constant-volume drop back to state 1 (p. 3).
- Compression ratio is written as $r = \dfrac{v_1}{v_2}$ (p. 3).
- Cutoff ratio is written as $\alpha = \dfrac{v_3}{v_2}$; the slide also writes $d = v_1 - v_2$ without naming it in the transcript (p. 3).
- Thermal efficiency is defined as net work out over heat in: $\eta_{th} = \dfrac{\bar{W}_{net}}{Q_{in}} = \dfrac{{}_1\bar{W}_2 + {}_2\bar{W}_3 + {}_3\bar{W}_4}{{}_2Q_3}$ (p. 3).
- The ideal Diesel efficiency relation given on the slide is $\eta_{th}=1-\dfrac{1}{r^{\gamma-1}}\left(\dfrac{\alpha^{\gamma}-1}{\gamma(\alpha-1)}\right)$ (p. 3).
- Concept check: for a given compression ratio, the annotated answer is that the Otto cycle has the higher efficiency (p. 4).

## Notation used

- $r$: compression ratio, $v_1/v_2$ (p. 3).
- $\alpha$: cutoff ratio, $v_3/v_2$ (p. 3).
- $d$: written as $v_1-v_2$ on the slide; the transcript does not give it a name (p. 3).
- $\bar{W}_{net}$: appears in the efficiency definition; the overbar is not defined on this slide (p. 3).
- $\gamma$: appears in the efficiency relation; not defined on this slide (p. 3).

## Examples in this lecture

- Concept check: "For a given compression ratio, which cycle has a higher efficiency? A. Otto B. Diesel" (p. 4). The annotation circles A. Otto; the question demonstrates the Otto/Diesel efficiency comparison at the same compression ratio.
