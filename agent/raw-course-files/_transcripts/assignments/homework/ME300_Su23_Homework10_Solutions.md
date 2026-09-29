---
source: me300/assignments/homework/ME300_Su23_Homework10_Solutions.pdf
pages: 7
kind: homework-solutions
transcribed_by: deepseek-flash (from page images)
---

## Page 1

ME300 | Homework 10 | Solutions

[2] Given: $\dot{m} = 0.1 \ \text{kg/s}$
$P_1 = P_4 = 0.16 \ \text{MPa}$
$P_2 = P_3 = 1.8 \ \text{MPa}$
$x_1 = 1$
$x_3 = 0$
$\eta_{comp} = 0.9$

Assume:
S.C.S. ✓ +½
: quasi-eq. ✓ +½
: steady-flow ✓ +½
+½ : compressor: $\Delta ke = \Delta pe = \dot{Q} = 0$
+½ : condenser/evaporator: $\Delta ke = \Delta pe = \dot{Q} = \dot{W} = 0$
+½ : throttle: $\Delta ke = \Delta pe = \dot{Q} = \dot{W} = 0$

a) Cycle powered by compressor

→ Steady-flow: $\dot{m}\left(\Delta h + \Delta \overline{ke} + \Delta \overline{pe}\right) = \dot{Q} - \dot{W}$

→ compressor: $\dot{m}(h_2 - h_1) = -\dot{W}$ (+2)

$\dot{W} = -\dot{m}(h_2 - h_1)$

→ State 1: $P_1 = 0.16 \ \text{MPa}$
$x_1 = 1$
→ $h_1 = h_g = 389.27 \ \text{kJ/kg}$ (+1)
$s_1 = s_g = 1.7376 \ \text{kJ/kg-K}$

→ State 2s: $P_2 = 1.8 \ \text{MPa}$
$s_{2s} = s_1 = 1.7376 \ \frac{\text{kJ}}{\text{kg-K}} \rightarrow s_{2s} > s_g \rightarrow \text{vapor}$
$h_{2s} = 439.93 \ \text{kJ/kg}$ (+1)

→ State 2: $\eta_{comp} = \dfrac{\dot{W}_{ideal}}{\dot{W}_{real}} = \dfrac{h_{2s} - h_1}{h_2 - h_1}$ (+2)

$h_2 + h_1 + \dfrac{h_{2s} - h_1}{\eta_{comp}} = 389.27 + \dfrac{439.93 - 389.27}{0.9}$

$h_2 = 445.56 \ \frac{\text{kJ}}{\text{kg}}$ (+1)

$\Rightarrow \dot{W} = -(0.1)(445.56 - 389.27)$

**ANSWER:** $\boxed{\dot{W} = -5.629 \ \text{kW}}$ (+1)

[transcriber note: the line reading "$h_2 + h_1 + \dfrac{h_{2s}-h_1}{\eta_{comp}}$" appears to be written with a "+" where an "=" is algebraically intended; transcribed as written.]

## Page 2

ME 300 | HOMEWORK 10 | SOLUTIONS

b) Remove from cold-space → evaporator
→ Steady-flow: $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$
→ evaporator: $\dot{m}(h_1 - h_4) = \dot{Q}$ (+2)

→ State 4: $h_4 = h_3 = 292.26\ \frac{kJ}{kg}$ (+1)
→ State 3: $P_3 = 1.8\ MPa$, $x_3 = 0$ → $h_3 = h_f = 292.26\ \frac{kJ}{kg}$ (+1)
$s_3 = s_f = 1.2987\ \frac{kJ}{kg-K}$
⇒ $\dot{Q} = \dot{m}(h_1 - h_4)$
$= (0.1)(389.27 - 292.26)$
**ANSWER:** $\boxed{\dot{Q} = 9.701\ kW}$ (+1)

c) $\beta_{Hig} = \frac{\dot{Q}_H}{\dot{W}_{in}} = \frac{9.701}{5.629}$ → **ANSWER:** $\boxed{\beta_{Hig} = 1.72}$ (+1)

$\beta_{Carnot} = \frac{T_L}{T_H - T_L} = \frac{T_4}{T_{3s} - T_4} = \frac{257.56}{345.36 - 257.56}$

**ANSWER:** $\boxed{\beta_{Carnot} = 2.93}$ (+1)

d) State 4: $s_{4,s} = s_3 = 1.2987\ \frac{kJ}{kg-K}$ (+1) → $s_f < s_{4,s} < s_g$
$P_4 = 0.16\ MPa$
$x_{4,s} = \frac{1.2987 - 0.97262}{1.7376 - 0.97262} = 0.46$ (+1)

