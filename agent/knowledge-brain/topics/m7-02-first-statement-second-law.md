---
id: topic:m7-02-first-statement-second-law
kind: topic
title: M7.2 — First Statement Second Law
description: Introduces the Kelvin-Planck statement of the second law, defines cyclically-operating and
  reservoir, and uses an isothermal ideal-gas expansion to show a process with Q=W does not violate the
  law.
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.2
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can state the Kelvin-Planck statement of the second law in rate form and explain what
    'cyclically-operating' and 'single reservoir' mean.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Students can distinguish a cyclic heat-to-work impossibility from an allowed non-cyclic process
    such as isothermal ideal-gas expansion.
  kc_type: principle
  bloom: analyze
- id: '#o3'
  text: Students can apply the first law to an isothermal ideal-gas expansion to show that ΔU=0 and Q=W.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can determine the sign of Δu for a liquid-to-vapor phase change using Δu=u_g-u_f.
  kc_type: skill
  bloom: apply
equations:
- eq:ideal-gas-internal-energy-change
misconceptions:
- misc:m02-entropy-and-the-second-law
- misc:m04-heat-always-raises-temperature
examples: []
items:
- item:hw07-4
sources:
- path: lectures/Module7_2_FirstStatementSecondLaw_annotated.pdf
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

# M7.2 — First Statement Second Law

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This deck gives the Kelvin-Planck (first) statement of the second law and explains its two critical qualifiers: "cyclically operating" and "single reservoir." It then stresses that the statement governs cycles, not individual processes, using an isothermal ideal-gas expansion to show that a process can have \(Q=W\) without violating the second law (pp. 2–6). A final clicker question shifts to a liquid-to-vapor internal-energy change (p. 7).

## Key ideas

- Work can be completely converted to heat, but heat cannot be completely and continuously converted to work; heat is tied to temperature/mean molecular velocity while work is directional force times distance (p. 2).
- Kelvin-Planck: it is impossible to construct a cyclically operating device whose sole effect is heat exchange from a single reservoir and creation of the equivalent amount of work (p. 3).
- "Cyclically operating" means continuously; a reservoir is a constant-temperature source or sink of heat (p. 3).
- Statement 1 applies to cycles, not processes (p. 4).
- In the isothermal expansion of an ideal gas, \(\Delta T=0\), so \(\Delta u=c_v\Delta T=0\); with \(\Delta KE=\Delta PE=0\), \(\Delta U=Q-W=0\), hence \(Q=W\), and this process does not violate the second law (p. 6).
- If the fluid changes from saturated liquid to saturated vapor, \(\Delta u=u_g-u_f>0\) (p. 7).

## Notation used

- \(Q, W\): heat transfer and work in the first-law sign convention \(\Delta U=Q-W\) (p. 6).
- \(\dot{Q}_{in}, \dot{W}\): rates of heat input and work output for a continuously operating cycle (p. 3).
- \(u, U\): specific and total internal energy; \(u_g\) and \(u_f\) are saturated-vapor and saturated-liquid internal energies (pp. 6–7).
- \(c_v\): specific heat used in \(\Delta u=c_v\Delta T\) for the ideal-gas example (p. 6).

## Examples in this lecture

- Clicker: determine the change in internal energy for an isothermal ideal-gas expansion with heat in and work out; it demonstrates \(\Delta U=0\) and \(Q=W\) for the process (pp. 5–6).
- Clicker: determine the change in internal energy if the fluid starts as liquid and ends as vapor; it demonstrates \(\Delta u=u_g-u_f>0\) (p. 7).

## What students get wrong here

- The lecture warns against applying the Kelvin-Planck statement to a non-cyclic process. An isothermal expansion can have \(Q=W\) and still not violate the second law because the restriction is about continuous cyclic operation with a single reservoir (pp. 4, 6).
- The isothermal example also corrects the idea that adding heat must always raise temperature: here heat enters, \(\Delta T=0\), \(\Delta u=0\), and the energy leaves as work (p. 6).
