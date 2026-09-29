---
id: topic:m5-06-example-2-energy-conservation
kind: topic
title: M5.6 — Example 2 Energy Conservation
description: 'Worked example: H2O in a rigid tank is cooled from 500 K and 1 MPa to 400 K; the heat removed
  is found using the closed-system energy balance and steam tables. Open for quantitative phase-change
  energy-balance tutoring.'
parent: unit:m5-energy-heat-work-closed-systems
unit: unit:m5-energy-heat-work-closed-systems
lecture: M5.6
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can apply the closed-system energy balance to a rigid-tank cooling process with negligible
    kinetic and potential energy changes.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can determine the phase of water from temperature/pressure and temperature/specific-volume
    table data.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can calculate mass, quality, and mixture internal energy from total volume and specific-volume
    data.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can compute heat transfer from mass and specific internal-energy change in a constant-volume
    closed system.
  kc_type: skill
  bloom: apply
equations:
- eq:first-law-energy-balance
- eq:heat-transfer-from-specific-internal-energy
- eq:mass-specific-volume
- eq:quality-from-specific-volume
- eq:two-phase-internal-energy-mixing-rule
misconceptions: []
examples:
- ex:m5-06-example-2-energy-conservation
items: []
sources:
- path: lectures/Module5_6_Example2_EnergyConservation_annotated.pptx
  slides:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M5.6 — Example 2 Energy Conservation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture walks through a closed-system energy-balance example. Water in a rigid 0.15 m³ tank starts at 500 K and 1 MPa and is cooled to 400 K; the goal is to find the heat removed (p. 2). The solution uses the first law with zero boundary work, steam-table property lookup, and a saturated-mixture analysis (pp. 4, 7, 8).

## Key ideas
- The tank is rigid and closed, so the process is constant-volume and boundary work is zero: ${}_1W_2=0$ (p. 2).
- With $\Delta KE=\Delta PE=0$ and no work, the energy balance becomes $\Delta U = {}_1Q_2$; heat transfer equals the change in internal energy (p. 4).
- For fixed mass and fixed total volume, specific volume remains fixed: $v_2=v_1$. Mass is found from $M=\mathcal{V}/v_1$ (pp. 4, 8).
- The lecture includes a check question on assumptions; the subsequent solution uses property tables rather than the ideal-gas model because the final state is a two-phase mixture (p. 3; p. 8).
- State 1 is superheated vapor because $T_1=500\ \mathrm{K}$ is greater than $T_{\text{sat}}$ at $1\ \mathrm{MPa}$ (p. 5, p. 7). From tables, $v_1=0.22064\ \mathrm{m^3/kg}$, $u_1=2670.6\ \mathrm{kJ/kg}$, and $M=0.6798\ \mathrm{kg}$ (p. 7).
- State 2 has $T_2=400\ \mathrm{K}$ and $v_2=0.22064\ \mathrm{m^3/kg}$. Table lookup gives $v_f<v_2<v_g$, so it is a saturated mixture (p. 6, p. 8).
- Quality and mixture internal energy are $x_2=(v_2-v_f)/(v_g-v_f)$ and $u_2=xu_g+(1-x)u_f$; the computed values are $x_2=0.3011$ and $u_2=1135.9\ \mathrm{kJ/kg}$ (p. 8).
- Finally, ${}_1Q_2=M(u_2-u_1)=0.6798(1135.9-2670.6)=-1043.3\ \mathrm{kJ}$ (p. 8). The negative sign means heat is removed from the water.

## Notation used
- $\mathcal{V}$: total volume, $\mathrm{m^3}$ (p. 2)
- ${}_1Q_2$, ${}_1W_2$: process heat and work (p. 4)
- $M$: mass; $v$: specific volume; $u$: specific internal energy (p. 4, p. 7)
- Subscripts $f,g$: saturated liquid and saturated vapor (p. 8)
- $x$: quality (p. 8)

## Examples in this lecture
- H2O in a rigid tank: given $T_1=500\ \mathrm{K}$, $P_1=1\ \mathrm{MPa}$, $T_2=400\ \mathrm{K}$, and $\mathcal{V}=0.15\ \mathrm{m^3}$, find the heat removed. Demonstrates combining closed-system energy balance, constant-volume mass calculation, phase determination, and mixture internal-energy evaluation (pp. 2, 7, 8).

## What students get wrong here
- Using the ideal-gas model for water when the problem can cross the vapor dome. The lecture includes a check question on inappropriate assumptions, and the worked solution uses property tables (p. 3; p. 8).
- Forgetting that a rigid, closed tank keeps specific volume constant even though temperature and pressure change. The solution uses $v_2=v_1$ to identify State 2 (p. 8).
- Going straight to superheated-vapor tables at the final temperature. At $T_2=400\ \mathrm{K}$ and fixed $v$, the table indicates a saturated mixture, so quality must be computed before $u_2$ can be found (pp. 6, 8).
