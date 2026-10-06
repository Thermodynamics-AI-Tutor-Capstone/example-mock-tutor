---
source: me300/assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2021_Solutions.pdf
pages: 10
kind: exam-solutions
transcribed_by: deepseek-flash (from page images)
---

## Page 1

**ME 300 Thermodynamics – Summer 2021**
**Final Exam**

[handwritten] [student]
*(signature in blue ink)*

(Part I)__________________ (40 pts)

(Part II)__________________ (60 pts)

TOTAL__________________

**Directions**

1. Open the online answers portion of the exam and download the exam (this document).
2. Make sure to show all your work!
   a. *If you are using a tablet*, solve the problems directly on this document, showing all your work and writing as clearly as possible.
   b. *If you are writing on paper*, solve the problems on a separate piece of paper (you do not have to print the exam), showing all your work and writing as clearly as possible.
3. Questions that require answers to be submitted to the online answers page on Canvas are written in *red italics* below as a way to remind you of what should be entered. All sketches and plots should be clearly drawn on your working paper and submitted with the upload.
4. If you have questions, please use the private chat function in Zoom to send a message directly to Dr. O'Connor so as not to disturb the other students. DO NOT UNMUTE AND ASK YOUR QUESTION ALOUD – this will be distracting to the other students.
5. Once the answers portion of the exam closes, scan or take very nice pictures of your work and upload it to the upload portion of the exam in a PDF document. I trust that you will not change anything on your exam after the answers portion of the exam closes. I can't enforce this – I'm really just relying on you to do the right thing. Please keep to the honor code.
6. The timeline for the exam will be the following (all times in EDT, Friday, July 23):
   a. Exam opens (answers portion and upload portion): 11:00 AM
   b. Answers portion of the exam closes: 12:30 PM
   c. Upload portion of the exam closes: 12:45 PM
7. You can anonymously report any incidents of cheating using the following Google form:
   https://forms.gle/E4wFjDtvNugjnVkP9

**Academic Integrity Pledge**

I pledge that I am adhering to Penn State's Code of Conduct when taking this exam.

- I will not communicate with anyone during the exam except Dr. O'Connor.
- I will use only the allowed materials (calculator, notes, tables, and book), I will only access the internet to download the exam, view the e-book and notes on Canvas (no videos), and to submit my answers and upload the exam.
- I will not change any of my written answers after the exam but before I upload my work.
- I will not cheat in any way.

It is important to me to be a person of integrity and that means that all answers on this exam are my individual answers.

*In the online answers, please type your full legal name to agree to the academic integrity pledge.*

1

## Page 2

**Part I: Concept Questions**

1. (4 points) Can the coefficient of performance of a heat pump ever be greater than one? *Answer the multiple-choice question in Canvas.*

YES (+2)
NO

Explain your response to this question. *Type your answer in the box in Canvas.*

[handwritten] It always should be, The $\beta = \dfrac{Q_H}{W_{in}}$, where $Q_H = W_{in} + Q_L$, by 1st law, and $Q_L \neq 0$, so $\beta > 1$. ([+2] above $Q_H$)

2. (6 points) For a given compression ratio and initial pressure and temperature, which cycle has a higher thermal efficiency? *Answer the multiple-choice question in Canvas.*

OTTO CYCLE (+2)
DIESEL CYCLE

Explain your response to this question. *Type your answer in the box in Canvas.*

[handwritten] The otto cycle adds heat isochorically, rather than isobarically, so the piston expands from a higher pressure after heat addition, doing more work for a given $Q_{in}$, and $\eta = \dfrac{W_{net}}{Q_{in}}$. ([+2] above "isochorically", [+2] at end)

2

## Page 3

3. (30 points) Two quasi-equilibrium processes, A and B, occur between the same end states inside a closed piston-cylinder device with constant mass, as shown below.

[figure] P–V diagram. Vertical axis labelled $P$ (upward arrow), horizontal axis labelled $V$ (rightward arrow), origin at lower left. A single closed loop curve connects state 1 (dot, left side, mid-height) and state 2 (dot, right side, mid-height). The upper arc of the loop is labelled "Path B" and carries an arrowhead on the right side pointing rightward/toward 2; the lower arc is labelled "Path A" and carries an arrowhead on the left side pointing leftward/toward 1.

