---
id: topic:m5-05-example-1-energy-conservation
kind: topic
title: M5.5 — Example 1 Energy Conservation
description: 'Worked first-law example: air in a closed piston-cylinder rejects 25 kJ and is compressed
  at constant 350 kPa; find ΔU from Q and ∫P dV. Open for a first-law moving-boundary-work example.'
parent: unit:m5-energy-heat-work-closed-systems
unit: unit:m5-energy-heat-work-closed-systems
lecture: M5.5
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can apply the closed-system energy balance to find ΔU from heat and boundary work when
    kinetic and potential energy changes are negligible.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can evaluate moving boundary work for a quasi-equilibrium constant-pressure process.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can check which idealizations are appropriate before using ΔU=Q−W and ∫P dV.
  kc_type: skill
  bloom: analyze
equations:
- eq:boundary-work-integral
- eq:isobaric-boundary-work
- eq:reduced-closed-system-energy-balance
misconceptions: []
examples:
- ex:ee03-energy-conservation-with-phase-change-in-a-piston
- ex:m5-05-example-1-energy-conservation
items:
- item:exam1-2021-ii-1
- item:exam1-2021-ii-2
- item:exam1-2023-i-3
sources:
- path: lectures/Module5_5_Example1_EnergyConservation_annotated.pdf
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

# M5.5 — Example 1 Energy Conservation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This four-slide worked example solves a first-law problem for a closed piston-cylinder system. Air rejects 25 kJ as heat while the volume decreases from 0.15 m³ to 0.05 m³ in a reversible, constant-pressure process at 350 kPa (p. 2). The goal is to determine the change in energy of the air, which reduces to ΔU because kinetic and potential energy changes are neglected (p. 2). The solution combines the closed-system energy balance with constant-pressure boundary work (p. 4).

## Key ideas
- The system is a closed piston-cylinder filled with air, so mass is constant; the problem gives the heat interaction as ${}_1Q_2 = -25000$ J and total volumes $\mathcal{V}_1 = 0.15$ m³, $\mathcal{V}_2 = 0.05$ m³ at constant $P = 350000$ Pa (p. 2).
- The handwritten setup records assumptions: ideal gas, quasi-equilibrium, and $\Delta KE = \Delta PE = 0$ (p. 2). Slide 3 asks which assumption is NOT appropriate; no option is marked in the transcript, so the deck treats them all as appropriate for this example (p. 3).
- With negligible kinetic and potential energy, $\Delta E = \Delta U$, so the first law becomes $\Delta U = {}_1Q_2 - {}_1W_2$ (p. 4).
- Because the process is quasi-equilibrium and constant pressure, moving boundary work is ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V} = P(\mathcal{V}_2 - \mathcal{V}_1)$ (p. 4).
- Substitution gives ${}_1W_2 = 350000(0.05 - 0.15) = -35000$ J, and $\Delta U = -25000 - (-35000) = 10000$ J (p. 4).

## Notation used
- $\mathcal{V}$: total volume. The slide writes $V$ and notes "script V = total volume" (p. 2).
- ${}_1Q_2$: heat transfer between states 1 and 2, negative for heat rejection from the air (p. 2).
- ${}_1W_2$: work transfer between states 1 and 2, here moving boundary work; negative for compression in this sign convention (p. 4).

## Examples in this lecture
- Closed piston-cylinder air rejects 25 kJ during a constant-pressure compression from 0.15 m³ to 0.05 m³; demonstrates evaluating $\Delta U$ from the first law with $P\,d\mathcal{V}$ boundary work.
