---
source: me300/assignments/homework/ME300_Su23_Homework5_Solutions.pdf
pages: 5
kind: homework-solutions
transcribed_by: claude (from page images)
---

Notation: the solution writer uses a script V ($V$, script V = total volume) and writes extensive energy/work/heat with an overbar ($\bar{U}$, ${}_1\bar{W}_2$). Lowercase $v$ = specific volume, $u$ = specific internal energy. Blue marks are grader point values. No problem statements are given in this file; only handwritten solutions.

## Page 1

[handwritten] Header: ME300 | HOMEWORK 5 | SOLUTIONS

**Problem 1**

[handwritten] Incompressible means that $v$ and $u$ are much more sensitive to changes in $T$ than in $P$. (+10) This means you can approximate

$$v(T,P) \approx v(T) \approx v_f\,(T_{sat} = T)$$
$$u(T,P) \approx u(T) \approx u_f\,(T_{sat} = T)$$

⇒ applies to liquids

**Problem 2**

[handwritten] Given: $M = 58\ \text{lb} = 26.3084\ \text{kg}$; $L = 45\ \text{in} = 1.143\ \text{m}$; $L_{TOT} = 20L = 22.86\ \text{m}$; $c = 4187\ \text{J/kg-K}$; $M_{H_2O} = 7.84\ \text{lb} = 3.556\ \text{kg}$

Assume: S.C.S. (+1); quasi-eq. (+1)

a) $\Delta PE = Mg\Delta z = (26.3084)(9.8)(22.86)$ (+2) → **ANSWER:** $\Delta PE = 5893.82\ \text{J}$ (+1)

b) $\Delta \bar{U} = \Delta PE = M_{H_2O}\, c\, \Delta T$ (+3)

$$\Delta T = \frac{\Delta PE}{Mc} = \frac{5893.82}{(4187)(3.556)}$$ → **ANSWER:** $\Delta T = 0.396\ \text{K}$ (+1)

c) Video: $T_{initial} = 18.152\,^\circ\text{C}$ (+1) $= 291.302\ \text{K}$

$T_{final} = 18.497\,^\circ\text{C} = 291.647\ \text{K}$

$\Delta T = 0.345\ \text{K}$ (+1)

⇒ differences likely due to heat loss to the colder room (+1) [grader note in blue: "or something reasonable"]

d) $T_{boil} = 100\,^\circ\text{C}$ → $\Delta T = 100 - 18.152 = 81.848\,^\circ\text{C} = \text{K}$ (+1)

⇒ $\Delta \bar{U} = \Delta PE$ → $M_{weight}\, g\, \Delta z = M_{H_2O}\, c\, \Delta T$ (+1)

$$\Delta z = \frac{M_{H_2O}\, c\, \Delta T}{M_{weight}\, g} = \frac{(3.556)(4187)(81.848)}{(26.3084)(9.8)}$$

**ANSWER:** $\Delta z = 4726.64\ \text{m}$ (+1) — almost 5 km / ~3 miles!

## Page 2

[handwritten] Header: ME300 | HOMEWORK 5 | SOLUTIONS

**Problem 3**

Given: $M = 5\ \text{kg}$; $V_1 = 1\ \text{m}^3$; $T_1 = 300\ \text{K}$; $T_2 = 500\ \text{K}$; $V_3 = 3\ \text{m}^3$; $R = 287\ \text{J/kg-K}$; $c_v = 714\ \text{J/kg-K}$

Assume: ideal gas (+1); $c_v$ = const. (+1); quasi-eq. (+1); process 1 = isochoric, $V_2 = V_1$ (rigid) (+1); process 2 = isobaric, $P_3 = P_2$; $\Delta KE = 0$, $\Delta PE = 0$ (+1)

a) State 1: $P_1 V_1 = MRT_1$ → $T_1 = 300\ \text{K}$, $V_1 = 1\ \text{m}^3$

$$P_1 = \frac{MRT_1}{V_1} = \frac{(5)(287)(300)}{1}$$ (+2) → **ANSWER:** $P_1 = 430500\ \text{Pa}$ (+1)

State 2: $P_2 V_2 = MRT_2$ → $T_2 = 500\ \text{K}$

**ANSWER:** $V_2 = V_1 = 1\ \text{m}^3$ (+1) b/c sealed

