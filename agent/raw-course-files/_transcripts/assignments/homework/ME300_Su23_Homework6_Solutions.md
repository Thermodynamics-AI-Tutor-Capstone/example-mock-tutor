---
source: me300/assignments/homework/ME300_Su23_Homework6_Solutions.pdf
pages: 4
kind: homework-solutions
transcribed_by: claude (from page images)
---

Handwritten solutions; blue marks are grader point values. No problem statements in this file.

[transcriber note: the solution problem numbers are shifted by one relative to the posted Homework 6 assignment (ME300_Su23_Homework6.pdf): solution "2" (steady flow definition) has no exact match in the posted sheet, solution "3" = posted Problem 2 (nozzle), "4" = posted Problem 3 (throttle), "5" = posted Problem 4 (heat exchanger), "6" = posted Problem 5 (compressor). Numbers below are as written on the solution pages.]

## Page 1

[handwritten] Header: ME300 | HOMEWORK 6 | SOLUTIONS

**Problem 2**

Steady flow means that the time-rate of change of any quantity in a control volume is zero. (+3)

→ For these problems we use an instantaneous formulation:

$$\frac{dX_{cv}}{dt} = \dot{X}_{in} - \dot{X}_{out} + \dot{X}_{gen}$$ (+3)

with $\frac{dX_{cv}}{dt} \to 0$ for steady-flow assumption (+2)

→ Examples could vary (+2)

**Problem 3**

Given: $\mathcal{v}_1 = 10$ m/s; $T_1 = 350$ K; $\rho_1 = 1.225$ kg/m$^3$; $A_1 = 0.02$ m$^2$; $c_p = 1001$ J/kg-K; $\mathcal{v}_2 = 20 \to 200$ m/s; $T_2 = ?$

