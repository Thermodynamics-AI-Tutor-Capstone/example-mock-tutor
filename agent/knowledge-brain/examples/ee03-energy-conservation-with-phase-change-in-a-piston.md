---
id: ex:ee03-energy-conservation-with-phase-change-in-a-piston
kind: example
title: Energy conservation with phase change in a piston-cylinder
description: Calculate volume change, boundary work, and heat transfer for water condensing isothermally
  in a piston-cylinder from quality 0.6 to saturated liquid.
parent: topic:m5-04-energy-conservation
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.6
topics:
- topic:m5-04-energy-conservation
- topic:m5-05-example-1-energy-conservation
misconceptions:
- misc:m04-heat-always-raises-temperature
sources:
- path: assignments/explained-examples/ME300_Su22_EE3.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Energy conservation with phase change in a piston-cylinder

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Initially, 0.454 kg of water at 420 K with a quality of 0.6 is contained in a piston-cylinder device. The piston is then slowly moved until the water is entirely converted into liquid. Heat transfer maintains the temperature at 420 K. Calculate:

a) The change in volume in meters cubed

b) The work in kJ

c) The heat in kJ

## Given

- $M = 0.454\ \text{kg}$
- $T_1 = 420\ \text{K}$
- $x_1 = 0.6$
- $T_2 = 420\ \text{K}$
- $x_2 = 0$
- Water in a piston-cylinder device

## Find

- $\Delta\mathcal{V}$
- ${}_1W_2$
- ${}_1Q_2$

## Assume

- S.C.S.
- quasi-steady
- isothermal
- constant mass

## Sketch

Piston-cylinder device containing water; no additional sketch is visible in the transcript.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. State 1: At $T_1=420\ \text{K}$ and $x_1=0.6$, use Table D.1: $v_1 = x_1v_g + (1-x_1)v_f = (0.6)(0.4252)+(0.4)(0.001087)=0.2556\ \text{m}^3/\text{kg}$.
2. Compute total initial volume: $\mathcal{V}_1 = v_1M = (0.2556)(0.454)=0.116\ \text{m}^3$.
3. State 2: At $T_2=420\ \text{K}$ and $x_2=0$, the water is saturated liquid, so $v_2=v_f=0.001087\ \text{m}^3/\text{kg}$.
4. Compute total final volume: $\mathcal{V}_2 = v_2M = (0.001087)(0.454)=0.00049\ \text{m}^3$.
5. Volume change: $\Delta\mathcal{V} = \mathcal{V}_2-\mathcal{V}_1 = 0.00049-0.116 = -0.1155\ \text{m}^3$.
6. Boundary work: ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V}$. Inside the vapor dome, isothermal equals isobaric, so ${}_1W_2 = P_{\text{sat}}(\mathcal{V}_2-\mathcal{V}_1) = (0.437309\times 10^4)(-0.1155) = -50552.9\ \text{J} = -50.5529\ \text{kJ}$.
7. First law for the closed system: $M\Delta u = {}_1Q_2 - {}_1W_2$, so ${}_1Q_2 = M\Delta u + {}_1W_2$.
8. State 1 internal energy: $u_1 = x_1u_g + (1-x_1)u_f = (0.6)(2556.2)+(0.4)(618.13)=1780.97\ \text{kJ/kg}$.
9. State 2 internal energy: $u_2 = u_f = 618.13\ \text{kJ/kg}$.
10. Internal energy change: $M(u_2-u_1) = -527.93\ \text{kJ}$.
11. Heat transfer: ${}_1Q_2 = -527.93 - 50.5529 = -578.5\ \text{kJ}$.

## Answer

- $\Delta\mathcal{V}$: -0.1155 m^3
- ${}_1W_2$: -50.5529 kJ
- ${}_1Q_2$: -578.5 kJ

## What the instructor emphasises

- Inside the vapor dome, an isothermal process is also isobaric, so the moving-boundary work integral reduces to $P_{\text{sat}}\Delta\mathcal{V}$.
- For a saturated mixture, evaluate properties with quality: $v=xv_g+(1-x)v_f$ and $u=xu_g+(1-x)u_f$.
- Total and specific volume are related by $\mathcal{V}=vM$.
- The first law for this closed system is $M\Delta u={}_1Q_2-{}_1W_2$; solve for heat after finding work and internal energy change.
- All three quantities are negative here, consistent with condensation/compression and heat rejection.
