---
id: topic:m7-14-isentropic-efficiency
kind: topic
title: M7.14 — Isentropic Efficiency
description: Introduces isentropic efficiency for turbines and compressors as real work compared with
  reversible adiabatic work; open when tutoring turbomachinery efficiency or h_{2,s} calculations.
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.14
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: State that isentropic efficiency compares a real component with a reversible, adiabatic ideal
    component.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Write the turbine and compressor isentropic efficiency definitions and explain why the work ratio
    flips between them.
  kc_type: principle
  bloom: understand
- id: '#o3'
  text: Identify the ideal exit state h_{2,s} from s_{2,s}=s_1 at the same outlet pressure P_2.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Use the relation \dot{m}\Delta h=-\dot{W} to compute real or ideal work from actual or ideal outlet
    enthalpies.
  kc_type: skill
  bloom: apply
equations:
- eq:compressor-isentropic-efficiency
- eq:isentropic-exit-state
- eq:real-ideal-work-outlet-enthalpies
- eq:steady-flow-energy-adiabatic-single-stream
- eq:turbine-isentropic-efficiency
misconceptions:
- misc:m15-adiabatic-implies-isentropic
examples:
- ex:ee08-explained-example-8-isentropic-efficiency-of-a-ste
items:
- item:exam2-2021-i-3
- item:exam2-2023-i-3
- item:hw09-1
- item:hw09-2
- item:hw09-5
sources:
- path: lectures/Module7_14_IsentropicEfficiency_annotated.pdf
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

# M7.14 — Isentropic Efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This slide deck defines isentropic efficiency for turbines and compressors as a component efficiency comparing a real component with a reversible, adiabatic ideal component (p. 2). It gives the two efficiency definitions, typical ranges, and the ideal exit enthalpy $h_{2,s}$ used in component work calculations. Use this card when introducing turbomachinery efficiency or when a student asks why the compressor and turbine definitions are inverted.

## Key ideas

- Isentropic efficiency is a component efficiency; it compares a real component to a reversible/ideal component (p. 2).
- A turbine's purpose is to produce work. A real turbine has entropy generation $\Phi>0$, so it produces less work than an ideal reversible adiabatic turbine: $\eta_{isen,t}=\dot{W}_{real}/\dot{W}_{ideal}<1$, with typical values about 70–90% (p. 4).
- A compressor's goal is to increase enthalpy through work input (p. 5). A non-ideal compressor requires more work than the ideal, so the ratio is inverted: $\eta_{isen,comp}=\dot{W}_{ideal}/\dot{W}_{real}<1$, with typical values about 75–85% (p. 7).
- The slide applies the relation $\dot{m}\Delta h=-\dot{W}$ to write $\dot{W}_{real}=-\dot{m}(h_2-h_1)$ and $\dot{W}_{ideal}=-\dot{m}(h_{2,s}-h_1)$ (p. 7).
- The ideal exit state $2s$ is at the same outlet pressure $P_2$ and has $s_{2,s}=s_1$ (p. 7). For a turbine, $h_{2,s}<h_2$ means less work is extracted in the real turbine; for a compressor, $h_{2,s}<h_2$ means the ideal compressor needs less work input (p. 7).

## Notation used

- $\eta_{isen,t}$: turbine isentropic efficiency.
- $\eta_{isen,comp}$: compressor isentropic efficiency.
- $\dot{W}_{real}$: actual power output/input of the device.
- $\dot{W}_{ideal}$: power for the reversible, adiabatic ideal device.
- $\Phi$: entropy generation from irreversibility.
- $h_{2,s}$: ideal outlet enthalpy obtained with $s_{2,s}=s_1$ at the same $P_2$.

## Examples in this lecture

- Clicker question: Would a non-ideal turbine produce greater than, less than, or the same amount of work as an isentropic turbine? (p. 3). It checks whether students apply the idea that turbine irreversibility reduces work output.
- Clicker question: Would a non-ideal compressor require greater than, less than, or the same amount of work to drive as an isentropic compressor? (p. 6). It checks the compressor-side comparison where irreversibility increases required work.

## What students get wrong here

- The clicker questions target the reversal between turbine and compressor: a real turbine produces less useful work, while a real compressor requires more input work. The efficiency numerator and denominator flip because the useful effect is output work for a turbine but input-work reduction for a compressor (p. 4, p. 7).
- The lecture distinguishes real adiabatic operation from ideal reversible adiabatic operation: real turbines have $\Phi>0$, whereas the ideal isentropic path has $\Delta s=0$ (p. 4).
