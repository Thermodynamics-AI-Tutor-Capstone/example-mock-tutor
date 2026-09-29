---
id: topic:m7-12-isentropic-relations
kind: topic
title: M7.12 — Isentropic Relations
description: Introduces the isentropic relations for an ideal gas with constant specific heats, compares
  isentropic and isothermal P-v paths, and locates the isentropic legs of a Carnot cycle.
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.12
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can state the three conditions required before using the boxed isentropic relations.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can derive the isentropic temperature-pressure relation from the ideal-gas entropy change
    with constant c_p and Δs=0.
  kc_type: skill
  bloom: analyze
- id: '#o3'
  text: Students can select and apply the appropriate isentropic T-P, T-v, or P-v relation to relate two
    states.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can compare isentropic and isothermal P-v curves and explain why the isentrope is steeper
    for γ>1.
  kc_type: principle
  bloom: understand
equations:
- eq:ideal-gas-entropy-change-tp
- eq:isentropic-ideal-gas-pressure-volume
- eq:isentropic-ideal-gas-temp-pressure
- eq:isentropic-ideal-gas-temp-volume
misconceptions: []
examples:
- ex:ee07-explained-example-7-isentropic-expansion
items:
- item:exam2-2021-ii-1
- item:exam2-2021-iii-a-e
- item:exam2-2022-ii-1a-1c
- item:exam2-2023-ii-2
- item:hw09-2
sources:
- path: lectures/Module7_12_IsentropicRelations_annotated.pdf
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

# M7.12 — Isentropic Relations

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture derives the power-law isentropic relations for an ideal gas with constant specific heats, states the conditions under which those relations may be used, contrasts isentropic and isothermal $P-v$ paths, and identifies the isentropic legs of a Carnot cycle.

## Key ideas
- An isentropic process is one with $\Delta s = 0$ (p. 2).
- For an ideal gas with constant $c_p$, the entropy change between two states is $\Delta s = c_p \ln\left(\frac{T_2}{T_1}\right) - R \ln\left(\frac{P_2}{P_1}\right)$ (p. 2).
- Setting $\Delta s = 0$ in that expression gives the temperature-pressure relation $T_1^{\gamma} P_1^{1-\gamma} = T_2^{\gamma} P_2^{1-\gamma}$ (p. 2).
- The three boxed working relations are:
  $$T_1^{\gamma} P_1^{1-\gamma} = T_2^{\gamma} P_2^{1-\gamma},$$
  $$T_1 v_1^{\gamma-1} = T_2 v_2^{\gamma-1},$$
  $$P_1 v_1^{\gamma} = P_2 v_2^{\gamma}$$
  (p. 3).
- The boxed relations should be used only for an ideal gas with constant $c_p$ and $c_v$ and $\Delta s = 0$ (p. 3).
- The ratio of specific heats is $\gamma = c_p/c_v > 1$, and $R = c_p - c_v$ (p. 2).
- On a $P-v$ diagram, an isentrope $Pv^{\gamma} = \text{const}$ is steeper than an isotherm $Pv = \text{const}$ because $\gamma > 1$; for air, $\gamma = 1.4$ (p. 4).
- In the Carnot cycle shown on p. 5, processes 1-2 and 3-4 are isothermal heat transfer, while 2-3 and 4-1 are isentropic expansion and compression.

## Notation used
- $\gamma = c_p/c_v$ is the ratio of specific heats; air has $\gamma = 1.4$ (p. 2, p. 4).
- $v$ denotes specific volume; $R = c_p - c_v$ (p. 2).
- Subscripts 1 and 2 denote initial and final states (p. 2).

## What students get wrong here
- Using the boxed isentropic relations without checking all three conditions: ideal gas, constant $c_p$ and $c_v$, and $\Delta s = 0$ (p. 3).
- Confusing the isentropic and isothermal $P-v$ curves. The isentrope has $P \sim 1/v^{\gamma}$ with $\gamma>1$, so it is steeper than the isotherm $P \sim 1/v$ (p. 4).
