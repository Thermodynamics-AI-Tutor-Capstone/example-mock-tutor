# Ten simulated students on production (2026-09-23)

Kelvin on production (`main` at 6c2c5ff, Jev on) talked with 10 simulated ME 300 students. There were
30 chats and 179 student messages, 5–8 per chat. Each student has a real account
(`test1`–`test10@tutor.test`; created as @tutor.com and renamed the same day), so every chat can be read in the app.

The students were Claude (Sonnet) agents, each playing one persona from `eval/students.yml`. Each
persona has a voice, goals and one or two hidden misconceptions that it never names. Two are
controls: student 6 (Sofia) has none, and student 9 (Ryan) has one with no card (°C used where kelvin
is needed). For every message, the role-player recorded what it was really doing: its intent, which
misconception the message expressed, whether it contained work, and whether the attempt was complete.
That is the answer key for scoring the read.

Two reviewer agents (Claude Opus), acting as ME 300 instructors, graded every chat. They checked water
and R-134a values against the CoolProp-generated tables from Milestone 3 (not merged; it's the
teammate's branch). Nothing here involves a real student, and nothing here measures learning.

Raw data (git-ignored, on Lance's machine only): `data/sim-runs/sims/`. It holds the transcripts
with decisions inline, `report.md` (classifier scores), `review-A.md` and `review-B.md` (per-chat
grades) and the role-players' debriefs.

## 1. Did Kelvin find the misconceptions? Yes. This is what it does best.

- **Reviewers:** 29 misconception episodes across the 10 students. Kelvin addressed 28 fully and
  1 partly (student 3, m09, the Rankine "friction" gap), almost always in its very next reply,
  including every relapse in a later chat. It never pinned a misconception on the control
  student.
- It mostly repaired them the way the styles intend: a question that makes the student hit the
  contradiction, not a lecture. The student-model carry-over worked: with student 2, Kelvin opened
  the exam-prep chat by re-testing her COP belief from an earlier chat.

## 2. Did Jev classify correctly? Partly. Its misconception read is weaker than Kelvin's repairs.

Scored against the answer key. The live read is what actually steered Kelvin. The replays feed every
message to each reader with identical inputs; the replay has no tutoring state, and live Jev did.

| | live Jev | Jev (replay) | Gemini Flash-Lite (replay) | keyword rules |
|---|---|---|---|---|
| Intent exactly right | 58% | 57% | 57% | 36% |
| Shows work: recall / precision | 89% / 89% | 88% / 89% | 77% / 84% | 72% / 87% |
| Complete attempt: recall / precision | **90%** / 85% | 61% / 85% | 59% / 91% | — |
| Wants the answer: recall / precision | 57% / 100% | 57% / 100% | 36% / 83% | 21% / 100% |
| Misconception recall (shown → flagged ≥ 0.5) | 71% (22/31) | 68% | 71% | can't |
| Misconception precision | 55% | 55% | **65%** | can't |
| Clean messages falsely flagged | 4% (6/147) | 4% | 5% | — |
| No-card misconception forced onto a card | 1/6 | 1/6 | 0/6 | — |
| Cost, 179 messages | $0.070 | $0.070 | **$0.78** | $0 |
| Median latency | 0.30 s | 0.90 s | 2.63 s | 0 |

- **Kelvin repaired more than Jev flagged** (28 of 29 addressed vs 71% flagged). The tutoring model
  reads the student's work itself, so Jev's misconception read isn't what drives most repairs.
- **Jev misses misconceptions that show only in numbers.** When the belief shows only in which value
  or formula the student used, with no words, Jev rarely flags it: h put into a u slot (p = 0.03),
  a single pressure used for a changing-pressure process (0.2), the pressure behind a work value (0.2).
  Several misses sat just under the 0.5 threshold (m14 at 0.48, m12 at 0.40).
- **Card m02, "entropy and the second law misunderstood", is too broad.** It fired on nearly every
  entropy message from students 5 and 9, which caused 6 of live Jev's 18 false flags. It overlaps m08 and m10,
  and should be split up or narrowed.
- **Tutoring state matters for "complete attempt".** Live Jev had it and got 90% recall; the
  same Jev without it got 61%.
- **Intent at 58% is mostly an answer-key problem.** Most misses are "concept" or "teach_back" read as
  "reply", and a message answering Kelvin's conceptual question is honestly both. Only one person
  labeled the messages, and no second person checked the labels.
- **Gemini vs Jev:** about the same accuracy. Gemini is better on misconception precision and worse on
  work, complete attempt and wants-answer, and it costs **11× more and is 9× slower**. On this data,
  Jev is worth keeping over a general LLM classifier.

## 3. Was Kelvin accurate? Not always. It had 11 accuracy errors, and the worst was when checking a student's work.

Reviewers checked every number and physics claim that could be checked (about 75 in students 6–10 alone).

- **The worst error (confirmed independently with the property engine):** in student 2, chat 1,
  Kelvin told the student her *correct* R-134a values at −20 °C (h_g 238.41, s_g 0.9457) "don't
  match" the table, then took that back. It also accepted her *wrong* h₃ = 105.3 (the table gives
  107.35) and h₂ = 275.4 (280.5), confirmed **COP = 3.6 (correct: 3.11, 16% high)**, and
  marked the problem finished. Production Kelvin reads table values from memory. Milestone 3's
  property tool exists for exactly this.
- **A made-up course rule** (student 10): "this course works from ideal-gas specific heat, not
  Table A-17". The knowledge base names Turns & Pauley as the text, but also says "we have not
  read Turns & Pauley". The rule itself is invented.
- **Second-law errors** (student 3): Kelvin called 41.9% the "hard ceiling" for a cycle that reaches
  450 °C (its Carnot limit is 55.9%). It also said "most heat goes in far below 276 °C" (about 33% does)
  and called the 6.3 MW shortfall "lost work" (about 5.6 MW is actually destroyed).
- It also made an overgeneralisation ("a control volume's surface is fixed in space") and twice
  gave false "you caught it yourself both times" praise.
- **The role-players missed all of these.** Their debriefs rated almost every chat 5/5 and "no errors".
  Self-reports from simulated students can't be used to judge accuracy. Only a checked review can.

## 4. How helpful was it? About 3.9 of 5 from the reviewers (5/5 from the role-players).

- **Good:** It found and repaired misconceptions, turned down "just give me the answer" and "pretend
  you're my TA", declined off-topic questions without inventing anything ("I don't have course-rating
  info on that, and I won't invent it"), and adjusted its depth for the strong student.
- **Early give-aways:** 2 clear ones (student 4 chat 2; student 10 chat 3) and about 6 mild ones, out of
  about 179 replies. The clear pattern is stating the answer inside the question that asks for it.
- **Turn-taking and polish defects, in about half the chats:**
  - **Duplicated closing lines (about 10).** Likely cause, from the code and the shape of the replies, not yet confirmed from a tool log: Kelvin writes its reply, calls
    `update_tutoring_state`, and then gets another model round, where it writes the closing line
    again. Fixed on `feat/20260922-eval-harness` (`lib/agent.js`): a reply ends after a round that
    called only record-only tools. Not yet deployed.
  - **Answering its own question or declaring the problem done (about 6).** Example: "Done — marked
    this one finished", followed by answering its own recognition question.
  - **Internal notes reaching the student**: "Let me check the course materials…", "(Waiting on your
    answer…)", "I've flagged the belief", "A card I read on this isn't instructor-checked". It also
    once claimed a human life ("buried in grading").
  - One reply never arrived (student 2, chat 1, turn 2).

