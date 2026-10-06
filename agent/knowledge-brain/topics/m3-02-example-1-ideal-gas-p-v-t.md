---
id: topic:m3-02-example-1-ideal-gas-p-v-t
kind: topic
title: M3.2 — Example 1 Ideal Gas P-v-T
description: Worked example applying the ideal-gas P-v-T equation and compression ratio to find inlet
  pressure in a diesel compression process; open when students practice ideal-gas P-v-T problems.
parent: unit:m3-ideal-and-nonideal-gases
unit: unit:m3-ideal-and-nonideal-gases
lecture: M3.2
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify the cylinder gas as the relevant control volume and list the modeling assumptions
    used for an ideal-gas P-v-T calculation.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Students can apply the ideal-gas equation of state in total-volume form to relate two states of
    a fixed mass of gas.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can solve for an unknown pressure using the ideal-gas ratio and a given compression ratio.
  kc_type: skill
  bloom: apply
equations:
- eq:fixed-mass-ideal-gas-ratio
- eq:ideal-gas-equation-of-state
misconceptions: []
examples:
- ex:ee01-p-v-t-equation-of-state-isobaric-and-isothermal-co
- ex:m3-02-example-1-ideal-gas-p-v-t
items:
- item:hw03-1
- item:hw03-5
sources:
- path: lectures/Module3_2_Example1_IdealGasPvT_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M3.2 — Example 1 Ideal Gas P-v-T

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture is a worked example using the ideal-gas equation of state. It opens with two diesel fuel-injection conditions at $T = 900$ K: condition 1 has $P = 5.92$ MPa and $\rho = 22.8$ kg/m$^3$, and condition 2 has $P = 4.03$ MPa and $\rho = 15.2$ kg/m$^3$ (p. 3). The posed problem is how to design a compression from $T_1 = 289$ K to achieve these conditions (p. 4). The worked solution targets the condition at $P_2 = 5.92$ MPa and finds inlet pressure $P_1$ using the ideal-gas relation and compression ratio (p. 8).

## Key ideas
- Choose a control volume that isolates the system you care about: the gas above the piston in the cylinder, not the entire engine (p. 5).
- The cylinder gas is modeled as a pure substance, simple compressible substance, continuum, and ideal gas; the slide selects all of the above (p. 6).
- Compression ratio is defined as the ratio of total volumes at BDC and TDC, $\mathcal{V}_1/\mathcal{V}_2$, and is $11.2$ for this engine (p. 7).
- For fixed mass $M$ and constant gas constant $R$, the ideal-gas equation $P\mathcal{V} = MRT$ gives $\frac{P_1\mathcal{V}_1}{T_1} = \frac{P_2\mathcal{V}_2}{T_2}$ (p. 8).
- Rearranging with the known compression ratio, temperatures, and high pressure gives $P_1 = \frac{P_2 T_1}{T_2} / \frac{\mathcal{V}_1}{\mathcal{V}_2}$, leading to the boxed answer $P_1 = 169700$ Pa (p. 8).

## Notation used
- $T$: absolute temperature; $P$: pressure; $\rho$: density (p. 3, 8).
- $M$: mass; $R$: gas constant (p. 8).
- $\mathcal{V}$: total volume; $\mathcal{V}_1/\mathcal{V}_2$: compression ratio (p. 7-8).

## Examples in this lecture
- Diesel compression inlet pressure: given $T_1 = 289$ K, $T_2 = 900$ K, $P_2 = 5.92$ MPa, and $\mathcal{V}_1/\mathcal{V}_2 = 11.2$, find $P_1$. This demonstrates applying the fixed-mass ideal-gas ratio so the unknown mass and gas constant cancel rather than being supplied explicitly (p. 3-8).
