---
id: topic:m1-04-systems-and-control-volumes
kind: topic
title: M1.4 — Systems and Control Volumes
description: Introduces thermodynamic systems as fixed-mass regions separated by a boundary and control
  volumes as regions allowing mass and energy flow; illustrates with a water bottle and fire hose.
parent: unit:m1-introduction-and-conservation
unit: unit:m1-introduction-and-conservation
lecture: M1.4
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can distinguish a system from a control volume.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Students can classify a given scenario, such as a closed water bottle or fire-hose flow, as a
    system or control volume.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can state the isolated-system condition $E_{\mathrm{in}}=E_{\mathrm{out}}=0$.
  kc_type: fact
  bloom: remember
equations: []
misconceptions: []
examples: []
items:
- item:hw01-4a
- item:hw01-4b
- item:hw01-4c
- item:hw01-4d
- item:hw01-4e
sources:
- path: lectures/Module1_4_SystemsCVs_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M1.4 — Systems and Control Volumes

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

Introduces the system/control-volume choice. A system is a fixed mass separated by a boundary; a control volume is a region of space surrounded by a control surface through which both mass and energy can pass.

## Key ideas

- A system is a fixed mass of material separated from its surroundings by a boundary (p. 2).
- An isolated system has $E_{\mathrm{in}}=E_{\mathrm{out}}=0$ (p. 2).
- The system mass is constant: $M_{\mathrm{sys}}=\text{const}$ (p. 2).
- A control volume ($C\forall$) is a region of space surrounded by a control surface; both mass and energy can pass through it (p. 5).
- On the control-volume sketch, transfers are labelled $M_{\mathrm{in}}$, $M_{\mathrm{out}}$, $E_{\mathrm{in}}$, $E_{\mathrm{out}}$ (p. 5).
- Flow problems should be modelled with a control volume, not a system (p. 8). The fire-hose nozzle is shown as a control volume with inlet ①, exit ②, and entering mass flow $\dot{m}$ (p. 8).

## Notation used

- $\forall$ = volume; $C\forall$ = control volume (p. 5).
- $M_{\mathrm{sys}}$ = mass of the system (p. 2).
- $E_{\mathrm{in}}$, $E_{\mathrm{out}}$ = energy transfers across a boundary/control surface (p. 2, p. 5).
- $M_{\mathrm{in}}$, $M_{\mathrm{out}}$ = mass transfers across a control surface (p. 5).
- $\dot{m}$ = mass flow rate label at the nozzle inlet (p. 8).

## Examples in this lecture

- Water bottle on a plane (p. 3–4): a capped bottle is used to pose a fixed-mass system question after landing; the slides ask whether it expands, contracts, or stays the same but do not give a solved answer.
- Fire hose (p. 6–8): flow through a nozzle; the slide answers the p. 7 choice by marking flow and drawing a control volume with $\dot{m}$ entering (p. 8).

## What students get wrong here

- Treating a flow as a system. The slide explicitly asks “system or control volume” for a fire hose and then marks the flow case as a control volume (p. 7–8). The annotation on p. 5 underlines “flow” when introducing control volumes.
