---
id: topic:m5-07-example-3-energy-conservation
kind: topic
title: M5.7 — Example 3 Energy Conservation
description: 'Worked closed-system cycle example for air: isobaric 1-2, isochoric 2-3, isothermal 3-1;
  calculates P, v, T, Q, W, ΔU, net work, and thermal efficiency.'
parent: unit:m5-energy-heat-work-closed-systems
unit: unit:m5-energy-heat-work-closed-systems
lecture: M5.7
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: 'Recall the assumptions appropriate to this closed air-cycle calculation: quasi-equilibrium, negligible
    kinetic and potential energy changes, and ideal gas.'
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Draw the three-process cycle on a P-v diagram and label the states and process paths.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Calculate state volumes and pressures using the ideal gas law for the fixed mass of air.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Apply the closed-system energy balance and boundary work expressions to find ΔU, W, and Q for
    each process.
  kc_type: skill
  bloom: apply
- id: '#o5'
  text: Determine net cycle work and thermal efficiency from the process results.
  kc_type: skill
  bloom: apply
- id: '#o6'
  text: Explain why the isothermal ideal-gas process gives ΔU = 0 and W = Q.
  kc_type: principle
  bloom: understand
equations:
- eq:boundary-work-integral
- eq:ideal-gas-equation-of-state
- eq:ideal-gas-internal-energy-change
- eq:isobaric-boundary-work
- eq:isochoric-boundary-work
- eq:isothermal-ideal-gas-boundary-work
- eq:net-cycle-work
- eq:reduced-closed-system-energy-balance
- eq:thermal-efficiency
misconceptions:
- misc:m13-work-read-off-a-pv-diagram
examples:
- ex:m5-07-example-3-energy-conservation
items:
- item:exam1-2021-iii
sources:
- path: lectures/Module5_7_Example3_EnergyConservation_annotated.pptx
  slides:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
  - 9
  - 10
  - 11
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M5.7 — Example 3 Energy Conservation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This lecture walks through a numerical closed-system cycle example: a fixed 1 kg mass of air undergoes 1→2 isobaric heat addition, 2→3 isochoric heat removal, and 3→1 isothermal heat removal (Slide 2). The goal is to find P, v, and T at each state, then use the first law and boundary work integrals to get Q, W, and ΔU for every process and the cycle efficiency.

## Key ideas

- The stated assumptions—quasi-equilibrium, negligible kinetic and potential energy changes, and ideal gas—are all appropriate here (Slide 3).
- The P-v diagram has a horizontal constant-pressure line 1→2, a vertical constant-volume line 2→3, and an isothermal curve 3→1 back to state 1; T1 = T3 (Slide 4).
- For states 1 and 2, the ideal gas law gives total volumes as \(\mathcal{V} = MRT/P\); the numbers give 0.431 m³ and 1.148 m³ (Slide 5).
- Process 1→2 is isobaric. Boundary work is \(P(\mathcal{V}_2-\mathcal{V}_1)=143400\) J, and ΔU from \(M c_v ΔT\) is 360000 J; the first law gives \({}_1Q_2 = 503400\) J (Slides 5–6).
- Process 2→3 is isochoric, so \({}_2W_3=0\). ΔU = -360000 J and the heat removed is \({}_2Q_3 = -360000\) J (Slide 7).
- Process 3→1 is isothermal ideal-gas compression. ΔU = 0, so \({}_3Q_1={}_3W_1\). Because volume decreases, the work is negative; the log expression gives \({}_3W_1 = -84344.5\) J (Slides 8–10).
- For the cycle, the net work is the sum of the three process works, and thermal efficiency is net work over the heat added in process 1→2; the result is 0.12 or 12% (Slide 11).

## Notation used

- \(M\): fixed mass of air, given as 1 kg.
- \(\mathcal{V}\): total volume, used in the work integrals and ideal-gas relation.
- \(R\): specific gas constant for air, 287 J/kg·K.
- \(c_v\): constant-volume specific heat, used as 720 J/kg·K in the ΔU calculation on Slide 6.
- \({}_iW_f\) and \({}_iQ_f\): work and heat for a process from state \(i\) to state \(f\); pre-subscripts identify the endpoints.
- \(\eta_{th}\): thermal efficiency of the cycle.

## Examples in this lecture

Example 3 (Slides 2–11): Given \(T_1=300\;\mathrm{K}\), \(P_1=0.2\;\mathrm{MPa}\), \(T_2=800\;\mathrm{K}\), \(M=1\;\mathrm{kg}\), \(R=287\;\mathrm{J/kg\cdot K}\), and \(c_v=720\;\mathrm{J/kg\cdot K}\), find all states, process energies, and cycle efficiency. It demonstrates drawing a P-v cycle, computing volumes from the ideal gas law, applying the closed-system energy balance, integrating boundary work, and assembling cycle performance.

## What students get wrong here

- The deck explicitly checks the sign of boundary work for process 3–1 (Slide 9). A common mistake is to give positive work for a compression. The annotation corrects it by noting \(d\mathcal{V}<0\), so \({}_3W_1<0\) (Slide 10).
- Students may also forget that the vertical constant-volume path does zero boundary work; the lecture labels \(\int_2^3 P\,d\mathcal{V}=0\) on the sketch (Slide 7).
