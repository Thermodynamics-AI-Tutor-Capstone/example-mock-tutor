---
source: me300/assignments/exams/exam-2/ME300_Su23_Exam2Review.pptx
pages: 18
kind: review
transcribed_by: claude (from pptx slide XML + rendered ink)
---

## Slide 1
ME300 Su23
Exam 2 review

Tuesday, July 18

[figure] Title-slide decorative background picture (red/pink low-poly triangle pattern). No content.

## Slide 2
[handwritten] (blue ink)

$$\Delta S = \oint \frac{\delta Q}{T}\Big|_{rev}$$ → reversible: ① ⇄ ② (arrows from 1 to 2 and back) — system returns to original state; **surroundings** return to original state (surroundings underlined heavily).

↳ ★ Boxed (double-underlined ΔS):
$$\Delta S = \int \frac{\delta Q}{T} + \Phi = S_2 - S_1 \sim [\mathrm{J/K}]$$
[transcriber note: the integral sign in the boxed equation is drawn with a small circle like the cyclic-integral sign above; transcribed as $\int$ [?]]

- Under $\int \delta Q/T$: $Q>0$, term $>0$; $Q<0$, term $<0$
- Under $\Phi$: **entropy generation due to irreversibilities** → friction, mixing, plastic deformation
- $\Phi > 0$ if <u>irreversible</u>, $\Phi = 0$ <u>reversible</u>

① Heat addition to system, reversible process → $\int \frac{\delta Q}{T} > 0$, $\Phi = 0$ → $\Delta S > 0$
② Heat addition to system, irreversible process → $\int \frac{\delta Q}{T} > 0$, $\Phi > 0$ → $\Delta S > 0$
③ Heat rejection from system, reversible process → $\int \frac{\delta Q}{T} < 0$, $\Phi = 0$ → $\Delta S < 0$ ★
④ Heat rejection from system, irreversible process → $\int \frac{\delta Q}{T} < 0$, $\Phi > 0$ → $\Delta S = ?$
⑤ Adiabatic, irreversible process → $\int \frac{\delta Q}{T} = 0$, $\Phi > 0$ → $\Delta S > 0$
⑥ Adiabatic, reversible process → $\int \frac{\delta Q}{T} = 0$, $\Phi = 0$, $\Delta S = 0$ (underlined)

(Throughout, S is written with a small tick/prime-like mark, i.e. total entropy S.)

## Slide 3
[handwritten] (blue ink)

S.C.S. → $\mathcal{P}_3 = f(\mathcal{P}_1, \mathcal{P}_2)$ (under $\mathcal{P}_1,\mathcal{P}_2$: independent intensive) → $s = f_1(T,P)$, $s = f_2(T,v)$ (underlined)

(horizontal divider)

Ideal gas →
$$\Delta s = \int_{T_1}^{T_2} c_v \frac{dT}{T} + R\ln\left(\frac{v_2}{v_1}\right)$$
$$\Delta s = \int_{T_1}^{T_2} c_p \frac{dT}{T} - R\ln\left(\frac{P_2}{P_1}\right)$$
(side notes: $Pv = RT$, $du = c_v\,dT$, $dh = c_p\,dT$)

Ideal gas, $c_p, c_v = $ const (heavily underlined) →
$$\Delta s = c_v \ln\left(\frac{T_2}{T_1}\right) + R\ln\left(\frac{v_2}{v_1}\right) \sim [\mathrm{J/kg\text{-}K}]$$
$$\Delta s = c_p \ln\left(\frac{T_2}{T_1}\right) - R\ln\left(\frac{P_2}{P_1}\right)$$

## Slide 4
[handwritten] (blue ink)

2022 exam, #3

$\eta_{th} = 1$ ? → No, never, absolutely not.
↳ Kelvin-Planck:

[figure] Heat-engine schematic: $Q_H$ arrow down into a circle labelled "cycle", $\dot{W}_{net}$ arrow out to the right, $Q_L$ arrow down out of the circle.

$W_{net} \ne Q_H$, $W_{net} < Q_H$ → <u>not</u> due to friction

$$\eta_{th} = \frac{W_{net}}{Q_H} < 1$$ even in reversible world.

(horizontal divider)

① Decelerate air → diffuser
② control flow of water → throttle
③ T↑, P↑ → compressor, through work input
$$\dot{m}(\Delta h + \cancel{\Delta ke} + \cancel{\Delta pe}) = \cancel{\dot{Q}} - \dot{W}$$
$$\dot{m}(h_2 - h_1) = -\dot{W}$$

## Slide 5
[handwritten] (blue ink, then black ink for part b answer)

[figure] Device schematic: ① inlet with $\dot{m} = 20$ kg/s → boiler (box) with heat input $\dot{Q} = 35{,}226$ kW from below → ② → turbine ("turb", trapezoid) → ③ exit.

