---
id: topic:m3-04-ideal-gas-calorific
kind: topic
title: M3.4 — Ideal Gas Calorific
description: 'Defines internal energy, enthalpy, and specific heats, then gives ideal-gas calorific equations
  of state: u=u(T), h=h(T), and the Δu/Δh integral/constant-c_p forms. Open when students ask when Δu=c_vΔT
  is valid.'
parent: unit:m3-ideal-and-nonideal-gases
unit: unit:m3-ideal-and-nonideal-gases
lecture: M3.4
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Distinguish total, specific, and molar internal energy and enthalpy using the notation U, u, \bar{u},
    H, h, \bar{h}.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Write the enthalpy definitions H=U+P\mathcal{V}, h=u+Pv, and \bar{h}=\bar{u}+P\bar{v}.
  kc_type: fact
  bloom: remember
- id: '#o3'
  text: Use the specific-heat definitions c_v=(\partial u/\partial T)_v and c_p=(\partial h/\partial T)_P.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: For an ideal gas, evaluate finite changes Δu and Δh from c_v(T) and c_p(T), including the constant-specific-heat
    forms Δu=c_vΔT and Δh=c_pΔT.
  kc_type: skill
  bloom: apply
equations:
- eq:constant-specific-heat-ideal-gas-changes
- eq:enthalpy-definition
- eq:finite-ideal-gas-changes-variable-specific-heats
- eq:ideal-gas-calorific-equations-of-state
- eq:ideal-gas-differential-calorific-relations
- eq:specific-heat-definitions
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
examples: []
items:
- item:exam1-2022-conflict-i-3
- item:exam1-2022-regular-i-3
- item:hw04-1
sources:
- path: lectures/Module3_4_IdealGasCalorific_annotated.pdf
  pages:
  - 1
  - 2
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M3.4 — Ideal Gas Calorific

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This deck gives the calorific side of the ideal-gas equation of state. It defines internal energy, enthalpy, and specific heats, then uses the ideal-gas simplification $u=u(T)$, $h=h(T)$ to get differential and finite $\Delta u$ and $\Delta h$ relations.

## Key ideas
- The deck distinguishes total, specific, and molar properties by their units: $U$ [J], $u$ [J/kg], $\bar{u}$ [J/mol], and $H,h,\bar{h}$ similarly (p. 2).
- Enthalpy is a defined property, not the same as internal energy: $H = U + P\mathcal{V}$, $h = u + Pv$, $\bar{h} = \bar{u} + P\bar{v}$ (p. 2).
- Specific heats are defined as temperature derivatives at fixed $v$ or fixed $P$: $c_v = \left(\partial u/\partial T\right)_v$, $c_p = \left(\partial h/\partial T\right)_P$ (p. 2).
- The annotation writes $u = u(T,v)$ for S.C.S.; if ideal gas, the underlined result is $u = u(T)$ and $h = h(T)$ (p. 3).
- For an ideal gas, the partial derivatives become ordinary derivatives: $du = c_v(T)\,dT$, $dh = c_p(T)\,dT$ (p. 3).
- Finite changes are integrals when the specific heats depend on temperature: $\Delta u = \int_{T_1}^{T_2} c_v(T)\,dT$, $\Delta h = \int_{T_1}^{T_2} c_p(T)\,dT$ (p. 3).
- If the specific heats are constant, labeled \"calorically perfect gas\" on the slide, these reduce to $\Delta u = c_v \Delta T$ and $\Delta h = c_p \Delta T$ (p. 3).

## Notation used
- $U$ total internal energy; $u$ specific internal energy; $\bar{u}$ molar internal energy
- $H$ total enthalpy; $h$ specific enthalpy; $\bar{h}$ molar enthalpy
- $\mathcal{V}$ total volume; $v$ specific volume; $\bar{v}$ molar volume
- $c_v$ constant-volume specific heat; $c_p$ constant-pressure specific heat
- $T$ temperature; $P$ pressure
