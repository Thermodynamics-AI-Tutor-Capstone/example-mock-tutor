# Guided workflow experiment

Branch: `experiment/student-feedback`. This is an evaluation version, not a demonstrated improvement in student learning.

## What changes

- Whiteboard is an explicit, persistent On/Off switch in the composer, remembered in this browser. On requests short visual steps with matching optional narration; Off removes both whiteboard tools from the reply. Existing saved boards remain readable in history.
- There is one guided tutor and no style picker. Old Coach, Check My Work, and Concepts & Practice conversation identifiers resolve to this same tutor. Students can request a next step or a complete solution without earning help through repeated attempts.
- Typing shortcuts are normalized in Kelvin's explanation. A consequential sign or model error is corrected and carried forward; only an ambiguity that changes the physics needs a clarification.
- Opened course cards return usable links to the course browser. Original slide links appear only when configured; a summary is identified as a summary.
- `agent/course-profile.json` holds this deployment's course identity, experimental teaching criteria, and original-source URLs. This is a configuration starting point for professor-specific versions, not a multi-professor account system. Each future deployment needs the correct brain/index and an independently configured data environment.
- Guided assistance is logged as such. The historical audit still reports whether a reply supplied an answer or step, but it does not label that permitted assistance an answer leak or require a closing question. Independent mastery is still earned only by unassisted practice.

## Compare with main

Use fresh conversations in each environment and the same problem statement. Try each case below with Whiteboard Off, then On. Keep model settings and problem data comparable.

| Case | Example student follow-up | What to look for |
| --- | --- | --- |
| Missing dot | “m = 2 kg/s and W = m(h1-h2), so what next?” | Interpret the rates, display correct notation once, and advance. |
| Significant sign | “For compression I treated work by the system as positive.” | Explain the chosen sign convention, correct the sign, and use it in the next step. |
| Stalled student | “I still don't know. Please show the next step.” | Demonstrate the next step of this problem without another attempt gate. |
| Direct concept question | “Why do we use enthalpy for a turbine?” | Explain flow work and the control-volume balance before an optional question. |
| Full walkthrough | “Please derive this from the first law and finish the calculation.” | Explain assumptions, derive the simplification, compute with tools, check the answer. |
| Missing physics | A compressor problem omits whether heat is transferred. | Clarify once or present a labeled conditional setup; do not silently assume adiabatic. |
| Course connection | “Which lecture supports that equation?” | Open a relevant source, link its actual course card, and label unavailable original slides honestly. |

Suggested observations to replace or extend with your own rubric: turns to the requested result; repeated questions; notation-related interruptions; correctness and tool verification; whether assumptions are justified; whether the source actually supports the explanation; usefulness of the diagram and narration. A finished assisted solution is different from an independently solved problem. Test transfer to a new problem separately.

## Original lecture links

Map the exact `sources[].path` from a course card to the instructor's actual HTTPS URL:

```json
{
  "sourceLinks": {
    "lectures/example.pdf": "https://your-course-site.example/actual-file"
  }
}
```

The example above is illustrative; it is not a live source. Configure real URLs in `agent/course-profile.json`, or set `KB_SOURCE_BASE_URL` only if the same relative file paths exist on that host. Canvas URLs may require the student's course login. Do not publish private course PDFs to make a link work.

## Preview deployment

Deploy this branch to the existing Vercel project's **Preview** environment. Keep `main` as the production branch; never use `--prod` or promote this experiment to production.

Before live evaluation, the project owner must provision/confirm Preview-scoped database, authentication and storage, plus the model API keys. Use separate test data and an allowed preview callback/origin for sign-in. A separate Git branch by itself does not isolate those services. No production secrets or student data are included in this branch.

## Checks

- `npm run guided:test`: help availability, state completion, presentation tool selection, and reference URL handling.
- `npm run agent:test`: existing policy compatibility and real agent-loop checks, including attempted whiteboard calls when Off.
- `npm run board:test` and `npm run narration:test`: board data/rendering and narration.
- `node scripts/narration.browser.test.mjs`: speech stub, visual playback, switch persistence, request payload, mobile and reduced motion. Set `PLAYWRIGHT_MODULE` / `CHROME_EXECUTABLE` as needed.

Offline tests verify mechanisms. They do not establish actual model teaching quality, audible voice quality, or learning gains; use the preview and the comparison cases to assess those.
