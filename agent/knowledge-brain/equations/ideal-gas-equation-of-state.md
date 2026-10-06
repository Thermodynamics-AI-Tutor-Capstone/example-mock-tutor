---
id: eq:ideal-gas-equation-of-state
kind: equation
title: Ideal gas equation of state
description: Use whenever the ideal-gas model applies to relate pressure, volume/mole, and temperature.
parent: topic:m3-01-ideal-gas-p-v-t
unit: unit:m3-ideal-and-nonideal-gases
status: auto
audience: both
priority: 0.7
latex: Pv = RT, \quad P = \rho RT, \quad P\mathcal{V} = MRT, \quad P\mathcal{V} = NR_uT, \quad P\bar{v}
  = R_uT
plain_statement: For an ideal gas, pressure times volume equals mass or moles times the gas constant times
  absolute temperature.
symbols:
- P
- v
- \rho
- R
- T
- \mathcal{V}
- M
- R_u
valid_when:
- ideal-gas
invalid_when:
- incompressible
- compressed-liquid
- saturated-mixture
misconceptions:
- misc:m06-temperature-is-internal-energy
sources:
- path: lectures/Module2_4_Example_ProcessesCycles_annotated.pdf
  pages:
  - 4
  - 6
- path: lectures/Module3_1_IdealGasPvT_annotated.pdf
  pages:
  - 5
  - 7
- path: lectures/Module3_2_Example1_IdealGasPvT_annotated.pdf
  pages:
  - 8
- path: lectures/Module3_3_Example2_IdealGasPvT_annotated.pdf
  pages:
  - 4
  - 5
- path: lectures/Module3_5_Example_IdealGasCalorific_annotated.pdf
  pages:
  - 2
  - 4
- path: lectures/Module3_6_NonIdealGases_annotated.pdf
  pages:
  - 3
- path: lectures/Module3_7_GeneralizedCompressibility_annotated.pdf
  pages:
  - 2
- path: lectures/Module4_1_PhaseChange_annotated.pdf
  pages:
  - 2
- path: lectures/Module5_3_Example_Work_annotated.pdf
  pages:
  - 3
- path: lectures/Module5_7_Example3_EnergyConservation_annotated.pptx
  slides:
  - 5
- path: lectures/Module6_9_Example_CompressorsTurbines_annotated.pdf
  pages:
  - 4
- path: lectures/Module8_2_Example_StirlingEngine_annotated.pdf
  pages:
  - 2
- path: lectures/Module8_15_Example_DieselCycle_annotated.pdf
  pages:
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Ideal gas equation of state

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
Pv = RT, \quad P = \rho RT, \quad P\mathcal{V} = MRT, \quad P\mathcal{V} = NR_uT, \quad P\bar{v} = R_uT
$$

This is the ideal-gas equation of state. In the mass-specific form, P is absolute pressure, v is specific volume, R is the gas-specific constant, and T is absolute temperature. The total-mass form uses total volume V and mass M; the mole form uses N and the universal gas constant R_u; the molar-specific form uses molar volume v-bar. The density form is P = rho R T. Temperature must be absolute. Apply only when the ideal-gas model is valid; do not apply to compressed liquid or saturated mixtures. When mass is fixed and R is constant, the two-state ratio form follows.

**Also written in the lectures as:**

- $P\mathcal{V} = M R T$
- $Pv = \overline{R}T$
- $\rho = \frac{P}{R T}$

**Taught in:** M2.4 (`topic:m2-04-example-processes-cycles`), M3.1 (`topic:m3-01-ideal-gas-p-v-t`), M3.2 (`topic:m3-02-example-1-ideal-gas-p-v-t`), M3.3 (`topic:m3-03-example-2-ideal-gas-p-v-t`), M3.5 (`topic:m3-05-example-ideal-gas-calorific`), M3.6 (`topic:m3-06-non-ideal-gases`), M3.7 (`topic:m3-07-generalized-compressibility`), M4.1 (`topic:m4-01-phase-change`), M5.3 (`topic:m5-03-example-work`), M5.7 (`topic:m5-07-example-3-energy-conservation`), M6.9 (`topic:m6-09-example-compressors-turbines`), M8.2 (`topic:m8-02-example-stirling-engine`), M8.15 (`topic:m8-15-example-diesel-cycle`)
