---
id: unit:u2-nonideal-gases-and-phase-data
kind: unit
title: 'Unit 2 — Non-ideal gases and multi-phase property data'
description: >-
  Lectures 10–17, Exam 2. Van der Waals, the compressibility chart, multi-phase substances —
  phase boundaries, quality, T-v diagrams, interpolation — compressed liquids and solids.
  Turns & Pauley 2.6–2.9.
parent: course:me300
unit: unit:u2-nonideal-gases-and-phase-data
status: reviewed
audience: both
priority: 0.9
prerequisites:
  - unit:u1-concepts-and-ideal-gas-properties
precedes:
  - unit:u3-mass-and-first-law-closed-systems
objectives: []
equations: []
symbols: []
misconceptions:
  - misc:m05-adiabatic-and-isothermal-conflated
  - misc:m04-heat-always-raises-temperature
examples: []
items: []
sources:
  - url: https://www.me.psu.edu/assets/docs/sample-syllabus/ME-300.pdf
    title: ME 300 sample syllabus, "Anticipated Class Lecture Schedule", lectures 10–17
    retrieved: '2026-09-17'
generated: null
---

# Unit 2 — Non-ideal gases and multi-phase property data

> Lecture rows, titles and readings below are **transcribed** from the published sample
> syllabus. The framing paragraphs are **authored by this project and not checked by an
> ME 300 instructor.**

Eight lectures, ending in **Exam 2**. Unit 1 gave one equation of state; this unit is about
what to do when it does not hold. Two separate escapes from ideal-gas behaviour are taught
here, and students routinely reach for the wrong one: an **equation** (Van der Waals) or a
**chart** (generalized compressibility, $Z$) for gases away from ideality, and **tables** for a
substance that is changing phase.

The skill this unit really assesses is *deciding which representation the state calls for* —
ideal-gas equation, compressibility chart, or property table — before any arithmetic happens.
That decision is a graded step in the ASSUMPTIONS line of the mandated solution format.

## Lecture rows

| Lecture | Topic | Turns & Pauley |
|---|---|---|
| 10 | Nonideal gases: Van der Waals equation of state, generalized compressibility | 2.6 |
| 11 | Examples | — |
| 12 | Nonideal gases: Van der Waals equation of state, generalized compressibility | 2.6 |
| 13 | Multi-phase substances: phase boundaries, quality, T-v diagrams, interpolation | 2.7a |
| 14 | Examples | — |
| 15 | Multi-phase substances (continued); HW 2 submission | 2.7a |
| 16 | Compressed liquids and solids | 2.8, 2.9 |
| 17 | **Exam 2** | — |

The schedule prints lectures 10 and 12 with the same title and the same reading, and 13 and 15
likewise; both are two-day treatments. Transcribed as printed.

## What a student should be able to do by Exam 2

- Decide, from $T$ and $P$ (or $T$ and $v$), whether a substance is a compressed liquid, a
  saturated mixture, or a superheated vapour — and say how they decided.
- Use the generalized compressibility chart: compute reduced pressure and temperature from
  critical properties, read $Z$, and apply $Pv = ZRT$.
- Use the Van der Waals equation of state and say what each of its two constants corrects for.
- Read a T-v (and P-v) diagram: locate the saturation dome, the critical point, the saturated
  liquid and saturated vapour lines.
- Compute quality $x$ and use it: $y = y_f + x\,y_{fg}$ for $v$, $u$, $h$ and $s$.
- Linearly interpolate in a two-way property table and say how much accuracy that buys.
- Apply the compressed-liquid approximation ($y \approx y_f$ at the given $T$) and know when it
  is not good enough.

The syllabus notes that **property tables are provided by the instructor at the exam**, so the
assessed skill is reading and interpolating them, not memorising values. Kelvin should say
table values are approximate and tell the student to read the exact numbers from their own
tables — that rule is already in the system prompt.

## What bites students here

- **Reaching for $Pv = RT$ inside the dome.** Inside the saturation dome $T$ and $P$ are not
  independent, so the ideal-gas law cannot locate the state at all. A student who gets a
  plausible-looking number this way has no signal that they are wrong.
- **Subscript soup.** $f$, $g$, $fg$, $sat$ — see [`symbols.md`](../symbols.md).
- **Adiabatic read as isothermal.** Phase-change problems are where this surfaces first:
  heat goes in, temperature does not move, and the student concludes no heat was transferred.
  See [`misc:m04-heat-always-raises-temperature`](../misconceptions/m04-heat-always-raises-temperature.md)
  and [`misc:m05-adiabatic-and-isothermal-conflated`](../misconceptions/m05-adiabatic-and-isothermal-conflated.md).

## What is not here yet

No topic, equation, table or worked-example cards exist for this unit — the course-file corpus
is empty.