In both processes, is work being done on the fluid or by the fluid? *Answer the multiple-choice question in Canvas.*

a) On the fluid

b) By the fluid [handwritten] (circled) (+2)

Explain your response to this question. *Type your answer in the box in Canvas.*

[handwritten] $\mathcal{V}_2 > \mathcal{V}_1$, and so fluid is expanding, doing work on the surroundings (+2)

[handwritten] (+2)

Which of the following is true about the work for each process?? *Answer the multiple-choice question in Canvas.*

a) $W_A > W_B$

b) $W_A = W_B$

c) $W_A < W_B$ [handwritten] (circled) (+2)

Explain your response to this question. *Type your answer in the box in Canvas.*

[handwritten] $W = \int P\,dV$ and the area under B > area under A

[handwritten] (+2)                                                                                          [handwritten] (+2)

3

## Page 4

Which of the following are true about the heat transfer of the two processes? *Answer the multiple-choice question in Canvas.*

a) $Q_A > Q_B$

b) $Q_A = Q_B$

c) $Q_A < Q_B$ [handwritten] +2  (circled)

d) Insufficient information

Explain your response to this question. *Type your answer in the box in Canvas.*

[handwritten] $\Delta U = Q - W$ for both, and $\Delta U$ is the same for both because it is a property. So if $W_B > W_A$, then $Q_B > Q_A$ (+2)

Which of the following is true about the entropy change of the system over the two processes? *Answer the multiple-choice question in Canvas*

a) $\Delta S_A > \Delta S_B$

b) $\Delta S_A = \Delta S_B$ [handwritten] +2  (circled)

c) $\Delta S_A < \Delta S_B$

d) Insufficient information

Explain your response to this question. *Type your answer in the box in Canvas.*

[handwritten] Entropy is a property, so $\Delta S_A = \Delta S_B$. (+4)

If the system went from State 1 to 2 along Path A, and then back from State 2 to 1 along Path B (reversing Path B's direction), which type of cycle would be this? *Answer the multiple-choice question in Canvas.*

a) Power cycle

b) Refrigeration cycle [handwritten] +2  (circled)

c) Insufficient information

Explain your response to this question. *Type your answer in the box in Canvas.*

[handwritten] The $\oint \delta Q$ is $< 0$ for this (counter clockwise) and so work input is needed to run a cycle, which is a refrigeration cycle. (+2)

4

## Page 5

**Part II: Analysis**
**The story:** Cooling is one of the most expensive and critical technologies in modern computer data centers. The huge number of computers in these data centers require extreme amounts of cooling to run efficiently, and overheating can lead to hardware failure and data loss. An engineer is tasked with designing a new system that uses a small gas turbine engine to power the cooling system for the data center. The work from the power generation gas turbine (running a Brayton cycle) powers the pump in a vapor compression cycle, which runs the coolant R-134a (saturation and superheated vapor tables for this substance available for download on Canvas in the exam – *do not use the water tables!!!*). Use the information below to answer the following questions about this system. Identify any tables you use at each step of the problem. If you use a superheated vapor or subcooled liquid table, do not interpolate between values – use the closest value on the table.

**Note:** This question builds on itself – to get numerical answers throughout, you'll need the numbers from the previous questions. *However, if you get stuck and can't find the answers, write down the method you would use to solve each part of the problem!!!* You will get most of the credit for the method.

| Gas Turbine Brayton Cycle | |
|---|---|
| Inlet temperature | 300 K |
| Inlet pressure | 0.1 MPa |
| Compressor pressure ratio | 25 |
| Compressor isentropic efficiency | 0.9 |
| Maximum temperature | 1600 K |
| Turbine isentropic efficiency | 1 |
| Mass flow | 15 kg/s |

| Refrigerator Vapor Compression Cycle | |
|---|---|
| Pressure at compressor inlet | 0.28 MPa |
| Quality at compressor inlet | 1 |
| Pressure at compressor outlet | 0.9 MPa |
| Compressor isentropic efficiency | 1 |
| Quality after the condenser | 0 |

[handwritten] $\Rightarrow$ <cold air properties

a) [handwritten] 6[?] (5 points) What assumptions must be made about both the working fluid and the devices in this factory in order to solve for the state points? Make sure to list all devices! ***Enter these in the Canvas quiz – you do not need to also write them on the page.***

