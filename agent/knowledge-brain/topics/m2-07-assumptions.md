---
id: topic:m2-07-assumptions
kind: topic
title: M2.7 — Assumptions
description: Introduces the pure-substance and simple-compressible-substance assumptions, then distinguishes
  extensive and intensive properties and defines density; open when a student mixes up extensive/intensive
  properties or asks what a simple-compressible substance is.
parent: unit:m2-properties-states-and-processes
unit: unit:m2-properties-states-and-processes
lecture: M2.7
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Define a pure substance and identify that multiple phases of the same substance are allowed.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: List the effects neglected by the simple-compressible-substance model.
  kc_type: fact
  bloom: understand
- id: '#o3'
  text: Distinguish extensive and intensive properties and predict whether a property is additive when
    two systems are combined.
  kc_type: principle
  bloom: apply
- id: '#o4'
  text: Use \(\rho = M/\mathcal{V}\) to relate density, mass, and total volume.
  kc_type: skill
  bloom: apply
equations:
- eq:mass-specific-volume
misconceptions: []
examples: []
items:
- item:exam1-2022-conflict-ii-1
- item:exam1-2022-regular-ii-1
- item:hw03-4
sources:
- path: lectures/Module2_7_Assumptions_annotated.pdf
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

# M2.7 — Assumptions

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This slide deck introduces the working-fluid assumptions used in ME 300: pure substance, simple compressible substance, and the extensive/intensive property classification. Use this card when a student confuses property types or needs the assumptions behind property models.

## Key ideas

- A property is a quantifiable, macroscopic quantity; a state is specified by all properties together (p. 2).
- A pure substance is homogeneous and has unchanging chemical composition. Multiple phases of the same substance are still a pure substance (p. 2).
- In the simple-compressible-substance model, motion, fluid shear, gravity, and magnetic/electric fields do not change properties (p. 3).
- Extensive properties are a direct function of the extent of the system, cannot be defined at a point, and are additive; the lecture lists \(M, \mathcal{V}, L, N\) (p. 4).
- The ratio of two extensive properties gives an intensive property (p. 4).
- Intensive properties are bulk properties independent of system size, are not additive, and are defined at a point (p. 5).
- Density is the ratio of mass to total volume: \(\rho = M/\mathcal{V}\) (p. 5).

## Notation used

- \(M\): mass.
- \(\mathcal{V}\): total volume; the slide writes this as script V.
- \(L, N\): additional extensive properties listed on the slide; the slide does not define them.
- \(\rho\): density.
- \(T\): temperature, used to illustrate an intensive property.

## What students get wrong here

- A phase change can make a substance look different, but the slide explicitly checks a solid-to-liquid change of the same substance as still a pure substance (p. 2).
- Intensive properties are not additive: combining two boxes at temperature \(T\) gives temperature \(T\), not \(2T\), while volume doubles (p. 5).
