# Kelvin AI — agent configuration

**Start here.** Everything that defines how Kelvin AI behaves lives in this folder, and all of it
can be edited in GitHub's web editor (open a file → pencil icon → **Commit changes**).

| Piece | File / folder | Edit this to… |
|---|---|---|
| Shared core | [`system-prompt.md`](system-prompt.md) | change the ground rules every teaching style follows |
| Teaching styles | [`styles/`](styles/README.md) | change how a style teaches, when Auto picks it, which model, tools and skills it gets, or add a new style |
| Teaching policy | [`policy.yml`](policy.yml) | change the help ladder and the thresholds the server uses to set the help ceiling each turn: what counts as an attempt, when to repair or confirm a misconception, when to switch styles |
| Tools | [`tools/`](tools/README.md) | change what the model is told about each tool it can call, and when to use it |
| Student uploads | [`attachments/`](attachments/README.md) | change how students' photos and files are turned into Markdown: the transcription prompt, which model reads images, size limits |
| Skills | [`skills/`](skills/README.md) | add or change focused instruction modules the tutor loads when needed |
| Connections | [`connections/`](connections/README.md) | change the AI model and its settings, including the Jev decider (`decider`); see what services the tutor uses |
| Course materials | [`raw-course-files/`](raw-course-files/README.md) | give the tutor course files to read — drag and drop them here |
| Knowledge brain | [`knowledge-brain/`](knowledge-brain/README.md) | correct what the tutor believes about the course — units, topics, equations, misconceptions, notation |

```
agent/
├── README.md               ← you are here
├── system-prompt.md        ← how the tutor behaves
├── policy.yml              ← help ladder + the thresholds the server enforces each turn
├── connections/
│   ├── connections.json    ← model, database, and tool settings
│   └── README.md
├── skills/
│   ├── README.md           ← how to write a skill (with template)
│   └── <skill-name>/SKILL.md
├── raw-course-files/       ← drop course files here (raw uploads, humans only)
│   ├── README.md
│   ├── syllabus/
│   ├── lectures/
│   ├── assignments/
│   ├── reference/
│   └── other/
└── knowledge-brain/        ← the knowledge brain: reviewable cards about the course
    ├── README.md           ← how the brain works, and how to correct a card
    ├── INDEX.md            ← the map the tutor sees in every message (2,000-token cap)
    ├── taxonomy.yml        ← the course spine: 5 units, 44 lecture rows, allowed values
    ├── symbols.md          ← the authoritative ME 300 nomenclature table
    ├── course/             ← the course card
    ├── units/              ← one card per exam block
    └── misconceptions/     ← wrong beliefs, how to spot them, how to repair them
```

Folders for topic, equation, worked-example, assessment-item and source cards appear in `knowledge-brain/`
when the first card of that kind is written. None exist yet, because no course files have been
uploaded.

## How the pieces fit together

On every message, **before the tutoring model sees anything**, a fast classifier (Jev) reads the
student's message. The Auto router picks a style, and the policy in [`policy.yml`](policy.yml) sets
the help ceiling. See [`styles/README.md`](styles/README.md#what-happens-on-every-message). Then
the app sends the model:

1. the text of `system-prompt.md` and the chosen style's `prompt.md`,
2. an automatically generated list of skills (name + description), a summary of the course
   materials, and the knowledge map rendered from [`kb/INDEX.md`](knowledge-brain/INDEX.md),
3. "## This turn": the server-set help ceiling, Jev's read of the student (including any
   misconception to repair or confirm), and the conversation's tutoring state,
4. "## What Kelvin has inferred about this student": drafts from earlier sessions, built from an
   evidence log that is deleted along with the conversation it came from, and
5. tools that let it search course files and cards, open a card, read a course file, load a skill,
   record tutoring state, and record what it has learned about the student.

You never need to list skills, files or cards in the system prompt by hand.

### Two folders, two jobs

`raw-course-files/` and `knowledge-brain/` are easy to confuse, so:

- **[`raw-course-files/`](raw-course-files/README.md) is the raw material.** Whatever the instructor gives
  you — slides, handouts, the syllabus — goes in as-is. Humans upload here; nothing writes to it
  automatically.
