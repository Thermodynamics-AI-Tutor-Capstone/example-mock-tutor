# The knowledge brain (`agent/knowledge-brain/`)

This folder is Kelvin AI's **knowledge brain**: a set of small markdown cards, one idea each,
that the tutor reads on demand instead of being handed a wall of course text.

It is plain markdown in a public GitHub repo. **You edit it the same way you edit anything else
on GitHub** — open a file, click the pencil, change it, click *Commit changes*. No tooling, no
build step, no pull request unless you want one. If you can write a paragraph, you can correct
what the tutor believes.

> This README is documentation, not a card. So are `INDEX.md`, `symbols.md` and `taxonomy.yml`
> — they are described below and each does a specific job.

---

## The three folders, and who owns each

| Folder | Who writes it | What it is |
|---|---|---|
| [`agent/raw-course-files/`](../raw-course-files/README.md) | **Humans only.** Drag and drop. | Raw uploaded course files — PDFs, slides, handouts. The pipeline never writes here. |
| **`agent/knowledge-brain/`** (this folder) | Humans, and an AI pipeline via pull request | Cards. The brain. Committed, reviewable, diffable. |
| `build/knowledge-index.json` | A build script | Compiled from the other two at deploy time. Not committed, never edited by hand. |

Nothing in this folder is secret and nothing here is student data. Do not put either in it.

---

## Card kinds

Every card is one markdown file with a YAML header (*frontmatter*) and a body. Its `id` prefix
says what kind it is, and the folder matches.

| Kind | `id` prefix | Folder | What it holds |
|---|---|---|---|
| course | `course:` | `course/` | The one course card: textbook, units, solution format, what Kelvin must not say. |
| unit | `unit:` | `units/` | One per exam block. Lecture rows, what a student should be able to do, what bites them. |
| topic | `topic:` | `topics/` | One per lecture. The workhorse: what the lecture covers, objectives, common wrong moves. |
| equation | `eq:` | `equations/` | One equation: the LaTeX, its symbols, and **when it is and is not valid**. |
| misconception | `misc:` | `misconceptions/` | A wrong belief students hold, a probe to detect it, a move to repair it. |
| worked example | `ex:` | `examples/` | A solved problem in the six ME 300 fields, so the tutor can reveal them one at a time. |
| assessment item | `item:` | `items/` | A homework or exam question and which objectives it tests. |
| source | `src:` | `sources/` | One per ingested course file: what it is, what is in it, which topics it feeds. |

Folders that do not exist yet appear when the first card of that kind is written. Right now only
`course/`, `units/` and `misconceptions/` are populated, because **no course files have been
uploaded**, so there is nothing to draft topics or equations from.

Three files are not cards:

- **`INDEX.md`** — the hand-written part of the map that goes into *every single message* Kelvin
  sends. The rest of that map is **generated**: the compiler builds the course one-liner, the
  five unit lines, the misconception watchlist, the symbol-collision table, the navigation rules
  and a coverage line out of the cards, `taxonomy.yml` and `symbols.md`. So `INDEX.md` holds only
  what no card can say — today, the "this is a *sample* syllabus" warning, the textbook warning,
  the solution format and the sign convention.

  The whole map has a **hard budget of 2,000 tokens**, and `INDEX.md` is the *first* block dropped
  when the budget is exceeded. Repeating something here that the compiler already generates
  therefore pushes out something it does not. Keep it to about 200 tokens. Topic titles
  deliberately do **not** live in the map at all; that is the whole point of the design.
- **`taxonomy.yml`** — the course spine, hand-transcribed from Penn State's published sample ME
  300 syllabus: 5 units, 44 lecture rows with their Turns & Pauley section references, the
  objectives and outcomes, the six-part problem format, and the closed lists of allowed values
  for `status`, `valid_when` and friends. **The AI pipeline may never invent an id that is not in
  here** — if it cannot place something, it must say `unassigned` and propose the new topic in
  its pull request.
- **`symbols.md`** — the authoritative nomenclature table. Hand-authored on purpose: automated
  symbol extraction is the least reliable step in the whole pipeline, so this file wins any
  disagreement.

There is also a `context/` folder written by the pipeline. It holds one short situating line per
chunk of each course file (*"slide 12: chapter 7, entropy balance, derivation of S_gen ≥ 0"*) so
that search can find a slide that never repeats its own subject. It is committed so you can read
and fix those lines too.

---

## Frontmatter fields

The vocabulary is fixed. Adding a new field name means changing the compiler, so reach for an
existing one first.

**Identity**

| Field | Meaning |
|---|---|
| `id` | Unique, prefixed by kind: `topic:t12-entropy-balance-closed`. Never reuse or reassign one. |
| `kind` | `course` · `unit` · `topic` · `equation` · `misconception` · `example` · `item` · `source` |
| `title` | Human title, shown to students. |
| `description` | **One line.** This is the text Kelvin sees *before* it decides whether to open the card, so it has to say what is inside and when to reach for it. The most important field on the card. |

