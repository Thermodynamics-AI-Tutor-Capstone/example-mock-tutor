---
source: me300/lectures/Module6_2_SteadyFlowEnergyConservation_annotated.pdf
pages: 8
kind: lecture-slides
transcribed_by: deepseek-flash (from page images)
---

## Page 1

ME 300:
Engineering Thermodynamics

Steady Flow
Energy Equation

[figure] Left half of the slide: photograph of a four-engine jet airliner in flight, seen from behind and below, climbing away from the viewer toward the upper-left; four long white contrails trail behind the engines across a solid dark blue sky. No labels, axes, or values are written on the figure.

## Page 2

# Steady Flow Energy Equation

[handwritten] => Instantaneous :  $\dfrac{dE_{cv}}{dt} = \dot{E}_{in} - \dot{E}_{out} + \dot{E}_{gen}$  $\sim [W] , [J/s]$

[handwritten] $\star$ => Steady flow assumption :  $\dfrac{d}{dt} = 0$  =>  $\boxed{\dot{E}_{in} = \dot{E}_{out}}$
[handwritten] $E_{cv} = const$

[handwritten] => $\dot{m}_{in} = \dot{m}_{out}$
[handwritten] $m_{cv} = const.$

[handwritten] => change : heat, work
[handwritten] $\dot{Q}$ , $\dot{W}$

[figure] Handwritten sketch: the two rate symbols $\dot{Q}$ and $\dot{W}$ are drawn as small circles with a dot above each (heat transfer rate and work rate annotations). A horizontal underline is drawn beneath the term $\dfrac{dE_{cv}}{dt}$ in the instantaneous equation, extending to the left under the "Instantaneous :" label group. A box (rounded rectangle) is drawn around $\dot{E}_{in} = \dot{E}_{out}$ in the steady-flow result.

## Page 3

Flow work
[handwritten] $\rightarrow$ work associated with moving fluid through a C.V.

[figure] Left: control-volume sketch with inlet labelled ① and exit labelled ②; inlet mass flow rate $\dot m_{in}$, outlet mass flow rate $\dot m_{out}=\dot m_{in}$; near exit: $=P_2<P_1$ [?]. Right: flow-work schematic with $P_1=\frac{F_1}{A_1}$, $P_2=\frac{F_2}{A_2}$, dashed control-volume boundary, downward arrows on the top boundary, horizontal flow arrows, and state labels ① and ②.

[handwritten] $$\rightarrow \dot{W} = \frac{W}{\text{time}} = \frac{\text{force} \times \text{distance}}{\text{time}}$$

[handwritten] $$\Rightarrow \dot{W}_{flow} = P A V = \dot{m} P v \rightarrow \boxed{\dot{W}_{flow} = \dot{m} P v} \quad [m^3/s]$$

[handwritten] $$\Rightarrow \dot{W}_{flow,1} = \dot{m} P_1 v_1 , \quad \dot{W}_{flow,2} = -\dot{m} P_2 v_2$$

## Page 4

Steady Flow Energy Equation $\quad e = \dfrac{E}{M} = ke + pe + u \sim [\text{kJ/kg}]$

$\rightarrow \dot{E}_{in} = \dot{E}_{out}$

$\dot{Q}_{in} + \dot{W}_{in,net} + \dot{m}e_{in} = \dot{Q}_{out} + \dot{W}_{out,net} + \dot{m}e_{out}$

$\dot{Q}_{in} + \dot{W}_{flow,in} + \dot{W}_{in} + \dot{m}e_{in} = \dot{Q}_{out} + \dot{W}_{flow,out} + \dot{W}_{out} + \dot{m}e_{out}$

$\Longrightarrow \dot{m}(e_{out} - e_{in}) = \dot{Q}_{in,net} - \dot{W}_{out,net} + \underbrace{\dot{W}_{flow}}_{\dot{m}(P_1v_1 - P_2v_2)} \qquad h = u + Pv$

$\dot{m}(e_2 + P_2v_2 - e_1 - P_1v_1) = \dot{Q}_{in,net} - \dot{W}_{out,net}$

$\dot{m}\left(u_2 + ke_2 + pe_2 + P_2v_2 - (u_1 + ke_1 + pe_1 + P_1v_1)\right) = \dot{Q}_{in,net} - \dot{W}_{out,net}$

$\boxed{\dot{m}(\Delta h + \Delta ke + \Delta pe) = \dot{Q} - \dot{W}}$

## Page 5

[figure] A large white speech-bubble/cloud shape with a black outline containing a large black question mark "?" sits on a solid yellow background occupying the left portion of the slide; the right portion is white with the printed question and answer choices.

For a given mass flow, does the enthalpy of a fluid increase, decrease, or stay the same if heat is added?

[handwritten] $\dot{m}\,(\Delta h + \text{ke} + \text{ape}) = \dot{Q} - \dot{W}$  (with upward arrows drawn beneath $\dot{m}$ and beneath $\dot{Q}$)

A. Increase  [handwritten] circled
B. Decrease
C. Stay the same

## Page 6

Example: Nozzle flow

(blank)

## Page 7

What is the point of a nozzle?

A. Increase velocity

B. Decrease velocity

[figure] Left portion of the slide: on a yellow background, a white cloud-shaped speech-bubble outline (black border) pointing down-right, containing a large black question mark "?" centered inside it.

## Page 8

Example: Nozzle flow

[figure] A converging nozzle drawn with state ① at the inlet (left, with an arrow labeled $\dot{m}$ pointing in) and state ② at the exit (right); the label $A_2 < A_1$ is written next to ②.

[handwritten] $T_1 = 300\ \text{K}$

[handwritten] $V_1 = 10\ \text{m/s}$

[handwritten] $c_p = 1001\ \text{J/kg}\cdot\text{K}$

[handwritten] $V_2 = 250\ \text{m/s}$

[handwritten] $T_2 = ?$

[handwritten] $$\dot{m}\left(\Delta h + \Delta ke + \cancel{\Delta pe}\right) = \cancel{\dot{Q}} - \cancel{\dot{W}} \longrightarrow$$

[handwritten] Assume

[handwritten] -- steady-flow

[handwritten] -- $\Delta pe = 0$, $\dot{W} = 0$, $\dot{Q} = 0$

[handwritten] -- air = ideal gas

[handwritten] $\quad \hookrightarrow c_p = \text{const}$

[handwritten] $\Downarrow \qquad \Uparrow$

[handwritten] $\Delta h + \Delta ke = 0$

[handwritten] $c_p\,\Delta T + \Delta ke = 0$

[handwritten] $$T_2 = T_1 - \frac{1}{2c_p}\left(V_2^{\,2} - V_1^{\,2}\right)$$

[handwritten] $$= 300 - \frac{1}{2(1001)}\left(250^2 - 10^2\right)$$

**ANSWER:** [handwritten] $\boxed{T_2 = 209\ \text{K}}$
