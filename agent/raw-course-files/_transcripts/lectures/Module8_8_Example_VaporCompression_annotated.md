---
source: me300/lectures/Module8_8_Example_VaporCompression_annotated.pdf
pages: 5
kind: lecture-example
transcribed_by: deepseek-flash (from page images)
---

## Page 1

[figure] Title slide. Left half is a photograph of a person in a dark suit (blurred background); a hand reaches toward the viewer holding a translucent blue-and-green house-shaped icon containing a white thermometer outline with degree tick marks. Right half: ME 300: Engineering Thermodynamics Example: Vapor Compression Cycle.

## Page 2

# Vapor compression

A refrigerator uses refrigerant R-134a as the working fluid and operates on an ideal vapor compression cycle between 0.14 and 0.8 MPa, with State 1 as a saturated vapor and State 3 as a saturated liquid. If the mass flow rate of the refrigerant is 0.05 kg/s, determine:

- The rate of heat removal from the refrigerated space [handwritten] $\longrightarrow +\dot{Q}_1 = \dot{m}(h_1 - h_4)\ \star$
- The power input to the compressor [handwritten] $\longrightarrow,\ \dot{W}_2 = -\dot{m}(h_2 - h_1)$
- The rate of heat rejection to the environment [handwritten] $\longrightarrow {}_2\dot{Q}_3 = \dot{m}(h_2 - h_3)$
- Coefficient of performance [handwritten] $\beta = \dfrac{+\dot{Q}_1}{-\dot{W}_2}$

[handwritten] Given:
[handwritten] $P_1 = 0.14$ MPa $= P_4$
[handwritten] $P_2 = 0.8$ MPa $= P_3$
[handwritten] $x_1 = 1$
[handwritten] $x_3 = 0$
[handwritten] $\dot{m} = 0.05$ kg/s

[handwritten] Assume:
[handwritten] : reversible
[handwritten] : S.C.S.
[handwritten] : steady-flow
[handwritten] : quasi-steady

## Page 3

Vapor compression

Table A.2 Saturation Properties of Refrigerant [handwritten] (circled: R-134a:) Pressure Increments

Grouped column headers (printed): **Specific Volume, m³/kg** (over v_f , v_g) · **Internal Energy, kJ/kg** (over u_f , u_g) · **Enthalpy, kJ/kg** (over h_f , Evap., h_g) · **Entropy, kJ/kg·K** (over s_f , s_g)

| Press., MPa | Temp., T_sat, °C | Sat. Liquid, v_f | Sat. Vapor, v_g | Sat. Liquid, u_f | Sat. Vapor, u_g | Sat. Liquid, h_f | [handwritten] (circled: Evap.,) h_fg | Sat. Vapor, h_g | Sat. Liquid, s_f | Sat. Vapor, s_g |
|---|---|---|---|---|---|---|---|---|---|---|
| 0.06 | −36.935 | 0.00070982 | 0.31123 | 151.96 | 357.27 | 152.00 | 223.94 | 375.94 | 0.81202 | 1.7601 |
| 0.08 | −31.115 | 0.00071854 | 0.23755 | 159.31 | 360.61 | 159.37 | 220.25 | 379.62 | 0.84278 | 1.7528 |
| 0.1 | −26.361 | 0.00072593 | 0.19256 | 165.37 | 363.34 | 165.44 | 217.16 | 382.60 | 0.86756 | 1.7475 |
| 0.12 | −22.310 | 0.00073244 | 0.16214 | 170.56 | 365.67 | 170.65 | 214.47 | 385.12 | 0.88844 | 1.7435 |
| 0.14 | −18.760 | 0.00073830 | 0.14015 | 175.14 | 367.70 | 175.24 | 212.08 | 387.32 | 0.90656 | 1.7402 |
| 0.16 | −15.588 | 0.00074368 | 0.12349 | 179.25 | 369.51 | 179.37 | 209.90 | 389.27 | 0.92262 | 1.7376 |
| 0.18 | −12.712 | 0.00074868 | 0.11042 | 183.00 | 371.15 | 183.13 | 207.89 | 391.02 | 0.93709 | 1.7353 |
| 0.2 | −10.076 | 0.00075337 | 0.099877 | 186.45 | 372.64 | 186.60 | 206.02 | 392.62 | 0.95027 | 1.7334 |
| 0.24 | −5.3653 | 0.00076202 | 0.083906 | 192.65 | 375.30 | 192.83 | 202.61 | 395.44 | 0.97364 | 1.7303 |
| 0.28 | −1.2277 | 0.00076993 | 0.072360 | 198.14 | 377.62 | 198.35 | 199.54 | 397.89 | 0.99399 | 1.7278 |
| 0.32 | 2.4768 | 0.00077727 | 0.063611 | 203.09 | 379.69 | 203.34 | 196.70 | 400.04 | 1.0121 | 1.7257 |
| 0.36 | 5.8412 | 0.00078418 | 0.056744 | 207.61 | 381.54 | 207.90 | 194.07 | 401.97 | 1.0284 | 1.7240 |
| 0.4 | 8.9306 | 0.00079073 | 0.051207 | 211.79 | 383.24 | 212.11 | 191.61 | 403.72 | 1.0433 | 1.7226 |
| 0.5 | 15.735 | 0.00080595 | 0.041123 | 221.10 | 386.91 | 221.50 | 185.97 | 407.47 | 1.0759 | 1.7197 |
| 0.6 | 21.572 | 0.00081998 | 0.034300 | 229.19 | 389.99 | 229.68 | 180.89 | 410.57 | 1.1037 | 1.7175 |
| 0.7 | 26.713 | 0.00083320 | 0.029365 | 236.41 | 392.64 | 236.99 | 176.21 | 413.20 | 1.1280 | 1.7156 |
| 0.8 | 31.327 | 0.00084585 | 0.025625 | 242.97 | 394.96 | 243.65 | 171.81 | 415.46 | 1.1497 | 1.7140 |
| 0.9 | 35.526 | 0.00085811 | 0.022687 | 249.01 | 397.01 | 249.78 | 167.65 | 417.43 | 1.1695 | 1.7126 |
| 1 | 39.388 | 0.00087007 | 0.020316 | 254.63 | 398.85 | 255.50 | 163.66 | 419.16 | 1.1876 | 1.7113 |
| 1.2 | 46.315 | 0.00089351 | 0.016718 | 264.88 | 401.98 | 265.95 | 156.09 | 422.04 | 1.2201 | 1.7087 |
| 1.4 | 52.422 | 0.00091671 | 0.014110 | 274.12 | 404.54 | 275.40 | 148.90 | 424.30 | 1.2489 | 1.7062 |
| 1.6 | 57.906 | 0.00094010 | 0.012126 | 282.61 | 406.64 | 284.11 | 141.93 | 426.04 | 1.2748 | 1.7036 |
| 1.8 | 62.895 | 0.00096400 | 0.010562 | 290.52 | 408.35 | 292.26 | 135.10 | 427.36 | 1.2987 | 1.7007 |
| 2 | 67.481 | 0.00098877 | 0.0092915 | 297.98 | 409.70 | 299.95 | 128.33 | 428.28 | 1.3209 | 1.6976 |
| 2.5 | 77.577 | 0.0010569 | 0.0069403 | 315.20 | 411.65 | 317.84 | 111.17 | 429.01 | 1.3711 | 1.6881 |
| 3 | 86.203 | 0.0011413 | 0.0052813 | 331.28 | 411.49 | 334.70 | 92.640 | 427.34 | 1.4171 | 1.6748 |

