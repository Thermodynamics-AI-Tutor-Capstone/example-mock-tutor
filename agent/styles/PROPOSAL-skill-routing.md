# Skill routing: letting the tutor pick its own teaching style ("skills pick")

Status: **built on `feat/20260922-eval-harness`, not yet deployed** (2026-09-23). Lance's decisions:
- Jev handles as much as it can whenever it is on.
- New accounts default to "Jev picks".
- Students don't see why the style changed.
- With Jev off, Kelvin always picks, and a DeepSeek backup (`lib/backup-decider.js`) does Jev's reads and audits.

**What differs from the draft below:**
- In "Kelvin picks", the chat opens in the style that matches the read's intent (the `route_when.intents`
  fallback). Kelvin changes it with `choose_style` when it disagrees.
- The mid-problem guard refuses a switch when the read says the student is replying within the
  exchange (intent `reply`) on a problem in progress, unless the read sees a new problem (≥ 0.7).
- Only `leave_when` was added; `use_for` already covers what `signals` was meant to.
- After `choose_style`, the server rebuilds the system prompt around the new style (its playbook,
  skills and tools) instead of pasting the playbook into the tool result.

## The problem

In Auto, Jev picks the style for each message by answering one multiple-choice question over each
style's `route_when` text. The ten simulated students (`eval/findings/2026-09-23-simulated-students.md`)
showed this is the weakest thing Jev does:

| What the student was doing (answer key) | Where Jev sent them |
|---|---|
| Asking a concept question (45) | Office Hours 17, **Check My Work 15**, Concept Check 9, Work It Through 4 |
| Explaining an idea back (19) | Office Hours 10, **Teach It Back only 5**, Check My Work 4 |
| Asking for practice (8) | **Practice 3**, Office Hours 3, Check My Work 2 |

- There were 20 style changes across 30 chats. One of them dropped a teach-back halfway through.
- Jev sees only the last message and a short window. It can't see what the student is trying to get
  done over the conversation.
- It has one probability per style and nothing that says why.

## Two options for the student (Settings → "Who picks the teaching style")

| | **Jev picks** (today) | **Skills pick** (new) |
|---|---|---|
| Who decides | Jev, from `route_when`, before the tutor runs | The tutoring model itself, from a short index of styles, while it writes the reply |
| What it sees | The last message plus 6 recent turns | The whole conversation, the student model, the tutoring state |
| Extra cost | None: it rides on the existing Jev read | One extra model round when it switches (about 2–5 s on deepseek-v4-pro) |
| Can be argued with | No | Yes. That's why the help ceiling stays with the server (below) |

A student who pins a style still gets that style in both modes, as today.

## How "skills pick" works

The idea is the same one `agent/skills/` already uses for teaching moves, **progressive
disclosure**, applied one level up to the styles themselves:

1. **Every style becomes a skill with a front page.** Each `agent/styles/<id>/style.yml` already has
   `route_when` (`use_for`, `not_for`, `examples`). That stays the single source for both modes, plus
   two new fields:
   - `signals`: what in the conversation means "this style now". For example, Teach It Back: "the
     student offers to explain, or asks to be checked on their explanation".
   - `leave_when`: what means "switch out". For example, "a real misconception appears: repair it in
     Office Hours, then come back".

   Jev's style question is built from the same fields, so improving a description improves both modes.

2. **The system prompt carries an index, not seven playbooks.** A `## Teaching styles` block has one
   line per style (name, when to use it, when not to) and marks the style in force. Only the playbook
   (`prompt.md`) of the **current** style is in the prompt, as today.

3. **A new tool, `choose_style({ style, reason })`.** The model calls it before writing when the
   current style doesn't fit. On the first message of a chat it must call it.
   - The server checks the style is enabled and usable, and that the chat isn't pinned.
   - It saves `routedStyle`, logs `router: "skills"` and the reason in `turn_decisions`, and returns the
     new style's playbook as the tool result.
   - It swaps in that style's tool list for the rest of the reply.
   - The reply is written under the new playbook in the same turn. The student sees the style chip
     change, as today.

4. **Guardrails, enforced by the server.**
   - **At most one switch per student message.** A second call gets "already switched this turn".
   - **No switch mid-problem** unless Jev reads a new problem, or the student asked for a different
     kind of help. The tool refuses otherwise and says why, which stops the teach-back being dropped
     halfway.
   - **The style never changes the rules.** The help ceiling, attempt counting, "complete attempt" and
     the misconception plan stay with the server, from Jev's read, in both modes. A style's `max_rung`
     can only lower the ceiling. So a student who talks the model into a friendlier style still can't
     get the answer early.

5. **Logging.** Every turn logs who picked the style (`jev`, `skills` or `pinned`), the style, the
   reason and whether it was a switch, so the two modes can be compared from `turn_decisions` alone.

### What changes in the code

| File | Change |
|---|---|
| `agent/styles/*/style.yml` | add `signals`, `leave_when` |
| `agent/tools/choose_style.yml`, `lib/tools/choose_style.js` | the new tool (validation, guardrails, returns the playbook) |
| `lib/agent.js` | the style index in the prompt; reload the playbook and tool list after `choose_style` |
| `lib/turn.js`, `lib/policy.js` | in skills mode, skip Jev's style pick but keep the rest of the read; log `router` |
| `lib/auth.js`, `lib/db.js`, `public/settings.js` | profile field `style_router: 'jev' \| 'skills'` and the Settings switch |
| `scripts/validate-agent.mjs` | check every style has the new fields |
| `scripts/eval/*` | a `best_style` label in the answer key; a report on style fit |

## How we'd know which is better

Run the same 10 students twice in each mode (the chats aren't deterministic, so one run per mode is
an anecdote). Score:

1. **Style fit.** Each role-player also labels `best_style` for every message from the index. We add
   a second label from a reviewer on a sample, to measure how much they agree.
2. **Thrash.** Switches per chat, and switches that interrupt an unfinished teach-back or problem.
3. **The outcomes that matter:** misconceptions repaired, early give-aways, helpfulness (the same
   reviewer rubric as the 2026-09-23 run).
4. **Latency and cost** per turn.

"Skills pick" wins only if style fit and outcomes improve without more give-aways. The ceiling is
server-side, so in principle it can't loosen, and the eval checks that.

## Decisions for Lance

1. In "skills pick", keep Jev for everything except the style (ceiling, attempts, misconceptions)?
   **Recommended**: then the only thing the two modes differ in is who picks the style, which is what
   we want to measure.
2. Default for new accounts: stay on "Jev picks" until the comparison is in?
3. Should the student ever see why the style changed (one short line), or only the chip?
