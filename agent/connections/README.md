# Connections

Kelvin AI talks to three things. Their settings live in
[`connections.json`](connections.json), which the app reads on every request.

> [!CAUTION]
> **Never put an API key, password, or database URL in this folder.** This repository is public.
> Secrets live only in Vercel environment variables (or your local `.env` file, which git ignores).

## 1. Language model — DeepSeek

| Setting | Value | Notes |
|---|---|---|
| `provider` | DeepSeek | Informational. |
| `baseUrl` | `https://api.deepseek.com` | The `DEEPSEEK_BASE_URL` env var overrides this. |
| `model` | `deepseek-v4-pro` | The `DEEPSEEK_MODEL` env var overrides this. |
| `temperature` | `null` | `null` means "don't send one" (DeepSeek's default). A number such as `0.3` is sent as-is. |
| `maxToolRounds` | `6` | How many rounds of tool calls (searching or reading files, loading skills) the model gets per reply before it must answer. One round can contain several calls. |
| `apiKeyEnvVar` | `DEEPSEEK_API_KEY` | The *name* of the env var holding the key — not the key. |

**Where the key lives:** the Vercel environment variable `DEEPSEEK_API_KEY` on the live site; a
`DEEPSEEK_API_KEY=...` line in `.env` when running locally. Never in this repo.

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
| `folder` | `agent/knowledge` |
| `tools` | `list_course_files`, `search_course_files`, `read_course_file` |

Files dropped into [`agent/knowledge/`](../knowledge/README.md) are turned into a searchable index
when the site is built. The model uses the three tools to list, search, and read them. The tools
are left out automatically when the folder has no usable files.

Skills work the same way: `skills.folder` is [`agent/skills`](../skills/README.md) and the model
loads one with the `load_skill` tool.

> [!IMPORTANT]
> **What leaves our servers:** every chat message, and any course-material text the model searches
> or reads, is sent to DeepSeek's API to generate the reply. Don't add material that must not be
> shared with a third-party AI provider.

## What is safe to edit here

- **Safe:** `model`, `temperature`, `maxToolRounds`.
- **Leave alone:** `apiKeyEnvVar`. The app reads the key from the env var it names, so changing it
  means the Vercel env var must be renamed too. It must end in `_API_KEY`, or the app ignores it and
  uses `DEEPSEEK_API_KEY`.
- **Descriptive only:** `provider`, `folder`, `tools`, `tool`, `urlEnvVar`. They document what the
  code does; editing them does not change the app. Moving the knowledge or skills folder, or the
  database variable, needs a code change.
- **Never:** secrets of any kind.

Changes to this file reach the live site on the next deploy.

## Adding a new connection

A new connection (for example Canvas, or a different model provider) is not a config change — it
needs code in `lib/agent.js` to call the service and expose it to the model as a tool. Add the
code first, then add its settings here.
