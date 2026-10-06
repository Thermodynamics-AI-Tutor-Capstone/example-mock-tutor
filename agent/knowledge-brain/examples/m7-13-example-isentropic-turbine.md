---
id: ex:m7-13-example-isentropic-turbine
kind: example
title: Isentropic steam turbine flow rate
description: Finds the steam mass flow rate needed for a 25 MW ideal (adiabatic, reversible) turbine using
  the isentropic condition and steam tables.
parent: topic:m7-13-example-isentropic-turbine
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.6
topics:
- topic:m7-13-example-isentropic-turbine
misconceptions:
- misc:m15-adiabatic-implies-isentropic
sources:
- path: lectures/Module7_13_Example_IsentropicTurbine_annotated.pdf
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

# Isentropic steam turbine flow rate

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Determine the flow rate required to produce 25 MW of shaft power from an ideal (adiabatic, reversible) steam turbine in which the steam enters at 10 MPa and 720 K and exits at 5 kPa.

## Given

- $\dot{W}=25$ MW (Page 2)
- $P_1=10$ MPa, $T_1=720$ K (Page 2)
- $P_2=5$ kPa (Page 2)
- Ideal turbine: adiabatic and reversible (Page 2)

## Find

- $\dot{m}$, the steam mass flow rate (Page 2)

## Assume

- Steady flow (Page 2)
- $\Delta ke = \Delta pe = 0$ (Page 2)
- Adiabatic and reversible, so isentropic: $s_2=s_1$ (Page 2)
- S.C.S. (Page 2)

## Sketch

No separate system sketch is shown.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Reduce the single-stream steady-flow energy equation using the assumptions. With adiabatic, $\Delta ke=0$, and $\Delta pe=0$, it becomes $\dot{m}\Delta h = -\dot{W}$, so $\dot{W}=-\dot{m}\Delta h$ and $\dot{m}=-\dot{W}/\Delta h$ (Page 2).
2. Evaluate state 1. At $P_1=10$ MPa and $T_1=720$ K, Table D.2 gives $T_{\text{sat}}=584.15$ K, so $T_1>T_{\text{sat}}$ and state 1 is vapor. Table D.3P gives $h_1=3233.7$ kJ/kg and $s_1=6.4098$ kJ/kg·K (Page 4).
3. Evaluate state 2. At $P_2=5$ kPa and $s_2=s_1=6.4098$ kJ/kg·K, Table D.2 gives $s_f=0.4716$ kJ/kg·K and $s_g=8.4012$ kJ/kg·K. Since $s_f<s_2<s_g$, state 2 is a saturated mixture (Page 5).
4. Calculate the quality at state 2: $x_2=\frac{s_2-s_f}{s_g-s_f}=\frac{6.4098-0.4716}{8.4012-0.4716}=0.749$ (Page 5).
5. Calculate $h_2$ for the mixture: $h_2=x_2h_g+(1-x_2)h_f=(0.749)(2560.15)+(1-0.749)(136.42)=1951.8$ kJ/kg (Page 5).
6. Compute the mass flow rate: $\dot{m}=\frac{-\dot{W}}{h_2-h_1}=\frac{-(25\times10^6)}{(1951.8-3233.7)\times10^3}=19.5$ kg/s (Page 6).

## Answer

- $\dot{m}$: 19.5 kg/s

## What the instructor emphasises

- The ideal turbine assumption is adiabatic plus reversible, which together give $s_2=s_1$; adiabatic alone does not imply isentropic (Page 2).
- For this steady-flow turbine, neglecting kinetic and potential energy changes and heat transfer turns the first law into $\dot{W}=-\dot{m}\Delta h$ (Page 2).
- State 1 is located as superheated vapor by comparing $T_1$ with $T_{\text{sat}}$ at 10 MPa; state 2 is a two-phase mixture because $s_2$ lies between $s_f$ and $s_g$ at 5 kPa (Pages 4-5).
- A non-ideal turbine produces less work than an isentropic turbine between the same states (Page 7).
