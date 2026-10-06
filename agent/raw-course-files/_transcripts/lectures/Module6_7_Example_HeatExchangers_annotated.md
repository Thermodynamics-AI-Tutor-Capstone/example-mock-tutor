---
source: me300/lectures/Module6_7_Example_HeatExchangers_annotated.pdf
pages: 5
kind: lecture-example
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Example: Heat Exchangers

[figure] Title-slide photo of a brass faucet handle labelled "HOT".

## Page 2
### Example: Heat exchanger
Water is heated by air in a heat exchanger. The water enters at 150 C and 0.2 MPa and leaves at 300 C and 0.2 MPa. The mass flow rate of the water is 1 kg/s. The air enters at 350 C and 0.1 MPa at a rate of 2 kg/s. Determine the heat-transfer rate between the two fluids and the exit temperature of the air.

[handwritten] Given, in four columns:

H₂O:
- $T_1 = 150\,^\circ\text{C}$
- $P_1 = 0.2\ \text{MPa}$
- $T_2 = 300\,^\circ\text{C}$
- $P_2 = 0.2\ \text{MPa}$
- $\dot{m}_{H_2O} = 1\ \text{kg/s}$

Air:
- $T_1 = 350\,^\circ\text{C}$
- $P_1 = 0.1\ \text{MPa}$
- $\dot{m}_{air} = 2\ \text{kg/s}$

Find:
- $\dot{Q}$
- $T_{2,air}$

Assume:
- steady-flow
- H₂O → S.C.S. [?] (abbreviation as written; meaning not stated)
- air → ideal gas
- $\Delta ke = \Delta pe = 0$, $\dot{W} = 0$
- quasi-equilibrium

[handwritten] Energy balance, with $\Delta ke$, $\Delta pe$ and $\dot{W}$ each crossed out and marked 0:
$$\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$$
$$\dot{m}\Delta h = \dot{Q}$$

## Page 3
Which of the following assumptions is ***NOT*** appropriate for the water?

A. Quasi-equilibrium
B. ΔKE = ΔPE = 0
C. Ideal gas
D. They are all appropriate

[handwritten] "water" is underlined; option C (Ideal gas) is circled.

[figure] Photo of a speech-bubble with a question mark on a yellow background.

## Page 4
### Example: Heat exchanger

[handwritten]
Water: $P_1 = 0.2\ \text{MPa}$, $T_1 = 150\,^\circ\text{C} = 423\ \text{K}$ } NIST

D.2 → $T_{sat}$ @ 0.2 MPa $= 393\ \text{K} < T_1$

$\Rightarrow h_1 = 2768.8\ \text{kJ/kg}$

State 2: $P_1 = 0.2\ \text{MPa}$ (written "P₁" although this is state 2)
$T_2 = 300\,^\circ\text{C} = 573\ \text{K}$

$\Rightarrow h_2 = 3071.8\ \dfrac{\text{kJ}}{\text{kg}}$

(Right side, bracketed from the state work:)
$$\dot{m}\Delta h = \dot{Q}$$
$$\dot{Q} = \dot{m}(h_2 - h_1)$$
$$= (1)(3071.8 - 2768.8)$$
(with a check of units: ✓ kJ/kg)

**ANSWER:** $\dot{Q} = 303\ \text{kW}$

## Page 5
### Example: Heat exchanger

[handwritten]
$$\dot{Q}_{H_2O} = -\dot{Q}_{air} \Rightarrow \dot{Q}_{air} = -303\ \text{kW}$$
$$\Rightarrow \dot{m}(h_2 - h_1) = \dot{Q}_{air} \quad \text{— ideal, const. } c_p$$
$$\dot{m}c_p(T_2 - T_1) = \dot{Q}_{air}$$
$$T_2 = T_1 + \frac{\dot{Q}_{air}}{\dot{m}c_p} = 623 + \frac{(-303000)}{(2)(1001)}$$

**ANSWER:** $T_2 = 477.4\ \text{K}$

[transcriber note: with the numbers as written, $623 - 303000/2002 \approx 471.7$ K, not 477.4 K; the denominator "1001" could also be read as another cp value [?], but no reading reproduces 477.4 exactly. Transcribed as written.]
