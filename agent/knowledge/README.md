# Course materials — drop files here

Everything in this folder becomes searchable by Kelvin AI. The tutor can list, search, and read
these files, and names the file it used in its answer.

> [!WARNING]
> **This repository is PUBLIC. Anything uploaded here is visible to the whole internet.**
> Do **not** upload copyrighted course materials, exams, solutions, or anything containing student
> information unless the repository has first been made private. Check with the instructor before
> uploading any of their materials.

## How to add course materials

1. Open this folder on GitHub — or one of the sub-folders below (for example `syllabus/`).
2. Click **Add file → Upload files** (top right of the file list).
3. Drag your files onto the page (or click **choose your files**).
4. Scroll down, write a short message such as "Add week 3 lecture notes", and click
   **Commit changes**.

That's it. The site rebuilds its search index on the next deploy (see
[agent/README.md](../README.md#how-changes-reach-the-live-site)).

To remove or replace a file: open it, click the **⋯** menu (or the trash icon) → **Delete file**,
then commit. Upload the new version the same way as above.

## Supported formats

| Works | Notes |
|---|---|
| `.pdf` | Must contain real text. A PDF that is entirely scanned (pictures of text) is skipped; scanned pages inside an otherwise normal PDF are silently left out. |
| `.docx` | Word documents |
| `.pptx` | PowerPoint slides: slide text and speaker notes (not text inside images or charts) |
| `.md`, `.txt` | Plain text |
| `.html`, `.htm` | Tags are stripped |
| `.csv`, `.json` | Read as text |

**Skipped** (listed with a reason, not an error):

- PDFs with no extractable text — usually scans; they need OCR first.
- Any other file type, including images (`.png`, `.jpg`), `.doc`, `.ppt`, `.xlsx`.
- Files larger than 25 MB.
- `README.md` files and files whose names start with `.` are ignored entirely.

## Did it work?

- **GitHub Actions:** open the **Actions** tab → the latest deploy run → its summary lists every
  indexed file and every skipped file with the reason.
- **Live site:** `GET /api/knowledge` (needs the app passcode) returns the same list.
- **Locally:** `npm run knowledge` prints every indexed and skipped file. A running local server
  only picks up new files after a restart.

## Suggested sub-folders

You can also drop files straight into this folder or make your own sub-folders — any layout works.

| Folder | Put here |
|---|---|
| [`syllabus/`](syllabus/README.md) | Syllabus, schedule, course policies |
| [`lectures/`](lectures/README.md) | Lecture notes and slides |
| [`assignments/`](assignments/README.md) | Homework and project handouts (not solutions) |
| [`reference/`](reference/README.md) | Formula sheets, notation guides, reference tables you are allowed to share |
| [`other/`](other/README.md) | Anything that doesn't fit above |
