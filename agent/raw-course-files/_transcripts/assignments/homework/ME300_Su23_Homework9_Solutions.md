---
source: me300/assignments/homework/ME300_Su23_Homework9_Solutions.pdf
pages: 6
kind: homework-solutions
transcribed_by: deepseek-flash (from page images)
---

## Page 1

ME300 Homework 9 Solutions

[1] Given: $\dot{m} = 15\ kg/s$
$P_1 = 12\ MPa$
$T_1 = 640\ K$
$P_2 = 1\ MPa$
$x_2 = 0.86$

Assumptions: S.L.S. (+1/2)
: Steady-flow (+1/2)
: quasi-eq. (+1/2)
: $\Delta ke = \Delta pe = \dot{Q} = 0$ (+1/2)

a) Steady flow: $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ (+2)
Turbine: $\dot{m}(h_2 - h_1) = -\dot{W}$
$\dot{W} = -\dot{m}(h_2 - h_1) \rightarrow$ State 1: $P_1 = 12\ MPa$
$T_1 = 640\ K$
Table D2: $T_1 > T_{sat}$ - vap or [handwritten] $T_1 > T_{sat}$ - vap or
Table D30: $h_1 = 2926\ kJ/kg$ (+1)
$s_1 = 5.8843\ kJ/kg\cdot K$ (+1)

$\rightarrow$ State 2: $P_2 = 1\ MPa$
$x_2 = 0.86$
$h_2 = h_g x_2 + (1-x_2)h_f$ (+1)
$= (0.86)(2777.1) + (1-0.86)(762.52)$
$= 2495.1\ kJ/kg$ (+1)
$s_2 = s_g x_2 + (1-x_2)s_f$ (+1)
$= (0.86)(6.585) + (1-0.86)(2.1381)$
$= 5.963\ kJ/kg\cdot K$ (+1)

$\rightarrow \dot{W} = -(15)(2495.1 - 2926) \rightarrow$ $\boxed{\dot{W} = 6463.5\ kW}$ (+1)
$\Delta s = 5.963 - 5.8843 \rightarrow$ $\boxed{\Delta s = 0.0787\ kJ/kg\cdot K}$ (+1)

## Page 2

ME300 **Homework 9** **SOLUTIONS**

b) ideal turbine: $s_2 = s_1 = 5.8843 \ \mathrm{kJ/kg\cdot K}$ (+2)

$$x_{2s} = \frac{5.8843 - 2.1381}{6.585 - 2.1381} \implies x_{2s} = 0.842$$ (+1)

$$h_{2s} = x_{2s} h_g + (1-x_{2s})h_f$$
$$= (0.842)(2777.1) + (1-0.842)(762.52)$$
$$= 2458.796 \ \mathrm{kJ/kg}$$ (+1)

$$\dot{W}_{ideal} = -\dot{m}(h_{2s} - h_1) = -15(2458.796 - 2926)$$

**ANSWER:** $\boxed{\dot{W}_{ideal} = 7008.06 \ \mathrm{kW}}$ (+1)

$$\eta_{turb} = \frac{\dot{W}_{real}}{\dot{W}_{ideal}} = \frac{6463.5}{7008.06} \implies \boxed{\eta_{turb} = 0.92}$$ (+1)

c) Turbine is possible if $s_2 \ge s_1$ (+2)

@ $x_2 = 0.8$, $s_2 = 5.696 \ \mathrm{kJ/kg\cdot K}$, which is less than $s_1$

$\implies$ cannot have a turbine where $x_2 = 0.8$ for this initial condition and final pressure (+3)

[2] **Given:** $P_1$ [psia] $\quad$ **Assume:** ideal gas, $c_p$ = const, steady-flow, guess $q=0$  
$\quad\quad\quad P_2$ [psig] $\implies$ $P_2$ [psia] = $P_2$ [psig] + $P_1$ [psia] (+2)  
$\quad\quad\quad T_1, T_2$  
$\quad$ [handwritten] $\Delta k \approx \Delta p \approx 0 = \dot{Q} = 0$ (+2 for assume)

$\implies \eta_{comp} = \frac{\dot{W}_{ideal}}{\dot{W}_{real}}$ (+2)

$\rightarrow$ because steady-flow: $\dot{m}(\Delta h + \Delta k + \Delta p) = \dot{Q} - \dot{W}$  
because compressor: $\dot{m}(h_2 - h_1) = -\dot{W}$  
because ideal gas $c_p$ = const: $\dot{m} c_p (T_2 - T_1) = -\dot{W}$ (+2)

