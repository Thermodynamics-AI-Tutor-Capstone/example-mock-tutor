# Workspace deferred

The shared workspace was removed from the beta at the user’s request. Its previous implementation remains recoverable in Git history at `bf1bb9f`; it is not loaded by the current app.

Whiteboards and diagrams remain inside their chat messages, with narration controls above and an expanded diagram view for detail. Property tables and Grapher open as separate pages. Important equations opens a static, read-only snapshot of the current conversation’s displayed math using `public/reference-tools.js`. There are no workspace tabs, open/hide controls, figure relocation, or equation pins.

See `docs/tutor-studio.md` for current behavior, local setup and checks.
