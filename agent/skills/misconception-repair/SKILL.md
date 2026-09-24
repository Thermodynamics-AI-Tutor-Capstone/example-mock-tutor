---
name: misconception-repair
description: The professor's surgical correction — confirm a suspected misconception with one question, then name it, repair it, re-test it on a new case, and hand the problem back; use whenever "This turn" says repair or confirm, or a student's answer shows a wrong belief.
---

# Misconception repair

> Starter draft written by an AI assistant for the capstone. Not reviewed by a thermodynamics instructor. Edit freely.

The goal is one belief corrected in about three turns, with the student doing the thinking. A lecture is the failure mode: expert tutors differ from novices by being *more interactive*, not by explaining more (research survey §I).

## If "This turn" says *confirm*
Several beliefs fit the student's words about equally well, or none fits strongly. **Don't teach yet and don't name any candidate to the student.** Ask ONE short question whose answer tells them apart. Use the separating question from the cards when "This turn" gives one. Otherwise pick a concrete situation where the candidates predict different things:
> "Quick one before we go on: across that insulated valve, does the temperature of the refrigerant change?"

Their answer decides it. If it confirms a belief, go to *repair*. If it rules them all out, drop it and ask what principle they were using.

## Repair: five moves, in order
1. **Quote the tell.** Hand their own words back: "You said 'it's insulated, so the entropy doesn't change.'" This shows exactly where the thinking turned.
2. **Name the belief in one sentence, without judgment.** "That treats *adiabatic* as if it meant *isentropic*. It's a very common one."
3. **Say why it feels right, in one sentence.** Name the grain of truth: "The heat term really is zero; it's the generation term that's easy to forget."
4. **Give the repair move from the card.** `open_card` the misconception. Its *Repair move* section is the one idea to teach, often a balance written with every term so that one term can be killed at a time. Two to four sentences at most.
5. **Re-test on a new case they must commit to.** Use the card's *isomorphic re-test*, or change the device or numbers. They answer before you say anything more. Never reuse a re-test they have already seen (in this chat or, per the student model, an earlier one): a repeated case measures recall, not understanding.

## After the re-test
- **They pass, for the right reason:** record `resolved_misconception` with `update_tutoring_state`, then hand back their own problem at the step where the belief bit: "Now redo your line 2 with that in mind." The final answer stays theirs.
- **They miss:** don't repeat the explanation louder. Give two contrasting cases side by side (one where the belief happens to hold, one where it doesn't) and ask what feature makes the difference.
- **Durable?** If this is the second time the belief has shown up (check "What Kelvin has inferred"), or it clearly shapes how they think, record it with `note_student_assumption`.

## Don't
- Don't repair more than one belief per turn, even if you see two. Take the earliest.
- Don't repair a belief the read flagged if the student's own words don't show it. The read is evidence, not a verdict.
- Don't correct beliefs that appear only in *your* messages (for example the planted error in Teach It Back) or in the problem statement.
