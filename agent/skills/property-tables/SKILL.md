---
name: property-tables
description: How to fix a state and read thermodynamic property tables (phase region, quality, superheated and compressed liquid, interpolation); use when a student needs properties of water, refrigerants, or other pure substances.
---

# Property tables

> Starter draft written by an AI assistant — not reviewed by a thermodynamics instructor. Edit freely.

## Never quote table values as exact

Values you recall may differ from the student's textbook edition. Give approximate numbers only
to illustrate, say they are approximate, and tell the student to read the exact values from
**their own edition's tables**.

## 1. Fix the state

A simple compressible pure substance needs **two independent intensive properties**.
Inside the two-phase dome, $T$ and $P$ are *not* independent (one sets the other) — you then need
something else, such as quality $x$, $v$, $u$, $h$, or $s$.

## 2. Find the phase region

Use the saturation table at the given $T$ (or $P$) and compare the other property $y$
($v$, $u$, $h$, or $s$) with $y_f$ and $y_g$:

| Comparison | Region |
|---|---|
| $y < y_f$ | compressed (subcooled) liquid |
| $y_f \le y \le y_g$ | saturated liquid–vapour mixture |
| $y > y_g$ | superheated vapour |

With $T$ and $P$ given: $P > P_{sat}(T)$ (equivalently $T < T_{sat}(P)$) → compressed liquid;
$P < P_{sat}(T)$ (equivalently $T > T_{sat}(P)$) → superheated vapour.

## 3. Saturated mixture

Quality $x = m_{vapour}/m_{total}$, with $0 \le x \le 1$.

$$y = y_f + x\,(y_g - y_f) = y_f + x\,y_{fg}, \qquad x = \frac{y - y_f}{y_{fg}}$$

This holds for $v$, $u$, $h$, and $s$.

## 4. Superheated vapour

Use the superheated table at the given pressure; find the row for the temperature (or match
$v$, $h$, $s$). If the pressure or temperature is between table entries, interpolate.

## 5. Compressed liquid

If no compressed-liquid table covers the state, approximate with saturated liquid **at the same
temperature**: $v \approx v_f(T)$, $u \approx u_f(T)$, $s \approx s_f(T)$, and
$h \approx h_f(T)$ (a better estimate is $h \approx h_f(T) + v_f\,[P - P_{sat}(T)]$).

## 6. Linear interpolation

$$y = y_1 + \frac{x - x_1}{x_2 - x_1}\,(y_2 - y_1)$$

Interpolate between the two nearest table entries. If both $T$ and $P$ fall between entries,
interpolate twice (double interpolation). Check the result lies between the bracketing values.

## Common mistakes to watch for

- Using $T$ and $P$ to fix a state that is actually saturated.
- Using saturated-liquid values at the same *pressure* instead of the same *temperature* for a
  compressed liquid.
- Mixing units (kPa vs MPa, kJ/kg vs kJ/kg·K).
- Getting $x < 0$ or $x > 1$ — that means the state is not a mixture.
