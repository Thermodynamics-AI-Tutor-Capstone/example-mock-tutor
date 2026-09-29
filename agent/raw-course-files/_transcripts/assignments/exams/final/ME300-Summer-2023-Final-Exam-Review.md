---
source: me300/assignments/exams/final/ME300-Summer-2023-Final-Exam-Review.pptx
pages: 13
kind: review
transcribed_by: claude (from pptx slide XML + rendered ink)
---

## Slide 1
ME300 Final Exam Review

Monday, August 7, 2023

[figure] Decorative title-slide background image (abstract blue/white swirls). No technical content.

## Slide 2
[handwritten] **Summer 2021, 1.3**

$W = \int_{V_1}^{V_2} P\,dV$ = area under curve (script V = total volume)

$V_2 > V_1 \rightarrow W > 0$

$V_1 > V_2 \rightarrow W < 0$

[handwritten, red] $\Delta S_A = S_2 - S_1$, $\Delta S_B$ [the S is written as script/total entropy]

☆ property vs. path-dependent variable

- property (underlined in red) = path independent: $\Delta U = U_2 - U_1$, $\Delta S = S_2 - S_1$
- path-dependent variable: ${}_1W_2$, ${}_1Q_2$

cycle

Clockwise, $W_{net} > 0$ — power cycle

anti clockwise, $W_{net} < 0$ — heating cycle

[figure] Left: P–V axes (P vertical, V horizontal). A closed loop with state ① on the left and state ② on the right; upper path labelled B, lower path labelled A, arrows on both the upper and lower paths pointing left-to-right (from 1 to 2 along both A and B).

[figure] Right, labelled "cycle": P–V axes with a closed loop hatched inside; the hatched area is pointed to and labelled "$W_{net}$ of cycle". Arrows on the loop run clockwise (right along the top, left along the bottom).

## Slide 3
[handwritten] **HW10, #2**

Given: $\dot{m} = 0.1$ kg/s

$P_1 = P_4 = 0.16$ MPa

$P_2 = P_2 = 1.8$ MPa [transcriber note: written "P₂ = P₂"; presumably $P_2 = P_3$]

$x_1 = 1$, $x_3 = 0$

$\eta_{comp} = 0.9 = \dfrac{\dot{W}_{ideal}}{\dot{W}_{real}}$ ✓

Find: $\dot{W}_{comp}$?

Assume: s.c.s. ✓, quasi-eq., steady-flow; compressor: $\dot{Q} = 0$, $\Delta pe = \Delta ke = 0$

$\dot{W}_{comp}$ → steady flow: $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ (ke, pe and $\dot{Q}$ crossed out)

compressor: $\dot{W} = -\dot{m}(h_2 - h_1)$ (check marks under $\dot{m}$ and $h_1$)

State 1: $P_1 = 0.16$ MPa, $x_1 = 1$ → $h_1 = h_g = 389.27$ kJ/kg; $s_1 = s_g = 1.7376$ kJ/kg [sic, units written kJ/kg]

State 2s: $P_2 = 1.8$ MPa; $s_{2,s} = s_1 = 1.7376$ kJ/kg

→ $s_{2,s} > s_g$ → vapor

→ $h_{2,s} = 439.93$ kJ/kg

State 2: $\eta_c = \dfrac{\dot{W}_{ideal}}{\dot{W}_{real}}$ → $\dot{W}_{real} = \dfrac{\dot{W}_{ideal}}{\eta_c} = \dfrac{-\dot{m}(h_{2,s} - h_1)}{\eta_c}$

$\dot{W}_{real} = -\dot{m}(h_2 - h_1)$ (arrow pointing to $h_2$, from the result below)

$\dot{W}_{real} = -5.629$ kW

## Slide 4
[handwritten] **Heat cycles**

- Vapor compression cycle
  - 1-2: adiabatic compression — compression
  - 2-3: isobaric heat rejection — condenser
  - 3-4: throttled expansion ($h_4 = h_3$) — throttle
  - 4-1: isobaric heat addition — evaporator

→ cooling/refrigerator: $\beta = \dfrac{{}_4\dot{Q}_1}{{}_1\dot{W}_2}$ | → heating: $\beta = \dfrac{{}_2\dot{Q}_3}{{}_1\dot{W}_2}$

**Power cycles** ⇒ $\eta_{th} = \dfrac{\dot{W}_{net}}{Q_{in}}$

- phase change — Rankine (steam plant)
- "Air standard" — Brayton (Gas turbine), Otto, Diesel (piston engines)

