---
id: topic:m7-09-reversibility
kind: topic
title: M7.9 — Reversibility
description: Defines reversible vs irreversible cycles, introduces entropy generation and irreversibilities,
  and states the Clausius inequality for a cycle with one reversible leg and one irreversible leg.
parent: unit:m7-second-law-and-entropy
unit: unit:m7-second-law-and-entropy
lecture: M7.9
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: State the condition for a reversible cycle in terms of the final states of the system and surroundings.
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Identify friction, mixing, and finite expansion as sources of irreversibility.
  kc_type: fact
  bloom: understand
- id: '#o3'
  text: Interpret the Clausius inequality written for a cycle that has a reversible 1-2 leg and an irreversible
    2-1 leg.
  kc_type: principle
  bloom: understand
equations: []
misconceptions:
- misc:m02-entropy-and-the-second-law
- misc:m10-entropy-of-an-isolated-system
examples: []
items:
- item:exam2-2021-i-2
- item:hw08-2
- item:hw08-5
sources:
- path: lectures/Module7_9_Reversibility_annotated.pdf
  pages:
  - 1
  - 2
  - 3
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M7.9 — Reversibility

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers

This lecture defines reversible and irreversible cycles by what happens to both the system and its surroundings, then writes the Clausius inequality for a cycle made of a reversible leg and an irreversible leg. Use this card when a student is starting Module 7.9 or asking what “reversible” means in a cycle context.

## Key ideas

- A reversible cycle is one in which the system and the surroundings both return to their original state after the cycle (p. 2).
- In an irreversible cycle, the surroundings do **not** return to their original state; the annotation states that entropy is generated (p. 2).
- Irreversibilities identified on the slide are friction, mixing, and finite expansion; the “spontaneously” mixing A/B sketch illustrates mixing (p. 2).
- The page 3 cycle labels one direction 1→2 as reversible and the other 2→1 as irreversible. This is used to distinguish reversible and irreversible contributions inside the cyclic integral (p. 3).
- The written Clausius inequality for the cycle is $\int_1^2 \frac{\delta Q}{T}+\int_2^1 \frac{\delta Q}{T}<0$; when the 1→2 leg is reversible, the first integral becomes the system entropy change $\int_1^2 dS_{sys}$ (p. 3).
- The final relation $\Delta S_{sur}>0$ states that the surroundings’ entropy increases in the irreversible cycle being considered (p. 3).

## What students get wrong here

- Students often judge reversibility only by whether the system returns to its starting state. The slide corrects this by emphasizing the surroundings: an irreversible cycle is exactly one where the surroundings do not return to their original state (p. 2).
- The “system vs. surroundings” heading is a reminder to track entropy changes in the correct system; the irreversible-cycle result is an entropy increase of the surroundings, not simply “entropy always increases” without specifying the system (p. 3).
