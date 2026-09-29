---
source: me300/lectures/Module8_5_RankineCycle_annotated.pdf
pages: 7
kind: lecture-slides
transcribed_by: deepseek-flash (from page images)
---

## Page 1

[figure] Photograph of a nuclear power plant at sunset: two large hyperbolic cooling towers silhouetted against an orange and purple sky, with a large white plume of water vapor rising from the taller front tower and a smaller plume from the tower behind it. Dark tree line along the bottom, water in the foreground reflecting the sunset, sun low on the horizon at the left.

ME 300:
Engineering Thermodynamics

Rankine
Cycle

## Page 2

Steam power

[figure] Aerial photograph of a large coal-fired steam power plant complex situated on the bank of a wide river. Visible features, left to right: a long navigable river with several moored barge fleets (coal barges) along the near shore; a tall thin stack at upper left emitting a white steam plume (a vertical blue line is drawn over this plume); a second tall stack/plume at upper right; two large hyperbolic natural-draft cooling towers near the plant buildings, the rightmost one emitting a massive white water-vapor plume; the main boiler/turbine building block between the stacks and towers; a long inclined conveyor/pipe run descending to the left toward the barge unloading area; several white cylindrical storage tanks and a cluster of green circular tanks (settling/clarification basins) in the plant yard; rail lines, access roads, parking lots, and a residential neighborhood at the bottom of the frame. A blue oval has been drawn around the base of the right-hand cooling tower (annotation). A camera timestamp in the lower-right corner reads: 2 11:24 AM (red print).

## Page 3

Steam power

[figure] Schematic cross-section of a coal-fired steam power plant with numbered components (1–27) marked by blue circular labels, plus handwritten blue ellipse/circle annotations. Left side: a large hyperbolic cooling tower (1) emitting a water-vapour plume, with a cooling water pump (2) at its base, connected by piping to a condenser (8) in the foreground. Bottom-left: a transmission pylon (3) and a unit transformer (4) fed by a generator (5). Centre-bottom: low pressure turbine (6) and boiler feed pump (7), with intermediate pressure turbine (9), steam governor (10), and high pressure turbine (11) in line along the steam shaft; deaerator (12) and feed heater (13) below. Centre: coal conveyor (14) leading to coal hopper (15) and pulverised fuel mill (16); boiler drum (17) and ash hopper (18) above the furnace, with superheater (19) and reheater (21) tube banks in the flue gas path, forced draught fan (20) supplying combustion air. Right side: flue gas passes through air intake (22), economiser (23), air preheater (24), precipitator (25), induced draught fan (26) and out the chimney stack (27) emitting a plume. Handwritten blue marking: an ellipse encircles the cooling tower area around label 1; a circle encircles label 3 at the pylon; a large ellipse encircles the turbine/condenser region around labels 6, 7 and 8; a small handwritten arc/mark near label 2 and label 7 piping.

KEY
1. Cooling tower
2. Cooling water pump
3. Pylon (termination tower)
4. Unit transformer
5. Generator
6. Low pressure turbine
7. Boiler feed pump
8. Condenser
9. Intermediate pressure turbine
10. Steam governor
11. High pressure turbine
12. Deaerator
13. Feed heater
14. Coal conveyor
15. Coal hopper
16. Pulverised fuel mill
17. Boiler drum
18. Ash hopper
19. Superheater
20. Forced draught fan
21. Reheater
22. Air intake
23. Economiser
24. Air preheater
25. Precipitator
26. Induced draught fan
27. Chimney stack

## Page 4

Rankine Cycle – [handwritten] ideal (reversible)

[figure] Schematic of a Rankine cycle drawn as a loop of piping. Left side: a vertical boiler vessel (gray) with a red/violet serpentine tube and a flame at the bottom left; heat input arrow pointing left into the boiler labelled $\dot{Q}_{\text{in}}$. Top: state 3 at the boiler outlet (red), piping runs right into a turbine (purple, with expanding nozzle shape) whose shaft exits right with an arrow labelled $\dot{W}_{\text{turbine}}$. Turbine outlet piping drops down to state 4 and enters the top of a condenser box (purple/blue) containing horizontal tube bundles; an arrow exits right labelled $\dot{Q}_{\text{out}}$. Condenser outlet is state 1 at the bottom right (blue), piping runs left into a pump symbol (circle with impeller) labelled $\dot{W}_{\text{pump}}$ (arrow pointing down into the pump). Pump outlet is state 2 (blue), piping runs left back into the boiler.

