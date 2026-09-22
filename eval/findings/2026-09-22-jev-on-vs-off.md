# What Jev changes: first comparison (2026-09-22)

Simulated students only, no real ones. 8 personas × 2 runs × 2 arms = 32 conversations and 144
tutor replies, from `npm run eval:compare -- --repeat 2`. The tutor was DeepSeek `deepseek-v4-pro`,
the simulated students were `deepseek-flash`, and Jev was `jev-1.13` via OpenRouter. The full
report with every transcript was saved to `data/eval-runs/2026-09-22T16-32-31/`, a folder git
ignores, so it exists only on the machine that ran the eval.

**Jev on** is the pipeline as built. **Jev off** is the same pipeline with the Settings switch off:
keyword rules stand in for Jev's read. Every reply in both arms was audited by the same Jev
questions, and the audit decides for itself whether the student had already finished an attempt.

## Results

| Check | Jev on | Jev off |
|---|---|---|
| Auto picked the expected style first | **12/12** | 4/12 |
| Read flagged the misconception the student actually held | 4/4 | n/a (keyword rules can't) |
| Read raised no misconception for the strong student (false-positive check) | 2/2 | n/a |
| Help ceiling stayed at rung 1 for the student who never does any work | 1/2 | 0/2 † |
| Practice session recorded results so mastery could be tracked | 2/2 | 0/2 (never reached Practice) |
| No final answer before a complete attempt | 16/16 | 16/16 |
| No key step handed over before a complete attempt | 3/4 | 3/4 |
| Tutor corrected the wrong belief (misconception personas) | 4/4 | 4/4 |
| Tutor didn't invent a misconception (strong student) | 2/2 | 2/2 |
| Quitter's problem was parked | 1/2 | 1/2 |

Jev cost for all 144 turns, reads and audits together: **$0.033**.

† The keyword rules counted "I have a turbine problem, 3 MPa…" as the student's own work. That
was fixed after this run, so the Jev-off arm will do somewhat better next time.

## What this does and doesn't show

- **Where Jev clearly helps: knowing what the student is doing.** With Jev, Auto sent the "just
  tell me" student to Work It Through, the exam-prep student to Practice and the teach-back student
  to Teach It Back every time. Without it, most of them landed in Office Hours or Check My Work.
  Everything that follows from the style, such as Practice's mastery tracking, happened only with
  Jev. Only Jev could name the misconception a student held; the tutor then corrected it in both
  arms.
- **Where it made no measurable difference: leaks.** Neither arm gave a final answer early. Key-step
  leaks happened in both, at about the same rate (7 and 6 of 72 replies). The server-set help
  ceiling doesn't stop the tutoring model from writing out an expression like "m = V/v₁" under
  pressure.
- **The key-step audit is noisy.** Of the 7 Jev-on key-step flags, reading the transcripts suggests
  only 2–3 are real. The rest were the tutor repeating the student's own line, writing out a
  general law, or working its own example. No auditor question has been checked against human
  labels. The research survey's advice applies: automate the easy checks, and have a person label
  a sample for the quality ones (finding 23).
- **A first version of this comparison was biased, and is superseded.** Its audit took "did the
  student finish?" from each arm's own read. The Jev-off arm couldn't see completed attempts, so
  correct confirmations were scored as leaks, and that run showed 0 leaks with Jev vs 10 without.
  Don't quote it.
- **Two runs per persona is small.** The simulated students are random. Treat differences of one or
  two checks as noise. Run `--repeat 5` or more before showing numbers to anyone outside the team.
- **This is not a learning result.** It measures whether the tutor behaves as designed with
  simulated students, and says nothing about whether real students learn more.
- **The "Jev off" arm uses our keyword rules, not the best possible alternative.** The fairer
  question for sponsors is whether Jev beats simply asking the tutoring model itself to make these
  judgments. That would be a third arm (an LLM classifier returning the same fields), and it hasn't
  been built yet.
