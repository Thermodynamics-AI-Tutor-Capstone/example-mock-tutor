---
source: me300/lectures/Module8_6_Example_RankineCycle_annotated.pdf
pages: 6
kind: lecture-example
transcribed_by: deepseek-flash (from page images)
---

## Page 1

ME 300:
Engineering Thermodynamics

Example:
Rankine
Cycle

[figure] Left half of the slide is a photograph: two hyperbolic cooling towers of a power plant silhouetted against a sunset sky, with large plumes of vapor/steam rising from both towers and drifting up and to the left; orange and pink clouds fill the sky, the sun is setting at the horizon on the left, a dark tree line runs along the horizon, and water is visible in the foreground. No labels or values written on it.

## Page 2

# Rankine Cycle

- Rankine cycle with a mass flow of 25 kg/s and the following isentropic efficiencies: $\eta_{isen,t} = 0.93$ [handwritten] turbine
$\eta_{isen,p} = 0.85$ [handwritten] pump
- Fill in the state table, and calculate the Wpump, Qboiler, Wturbine, $\dot{W}_{net}$[?], Qcondenser and the overall thermal efficiency

| State | T(K) | P(MPa) |
|---|---|---|
| 1 | 290 | 0.15 |
| 2 | | 20 |
| 3 | 990 | 19.5 |
| 4 | | 0.2 |

[handwritten] Assume :  S.C.S.
[handwritten] :  steady-flow
[handwritten] :  quasi-eq

[handwritten] $\Delta ke = \Delta pe = 0$

[figure] Table at center with a hand-drawn arrow at the right end of row 1 pointing left toward state 1, and a hand-drawn bracket "⌐" spanning rows 3 and 4 at the right side, indicating the cycle return path from state 4 back to state 1.

## Page 3

# State 1 and 2

[handwritten] State 1: $P_1 = 0.15$ MPa, $T_1 = 290$ K — marked with brace → D.1

[handwritten] $P_{sat} = 1.92$ kPa , $P_1 > P_{sat} \rightarrow$ liquid

[handwritten] $\Rightarrow$ NIST $\boxed{h_1 = 70.7 \text{ kJ/kg}}$

[handwritten] $s_1 = 0.25$ kJ/kg·K

[handwritten] State 2s: $P_2 = 20$ MPa ; $s_{2s} = s_1 = 0.25$ kJ/kg·K — brace → Table D.2 $\rightarrow$ $s_{2s} < s_f \rightarrow$ liquid

[handwritten] $\Rightarrow$ NIST $T_{2s} = 290.26$ K

[handwritten] $h_{2s} = 90.654$ kJ/kg

[handwritten] State 2 : $\eta_p = \dfrac{\dot{W}_{ideal}}{\dot{W}_{real}} = \dfrac{h_{2s} - h_1}{h_2 - h_1}$

[handwritten] $h_2 = \dfrac{h_{2s} - h_1}{\eta_p} + h_1 = \dfrac{90.654 - 70.7}{0.85} + 70.7 \Rightarrow \boxed{h_2 = 94.175 \text{ kJ/kg}}$

## Page 4

# State 3 and 4

[handwritten] State 3 : $P_3 = 19.5\ \text{MPa}$ $\}$ D,2
[handwritten] $T_3 = 990\ \text{K}$
[handwritten] $T_3 > T_{\text{sat}} \rightarrow \text{vapor}$
[handwritten] NIST $\Rightarrow$ $\boxed{\begin{aligned} h_3 &= 3854.9\ \frac{\text{kJ}}{\text{kg}} \\ s_3 &= 6.858\ \frac{\text{kJ}}{\text{kg-K}} \end{aligned}}$

[handwritten] State 4s : $P_4 = 0.2\ \text{MPa}$
[handwritten] $s_{4s} = s_3 = 6.858\ \frac{\text{kJ}}{\text{kg-K}}$ $\}$ D,2 $\rightarrow$ mixture
[handwritten] $x_{4s} = \dfrac{s_{4s}-s_f}{s_g - s_f} \rightarrow x_{4s} = 0.952$
[handwritten] $h_{4s} = x_{4s} h_g + (1-x_{4s})h_f = 2600.5\ \frac{\text{kJ}}{\text{kg}}$

[handwritten] State 4 : $\eta_{\text{turb}} = \dfrac{\dot W_{\text{real}}}{\dot W_{\text{ideal}}} = \dfrac{h_4 - h_3}{h_{4s} - h_3}$
[handwritten] $\Rightarrow h_4 = \eta_{\text{turb}}(h_{4s}-h_3) + h_3$
[handwritten] $\boxed{h_4 = 2688.308\ \frac{\text{kJ}}{\text{kg}}}$

## Page 5

Cycle diagram

[figure] Hand-drawn $T$–$s$ (temperature–entropy) diagram. Vertical axis labelled $T$ (arrow pointing up); horizontal axis labelled $s$ (arrow pointing right). A saturation dome is sketched, its left branch rising from lower left, peaking near the middle, and its right branch descending toward the lower right, ending in a right-pointing arrowhead near the lower-right end of the $s$ axis. Two dashed vertical lines are drawn: one on the left through states ① and ②, one on the right through states ③ and ④. Four states are marked with dots and circled numbers: ① at the lower end of the left dashed line, ② directly above ① on the same dashed line, ③ at the upper end of the right dashed line, ④ directly below ③ on the same dashed line. Process paths with arrowheads: ①→② straight up (near-vertical along the dashed line); ②→③ horizontal to the right (arrowhead pointing right, mid-path); ③→④ downward (arrowhead pointing down); ④→① horizontal to the left (arrowhead pointing left, mid-path).

## Page 6

Work and heat

$$\dot{W}_{pump} = -\dot{m}(h_2 - h_1) = -25(94.18 - 70.7) = -584.3 \text{ kW}$$

$$\dot{W}_{turb} = -\dot{m}(h_4 - h_3) = -25(2688.3 - 3854.9) = 29215 \text{ kW}$$

$$\dot{Q}_{in} = \dot{m}(h_3 - h_2) = 25(3854.9 - 94.18) = 94019 \text{ kW}$$

$$\dot{Q}_{out} = \dot{m}(h_1 - h_4) = 25(70.7 - 2688.3) = -65386 \text{ kW}$$

$$\eta_{th} = \frac{\dot{W}_{pump} + \dot{W}_{turb}}{\dot{Q}_{in}} \Rightarrow$$

**ANSWER:** $$\boxed{\eta_{th} = 0.3}$$

[transcriber note: the arithmetic as written is not self-consistent with the stated enthalpy values (e.g. $-25(94.18-70.7) = -587.0$, not $-584.3$); the numbers are transcribed exactly as written on the page.]
