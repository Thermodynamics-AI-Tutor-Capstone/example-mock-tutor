---
id: ex:ee11-explained-example-11-otto-cycle-analysis
kind: example
title: Explained Example 11 – Otto Cycle Analysis
description: Calculate net work, heat addition, and thermal efficiency for an ideal air-standard Otto
  cycle engine from displacement, compression ratio, intake state, and maximum temperature.
parent: topic:m8-13-otto-cycle
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: both
priority: 0.6
topics:
- topic:m8-13-otto-cycle
misconceptions: []
sources:
- path: assignments/explained-examples/ME300_Su22_EE11.pdf
  pages:
  - 1
  - 2
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Explained Example 11 – Otto Cycle Analysis

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## Problem

The Mazda 3 SkyActiv engine has a volume of $0.002\ \text{m}^3$ and a compression ratio of $13$. Assume the intake temperature is $300\ \text{K}$ and intake pressure is $0.1\ \text{MPa}$, with a maximum cycle temperature of $1500\ \text{K}$. Calculate the net work, heat addition, and thermal efficiency of this engine if it runs an ideal air-standard Otto cycle. Use properties for air: $R=287\ \text{J/kg-K}$ and $\gamma=1.4$.

## Given

- Engine volume/displacement: $\mathcal{V}_{\mathrm{eng}}=\mathcal{V}_1-\mathcal{V}_2=0.002\ \text{m}^3$
- Compression ratio: $r=\mathcal{V}_1/\mathcal{V}_2=13$
- Intake temperature: $T_1=300\ \text{K}$
- Intake pressure: $P_1=0.1\ \text{MPa}=100000\ \text{Pa}$
- Maximum cycle temperature: $T_{\max}=T_3=1500\ \text{K}$
- Air properties: $R=287\ \text{J/kg-K}$ and $\gamma=1.4$

## Find

- $W_{\mathrm{net}}={}_1W_2+{}_3W_4$
- $Q_{\mathrm{in}}={}_2Q_3$
- $\eta_{\mathrm{th}}=W_{\mathrm{net}}/Q_{\mathrm{in}}$

## Assume

- ideal gas
- ideal air-standard Otto cycle
- quasi-steady
- constant mass
- constant specific heats, with $c_v=R/(\gamma-1)$
- Solve for temperatures to obtain work and heat

## Sketch

States are labeled on the cycle: state 1 at intake, state 2 after compression, state 3 after heat addition, and state 4 after expansion; engine displacement is $\mathcal{V}_1-\mathcal{V}_2$.

## Solution, step by step

Reveal one step at a time; let the student attempt each first.

1. List the known state data and governing equations (p. 1): $\mathcal{V}_1-\mathcal{V}_2=0.002\ \text{m}^3$, $r=\mathcal{V}_1/\mathcal{V}_2=13$, $T_1=300\ \text{K}$, $P_1=0.1\ \text{MPa}$, $T_3=1500\ \text{K}$; $W_{\mathrm{net}}={}_1W_2+{}_3W_4$, $Q_{\mathrm{in}}={}_2Q_3$, $\eta_{\mathrm{th}}=W_{\mathrm{net}}/Q_{\mathrm{in}}$.
2. Solve for volumes from displacement and compression ratio (p. 1): $\mathcal{V}_1=13\mathcal{V}_2$; $13\mathcal{V}_2-\mathcal{V}_2=0.002\ \text{m}^3$; $\mathcal{V}_2=0.00017\ \text{m}^3$; $\mathcal{V}_1=0.00217\ \text{m}^3$.
3. Find the mass at state 1 from the ideal gas law (p. 1): $M=P_1\mathcal{V}_1/(R T_1)=(100000)(0.00217)/(287)(300)=0.0025\ \text{kg}$.
4. Find state 2 after isentropic compression (p. 2): $P_2=P_1 r^\gamma=100000(13)^{1.4}=3026775.7\ \text{Pa}$; $T_2=P_2\mathcal{V}_2/(MR)=(3026775.7)(0.00017)/[(0.0025)(287)]=859.3\ \text{K}$.
5. State 3 is the maximum cycle temperature (p. 2): $T_3=1500\ \text{K}$.
6. Find state 4 after isentropic expansion (p. 2): $T_4=T_3(1/r)^{\gamma-1}=1500(1/13)^{0.4}=537.7\ \text{K}$.
7. Compute $c_v$ for constant-specific-heats air (p. 2): $c_v=R/(\gamma-1)=287/0.4=717.5\ \text{J/kg-K}$.
8. Compute the compression and expansion work terms using the first-law expressions given on the page (p. 2): ${}_1W_2=-Mc_v(T_2-T_1)=-(0.0025)(717.5)(859.3-300)=-1003.24\ \text{J}$; ${}_3W_4=-Mc_v(T_4-T_3)=-(0.0025)(717.5)(537.7-1500)=1726.13\ \text{J}$.
9. Net work (p. 2): $W_{\mathrm{net}}={}_1W_2+{}_3W_4$. The page boxes $W_{\mathrm{net}}=772.89\ \text{J}$, but adding the two work terms shown gives $1726.13-1003.24=722.89\ \text{J}$; this appears to be an arithmetic slip in the transcript, and the later efficiency uses $772.89\ \text{J}$.
10. Heat addition at constant volume (p. 3): ${}_2W_3=\int_{\mathcal{V}_2}^{\mathcal{V}_3}P\,d\mathcal{V}=0$ because $\Delta \mathcal{V}=0$; from the first law, ${}_2Q_3=Mc_v(T_3-T_2)=(0.0025)(717.5)(1500-859.3)=1149.26\ \text{J}$.
11. Thermal efficiency (p. 3): $\eta_{\mathrm{th}}=W_{\mathrm{net}}/Q_{\mathrm{in}}=772.89/1149.26=0.673$.

## Answer

- Net work: 772.89 J
- Heat addition: 1149.26 J
- Thermal efficiency: 0.673

## What the instructor emphasises

- The instructor reduces the problem to solving for the four temperatures; once $T_1,T_2,T_3,T_4$ are known, the work and heat terms follow.
- Engine displacement is the difference $\mathcal{V}_1-\mathcal{V}_2$; use it with the compression ratio to find both volumes before using the ideal gas law.
- For constant-volume heat addition, boundary work is zero, so the heat addition equals the change in internal energy.
- For air with constant specific heats, use $c_v=R/(\gamma-1)$.
- The transcript contains small numerical slips: the work terms shown sum to $722.89\ \text{J}$ but the boxed net work and later efficiency use $772.89\ \text{J}$; the heat-addition line shows $1500-857.3$ while the boxed values correspond to $T_2=859.3\ \text{K}$.
