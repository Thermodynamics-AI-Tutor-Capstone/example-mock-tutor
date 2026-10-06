# Voice input and contextual feature tips

Students can select the microphone beside Send, explain their reasoning, and select it again
to stop. The transcript is appended to the current draft. Students review numbers, units,
symbols, and terminology before sending; dictation never automatically sends a chat message.
Typed text remains available and is preserved through recording, cancellation, and errors.

## Flow-style branch

The `codex/wispr-flow` branch adds a Wispr Flow-style interaction inside Kelvin. It does not
integrate with or require the Wispr Flow product. Focus the message box and hold
**Ctrl + Shift + Space** to dictate; release any shortcut key to stop and transcribe. The
microphone still supports click-to-start/click-to-stop, with a separate **Stop & transcribe**
button, elapsed recording time, and **Cancel**. Press **Escape** to discard audio.
Releasing the shortcut before permission is granted, or leaving the window while holding it,
cancels safely. The shortcut applies only in Kelvin's message box.

The transcript uses the same fixed mini-transcribe endpoint without a second polishing or
rewriting model call. Students keep the exact returned transcript and can edit technical
terms, equations, values, and units before sending. Existing typed text is preserved.

## Setup

Set `OPENAI_API_KEY` in the local `.env` file or the deployment's server environment. Never put
the key in browser code. Restart the local server or redeploy after changing configuration.
The fixed transcription model is `gpt-4o-mini-transcribe`, selected for the published estimated
rate of $0.003 per minute ($3 per 1,000 minutes). This is an estimate, not a billing guarantee.
There is no monthly budget cap. DeepSeek continues generating tutor responses separately.

The microphone requires HTTPS (localhost is also supported), permission to access a microphone,
and MediaRecorder support for WebM or MP4. The server capability check enables the button only
when a key is configured; it does not verify the key's validity, billing, or model access.
When voice input is unavailable, students can still type and microphone tips are suppressed.

## Recording and data handling

- The microphone starts only after a student selects it or holds the shortcut and grants browser permission.
- Starting dictation pauses existing Kelvin narration. Sending is disabled while permission,
  recording, or transcription is in progress.
- Cancel discards the recording/request; switching chats or leaving the page cancels dictation.
- Browser recordings stop after two minutes. The server enforces a 3 MiB request limit and
  20 transcription attempts per user per hour using an atomic database counter. The two-minute
  limit is a browser control, not server-side audio-duration validation.
- Audio is sent to OpenAI for transcription. Kelvin does not save raw recordings to its database
  or file storage. Provider data handling follows the configured OpenAI account's policies.
- Transcripts become saved chat content only when the student sends the draft. Usage records
  contain request metadata, not recording bytes or transcript text.

The authenticated `GET /api/dictation` reports capability and recording limits.
`POST /api/dictation` accepts a raw `audio/webm` or `audio/mp4` body and returns `{ "text": "…" }`.
The server forwards audio as multipart form data to the OpenAI transcription endpoint. Failed
provider requests count toward the hourly limit. Provider errors shown to students do not expose
credentials or provider response bodies.

## Feature tips

Tips appear inside the composer after a short pause in typing, without taking keyboard focus
or blocking submission. They explain when voice input, a photo of working, or a narrated
whiteboard can help. Actions select the real feature; they do not send the student's draft.

Tips are limited to one per page visit and at most one per 24 hours per account on that browser.
Each tip is shown once; using its feature also marks it as discovered. Students can choose
**Not now**, press Escape, or choose **Don’t show tips**. Preferences are stored locally under
`kelvin:feature-tips:v1:<user-id>` and do not synchronize across devices. These are feature
discovery prompts, not evidence that dictation improves learning outcomes.

## Verification

- `npm run dictation:test` tests server validation, provider handling, and quota behavior offline.
- `npm run dictation:browser` exercises microphone controls and tips using browser/API stubs.
  As with the narration browser suite, set `PLAYWRIGHT_MODULE` and `CHROME_EXECUTABLE` when needed.
- `npm run check:imports` verifies server module integration.

Browser stubs verify UI behavior, not real microphone quality or model accuracy. Before student
rollout, test actual recordings on the target browsers, especially thermodynamics terms,
decimals, and units.

References: [OpenAI speech-to-text documentation](https://developers.openai.com/api/docs/guides/speech-to-text),
[OpenAI pricing](https://developers.openai.com/api/docs/pricing),
[browser microphone access](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia),
and [Vercel request limits](https://vercel.com/docs/functions/limitations).
