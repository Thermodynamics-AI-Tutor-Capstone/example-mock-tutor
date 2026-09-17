# thermo-tutor mock

A throwaway, local-only example of a ChatGPT-style thermodynamics tutor, built for the Penn State
ME 300 capstone team to poke at. **This is not the product.** It has no pedagogy research behind it
beyond a short system prompt, no evaluation, no auth, and no course content.

## Run

`npm install && npm start`, then open http://127.0.0.1:3300. The server binds to 127.0.0.1 only.

## DeepSeek API key

Resolved in this order (the first one found wins; the key is never logged or returned by the API):

1. `DEEPSEEK_API_KEY` environment variable
2. a `DEEPSEEK_API_KEY=...` line in `.env` in this folder (gitignored)
3. the opencode auth store at `~/.local/share/opencode/auth.json` (`deepseek.key`)

With no key the server still starts; sending a message returns an error explaining how to set one.
`GET /api/health` reports which source was used and the models the key can see.

Other env vars: `PORT` (default `3300`), `DEEPSEEK_MODEL` (default `deepseek-v4-pro`),
`DEEPSEEK_BASE_URL` (default `https://api.deepseek.com`; point it at a local fake server for offline testing).

`GET /api/health` only proves the key can list models. A key with an empty account balance still
passes it, and every chat message then fails with `DeepSeek returned 402: Insufficient Balance`.

## Chat history

Each conversation is stored as JSON in `data/conversations/<id>.json`. `data/` is gitignored —
**never commit it.** If anyone other than the developer uses this mock, that folder may contain
student data.

The tutor's behaviour is set by `system-prompt.md`, re-read on every message.
