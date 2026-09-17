# Nomenclature — the authoritative symbol table for ME 300

**Hand-authored. Not generated. Authoritative over anything extracted from a course file.**

Automatic extraction of variable → meaning → units is the single weakest link in this pipeline.
The best published benchmark for that task tops out around **F1 ≈ 0.49** ([SciVar,
arXiv:2411.14569](https://arxiv.org/pdf/2411.14569)) — roughly half of auto-extracted symbol
records would be wrong, and a wrong unit is the kind of error a student will trust and carry
into an exam. So this file is written by hand and the pipeline may only *reference* it:

- An equation card's `symbols:` entries **must** appear in this table. CI rejects any symbol
  that does not, and lists the rejects in the pull-request body.
- If a generated card and this table disagree, **this table wins.** Fix the card.
- To add a symbol, edit this file in GitHub and commit. Nothing else needs to change.

> **What this file is not.** Thermodynamics notation is not standardised across textbooks, and
> we have **not** read Turns & Pauley 2e or any ME 300 lecture notes — the corpus is empty.
> The table below is standard undergraduate engineering-thermodynamics convention, authored by
> this project. It has **not** been checked against ME 300's own notation. Where the course
> uses something different, the course is right and this file must be corrected. The
> `Variants` column lists the alternatives you are most likely to meet, precisely so a
> disagreement gets noticed instead of silently propagating.

---

## State and properties

| Symbol | Meaning | SI units | Variants / notes |
|---|---|---|---|
| $T$ | Temperature | K | Also °C. **Absolute (K) is required** in $Pv=RT$, Carnot efficiency, and every entropy relation. $^\circ$R and $^\circ$F in US customary. |
| $P$ | Pressure | Pa (kPa, MPa, bar) | Lower-case $p$ in some texts. Distinguish absolute from gauge; thermodynamic relations need absolute. |
| $p$ | Pressure (lower-case variant) | Pa (kPa, MPa, bar) | Identical to $P$. Its own row because symbol matching is case-sensitive, and Turns & Pauley and several slide decks use the lower case. Prefer $P$ in your own work; accept $p$ when a course file uses it. |
| $v$ | Specific volume | m³/kg | $= V/m = 1/\rho$. Molar basis $\bar{v}$ in m³/kmol. |
| $V$ | Volume | m³ | **Collides with velocity.** See the collision list below. |
| $\rho$ | Density | kg/m³ | $= 1/v$. |
| $m$ | Mass | kg | |
| $n$ | Number of moles | kmol | **Collides with the polytropic exponent.** |
| $M$ | Molar mass (molecular weight) | kg/kmol | Sometimes $MW$. $R = R_u/M$. |
| $u$ | Specific internal energy | kJ/kg | Molar $\bar{u}$ in kJ/kmol. |
| $U$ | Internal energy | kJ | $= mu$. |
| $h$ | Specific enthalpy | kJ/kg | $h = u + Pv$. **Collides with height and with heat-transfer coefficient.** |
| $H$ | Enthalpy | kJ | $= mh$. |
| $s$ | Specific entropy | kJ/(kg·K) | **Collides with distance and with the "isentropic" subscript.** |
| $S$ | Entropy | kJ/K | $= ms$. |
| $x$ | Quality — vapour mass fraction of a saturated mixture | dimensionless, 0–1 | Defined **only** inside the saturation dome. $y = y_f + x\,y_{fg}$ for $v,u,h,s$. |
| $z$ | Elevation / height | m | Use $z$, never $h$, for height in this course. |
| $c_v$ | Specific heat at constant volume | kJ/(kg·K) | $\bar{c}_v$ molar, kJ/(kmol·K). |
| $c_p$ | Specific heat at constant pressure | kJ/(kg·K) | $\bar{c}_p$ molar. For an ideal gas $c_p - c_v = R$. |
| $c$ | Specific heat of an incompressible substance | kJ/(kg·K) | For a liquid or solid $c_p \approx c_v \equiv c$. |
| $k$ | Specific-heat ratio $c_p/c_v$ | dimensionless | Written $\gamma$ in physics and in some texts. **Collides with thermal conductivity.** |
| $R$ | Specific gas constant | kJ/(kg·K) | $R = R_u/M$. Air: 0.287 kJ/(kg·K). |
| $R_u$ | Universal gas constant | kJ/(kmol·K) | 8.314 kJ/(kmol·K). Also written $\bar{R}$ or $R^*$. |
| $Z$ | Compressibility factor | dimensionless | $Pv = ZRT$. $Z = 1$ is ideal-gas behaviour. |
| $P_R$ | Reduced pressure $P/P_c$ | dimensionless | For the generalized compressibility chart. **Collides with relative pressure $p_r$.** |
| $T_R$ | Reduced temperature $T/T_c$ | dimensionless | For the generalized compressibility chart. |
| $T_c,\ P_c,\ v_c$ | Critical temperature, pressure, specific volume | K, Pa, m³/kg | Substance constants. |
| $a,\ b$ | Van der Waals constants | $a$: kPa·m⁶/kg²; $b$: m³/kg | $b$ is the excluded volume, $a$ the attraction correction. Molar forms differ in units. |
| $p_r$ | Relative pressure (ideal-gas isentropic tables) | dimensionless | A tabulated function of $T$ only. **Not** reduced pressure, **not** a real pressure. |
| $v_r$ | Relative specific volume (ideal-gas isentropic tables) | dimensionless | A tabulated function of $T$ only. |
| $\Delta$ | Change: final minus initial | — | $\Delta u = u_2 - u_1$. Never write $\Delta Q$ or $\Delta W$. |

## Mass and flow

| Symbol | Meaning | SI units | Variants / notes |
|---|---|---|---|
| $\dot{m}$ | Mass flow rate | kg/s | $\dot{m} = \rho A V = AV/v$. |
| $\dot{V}$ | Volumetric flow rate | m³/s | $= \dot{m}v = AV$. Sometimes $Q$ in fluid mechanics — **never $Q$ here**, that is heat. |
| $\mathcal{V}$ | Velocity | m/s | Written $V$, $\mathcal{V}$, $c$ or $\mathbf{v}$ depending on the text. **The worst collision in the subject — check what ME 300 uses.** |
| $A$ | Cross-sectional area | m² | |
| CV | Control volume | — | The region being analysed. |
| CS | Control surface | — | Its boundary. |

## Energy transfer

| Symbol | Meaning | SI units | Variants / notes |
|---|---|---|---|
| $E$ | Total energy of a system | kJ | $E = U + KE + PE$. |
| $e$ | Specific total energy | kJ/kg | $e = u + ke + pe$. |
| $KE$, $ke$ | Kinetic energy, specific kinetic energy | kJ, kJ/kg | $ke = \mathcal{V}^2/2$. Watch the factor of 1000 when mixing J and kJ. |
| $PE$, $pe$ | Potential energy, specific potential energy | kJ, kJ/kg | $pe = gz$. |
| $Q$ | Heat transfer | kJ | A transfer across a boundary, **not** a property. There is no $Q$ "in" a system. |
| $\dot{Q}$ | Rate of heat transfer | kW | |
| $q$ | Heat transfer per unit mass | kJ/kg | $q = Q/m$. |
| $W$ | Work | kJ | A transfer, not a property. Sign convention below. |
| $\dot{W}$ | Power (rate of work) | kW | |
| $w$ | Work per unit mass | kJ/kg | |
| $W_b$ | Moving-boundary work | kJ | $W_b = \int_1^2 P\,dV$ for a quasi-equilibrium process. Closed systems. |
| $W_{flow}$ | Flow work | kJ | $= PV$ per unit of mass crossing a boundary; per unit mass $Pv$. Absorbed into $h$. |
| $\dot{W}_{shaft}$ | Shaft power | kW | The turbine/pump/compressor term in a control-volume balance. |
| $\delta Q,\ \delta W$ | Differential amounts of heat and work | kJ | Inexact differentials — path-dependent. Contrast $du$, $dh$, $ds$, which are exact. |

**Sign convention used in these cards:** heat **into** the system is positive, work **done by**
the system is positive, so the closed-system first law reads $\Delta E = Q - W$. This is the
most common engineering convention but it is not universal — some courses take work in as
positive. **Confirm against the ME 300 lecture notes and state the convention in every
solution.**

## Second law, entropy, and performance

| Symbol | Meaning | SI units | Variants / notes |
|---|---|---|---|
| $S_{gen}$ | Entropy generated by irreversibility | kJ/K | Also written $\sigma$ or $S_{prod}$. $S_{gen} \ge 0$ always; $= 0$ only for a reversible process. **It is never negative.** |
| $\sigma$ | Entropy generated by irreversibility | kJ/K | The same quantity as $S_{gen}$, and the form used on the lecture slides. Its own row because the pipeline matches symbols literally: a row here is what stops $\sigma$ being dropped from an equation card. $\sigma \ge 0$ always. |
| $\dot{S}_{gen}$ | Rate of entropy generation | kW/K | |
| $s_{gen}$ | Entropy generation per unit mass | kJ/(kg·K) | |
| $T_H$ | Temperature of the hot reservoir | K | Absolute. |
| $T_L$ | Temperature of the cold reservoir | K | Absolute. |
| $Q_H$ | Heat transferred from the hot reservoir | kJ | |
| $Q_L$ | Heat rejected to the cold reservoir | kJ | |
| $\eta_{th}$ | Thermal efficiency | dimensionless | $= W_{net}/Q_H$. |
| $\eta_{th,\text{Carnot}}$ | Carnot (maximum) thermal efficiency | dimensionless | $= 1 - T_L/T_H$, **absolute temperatures only**. A ceiling, not a prediction. |
| $\eta_{th,rev}$ | Reversible (maximum) thermal efficiency | dimensionless | The same ceiling as $\eta_{th,\text{Carnot}}$, written the way the slides write it. $= 1 - T_C/T_H$ with $T_C$, $T_H$ the cold and hot reservoir temperatures, **absolute only**. |
| $\eta_s$ | Isentropic efficiency | dimensionless | Turbine: actual/isentropic work. Pump or compressor: isentropic/actual. Subscripted $\eta_T$, $\eta_C$, $\eta_P$ by device. |
| $COP$ | Coefficient of performance | dimensionless | $\beta$ in some texts. Refrigerator $Q_L/W_{net}$; heat pump $Q_H/W_{net}$. Can exceed 1 — it is not an efficiency. |
| $n$ | Polytropic exponent in $Pv^n = \text{const}$ | dimensionless | **Collides with moles.** $n = k$ *and* reversible *and* adiabatic ⇒ isentropic; $n=k$ alone does not. |
| $g$ | Gravitational acceleration | m/s² | 9.81 m/s². **Collides with the saturated-vapour subscript.** |

## Subscripts and modifiers

| Mark | Meaning | Example |
|---|---|---|
| $1,\ 2$ | State 1 (initial), state 2 (final) | $u_2 - u_1$ |
| $i$ | Inlet | $h_i$ |
| $e$ | Exit | $h_e$ — **not** the specific total energy $e$ |
| $in$, $out$ | Into / out of the system | $\dot{m}_{in}$ |
| $f$ | Saturated **liquid** | $v_f$, $h_f$ |
| $g$ | Saturated **vapour** | $v_g$, $h_g$ |
| $fg$ | Vapour minus liquid | $h_{fg} = h_g - h_f$ (latent heat) |
| $sat$ | At saturation | $T_{sat}$, $P_{sat}$ |
| $s$ | The isentropic (ideal) end state | $h_{2s}$ — **not** specific entropy |
| $net$ | Net over a cycle | $W_{net}$ |
| $rev$ | Reversible | $W_{rev}$ |
| $surr$ | Surroundings | $\Delta S_{surr}$ |
| $\dot{\ }$ (overdot) | Per unit time — a rate | $\dot{m}$, $\dot{Q}$, $\dot{W}$ |
| $\bar{\ }$ (overbar) | Per mole — molar basis | $\bar{u}$, $\bar{c}_p$, $R_u$ (often $\bar{R}$) |
| lower case | Per unit mass (specific), when the upper case is the extensive quantity | $u$ vs $U$, $h$ vs $H$, $s$ vs $S$ |

---

## Collisions — the ones that actually cause wrong answers

These are the reason this file exists. An abbreviated version of this table goes into Kelvin's
prompt on every message, so it can disambiguate without a tool call. **Rows are ordered by how
often they change an answer** — the prompt budget is finite and the tail is dropped first, so put
a new collision where it belongs rather than at the end.

| Collision | How to tell them apart |
|---|---|
| $V$ volume vs. $V$/$\mathcal{V}$ velocity vs. $\dot V$ volumetric flow | Units: m³, m/s, m³/s. Squared and halved ⇒ velocity. |
| $v$ specific volume vs. $V$ velocity | Lower case, and kg in the units ⇒ specific volume. |
| $h$ enthalpy vs. $h$ height | This course uses $z$ for height. Inside $gz$ ⇒ height. |
| $s$ entropy vs. subscript $s$ "isentropic" | Standing alone ⇒ entropy. On a state ($h_{2s}$) ⇒ the ideal end state. |
| $n$ moles vs. $n$ polytropic exponent | An exponent on $v$ ⇒ polytropic. Multiplying $R_u T$ ⇒ moles. |
| $R$ specific gas constant vs. $R_u$ universal | $R_u$ = 8.314 per **kmol**, same for everything. $R$ is per **kg**, per substance. |
| $g$ gravity vs. subscript $g$ saturated vapour | Subscript position. Alone ⇒ 9.81 m/s². Also $f$ liquid, $fg$ the difference. |
| $e$ specific energy vs. subscript $e$ exit | Subscript position. $i$ is the inlet. |
| $Q$ heat vs. $Q$ volumetric flow (fluid mechanics) | In ME 300 $Q$ is **always** heat. Volumetric flow is $\dot V$. |
| $P_R$ reduced pressure vs. $p_r$ relative pressure | $P_R$ ⇒ compressibility chart. $p_r$ ⇒ ideal-gas isentropic tables, a function of $T$ only. |
| $k$ specific-heat ratio vs. $k$ thermal conductivity | Conductivity is heat transfer, not ME 300. Here $k = c_p/c_v$. |
| $x$ quality vs. $x$ position | Quality is dimensionless and exists only inside the saturation dome. |
| $W$ work vs. W the watt | Roman W after a number ⇒ the unit. Italic $W$ ⇒ the quantity. |
| $c$ specific heat vs. $c$ velocity (some texts) | Multiplied by $\Delta T$ ⇒ a specific heat. |
| $E$ energy vs. $E$ emissive power | Emissive power is heat transfer, not ME 300. |

---

## Corrections log

When a symbol here turns out to disagree with ME 300's own notation, fix the row and add a line
here so the disagreement is on the record rather than quietly resolved.

| Date | Symbol | Was | Now | Evidence |
|---|---|---|---|---|
| 2026-09-17 | $\sigma$ | only a note on the $S_{gen}$ row | its own row | End-to-end verification run: `scripts/kb/write-cards.mjs` dropped `\sigma` from four generated equation cards because the filter matches rows literally and there was no $\sigma$ row. Reported in the PR body under "Symbols dropped". |
| 2026-09-17 | $\eta_{th,rev}$ | absent | added | Same run; dropped from `eq:carnot-efficiency`. Same quantity as $\eta_{th,\text{Carnot}}$, different spelling. |
| 2026-09-17 | $p$ | a note on the $P$ row | its own row | Same run; `p_1` and `p_2` were dropped from the isentropic ideal-gas relation. Matching is case-sensitive. |
| — | — | — | — | *(no ME 300 lecture notes have been uploaded, so none of these rows has been checked against the course's own notation)* |
