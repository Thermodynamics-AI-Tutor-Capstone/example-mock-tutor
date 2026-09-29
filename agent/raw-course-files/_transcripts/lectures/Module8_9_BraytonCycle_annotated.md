---
source: me300/lectures/Module8_9_BraytonCycle_annotated.pdf
pages: 8
kind: lecture-slides
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Brayton Cycle

[figure] Photo of the front of a turbofan jet engine (fan blades and spinner visible).

## Page 2
Power generation gas turbines

[figure] Schematic of a gas-turbine power plant. Labels: Oil Storage, Natural Gas Line (both feeding fuel lines under the floor to the combustion chambers), Air Intake, Compressor, Combustion Chambers, Turbine, Exhaust, Generator, Transformer. Air enters at the intake, passes through the compressor, combustion chambers and turbine on a common shaft, exits through the exhaust stack; the shaft drives the generator, which feeds the transformer.

[handwritten] "Compressor", "Combustion Chambers" and "Generator" are underlined.

## Page 3
Power generation gas turbines

[figure] Photo of a large industrial gas turbine on a transport trailer, caption "400MW (MEGAWATT) GAS TURBINE". People standing next to it for scale.

[handwritten] "combustor" with an arrow pointing to one of the combustor cans around the casing; the shaft end is circled; arrows drawn showing air entering at the inlet (front) and flowing axially through the machine and out the back.

## Page 4
Power generation gas turbines

[figure] Cutaway rendering of a heavy-duty power-generation gas turbine: multi-stage axial compressor, can combustors arranged around the casing, turbine stages, exhaust. Caption: "Heavy Frame".

[handwritten] Flow-path line drawn from the inlet through the compressor, up into a combustor can (circled), back down and through the turbine stages and out the exhaust. A combustor can in the lower half is also circled.

## Page 5
Power generation gas turbines

[figure] Cutaway drawing of an aircraft-derived gas turbine. Caption: "Aeroderivative".

[handwritten] Labels: "comp" over the compressor section; "comb" with the combustor circled; "turb" over the first (high-pressure) turbine stages; "turb" over the rear (power) turbine stages.

## Page 6
Brayton cycle

[handwritten] – ideal

Air standard
- ↳ air working fluid
- ↳ air ideal gas
  - → $c_v, c_p$ const, $\gamma = \frac{c_p}{c_v}$
- ↳ treat cycle as closed
- ↳ combustion = heat addition

$\frac{P_2}{P_1}$ = overall pressure ratio "OPR"

1-2: isentropic comp. – compressor
2-3: isobaric heat in – combustor
3-4: isentropic expansion – turbine
4-1: isobaric heat rejection – ???

[figure] P–V diagram (P vertical, script V = total volume horizontal): state 2 at high P / small V, horizontal line 2→3 at constant high pressure to state 3; curve 3→4 expanding down to state 4 at low P, large V; horizontal line 4→1 at low pressure back leftward to state 1; curve 1→2 compressing up to state 2. Arrows show the cycle direction 1→2→3→4→1.

[figure] T–s diagram (T vertical, s horizontal): 1→2 vertical line up (isentropic), 2→3 rising curve to the right (constant-pressure heat addition) to the highest point 3, 3→4 vertical line down (isentropic), 4→1 curve down and left back to 1 (constant-pressure heat rejection).

## Page 7
Cycle analysis

[handwritten]
$$\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$$

1-2: compressor $\quad \dot{m}(h_2 - h_1) = -{}_1\dot{W}_2 \;\rightarrow\; \dot{m} c_p (T_2 - T_1) = -{}_1\dot{W}_2$

2-3: combustor $\quad \dot{m}(h_3 - h_2) = {}_2\dot{Q}_3 \;\rightarrow\; \dot{m} c_p (T_3 - T_2) = {}_2\dot{Q}_3$

3-4: turbine $\quad \dot{m}(h_4 - h_3) = -{}_3\dot{W}_4 \quad \ldots$

4-1: .... $\quad \dot{m}(h_1 - h_4) = {}_4\dot{Q}_1$

## Page 8
Efficiency

[handwritten]
$$\eta_{th} = \frac{\dot{W}_{net}}{\dot{Q}_{in}} = \frac{{}_1\dot{W}_2 + {}_3\dot{W}_4}{{}_2\dot{Q}_3} = \frac{(T_2 - T_1) + (T_4 - T_3)}{T_3 - T_2}$$

(annotations above the numerator: "< 0" over ${}_1\dot{W}_2$, "> 0" over ${}_3\dot{W}_4$)

[transcriber note: as written, the temperature form has the opposite sign of the work form; from page 7, ${}_1\dot{W}_2 + {}_3\dot{W}_4 = -\dot{m}c_p[(T_2 - T_1) + (T_4 - T_3)]$, so the numerator should carry a leading minus sign. Transcribed as written.]

→ $T_1 P_1^{\frac{1-\gamma}{\gamma}} = T_2 P_2^{\frac{1-\gamma}{\gamma}}$ (arrow drawn from this relation up to the temperature expression)

$$\eta_{th} = 1 - \left(\frac{P_2}{P_1}\right)^{\frac{1-\gamma}{\gamma}}$$

(squiggle under $\frac{P_2}{P_1}$) OPR ↑, $\eta_{th}$ ↑