[figure] T–s diagram with vapor dome. State ① on the saturated-vapor line; vertical line up from ① to ② (superheated, above/right of dome), note "$h_2 > h_1$". Horizontal line at higher T from the right side of dome to ③ on the saturated-liquid line. Dashed line from ③ down to ④ inside the dome (throttle). Horizontal arrow from ④ to ① (evaporation).

## Slide 5
[handwritten] **Rankine (steam plant)**

- 1-2: adiabatic compression (pump)
- 2-3: isobaric heat addition (boiler)
- 3-4: adiabatic expansion (turbine)
- 4-1: isobaric heat rejection (condenser)

$\eta_{th} = \dfrac{{}_1\dot{W}_2 + {}_3\dot{W}_4}{{}_2\dot{Q}_3}$

**Brayton cycle (gas turbine)**

- 1-2: adiabatic compression (compressor)
- 2-3: isobaric heat addition (combustor)
- 3-4: adiabatic expansion (turbine)
- 4-1: isobaric heat rejection

☆ Steady-flow

$\eta_{th} = \dfrac{{}_1\dot{W}_2 + {}_3\dot{W}_4}{{}_2\dot{Q}_3}$

[figure] Rankine T–s diagram with vapor dome: ① at bottom left on saturated-liquid line, vertical short arrow up to ② (compressed liquid); from ② horizontal arrow across the dome to ③ (superheated, top right); vertical arrow down from ③ to ④ (inside dome, right); horizontal arrow from ④ back left to ①.

[figure] Brayton P–V diagram: ② upper left and ③ upper right joined by a horizontal arrow (isobaric, 2→3); curve from ③ down to ④ lower right; horizontal arrow from ④ left to ① at bottom (isobaric 4→1); curve from ① up to ② with arrow.

## Slide 6
[handwritten] ☆ Trapped mass → finite time 1st law $\Delta E = Q - W$

**Otto Cycle (spark-ignition engine)**

- 1-2: adiabatic compression (compression stroke)
- 2-3: isochoric heat addition
- 3-4: adiabatic expansion (power stroke)
- 4-1: isochoric heat rejection

$\eta_{th} = \dfrac{{}_1W_2 + {}_3W_4}{{}_2Q_3}$

**Diesel Cycle (very old diesel engines)**

- 1-2: adiabatic compression (compression stroke)
- 2-3: isobaric heat addition } power stroke
- 3-4: adiabatic expansion } power stroke
- 4-1: isochoric heat rejection

$\eta_{th} = \dfrac{{}_1W_2 + {}_2W_3 + {}_3W_4}{{}_2Q_3}$

[figure] Otto P–V: ① bottom right; curve up-left (arrow) to ② at small volume; vertical line up from ② to ③; curve from ③ down-right (arrow) to ④; vertical arrow down from ④ to ①.

[figure] Diesel P–V: ② upper left, horizontal arrow right to ③; curve down-right from ③ to ④; vertical arrow down from ④ to ① (bottom right); curve from ① back up-left to ②.

## Slide 7
[handwritten] **Heat cycles (refrigerators + heat pump)** — goal: move around heat

Cooling (refrigerator): $\beta = \dfrac{\dot{Q}_L}{\dot{W}_{in}} \Rightarrow \beta_{max} = \dfrac{T_L}{T_H - T_L}$ (labelled "Carnot COP")

Heating (heat pump): $\beta = \dfrac{\dot{Q}_H}{\dot{W}_{in}} \Rightarrow \beta_{max} = \dfrac{T_H}{T_H - T_L}$

If cycle is reversible: (Kelvin) $\dfrac{Q_H}{Q_L} = \dfrac{T_H}{T_L}$ if T is in absolute Temp scale

Energy conservation: $\dot{Q}_L + \dot{W}_{in} = \dot{Q}_H$

[figure] Schematic: box $T_H$ at top, box $T_L$ at bottom, circle "cycle" in between. Arrow $\dot{Q}_L$ up from $T_L$ into the cycle; arrow $\dot{Q}_H$ up from the cycle into $T_H$; arrow $\dot{W}_{in}$ entering the cycle from the right.

## Slide 8
[handwritten] **Exam 2022, 1.1, 1.2, 1.4**

I.1: $\beta_{frig} = \dfrac{\dot{Q}_L}{\dot{W}_{in}}$ → $\dfrac{\text{What do I want?}}{\text{What did I pay for?}}$ → $\dot{Q}_L$ / $\dot{W}_{in}$

I.2: Brayton and Rankine → difference: working fluid. Brayton: air; Rankine: phase-change

I.4: $\sum_{cycle} \Delta S = 0$ entropy is a property

$= (S_2 - S_1) + (S_3 - S_2) + (S_4 - S_3) + (S_1 - S_4)$

$= 0$

