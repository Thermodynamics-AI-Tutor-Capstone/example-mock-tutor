# Teaching styles

A **style** is one way Kelvin can teach. By default students don't pick one: **Auto** picks it
on every message, from what the student is doing. The **Kelvin AI ▾** menu still lets someone pin a
style, which is mainly for the team to test one. A style is a **bundle**, not just a prompt: each
one chooses its own model connection, tools, skills and the highest help rung it may reach.

```
agent/styles/<id>/
  style.yml   what the style is allowed to use, and when Auto should pick it (route_when)
  prompt.md   how it teaches, added after the shared core in ../system-prompt.md
```

Every style inherits the **shared core** in [`../system-prompt.md`](../system-prompt.md): never hand
over the solution before a complete attempt, stay under the help ceiling, don't let the student quit
with your answer, read the student like a professor, diagnose the earliest error, take assumptions
from the problem text, match the move to the kind of knowledge, and ask for the why. The styles differ
in *pedagogy*, not in basic competence, and none of them can go past the limits below.

## What happens on every message

```
student message ─▶ Jev reads it ─▶ Auto picks the style ─▶ the policy sets the help ceiling ─▶ the tutor replies ─▶ Jev audits the reply
                   (lib/decide.js)  (route_when, below)    (../policy.yml, lib/policy.js)     (this style)          (logged; lib/turn.js)
```