$h_{4,s} = x_{4,s}h_g + (1 - x_{4,s})h_f$
$= 0.46(389.27) + (1 - 0.46)(179.37)$
$= 275.924\ kJ/kg$ (+1)

$\dot{W} = -\dot{m}(h_{4,s} - h_3) = -0.1(275.924 - 292.26)$

**ANSWER:** $\boxed{\dot{W} = 1.634\ kW}$ (+2)

## Page 3

ME300 Homework 10 — SOLUTIONS

**[3]** Given: $P_2/P_1 = 12.2$
- $\dot{m} = 21.5$ kg/s
- $\dot{Q} = 18$ MW
- $\eta_{comp} = 0.85$
- $\eta_{turb} = 0.9$
- $T_1 = 278$ K, $P_1 = 95900$ Pa

Assume : air standard (+1/2)
- quasi-eq (+1/2)
- steady-flow (+1/2)

→ compressors: $\Delta ke = \Delta pe = \dot{Q} = 0$
→ combustor: $\Delta ke = \Delta pe = \dot{W} = 0$ (+1/2)

a) State 1:
$$\boxed{T_1 = 278 \text{ K}}$$
$$\boxed{P_1 = 95900 \text{ Pa}}$$

State 2: $P_2 = (P_2/P_1)P_1 = (12.2)(95900) \rightarrow \boxed{P_2 = 1169980 \text{ Pa}}$ (+1)

$T_{2s} = T_1 (P_r)^{(k-1)/k} = 278(12.2)^{\frac{0.4}{1.4}} = 568.1$ K (+1) (+2)

$\eta_{comp} = \dfrac{\dot{W}_{ideal}}{\dot{W}_{real}} = \dfrac{T_{2s} - T_1}{T_2 - T_1}$ (+2)

$$T_2 = T_1 + \frac{T_{2s} - T_1}{\eta_{comp}} = 278 + \frac{568.1 - 278}{0.85}$$

**ANSWER:** $\boxed{T_2 = 619.29 \text{ K}}$ (+1)

State 3: steady-flow → $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$

combustor → $\dot{m}(h_3 - h_2) = \dot{Q}$ (+2)

ideal gas, $c_p = const$ → $\dot{m}c_p(T_3 - T_2) = \dot{Q}$ (+1)

$\implies T_3 = T_2 + \dfrac{\dot{Q}}{\dot{m}c_p} = 619.29 + \dfrac{18 \times 10^6}{(21.5)(1001)}$

**ANSWER:** $\boxed{T_3 = 1455.7 \text{ K}}$ (+1)
**ANSWER:** $\boxed{P_3 = P_2 = 1169980 \text{ Pa}}$ (+1)

## Page 4

[handwritten] ME300 | HOMEWORK 10 | SOLUTIONS

[handwritten] State 4s: $P_4 = P_1 = 95{,}900$ Pa (+1)

[handwritten] $$T_{4s} = T_3\left(\frac{P_4}{P_3}\right)^{\frac{k-1}{k}} = 1455.7\left(\frac{1}{12.2}\right)^{\frac{0.4}{1.4}} = 712.33\ \text{K}$$ (+1)

[handwritten] State 4: $\eta_{turb} = \dfrac{\dot{W}_{real}}{\dot{W}_{ideal}} = \dfrac{T_4 - T_3}{T_{4s} - T_3}$ (+2)

[handwritten] $$T_4 = T_3 + \eta_{turb}(T_{4s} - T_3) = 1455.7 + 0.9(712 - 1455.7)$$

[handwritten] **ANSWER:** $\boxed{T_4 = 786.67\ \text{K}}$ (+1)

[handwritten] b) $\dot{W}_{net} = \dot{W}_{comp} + \dot{W}_{turb}$ (+2)

[handwritten] $$= -\dot{m}c_p(T_2 - T_1) - \dot{m}c_p(T_4 - T_3)$$

[handwritten] $$= -21.5(1001)\left[(619.29 - 298) + (786.67 - 1455.7)\right]$$

[handwritten] **ANSWER:** $\boxed{\dot{W}_{net} = 7.05\ \text{MW}}$ (+1)

[handwritten] c) $\eta_{th} = \dfrac{\dot{W}_{net}}{\dot{Q}_{in}}$ (+2) $\rightarrow$ $\dfrac{7.05}{18}$ $\longrightarrow$ **ANSWER:** $\boxed{\eta_{th} = 0.392}$ (+2)

