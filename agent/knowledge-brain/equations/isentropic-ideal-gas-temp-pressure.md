---
id: eq:isentropic-ideal-gas-temp-pressure
kind: equation
title: Isentropic ideal-gas T-P relation
description: Use to find the isentropic outlet temperature for compressors, turbines, and expansions/compressions
  of ideal gases.
parent: topic:m7-12-isentropic-relations
unit: unit:m7-second-law-and-entropy
status: auto
audience: both
priority: 0.7
latex: $$\frac{T_2}{T_1} = \left(\frac{P_2}{P_1}\right)^{(\gamma-1)/\gamma}$$
plain_statement: For an ideal gas with constant specific heats and constant entropy, the temperature ratio
  equals the pressure ratio raised to (gamma minus 1)/gamma.
symbols:
- T
- P
valid_when:
- ideal-gas
- constant-specific-heats
- isentropic
invalid_when:
- variable-specific-heats
- irreversible
misconceptions:
- misc:m15-adiabatic-implies-isentropic
sources:
- path: lectures/Module7_12_IsentropicRelations_annotated.pdf
  pages:
  - 2
  - 3
- path: lectures/Module7_15_Example_IsentropicEfficiency_annotated.pdf
  pages:
  - 5
- path: lectures/Module8_9_BraytonCycle_annotated.pdf
  pages:
  - 8
- path: lectures/Module8_10_Example_BraytonCycle_annotated.pdf
  pages:
  - 5
- path: lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
  pages:
  - 10
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# Isentropic ideal-gas T-P relation

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

$$
$$\frac{T_2}{T_1} = \left(\frac{P_2}{P_1}\right)^{(\gamma-1)/\gamma}$$
$$

This relation follows from setting Delta s equal to zero in the ideal-gas T-P entropy equation. The exponent uses gamma = c_p/c_v. It is valid only for an ideal gas with constant specific heats and constant entropy. For real devices, use it to find the ideal state 2s at the actual outlet pressure. If the actual process is irreversible, the actual T2 differs from this formula. A common misuse is applying it to a non-adiabatic or irreversible process without checking the isentropic assumption. Also use absolute temperatures and pressures.

**Taught in:** M7.12 (`topic:m7-12-isentropic-relations`), M7.15 (`topic:m7-15-example-isentropic-efficiency`), M8.9 (`topic:m8-09-brayton-cycle`), M8.10 (`topic:m8-10-example-brayton-cycle`), M8.12 (`topic:m8-12-example-gas-turbine-engines`)