1. **Jev reads the message** in one call of about 0.2–0.6 s. It works out what the student is doing,
   whether the message contains their own work, whether they have a complete attempt, which
   misconception cards their words fit (with probabilities), whether they want the answer or are
   giving up, how frustrated they sound, and which style fits. Jev is TypeSafe's "System One" model,
   reached through OpenRouter (`OPENROUTER_API_KEY`). It returns probabilities, never text, so it
   can't be talked into anything. Without a key, or when a student turns **Use Jev** off in
   Settings (a testing switch; see [`../README.md`](../README.md#with-and-without-jev)), a rough
   keyword check stands in, and the misconception read and the contrast rungs are unavailable.
2. **Auto routing.** Jev picks the style from each style's `route_when`. The code keeps the current
   style while the student is replying within the same exchange, and switches only on a new problem
   or a confident pick (`thresholds.style_switch`). A pinned style skips this step.
3. **The policy** (`../policy.yml`, enforced in `lib/policy.js`) sets the **help ceiling**. The
   ceiling rises with the student's *own work*, never with asking. The contrast rungs stay locked
   until the student has a complete attempt. The policy also turns Jev's misconception read into
   *repair* (one clear signal) or *confirm first* (several candidates close together, or a medium
   signal). The tutor sees all of this under "## This turn" and cannot change it.
4. **After the reply**, strong misconception signals go into the student's long-term model
   (`lib/student-model.js`). Jev audits the reply for answer leaks. Every decision is logged in
   `turn_decisions`, readable at `GET /api/conversations/:id/decisions`.

## The styles

| Style | Auto picks it when… | What the student experiences | What it bets on | Not yet known |
|---|---|---|---|---|
| 🧑‍🏫 **Office Hours** (`office-hours`, the default) | they talk through their own thinking, or the request is mixed or unclear | A professor who hears how they talk about the problem, names the one belief that's tripping them up, repairs just that, re-tests it, and hands the problem back. | AutoTutor's pattern of matching the student's words against a catalogue of known wrong beliefs (survey §I), with detection done by Jev rather than the tutoring model, since models can't reliably label wrong steps (finding 19). | Whether Jev's read holds up on real student phrasing: calibrated on 11 hand-written messages so far, never on real students. VanLehn lists diagnosis as a *dead* explanation of why tutoring works, so this style still has to get the student to finish. |
| ✅ **Check My Work** (`pinpointer`) | they share their own worked solution | A TA's verdict on the earliest wrong line or assumption, one error per turn. | Students reliably use "evaluate my work" and rarely use hints (finding 12). Learning comes from finishing a solution they generated (finding 3). | Verdicts on *numbers* are unverified until a property/verification tool exists. |
| 🪜 **Work It Through** (`work-it-through`) | they're stuck, haven't started, ask what to do next, or ask for the answer | They write every step of the ME 300 format; Kelvin won't move past a step they haven't produced, and answers "what next" with strategy, not the step. | Completion with self-generated reasoning (finding 3), step-based interaction (§I), and designing for the defection (finding 15). | Whether students tolerate step-gating under deadline pressure, or leave for ChatGPT. |
| 🔍 **Concept Check** (`probe`) | they ask about an idea, not a specific problem | They commit to a prediction or a pick before anything is explained; only what their answer shows gets repaired, then re-tested. | Productive failure: commit before being told, and never be shown a wrong answer instead of producing one (§V). | Whether students tolerate being quizzed before being helped. |
| 🧑‍🎓 **Teach It Back** (`teach-kelvin`) | they ask to explain something back, or to play the game | They teach Kelvin; Kelvin applies only what they taught to a new case and fails where their explanation is incomplete. | Learning by teaching (Betty's Brain, §I, §V), with required reflection prompts. The old find-the-planted-error mode is now opt-in, because studying failed solutions instead of producing one lost badly (PF > VF, d = 1.35). | Whether DeepSeek can apply *only* the student's explanation without drifting to the right answer. |
| 🔁 **Practice** (`practice`) | they want practice, a quiz or exam prep | One problem at a time aimed at what they haven't mastered, an attempt on their own first, feedback after, and mastery tracked in code. | Mastery learning (~1.0 SD with no tutor in Bloom's own data; no LLM tutor uses it, §I) and retrieval practice for facts (KLI). | Mastery uses textbook-default BKT parameters, **not fitted to any data**. The practice problems are generated and unverified. |
| 💬 Classic (`classic`, **disabled**) | never | The original Kelvin: hints, then a full worked solution. | It's the baseline. | Disabled because it hands over solutions. Re-enable only as a research comparison arm, never as a student-facing choice. |

**None of these is shown to improve learning.** They are bets to compare in D3 testing. The
survey's warning applies to all of them: in-the-moment satisfaction selects for answer-giving, so
judge them on unassisted outcomes, not on how students rate the chat (findings 5, 9 and 23).

Research references are to the capstone's survey,
[`knowledge/PAPER.md`](https://github.com/Thermodynamics-AI-Tutor-Capstone/thermo-tutor-research/blob/main/knowledge/PAPER.md).

## `style.yml`

| Key | Meaning |
|---|---|
| `id` | Lowercase-hyphenated; must match the folder name. `auto` is reserved. |
| `name`, `description`, `icon` | What the menu shows. Keep the description to one line. |
| `order` | Position in the menu (unique). |
| `connection` | A key in [`../connections/connections.json`](../connections/connections.json): which provider, model and API-key variable this style uses. |
| `tools` | `all`, or a list of tool names from [`../tools/`](../tools/README.md). Prefer an explicit list. |
| `skills` | `all`, or a list of skill names from [`../skills/`](../skills/README.md). |
| `max_tool_rounds` | How many rounds of tool calls per reply. |
| `state.help_ladder`, `state.max_rung` | Whether the conversation keeps tutoring state, and the highest rung of the shared ladder (`../policy.yml`) this style may ever reach. The server's per-turn ceiling is always at or below it. |
| `route_when.use_for` | **Required.** One or two sentences Jev reads to decide when this style fits. Say what the student is doing, not what the style does. |
| `route_when.not_for`, `route_when.examples` | Optional. Neighbouring situations that belong to another style, and a few example student messages. These help Jev tell similar styles apart. |
| `route_when.intents` | Optional. Intents (from `lib/decide.js`) this style serves when Jev has no style answer, e.g. `[check_work]`. |
| `ui.figures`, `ui.mermaid` | Include figure guidance and enable the figure-rendering experience for this style. |
| `enabled` | `false` hides the style from the menu *and* from Auto. |

If a style's connection has no API key set, or it lists a tool whose own key is missing, the menu
shows it as **unavailable, with the reason**, Auto never picks it, and the other styles keep
working.

## Adding or changing a style

1. Copy a folder, e.g. `pinpointer/` → `my-style/`, and change `id` to `my-style`.
2. Edit `style.yml` (including `route_when`) and `prompt.md`. Don't restate the help ladder in the
   prompt: the server adds it, with the current ceiling, under "## This turn".
3. Check it: `npm run agent:validate` (config) and `npm run agent:test` (policy and router).
4. Try it against simulated students: `npm run eval:personas`. It costs a few cents in API calls
   and needs no real students. Read the transcripts in the report, not just the ✅.

Adding a **tool** means code as well as a definition; see [`../tools/README.md`](../tools/README.md).
