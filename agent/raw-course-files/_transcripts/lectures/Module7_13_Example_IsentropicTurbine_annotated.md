---
source: me300/lectures/Module7_13_Example_IsentropicTurbine_annotated.pdf
pages: 7
kind: lecture-example
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Example:
Isentropic
Steam Turbine

[figure] Close-up photo of turbine blade roots (title-slide decoration).

## Page 2
Example

Determine the flow rate required to produce 25 MW of shaft power from an ideal (adiabatic, reversible) steam turbine in which the steam enters at 10 MPa and 720 K and exits at 5 kPa.

[handwritten] ("reversible" is underlined with a wavy line)

Find: $\dot{m}$

Given:
- $\dot{W} = 25$ MW
- $P_1 = 10$ MPa, $T_1 = 720$ K ] → $h_1, s_1$
- $P_2 = 5$ kPa, $s_2 = s_1$ ] → $h_2$

Assume:
- $\Delta ke = \Delta pe = 0$
- ad + rev → isentropic ⟹ $s_1 = s_2$
- steady-flow
- S.C.S.

$$\Rightarrow \dot{m}\left(\Delta h + \cancel{\Delta ke} + \cancel{\Delta pe}\right) = \cancel{\dot{Q}} - \dot{W}$$
(the $\Delta ke$, $\Delta pe$ and $\dot{Q}$ terms are crossed out and marked 0)

$$\dot{W} = -\dot{m}\,\Delta h$$

$$\dot{m} = -\frac{\dot{W}}{\Delta h} \checkmark$$

↑ find $h_1$, $h_2$ (pointing at $\Delta h$)

## Page 3
What assumptions are appropriate for this problem?

A. Steady flow
B. Δke=Δpe= 0
C. Adiabatic
D. All of the above

[figure] Photo of a speech bubble containing a question mark on a yellow background (clicker-question slide). No answer marked on this page.

## Page 4
Example

[handwritten]
State 1:
- $P_1 = 10$ MPa
- $T_1 = 720$ K

D.2 → $T_{sat} = 584.15$ K, $T_1 > T_{sat}$ ⟹ vapor

D.3P → $h_1 = 3233.7$ kJ/kg
       $s_1 = 6.4098$ kJ/kg

[transcriber note: entropy units are written "kJ/kg" on the page; entropy is normally kJ/kg·K.]

## Page 5
Example

[handwritten]
State 2:
- $P_2 = 5$ kPa (the "5 kPa" is double-underlined)
- $s_2 = s_1 = 6.4098$ kJ/kg

D.2 → $s_f = 0.4716$ kJ/kg, $s_g = 8.4012$ kJ/kg } $s_f < s_2 < s_g$ ⟹ mixture (underlined)

$$x_2 = \frac{s_2 - s_f}{s_g - s_f} = \frac{6.4098 - 0.4716}{8.4012 - 0.4716} = 0.749$$

$$h_2 = x_2 h_g + (1-x_2)h_f = (0.749)(2560.15) + (1-0.749)(136.42)$$

**ANSWER:** $h_2 = 1951.8$ kJ/kg [?] (boxed; the third digit could be read as 5 or 7, but page 6 uses 1951.8)

## Page 6
Example

[handwritten]
$$\dot{m} = \frac{-\dot{W}}{h_2 - h_1} = \frac{-(25\times10^{6})}{(1951.8 - 3233.7)\times10^{3}}$$

**ANSWER:** $\dot{m} = 19.5$ kg/s (boxed)

## Page 7
Would a non-ideal turbine produce greater than, less than, or the same amount of work as an isentropic turbine?

A. Greater than
B. Less than
C. Same

[handwritten] "Less than" (B) is underlined, marking it as the answer.

[figure] Photo of a speech bubble containing a question mark on a yellow background (clicker-question slide).
