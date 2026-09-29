---
id: topic:m5-01-energy
kind: topic
title: M5.1 — Energy
description: Introduces total energy as bulk kinetic plus potential energy plus internal energy, and calculates
  bulk energy for a simple system.
parent: unit:m5-energy-heat-work-closed-systems
unit: unit:m5-energy-heat-work-closed-systems
lecture: M5.1
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can decompose total stored energy into bulk and internal contributions.
  kc_type: principle
  bloom: understand
- id: '#o2'
  text: Students can calculate bulk kinetic and gravitational potential energy from mass, velocity, height,
    and gravity.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can distinguish extensive, specific-mass, and molar internal energy and their units.
  kc_type: fact
  bloom: remember
equations:
- eq:bulk-kinetic-potential-energy
- eq:total-energy-decomposition
misconceptions: []
examples: []
items:
- item:exam1-2021-i-2
- item:hw05-2
- item:hw05-3
sources:
- path: lectures/Module5_1_Energy_annotated.pdf
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

# M5.1 — Energy

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This opening lecture separates the energy stored in a system into bulk energy and internal energy. It defines bulk kinetic and gravitational potential energy, introduces the extensive, specific-mass, and molar forms of internal energy, and closes with a numerical calculation of bulk energy (pp. 2–4).

## Key ideas

- Total energy is decomposed as $E = E_{bulk} + U$; internal energy $U$ is separate from the bulk motion and elevation of the system (p. 2).
- Bulk energy is macroscopic: $E_{bulk} = KE + PE = \frac{1}{2} M \mathcal{V}^2 + M g (z - z_{ref})$ (p. 2).
- In this deck the script $\mathcal{V}$ is velocity in m/s, not volume (p. 2).
- Internal energy is written extensive as $U$ [J], per unit mass as $u$ [J/kg], and per mole as $\bar{u}$ [J/mol] (p. 3).
- Internal energy is associated with molecular motion: translation, rotation, and vibration (p. 3).
- Given $M$, $\mathcal{V}$, $z-z_{ref}$, and $g$, only $E_{bulk}$ can be computed; $U$ remains an additional unknown (p. 4).

## Notation used

- $E$: total energy
- $E_{bulk}$: bulk energy
- $U$: extensive internal energy [J]
- $u$: internal energy per unit mass [J/kg]
- $\bar{u}$: internal energy per mole [J/mol]
- $\mathcal{V}$: velocity [m/s] in this lecture
- $M$: system mass
- $z$: height; $z_{ref}$: reference height
- $g$: gravitational acceleration

(All from pp. 2–3.)

## Examples in this lecture

The worked example computes $E_{bulk}$ for $M=2$ kg, $\mathcal{V}=20$ m/s, $z-z_{ref}=1$ m, and $g=9.8$ m/s$^2$, obtaining $419.6$ J; it then explicitly asks for $U = ?$ to show that bulk energy alone does not determine internal energy (p. 4).

## What students get wrong here

- Do not read the script $\mathcal{V}$ in this deck as volume; the annotation marks it as velocity with units of m/s (p. 2).
- Keep the three internal-energy forms distinct: $U$, $u$, and $\bar{u}$ have different units (p. 3).
