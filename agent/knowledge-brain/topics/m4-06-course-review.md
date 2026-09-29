---
id: topic:m4-06-course-review
kind: topic
title: M4.6 — Course Review
description: 'Open this card when a student needs to recall how ME 300 fits together: defining properties
  and states, and writing the generic conservation balance used later for mass, energy, and entropy.'
parent: unit:m4-phase-change-and-property-tables
unit: unit:m4-phase-change-and-property-tables
lecture: M4.6
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: 'Students can recall the three-layer structure of the course: definitions/assumptions, first law,
    and second law.'
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can classify listed thermodynamic quantities as extensive or intensive.
  kc_type: fact
  bloom: understand
- id: '#o3'
  text: Students can state the simple-compressible-substance state relation and identify the required
    independent intensive properties.
  kc_type: fact
  bloom: remember
- id: '#o4'
  text: Students can write the generic finite-time and instantaneous conservation balances for an extensive
    property X.
  kc_type: skill
  bloom: apply
equations:
- eq:finite-time-conservation-balance
- eq:instantaneous-conservation-balance
- eq:state-postulate-for-simple-compressible-substances
misconceptions: []
examples: []
items: []
sources:
- path: lectures/Module4_6_CourseReview_annotated.pdf
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

# M4.6 — Course Review

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This review slide set is a map of the first part of ME 300. It does not introduce a new device or property relation; instead, it pulls together the conceptual tools used so far: how assumptions let us define macroscopic properties, how those properties define a state, and how a common conservation statement supports later first-law and second-law balances. Open it when a student has lost the thread across multiple topics or needs to see why definitions, state relations, and balance equations are being treated together.

## Key ideas

- The course is structured in three layers: (1) defining properties, states, processes and assumptions; (2) energy conservation, the first law; (3) limits of energy exchange, the second law (p. 2).
- The property tool starts from continuum and equilibrium assumptions. Macroscopic measurable quantities are separated into extensive properties—$M$, $N$, $\mathcal{V}$, $U$—and intensive properties—$T$, $P$, $\rho$, $v$, $u$ (p. 3).
- A state is defined by all its properties. For a simple compressible substance, a property is determined from two independent intensive properties through a state relation (p. 4).
- A generic extensive property $X$ obeys the same finite-time accounting: system change equals net input minus output plus generation (p. 5).
- The instantaneous version of the balance uses rates and the time derivative of $X$ in the system (p. 5).

## Notation used

- $X$: generic extensive property in the conservation balance (p. 5).
- $\mathcal{V}$: total volume, written in script to distinguish it from specific volume $v$ (p. 3).
- $\mathcal{P}$: generic thermodynamic property in the state-relation notation (p. 4).
- $\dot{X}$: time rate of change of $X$ (p. 5).
