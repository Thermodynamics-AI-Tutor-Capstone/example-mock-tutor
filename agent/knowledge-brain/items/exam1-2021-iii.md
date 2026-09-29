---
id: item:exam1-2021-iii
kind: item
title: Exam 1, problem III (Summer 2021) — Solar Stirling cycle air analysis
description: 'Exam 1 (Summer 2021), problem III: Students can convert solar irradiance, area, and time
  into heat energy.; Students can apply the first law to an isochoric heat-addition process.'
parent: topic:m3-01-ideal-gas-p-v-t
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: model
priority: 0.5
topics:
- topic:m3-01-ideal-gas-p-v-t
- topic:m5-04-energy-conservation
- topic:m5-07-example-3-energy-conservation
sources:
- path: assignments/exams/exam-1-practice/OConnor_ME300_Exam1_Summer2021_Solutions.pdf
  pages:
  - 8
  - 9
  - 10
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: exam1-2021
---

# Exam 1 (Summer 2021), problem III: Solar Stirling cycle air analysis

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Part III: Analysis (30 points). The story: Stirling engines powered by the sun have been built for power generation in remote areas. In these systems, a working fluid is heated by a solar concentrator in the second step of the four step cycle:

- Process 1-2: Isothermal compression
- Process 2-3: Isochoric heat addition
- Process 3-4: Isothermal expansion
- Process 4-1: Isochoric heat rejection

In our Stirling engine, we're going to use air as our working fluid ($R=287$ J/kg-K and $c_v=714$ J/kg-K) and assume that 10 kg of air is trapped in a piston-cylinder device, undergoing the Stirling cycle.

a) List the assumptions you'll need to solve for the state points as well as the first law quantities (heat, work, change in internal energy). *Enter these in the Canvas quiz — you do not need to also write them on the page.*

b) Let's start with the heat transfer step (Process 2-3). The average global solar irradiance from the sun is 1000 W/m$^2$ — this is the power that the sun delivers to the Earth in the form of heat. Assuming the solar collector area is 10 m$^2$, how much heat does the sun deliver to the cycle if Process 2-3 takes 5 minutes? What is the temperature after this heat addition step? Hint: this question is, in part, about units — if you don't know how to solve this immediately, analyze the units. *Enter these values in the Canvas quiz.*

c) Use the state points below to solve for the remainder of the states (P in [kPa], $\mathcal{V}$ in [m$^3$], and T in [K]). Note: if you were unable to solve part b, solve the problem symbolically for partial credit. *Enter these values in the Canvas quiz.*

| State | Pressure [kPa] | Volume [m$^3$] | Temperature [K] |
|---|---|---|---|
| 1 | 120005.23 | 7.653 | 320 |
| 2 | 1200052.3 | 0.7653 | 320 |
| 3 | 2775758.4 | 0.7653 | Use your value from part b |
| 4 | 277575.84 | 7.653 | 740.17 |

d) What is the net work of the cycle? *Enter this value in the Canvas quiz.*

## What it tests

- Students can convert solar irradiance, area, and time into heat energy.
- Students can apply the first law to an isochoric heat-addition process.
- Students can compute ideal-gas state properties using $P\mathcal{V} = mRT$.
- Students can calculate isothermal boundary work and net cycle work.

## Assumptions the solution expects

- Air is an ideal gas
- Closed system (10 kg air trapped in piston-cylinder)
- Quasi-equilibrium processes
- $\Delta KE = \Delta PE = 0$

## Where students go wrong

- Unit error in computing $Q$: forgetting to convert minutes to seconds or W to J/s
- Forgetting ${}_2W_3=0$ for the isochoric heat-addition step
- Using $c_p$ instead of $c_v$ for constant-volume internal energy change
- Not using ideal-gas law $P = mRT/\mathcal{V}$ for the states
- Forgetting that $T_1=T_2$ and $T_3=T_4$ for the cycle
- Sign error in isothermal compression work vs expansion work
- Omitting that constant-volume process work terms are zero
- Arithmetic error in summing the four work terms

## How it is graded

Solution rewards assumptions, unit-based heat calculation, isochoric first-law relation $M c_v \Delta T = Q$, ideal-gas state calculations, and summing all four process works. Some table/arithmetic entries are overwritten/uncertain in the handwritten solution.

## Final answers (hidden — for checking only)

- $Q_{2-3}$: 3 MJ
- $T_3$: 740.17 K
- $P_1$: 120005.23 Pa
- $\mathcal{V}_1$: 7.653 m$^3$
- $T_1$: 320 K
- $P_2$: 1200052.3 Pa
- $\mathcal{V}_2$: 0.7653 m$^3$
- $T_2$: 320 K
- $P_3$: 2775758.4 Pa
- $\mathcal{V}_3$: 0.7653 m$^3$
- $P_4$: 277575.84 Pa
- $\mathcal{V}_4$: 7.653 m$^3$
- $T_4$: 740.17 K
- ${}_1W_2 + {}_2W_3 + {}_3W_4 + {}_4W_1$: 2770659.5 J
