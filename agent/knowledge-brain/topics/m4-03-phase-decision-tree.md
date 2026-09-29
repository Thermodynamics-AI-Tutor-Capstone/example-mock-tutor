---
id: topic:m4-03-phase-decision-tree
kind: topic
title: M4.3 — Phase Decision Tree
description: Decision trees for determining whether a pure substance is compressed liquid, saturated mixture,
  or superheated vapor from P–T, P–v, or T–v data using saturation tables; open when a student asks which
  table to use or how to decide phase.
parent: unit:m4-phase-change-and-property-tables
unit: unit:m4-phase-change-and-property-tables
lecture: M4.3
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Given P and T for a pure substance, students can apply the P–T decision tree to identify the appropriate
    table.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Given P and v, or T and v, students can identify a saturated liquid-vapor mixture and calculate
    quality x.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can explain why T and P are not independent properties for a saturated mixture.
  kc_type: principle
  bloom: understand
- id: '#o4'
  text: Students can choose the correct table among D.1, D.2, D.3V, and D.4 based on the state of a pure
    substance.
  kc_type: skill
  bloom: apply
equations:
- eq:quality-from-specific-volume
- eq:saturation-pressure-two-phase-mixture
- eq:saturation-temperature-two-phase-mixture
misconceptions: []
examples:
- ex:ee02-explained-example-2-determining-phase-and-internal
items:
- item:exam1-2021-ii-2
- item:exam1-2022-conflict-i-2
- item:exam1-2022-regular-i-2
- item:exam1-2023-i-2
- item:exam1-2023-ii-2
- item:hw04-3a-3g
- item:hw04-4
- item:hw04-5
- item:hw04-6
sources:
- path: lectures/Module4_3_PhaseDecisionTree_annotated.pdf
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

# M4.3 — Phase Decision Tree

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This deck gives the phase decision trees used in ME 300 for deciding which property table to use. It covers three starting pairs: $P$ and $T$ (p. 2), $P$ and $v$ (p. 3), and $T$ and $v$ (p. 4). The trees route states to saturation, liquid, vapor, or supercritical tables.

## Key ideas

- For fixed $P$, go to saturation table D.2 and compare $T$ with $T_{\text{sat}}$. If $T = T_{\text{sat}}$, the state is on a saturation line, and $T$ and $P$ are not independent (p. 2).
- The $P$–$T$ tree checks whether $P > P_{\text{crit}}$; the slide branches to D.4 liquid and D.3V supercritical in that region. Below the critical pressure, $T > T_{\text{sat}}$ indicates vapor/steam tables and $T < T_{\text{sat}}$ indicates liquid/liquid tables (p. 2).
- For a known specific volume, go to the saturation table and test $v_f < v < v_g$. Inside that interval the state is a liquid+vapor mixture, so calculate quality; the slide also records $T = T_{\text{sat}}$ (p. 3) and $P = P_{\text{sat}}$ (p. 4).
- The handwritten annotations extend the $P$–$v$ tree to $P$ with $u$, $h$, or $s$ (p. 3), and the $T$–$v$ tree to $T$ with $u$, $h$, or $s$ (p. 4).
- The $T$–$v$ diagrams show the saturation dome and the $v_f$ and $v_g$ boundaries used in the tests (p. 3–4).

## Notation used

- $P$, $T$: pressure and temperature.
- $P_{\text{sat}}$, $T_{\text{sat}}$: saturation pressure and temperature.
- $P_{\text{crit}}$, $T_{\text{crit}}$: critical pressure and temperature.
- $v$, $v_f$, $v_g$: specific volume, saturated-liquid specific volume, saturated-vapor specific volume.
- $x$: quality (the handwritten slide writes $X$; course notation uses lowercase $x$).
- Table labels: D.1, D.2, D.3V, D.4.

## What students get wrong here

- The slide adds the note "$T, P$ are not independent" at the $T = T_{\text{sat}}$ branch: on a saturation line, knowing both $P$ and $T$ does not specify how much liquid or vapor is present; another property is required (p. 2).