- **[`knowledge-brain/`](knowledge-brain/README.md) is what the tutor understands.** Short markdown cards, one idea each,
  with a citation back to the file and page they came from. Cards are drafted from the raw files
  by an AI pipeline that opens a pull request, and corrected by humans editing them directly.
  **A human edit is never overwritten** — see the no-clobber rule in
  [`kb/README.md`](knowledge-brain/README.md).

Both are compiled into one `build/knowledge-index.json` at deploy time by a script that makes no
AI calls at all, so a redeploy is deterministic and needs no API key.

> **Nothing here has been exercised on real ME 300 material.** `agent/raw-course-files/` currently holds
> only README files, so there are no topic, equation or worked-example cards and no search
> results to judge. The cards that do exist were hand-written; see
> [`kb/README.md`](knowledge-brain/README.md) for what their `status` values claim and do not claim.

## Testing a change to how Kelvin teaches

- `npm run agent:validate`: styles, tools, skills and `policy.yml` are well formed.
- `npm run agent:test`: the policy, router and student model behave as specified (no network).
- `npm run eval:personas`: simulated students (a deadline-demander, a "what next" looper, a
  student holding a known misconception, a quitter, a strong student, and others; see
  [`../eval/personas.yml`](../eval/personas.yml)) are driven through the real pipeline against a
  throwaway local database. It costs a few cents and needs no real students or IRB. The report
  lands in `data/eval-runs/`. Its ✅ marks are automatic judgments, so read the transcripts.

## With and without Jev

Jev, the fast decision model (see [`styles/README.md`](styles/README.md#what-happens-on-every-message)),
can be switched off to show what it adds. With it off, the rest of the tutor still runs, and simple
keyword rules take its place. Those rules still count visible work toward the help ceiling and
still catch "just tell me" and "forget it", but they cannot read misconceptions, can't tell when an
attempt is complete (so the step-comparison rungs never open), and can't pick a style (Auto keeps
the current one).

**By hand, in the app:** Settings → Testing.
- **Use Jev** (on by default) switches it for that account, from the next message on.
- **Show Kelvin's decisions** prints what was decided above each reply: who decided it (⚡ Jev or
  ⌨ keyword rules), what the message looked like, the style, the help ceiling, and any
  misconception. This makes a sponsor demo easy: ask the same question with the switch on, then
  off, and compare.

With the switch off, the app makes **no** Jev calls at all, not even the after-reply audit, so
"off" really means off (Settings tells students their messages go to Jev only while it's on). Every
turn is logged in `turn_decisions`, with `policy.jevEnabled` recording which way it ran.
`GET /api/conversations/:id/decisions` returns the log for one conversation.

**Automatically, against simulated students:**
- `npm run eval:personas -- --jev off` runs the personas without Jev (`--jev on` is the default).
- `npm run eval:compare` runs both arms on the same personas and puts a side-by-side table at the top
  of the report: checks passed, answer leaks, key-step leaks, and replies that corrected a wrong
  belief. Add `--repeat 3` or more before showing the numbers to anyone, because the simulated
  students are random and one run per arm is an anecdote.

In the eval, both arms have every reply *audited* by Jev, so both are measured with the same
instrument. The audit judges for itself whether the student had already finished an attempt or asked
a fact question; it never uses the arm's own read, which would bias the comparison toward Jev. Checks
that measure Jev's own read (did it flag the misconception?) show as ➖ n/a without Jev and are left
out of the score.

## How changes reach the live site

- **Automatic:** a GitHub Action rebuilds the course-materials index and redeploys the site on
  every push to `main` — including commits made in GitHub's web UI. This only works once a
  `VERCEL_TOKEN` secret has been added to the repository (Settings → Secrets and variables →
  Actions).
- **Until that secret is set:** changes sit in GitHub but the live site does not update. Ask
  whoever manages the Vercel project to redeploy manually.

## Checking what the tutor actually indexed

- **GitHub:** Actions tab → latest deploy run → the run summary lists every indexed file and every
  skipped file with the reason (for example "no extractable text (scanned? needs OCR)").
- **Live site:** `GET /api/knowledge` (sign-in required) returns the same list.
  `GET /api/health` shows counts of skills, indexed files, and skipped files.
- **Cards:** `GET /api/kb` (sign-in required) returns the always-in-prompt map and every
  student-visible card; `GET /api/kb/card?id=unit:u4-control-volumes-and-second-law` returns one
  card with its links and sources.
