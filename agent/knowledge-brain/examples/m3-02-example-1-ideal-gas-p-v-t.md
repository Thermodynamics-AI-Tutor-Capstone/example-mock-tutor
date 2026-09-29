---
id: ex:m3-02-example-1-ideal-gas-p-v-t
kind: example
title: 'Ideal gas P-v-T: diesel-engine compression inlet pressure'
description: Find the inlet pressure needed to compress air from 289 K to the target diesel fuel-injection
  condition using the ideal gas law and compression ratio.
parent: topic:m3-02-example-1-ideal-gas-p-v-t
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.6
topics:
- topic:m3-02-example-1-ideal-gas-p-v-t
misconceptions: []
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

# Ideal gas P-v-T: diesel-engine compression inlet pressure

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Diesel fuel injection: how would we design a compression from $T_1=289$ K to achieve these conditions? The fuel-injection conditions are Condition 1: $T=900$ K, $P=5.92$ MPa, $\rho=22.8$ kg/m$^3$; Condition 2: $T=900$ K, $P=4.03$ MPa, $\rho=15.2$ kg/m$^3$. The compression ratio is $\mathcal{V}_1/\mathcal{V}_2=11.2$. Find the inlet pressure $P_1$ required to achieve Condition 1.

## Given

- $T_1 = 289$ K
- Compression ratio $\mathcal{V}_1/\mathcal{V}_2 = 11.2$
- Condition 1: $T_2=900$ K, $P_2=5.92$ MPa, $\rho=22.8$ kg/m$^3$
- Condition 2: $T=900$ K, $P=4.03$ MPa, $\rho=15.2$ kg/m$^3$

## Find

- $P_1$

## Assume

- Air is a pure substance
- Simple compressible substance
- Continuum
- Ideal gas

## Sketch

The instructor draws a yellow dashed control volume around the gas above the center piston in a cut-away diesel engine, then sketches BDC and TDC piston-cylinder positions with volumes $\mathcal{V}_1$ and $\mathcal{V}_2$.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Choose a control volume containing only the gas above the piston, since we care only about the cylinder gas (Page 5).
2. Make the assumptions: pure substance, simple compressible substance, continuum, and ideal gas (Page 6).
3. Use the engine compression ratio $\mathcal{V}_1/\mathcal{V}_2 = 11.2$ (Page 7).
4. Write the ideal gas equation $P\mathcal{V}=MRT$. With $M$ and $R$ constant between states 1 and 2, $\frac{P_1\mathcal{V}_1}{T_1}=\frac{P_2\mathcal{V}_2}{T_2}$ (Page 8).
5. Rearrange to $\frac{\mathcal{V}_1}{\mathcal{V}_2}=\frac{P_2 T_1}{P_1 T_2}$, then solve for $P_1$: $P_1=\frac{P_2 T_1}{T_2}\Big/\frac{\mathcal{V}_1}{\mathcal{V}_2}$ (Page 8).
6. Substitute known values: $P_1 = \frac{(5.92 \times 10^6)(289)}{(900)}\cdot \frac{1}{11.2} = 169700$ Pa (Page 8).

## Answer

- $P_1$: 169700 Pa

## What the instructor emphasises

- Choose the control volume to include only the stuff you care about (Page 5).
- The cylinder gas is modeled as pure, simple compressible, continuum, ideal gas (Page 6).
- Use script $\mathcal{V}$ for total volume; compression ratio is total volume ratio, not specific volume (Page 7).
- For a fixed mass of ideal gas with constant $R$, combine the ideal gas law at two states as $P_1\mathcal{V}_1/T_1 = P_2\mathcal{V}_2/T_2$ (Page 8).
