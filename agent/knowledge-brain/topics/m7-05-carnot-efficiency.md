---
id: topic:m7-05-carnot-efficiency
kind: topic
title: M7.5 — Carnot Efficiency
description: Explains Carnot (maximum) thermal efficiency for reversible heat engines, works a 1200 K
  / 300 K gas-turbine example, and reviews the ideal Carnot cycle processes.
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.5
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can write the Carnot efficiency expression for a reversible heat engine in terms of reservoir
    temperatures.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can explain why the Carnot efficiency formula requires absolute temperatures and why
    thermal efficiency is less than 1.
  kc_type: principle
  bloom: understand
- id: '#o3'
  text: Students can compute the maximum thermal efficiency for a heat engine given T_H and T_L.
  kc_type: skill
  bloom: apply
- id: '#o4'
  text: Students can list the four processes of the ideal, reversible Carnot cycle.
  kc_type: fact
  bloom: remember
equations:
- eq:carnot-efficiency
misconceptions:
- misc:m09-friction-is-the-only-efficiency-limit
examples:
- ex:ee06-explained-example-6-carnot-cycle
items:
- item:exam2-2021-ii-2
- item:exam2-2022-ii-2a-2d
- item:exam2-2023-ii-2
- item:hw08-1
- item:hw08-2
sources:
- path: lectures/Module7_5_CarnotEffiency_annotated.pdf
  pages:
  - 1
  - 2
  - 3
  - 4
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M7.5 — Carnot Efficiency

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This short lecture introduces the Carnot efficiency as the maximum thermal efficiency of a reversible heat engine and applies it to a gas-turbine example. It closes by defining the ideal Carnot cycle and its four processes (p. 2-4).

## Key ideas
- For a reversible heat engine operating between a high-temperature reservoir at $T_H$ and a low-temperature reservoir at $T_L$, the Carnot/maximum thermal efficiency is
  $$\eta_{th,rev}=\eta_{th,max}=1-\frac{T_L}{T_H}$$
  (p. 2).
- The expression uses absolute temperatures; the slide notes the absolute temperature scale in kelvin (p. 2).
- A heat engine cannot have $\eta_{th}=1$. The slide annotates $\eta_{th}\neq 1$ and $\eta_{th}<1$ because $T_L>0$ and $T_H<\infty$ (p. 2).
- Carnot efficiency gives the greatest possible efficiency for the given reservoir temperatures. For heat addition at $T_H=1200\ \mathrm{K}$ and heat rejection at $T_L=300\ \mathrm{K}$,
  $$\eta_{th,max}=1-\frac{300}{1200}=0.75$$
  (p. 3).
- The Carnot cycle is an ideal, reversible cycle: process 1-2 is isothermal heat addition, 2-3 is adiabatic expansion, 3-4 is isothermal heat rejection, and 4-1 is adiabatic compression (p. 4).

## Notation used
- $\eta_{th}$: thermal efficiency
- $\eta_{th,rev}$: reversible thermal efficiency
- $\eta_{th,max}$: maximum thermal efficiency, i.e. Carnot efficiency
- $T_H$: high-temperature reservoir temperature
- $T_L$: low-temperature reservoir temperature

## Examples in this lecture
- Gas turbine with heat addition at $T_H=1200\ \mathrm{K}$ and heat rejection to the atmosphere at $T_L=300\ \mathrm{K}$: demonstrates direct application of the Carnot efficiency expression (p. 3).

## What students get wrong here
- Using Celsius or Fahrenheit temperatures in the Carnot efficiency expression. The slide calls for an absolute temperature scale, kelvin (p. 2).
- Thinking a heat engine can reach 100% thermal efficiency. The lecture explicitly annotates $\eta_{th}\neq 1$ and $\eta_{th}<1$ because $T_L>0$ and $T_H<\infty$ (p. 2).
