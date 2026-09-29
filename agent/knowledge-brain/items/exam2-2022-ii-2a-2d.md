---
id: item:exam2-2022-ii-2a-2d
kind: item
title: Exam 2, problem II.2a-2d (Summer 2022) — Reversible Carnot cycle efficiency, heat rejection, and
  entropy changes
description: 'Exam 2 (Summer 2022), problem II.2a-2d: Students can compute Carnot efficiency from reservoir
  temperatures.; Students can relate heat input, heat rejection, and work using the efficiency.'
parent: topic:m7-05-carnot-efficiency
unit: unit:m7-second-law-and-entropy
status: auto
audience: model
priority: 0.5
topics:
- topic:m7-05-carnot-efficiency
- topic:m7-03-heat-engines-thermal-efficiency
- topic:m7-07-entropy
sources:
- path: assignments/exams/exam-2-practice/OConnor_ME300_Exam2_Summer2022.pdf
  pages:
  - 6
- path: assignments/exams/exam-2-practice/OConnor_ME300_Exam2_Summer2022_Solutions.pdf
  pages:
  - 6
  - 7
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: exam2-2022
---

# Exam 2 (Summer 2022), problem II.2a-2d: Reversible Carnot cycle efficiency, heat rejection, and entropy changes

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

A reversible Carnot cycle operates between 1500 K and 300 K with the following four steps:

- Process 1-2: isothermal heat addition
- Process 2-3: isentropic expansion
- Process 3-4: isothermal heat rejection
- Process 4-1: isentropic compression

a) What is the thermal efficiency of this cycle?

b) If 100 kJ of heat is added to the cycle in Process 1-2, how much heat was rejected in Process 3-4 in [kJ]?

c) What is the change in entropy of the working fluid for each process in the cycle in [J/K]?

d) Draw this cycle on a T-s diagram, labeling all the state points.

## What it tests

- Students can compute Carnot efficiency from reservoir temperatures.
- Students can relate heat input, heat rejection, and work using the efficiency.
- Students can determine entropy changes for isothermal and isentropic processes in a reversible cycle.

## Assumptions the solution expects

- ideal reversible cycle
- quasi-equilibrium processes

## Where students go wrong

- Writing the Carnot efficiency as T_H/(T_H-T_L) or using Celsius temperatures.
- Taking Q_L equal to Q_H instead of using W = eta_th Q_H and Q_L = Q_H - W.
- Computing entropy change for heat rejection with the wrong sign or using the wrong temperature reservoir.
- Assigning zero entropy change incorrectly to the isothermal processes instead of the isentropic processes.
- Failing to convert between kJ and J if giving the answer in problem-specified units.

## How it is graded

Points awarded for efficiency formula and value, energy balance to get heat rejected, entropy changes with correct signs, and the T-s diagram shape and labels.

## Final answers (hidden — for checking only)

- $eta_th$: 80 %
- $Q_L$: 20 kJ
- $Delta S_12$: 0.067 kJ/K
- $Delta S_23$: 0 kJ/K
- $Delta S_34$: -0.067 kJ/K
- $Delta S_41$: 0 kJ/K
- T-s diagram: Closed rectangle: 1-2 isothermal at T_H, 2-3 isentropic vertical down, 3-4 isothermal at T_L, 4-1 isentropic vertical up
