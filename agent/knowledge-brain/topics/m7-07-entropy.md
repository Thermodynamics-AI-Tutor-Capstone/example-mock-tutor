---
id: topic:m7-07-entropy
kind: topic
title: M7.7 — Entropy
description: Defines entropy as a property; covers classical/statistical meanings, Boltzmann relation,
  reversible heat-transfer entropy change, Clausius inequality, and entropy transport with generation.
  Open for ΔS questions or why adiabatic ≠ isentropic.
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.7
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Explain entropy as a property and distinguish the classical and statistical interpretations.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Use dS = δQ/T for reversible heat transfer to determine the sign or value of an entropy change.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: State and interpret the Clausius inequality and the combined system entropy statement.
  kc_type: principle
  bloom: understand
- id: '#o4'
  text: Apply an entropy transport/balance with entropy generation to account for irreversibilities.
  kc_type: skill
  bloom: apply
equations:
- eq:boltzmann-entropy
- eq:clausius-inequality
- eq:entropy-balance-generation
- eq:entropy-change-reversible-heat
- eq:entropy-increase-isolated
- eq:reversible-heat-temperature-ratio
misconceptions:
- misc:m11-state-function-vs-path-function
- misc:m15-adiabatic-implies-isentropic
- misc:m10-entropy-of-an-isolated-system
- misc:m02-entropy-and-the-second-law
- misc:m08-entropy-is-only-disorder
examples: []
items:
- item:exam2-2021-i-2
- item:exam2-2021-ii-2
- item:exam2-2022-i-2a-2d
- item:exam2-2022-ii-2a-2d
- item:exam2-2023-i-2
- item:exam2-2023-i-3
- item:exam2-2023-ii-1
- item:hw08-1
- item:hw08-2
- item:hw08-3
- item:hw08-5
sources:
- path: lectures/Module7_7_Entropy_annotated.pdf
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

# M7.7 — Entropy

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture introduces entropy as a property. It gives both a classical macroscopic interpretation and a statistical/molecular interpretation, writes the Boltzmann relation, then builds the reversible heat-transfer connection $dS=\delta Q/T|_{\text{rev}}$ and the finite $\Delta S$ integral (p. 3). It states the Clausius inequality for cycles and the combined system statement $dS_{sys}+dS_{surr}\ge 0$ (p. 4). It discusses the sign of $\Delta S$ for heat addition/removal and adiabatic processes (p. 5), then writes an entropy transport/balance with generation from irreversibility (p. 7). A clicker question tests reversible heat removal (p. 6).

## Key ideas
- Entropy is a property: the classical/macro view is a measure of unavailability of thermal energy to do work in a closed system; the statistical/micro view is a measure of available molecular energy states at given $T$ and $P$ (p. 2).
- Boltzmann relation: $S=k \ln \Omega$, with $k$ a constant and $\Omega$ the energy states (p. 2).
- $dS$ is an exact differential and path independent; $\delta Q$ is inexact and path dependent. The relation $dS=\delta Q/T$ is written only for a reversible path, and $T$ is absolute temperature (p. 3).
- For reversible heat transfer, $\delta Q>0$ gives $dS>0$; $\delta Q<0$ gives $dS<0$ (p. 3).
- Finite entropy change is $\Delta S=S_2-S_1=\int_1^2 \delta Q/T|_{\text{rev}}$. For a reversible cycle the cyclic integral is zero, giving $Q_H/T_H=Q_L/T_L$ or $Q_H/Q_L=T_H/T_L$ (p. 3).
- Clausius inequality: $\oint_{\text{cycle}}\delta Q/T \le 0$, with equality if the cycle is reversible; the equivalent combined statement is $dS_{sys}+dS_{surr}\ge 0$ (p. 4).
- Entropy-change sign cases: $\Delta S>0$ is associated with heat addition (reversible or irreversible) and with adiabatic irreversible; $\Delta S<0$ with reversible heat removal; adiabatic reversible gives $\Delta S=0$; irreversibilities generate entropy (p. 5).
- Entropy transport: $\Delta S_{sys}=S_{in}-S_{out}+\Phi$, where $\Phi$ is entropy generation due to irreversibility (p. 7).

## Notation used
- $S$: entropy
- $k$: Boltzmann constant
- $\Omega$: available molecular energy states
- $T$: absolute temperature
- $Q$: heat transfer
- $\Phi$: entropy generation; the slide writes $S_\mathrm{gen}$ for this term (p. 7)

## Examples in this lecture
- Clicker question: “The change in entropy for a reversible heat removal process is which of the following?” with choices $\Delta S>0$, $\Delta S<0$, $\Delta S=0$, not enough information. The annotation circles $Q<0$ and then $\Delta S<0$; this demonstrates applying the reversible heat-transfer sign rule (p. 6).

## What students get wrong here
- Treating $\delta Q/T$ as an exact differential: the annotations emphasize $\delta Q$ is inexact/path dependent while $dS$ is exact/path independent (p. 3).
- Assuming adiabatic means isentropic: the slide connects $\Delta S=0$ to adiabatic reversible and separately notes entropy generated by irreversibilities (p. 5).
- Applying “entropy always increases” to the system alone: use the combined statement $dS_{sys}+dS_{surr}\ge 0$ (p. 4).
