(function () {
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

  function renderMarkdown(text) {
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
      html = marked.parse(s, { gfm: true, breaks: false });
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

  async function api(method, url, body) {
    const opts = { method, headers: {} };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(url, opts);
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
    try {
      state.conversations = await api('GET', '/api/conversations') || [];
    } catch (e) {
      console.error(e);
    }
    renderSidebar();
  }

  function updateTitle(conv) {
    document.title = conv && conv.title && conv.title !== 'New chat' ? conv.title + ' | ThermoTutor' : 'ThermoTutor';
  }

  async function deleteConversation(id) {
    try {
      await api('DELETE', '/api/conversations/' + id);
    } catch (e) {
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
    thread.innerHTML = '';
    setThreadMode(false);
    renderSidebar();
    updateTitle(null);
    if (pushUrl && location.hash) history.pushState(null, '', location.pathname + location.search);
    input.focus();
  }

  function addUserMessage(content) {
    const row = document.createElement('div');
    row.className = 'msg user';
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
    updateTitle(conv);
    const msgs = conv.messages || [];
    for (const m of msgs) {
      if (m.role === 'user') addUserMessage(m.content);
      else addAssistantMessage(m.content, true);
    }
    setThreadMode(msgs.length > 0);
    scrollToBottom();
    input.focus();
  }

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
      sendBtn.disabled = input.value.trim() === '';
      sendBtn.setAttribute('aria-label', 'Send');
    }
  }

  async function send(text) {
    const content = (text != null ? text : input.value).trim();
    if (!content || state.streaming) return;

    state.streaming = true;
    input.value = '';
    autoGrow();
    updateSendBtn();

    let convId = state.currentId;
    if (!convId) {
      try {
        const conv = await api('POST', '/api/conversations');
        convId = conv.id;
        state.loadToken++;
        state.currentId = convId;
        state.conversations = [{ id: conv.id, title: conv.title, createdAt: conv.createdAt, updatedAt: conv.updatedAt }]
          .concat(state.conversations.filter((c) => c.id !== conv.id));
        renderSidebar();
        location.hash = '#/c/' + convId;
      } catch (e) {
        state.streaming = false;
        input.value = content;
        autoGrow();
        updateSendBtn();
        setThreadMode(true);
        const row = addAssistantMessage('', false);
        showError(row, 'Could not create conversation: ' + e.message);
        return;
      }
    }

    setThreadMode(true);
    addUserMessage(content);
    const row = addAssistantMessage('', false);
    const md = row.querySelector('.md');
    const dot = document.createElement('span');
    dot.className = 'thinking';
    row.appendChild(dot);
    scrollToBottom();

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
        if (!gotDelta) { gotDelta = true; dot.remove(); }
        text2 += ev.content || '';
        row._text = text2;
        schedule();
      } else if (ev.type === 'error') {
        dot.remove();
        showError(row, ev.message);
      }
    };

    try {
      const res = await fetch('/api/conversations/' + convId + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ content }),
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
      if (e.name !== 'AbortError') {
        dot.remove();
        showError(row, e.message || 'Network error');
      }
    } finally {
      dot.remove();
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

  placeComposer();
  updateSendBtn();
  refreshList().then(() => {
    const id = parseHash();
    if (id) openConversation(id);
    else input.focus();
  });
})();
