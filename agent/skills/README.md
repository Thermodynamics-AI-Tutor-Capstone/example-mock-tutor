# Skills

A **skill** is an instruction module Kelvin AI loads only when it needs it. The tutor always sees
each skill's one-line `description`; when a conversation matches, it calls the `load_skill` tool
to read the full instructions. This keeps the main [system prompt](../system-prompt.md) short.

## Current skills

**Teaching moves**, shared by the styles so each move is defined once:

| Skill | Used for |
|---|---|
| [`misconception-repair`](misconception-repair/SKILL.md) | The professor's surgical correction: confirm with one question, then quote, name, repair, re-test, hand back |
| [`answer-requests`](answer-requests/SKILL.md) | "Just give me the answer": the most useful help the ceiling allows, with no refusal and no sermon |
| [`what-next`](what-next/SKILL.md) | "What do I do next?": strategy (which system, which balance, which unknown), never the step |
| [`worked-example-isomorph`](worked-example-isomorph/SKILL.md) | Rung 4: a worked example of a *different* problem that turns on the same move |
| [`contrast-and-redo`](contrast-and-redo/SKILL.md) | Rungs 5–6, only after a complete attempt: one of their steps beside the correct one |
| [`socratic-coaching`](socratic-coaching/SKILL.md) | The old hint ladder. Used only by the disabled Classic baseline; superseded by the four above and `agent/policy.yml` |

The help ladder itself, and the ceiling that limits it each turn, are not a skill. They live in
[`../policy.yml`](../policy.yml) and are enforced by the server (`lib/policy.js`).

**Thermodynamics procedures:**

| Skill | Used for |
|---|---|
| [`property-tables`](property-tables/SKILL.md) | Finding the phase and reading/interpolating property tables |
| [`control-volume-energy-balance`](control-volume-energy-balance/SKILL.md) | Setting up steady-flow energy balances for devices |

## Adding a skill

1. In this folder, click **Add file → Create new file**.
2. Name it `your-skill-name/SKILL.md` (typing the `/` creates the folder).
3. Paste the template below, fill it in, and **Commit changes**.

```markdown
---
name: your-skill-name
description: What this skill is, and when the tutor should use it.
---

# Your skill title

Starter draft — not yet reviewed by an instructor.

## When to use
- ...

## Steps
1. ...
```

## Rules

- The folder name and `name:` must match exactly.
- Names are lowercase words joined by hyphens: `rankine-cycle`, not `Rankine Cycle` or `rankine_cycle`.
- The file must be called `SKILL.md`, and the frontmatter must have exactly two lines between the
  `---` markers: `name:` and `description:`. The description is one line.

## Tips

- **The description decides when the skill gets used.** Say both what it covers and the situation
  that should trigger it ("Use when a student needs to…").
- Keep each skill focused on one job. Two small skills beat one long one.
- Keep the body short — it is added to the conversation every time the skill is loaded.
- Mark drafts that no instructor has checked, so nobody mistakes them for reviewed content.
