# Interactive property tables

This experiment adds a property-table workspace to the Guided tutor. Open **Property tables**
in the chat header, or open `/property-tables.html` for the full viewer. On a wide desktop,
the table workspace stays beside the conversation and its whiteboard. On a narrow screen,
the table workspace fills the available area; closing it returns to the same draft and chat.

## Source fidelity

The initial course library uses the three user-supplied water-property PDFs:
`SaturationTables.pdf` (5 pages), `SubcooledLiquidTables.pdf` (3 pages), and
`SuperheatedVaporTables.pdf` (12 pages). They contain scanned images rather than searchable
numeric text. The benchmark preserves the original printed numbers in page images and puts
cell, row and column interaction regions over them. The value inspector enlarges the actual
source crop; it does not silently replace a scanned number with an OCR guess.

The source's units must remain page-specific. In particular, pressure is printed in kPa on
some saturation pages and MPa on others. Temperature is K. The final sections of the
superheated-vapor PDF include explicitly labeled supercritical tables and must retain those
labels. A filename alone is not sufficient evidence of phase.

Only explicitly verified example values are available as numeric text. Other cells remain
source-image readouts. This initial scan viewer therefore does not yet provide a fully
transcribed, searchable, screen-reader-readable numeric database. It is independent of the
existing server-side property calculator: no OCR values feed calculations or student records.

## Interaction and teaching scope

- Hover or keyboard focus identifies an individual numeric cell and its row/column context.
- Pin a cell with a click, tap or keyboard action to inspect it without incidental hover changes.
- The manual guide demonstrates the progression from table selection to state row, property
  column and their intersection. Its external pointer highlights the current step.
- In the embedded view, **Use in chat** adds a source-qualified reference to the student's
  draft. It does not submit a message. The host accepts this request only from its own
  same-origin table iframe and rejects malformed payloads.

The guide is authored and controlled by the student. It is not automatic AI narration,
interpolation instruction, or an assertion that an unspecified phase can be inferred from a
single saturation temperature. The same source identity and cell coordinates provide a
foundation for a later tutor-controlled whiteboard pointer.

For that future integration, the viewer exposes `KelvinPropertyTables.getSelection()` and
`selectCell({ datasetId, pageId, sectionId, rowId, columnKey, pin })`, with source identity,
image coordinates, units, and a `verified` flag. Untranscribed cells return `value: null`.
Unknown identifiers are rejected. A `kelvin:property-cell` DOM event reports a changed selection;
these hooks currently drive no automatic tutor or narration behavior.

## Course assets and publication

The public repository already keeps original course files in a separate private ingestion
repository. Rendered source pages and their interaction manifest under `public/property-tables/`
are consequently ignored here. The local viewer is usable after importing the supplied PDFs;
the code can be reviewed without distributing those course scans through public GitHub.
An installation without course assets must show an explicit missing-library state.

Before hosted rollout, install the verified assets through the team's private course-content
pipeline and configure access for the intended course. New books or tables require a reviewed
import and source/units/geometry checks; arbitrary PDFs are not assumed to share this layout.

## Verification

The installed benchmark contains 20 source pages, 35 table sections, 1,011 rows and
7,830 selectable cell regions. The 34 text equivalents used in example rows were independently
reviewed against the printed source. All other numeric readings use the original image crop.
The first rows at saturation in the subcritical vapor sections and the final saturation rows
in the relevant compressed-liquid sections have distinct phase labels.

Install using Python with Pillow and Poppler available:

```powershell
python scripts/import-property-tables.py --source-dir "C:\path\to\course-pdfs" --pdftoppm "C:\path\to\pdftoppm.exe"
npm run tables:test
npm run tables:browser
```

The importer checks the source PDFs against the reviewed editions' SHA-256 hashes before using
their geometry. `--reuse-images` also verifies the known rendered-image hashes. The data test
checks image identity, units, phase boundaries, example values and nonoverlapping cell geometry.
It explicitly reports a skip when private assets are absent. Browser tests require the installed
library plus Playwright/Chrome; `PLAYWRIGHT_MODULE` and `CHROME_EXECUTABLE` overrides are supported.

The browser suite exercises real viewer and chat code with controlled authentication responses,
without model calls. It covers source-aware selection, pinned state, keyboard and touch,
guide steps, layout, missing assets, and draft insertion without submission. Source geometry
and example-value checks are separate from model evaluation. Passing them demonstrates a
working table interaction benchmark, not improved student learning.
