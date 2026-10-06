---
source: me300/assignments/exams/final/OConnor_ME300_FinalExam_Summer2023_Solutions.pdf
pages: 9
kind: exam-solutions
transcribed_by: claude (from page images)
---

## Page 1
**ME 300 Thermodynamics – Summer 2023**
**Final Exam**

[handwritten] SOLUTIONS

(Part I)____________ (40 pts)

(Part II)____________ (60 pts)

TOTAL____________

Directions
1. Open the online answers portion of the exam and download the exam (this document).
2. Make sure to show all your work!
   a. *If you are using a tablet*, solve the problems directly on this document, showing all your work and writing as clearly as possible.
   b. *If you are writing on paper*, solve the problems on a separate piece of paper (you do not have to print the exam), showing all your work and writing as clearly as possible.
3. Questions that require answers to be submitted to the online answers page on Canvas are written in *red italics* below as a way to remind you of what should be entered. All sketches and plots should be clearly drawn on your working paper and submitted with the upload.
4. If you have questions, please use the private chat function in Zoom to send a message directly to Dr. O'Connor so as not to disturb the other students. DO NOT UNMUTE AND ASK YOUR QUESTION ALOUD – this will be distracting to the other students.
5. Once the answers portion of the exam closes, scan or take very nice pictures of your work and upload it to the upload portion of the exam in a PDF document. I trust that you will not change anything on your exam after the answers portion of the exam closes. I can't enforce this – I'm really just relying on you to do the right thing. Please keep to the honor code.
6. The timeline for the exam will be the following (all times in EDT, Friday, August 12):
   a. Exam opens (answers portion and upload portion): 10:00 AM
   b. Answers portion of the exam closes: 11:30 AM
   c. Upload portion of the exam closes: 11:45 AM
7. You can anonymously report any incidents of cheating using the following Google form: https://forms.gle/E4wFjDtvNugjnVkP9

Academic Integrity Pledge
I pledge that I am adhering to Penn State's Code of Conduct when taking this exam.
- I will not communicate with anyone during the exam except Dr. O'Connor.
- I will use only the allowed materials (calculator, notes, tables, and book), I will only access the internet to download the exam, view the e-book and notes on Canvas (no videos), and to submit my answers and upload the exam.
- I will not change any of my written answers after the exam but before I upload my work.
- I will not cheat in any way.

It is important to me to be a person of integrity and that means that all answers on this exam are my individual answers. *In the online answers, please type your full legal name to agree to the academic integrity pledge.*

## Page 2
**Part I: Concept Questions**

1. (6 points) A refrigerator is set to keep a constant temperature in the cold-space. Assuming the refrigeration cycle is reversible, how would the coefficient of performance of that refrigerator change from a cold day to a hot day? Use an equation as part of your explanation. *Type your answer in the box in Canvas.*

[figure] Refrigerator schematic: box $T_H$ at top; arrow $Q_H$ pointing up from a circle labelled "cycle" to $T_H$; arrow $W_{in}$ pointing into the cycle from the right; arrow $Q_L$ pointing up from box $T_L$ (bottom) into the cycle.

[handwritten]
$$COP = COP_{carnot} = \frac{T_L}{T_H - T_L} \quad (+3)$$
(underbrace under $COP_{carnot}$: "due to reversible")

$T_H$ is the temp of the room around the fridg. If $T_H \uparrow$, for a given $T_L$, then $COP \downarrow$. (+3) This is because you need more work to move heat across a larger temperature difference.

2. (6 points) All four-step power cycles have the same basic construction. Match the process to the step: *Answer the matching question in Canvas.*

| Process | Step (printed list order) |
|---|---|
| Process 1-2 | Heat addition |
| Process 2-3 | Compression |
| Process 3-4 | Expansion |
| Process 4-1 | Heat rejection |

[handwritten] Matching lines drawn: Process 1-2 → Compression; Process 2-3 → Heat addition; Process 3-4 → Expansion; Process 4-1 → Heat rejection. (+2)

What is the performance metric used for all power cycles (provide an equation) and how do each of these steps relate to that metric? *Type your answer in the box in Canvas.*

[handwritten]
$$\eta_{th} = \frac{\dot{W}_{net}}{\dot{Q}_{in}} \quad (+1)$$
where $\dot{W}_{net} = \dot{W}_{in} + \dot{W}_{out}$

→ $\dot{W}_{in}$ comes from compression (+1)

$\dot{W}_{out}$ comes from expansion and sometimes the heat addition step (like in Diesel cycle) (+1)

$\dot{Q}_{in}$ is from heat addition step (2-3) (+1)