[figure] P–V diagram with a four-state closed loop: ② upper left, ① right-middle, ④ lower right, ③ lower left. Arrows: from ① up-left to ②; from ② down to ③; from ③ right to ④; from ④ up to ①.

## Slide 9
[handwritten] **HW 10, #4 Diesel cycle**

$\eta_{th} = \dfrac{W_{net}}{Q_{in}}$, $\Delta ke = \Delta pe = 0$

$r = \dfrac{V_1}{V_2}$

$W = \int P\,dV$

$W_{net} = {}_1W_2 + {}_2W_3 + {}_3W_3$ [transcriber note: last term written "₃W₃"; presumably ${}_3W_4$]

Process 1-2: adiabatic compression, reversible — isentropic compression

→ $P_2 = P_1 r^{\gamma}$

$T_2 = T_1 r^{\gamma - 1}$

: $\Delta U = Q - W$ (Q crossed out, → 0) → ideal gas, $c_v$ = const: $Mc_v\Delta T = -W$

⇒ ${}_1W_2 = -Mc_v(T_2 - T_1) < 0$ ✓

Process 3-4 (ideal): isentropic expansion

$P_4 = P_3\left(\dfrac{V_3}{V_4}\right)^{\gamma}$

$T_4 = T_3\left(\dfrac{V_3}{V_4}\right)^{\gamma - 1}$

⇒ ${}_3W_4 = -Mc_v(T_4 - T_3) > 0$

[figure] Diesel P–V diagram: ② upper left at $V_2$ (dashed vertical line down to $V_2$ on the axis), horizontal arrow to ③; curve from ③ down to ④; vertical arrow down from ④ to ① at $V_1$; curve from ① back up to ②.

## Slide 10
[handwritten] **Process 2-3:** $\Delta U = {}_2Q_3 - {}_2W_3$

ideal gas, $c_v$ const: $Mc_v(T_3 - T_2) = {}_2Q_3 - {}_2W_3$

→ $\alpha = \dfrac{V_3}{V_2}$ → $V_3 = \alpha V_2$, $P_3 = P_2$ → $T_3 = \dfrac{P_3 V_3}{MR}$

→ ${}_2W_3 = \int P\,dV = P_3(V_3 - V_2)$

→ solve for ${}_2Q_3$

→ ${}_2Q_3 =$ ____ → ${}_2Q_3 = Mc_v(T_3 - T_2) + P_3(V_3 - V_2)$ (✓ under ${}_2Q_3$, $T_2$ and $V_2$; arrow from "$P_2$" down to $P_3$)

(arrow up to $T_3$ from) $\dfrac{P_3 V_3}{MR}$ → $V_3$; $T_3 = \dfrac{P_3 V_3}{MR}$

## Slide 11
[handwritten] → $T_{max} = T_3 =$ ____

$Mc_v(T_3 - T_2) = {}_2Q_3 - {}_2W_3$

$= {}_2Q_3 - P_3(V_3 - V_2)$, with $P_3 = P_2$

${}_2Q_3 = Mc_v(T_3 - T_2) + P_3(V_3 - V_2)$, $V_3 = \dfrac{MRT_3}{P_3}$ [written "MKT₃"; read as $MRT_3$ ?]

## Slide 12
[handwritten] **Isentropic efficiency** — not for a cycle, for a component (adiabatic)

→ work input (compressors, fans, pumps): $\dot{W}_{real} > \dot{W}_{ideal}$ (ideal ← reversible)

: $\eta_{isen} = \dfrac{\dot{W}_{ideal}}{\dot{W}_{real}}$

→ work output (turbine): $\dot{W}_{real} < \dot{W}_{ideal}$

$\eta_{isen} = \dfrac{\dot{W}_{real}}{\dot{W}_{ideal}}$

## Slide 13
[handwritten] Isentropic compression: given $P_1$ and $P_2$ or $P_2/P_1$, $T_1$; $\eta_{isen} = 1$

: state 2: $s_2 = s_1$ → $T_2$, $h_2$, ...

(horizontal dividing line)

Adiabatic, irreversible compression, $\eta_{isen} < 1$

State 1: $P_1$, $T_1$

State 2s: $s_{2,s} = s_1$, $P_2$ ⇒ $T_{2s}$, $h_{2s}$

State 2: $\eta_{isen} = \dfrac{-\dot{m}(h_{2,s} - h_1)}{-\dot{m}(h_2 - h_1)} = \dfrac{\dot{W}_{ideal}}{\dot{W}_{real}}$ ($\dot{m}$ cancelled top and bottom; arrow from $h_{2s}$ into numerator; $h_2$ in denominator underlined as the unknown)
