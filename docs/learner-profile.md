# About Me beta

About Me presents the existing account-scoped learning ledger in student-facing language. It does
not maintain a second profile or calculate an overall student grade. GET and POST
`/api/me/learning` retain their existing fields and add `profile` (version 1).

The four optional knowledge dimensions are situational (recognize conditions), conceptual
(explain meaning), procedural (carry out a valid method), and strategic (plan and check).
`record_skill_observation` may include `knowledge_type` only when the quoted work supports it.
Old observations are not inferred into a dimension. Verbal/pictorial representations and
general/domain-specific knowledge are not ranked as abilities.

Topic cards distinguish independent evidence, assisted success, support needs, mixed evidence,
and insufficient evidence. They retain quotes, rationale, source, assistance level and date.
Evidence older than 21 days is not displayed as a current strength. These qualitative states
describe the available observations; they are not validated mastery estimates or course grades.
A single independent success is explicitly tentative. The beta does not claim transfer to new
cases without a separate recorded check.

Existing corrections remain account-scoped append-only events: reset skill observations,
dismiss a misconception, add/remove a note. Student notes are labelled self-report and never
create demonstrated strengths. Resetting observations does not delete chats or the retained
research ledger. Existing Settings continues to work.

## Application integration

Load `about-me.css` and `about-me.js` after `account.js`. Add a peer panel:

```html
<section id="aboutMePanel" hidden></section>
```

Initialize once, then let the main application own routing and the existing chat DOM:

```js
KelvinAboutMe.init({
  panel: document.getElementById('aboutMePanel'),
  onPractice(topic) {
    location.hash = '#/self-check' + (topic ? '?topic=' + encodeURIComponent(topic) : '');
  },
});
// On #/about-me:
KelvinAboutMe.show();
// On other routes:
KelvinAboutMe.hide();
```

`show({focus:false})` suppresses heading focus when needed. Every show reloads the account-scoped
response; a failed reload clears earlier data. Hidden-panel stale responses are ignored.
Supported self-check topics are resolved by the self-check feature; unsupported topics can use
its topic chooser. Hint/explanation turns are excluded from skill assessment when
`ctx.turn.selfCheck.recordable` is false. Server-owned assisted/unknown state overrides a model's
claim of independence.

## Checks

```powershell
node scripts/learner-profile.test.mjs
node scripts/student-skills.test.mjs
node scripts/learner-profile.browser.test.mjs
node scripts/validate-agent.mjs
node scripts/smoke-imports.mjs
```

The API suite uses a fresh embedded database, fake authentication and blocked external calls.
The browser suite supports `PLAYWRIGHT_MODULE` and `CHROME_EXECUTABLE`, uses an API double, and
checks correction failures, evidence visibility, safe text, responsive/dark layout, focus,
refresh and hidden-response races. Browser screenshots are written under ignored
`data/learner-profile-review/`. They contain synthetic examples only.