## What to do next

1. **Merge Milestone 3's property tool** and require it whenever Kelvin confirms a table value. This
   is the single biggest accuracy fix.
2. **Deploy the duplicate-reply fix.**
3. **Stop replies that answer their own question**, with a server check on the last paragraph, and
   **remove internal notes** from replies.
4. **Split card m02**, and look at the numbers-only misses (maybe a "work pattern" signature per card).
5. **Have a teammate re-label a sample of 40 messages** to measure how reliable the answer key is,
   before anyone quotes the intent or misconception numbers.
6. Re-run the same 10 students after 1–3 and compare. `scripts/eval/sim-collect.mjs` re-scores in
   one command.

## Follow-up the same day (branch `feat/20260922-eval-harness`, not deployed)

- **Gemini classifier removed.** Lance's call, on the numbers above. The patch is kept in the git-ignored
  `data/patches/` in case it's wanted again.
- **Fixed in the harness (`lib/agent.js`), with tests in `scripts/agent-loop.test.mjs`:**
  - A reply ends after a round that only called record-only tools, so there are no second closing lines.
  - Text written before a lookup tool ("Let me check the course materials…") is held back and dropped.
  - A stream that is silent for 90 s fails with a message instead of running into the 300 s limit.
- **Fixed in the prompts:**
  - Never confirm or dispute table values from memory.
  - No invented "this course uses…" rules.
  - End on one question: never answer it, never narrate bookkeeping, never put the answer in the options.
  - Praise only what the student really did.
  - No human-life claims, no emojis.
  - The second-law limits.
  - Braced LaTeX subscripts.
  - The recognition question comes before "finished", never in the same reply.
