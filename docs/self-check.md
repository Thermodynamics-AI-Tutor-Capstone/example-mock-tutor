# Check my understanding beta

Students choose one of three concepts (energy balance, state properties, entropy balance) and one
of two contrasting cases. Starting a self-check creates a regular account-owned KELVIN conversation
with a fixed question. It makes no model call and records no learning evidence. The existing tutor
provides feedback on the student's reasoning; it does not use keyword matching to award a grade.

Hint, explanation and finish actions are typed server inputs. The existing per-user reply lock
protects the state update. `tutoring_state.selfCheck` persists the case and assistance state, so
reloading cannot restore an assisted attempt to independent. Follow-up revisions are conservatively
assisted. Re-exposure to the same case in another conversation is unknown independence; an exact
normalized repeated answer cannot create new evidence. A new case may be independently attempted,
but that alone does not establish successful transfer. The assessment must still examine reasoning.

`record_practice_result` enforces the server's independent/assisted status. The About Me change also
guards `record_skill_observation` using `turn.selfCheck.recordable` and `.independence`. Successful
guided work is useful evidence, but it is not independent mastery. These are beta practice cases,
not course assessments or a validated diagnostic instrument.

## App integration

Load `/self-check.css` and `/self-check.js` before `app.js`. Add an empty `selfCheckPanel` section
alongside the other feature panels and an empty `selfCheckSession` section above the chat thread.
Add a sidebar link to `#/self-check`. Initialize after the authenticated API is ready:

```js
KelvinSelfCheck.init({
  api, // existing api(method, url, body)
  panel: document.getElementById('selfCheckPanel'),
  sessionHost: document.getElementById('selfCheckSession'),
  blocked: () => state.streaming,
  onShow: () => { /* hide the chat/other feature panels */ },
  onOpenConversation: async (conversation) => {
    // Refresh sidebar, then navigate to /c/{id} using the normal route.
  },
  onSend: (content, extra) => send(content, extra),
});
```

Call `route()` before chat routing; it returns true for `#/self-check` and accepts `?topic=<skill>`.
Call `hide()` on other routes. Call `setConversation(conv)` on conversation load and
`setConversation(null)` for an empty chat. Forward SSE events through `handleEvent(event)`.
Call `setBusy(state.streaming)` when stream state changes. `onSend` receives
`{selfCheckAction, preserveDraft:true}`: send `selfCheckAction` in the message body and preserve any
existing typed draft and attachments when using these help buttons. Help buttons must not silently
submit a student's unfinished draft or uploads. The plain composer sends no action (an answer).

About Me may link to `#/self-check?topic=entropy-balance`. Unsupported skill IDs open the chooser;
system-boundary/process-assumptions map to energy-balance, and property-tables maps to state-properties.

## Checks

```powershell
node scripts/self-check.test.mjs
node scripts/self-check.browser.test.mjs
```

The API test uses a throwaway embedded database and fake authentication/model responses. It checks
ownership, action validation, persisted assistance, duplicate handling, tool enforcement, and
ordinary chat after finishing. The browser component test accepts `PLAYWRIGHT_MODULE` and
`CHROME_EXECUTABLE`, exercises local fixtures, and saves screenshots in ignored `data/self-check-ui`.
The combined release must also check real app navigation and draft-preserving send integration.
Passing fixture tests verifies software behavior, not live model feedback quality or learning gains.
