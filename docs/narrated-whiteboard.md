# Narrated whiteboard

Select **Explain on whiteboard** (the board icon next to Attach) before sending a question, or ask
Kelvin to explain on the narrated whiteboard. Coach, Check My Work, and Concepts & Practice can
call `explain_on_whiteboard`. It uses the existing schematic renderer with a saved sequence of
spoken steps. The normal tutoring style and help ceiling still apply.

The player provides Play/Pause, Previous, Next step, Replay step, a seek bar for the current audio
clip, playback speed, captions, and a full transcript. It never autoplays on arrival or when opening
history. Starting another lesson pauses the previous one; leaving a chat releases its audio.

## Add the speech key tomorrow

The feature can ship without an OpenAI key. Lesson generation, diagrams, equations, captions, and
manual Next/Previous controls work immediately with the existing DeepSeek setup. The player says
voice is not set up. It does not switch to a browser voice or pretend narration is playing.

For the deployed app:

1. In the Vercel project, open **Settings → Environment Variables**.
2. Add `OPENAI_API_KEY` for **Production** (and Preview if desired).
3. Redeploy the latest `main` deployment so the function receives the new variable.
4. Reload Kelvin, reopen a saved narrated lesson, and press **Play narration**.

For local development, add `OPENAI_API_KEY=...` to the ignored `.env` file and restart `node server.js`.
Never put the key in a chat, a public JavaScript file, or GitHub source. No application code change
or recreation of existing lessons is required.

Optional server settings:

| Setting | Default | Purpose |
| --- | --- | --- |
| `WHITEBOARD_TTS_MODEL` | `gpt-4o-mini-tts` | A compatible model for OpenAI's speech endpoint |
| `WHITEBOARD_TTS_VOICE` | `coral` | Built-in voice name supported by that model |

## Timing and storage

The model supplies one board and 1–8 speech segments, at most 500 characters each and 2500 total.
Every node, arrow and equation step has one reveal cue. Cue positions are fractions of a short
clip's measured duration. The player uses `audio.currentTime / audio.duration`, including when
paused, seeking or changing speed. This is segment-level synchronization, not word alignment.
Short segments make it more precise. Reduced-motion users get immediate reveals at cue boundaries.

`whiteboard_lessons` stores validated lesson data owned by a conversation and user. A
`kelvin-board` block in the assistant message stores the board and lesson ID for history playback.
`POST /api/whiteboard/:id/audio/:segment` synthesizes only the stored speech for an owned, visible
lesson. `GET /api/whiteboard/voice` returns availability, never credentials.

Audio generation is lazy: opening a lesson costs no speech call. Small MP3 clips (up to 1 MiB each)
are cached in `whiteboard_audio` in Postgres/PGlite, keyed by lesson, segment, model, and voice.
A database lease avoids duplicate generation across server instances. Failed requests release the
lease for retry; a crashed request's lease expires. There is a per-user limit of 60 new cache entries
per rolling hour (best-effort under concurrent distinct requests). Existing cached clips bypass the
generation limit. Changing voice/model regenerates clips. Speech has a 45-second request timeout.

The existing soft-delete/account-deactivation rules also protect these routes. Clips and lessons
remain with the project's retained research data. For larger usage, move audio bytes to private
object storage with the same ownership and lifecycle rules. Speech API usage is logged with
character counts and unknown cost; MP3 responses do not report token usage. Cost is not assumed zero.

## Verification

- `npm run narration:test`: validation, tool/agent integration, real schema and authenticated routes,
  missing-key behavior, adding a key later, caching, concurrent requests, failures, ownership,
  hidden chats, and deactivated accounts. Speech and auth providers are mocked; no paid key needed.
- `npm run board:test`: the existing static board renderer and validation.
- `npm run agent:validate` and `npm run check:imports`: configuration and server integration.
- Optional: `node scripts/narration.browser.test.mjs` with Playwright and Chromium installed.
  `PLAYWRIGHT_MODULE` can point to a bundled Playwright `index.mjs`; `CHROME_EXECUTABLE` can point
  to an installed Chrome. Exercises the real player and chat with a silent WAV fixture, including
  pause, seeking, rate changes, navigation, streaming, missing-key mode, mobile, and reduced motion.
  Screenshots go to ignored `data/narration-ui/`.

Live speech quality, mathematical pronunciation, and exact cue placement should be checked after
the production key is added. The automated tests do not certify the tutor's physics or pedagogy.
