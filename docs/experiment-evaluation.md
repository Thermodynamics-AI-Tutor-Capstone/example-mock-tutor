# Experimental Kelvin evaluation

Evaluated October 21, 2026 (America/New_York). This is a comparison of implemented behavior and
learning-support features, **not evidence of improved student learning or better live AI answers**.

The baseline is the verified local `origin/main` commit
`52b0d6d42eff108316fadcb76ae5638aa0fec9dd`. A read-only Git archive was extracted under ignored
`data/experiment-evaluation/`; no checkout, edit, commit, or push changed main. The comparison
uses the experimental working tree, including the latest uncommitted changes. It does not
establish what is currently deployed to Vercel or running in an older local server process.

## Rubric declared before comparison

- **0:** absent, or conflicts with the requested behavior.
- **1:** partial support, or instructions exist but model compliance is unmeasured.
- **2:** the behavior is implemented and demonstrated by a reproducible deterministic scenario.
- **Unmeasured:** evidence requires actual model responses or student outcomes.

These scores measure coverage of the requested experiment. They are not an overall rating of
either tutor, a calibrated teaching-quality metric, or a percentage learning gain. Criteria are
not combined into one total because a UI score cannot substitute for a learning outcome.

## Comparison matrix

| Criterion | Main | Experiment | Observation and evidence |
| --- | ---: | ---: | --- |
| Compact symbol palette inserts into the normal message | 0 | 2 | Main has no equation toolbar. Experiment has category tiles, no search/separate equation editor, cursor insertion, editable templates, preserved draft, and no automatic send. `equation-editor.browser.test.mjs`. |
| Edit a pasted/uploaded problem in its formatted preview | 1 | 2 | Main exposes raw Markdown/TeX beside a read-only preview. Experiment edits prose, signs, subscripts, fractions and tables in the formatted view; unchanged unsupported math is preserved. Undo, cancel, safe paste, save/reopen and mobile checks passed. `attachment-preview.browser.test.mjs`. |
| Recognizable apparatus and meaningful surroundings | 0 | 2 | The same illustrated turbine fixture renders a labeled box on main and an apparatus with shaft, air surroundings and a dashed control volume on the branch. Fifteen apparatus variants have renderer/browser coverage. These are authored schematic drawings, not photorealistic or fully 3D models. |
| Equations beside the drawing on a desktop | 0 | 2 | The same browser scenario puts main's equations below the diagram and the branch's equations beside it; mobile remains usable. `experiment-evaluation.browser.mjs`, `illustrations.browser.test.mjs`. |
| Pen/drawing pace tied to speech | 1 | 2 | Main already starts each phrase with speech, but finishes its drawing early. At 2.2 seconds in the same still-speaking, no-boundary fixture, main was 100% drawn; branch was about 64%. Branch uses word events when available, a bounded fallback otherwise, sequential apparatus strokes, and a 0.9× default pace. `narration.browser.test.mjs`. This does not measure voice naturalness. |
| One public tutor mode | 0 | 2 | Main loads three enabled modes; branch loads one Guided tutor and hides mode selection. Source execution plus browser checks. |
| Help remains available without an attempt gate | 0 | 2 | With the same supplied classifier reads and zero independent attempts, four frustrated turns remain working at ceiling 6 in the branch; main parks at ceiling 1. Main still has a direct-answer rule for `fact` intent. This tests routing/policy resilience, not whether a live model will answer 150/5 correctly or immediately. |
| Longitudinal topic evidence and assisted/independent separation | 2 | 2 | Both versions already maintain topic evidence; neither turns five assisted successes into independent mastery. Contrasting algebra/energy-balance profiles and reset behavior pass. The new branch preserves this foundation. |
| Revisable, source-grounded skill observations | 1 | 2 | Main has generic hypotheses and practice evidence. Branch adds named skills, current-message quotations, ownership checks, uncertainty, contradiction/recovery, copied-tutor-work assistance, durable storage, deleted-chat exclusion and student resets. `student-skills.test.mjs`, `skill-settings.browser.test.mjs`. |
| Start from a capable-undergraduate prior without recording assumed mastery | 0 | 1 | Explicit branch instructions distinguish the curriculum prior from observed skill evidence. Prompt content is verified; actual explanation calibration remains unmeasured. |
| Respect requested detail/visuals/pace over historical patterns | 0 | 1 | Branch instructions explicitly prioritize the current request and reject fixed learning-style labels. No live response trial establishes adherence. |
| Live answer correctness, helpfulness and appropriate adaptation | Unmeasured | Unmeasured | No model API key was used; fixtures do not count as AI responses. |
| Independent problem solving, retention and transfer | Unmeasured | Unmeasured | No student study or scored independent assessments were conducted. |

