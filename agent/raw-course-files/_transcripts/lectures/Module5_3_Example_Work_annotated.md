---
source: me300/lectures/Module5_3_Example_Work_annotated.pdf
pages: 5
kind: lecture-example
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Example:
Work

[figure] Decorative photo of a wood fire in a brick fire pit.

## Page 2
**Example:** A closed piston-cylinder system filled with 1 kg of air starts at a volume of 1 m³ and isobarically expands to 2 m³. If the initial temperature is 300 K, find the following and draw the process on a P-V diagram:
- $P_2$
- $T_2$
- ${}_1W_2$

Now what if I do that same process isothermally?

[handwritten] ("air" underlined)
Assume: ideal gas
: quasi-steady

## Page 3
Isobaric process

[handwritten]
$V_1 = 1$ m³   $V_2 = 2$ m³   (script V = total volume)
$T_1 = 300$ K   $P_2 = P_1$
$M = 1$ kg

$P_1 V_1 = M R T_1$
$P_1 = \dfrac{MRT}{V}$
$= \dfrac{(1)(287)(300)}{1}$
$P_1 = 86100$ Pa

${}_1W_2 = \displaystyle\int_{V_1}^{V_2} P\,dV = P\int_{V_1}^{V_2} dV = P(V_2 - V_1)$
$= 86100\,(2 - 1)$
**ANSWER:** ${}_1W_2 = 86100$ J (boxed)

"on? by?" — "by?" circled, with "+" written beneath (work done by the system, positive).

[figure] P–V diagram (P vertical, V horizontal): horizontal line at constant P from state ① at V = 1 to state ② at V = 2, arrow pointing right (1 → 2); dashed lines drop from each state to the V axis at "1" and "2"; dashed line from the P axis to the process line.

## Page 4
Isothermal process

[handwritten]
$V_1 = 1$ m³   $V_2 = 2$ m³
$T_1 = 300$ K   $T_2 = T_1 = 300$ K
$P_1 = 86100$ Pa
$M = 1$ kg

${}_1W_2 = \displaystyle\int_{V_1}^{V_2} P\,dV$     $P = \dfrac{MRT}{V}$
$= \displaystyle\int_{V_1}^{V_2} \frac{MRT}{V}\,dV = MRT\int_{V_1}^{V_2}\frac{dV}{V} = MRT\ln\left(\frac{V_2}{V_1}\right)$
$= (1)(287)(300)\ln\left(\frac{2}{1}\right)$
**ANSWER:** ${}_1W_2 = 59679.97$ J (boxed)

[figure] P–V diagram: a decreasing curve (hyperbola) from state ① (high P, V = 1) to state ② (lower P, V = 2), arrow along the curve toward ②; the area under the curve between V = 1 and V = 2 is hatched and labelled "${}_1W_2 = \int_{V_1}^{V_2} P\,dV$". Dashed vertical lines at V = 1 and V = 2.

## Page 5
Application to a cycle

1-2: isothermal compression   [handwritten] $\Delta T = 0$
2-3: isochoric heat addition   [handwritten] $\Delta V = 0$
3-4: isothermal expansion   [handwritten] $\Delta T = 0$ [?]
4-1: isochoric heat rejection   [handwritten] $\Delta V = 0$

[handwritten]
1-2: ${}_1W_2 = \displaystyle\int_{V_1}^{V_2} P\,dV = \int_{V_1}^{V_2}\frac{MRT}{V}\,dV < 0$
2-3: ${}_2W_3 = \displaystyle\int_{V_2}^{V_3} P\,dV = 0$
3-4: ${}_3W_4 > 0$
4-1: ${}_4W_1 = 0$

$W_{net} = {}_1W_2 + {}_3W_4 > 0$

☆ Power cycle → clockwise

[figure] P–V diagram of the cycle. State ① at large V, low P (bottom right); state ② at small V ($V_2 = V_3$) higher P, reached along a curved isotherm (dashed extension labelled "$T_1 = T_2$"); state ③ directly above ② (vertical line up, arrow upward); state ④ at large V ($V_1 = V_4$) on the upper isotherm labelled "$T_3 = T_4$" (arrow from ③ to ④ along the upper curve); vertical line from ④ down to ① (arrow downward). The area under the lower curve 1–2 is cross-hatched; the area under the upper curve 3–4 is hatched in one direction; the enclosed cycle area represents net work. The cycle is traversed clockwise (1→2→3→4→1).
