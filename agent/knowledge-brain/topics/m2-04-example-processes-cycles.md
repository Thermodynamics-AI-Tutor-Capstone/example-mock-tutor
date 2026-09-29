---
id: topic:m2-04-example-processes-cycles
kind: topic
title: M2.4 — Example Processes Cycles
description: Worked piston-cylinder examples that identify isobaric and isothermal processes and compute
  air temperatures from the ideal-gas relation.
parent: unit:m2-properties-states-and-processes
unit: unit:m2-properties-states-and-processes
lecture: M2.4
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Identify whether a two-state piston-cylinder process is isobaric, isochoric, or isothermal by
    comparing P, V, and T at the end states.
  kc_type: skill
  bloom: analyze
- id: '#o2'
  text: Calculate temperatures for a fixed mass of ideal gas using $T = P\mathcal{V}/(M R)$ at each state.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Interpret a constant-property process in a piston-cylinder example as a path constrained by its
    end-state properties.
  kc_type: principle
  bloom: understand
equations:
- eq:ideal-gas-equation-of-state
misconceptions: []
examples:
- ex:m2-04-example-processes-cycles
items:
- item:exam1-2021-i-3
- item:exam1-2023-iii
- item:hw02-1
- item:hw02-2a
- item:hw02-2b
- item:hw02-2c
- item:hw02-2d
- item:hw02-2e
- item:hw02-2f
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

# M2.4 — Example Processes Cycles

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This slide deck works two piston-cylinder examples with air as an ideal gas. The goal is to compute the temperature at two states and then classify the process between those states as isothermal, isobaric, or isochoric.

## Key ideas

- The air is modeled as an ideal gas with $R = 287\ \mathrm{J/(kg\cdot K)}$ (p. 2).
- The ideal-gas state relation used at each state is $P\mathcal{V}=MRT$; solving for temperature gives $T = P\mathcal{V}/(MR)$ (p. 4 and p. 6).
- Process #1 keeps $P_1=P_2=0.1$ MPa while the volume changes from $\mathcal{V}_1=1$ m$^3$ to $\mathcal{V}_2=0.5$ m$^3$ for $M=1$ kg (p. 2). The computed temperatures are $T_1=348$ K and $T_2=174$ K, so the process is isobaric (p. 2-4).
- Process #2 has $P_1=0.1$ MPa, $P_2=0.2$ MPa, $\mathcal{V}_1=1$ m$^3$, $\mathcal{V}_2=0.5$ m$^3$, and $M=1$ kg; the slides report both $T_1=348$ K and $T_2=348$ K, so the process is isothermal (p. 5-7).
- The classification depends on comparing the two end states: isobaric means same pressure, isochoric means same volume, and isothermal means same temperature (p. 3 and p. 7).
- Note: on p. 6 the State 2 arithmetic line appears transcribed as $0.2\times10^4$, which would not give the reported $348$ K; treat that as a slide/transcription slip. The stated answer and process classification are $T_2=348$ K and isothermal.

## Notation used

- $P$: pressure in MPa in the written values, converted to Pa in the calculation.
- $\mathcal{V}$: total volume of the gas in the piston-cylinder.
- $M$: mass of air; the figure on p. 5 also writes this as $m$.
- $R$: ideal-gas constant for air, $287\ \mathrm{J/(kg\cdot K)}$.
- $T$: absolute temperature in kelvin.

## Examples in this lecture

- Process #1: constant-pressure volume reduction; calculates $T_1$ and $T_2$ and demonstrates an isobaric process.
- Process #2: simultaneous pressure increase and volume decrease; demonstrates an isothermal process with the reported unchanged temperature.
