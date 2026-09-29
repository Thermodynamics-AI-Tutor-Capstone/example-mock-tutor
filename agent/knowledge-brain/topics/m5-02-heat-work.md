---
id: topic:m5-02-heat-work
kind: topic
title: M5.2 — Heat Work
description: Introduces heat and work as non-property boundary energy transfers, distinguishes work from
  power, and derives compression/expansion boundary work for a piston-cylinder.
parent: unit:m5-energy-heat-work-closed-systems
unit: unit:m5-energy-heat-work-closed-systems
lecture: M5.2
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can explain why heat and work are not properties and identify them as boundary energy
    interactions.
  kc_type: principle
  bloom: understand
- id: '#o2'
  text: Students can compute boundary work using ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V}$
    and interpret the sign for compression and expansion.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can distinguish work from power and predict the effect of piston speed on each.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can interpret $\delta W$ as an inexact, path-dependent differential and contrast it with
    an exact differential such as $dT$.
  kc_type: principle
  bloom: understand
equations:
- eq:boundary-work-integral
- eq:differential-work
- eq:power
misconceptions:
- misc:m11-state-function-vs-path-function
examples: []
items:
- item:exam1-2022-conflict-i-3
- item:exam1-2022-conflict-ii-1
- item:exam1-2022-conflict-ii-2
- item:exam1-2022-conflict-iii
- item:exam1-2022-regular-i-3
- item:exam1-2022-regular-ii-1
- item:exam1-2022-regular-ii-2
- item:exam1-2022-regular-iii
- item:exam1-2023-i-3
- item:exam1-2023-ii-2
- item:hw05-2
- item:hw05-3
- item:hw05-4
sources:
- path: lectures/Module5_2_HeatWork_annotated.pdf
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

# M5.2 — Heat Work

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This slide deck defines heat and work as energy transfers across a system boundary, stresses that neither is a property, contrasts work and power using piston-speed clicker questions, and derives compression/expansion work.

## Key ideas
- Heat is not a property; it is energy exchanged from/to a system without transfer of mass due to a temperature difference, and it occurs at boundaries (p. 2).
- Heat notation: $Q$ [J], $\dot{Q}$ [J/s or W], $\dot{Q}''$ [W/m$^2$]; adiabatic means $Q=0$ (p. 2).
- Work is not a property; it is given by the path integral ${}_1W_2 = \oint \vec{F}\cdot d\vec{s}$ [J] (p. 3).
- $\delta W = \vec{F}\cdot d\vec{s}$ is an inexact differential and is path dependent; $dT$ is an exact differential (p. 3).
- The sketch on p. 3 shows two different paths between the same states: work is path dependent, whereas the change in temperature depends only on the end states (p. 3).
- Power is work per time: $\mathcal{P}=\dot{W}$. For a piston compressing air from 10 m$^3$ to 5 m$^3$, moving at 10 m/s instead of 1 m/s gives the same work but higher power (p. 4-5).
- Heat and work are both boundary interactions: $Q_{in}$, $Q_{out}$, $W_{in}$, and $W_{out}$ cross the system boundary (p. 6).
- Compression/expansion work: $\delta W = P\,d\mathcal{V}$, so ${}_1W_2 = \int_{\mathcal{V}_1}^{\mathcal{V}_2} P\,d\mathcal{V}$. Compression has $d\mathcal{V}<0$ and work done on the system; expansion has $d\mathcal{V}>0$ and work done by the system (p. 7).
- The slide lists four types of work: compression/expansion work, viscous work, shaft work, and flow work (p. 7).

## Notation used
- $Q$: heat; $\dot{Q}$: heat transfer rate; $\dot{Q}''$: heat flux (p. 2)
- ${}_1W_2$: work from state 1 to state 2; $\dot{W}$: work rate; $\mathcal{P}$: power (p. 3)
- $\delta$: inexact differential; $d$: exact differential (p. 3)
- $P$: pressure; $\mathcal{V}$: total volume (p. 7)

## Examples in this lecture
- Clicker: a piston compresses air from 10 m$^3$ to 5 m$^3$ at 1 m/s versus 10 m/s. The work is the same (p. 4), but the power required is higher at 10 m/s (p. 5). This shows work and power are different quantities.
- Piston-cylinder sketch shows compression as work done on the system and expansion as work done by the system (p. 7).

## What students get wrong here
- Treating heat and work as properties; the slides underline "NOT A PROPERTY" for both (p. 2, p. 3).
- Confusing path-dependent inexact differentials with exact differentials; $\delta W$ is path dependent while $dT$ is exact (p. 3).
- Confusing work and power; changing piston speed changes power but not the work for this compression (p. 4-5).
