# Skills

A **skill** is an instruction module Kelvin AI loads only when it needs it. The tutor always sees
each skill's one-line `description`; when a conversation matches, it calls the `load_skill` tool
to read the full instructions. This keeps the main [system prompt](../system-prompt.md) short.

## Current skills

| Skill | Used for |
|---|---|
| [`socratic-coaching`](socratic-coaching/SKILL.md) | Hint ladder for working through a problem without handing out the answer |
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
