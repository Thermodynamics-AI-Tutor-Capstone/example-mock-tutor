---
id: topic:m2-09-energy-properties
kind: topic
title: M2.9 — Energy Properties
description: Introduces internal energy as molecular translational/rotational/vibrational energy, defines
  enthalpy as H=U+PV, and defines c_v and c_p as partial derivatives; open when students ask what internal
  energy, enthalpy, or specific heat means.
parent: unit:m2-properties-states-and-processes
unit: unit:m2-properties-states-and-processes
lecture: M2.9
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can describe internal energy as molecular energy with translational, rotational, and
    vibrational contributions.
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Students can write enthalpy in extensive, specific, and molar forms and distinguish it from internal
    energy.
  kc_type: fact
  bloom: understand
- id: '#o3'
  text: Students can read the partial-derivative definitions of c_v and c_p and state what is held constant
    in each.
  kc_type: fact
  bloom: understand
- id: '#o4'
  text: Students can identify which internal-energy modes are active for monatomic and diatomic species.
  kc_type: fact
  bloom: remember
equations:
- eq:constant-pressure-specific-heat
- eq:constant-volume-specific-heat
- eq:enthalpy-definition
- eq:internal-energy-decomposition
- eq:translational-internal-energy
misconceptions:
- misc:m16-internal-energy-and-enthalpy-interchangeable
examples: []
items:
- item:exam1-2021-i-2
- item:hw03-6
sources:
- path: lectures/Module2_9_EnergyProperties_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M2.9 — Energy Properties

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This short slide deck introduces internal energy, enthalpy, and specific heat. Open this card when a student needs the definitions of \(u\), \(h\), \(c_v\), and \(c_p\), or needs the molecular-motion picture behind internal energy.

## Key ideas
- Internal energy is associated with the motion of molecules; the slide labels translation, vibration, and rotation as contributions (p. 2).
- The translational contribution is written as \(U_{\mathrm{trans}} = \frac{1}{2} N \mathcal{M} \overline{v^2}\), where \(\overline{v^2}\) is molecular speed squared and \(\mathcal{M}\) is molar mass in kg/kmol (p. 2).
- Molecular-dynamics snapshots show active modes: He gas at \(T=500\ \text{K}\) has translational energy only, while N\(_2\) gas has translational + rotational + bond-stretch vibration (p. 4).
- For a monatomic species, \(U=U_{\mathrm{trans}}\); for a species with multiple modes, \(U=U_{\mathrm{trans}}+U_{\mathrm{rot}}+U_{\mathrm{vib}}\) (p. 4).
- Enthalpy is defined as \(H=U+PV\), with specific form \(h=u+Pv\) and molar form \(\bar{h}=\bar{u}+P\bar{v}\) (p. 5).
- Specific heat is called the capacity of a substance to store energy; \(c_v\) and \(c_p\) are partial derivatives of \(u\) or \(h\) with respect to \(T\) at fixed \(v\) or \(P\), with molar analogs on the same slide (p. 6).
- Units shown are J for \(H\), J/kg for \(h\), J/mol for \(\bar{h}\), and J/kg-K or J/mol-K for specific heats (p. 5, 6).

## Notation used
This lecture uses \(U,u,\bar u\) for internal energy; \(H,h,\bar h\) for enthalpy; \(\mathcal{M}\) for molar mass; \(\overline{v^2}\) for molecular speed squared; \(P,V,v,T\) for pressure, total volume, specific volume, and temperature; and \(c_v,c_p,\bar c_v,\bar c_p\) for specific heats (p. 2, 5, 6).

## Examples in this lecture
The demonstration slide shows molecular-dynamics snapshots of He, N\(_2\), and butylbenzene at \(T=500\ \text{K}\). It is a qualitative demonstration of which internal-energy modes are active in monatomic, diatomic, and complex molecular species, not a worked numerical example (p. 4).
