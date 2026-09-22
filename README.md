# Kelvin AI (mock)

## Where things are

| What | Where |
|---|---|
| Start here — map of everything that defines the tutor | [`agent/README.md`](agent/README.md) |
| System prompt | [`agent/system-prompt.md`](agent/system-prompt.md) |
| Skills | [`agent/skills/`](agent/skills/README.md) |
| Connections (model, database, tools) | [`agent/connections/`](agent/connections/README.md) |
| Course materials — **drop course files here** | [`agent/raw-course-files/`](agent/raw-course-files/README.md) |
| Knowledge brain — **correct what the tutor believes** | [`agent/knowledge-brain/`](agent/knowledge-brain/README.md) |

---

A throwaway example of a ChatGPT-style thermodynamics tutor, built for the Penn State ME 300
capstone team to poke at. **This is not the product.** It has no evaluation and no user accounts,
and it only knows course content that the team adds to `agent/raw-course-files/`.

[`agent/knowledge-brain/`](agent/knowledge-brain/README.md) is the first piece with any research behind it: a committed set
of markdown cards — the course, its five exam blocks, a hand-authored ME 300 symbol table, and
fourteen misconception cards drawn from a 2025 ASEE systematic review of 32 studies. It is a
knowledge structure, not a teaching result: **nothing in it has been checked by an ME 300
instructor, and there is still no evidence that any of it makes the tutor teach better.** The
system prompt and the starter skills remain unreviewed drafts.

> **Warning: accounts link identities to chats.** Each person signs up with an email and sees
> only their own chats, but the capstone team can see everything in the database: emails, profile
> answers and chat logs. That is identifiable student data if anyone outside the team signs up,
> and the capstone's IRB determination is still pending. Keep the link within the team until it
> is in hand. Sign-up is currently open to any email address.

> **Warning: this repository is public.** Anything in `agent/raw-course-files/` or `agent/knowledge-brain/` is
> visible to the whole internet, and chat messages plus any course text the tutor reads are sent
> to DeepSeek's API. See [`agent/raw-course-files/README.md`](agent/raw-course-files/README.md) before
> uploading anything, and note that cards in `agent/knowledge-brain/` quote and summarise whatever is in
> `agent/raw-course-files/`.

## Run locally

```sh
npm install
npm start
```

Then open http://127.0.0.1:3300. The server binds to 127.0.0.1 only. `npm install` also copies the
browser libraries (marked, DOMPurify, KaTeX) into `public/vendor/`, which is gitignored and
rebuilt by `npm run build`.

## Storage

