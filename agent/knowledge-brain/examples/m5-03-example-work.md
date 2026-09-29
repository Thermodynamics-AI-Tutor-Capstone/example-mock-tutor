---
id: ex:m5-03-example-work
kind: example
title: Work for Isobaric and Isothermal Expansion of Air in a Piston-Cylinder
description: Calculates boundary work for 1 kg of air expanding from 1 m^3 to 2 m^3 isobarically and isothermally,
  then applies work signs to a clockwise power cycle.
parent: topic:m5-03-example-work
unit: unit:m5-energy-heat-work-closed-systems
status: auto
audience: both
priority: 0.6
topics:
- topic:m5-03-example-work
misconceptions:
- misc:m11-state-function-vs-path-function
- misc:m13-work-read-off-a-pv-diagram
sources:
- path: lectures/Module5_3_Example_Work_annotated.pdf
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

# Work for Isobaric and Isothermal Expansion of Air in a Piston-Cylinder

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

A closed piston-cylinder system filled with $1$ kg of air starts at a total volume $\mathcal{V}_1 = 1$ m$^3$ and isobarically expands to $\mathcal{V}_2 = 2$ m$^3$. The initial temperature is $T_1 = 300$ K. Find $P_2$, $T_2$, and ${}_1W_2$, and draw the process on a $P$-$\mathcal{V}$ diagram. Now do the same process isothermally.

## Given

- closed piston-cylinder system
- $M = 1$ kg air
- $\mathcal{V}_1 = 1$ m$^3$, $\mathcal{V}_2 = 2$ m$^3$
- $T_1 = 300$ K
- first process: isobaric expansion
- air gas constant used in the calculation: $R = 287$

## Find

- $P_2$
- $T_2$
- ${}_1W_2$ for the isobaric process
- ${}_1W_2$ for the isothermal process

## Assume

- air is an ideal gas (p. 2)
- quasi-steady (p. 2)

## Sketch

Instructor draws $P$-$\mathcal{V}$ diagrams: for isobaric expansion, a horizontal constant-$P$ line from state 1 to state 2 with dashed verticals at $\mathcal{V}_1=1$ m$^3$ and $\mathcal{V}_2=2$ m$^3$ (p. 3); for isothermal expansion, a decreasing hyperbola with the area under the curve shaded as ${}_1W_2$ (p. 4); for the cycle, a clockwise loop formed by two isotherms and two isochores with enclosed area as net work (p. 5).

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Set up the closed piston-cylinder system and assumptions: ideal gas and quasi-steady. Use total volume $\mathcal{V}$; state 1 has $\mathcal{V}_1 = 1$ m$^3$, $T_1 = 300$ K and state 2 has $\mathcal{V}_2 = 2$ m$^3$ (p. 2, p. 3).
2. Find $P_1$ from the ideal-gas law $P_1\mathcal{V}_1 = M R T_1$. Substitute $P_1 = \dfrac{(1)(287)(300)}{1} = 86100$ Pa. Since the expansion is isobaric, $P_2 = P_1 = 86100$ Pa. The annotated calculation does not explicitly evaluate $T_2$ for the isobaric case (p. 3).
3. Compute boundary work for the isobaric process: ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V} = P\int_{\mathcal{V}_1}^{\mathcal{V}_2} d\mathcal{V} = P(\mathcal{V}_2 - \mathcal{V}_1) = 86100(2-1) = 86100$ J. The sign is positive; the instructor marks 'by?' for work done by the system (p. 3).
4. Draw the isobaric $P$-$\mathcal{V}$ diagram: a horizontal line from state ① at $\mathcal{V}=1$ to state ② at $\mathcal{V}=2$, with an arrow to the right. The area under the line is the boundary work (p. 3).
5. For the isothermal case, $T_2 = T_1 = 300$ K and $P_1 = 86100$ Pa. Put $P = M R T/\mathcal{V}$ inside the integral: ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} \frac{M R T}{\mathcal{V}} d\mathcal{V} = M R T \ln\left(\frac{\mathcal{V}_2}{\mathcal{V}_1}\right) = (1)(287)(300)\ln\left(\frac{2}{1}\right) = 59679.97$ J (p. 4).
6. Draw the isothermal $P$-$\mathcal{V}$ diagram: a decreasing hyperbola from state ① at higher $P$ and $\mathcal{V}=1$ to state ② at lower $P$ and $\mathcal{V}=2$, with the area under the curve shaded and labeled ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V}$ (p. 4).
7. Extend to a cycle: 1-2 isothermal compression ($\Delta T=0$, ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} \frac{M R T}{\mathcal{V}} d\mathcal{V} < 0$); 2-3 isochoric heat addition ($\Delta \mathcal{V}=0$, ${}_2W_3=0$); 3-4 isothermal expansion (${}_3W_4 > 0$); 4-1 isochoric heat rejection (${}_4W_1=0$). Net work is $W_{\text{net}} = {}_1W_2 + {}_3W_4 > 0$, and the power cycle is clockwise on the $P$-$\mathcal{V}$ diagram (p. 5).

## Answer

- $P_2 (isobaric)$: 86100 Pa
- ${}_1W_2 (isobaric)$: 86100 J
- ${}_1W_2 (isothermal)$: 59679.97 J
- $T_2 (isothermal)$: 300 K

## What the instructor emphasises

- For expansion of a closed system, the boundary work is positive if the system does work on the surroundings; the instructor explicitly checks 'by?' (p. 3).
- An isobaric process makes the moving-boundary work integral evaluate to $P \Delta\mathcal{V}$ (p. 3).
- For an isothermal ideal-gas process, the pressure is not constant; replace $P$ with $M R T/\mathcal{V}$ before integrating, giving $M R T\ln(\mathcal{V}_2/\mathcal{V}_1)$ (p. 4).
- The same two volumes give different work for different process paths: $86100$ J isobaric vs $59679.97$ J isothermal, so work is path-dependent (p. 3, p. 4).
- On a $P$-$\mathcal{V}$ diagram, area under the process curve is work; isochoric legs have zero boundary work, and a clockwise cycle net work is the enclosed area (p. 5).
- The notes write 'script V = total volume', so use total volume not specific volume in the ideal-gas relation and work integral (p. 3).