b) [handwritten] 5 (5 points) What is the temperature of the air after the compressor in the gas turbine in [K]? ***Show your work below or on a separate page and enter this value in the Canvas quiz.***

c) [handwritten] 3 (5 points) How much heat is added to the gas turbine in [MW]? ***Show your work below or on a separate page and enter this value in the Canvas quiz.***

d) [handwritten] 4 (5 points) What is the net work of the gas turbine in [MW]? ***Show your work below or on a separate page and enter this value in the Canvas quiz.*** [handwritten] power

e) [handwritten] 6 (5 points) Plot the gas turbine cycle on a P-V diagram, indicating the pressures on the y-axis. ***Show your work below or on a separate page, no need to put anything into the Canvas quiz.***

f) [handwritten] $\rightarrow$ (2 points) What is the efficiency of the gas turbine? ***Show your work below or on a separate page and enter this value in the Canvas quiz.***

g) [handwritten] $\leftarrow$ (10 points) What is the mass flow of coolant through the vapor compression cycle in [kg/s]? ***Show your work below or on a separate page and enter this value in the Canvas quiz.***

h) [handwritten] 4 (points) What is the heat removed from the cold space by the evaporator in the vapor compression cycle in [MW]? ***Show your work below or on a separate page and enter this value in the Canvas quiz.***

5

## Page 6

i) [handwritten] 3 points) What is the coefficient of performance of the vapor compression cycle? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

j) [handwritten] 4 points) Plot the vapor compression cycle on a T-S diagram, indicating the pressures using isobars. *Show your work below or on a separate page, no need to put anything into the Canvas quiz.*

[handwritten] α ✓

6

## Page 7

a) Assume:

[handwritten] Air → ideal gas, $c_p$ = const.
[handwritten] R-134a → S.C.S.
[handwritten] GT cycle → air standard → comp: $\dot{Q} = \dot{W} = \Delta ke = \Delta pe = 0$
[handwritten] → steady flow
[handwritten] comb: $\Delta ke = \Delta pe = \dot{W} = 0$
[handwritten] turb: $\Delta ke = \Delta pe = \dot{Q} = 0$

[handwritten] Frig cycle → steady flow
[handwritten] → ideal cycle => comp: $\dot{Q} = \Delta ke = \Delta pe = 0$
[handwritten] evap/cond: $\dot{W} = \Delta ke = \Delta pe = 0$

b) $T_1 = 300\text{ K}$
$P_1 = 0.1\text{ MPa}$
$P_2 = 2.5\text{ MPa}$
$\eta_{isen} = 0.9$

[handwritten] State 2s: $T_{2s} = T_1 \left( \frac{P_2}{P_1} \right)^{\frac{k-1}{k}}$
$= 300 (25)^{\frac{0.4}{1.4}} = 752.55\text{ K}$

[handwritten] State 2: $\eta_{isen} = \frac{\dot{W}_{ideal}}{\dot{W}_{real}} = \frac{-\dot{m} c_p (T_{2s} - T_1)}{-\dot{m} c_p (T_2 - T_1)}$
$T_2 = T_1 + \frac{(T_{2s} - T_1)}{\eta_{isen}}$
$= 300 + \frac{(752.55 - 300)}{0.9} \Rightarrow$ **ANSWER:** $\boxed{802.8\text{ K}}$

c) $T_2 = 802.8\text{ K}$
$T_3 = T_{max} = 1600\text{ K}$
$\dot{Q} = \dot{m} c_p (T_3 - T_2)$
$= (15)(1001)(1600 - 802.8) \Rightarrow$ **ANSWER:** $\boxed{\dot{Q} = 11.97\text{ MW}}$

d) $\dot{W}_{net} = \dot{W}_2 + \dot{W}_4$ where $\dot{W} = -\dot{m} c_p \Delta T$
[handwritten] State 4: $\eta_{isen} = 1$ → isentropic expansion
$T_4 = T_3 \left( \frac{P_3}{P_4} \right)^{\frac{k-1}{k}} = 1600 \left( \frac{1}{25} \right)^{\frac{0.4}{1.4}} = 637.8\text{ K}$

7

## Page 8

$\dot{W}_{net} = -\dot{m}c_p(T_2-T_1) - \dot{m}c_p(T_4-T_3)$

$$= -(15)(1.001)(802.8-300) - (15)(1.001)(637.8-1600)$$

