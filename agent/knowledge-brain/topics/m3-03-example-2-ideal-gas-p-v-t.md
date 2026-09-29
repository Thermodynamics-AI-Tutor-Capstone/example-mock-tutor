---
id: topic:m3-03-example-2-ideal-gas-p-v-t
kind: topic
title: M3.3 — Example 2 Ideal Gas P-v-T
description: Worked example comparing helium and argon pressures at equal volume, temperature, and mass,
  using both mole and mass forms of the ideal-gas equation.
parent: unit:m3-ideal-and-nonideal-gases
unit: unit:m3-ideal-and-nonideal-gases
lecture: M3.3
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can apply the ideal-gas equation in mole form to compare gas pressures at equal volume
    and temperature.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can compute moles from mass and molar mass and compute a gas-specific constant from the
    universal gas constant.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can explain why the lower-molar-mass gas has the higher pressure for equal mass.
  kc_type: principle
  bloom: understand
equations:
- eq:gas-specific-constant-from-universal
- eq:ideal-gas-equation-of-state
misconceptions: []
examples:
- ex:m3-03-example-2-ideal-gas-p-v-t
items:
- item:exam1-2021-i-1
- item:hw03-5
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

# M3.3 — Example 2 Ideal Gas P-v-T

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This worked example takes two ideal gases, helium and argon, in equal-volume containers at the same temperature and with equal mass, and asks which gas has the higher pressure (p. 2). The solution compares the mole form and the mass form of the ideal-gas equation and shows they give the same result (p. 4-5).

## Key ideas
- The given equalities are $T_{He}=T_{Ar}$, $\mathcal{V}_{He}=\mathcal{V}_{Ar}$, and $M_{He}=M_{Ar}$ (p. 2).
- Using the mole form $P\mathcal{V}=N R_u T$ gives $P=N R_u T/\mathcal{V}$. At fixed $T$ and $\mathcal{V}$, pressure is proportional to moles $N$ (p. 4).
- Moles are calculated from $N=M/\mathcal{M}$. For equal masses, the lower-molar-mass gas has more moles. The slide computes $N_{Ar}=0.25$ kmol and $N_{He}=2.5$ kmol, giving $P_{He}=10P_{Ar}$ (p. 4).
- The mass form $P\mathcal{V}=M R T$ gives $P=M R T/\mathcal{V}$. At fixed $M$ and $T$, the gas with the larger gas-specific constant $R$ has the higher pressure (p. 5).
- The gas-specific constant is $R=R_u/\mathcal{M}$. Helium has $R_{He}=2080$ J/(kg-K) and argon has $R_{Ar}=208$ J/(kg-K), so helium has the higher pressure (p. 5).
- Both methods select answer (a) Helium (p. 4-5).

## Notation used
- $P$ is pressure, $\mathcal{V}$ is total volume (the slide writes $V$), and $T$ is absolute temperature.
- $N$ is moles, $M$ is mass, and $\mathcal{M}$ is molar mass.
- $R_u=8.314$ J/(mol-K) is the universal gas constant; $R$ is the gas-specific constant.
Notation appears on pages 2, 4, and 5.

## Examples in this lecture
- Problem: Two equal-volume containers at the same temperature hold equal masses of helium and argon; determine which has higher pressure. This illustrates switching between mole and mass forms of the ideal-gas equation and the role of molar mass.

## What students get wrong here
- The problem statement says 10 grams, but the handwritten numerical work uses 10 kg. The mole counts change, but the pressure ratio $P_{He}=10P_{Ar}$ is unaffected because both gases use the same mass (transcriber note, p. 4).