## Page 3
3. (12 points) An ideal gas in a piston-cylinder device undergoes the following cycle:

Process 1-2: Isothermal compression
Process 2-3: Isochoric cooling
Process 3-1: Isobaric expansion

Determine what type of cycle this is. *Answer the multiple-choice question in Canvas.*

POWER CYCLE — **REFRIGERATION CYCLE** (circled, +4) — INSUFFICIENT INFO

Draw a P-V diagram of the cycle and explain your answer. *Draw your graph below or on a separate page. Type your word answer into the box in Canvas.*

[figure] P-V diagram (P vertical, V horizontal). State 1 at the lower right; state 3 at the lower left at the same pressure as 1; state 2 directly above state 3 (same V) at high pressure. Process 1→2: curved (isothermal) line from 1 up-left to 2, arrow toward 2. Process 2→3: vertical line down from 2 to 3, arrow downward. Process 3→1: horizontal line from 3 to 1, arrow to the right. Dashed guide lines at the pressure of 1/3 and the volume of 2/3. Grading marks "+1" at state labels 1, 2, 3 and at each of the three process paths.

[handwritten] Runs counterclockwise → refrigeration
$$\dot{W}_{net} = \oint_{cycle} P\,d\text{V} < 0 \text{ b/c of counterclockwise} \quad (+1)$$
(script V = total volume)
so net work is into cycle (+1)

[figure] Schematic: box $T_H$ top; $Q_H$ arrow up from "cycle" to $T_H$; $W_{in}$ arrow into cycle; $Q_L$ arrow up from box $T_L$ into cycle.

## Page 4
4. (6 points) Two Brayton cycles have the same inlet conditions (temperature and pressure), compressor pressure ratios, and maximum temperatures. Cycle A is reversible, whereas Cycle B contains a turbine with an isentropic efficiency of 0.85. Which cycle produces more net power? *Answer the multiple-choice question in Canvas.*

**CYCLE A** (circled, +2)
CYCLE B

Explain your answer to the previous question. *Type your answer in the box in Canvas.*

[handwritten]
$\dot{W}_{turb,real} < \dot{W}_{turb,ideal}$ b/c $\eta_{turb} < 1$ (+3)

if $\dot{W}_{net} = \dot{W}_{comp} + \dot{W}_{turb}$, then a lower $\dot{W}_{turb}$ means $\dot{W}_{net} \downarrow$ (+3)

5. (10 points) A working fluid undergoes a vapor compression cycle where the isentropic efficiency of the compressor is 0.8. What is the change in the entropy of the working fluid over this cycle? *Answer the multiple-choice question in Canvas.*

GREATER THAN ZERO
LESS THAN ZERO
**EQUAL TO ZERO** (circled, +2)

What is the change in the entropy of the surroundings over this cycle? *Answer the multiple-choice question in Canvas.*

**GREATER THAN ZERO** (circled, +2)
LESS THAN ZERO
EQUAL TO ZERO

Explain your answer to the previous two questions. *Type your answer in the box in Canvas.*

[handwritten]
$$\sum_{cycle} \Delta S \Big|_{working\ fluid} = 0$$ because of definition of a cycle and entropy is a property (+3)

$\eta_c < 1$ means an irreversible process where $\dot{S}_{gen} > 0$

Since second law says $\Delta \dot{S}_{sys} + \Delta \dot{S}_{surr} \geq 0$, then $\Delta \dot{S}_{surr} > 0$ (+3)

## Page 5
**Part II: Analysis**

**The story:** Many nuclear power plants are located next to rivers or the ocean because they use the cold water from these bodies to cool the working fluid in big heat exchangers in the final step of the Rankine cycle. Scientists have recently suggested that cooling the water used in this final step with river or ocean water is actually bad for the aquatic life because the water gets too warm for them when it's returned to the body of water. To avoid this, we're going to use a vapor compression cycle to cool the water in the final step of the Rankine cycle to save the fish. In this problem, you're going to do the Rankine cycle analysis and then figure out how much refrigerant mass flow is necessary to run the refrigeration cycle necessary to cool down that water in the last step of the Rankine cycle. Identify any tables you use at each step of the problem. If you use a superheated vapor or subcooled liquid table, do not interpolate between values – use the closest value on the table.

**Note:** This question builds on itself – to get numerical answers throughout, you'll need the numbers from the previous questions. *However,* if you get stuck and can't find the answers, write down the method you would use to solve each part of the problem!!! You will get most of the credit for the method.

