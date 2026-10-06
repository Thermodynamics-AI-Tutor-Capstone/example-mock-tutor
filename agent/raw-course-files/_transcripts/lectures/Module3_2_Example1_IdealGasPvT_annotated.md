---
source: me300/lectures/Module3_2_Example1_IdealGasPvT_annotated.pdf
pages: 8
kind: lecture-example
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Example 1: Ideal Gas Equation of State: P-v-T

[figure] Title slide; left half is a photo of colored balloons against the sky.

## Page 2
Diesel fuel injection

[figure] Photo of a cut-away diesel engine block showing three cylinders, pistons, valves and a central fuel injector. Hand-drawn yellow annotations: arrows down through the intake valves and fuel injector into the center cylinder, a curved arrow out through the exhaust port, a circled region at the top of the center piston (the combustion chamber), a double-headed vertical arrow on the center piston's connecting rod (piston motion up/down), and downward arrows on the two outer pistons.

## Page 3
Diesel fuel injection

Condition 1 [handwritten: "air"]
- T = 900 K
- P = 5.92 Mpa [handwritten: "~60 atm"]
- ρ = 22.8 kg/m$^3$ (underlined by hand)

Condition 2
- T = 900 K (underlined by hand)
- P = 4.03 Mpa
- ρ = 15.2 kg/m$^3$ (underlined by hand)

[figure] Two schlieren-type images of a fuel spray chamber, each with a 10 mm scale bar, labelled "-40 μs ASOI" (condition 1) and "-50 μs ASOI" (condition 2). Hand-drawn: an arrow at the left edge pointing into the image (injection direction) and an arrow below pointing right; blue lines trace the boundaries of visible density-gradient structures (more structure visible in condition 1 than condition 2).

## Page 4
How would we design a compression from T1=289 K to achieve these conditions?

[handwritten] "T1=289 K" underlined.

[figure] Same cut-away diesel engine photo as page 2, unannotated.

## Page 5
What control volume should we use?

[figure] Cut-away engine photo with a yellow dashed box drawn around the gas space above the center piston (the combustion chamber / cylinder gas).

[handwritten] ⇒ only include the stuff you care about → solve for

## Page 6
Which of the following assumptions should we make?

a) Pure substance
b) Simple compressible substance
c) Continuum
d) Ideal gas
e) All of the above

[handwritten] "air" written above a); check marks next to a), b), c), d); e) "All of the above" circled.

**ANSWER:** e) All of the above

[figure] Speech-bubble with question mark on yellow background.

## Page 7
Compression ratio

[handwritten] Displacement volume: $V_1 - V_2$ (script V = total volume)

[handwritten] Compression ratio: $$\frac{V_1}{V_2} = 11.2$$

[figure] Two piston-cylinder sketches: left labelled "BDC" with piston at the bottom and volume $V_1$ above it; right labelled "TDC" with piston near the top leaving a small volume $V_2$.

## Page 8
Inlet pressure

[handwritten] Given (left column):
- $\frac{V_1}{V_2} = 11.2$ ✓
- $T_1 = 289$ K ✓
- $T_2 = 900$ K
- $P_2 = 5.92$ MPa
(bracket around $T_2$, $P_2$)
- $P_1 = ?$

⇒ $M$ = const., $R$ = const.

[handwritten] Solution:
$$PV = MRT$$ with a bracket over $MR$ labelled "const 1,2"
$$M_1 R = M_2 R \longrightarrow \frac{P_1 V_1}{T_1} = \frac{P_2 V_2}{T_2}$$
$$\frac{V_1}{V_2} = \frac{P_2 T_1}{P_1 T_2}$$ (check marks on $V_1/V_2$, $P_2$, $T_1$, $T_2$ as knowns)
$$P_1 = \frac{P_2 T_1}{T_2} \Big/ \frac{V_1}{V_2}$$
$$= \frac{(5.92 \times 10^6)(289)}{(900)} \cdot \frac{1}{11.2}$$

**ANSWER:** (boxed) $P_1 = 169700$ Pa
