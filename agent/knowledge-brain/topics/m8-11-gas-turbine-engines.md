---
id: topic:m8-11-gas-turbine-engines
kind: topic
title: M8.11 — Gas Turbine Engines
description: 'Open this card when teaching gas turbine engine configurations and their steady-flow station
  analysis: turbojets, turbofans, augmented turbofans, bypass ratio, overall pressure ratio, and the diffuser/nozzle
  energy relation.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.11
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify the main components and flow path of turbojet and turbofan engines.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Students can define bypass ratio and overall pressure ratio from the station diagram.
  kc_type: fact
  bloom: understand
- id: '#o3'
  text: Students can apply the energy balance to a diffuser or nozzle as Δh + Δke = 0.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can trace engine stations 1 through 6 and their process roles in the cycle.
  kc_type: fact
  bloom: understand
equations:
- eq:bypass-ratio
- eq:nozzle-diffuser-energy-balance
- eq:overall-pressure-ratio
- eq:steady-flow-energy-balance
misconceptions: []
examples:
- ex:ee10-turbojet-engine-turbine-exit-temperature
items:
- item:final-2021-d
sources:
- path: lectures/Module8_11_GasTurbineEngines_annotated.pdf
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

# M8.11 — Gas Turbine Engines

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This deck introduces gas turbine engine hardware before reducing a jet engine to station-by-station cycle analysis. It covers turbojets, high-bypass turbofans, augmented turbofans, the station numbering used for cycle analysis, and the use of the energy balance for the inlet diffuser and exhaust nozzle.

## Key ideas

- A turbojet is divided into cold and hot sections: intake/compressor, then combustor/turbine/exhaust; the flow is compressed, burned, expanded through a turbine, and leaves at high velocity (p. 2).
- A turbofan adds a fan-driven bypass stream around the core; the handwritten note defines bypass ratio as $\dot{m}_{bypass}/\dot{m}_{core}$ and annotates the value 12 (p. 3).
- Turbofan hardware shown includes fan blade, spinner, high-pressure compressor, combustor, high-pressure turbine, low-pressure turbine, and low-pressure compressor/booster (p. 3). Later labels add inlet, dual-spool compressor, fuel injection, thrust reverser, exhaust nozzle, and the annotation nacelle/diffuser (p. 4).
- An augmented turbofan includes an augmentor/afterburner section in addition to the fan and core components (p. 5).
- The cycle sketch numbers stations 1–6: 1–2 inlet diffuser, velocity decreases; 2–3 fan plus compressor, enthalpy increases; 3–4 combustor with heat in; 4–5 turbine delivering work out to drive the compressor and fan; 5–6 nozzle (p. 6).
- The schematic $P$–$\mathcal{V}$ diagram follows compression from 1 through 3, constant-pressure heat addition 3–4, expansion from 4 through 6, and constant-pressure return 6–1 (p. 6).
- The overall pressure ratio is defined as $\mathrm{OPR}=P_3/P_1$ on the station diagram (p. 6).
- The energy balance written with mass flow rate is $\dot{m}(\Delta h+\Delta ke+\Delta pe)=\dot{Q}-\dot{W}$, and for the diffuser/nozzle the slide reduces it to $\Delta h+\Delta ke=0$ (p. 7).

## Notation used

- Station numbers 1–6 for inlet, fan/compressor, combustor, turbine, and nozzle locations (p. 6).
- $\mathrm{OPR}$: overall pressure ratio, $P_3/P_1$ (p. 6).
- $\dot{m}_{bypass}$, $\dot{m}_{core}$: bypass and core mass flow rates in a turbofan (p. 3).
- $h$, $ke$, $pe$, $\dot{Q}$, $\dot{W}$: specific enthalpy, kinetic energy, potential energy, heat transfer rate, and work rate in the energy balance (p. 7).
