# Teaching styles

A **style** is one way Kelvin can teach. Students pick one from the **Kelvin AI ▾** menu at the
top of the chat, the way ChatGPT lets you pick a model. A style is a **bundle**, not just a
prompt: each one chooses its own model connection, tools, skills and tracked state.

```
agent/styles/<id>/
  style.yml   what the style is allowed to use
  prompt.md   how it teaches, added after the shared core in ../system-prompt.md
```

Every style inherits the **shared core** in [`../system-prompt.md`](../system-prompt.md): don't
hand over the student's solution, diagnose the earliest error before teaching, take assumptions
from the problem text, match the move to the kind of knowledge, and push for the why. The styles
differ in *pedagogy*, not in basic competence.

## The styles

| Style | What the student experiences | What it bets on | Not yet known |
|---|---|---|---|
| 💬 **Classic** (`classic`) | The original Kelvin: hints first, a full worked solution if they're still stuck. | Nothing new. It is the **baseline** the others are compared against. | — |
| 🎯 **Pinpointer** (`pinpointer`) | They show their work; Kelvin names the first wrong line or unjustified assumption and asks one question. Help climbs a ladder whose rung the server tracks. | Students reliably use "evaluate my work" and rarely use hints (survey, finding 12). Learning comes from finishing a solution they generated (finding 3). | Whether the model locates the *first* wrong step reliably. The survey reports no model beat chance at labelling wrong student steps (finding 19), so this style should get the property-checking tool before anyone trusts its verdicts on numbers. |
| 🔍 **Diagnose First** (`probe`) | One or two quick multiple-choice questions whose wrong answers each map to a known misconception; their pick is the diagnosis, then only that is repaired and re-tested. Includes predict-then-reveal for direction questions. | A closed question diagnoses more reliably than a model's reading of free text. Productive failure requires the student to commit before being told (survey §V). | Whether students tolerate being quizzed before being helped. Probes are written on the fly from the misconception cards, which no instructor has reviewed yet. |
| 🧑‍🎓 **Teach Kelvin** (`teach-kelvin`) | Kelvin plays a classmate with a plausible wrong idea; the student finds the flaw, fixes it, and watches Kelvin re-answer using only their explanation. | Learning by teaching, which the survey calls one of the most under-exploited ideas (§I, §V), paired with explicit metacognitive prompts. | Whether DeepSeek can hold a planted wrong model without drifting back to the right answer, and whether students find it useful or gimmicky. |

**None of these is shown to improve learning yet.** They are bets to compare in D3 testing, against
Classic. The survey's warning applies to all of them: in-the-moment satisfaction selects for
answer-giving, so judge them on unassisted outcomes, not on how students rate the chat
(findings 5, 9 and 23).

Reasoning references point to the capstone's research survey,
[`knowledge/PAPER.md`](https://github.com/Thermodynamics-AI-Tutor-Capstone/thermo-tutor-research/blob/main/knowledge/PAPER.md)
in the research repo.

## `style.yml`

| Key | Meaning |
|---|---|
| `id` | Lowercase-hyphenated; must match the folder name. |
| `name`, `description`, `icon` | What the picker shows. Keep the description to one line. |
| `order` | Position in the picker (unique). |
| `connection` | A key in [`../connections/connections.json`](../connections/connections.json): which provider, model and API-key variable this style uses. Add a new connection there to give a style a different model or provider. |
| `tools` | `all`, or a list of tool names from [`../tools/`](../tools/README.md), e.g. `search_course_files`, `open_card`, `update_tutoring_state`. Prefer an explicit list: with `all`, every tool added later is handed to the style automatically. |
| `skills` | `all`, or a list of skill names from [`../skills/`](../skills/README.md). |
| `max_tool_rounds` | How many rounds of tool calls per reply. |
| `state.help_ladder`, `state.max_rung` | When on, the server stores this conversation's help rung, attempts, diagnosed misconceptions and assumption ledger, and shows them to the model on every turn. The model updates them with `update_tutoring_state`. |
| `ui.figures`, `ui.mermaid` | Reserved for figure rendering (not built yet). |
| `enabled` | `false` hides the style from the picker. |

If a style's connection has no API key set, or it lists a tool whose own key is missing, it shows
in the picker as **unavailable, with the reason**, and the other styles keep working.

## Adding a style

1. Copy a folder, e.g. `pinpointer/` → `my-style/`, and change `id` to `my-style`.
2. Edit `style.yml` and `prompt.md`.
3. Check it: `npm run agent:validate`. The same check runs in GitHub Actions on every push and
   fails the build on an unknown connection, tool or skill.

Adding a **tool** means code as well as a definition; see [`../tools/README.md`](../tools/README.md).