Given (bracketed): $P_1 = 6$ MPa, $x_1 = 0$; $P_2 = 6$ MPa; $P_3 = 1$ MPa

<u>Assume</u>: S.C.S.; steady-flow; quasi-eq.; reversible $\Phi = 0$
<u>boiler</u>: $\Delta ke = \Delta pe = 0$, $\dot{W} = 0$ <u>turbine</u>: $\Delta ke = \Delta pe = 0$, $\dot{Q} = 0$

b) $T_2$ → boiler: $\dot{m}(\Delta h + \cancel{\Delta ke} + \cancel{\Delta pe}) = \dot{Q} - \cancel{\dot{W}}$
$$\dot{m}(h_2 - h_1) = \dot{Q}$$
(checks under $\dot{m}$, $h_1$, $\dot{Q}$; arrow under $h_2$: "find")

→ State 1: $P_1 = 6$ MPa, $x_1 = 0$; $h_1 = h_f = 1213.9$ kJ/kg Table D.2
$$\rightarrow h_2 = h_1 + \frac{\dot{Q}}{\dot{m}} = 2975.2 \text{ kJ/kg}$$
$h_2 > h_g$ Table D.2 → vapor

**ANSWER:** $T_2 = 600$ K

## Slide 6
[handwritten] (black ink)

c) $T_3 = ?$ → turbine: $\dot{m}(\Delta h + \cancel{\Delta ke} + \cancel{\Delta pe}) = \cancel{\dot{Q}} - \dot{W}$
$$\dot{m}(h_3 - h_2) = -\dot{W}$$
(checks under $\dot{m}$ and $h_2$)

→ turbine: <u>adiabatic</u> ($\dot{Q} = 0$) + <u>reversible</u>: $s_3 = s_2$ (underlined)
→ State 2: $P_2 = 6$ MPa, $h_2 = 2975.2$ kJ/kg → Table D.3N → $s_2 = 6.2233$ kJ/kg-K
→ State 3: $P_3 = 1$ MPa, $s_3 = 6.2233$ kJ/kg-K
Table D.2 → $s_f < s_3 < s_g$ → Mixture

**ANSWER:** $T_3 = T_{sat} = 453.03$ K

## Slide 7
[handwritten] (black ink)

d) $\dot{W} = ?$ → $\dot{m}(h_3 - h_2) = -\dot{W}$
$$\dot{W} = -\dot{m}(h_3 - h_2)$$ (checks under $\dot{m}$, $h_3$, $h_2$)
→ State 3: mixture
$$x_3 = \frac{s_3 - s_f}{s_g - s_f} = \frac{6.2233 - 2.1381}{6.5850 - 2.1381} = 0.919$$
$$h_3 = x_3 h_g + (1 - x_3) h_f = 2613.3 \text{ kJ/kg}$$
$$\Rightarrow \dot{W} = -\dot{m}(h_3 - h_2) = -(20)(2613.3 - 2975.2)$$

**ANSWER:** $\dot{W} = 7238$ kW

## Slide 8
[handwritten] (black ink)

e) T–s diagram.

[figure] T–s axes with saturation dome. State ① (dot) on the saturated-liquid line; horizontal arrow to the right across the dome (constant T/P boiling), continuing up a curve outside the dome to state ② (dot, superheated region, above the dome's right side). Vertical line downward (arrow) from ② to ③ (dot) inside the dome below the saturated-vapor line. Tick on s-axis labelled $s_3 = s_2$.

## Slide 9
[handwritten] (black ink)

$$\Delta S = \oint \frac{\delta Q}{T} + \Phi$$
Under $\int \delta Q/T$: $Q>0$, $>0$; $Q<0$, $<0$; $Q=0$, $0$
Under $\Phi$: $>0$ if irreversible; $=0$ if reversible

$\eta_{isen}$ is the efficiency of a <u>device</u> whose ideal behavior is isentropic
→ ideal = reversible
→ device = <u>adiabatic</u>

<u>Work input</u> (compressors, pumps, fans)
$|\dot{W}_{ideal}| < |\dot{W}_{real}|$ b/c irreversibilities
$$\eta_{isen,comp} = \frac{\dot{W}_{ideal}}{\dot{W}_{real}} \le 1$$

<u>Work output</u> (turbine)
$\dot{W}_{ideal} > \dot{W}_{real}$
$$\eta_{isen,turb} = \frac{\dot{W}_{real}}{\dot{W}_{ideal}} \le 1$$

$\Rightarrow \eta_{isen} < 1$, $s_2 > s_1$ (heavily underlined), $\Phi > 0$, $\oint \frac{\delta Q}{T} = 0$ (this last term has a line struck/drawn over it [?])

## Slide 10
[handwritten] (black ink)

2021, II.1

$x_1 = 1$, $P_1 = 2.1$ MPa; $P_2 = 6$ MPa, $s_2 = s_1$

<u>Assume</u>: water → S.C.S.; quasi-eq.; ($s_2 = s_1$) circled

a) [figure] T–s diagram with saturation dome. State ① (dot) on the saturated-vapor line, on a dashed constant-pressure line labelled $P_1 = 2.1$ MPa. Vertical arrow upward from ① to ② (dot) in the superheated region, on a dashed constant-pressure line labelled $P_2 = 6$ MPa (higher). Vertical dashed line down to s-axis labelled $s_2 = s_1$.

