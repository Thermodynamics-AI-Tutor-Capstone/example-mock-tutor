# Student uploads

Students can attach their own files to a chat with the 📎 button, by dragging them anywhere onto
the chat, or by pasting a screenshot into the message box: photos of handwritten work,
screenshots of a problem, PDFs, Word or PowerPoint files. Kelvin never reads the file directly.
Every upload is turned into **Markdown with LaTeX math** once, when it arrives, and that Markdown
is what the tutor reads.

| File | How it becomes Markdown | Student asked to check it? |
|---|---|---|
| Word, PowerPoint, text, Markdown, CSV | Extracted in code, no AI. Exact and instant. | No, but they can still open and edit it. |
| PDF | Each page with real text is extracted in code. Each page **without** text (a scan, or photos saved as a PDF) is rendered to an image and read by the vision model, like a photo. Up to 15 scanned pages per PDF. | **Yes, if any page was scanned.** Those pages are labelled "scanned — read from the image". |
| Photo, screenshot (PNG, JPG, WEBP, GIF) | Read by the vision model named in [`settings.yml`](settings.yml), using [`transcription-prompt.md`](transcription-prompt.md). | **Yes.** The review window opens automatically. |

**Why students check it:** the vision model is good but not perfect, especially on handwriting and
diagrams. If it misreads $h_2$ as $h_1$, a tutor that diagnoses mistakes would "find" an error the
student never made. So the transcription is shown next to the original, spots the model wasn't
sure about are marked **`[?]`**, and the student fixes them before (or after) sending.

**What Kelvin sees:** a short list of the chat's attachments (name, type, whether the student has
checked it). It reads one with the `read_attachment` tool
([`../tools/read_attachment.yml`](../tools/read_attachment.yml)). If the student edits an
attachment later, Kelvin uses the new version from the next message on.

**Where files go:** the Markdown is stored with the conversation in the database. The original file
is kept in a private Vercel Blob store (a local folder when running on your machine), visible only
to the student who uploaded it, through the app. Uploads never go into `raw-course-files/` or the
knowledge brain.

## Tuning

- **[`transcription-prompt.md`](transcription-prompt.md):** the instructions the vision model gets.
  Safe to edit. Keep the rule that it transcribes exactly, mistakes included, and never corrects
  or solves anything.
- **[`settings.yml`](settings.yml):** which model reads images, the size limit, and which file types
  are allowed.

> Uploads of students' own homework are student data, in the same category as their chats.
