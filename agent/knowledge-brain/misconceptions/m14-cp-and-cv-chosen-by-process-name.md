---
id: misc:m14-cp-and-cv-chosen-by-process-name
kind: misconception
title: cp and cv chosen by the name of the process
description: >-
  cv assumed to require a constant-volume process. For an ideal gas du = cv dT and dh = cp dT
  hold for every process, whatever is held constant.
tier: secondary
secondary_to: misc:m03-steady-state-vs-equilibrium
parent: course:me300
unit: unit:u1-concepts-and-ideal-gas-properties
status: draft
audience: both
priority: 0.85
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: [c_p, c_v, u, h, T, k, R]
misconceptions: []
examples: []
items: []
sources:
  - url: https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf
    title: >-
      Rodriguez et al., ASEE 2025, paper 46085 — "Foroushani found that students confused the
      assumption of constant pressure and constant volume processes in energy analyses",
      reported as secondary to primary #3
    retrieved: '2026-09-17'
generated: null
---

# cp and cv chosen by the name of the process

> **Not instructor-checked.** The underlying finding — students confusing constant-pressure and
> constant-volume assumptions in energy analyses — is transcribed from the ASEE 2025 systematic
> review (Foroushani). The specific framing as a $c_p$/$c_v$ selection error, the probe and the
> repair move are this project's, and no instructor has checked them.

## The wrong belief

The subscript tells you when to use it: $c_v$ is for constant-volume processes, $c_p$ is for
constant-pressure processes, and using $c_v$ in a constant-pressure problem is an error.

## Why students hold it

The names say so. $c_v$ is *defined* at constant volume and $c_p$ at constant pressure, and the
step that makes those definitions generalise — that for an ideal gas $u$ and $h$ are functions of
temperature alone — is a one-line argument that goes past quickly and is never notated.

## Diagnostic probe

> An ideal gas is heated at constant pressure from $T_1$ to $T_2$. Write $\Delta u$. Now the
> same gas is heated at constant volume through the same temperatures. Write $\Delta h$. Are
> either of those expressions illegal?

The misconception rejects one or both. The intended answer: $\Delta u = c_v(T_2 - T_1)$ and
$\Delta h = c_p(T_2 - T_1)$, both legal in both cases — for an ideal gas, the process does not
enter.

## Repair move

State the scope rule once and make it the thing being remembered:

> **For an ideal gas, $u$ and $h$ depend on temperature alone.** So $\Delta u = c_v \Delta T$
> and $\Delta h = c_p \Delta T$ hold for **any** ideal-gas process — isobaric, isochoric,
> polytropic, whatever. The subscripts are historical, not instructions.

Then name the assumptions that *do* bind, because this is where the real errors are:

- **Ideal gas.** These expressions do not hold for a saturated mixture or a compressed liquid —
  use the tables.
- **Constant specific heats.** Otherwise integrate, or use the tabulated $u(T)$ and $h(T)$.

And keep the relations that come with them: $c_p - c_v = R$ and $k = c_p/c_v$, both ideal-gas
results.

## Where this shows up in ME 300

Unit 1 (calorific equation of state, lecture 7), then everywhere in Units 3–5. This is the
single most common *assumption* error we expect in first-law arithmetic, which is why equation
cards carry `valid_when: [ideal-gas, constant-specific-heats]` rather than leaving it implied.
