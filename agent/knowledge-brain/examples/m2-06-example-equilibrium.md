---
id: ex:m2-06-example-equilibrium
kind: example
title: Quasi-equilibrium check for a marine diesel compression
description: Estimate average piston speed in a large marine diesel compression and decide whether the
  quasi-equilibrium assumption is reasonable.
parent: topic:m2-06-example-equilibrium
unit: unit:m2-properties-states-and-processes
status: auto
audience: both
priority: 0.6
topics:
- topic:m2-06-example-equilibrium
misconceptions: []
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

# Quasi-equilibrium check for a marine diesel compression

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A large low-speed marine diesel engine operates at about $600\ \text{RPM}=10\ \text{RPS}$, so the cycle time is $1/10\ \text{s}$ and the compression stroke time is $1/20\ \text{s}$ (Page 3). For a stroke length $L=1\ \text{m}$, is the quasi-equilibrium assumption reasonable for this compression, where $P_2>P_1$ (Page 5)?

## Given

- Engine speed: $600\ \text{RPM}=10\ \text{RPS}$ (Page 3).
- Cycle time: $t_{\text{cycle}}=\frac{1}{10}\ \text{s}$ (Page 3).
- Compression stroke time: $t_{\text{stroke}}=\frac{1}{20}\ \text{s}$ (Page 3).
- Stroke length: $L=1\ \text{m}$ (Page 3).
- Average piston speed: $v_{\text{ave}}=\frac{L}{t_{\text{stroke}}}=20\ \text{m/s}$ (Page 3).
- Sound speed: $c=340\ \text{m/s}$ (Page 5).
- Compression pressure change: $P_2>P_1$ (Page 5).

## Find

- Is the quasi-equilibrium assumption reasonable for this compression? Answer yes or no (Page 4).

## Assume

- The compression stroke occupies half of one engine cycle, so $t_{\text{stroke}}=\frac{1}{2}t_{\text{cycle}}=\frac{1}{20}\ \text{s}$ (Page 3).
- The relevant signal speed for comparison is the sound speed $c=340\ \text{m/s}$ (Page 5).

## Sketch

The slides show a large marine diesel engine on a heavy-haul trailer with annotations identifying the engine and crank (Page 2), followed by a speed calculation and a multiple-choice question slide asking whether quasi-equilibrium is reasonable (Page 4).

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Convert engine speed to cycles per second: $600\ \text{RPM}=10\ \text{RPS}$, so $t_{\text{cycle}}=\frac{1}{10}\ \text{s}=0.1\ \text{s}$ (Page 3).
2. Identify the compression stroke time: $t_{\text{stroke}}=\frac{1}{20}\ \text{s}=0.05\ \text{s}$ (Page 3).
3. Compute the average piston speed: $v_{\text{ave}}=\frac{L}{t_{\text{stroke}}}=\frac{1\ \text{m}}{1/20\ \text{s}}=20\ \text{m/s}$ (Page 3).
4. Compare the piston speed to the sound speed: $v_{\text{ave}}=20\ \text{m/s}$ and $c=340\ \text{m/s}$ (Page 5). Since $20\ \text{m/s}$ is much smaller than $340\ \text{m/s}$, the process is slow relative to the sound speed, so the quasi-equilibrium assumption is reasonable (Page 5).
5. Answer: Yes, the quasi-equilibrium assumption is reasonable for this compression (Page 4).

## Answer

- Average piston speed: 20 m/s
- Quasi-equilibrium assumption reasonable?: Yes

## What the instructor emphasises

- The instructor converts engine RPM into cycle time and then into stroke time before computing piston speed (Page 3).
- The quasi-equilibrium assumption is checked by comparing the average piston speed, $20\ \text{m/s}$, to the sound speed, $340\ \text{m/s}$ (Page 5).
- A piston speed much smaller than the sound speed supports treating the compression as quasi-equilibrium.
