---
source: me300/lectures/Module6_9_Example_CompressorsTurbines_annotated.pdf
pages: 5
kind: lecture-example
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Example: Compressors and Turbines

[figure] Title-slide black-and-white photo of a jet-engine fan (blades and spinner cone).

## Page 2
### Compressor
An air compressor running with a constant mass flow rate has the following inlet and exit conditions. Calculate the power required to drive the compressor.

- P1 = 100 kPa
- T1 = 300 K
- Inlet diameter = 0.3 m
- Inlet velocity = 12 m/s
- P2 = 350 kPa
- T2 = 435 K

[figure][handwritten] Compressor sketch: a trapezoid, wide on the left (inlet, state ①) narrowing to the right (exit, state ②). Inlet arrow on the left labelled $T_1$, $P_1$, with a brace on the inlet face labelled $D_1$, $V_1$. Exit arrow on the right labelled $T_2$, $P_2$. A bracket joins the P1 and T1 given values.

[handwritten]
Assume
- steady-flow
- air = ideal gas, $c_p$ = const.
- quasi-eq.
- $\Delta ke = \Delta pe = 0$, $\dot{Q} = 0$

$$\Rightarrow \dot{m}\Delta h = -\dot{W}$$
(small arrows under $\dot{m}$ and $\Delta h$, indicating both must be found)

## Page 3
Which of the following assumptions is ***NOT*** appropriate for this problem?

A. Quasi-equilibrium
B. ΔKE = ΔPE = 0
C. Ideal gas
D. They are all appropriate

[handwritten] A, B and C each ticked ✓; option D circled.

[figure] Photo of a speech-bubble with a question mark on a yellow background.

## Page 4
### Compressor

[handwritten]
$$\rightarrow \Delta h = c_p \Delta T \quad \rightarrow \text{if ideal gas, } c_p = \text{const.}$$
$$\Delta h = c_p(T_2 - T_1)$$
$$= 1001\,(435 - 300)$$
$$\Delta h = 136215\ \frac{\text{J}}{\text{kg}}$$

[transcriber note: $1001 \times 135 = 135135$, not 136215 (136215 corresponds to $c_p = 1009$). Transcribed as written.]

$$\rightarrow \dot{m} = \rho_1 V_1 A_1 \quad \longrightarrow \quad \rho_1 = \frac{P_1}{RT_1} = \frac{100000}{(289)(300)} = 1.153\ \frac{\text{kg}}{\text{m}^3}$$
$$V_1 = 12\ \text{m/s}$$
$$A_1 = \frac{\pi}{4}D_1^2 = 0.071\ \text{m}^2$$
$$= 0.982\ \frac{\text{kg}}{\text{s}}$$

[transcriber note: R is written as "289" [?] (air is usually 287 J/kg·K). Transcribed as read.]

## Page 5
### Compressor

[handwritten]
$$\Rightarrow \dot{m}\Delta h = -\dot{W}$$
$$\dot{W} = -\dot{m}\Delta h$$
$$= -(0.982)(136215)$$

**ANSWER:** $\dot{W} = -133811.6\ \text{W}$
