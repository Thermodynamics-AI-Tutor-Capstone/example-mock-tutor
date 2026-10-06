---
source: me300/lectures/Module1_5_ConservationPrinciples_annotated.pdf
pages: 5
kind: lecture-slides
transcribed_by: claude (from page images)
---

## Page 1
ME 300:
Engineering Thermodynamics

Conservation Principles

[figure] Abstract photograph of black-and-white swirling flow patterns (foam on dark water).

## Page 2
Conservation basics

[handwritten]
→ Energy
→ Mass
} (brace) → finite time
         → instantaneous

[figure] Hand-drawn converging duct (wide on left, narrow on right) with a dashed control-volume boundary inside; an arrow enters at the left and an arrow leaves at the right.

## Page 3
Finite time formulation

[handwritten]
→ conservation over a finite time interval: $\Delta t = t_2 - t_1$ ($t_2$ and $t_1$ underlined)

→ define system:
$$\Delta X_{sys} = X(t_2) - X(t_1)$$
$$= X_{in} - X_{out} + X_{gen}$$

Labels under each term (with arrows): $\Delta X_{sys}$ ← "change in conserved quantity"; $X_{in}$ ← "in"; $X_{out}$ ← "out"; $X_{gen}$ ← "generated inside system".

$$\Delta E_{sys} = E_{in} - E_{out} + E_{gen}$$
with $E_{gen}$ underlined and an "×" written beneath it (i.e., the energy generation term is crossed out / zero).

## Page 4
Instantaneous formulation → rates [handwritten; "rates" underlined] ⇒ flow, ⇒ leakage, ⇒ transfer

[handwritten]
system $X_{sys}$

$$\frac{dX_{sys}}{dt} = \dot{X}_{in} - \dot{X}_{out} + \dot{X}_{gen} \quad \sim \left[\frac{\text{units}}{\text{sec}}\right]$$

## Page 5
Example: leaky pipe

[figure] Hand-drawn horizontal pipe with a dashed control-volume boundary labelled "C.$\forall$." inside. Arrow entering at left labelled $\dot{m}_{in}$; arrow leaving at right labelled $\dot{m}_{out}$; arrow leaving downward through the bottom wall labelled $\dot{m}_{leak}$.

[handwritten]
$$\frac{dm_{cv}}{dt} = \dot{m}_{in} - \dot{m}_{out} - \dot{m}_{leak}$$
with $\dot{m}_{in}$ braced and labelled "rate added", and $\dot{m}_{out} - \dot{m}_{leak}$ braced and labelled "rate subtracted."
