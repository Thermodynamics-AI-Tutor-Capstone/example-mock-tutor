---
id: ex:ee07-explained-example-7-isentropic-expansion
kind: example
title: Explained Example 7 – Isentropic Expansion
description: Steam expands isentropically from 500 K and 2 MPa to saturated vapor; find final steam T
  and P, draw the T-s process, and find the air final temperature at the same final pressure.
parent: topic:m7-12-isentropic-relations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.6
topics:
- topic:m7-12-isentropic-relations
- topic:m7-13-example-isentropic-turbine
misconceptions: []
sources:
- path: assignments/explained-examples/ME300_Su22_EE7.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Explained Example 7 – Isentropic Expansion

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

Steam expands isentropically from a starting temperature of 500 K and pressure of 2 MPa to a saturated vapor. Determine the final temperature and pressure of the fluid at the end of the process, and draw this process on a T-s diagram. What would the final temperature be if air, starting at the same temperature and pressure, ended at the same final pressure? Assume the following properties for air: $c_p=1000$ J/kg-K and $c_v=714.29$ J/kg-K. (p. 1)

## Given

- Steam initial state: $T_1 = 500$ K, $P_1 = 2$ MPa (p. 1).
- Steam final state: saturated vapor, $x_2 = 1$ (p. 1).
- Process: isentropic, $s_2 = s_1$ (p. 1).
- Air properties: $c_p = 1000$ J/kg-K, $c_v = 714.29$ J/kg-K (p. 1).

## Find

- Final steam temperature $T_2$ and pressure $P_2$ (p. 1).
- Final air temperature $T_2$ when air ends at the steam final pressure (p. 1 and Page 2).

## Assume

- Isentropic expansion: $s_2 = s_1$ (p. 1).
- Steam ends as saturated vapor: $x_2 = 1$ (p. 1).
- H2O is S.C.S. as written in the notes (p. 1).
- Air is ideal (p. 1).
- Quasi-steady (p. 1).

## Sketch

The instructor draws a T-s diagram with temperature on the vertical axis and entropy on the horizontal axis. A saturation dome is drawn; the isentropic process is a dashed vertical line from state 1 above the dome down to state 2 on the saturated-vapor branch, labelled $s_2=s_1$ (p. 2).

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. Given steam state 1: $T_1=500$ K and $P_1=2$ MPa. From Table D.2, at $P_1=2$ MPa, $T_1>T_{\text{sat}}$, so state 1 is superheated vapor (p. 1).
2. Read the initial entropy from the superheated steam table, Table D.3K: $s_1 = 6.4205$ kJ/(kg·K) (p. 1).
3. State 2 is saturated vapor, so $x_2=1$, and the process is isentropic, so $s_2=s_1=6.4205$ kJ/(kg·K). In the saturation table, Table D.1, $s_2=s_g$ and lies between $T_a=470$ K and $T_b=475$ K (p. 1).
4. Interpolate for the steam final temperature: $$T_2 = \left(\frac{s_2-s_a}{s_b-s_a}\right)(T_b-T_a)+T_a = \left(\frac{6.4205-6.4538}{6.4164-6.4538}\right)(475-470)+470 = 473.615\ \text{K}.$$ (p. 1)
5. Interpolate for the steam final pressure using the neighboring saturation pressures $P_a = 1.455$ MPa and $P_b = 1.6116$ MPa: $$P_2 = \left(\frac{s_2-s_a}{s_b-s_a}\right)(P_b-P_a)+P_a = \left(\frac{6.4265-6.4538}{6.4164-6.4538}\right)(1.6116-1.455)+1.455 = 1.573\ \text{MPa}.$$ (p. 2)
6. Draw the T-s diagram: the isentropic expansion is a vertical line on T-s coordinates from the superheated-vapor state 1 to the saturated-vapor state 2 on the dome; label the line $s_2=s_1$ (p. 2).
7. For air, use the ideal-gas constant-specific-heat isentropic relation: $$T_2 = T_1\left(\frac{P_2}{P_1}\right)^{(\gamma-1)/\gamma}, \qquad \gamma=\frac{c_p}{c_v}=\frac{1000}{714.29}=1.4.$$ Substituting $T_1=500$ K, $P_2=1.573$ MPa, and $P_1=2$ MPa: $$T_2 = 500\left(\frac{1.573}{2}\right)^{0.4/1.4} = 466.84\ \text{K}.$$ (p. 2)

## Answer

- Final steam temperature: 473.615 K
- Final steam pressure: 1.573 MPa
- Final air temperature: 466.84 K

## What the instructor emphasises

- Check the phase before choosing a property table: at $P_1=2$ MPa the given $T_1$ is above $T_{\text{sat}}$, so state 1 is superheated vapor (p. 1).
- For isentropic expansion ending at saturated vapor, equate $s_2=s_1=s_g$, then interpolate in the saturation table for both $T_2$ and $P_2$ (p. 1 and Page 2).
- On a T-s diagram, an isentropic process is a vertical line; here the process goes from the superheated-vapor region down to the saturated-vapor dome (p. 2).
- For air as an ideal gas, use $\gamma=c_p/c_v$ in the isentropic relation and use the steam final pressure for the air final pressure (p. 2).
