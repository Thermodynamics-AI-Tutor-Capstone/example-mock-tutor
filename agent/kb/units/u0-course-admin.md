---
id: unit:u0-course-admin
kind: unit
title: 'Unit 0 — Course administration'
description: >-
  Where syllabus material lands: grading, schedule and exam dates, homework policy, logistics
  and office hours. EMPTY until the team uploads a syllabus — no date or policy is known here.
parent: course:me300
unit: unit:u0-course-admin
status: reviewed
audience: both
priority: 0.95
prerequisites: []
precedes: []
objectives: []
equations: []
symbols: []
misconceptions: []
examples: []
items: []
sources:
  - url: https://www.me.psu.edu/assets/docs/sample-syllabus/ME-300.pdf
    title: >-
      ME 300 sample syllabus — read only to see WHICH administrative sections exist. No date,
      deadline, grade weight or policy sentence was transcribed from it into this brain.
    retrieved: '2026-09-17'
generated: null
---

# Unit 0 — Course administration

> **This card contains no course policy, because none has been uploaded.** Everything under it
> comes from whatever the team puts in `agent/knowledge/` — a syllabus PDF, a Canvas export, an
> announcement. Until that happens these four topic ids are an empty shelf: the ids exist so that
> an uploaded syllabus has somewhere to go, and an id existing is **not** the same as knowing the
> answer.

## Why this unit exists at all

The other five units are the course's own exam blocks, transcribed from the published sample
syllabus. This one is ours. Before it existed there was no id in `taxonomy.yml` that an
administrative section of a syllabus could classify to, so every such section came out of the
classifier as `unassigned` and produced no card — the pipeline silently dropped exactly the
material students ask about most.

Course-administration questions are also the ones where a wrong answer is unambiguously a lie to a
student. Getting an entropy explanation slightly wrong is a teaching problem; telling somebody the
wrong exam date, or inventing a late policy, costs them marks. So this material gets a card path,
and that path starts by being honest that it is empty.

## What Kelvin must do until a syllabus is uploaded

- **Never state a date, deadline, exam time, grade weight, late penalty, drop deadline, office
  hour, room, instructor or TA name** from this unit. None of that is in here.
- Say plainly that nothing about this course's administration has been added to Kelvin AI yet, and
  point the student at Canvas or the course staff.
- The 50/50 homework/exam split recorded in `taxonomy.yml` is from the **published sample
  syllabus**, not this section, and must be labelled that way if it is ever mentioned at all.
- Do not treat the dates in `taxonomy.yml`'s lecture schedule as this section's schedule. They are
  the sample syllabus's Fall 2025 dates, kept only so uploaded files can be aligned by date.

## Topics

| Topic | What an upload would put here |
|---|---|
| `topic:t00a-syllabus-and-grading` | Grading weights, grade scale, academic-integrity and accommodation statements |
| `topic:t00b-schedule-and-exam-dates` | The class schedule, exam dates and times, submission deadlines |
| `topic:t00c-homework-policy` | Homework format, how and where to submit, late work, regrade requests |
| `topic:t00d-logistics-and-office-hours` | Meeting time and room, instructor and TA contact, office hours, which tools are used |

## How material gets in here

Drop the file into `agent/knowledge/` (for example `syllabus/me300-fall-2026.pdf`) and run the
ingest pipeline. The classifier will place its administrative sections onto the four ids above,
and the cards written from them will carry `status: auto` — drafted by a model, not checked by an
instructor — until a human reviews them. Kelvin must say so when it relies on one.
