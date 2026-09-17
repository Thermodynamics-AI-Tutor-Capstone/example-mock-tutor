---
id: unit:u5-entropy-and-isentropic-processes
kind: unit
title: 'Unit 5 — Entropy, isentropic processes, and device efficiencies'
description: >-
  Lectures 36–44, Exam 5. Carnot cycle and efficiency, the definition of entropy, entropy
  balances, T-s and isentropic relations, polytropic processes, isentropic efficiencies.
  Turns & Pauley 6.3b–7.5b.
parent: course:me300
unit: unit:u5-entropy-and-isentropic-processes
status: reviewed
audience: both
priority: 0.9
prerequisites:
  - unit:u4-control-volumes-and-second-law
precedes: []
objectives: []
equations: []
symbols: []
misconceptions:
  - misc:m02-entropy-and-the-second-law
  - misc:m08-entropy-is-only-disorder
  - misc:m10-entropy-of-an-isolated-system
  - misc:m09-friction-is-the-only-efficiency-limit
examples: []
items: []
sources:
  - url: https://www.me.psu.edu/assets/docs/sample-syllabus/ME-300.pdf
    title: ME 300 sample syllabus, "Anticipated Class Lecture Schedule", lectures 36–44
    retrieved: '2026-09-17'
generated: null
---

# Unit 5 — Entropy, isentropic processes, and device efficiencies

> Lecture rows, titles and readings below are **transcribed** from the published sample
> syllabus. The framing paragraphs are **authored by this project and not checked by an
> ME 300 instructor.**

Nine lectures, ending in **Exam 5** — the last item on the schedule. This unit contains the
single most misunderstood concept in the subject. The ASEE systematic review puts
"misunderstandings related to entropy and its implications with the 2nd law" as one of the
three *primary* (robust) misconceptions in thermodynamics, meaning it survives ordinary
instruction and needs deliberate conceptual-change work rather than another derivation.

The unit is also where the course finally closes the loop on Unit 4's devices: isentropic
efficiency compares a real turbine or pump against the reversible one it could have been.

## Lecture rows

| Lecture | Topic | Turns & Pauley |
|---|---|---|
| 36 | Carnot cycle & Carnot efficiency; definition of entropy | 6.3b-7.1 |
| 37 | Entropy-based statement of 2nd law, entropy balances, other 2nd-law statements | 7.2 |
| 38 | Examples | — |
| 39 | 2nd law property relationships | 7.2b, 7.2c |
| 40 | T-s relationships for ideal gases, isentropic relationships | 7.2c |
| 41 | Examples | — |
| 42 | Isentropic & polytropic processes, T-s & P-v diagrams; HW 5 submission | 7.4a-e |
| 43 | Isentropic efficiencies of turbines/pumps | 7.5a-b |
| 44 | **Exam 5** | — |

## What a student should be able to do by Exam 5

- Compute Carnot efficiency $\eta_{th,\text{Carnot}} = 1 - T_L/T_H$ **with absolute
  temperatures**, and say what it is: a ceiling no device beats, not a prediction of any real
  device's performance.
- Write an entropy balance and identify the three parts — entropy in/out with heat
  ($\int \delta Q / T$), entropy carried by mass flow, and entropy **generated**
  ($S_{gen} \ge 0$, zero only for a reversible process, never negative).
- Say the entropy-based statement of the second law and what makes it stronger than
  Kelvin-Planck: it gives a directional test for any process, not only for cycles.
- Use the $T\,ds$ relations, and the ideal-gas entropy-change expressions with constant and
  with variable specific heats.
- Apply the isentropic relations for an ideal gas with constant specific heats
  ($Pv^k = \text{const}$ and its $T$–$P$ and $T$–$v$ forms) and know the constant-specific-heat
  assumption is doing real work there.
- Distinguish isentropic from polytropic: $Pv^n = \text{const}$ for any $n$ is polytropic; only
  $n = k$ **with the process also reversible and adiabatic** is isentropic.
- Compute isentropic efficiency of a turbine ($w_{actual}/w_{isentropic}$) and of a pump or
  compressor (the ratio inverted), and locate both states on a T-s diagram.
- Sketch a process on T-s as well as P-v — the syllabus names T-s diagrams in the SKETCH step.

## What bites students here

- **"Entropy is disorder."** The most durable wrong sentence in thermodynamics. It is a
  metaphor from statistical mechanics that gives a student no way to compute anything and
  actively blocks the balance. See
  [`misc:m08-entropy-is-only-disorder`](../misconceptions/m08-entropy-is-only-disorder.md), and
  the parent [`misc:m02-entropy-and-the-second-law`](../misconceptions/m02-entropy-and-the-second-law.md).
- **"Entropy always increases."** It increases for an *isolated* system (or for the system plus
  its surroundings). The entropy of a system alone falls whenever it is cooled. See
  [`misc:m10-entropy-of-an-isolated-system`](../misconceptions/m10-entropy-of-an-isolated-system.md).
- **Adiabatic read as isentropic.** Adiabatic *and reversible* is isentropic; adiabatic alone is
  not. A throttle is the counterexample the course already gave them in Unit 4.
- **Carnot efficiency computed in °C.** Silent, plausible, and wrong.
- **Isentropic efficiency inverted** between turbines and compressors.

## What is not here yet

No topic, equation or worked-example cards exist for this unit — the course-file corpus is
empty. Everything above is the framing a project human wrote from the schedule and the
misconception literature, not from ME 300's own lecture notes.
