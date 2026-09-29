---
source: me300/lectures/Module8_2_Example_StirlingEngine_annotated.pdf
pages: 4
kind: lecture-example
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Example:
Stirling Cycle

[figure] Photo of a historic steam engine with large flywheel (title-slide decoration).

## Page 2
Heat engine – example

[handwritten]
- 1-2: $\Delta T = 0$ compression
- 2-3: $\Delta V = 0$ heat in
- 3-4: $\Delta T = 0$ expansion
- 4-1: $\Delta V = 0$ heat out

(boxed)
Goal
1. State point
2. $W$, $Q$
3. $\eta_{th}$

State table (V written as script V = total volume; M = mass):

| State | T | V | P (if ideal gas) |
|---|---|---|---|
| 1 | $T_L$ | $V_1$ | $P_1 = \frac{MRT_1}{V_1}$ |
| 2 | $T_L$ | $V_2$ | $P_2$ |
| 3 | $T_H$ | $V_2$ | $P_3$ |
| 4 | $T_H$ | $V_1$ | $P_4$ |

(ditto marks under the $P_1$ formula indicate the same ideal-gas expression for $P_2$–$P_4$)

[figure] P (vertical) vs V (horizontal) diagram. Two dashed isotherms: upper labelled $T_H$, lower labelled $T_L$. Vertical dash-dot lines at $V_2$ (left) and $V_1$ (right). State 2 on $T_L$ at $V_2$; state 3 on $T_H$ at $V_2$ (top-left); state 4 on $T_H$ at $V_1$; state 1 on $T_L$ at $V_1$ (bottom-right). Arrows: 1→2 along $T_L$ leftward (compression), 2→3 vertically up, 3→4 along $T_H$ rightward (expansion), 4→1 vertically down. The enclosed area is hatched and labelled $W_{net}$.

## Page 3
What is the proper expression for the cycle efficiency?

A. $\dfrac{{}_3W_4}{{}_2Q_3}$

B. $\dfrac{{}_1W_2 + {}_3W_4}{{}_2Q_3}$

C. $\dfrac{{}_1W_2 + {}_3W_4}{{}_2Q_3 + {}_3Q_4}$

[handwritten] Check marks next to the numerator and the denominator of option C (marking C as the answer).

$$\eta_{th} = \frac{W_{net}}{Q_{in}}$$

[figure] Photo of a speech bubble with a question mark on a yellow background (clicker-question slide).

## Page 4
Solving for heat and work

[handwritten]
$${}_1W_2 = \int_{V_1}^{V_2} P\,dV = \int_{V_1}^{V_2} \frac{MRT}{V}\,dV = MRT_1\ln\left(\frac{V_2}{V_1}\right), \qquad {}_3W_4 = MRT_3\ln\left(\frac{V_1}{V_2}\right)$$
(V here is script V = total volume; ${}_1W_2$ is underlined)

$$\Rightarrow \Delta KE = \Delta PE = 0 \rightarrow \Delta U = {}_1Q_2 - {}_1W_2$$
$${}_1Q_2 = \Delta U + {}_1W_2$$
(ΔU underbraced)
$$\Delta U = M\Delta u = Mc_v\Delta T$$
(the $\Delta u$ is circled)

ideal gas, $c_v$ = const
