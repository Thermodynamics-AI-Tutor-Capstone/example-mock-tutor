# thermo-tutor mock

A throwaway example of a ChatGPT-style thermodynamics tutor, built for the Penn State ME 300
capstone team to poke at. **This is not the product.** It has no pedagogy research behind it
beyond a short system prompt, no evaluation, no user accounts, and no course content.

> **Warning: every chat is visible to everyone who can open the app.** There are no user accounts
> and nothing is separated per person. If anyone other than the team uses it, the database may
> hold student data, and the capstone has IRB constraints. Keep `APP_PASSCODE` set on any
> deployment, and do not share the link or passcode outside the team.

## Run locally

```sh
npm install
npm start
```

Then open http://127.0.0.1:3300. The server binds to 127.0.0.1 only. `npm install` also copies the
browser libraries (marked, DOMPurify, KaTeX) into `public/vendor/`, which is gitignored and
rebuilt by `npm run build`.

## Storage

Chats live in Postgres, in two tables: `conversations` and `messages`. The tables are created
automatically the first time the app touches the database.

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
| `APP_PASSCODE` | none (no gate) | Shared passcode. When set, every `/api/*` route except `/api/health` needs the header `x-app-passcode` to match, or it returns `401 {"error":"passcode_required"}`. Use ASCII characters only. |
| `DEEPSEEK_MODEL` | `deepseek-v4-pro` | Model name sent to DeepSeek. |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | DeepSeek API base URL; point it at a local fake server for offline testing. |
| `PORT` | `3300` | Local port (local server only). |
| `PGLITE_DIR` | `data/pglite` | Optional. Where the embedded database lives, relative to this folder. |

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

The tutor's behaviour is set by `system-prompt.md`, re-read on every message.

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
   vercel env add APP_PASSCODE
   ```
   Add both to every environment you deploy (production and preview).
4. **Deploy.** Push to the connected Git branch, or run `vercel deploy` (preview) or
   `vercel deploy --prod`. The build runs `npm run build`, which copies the vendor libraries into
   `public/vendor/`.
5. **Check it.** Open `https://<project>.vercel.app/api/health` and confirm `db` is
   `"postgres"`, there is no `dbError`, and `passcodeRequired` is `true`.

`.vercelignore` keeps `.env`, `data/` and `node_modules/` out of CLI uploads. Vercel's built-in
ignore list covers `.env.local` but not `.env`.
