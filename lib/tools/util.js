export const STATUS_TEXT_MAX = 80;

export function shorten(text, max = STATUS_TEXT_MAX) {
  const flat = String(text).replace(/\s+/g, ' ').trim();
  const chars = Array.from(flat);
  return chars.length <= max ? flat : chars.slice(0, max - 1).join('') + '…';
}