**Place in the hierarchy**

| Field | Meaning |
|---|---|
| `parent` | The card one level up (course → unit → topic → leaves). |
| `unit` | Which unit this belongs to, for filtering. |
| `prerequisites[]`, `precedes[]` | The learning order. Must not form a cycle. |

**Content links**

| Field | Meaning |
|---|---|
| `objectives[]` | What this teaches. Each gets a stable id (`#o1`, `#o2`), a `kc_type` (`fact`, `skill` or `principle`) and a Bloom level. |
| `equations[]`, `misconceptions[]`, `examples[]`, `items[]`, `symbols[]` | Ids of related cards, or symbols from `symbols.md`. |
| `requires_objectives[]` | On an assessment item: which objectives it tests. |
| `derives_from`, `specializes_to` | Equation to equation — general energy balance → steady-flow form → nozzle form. |
| `valid_when[]`, `invalid_when[]` | **On equation cards, the most important fields in the brain.** The assumptions under which the equation holds, drawn from the closed list in `taxonomy.yml`. Right equation, wrong assumptions is the most common way to get a thermo problem wrong, and this is the field that catches it. |
| `sources[]` | Where the content came from: `{path, pages}` or `{path, slides}` for a file in `agent/raw-course-files/`, or `{url, title, retrieved}` for something outside the repo. **Every card needs at least one.** No card without a citation. |

**Risk control**

| Field | Meaning |
|---|---|
| `status` | How much human checking this has had. See below. |
| `audience` | `both` (default), `student`, or `model`. Anything not `student` or `both` is hidden from students. |
| `priority` | 0–1. A hint about how central the card is. |
| `generated` | `{model, prompt_version, at}` if an AI drafted it, `null` if a human wrote it. |

---

## What `status` means

This is the field that keeps the tutor honest, so it is worth being strict about.

| Value | Means | Kelvin's behaviour |
|---|---|---|
| `auto` | An AI wrote it from a course file. **Nobody has read it.** | Answers built on it are flagged as unverified. |
| `draft` | A human wrote it, but nobody who teaches ME 300 has checked it. | Same flag. |
| `reviewed` | Someone on this project read it end to end and vouches for it. | Used normally. |
| `instructor-verified` | An ME 300 instructor or TA confirmed it. | The only status that should be treated as course-authoritative. |
| `stub` | Synthesised from `taxonomy.yml` alone. **There is no course material behind it at all** — it is a title and a slot. | Flagged as a placeholder, never as AI-drafted "from the course files". |

These five are the enum, in `lib/kb.js`'s `CARD_STATUSES`, in gate 10 of `scripts/kb/validate.mjs`
and in the badge that `public/browse.js` renders. The KB-1 design document froze a shorter list
(`auto | reviewed | instructor-verified`); `draft` and `stub` were added because `auto` would have
mislabelled both — a hand-written card as pipeline output, and an empty slot as drafted from files
that do not exist. If you add a sixth value, change all four places.

**Today, nothing in this repository is `instructor-verified`.** The course, unit and
misconception cards that exist were hand-transcribed or hand-written by this project. That is
what `reviewed` and `draft` are saying, and neither of them means "correct for your section".

If you teach or TA ME 300 and you check a card: change its `status` to `instructor-verified` and
commit. That single-word edit is the highest-value contribution anyone can make to this
repository.

---

## Correcting a card — the no-clobber rule

**Your edit wins. Permanently. The pipeline will not overwrite it.**

That promise needs a mechanism, and here it is. When the AI pipeline writes into a card, it
wraps what it wrote in a pair of comment markers with a fingerprint of the text:

```html
<!-- kb:auto start field=description hash=sha256:9f2c1a… gen=deepseek-flash@v3 -->
Entropy balance for a closed system, including the entropy generation term.
<!-- kb:auto end -->
```

Next time it runs, it re-fingerprints whatever is between those markers. If the fingerprint still
matches, nobody touched it and it may be replaced. **If the fingerprint has changed, a human
edited it — so the pipeline leaves it completely alone** and puts its proposed wording in the
pull-request description as a suggestion instead. Your sentence stays.

So, in practice:

- **To fix something:** edit it and commit. That is all. You do not need to touch the markers.
- **To freeze something forever:** delete the two marker lines around it. Text with no markers is
  human-owned and the pipeline may only add new blocks elsewhere in the file.
- **A card with no markers at all** — like every card currently in this folder — is entirely
  hand-written and the pipeline will not rewrite any of it.
- **Cards at `status: reviewed` or `instructor-verified` are never rewritten**, markers or no
  markers. If the source file behind one changes, the card is marked `stale: true` and the pull
  request says so, and a human decides.

The exact byte-level fingerprint rule lives in `scripts/kb/write-cards.mjs`, which is the only
thing that computes it. Do not compute one by hand.

---

## How a card reaches the live tutor

