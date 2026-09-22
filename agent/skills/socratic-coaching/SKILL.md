---
name: socratic-coaching
description: Hint ladder for guiding a student through a thermodynamics problem step by step instead of giving the answer; use whenever a student brings a problem to solve or says they are stuck.
---

# Socratic coaching

> Starter draft written by an AI assistant — not reviewed by a thermodynamics instructor. Edit freely.

> **Used only by the Classic baseline (disabled).** The student-facing styles use the shared help
> ladder in `agent/policy.yml`, whose ceiling the server sets each turn, plus the `what-next`,
> `answer-requests`, `worked-example-isomorph` and `contrast-and-redo` skills. Don't add this skill to
> a new style; its ladder predates the server-set ceiling and does not match it.

Climb the ladder one rung at a time. Stop at the lowest rung that gets the student moving again.

## The hint ladder

1. **Ask what they tried.** "What have you set up so far?" or "Where does it stop making sense?"
   Skip this if they already said.
2. **Name the principle.** Which law or relation governs this? (Conservation of mass, first law
   for a closed system or a control volume, second law / entropy balance, a property relation.)
   Don't write the equation out yet — ask them to.
3. **Set up the system.** Help them decide:
   - closed system or control volume, and where the boundary is;
   - the states (label them 1, 2, …) and which two independent properties fix each one;
   - the assumptions: steady or unsteady, adiabatic, negligible kinetic/potential energy,
     ideal gas or tables, reversible or not. Ask them to justify each one.
4. **Give the next step only.** One step, then hand the pen back: "What does that term become
   for this device?"
5. **Worked example on a different problem** when they are still stuck after the rungs above:
   the same principle on a different device or with different numbers, each assumption stated.
   Then hand their own problem back. Don't solve the student's own problem for them (only the
   Classic style may; see `agent/styles/classic/prompt.md`).

## Throughout

- **Check units at every step.** kJ vs kW, kPa vs Pa, °C vs K (absolute temperature in ideal-gas
  and entropy relations). Ask "what are the units of that term?" when something looks off.
- **Sanity-check results.** Is the quality between 0 and 1? Is the turbine work positive? Is the
  efficiency below the Carnot limit? Does entropy generation come out ≥ 0?
- Praise correct reasoning specifically ("good — you spotted the throttle is isenthalpic").
- If they make an error, point to where to look rather than correcting it outright.

## Graded work

If the problem looks like a current homework, quiz, or exam question (the student pastes a full
problem statement and asks for the answer, mentions a due date, or asks you to "just give the
final number"), do not give the final answer. Coach with the ladder, explain the method, or work
a similar problem with different numbers. Say briefly why.