## Iterations and contrasting learner profiles

1. **Baseline and UI comparison:** actual main and branch browser code rendered the same authored
   turbine lesson and extracted-problem text. Screenshots confirm the apparatus, paired layout,
   formatted editor and timing differences. Identical pinned vendor assets were served to both;
   authentication, extraction, storage responses and speech events were controlled test doubles.
2. **Behavioral regression:** symbol insertion, formatted editing, narration, and student reset
   suites were run after implementation. A partial-stroke timing assertion was corrected to
   include a partially drawn dashed boundary; drawing had been partial, while the first assertion
   incorrectly required a wholly hidden stroke. No product regression was masked by that change.
   Editor tests also cover the implementation's clipboard correction: preserve structured internal
   math, and use plain text for foreign MathML instead of flattening a fraction incorrectly.
3. **Adaptation over successive evidence:** one difficulty yields tentative support, a second yields
   targeted support, independent success introduces a mixed record, and five recent independent
   successes replace the earlier difficulty with demonstrated independent performance. Old evidence
   is marked old; low-confidence evidence stays uncertain; assisted success remains assisted.
4. **Contrast and integrity:** an algebra-strong/energy-balance-support profile and the reverse
   retain distinct skill states. Reset/deduplication pass. Isolated database tests verify cross-chat
   continuity for the same user, separation between users, persistence after restart, exclusion of
   deleted conversations, and reset followed by fresh evidence. These are synthetic evidence
   sequences, not observations of actual learners.

An exact student quote establishes provenance; it does not prove that an LLM correctly assessed
the reasoning or independence. The existing Bayesian parameters are still unfitted. The new
qualitative skill labels must not be presented as calibrated probabilities or a diagnosis.

## Reproduce and inspect evidence

Run `node scripts/experiment-evaluation.mjs`, then
`node scripts/experiment-evaluation.browser.mjs`. The browser script accepts `PLAYWRIGHT_MODULE`
and `CHROME_EXECUTABLE`, as the existing browser suites do. Windows sandbox networking may block
loopback; successful browser/database checks were run with local loopback permitted.

Ignored outputs under `data/experiment-evaluation/`:

- `comparison.json`: fixed commit identity, executed policy scenarios, contrasting skill profiles,
  staged adaptation, and explicit unmeasured outcomes.
- `browser-comparison.json`: measured UI differences and speech/drawing progress.
- `main-complete.png`, `experiment-complete.png`: same lesson in each actual frontend.
- `main-during-speech.png`, `experiment-during-speech.png`: same timed playback condition.
- `main-problem-preview.png`, `experiment-problem-preview.png`: same extracted problem review.

Additional passing checks: `equation-editor.browser.test.mjs`,
`attachment-preview.browser.test.mjs`, `narration-player.test.mjs`, `narration.browser.test.mjs`,
`student-skills.test.mjs`, and `skill-settings.browser.test.mjs`.

## Next evaluation with real responses and students

First run matched live-model scenarios with fixed model/settings: simple arithmetic, meaningful
sign error, harmless missing dot, worked-solution request, ambiguity that changes the answer,
algebra-strong profile, thermo-strong profile, uncertain/stale evidence, and a current request for
a visual or detailed explanation. Record correctness, first-turn useful help, needless questions,
assumptions, quotation accuracy and whether assistance is honestly recorded. Use the same 0–2
rubric per response and retain the actual transcripts. A refusal or invented assessment should
trigger a focused fix and rerun of the affected scenarios.

Then use matched but different thermodynamics problems with students. Counterbalance main/branch
order so solving the first problem does not simply reveal the second answer. Record time to useful
help, completion, repeated-question loops and usability ratings separately from a short unaided
transfer problem and a later retention check. Score the independent work against a fixed rubric,
preferably without the scorer knowing the tutor condition. Report sample size, missing attempts
and uncertainty; do not infer learning gains from quicker completion or a more appealing drawing.