$$P_2 = \frac{MRT_2}{V_2} = \frac{(5)(287)(500)}{1}$$ → **ANSWER:** $P_2 = 717500\ \text{Pa}$ (+1)

State 3: $V_3 = 3\ \text{m}^3$

**ANSWER:** $P_3 = P_2 = 717500\ \text{Pa}$ (+1) b/c isobaric expansion

$$T_3 = \frac{P_3 V_3}{MR} = \frac{(717500)(3)}{(5)(287)}$$ → **ANSWER:** $T_3 = 1500\ \text{K}$ (+1)

b) $\Delta \bar{U} = M c_v \Delta T$ (+2)

→ $\bar{U}_2 - \bar{U}_1 = (5)(714)(500-300) =$ **ANSWER:** $714000\ \text{J}$ (+1)

→ $\bar{U}_3 - \bar{U}_2 = (5)(714)(1500-500) =$ **ANSWER:** $3570000\ \text{J}$ (+1)

## Page 3

[handwritten] Header: ME300 | HOMEWORK 5 | SOLUTIONS

c) $${}_1\bar{W}_2 = \int_{V_1}^{V_2} P\,dV = 0\ \text{J}$$ (+2) **ANSWER:** ${}_1\bar{W}_2 = 0\ \text{J}$ b/c $V_1 = V_2$ (+1)

$${}_2\bar{W}_3 = \int_{V_2}^{V_3} P\,dV = P\int_{V_2}^{V_3} dV = P(V_3 - V_2) = 717500(3-1)$$ (+2)

**ANSWER:** ${}_2\bar{W}_3 = 1435000\ \text{J}$ (+1) — work is done by fluid b/c piston is pushed against surroundings during expansion (+1)

d) $\bar{U}_2 - \bar{U}_1 = {}_1Q_2 - {}_1\bar{W}_2$ (+2) [with ${}_1\bar{W}_2 \to 0$ marked] (+1) → ${}_1Q_2 = \Delta\bar{U}$

**ANSWER:** ${}_1Q_2 = 714000\ \text{J}$ (+1)

$\bar{U}_3 - \bar{U}_2 = {}_2Q_3 - {}_2\bar{W}_3$

${}_2Q_3 = \Delta\bar{U} + {}_2\bar{W}_3 = 3570000 + 1435000$ (+2)

**ANSWER:** ${}_2Q_3 = 5005000\ \text{J}$ (+1)

**Problem 4**

Given: $M = 1\ \text{kg}$; $P_1 = P_2 = 2\ \text{MPa}$; $x_1 = 1$, $x_2 = 0$

Assume: S.C.S. (+1); quasi-eq. (+1); $\Delta KE = \Delta PE = 0$ (+1)

a) [figure] Two sketches side by side. Left: T–v diagram with saturation dome; a horizontal line inside the dome at constant T, with state 1 on the right (saturated-vapor) side of the dome and state 2 on the left (saturated-liquid) side, arrow pointing from 1 to 2 (right to left). Right: P–v diagram with dome; horizontal line at constant P from state 1 (sat. vapor, right) to state 2 (sat. liquid, left), arrow right to left. Each state point marked (+1) (four +1 marks total).

b) $T_1 = T_2 = T_{sat} = 485.53\ \text{K}$ (+1) → $\Delta T = 0$ (+1) because all change in energy is due to change in phase

## Page 4

[handwritten] Header: ME300 | HOMEWORK 5 | SOLUTIONS

c) $${}_1\bar{W}_2 = \int_{V_1}^{V_2} P\,dV = M\int_{v_1}^{v_2} P\,dv = MP\int_{v_1}^{v_2} dv = MP(v_2 - v_1) = MP(v_f - v_g)$$ (+1) (+1)

${}_1\bar{W}_2 = (1)(2000000)(0.0011767 - 0.099585)$

**ANSWER:** ${}_1\bar{W}_2 = -196816.6\ \text{J}$ (+1) — work done on fluid due to compression → $V_2 < V_1$

d) $\Delta\bar{U} = {}_1Q_2 - {}_1\bar{W}_2$

${}_1Q_2 = \Delta\bar{U} + {}_1\bar{W}_2 = M(u_2 - u_1) + {}_1\bar{W}_2$ (+2)
$= M(u_f - u_g) + {}_1\bar{W}_2$
$= (1)(906.14 - 2599.1) - 196.8166\ \text{kJ}$