## Slide 11
[handwritten] (black ink)

b) State 1: $P_1 = 2.1$ MPa, $x_1 = 1$ } Table D.2 → $s_1 = s_g = 6.321$ kJ/kg-K; $T_1 = T_{sat} = 488.01$ K

State 2: $P_2 = 6$ MPa, $s_2 = s_1 = 6.321$ kJ/kg-K (both underlined) } Table D.2 [?] (written like "P.2") → $s_2 > s_g$ → vapor; Table D.3N →

**ANSWER:** $T_2 = 620$ K

## Slide 12
[handwritten] (black ink)

c) $c_p = 1000$ J/kg-K, $c_v = 714.29$ J/kg-K; $P_1 = 2.1$ MPa, $T_1 = 488.01$ K; $P_2 = 6$ MPa, $T_2 = ?$

<u>Assume</u>: air → ideal gas → $c_p, c_v =$ const.; isentropic } isentropic relations (underlined)

$$T_2 = T_1\left(\frac{P_2}{P_1}\right)^{\frac{\gamma-1}{\gamma}} \quad \text{where } \gamma = \frac{c_p}{c_v} = \frac{1000}{714.29} = 1.4$$
$$= 488.01\left(\frac{6}{2.1}\right)^{\frac{0.4}{1.4}}$$

**ANSWER:** $T_2 = 658.7$ K

## Slide 13
[handwritten] (black ink)

Left: ① → ② ; isentropic: $s_2 = s_1$

Right (separated by vertical line): Thermal efficiency: cycle
$$\eta_{th} = \frac{W_{net}}{Q_{in}}$$ definition
$$\eta_{th,max} = 1 - \frac{T_L}{T_H}$$ (double-underlined) × not definition
[transcriber note: numerator subscript reads like "2" or "L"; transcribed as $T_L$ [?]]

## Slide 14
[handwritten] (black ink)

2021, II.2 <u>Assume</u>: reversible

<u>Given</u>: $T_H = 1200$ K, $T_L = 300$ K

a) $$\eta_{th} = \frac{W_{net}}{Q_{in}} \rightarrow \text{reversible } \eta_{th} = \eta_{max} = 1 - \frac{T_L}{T_H} = 1 - \frac{300}{1200}$$

**ANSWER:** $\eta_{th} = 0.75$

## Slide 15
[handwritten] (black ink)

b) $Q_L = 10$ kJ, $Q_H = ?$ → reversible cycle: $\frac{Q_L}{Q_H} = \frac{T_L}{T_H}$
$$Q_H = \frac{Q_L}{T_L/T_H} = \frac{10}{0.25} = 40 \text{ kJ}$$
→ $Q_H = W_{net} + Q_L$ and $\eta_{th} = \frac{W_{net}}{Q_H} = 0.75$
$$Q_H = \frac{Q_L}{1 - \eta} = \frac{10}{1 - 0.75} = 40 \text{ kJ}$$

## Slide 16
[handwritten] (black ink)

$$\Delta S = \oint \frac{\delta Q}{T}\Big|_{rev}$$ ↗ cycle is reversible

[figure] Heat-engine schematic: reservoir box $T_H$, $Q_H$ arrow down into circle "cycle", $W_{net}$ arrow out right, $Q_L$ arrow down into reservoir box $T_L$.

$S_2 - S_1 = 0$ → isentropic
$$S_3 - S_2 = \int \frac{\delta Q}{T}\Big|_{rev} = \frac{40 \text{ kJ}}{1200 \text{ K}} = 33.3 \text{ J/K}$$
$S_4 - S_3 = 0$ isentropic
$$S_1 - S_4 = \int \frac{\delta Q}{T}\Big|_{rev} = \frac{Q_L}{T_L} = \frac{-10 \text{ kJ}}{300 \text{ K}} = -33.3 \text{ J/K}$$
$$\Rightarrow \sum_{cycle} \Delta S = 0 = 0 + 33.3 + 0 + \_\_\_\_$$ (arrow from −33.3 J/K pointing to the blank)

## Slide 17
(blank)

## Slide 18
(blank)
