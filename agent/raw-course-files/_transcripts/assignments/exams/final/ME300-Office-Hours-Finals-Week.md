---
source: me300/assignments/exams/final/ME300-Office-Hours-Finals-Week.pptx
pages: 12
kind: review
transcribed_by: claude (from pptx slide XML + rendered ink)
---

## Slide 1
ME300 Office Hours

Wednesday, August 9, 2023

## Slide 2
[handwritten] **2022 Exam**

↳ I.1: $\beta = \dfrac{\text{what we want}}{\text{what we paid}}$ → $\beta_{refrigerator} = \dfrac{\dot{Q}_L}{\dot{W}_{in}}$

(bracket under "what we want" →) goal of refrigerator is to remove heat from cold space

↳ I.2: Rankine → working fluid undergoes phase change (underlined)

Brayton → air standard, no phase change

## Slide 3
[handwritten] **I.3:**

→ Refrigeration cycle

→ $W = \int P\,dV < 0$ because of counterclockwise

→ $W_{net} < 0$, work into cycle

$W_{net} = W_{in}$ [written "$W_{net} = W_{in}$" beside the arrow into the cycle; sign convention not shown]

**I.4** $\sum_{cycle} \Delta S = ?$

$= 0$ ← entropy is a property, and all properties of system return to original state

[figure] P–V diagram (P vertical, V horizontal) with a closed loop: state 2 at top-left, state 1 on the right upper side, state A [likely "4"] at lower right, state 3 at lower left. A horizontal dashed line crosses the loop at mid-height. Arrows: from 1 up to 2 (top), from 2 down-left toward 3, from 3 right along the bottom toward A, from A up the right side toward 1 — i.e. counterclockwise.

[figure] Schematic: box $T_H$ at top, box $T_L$ at bottom, circle "cycle" between. $Q_L$ arrow up from $T_L$ into the cycle; $Q_H$ arrow up from the cycle into $T_H$; arrow into the cycle from the right labelled "$W_{net} = W_{in}$".

## Slide 4
[handwritten] **I.5** $\dot{W}_{net} = \dot{W}_{comp} + \dot{W}_{turb}$

$\dot{W}_{comp}$: $< 0$, bigger b/c $\eta_c < 1$ → $\dot{W}_{net}\downarrow$

$\dot{W}_{turb}$: $> 0$

→ if $\eta_c < 1$, $\dot{W}_{real} > \dot{W}_{ideal}$

## Slide 5
[handwritten] **Vapor compression**

Throttle: $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$, with $\Delta ke \to 0$, $\Delta pe \to 0$, $\dot{Q} \to 0$, $\dot{W} \to 0$

⇒ $h_4 = h_3$

[figure] Component loop diagram: ① (bottom right) → arrow up into "compressor" (circle) → up to ② (top right) → leftward through "condenser" (box, top), with arrow out of the condenser labelled "$\dot{Q}_H$, $\dot{Q}_{out}$" → ③ (top left) → down into "throttle" (circle) → down to ④ (bottom left) → right through "evaporator" (box, bottom) with arrow in from below labelled $\dot{Q}_L$ → ①. [transcriber note: flow arrows on the condenser line are drawn pointing toward ② even though flow runs 2→3; transcribed as drawn]

## Slide 6
[handwritten] Piston-cylinder: $V_{disp} = V_1 - V_2$ displacement volume (script V = total volume)

$r = V_1/V_2$ compression ratio

Air-standard → Brayton (GT) → $P_2/P_1$

Otto, Diesel } piston-cylinder

## Slide 7
[handwritten] **Heat exchangers**

↳ Rankine: boiler – $\dot{Q}_{in}$, condenser – $\dot{Q}_{out}$

Brayton: combustor – $\dot{Q}_{in}$

Vapor compression: condenser – $\dot{Q}_{out}$, evaporator – $\dot{Q}_{in}$

## Slide 8
[handwritten] **Exam 2021**

↳ I.3 → $W_B > W_A$ (underlined) → $W = \int_{V_1}^{V_2} P\,dV$

↳ $\Delta U_B = \Delta U_A$ → U is property

⇒ First law: $\Delta U = Q - W$

$\Delta U_B = \Delta U_A \Rightarrow Q_B - W_B = Q_A - W_A$

$Q_B > Q_A$

## Slide 9
[handwritten] **Vapor compression:** goal – move heat

- 1-2: adiabatic compression – compressor
- 2-3: isobaric heat rejection – condenser
- 3-4: throttled expansion – throttle
- 4-1: isobaric heat addition – evaporator

Given:

$P_1 = 0.28$ MPa, $x_1 = 1$

$P_2 = 0.9$ MPa, $\eta_c = 1$, $s_2 = s_1$

$x_3 = 0$, $P_3 = P_2$, $P_4 = P_1$

Find: state point (h, s, T, P)

: $\dot{W}_{in}$

: $\dot{Q}_{in}$, $\dot{Q}_{out}$

: $\beta_{cooling} = \dfrac{\dot{Q}_{in}}{\dot{W}_{in}}$

: $\dot{m}$

## Slide 10
[handwritten] g) $\dot{W}_{net,GT} = -\dot{W}_{comp,vc}$ (double underlined)

→ compressor: $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ ($\Delta ke \to 0$, $\Delta pe \to 0$, $\dot{Q} \to 0$)

$\dot{m}(h_2 - h_1) = -\dot{W} = \dot{W}_{net,GT}$

(boxed) $\dot{m} = \dfrac{\dot{W}_{net,GT}}{h_2 - h_1}$

→ State 1: $P_1 = 0.28$ MPa, $x_1 = 1$ → $h_1 = h_g = 397.89$ [?] kJ/kg; $s_1 = s_g = 1.7278$ [?] kJ/kg-K (last digit overwritten)

→ State 2: $P_2 = 0.9$ MPa, $s_2 = s_1 = 1.7278$ kJ/kg-K → $s_2 > s_g$ @ 0.9 MPa → vapor

$h_2 = 422.32$ kJ/kg

## Slide 11
[handwritten] $\dot{Q}_{in} = \dot{m}(h_1 - h_4)$ (✓ under $\dot{m}$ and $h_1$) → $h_4 = h_3$ – throttle

State 3: $P_3 = 0.9$ MPa, $x_3 = 0$ → $h_3 = h_f = 249.78$ [?] kJ/kg (last digit overwritten)

State 4: $h_4 = 249.78$ kJ/kg (arrow back to $h_4$ in $\dot{Q}_{in}$)

$\beta = \dfrac{\dot{Q}_{in}}{\dot{W}_{in}} = \dfrac{\dot{m}(h_1 - h_4)}{-\dot{m}(h_2 - h_1)}$

## Slide 12
[figure] Hand-drawn T–s diagram (T vertical, s horizontal) with a vapor dome. ① on the saturated-vapor line; a vertical line (dashed extension above and below, i.e. constant s) goes up from ① with arrow to ② in the superheated region above-right of the dome. From ② a curve with arrow comes down to the saturated-vapor line and continues as a horizontal line with leftward arrow across the dome to ③ on the saturated-liquid line. Dotted line from ③ down-right to ④ inside the dome (throttle). Horizontal arrow from ④ right to ①.
