---
source: me300/assignments/exams/final-practice/OConnor_ME300_FinalExam_Summer2022.pdf
pages: 9
kind: exam
transcribed_by: deepseek-flash (from page images)
---

## Page 1

# ME 300 Thermodynamics – Summer 2022
## Final Exam

(Part I)________________ (40 pts)

(Part II)________________ (60 pts)

TOTAL________________

**Directions**

1. Open the online answers portion of the exam and download the exam (this document).
2. Make sure to show all your work!
   a. *If you are using a tablet*, solve the problems directly on this document, showing all your work and writing as clearly as possible.
   b. *If you are writing on paper*, solve the problems on a separate piece of paper (you do not have to print the exam), showing all your work and writing as clearly as possible.
3. Questions that require answers to be submitted to the online answers page on Canvas are written in *red italics* below as a way to remind you of what should be entered. All sketches and plots should be clearly drawn on your working paper and submitted with the upload.
4. If you have questions, please use the *private chat* function in Zoom to send a message directly to Dr. O'Connor so as not to disturb the other students. DO NOT UNMUTE AND ASK YOUR QUESTION ALOUD – this will be distracting to the other students.
5. Once the answers portion of the exam closes, scan or take very nice pictures of your work and upload it to the upload portion of the exam in a PDF document. *I trust that you will not change anything on your exam after the answers portion of the exam closes.* I can't enforce this – I'm really just relying on you to do the right thing. Please keep to the honor code.
6. The timeline for the exam will be the following (all times in EDT, Friday, August 12):
   a. Exam opens (answers portion and upload portion): 10:00 AM
   b. Answers portion of the exam closes: 11:30 AM
   c. Upload portion of the exam closes: 11:45 AM
7. You can anonymously report any incidents of cheating using the following Google form:
   https://forms.gle/E4wFiDtvNuginVkP9

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

1. (6 points) Which of the following expressions is the correct coefficient of performance (COP) for a refrigerator? *Answer the multiple-choice question in Canvas.*

$\dot{Q}_H/\dot{W}_{in}$

$\dot{Q}_L/\dot{W}_{in}$

$\dot{W}_{in}/\dot{Q}_H$

$\dot{W}_{in}/\dot{Q}_L$

Explain why this is the proper definition for COP for a refrigerator. *Type your answer in the box in Canvas.*

2. (6 points) The Brayton and Rankine cycles have the same four steps, listed below for an ideal cycle. What is the difference between these two cycles? *Type your answer in the box in Canvas.*
- Process 1-2: Isentropic compression
- Process 2-3: Isobaric heat addition
- Process 3-4: Isentropic expansion
- Process 4-1: Isobaric heat rejection

2

## Page 3

3. (6 points) The P-V diagram of a cycle is shown in the plot below. Is this a power cycle or a refrigeration cycle? *Answer the multiple-choice question in Canvas.*

[figure] A P-V diagram with pressure P on the vertical axis and volume V on the horizontal axis (both axes unnumbered, arrows pointing up and to the right respectively). Four labelled states are marked with dots and connected by a closed curve: state 2 at the top of the curve, state 1 on the right side of the curve (below and to the right of 2), state 3 at the lower left of the curve, state 4 at the lower right of the curve (to the right of 3 and below 1). An arrowhead on the curve between state 1 and state 2 points from 1 toward 2, indicating the cycle direction 1 → 2 along the top, then 2 → 3 down the left side, 3 → 4 along the bottom, and 4 → 1 up the right side (counterclockwise traversal in the P-V plane).

**Power cycle**

**Refrigeration cycle**

Explain your answer to the previous question. *Type your answer in the box in Canvas.*

4. (6 points) For the cycle above, is the change in entropy of the working fluid over the cycle: *Answer the multiple-choice question in Canvas.*

**Greater than zero**

**Less than zero**

**Equal to zero**

Explain your answer to the previous question. *Type your answer in the box in Canvas.*

3

## Page 4

5. (8 points) Two Brayton cycles have the same inlet conditions (temperature and pressure), compressor pressure ratios, and maximum temperatures. Cycle A is reversible, whereas Cycle B contains a compressor with an isentropic efficiency of 0.85. Which cycle produces more net power? *Answer the multiple-choice question in Canvas.*

**CYCLE A**

**CYCLE B**

Explain your answer to the previous question. *Type your answer in the box in Canvas.*

6. (8 points) Two vapor compression cycles have the same compressor inlet condition (temperature and pressure), the same compressor pressure ratio, and the same heat extracted from the cold space. Cycle A is reversible, whereas Cycle B contains a compressor with an isentropic efficiency of 0.85. Which cycle rejects more heat to the warm space? *Answer the multiple-choice question in Canvas.*

**CYCLE A**

**CYCLE B**

Explain your answer to the previous question. *Type your answer in the box in Canvas.*

4

## Page 5

**Part II: Analysis**

**The story:** Combined cycle power generation is currently the most thermally efficient way to produce large amounts of electricity (on the order of gigawatts). In this problem, we're going to analyze one of the world's newest combined cycle power plants, which is being installed in Ostroleka, Poland. Use the information below to answer the following questions about this system. Identify any tables you use at each step of the problem. If you use a superheated vapor or subcooled liquid table, do not interpolate between values – use the closest value on the table**.

**Note:** This question builds on itself – to get numerical answers throughout, you'll need the numbers from the previous questions. *However, if you get stuck and can't find the answers, write down the method you would use to solve each part of the problem!!!* You will get most of the credit for the method.

| **Gas Turbine Brayton Cycle** | |
|---|---|
| Inlet air temperature [K] | 300 K |
| Inlet air pressure [MPa] | 0.1 MPa |
| Compressor pressure ratio | 22 |
| Compressor isentropic efficiency | 0.85 |
| Heat added during combustion [MW] | 1323 MW |
| Turbine isentropic efficiency | 0.9 |
| Air mass flow [kg/s] | 980 kg/s |
| Properties for air: c$_p$=1001 J/kg-K, γ=1.4 | |

| **Steam Turbine (assume reversible)** | |
|---|---|
| Water quality at pump inlet | 0 |
| Water pressure at pump inlet [MPa] | 0.4 MPa |
| Water pressure at pump outlet [MPa] | 10 MPa |
| Water quality at boiler outlet | 1 |

a) (5 points) What assumptions must be made about both the working fluid and the devices in this power plant in order to solve for the state points? Make sure to list all devices! *Enter these in the Canvas quiz – you do not need to also write them on the page.*

b) (8 points) What is the temperature of the air after the compressor in the gas turbine in [K]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

c) (3 points) What is the maximum temperature of the cycle in [K]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

d) (7 points) What is the net power of the gas turbine in [MW]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

e) (3 points) What is the efficiency of the gas turbine? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

f) (3 points) What is the heat rejected from the gas turbine in [MW]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

g) (14 points) What is the mass flow of water through the Rankine cycle in [kg/s]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

h) (7 points) What is the power produced by the Rankine cycle [MW]? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

i) (3 points) What is the combined-cycle efficiency of this power plant? *Show your work below or on a separate page and enter this value in the Canvas quiz.*

j) (7 points) Plot the Rankine cycle on a T-s diagram, indicating the pressures using isobars. *Show your work below or on a separate page, no need to put anything into the Canvas quiz.*

5

## Page 6

(blank)

6

## Page 7

(blank)

[handwritten] 7

## Page 8

8

## Page 9

(blank)

[handwritten] 9
