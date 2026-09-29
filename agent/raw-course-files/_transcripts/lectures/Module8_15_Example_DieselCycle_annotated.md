---
source: me300/lectures/Module8_15_Example_DieselCycle_annotated.pdf
pages: 6
kind: lecture-example
transcribed_by: deepseek-flash (from page images)
---

## Page 1

ME 300:
Engineering Thermodynamics

Example:
Diesel
Cycle

[figure] Left half of the slide is a photograph of internal combustion engine valvetrain hardware: multiple rocker arms (gold/bronze colored) mounted on a shaft, coil valve springs, and pushrods/valve stems below; no labels, axes, or numerical values.

## Page 2

# Examples

An engine runs an air-standard diesel cycle with a compression ratio of 18, a cut-off ratio of 2.37 using an ideal cycle. The displacement of the engine is 0.002 m$^3$ (2 L). If the intake air is T=300 K and P1=0.1 MPa, calculate the following (R=287 J/kg-K, cv=714 J/kg-K):

- Work done by the cycle
- Heat added during combustion
- Efficiency of the cycle

*(The handwritten notes below appear in three side-by-side columns.)*

**[handwritten] Given:**
- [handwritten] $\mathcal{V}_1/\mathcal{V}_2 = 18$
- [handwritten] $\mathcal{V}_3/\mathcal{V}_2 = 2.37$
- [handwritten] $\mathcal{V}_1 - \mathcal{V}_2 = 0.002\ \text{m}^3$
- [handwritten] $T_1 = 300\ \text{K}$
- [handwritten] $P_1 = 0.1\ \text{MPa}$

[handwritten] **Find:** $\dot{W}_{net}$, $Q_{in}$, $\eta$  (grouped with a brace in the margin)

**[handwritten] Assume:**
- [handwritten] air = ideal gas
- [handwritten] $c_v = \text{const.}$
- [handwritten] quasi-steady
- [handwritten] reversible
- [handwritten] $\Delta KE = \Delta PE = 0$

**[handwritten] Strategy:**
$$ \dot{W}_{net} = {}_1\dot{W}_2 + {}_2\dot{W}_3 + {}_3\dot{W}_4 + {}_4\dot{W}_1 $$
$$ \Rightarrow \dot{W} = \int P\, d\mathcal{V} $$
$$ \Delta U = \dot{Q} - \dot{W} = m c_v \Delta T $$
$$ Q_{in} = {}_2Q_3 $$
$$ \eta = \frac{\dot{W}_{net}}{Q_{in}} $$

[transcriber note: small stroked marks appear above the W and Q symbols in the handwritten notes; these are transcribed as dots.]

## Page 3

State 1 and 2

[handwritten] $\underline{State\ 1}$ : $T_1 = 300\ \mathrm{K}$
[handwritten] $P_1 = 0.1\ \mathrm{MPa}$
[handwritten] $\mathcal{V}_1 = ?$

[handwritten] $P_1 \mathcal{V}_1 = MRT_1$

[handwritten] $M = \dfrac{P_1 \mathcal{V}_1}{K T_1}$

[handwritten] $= \dfrac{(100000)(0.00212)}{(287)(300)}$

[handwritten] $$\boxed{M = 0.00246\ \mathrm{kg}}$$

[handwritten] $\dfrac{\mathcal{V}_1}{\mathcal{V}_2} = 18 \rightarrow \mathcal{V}_1 = 18\mathcal{V}_2$

[handwritten] $\mathcal{V}_1 - \mathcal{V}_2 = 0.002 \Rightarrow 18\mathcal{V}_2 - \mathcal{V}_2 = 0.002$

[handwritten] $\rightarrow \mathcal{V}_2 = 0.00012\ \mathrm{m^3}$

[handwritten] $\mathcal{V}_1 = 0.00212\ \mathrm{m^3}$

[handwritten] $\underline{State\ 2}$ : $\mathcal{V}_2 = 0.00012\ \mathrm{m^3}$

[handwritten] $P_2 = P_1\left(\dfrac{\mathcal{V}_1}{\mathcal{V}_2}\right)^k = 100000\ (18)^{1.4} \rightarrow P_2 = 5719808\ \mathrm{Pa}$

[handwritten] $T_2 = \dfrac{P_2 \mathcal{V}_2}{M R} = \dfrac{(5719808)(0.00012)}{(0.00246)(287)} \rightarrow T_2 = 972.2\ \mathrm{K}$

[transcriber note: in the mass equation the gas constant is written as "K T₁" in the denominator, though the numeric value 287 is used.]

## Page 4

State 3 and 4

[handwritten] $P_3 = P_2 = 5719808\ \mathrm{Pa}$

[handwritten] $\mathcal{V}_3 = \alpha\,\mathcal{V}_2 = (2.37)(0.00012) = 0.00028\ \mathrm{m^3}$

[handwritten] $T_3 = \dfrac{P_3 \mathcal{V}_3}{mR\,[?]} = \dfrac{(5719808)(0.00028)}{(0.00246)(287)} = 2268.4\ \mathrm{K}$

[handwritten] $\underline{\text{State 4}}: \quad P_4 = P_3\left(\dfrac{\mathcal{V}_3}{\mathcal{V}_4}\right)^{1.4} = 5719808\left(\dfrac{0.00028}{0.00212}\right)^{1.4} = 336149.5\ \mathrm{Pa}$

[handwritten] (small "4" written below with an arrow pointing up to the subscript 4 of $\mathcal{V}_4$)

[handwritten] $T_4 = \dfrac{P_4 \mathcal{V}_4}{mR\,[?]} = \dfrac{(336149.5)(0.00212)}{(0.00246)(287)} = 1009.4\ \mathrm{K}$

## Page 5

Work

[handwritten] 1-2: $\Delta\bar{U} = \cancel{Q}_2 - {}_1\bar{W}_2$ , ${}_1\bar{W}_2 = -\Delta\bar{U} = -MC_v(T_2-T_1) = -(0.00246)(714)(972.2-300)$

$$= -1180.7\ \text{J}$$

[handwritten] 2-3: ${}_2\bar{W}_3 = \int_{V_2}^{V_3} P\,dV = P_2(V_3-V_2) = 5719808(0.00028-0.00012)$

$$= 915.17\ \text{J}$$

[handwritten] 3-4: ${}_3\bar{W}_4 = -\Delta\bar{U} = -MC_v(T_4-T_3) = -(0.00246)(714)(2208.4-1009.4)$

$$= 2211.4\ \text{J}$$

[handwritten] **ANSWER:** $\boxed{\bar{W}_{net} = 1946.4\ \text{J}}$

## Page 6

Heat and efficiency

[handwritten] $${}_2Q_3 \rightarrow \Delta \overline{U} = {}_2Q_3 - {}_2\overline{W}_3$$
[handwritten] $${}_2Q_3 = \Delta \overline{U} + {}_2\overline{W}_3$$
[handwritten] $$= M c_v (T_3 - T_2) + {}_2\overline{W}_3$$
[handwritten] $$= (0.00246)(714)(2268.4 - 972.2) + 915.17$$

[handwritten] **ANSWER:** $${}_2Q_3 = 3191.9 \text{ J}$$

[handwritten] $$\eta_{th} = \frac{\overline{W}_{net}}{\overline{Q}_{in}} \rightarrow$$

[handwritten] **ANSWER:** $$\eta_{th} = 0.61$$
