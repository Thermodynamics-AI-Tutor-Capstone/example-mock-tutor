---
id: topic:m8-13-otto-cycle
kind: topic
title: M8.13 — Otto Cycle
description: 'Introduces the ideal Otto cycle: four-process spark-ignition engine model, P–V and T–s diagrams,
  compression ratio/displacement, and first-law derivation of thermal efficiency.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.13
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can identify the four ideal Otto-cycle processes and associate each with its entropy/volume
    behavior (isentropic compression, isochoric heat addition, isentropic expansion, isochoric heat rejection).
  kc_type: fact
  bloom: understand
- id: '#o2'
  text: Students can compute compression ratio, displacement, net work, and thermal efficiency for the
    ideal Otto cycle using the cycle relations.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can apply the first law with ideal-gas constant-c_v relations to each Otto-cycle process
    and derive the efficiency formula.
  kc_type: principle
  bloom: analyze
equations:
- eq:adiabatic-closed-system-work
- eq:compression-ratio
- eq:constant-volume-heat-addition
- eq:displacement-volume
- eq:ideal-otto-cycle-thermal-efficiency
- eq:reduced-closed-system-energy-balance
misconceptions: []
examples:
- ex:ee11-explained-example-11-otto-cycle-analysis
items:
- item:final-2021-2
- item:hw10-1
- item:hw10-4
sources:
- path: lectures/Module8_13_OttoCycle_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M8.13 — Otto Cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This deck defines the ideal Otto cycle, shows its four processes on an engine schematic and on $P$–$\mathcal{V}$ and $T$–$s$ diagrams, and applies the first law to obtain the ideal thermal efficiency. Use it when a student asks about the Otto-cycle process sequence, compression ratio and displacement, or where $\eta_{th}=1-1/r^{\gamma-1}$ comes from.

## Key ideas
- The ideal Otto cycle is a four-process cycle: 1–2 isentropic compression ($\Delta s = 0$), 2–3 isochoric heat addition ($\Delta v = 0$), 3–4 isentropic expansion ($\Delta s = 0$), and 4–1 isochoric heat rejection (p. 2).
- The slide labels this model as ideal (p. 2).
- The $P$–$\mathcal{V}$ diagram marks bottom dead center $\mathcal{V}_1$ and top dead center $\mathcal{V}_2$; the enclosed area is labeled $\overline{W}_{net}$ (p. 3).
- The $T$–$s$ diagram shows the same four states 1, 2, 3, 4 (p. 3).
- Compression ratio is $r=\mathcal{V}_1/\mathcal{V}_2$; displacement is $d=\mathcal{V}_1-\mathcal{V}_2$ (p. 3).
- For this cycle, net work is the sum of the two work terms: $\overline{W}_{net}={}_1\overline{W}_2+{}_3\overline{W}_4$ (p. 3).
- The cycle thermal efficiency is defined as net work divided by heat added: $\eta_{otto}=({}_1\overline{W}_2+{}_3\overline{W}_4)/{}_2Q_3$ (p. 3).
- With $\Delta KE=\Delta PE=0$, the first law is written $\Delta\overline{U}=Q-W$; applying it to each process with ideal-gas constant-$c_v$ relations gives the work and heat expressions shown on p. 4 (p. 4).
- The resulting ideal-cycle efficiency is $\eta_{th}=1-\frac{1}{r^{\gamma-1}}$ (p. 4).

## Notation used
- $\mathcal{V}_1$, $\mathcal{V}_2$: maximum/minimum cylinder volumes at BDC/TDC (p. 3).
- $r$: compression ratio $r=\mathcal{V}_1/\mathcal{V}_2$; $d$: displacement $d=\mathcal{V}_1-\mathcal{V}_2$ (p. 3).
- Overbarred quantities such as $\overline{W}$ and $\overline{U}$ are used in the analysis (pp. 3–4).
- ${}_1\overline{W}_2$, ${}_2Q_3$, etc.: process work/heat across the named states (pp. 3–4).
- $M$: mass; $c_v$: constant-volume specific heat; $\gamma$: ratio of specific heats (p. 4).

## Examples in this lecture
- Ideal-cycle analysis on p. 4: applying the first law to the four ideal processes and combining the expressions demonstrates the closed-form thermal efficiency $\eta_{th}=1-1/r^{\gamma-1}$; no numerical cycle is worked.
