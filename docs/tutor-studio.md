# Tutor Studio and local VS Code workflow

Tutor Studio uses a full-width conversation with 17px desktop text and 16px phone text. Whiteboards, graphs and diagrams stay directly in their chat messages. The separate workspace and its open/hide controls are deferred to a later iteration.

**Property tables**, **Grapher** and **Important equations** open separate browser tabs. Important equations contains a read-only snapshot of the displayed equations in the current conversation, with available labels and assumption notes. Open it again to refresh the snapshot. Workspace equation pins are deferred with the workspace.

**About Me** shows evidence, assistance, uncertainty and four knowledge dimensions rather than a numeric grade. **Check my understanding** offers three concepts with two cases each and uses the existing tutor for feedback. Hint and Explain requests preserve unsent drafts and cannot themselves create independent learning evidence. The offline demo shows these flows with scripted replies and saves no assessment; the full app uses the signed-in student's evidence ledger.

**Play narration**, Previous, Replay and Next step are above the drawing. **Voice & speed** and **Read full transcript** are there too. Controls scroll normally with the conversation. The drawing and steps sit in a bounded embedded frame: page scrolling is the default; **Scroll board** enables scrolling inside it, and **Scroll page** or Escape returns to the conversation without reaching the bottom. Navigating away pauses narration. Narration prefers a Mark voice when the browser provides it, otherwise a local English voice or device fallback. An explicit voice selection is respected. Narration never autoplays. Captions and manual steps work without speech support.

**Learn KELVIN** is separate from chat: an eight-feature tour and a captioned walkthrough explain messages, attachments, whiteboard, voice input, checking work, the course map, About Me and Check My Understanding. The captioned animation runs for 1 minute 20 seconds and has no audio. The timeline, lesson count, progress maximum, chapter timestamps and tour-duration estimate come from the lesson list. Progress is saved per user in this browser; previous completed features remain completed when new features are added. The tour never sends messages. Kel's **Watch a quick example** opens a clearly labelled turbine practice example in a dismissible dialog, without inserting messages into the student's chat.

## Preview the UI without credentials

1. Open this repository folder in VS Code. Install Node.js 24 if it is not already installed.
2. Open **Terminal → New Terminal**, then run:

   ```powershell
   npm ci
   npm run demo
   ```

3. Open `http://127.0.0.1:3301`. Try About Me, Check my understanding, Learn KELVIN, Kel's practice example, reference tabs, narration and resizing. If port 3301 is already in use, run `$env:PORT='3302'; npm run demo` and open port 3302.
4. Stop the preview with **Ctrl+C**. Reload the page after changing files.

The demo uses scripted replies and in-memory conversations; it makes no AI calls. The numeric property reference works offline for water and R-134a using the installed interpolation tables. When original course-page scans are unavailable, the Property tables tab clearly labels this numeric reference and its source. Uploads, dictation and account services need the full application. Tour progress persists in browser storage; demo chats disappear when the server stops.

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
node scripts/whiteboard-scroll.browser.test.mjs
node scripts/learn.browser.test.mjs
node scripts/narration.browser.test.mjs
npm run beta:test
npm run beta:browser
node scripts/property-reference.browser.test.mjs
node scripts/compact-diagrams.browser.test.mjs
```

These use local fake API responses and a controlled browser speech stub. They exercise layout, navigation, draft preservation, playback state, streaming figure reuse, keyboard transcript access, mobile sizing and recovery after library/API failures. Screenshots are written under the ignored `data/ui-review/` folder. Actual voice sound varies with voices installed on each device.

The About Me and Check My Understanding tour steps highlight their real sidebar links, including when the sidebar is collapsed or on a phone. “Find” closes the tour and focuses the link; it does not open, save, submit or answer anything automatically. Closing the tour returns to Learn KELVIN or the original conversation with its draft intact.
