---
source: me300/lectures/Module8_10_Example_BraytonCycle_annotated.pdf
pages: 6
kind: lecture-example
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Example: Brayton Cycle

[figure] Photo of the front of a turbofan jet engine.

## Page 2
Example

A gas turbine running an ideal Brayton cycle has a steady mass flow of 30 kg/s. The inlet temperature is 300 K and the max temperature is 1050 K. If the pressure ratio of the cycle is 8.5, determine the thermal efficiency and the net power produced.

[handwritten]
Given:
- $\dot{m} = 30$ kg/s
- $T_1 = 300$ K
- $T_{max} = 1050$ K
- $P_2/P_1 = 8.5$

Find:
- $\eta_{th}$
- $\dot{W}_{net}$

Assume:
- air standard
- ideal → reversible
- steady-flow
- quasi-steady

## Page 3
Efficiency

[handwritten]
$$\eta_{th} = 1 - \text{OPR}^{\frac{1-\gamma}{\gamma}} \qquad \gamma = 1.4$$
$$= 1 - (8.5)^{\frac{0.4}{1.4}}$$

**ANSWER:** $\eta_{th} = 0.46$ (boxed)

[transcriber note: the exponent is written as $\frac{0.4}{1.4}$; with $\frac{1-\gamma}{\gamma}$ and $\gamma = 1.4$ it is $-\frac{0.4}{1.4}$. The boxed 0.46 matches $1 - 8.5^{-0.4/1.4}$. Transcribed as written.]

## Page 4
What is the highest temperature in the cycle?

A. T1
B. T2
C. T3
D. T4

[handwritten] C. T3 is circled. Arrows drawn A→B, B→C, C→D, and a longer arrow D→A (tracing the cycle 1→2→3→4→1).

[figure] Stock image of a speech bubble with a question mark on a yellow background.

## Page 5
Thermodynamic states

[handwritten]

| State | P | T [K] |
|---|---|---|
| 1 | $P_1$ | 300 |
| 2 | $8.5 P_1$ | 553 |
| 3 | $8.5 P_1$ | 1050 |
| 4 | $P_1$ | 570 |

States 1–2: $\Delta s = 0$, $\quad T_1 P_1^{\frac{1-\gamma}{\gamma}} = T_2 P_2^{\frac{1-\gamma}{\gamma}}$ ($T_2$ double-underlined as the unknown)

States 3–4: $\Delta s = 0$, $\quad T_3 P_3^{\frac{1-\gamma}{\gamma}} = T_4 P_4^{\frac{1-\gamma}{\gamma}}$

$c_p = 1001$ J/kg-K

## Page 6
Work

[handwritten]
$${}_1\dot{W}_2 = -\dot{m}(h_2 - h_1) = -\dot{m}c_p(T_2 - T_1) = -30(1001)(553 - 300) = -7.5 \text{ MW}$$

$${}_3\dot{W}_4 = -\dot{m}c_p(T_4 - T_3) = -(30)(1001)(570 - 1050) = 14.4 \text{ MW}$$

$$\dot{W}_{net} = {}_1\dot{W}_2 + {}_3\dot{W}_4 = -7.5 + 14.4 \Rightarrow$$

**ANSWER:** $\dot{W}_{net} = 6.8$ MW (boxed)

[transcriber note: $30(1001)(253) = 7.60 \times 10^6$ W, so the compressor term rounds to $-7.6$ MW; the boxed 6.8 MW is consistent with the unrounded values ($14.41 - 7.60 = 6.81$ MW). Transcribed as written.]
