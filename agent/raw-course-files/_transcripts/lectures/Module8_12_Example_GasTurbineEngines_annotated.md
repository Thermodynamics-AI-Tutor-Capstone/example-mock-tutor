---
source: me300/lectures/Module8_12_Example_GasTurbineEngines_annotated.pdf
pages: 14
kind: lecture-example
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Example: Combined Cycle Analysis

[figure] Close-up photo of blue compressor blade rows.

## Page 2
Combined cycle power generation

[figure] Cutaway rendering of a combined-cycle power plant. Red labels: Steam turbine, Generator, Gas Turbine, Air intake, HRSG: Heat recovery steam generator. The generator sits between the steam turbine and the gas turbine on one shaft line; the HRSG is the tall structure behind the building.

[handwritten] The steam turbine is circled.

Sources printed on slide:
https://powergen.gepower.com/products/heavy-duty-gas-turbines/9ha-gas-turbine.html
https://powergen.gepower.com/resources/knowledge-base/combined-cycle-power-plant-how-it-works.html

## Page 3
Combined cycle power generation

[figure] (a) Pictorial schematic: Air and Fuel into the Gas turbine-generator (→ Electricity); gas turbine exhaust "Gas to HRSG (Optional)" with "Bypass flue gas outlet" and "Supplemental fuel" into the Heat recovery steam generator; HRSG exits to Stack → Flue gas; "Super heated steam" from the HRSG to the Steam turbine-generator (→ Electricity); Condenser → Pump → Deaerator and storage → Pump → Feedwater back to the HRSG.
(b) Line schematic: Air, Fuel → Compressor, Combustor, Turbine (Gas turbine-generator, → Electricity); Bypass; Flue gas → Heat recovery steam generator (with Supplemental fuel) → Stack → Exhaust flue gas; Superheated steam → Steam turbine-generator (→ Electricity); Condenser → Pump → Deaerator and storage → Pump → Feedwater back to the HRSG.
Credit: "Boilers," Royaprolu

[handwritten] On (a): a line traced from the gas turbine exit into the HRSG; the steam turbine, the condenser and a pump are circled.

## Page 4
Combined cycle power generation

[figure] Detailed side elevation of an HRSG. Gas enters from the left (large arrow) through the Inlet duct. Numbered components: 1 Distribution grid, 2 Duct burner, 3 Observation port, 4 HP SH, 5 HP Evap, 6 Co catalyst, 7 Inspection grid, 8 SCR, 9 HP Evap, 10 HP Eco, 11 LP SH, 12 DA preheater, 13 LP Evap, 14 HP vent silencer, 15 HP steam drum, 16 Stack, 17 LP steam drum with integral deaerator, 18 LP Vent silencer; also "HP steam outlet", "LP Steam outlet". Bottom zone labels: Inlet duct | Duct burner / Combustion chamber | HP SH+Evap | CO | SCR | HP Evap | HP Eco + LP SH | LP Evap+ LP preheater.

[handwritten] "Duct burner" (item 2) is circled; the inflow arrow and the people (for scale) are underlined.

## Page 5
Example

The Taurus 70 gas turbine has a pressure ratio of 16.5, a mass flow of 26.4 kg/s, and a heat addition rate of 23790 kW. Assume an ideal air standard cycle with T1=300 K and P1=0.1 MPa (R=287 J/kg-K, γ=1.4, cp=1001 J/kg-K). The exhaust from this engine powers an ideal Rankine cycle that runs between 1 MPa and 10 MPa with saturated liquid before the pump and saturated vapor coming out of the boiler. Using this information, calculate:
- The water mass flow rate of the Rankine cycle
- The net work of the combined cycle
- The efficiency of the combined cycle

[figure] Solar Turbines (A Caterpillar Company) "TAURUS 70 Gas Turbine Generator Set – Power Generation" brochure image of the skid-mounted unit; photo of a campus power plant building with a stadium in the background.

