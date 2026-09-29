---
id: ex:m2-04-example-processes-cycles
kind: example
title: 'Identifying piston-cylinder processes: isobaric and isothermal ideal-gas examples'
description: Given ideal-gas air in two piston-cylinder processes with specified pressures and volumes,
  compute temperatures from $P\mathcal{V}=MRT$ and classify each process as isobaric or isothermal.
parent: topic:m2-04-example-processes-cycles
unit: unit:m2-properties-states-and-processes
status: auto
audience: both
priority: 0.6
topics:
- topic:m2-04-example-processes-cycles
misconceptions: []
sources:
- path: lectures/Module2_4_Example_ProcessesCycles_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Identifying piston-cylinder processes: isobaric and isothermal ideal-gas examples

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Two piston-cylinder process examples are considered. In process #1, air ($R=287\ \mathrm{J/(kg\cdot K)}$) has $P_1=P_2=0.1\ \mathrm{MPa}$, $\mathcal{V}_1=1\ \mathrm{m^3}$, $\mathcal{V}_2=0.5\ \mathrm{m^3}$, and $M=1\ \mathrm{kg}$; find $T_1,T_2$ and identify the process. In process #2, air has $P_1=0.1\ \mathrm{MPa}$, $P_2=0.2\ \mathrm{MPa}$, $\mathcal{V}_1=1\ \mathrm{m^3}$, $\mathcal{V}_2=0.5\ \mathrm{m^3}$, and $M=1\ \mathrm{kg}$; find $T_1,T_2$ and identify the process. Assume ideal gas.

## Given

- Process #1: $P_1=P_2=0.1\ \mathrm{MPa}$
- Process #1: $\mathcal{V}_1=1\ \mathrm{m^3}$, $\mathcal{V}_2=0.5\ \mathrm{m^3}$
- Process #2: $P_1=0.1\ \mathrm{MPa}$, $P_2=0.2\ \mathrm{MPa}$
- Process #2: $\mathcal{V}_1=1\ \mathrm{m^3}$, $\mathcal{V}_2=0.5\ \mathrm{m^3}$
- Both processes: $M=1\ \mathrm{kg}$ of air
- Ideal-gas constant $R=287\ \mathrm{J/(kg\cdot K)}$

## Find

- $T_1$ and $T_2$ for process #1
- $T_1$ and $T_2$ for process #2
- Process type for each (isothermal, isobaric, or isochoric)

## Assume

- Air behaves as an ideal gas with $R=287\ \mathrm{J/(kg\cdot K)}$

## Sketch

Two piston-cylinder devices containing air are sketched. In process #1 the piston compresses the air from $\mathcal{V}_1=1\ \mathrm{m^3}$ to $\mathcal{V}_2=0.5\ \mathrm{m^3}$ at unchanged pressure; in process #2 the same volume reduction occurs while pressure increases from $0.1\ \mathrm{MPa}$ to $0.2\ \mathrm{MPa}$.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Process #1, given values (Page 2): $P_1=P_2=0.1\ \mathrm{MPa}$, $\mathcal{V}_1=1\ \mathrm{m^3}$, $\mathcal{V}_2=0.5\ \mathrm{m^3}$, $M=1\ \mathrm{kg}$. Use the ideal-gas equation $P\mathcal{V}=MRT$.
2. Process #1, State 1 (Page 4): $T_1 = \frac{P_1\mathcal{V}_1}{MR} = \frac{(0.1\times10^6)(1)}{(1)(287)} = 348\ \mathrm{K}$.
3. Process #1, State 2 (Page 4): $T_2 = \frac{P_2\mathcal{V}_2}{MR} = \frac{(0.1\times10^6)(0.5)}{(1)(287)} = 174\ \mathrm{K}$.
4. Process #1 classification (Page 3): because $P_1=P_2=0.1\ \mathrm{MPa}$, the process is isobaric; the slide circles option (b) Isobaric.
5. Process #2, given values (Page 5): $P_1=0.1\ \mathrm{MPa}$, $P_2=0.2\ \mathrm{MPa}$, $\mathcal{V}_1=1\ \mathrm{m^3}$, $\mathcal{V}_2=0.5\ \mathrm{m^3}$, $M=1\ \mathrm{kg}$. Use the same ideal-gas relation at each state (Page 6).
6. Process #2, State 1 (Page 6): $T_1 = \frac{P_1\mathcal{V}_1}{MR} = \frac{(0.1\times10^6)(1)}{(1)(287)} = 348\ \mathrm{K}$.
7. Process #2, State 2 (Page 6): $T_2 = \frac{P_2\mathcal{V}_2}{MR}$. Using the given $P_2=0.2\ \mathrm{MPa}$, $T_2 = \frac{(0.2\times10^6)(0.5)}{(1)(287)} = 348\ \mathrm{K}$. The slide's handwritten expression appears to show $10^4$ in the pressure term, but the boxed answer is $348\ \mathrm{K}$.
8. Process #2 classification (Page 7): because $T_1=T_2=348\ \mathrm{K}$, the process is isothermal; the slide circles option (a) Isothermal.

## Answer

- $T_1$ for process #1$: 348 K
- $T_2$ for process #1$: 174 K
- Process #1 type: isobaric
- $T_1$ for process #2$: 348 K
- $T_2$ for process #2$: 348 K
- Process #2 type: isothermal

## What the instructor emphasises

- Classify a process by comparing the two states: constant pressure is isobaric; constant temperature is isothermal (Pages 3 and 7).
- Apply $P\mathcal{V}=MRT$ at each state with absolute pressure. The slides convert MPa to Pa by multiplying by $10^6$ (Pages 4 and 6).
- For process #1, even though $P$ is constant, $T$ changes when $\mathcal{V}$ changes; for process #2, $P$ and $\mathcal{V}$ change together so $T$ stays constant.
- There appears to be a handwritten pressure-exponent slip in the State 2 calculation on Page 6; the boxed answer is $T_2=348\ \mathrm{K}$.
