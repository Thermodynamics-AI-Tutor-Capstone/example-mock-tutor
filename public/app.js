(async function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const app = $('app');
  const convListEl = $('convList');
  const thread = $('thread');
  const scroller = $('scroller');
  const composer = $('composer');
  const input = $('input');
  const sendBtn = $('sendBtn');
  const scrollDownBtn = $('scrollDown');
  const emptySlot = $('emptyComposerSlot');
  const bottomSlot = $('bottomComposerSlot');

  const state = {
    conversations: [],
    styles: [],
    activeStyle: null,
    routedStyle: null,
    currentId: null,
    streaming: false,
    controller: null,
    loadToken: 0,
  };

  const ICON_COPY = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>';
  const ICON_CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>';
  const ICON_TRASH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';

  const PURIFY_CFG = {
    ADD_TAGS: ['semantics', 'annotation', 'math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'msqrt', 'mtext', 'mspace', 'mover', 'munder', 'mtable', 'mtr', 'mtd', 'mstyle', 'mpadded', 'mphantom', 'menclose', 'mroot', 'msubsup', 'munderover'],
    ADD_ATTR: ['encoding', 'aria-hidden', 'xmlns', 'mathvariant', 'stretchy', 'fence', 'separator', 'lspace', 'rspace', 'columnalign', 'rowspacing', 'columnspacing', 'displaystyle', 'scriptlevel', 'accent', 'accentunder', 'minsize', 'maxsize', 'width', 'height', 'depth', 'voffset'],
  };

  function renderMarkdown(text, opts) {
    const codes = [];
    const maths = [];
    let s = String(text || '');

    s = s.replace(/```[\s\S]*?(?:```|$)/g, (m) => {
      codes.push(m);
      return 'CODETOKEN' + (codes.length - 1) + 'END';
    });
    s = s.replace(/`[^`\n]+`/g, (m) => {
      codes.push(m);
      return 'CODETOKEN' + (codes.length - 1) + 'END';
    });

    const addMath = (tex, display) => {
      maths.push({ tex, display });
      return 'MATHTOKEN' + (maths.length - 1) + 'END';
    };
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => addMath(t, true));
    s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => addMath(t, true));
    s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => addMath(t, false));
    s = s.replace(/(?<!\\)\$(?=[^\s$])([^$\n]*?[^\s\\$])\$(?!\d)/g, (_, t) => addMath(t, false));

    const restoreCode = (str) => str.replace(/CODETOKEN(\d+)END/g, (_, i) => codes[+i]);
    s = restoreCode(s);

    let html;
    try {
      html = marked.parse(s, { gfm: true, breaks: Boolean(opts && opts.breaks) });
    } catch (e) {
      html = '<p>' + escapeHtml(s) + '</p>';
    }

    html = html.replace(/MATHTOKEN(\d+)END/g, (_, i) => {
      const m = maths[+i];
      if (!m) return '';
      const tex = restoreCode(m.tex);
      try {
        return katex.renderToString(tex, { displayMode: m.display, throwOnError: false });
      } catch (e) {
        return escapeHtml(m.display ? '$$' + tex + '$$' : '$' + tex + '$');
      }
    });

    return DOMPurify.sanitize(html, PURIFY_CFG);
  }
  window.renderMarkdown = renderMarkdown;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function copyText(text, btn, labelHtml) {
    const done = () => {
      if (!btn) return;
      const prev = labelHtml != null ? labelHtml : btn.innerHTML;
      btn.innerHTML = btn.dataset.kind === 'code' ? ICON_CHECK + '<span>Copied!</span>' : ICON_CHECK;
      setTimeout(() => { btn.innerHTML = prev; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
    done();
  }

  function decorateCode(container) {
    container.querySelectorAll('pre').forEach((pre) => {
      if (pre.parentElement && pre.parentElement.classList.contains('code-wrap')) return;
      const code = pre.querySelector('code');
      let lang = '';
      if (code) {
        const cls = Array.from(code.classList).find((c) => c.startsWith('language-'));
        if (cls) lang = cls.slice(9);
      }
      const wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      const head = document.createElement('div');
      head.className = 'code-head';
      const label = document.createElement('span');
      label.textContent = lang || 'code';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.kind = 'code';
      const btnHtml = ICON_COPY + '<span>Copy</span>';
      btn.innerHTML = btnHtml;
      btn.addEventListener('click', () => copyText((code || pre).textContent, btn, btnHtml));
      head.append(label, btn);
      pre.parentNode.insertBefore(wrap, pre);
      wrap.append(head, pre);
    });
  }

  function setMarkdown(el, text) {
    el.innerHTML = renderMarkdown(text);
    decorateCode(el);
  }

  const PASSCODE_KEY = 'thermoTutorPasscode';
  const gate = $('gate');
  const gateForm = $('gateForm');
  const gateInput = $('gateInput');
  const gateError = $('gateError');
  const gateBtn = $('gateBtn');
  let memPasscode = '';

  function getPasscode() {
    try { return localStorage.getItem(PASSCODE_KEY) || ''; } catch (e) { return ''; }
  }
  function setPasscode(value) {
    try { localStorage.setItem(PASSCODE_KEY, value); } catch (e) {}
    memPasscode = value;
  }

  function isPasscodeError(e) {
    return !!(e && e.code === 'passcode_required');
  }

  function showGate() {
    if (!gate.hidden) return;
    gate.hidden = false;
    gateError.hidden = true;
    gateInput.classList.remove('invalid');
    gateInput.value = '';
    gateBtn.disabled = false;
    gateInput.focus();
  }

  function hideGate() {
    gate.hidden = true;
    gateError.hidden = true;
    gateInput.classList.remove('invalid');
    gateInput.value = '';
  }

  async function apiFetch(url, opts) {
    const o = Object.assign({}, opts || {});
    const headers = Object.assign({}, o.headers || {});
    const code = memPasscode || getPasscode();
    if (code) headers['x-app-passcode'] = code;
    o.headers = headers;
    const res = await fetch(url, o);
    if (res.status === 401) {
      let data = null;
      try { data = await res.clone().json(); } catch (e) {}
      if (data && data.error === 'auth_required') {
        location.replace('/login?next=' + encodeURIComponent(location.pathname + location.hash));
        const err = new Error('auth_required');
        err.status = 401;
        err.code = 'passcode_required';
        throw err;
      }
      if (data && data.error === 'passcode_required') {
        showGate();
        const err = new Error('passcode_required');
        err.status = 401;
        err.code = 'passcode_required';
        throw err;
      }
    }
    return res;
  }

  async function api(method, url, body) {
    const opts = { method, headers: {} };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const res = await apiFetch(url, opts);
    if (res.status === 204) return null;
    let data = null;
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) {
      const err = new Error((data && data.error) || ('HTTP ' + res.status));
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function renderSidebar() {
    convListEl.innerHTML = '';
    for (const c of state.conversations) {
      const item = document.createElement('div');
      item.className = 'conv-item' + (c.id === state.currentId ? ' active' : '');
      item.dataset.id = c.id;
      const t = document.createElement('div');
      t.className = 't';
      t.textContent = c.title || 'New chat';
      t.title = c.title || 'New chat';
      const del = document.createElement('button');
      del.className = 'del';
      del.type = 'button';
      del.title = 'Delete';
      del.setAttribute('aria-label', 'Delete chat');
      del.innerHTML = ICON_TRASH;
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(c.id);
      });
      item.addEventListener('click', () => {
        closeMobileSidebar();
        if (c.id !== state.currentId) location.hash = '#/c/' + c.id;
      });
      item.append(t, del);
      convListEl.appendChild(item);
    }
  }

  async function refreshList() {
    let ok = true;
    try {
      state.conversations = await api('GET', '/api/conversations') || [];
    } catch (e) {
      ok = false;
      if (!isPasscodeError(e)) console.error(e);
    }
    renderSidebar();
    return ok;
  }

  function updateTitle(conv) {
    document.title = conv && conv.title && conv.title !== 'New chat' ? conv.title + ' | Kelvin AI' : 'Kelvin AI';
  }

  async function deleteConversation(id) {
    try {
      await api('DELETE', '/api/conversations/' + id);
    } catch (e) {
      if (isPasscodeError(e)) return;
      if (e.status !== 404) { console.error(e); return; }
    }
    state.conversations = state.conversations.filter((c) => c.id !== id);
    if (id === state.currentId) {
      if (state.controller) state.controller.abort();
      goEmpty(true);
    } else {
      renderSidebar();
    }
  }

  function placeComposer() {
    const target = app.classList.contains('has-thread') ? bottomSlot : emptySlot;
    if (composer.parentElement !== target) target.appendChild(composer);
  }

  function setThreadMode(on) {
    app.classList.toggle('has-thread', on);
    placeComposer();
    updateScrollBtn();
  }

  function goEmpty(pushUrl) {
    state.loadToken++;
    state.currentId = null;
    if (window.KelvinAttachments) window.KelvinAttachments.clear();
    state.routedStyle = null;
    if (state.styles.length) {
      state.activeStyle = defaultStyleId();
      renderStyleButton();
    }
    thread.innerHTML = '';
    setThreadMode(false);
    renderSidebar();
    updateTitle(null);
    if (pushUrl && location.hash) history.pushState(null, '', location.pathname + location.search);
    input.focus();
  }

  function addUserMessage(content, attachments) {
    const row = document.createElement('div');
    row.className = 'msg user';
    if (attachments && attachments.length) row.appendChild(window.KelvinAttachments.chipsFor(attachments));
    const b = document.createElement('div');
    b.className = 'bubble';
    b.textContent = content;
    row.appendChild(b);
    thread.appendChild(row);
    return row;
  }

  function addAssistantMessage(content, finished) {
    const row = document.createElement('div');
    row.className = 'msg assistant';
    const md = document.createElement('div');
    md.className = 'md';
    row.appendChild(md);
    row._text = content || '';
    if (content) setMarkdown(md, content);
    thread.appendChild(row);
    if (finished) addActions(row);
    return row;
  }

  function addActions(row) {
    if (row.querySelector('.actions')) return;
    const bar = document.createElement('div');
    bar.className = 'actions';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = 'Copy';
    btn.setAttribute('aria-label', 'Copy');
    btn.innerHTML = ICON_COPY;
    btn.addEventListener('click', () => copyText(row._text || '', btn, ICON_COPY));
    bar.appendChild(btn);
    row.appendChild(bar);
  }

  function showError(row, message) {
    const err = document.createElement('div');
    err.className = 'err';
    err.textContent = message || 'Something went wrong.';
    row.appendChild(err);
  }

  async function openConversation(id) {
    const token = ++state.loadToken;
    state.currentId = id;
    renderSidebar();
    thread.innerHTML = '';
    let conv;
    try {
      conv = await api('GET', '/api/conversations/' + id);
    } catch (e) {
      if (token !== state.loadToken) return;
      if (isPasscodeError(e)) {
        state.currentId = null;
        renderSidebar();
        return;
      }
      if (e.status === 404) {
        state.conversations = state.conversations.filter((c) => c.id !== id);
        goEmpty(true);
      } else {
        setThreadMode(true);
        const row = addAssistantMessage('', false);
        showError(row, 'Could not load conversation: ' + e.message);
      }
      return;
    }
    if (token !== state.loadToken) return;
    window.KelvinAttachments.setPending(conv.pendingAttachments || []);
    state.routedStyle = conv.routedStyle || null;
    if (state.styles.length) {
      state.activeStyle = styleById(conv.style) ? conv.style : 'auto';
      renderStyleButton();
    }
    updateTitle(conv);
    const msgs = conv.messages || [];
    const replyRows = new Map();
    for (const m of msgs) {
      if (m.role === 'user') addUserMessage(m.content, m.attachments);
      else replyRows.set(m.id, addAssistantMessage(m.content, true));
    }
    setThreadMode(msgs.length > 0);
    scrollToBottom();
    input.focus();
    if (showingDecisions() && replyRows.size) {
      api('GET', '/api/conversations/' + id + '/decisions')
        .then((rows) => {
          if (token !== state.loadToken) return;
          for (const d of rows || []) {
            const row = replyRows.get(Number(d.message_id));
            if (row && d.policy && d.policy.summary) showDecision(row, d.policy.summary);
          }
        })
        .catch(() => {});
    }
  }

  // ---- "Show Kelvin's decisions" (a testing switch in Settings) ----
  const INTENT_WORDS = {
    check_work: 'showing their work',
    stuck_on_problem: 'stuck on a problem',
    concept: 'asking about an idea',
    fact: 'asking for a fact',
    wants_answer: 'asking for the answer',
    practice: 'asking for practice',
    teach_back: 'explaining it back',
    reply: 'answering Kelvin',
    course_admin: 'asking about the course',
    off_topic: 'off topic',
  };
  function showingDecisions() {
    return Boolean(state.me && state.me.profile && state.me.profile.show_decisions);
  }
  function decisionLines(d) {
    const source = d.jev
      ? '⚡ Jev' + (d.latencyMs ? ' · ' + (d.latencyMs / 1000).toFixed(2) + ' s' : '')
      : d.reason === 'Jev is turned off in settings'
        ? '⌨ Keyword rules (Jev off)'
        : '⌨ Keyword rules (Jev unavailable' + (d.reason ? ': ' + d.reason : '') + ')';
    const read = [];
    if (d.intent) read.push(INTENT_WORDS[d.intent] || d.intent);
    if (d.attemptCounted) read.push('own work ✓');
    if (d.completeAttempt) read.push('complete attempt ✓');
    if (d.wantsAnswer) read.push('wants the answer');
    if (d.stalled) read.push('stalling');
    if (d.frustrated) read.push('frustrated');
    if (d.givingUp) read.push('giving up → park');
    const m = d.misconception || { action: 'none', candidates: [] };
    let misc;
    if (m.action === 'repair') misc = 'Misconception: ' + m.candidates[0].title + ' (' + m.candidates[0].p + ') → repair it';
    else if (m.action === 'confirm') misc = 'Possible misconception: ' + m.candidates.map((c) => c.title + ' (' + c.p + ')').join(', ') + ' → ask one question first';
    else misc = d.jev ? 'No misconception in this message' : 'No misconception read (needs Jev)';
    const style = d.style ? (d.style.icon ? d.style.icon + ' ' : '') + d.style.name + (d.auto ? '' : ' (pinned)') : '—';
    return [
      source + ' — ' + (read.length ? read.join(' · ') : 'nothing detected'),
      'Style: ' + style + ' · Help ceiling: rung ' + d.ceiling + ' of ' + d.maxRung + (d.rungName ? ' (' + d.rungName + ')' : ''),
      misc,
    ];
  }
  function showDecision(row, d) {
    if (!row || !d) return;
    const old = row.querySelector('.decision-note');
    if (old) old.remove();
    const note = document.createElement('div');
    note.className = 'decision-note' + (d.jev ? ' is-jev' : '');
    for (const line of decisionLines(d)) {
      const div = document.createElement('div');
      div.textContent = line;
      note.appendChild(div);
    }
    row.insertBefore(note, row.firstChild);
  }

  // ---- Tutoring-style picker (like ChatGPT's model selector) ----
  const STYLE_KEY = 'kelvinStyle';
  const styleBtn = $('styleBtn');
  const styleMenu = $('styleMenu');

  function savedStyle() {
    try { return localStorage.getItem(STYLE_KEY) || ''; } catch (e) { return ''; }
  }
  function rememberStyle(id) {
    try { localStorage.setItem(STYLE_KEY, id); } catch (e) {}
  }
  function styleById(id) {
    return state.styles.find((s) => s.id === id) || null;
  }
  function defaultStyleId() {
    const fromProfile = state.me && state.me.profile ? styleById(state.me.profile.default_style) : null;
    if (fromProfile && fromProfile.available) return fromProfile.id;
    const saved = styleById(savedStyle());
    if (saved && saved.available) return saved.id;
    const def = state.styles.find((s) => s.default && s.available) || state.styles.find((s) => s.available);
    return def ? def.id : null;
  }
  function renderStyleButton() {
    const s = styleById(state.activeStyle);
    const routed = s && s.auto ? styleById(state.routedStyle) : null;
    $('styleBtnIcon').textContent = s ? s.icon : '';
    $('styleBtnName').textContent = s ? (routed ? s.name + ' · ' + (routed.icon ? routed.icon + ' ' : '') + routed.name : s.name) : '';
    if (routed) styleBtn.title = 'Auto — Kelvin chose ' + routed.name + ' for this conversation. ' + routed.description;
    else styleBtn.title = s ? s.name + ' — ' + s.description : 'Choose a tutoring style';
  }
  function renderStyleMenu() {
    styleMenu.innerHTML = '';
    const head = document.createElement('div');
    head.className = 'style-menu-head';
    head.textContent = 'Tutoring style';
    styleMenu.appendChild(head);
    state.styles.forEach((s, i) => {
      if (i > 0 && state.styles[i - 1].auto && !s.auto) {
        const sep = document.createElement('div');
        sep.className = 'style-menu-sep';
        sep.textContent = 'Or pin one approach';
        styleMenu.appendChild(sep);
      }
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'style-item';
      item.setAttribute('role', 'option');
      item.dataset.id = s.id;
      const selected = s.id === state.activeStyle;
      item.setAttribute('aria-selected', selected ? 'true' : 'false');
      if (!s.available) item.setAttribute('aria-disabled', 'true');
      const icon = document.createElement('span');
      icon.className = 'si-icon';
      icon.textContent = s.icon || '•';
      const text = document.createElement('span');
      text.className = 'si-text';
      const name = document.createElement('span');
      name.className = 'si-name';
      name.textContent = s.name;
      const desc = document.createElement('span');
      desc.className = 'si-desc';
      desc.textContent = s.available ? s.description : 'Unavailable: ' + (s.unavailableReason || 'not configured');
      text.append(name, desc);
      const check = document.createElement('span');
      check.className = 'si-check';
      if (selected) check.innerHTML = ICON_CHECK;
      item.append(icon, text, check);
      item.addEventListener('click', () => chooseStyle(s.id));
      styleMenu.appendChild(item);
    });
  }
  function openStyleMenu() {
    if (!state.styles.length) return;
    renderStyleMenu();
    styleMenu.hidden = false;
    styleBtn.setAttribute('aria-expanded', 'true');
    const current = styleMenu.querySelector('[aria-selected="true"]') || styleMenu.querySelector('.style-item');
    if (current) current.focus();
  }
  function closeStyleMenu(refocus) {
    if (styleMenu.hidden) return;
    styleMenu.hidden = true;
    styleBtn.setAttribute('aria-expanded', 'false');
    if (refocus) styleBtn.focus();
  }
  function addStyleNote(text, before) {
    if (!thread.children.length) return;
    const note = document.createElement('div');
    note.className = 'style-note';
    note.textContent = text;
    if (before && before.parentNode === thread) thread.insertBefore(note, before);
    else thread.appendChild(note);
  }
  async function chooseStyle(id) {
    const s = styleById(id);
    if (!s || !s.available) return;
    closeStyleMenu(true);
    rememberStyle(id);
    if (state.me && state.me.profile && state.me.profile.default_style !== id) {
      state.me.profile.default_style = id;
      window.KelvinAccount.saveProfile({ default_style: id }).catch(() => {});
    }
    if (id === state.activeStyle) return;
    state.activeStyle = id;
    renderStyleButton();
    if (!state.currentId) return;
    const convId = state.currentId;
    try {
      await api('PATCH', '/api/conversations/' + convId, { style: id });
      const c = state.conversations.find((x) => x.id === convId);
      if (c) c.style = id;
      if (state.currentId === convId) addStyleNote('Switched to ' + s.name + ' — applies to new messages.');
    } catch (e) {
      addStyleNote('Could not switch style: ' + e.message);
    }
  }
  async function loadStyles() {
    try {
      state.styles = (await api('GET', '/api/styles')) || [];
    } catch (e) {
      state.styles = [];
    }
    if (!state.activeStyle || !styleById(state.activeStyle)) state.activeStyle = defaultStyleId();
    renderStyleButton();
  }
  styleBtn.addEventListener('click', () => (styleMenu.hidden ? openStyleMenu() : closeStyleMenu(false)));
  styleMenu.addEventListener('keydown', (e) => {
    const items = Array.from(styleMenu.querySelectorAll('.style-item'));
    const i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); closeStyleMenu(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    else if (e.key === 'Tab') closeStyleMenu(false);
  });
  document.addEventListener('mousedown', (e) => {
    if (!styleMenu.hidden && !$('stylePicker').contains(e.target)) closeStyleMenu(false);
  });

  function parseHash() {
    const m = location.hash.match(/^#\/c\/([^/?#]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function route() {
    const id = parseHash();
    if (id === state.currentId) return;
    if (state.streaming && state.controller) state.controller.abort();
    if (id) openConversation(id);
    else goEmpty(false);
  }

  function nearBottom() {
    return scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 120;
  }
  function scrollToBottom(smooth) {
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }
  function updateScrollBtn() {
    const show = app.classList.contains('has-thread') && scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight > 200;
    scrollDownBtn.classList.toggle('show', show);
  }

  function autoGrow() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 200) + 'px';
  }

  function updateSendBtn() {
    if (state.streaming) {
      sendBtn.classList.add('stop');
      sendBtn.disabled = false;
      sendBtn.setAttribute('aria-label', 'Stop');
    } else {
      sendBtn.classList.remove('stop');
      const files = window.KelvinAttachments;
      sendBtn.disabled = (input.value.trim() === '' && !files.hasPending()) || files.busy();
      sendBtn.setAttribute('aria-label', 'Send');
    }
  }

  // Creates the conversation on first use (an upload can come before the first message) without
  // triggering a reload of the thread: currentId is set before the hash changes.
  async function ensureConversation() {
    if (state.currentId) return state.currentId;
    const conv = await api('POST', '/api/conversations', state.activeStyle ? { style: state.activeStyle } : {});
    state.loadToken++;
    state.currentId = conv.id;
    state.conversations = [{ id: conv.id, title: conv.title, style: conv.style, createdAt: conv.createdAt, updatedAt: conv.updatedAt }]
      .concat(state.conversations.filter((c) => c.id !== conv.id));
    renderSidebar();
    location.hash = '#/c/' + conv.id;
    return conv.id;
  }

  async function send(text) {
    const files = window.KelvinAttachments;
    const typed = (text != null ? text : input.value).trim();
    if (state.streaming || files.busy()) return;
    const sentFiles = text != null ? [] : files.pendingList();
    const content = typed || (sentFiles.length ? 'Please take a look at what I attached.' : '');
    if (!content) return;

    state.streaming = true;
    input.value = '';
    autoGrow();
    updateSendBtn();

    let convId = state.currentId;
    if (!convId) {
      try {
        const conv = await api('POST', '/api/conversations', state.activeStyle ? { style: state.activeStyle } : {});
        convId = conv.id;
        state.loadToken++;
        state.currentId = convId;
        state.conversations = [{ id: conv.id, title: conv.title, style: conv.style, createdAt: conv.createdAt, updatedAt: conv.updatedAt }]
          .concat(state.conversations.filter((c) => c.id !== conv.id));
        renderSidebar();
        location.hash = '#/c/' + convId;
      } catch (e) {
        state.streaming = false;
        input.value = content;
        autoGrow();
        updateSendBtn();
        if (isPasscodeError(e)) return;
        setThreadMode(true);
        const row = addAssistantMessage('', false);
        showError(row, 'Could not create conversation: ' + e.message);
        return;
      }
    }

    setThreadMode(true);
    addUserMessage(content, sentFiles);
    if (sentFiles.length) window.KelvinAttachments.clear();
    const row = addAssistantMessage('', false);
    const md = row.querySelector('.md');
    const dot = document.createElement('span');
    dot.className = 'thinking';
    row.appendChild(dot);
    scrollToBottom();

    const steps = [];
    let statusEl = null;
    let statusLabel = null;
    const showStatus = (message) => {
      const msg = String(message || '').trim();
      if (!msg || !row.isConnected) return;
      const past = pastTense(msg);
      if (steps[steps.length - 1] !== past) steps.push(past);
      if (gotDelta) {
        renderSteps();
        return;
      }
      dot.remove();
      if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.className = 'tool-status live';
        statusEl.setAttribute('role', 'status');
        statusEl.setAttribute('aria-live', 'polite');
        const spin = document.createElement('span');
        spin.className = 'tool-spin';
        statusLabel = document.createElement('span');
        statusLabel.className = 'tool-label';
        statusEl.append(spin, statusLabel);
        row.insertBefore(statusEl, md);
      }
      statusLabel.textContent = msg;
      statusLabel.title = msg;
      if (nearBottom()) scrollToBottom();
      updateScrollBtn();
    };
    const renderSteps = () => {
      if (!row.isConnected) return;
      if (!steps.length) {
        if (statusEl) { statusEl.remove(); statusEl = null; }
        return;
      }
      if (!statusEl) {
        statusEl = document.createElement('div');
        row.insertBefore(statusEl, md);
      }
      statusEl.className = 'tool-status steps';
      statusEl.removeAttribute('aria-live');
      statusEl.removeAttribute('role');
      const text = steps.join(' · ');
      statusEl.textContent = text;
      statusEl.title = text;
      statusLabel = null;
    };

    const controller = new AbortController();
    state.controller = controller;
    let text2 = '';
    let rafPending = false;
    let gotDelta = false;

    const flush = () => {
      rafPending = false;
      if (!row.isConnected) return;
      const stick = nearBottom();
      setMarkdown(md, text2);
      if (stick) scrollToBottom();
      updateScrollBtn();
    };
    const schedule = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(flush);
      }
    };

    const handleEvent = (ev) => {
      if (ev.type === 'title') {
        const c = state.conversations.find((x) => x.id === convId);
        if (c) c.title = ev.title;
        renderSidebar();
        if (state.currentId === convId) updateTitle({ title: ev.title });
      } else if (ev.type === 'delta') {
        if (!gotDelta) { gotDelta = true; dot.remove(); renderSteps(); }
        text2 += ev.content || '';
        row._text = text2;
        schedule();
      } else if (ev.type === 'style') {
        if (ev.auto && state.currentId === convId) {
          const previous = state.routedStyle;
          state.routedStyle = ev.id;
          renderStyleButton();
          if (previous && previous !== ev.id) addStyleNote('Kelvin switched to ' + (ev.icon ? ev.icon + ' ' : '') + ev.name + ' for this part.', row);
        }
      } else if (ev.type === 'decision') {
        showDecision(row, ev);
      } else if (ev.type === 'status') {
        showStatus(ev.message);
      } else if (ev.type === 'error') {
        dot.remove();
        showError(row, ev.message);
      }
    };

    try {
      const res = await apiFetch('/api/conversations/' + convId + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ content, attachments: sentFiles.map((a) => a.id) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        let msg = 'HTTP ' + res.status;
        try { const j = await res.json(); if (j && j.error) msg = j.error; } catch (e) {}
        throw new Error(msg);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
        let idx;
        while ((idx = buf.indexOf('\n\n')) !== -1) {
          const chunk = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            try { handleEvent(JSON.parse(line.slice(6))); } catch (e) { console.warn('bad event', line); }
          }
        }
      }
      buf += decoder.decode();
      for (const line of buf.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        try { handleEvent(JSON.parse(line.slice(6))); } catch (e) {}
      }
    } catch (e) {
      if (isPasscodeError(e)) {
        dot.remove();
        showError(row, 'Passcode required. Enter the team passcode and try again.');
      } else if (e.name !== 'AbortError') {
        dot.remove();
        showError(row, e.message || 'Network error');
      }
    } finally {
      dot.remove();
      if (!gotDelta) renderSteps();
      if (row.isConnected) {
        flush();
        if (text2) addActions(row);
      }
      state.streaming = false;
      state.controller = null;
      updateSendBtn();
      refreshList();
      if (row.isConnected) input.focus();
    }
  }

  const PAST_TENSE = { Searching: 'Searched', Reading: 'Read', Loading: 'Loaded', Listing: 'Listed', Looking: 'Looked', Checking: 'Checked', Opening: 'Opened', Fetching: 'Fetched', Running: 'Ran', Using: 'Used', Calling: 'Called' };
  function pastTense(msg) {
    const m = msg.match(/^(\S+)(.*)$/);
    const out = m && PAST_TENSE[m[1]] ? PAST_TENSE[m[1]] + m[2] : msg;
    return out.replace(/(?:\u2026|\.\.\.)$/, '');
  }

  function openMobileSidebar() { app.classList.add('mobile-open'); }
  function closeMobileSidebar() { app.classList.remove('mobile-open'); }
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

  $('closeSidebar').addEventListener('click', () => {
    if (isMobile()) closeMobileSidebar();
    else app.classList.add('collapsed');
  });
  $('openSidebar').addEventListener('click', () => {
    if (isMobile()) openMobileSidebar();
    else app.classList.remove('collapsed');
  });
  $('backdrop').addEventListener('click', closeMobileSidebar);

  const newChat = () => {
    closeMobileSidebar();
    if (state.streaming && state.controller) state.controller.abort();
    goEmpty(true);
  };
  $('newChatBtn').addEventListener('click', newChat);
  $('topNewChat').addEventListener('click', newChat);

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => send(chip.textContent));
  });

  composer.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.streaming) {
      if (state.controller) state.controller.abort();
      return;
    }
    send();
  });
  input.addEventListener('input', () => { autoGrow(); updateSendBtn(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      if (!state.streaming) send();
    }
  });

  scroller.addEventListener('scroll', updateScrollBtn, { passive: true });
  window.addEventListener('resize', updateScrollBtn);
  scrollDownBtn.addEventListener('click', () => scrollToBottom(true));

  window.addEventListener('hashchange', route);
  window.addEventListener('popstate', route);

  gateInput.addEventListener('input', () => {
    gateError.hidden = true;
    gateInput.classList.remove('invalid');
  });

  gateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = gateInput.value;
    if (!value || gateBtn.disabled) return;
    gateBtn.disabled = true;
    gateError.hidden = true;
    gateInput.classList.remove('invalid');
    setPasscode(value);
    let list;
    try {
      list = await api('GET', '/api/conversations');
    } catch (err) {
      gateBtn.disabled = false;
      gateError.textContent = isPasscodeError(err) ? 'Incorrect passcode' : ('Could not connect: ' + err.message);
      gateError.hidden = false;
      if (isPasscodeError(err)) gateInput.classList.add('invalid');
      gateInput.select();
      gateInput.focus();
      return;
    }
    gateBtn.disabled = false;
    hideGate();
    state.conversations = list || [];
    renderSidebar();
    state.currentId = null;
    const id = parseHash();
    if (id) openConversation(id);
    else goEmpty(false);
  });

  // ---- Signed-in user: sidebar row + menu ----
  const userBtn = $('userBtn');
  const userMenu = $('userMenu');
  function renderUser() {
    const name = (state.me.profile && state.me.profile.display_name) || state.me.user.name || state.me.user.email || 'Student';
    $('userName').textContent = name;
    $('userAvatar').textContent = window.KelvinAccount.initials(name, state.me.user.email);
    $('userMenuEmail').textContent = state.me.user.email || '';
  }
  function closeUserMenu() {
    userMenu.hidden = true;
    userBtn.setAttribute('aria-expanded', 'false');
  }
  userBtn.addEventListener('click', () => {
    userMenu.hidden = !userMenu.hidden;
    userBtn.setAttribute('aria-expanded', userMenu.hidden ? 'false' : 'true');
  });
  document.addEventListener('mousedown', (e) => {
    if (!userMenu.hidden && !userMenu.parentElement.contains(e.target)) closeUserMenu();
  });
  userMenu.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeUserMenu(); userBtn.focus(); } });
  $('signOutBtn').addEventListener('click', () => window.KelvinAccount.signOut());

  window.KelvinAttachments.init({
    api,
    apiFetch,
    renderMarkdown,
    ensureConversation,
    onChange: updateSendBtn,
    onAttachmentSaved: () => {},
  });

  placeComposer();
  updateSendBtn();
  const me = await window.KelvinAccount.requireSession();
  if (!me) return;
  state.me = me;
  renderUser();
  await loadStyles();
  const hashAtLoad = parseHash();
  refreshList().then((ok) => {
    if (!ok && !gate.hidden) return;
    // Only reopen the chat the page was loaded with. If the student has already started a new
    // one (e.g. by dropping a file before this list finished loading), reopening would reset it.
    if (hashAtLoad && state.currentId === null) openConversation(hashAtLoad);
    else if (!hashAtLoad) input.focus();
  });
})();