| Steam Plant Rankine Cycle | |
|---|---|
| Quality of water before pump | 0 |
| Pressure of water before pump [MPa] | 0.7 MPa |
| Pressure of water after pump [MPa] | 10 [handwritten: MPa] |
| Pump isentropic efficiency | 0.85 |
| Heat added in boiler [MW] | 128.753 MW |
| Turbine isentropic efficiency | 1 |
| Water mass flow [kg/s] | 50 kg/s |

| Vapor Compression Cycle (assume ideal compression) | |
|---|---|
| R-134a quality at compressor inlet | 1 |
| R-134a pressure at compressor inlet [MPa] | 0.2 MPa |
| R-134a pressure at compressor outlet [MPa] | 1.4 MPa |
| R-134a quality at condenser outlet | 0 |

a) (~~8~~ [handwritten: 9] points) What assumptions must be made about both the working fluid and the devices in this power plant in order to solve for the state points? Make sure to list all devices! *Enter these in the Canvas quiz – you do not need to also write them on the page.*

b) (8 points) What is the ~~temperature~~ [handwritten: enthalpy?] of the water after the pump in the Rankine cycle in ~~[K]~~ [handwritten: kJ/kg]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

c) (3 points) What is the maximum temperature of the Rankine cycle in [K]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

d) (~~7~~ [handwritten: 9]) points) What is the net power of the Rankine cycle in [MW]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

e) (3 points) What is the thermal efficiency of the Rankine cycle? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

f) (3 points) What is the heat rejected from the Rankine cycle in [MW]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

g) (~~7~~ [handwritten: 9] points) Plot the Rankine cycle on a T-s diagram, indicating the pressures using isobars. *Show your work below or on a separate page, no need to put anything into the Canvas quiz.*

h) (~~7~~ [handwritten: 5] points) What is the temperature of the refrigerant after the compressor in the vapor compression cycle in [K]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

## Page 6
i) (~~7~~ [handwritten: 5] points) What is the mass-specific enthalpy of the refrigerant after it's throttled expansion in [kJ/kg]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

j) (~~10~~ [handwritten: 7; an "8" also written and struck [?]] points) If the heat rejected from the Rankine cycle is equal to the heat absorbed into the vapor compression cycle, what is the mass flow of refrigerant necessary to cool the water in [kg/s]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

[handwritten]
a) Assume:
- S.S. (+1)
- steady-flow (+1)
- quasi-eq (+1)

(the three "+1" marks overwrite struck-out earlier marks [illegible])

- Compressors/pumps/turbines: $\Delta ke = \Delta pe = 0$ (+1/2); $\dot{Q} = 0$ (+1)
- heat exchangers: $\Delta ke = \Delta pe = 0$ (+1/2); $\dot{W} = 0$ (+1)
- throttle: $\Delta ke = \Delta pe = 0$; $\dot{Q} = 0$, $\dot{W} = 0$ (+1) (+1)

b) State 1: $x_1 = 0$, $P_1 = 0.7\text{ MPa}$ → Table D.1: $h_1 = h_f = 697\text{ kJ/kg}$ (+1); $s_1 = s_f = 1.9918\text{ kJ/kg-K}$ (+1); $T_1 = T_{sat} = 438.1\text{ K}$

State 2s: $P_2 = 10\text{ MPa}$
$s_{2,s} = s_1 = 1.9918\text{ kJ/kg-K}$ (+1) → Table D.2: $s_{2,s} < s_f$ → liquid (+1)
→ Table D.4B: $T_{2,s} \approx 440\text{ K}$; $h_{2,s} = 710.55\text{ kJ/kg}$ (+1)

State 2: $P_2 = 10\text{ MPa}$
$$\eta_{pump} = 0.85 = \frac{\dot{W}_{ideal}}{\dot{W}_{real}} = \frac{-\dot{m}(h_{2,s} - h_1)}{-\dot{m}(h_2 - h_1)} \quad (+2)$$
$$h_2 = h_1 + \frac{h_{2,s} - h_1}{\eta_{pump}} = 697 + \frac{710.55 - 697}{0.85}$$
**ANSWER:** $h_2 = 712.29\text{ kJ/kg}$ (+1)

## Page 7
[handwritten]
c) State 3: $P_3 = 10\text{ MPa}$
boiler: $\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}$ (with $\Delta ke$, $\Delta pe$, $\dot{W}$ struck out)
$\dot{Q} = \dot{m}(h_3 - h_2)$ (+1) → $h_3 = h_2 + \frac{\dot{Q}}{\dot{m}}$
$$= 712.94 + \frac{128753}{50}$$
$h_3 = 3288\text{ kJ/kg}$ (+1)