[handwritten] Blue pen marks on the table: a vertical bracket line drawn along the left edge of the "Sat. Liquid, h_f" column spanning the rows P = 0.06 to 0.16; a short underline beneath h_g = 387.32 (P = 0.14 MPa); short underlines beneath h_g values in the 415–419 range [?] in the "Sat. Vapor, h_g" column.

## Page 4

States

[handwritten] Underlined **State 1**: $P_1 = 0.14$ MPa
[handwritten] $x_1 = 1$

[handwritten]
$$ \left.\begin{matrix} P_1 = 0.14\ \text{MPa} \\ x_1 = 1 \end{matrix}\right\} A.2 \longrightarrow \begin{matrix} h_1 = h_g = 387.32\ \frac{\text{kJ}}{\text{kg}} \\ s_1 = s_g = 1.7402\ \frac{\text{kJ}}{\text{kg-K}} \end{matrix} $$

[handwritten] Underlined **State 2**: $P_2 = 0.8$ MPa
[handwritten] $s_2 = s_1 = 1.7402\ \frac{\text{kJ}}{\text{kg-K}}$

[handwritten]
$$ \left.\begin{matrix} P_2 = 0.8\ \text{MPa} \\ s_2 = s_1 = 1.7402\ \frac{\text{kJ}}{\text{kg-K}} \end{matrix}\right\} A.2 \longrightarrow \begin{matrix} s_2 > s_g \rightarrow \text{vapor} \\ \rightarrow h_2 = 424.59\ \frac{\text{kJ}}{\text{kg}} \end{matrix} $$

[handwritten] Underlined **State 3**: $P_3 = 0.8$ MPa
[handwritten] $x_3 = 0$

[handwritten]
$$ \left.\begin{matrix} P_3 = 0.8\ \text{MPa} \\ x_3 = 0 \end{matrix}\right\} A.2 \longrightarrow h_3 = h_f = 243.65\ \frac{\text{kJ}}{\text{kg}} $$

[handwritten] Underlined **State 4**: $h_4 = h_3 = 243.65\ \frac{\text{kJ}}{\text{kg}}$
[handwritten] $P_4 = 0.14$ MPa

[transcriber note: values are transcribed as written from the page; the $h$ values listed for 0.14 MPa do not match standard steam-table entries for that pressure.]

## Page 5

Work and heat

$$_1\dot{W}_2 = -\dot{m}(h_2 - h_1) = -0.05(424.59 - 387.32) = -1.86 \text{ kW}$$

$$_2\dot{Q}_3 = \dot{m}(h_3 - h_2) = 0.05(243.65 - 424.59) = -9.047 \text{ kW}$$

[handwritten] (arrow pointing to the $\dot{m}$ in the line above) heat rej. to atm.

$$_4\dot{Q}_1 = \dot{m}(h_1 - h_4) = 0.05(387.32 - 243.65) = 7.1835 \text{ kW}$$

[handwritten] (arrow pointing to the $\dot{m}$ in the line above) heat absorbed from cold space

$$\beta = \frac{_4\dot{Q}_1}{_1\dot{W}_2} = \frac{7.1835}{1.86} \rightarrow \boxed{\beta = 3.86}$$

**ANSWER:** $\beta = 3.86$