$$\boxed{\dot{W}_{net} = 6.9\ \text{MW}}$$ (+1)

e) $\eta_{th} = \dfrac{\dot{W}_{net}}{\dot{Q}_{in}} \overset{+2}{=} \dfrac{6.9}{11.97} = \boxed{0.576}$ (+1)

f) [figure] P–v diagram: vertical axis labelled "P [MPa]" with tick marks at 2.5 (upper) and 0.1 (lower), horizontal axis unlabelled. Circled state points: state 2 at the top-left (P = 2.5), state 3 at the top-right at the same pressure level (P = 2.5), state 1 at the bottom-left (P = 0.1), state 4 at the bottom-right at P = 0.1. Process paths with arrows: horizontal arrow from 2 to 3 at P = 2.5; arrow from 3 down/right to 4; horizontal arrow from 4 to 1 at P = 0.1; curved arrow from 1 up/left back to 2. Annotations on the figure: "2.5" at the upper tick, "0.1" at the lower tick, "(+1)" beside each of the circles 2, 3, 1, 4, "[handwritten] +1 for shape" written along the 3→4 path, and "[handwritten] +1 for P" written near the 2→3 line.

g) $\dot{W}_{net,GT} = -\dot{W}_{comp,VC}$ (+2) $\qquad$ where $\qquad \dot{W}_{comp,VC} = -\dot{m}_c(h_2-h_1)$ (+2)

$$\Rightarrow \dot{m}_c = -\frac{\dot{W}_{comp}}{h_2-h_1}$$

$\Rightarrow$ State 1: $\quad P_1 = 0.28$
$x_1 = 1$ $\quad\Bigg\}$ Table A.2
$h_1 = h_g = 397.89\ \frac{kJ}{kg}$ (+2)
$s_1 = s_g = 1.7278\ \frac{kJ}{kg\cdot K}$

$\Rightarrow$ State 2: $\quad P_2 = 0.9$ MPa
$s_2 = s_1 = 1.7278\ \frac{kJ}{kg\cdot K}$ (+2) $\quad\Bigg\}$ $s_2 > s_g @ P_2 \Rightarrow$ vapor

Table A.3N $\longrightarrow$ $s_2 = 1.7283\ \frac{kJ}{kg\cdot K}$
$\qquad\qquad\qquad\ \ h_2 = 422.32\ \frac{kJ}{kg}$ (+2)

8

## Page 9

$\dot{m}_c = \left[ \dfrac{6.9 \times 10^6}{(422.32 - 399.89) \times 10^3} \right] \rightarrow \boxed{\dot{m}_c = 282.4\ \dfrac{kg}{s}}$ (+1)

h) $\,_1\dot{Q}_1 = \dot{m}_c\,(h_1 - h_4)$ (+2)

$\Rightarrow\ h_4 = h_3$ through throttle (+2)

$\Rightarrow$ State 3: $P = 0.9$ MPa, $x_3 = 0$ } Table A.2

$h_3 = h_f = 249.78\ \dfrac{kJ}{kg} = h_4$ (+2)

$\,_1\dot{Q}_1 = \dot{m}_c\,(h_1 - h_4)$

$= (282.4)(397.89 - 249.78)$

$= \boxed{41.83\ \text{MW}}$ (+1)

i) $\beta = \dfrac{\,_1\dot{Q}_1}{\dot{W}_{in}}$ (+2) $= \dfrac{41.83}{6.9} = \boxed{6.1}$ (+1)

j) [figure] $T$–$s$ diagram: vertical axis labelled $T$, horizontal axis labelled $s$. A saturation dome is drawn with dashed constant-pressure lines; a dashed curve marks the shape. State (2) is at the top of the dome, state (3) on the left (saturated liquid) branch, state (1) at the right on a dashed line, and state (4) marked with a small square inside the dome at the lower left. Process arrows: vertical arrow pointing up on the segment between (1) and (2); horizontal arrow along the segment from (3); horizontal arrow pointing left on the lower segment (throttle) ending at (4). Annotations written on the figure: "$P_2 = P_3$ (+1)" beside state (2); "(+1)" beside state (3); "$P_1 = P_4$ (+1)" on the right; "(+1)" beside state (1); "+1 (4)" below state (4); "+1 for shape" written to the right of the dome.

9

## Page 10

(blank)

[handwritten] 10
