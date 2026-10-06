---
source: me300/lectures/Module7_15_Example_IsentropicEfficiency_annotated.pdf
pages: 6
kind: lecture-example
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Example:
Isentropic
Efficiency

[figure] Photo of a cut-away turbocharger (title-slide decoration).

## Page 2
Compressor example

Air enters a multistage compressor of a jet engine at 0.65 atm and 275 K with a flow rate of 63.5 kg/s. The pressure ratio of the compressor is 24:1 and it has an isentropic efficiency of 94%. Determine the power required to drive the compressor and the temperature of the air at the exit.

[handwritten] ("Air" is underlined)

Given:
- $P_1 = 0.65$ atm
- $T_1 = 275$ K
- $\dot{m} = 63.5$ kg/s
- $P_2/P_1 = 24{:}1$
- $\eta_{isen} = 0.94$

Find: $\dot{W}_{comp}$ ✓, $T_2$ ✓

Assume:
- steady-flow
- $\Delta ke = \Delta pe = 0$
- $\dot{Q} = 0$
- ideal gas, const $c_p$

$$\Rightarrow \dot{m}\,\Delta h = -\dot{W}$$
$$\dot{W}_{comp} = -\dot{m}(h_2 - h_1) = -\dot{m}c_p(T_2 - T_1)$$
(check marks under $\dot{m}$, $c_p$ and $T_1$; an arrow points up at $T_2$ as the unknown)

$P_2 = 24P_1$

$$\eta_{isen} = \frac{\dot{W}_{ideal}}{\dot{W}_{real}}, \qquad \dot{W}_{ideal} = -\dot{m}c_p(T_{2s} - T_1)$$
(arrow from "isentropic" to $T_{2s}$)

## Page 3
What assumptions are appropriate for this problem?

A. Steady flow
B. Δke=Δpe= 0
C. Adiabatic
D. All of the above

[figure] Photo of a speech bubble containing a question mark on a yellow background (clicker-question slide). No answer marked.

## Page 4
Energy conservation

(no other content on the slide)

## Page 5
Isentropic case

[handwritten]
State 1: $T_1 = 275$ K, $P_1 = 0.65$ atm

State 2s: after isentropic compression by ideal compressor

$$\Rightarrow \frac{T_2}{T_1} = \left(\frac{P_2}{P_1}\right)^{\frac{\gamma}{\gamma-1}} \Rightarrow T_2 = T_1\left(\frac{P_2}{P_1}\right)^{\frac{\gamma}{\gamma-1}} \qquad \gamma = 1.4$$

$$= 275\,(24)^{1.4/0.4} \Rightarrow T_2 = 681.8\ \text{K}$$
**ANSWER:** $T_{2s} = 681.8$ K (boxed/underlined on the page as "$T_2 = 681.8$ K")

Printed correction on the slide: "NOTE: The equation should be $T_2 = T_1\left(\frac{P_2}{P_1}\right)^{\gamma-1/\gamma}$" (i.e. exponent $(\gamma-1)/\gamma$)

[transcriber note: the handwritten exponent $\gamma/(\gamma-1)$ and "$1.4/0.4$" are wrong, as the printed NOTE says; 681.8 K matches the corrected exponent $0.4/1.4$: $275(24)^{0.2857} \approx 681.8$ K.]

Ideal compression:
$$\dot{W}_{ideal} = -\dot{m}c_p(T_{2,s} - T_1) = -(63.5)(1001)(681.8 - 275) = -25.8\ \text{MW}$$

## Page 6
Actual case

[handwritten]
$$\eta_{isen,c} = \frac{\dot{W}_{ideal}}{\dot{W}_{real}} \Rightarrow \dot{W}_{real} = \frac{\dot{W}_{ideal}}{\eta_{isen,c}} = \frac{-25.8\ \text{MW}}{0.94}$$

**ANSWER:** $\dot{W}_{real} = -27.5$ MW (boxed)

$$\dot{W}_{real} = -\dot{m}c_p(T_2 - T_1)$$
$$T_2 = T_1 - \frac{\dot{W}_{real}}{\dot{m}c_p} = 275 - \frac{(-27.5\times10^{6})}{(63.5)(1001)}$$

**ANSWER:** $T_2 = 707.7$ K (boxed)

$T_2 > T_{2,s}$ ✓
