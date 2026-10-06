---
id: ex:m5-05-example-1-energy-conservation
kind: example
title: 'Energy Conservation in an Ideal Gas: Closed Piston-Cylinder'
description: 'Worked example: air in a closed piston-cylinder rejects 25 kJ during constant-pressure compression;
  find $\Delta U$ using the first law and $P\,d\mathcal{V}$ boundary work.'
parent: topic:m5-05-example-1-energy-conservation
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.6
topics:
- topic:m5-05-example-1-energy-conservation
misconceptions:
- misc:m01-heat-energy-temperature-conflated
- misc:m07-work-is-not-energy-transfer
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

# Energy Conservation in an Ideal Gas: Closed Piston-Cylinder

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A closed piston-cylinder system filled with air rejects 25 kJ of energy in a heat-interaction while experiencing a volume change of 0.1 m³ (from 0.15 to 0.05 m³). Assuming a reversible, constant-pressure process at 350 kPa, determine the change in energy of the air inside. (p. 2)

## Given

- Closed piston-cylinder system containing air (p. 2)
- Heat interaction: the air rejects 25 kJ, so ${}_1Q_2 = -25000$ J (p. 2)
- Total volumes: $\mathcal{V}_1 = 0.15$ m$^3$ and $\mathcal{V}_2 = 0.05$ m$^3$ (p. 2)
- Constant pressure: $P = 350$ kPa $= 350000$ Pa (p. 2)
- Reversible process as stated (p. 2)

## Find

- Change in energy of the air, $\Delta E = \Delta U$ (p. 2)

## Assume

- Ideal gas (p. 2)
- Quasi-equilibrium (p. 2)
- $\Delta KE = \Delta PE = 0$ (p. 2)

## Sketch

The system is the air inside the closed piston-cylinder, with a moving boundary; the slides do not include a separate system sketch (p. 2).

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Apply the closed-system energy balance: $\Delta E = \Delta U + \Delta KE + \Delta PE = {}_1Q_2 - {}_1W_2$. With $\Delta KE = \Delta PE = 0$, this reduces to $\Delta U = {}_1Q_2 - {}_1W_2$ (p. 2).
2. Enter the heat interaction with the proper sign: the system rejects 25 kJ, so ${}_1Q_2 = -25000$ J (p. 2).
3. Compute the moving-boundary work for the constant-pressure quasi-equilibrium process: ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V} = P\int_{\mathcal{V}_1}^{\mathcal{V}_2} d\mathcal{V} = P(\mathcal{V}_2 - \mathcal{V}_1)$. Substitute $P = 350000$ Pa, $\mathcal{V}_1 = 0.15$ m$^3$, $\mathcal{V}_2 = 0.05$ m$^3$: ${}_1W_2 = 350000(0.05 - 0.15) = -35000$ J (p. 4).
4. Substitute heat and work into the first law: $\Delta U = -25000 - (-35000) = 10000$ J (p. 4).
5. State the answer: $\Delta U = 10000$ J (p. 4).

## Answer

- $Change in energy of the air, $\Delta U$: 10000 J

## What the instructor emphasises

- Use sign convention explicitly: heat rejection is negative ${}_1Q_2$, and compression boundary work is negative ${}_1W_2$ (p. 2, p. 4).
- For a quasi-equilibrium constant-pressure process, the boundary work integral collapses to $P(\mathcal{V}_2-\mathcal{V}_1)$ (p. 4).
- When $\Delta KE = \Delta PE = 0$, the closed-system energy change is just $\Delta U$ (p. 2).
- Even though the system rejects heat, $\Delta U$ is positive because the compression work input is larger than the heat removed (p. 4).
