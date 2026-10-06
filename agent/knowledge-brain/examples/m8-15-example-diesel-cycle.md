---
id: ex:m8-15-example-diesel-cycle
kind: example
title: Diesel Cycle Work, Heat Addition, and Efficiency
description: 'Air-standard ideal Diesel cycle example: find net work, heat added during combustion, and
  thermal efficiency from compression ratio, cutoff ratio, and engine displacement (p. 2).'
parent: topic:m8-15-example-diesel-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-15-example-diesel-cycle
misconceptions:
- misc:m14-cp-and-cv-chosen-by-process-name
sources:
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Diesel Cycle Work, Heat Addition, and Efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

An engine runs an air-standard diesel cycle with a compression ratio of 18, a cut-off ratio of 2.37 using an ideal cycle. The displacement of the engine is 0.002 m$^3$ (2 L). If the intake air is T=300 K and P1=0.1 MPa, calculate the following (R=287 J/kg-K, cv=714 J/kg-K):

- Work done by the cycle
- Heat added during combustion
- Efficiency of the cycle

(p. 2)

## Given

- $\mathcal{V}_1/\mathcal{V}_2 = 18$
- $\mathcal{V}_3/\mathcal{V}_2 = 2.37$
- $\mathcal{V}_1 - \mathcal{V}_2 = 0.002\ \text{m}^3$
- $T_1 = 300\ \text{K}$
- $P_1 = 0.1\ \text{MPa}$
- $R = 287\ \text{J/kg-K}$
- $c_v = 714\ \text{J/kg-K}$

## Find

- $W_{\text{net}}$ (net work done by the cycle)
- $Q_{\text{in}}$ (heat added during combustion)
- $\eta$ (cycle efficiency)

## Assume

- air = ideal gas
- $c_v$ = constant
- quasi-steady
- reversible
- $\Delta KE = \Delta PE = 0$

## Sketch

No cycle diagram is transcribed; the slide shows engine valvetrain hardware (rocker arms, coil valve springs, and pushrods/valve stems).

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Find the cylinder volumes at states 1 and 2. From $\mathcal{V}_1/\mathcal{V}_2=18$, $\mathcal{V}_1=18\mathcal{V}_2$. With displacement $\mathcal{V}_1-\mathcal{V}_2=0.002\ \text{m}^3$, $18\mathcal{V}_2-\mathcal{V}_2=0.002$, so $\mathcal{V}_2=0.00012\ \text{m}^3$ and $\mathcal{V}_1=0.00212\ \text{m}^3$ (p. 3).
2. Find the air mass from the ideal gas law at state 1: $M = P_1\mathcal{V}_1/(R T_1) = (100000)(0.00212)/((287)(300)) = 0.00246\ \text{kg}$ (p. 3).
3. Find state 2 after isentropic compression: $P_2 = P_1(\mathcal{V}_1/\mathcal{V}_2)^k = 100000(18)^{1.4} = 5719808\ \text{Pa}$, and $T_2 = P_2\mathcal{V}_2/(M R) = (5719808)(0.00012)/((0.00246)(287)) = 972.2\ \text{K}$ (p. 3).
4. Find state 3 after constant-pressure heat addition: $P_3 = P_2 = 5719808\ \text{Pa}$, $\mathcal{V}_3 = 2.37\mathcal{V}_2 = (2.37)(0.00012) = 0.00028\ \text{m}^3$, $T_3 = P_3\mathcal{V}_3/(M R) = (5719808)(0.00028)/((0.00246)(287)) = 2268.4\ \text{K}$ (p. 4).
5. Find state 4 after isentropic expansion back to $\mathcal{V}_4=\mathcal{V}_1=0.00212\ \text{m}^3$: $P_4 = P_3(\mathcal{V}_3/\mathcal{V}_4)^{1.4} = 5719808(0.00028/0.00212)^{1.4} = 336149.5\ \text{Pa}$, and $T_4 = P_4\mathcal{V}_4/(M R) = (336149.5)(0.00212)/((0.00246)(287)) = 1009.4\ \text{K}$ (p. 4).
6. Compute the process works. Process 1-2: ${}_1W_2 = -\Delta U = -M c_v(T_2-T_1) = -(0.00246)(714)(972.2-300) = -1180.7\ \text{J}$. Process 2-3: ${}_2W_3 = \int_{\mathcal{V}_2}^{\mathcal{V}_3} P\,d\mathcal{V} = P_2(\mathcal{V}_3-\mathcal{V}_2) = 5719808(0.00028-0.00012) = 915.17\ \text{J}$. Process 3-4: ${}_3W_4 = -\Delta U = -M c_v(T_4-T_3) = -(0.00246)(714)(1009.4-2268.4) = 2211.4\ \text{J}$ (p. 5).
7. Sum the three nonzero work terms: $W_{\text{net}} = {}_1W_2+{}_2W_3+{}_3W_4 = -1180.7+915.17+2211.4 = 1946.4\ \text{J}$ (p. 5).
8. Calculate the heat added during constant-pressure combustion, process 2-3: ${}_2Q_3 = \Delta U + {}_2W_3 = M c_v(T_3-T_2)+{}_2W_3 = (0.00246)(714)(2268.4-972.2)+915.17 = 3191.9\ \text{J}$ (p. 6).
9. Calculate the thermal efficiency: $\eta_{\text{th}} = W_{\text{net}}/Q_{\text{in}} = 1946.4/3191.9 = 0.61$ (p. 6).

## Answer

- Net work done by the cycle: 1946.4 J
- Heat added during combustion: 3191.9 J
- Thermal efficiency: 0.61 dimensionless

## What the instructor emphasises

- Set up the cycle using the first law and process work/heat terms: $W_{\text{net}} = {}_1W_2+{}_2W_3+{}_3W_4+{}_4W_1$ and $W=\int P\,d\mathcal{V}$ (p. 2).
- Use $P\mathcal{V}=MRT$ to find the mass from the known state 1 volume and to find temperatures at states 2, 3, and 4 (p. 3, Page 4).
- During the constant-pressure heat-addition process 2-3, the work is $P_2(\mathcal{V}_3-\mathcal{V}_2)$, not zero (p. 5).
- For the adiabatic processes 1-2 and 3-4, use $Q=0$ so the boundary work is the negative of the internal-energy change, $-M c_v\Delta T$ (p. 5).
- Efficiency is the net work out divided by the heat added during combustion, ${}_2Q_3$ (p. 6).
