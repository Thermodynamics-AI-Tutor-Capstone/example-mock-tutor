---
id: topic:m8-15-example-diesel-cycle
kind: topic
title: M8.15 — Example Diesel Cycle
description: 'Worked example of the air-standard ideal Diesel cycle: find net work, heat added during
  combustion, and thermal efficiency using compression ratio, cutoff ratio, displacement, ideal-gas and
  isentropic relations.'
parent: unit:m8-power-and-refrigeration-cycles
unit: unit:m8-power-and-refrigeration-cycles
lecture: M8.15
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can compute the unknown temperature and pressure at all four Diesel-cycle states from
    the given compression and cutoff ratios.
  kc_type: skill
  bloom: apply
- id: '#o2'
  text: Students can compute the boundary work and heat transfer for each Diesel-cycle process using the
    first law and ideal-gas relations.
  kc_type: skill
  bloom: apply
- id: '#o3'
  text: Students can combine process results to obtain net work, heat addition, and thermal efficiency.
  kc_type: skill
  bloom: apply
equations:
- eq:boundary-work-integral
- eq:closed-cycle-net-work
- eq:constant-pressure-heat-addition
- eq:ideal-gas-equation-of-state
- eq:ideal-gas-internal-energy-change
- eq:isentropic-ideal-gas-pressure-volume
- eq:isobaric-boundary-work
- eq:reduced-closed-system-energy-balance
- eq:thermal-efficiency
misconceptions: []
examples:
- ex:m8-15-example-diesel-cycle
items: []
sources:
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
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

# M8.15 — Example Diesel Cycle

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This annotated slide deck works one numerical air-standard ideal Diesel cycle problem. Given compression ratio, cutoff ratio, displacement, inlet temperature, and inlet pressure, it calculates net work, heat added during combustion, and thermal efficiency (pp. 2–6).

## Key ideas

- The problem assumes air is an ideal gas with constant specific heats, the processes are quasi-steady and reversible, and \(\Delta KE = \Delta PE = 0\). The strategy is to split the cycle into four processes and apply \(W_{net}={}_1W_2+{}_2W_3+{}_3W_4+{}_4W_1\), \(W=\int P\,d\mathcal{V}\), \(\Delta U=Q-W\), \(Q_{in}={}_2Q_3\), and \(\eta=W_{net}/Q_{in}\) (p. 2).
- State 1 and state 2 are connected by isentropic compression. The slide uses \(P_1\mathcal{V}_1=MRT_1\), \(\mathcal{V}_1-\mathcal{V}_2=0.002\ \mathrm{m^3}\), and \(\mathcal{V}_1/\mathcal{V}_2=18\) to obtain \(\mathcal{V}_1=0.00212\ \mathrm{m^3}\), \(\mathcal{V}_2=0.00012\ \mathrm{m^3}\), and \(M=0.00246\ \mathrm{kg}\). It then finds \(P_2=5,719,808\ \mathrm{Pa}\) and \(T_2=972.2\ \mathrm{K}\) (p. 3).
- State 3 is at the same pressure as state 2. The cutoff ratio \(\mathcal{V}_3/\mathcal{V}_2=2.37\) gives \(\mathcal{V}_3=0.00028\ \mathrm{m^3}\), and the ideal-gas law gives \(T_3=2268.4\ \mathrm{K}\) (p. 4).
- State 4 is reached by isentropic expansion back to \(\mathcal{V}_4=\mathcal{V}_1\). The slide gets \(P_4=336,149.5\ \mathrm{Pa}\) and \(T_4=1009.4\ \mathrm{K}\) (p. 4).
- Process work: \({}_1W_2=-1180.7\ \mathrm{J}\), \({}_2W_3=P_2(\mathcal{V}_3-\mathcal{V}_2)=915.17\ \mathrm{J}\), and \({}_3W_4=2211.4\ \mathrm{J}\), so \(W_{net}=1946.4\ \mathrm{J}\) (p. 5).
- Heat added and efficiency: \({}_2Q_3=M c_v(T_3-T_2)+{}_2W_3=3191.9\ \mathrm{J}\), and \(\eta_{th}=W_{net}/Q_{in}=0.61\) (p. 6).

## Notation used

- \(\mathcal{V}\): total volume; subscripts 1–4 denote states in the cycle.
- \(M\): mass of air in the cylinder. The transcript uses uppercase \(M\); the problem statement gives displacement in \(\mathrm{m^3}\).
- Pre-subscripts like \({}_1W_2\) and \({}_2Q_3\) denote process quantities from state 1 to 2 and state 2 to 3.
- \(k\): isentropic exponent, used as \(1.4\) for air.
- \(\eta_{th}\): thermal efficiency.

## Examples in this lecture

- Air-standard Diesel cycle with compression ratio 18, cutoff ratio 2.37, displacement 0.002 m\(^3\), intake \(T_1=300\ \mathrm{K}\), and \(P_1=0.1\ \mathrm{MPa}\). Demonstrates finding states from geometric ratios and ideal-gas/isentropic relations, then calculating each process work/heat and the cycle net work and efficiency (pp. 2–6).
