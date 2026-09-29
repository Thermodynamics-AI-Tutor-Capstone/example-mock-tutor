---
id: topic:m8-05-rankine-cycle
kind: topic
title: M8.5 — Rankine Cycle
description: 'Introduces the ideal Rankine cycle for steam power plants: pump, boiler, turbine, condenser
  as steady-flow devices, T-s cycle diagrams, and thermal-efficiency expression.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.5
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Identify the four Rankine cycle devices and their sequence in a steam power plant.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: 'Give the ideal process for each device: isentropic pump and turbine processes, isobaric boiler
    and condenser heat transfer.'
  kc_type: fact
  bloom: understand
- id: '#o3'
  text: Apply the steady-flow energy balance to each Rankine component when kinetic and potential energy
    changes are negligible.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Write the cycle thermal efficiency as net work over heat input.
  kc_type: principle
  bloom: understand
equations:
- eq:single-stream-heat-exchanger-energy-balance
- eq:steady-flow-energy-balance
- eq:thermal-efficiency
misconceptions:
- misc:m15-adiabatic-implies-isentropic
examples: []
items:
- item:final-2022-2
- item:final-2022-ii-a
- item:final-2022-ii-g
- item:final-2022-ii-h
- item:final-2022-ii-i
- item:final-2022-ii-j
- item:final-2023-a
- item:final-2023-b
- item:final-2023-c
- item:final-2023-d
- item:final-2023-e
- item:final-2023-f
- item:final-2023-g
- item:final-2023-j
- item:hw10-1
sources:
- path: lectures/Module8_5_RankineCycle_annotated.pdf
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

# M8.5 — Rankine Cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture introduces the ideal Rankine cycle for steam power plants. It moves from photographs and a full plant schematic (p. 2, p. 3) to a simplified four-device cycle diagram (p. 4). The pump, boiler, turbine, and condenser are treated as steady-flow devices, with one simplified energy balance per process (p. 5). The deck asks for the proper cycle efficiency expression (p. 6) and shows normal-ideal and superheated-ideal cycles on $T$–$s$ diagrams (p. 7).

## Key ideas
- The real steam plant has many components (cooling tower, pumps, turbines, condenser, boiler, etc.); the Rankine model reduces it to four: pump, boiler, turbine, condenser (p. 3, p. 4).
- State numbering follows the flow: 1 after condenser/before pump, 2 after pump/before boiler, 3 after boiler/before turbine, 4 after turbine/before condenser (p. 4).
- The ideal processes written on the diagram are: 1–2 isentropic compression, adiabatic and reversible, pump, liquid; 2–3 isobaric heating, boiler, liquid to vapor; 3–4 isentropic expansion, turbine; 4–1 isobaric heat rejection, condenser, back to liquid (p. 4).
- Each device is modelled as steady flow. After neglecting $\Delta ke$ and $\Delta pe$, the slide writes four $\dot{m}\Delta h$ balances: pump and turbine contain work; boiler and condenser contain heat (p. 5).
- Cycle thermal efficiency is $\eta_{th} = \dot{W}_{net}/\dot{Q}_{in}$; the slide circles option B, $\frac{_{1}W_{2}+{}_{3}W_{4}}{_{2}Q_{3}}$ (p. 6).
- On the $T$–$s$ diagrams, the slide draws a “Normal - ideal” cycle with the turbine inlet on the saturation dome and a “Superheated - ideal” cycle with the turbine inlet outside the dome (p. 7). Both cycles are clockwise.

## Notation used
- $\dot{m}$: mass flow rate
- $h$: specific enthalpy; $\Delta h$: enthalpy change across a device
- $ke$, $pe$: specific kinetic and potential energy changes
- $\dot{Q}$, $\dot{W}$: heat transfer rate and power
- $\dot{W}_{net}$, $\dot{Q}_{in}$: net power and heat input rate
- State numbers 1, 2, 3, 4 as above; the deck also writes process quantities such as ${}_1W_2$ and ${}_2Q_3$ (p. 6)

## Examples in this lecture
- Multiple-choice efficiency problem: choose the proper expression for cycle efficiency from three options (p. 6). It demonstrates that the numerator is net work and the denominator is heat added in the boiler, not a single work term or total heat.

## What students get wrong here
- The efficiency question on p. 6 corrects the mistake of using only the turbine work (option A) or including the condenser heat in the denominator (option C); the marked answer is B.
