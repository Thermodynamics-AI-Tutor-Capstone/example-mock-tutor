---
source: me300/assignments/homework/ME300_Su23_Homework7_Solutions.pdf
pages: 3
kind: homework-solutions
transcribed_by: deepseek-flash (from page images)
---

## Page 1

ME300 Homework 7 | SOLUTIONS

| Device | Purpose | Assume | SSEE |
|---|---|---|---|
| Nozzle | speed up flow (+1) | $\dot{W}=\dot{Q}=\Delta pe=0$ (+1) | $\Delta h + \Delta ke = 0$ (+1) |
| Diffuser | slow down flow (+1) | $\dot{W}=\dot{Q}=\Delta pe=0$ (+1) | $\Delta h + \Delta ke = 0$ (+1) |
| Throttle | control flow by dropping pressure (+1) | $\dot{W}=\dot{Q}=\Delta ke=\Delta pe=0$ (+1) | $\Delta h=0$ (+1) |
| Heat Exchanger | Exchange heat, sometimes from one fluid to another (+1) | $\dot{W}=\Delta ke=\Delta pe=0$ (+1) | $\dot{m}\,\Delta h=\dot{Q}$ (+1) [+1 for sign] |
| Compressor | Increase enthalpy of fluid by increasing pressure, work in relative (+1) | $\dot{Q}=\Delta ke=\Delta pe=0$ (+1) | $\dot{m}\,\Delta h=-\dot{W}$ (+1) [+1 for sign] |
| Turbine | Extract work by expanding fluid as pressure drops (+1) | $\dot{Q}=\Delta ke=\Delta pe=0$ (+1) | $\dot{m}\,\Delta h=\dot{W}$ (+1) [+1 for sign] |

**[2]** Given: $\dot{m}=50\ \text{kg/s}$  $\dot{W}=-2.7457\ \text{MW}$
$T_1=300\ \text{K}$  $\rho_2=1.7474\ \text{kg/m}^3$
$V_1=170\ \text{m/s}$  $A_3/A_2=3$  $V_3=300\ \text{m/s}$

Assme: air = ideal gas (+½)  steady flow (+½)
$c_p = \text{const}$ (+½)  fan $\rightarrow$ $\dot{Q}=\Delta ke=\Delta pe=0$ (+½)
qrav. = q. (+½)  nozzle $\rightarrow$ $\dot{W}=\dot{Q}=\Delta pe=0$ (+½)

a) $\dot{m}(\Delta h + \Delta ke + \Delta pe)=\dot{Q}-\dot{W}$ +2

fan $\rightarrow$ $\dot{m}\,\Delta h=-\dot{W}$ +2

ideal gas, $c_p = \text{const}$ $\rightarrow$ $\dot{m}c_p(T_2-T_1)=-\dot{W}$ +2

$$T_2 = T_1 - \frac{\dot{W}}{\dot{m}c_p} = 300 - \frac{(-2.7457\times 10^6)}{(50)(1001)}$$

**ANSWER:** $T_2 = 354.86\ \text{K}$ (+1)

b) steady flow: $\dot{m}_2=\dot{m}_3$ $\Rightarrow$ $\rho_2 V_2 A_2 = \rho_3 V_3 A_3$ $\rightarrow$ $\rho_3 = \rho_2 \dfrac{V_2 A_2}{V_3 A_3}$ +2

$\Delta ke = 0$ for fan $\rightarrow$ $V_2=V_1=170\ \text{m/s}$ +2 $\rightarrow$ $\rho_3 = \dfrac{(1.7474)(170)}{(300)(3)}$

**ANSWER:** $\rho_3 = 0.334\ \text{kg/m}^3$ (+1)

## Page 2

ME300 | Homework 7 | SOLUTIONS

→ nozzle: $\Delta h + \Delta ke = 0$ (+2)

→ ideal gas, $q = 0$: $c_p(T_3 - T_2) + \frac{1}{2}(V_3^2 - V_2^2) = 0$ (+2)

$$T_3 = T_2 - \frac{1}{2c_p}(V_3^2 - V_2^2)$$
$$= 354.86 - \frac{1}{2002}(300^2 - 170^2)$$

**ANSWER:** $\boxed{T_3 = 324.3\ \text{K}}$ (+1)

