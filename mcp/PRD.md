# Kelvin MCP pilot — product requirements

## Goal

Give ME 300 students on Claude Free a remote MCP connector that supplies course-specific context and teaching moves from Kelvin's existing, reviewable knowledge cards. Let a student explicitly save learning evidence and see their own summary. Give instructors only cohort trends, not student chat transcripts.

## Pilot scope

- One HTTPS Streamable HTTP endpoint at `/mcp`, hosted on Lance's Mac mini and reachable by Claude's cloud service.
- Per-person bearer tokens in Claude custom connector request headers. Tokens map to student or instructor roles; they are stored only as hashes. No shared class token.
- Deterministic discovery: search card metadata, then fetch a specific course, unit, topic, or misconception card. Expose selected teaching skills on demand. No Jev, calculator, answer bank, or general chat model in the MCP.
- Explicit `record_learning` tool: only when the student asks to save a short account of what they worked on. DeepSeek classifies it against known topics and misconceptions; the server stores the student's original statement, model labels, and timestamp. The model receives no student identifier.
- `my_learning` shows only the authenticated student's records and counts. `course_trends` is instructor-only, reports aggregates for at least five distinct students, and never returns names or original statements.
- Course cards are from Dr. O'Connor's Summer 2023 sample section. Every response must identify that provenance and the card's review status. Current dates, grading and policy come from the student's own Canvas section.

## Out of scope

- Automatic logging of Claude chats or claims about activity the MCP cannot see.
- Student roster or Penn State SSO integration; token provisioning is a pilot operation.
- Inference that a student holds a misconception without their confirmation. Labels are hypotheses.
- Instructor access to individual student histories, assessments, exam answers, and raw course files.

## Acceptance checks

1. Anonymous requests to `/mcp` fail; valid student token connects with Claude-compatible MCP tools.
2. Search returns metadata only; `get_card` loads a named card. Hidden audiences and assessment items are never returned.
3. A student can save a learning statement and retrieve only their own history. DeepSeek failure saves the statement as pending without fabricating a classification.
4. Instructor trends suppress cohorts with fewer than five students and contain no statements or identities.
5. A Mac mini service survives restart; Tailscale Funnel uses port 8443 so the existing private service on port 443 stays private.

## Data handling and limits

Provision users with opaque IDs. Store only explicit learning statements, classification results, and timestamps. Do not log bearer tokens or request bodies. Data files remain on the Mac mini, outside the repository. The pilot operator can revoke a token and delete a student's records by ID. No course deployment should be represented as Penn State-approved until the project's research and course data approvals cover this flow.
