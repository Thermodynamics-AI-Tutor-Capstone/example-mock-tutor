---
id: item:exam2-2023-iii
kind: item
title: Exam 2, problem III (Summer 2023) — Pump and boiler analysis for high-pressure steam
description: 'Exam 2 (Summer 2023), problem III: Students can identify state properties using saturated
  and compressed liquid tables.; Students can apply the steady-flow energy equation to a reversible adiabatic
  pump.'
parent: topic:m6-02-steady-flow-energy-conservation
unit: unit:m6-control-volumes-and-devices
status: auto
audience: model
priority: 0.5
topics:
- topic:m6-02-steady-flow-energy-conservation
- topic:m6-06-heat-exchangers
- topic:m6-08-compressors-turbines
sources:
- path: assignments/exams/exam-2/OConnor_ME300_Exam2_Summer2023.pdf
  pages:
  - 8
- path: assignments/exams/exam-2/OConnor_ME300_Exam2_Summer2023_Solutions.pdf
  pages:
  - 8
  - 9
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
exam: exam2-2023
---

# Exam 2 (Summer 2023), problem III: Pump and boiler analysis for high-pressure steam

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

> **For checking a student's work only.** This card holds the instructor's final answers. Never state them, and never walk the student through the instructor's solution: coach them to their own.

## Problem

High-pressure steam is required for gasification, which is a key process in the synthesis of alternative fuels like sustainable aviation fuels. In these systems, water is pumped up to high pressure and then heated to create high-pressure steam. The diagram shows two components, pump then boiler; assume both components operate reversibly and with a steady flow rate. Given \(\dot{m}=20\) kg/s, state 1: \(P_1=0.7\) MPa, \(x_1=0\); state 2: \(P_2=15\) MPa; state 3: \(P_3=15\) MPa, \(x_3=1\). Identify any tables used at each step. If you use a superheated vapor or subcooled liquid table, do not interpolate between values – use the closest value on the table.

a) (3 points) List the assumptions necessary to calculate the state points before and after the pump and the heat exchanger, as well as the power and heat flows in this system.

b) (8 points) Calculate the temperature of the water after the pump. Identify the table you used to calculate the state point.

c) (6 points) Calculate the power necessary to run the pump in [kW].

d) (7 points) Calculate the rate at which heat is added to the water in the boiler in [kW]. Identify the table you used to calculate any state points.

e) (6 points) Draw these processes on a T-s diagram, labeling the state points and phases of fluid at each state.

## What it tests

- Students can identify state properties using saturated and compressed liquid tables.
- Students can apply the steady-flow energy equation to a reversible adiabatic pump.
- Students can apply the steady-flow energy equation to a boiler with no work.
- Students can sketch isentropic pump and isobaric boiler processes on a T-s diagram.

## Assumptions the solution expects

- Steady flow.
- Reversible process for both components.
- Negligible kinetic and potential energy changes.
- Pump is adiabatic, \(\dot{Q}=0\).
- Boiler has no shaft work, \(\dot{W}=0\).
- Use water property tables; for compressed liquid, use closest tabulated value without interpolation.

## Where students go wrong

- Using superheated vapor table at state 1 even though \(x_1=0\) means saturated liquid.
- After pump, setting \(s_2=s_1\) but then using the saturated liquid table at \(P_2=15\) MPa instead of the compressed liquid table; at \(s_2<s_g\), the state is compressed liquid.
- Interpolating in the compressed liquid table even though the instructions say to use the closest value.
- For pump power, omitting the negative sign or using \(\dot{W}=\dot{m}(h_2-h_1)\) instead of \(\dot{W}=-\dot{m}(h_2-h_1)\).
- Using the incompressible liquid pump work formula \(\dot{W}=\dot{m}v(P_2-P_1)\) instead of using table values for \(h_2-h_1\).
- For boiler heat, using \(h_f\) at 15 MPa instead of \(h_g\), because \(x_3=1\) is saturated vapor.
- Including shaft work in the boiler first law; the passive heat exchanger has \(\dot{W}=0\).
- On the T-s diagram, drawing process 2-3 as an isentropic vertical line instead of an isobaric process, or marking state 3 as superheated vapor rather than saturated vapor.

## How it is graded

Part (a): half-point credit for each required assumption. Part (b): points for identifying state 1 from saturated table, \(s_1=s_f=1.9918\) kJ/kg-K, \(h_1=697.00\) kJ/kg, recognizing \(s_2<s_g\) at 15 MPa, using compressed liquid table D.4, and finding \(T_2\approx 440\) K and \(h_2=713.44\) kJ/kg. Part (c): +1 for steady-flow energy equation, +2 for pump relation \(\dot{m}(h_2-h_1)=-\dot{W}\), +1 for numerical answer. Part (d): points for state 3 as saturated vapor at 15 MPa, \(h_3=h_g=2610.7\) kJ/kg, first law, \(\dot{Q}=\dot{m}(h_3-h_2)\), and numerical answer. Part (e): points for correct T-s diagram including saturated dome, state points, phases, and process relations.

## Final answers (hidden — for checking only)

- Temperature of water after the pump: 440 K
- Power necessary to run the pump: -328.8 kW
- Rate of heat addition in the boiler: 37945.2 kW