[transcriber note: $h_2$ was boxed as 712.29 kJ/kg on page 6 but 712.94 is substituted here; the page's $h_3 = 3288$ corresponds to 712.94 + 2575.06.]

Table D.2 → $h_3 > h_g$ → vapor
Table D.3P → **ANSWER:** $T_3 = 740\text{ K}$ (+1) → $s_3 = 6.4843\text{ kJ/kg-K}$

d) State 4: $P_4 = 0.7\text{ MPa}$ (+1)
$s_4 = s_3 = 6.4843\text{ kJ/kg-K}$ → Table D.2: $s_f < s_4 < s_g$ → mixture (+1)
$$x_4 = \frac{s_4 - s_f}{s_g - s_f} = \frac{6.4843 - 1.9918}{6.7071 - 1.9918} = 0.9527 \quad (+1)$$
$$h_4 = x_4 h_g + (1 - x_4) h_f = (0.9527)(2762.8) + (1 - 0.9527)(697)$$
$= 2665.1\text{ kJ/kg-K}$ (+1)
[transcriber note: units written as kJ/kg-K; enthalpy units are kJ/kg.]

$${\dot{W}_{net}} = {}_1\dot{W}_2 + {}_3\dot{W}_4 = -\dot{m}(h_2 - h_1) + -\dot{m}(h_4 - h_3) \quad (+2)$$
(pre-subscript notation ${}_1\dot{W}_2$ [?]; a second "+2" under the first term)
$$= 50\left[-(712.29 - 697) - (2665.1 - 3288)\right]$$
**ANSWER:** $\dot{W}_{net} = 30.380\text{ MW}$ (+1)

e)
$$\eta_{th} = \frac{\dot{W}_{net}}{\dot{Q}_{in}} = \frac{30.380}{128.753} \quad (+2)$$
**ANSWER:** $\eta_{th} = 0.236$ (+1)

## Page 8
[handwritten]
f) $\dot{Q}_{out} = \dot{m}(h_1 - h_4) = 50(697 - 2665.1)$ (+2) → **ANSWER:** $\dot{Q}_{out} = -98.405\text{ MW}$ (+1)

g) [figure] T-s diagram (T vertical, s horizontal) with saturation dome. Isobars labelled "10 MPa" and "0.7 MPa" (dashed lines continuing to the upper right). State 1 on the left side of the dome (saturated liquid) at low pressure; vertical dashed line at $s_1$ marked on the s-axis. State 2 slightly above 1 (short line up, compressed liquid, drawn nearly vertical/slightly right). Path 2→3 goes up along the 10 MPa isobar across the dome (horizontal line through the dome) to state 3 at the right, just outside the dome (superheated). Path 3→4 vertical down to state 4 inside the dome on the right. Path 4→1 horizontal leftwards along the 0.7 MPa line back to 1. Arrows on each path. Grading marks: "+1" at many state labels and paths (1, 2, 3, 4, 1→2, 2→3, 3→4, 4→1, dome, isobars), several with overwritten numbers [illegible].

h) State 1: $x_1 = 1$, $P_1 = 0.2\text{ MPa}$ → $h_1 = h_g = 392.62\text{ kJ/kg}$ (+1); $s_1 = s_g = 1.7334\text{ kJ/kg-K}$ (+1)

State 2: $P_2 = 1.4\text{ MPa}$
$s_2 = s_1 = 1.7334\text{ kJ/kg-K}$ (+1) → Table A.2: $s_2 > s_g$ → vapor (+1)
→ Table A.3Q → $h_2 \approx 433.62\text{ kJ/kg}$
**ANSWER:** $T_2 \approx 60\,^\circ\text{C} = 333.15\text{ K}$ (+1)

i) State 3: $P_3 = 1.4\text{ MPa}$, $x_3 = 0$ (+1) → Table A.2 → $h_3 = h_f = 275.4\text{ kJ/kg}$ (+1)

State 4: **ANSWER:** $h_4 = h_3 = 275.4\text{ kJ/kg}$ (+2) (+1) for throttle

j)
$$\dot{Q}_{in,VP} = -\dot{Q}_{out,Rankine} = \dot{m}(h_1 - h_4) \quad (+3)\ (+3)$$
$$\dot{m} = \frac{-\dot{Q}_{out,Rankine}}{h_1 - h_4} = \frac{-(-98405)}{(392.62 - 275.4)}$$
**ANSWER:** $\dot{m} = 839.5\text{ kg/s}$ (+1) (a "+3" struck out next to it)

## Page 9
(blank)
