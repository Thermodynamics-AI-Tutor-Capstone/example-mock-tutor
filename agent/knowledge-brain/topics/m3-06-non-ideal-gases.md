---
id: topic:m3-06-non-ideal-gases
kind: topic
title: M3.6 — Non Ideal Gases
description: Covers when the ideal-gas model fails, the van der Waals equation of state, and a methane
  example comparing ideal-gas and van der Waals pressures at high density.
parent: unit:m3-ideal-and-nonideal-gases
unit: unit:m3-ideal-and-nonideal-gases
lecture: M3.6
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can state the two ideal-gas assumptions that break down for non-ideal gases.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can interpret the van der Waals constants a and b in terms of molecular interactions
    and molecular volume.
  kc_type: principle
  bloom: understand
- id: '#o3'
  text: Students can compute the pressure of a non-ideal gas using the van der Waals equation and compare
    it with the ideal-gas prediction.
  kc_type: skill
  bloom: apply
equations:
- eq:ideal-gas-equation-of-state
- eq:van-der-waals-eos
misconceptions: []
examples: []
items:
- item:hw04-2
sources:
- path: lectures/Module3_6_NonIdealGases_annotated.pdf
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

# M3.6 — Non Ideal Gases

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This lecture introduces the departure from ideal-gas behavior and presents the van der Waals equation of state as a correction. The worked example uses methane at $T=300$ K and $\rho=175$ kg/m$^3$ to compare the ideal-gas pressure with the van der Waals pressure.

## Key ideas

- The ideal-gas model is based on two assumptions shown on the slide: the molecular volume is very small compared with the volume between molecules, and there are no intermolecular forces (p. 2).
- Non-ideal behavior is important when density is high and intermolecular forces are significant (p. 2).
- The van der Waals equation corrects the ideal-gas molar relation $P\bar{v}=R_uT$ by adding $a/\bar{v}^2$ to the pressure and subtracting $b$ from the molar volume (p. 3).
- The constant $a$ accounts for intermolecular forces; the constant $b$ accounts for the volume occupied by the molecules (p. 3).
- The example converts $\rho$ to specific volume $v=1/\rho$, then to molar volume $\bar{v}=vM$, before using the van der Waals equation (p. 4).
- For $CH_4$ at the stated conditions, the ideal-gas pressure is $27.2$ MPa, while the van der Waals pressure is $23.7$ MPa (p. 4).

## Notation used

- $P$: pressure; $T$: temperature; $\mathcal{V}$: total volume; $N$: amount in moles.
- $\bar{v}$: molar volume, with units m$^3$/kmol.
- $R_u$: universal gas constant.
- $a$, $b$: van der Waals constants.
- $M$: molar mass; $\rho$: density.

## Examples in this lecture

- Methane at $T=300$ K and $\rho=175$ kg/m$^3$: find pressure from ideal-gas and van der Waals models. Demonstrates conversion between density, specific volume, and molar volume, and insertion of van der Waals constants.