$\rightarrow \dot{W}_{ideal} = -\dot{m} c_p (T_{2s} - T_1)$ where $T_{2s} = T_1 \left(\frac{P_2}{P_1}\right)^{\frac{k-1}{k}}$ (+2)

$\dot{W}_{real} = -\dot{m} c_p (T_2 - T_1) \implies \boxed{\eta_{comp} = \frac{T_{2s} - T_1}{T_2 - T_1}}$ (+3 for plot) (+2 for discussion)

## Page 3

ME300 Homework 4 | SOLUTIONS

[3] Heat pump → goal is to move heat to a warm space (+3)
    ⇒ $\beta = \dfrac{\dot{Q}_H}{\dot{W}_{in}}$ (+2)
    Refrigerator → goal is to remove heat from a cold space (+3)
    ⇒ $\beta = \dfrac{\dot{Q}_L}{\dot{W}_{in}}$ (+2)

[4] Given: $\dot{W}_{in} = 1000\ \text{W}$    Assume: steady state
    $T_L = 0^\circ\text{C} = 273.15\ \text{K}$ (+1)
    $T_H = 20^\circ\text{C} = 293.15\ \text{K}$ (+1)

a)
[figure] Vertical arrangement: box labeled "$T_H$" (+1) at top; arrow pointing up from the cycle circle to the $T_H$ box labeled "$\dot{Q}_H$" (+1); circle labeled "cycle" in the middle; arrow pointing left into the cycle labeled "$\dot{W}_{in}$" (+1); arrow pointing down from the cycle to the lower box labeled "$\dot{Q}_L$" (+1); box labeled "$T_L$" (+1) at bottom.

b) $\beta_{max} = \dfrac{T_L}{T_H - T_L}$ (+2)
   $= \dfrac{273.15}{20}$
   **ANSWER:** $\boxed{\beta_{max} = 13.658}$ (+1)

c) $\beta_{act} = 7$ where $\beta = \dfrac{\dot{Q}_L}{\dot{W}_{in}}$ (+2)
   → $\dot{Q}_L = \beta \dot{W}_{in} = (7)(1000)$ → **ANSWER:** $\boxed{\dot{Q}_L = 7000\ \text{W}}$ (+1)
   → $\dot{Q}_H = \dot{Q}_L + \dot{W}_{in} = 1000 + 7000$ → **ANSWER:** $\boxed{\dot{Q}_H = 8000\ \text{W}}$ (+1)

## Page 4

ME300 HOMEWORK 9 — Solutions

[handwritten] [5] Given: $x_3 = 1$
[handwritten] $P_3 = 8\ \text{MPa}$
[handwritten] $\dot{W}_{net} = 100\ \text{MW}$
[handwritten] $P_4 = 0.008\ \text{MPa} = P_1$
[handwritten] $x_1 = 0$
[handwritten] $\eta_{pump} = \eta_{turb} = 0.85$

[handwritten] Assume: S.C.S.
[handwritten] : quasi-f
[handwritten] : steady-flow
[handwritten] $\rightarrow$ pump/turbine: $\Delta ke = \Delta pe = \dot{Q} = 0$
[handwritten] $\rightarrow$ boiler/condenser: $\Delta ke = \Delta pe = \dot{W} = 0$
[handwritten] (+3 for assume) [blue ink]

[handwritten] $\Rightarrow$ Find: $\dot{m}$, $\dot{W}_{turb}$

[handwritten] $\rightarrow$ Cycle: $1\text{-}2 \rightarrow$ compression : $\dot{m}(h_2 - h_1) = -\dot{W}_{pump}$ (+2)
[handwritten] $2\text{-}3 \rightarrow$ boiler : $\dot{m}(h_3 - h_2) = \dot{Q}_{boiler}$ (+1)
[handwritten] $3\text{-}4 \rightarrow$ expansion : $\dot{m}(h_4 - h_3) = -\dot{W}_{turb}$ (+2)
[handwritten] $4\text{-}1 \rightarrow$ condenser : $\dot{m}(h_1 - h_4) = \dot{Q}_{cond}$ (+1)

[handwritten] $\rightarrow$ States

| States | P | Phase |
|---|---|---|
| 1 | $0.008\ \text{MPa}$ | $x_1 = 0$ |
| 2 | $8\ \text{MPa}$ | liquid |
| 3 | $8\ \text{MPa}$ | $x_3 = 1$ |
| 4 | $0.008\ \text{MPa}$ | mixture |

