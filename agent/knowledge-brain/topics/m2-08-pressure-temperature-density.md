---
id: topic:m2-08-pressure-temperature-density
kind: topic
title: M2.8 — Pressure Temperature Density
description: Defines mass, moles, volume, density and specific volume, pressure, gage vs absolute pressure,
  and temperature (Zeroth law); open when introducing basic thermodynamic properties.
parent: unit:m2-properties-states-and-processes
unit: unit:m2-properties-states-and-processes
lecture: M2.8
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can distinguish mass, moles, and volume and recall their SI units.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can define density, mass-specific volume, and molar-specific volume and relate them.
  kc_type: principle
  bloom: understand
- id: '#o3'
  text: Students can explain the continuum limit used to define density at a point.
  kc_type: principle
  bloom: understand
- id: '#o4'
  text: Students can define pressure as the normal force per unit area in the limit of vanishing area.
  kc_type: principle
  bloom: understand
- id: '#o5'
  text: Students can convert between absolute and gage pressure using the atmospheric pressure offset.
  kc_type: skill
  bloom: apply
- id: '#o6'
  text: Students can state the Zeroth Law and interpret temperature as mean molecular speed.
  kc_type: principle
  bloom: remember
equations:
- eq:absolute-pressure
- eq:mass-specific-volume
- eq:molar-specific-volume
- eq:pressure-definition
misconceptions: []
examples: []
items:
- item:exam1-2022-conflict-i-1
- item:exam1-2022-regular-i-1
- item:hw03-1
- item:hw03-2
sources:
- path: lectures/Module2_8_PressureTemperatureDensity_annotated.pdf
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

# M2.8 — Pressure Temperature Density

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This deck introduces the primitive quantities used to describe thermodynamic systems: mass, amount in moles, volume, density and specific volume, pressure, and temperature. It also defines gage versus absolute pressure and states the Zeroth Law.

## Key ideas
- Mass $M$ is how much material is present, in kg; moles $N$ count particles, with 1 mole = $6.02214199\times 10^{23}$ particles; volume is the space occupied, in m$^3$ (p. 2).
- Density is mass per volume, $\rho = M/\mathcal{V}$. The limit $\Delta V=\Delta x\Delta y\Delta z\to 0$ is a continuum definition: $\rho$ at a point is meaningful because a small fluid element still contains many particles (p. 3).
- The continuum picture applies when the mean free path $\lambda$ is much smaller than the system dimension $L$; the slide writes the Knudsen number as $\lambda/L$ and requires $L \gg\gg \lambda$ (p. 3).
- Specific volume is the reciprocal of density and is given per unit mass, $v=\mathcal{V}/M=1/\rho$, or per mole, $\bar{v}=\mathcal{V}/N$ (p. 3).
- Pressure is the normal force exerted by a fluid on an area. The intensive definition is the limit as the area shrinks to zero, $P=\lim_{\Delta A\to 0}F_{\text{normal}}/\Delta A$ (p. 4).
- A gage reads zero at the local atmospheric pressure, so absolute pressure is gage pressure plus atmospheric pressure, $P_{\text{abs}}=P_{\text{gage}}+P_{\text{atm}}$ (p. 5).
- The Zeroth Law says if two systems are each in thermal equilibrium with a third system, they are in thermal equilibrium with each other; the slide interprets temperature as a measure of mean molecular speed (p. 6).

## Notation used
- $M$: mass, kg (p. 2)
- $N$: number of moles (p. 2)
- $\mathcal{V}$: total volume, m$^3$; the slide writes $V$ (p. 2)
- $\rho$: density, kg/m$^3$ (p. 3)
- $v$: mass-specific volume, m$^3$/kg (p. 3)
- $\bar{v}$: molar-specific volume, m$^3$/mol (p. 3)
- $\lambda$: mean free path; $L$: system dimension (p. 3)
- $P$: pressure; $F_{\text{normal}}$: normal force; $A$: area (p. 4)
- $P_{\text{abs}}$, $P_{\text{gage}}$, $P_{\text{atm}}$: absolute, gage, and atmospheric pressure (p. 5)