[handwritten] Arrows on the Taurus 70 image marking the air inlet and flow path; the generator end circled.

## Page 6
Diagram

[figure] Hand-drawn combined-cycle schematic.
Top (gas turbine): $\dot{m}_{air}$ → comp (inlet $P_1, T_1$; outlet $P_2 = 16.5 P_1$) → two combustor cans (with $\dot{Q}_{in} = 23790$ kW into them) → turb (inlet $P_3 = P_2$; outlet $P_4 = P_1$) → $\dot{m}_{air}$ flows down into the heat exchanger. Label: $\dot{Q}_{out,GT} = -\dot{Q}_{in,ST}$.
Bottom (steam cycle): $\dot{m}_{H_2O}$ → pump (inlet $P_1 = 1$ MPa, $x_1 = 0$; outlet $P_2 = 10$ MPa) → $\dot{m}_{H_2O}$ → heat exchanger → ST (inlet $P_3 = P_2$, $x_3 = 1$; outlet $P_4 = P_1$) → condenser → back to pump. $\dot{m}_{air}$ leaves the bottom of the heat exchanger; a dashed line loops it back to the compressor inlet.

[handwritten]
Find
- : $\dot{m}_{H_2O}$
- : $\dot{W}_{net\,cc} = \dot{W}_{GT} + \dot{W}_{ST}$
- : $\eta_{cc}$

## Page 7
Will the cycle efficiency be higher or lower with combined cycles?

A. Higher

B. Lower

[handwritten]
$$\eta_{cc} = \frac{\dot{W}_{net}}{\dot{Q}_{in}} = \frac{\dot{W}_{GT} + \dot{W}_{ST}}{\dot{Q}_{in}}$$
(arrow pointing at $\dot{Q}_{in}$ labelled "GT")

[figure] Stock image of a speech bubble with a question mark on a yellow background.

## Page 8
Solving strategy

[handwritten]
→ $\dot{W}_{net,cc} = \dot{W}_{GT} + \dot{W}_{ST}$
$\quad = ({}_1\dot{W}_2 + {}_3\dot{W}_4)_{GT} + ({}_1\dot{W}_2 + {}_3\dot{W}_4)_{ST}$

→ $\eta_{cc} = \frac{\dot{W}_{net,cc}}{\dot{Q}_{in}}$

→ $\dot{m}_{ST}$ → $\dot{Q}_{in,ST} = -\dot{Q}_{out,GT}$
$\quad = \dot{m}_{ST}(h_3 - h_2)$
$\quad \Rightarrow \dot{m}_{ST} = \frac{\dot{Q}_{in,ST}}{h_3 - h_2}$

Side notes:
comp, pump, turb: $\Delta ke = \Delta pe = 0$, $\dot{Q} = 0$
$\dot{W} = -\dot{m}\Delta h$
→ air: $\dot{W} = -\dot{m}c_p\Delta T$
→ steam: $\dot{W} = -\dot{m}\Delta h$ (Δh from "tables")

## Page 9
Assumptions

[handwritten]
Brayton
- air standard (ideal gas)
- ideal cycle (rev.)
- $c_p, c_v$ = const
- steady flow

Rankine
- ideal cycle (rev.)
- S.C.S.
- steady flow

## Page 10
Brayton cycle states

[handwritten]
State 1: $T_1 = 300$ K, $P_1 = 0.1$ MPa

State 2: $P_2 = 16.5 P_1 = 1.65$ MPa
$\quad T_2 = T_1 (PR)^{\frac{\gamma-1}{\gamma}} = 300(16.5)^{0.4/1.4} = 668.3$ K

State 3: ${}_2\dot{Q}_3 = 23790 \times 10^3 \text{ W} = \dot{m}_{air}c_p(T_3 - T_2)$
$$T_3 = T_2 + \frac{{}_2\dot{Q}_3}{\dot{m}c_p} = 668.3 + \frac{(23790 \times 10^3)}{(26.4)(1001)} = 1568.5 \text{ K}$$

