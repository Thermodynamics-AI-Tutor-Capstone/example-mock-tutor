---
id: item:exam2-2021-iii-a-e
kind: item
title: Exam 2, problem III.a-e (Summer 2021) — Steady-flow ideal air compressor and boiler analysis
description: 'Exam 2 (Summer 2021), problem III.a-e: Students can list ideal-gas and steady-flow assumptions
  for a compressor and boiler.; Students can compute mass flow from inlet density, area, and velocity.'
parent: topic:m6-01-mass-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: model
priority: 0.5
topics:
- topic:m6-01-mass-conservation
- topic:m6-02-steady-flow-energy-conservation
- topic:m7-12-isentropic-relations
sources:
- path: assignments/exams/exam-2-practice/OConnor_ME300_Exam2_Summer2021_SOLUTIONS.pdf
  pages:
  - 8
  - 9
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: exam2-2021
---

# Exam 2 (Summer 2021), problem III.a-e: Steady-flow ideal air compressor and boiler analysis

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

A factory needs steady high-pressure, heated air for a fabrication process. The factory has an ideal air compressor followed by a boiler. Use the following constant properties of air: $R=287$ J/kg-K, $c_p=1001$ J/kg-K, $\gamma=1.4$. The compressor inlet is state 1: $P_1 = 0.1$ MPa, $T_1 = 300$ K, $A_1 = 0.8$ m$^2$, $V_1 = 150$ m/s. The compressor outlet/boiler inlet is state 2: $P_2 = 3$ MPa. The boiler has heat input $\dot{Q}_{in} = 113$ MW. The boiler outlet is state 3: $P_3 = 3$ MPa. (a) What assumptions must be made about both the working fluid and the devices in this factory in order to solve for the state points? (b) What is the mass flow through the system in kg/s? (c) What is the temperature of the air after the compressor in K? (d) What is the temperature of the air after the boiler in K? (e) What is the change in entropy of the air through the boiler in J/kg-K?

## What it tests

- Students can list ideal-gas and steady-flow assumptions for a compressor and boiler.
- Students can compute mass flow from inlet density, area, and velocity.
- Students can apply the isentropic ideal-gas relation to an ideal compressor.
- Students can apply the steady-flow energy balance to a boiler to find outlet temperature.
- Students can compute entropy change for an isobaric ideal-gas boiler.

## Assumptions the solution expects

- Air is an ideal gas with constant $c_p$ and $c_v$.
- Compressor is steady-flow, $\Delta ke = \Delta pe = 0$, adiabatic ($\dot{Q}=0$), and reversible/ideal.
- Boiler is steady-flow, $\Delta ke = \Delta pe = 0$, and no work ($\dot{W}=0$).

## Where students go wrong

- Using $P_1$ in MPa without converting to Pa when calculating $\rho_1 = P_1/(R T_1)$.
- Missing that ideal plus adiabatic compressor means the process is isentropic, so $T_2 = T_1(P_2/P_1)^{(k-1)/k}$.
- Using $k \neq 1.4$ for the air isentropic relation.
- Including a pressure-ratio term in the boiler entropy change; since $P_3 = P_2$, the $R\ln(P_3/P_2)$ term is zero.
- Using $c_v$ instead of $c_p$ in the boiler energy balance or entropy expression.
- Failing to convert $\dot{Q}_{in}=113$ MW to W before dividing by $\dot{m} c_p$.
- Treating the total heat transfer rate as a specific heat transfer rather than dividing by mass flow.
- Forgetting to use the inlet density $\rho_1$ when computing mass flow from $V_1 A_1$.

## How it is graded

Part (a) 5 pts for listed assumptions. Part (b) 6 pts: mass-flow formula, density calculation, and final mass flow. Part (c) 6 pts: ideal/adiabatic gives isentropic, isentropic relation, and final temperature. Part (d) 6 pts: steady-flow boiler energy balance and final temperature. Part (e) 7 pts: isobaric entropy relation, substitution, and final value.

## Final answers (hidden — for checking only)

- $\dot{m}$: 139.2 kg/s
- $T_2$: 792.79 K
- $T_3$: 1603.8 K
- $\Delta s_{boiler}$: 705.28 J/(kg-K)
