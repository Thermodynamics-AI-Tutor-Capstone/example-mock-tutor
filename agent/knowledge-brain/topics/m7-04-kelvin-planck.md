---
id: topic:m7-04-kelvin-planck
kind: topic
title: M7.4 — Kelvin Planck
description: Covers the Kelvin-Planck statement, the required heat rejection in a cycle, reversible-cycle
  efficiency limits, and the thermodynamic temperature scale. Open when students ask why a heat engine
  cannot convert all heat to work.
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.4
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: State the Kelvin-Planck statement and explain why a cyclic heat engine must reject heat to a low-temperature
    reservoir.
  kc_type: principle
  bloom: understand
- id: '#o2'
  text: Explain why reversible cycles have the maximum thermal efficiency and why all reversible heat
    engines between the same reservoirs have the same efficiency.
  kc_type: principle
  bloom: understand
- id: '#o3'
  text: Use eta_th = 1 - Q_L/Q_H and the reversible relation T_L/T_H = Q_L/Q_H to calculate maximum efficiency
    or a temperature ratio.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Distinguish a reversible cycle from a cycle that only returns the system to its original state.
  kc_type: principle
  bloom: analyze
equations:
- eq:carnot-efficiency
- eq:reversible-heat-temperature-ratio
- eq:thermal-efficiency
misconceptions:
- misc:m02-entropy-and-the-second-law
- misc:m09-friction-is-the-only-efficiency-limit
examples: []
items:
- item:exam2-2021-i-1
- item:exam2-2022-i-1
- item:exam2-2023-i-1
- item:hw07-4
- item:hw07-6
sources:
- path: lectures/Module7_4_KelvinPlanck_annotated.pdf
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

# M7.4 — Kelvin Planck

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture explains the Kelvin-Planck statement and its consequences: a cyclically operating engine cannot exchange heat with a single reservoir and produce equivalent work; it must reject heat. The lecture then connects this to irreversibilities, reversible cycles, maximum thermal efficiency, and an absolute temperature scale.

## Key ideas
- The Kelvin-Planck statement: It is impossible to construct a cyclically-operating device for which the effect is the exchange of heat from a single reservoir and creation of equivalent amount of work (p. 2).
- Work is valuable; friction converts work to heat, while continuous heat-to-work conversion requires a cycle with finite $Q_L$ rejection and $Q_H > W_{net}$ (p. 3).
- Maximize $\eta_{th}$ by reducing irreversibilities/loss mechanisms; a reversible cycle has the highest $\eta_{th}$ (p. 3).
- All reversible heat engines have the same $\eta_{th}$ when operated between the same $T_H$ and $T_L$ (p. 3).
- These ideas enable creation of an absolute temperature scale (p. 3).
- A cycle returns the system to its original state; if all processes in the cycle are reversible, the system and its surroundings return to their original state, which minimizes $\Phi$ (p. 4).
- Thermal efficiency definition and reversible limit: $\eta_{th}=1-Q_L/Q_H$; for a reversible cycle, $\eta_{th,rev}=1-T_L/T_H$ and $T_L/T_H=Q_L/Q_H$ (p. 5).

## Notation used
- $\eta_{th}$: thermal efficiency (p. 5)
- $Q_H$: heat transfer from the high-temperature reservoir; $Q_L$: heat rejected to the low-temperature reservoir (pp. 2, 5)
- $T_H, T_L$: high- and low-temperature reservoir temperatures (p. 5)
- $\Phi$: entropy generation, written $S_{gen}$ on this slide (p. 4)

## What students get wrong here
- A cycle is not automatically reversible just because the system returns to its original state. Reversibility requires that both the system and surroundings return; this minimizes entropy generation (p. 4).
- In a cycle, not all of the added heat can become net work. The Kelvin-Planck statement requires finite $Q_L$, so $Q_H > W_{net}$ (p. 3).
- Heat-engine efficiency is not arbitrary. Reversible engines between the same reservoirs have the same maximum efficiency, so an irreversible engine between those reservoirs cannot exceed it (pp. 3, 5).
