---
id: ex:m3-03-example-2-ideal-gas-p-v-t
kind: example
title: 'Ideal gas P-v-T: equal-mass He vs Ar pressure comparison'
description: 'Worked slide example: two equal-volume, equal-temperature containers hold equal masses of
  He and Ar; use the ideal-gas equation of state to decide which has higher pressure.'
parent: topic:m3-03-example-2-ideal-gas-p-v-t
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.6
topics:
- topic:m3-03-example-2-ideal-gas-p-v-t
misconceptions: []
sources:
- path: lectures/Module3_3_Example2_IdealGasPvT_annotated.pdf
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

# Ideal gas P-v-T: equal-mass He vs Ar pressure comparison

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Two containers have the same volume and are at the same temperature. One contains 10 grams of helium; the other contains 10 grams of argon. Molecular weights: Ar = 40 kg/kmol, He = 4 kg/kmol. Which container has the higher pressure? (Page 2)

## Given

- $T_{He}=T_{Ar}$ and $\mathcal{V}_{He}=\mathcal{V}_{Ar}$ (Page 2)
- $m_{He}=m_{Ar}=10\ \text{g}$ as stated; the annotated calculation writes 10 kg (Page 2, Page 4)
- $\mathcal{M}_{Ar}=40\ \text{kg/kmol}$, $\mathcal{M}_{He}=4\ \text{kg/kmol}$ (Page 2)
- $R_u = 8.314\ \mathrm{J/(mol{\cdot}K)}$ (Page 4)

## Find

- Which container has higher pressure: helium or argon? (Page 3)
- The pressure ratio $P_{He}/P_{Ar}$ (Page 4)

## Assume

- Both gases behave as ideal gases, so $P\mathcal{V}=N R_u T$ applies (Page 4).

## Sketch

Two containers are compared side-by-side; no detailed system-boundary sketch is shown. The instructor writes equal volumes and temperatures as $\mathcal{V}_{He}=\mathcal{V}_{Ar}$ and $T_{He}=T_{Ar}$ (Page 2).

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Use the ideal-gas law in molar form: $P\mathcal{V}=N R_u T$, where $N$ is number of moles and $R_u=8.314\ \mathrm{J/(mol{\cdot}K)}$ (Page 4). With $\mathcal{V}_{He}=\mathcal{V}_{Ar}$ and $T_{He}=T_{Ar}$, pressure is proportional to moles: $P \propto N$ (Page 4).
2. Find moles from $N=m/\mathcal{M}$. The annotated solution carries 10 kg: $N_{Ar}=10/40=0.25\ \text{kmol}$ and $N_{He}=10/4=2.5\ \text{kmol}$ (Page 4). If the stated 10 g is used, the values are 0.25 mol and 2.5 mol; the ratio is unchanged (Page 4 note).
3. Compare the mole numbers: $N_{He}/N_{Ar}=2.5/0.25=10$, so at equal $\mathcal{V}$ and $T$, $P_{He}=10 P_{Ar}$ (Page 4).
4. As a second method, use the mass form $P\mathcal{V}=m R T$, with $R=R_u/\mathcal{M}$. For equal $m$, $T$, and $\mathcal{V}$, pressure is proportional to the specific gas constant: $P \propto R$ (Page 5).
5. Evaluate the specific gas constants: $R_{Ar}=R_u/\mathcal{M}_{Ar}=208\ \mathrm{J/(kg{\cdot}K)}$ and $R_{He}=R_u/\mathcal{M}_{He}=2080\ \mathrm{J/(kg{\cdot}K)}$ (Page 5).
6. Because $R_{He}>R_{Ar}$, $P_{He}>P_{Ar}$, so the answer is a) Helium (Page 5).

## Answer

- Container with higher pressure: Helium
- $Pressure ratio $P_{He}/P_{Ar}$: 10 dimensionless

## What the instructor emphasises

- For fixed volume and temperature, the ideal gas with the smaller molar mass gives more moles for the same mass, so it exerts the higher pressure (Page 4).
- The ideal-gas equation can be written in molar form $P\mathcal{V}=N R_u T$ or mass form $P\mathcal{V}=m R T$; both lead to the same comparison (Pages 4-5).
- In mass form, with equal $m$, $T$, and $\mathcal{V}$, the gas with the larger specific gas constant $R=R_u/\mathcal{M}$ has the higher pressure (Page 5).
- The annotated solution uses 10 kg although the problem statement says 10 g; the pressure ratio is unaffected (Page 4 note).