State 4: $P_4 = P_1 \rightarrow T_4 = T_3 (1/PR)^{\frac{\gamma-1}{\gamma}} = 1568.5(1/16.5)^{0.4/1.4}$
$\quad = 704.1$ K

## Page 11
Work/heat/efficiency of Brayton cycle

[handwritten]
$$\dot{W}_{GT} = {}_1\dot{W}_2 + {}_3\dot{W}_4 = -\dot{m}c_p(T_2 - T_1) - \dot{m}c_p(T_4 - T_3)$$
$$= -(26.4)(1001)\left[(668.3 - 300) + (704.1 - 1568.5)\right]$$
$$= 13110.14 \text{ kW}$$

$\dot{Q}_{in} = 23790$ kW

$$\eta_{GT} = \frac{\dot{W}_{GT}}{\dot{Q}_{in}} = 0.551$$

$$\dot{Q}_{out} = \dot{Q}_{in} - \dot{W}_{net} = -\dot{Q}_{in,ST}$$
$$\dot{Q}_{in,ST} = 10679.86 \text{ kW}$$

[transcriber note: as written, $\dot{Q}_{out} = \dot{Q}_{in} - \dot{W}_{net}$ is the magnitude of the heat rejected (positive 10679.86 kW), and $\dot{Q}_{in,ST}$ is taken as that same positive number; the "$= -\dot{Q}_{in,ST}$" sign convention on this line is not consistent with using the positive value. Transcribed as written.]

## Page 12
Rankine cycle states

[handwritten]
State 1: $P_1 = 1$ MPa, $x_1 = 0$ } Table D.2 → $h_1 = h_f = 762.52$ kJ/kg; $s_1 = s_f = 2.1381$ kJ/kg-K

State 2: $P_2 = 10$ MPa, $s_2 = s_1 = 2.1381$ kJ/kg-K } Table D.2 → $s_2 < s_f$ → liquid; Table D.4B → $h_2 = 773.055$ kJ/kg

State 3: $P_3 = 10$ MPa, $x_3 = 1$ } Table D.2 → $h_3 = h_g = 2725.5$ kJ/kg; $s_3 = s_g = 5.6160$ kJ/kg-K

State 4: $P_4 = 1$ MPa, $s_4 = s_3 = 5.6160$ kJ/kg-K } Table D.2 → $s_f < s_4 < s_g$ → mix
$$x_4 = \frac{s_4 - s_f}{s_g - s_f} = 0.78 \qquad h_4 = x_4 h_g + (1 - x_4)h_f = 2333.89 \text{ kJ/kg}$$

## Page 13
Steam mass flow and work

[handwritten]
$$\dot{m}_{ST} = \frac{\dot{Q}_{in,ST}}{h_3 - h_2} = \frac{10679.86 \text{ kW}}{(2725.5 - 773.055)\ \frac{\text{kJ}}{\text{kg}}} \rightarrow \dot{m}_{ST} = 5.47 \text{ kg/s}$$

$$\dot{W}_{ST} = {}_1\dot{W}_2 + {}_3\dot{W}_4$$
$$= -\dot{m}_{ST}\left[(h_2 - h_1) + (h_4 - h_3)\right] = 2084.5 \text{ kW}$$

## Page 14
Combined cycle work and efficiency

[handwritten]
$$\dot{W}_{cc} = \dot{W}_{GT} + \dot{W}_{ST}$$
$$= 13110.14 + 2084.5 \Rightarrow$$
**ANSWER:** $\dot{W}_{cc} = 15194.62$ kW (boxed)

$$\eta_{cc} = \frac{\dot{W}_{cc}}{\dot{Q}_{in}} = \frac{15194.62}{23790} \Rightarrow$$
**ANSWER:** $\eta_{cc} = 63.87\%$ (boxed)
