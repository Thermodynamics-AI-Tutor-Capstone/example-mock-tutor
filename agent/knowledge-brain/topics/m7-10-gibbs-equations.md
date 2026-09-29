---
id: topic:m7-10-gibbs-equations
kind: topic
title: M7.10 — Gibbs Equations
description: Covers the Gibbs equations of state, derives the Tds relations from the reversible first
  law, and applies them to ideal gases to get entropy-change formulas. Open when teaching entropy changes
  of ideal gases.
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.10
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can recall the internal-energy and enthalpy Gibbs equations in extensive and intensive
    forms.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can derive ideal-gas entropy change equations from Tds relations and ideal-gas property
    relations.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can determine the sign of entropy change for an ideal gas isothermal compression.
  kc_type: skill
  bloom: apply
equations:
- eq:enthalpy-gibbs-equation
- eq:ideal-gas-entropy-change-tp
- eq:ideal-gas-entropy-change-tv
- eq:ideal-gas-entropy-differential-tp
- eq:ideal-gas-entropy-differential-tv
- eq:internal-energy-gibbs-equation
misconceptions:
- misc:m02-entropy-and-the-second-law
- misc:m11-state-function-vs-path-function
examples: []
items:
- item:exam2-2022-i-2a-2d
- item:exam2-2023-i-2
- item:exam2-2023-ii-1
- item:hw08-1
- item:hw08-3
- item:hw08-4
- item:hw08-6
sources:
- path: lectures/Module7_10_GibbsEOS_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
  - 5
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M7.10 — Gibbs Equations

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This deck introduces the Gibbs equations of state, derives the two Tds relations from the reversible first law, and specializes them to ideal gases to obtain entropy-change equations. Open this card when students need to work with entropy changes of pure substances or ideal gases.

## Key ideas

- The slide frames Gibbs equations as state relations, with entropy written as \(s=f(T,P)\) or \(s=f(T,v)\) (p. 2).
- Starting from the first law for a reversible process, \(d\tilde{U}=\delta Q-\delta W\), the reversible substitutions \(\delta Q_{\rm rev}=T\,dS\) and \(\delta W_{\rm rev}=P\,d\mathcal{V}\) give the internal-energy Gibbs equation: \(d\tilde{U}=T\,dS-P\,d\mathcal{V}\), or per unit mass \(du=T\,ds-P\,dv\) (p. 3).
- Using \(H=\tilde{U}+P\mathcal{V}\), the enthalpy form is obtained: \(dH=T\,dS+\mathcal{V}\,dP\), or per unit mass \(dh=T\,ds+v\,dP\) (p. 3). The \(v\,dP\) term has the opposite sign from the \(P\,dv\) term.
- For an ideal gas, substituting \(Pv=RT\), \(du=c_v\,dT\), and \(dh=c_p\,dT\) into the Tds relations gives \(ds=c_v\,dT/T+R\,dv/v\) and \(ds=c_p\,dT/T-R\,dP/P\) (p. 4).
- Assuming constant specific heats and integrating gives the two ideal-gas formulas for \(\Delta s\): one in terms of \(T,v\) and one in terms of \(T,P\) (p. 4).
- In an isothermal process, \(T_2=T_1\), so the \(c_p\ln(T_2/T_1)\) term is zero; if pressure increases, the remaining \(-R\ln(P_2/P_1)\) term is negative, so \(\Delta S<0\) (p. 5).

## Notation used

- \(\tilde{U}\): extensive internal energy; \(u\): specific internal energy
- \(H\) and \(h\): extensive and specific enthalpy
- \(S\) and \(s\): extensive and specific entropy
- \(\mathcal{V}\) and \(v\): total and specific volume
- \(\delta W_{\rm rev}\), \(\delta Q_{\rm rev}\): reversible work/heat interactions in the derivation

## Examples in this lecture

- Clicker: entropy change of an ideal gas during an isothermal pressure increase. Demonstrates using the \(c_p\)-based \(\Delta s\) formula and determining the sign from the pressure term (p. 5).

## What students get wrong here

- The clicker annotation emphasizes the pressure term after the temperature term vanishes: an isothermal compression is not \(\Delta S=0\); it gives \(\Delta S<0\) (p. 5).
