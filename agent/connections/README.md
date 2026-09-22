# Connections

Kelvin AI talks to three things. Their settings live in
[`connections.json`](connections.json), which the app reads on every request.

> [!CAUTION]
> **Never put an API key, password, or database URL in this folder.** This repository is public.
> Secrets live only in Vercel environment variables (or your local `.env` file, which git ignores).

## 1. Language models — named connections

`connections.json` holds a **named list** under `"connections"`. Each teaching style picks one by
name in its `style.yml` (see [`../styles/README.md`](../styles/README.md)); styles that don't name
one use `"default_connection"`.

| Connection | Model | Used by |
|---|---|---|
| `deepseek-pro` (default) | `deepseek-v4-pro` | every current style |
| `deepseek-flash` | `deepseek-flash` (cheaper, faster) | no style yet; the persona eval uses it to play the simulated students |

Each connection has:

| Setting | Notes |
|---|---|
| `provider` | Shown in error messages. |
| `baseUrl` | Any OpenAI-compatible chat-completions endpoint. For the default connection, the `DEEPSEEK_BASE_URL` env var overrides it. |
| `model` | For the default connection, the `DEEPSEEK_MODEL` env var overrides it. |
| `temperature` | `null` means "don't send one". A number such as `0.3` is sent as-is. |
| `apiKeyEnvVar` | The *name* of the env var holding the key, never the key. Must end in `_API_KEY`. |

`max_tool_rounds` at the top level is the default number of tool-call rounds per reply; a style can
override it.

**Where the key lives:** the Vercel environment variable `DEEPSEEK_API_KEY` on the live site; a
`DEEPSEEK_API_KEY=...` line in `.env` when running locally. Never in this repo.

## 1b. The decider — Jev

`decider` is the fast classifier that reads every student message before the tutor replies:
intent, own work shown, complete attempt, misconceptions, frustration, and which style fits. It
also audits every reply for answer leaks. It is **Jev** (TypeSafe's "System One" model), reached
through OpenRouter's `/api/v1/systemone` endpoint. Jev returns typed answers with calibrated
probabilities and generates no text. The research basis and what it decides are in
[`../styles/README.md`](../styles/README.md#what-happens-on-every-message).

| Key | Value |
|---|---|
| `provider` | Shown in logs and errors. |
| `baseUrl` | `https://openrouter.ai/api` (TypeSafe's own `https://api.typesafe.ai` takes the same requests). |
| `model` | `jev-1.13`, pinned so that a new Jev release can't silently change how students are read. Change it on purpose, then rerun `npm run eval:personas`. |
| `apiKeyEnvVar` | `OPENROUTER_API_KEY`. The key goes in `.env` locally and in Vercel's environment variables, never in this file. |
| `timeoutMs` | Per-attempt timeout. One retry on 429/5xx. |
| `enabled` | `false` turns Jev off; the tutor then uses a rough keyword check. |

**Without the key the tutor still works, but worse:** the keyword check counts visible work and
catches "just tell me" and "forget it". It gives no misconception read, never unlocks the contrast
rungs, and Auto keeps whatever style is running. `GET /api/health` reports `decider.problem` when
Jev is unavailable. Cost measured on 2026-09-22: about $0.0004 per student message (read plus
audit).

The same fallback runs when a student turns **Use Jev** off in Settings, which is a testing switch
for comparing the two (see [`../README.md`](../README.md#with-and-without-jev)). `enabled: false`
here turns Jev off for everyone; the Settings switch turns it off for one account.

## 2. Chat history — Postgres

| Setting | Value |
|---|---|
| `provider` | Postgres (Neon on Vercel, embedded PGlite locally) |
| `urlEnvVar` | `DATABASE_URL` |

On Vercel, the database is Neon Postgres, added through the Vercel Marketplace on Neon's free plan,
which sets `DATABASE_URL` for the project. Locally, with no `DATABASE_URL`, the app uses an embedded
database in `data/pglite/`. Only the final text of each reply is saved.

## 3. Course materials — the knowledge folder

| Setting | Value |
|---|---|
| `folder` | `agent/raw-course-files` |
| `tools` | `list_course_files`, `search_course_files`, `read_course_file` |

Files dropped into [`agent/raw-course-files/`](../raw-course-files/README.md) are turned into a searchable index
when the site is built. The model uses the three tools to list, search, and read them. The tools
are left out automatically when the folder has no usable files.

Skills work the same way: `skills.folder` is [`agent/skills`](../skills/README.md) and the model
loads one with the `load_skill` tool.

> [!IMPORTANT]
> **What leaves our servers:** every chat message, and any course-material text the model searches
> or reads, is sent to DeepSeek's API to generate the reply. Don't add material that must not be
> shared with a third-party AI provider.

## What is safe to edit here

- **Safe:** `model`, `temperature`, `max_tool_rounds`, and adding a new connection for any
  OpenAI-compatible provider (then set its key as a Vercel env var and point a style at it).
- **Leave alone:** `apiKeyEnvVar`. The app reads the key from the env var it names, so changing it
  means the Vercel env var must be renamed too. It must end in `_API_KEY`, or the app ignores it and
  uses `DEEPSEEK_API_KEY`.
- **Descriptive only:** `provider`, `folder`, `tools`, `tool`, `urlEnvVar`. They document what the
  code does; editing them does not change the app. Moving the knowledge or skills folder, or the
  database variable, needs a code change.
- **Never:** secrets of any kind.

Changes to this file reach the live site on the next deploy.

## Adding a new connection

- **A different model provider** that speaks the OpenAI chat-completions format: config only. Add a
  named connection here with its own `apiKeyEnvVar`, add that key in Vercel, and name the connection
  in a style's `style.yml`. If the key is missing, that style shows as unavailable in the picker.
- **A different kind of service** (Canvas, a property library, another API): a new tool. See
  [`../tools/README.md`](../tools/README.md): a definition in `agent/tools/` (with the keys it needs
  under `requires.env`) plus its code in `lib/tools/`, then list the tool in the styles that may
  use it.
