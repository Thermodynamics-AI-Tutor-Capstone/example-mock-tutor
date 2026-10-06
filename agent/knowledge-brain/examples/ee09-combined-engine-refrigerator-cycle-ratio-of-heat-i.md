---
id: ex:ee09-combined-engine-refrigerator-cycle-ratio-of-heat-i
kind: example
title: 'Combined engine–refrigerator cycle: ratio of heat inputs'
description: Given a heat engine with thermal efficiency 0.3 whose rejected heat drives a refrigerator
  with COP 4, calculate the ratio of engine heat input to refrigerator heat input.
parent: topic:m8-03-heat-pump-refrigerator
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-03-heat-pump-refrigerator
- topic:m8-04-example-heat-pump-refrigerator
misconceptions:
- misc:m17-cop-treated-as-an-efficiency
sources:
- path: assignments/explained-examples/ME300_Su22_EE9.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Combined engine–refrigerator cycle: ratio of heat inputs

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A small engine runs with a thermal efficiency of 0.3. Because the efficiency is so low, the rejected heat is used to run a refrigeration cycle with a coefficient of performance of 4. Draw the heat engine diagram for this configuration, labeling the heat and work flows for the two devices. Then calculate the ratio of the heat input to the engine to the heat input to the refrigerator. (p. 1)

## Given

- $\eta_{th} = 0.3$ (p. 1)
- $\beta = 4$ (p. 1)

## Find

- $\dfrac{\dot{Q}_{in,eng}}{\dot{Q}_{in,frig}}$ (p. 1)
- Diagram labeling heat and work flows for the two devices (p. 1)

## Assume

- Steady operation (p. 1)
- No energy losses to the outside (p. 1)

## Sketch

Two devices are drawn side by side. The engine receives $\dot{Q}_{in,eng}$ from $T_{H,1}$, produces $\dot{W}_{net}$, and rejects $\dot{Q}_{out,eng}$ to $T_{L,1}$. The refrigerator receives $\dot{W}_{net}$ from the engine and $\dot{Q}_{in,frig}$ from $T_{L,2}$, and rejects $\dot{Q}_{out,frig}$ to $T_{H,2}$.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Apply the heat-engine thermal efficiency definition: $\eta_{th} = \dfrac{\dot{W}_{net}}{\dot{Q}_{in,eng}}$ (p. 1).
2. Apply the refrigerator COP definition: $\beta = \dfrac{\dot{Q}_{in,frig}}{\dot{W}_{net}}$, because the point of a refrigerator is to remove heat from a cold space (p. 1).
3. Solve the efficiency relation for the engine work output: $\dot{W}_{net} = \eta_{th}\,\dot{Q}_{in,eng}$ (p. 2).
4. Substitute this work into the COP expression: $\beta = \dfrac{\dot{Q}_{in,frig}}{\eta_{th}\,\dot{Q}_{in,eng}}$ (p. 2).
5. Rearrange to isolate the desired ratio: $\eta_{th}\beta = \dfrac{\dot{Q}_{in,frig}}{\dot{Q}_{in,eng}}$, so $\dfrac{\dot{Q}_{in,eng}}{\dot{Q}_{in,frig}} = \dfrac{1}{\eta_{th}\beta}$ (p. 2).
6. Substitute the given values: $\dfrac{\dot{Q}_{in,eng}}{\dot{Q}_{in,frig}} = \dfrac{1}{(0.3)(4)} = 0.83$ (p. 2).

## Answer

- Ratio of heat input to the engine to heat input to the refrigerator: 0.83 dimensionless

## What the instructor emphasises

- The engine and refrigerator are connected through the net work output, not by a direct heat transfer between the two devices.
- The refrigerator COP is based on the desired heat removal $\dot{Q}_{in,frig}$ per work input, not on thermal efficiency.
- Writing the ratio in terms of $\eta_{th}$ and $\beta$ avoids needing numerical values for any individual heat or work rate.