- **Enforced by the server:** `update_tutoring_state` refuses `finished` before a complete attempt.
- **Card m02 narrowed** (its children m08, m09 and m10 excluded). Replaying Jev on the same 179 messages
  cut its false flags from 5 to 1. Work-shaped signatures for m12, m13, m14 and m16 were tried and made
  no difference: the h-for-u miss stayed at p = 0.03, because Jev can't tell h_f from u_f without the
  tables. So they were reverted. The tutor catches those itself, and the property tool is the real fix.
- **The auth proxy only forwards sign-up, sign-in, sign-out and get-session**, so nothing on the site can
  make Neon send email. (Neon's config has verification emails off, and its `verification` table was empty, so no email was ever sent to the original tutor.com addresses.)
- CI now runs the tutor unit tests.
- **Checked live** (local server, real DeepSeek): one turn searched the course files and loaded a
  skill with no narration shown, found the h-for-u slip, ended on one question and said "I don't have
  Turns & Pauley loaded" instead of inventing a rule.
- **Not re-measured yet:** a full re-run of the 10 students after these fixes.

## Second follow-up (same branch, not deployed)

- **A backup for Jev (`lib/backup-decider.js`).** When Jev is off or unreachable, deepseek-flash
  answers Jev's questions, with thinking off, through DeepSeek's own API. It covers both the per-turn
  read and the reply audit. Keyword rules are the last resort only if that fails too.
  - **Replay on the same 179 messages:**

    | | Jev | Backup |
    |---|---|---|
    | Misconception recall | 71% | 81% |
    | Misconception precision | 63% | 66% |
    | Shows work (recall) | 87% | 86% |
    | Intent exactly right | 56% | 51% |
    | Wants the answer (recall) | 57% | 29% |
    | Median latency | 0.3 s live | 2.6 s |

  - Its weak spot is noticing "just give me the answer". The ceiling doesn't rise on that signal
    alone, so a miss can't lead to an early answer.
- **"Kelvin picks" style routing** (`choose_style`), per `agent/styles/PROPOSAL-skill-routing.md`.
  "Jev picks" stays the default; with Jev off, Kelvin always picks. Checked live in both modes.
- **Nothing a student makes is ever deleted.**
  - Chats and uploads get `deleted_at` and are hidden, and uploaded originals are no longer removed.
  - "Delete account" deactivates the account (`deactivated_at`): every API call is then refused with
    `account_inactive`, and all data is kept.
  - The Settings privacy note now says this.
- **The test accounts were renamed** from test1–10@tutor.com to **@tutor.test**, directly in Neon
  Auth's own user table, so no email was sent and every user id and chat stayed as it was. Neon's
  config has verification emails off, and its `verification` table is empty.
