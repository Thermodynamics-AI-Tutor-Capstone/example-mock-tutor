# Kelvin MCP pilot — product requirements

## Goal

Give anyone with a Claude Free account a remote MCP connector that supplies course-specific context and teaching moves from Kelvin's existing, reviewable knowledge cards. Give invited students a separate OAuth sign-in that attaches saved learning evidence to a stable course account. Give instructors cohort trends and named records only when a student enables sharing.

## Pilot scope

- One HTTPS Streamable HTTP endpoint at `/mcp`, hosted on Lance's Mac mini and reachable by Claude's cloud service.
- Public read-only course and teaching tools need no sign-in at `/mcp`. The authenticated `/mcp/account` endpoint uses OAuth authorization code with PKCE. Claude discovers the authorization server and sends a scoped access token after the student signs in.
- The course operator creates an invite tied to one course account ID and name, then distributes that invite to the intended person. The student claims it with a password. This verifies possession of the course-issued invite, not a Penn State identity. Invite and access token values are stored as hashes.
- Deterministic discovery: search card metadata, then fetch a specific course, unit, topic, or misconception card. Expose selected teaching skills on demand. No Jev, calculator, answer bank, or general chat model in the MCP.
- Explicit `record_learning` tool: only when the student asks to save a short account of what they worked on. DeepSeek classifies it against known topics and misconceptions; the server stores the student's original statement, model labels, and timestamp. The model receives no student identifier.
- `my_learning` shows only the authenticated student's records and counts. A student can enable or disable instructor sharing. `course_trends` is instructor-only, reports aggregates for at least five distinct students, and never returns names or original statements. `shared_students` and `student_learning` show a named student record to an authenticated instructor only while that student has enabled sharing.
- A Vercel-hosted professor dashboard offers a clearly labeled synthetic demo behind `username` / `password`. A separate instructor OAuth account shows live class trends and only the named student records whose owners enabled sharing. The dashboard uses a fixed-route Vercel function for its API calls to the Mac mini.
- Course cards are from Dr. O'Connor's Summer 2023 sample section. Every response must identify that provenance and the card's review status. Current dates, grading and policy come from the student's own Canvas section.

## Out of scope

- Automatic logging of Claude chats or claims about activity the MCP cannot see.
- Penn State SSO integration and automatic roster import; invite issuance is a pilot operation.
- Inference that a student holds a misconception without their confirmation. Labels are hypotheses.
- Instructor access to individual student histories, assessments, exam answers, and raw course files.

## Acceptance checks

1. Anonymous requests to `/mcp` can connect and use only public read-only tools. The `/mcp/account` endpoint challenges unauthenticated requests and completes OAuth sign-in with PKCE for an invited user.
2. Search returns metadata only; `get_card` loads a named card. Hidden audiences and assessment items are never returned.
3. A student can save a learning statement and retrieve only their own history. DeepSeek failure saves the statement as pending without fabricating a classification.
4. Instructor trends suppress cohorts with fewer than five students and contain no statements or identities. Named records are returned only when the student has enabled sharing; turning it off blocks later reads.
5. A Mac mini service survives restart; Tailscale Funnel uses port 8443 so the existing private service on port 443 stays private.
6. The Vercel dashboard demo login reveals sample data only. An invited instructor can sign in through OAuth, load live trends, and open a named record only while its student has enabled sharing.

## Data handling and limits

Provision invited users with stable course IDs. Store only explicit learning statements, classification results, timestamps, and the student's instructor-sharing choice. Do not log passwords, tokens, invites, or request bodies. Data files remain on the Mac mini, outside the repository. The pilot operator can disable an account and delete a student's records by ID. No course deployment should be represented as Penn State-approved until the project's research and course data approvals cover this flow.
