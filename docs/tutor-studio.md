# Tutor Studio and local VS Code workflow

Tutor Studio places the most recent live whiteboard, diagram or graph beside the conversation. Use **Hide workspace** for full-width chat. On smaller screens, **View this explanation in our workspace** opens the board above the conversation. Prior figures stay available in their messages.

**Play narration**, Previous, Replay and Next step are above the drawing. **Voice & speed** and **Read full transcript** are there too. Controls stay at the top while a long board scrolls; hiding the workspace pauses narration. Narration uses the browser's voices and never autoplays. Captions and manual steps work without speech support.

**Learn KELVIN** is separate from chat: a six-feature tour and a captioned walkthrough explain messages, attachments, whiteboard, voice input, checking work and the course map. Progress is saved per user in this browser. The tour never sends messages. Kel's **Watch a quick example** opens a clearly labelled turbine practice example.

## Preview the UI without credentials

1. Open this repository folder in VS Code. Install Node.js 24 if it is not already installed.
2. Open **Terminal → New Terminal**, then run:

   ```powershell
   npm ci
   npm run demo
   ```

3. Open `http://127.0.0.1:3301`. Try the logo/Studio layout, Learn KELVIN, the guided tour, Kel's practice example, narration and resizing the browser.
4. Stop the preview with **Ctrl+C**. Reload the page after changing files.

The demo uses scripted replies and in-memory conversations; it makes no AI calls. Uploads, dictation, live property calculations and account services need the full application. Tour progress persists in browser storage; demo chats disappear when the server stops.

## Run the full app with a local test account

```powershell
npm run dev
```

Open `http://127.0.0.1:3300/dev-login`. This loopback-only mode uses isolated local test data. Configure `DEEPSEEK_API_KEY` in an ignored `.env` file for real model replies. `OPENAI_API_KEY` separately enables microphone transcription; browser whiteboard narration needs neither a speech key nor a paid speech API. See the repository README for normal authentication and database configuration. Never commit `.env`, uploads or `data/`.

The separate Python Grapher has additional local requirements in `docs/grapher.md`; its hosted capability restrictions still apply. A failure to render an inline Mermaid/property diagram now shows **Retry diagram**, with source code collapsed under technical details. This recovery does not enable the separate Python renderer on Vercel.

## Browser verification

Install Playwright locally (`npm install --no-save --package-lock=false playwright` and `npx playwright install chromium`), or point `PLAYWRIGHT_MODULE` at an existing installation. `CHROME_EXECUTABLE` can point at an installed Chrome browser.

```powershell
npm run studio:browser
node scripts/learn.browser.test.mjs
node scripts/narration.browser.test.mjs
```

These use local fake API responses and a controlled browser speech stub. They exercise layout, navigation, draft preservation, playback state, streaming figure reuse, keyboard transcript access, mobile sizing and recovery after library/API failures. Screenshots are written under the ignored `data/ui-review/` folder. Actual voice sound varies with voices installed on each device.
