---
id: topic:m5-04-energy-conservation
kind: topic
title: M5.4 — Energy Conservation
description: Covers the finite-time first-law energy balance, differential form, work sign convention,
  and adiabatic piston-cylinder compression; open when teaching energy conservation and sign conventions.
parent: unit:m5-energy-heat-work-closed-systems
unit: unit:m5-energy-heat-work-closed-systems
lecture: M5.4
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can state the finite-time energy balance \(\Delta E = \Delta KE + \Delta PE + \Delta
    U = {}_{1}Q_{2} - {}_{1}W_{2}\).
  kc_type: principle
  bloom: remember
- id: '#o2'
  text: Students can interpret the convention that work out is positive with volume increase and work
    in is negative with volume decrease.
  kc_type: fact
  bloom: understand
- id: '#o3'
  text: Students can apply the first law to an adiabatic compression to determine that the system energy
    increases.
  kc_type: skill
  bloom: apply
equations:
- eq:adiabatic-first-law
- eq:boundary-work-integral
- eq:first-law-energy-balance
misconceptions: []
examples:
- ex:ee03-energy-conservation-with-phase-change-in-a-piston
items:
- item:exam1-2021-iii
- item:exam1-2022-conflict-i-3
- item:exam1-2022-conflict-ii-2
- item:exam1-2022-regular-i-3
- item:exam1-2022-regular-ii-2
- item:exam1-2023-i-1
- item:exam1-2023-i-3
- item:hw05-2
- item:hw05-5
sources:
- path: lectures/Module5_4_EnergyConservation_annotated.pdf
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

# M5.4 — Energy Conservation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture develops the finite-time energy-conservation/first-law balance for a system, writes the differential form, sets the sign convention for heat and work, and applies it to an adiabatic piston-cylinder compression.

## Key ideas
- The slide starts from \(\Delta E_{sys}=E_{in}-E_{out}+E_{gen}\), then strikes \(E_{gen}\to 0\), leaving only transfers of heat and work (p. 2).
- Total system energy is split as \(E_{sys}=KE+PE+U\), so the finite-time balance is \(\Delta E_{sys}=\Delta KE+\Delta PE+\Delta U = {}_{1}Q_{2}-{}_{1}W_{2}\) (p. 2).
- In differential form, \(dE_{sys}=\delta Q_{in,net}-\delta W_{out,net}\) (p. 2).
- The lecture records the work sign convention: work out \(W_{out}>0\) with \(d\mathcal{V}>0\), and work in \(W_{in}<0\) with \(d\mathcal{V}<0\) (p. 2).
- If the process is adiabatic, \({}_1Q_2=0\), so \(\Delta E = -{}_1W_2\). For compression the work is negative, so \(\Delta E>0\) (p. 3).
- Boundary work is \({}_1W_2=\int P\,d\mathcal{V}\). When volume decreases, \(d\mathcal{V}<0\), making the work negative (p. 3).
- Therefore, for a piston-cylinder system whose volume decreases adiabatically, the energy in the gas increases (p. 4).

## Notation used
- \(E_{sys}, KE, PE, U\): total system energy, kinetic energy, potential energy, internal energy.
- \({}_1Q_2\): net heat transfer into the system between states 1 and 2.
- \({}_1W_2\): net work transfer out of the system between states 1 and 2.
- \(\mathcal{V}\): total volume; the slide annotates script \(V\).
- \(P\): pressure.

## Examples in this lecture
- The page 4 clicker question: "In a piston-cylinder system, if the volume decreases adiabatically, does this increase or decrease the energy in the gas?" It demonstrates setting \({}_1Q_2=0\) and using the sign of \({}_1W_2\) to conclude \(\Delta E>0\) (p. 3–4).
