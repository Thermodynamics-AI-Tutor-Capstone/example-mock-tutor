---
source: me300/lectures/Module8_1_HeatEngineCycleAnalysis_annotated.pdf
pages: 6
kind: lecture-slides
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Heat Engines and Cycle Analysis

[figure] Photo of a historic steam engine with large flywheel in an engine hall (title-slide decoration).

## Page 2
Heat engine

[figure] (handwritten) Heat-engine schematic: box "$T_H$" at top; arrow down labelled "$Q_H$  $\dot{Q}_H$" into a circle labelled "cycle"; arrow out to the right labelled "$W_{net}$  $\dot{W}_{net}$"; arrow down from the cycle labelled "$Q_L$  $\dot{Q}_L$" into box "$T_L$" at bottom.

[handwritten]
$$W_{net} = W_{out} - W_{in}$$
$$Q_H = Q_{in}$$
$$Q_L = Q_{out}$$
(bracketed together) ⟹
$$Q_H = W_{net} + Q_L$$

$$\eta_{th} = \frac{W_{net}}{Q_H}$$

$$\eta_{carnot} = 1 - \frac{T_L}{T_H} \quad \text{max, cycle is reversible}$$

## Page 3
Heat engine – example

Energy from a high-temperature reservoir at 750 K flows at a rate of 2.1 kW to a heat engine. If the engine rejects heat to a low-temperature reservoir at 300 K, what is the maximum possible power the engine can deliver? What is the rate of heat rejection?

[handwritten] ("2.1 kW" is underlined)

- $T_H = 750$ K
- $\dot{Q}_H = 2.1$ kW
- $T_L = 300$ K

Assume: steady flow

max power → $\eta_{th} = \eta_{carnot} = 1 - \frac{T_L}{T_H}$
$$= 1 - \frac{300}{750} \rightarrow \eta_{th,max} = 0.6$$

$$\eta_{th} = \frac{\dot{W}_{net}}{\dot{Q}_{in}} \rightarrow \dot{W}_{net,max} = \eta_{th,max}\,\dot{Q}_{in} = (0.6)(2.1)$$

**ANSWER:** $\dot{W}_{net,max} = 1.26$ kW (boxed)

## Page 4
What is the rejected heat in this problem?

[handwritten]
$$\dot{Q}_H = \dot{W}_{net} + \dot{Q}_L$$
(check marks over $\dot{Q}_H$ and $\dot{W}_{net}$ as known)
$$\dot{Q}_L = \dot{Q}_H - \dot{W}_{net} = 2.1 - 1.26 = 0.84\ \text{kW}$$
**ANSWER:** $\dot{Q}_L = 0.84$ kW (underlined)

[figure] Photo of a speech bubble with a question mark on a yellow background (clicker-question slide).

## Page 5
Cycle analysis

[figure] (handwritten) Schematic: box "$T_H$", arrow down "$Q_{in}$" into circle "cycle", arrow right "$W_{net}$", arrow down "$Q_{out}$" into box "$T_L$" (double-underlined).

[handwritten]
Power cycles: extract power from working fluid (WF)

- Process 1-2: raise energy of WF by work ⟹ $W_{in}$
- Process 2-3: raise energy of WF by heat ⟹ $Q_{in}$
- Process 3-4: extract energy via work ⟹ $W_{out}$
- Process 4-1: reject heat ⟹ $Q_{out}$

$$W_{net} = W_{in} + W_{out} > 0$$
(under $W_{in}$: "< 0"; under $W_{out}$: "> 0")

## Page 6
Examples of cycles

[handwritten]
Stirling cycle:
- $\Delta T = 0$ comp.
- $\Delta V = 0$ heat in
- $\Delta T = 0$ exp.
- $\Delta V = 0$ heat out

Carnot cycle:
- $\Delta s = 0$ comp
- $\Delta T = 0$ heat in
- $\Delta s = 0$ exp.
- $\Delta T = 0$ heat out

Rankine (steam):
- $\Delta s = 0$ comp.
- $\Delta P = 0$ heat in
- $\Delta s = 0$ exp
- $\Delta P = 0$ heat rej.

Air Standard (heading, underlined):

Brayton:
- $\Delta s = 0$ comp
- $\Delta P = 0$ heat in
- $\Delta s = 0$ exp.
- $\Delta P = 0$ heat out

Diesel:
- $\Delta s = 0$ comp
- $\Delta P =$ heat in
- $\Delta s = 0$ exp
- $\Delta V = 0$ heat out

[transcriber note: Diesel heat-in line is written "ΔP = heat in" with the 0 missing; presumably ΔP = 0.]

Otto:
- $\Delta s = 0$ comp
- $\Delta V = 0$ heat in
- $\Delta s = 0$ exp
- $\Delta V = 0$ heat out