---

[3] Given: $\dot{m} = 10\ \text{kg/s}$  Find: $\dot{W} = ?$  Assume: S.C.S. [+2?] (+1)

(+2) $P_1 = 10\ \text{MPa}$
$T_1 = 900\ \text{K}$
$x_2 = 1$
$P_2 = 0.1\ \text{MPa}$

[handwritten] quasi-equilibrium (+1)
[handwritten] steady-flow (+1)
[handwritten] $\dot{Q} = 0 \ \& \ KE = 0 \ \& \ PE = 0$ for turbine (+1)

→ Steady flow: $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ (+2)

→ turbine: $\dot{m}\,\Delta h = -\dot{W}$ (+2)

$$\dot{W} = -\dot{m}(h_2 - h_1) \rightarrow \text{State 1: } P_1 = 10\ \text{MPa} \quad (\text{Table [illegible]})$$
$$= -10(2674.9 - 3691.6)$$
$T_1 = 900\ \text{K}$, $T_1 > T_{sat}$ (+1)
$\Rightarrow$ vapor (Table [illegible])
$h_1 = 3691.6\ \text{kJ/kg}$ (+2)

**ANSWER:** $\boxed{\dot{W} = 10.167\ \text{MW}}$ (+2)

[handwritten] (+1 for correct units)

→ State 2: $P_2 = 0.1\ \text{MPa}$
$x_2 = 1$ (Table D.2) (+1)
$h_2 = h_g = 2674.9\ \text{kJ/kg}$ (+2)

---

[4] Statement 1: you can't devise a power cycle where heat is completely converted to work (+2) → some heat has to be rejected (+1)

$\Rightarrow$ Implication: $\eta_{th} < 1$ (+1) always some energy loss in conversion of heat to work, even in a frictionless world. Will never use all the energy in the fuel. (+1)

## Page 3

ME 300 | Homework 4 | Solutions

Statement 2: processes have a natural directionality, and if you want to
move a system in the opposite direction of its spontaneous
direction, it requires work input. (+2)
→ Implication: a cycle will always include some non-spontaneous
processes so you'll always have to do work (+1)

Statement 3: If any losses/irreversibilities are present, entropy will be generated (+2)
→ In a cycle, this increases the entropy of the surroundings (+1)

Statement 4: spontaneous processes move systems towards equilibrium
where entropy is maximized. (+2)
→ Implication: losses and irreversibilities are inescapable. (+1)

[5] $\eta_{th} = \text{what you get out} / \text{heat you put in}$ (+5)
$\Rightarrow \dot{W} = \eta_{th}\,\dot{Q}_{in}$, where $\dot{Q}_{in}$ comes from exothermic combustion
reactions in the engine, where fuel + air → CO₂ + H₂O + heat. (+2)
For a given $\dot{W}$, if $\eta_{th} \uparrow$, then $\dot{Q}_{in} \downarrow$, so less fuel is needed and CO₂↓ (+3)

[6] $T_H = 24°C = 297.15\ \text{K}$ (+1)  Assume: quasistatic, steady state
$T_L = 3°C = 276.15\ \text{K}$ (+1)  : max $\eta_{th}$ means no losses

a) $\eta_{th,max} = 1 - \frac{T_L}{T_H} = 1 - \frac{276.15}{297.15} \rightarrow \boxed{\eta_{th,max} = 7.07\%}$ "not great.." (+1)

b) 
[figure] A heat engine diagram: top box labelled $T_H$ with "high-T reservoir" (+1); arrow $\dot{Q}_H$ (+1) pointing down into a circle labelled "eng." (+1); arrow $\dot{W}_{net}$ (+1) pointing right from the engine; arrow $\dot{Q}_L$ (+1) pointing down from engine to bottom box labelled $T_L$ with "low-T reservoir" (+1); wavy lines above the high-T reservoir and at the $\dot{Q}_L$ arrow (thermal reservoir symbols) labelled "thermal" (+1).
* a lake is a reservoir because the engine operation won't change the entire temp. of one of the Great Lakes (+2)

d) Irreversibilities → Friction (+2 for any)
→ heat exchange b/w finite $\Delta T$
→ turbulent mixing
