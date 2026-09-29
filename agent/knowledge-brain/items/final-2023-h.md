---
id: item:final-2023-h
kind: item
title: Final exam, problem h (Summer 2023) — Refrigerant temperature after ideal compressor
description: 'Final exam (Summer 2023), problem h: Students can find the compressor exit temperature for
  an isentropic R-134a compressor using entropy equality and superheated vapor tables.'
parent: topic:m8-07-vapor-compression
unit: unit:m8-power-and-refrigeration-cycles
status: auto
audience: model
priority: 0.5
topics:
- topic:m8-07-vapor-compression
- topic:m8-08-example-vapor-compression
sources:
- path: assignments/exams/final/OConnor_ME300_FinalExam_Summer2023.pdf
  pages:
  - 6
- path: assignments/exams/final/OConnor_ME300_FinalExam_Summer2023_Solutions.pdf
  pages:
  - 8
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: final-2023
---

# Final exam (Summer 2023), problem h: Refrigerant temperature after ideal compressor

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

Vapor Compression Cycle data (assume ideal compression): R-134a quality at compressor inlet x=1; R-134a pressure at compressor inlet=0.2 MPa; R-134a pressure at compressor outlet=1.4 MPa; R-134a quality at condenser outlet x=0. h) What is the temperature of the refrigerant after the compressor in the vapor compression cycle in K?

## What it tests

- Students can find the compressor exit temperature for an isentropic R-134a compressor using entropy equality and superheated vapor tables.

## Assumptions the solution expects

- Compressor is ideal/isentropic: s2 = s1.
- R-134a at compressor inlet is saturated vapor at 0.2 MPa.
- Compressor outlet pressure is P2 = 1.4 MPa.
- Use closest R-134a table values without interpolation.

## Where students go wrong

- Using the saturation temperature at 1.4 MPa instead of the superheated vapor entropy-based temperature.
- Not checking whether s2 > s_g at 1.4 MPa before using the superheated table.
- Using Celsius when the requested answer is in K.
- Assuming R-134a is an ideal gas instead of using tables.
- Using s2 = s1 incorrectly by reading the wrong entropy at state 1.

## How it is graded

Solutions award credit for h1 and s1 at 0.2 MPa, s2=s1, identifying superheated vapor, finding h2 in the superheated table, and reporting T2.

## Final answers (hidden — for checking only)

- $T_2$: 333.15 K