[handwritten] $\left. \begin{array}{c} \\ \\ \end{array} \right\} \eta_{pump} = \dfrac{\dot{W}_{ideal}}{\dot{W}_{real}} = \dfrac{h_{2s} - h_1}{h_2 - h_1}$ (+4)

[handwritten] $\left. \begin{array}{c} \\ \\ \end{array} \right\} \eta_{turb} = \dfrac{\dot{W}_{real}}{\dot{W}_{ideal}} = \dfrac{h_4 - h_3}{h_{4s} - h_3}$ (+4)

[handwritten] $\Rightarrow \dot{W}_{net} = \dot{W}_{pump} + \dot{W}_{turb} = 100\ \text{MW}$ (+4)
[handwritten] $= -\dot{m}(h_2 - h_1) + \dot{m}(h_4 - h_3)$

[handwritten] $\Rightarrow \dot{m} = \dfrac{-\dot{W}_{net}}{(h_2 - h_1) + (h_4 - h_3)}$ (+2)
[handwritten] $\Rightarrow$ find h's to solve for $\dot{m}$

## Page 5

ME300  Homework 4  Solutions

**State 1 :** $P_1 = 0.008$ MPa  $\quad x_1 = 0$  
$\rightarrow$ Table D2 $\rightarrow$ $h_1 = h_f = 173.84$ $\frac{kJ}{kg}$ (+1)  
$s_1 = s_f = 0.59249$ $\frac{kJ}{kg-K}$ (+1)

**State 2s :** $P_2 = 8$ MPa  
$s_{2s} = s_1 = 0.59249$ $\frac{kJ}{kg-K}$ (+1)  
$s_{2s} < s_f \rightarrow$ liquid (+1)  
NIST $\rightarrow$ $h_{2s} = 182.44$ $\frac{kJ}{kg}$ @ $T_{2s} = 315.03$ K

**State 2 :** $\eta_{pump} = 0.85 = \dfrac{h_{2s} - h_1}{h_2 - h_1}$ (+1)  
$h_2 = h_1 + \dfrac{h_{2s} - h_1}{0.85} = 173.84 + \dfrac{(182.44 - 173.84)}{0.85}$  
$h_2 = 183.96$ $\frac{kJ}{kg}$ (+1)

**State 3 :** $P_3 = 8$ MPa  $\quad \rightarrow$ Table D2 $\rightarrow$ $h_3 = h_g = 2758.7$ $\frac{kJ}{kg}$ (+1)  
$x_3 = 1$  $\quad \rightarrow$ $s_3 = s_g = 5.7450$ $\frac{kJ}{kg-K}$ (+1)

**State 4s :** $P_4 = 0.008$ MPa  
$s_{4s} = s_3 = 5.7450$ $\frac{kJ}{kg-K}$ (+1)  
$\Rightarrow$ $s_f < s_{4s} < s_g \Rightarrow$ mixture  
$x_{4s} = \dfrac{s_{4s} - s_f}{s_g - s_f} = \dfrac{5.7450 - 0.59249}{8.2273 - 0.59249} = 0.675$ (+1)  
$h_{4s} = x_{4s} h_g + (1 - x_{4s}) h_f$  
$\quad = (0.675)(2576.2) + (1 - 0.675)(173.84)$  
$h_{4s} = 1795.43$ $\frac{kJ}{kg}$ (+1)

**State 4 :** $\eta_{turb} = 0.85 = \dfrac{h_3 - h_4}{h_3 - h_{4s}}$ (+1)  
$h_4 = h_3 + 0.85(h_{4s} - h_3)$  
$\quad = 2758.7 + 0.85(1795.43 - 2758.7) \rightarrow h_4 = 1939.92$ $\frac{kJ}{kg}$ (+1)

## Page 6

[handwritten] 4/3/00[?]    Homework 9    Solutions

$$\Rightarrow \dot{m} = \frac{-100 \times 10^3 \ \text{kw}}{(183.96 - 173.84) + (1939.6 - 2758.7)}$$

**ANSWER:** $$\boxed{\dot{m} = 123.6 \ \text{kg/s}}$$ (+1)

$$\Rightarrow \dot{W}_{\text{turb}} = -\dot{m}\,(h_4 - h_3)$$
$$= -123.6\,(1939.6 - 2758.7)$$

**ANSWER:** $$\boxed{\dot{W}_{\text{turb}} = 101.24 \ \text{MW}}$$ (+1)

[transcriber note: the numerator of the first equation is written with units of "kw" while the result is in kg/s; transcribed as written on the page.]
