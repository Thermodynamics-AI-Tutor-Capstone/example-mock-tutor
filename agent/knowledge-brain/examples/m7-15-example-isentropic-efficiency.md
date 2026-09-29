---
id: ex:m7-15-example-isentropic-efficiency
kind: example
title: Isentropic Efficiency of a Jet-Engine Compressor
description: Calculate the required compressor power and actual exit temperature for a jet-engine compressor
  with given inlet state, pressure ratio, mass flow rate, and isentropic efficiency.
parent: topic:m7-15-example-isentropic-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.6
topics:
- topic:m7-15-example-isentropic-efficiency
misconceptions:
- misc:m15-adiabatic-implies-isentropic
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

# Isentropic Efficiency of a Jet-Engine Compressor

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Air enters a multistage compressor of a jet engine at 0.65 atm and 275 K with a flow rate of 63.5 kg/s. The pressure ratio of the compressor is 24:1 and it has an isentropic efficiency of 94%. Determine the power required to drive the compressor and the temperature of the air at the exit.

## Given

- $P_1 = 0.65\ \mathrm{atm}$
- $T_1 = 275\ \mathrm{K}$
- $\dot{m} = 63.5\ \mathrm{kg/s}$
- $P_2/P_1 = 24:1$
- $\eta_{\mathrm{isen}} = 0.94$

## Find

- $\dot{W}_{\mathrm{comp}}$
- $T_2$

## Assume

- steady flow
- $\Delta ke = \Delta pe = 0$
- adiabatic, $\dot{Q} = 0$
- ideal gas with constant $c_p$

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Reduce the steady-flow energy equation for adiabatic operation with negligible kinetic and potential energy changes: $\dot{m}\Delta h = -\dot{W}$, so $\dot{W}_{\mathrm{comp}} = -\dot{m}c_p(T_2 - T_1)$ (p. 2).
2. First solve the ideal isentropic exit state. For an ideal gas with constant specific heats, the slide gives the corrected relation $T_{2s}=T_1\left(\frac{P_2}{P_1}\right)^{(\gamma-1)/\gamma}$; the printed note on the slide corrects the handwritten exponent. With $\gamma=1.4$: $T_{2s}=275(24)^{0.4/1.4}=681.8\ \mathrm{K}$ (p. 5).
3. Compute the ideal compression power: $\dot{W}_{\mathrm{ideal}} = -\dot{m}c_p(T_{2s}-T_1) = -(63.5)(1001)(681.8-275) = -25.8\ \mathrm{MW}$ (p. 5).
4. Use the compressor isentropic efficiency definition $\eta_{\mathrm{isen},c} = \frac{\dot{W}_{\mathrm{ideal}}}{\dot{W}_{\mathrm{real}}}$ to find the actual power: $\dot{W}_{\mathrm{real}} = \frac{\dot{W}_{\mathrm{ideal}}}{\eta_{\mathrm{isen},c}} = \frac{-25.8\ \mathrm{MW}}{0.94} = -27.5\ \mathrm{MW}$ (p. 6).
5. Solve for the actual exit temperature from the real work expression: $\dot{W}_{\mathrm{real}} = -\dot{m}c_p(T_2 - T_1)$, so $T_2 = T_1 - \frac{\dot{W}_{\mathrm{real}}}{\dot{m}c_p} = 275 - \frac{-27.5\times 10^6}{(63.5)(1001)} = 707.7\ \mathrm{K}$ (p. 6).
6. Check the result: for the actual compressor, $T_2 > T_{2s}$ (p. 6).

## Answer

- Power required to drive the compressor: -27.5 MW
- Air temperature at compressor exit: 707.7 K

## What the instructor emphasises

- The steady-flow energy equation simplifies to $\dot{m}\Delta h = -\dot{W}$ for adiabatic flow with negligible kinetic and potential energy changes (p. 2).
- For an ideal gas with constant $c_p$, the isentropic temperature relation is $T_2/T_1 = (P_2/P_1)^{(\gamma-1)/\gamma}$; the slide contains a printed correction warning that the exponent must be $(\gamma-1)/\gamma$, not $\gamma/(\gamma-1)$ (p. 5).
- The isentropic efficiency for a compressor is defined as $\eta_{\mathrm{isen},c} = \dot{W}_{\mathrm{ideal}}/\dot{W}_{\mathrm{real}}$, so the actual compressor requires more work input than the ideal case (p. 6).
- The actual exit temperature is higher than the isentropic exit temperature: $T_2 > T_{2s}$ (p. 6).
