# Adaptive tutoring beta

KELVIN selects a useful next teaching move from the student's current request,
problem context, recent dialogue, and evidence in their learning profile. Questions
can clarify the task, distinguish plausible learning needs, or support requested
practice. Clear needs receive direct explanations, hints, demonstrations, or feedback.

The classifier adds an optional `learning_need` choice to its existing request. The
server retains its alternatives in `read.learningNeed` and chooses a provisional move
in `lib/tutor-moves.js`. The 0.65 confidence cutoff is an initial routing heuristic,
not a calibrated probability of ability or a student grade. Missing, malformed, or
uncertain classifications fall back to useful help. Existing classifier responses
without this field remain supported.

| Situation | Next move |
| --- | --- |
| A missing condition changes the physical answer | Ask one focused clarification; explain the conditional setup |
| A fact or convention is requested | Answer directly using the appropriate tool |
| A student requests a walkthrough or stalls | Demonstrate a useful next step and change approach |
| Competing readings of their reasoning need different support | Ask one distinguishing question |
| A concept or prerequisite is missing | Explain meaning with a concrete example |
| A hint is requested | Give a targeted cue |
| Their own work is supplied | Give specific, verified feedback |
| They choose a self-check | Offer one relevant prompt and wait; help remains available |

The prompt can reconcile the provisional choice with the actual conversation. No
choice itself writes learner evidence, diagnoses a misconception, or grants mastery.
Only observations of the student's own reasoning should update the existing evidence
ledger. Record the source, topic, assistance, and uncertainty; a guided solution,
copied explanation, or acknowledgement is not independent application.

## Interpreting the learner profile

The profile uses complementary knowledge dimensions: situational (recognizing
conditions), conceptual (explaining meaning), procedural (carrying out steps), and
strategic (planning and monitoring). Unknown evidence stays unknown. Verbal/pictorial
and general/domain-specific describe representation and scope, not ability rankings.
Observations describe a topic and task; they are not permanent personality labels.

This beta follows the faculty slide deck's distinction between published frameworks
and proposed tutoring mappings. The routing rules are our implementation choices,
not an automatic classifier supplied or validated by the cited researchers:

- [Perkins and Simmons (1988), Patterns of Misunderstanding](https://doi.org/10.3102/00346543058003303)
- [de Jong and Ferguson-Hessler (1996), Types and Qualities of Knowledge](https://doi.org/10.1207/s15326985ep3102_2)
- [Chi (2013), Two Kinds and Four Sub-types of Misconceived Knowledge](https://education.asu.edu/sites/default/files/lcl/ihrcc-vosniadou2013-chapter3-chi_1.pdf)

## Validation

`npm run guided:test` checks the routing priorities, repeated-request recovery,
uncertain and unavailable classifier responses, backward compatibility, and absence
of invented evidence. The normal tutor tests check the existing classifier and policy
contract. These are software checks, not proof of teaching effectiveness.

For the beta study, have instructors review short dialogues for appropriate support,
unnecessary questioning, supported profile observations, and opportunities for
independent application. Evaluate later transfer separately from satisfaction or
successful completion with help.
