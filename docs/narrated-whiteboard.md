# Narrated whiteboard

Select **Explain on whiteboard** (the board icon next to Attach) before sending a question, or ask
Kelvin to explain on the narrated whiteboard. Coach, Check My Work, and Concepts & Practice can
call explain_on_whiteboard. DeepSeek writes a bounded lesson script; the browser speaks it while
JavaScript draws the diagrams and equations. **No OpenAI key or paid speech API is required.**

## Playback

Press **Play narration** to begin. Saved lessons never autoplay. Controls include Previous,
Next step, Replay step, speed, voice selection, captions, and a full transcript. Pause stops both
the drawing and speech; **Resume phrase** repeats the current phrase. Changing voice or speed
while playing also restarts only that phrase. Browser speech has no reliable audio seeking API,
so navigation is by step and phrase rather than a time slider.

Local English voices are preferred when available. The voice selector labels local voices
**on device** and other voices **browser service**. Browser service voices may need an internet
connection and send speech text to the browser/OS provider; they still require no Kelvin API key.
Available voices, pronunciation, and quality depend on the browser and operating system. If a
voice fails, choose another and press Play. If speech is unsupported or no voice works, captions,
the transcript, and manual Next/Previous remain available.

Starting a second lesson pauses the first. Sending a message pauses narration; leaving a chat
cancels its speech and animation. There is no audio generation request on opening or playing a
lesson and no server audio storage for browser narration.

## Live marker drawing

The board uses an off-white dry-erase surface, rounded slightly bowed strokes, and a marker tip
that follows outlines, arrows, and equation reveals. Blue identifies components and mass flow,
green identifies states, red identifies heat, amber identifies work, and purple identifies
boundaries/relationships. Equation steps use alternating marker colors. Labels and arrowheads
preserve meaning independently of color. Equations stay in KaTeX for legibility.

DeepSeek supplies 1–8 short speech segments (500 characters each, 2500 total) with one cue per
board element. Cue fractions map to word positions; cues and sentence breaks divide the segment
into short phrases. Each actual speech-start event starts that phrase's drawing, and speech-end
completes it before advancing. The marker animation is a short visual stroke, not phoneme or
word alignment. It never starts the next phrase's drawing before its narration starts. Reduced
motion reveals each phrase's elements immediately and hides the moving marker.

Saved lessons from the earlier audio implementation work with browser narration automatically.
This is an interactive player, not a downloadable video. Video export is not implemented.

## Server and configuration

The existing DeepSeek configuration still generates the explanation. No new environment variables,
model downloads, GPU service, or speech server are needed. Deploy the updated application normally.
The browser uses SpeechSynthesis and SpeechSynthesisUtterance.

whiteboard_lessons continues to store validated lesson data owned by the conversation and user;
a kelvin-board block in the assistant message holds the saved board and lesson segments.

The earlier optional OpenAI synthesis endpoints and whiteboard_audio table remain for backwards
compatibility, with ownership checks, leases, and limits unchanged. The current player never calls
those endpoints, even if OPENAI_API_KEY is configured. That key can remain unset. The old endpoint
checks below test that retained backend, not browser voice playback.

## Verification

- npm run narration:test: saved lesson validation, ownership and legacy audio endpoint safeguards,
  plus phrase segmentation and cue ordering tests. No live provider calls.
- npm run board:test: board tool and renderer checks.
- npm run agent:validate and npm run check:imports: configuration and server integration.
- node scripts/narration.browser.test.mjs: optional Playwright/Chrome checks against the actual UI
  with a controllable SpeechSynthesis test double. Set PLAYWRIGHT_MODULE to Playwright's index.mjs
  and CHROME_EXECUTABLE to Chrome if they are not installed in standard locations. Tests drawing,
  pause/resume, rate/voice changes, stale callbacks, errors, navigation, streaming, mobile,
  reduced motion, and zero speech API requests. Screenshots go to ignored data/narration-ui/.

Browser automation verifies event handling, not the audible quality of installed system voices.
Check pronunciation and playback on the browsers/devices used by students before a classroom demo.
