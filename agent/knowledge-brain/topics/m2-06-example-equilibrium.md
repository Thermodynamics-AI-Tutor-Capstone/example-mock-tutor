---
id: topic:m2-06-example-equilibrium
kind: topic
title: M2.6 — Example Equilibrium
description: Worked example estimating piston speed in a large ship engine and using the sound-speed comparison
  to judge whether the quasi-equilibrium assumption is reasonable for compression.
parent: unit:m2-properties-states-and-processes
unit: unit:m2-properties-states-and-processes
lecture: M2.6
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can compute the average piston speed from engine speed and stroke length for the ship
    engine example.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can compare the computed piston speed with the sound speed shown in the lecture.
  kc_type: skill
  bloom: analyze
- id: '#o3'
  text: Students can evaluate whether the quasi-equilibrium assumption is reasonable for this compression
    example using the speed comparison.
  kc_type: principle
  bloom: evaluate
equations: []
misconceptions: []
examples:
- ex:m2-06-example-equilibrium
items:
- item:hw02-3a-3d
sources:
- path: lectures/Module2_6_Example_Equilibrium_annotated.pdf
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

# M2.6 — Example Equilibrium

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This deck is a single worked example on the quasi-equilibrium assumption. It uses a large ship-engine compression process, computes an average piston speed, and poses a yes/no question: whether quasi-equilibrium is reasonable for this compression. The final slide supplies the sound-speed and piston-speed values for that comparison.

## Key ideas

- The example hardware is a large low-speed marine diesel engine shown on a heavy-haul trailer; the slide annotation gives an approximate engine speed of \(1000\ \text{RPM}\) (p. 2).
- The worked calculation begins with \(600\ \text{RPM}=10\ \text{RPS}\), so \(t_{\text{cycle}}=1/10\ \text{s}\) (p. 3).
- The stroke time is written as \(t_{\text{stroke}}=1/20\ \text{s}\) (p. 3).
- A stroke length \(L=1\ \text{m}\) is assumed, and the average piston speed is computed as \(v_{ave}=1/(1/20)=20\ \text{m/s}\) (p. 3).
- The central question is posed directly: "Is the quasi-equilibrium assumption reasonable for this compression?" with choices Yes or No (p. 4).
- On the last slide, the deck presents \(P_2>P_1\), \(c=340\ \text{m/s}\), and \(V=20\ \text{m/s}\) (p. 5). This indicates the comparison used to judge quasi-equilibrium is piston speed versus sound speed.

## Notation used

- \(t_{\text{cycle}}\): cycle time (p. 3).
- \(t_{\text{stroke}}\): stroke time (p. 3).
- \(L\): stroke length (p. 3).
- \(v_{ave}\): average piston speed computed from stroke length and stroke time (p. 3).
- \(P_1\), \(P_2\): pressures at the start and end of compression; \(P_2>P_1\) (p. 5).
- \(V\): piston speed shown in the sound-speed comparison (p. 5).
- \(c\): sound speed, given as 340 m/s (p. 5).

## Examples in this lecture

- Example problem: assess whether the quasi-equilibrium assumption is reasonable for the compression stroke in the ship engine. The slides demonstrate converting RPM to cycle/stroke time, computing an average piston speed from a stroke length, and comparing that speed with the sound speed.
