// Keep the problem and draft in place while consulting the source tables.
(() => {
  'use strict';
  const app = document.getElementById('app');
  const button = document.getElementById('propertyTablesBtn');
  const dock = document.getElementById('propertyTableDock');
  const close = document.getElementById('closePropertyTables');
  const frame = document.getElementById('propertyTableFrame');
  const input = document.getElementById('input');
  const status = document.getElementById('propertyDockStatus');
  if (!app || !button || !dock || !close || !frame || !input) return;
  function setOpen(open) {
    if (open && !frame.hasAttribute('src')) frame.src = frame.dataset.src;
    dock.hidden = !open;
    app.classList.toggle('tables-open', open);
    button.setAttribute('aria-expanded', String(open));
    (open ? close : button).focus();
  }
  button.addEventListener('click', () => setOpen(dock.hidden));
  close.addEventListener('click', () => setOpen(false));
  dock.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
  });
  window.addEventListener('message', (event) => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow || dock.hidden) return;
    const message = event.data;
    if (message?.type !== 'kelvin:property-table-selection' || typeof message.text !== 'string') return;
    const text = message.text.trim();
    if (!text || text.length > 2000 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const before = start > 0 && input.value[start - 1] !== '\n' ? '\n' : '';
    const after = end < input.value.length && input.value[end] !== '\n' ? '\n' : '';
    input.setRangeText(before + text + after, start, end, 'end');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    status.textContent = 'Added to your draft';
    if (matchMedia('(max-width: 1050px)').matches) setOpen(false);
    input.focus();
  });
})();
