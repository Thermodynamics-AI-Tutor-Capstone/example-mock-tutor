---
source: me300/lectures/Module7_12_IsentropicRelations_annotated.pdf
pages: 5
kind: lecture-slides
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Isentropic Relations

[figure] Black-and-white photo of an engine piston and connecting rod (title-slide decoration).

## Page 2
Isentropic processes

[handwritten] (next to title, with an arrow) $\Delta s = 0$ [?]

[handwritten]
$$\Delta s = c_p \ln\left(\frac{T_2}{T_1}\right) - R\ln\left(\frac{P_2}{P_1}\right)$$

→ ideal gas
→ $c_p$ = const.
⟹ $\Delta s = 0$

(the three conditions are bracketed together, then ⟹)

$$c_p \ln\left(\frac{T_2}{T_1}\right) = R\ln\left(\frac{P_2}{P_1}\right)$$

$$\frac{c_p}{R}\ln\left(\frac{T_2}{T_1}\right) = \ln\left(\frac{P_2}{P_1}\right)$$

$$\frac{P_2}{P_1} = \left(\frac{T_2}{T_1}\right)^{c_p/R}$$

$$T_1^{\gamma} P_1^{1-\gamma} = T_2^{\gamma} P_2^{1-\gamma}$$

ratio of specific heats:
$$\gamma = \frac{c_p}{c_v} > 1$$
$$R = c_p - c_v$$

## Page 3
Isentropic relations

[handwritten]
only use if:
- ideal gas
- $c_p, c_v$ = const.
- $\Delta s = 0$

(boxed)
$$T_1^{\gamma} P_1^{1-\gamma} = T_2^{\gamma} P_2^{1-\gamma}$$
$$T_1 v_1^{\gamma-1} = T_2 v_2^{\gamma-1}$$
$$P_1 v_1^{\gamma} = P_2 v_2^{\gamma}$$
(the last relation is double-underlined)

## Page 4
P-V diagram

[handwritten]
$Pv^{\gamma}$ = const
$Pv = RT$

→ isothermal
  $Pv$ = const
  $P \sim 1/v$

→ isentropic
  $Pv^{\gamma}$ = const
  $P \sim 1/v^{\gamma}$   $\gamma > 1$   air ⟹ $\gamma = 1.4$

[figure] P (vertical axis) vs V (horizontal axis). Two decreasing curves: a solid curve labelled "isentropic" and a dashed curve labelled "isothermal". The isentropic curve is steeper: it starts higher at the left, crosses the isothermal curve, and ends lower at the right.

## Page 5
Carnot cycle

[handwritten] – reversible

1-2: isothermal heat in   $T$ = const, $\frac{Pv}{R}$ = const
2-3: isentropic expansion   $Pv^{\gamma}$ = const (underlined)
3-4: isothermal heat rejection
4-1: isentropic compression
