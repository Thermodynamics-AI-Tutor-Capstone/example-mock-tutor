---
id: topic:m7-15-example-isentropic-efficiency
kind: topic
title: M7.15 — Example Isentropic Efficiency
description: 'Works a jet-engine compressor example: uses isentropic efficiency to find actual compressor
  power and exit temperature from an ideal-gas constant-c_p analysis.'
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.15
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify the modeling assumptions for a steady-flow adiabatic compressor with negligible
    kinetic and potential energy changes.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Students can compute the ideal isentropic exit temperature from a pressure ratio using ideal-gas
    constant-specific-heats relations.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can use isentropic efficiency to convert ideal compressor work into actual compressor
    work and actual exit temperature.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can check that a real compressor exit temperature is higher than the isentropic exit
    temperature.
  kc_type: principle
  bloom: analyze
equations:
- eq:compressor-isentropic-efficiency
- eq:ideal-gas-steady-flow-work
- eq:isentropic-ideal-gas-temp-pressure
- eq:steady-flow-energy-adiabatic-single-stream
misconceptions:
- misc:m15-adiabatic-implies-isentropic
examples:
- ex:ee08-explained-example-8-isentropic-efficiency-of-a-ste
- ex:m7-15-example-isentropic-efficiency
items:
- item:exam2-2021-i-3
- item:hw09-1
- item:hw09-2
- item:hw09-5
sources:
- path: lectures/Module7_15_Example_IsentropicEfficiency_annotated.pdf
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

# M7.15 — Example Isentropic Efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This deck works one numerical example for a jet-engine compressor. Air enters at 0.65 atm and 275 K with mass flow 63.5 kg/s, pressure ratio 24:1, and isentropic efficiency 0.94. The task is to find the required compressor power and actual exit temperature. Open when teaching isentropic efficiency of steady-flow devices.

## Key ideas
- The problem is modeled as steady flow, adiabatic, negligible kinetic and potential energy, with air as ideal gas with constant $c_p$; these assumptions reduce the energy balance to $\dot{m}\Delta h = -\dot{W}$ (p. 2).
- The clicker question asks whether steady flow, $\Delta ke=\Delta pe=0$, adiabatic, or all are appropriate (p. 3). The problem statement on p. 2 is consistent with "all of the above," though the slide does not mark an answer.
- For the ideal isentropic compressor, the exit state $2s$ is found from $T_{2s}/T_1 = (P_2/P_1)^{(\gamma-1)/\gamma}$ with $\gamma=1.4$ (p. 5). The slide explicitly corrects the handwritten exponent; the printed note says the exponent is $(\gamma-1)/\gamma$.
- Ideal compression work is $\dot{W}_{ideal} = -\dot{m}c_p(T_{2s}-T_1)$; the lecture uses $c_p=1001$ and gets $-25.8$ MW (p. 5).
- The compressor isentropic efficiency is $\eta_{isen,c} = \dot{W}_{ideal}/\dot{W}_{real}$, so actual work is larger in magnitude: $-27.5$ MW at $\eta=0.94$ (p. 6).
- Actual exit temperature is then determined from actual work, giving $T_2=707.7$ K; the slide checks $T_2>T_{2s}$ (p. 6).

## Notation used
- $\dot{W}_{comp}$, $\dot{W}_{ideal}$, $\dot{W}_{real}$: compressor, ideal, and actual power/work rates.
- $\eta_{isen,c}$: compressor isentropic efficiency.
- $T_{2s}$: exit temperature for isentropic compression between the same inlet state and exit pressure.
- $\gamma$: ideal-gas isentropic exponent, set to 1.4 here.

## Examples in this lecture
- Jet-engine compressor: find power and exit temperature for a given inlet state, pressure ratio, and isentropic efficiency. Demonstrates finding the isentropic state and ideal work, then using efficiency to get actual work and exit temperature.

## What students get wrong here
- The deck has an explicit correction: do not use $\gamma/(\gamma-1)$ in the isentropic pressure-temperature relation; the correct exponent is $(\gamma-1)/\gamma$ (p. 5).
- Do not stop at $T_{2s}$. The actual adiabatic compressor has more work input and a higher exit temperature; the slide checks $T_2 > T_{2s}$ (p. 6).