## Page 5

ME300   HOMEWORK 10   SOLUTIONS

**4** Given: $T_1 = 300\ \mathrm{K}$
$P_1 = 0.1\ \mathrm{MPa}$
$\mathcal{V}_1 = 0.625\ \mathrm{L} = 0.000625\ \mathrm{m^3}$
${}_2Q_3 = 1500\ \mathrm{J}$
$r = \dfrac{\mathcal{V}_1}{\mathcal{V}_2} = 11$ (+1/2)

Assume : air standard (+1/2)
: quasi-eq. (+1/2)
: reversible (+1/2)
: $M = \mathrm{const}$ (+1/2)
: $\Delta KE = \Delta PE = 0$ (+1/2)

[handwritten] Otto (written in left margin)

a) Ideal gas $\rightarrow$ $P_1\mathcal{V}_1 = MRT_1 \rightarrow M = \dfrac{P_1\mathcal{V}_1}{RT_1} = \dfrac{(100000)(0.625\times 10^{-3})}{(287)(300)} = 0.000726\ \mathrm{kg}$ (+1)

State 1 : 
$\boxed{T_1 = 300\ \mathrm{K}}$
$\boxed{P_1 = 0.1\ \mathrm{MPa}}$
$\boxed{\mathcal{V}_1 = 0.000625\ \mathrm{m^3}}$

State 2 : $\mathcal{V}_2 = \dfrac{\mathcal{V}_1}{r} = \dfrac{0.000625}{11} \rightarrow \boxed{\mathcal{V}_2 = 0.0000568\ \mathrm{m^3}}$ (+1/2)

$P_2 = P_1 r^{1.4} = 0.1\,(11)^{1.4} \rightarrow \boxed{P_2 = 2.87 \times 10^4\ \mathrm{Pa}}$ (+1/2)

$T_2 = \dfrac{P_2\mathcal{V}_2}{MR} = \dfrac{(2.87\times 10^4)(0.0000568)}{(0.000726)(287)} \rightarrow \boxed{T_2 = 782.4\ \mathrm{K}}$ (+1/2)

State 3 : $\Delta U = Q - W$ (+2)
$\quad\quad\quad\quad \rightarrow$ where $\Delta \mathcal{V} = 0$

Ideal gas : $Mc_v(T_3 - T_2) = {}_2Q_3$ (+1)

$T_3 = T_2 + \dfrac{{}_2Q_3}{Mc_v} = 782.4 + \dfrac{1500}{(0.000726)(714)}$

$\boxed{T_3 = 3676.12\ \mathrm{K}}$ (+1/2)
$\boxed{\mathcal{V}_3 = \mathcal{V}_2 = 0.0000568\ \mathrm{m^3}}$ (+1/2)

$P_3 = \dfrac{MRT_3}{\mathcal{V}_3} = \dfrac{(0.000726)(287)(3676.12)}{0.0000568} \rightarrow \boxed{P_3 = 13.49\ \mathrm{MPa}}$ (+1/2)

## Page 6

ME300 Homework 10 Solutions

[handwritten] **State 4:** $\mathcal{V}_4 = \mathcal{V}_1 = 0.000625\ \text{m}^3$ (+1/2)

[handwritten] $$P_4 = P_3\left(\frac{1}{r}\right)^{\gamma} = 13.49\left(\frac{1}{11}\right)^{1.4} = 469970.4\ \text{Pa}$$ (+1/2)

[handwritten] $$T_4 = \frac{P_4\mathcal{V}_4}{MR} = \frac{(469970.4)(0.000625)}{(0.000726)(287)} \;\Rightarrow\; \boxed{T_4 = 1409.7\ \text{K}}$$ (+1/2)

**ANSWER:** $T_4 = 1409.7\ \text{K}$

[transcriber note: this State 4 calculation uses $P_3 = 13.49$ MPa, whereas State 3 is boxed below as $P_3 = 2.87$ MPa.]

[handwritten] *Diesel* (underlined, written sideways at left margin)

[handwritten] **State 1:** [boxed]
$T_1 = 300\ \text{K}$
$P_1 = 0.1\ \text{MPa}$
$\mathcal{V}_1 = 0.000625\ \text{m}^3$

[handwritten] **State 2:** same compression as Otto: [boxed]
$T_2 = 782.4\ \text{K}$
$\mathcal{V}_2 = 0.0000568\ \text{m}^3$
$P_2 = 2.87\ \text{MPa}$ (+1/2)

