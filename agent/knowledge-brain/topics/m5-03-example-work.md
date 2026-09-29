---
id: topic:m5-03-example-work
kind: topic
title: M5.3 — Example Work
description: 'Work example for a closed piston-cylinder system: open when students need to calculate boundary
  work along isobaric and isothermal paths, draw P–V diagrams, or find net work from a closed cycle.'
parent: unit:m5-energy-heat-work-closed-systems
unit: unit:m5-energy-heat-work-closed-systems
lecture: M5.3
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can calculate boundary work for a constant-pressure closed-system process using $P(\mathcal{V}_2-\mathcal{V}_1)$.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can calculate boundary work for an isothermal ideal-gas process using $M R T \ln(\mathcal{V}_2/\mathcal{V}_1)$.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can interpret the area under a P–V process curve as boundary work and the enclosed clockwise
    area as net work in a cycle.
  kc_type: principle
  bloom: understand
- id: '#o4'
  text: Students can determine the sign and net value of work in a closed multi-process cycle from the
    individual process work terms.
  kc_type: skill
  bloom: analyze
equations:
- eq:ideal-gas-equation-of-state
- eq:isobaric-boundary-work
- eq:isothermal-ideal-gas-boundary-work
- eq:net-cycle-work
misconceptions:
- misc:m11-state-function-vs-path-function
- misc:m13-work-read-off-a-pv-diagram
examples:
- ex:m5-03-example-work
items:
- item:exam1-2021-i-3
- item:exam1-2021-ii-1
- item:exam1-2023-ii-2
- item:exam1-2023-iii
- item:hw05-3
- item:hw05-4
- item:hw05-5
sources:
- path: lectures/Module5_3_Example_Work_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M5.3 — Example Work

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
One worked piston-cylinder example with 1 kg of air expanding from total volume 1 m^3 to 2 m^3. The lecture first treats the expansion as isobaric, then repeats it as isothermal, computes the final state values and boundary work, draws the P–V diagrams, and closes with a four-process cycle showing net work.

## Key ideas
- Problem setup: closed piston-cylinder system, mass $M=1$ kg, $\mathcal{V}_1=1\ \mathrm{m^3}$, $\mathcal{V}_2=2\ \mathrm{m^3}$, $T_1=300\ \mathrm{K}$. The slide assumes ideal gas and notes quasi-steady (p. 2).
- In the isobaric case, $P_2=P_1$. The ideal-gas relation at state 1 gives $P_1 = M R T_1/\mathcal{V}_1 = 86100\ \mathrm{Pa}$ (p. 3).
- For constant pressure, ${}_1W_2 = P(\mathcal{V}_2-\mathcal{V}_1)$, which is the rectangular area under a horizontal P–V curve; the computed work is positive because the system does work on the surroundings, as indicated by the by? annotation with $+$ (p. 3).
- In the isothermal case, $T$ stays at 300 K and $P = M R T/\mathcal{V}$ changes along a hyperbola. The boundary work is ${}_1W_2 = M R T \ln(\mathcal{V}_2/\mathcal{V}_1) = 59679.97\ \mathrm{J}$ for the same endpoints (p. 4).
- Since the isobaric and isothermal expansions have the same initial and final states but different boundary work, work is a path function, not a state function (p. 4).
- The cycle uses isothermal compression, isochoric heat addition, isothermal expansion, and isochoric heat rejection. Isochoric processes give zero boundary work; the net work is the sum of the two isothermal works and is positive. A clockwise cycle is a power cycle (p. 5).

## Notation used
- $\mathcal{V}$: total volume; the slide writes $V$ and the annotation says script V = total volume (p. 3).
- ${}_1W_2$: process work from state 1 to state 2, defined by the P–V area $\int_{\mathcal{V}_1}^{\mathcal{V}_2}P\,d\mathcal{V}$ (p. 3–4).
- Work sign convention in the problem: work done by the system is positive; the compression leg 1-2 of the cycle has negative work (p. 3, 5).

## Examples in this lecture
- Isobaric expansion: given $M$, $\mathcal{V}_1$, $\mathcal{V}_2$, $T_1$, find $P_2$, $T_2$, and ${}_1W_2$; demonstrates ideal-gas state evaluation and constant-pressure boundary work on a P–V diagram (p. 3).
- Isothermal expansion: repeat the same endpoints at constant $T$; demonstrates integration of a variable-pressure path and the path dependence of work (p. 4).
- Four-process cycle: demonstrates signs of process works, zero work for isochoric legs, and net work from the enclosed clockwise area (p. 5).

## What students get wrong here
- Treating boundary work like a property of the endpoints. The same initial and final states give different work for the isobaric and isothermal paths (p. 4).
- Misreading the P–V diagram: work is not the pressure or volume value or slope; it is the area under the process curve, and for a closed cycle it is the area enclosed by the clockwise loop (p. 3–5).
- Overlooking the work sign convention: the annotated on? by? note marks work done by the system positive, which separates expansion work from negative compression work later in the cycle (p. 3, 5).