(Here the script $\mathcal{v}$ is the author's symbol for velocity.)

Assume: ideal gas (+1/2); $c_p$ = const (+1/2); quasi-eq. (+1/2); steady-flow (+1/2); $\Delta pe = \dot{Q} = \dot{W} = 0$ (+1)

→ steady flow: $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ (+2), with $\Delta pe \to 0$ (+1), $\dot{Q} \to 0$ (+1), $\dot{W} \to 0$ (+1)

$\therefore \Delta h + \Delta ke = 0$

→ ideal gas / $c_p$ = const: $c_p(T_2 - T_1) + \frac{1}{2}(\mathcal{v}_2^2 - \mathcal{v}_1^2) = 0$ (+1) (+1)

$$T_2 = T_1 - \frac{1}{2c_p}(\mathcal{v}_2^2 - \mathcal{v}_1^2) = 0$$ (+2)

[transcriber note: the trailing "= 0" on the $T_2$ line is as written; it appears to be a slip carried from the previous line — $T_2$ itself is not zero.]

→ $\dot{m} = \rho_1 \mathcal{v}_1 A_1 = (1.225)(10)(0.02)$ (+2)

**ANSWER:** $\dot{m} = 0.245$ kg/s (+1)

→ plot → +3 for correct trend, +2 for readability

## Page 2

[handwritten] Header: ME300 | HOMEWORK 6 | SOLUTIONS

**Problem 4**

Given: $P_1 = 5$ MPa, $x_1 = 1$; $P_2 = 3$ MPa

Assume: S.C.S. (+1/2); quasi-eq. (+1/2); steady flow (+1/2); $\Delta ke = \Delta pe = 0$ (+1/2); $\dot{Q} = 0$ (+1/2); $\dot{W} = 0$ (+1/2) — [bracket on the last three: "throttle"]

→ Steady-flow: $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ (+2), with $\Delta ke, \Delta pe, \dot{Q}, \dot{W} \to 0$

→ throttle: $\Delta h = 0$ (+2)

$h_2 = h_1$

→ State 1: $P_1 = 5$ MPa, $x_1 = 1$, $h_1 = h_g = 2794.2$ kJ/kg (+2)

→ State 2: $P_2 = 3$ MPa, $h_2 = h_1 = 2794.2$ kJ/kg (+1)

→ $h_f < h_2 < h_g$ → mixture (+1) → **ANSWER:** $T_2 = T_{sat} = 507$ K (+1)

$$x_2 = \frac{h_2 - h_f}{h_g - h_f} = \frac{2794.2 - 1008.3}{2803.2 - 1008.3} = 0.995$$ (+1)

→ $u_2 = x_2 u_g + (1 - x_2)u_f$ (+1)
$= (0.995)(2603.2) + (0.005)(1004.7)$

**ANSWER:** $u_2 = 2595.2$ kJ/kg (+1)

## Page 3

[handwritten] Header: ME300 | HOMEWORK 6 | SOLUTIONS

**Problem 5**

Given: Air: $T_1 = 623$ K; $c_p = 1001$ J/kg-K; $\dot{m}_{air} = 0.05$ kg/s. H$_2$O: $P_1 = 0.1$ MPa; $x_1 = 0$, $x_2 = 1$; $\dot{m}_{H_2O} = 0.002$ kg/s

Assume: ideal gas (+1/2); $c_p$ = const (+1/2); S.C.S. (+1/2)

Process assumptions: quasi-eq. (+1/2); steady flow (+1/2); $\Delta ke = \Delta pe = 0$ (+1/2); $\dot{W} = 0$ (+1/2); no heat loss to outside; isobaric (+1/2)

Water: Steady-flow → $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ (+2), with $\Delta ke, \Delta pe, \dot{W} \to 0$

heat exchanger → $\dot{m}(h_2 - h_1) = \dot{Q}$ (+1)

State 1 → $P_1 = 0.1$ MPa, $x_1 = 0$, $h_1 = h_f = 417.5$ kJ/kg (+1)

State 2 → $P_2 = P_1 = 0.1$ MPa, $x_2 = 1$, $h_2 = h_g = 2674.9$ kJ/kg (+1)

⇒ $\dot{Q} = \dot{m}(h_2 - h_1) = 0.002(2674.9 - 417.5)$

**ANSWER:** $\dot{Q} = 4.51$ kW (+1)

Air: $\dot{Q}_{air} = -\dot{Q}_{H_2O} = -4.51$ [?] kW (+2)

Steady flow → $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$, with $\Delta ke, \Delta pe, \dot{W} \to 0$

heat exchanger → $\dot{m}(h_2 - h_1) = \dot{Q}$

Ideal gas / $c_p$ = const → $\dot{m}c_p(T_2 - T_1) = \dot{Q}$

$$T_2 = T_1 + \frac{\dot{Q}}{\dot{m}c_p} = 623 + \frac{(-4510\,[?])}{(0.05)(1001)}$$ (+1)

**ANSWER:** $T_2 = 532.9$ K (+2)

[transcriber note: the air heat value is written in a way that could read "4.57 kW"/"4570" or "4.51 kW"/"4510"; the boxed water answer is 4.51 kW and $T_2 = 532.9$ K is consistent with 4510 W, so 4.51/4510 is the likely reading.]

## Page 4

[handwritten] Header: ME300 | HOMEWORK 6 | SOLUTIONS

**Problem 6**

Given: $T_1, P_1, T_2, P_2$ } spreadsheet; $\dot{m} = 30$ kg/s; $R = 287$ J/kg-K; $c_v = 714$ J/kg-K

Assume: ideal gas (+1/2); $c_p, c_v$ = const (+1/2); quasi-eq. (+1/2); steady flow (+1/2); $\Delta ke = \Delta pe = 0$ (+1/2); $Q = 0$ (+1/2)

a) steady-flow → $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ (+2), with $\Delta ke \to 0$ (+1), $\Delta pe \to 0$, $\dot{Q} \to 0$ (+1)

compressor → $\dot{m}(h_2 - h_1) = -\dot{W}$

ideal gas / $c_p$ = const → $\dot{m}c_p(T_2 - T_1) = -\dot{W}$ (+2)

$$\dot{W} = -\dot{m}c_p(T_2 - T_1) \quad \text{where } c_p = c_v + R$$

b) plot → +2 for changing units; +2 for readability; +5 [?] for correct trend (digit overwritten)

c) Trends → +3 for any reasonable trends

Compressor → compress fluid ahead of combustor so energy can be extracted in turbine.

+3 for any reasonable explanation
