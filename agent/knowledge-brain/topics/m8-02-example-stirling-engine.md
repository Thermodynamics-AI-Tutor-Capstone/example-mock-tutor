---
id: topic:m8-02-example-stirling-engine
kind: topic
title: M8.2 — Example Stirling Engine
description: 'Worked example of an ideal-gas Stirling cycle: setting up the state table, computing isothermal
  boundary work, using the first law to get heat, and writing the cycle thermal efficiency.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.2
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify the four processes and state properties of the Stirling cycle from the P-\mathcal{V}
    diagram.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Students can set up the state table using \(T_L\), \(T_H\), \(\mathcal{V}_1\), \(\mathcal{V}_2\),
    and the ideal-gas relation.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can compute isothermal boundary work for an ideal gas by integrating \(P\,d\mathcal{V}\).
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can apply the first law with negligible kinetic and potential energy to find heat transfer
    from work and internal energy change.
  kc_type: skill
  bloom: apply
- id: '#o5'
  text: Students can select the correct cycle thermal efficiency expression using net work and total heat
    input.
  kc_type: fact
  bloom: understand
equations:
- eq:ideal-gas-equation-of-state
- eq:ideal-gas-internal-energy-change
- eq:reduced-closed-system-energy-balance
- eq:thermal-efficiency
misconceptions: []
examples:
- ex:m8-02-example-stirling-engine
items: []
sources:
- path: lectures/Module8_2_Example_StirlingEngine_annotated.pdf
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

# M8.2 — Example Stirling Engine

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture works an example Stirling-cycle heat engine: identify the states, fill the ideal-gas state table, compute work and heat, and use the cycle efficiency definition.

## Key ideas
- The cycle is 1-2 isothermal compression at \(T_L\), 2-3 constant-volume heat addition, 3-4 isothermal expansion at \(T_H\), and 4-1 constant-volume heat rejection (p. 2).
- The P–\(\mathcal{V}\) diagram has two isotherms \(T_L\) and \(T_H\) and two constant-volume lines \(\mathcal{V}_2\) and \(\mathcal{V}_1\); the enclosed area is \(W_{\mathrm{net}}\) (p. 2).
- With an ideal gas, pressure at each state is \(P = MRT/\mathcal{V}\); the state table fills from \(T_L,T_H,\mathcal{V}_1,\mathcal{V}_2\) (p. 2).
- For the isothermal ideal-gas processes, integration gives \({}_1W_2 = MRT_1\ln(\mathcal{V}_2/\mathcal{V}_1)\) and \({}_3W_4 = MRT_3\ln(\mathcal{V}_1/\mathcal{V}_2)\) (p. 4).
- With \(\Delta KE=\Delta PE=0\), the first law is \(\Delta U = {}_1Q_2 - {}_1W_2\), so \({}_1Q_2=\Delta U + {}_1W_2\) (p. 4).
- For an ideal gas with constant \(c_v\), \(\Delta U = M\Delta u = Mc_v\Delta T\) (p. 4).
- The marked clicker answer C gives \(\eta_{\mathrm{th}} = W_{\mathrm{net}}/Q_{\mathrm{in}}\) as \(({}_1W_2+{}_3W_4)/({}_2Q_3+{}_3Q_4)\) (p. 3).

## Notation used
- \(\mathcal{V}\): total volume (the slide writes script V) (p. 2, p. 4).
- \(M\): mass (p. 2).
- \(T_L, T_H\): low and high temperatures in the cycle (p. 2).
- \({}_1W_2, {}_1Q_2\), etc.: process work and heat with initial and final states (p. 3, p. 4).
- \(c_v\): constant-volume specific heat (p. 4).

## Examples in this lecture
- Stirling cycle example: states 1–4 are defined by \(T_L, T_H, \mathcal{V}_1, \mathcal{V}_2\); the example demonstrates the state table, isothermal boundary work, first-law heat transfer, and the efficiency expression (p. 2–4).

## What students get wrong here
- In the clicker question, options A and B use only one work or one heat term; the annotated correct answer C shows that the numerator is the sum of the two boundary-work terms and the denominator is the sum of the two heat additions, not just a single labeled heat-input process (p. 3).
