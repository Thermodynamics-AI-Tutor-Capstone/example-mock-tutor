---
id: topic:m7-08-example-entropy
kind: topic
title: M7.8 — Example Entropy
description: 'Worked reversible Carnot-cycle example: given Q_in=6 kJ, T_H=900 K, T_L=300 K, find thermal
  efficiency, Q_out, and working-fluid entropy changes for each process and the cycle.'
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.8
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can compute the thermal efficiency of a reversible Carnot cycle from the reservoir temperatures.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can calculate Q_out for a reversible cycle using the Carnot heat ratio or the cycle first
    law.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can evaluate the entropy change of the working fluid for each reversible process in the
    cycle and show that the cycle sum is zero.
  kc_type: skill
  bloom: apply
equations:
- eq:carnot-efficiency
- eq:entropy-change-reversible-heat
- eq:heat-engine-energy-balance
- eq:reversible-heat-temperature-ratio
misconceptions:
- misc:m02-entropy-and-the-second-law
examples:
- ex:m7-08-example-entropy
items:
- item:exam2-2022-i-2a-2d
- item:exam2-2023-ii-1
- item:hw08-5
sources:
- path: lectures/Module7_8_Example_Entropy_annotated.pdf
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

# M7.8 — Example Entropy

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This short deck works a reversible Carnot cycle example. The cycle has reversible isothermal heat addition, reversible adiabatic expansion, reversible isothermal heat removal, and reversible adiabatic compression. Given $Q_{\text{in}}=6\ \text{kJ}$, $T_H=900\ \text{K}$, and $T_L=300\ \text{K}$, the example asks for thermal efficiency, $Q_{\text{out}}$, and the entropy change of the working fluid for each process (p. 2). Open this card when a tutor needs to explain how Carnot efficiency and the entropy-change integral are applied to a four-process reversible cycle.

## Key ideas
- A reversible Carnot cycle between 900 K and 300 K has $\eta_{\text{th}} = 1 - T_L/T_H = 1 - 300/900 = 2/3 = 67\%$ (p. 2-3).
- The cycle first law is $Q_{\text{in}} = W_{\text{net}} + Q_{\text{out}}$. With $W_{\text{net}} = \eta_{\text{th}} Q_{\text{in}} = (2/3)(6) = 4\ \text{kJ}$, energy balance gives $Q_{\text{out}} = 6 - 4 = 2\ \text{kJ}$ (p. 3).
- The same $Q_{\text{out}}$ is obtained from the reversible Carnot heat ratio $Q_L/Q_H = T_L/T_H$, so $Q_L = 6(1/3) = 2\ \text{kJ}$ (p. 3).
- For process 1-2, $\Delta S = \int \delta Q/T|_{\text{rev}} = 6000/900 = 6.67\ \text{kJ/K}$; for process 3-4, $\Delta S = -2000/300 = -6.67\ \text{kJ/K}$; the adiabatic legs have $\Delta S = 0$ (p. 4).
- The sum around the working-fluid cycle is zero: $\sum_{\text{cycle}}\Delta S = 0$, consistent with entropy being a property and the fluid returning to its initial state (p. 4).
- The handwritten note assumes quasi-equilibrium for evaluating the reversible entropy integral (p. 2).
- The final slide asks for the entropy change of the entire cycle as a multiple-choice question (p. 5).

## Notation used
- $T_H$, $T_L$: hot and cold reservoir absolute temperatures (p. 2).
- $Q_{\text{in}}$, $Q_{\text{out}}$ or $Q_H$, $Q_L$: heat added to and rejected by the cycle (p. 2-3).
- $W_{\text{net}}$: net work output of the cycle (p. 2-3).
- $\eta_{\text{th}}$: thermal efficiency (p. 2-3).
- $\Delta S$: entropy change of the working fluid (p. 2-4).
- $\delta Q/T|_{\text{rev}}$: entropy transfer along an internally reversible path (p. 2-4).

## Examples in this lecture
- Reversible Carnot cycle with $Q_{\text{in}}=6\ \text{kJ}$, $T_H=900\ \text{K}$, $T_L=300\ \text{K}$: find $\eta_{\text{th}}$, $Q_{\text{out}}$, and $\Delta S$ for each process. Demonstrates combining Carnot relations, first-law bookkeeping, and entropy-change integrals over a complete reversible cycle (p. 2-4).
