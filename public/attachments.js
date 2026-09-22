// Student uploads in the chat: the 📎 button, the tray of files waiting to be sent, chips on sent
// messages, and the review window where the student checks and edits the Markdown Kelvin will read.
(function () {
  'use strict';

  const TYPES = {
    pdf: 'doc', docx: 'doc', pptx: 'doc', txt: 'doc', md: 'doc', csv: 'doc',
    png: 'image', jpg: 'image', jpeg: 'image', webp: 'image', gif: 'image', heic: 'image', heif: 'image',
  };
  const MAX_BYTES = 4_000_000;
  const MAX_SIDE = 2000;
  const UNSURE_RE = /\[\?\]|\[unreadable\]/g;

  let hooks = null;
  let pending = []; // attachments uploaded to the current chat but not yet sent
  const $ = (id) => document.getElementById(id);

  function extOf(name) {
    return (String(name).toLowerCase().match(/\.([a-z0-9]+)$/) || [])[1] || '';
  }

  function statusText(a) {
    if (a.uploading) return a.kind === 'image' || TYPES[extOf(a.name)] === 'image' ? 'Reading your image…' : 'Reading…';
    if (a.error) return a.error;
    if (a.status === 'needs_review') return a.uncertain ? `Check it · ${a.uncertain} unsure` : 'Check it';
    if (a.status === 'confirmed') return a.source === 'edited' ? 'Edited ✓' : 'Checked ✓';
    return 'Ready';
  }

  function chip(a, { removable }) {
    const el = document.createElement('div');
    if (a.id) el.dataset.id = a.id;
    el.className = 'att-chip' + (a.status === 'needs_review' ? ' needs-review' : '') + (a.error ? ' failed' : '') + (a.uploading ? ' busy' : '');
    const icon = document.createElement('span');
    icon.className = 'att-icon';
    icon.textContent = TYPES[extOf(a.name)] === 'image' ? '🖼' : '📄';
    const text = document.createElement('button');
    text.type = 'button';
    text.className = 'att-open';
    text.disabled = Boolean(a.uploading || a.error);
    text.title = a.error ? a.error : 'Open to check or edit what Kelvin reads';
    const name = document.createElement('span');
    name.className = 'att-name';
    name.textContent = a.name;
    const st = document.createElement('span');
    st.className = 'att-status';
    st.textContent = statusText(a);
    text.append(name, st);
    text.addEventListener('click', () => openReview(a.id));
    el.append(icon, text);
    if (removable) {
      const x = document.createElement('button');
      x.type = 'button';
      x.className = 'att-remove';
      x.setAttribute('aria-label', 'Remove ' + a.name);
      x.textContent = '×';
      x.addEventListener('click', () => remove(a));
      el.appendChild(x);
    }
    return el;
  }

  function renderTray() {
    const tray = $('attTray');
    tray.innerHTML = '';
    tray.hidden = pending.length === 0;
    for (const a of pending) tray.appendChild(chip(a, { removable: !a.uploading }));
    hooks.onChange();
  }

  // Chips shown under a sent user message.
  function chipsFor(list) {
    const wrap = document.createElement('div');
    wrap.className = 'att-sent';
    for (const a of list || []) wrap.appendChild(chip(a, { removable: false }));
    return wrap;
  }

  async function remove(a) {
    pending = pending.filter((p) => p !== a);
    renderTray();
    if (a.id) {
      try { await hooks.api('DELETE', '/api/attachments/' + a.id); } catch (e) {}
    }
  }

  // Photos straight off a phone are large; shrink them in the browser so they fit the upload limit
  // and cost fewer tokens to read. Other files are sent as they are.
  async function prepare(file) {
    const ext = extOf(file.name);
    if (TYPES[ext] !== 'image') return { blob: file, name: file.name };
    let bitmap;
    try {
      bitmap = await createImageBitmap(file);
    } catch (e) {
      if (ext === 'heic' || ext === 'heif') throw new Error('This browser can’t open HEIC photos. Export it as JPEG, or take a screenshot of it.');
      throw new Error('Couldn’t open that image.');
    }
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= 1_500_000 && ext !== 'heic' && ext !== 'heif') return { blob: file, name: file.name };
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    return { blob, name: file.name.replace(/\.[^.]+$/, '') + '.jpg' };
  }

  async function uploadOne(file) {
    const ext = extOf(file.name);
    const item = { name: file.name, uploading: true };
    pending.push(item);
    renderTray();
    try {
      if (!TYPES[ext]) throw new Error(`Can’t read .${ext || '?'} files`);
      const { blob, name } = await prepare(file);
      if (blob.size > MAX_BYTES) throw new Error(`Too big (${(blob.size / 1e6).toFixed(1)} MB; limit 4 MB)`);
      item.name = name;
      const convId = await hooks.ensureConversation();
      const res = await hooks.apiFetch(`/api/attachments?conversation=${encodeURIComponent(convId)}&name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: blob,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.error) || 'Upload failed (' + res.status + ')');
      Object.assign(item, data, { uploading: false });
      renderTray();
      if (data.status === 'needs_review') openReview(data.id);
    } catch (e) {
      item.uploading = false;
      item.error = e.message;
      renderTray();
    }
  }

  function pick() {
    $('attInput').click();
  }

  // ── the review window ───────────────────────────────────────────────────────────────────────

  let current = null; // the attachment open in the review window

  function highlightUnsure(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const hits = [];
    while (walker.nextNode()) if (/\[\?\]|\[unreadable\]/.test(walker.currentNode.nodeValue)) hits.push(walker.currentNode);
    for (const node of hits) {
      const frag = document.createDocumentFragment();
      const parts = node.nodeValue.split(/(\[\?\]|\[unreadable\])/);
      for (const p of parts) {
        if (p === '[?]' || p === '[unreadable]') {
          const mark = document.createElement('mark');
          mark.className = 'unsure';
          mark.textContent = p === '[?]' ? '?' : 'unreadable';
          mark.title = 'Kelvin wasn’t sure here. Check it against the original.';
          frag.appendChild(mark);
        } else if (p) frag.appendChild(document.createTextNode(p));
      }
      node.parentNode.replaceChild(frag, node);
    }
  }

  function renderPreview() {
    const text = $('attEditor').value;
    const pv = $('attPreview');
    pv.innerHTML = hooks.renderMarkdown(text);
    highlightUnsure(pv);
    const n = (text.match(UNSURE_RE) || []).length;
    $('attUnsure').textContent = n ? `${n} spot${n === 1 ? '' : 's'} Kelvin wasn’t sure about` : 'No unsure spots';
    $('attUnsure').classList.toggle('none', n === 0);
    $('attNext').disabled = n === 0;
    $('attDirty').hidden = text === current.markdown;
  }

  function nextUnsure() {
    const ed = $('attEditor');
    const from = ed.selectionEnd || 0;
    UNSURE_RE.lastIndex = 0;
    const text = ed.value;
    let m;
    let hit = null;
    while ((m = UNSURE_RE.exec(text))) {
      if (m.index >= from) { hit = m; break; }
      if (!hit) hit = m; // wrap around to the first one
    }
    if (!hit) return;
    ed.focus();
    ed.setSelectionRange(hit.index, hit.index + hit[0].length);
    // Scroll the selection into view: measure with a hidden copy is overkill; approximate by line.
    const line = text.slice(0, hit.index).split('\n').length;
    ed.scrollTop = Math.max(0, (line - 3) * 22);
  }

  async function openReview(id) {
    let a;
    try {
      a = await hooks.api('GET', '/api/attachments/' + id);
    } catch (e) {
      return;
    }
    current = a;
    const isImage = TYPES[extOf(a.name)] === 'image';
    $('attTitle').textContent = a.name;
    $('attBadge').textContent =
      a.status === 'needs_review' ? 'Read automatically: please check it' : a.source === 'edited' ? 'Edited by you' : a.status === 'confirmed' ? 'Checked by you' : 'Extracted from your file';
    $('attBadge').className = 'att-badge ' + (a.status === 'needs_review' ? 'warn' : 'ok');
    $('attHelp').hidden = !isImage;
    const orig = $('attOriginal');
    orig.innerHTML = '';
    if (isImage) {
      const img = document.createElement('img');
      img.src = '/api/attachments/' + a.id + '/file';
      img.alt = 'Your upload: ' + a.name;
      const zoom = document.createElement('a');
      zoom.href = img.src;
      zoom.target = '_blank';
      zoom.rel = 'noopener';
      zoom.appendChild(img);
      orig.appendChild(zoom);
    } else {
      const card = document.createElement('div');
      card.className = 'att-doc';
      card.innerHTML = '<div class="att-doc-icon">📄</div>';
      const t = document.createElement('div');
      t.textContent = a.name;
      const link = document.createElement('a');
      link.href = '/api/attachments/' + a.id + '/file';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Open the original';
      card.append(t, link);
      orig.appendChild(card);
    }
    $('attEditor').value = a.markdown;
    $('attConfirm').textContent = a.status === 'needs_review' ? 'Looks right' : 'Save';
    $('attModal').hidden = false;
    document.body.classList.add('modal-open');
    setTab(isImage ? 'text' : 'text');
    renderPreview();
    setTimeout(() => (a.status === 'needs_review' && (a.markdown.match(UNSURE_RE) || []).length ? nextUnsure() : $('attConfirm').focus()), 50);
  }

  function closeReview() {
    $('attModal').hidden = true;
    document.body.classList.remove('modal-open');
    current = null;
  }

  function setTab(which) {
    $('attModal').dataset.tab = which;
    for (const b of document.querySelectorAll('.att-tab')) b.setAttribute('aria-selected', b.dataset.tab === which ? 'true' : 'false');
  }

  async function save() {
    if (!current) return;
    const btn = $('attConfirm');
    btn.disabled = true;
    $('attError').textContent = '';
    try {
      const updated = await hooks.api('PATCH', '/api/attachments/' + current.id, { markdown: $('attEditor').value, confirmed: true });
      for (const p of pending) if (p.id === updated.id) Object.assign(p, updated);
      renderTray();
      // Chips under already-sent messages show the new status too.
      for (const el of document.querySelectorAll(`.att-sent .att-chip[data-id="${updated.id}"]`)) {
        el.classList.remove('needs-review');
        const st = el.querySelector('.att-status');
        if (st) st.textContent = statusText(updated);
      }
      hooks.onAttachmentSaved(updated);
      closeReview();
    } catch (e) {
      $('attError').textContent = 'Couldn’t save: ' + e.message;
    }
    btn.disabled = false;
  }

  function buildModal() {
    const m = document.createElement('div');
    m.id = 'attModal';
    m.className = 'att-modal';
    m.hidden = true;
    m.innerHTML = `
      <div class="att-dialog" role="dialog" aria-modal="true" aria-labelledby="attTitle">
        <header class="att-head">
          <div class="att-head-text"><h2 id="attTitle"></h2><span id="attBadge" class="att-badge"></span></div>
          <button type="button" class="att-x" id="attClose" aria-label="Close">×</button>
        </header>
        <p id="attHelp" class="att-help">This is what Kelvin will read. Compare it with your original and fix anything it got wrong, especially the highlighted spots. Math is written between <code>$…$</code>.</p>
        <div class="att-tabs" role="tablist">
          <button type="button" class="att-tab" data-tab="original" role="tab">Original</button>
          <button type="button" class="att-tab" data-tab="text" role="tab">What Kelvin reads</button>
        </div>
        <div class="att-body">
          <section class="att-pane att-pane-original" aria-label="Your original file"><div id="attOriginal" class="att-original"></div></section>
          <section class="att-pane att-pane-text" aria-label="Transcription">
            <div class="att-toolbar">
              <span id="attUnsure" class="att-unsure"></span>
              <button type="button" id="attNext" class="att-small">Next unsure spot ↓</button>
            </div>
            <textarea id="attEditor" class="att-editor" spellcheck="false" aria-label="Edit the text Kelvin reads"></textarea>
            <div class="att-preview-label">Preview</div>
            <div id="attPreview" class="att-preview markdown"></div>
          </section>
        </div>
        <footer class="att-foot">
          <span id="attDirty" class="att-dirty" hidden>Unsaved changes</span>
          <span id="attError" class="att-error" role="alert"></span>
          <button type="button" class="att-btn secondary" id="attCancel">Cancel</button>
          <button type="button" class="att-btn" id="attConfirm">Looks right</button>
        </footer>
      </div>`;
    document.body.appendChild(m);
    let t = null;
    $('attEditor').addEventListener('input', () => { clearTimeout(t); t = setTimeout(renderPreview, 120); });
    $('attNext').addEventListener('click', nextUnsure);
    $('attClose').addEventListener('click', closeReview);
    $('attCancel').addEventListener('click', closeReview);
    $('attConfirm').addEventListener('click', save);
    for (const b of m.querySelectorAll('.att-tab')) b.addEventListener('click', () => setTab(b.dataset.tab));
    m.addEventListener('mousedown', (e) => { if (e.target === m) closeReview(); });
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeReview();
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') save();
    });
  }

  window.KelvinAttachments = {
    init(h) {
      hooks = h;
      buildModal();
      $('attBtn').addEventListener('click', pick);
      $('attInput').addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        e.target.value = '';
        files.forEach(uploadOne);
      });
    },
    pendingIds: () => pending.filter((a) => a.id && !a.error && !a.uploading).map((a) => a.id),
    pendingList: () => pending.filter((a) => a.id && !a.error && !a.uploading),
    busy: () => pending.some((a) => a.uploading),
    hasPending: () => pending.some((a) => a.id && !a.error),
    setPending(list) {
      pending = (list || []).map((a) => Object.assign({}, a));
      renderTray();
    },
    clear() {
      pending = [];
      renderTray();
    },
    chipsFor,
    openReview,
    upload: (files) => Array.from(files || []).forEach(uploadOne),
  };
})();