**ANSWER:** ${}_1Q_2 = -1889.777\ \text{kJ}$ (+1) — heat out b/c energy is being removed from fluid, $Q < 0$

**Problem 5**

Cycle → Assume: S.C.S. (+1); $\Delta PE = \Delta KE = 0$ (+1); quasi-eq. (+1); ${}_1Q_2 = 0$, ${}_3Q_4 = 0$ (+1)

[handwritten, blue] See next page

[figure] Lower half of the page shows faint bleed-through of handwriting from another sheet (not part of this solution; fragments like "$=(10\times10^6)(V_3-V_2)$", "274.902 kJ" [?]) overlaid with scattered blue grader tick marks. Not transcribable as content.

## Page 5

[handwritten] Header: ME300 | HOMEWORK 5 | SOLUTIONS

State 1: $P_1 = 2.6\ \text{MPa}$, $T_1 = 499.2\ \text{K}$, $v_1 = 0.0012014\ \text{m}^3/\text{kg}$
⇒ $x_1 = 0$ [grader mark] → $u_1 = u_f = 968.55\ \text{kJ/kg}$ (+1)

State 2: $P_2 = 5\ \text{MPa}$, $T_2 = 500\ \text{K}$, $v_2 = 0.0012\ \text{m}^3/\text{kg}$
⇒ $T < T_{sat}$ → liquid [grader mark] $u_2 = 969.96\ \text{kJ/kg}$ (+1)

State 3: $P_3 = 5\ \text{MPa}$, $T_3 = 578.5\ \text{K}$, $v_3 = 0.046114\ \text{m}^3/\text{kg}$
⇒ $T > T_{sat}$ → vapor [grader mark] $u_3 = 2711.9\ \text{kJ/kg}$ (+1)

State 4: $P_4 = 2.6\ \text{MPa}$, $T_4 = 499.2\ \text{K}$, $v_4 = 0.076899\ \text{m}^3/\text{kg}$
⇒ $x_4 = 1$ [grader mark] → $u_4 = u_g = 2602.4\ \text{kJ/kg}$ (+1)

[transcriber note: the small blue marks after $x_1=0$, "liquid", "vapor", $x_4=1$ look like struck-through/hash-style grader marks; point value not legible.]

Process 1-2: ${}_1Q_2 = 0$
$\Delta\bar{U} = {}_1Q_2 - {}_1\bar{W}_2$ (with ${}_1Q_2 \to 0$) (+1) → ${}_1\bar{W}_2 = -\Delta\bar{U} = -M(u_2 - u_1)$
${}_1\bar{W}_2 = -1.41\ \text{kJ}$ (+1)

Process 2-3: $${}_2\bar{W}_3 = \int_{V_2}^{V_3} P\,dV = MP_2(v_3 - v_2) = 224.57\ \text{kJ}$$ (+1) (+1)
$\Delta\bar{U} = {}_2Q_3 - {}_2\bar{W}_3$ → ${}_2Q_3 = \Delta\bar{U} + {}_2\bar{W}_3$ (+1)
$= M(u_3 - u_2) + {}_2\bar{W}_3 = 1966.51\ \text{kJ}$ (+1)

Process 3-4: ${}_3Q_4 = 0$
${}_3\bar{W}_4 = -\Delta\bar{U} = -M(u_4 - u_3)$ → ${}_3\bar{W}_4 = 109.5\ \text{kJ}$ (+1)

Process 4-1: ${}_4\bar{W}_1 = MP_4(v_1 - v_4) = -196.814\ \text{kJ}$ (+1)
${}_4Q_1 = M(u_1 - u_4) + {}_4\bar{W}_1 = -1830.664\ \text{kJ}$ (+1)

$\bar{W}_{net} = {}_1\bar{W}_2 + {}_2\bar{W}_3 + {}_3\bar{W}_4 + {}_4\bar{W}_1 = 135.846\ \text{kJ}$ (+1)

$Q_{net} = {}_1Q_2 + {}_2Q_3 + {}_3Q_4 + {}_4Q_1 = 135.846\ \text{kJ}$ (+1)

$\sum\Delta\bar{U} = Q_{net} - \bar{W}_{net} = 135.846 - 135.846 = 0$ ✓ (+1)
