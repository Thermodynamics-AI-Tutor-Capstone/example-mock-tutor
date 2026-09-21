# Kelvin AI — agent configuration

**Start here.** Everything that defines how Kelvin AI behaves lives in this folder, and all of it
can be edited in GitHub's web editor (open a file → pencil icon → **Commit changes**).

| Piece | File / folder | Edit this to… |
|---|---|---|
| Shared core | [`system-prompt.md`](system-prompt.md) | change the ground rules every teaching style follows |
| Teaching styles | [`styles/`](styles/README.md) | change how a style teaches, which model, tools and skills it gets, or add a new style to the picker |
| Skills | [`skills/`](skills/README.md) | add or change focused instruction modules the tutor loads when needed |
| Connections | [`connections/`](connections/README.md) | change the AI model and its settings; see what services the tutor uses |
| Course materials | [`knowledge/`](knowledge/README.md) | give the tutor course files to read — drag and drop them here |
| Knowledge brain | [`kb/`](kb/README.md) | correct what the tutor believes about the course — units, topics, equations, misconceptions, notation |

```
agent/
├── README.md               ← you are here
├── system-prompt.md        ← how the tutor behaves
├── connections/
│   ├── connections.json    ← model, database, and tool settings
│   └── README.md
├── skills/
│   ├── README.md           ← how to write a skill (with template)
│   └── <skill-name>/SKILL.md
├── knowledge/              ← drop course files here (raw uploads, humans only)
│   ├── README.md
│   ├── syllabus/
│   ├── lectures/
│   ├── assignments/
│   ├── reference/
│   └── other/
└── kb/                     ← the knowledge brain: reviewable cards about the course
    ├── README.md           ← how the brain works, and how to correct a card
    ├── INDEX.md            ← the map the tutor sees in every message (2,000-token cap)
    ├── taxonomy.yml        ← the course spine: 5 units, 44 lecture rows, allowed values
    ├── symbols.md          ← the authoritative ME 300 nomenclature table
    ├── course/             ← the course card
    ├── units/              ← one card per exam block
    └── misconceptions/     ← wrong beliefs, how to spot them, how to repair them
```

Folders for topic, equation, worked-example, assessment-item and source cards appear in `kb/`
when the first card of that kind is written. None exist yet, because no course files have been
uploaded.

## How the pieces fit together

On every message, the app sends the model:

1. the text of `system-prompt.md`,
2. an automatically generated list of skills (name + description), a summary of the course
   materials, and the knowledge map rendered from [`kb/INDEX.md`](kb/INDEX.md), and
3. tools that let it search course files and cards, open a card, list a card's siblings, read a
   course file, and load a skill.

You never need to list skills, files or cards in the system prompt by hand.

### Two folders, two jobs

`knowledge/` and `kb/` are easy to confuse, so:

- **[`knowledge/`](knowledge/README.md) is the raw material.** Whatever the instructor gives
  you — slides, handouts, the syllabus — goes in as-is. Humans upload here; nothing writes to it
  automatically.
- **[`kb/`](kb/README.md) is what the tutor understands.** Short markdown cards, one idea each,
  with a citation back to the file and page they came from. Cards are drafted from the raw files
  by an AI pipeline that opens a pull request, and corrected by humans editing them directly.
  **A human edit is never overwritten** — see the no-clobber rule in
  [`kb/README.md`](kb/README.md).

Both are compiled into one `build/knowledge-index.json` at deploy time by a script that makes no
AI calls at all, so a redeploy is deterministic and needs no API key.

> **Nothing here has been exercised on real ME 300 material.** `agent/knowledge/` currently holds
> only README files, so there are no topic, equation or worked-example cards and no search
> results to judge. The cards that do exist were hand-written; see
> [`kb/README.md`](kb/README.md) for what their `status` values claim and do not claim.

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
- **Live site:** `GET /api/knowledge` (passcode required) returns the same list.
  `GET /api/health` shows counts of skills, indexed files, and skipped files.
- **Cards:** `GET /api/kb` (passcode required) returns the always-in-prompt map and every
  student-visible card; `GET /api/kb/card?id=unit:u4-control-volumes-and-second-law` returns one
  card with its links and sources.
