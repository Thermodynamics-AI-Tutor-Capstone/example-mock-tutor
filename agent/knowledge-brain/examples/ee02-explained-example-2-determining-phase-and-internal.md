---
id: ex:ee02-explained-example-2-determining-phase-and-internal
kind: example
title: Explained Example 2 – Determining Phase and Internal Energy of Water
description: Determines phase, internal energy, and internal-energy changes for water at 10 MPa across
  isobaric processes using steam tables, quality, and a T-v diagram.
parent: topic:m4-03-phase-decision-tree
unit: unit:m4-phase-change-and-property-tables
status: auto
audience: both
priority: 0.6
topics:
- topic:m4-03-phase-decision-tree
- topic:m4-04-example-phase-decision-tree
misconceptions:
- misc:m06-temperature-is-internal-energy
sources:
- path: assignments/explained-examples/ME300_Su22_EE2_scan.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Explained Example 2 – Determining Phase and Internal Energy of Water

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Water is a commonly-used fluid for heat transfer applications. Willy Wonka wants to use it for both heating and cooling in the chocolate factory because he's found a secret well outside his factory and he doesn't want to push it with regulators and use a more toxic fluid – he's been busted for too many OSHA violations. Answer the questions below to help Willy Wonka design a unique water system for the factory. Hint – keep track of the states as you go through because you'll draw the whole thing on a T-v diagram at the end.

a) Water comes out of the secret well at 10 MPa and 360 K (State 1). What is the phase of the water and what is its internal energy? Identify the table you used to answer this question.

b) Wonka first uses the water to prepare chocolate for molding – through this machine, the process is isobaric but the temperature of the water drops to 300 K (State 2). What is the change in internal energy during this process?

c) The next machine heats the water in an isobaric process until the mass-specific volume is 0.01 m³/kg (State 3) so he can use it to temper chocolate. What is the phase and temperature of the water? What is the internal energy at this state? Indicate which table you used to answer this question.

d) For the final process, Wonka needs saturated vapor water (State 4) for a new type of bubble gum. How much does he have to change the internal energy to achieve this state? Indicate which table you used to answer this question.

e) Draw these states and processes on a T-v diagram, labeling all states.

## Given

- $P_1 = 10\ \text{MPa}$
- $T_1 = 360\ \text{K}$
- $P_2 = P_1 = 10\ \text{MPa}$
- $T_2 = 300\ \text{K}$
- $P_3 = P_2 = 10\ \text{MPa}$
- $v_3 = 0.01\ \text{m}^3/\text{kg}$
- $x_4 = 1$ (saturated vapor)

## Find

- phase and $u_1$ at State 1
- $u_2 - u_1$
- phase, $T_3$, and $u_3$ at State 3
- $u_4 - u_3$
- T-v diagram with all states labeled

## Assume

- s.c.s. (as handwritten; not expanded in the transcript)
- quasi-stady [?] (as handwritten; unclear in the transcript)

## Sketch

The instructor draws a $T$-$v$ diagram with a saturation dome and a horizontal line through the two-phase region. States 1 and 2 are labeled near the left inside the dome, State 3 is in the middle of the horizontal line, and State 4 is at the saturated-vapor boundary; an arrow points from states 1–2 toward state 3.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. State 1: At $P_1 = 10\ \text{MPa}$, use Table D.2. With $T_1 = 360\ \text{K}$, $T_1 < T_{\text{sat}}$, so the phase is liquid. Table D.1B gives $u_1 = 361.27\ \text{kJ/kg}$. (p. 1)
2. State 2: With $P_2 = P_1 = 10\ \text{MPa}$ and $T_2 = 300\ \text{K}$, Table D.4B gives liquid and $u_2 = 111.74\ \text{kJ/kg}$. Therefore $u_2 - u_1 = 111.74 - 361.27 = -249.53\ \text{kJ/kg}$. (p. 2)
3. State 3: At $P_3 = P_2 = 10\ \text{MPa}$ and $v_3 = 0.01\ \text{m}^3/\text{kg}$, Table D.2 shows $v_f < v_3 < v_g$, so the state is a saturated mixture. Compute quality: $x_3 = \frac{v_3 - v_f}{v_g - v_f} = \frac{0.01 - 0.0014526}{0.018030 - 0.0014526} = 0.52$. Then $u_3 = x_3u_g + (1-x_3)u_f = (0.48)(1393.5) + (0.52)(2545.2) = 1992.4\ \text{kJ/kg}$. (p. 2)
4. State 4: With $P_4 = P_3$ and $x_4 = 1$, Table D.2 gives $u_4 = u_g = 2545.2\ \text{kJ/kg}$. Thus $u_4 - u_3 = 2545.2 - 1992.4 = 552.8\ \text{kJ/kg}$. (p. 2)
5. T-v diagram: Draw the saturation dome and draw a horizontal line through the two-phase region. Place State 1 and State 2 near the left inside/along the line, State 3 in the middle of the line, and State 4 at the saturated-vapor boundary on the right. Add an arrow from states 1–2 toward state 3. (p. 2)

## Answer

- Phase at State 1: liquid
- $u_1$: 361.27 kJ/kg
- $u_2 - u_1$: -249.53 kJ/kg
- Phase at State 3: saturated mixture
- $x_3$: 0.52
- $u_3$: 1992.4 kJ/kg
- $u_4$: 2545.2 kJ/kg
- $u_4 - u_3$: 552.8 kJ/kg
- $T_3$: not explicitly stated in the worked solution K

## What the instructor emphasises

- Determine the phase first (compressed liquid, saturated mixture, or saturated vapor) before choosing the appropriate steam table. (p. 1)
- At a given pressure, compare $T$ with $T_{\text{sat}}$ for liquid/vapor decisions, or compare $v$ with $v_f$ and $v_g$ to identify a saturated mixture. (p. 1, p. 2)
- For a saturated mixture, compute quality from the given specific volume before mixing internal energy: $u = x u_g + (1-x)u_f$. (p. 2)
- Internal-energy changes are computed as final minus initial table values. (p. 2)
- The worked solution identifies State 3 as a saturated mixture but does not record a numerical $T_3$ in the annotated solution. (p. 2)