**ANSWER:** $T_2 = 782.4\ \text{K}$, $\mathcal{V}_2 = 0.0000568\ \text{m}^3$, $P_2 = 2.87\ \text{MPa}$

[handwritten] **State 3:** $\Delta U = {}_2Q_3 - {}_2W_3$ (+2)

[handwritten] $$M c_v (T_3 - T_2) = {}_2Q_3 - P(\mathcal{V}_3 - \mathcal{V}_2)$$

[handwritten] $$\Rightarrow\ PV = MRT$$

[handwritten] $$M c_v (T_3 - T_2) = {}_2Q_3 - MR(T_3 - T_2)$$ (+2)

[handwritten] $$M(c_v + R)(T_3 - T_2) = {}_2Q_3 = M c_p (T_3 - T_2)$$
(with "$c_p$" written in small above, next to the right-hand side)

[handwritten] $$T_3 = T_2 + \frac{{}_2Q_3}{M c_p} = 782.4 + \frac{1500}{(0.000726)(1000)}$$

[handwritten] $$\boxed{T_3 = 2848.52\ \text{K}}$$ (+1/2)

**ANSWER:** $T_3 = 2848.52\ \text{K}$

[handwritten] $$\boxed{P_3 = P_2 = 2.87\ \text{MPa}}$$ (+1/2)

**ANSWER:** $P_3 = P_2 = 2.87\ \text{MPa}$

[handwritten] $$\mathcal{V}_3 = \frac{MRT_3}{P_3} = \frac{(0.000726)(287)(2848.52)}{2.87 \times 10^6}$$

[handwritten] $$\boxed{\mathcal{V}_3 = 0.00021\ \text{m}^3}$$ (+1/2)

**ANSWER:** $\mathcal{V}_3 = 0.00021\ \text{m}^3$

## Page 7

**ME300 Homework 10 — Solutions**

State 1: $V_4 = V_1 = 0.000625\ \text{m}^3$ (+½)

$$P_4 = P_3\left(\frac{V_3}{V_4}\right)^{\gamma} = (2.87\times10^6)\left(\frac{0.00021}{0.000625}\right)^{1.4}$$

**ANSWER:** $P_4 = 623385.77\ \text{Pa}$ (+½)

**ANSWER:** $T_4 = \dfrac{P_4 V_4}{MR} = \dfrac{(623385.77)(0.000625)}{(0.000726)(287)} = T_4 = 1869.9\ \text{K}$ (+½)

b)

[figure] Left: $P$–$\bar{V}$ diagram ($P$ vertical, $\bar{V}$ horizontal) labelled "otto": state ① at bottom right, isentropic compression 1→2 up to state ② (marked "② otto (+1)"), then an expansion path 2→3 marked "③ diesel (+1)", then a path down to ④, with labels "④ diesel" and "④ otto"; an arrow along the expansion is marked "$\bar{W}_{net}$ diesel"; a shaded region lies between the otto path and the diesel path, and a hatched region covers the rest of the loop area.]

[figure] Right: $P$–$\bar{V}$ diagram labelled "Diesel": state ① at bottom right, compression 1→2, heat addition 2→3 at the top, expansion 3→4, and return 4→1, with the enclosed loop shaded.]

c)

$$\overline{W}_{net,otto} = {}_1\overline{W}_2 + {}_3\overline{W}_4 = -MC_v\left[(T_2-T_1) + (T_4-T_3)\right] \quad (+1)$$

$$= -(0.000726)(714)\left[(782.4-300) + (1409.7-3676.12)\right]$$

$$\overline{W}_{net,otto} = 924.77\ \text{J}$$

$$\eta_{otto} = \frac{924.77}{1500} \rightarrow$$

**ANSWER:** $\boxed{\eta_{otto} = 0.617}$ (+1)

$$\overline{W}_{net,diesel} = {}_1\overline{W}_2 + {}_2\overline{W}_3 + {}_3\overline{W}_4 \quad (+1)$$

$$= -MC_v(T_2-T_1) + P(V_3-V_2) - MC_v(T_4-T_3)$$

$$= -(0.000726)(714)\left[(782.4-300) + (1869.9-2848.52)\right] + (2.87\times10^6)(0.00021-0.0000568)$$

$$\overline{W}_{net,diesel} = 696.9\ \text{J}$$

$$\eta_{diesel} = \frac{696.9}{1500} \rightarrow$$

**ANSWER:** $\boxed{\eta_{diesel} = 0.465}$ (+1)
