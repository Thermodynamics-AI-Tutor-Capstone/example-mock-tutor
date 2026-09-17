# Kelvin AI — agent configuration

**Start here.** Everything that defines how Kelvin AI behaves lives in this folder, and all of it
can be edited in GitHub's web editor (open a file → pencil icon → **Commit changes**).

| Piece | File / folder | Edit this to… |
|---|---|---|
| System prompt | [`system-prompt.md`](system-prompt.md) | change the tutor's personality, teaching style, and ground rules |
| Skills | [`skills/`](skills/README.md) | add or change focused instruction modules the tutor loads when needed |
| Connections | [`connections/`](connections/README.md) | change the AI model and its settings; see what services the tutor uses |
| Course materials | [`knowledge/`](knowledge/README.md) | give the tutor course files to read — drag and drop them here |

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
└── knowledge/              ← drop course files here
    ├── README.md
    ├── syllabus/
    ├── lectures/
    ├── assignments/
    ├── reference/
    └── other/
```

## How the pieces fit together

On every message, the app sends the model:

1. the text of `system-prompt.md`,
2. an automatically generated list of skills (name + description) and a summary of the course
   materials, and
3. tools that let it search and read course files and load a skill.

You never need to list skills or files in the system prompt by hand.

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