Chats live in Postgres: `conversations`, `messages`, `tutoring_state`, `user_profiles` and
`attachments` (students' uploads, as Markdown). The tables are created automatically the first time
the app touches the database. The original files students upload are kept in a private Vercel Blob
store when `BLOB_READ_WRITE_TOKEN` is set (as on the live site), and in `data/uploads/` locally.
See [`agent/attachments/README.md`](agent/attachments/README.md).

- **`DATABASE_URL` (or `POSTGRES_URL`) set**: the app connects to that Postgres server with `pg`.
  Local hosts connect without TLS. Remote hosts use TLS with certificate checking unless the URL
  sets its own `sslmode` (`sslmode=no-verify` turns the certificate check off).
- **Neither set**: the app runs an embedded Postgres ([PGlite](https://pglite.dev)) stored in
  `data/pglite/`. Only one process may open that folder at a time. This mode is for local use
  only; on Vercel the app refuses to start it.

`data/` is gitignored and listed in `.vercelignore`. **Never commit or upload it.**

Chats saved by older versions of this mock as `data/conversations/*.json` are not imported.

`GET /api/health` reports `db: "postgres"` or `db: "pglite"`, plus `dbError` if the database
cannot be reached.

## Environment variables

Locally, the server reads a `.env` file in this folder (gitignored). Real environment variables
win over `.env`.

| Variable | Default | Purpose |
|---|---|---|
| `DEEPSEEK_API_KEY` | none | DeepSeek API key. Never logged or returned by the API. |
| `DATABASE_URL` | none | Postgres connection string. `POSTGRES_URL` is used if this is unset. With neither, PGlite in `data/pglite/`. |
| `NEON_AUTH_BASE_URL` | none | Neon Auth endpoint for this database (set automatically by the Neon integration once Auth is enabled in the Neon console). Without it nobody can sign in, and every `/api/*` route except `/api/health` returns `401 {"error":"auth_required"}`. Locally, add it to `.env`. |
| `DEEPSEEK_MODEL` | `deepseek-v4-pro` | Model name sent to DeepSeek. |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | DeepSeek API base URL; point it at a local fake server for offline testing. |
| `PORT` | `3300` | Local port (local server only). |
| `PGLITE_DIR` | `data/pglite` | Optional. Where the embedded database lives, relative to this folder. |
| `KNOWLEDGE_DIR` | `agent/raw-course-files` | Optional. Course-materials folder, absolute or relative to this folder. Used by both `npm run knowledge` and the server (handy for testing with throwaway files). |

The model settings (`model`, `baseUrl`, `temperature`, `maxToolRounds`) default to
[`agent/connections/connections.json`](agent/connections/connections.json). `DEEPSEEK_MODEL` and
`DEEPSEEK_BASE_URL` override the file. The API key never goes in that file.

### DeepSeek API key

Locally, the key is taken from the first of these that is set:

1. the `DEEPSEEK_API_KEY` environment variable
2. a `DEEPSEEK_API_KEY=...` line in `.env`
3. the opencode auth store at `~/.local/share/opencode/auth.json` (`deepseek.key`)

On Vercel, only the `DEEPSEEK_API_KEY` environment variable is used.

With no key the app still starts; sending a message returns an error explaining how to set one.
`GET /api/health` reports which source was used and the models the key can see. It only proves the
key can list models: a key with an empty balance still passes, and every chat message then fails
with `DeepSeek returned 402: Insufficient Balance`.

## Agent: prompt, skills, course materials, knowledge brain

The tutor's behaviour is set by [`agent/system-prompt.md`](agent/system-prompt.md), re-read on
every message. The app appends a generated list of skills from `agent/skills/*/SKILL.md`, a
summary of the indexed course materials, and the knowledge map rendered from
[`agent/knowledge-brain/INDEX.md`](agent/knowledge-brain/README.md); it gives the model tools to search files and cards,
open a card, list a card's siblings, read a course file, and load a skill. See
[`agent/README.md`](agent/README.md).

Two folders feed the tutor and they do different jobs:

- **[`agent/raw-course-files/`](agent/raw-course-files/README.md)** — raw uploaded course files. Humans only.
- **[`agent/knowledge-brain/`](agent/knowledge-brain/README.md)** — the knowledge brain: short, committed, human-editable
  markdown cards about the course, each citing the file and page it came from. AI drafts are
  proposed by pull request; a human edit is never overwritten.

Both are read from a prebuilt index, `build/knowledge-index.json` (gitignored). On Vercel the
index is built by `npm run build` during each deploy, by a script that makes **no AI calls** —
the build is deterministic and works without an API key. Locally, `npm start` rebuilds it every
time the server starts and keeps it in memory, so **restart the server** after adding or changing
files or cards. To see what gets indexed and skipped without starting the server:

```sh
npm run knowledge
```

`GET /api/knowledge` (sign-in required) lists indexed and skipped files; `GET /api/kb` returns the
knowledge map and the student-visible cards; `GET /api/kb/card?id=…` returns one card;
`GET /api/health` includes an `agent` block with counts and `indexBuiltAt`.

## Deploy to Vercel

The project deploys as static files from `public/` plus one Vercel Function, `api/handler.js`.
`vercel.json` sends every `/api/...` path to that function, gives it the 300-second Hobby
maximum, and turns on request cancellation, so a reply the reader stops also stops the DeepSeek
request. The partial answer is still saved, because the handler keeps the function alive with
`waitUntil` until the save finishes. A reply still streaming near the 300-second limit is cut off
about 8 seconds early and saved. `vercel.json` also forces the "Other" framework preset. Vercel would
otherwise detect `server.js` as a Node server and ignore the `api/` folder. `server.js` is only
for local runs.

1. **Link the project.** Run `vercel link` in this folder, or import the GitHub repo in the Vercel
   dashboard. If the dashboard suggests the "Node" preset, `vercel.json` overrides it.
2. **Provision Postgres.** For example, run `vercel install neon` and connect the database to
   this project. The app reads `DATABASE_URL`, and falls back to `POSTGRES_URL`. Run
   `vercel env ls` to confirm one of them exists.
3. **Set the secrets.**
   ```sh
   vercel env add DEEPSEEK_API_KEY
   ```
   Add it to every environment you deploy (production and preview). For accounts, enable
   **Auth** on the database in the Neon console (Project → Branch → Auth); the integration then
   provides `NEON_AUTH_BASE_URL`.
4. **Deploy.** Push to the connected Git branch, or run `vercel deploy` (preview) or
   `vercel deploy --prod`. The build runs `npm run build`, which copies the vendor libraries into
   `public/vendor/`.
5. **Check it.** Open `https://<project>.vercel.app/api/health` and confirm `db` is
   `"postgres"`, there is no `dbError`, `accounts` is `true`, and the `agent` counts match
   what you expect.

A GitHub Action rebuilds the knowledge index and deploys on every push to `main` once the
repository has a `VERCEL_TOKEN` secret. Until then, deploy manually as above.

`.vercelignore` keeps `.env`, `data/` and `node_modules/` out of CLI uploads. Vercel's built-in
ignore list covers `.env.local` but not `.env`.
