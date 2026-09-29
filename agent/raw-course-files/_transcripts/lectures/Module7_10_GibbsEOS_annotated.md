---
source: me300/lectures/Module7_10_GibbsEOS_annotated.pdf
pages: 5
kind: lecture-slides
transcribed_by: deepseek-flash (from page images)
---

## Page 1

ME 300:
Engineering Thermodynamics

Gibbs Equation
of State

[figure] Title slide. Left half of the slide is a photograph of a chrome-finished V-twin motorcycle engine (Harley-Davidson style), showing a polished round air cleaner cover with embossed lettering, a chromed pushrod tube, finned cylinders, and a lower gear-case cover; reflections of grass and sky appear in the chrome. Right half is a light gray panel containing the text above. No axes, states, devices, or numerical values are labeled.

## Page 2

Gibbs equations of state

[handwritten] S.C.S. $\rightarrow$ $f(P_1, P_2) = P_3$
[handwritten] under the $P_1, P_2$: independent intensive

[handwritten] P-v-T : $P = f(T, v)$

[handwritten] Calorific: $u = f(T, v)$
[handwritten] $\quad\quad\quad\quad\;\; h = f(T, P)$

[handwritten] Gibbs: $s = f(T, P)$  } ✱
[handwritten] $\quad\quad\quad\;\; s = f(T, v)$
[handwritten] $\quad\quad\quad\;\; g = f(T, P)$ [handwritten] Gibbs free energy
[handwritten] $\quad\quad\quad\quad\quad\quad g = h - Ts$

## Page 3

Deriving Gibbs equations of state

[handwritten] $\rightarrow$ First law: $d\tilde{U} = \delta Q - \delta W$
[handwritten] [underlined] reversible

[handwritten] $\Rightarrow$ $\delta Q_{rev}$ $\Rightarrow$ $dS = \left.\frac{\delta Q}{T}\right|_{rev}$ $-$ $\delta Q_{rev} = T\,dS$

[handwritten] $\Rightarrow$ $\delta W_{rev}$ $\Rightarrow$ $\delta W = P\,d\mathcal{V}$

[handwritten] [boxed] $d\tilde{U} = T\,dS - P\,d\mathcal{V}$
[handwritten] [boxed] $du = T\,ds - P\,dv$

[handwritten] $\rightarrow$ $H = \tilde{U} + P\mathcal{V}$ $\rightarrow$ $\tilde{U} = H - P\mathcal{V}$
[handwritten] $d\tilde{U} = dH - P\,d\mathcal{V} - \mathcal{V}\,dP$

[handwritten] [boxed] $dh = T\,dS + \mathcal{V}\,dP$
[handwritten] [boxed] $dh = T\,ds + v\,dP$

## Page 4

For ideal gases

[handwritten] $\longrightarrow\; Pv = RT$
[handwritten] $du = c_v\,dT$
[handwritten] $dh = c_p\,dT$

[handwritten] $Tds = du + Pdv$
[handwritten] $\quad = c_v\,dT + Pdv$
[handwritten] $ds = c_v\dfrac{dT}{T} + P\dfrac{dv}{T}$
[handwritten] $ds = c_v\dfrac{dT}{T} + R\dfrac{dv}{v}$

[handwritten] assume $c_v$ = const
[handwritten] $\Delta s = \displaystyle\int_{T_1}^{T_2} c_v\dfrac{dT}{T} + \int_{v_1}^{v_2} R\dfrac{dv}{v}$
[handwritten] ideal gas
[handwritten] $c_v$ = const

**ANSWER:** [handwritten] $\boxed{\;\Delta s = c_v \ln\left(\dfrac{T_2}{T_1}\right) + R \ln\left(\dfrac{v_2}{v_1}\right)\;}$

[handwritten] $Tds = dh - v\,dP$
[handwritten] $\quad = c_p\,dT - v\,dP$
[handwritten] $ds = c_p\dfrac{dT}{T} - v\dfrac{dP}{T}$
[handwritten] $ds = c_p\dfrac{dT}{T} - R\,\dfrac{dP}{P}$
[handwritten] $\Delta s = \displaystyle\int c_p\dfrac{dT}{T} - R\int\dfrac{dP}{P}$
[handwritten] $c_p$ = const.

**ANSWER:** [handwritten] $\boxed{\;\Delta s = c_p \ln\left(\dfrac{T_2}{T_1}\right) - R \ln\left(\dfrac{P_2}{P_1}\right)\;}$

## Page 5

The change in entropy
in an ideal gas for an
isothermal process
where pressure
increases is which of
the following?

A. $\Delta S > 0$
B. $\Delta S < 0$
C. $\Delta S = 0$

[handwritten] B is circled.

[handwritten] $\Delta S = c_p \ln\left(\dfrac{T_2}{T_1}\right) - R \ln\left(\dfrac{P_2}{P_1}\right)$, with $> 0$ written beneath the $\ln(P_2/P_1)$ term (and a small under-mark beneath the $\ln(T_2/T_1)$ term).

[figure] Left side of the image: a large white speech-bubble/thought-cloud shape with a black outline containing a black question mark, placed on a solid yellow background.
