---
source: me300/lectures/Module8_3_HeatPumpRefrigerator_annotated.pdf
pages: 6
kind: lecture-slides
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Heat Pumps and Refrigerators

[figure] Black-and-white photo of outdoor air-conditioner/heat-pump units on a brick wall (title-slide decoration).

## Page 2
Heat pumps

[figure] (handwritten) Schematic: box "$T_L$" at bottom, arrow up "$Q_L$" into circle "cycle"; arrow in from the right "$W_{in}$"; arrow up "$Q_H$" from the cycle into box "$T_H$" at top.

[handwritten]
Goal: Heat $T_H$
  : Tracking $Q_H$

Energy conservation: (boxed) $Q_H = W_{in} + Q_L$

Coefficient of performance (COP)

$$\beta = \frac{\text{desired energy}}{\text{input energy}}$$

(boxed) $$\beta_{heat\,pump} = \frac{Q_H}{W_{in}}$$

(boxed) $$\beta_{carnot,\,heat\,pump} = \frac{T_H}{T_H - T_L}$$

## Page 3
What's the point of a refrigerator?

[figure] Photo of a speech bubble with a question mark on a yellow background (discussion-question slide). No annotation.

## Page 4
Refrigerators

[figure] (handwritten) Schematic: box "$T_L$" at bottom, arrow up "$Q_L$" (marked with a star) into circle "cycle"; arrow in from the right "$W_{in}$"; arrow up "$Q_H$" into box "$T_H$" at top.

[handwritten]
$$\beta = \frac{\text{desired energy}}{\text{input energy}}$$

(boxed) $$\beta_{frig} = \frac{Q_L}{W_{in}}$$

(boxed) $$\beta_{carnot,\,frig} = \frac{T_L}{T_H - T_L}$$

## Page 5
Heat pump example

A residential heat pump uses the ground as an energy source. At a particular operating condition, the heat pump delivers energy at 13.37 kW to the interior while simultaneously removing energy from the ground at 10.05 kW. Determine the electrical power required to run the pump and the COP.

[figure] (handwritten) Sketch of a house on top; arrow up from a circle "pump" to the house labelled "$\dot{Q}_H = 13.37$ kW"; arrow into the pump from the right labelled "$\mathcal{P} = ?$"; arrow up from box "ground" to the pump labelled "$\dot{Q}_L = 10.05$ kW".

[handwritten] (the instructor writes electrical power as a stylised script P, transcribed $\mathcal{P}$)
$$\dot{Q}_H = \mathcal{P} + \dot{Q}_L$$
$$\mathcal{P} = \dot{Q}_H - \dot{Q}_L = 13.37 - 10.05$$

**ANSWER:** $\mathcal{P} = 3.32$ kW (boxed)

$$\beta = \frac{\dot{Q}_H}{\mathcal{P}} = \frac{13.37}{3.32}$$

**ANSWER:** $\beta = 4.03$ (boxed)

## Page 6
Refrigerator example

A refrigerator operates with a COP of 4.2 and requires an electrical input of 700 W. Determine the rate of heat transfer from the cold space and the rate at which the device rejects heat.

[handwritten]
- $\beta = 4.2$
- $\mathcal{P} = 700$ W
- $\dot{Q}_L = ?$
- $\dot{Q}_H = ?$

$$\beta = \frac{\dot{Q}_L}{\mathcal{P}} \rightarrow \dot{Q}_L = \beta\mathcal{P} = (4.2)(700)$$

**ANSWER:** $\dot{Q}_L = 2.94$ kW (boxed)

$$\dot{Q}_H = \mathcal{P} + \dot{Q}_L = 0.7 + 2.94\ \text{kW}$$

**ANSWER:** $\dot{Q}_H = 3.64$ kW (boxed)
