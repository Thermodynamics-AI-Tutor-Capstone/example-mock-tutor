# Kelvin MCP pilot — product requirements

## Goal

Give anyone with a Claude Free account a remote MCP connector that supplies course-specific context and teaching moves from Kelvin's existing, reviewable knowledge cards. Let anyone create an OAuth student account without an invite so saved learning evidence stays attached across sessions. Give instructors cohort trends and named records only when a student enables sharing.

## Pilot scope

- One HTTPS Streamable HTTP endpoint at `/mcp`, exposed on port 443 through a Vercel gateway that forwards to Lance's Mac mini.
- Public read-only course and teaching tools need no sign-in at `/mcp`. The authenticated `/mcp/account` endpoint uses OAuth authorization code with PKCE. Claude discovers the authorization server and sends a scoped access token after the student signs in.
- Any student can create an account with a self-entered name and password. The server assigns a random stable account ID. Passwords and tokens are stored as hashes. No course invite, Penn State identity check, or roster enrollment is required.
- Deterministic discovery: search card metadata, then fetch a specific course, unit, topic, or misconception card. Expose selected teaching skills on demand. No Jev, calculator, answer bank, or general chat model in the MCP.
- Explicit `record_learning` tool: only when the student asks to save a short account of what they worked on. DeepSeek classifies it against known topics and misconceptions; the server stores the student's original statement, model labels, and timestamp. The model receives no student identifier.
- `my_learning` shows only the authenticated student's records and counts. A student can enable or disable instructor sharing. `course_trends` is instructor-only, reports aggregates for at least five distinct students, and never returns names or original statements. `shared_students` and `student_learning` show a named student record to an authenticated instructor only while that student has enabled sharing.
- A Vercel-hosted professor dashboard offers a clearly labeled synthetic demo behind `username` / `password`. A separate instructor OAuth account shows live class trends and only the named student records whose owners enabled sharing. The dashboard uses a fixed-route Vercel function for its API calls to the Mac mini.
- Course and topic cards derive from real Penn State ME 300 Engineering Thermodynamics materials in Dr. O'Connor's Summer 2023 Canvas section. Misconception cards derive from cited education research. Responses should identify the source and term; `studyCardStatus` identifies the derived note's drafting status, not whether the course is real. Current dates, grading, and policy come from the student's own Canvas section.

## Out of scope

- Automatic logging of Claude chats or claims about activity the MCP cannot see.
- Penn State SSO integration and automatic roster import.
- Inference that a student holds a misconception without their confirmation. Labels are hypotheses.
- Instructor access to individual student histories, assessments, exam answers, and raw course files.

## Acceptance checks

1. Anonymous requests to `/mcp` can connect and use only public read-only tools. The `/mcp/account` endpoint challenges unauthenticated requests and completes OAuth sign-in with PKCE for a self-registered student. No invite is required.
2. Search returns metadata only; `get_card` loads a named card. Hidden audiences and assessment items are never returned.
3. A student can save a learning statement and retrieve only their own history. DeepSeek failure saves the statement as pending without fabricating a classification.
4. Instructor trends suppress cohorts with fewer than five students and contain no statements or identities. Named records are returned only when the student has enabled sharing; turning it off blocks later reads.
5. A Mac mini service survives restart; Tailscale Funnel uses port 8443 so the existing private service on the Mac mini's port 443 stays private. The Vercel gateway exposes the connector and OAuth endpoints on public port 443 for Claude.
6. The Vercel dashboard demo login reveals sample data only. An operator-created instructor can sign in through OAuth, load live trends, and open a named record only while its student has enabled sharing.

## Data handling and limits

Assign self-registered students random stable IDs. Store only explicit learning statements, classification results, timestamps, and the student's instructor-sharing choice. Student names are self-entered and must not be treated as verified. Do not log passwords, tokens, or request bodies. Data files remain on the Mac mini, outside the repository. The pilot operator can disable an account and delete a student's records by ID. No course deployment should be represented as Penn State-approved until the project's research and course data approvals cover this flow.