[handwritten] 1–2 : isentropic compression
[handwritten] adiabatic, reversible
[handwritten] => pump, liquid

[handwritten] 2–3 : Isobaric heating
[handwritten] => boiler, liq → vap

[handwritten] 3–4 : isentropic expansion
[handwritten] => turbine, vap → —

[handwritten] 4–1 : isobaric heat rejection
[handwritten] => condenser, — → liq.

## Page 5

Rankine Cycle  $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ steady flow

1–2 : Pump $\Rightarrow$ $\dot{m}\Delta h = -\dot{W}_{1\text{-}2}$

2–3 : boiler $\Rightarrow$ $\dot{m}\Delta h = \dot{Q}_{2\text{-}3}$

3–4 : turbine $\Rightarrow$ $\dot{m}\Delta h = -\dot{W}_{3\text{-}4}$

4–1 : condenser $\Rightarrow$ $\dot{m}\Delta h = -\dot{Q}_{4\text{-}1}$

[transcriber note: the subscripts on the energy terms are handwritten stacked vertically (e.g. "1" over "2") and are read here as the state pair, e.g. $\dot{W}_{1\text{-}2}$; the sign on the condenser term is written as a minus, which appears inconsistent with the usual convention for heat addition in the boiler.]

## Page 6

[figure] A thought-bubble graphic containing a large question mark, placed on a yellow background panel occupying the left half of the image.

What is the proper expression for the cycle efficiency?

A. $\dfrac{_{3}W_{4}}{_{2}Q_{3}}$

B. $\dfrac{_{1}W_{2} + {}_{3}W_{4}}{_{2}Q_{3}}$

C. $\dfrac{_{1}W_{2} + {}_{3}W_{4}}{_{2}Q_{3} + {}_{3}Q_{4}}$

[handwritten] A hand-drawn circle/oval around the letter "B."

[handwritten] $\eta_{th} = \dfrac{\dot{W}_{net}}{\dot{Q}_{in}}$

## Page 7

# Rankine Cycle

[handwritten] Normal - ideal

[figure] Temperature–entropy ($T$–$s$) diagram. Vertical axis labelled $T$ (arrow upward), horizontal axis labelled $s$ (arrow rightward). A saturation dome (bell curve) is drawn. Two vertical dashed lines are drawn inside the dome: the left one labelled underneath [handwritten] $s = s_2$, the right one labelled underneath [handwritten] $s_3 = s_4$.

Cycle (clockwise):
- State ① at the intersection of the left dashed line ($s = s_2$) with the lower horizontal line.
- Vertical line with arrow upward from ① to ②, both on the left dashed line $s = s_2$.
- Horizontal line with arrow rightward from ② to ③ on the right dashed line $s_3 = s_4$ (③ lies on the upper part of the dome).
- Vertical line with arrow downward from ③ to ④ on the right dashed line $s_3 = s_4$.
- Horizontal line with arrow leftward from ④ back to ①.

# [handwritten] Superheated - ideal

[figure] Temperature–entropy ($T$–$s$) diagram. Vertical axis labelled $T$ (arrow upward), horizontal axis labelled $s$ (arrow rightward). A saturation dome (bell curve) is drawn.

Cycle (clockwise):
- State ① at lower left, inside the dome near the left boundary.
- Vertical line with arrow upward from ① to ② (nearly vertical, leaning slightly right).
- Line with arrow rightward/upward from ② to ③; ③ is a solid dot outside the dome to the upper right (superheated region).
- Vertical line with arrow downward from ③ to ④; ④ is a solid dot inside the dome at the lower right.
- Horizontal line with arrow leftward from ④ back to ①.

A [handwritten] 7 is written on a horizontal line inside the dome between the left boundary and the path to ③.
