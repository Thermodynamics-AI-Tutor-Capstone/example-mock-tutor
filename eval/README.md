# `eval/` — the offline retrieval question set

This directory holds the question set and the committed baseline that
[`scripts/kb/eval.mjs`](../scripts/kb/eval.mjs) scores against. No LLM, no API key, no network,
no cost: it runs on every push and on forks.

## What the harness measures

Two arms, scored by the **same** BM25 in `lib/knowledge.js`, so the only variable is the data
layout:

| Arm | What it is |
|---|---|
| **A** | Today's behaviour — flat 1500-character chunks per page, no situating lines, no cards. Rebuilt from the compiled index at eval time. |
| **B** | KB-1 as compiled — structural chunks with their committed context lines, plus card text in the same pool. |

| Metric | What it catches |
|---|---|
| card recall@5 | did a gold card surface at all |
| **source recall@5** | did the gold slide/page surface — the gated metric |
| cards opened to gold | is the hierarchy helping, or making the model wander |
| input tokens to first gold | the cost case for progressive disclosure, measured rather than assumed |

Only one thing fails the build: **arm B source recall@5 falling more than 10% below
`baseline.json`**, and only while the question set and the source corpus are unchanged (a
changed corpus is not a like-for-like comparison, so it downgrades to a warning that tells you
to re-baseline). Everything else is reported and not enforced — a metric that fails noisily gets
switched off, and then it measures nothing.

```bash
node scripts/kb/eval.mjs                      # score against the committed baseline
node scripts/kb/eval.mjs --update-baseline    # rewrite baseline.json from this run
node scripts/kb/eval.mjs --json build/eval.json
```

If `build/knowledge-index.json` has no files and no cards, the harness prints
`no corpus — nothing to evaluate` and exits 0.

## `questions.jsonl` — one JSON object per line

```json
{"id":"q07","q":"How do I find the quality of a saturated mixture at 2 MPa?",
 "gold_cards":["topic:t06-two-phase-states","eq:quality-lever-rule"],
 "gold_source":{"path":"lectures/lec08-properties.pptx","slides":[9,10]},
 "type":"lookup"}
```

| Field | Meaning |
|---|---|
| `id` | stable, unique; never reuse an id for a different question |
| `q` | the student's question, in a student's words |
| `type` | `lookup` · `procedure` · `conceptual` · `course-admin` · `misconception` |
| `gold_cards` | card ids that should surface. Must exist in `agent/kb/`, or the row can only score 0 |
| `gold_source` | `{path, slides: [..]}` for a deck, `{path, pages: [..]}` for a document. `path` is relative to `agent/knowledge/` |
| `placeholder` | `true` while the row is a stand-in rather than a real question |
| `note` | free text; why the row is a placeholder, or what it is probing |

JSONL has no comment syntax, so the caveats live in `note` and here.

## ⚠ The ten rows committed here are placeholders

Every row is marked `"placeholder": true`. They were written from the **structure** of Penn
State ME's *published sample syllabus* for ME 300
(<https://www.me.psu.edu/assets/docs/sample-syllabus/ME-300.pdf>) — the unit/topic titles and
the lecture numbering — and from nothing else. Specifically:

- **`gold_cards` are real ids** taken from the committed `agent/kb/taxonomy.yml` and the
  misconception cards, so they resolve.
- **`gold_source` paths are invented.** `agent/knowledge/` holds only README files, so no file
  named in any row exists. Until real course materials are uploaded, **source recall@5 is 0 by
  construction and the numbers describe the harness, not the tutor.**
- No dates, policies, grading rules, problem numbers or exam contents were invented, and none
  should be added: the sample syllabus is for a past term and a possibly different section.

**The team must replace these with 30 real questions** — the design calls for 30, hand-written
from the actual syllabus, homework and exams of the section Kelvin will serve, committed before
the ingest pipeline is finished. Write them the way students actually ask, keep the type mix
(course-admin questions matter most: a wrong answer there is unambiguously a lie to a student),
and re-run `--update-baseline` once the corpus is in place.

Freeze the set while you are tuning retrieval. Changing questions and retrieval in the same
commit means you cannot tell which moved the number.

## `baseline.json`

Written by `--update-baseline`. It records the metrics, the question-set hash and a corpus
fingerprint, so the gate can tell a genuine regression from a corpus that simply changed. It is
committed on purpose: the comparison has to survive a fresh clone.
