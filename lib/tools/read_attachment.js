import { getAttachmentRow, attachmentOut } from '../attachments.js';

export const available = (ctx) => Array.isArray(ctx.attachments) && ctx.attachments.length > 0;

export default async function run(args, ctx) {
  const id = String(args.id || '').trim();
  const known = (ctx.attachments || []).find((a) => a.id === id || a.filename === id);
  if (!known) {
    const ids = (ctx.attachments || []).map((a) => `${a.id} (${a.filename})`).join(', ');
    return { error: `No attachment "${id}" in this conversation. Available: ${ids || 'none'}.` };
  }
  // Re-read so an edit the student saved during this reply is picked up.
  const row = (await getAttachmentRow(known.id, ctx.userId)) || known;
  if (row.status === 'processing') return { error: 'This upload is still being read. Try again in a moment.' };
  const out = attachmentOut(row, { withMarkdown: true });
  const note =
    row.status === 'needs_review'
      ? 'Automatic transcription of an image; the student has NOT checked it yet. Confirm any [?] value before relying on it.'
      : row.source === 'edited'
        ? 'The student checked and edited this transcription.'
        : row.status === 'confirmed'
          ? 'The student checked this transcription.'
          : 'Extracted from a typed file; the text is exact, but layout and figures are not included.';
  return { id: out.id, name: out.name, kind: out.kind, status: out.status, uncertain_spots: out.uncertain, note, markdown: out.markdown };
}
