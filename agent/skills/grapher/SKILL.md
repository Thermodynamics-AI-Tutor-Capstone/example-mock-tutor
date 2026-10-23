---
name: grapher
description: Construct and explain animated thermodynamic Pv, Ts, Ph, Hs, PT and Tv diagrams from the student's problem values, with an ordered exam drawing checklist; use when a student asks how to draw a property diagram or cycle.
---

# Grapher

Starter draft — not reviewed by a thermodynamics instructor.

Use the `grapher` tool for an animated plot and a sequential drawing guide below it. The tool
uses checked property-table data and a fixed Python plotting program. The graph is inserted
automatically; do not copy its fenced block or claim to have drawn it before the tool succeeds.

## Exam drawing order

1. Read the requested diagram, substance, givens, assumptions and process constraints. Obtain
   two independent properties for each state. Ask for missing information; never invent a state.
2. Choose and label the horizontal and vertical axes, including units and any logarithmic scale.
   Here T is °C, P is kPa, v is m³/kg, h/u are kJ/kg and s is kJ/(kg·K).
3. Draw the appropriate phase boundary, mark and label the critical point, then label valid
   phase regions. Saturated liquid is x=0 and saturated vapor is x=1. Quality only applies to
   liquid–vapor mixtures. A P–T graph has a coexistence curve, not a two-phase dome; two qualities
   at the same saturation temperature overlap there. Solid boundaries are outside this dataset.
4. Locate and number the states using verified properties. State the phase and coordinates.
5. Connect them in process order with direction arrows. Explain which property remains fixed,
   and how that appears on the chosen axes. Use `straight` only for a clearly labeled schematic
   connector when the actual path is unknown. A throttling connector is not an equilibrium path.
6. Recheck state labels, arrows, units, phase locations, constant-property constraints and the
   cycle's direction. Distinguish omitted problem information from errors.

The checklist supports exam preparation; it is not a guarantee of marks. Follow the supplied
instructor rubric or diagram convention when available. Do not infer heat/work from an area
without checking the process assumptions. Do not extend or extrapolate beyond supported tables.

## Scope

Current fluids are water and R-134a. Use an explicitly labeled illustrative example if requested,
separate from the student's actual problem. Refer to `property_lookup` and `calculate` for
numerical checks. This tool teaches drawing; it does not assess an uploaded graph. Current
Check my work mode is for written equations and analytical solutions; graph checking is future.
