---
id: topic:m6-01-mass-conservation
kind: topic
title: M6.1 — Mass Conservation
description: Introduces conservation of mass for systems and control volumes, mass flow rate, average
  velocity, and a mass-flow example; open it before assigning Module 6 mass-conservation problems.
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.1
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can state that mass is conserved and that a mass-generation term is always zero.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can write finite-time and instantaneous mass balances for a system and a control volume.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can compute mass flow rate from density, cross-sectional area, and velocity.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can predict how velocity changes when mass flow rate changes at fixed density and area.
  kc_type: principle
  bloom: understand
equations:
- eq:area-averaged-velocity
- eq:control-volume-mass-balance-rate
- eq:finite-time-mass-balance
- eq:mass-flow-rate-at-a-cross-section
misconceptions: []
examples: []
items:
- item:exam2-2021-iii-a-e
- item:hw06-2
sources:
- path: lectures/Module6_1_MassConservation_annotated.pdf
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

# M6.1 — Mass Conservation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This lecture introduces conservation of mass in finite-time and instantaneous forms for systems and control volumes, defines mass flow rate and average velocity, and applies the mass-flow relation to a simple duct-flow example.

## Key ideas

- Mass is conserved; there is no mass-generation term. The finite-time balance is $\Delta M_{sys}=M(t_2)-M(t_1)=M_{in}-M_{out}$, with $M_{gen}$ crossed out, and for the system $\Delta M_{sys}=0$ (p. 2).
- For a control volume, the instantaneous mass balance is $\frac{dM}{dt}\Big|_{cv}=\dot{m}_{in}-\dot{m}_{out}$, again with no $\dot{M}_{gen}$ (p. 2, p. 3).
- Mass flow rate at a cross section is $\dot{m}=\rho \mathcal{V} A$; when velocity is not uniform, use the area-averaged velocity $\mathcal{V}_{av}=\frac{1}{A}\int_A \mathcal{V}\,dA$ (p. 3).
- The example on p. 4 gives $\dot{m}=10\ \mathrm{kg/s}$, $\rho=1000\ \mathrm{kg/m^3}$, and $A=0.1\ \mathrm{m^2}$, then solves $v=\dot{m}/(\rho A)=0.1\ \mathrm{m/s}$.
- For constant density, $\dot{m}=\rho v A$, so if area is fixed and mass flow increases, velocity increases (p. 4, p. 5).

## Notation used

- $M$: mass in the system or control volume.
- $M_{in}$, $M_{out}$: mass entering and leaving over a finite time.
- $\dot{m}$: mass flow rate.
- $\rho$: density.
- $A$: cross-sectional area.
- $\mathcal{V}$ and $v$: flow velocity; the deck uses $\mathcal{V}$ on p. 3 and $v$ on p. 4.
- $\mathcal{V}_{av}$: area-averaged velocity.

## Examples in this lecture

- p. 4: Given mass flow rate, density, and area, find the flow speed; demonstrates direct use of $\dot{m}=\rho v A$.
- p. 5: Clicker question asking whether velocity increases, decreases, or stays the same when mass flow increases at fixed density; reinforces $\dot{m}\uparrow,\ v\uparrow$.

## What students get wrong here

- Carrying a mass-generation or mass-creation term; slide 2 explicitly cancels $M_{gen}$ and $\dot{M}_{gen}$.
- Forgetting that the system mass balance gives no mass change: $\Delta M_{sys}=0$ and $\frac{dM}{dt}\Big|_{sys}=0$ (p. 2).
- Thinking that at fixed density and area, mass flow can increase without velocity increasing; the slide says the opposite (p. 4, p. 5).
