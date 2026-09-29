---
id: topic:m6-08-compressors-turbines
kind: topic
title: M6.8 — Compressors Turbines
description: Covers steady-flow energy analysis of compressors/fans/blowers as work-input devices and
  turbines as work-extraction devices, including the sign convention between shaft work and enthalpy change.
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.8
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify compressors, fans, and blowers as work input devices and turbines as work
    extraction devices.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can state the sign of work and enthalpy change for compressor and turbine operation.
  kc_type: fact
  bloom: remember
- id: '#o3'
  text: Students can reduce the steady-flow energy equation to the compressor/turbine form under the stated
    assumptions.
  kc_type: principle
  bloom: apply
equations:
- eq:steady-flow-energy-adiabatic-single-stream
- eq:steady-flow-energy-balance
misconceptions: []
examples:
- ex:ee05-steady-flow-energy-equation-for-an-adiabatic-steam
items:
- item:exam2-2021-i-3
- item:exam2-2021-ii-1
- item:exam2-2022-i-3a-3c
- item:exam2-2022-ii-1a-1c
- item:exam2-2022-iii-a-3e
- item:exam2-2023-i-3
- item:exam2-2023-iii
- item:hw07-1
- item:hw07-2
- item:hw07-3
sources:
- path: lectures/Module6_8_CompressorsTurbines_annotated.pdf
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

# M6.8 — Compressors Turbines

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This slide deck distinguishes work input devices—compressors, fans, and blowers—from work extraction devices, turbines, using the steady-flow energy equation (p. 2, p. 4). It also establishes the sign convention between shaft work and fluid enthalpy change (p. 3, p. 5).

## Key ideas
- Compressors, fans, and blowers are work input devices; their goal is to increase enthalpy $h$ through work (p. 2).
- Turbines are work extraction devices; their goal is to extract work from the fluid (p. 4).
- The annotated slides assume steady flow, negligible kinetic and potential energy changes, and zero heat transfer (p. 3, p. 5).
- Under these assumptions, the energy balance reduces to $\dot{m}\Delta h = -\dot{W}$ (p. 3, p. 5).
- For compressors, work is done on the fluid, so $\dot{W}<0$ and $\Delta h>0$; the annotation also marks $d\mathcal{V}<0$ (p. 3).
- For turbines, work is done by the fluid, so $\dot{W}>0$ and $\Delta h<0$; the annotation also marks $d\mathcal{V}>0$ (p. 5).

## Notation used
- $\dot{m}$: mass flow rate
- $h$, $\Delta h$: specific enthalpy and enthalpy change
- $\Delta ke$, $\Delta pe$: changes in specific kinetic and potential energy
- $\dot{Q}$, $\dot{W}$: heat transfer rate and power/work rate; here $\dot{W}$ is negative for work input and positive for work output
- $\mathcal{V}$: total volume, used in the slide annotations for volume-change sign

## What students get wrong here
The slides explicitly correct the work sign: a work-input device such as a compressor has $\dot{W}<0$ and therefore $\Delta h>0$, while a work-extraction device such as a turbine has $\dot{W}>0$ and therefore $\Delta h<0$ (p. 3, p. 5). Students should not assume that all turbomachines have the same sign of $\dot{W}$.