```
  you upload a course file            you edit a card in GitHub
  to agent/raw-course-files/                         │
          │                                   │
          ▼                                   │
  GitHub Action (the only step that uses an   │
  LLM) drafts cards on a kb/auto-<sha> branch │
  and opens a PULL REQUEST ────────────────┐  │
          │                                │  │
   a human reviews the diff and merges ◄───┘  │
          │                                   │
          ▼                                   ▼
        ┌──────────── main branch ────────────┐
        │                                     │
        ▼                                     │
  Vercel build runs scripts/build-knowledge.mjs
  (deterministic, offline, NO LLM calls)
        │
        ▼
  build/knowledge-index.json  →  the live tutor
```

Two things about that diagram are deliberate:

1. **The pull request is the only thing standing between a language model and what the tutor
   believes.** It is not automated and it is not going to be. Read the diff.
2. **The build never calls an AI.** A redeploy with no API key produces exactly the same index.
   If a card is wrong on the live site, it is wrong in this folder, and you can see why.

---

## A complete card, annotated

This is an equation card — the kind where the fields matter most. Nothing in `equations/` yet
looks like this, because no course files have been uploaded; it is here as the shape to copy.

````markdown
---
id: eq:steady-flow-energy-single-stream          # unique, kind-prefixed, never reused
kind: equation
title: Steady-flow energy equation, single stream
description: >-                                  # ONE line. Kelvin sees this before opening
  First law for a steady-flow device with one inlet and one exit, in rate form,
  including kinetic and potential energy terms.
parent: topic:t24-energy-conservation-open-system-steady-flow
unit: unit:u3-mass-and-first-law-closed-systems
status: auto                                     # an AI drafted this; nobody has read it
audience: both
priority: 0.9
symbols: [Q_dot, W_dot, m_dot, h, V, z, g]       # every entry must exist in symbols.md
valid_when:                                      # ← the field that stops wrong answers.
  - steady-state                                 #   Values come from taxonomy.yml only.
  - steady-flow
  - single-inlet-single-exit
  - control-volume
invalid_when:
  - transient                                    # a filling or emptying tank
  - closed-system                                # use the closed-system first law instead
derives_from: eq:general-energy-balance-cv
specializes_to:
  - eq:nozzle-energy-balance                     # same equation, more terms deleted
  - eq:throttle-isenthalpic
misconceptions:
  - misc:m12-boundary-flow-and-shaft-work-confused
sources:
  - path: lectures/lec24-open-system-steady-flow.pptx    # a real file in agent/raw-course-files/
    slides: [8, 9, 10]                                  # so a student can check in one click
generated:
  model: deepseek-v4-pro
  prompt_version: v3
  at: '2026-09-20T14:02:11Z'
---

# Steady-flow energy equation, single stream

<!-- kb:auto start field=body hash=sha256:4b91e0… gen=deepseek-v4-pro@v3 -->

$$\dot{Q} - \dot{W} = \dot{m}\left[(h_e - h_i) + \frac{\mathcal{V}_e^2 - \mathcal{V}_i^2}{2} + g(z_e - z_i)\right]$$

Everything entering the control volume per unit time leaves it per unit time, so no energy
accumulates inside. Enthalpy rather than internal energy appears because the flow work needed to
push mass across the inlet and exit is already folded into $h = u + Pv$ — do not add it again.

<!-- kb:auto end -->

## Reading the assumptions

Steady means nothing at a point inside changes with time. It does **not** mean the device is in
equilibrium — see `misc:m03-steady-state-vs-equilibrium`.
````

Three things to notice:

- The **`description`** is what makes the card findable. Say what is inside *and* when to reach
  for it. A description that only names the equation is a card that never gets opened.
- **`valid_when` / `invalid_when`** are why this schema exists at all. A student who applies a
  right equation under wrong assumptions gets a plausible number and no warning.
- The body between the markers was written by an AI. The section after `kb:auto end` was not, and
  will never be touched.

---

## Where this design came from

The layered structure — a tiny always-loaded map, then one-line descriptions, then card bodies,
then raw source text — is Anthropic's [Agent Skills progressive-disclosure
contract](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
applied to course content instead of instructions. It is a well-designed convention, not a
benchmarked technique: nobody has published evidence that it makes a tutor teach better, and we
have not measured it here either. What it definitely does is keep the prompt small and make every
claim traceable to a file and a page.

The misconception cards are built on [a 2025 ASEE systematic literature
review](https://peer.asee.org/systematic-literature-review-on-the-common-misconceptions-in-thermodynamics-fluid-mechanics-and-heat-transfer.pdf)
of 32 studies, which supplies the primary/secondary tiering and the three primary
thermodynamics misconceptions. The probes and repair moves in those cards are ours and are not
from the review.

The course spine comes from [Penn State's published sample ME 300
syllabus](https://www.me.psu.edu/assets/docs/sample-syllabus/ME-300.pdf), retrieved 2026-09-17.
Only its structure was transcribed — no prose was copied and the PDF is not in this repository.
**It is a sample.** The live section may differ in dates, instructor, ordering and possibly
textbook edition, and every card derived from it says so.
