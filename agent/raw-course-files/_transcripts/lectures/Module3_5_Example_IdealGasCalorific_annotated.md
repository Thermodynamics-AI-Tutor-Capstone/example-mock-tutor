---
source: me300/lectures/Module3_5_Example_IdealGasCalorific_annotated.pdf
pages: 7
kind: lecture-example
transcribed_by: deepseek-flash (from page images)
---

## Page 1

ME 300:
Engineering Thermodynamics

Example:
Ideal Gas Equation
of State: Calorific

[figure] Left half of the slide is a photograph (night scene): a person in a dark hooded jacket, seen in profile facing left, holds a large cluster of transparent balloons on illuminated sticks; the balloons are filled with many small glowing blue/white/teal points of light connected by thin luminous web-like strands. The background is dark and out of focus with warm reddish lighting. No axes, states, or values are labeled on the image.

## Page 2

# Cycle example

Consider a three-step cycle with air as the working fluid: [handwritten] $\rightarrow$ ideal gas
- 1-2: isothermal expansion [handwritten] $\Delta T = 0$
- 2-3: isochoric heat addition [handwritten] $\Delta v = 0$ [handwritten] $\rightarrow$ $M = \text{const.}$
- 3-1: isobaric compression [handwritten] $\Delta P = 0$

If I know the following states, solve for P, T, and v at all states in the cycle:
[handwritten] $-\ -\ -$ (marks under P, T, v)
- T1 = 300 K
- v1 = 1 m3/kg
- v2 = 2 m3/kg
- R=287 J/kgK [handwritten] -- air

[handwritten] $\Delta u$
[handwritten] $\Delta h$

[handwritten] $c_v = 714$ J/kg-K
[handwritten] $c_p = 1001$ J/kg-K

## Page 3

Problem setup

[handwritten] Given :
[handwritten] State   $T\,[\mathrm{K}]$   $v\,[\mathrm{m^3/kg}]$   $P\,[\mathrm{Pa}]$
[handwritten] 1       800       1
[handwritten] 2       800       2
[handwritten] 3                 2

[handwritten] Assume : ideal gas
[handwritten] quasi-steady.
[handwritten] $C_v$, $C_p$ = const.

[figure] P-v diagram: vertical axis $P$ pointing up, horizontal axis $v$ pointing right. Two vertical dashed lines at $v=1$ and $v=2$. Horizontal dashed line at $P_3 = P_1$ passes through states ① and ③. Lower horizontal dashed line at $P_2$ passes through state ②. A dashed dome-shaped curve labeled $T$ is above/around the state points. State ① at ($v=1$, $P_3=P_1$); state ② at ($v=2$, $P_2$); state ③ at ($v=2$, $P_3=P_1$). Arrows: curved arrow from ① to ②; vertical upward arrow from ② to ③; horizontal leftward arrow from ③ to ①.

## Page 4

Solve for states

[handwritten] **State 1 :** $T_1 = 800\ \text{K}$,  $V_1 = 1\ \text{m}^3/\text{kg}$  $\rightarrow$  $P_1 V_1 = R T_1 \Rightarrow P_1 = \dfrac{RT_1}{V_1} =$ **ANSWER:** $\boxed{229600\ \text{Pa}}$

[handwritten] **State 2 :** $T_2 = T_1 = 800\ \text{K}$,  $V_2 = 2\ \text{m}^3/\text{kg}$  $\rightarrow$  $P_2 = \dfrac{RT_2}{V_2} =$ **ANSWER:** $\boxed{114800\ \text{Pa}}$

[handwritten] **State 3 :** $V_3 = V_2 = 2\ \text{m}^3/\text{kg}$,  $P_3 = P_1 = 229600\ \text{Pa}$  $\rightarrow$  $P_3 V_3 = R T_3 \Rightarrow T_3 = \dfrac{P_3 V_3}{R} =$ **ANSWER:** $\boxed{1600\ \text{K}}$

## Page 5

Change in energies

[handwritten] $\Rightarrow \quad \Delta u = C_V \Delta T$
[handwritten] $\phantom{\Rightarrow} \quad \Delta h = C_p \Delta T$

[handwritten] $\longrightarrow \quad \Delta u = u_2 - u_1 = C_V (T_2 - T_1)$
[handwritten] $\phantom{\longrightarrow} \quad \Delta h = h_2 - h_1 = C_p (T_2 - T_1)$

## Page 6

[figure] Left half of the slide is a solid yellow background with a white, cloud-shaped thought bubble outlined in black, containing a large black question mark.

What is the change in internal energy for process 1-2?

a) Greater than 0
b) Less than 0
c) Equal to 0

## Page 7

Change in energies

[handwritten] $\rightarrow$ Isothermal $\Delta T = 0$, $\Delta u = 0$ $\Delta h = 0$

[handwritten] $\rightarrow$ 2-3: $\underline{u_3 - u_2} = c_v (T_3 - T_2) = 714(1600 - 800) \rightarrow \Delta u = 571200 \ \frac{\mathrm{J}}{\mathrm{kg}}$

[handwritten] $\underline{h_3 - h_2} = c_p (T_3 - T_2) = 1001(1600 - 800) \rightarrow \Delta h = 800800 \ \frac{\mathrm{J}}{\mathrm{kg}}$

[handwritten] $\rightarrow$ 3-1: $\underline{u_1 - u_3} = c_v (T_1 - T_3) = 714(800 - 1600) = -571200 \ \frac{\mathrm{J}}{\mathrm{kg}}$

[handwritten] $\Rightarrow \sum \Delta u = 0 \rightarrow \underline{(u_2 - u_1)} + \underline{(u_3 - u_2)} + \underline{(u_1 - u_3)} = 0$

[handwritten] $571200 + \underbrace{(u_1 - u_3)}_{-571200 \ \frac{\mathrm{J}}{\mathrm{kg}}} = 0$

[handwritten] $\sum \Delta h = 0 \rightarrow \underline{h_1 - h_3} = -800800 \ \frac{\mathrm{J}}{\mathrm{kg}}$
