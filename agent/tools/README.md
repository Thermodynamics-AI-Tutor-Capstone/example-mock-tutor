# Tools

A **tool** is something Kelvin can *do* during a reply rather than say: search the course
materials, open a knowledge card, record where a student is on the help ladder. The model decides
when to call one, based on what this folder tells it.

Every tool is **two files**:

| File | What it is | Who edits it |
|---|---|---|
| `agent/tools/<name>.yml` (this folder) | What the **model** sees: the description that decides when it gets used, its parameters, the status line students see while it runs, and any API keys it needs. | Anyone, in GitHub's web editor. |
| [`lib/tools/<name>.js`](../../lib/tools/) | What the **server** runs. | A developer. It touches the database and API keys, so changes should be reviewed. |

**The description matters more than it looks.** It is the model's only guide to *when* a tool
fits. If Kelvin calls a tool at the wrong moment, or never calls it, rewrite the description:
say what the tool is for, when to use it, and when *not* to.

## The tools

| Tool | What it does | Offered when |
|---|---|---|
| `search_course_files` | Keyword search over knowledge cards and course-file passages together. | there are cards or files |
| `open_card` | Opens one knowledge card by id (unit, topic, equation, misconception…). | there are cards |
| `list_cards` | Lists cards of a kind or under a parent, without opening them. | there are cards |
| `read_course_file` | Reads the text of an uploaded course file from a given chunk. | files have been uploaded |
| `list_course_files` | Lists every uploaded course file, and the ones that couldn't be read. | files have been uploaded |
| `load_skill` | Loads the full instructions of one of the style's skills. | the style has skills |
| `update_tutoring_state` | Records the problem's name, the rung used, confirmed and repaired misconceptions, the assumption ledger, and whether the problem is finished or parked. It **cannot** raise the help ceiling, add attempts or reset the ladder: the server does those from Jev's read (`../policy.yml`). | always, for styles that list it |
| `note_student_assumption` | Records a durable hypothesis about what this student knows ("shaky on h vs u"), shown as a draft in their later conversations. A later note on the same thing replaces the earlier one. | the student is signed in |
| `record_practice_result` | Records one practice or re-test attempt (correct? independent?) and returns the updated mastery record, tracked in code with Bayesian Knowledge Tracing (textbook defaults, not fitted). | the student is signed in |

Which **style** gets which tool is set in that style's `style.yml` (`tools:`), in
[`../styles/`](../styles/README.md).

## The `.yml` file

```yaml
name: open_card                  # must match the file name and lib/tools/open_card.js
description: >-                  # what the model reads when deciding whether to call it
  Open one knowledge card by id and read it. ...
status: "Opening card: {id}"     # shown to the student while it runs; {id} is filled from the call
status_default: Opening a card   # used when the call is missing a value the status needs
parameters:                      # JSON Schema, written as YAML
  type: object
  properties:
    id:
      type: string
      description: The card id, for example "topic:t12-entropy-balance-closed".
  required: [id]
requires:
  env: [SOME_SERVICE_API_KEY]    # optional: env vars the tool needs; if one is unset, every style
                                 # that lists the tool shows as unavailable, with the reason
enabled: true                    # optional: false hides the tool from every style
```

**Safe to edit freely:** `description`, the parameter `description`s, `status`, `status_default`,
`enabled`.

**Needs matching code:** adding, renaming or removing a parameter. The code in `lib/tools/`
reads those parameters, so change both together.

## Adding a tool

1. Write `agent/tools/<name>.yml`.
2. Write `lib/tools/<name>.js`: `export default async function run(args, ctx) { … }` returns
   whatever the model should see (an object, sent as JSON). Optional exports:
   `available(ctx)` (hide the tool when it can't help), `parameters(schema, ctx)` (adjust the
   schema per reply) and `status(args)` (a status line that needs logic).
3. Register it with one line in [`lib/tools/index.js`](../../lib/tools/index.js).
4. List it under `tools:` in the styles that should have it.
5. Run `npm run agent:validate`. It fails if the `.yml`, the code or the registration is missing,
   if the schema is malformed, or if a status line names a parameter that doesn't exist. The same
   check runs in GitHub Actions on every push.

API keys go in Vercel's environment variables (and in `.env` locally), never in this folder.
