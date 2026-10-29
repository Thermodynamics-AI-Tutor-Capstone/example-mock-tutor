# Shared workspace references

The workspace has **Drawing**, **Property tables**, **Important equations**, and **Grapher** tabs. The workspace starts closed. Open workspace is always available in the left sidebar; Hide workspace is inside its header. New replies never open it automatically.

The drawing tab keeps the original figure and its narration player. Switching to another reference pauses speech; returning preserves the current phrase. A new explanation does not replace the reference tab the student is reading. Clicking an explanation's workspace link returns to Drawing.

Property tables reuse the existing iframe, including its checked source-selection messages to the draft. If source-page scans are unavailable, a numeric reference uses the existing water/R-134a tables through the authenticated `/api/properties/lookup` endpoint; its provenance is shown explicitly. Grapher keeps its existing hosted/local capability restrictions. With the workspace closed, the Property tables and Grapher toolbar links open their standalone pages in a separate browser tab.

Important equations reads actual KaTeX display-math annotations from the latest assistant explanation and current workspace board. It does not invent a formula or retrieve an unrelated formula catalog. Board step labels and notes are retained; an explicit preceding assumption paragraph can accompany a displayed chat equation. Pin equation keeps a reference across subsequent replies in the current conversation. Pins are kept in memory and clear on a new conversation, conversation switch or reload. Show source returns to the connected original equation when it remains available.

The Important equations toolbar button opens a read-only equation snapshot in a separate tab when the workspace is closed. An explicit Open reference action is also available inside the equations tab. This static copy does not update or play narration. Drawing figures stay in their original live workspace; their existing Expand controls remain available.

## Integration

Load `/workspace-tools.css` after Studio CSS, and `/workspace-tools.js` after Studio and property-table-dock scripts. The module creates its own tabs/panels, moves the existing property dock into the workspace, and keeps the close control inside the workspace and the open control in the sidebar. It never clones the live figure or narration DOM.

Call `window.KelvinWorkspaceTools?.setConversation(id)` when a conversation changes and with `null` for a new chat. Hash/new-chat listeners provide a fallback. `refresh()` schedules a fresh equation extraction; normal content mutations already trigger it. `showTables(open)` is called by the minimal property-table-dock integration.

`scripts/workspace-tools.browser.test.mjs` injects the module/CSS only if the shell does not yet load it and checks references, pins, playback-state preservation, popouts, draft retention, keyboard tabs, and mobile sizing with local mocked responses.
