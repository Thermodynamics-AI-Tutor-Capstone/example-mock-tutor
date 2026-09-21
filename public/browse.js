/* Kelvin AI — course map browser (/browse).
   Reads GET /api/kb and GET /api/kb/card. Vanilla JS, no build step. */
(function () {
  'use strict';

  var REPO = 'Thermodynamics-AI-Tutor-Capstone/example-mock-tutor';
  var BRANCH = 'main';
  var KNOWLEDGE_ROOT = 'agent/knowledge';
  var GITHUB_UPLOAD = 'https://github.com/' + REPO + '/upload/' + BRANCH + '/' + KNOWLEDGE_ROOT;

  var $ = function (id) { return document.getElementById(id); };
  var app = $('app');
  var pane = $('pane');
  var tree = $('tree');
  var crumbs = $('crumbs');
  var search = $('search');

  var state = {
    loaded: false,
    l0: '',
    builtAt: null,
    courseFiles: null,
    cards: [],
    byId: Object.create(null),
    fullCache: Object.create(null),
    query: '',
    route: { view: 'home' },
    token: 0,
  };

  /* ---------------- markdown + math (same pipeline as public/app.js) --------------- */

  var PURIFY_CFG = {
    ADD_TAGS: ['semantics', 'annotation', 'math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'msqrt', 'mtext', 'mspace', 'mover', 'munder', 'mtable', 'mtr', 'mtd', 'mstyle', 'mpadded', 'mphantom', 'menclose', 'mroot', 'msubsup', 'munderover'],
    ADD_ATTR: ['encoding', 'aria-hidden', 'xmlns', 'mathvariant', 'stretchy', 'fence', 'separator', 'lspace', 'rspace', 'columnalign', 'rowspacing', 'columnspacing', 'displaystyle', 'scriptlevel', 'accent', 'accentunder', 'minsize', 'maxsize', 'width', 'height', 'depth', 'voffset'],
  };

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderMarkdown(text) {
    var s = String(text == null ? '' : text);
    var codes = [];
    var maths = [];
    s = s.replace(/```[\s\S]*?```/g, function (m) { codes.push(m); return 'CODETOKEN' + (codes.length - 1) + 'END'; });
    s = s.replace(/`[^`\n]+`/g, function (m) { codes.push(m); return 'CODETOKEN' + (codes.length - 1) + 'END'; });

    var addMath = function (tex, display) { maths.push({ tex: tex, display: display }); return 'MATHTOKEN' + (maths.length - 1) + 'END'; };
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, function (_, t) { return addMath(t, true); });
    s = s.replace(/\\\[([\s\S]+?)\\\]/g, function (_, t) { return addMath(t, true); });
    s = s.replace(/\\\(([\s\S]+?)\\\)/g, function (_, t) { return addMath(t, false); });
    s = s.replace(/(?<!\\)\$(?=[^\s$])([^$\n]*?[^\s\\$])\$(?!\d)/g, function (_, t) { return addMath(t, false); });

    var restoreCode = function (str) { return str.replace(/CODETOKEN(\d+)END/g, function (_, i) { return codes[+i]; }); };
    s = restoreCode(s);

    var html;
    try { html = marked.parse(s, { gfm: true, breaks: false }); }
    catch (e) { html = '<p>' + escapeHtml(s) + '</p>'; }

    html = html.replace(/MATHTOKEN(\d+)END/g, function (_, i) {
      var m = maths[+i];
      if (!m) return '';
      var tex = restoreCode(m.tex);
      try { return katex.renderToString(tex, { displayMode: m.display, throwOnError: false }); }
      catch (e) { return escapeHtml(m.display ? '$$' + tex + '$$' : '$' + tex + '$'); }
    });

    return DOMPurify.sanitize(html, PURIFY_CFG);
  }

  function renderTex(tex, display) {
    try { return katex.renderToString(String(tex), { displayMode: display !== false, throwOnError: false }); }
    catch (e) { return '<code>' + escapeHtml(tex) + '</code>'; }
  }

  /* ---------------- passcode gate (identical behaviour to public/app.js) ----------- */

  var PASSCODE_KEY = 'thermoTutorPasscode';
  var gate = $('gate');
  var gateForm = $('gateForm');
  var gateInput = $('gateInput');
  var gateError = $('gateError');
  var gateBtn = $('gateBtn');
  var memPasscode = '';

  function getPasscode() {
    try { return localStorage.getItem(PASSCODE_KEY) || ''; } catch (e) { return ''; }
  }
  function setPasscode(value) {
    try { localStorage.setItem(PASSCODE_KEY, value); } catch (e) {}
    memPasscode = value;
  }
  function isPasscodeError(e) { return !!(e && e.code === 'passcode_required'); }

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

  async function apiGet(url) {
    var headers = {};
    var code = memPasscode || getPasscode();
    if (code) headers['x-app-passcode'] = code;
    var res = await fetch(url, { headers: headers });
    var data = null;
    try { data = await res.json(); } catch (e) {}
    if (res.status === 401 && data && data.error === 'auth_required') {
      location.replace('/login?next=' + encodeURIComponent(location.pathname + location.hash));
      var ae = new Error('auth_required');
      ae.status = 401;
      ae.code = 'passcode_required';
      throw ae;
    }
    if (res.status === 401 && data && data.error === 'passcode_required') {
      showGate();
      var err = new Error('passcode_required');
      err.status = 401;
      err.code = 'passcode_required';
      throw err;
    }
    if (!res.ok) {
      var e2 = new Error((data && data.error) || ('Request failed (' + res.status + ')'));
      e2.status = res.status;
      throw e2;
    }
    return data;
  }

  gateInput.addEventListener('input', function () {
    gateError.hidden = true;
    gateInput.classList.remove('invalid');
  });

  gateForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var value = gateInput.value;
    if (!value || gateBtn.disabled) return;
    gateBtn.disabled = true;
    gateError.hidden = true;
    try {
      setPasscode(value);
      await loadIndex(true);
      hideGate();
      gateBtn.disabled = false;
      render();
    } catch (err) {
      gateBtn.disabled = false;
      gateError.textContent = isPasscodeError(err) ? 'Incorrect passcode' : ('Could not connect: ' + err.message);
      gateError.hidden = false;
      if (isPasscodeError(err)) gateInput.classList.add('invalid');
      gateInput.select();
      gateInput.focus();
    }
  });

  /* ---------------- data ---------------- */

  async function loadIndex(force) {
    if (state.loaded && !force) return;
    var data = await apiGet('/api/kb');
    state.l0 = (data && data.l0) || '';
    state.builtAt = (data && data.builtAt) || null;
    state.cards = (data && Array.isArray(data.cards)) ? data.cards : [];
    // null when the API predates the field, so "unknown" stays distinct from "zero".
    state.courseFiles = (data && typeof data.courseFiles === 'number') ? data.courseFiles : null;
    state.byId = Object.create(null);
    state.fullCache = Object.create(null);
    for (var i = 0; i < state.cards.length; i++) {
      var c = state.cards[i];
      if (c && c.id) state.byId[c.id] = c;
    }
    state.loaded = true;
  }

  async function loadCard(id) {
    if (state.fullCache[id]) return state.fullCache[id];
    var data = await apiGet('/api/kb/card?id=' + encodeURIComponent(id));
    var norm = normalizeCard(data);
    state.fullCache[id] = norm;
    return norm;
  }

  // The API returns the card fields plus resolvedLinks/sources. Tolerate both
  // `{...cardFields, resolvedLinks, sources}` and `{card: {...}, resolvedLinks, sources}`.
  function normalizeCard(data) {
    var d = data && typeof data === 'object' ? data : {};
    var card = (d.card && typeof d.card === 'object') ? d.card : d;
    var links = (card.links && typeof card.links === 'object') ? card.links : card;
    var sources = Array.isArray(d.sources) ? d.sources
      : Array.isArray(card.sources) ? card.sources
      : Array.isArray(links.sources) ? links.sources : [];
    var resolved = Array.isArray(d.resolvedLinks) ? d.resolvedLinks : [];
    for (var i = 0; i < resolved.length; i++) {
      var r = resolved[i];
      if (r && r.id && !state.byId[r.id]) state.byId[r.id] = r;
    }
    // /api/kb/card puts frontmatter keys outside the frozen vocabulary under `fields`
    // (lib/kb.js's `card.extra`), which is where a per-card `latex` would land.
    var fields = (d.fields && typeof d.fields === 'object') ? d.fields
      : (card.fields && typeof card.fields === 'object') ? card.fields : {};
    return { card: card, links: links, sources: sources, resolved: resolved, fields: fields };
  }

  /* ---------------- helpers over card data ---------------- */

  function idOf(entry) {
    if (!entry) return '';
    if (typeof entry === 'string') return entry;
    return entry.id || entry.card || entry.ref || '';
  }
  function asList(v) {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  }
  function titleOf(id) {
    var c = state.byId[id];
    if (c && c.title) return c.title;
    var f = state.fullCache[id];
    if (f && f.card && f.card.title) return f.card.title;
    return id;
  }
  function descOf(id) {
    var c = state.byId[id];
    if (c && c.description) return c.description;
    var f = state.fullCache[id];
    if (f && f.card && f.card.description) return f.card.description;
    return '';
  }
  function kindOf(card) {
    if (!card) return '';
    if (card.kind) return String(card.kind);
    var id = String(card.id || '');
    var i = id.indexOf(':');
    return i > 0 ? id.slice(0, i) : '';
  }
  function cardsOfKind(kind) {
    return state.cards.filter(function (c) { return kindOf(c) === kind; });
  }
  function childrenOf(parentId) {
    return state.cards.filter(function (c) { return c && c.parent === parentId; });
  }
  function byPriority(a, b) {
    var pa = typeof a.priority === 'number' ? a.priority : 999;
    var pb = typeof b.priority === 'number' ? b.priority : 999;
    if (pa !== pb) return pa - pb;
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  }

  // `#unit=u4` carries the short slug; card ids look like `unit:u4-second-law`.
  function resolveUnitId(raw) {
    if (!raw) return '';
    if (state.byId[raw]) return raw;
    if (state.byId['unit:' + raw]) return 'unit:' + raw;
    var units = cardsOfKind('unit');
    for (var i = 0; i < units.length; i++) {
      var slug = String(units[i].id).replace(/^unit:/, '');
      if (slug === raw || slug.split('-')[0] === raw) return units[i].id;
    }
    return raw;
  }
  function unitSlug(id) { return String(id).replace(/^unit:/, ''); }

  function statusInfo(card) {
    var st = String((card && card.status) || 'auto').toLowerCase();
    var who = card && (card.reviewer || card.reviewed_by || card.verified_by);
    var when = card && (card.reviewed_at || card.reviewedAt || card.verified_at);
    if (st === 'reviewed' || st === 'instructor-verified') {
      var label = st === 'instructor-verified' ? 'Checked by an instructor' : 'Reviewed by a human';
      var extra = [];
      if (who) extra.push(String(who));
      if (when) extra.push(String(when).slice(0, 10));
      return { cls: 'ok', dot: 'ok', text: label + (extra.length ? ' — ' + extra.join(', ') : '') };
    }
    if (st === 'draft') return { cls: '', dot: 'draft', text: 'Draft — not finished, not checked' };
    // A stub is synthesised from taxonomy.yml alone: there is no course material behind it at all,
    // so it must not carry the "drafted from the course files" label.
    if (st === 'stub') return { cls: 'stub', dot: 'stub', text: 'Placeholder — no course material has been added for this topic yet' };
    return { cls: 'auto', dot: 'auto', text: 'AI-drafted from the course files — not checked by an instructor' };
  }

  function githubUrlFor(src) {
    if (src && src.githubUrl) return src.githubUrl;
    var p = String((src && (src.path || src.file)) || '').replace(/^\/+/, '');
    if (!p) return '';
    if (p.indexOf(KNOWLEDGE_ROOT + '/') !== 0) p = KNOWLEDGE_ROOT + '/' + p;
    return 'https://github.com/' + REPO + '/blob/' + BRANCH + '/' + p.split('/').map(encodeURIComponent).join('/');
  }
  function pagesLabel(src) {
    if (!src) return '';
    var pages = asList(src.pages);
    var slides = asList(src.slides);
    if (slides.length) return 'slide' + (slides.length > 1 ? 's' : '') + ' ' + slides.join(', ');
    if (pages.length) return 'page' + (pages.length > 1 ? 's' : '') + ' ' + pages.join(', ');
    return '';
  }

  function texOf(full) {
    var card = full.card, links = full.links;
    var fields = full.fields || {};
    var tex = card.latex || card.tex || card.equation || links.latex || links.tex ||
      fields.latex || fields.tex || fields.equation;
    if (tex) return String(tex);
    var body = String(card.body || '');
    // scripts/kb/write-cards.mjs writes the equation as a fenced ```latex block under an
    // "## Equation" heading, so that form has to be checked before the $$…$$ / \[…\] fallbacks.
    var m = body.match(/```(?:latex|tex|math)\s*\n([\s\S]+?)```/);
    if (m) return m[1].trim();
    m = body.match(/\$\$([\s\S]+?)\$\$/);
    if (m) return m[1].trim();
    m = body.match(/\\\[([\s\S]+?)\\\]/);
    if (m) return m[1].trim();
    return '';
  }

  /* ---------------- rendering: shared blocks ---------------- */

  function statusBadge(card) {
    var s = statusInfo(card);
    return '<div class="badge ' + s.cls + '"><span class="dot ' + s.dot + '"></span><span>' + escapeHtml(s.text) + '</span></div>';
  }

  function cardHref(id) { return '#card=' + encodeURIComponent(id); }

  function chipList(ids, label) {
    var items = ids.map(idOf).filter(Boolean);
    if (!items.length) return '';
    return '<div class="section"><h2>' + escapeHtml(label) + '</h2>' +
      '<p class="chip-note">These are the usual order of the course material — not a claim about what you know.</p>' +
      '<div class="chips">' + items.map(function (id) {
        return '<a class="chip" href="' + escapeHtml(cardHref(id)) + '">' + escapeHtml(titleOf(id)) + '</a>';
      }).join('') + '</div></div>';
  }

  function linkedList(ids, label, emptyOk) {
    var items = ids.map(idOf).filter(Boolean);
    if (!items.length) return emptyOk ? '' : '';
    return '<div class="section"><h2>' + escapeHtml(label) + '</h2><ul class="list">' +
      items.map(function (id) {
        var d = descOf(id);
        return '<li><a class="li-title" href="' + escapeHtml(cardHref(id)) + '" style="text-decoration:none">' +
          escapeHtml(titleOf(id)) + '</a>' +
          (d ? '<div class="li-sub">' + escapeHtml(d) + '</div>' : '') + '</li>';
      }).join('') + '</ul></div>';
  }

  function objectivesBlock(objs) {
    var list = asList(objs);
    if (!list.length) return '';
    return '<div class="section"><h2>What you should be able to do</h2><ul class="list">' +
      list.map(function (o) {
        if (typeof o === 'string') return '<li><div class="li-title">' + escapeHtml(o) + '</div></li>';
        var text = o.text || o.title || o.statement || o.id || '';
        var meta = [];
        if (o.kc_type) meta.push(o.kc_type);
        if (o.bloom) meta.push(o.bloom);
        return '<li><div class="li-title">' + escapeHtml(text) + '</div>' +
          (meta.length ? '<div class="li-meta">' + meta.map(function (m) { return '<span class="tag">' + escapeHtml(m) + '</span>'; }).join('') + '</div>' : '') +
          '</li>';
      }).join('') + '</ul></div>';
  }

  function assumptionsBlock(full) {
    var links = full.links;
    var valid = asList(links.valid_when).map(function (v) { return typeof v === 'string' ? v : (v && (v.value || v.name)) || ''; }).filter(Boolean);
    var invalid = asList(links.invalid_when).map(function (v) { return typeof v === 'string' ? v : (v && (v.value || v.name)) || ''; }).filter(Boolean);
    if (!valid.length && !invalid.length) return '';
    var inner = '';
    if (valid.length) {
      inner += '<div class="assump-title">Holds when</div><ul>' +
        valid.map(function (v) { return '<li>' + escapeHtml(v) + '</li>'; }).join('') + '</ul>';
    }
    if (invalid.length) {
      inner += '<div class="assump-title">Does not hold when</div><ul>' +
        invalid.map(function (v) { return '<li class="bad">' + escapeHtml(v) + '</li>'; }).join('') + '</ul>';
    }
    var st = String((full.card.status || 'auto')).toLowerCase();
    if (st === 'auto' || st === 'draft') {
      return '<details class="assump"><summary>Assumptions not yet checked — show anyway</summary>' + inner + '</details>';
    }
    return '<div class="assump">' + inner + '</div>';
  }

  function equationBlock(full, opts) {
    var card = full.card;
    var tex = texOf(full);
    var s = statusInfo(card);
    var head = '<div class="eq-head"><span class="eq-title">' + escapeHtml(card.title || card.id || 'Equation') + '</span>' +
      '<span class="eq-id"><span class="dot ' + s.dot + '"></span> ' + escapeHtml(card.id || '') + '</span></div>';
    var math = tex ? '<div class="eq-math">' + renderTex(tex, true) + '</div>' : '';
    var desc = card.description ? '<div class="li-sub">' + escapeHtml(card.description) + '</div>' : '';
    var body = (!tex && card.body) ? '<div class="md">' + renderMarkdown(card.body) + '</div>' : '';
    var more = (opts && opts.link === false) ? '' :
      '<div class="li-meta"><a href="' + escapeHtml(cardHref(card.id)) + '">Open card</a></div>';
    return '<div class="eq">' + head + math + desc + body + assumptionsBlock(full) + more + '</div>';
  }

  function sourcesBlock(sources) {
    var list = asList(sources);
    if (!list.length) {
      return '<div class="section"><h2>Sources</h2><p class="chip-note">No source file is recorded on this card.</p></div>';
    }
    return '<div class="section"><h2>Sources</h2><ul class="src">' + list.map(function (s) {
      var path = String((s && (s.path || s.file)) || s || '');
      var url = githubUrlFor(typeof s === 'string' ? { path: s } : s);
      var pl = pagesLabel(s);
      return '<li>' + (url
        ? '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + escapeHtml(path) + '</a>'
        : escapeHtml(path)) +
        (pl ? '<span class="pages">' + escapeHtml(pl) + '</span>' : '') + '</li>';
    }).join('') + '</ul></div>';
  }

  /* ---------------- rendering: the left rail ---------------- */

  function renderTree() {
    if (!state.loaded) { tree.innerHTML = '<div class="tree-empty">Loading…</div>'; return; }
    if (state.query) return renderSearchResults();
    if (!state.cards.length) { tree.innerHTML = '<div class="tree-empty">No cards yet.</div>'; return; }

    var out = '';
    var course = cardsOfKind('course')[0];
    if (course) {
      out += '<a class="tree-row' + (activeId() === course.id ? ' active' : '') + '" href="' + escapeHtml(cardHref(course.id)) + '">' +
        '<span class="t">' + escapeHtml(course.title || course.id) + '</span></a>';
    }
    var units = cardsOfKind('unit').sort(byPriority);
    if (!units.length) {
      var topicsFlat = cardsOfKind('topic').sort(byPriority);
      out += topicsFlat.map(topicRow).join('');
    }
    units.forEach(function (u) {
      out += '<div class="unit-block">';
      out += '<a class="tree-row unit' + (activeId() === u.id ? ' active' : '') + '" href="' + escapeHtml(cardHref(u.id)) + '">' +
        '<span class="t">' + escapeHtml(u.title || u.id) + '</span></a>';
      out += '<a class="tree-row sheet' + (state.route.view === 'equations' && resolveUnitId(state.route.unit) === u.id ? ' active' : '') +
        '" href="#unit=' + encodeURIComponent(unitSlug(u.id)) + '&view=equations"><span class="t">Equation sheet</span></a>';
      var topics = state.cards.filter(function (c) {
        return kindOf(c) === 'topic' && (c.parent === u.id || (!c.parent && c.unit === u.id));
      }).sort(byPriority);
      out += topics.map(topicRow).join('');
      out += '</div>';
    });
    tree.innerHTML = out;
  }

  function topicRow(t) {
    var s = statusInfo(t);
    return '<a class="tree-row topic' + (activeId() === t.id ? ' active' : '') + '" href="' + escapeHtml(cardHref(t.id)) + '">' +
      '<span class="dot ' + s.dot + '" title="' + escapeHtml(s.text) + '"></span>' +
      '<span class="t">' + escapeHtml(t.title || t.id) + '</span></a>';
  }

  function renderSearchResults() {
    var q = state.query.toLowerCase();
    var hits = state.cards.filter(function (c) {
      return (String(c.title || '') + ' ' + String(c.description || '') + ' ' + String(c.id || '')).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 60);
    if (!hits.length) {
      tree.innerHTML = '<div class="tree-empty">Nothing matches “' + escapeHtml(state.query) + '”.</div>';
      return;
    }
    tree.innerHTML = '<div class="results-head">' + hits.length + ' match' + (hits.length === 1 ? '' : 'es') + '</div>' +
      hits.map(function (c) {
        var s = statusInfo(c);
        return '<a class="tree-row' + (activeId() === c.id ? ' active' : '') + '" href="' + escapeHtml(cardHref(c.id)) + '">' +
          '<span class="dot ' + s.dot + '"></span><span class="t">' + escapeHtml(c.title || c.id) + '</span></a>';
      }).join('');
  }

  function activeId() { return state.route.view === 'card' ? state.route.id : ''; }

  /* ---------------- rendering: the main pane ---------------- */

  function setCrumbs(parts) {
    crumbs.innerHTML = parts.map(function (p, i) {
      var sep = i ? '<span class="sep">/</span>' : '';
      return sep + (p.href ? '<a href="' + escapeHtml(p.href) + '">' + escapeHtml(p.text) + '</a>' : escapeHtml(p.text));
    }).join('');
  }

  function notice(title, html, isErr) {
    pane.innerHTML = '<div class="card-wrap"><div class="notice' + (isErr ? ' err' : '') + '">' +
      (title ? '<h1>' + escapeHtml(title) + '</h1>' : '') + html + '</div></div>';
  }

  function emptyState() {
    setCrumbs([{ text: 'Course map' }]);
    notice('No course material yet',
      '<p>Nothing has been added to the knowledge base, so there are no cards to browse. ' +
      'Course files are uploaded to <code>' + KNOWLEDGE_ROOT + '/</code> in the repository; the build turns them into cards.</p>' +
      '<p><a href="' + escapeHtml(GITHUB_UPLOAD) + '" target="_blank" rel="noopener">Upload course files on GitHub &rarr;</a></p>');
  }

  // The map comes from taxonomy.yml, so it renders in full even when no course file has been
  // uploaded. Without this the home view shows a complete-looking course with nothing behind it.
  function noCorpusBanner() {
    if (state.courseFiles !== 0) return '';
    return '<div class="banner-warn">No course files have been uploaded yet, so every topic below is ' +
      'a placeholder built from the syllabus outline alone. Nothing here is drawn from lecture notes, ' +
      'slides or problem sets. <a href="' + escapeHtml(GITHUB_UPLOAD) + '" target="_blank" rel="noopener">' +
      'Upload course files on GitHub &rarr;</a></div>';
  }

  async function renderHome() {
    setCrumbs([{ text: 'Course map' }]);
    if (!state.cards.length) return emptyState();
    var course = cardsOfKind('course')[0];
    if (course) { state.route = { view: 'card', id: course.id }; return renderCard(course.id, noCorpusBanner()); }
    var units = cardsOfKind('unit').sort(byPriority);
    var built = state.builtAt ? '<p class="chip-note">Index built ' + escapeHtml(String(state.builtAt).replace('T', ' ').slice(0, 16)) + ' UTC.</p>' : '';
    pane.innerHTML = '<div class="card-wrap">' +
      '<div class="kind-label">Course map</div>' +
      '<h1 class="card-title">Units</h1>' + noCorpusBanner() + built +
      '<ul class="list">' + units.map(function (u) {
        return '<li><a class="li-title" style="text-decoration:none" href="' + escapeHtml(cardHref(u.id)) + '">' +
          escapeHtml(u.title || u.id) + '</a>' +
          (u.description ? '<div class="li-sub">' + escapeHtml(u.description) + '</div>' : '') +
          '<div class="li-meta"><a href="#unit=' + encodeURIComponent(unitSlug(u.id)) + '&view=equations">Equation sheet</a></div></li>';
      }).join('') + '</ul></div>';
  }

  async function renderCard(id, banner) {
    var token = ++state.token;
    pane.innerHTML = '<div class="card-wrap"><p class="chip-note">Loading…</p></div>';
    var full;
    try {
      full = await loadCard(id);
    } catch (e) {
      if (token !== state.token) return;
      if (isPasscodeError(e)) return;
      if (e.status === 404) {
        setCrumbs([{ text: 'Course map', href: '#' }, { text: 'Not found' }]);
        return notice('No card with that id', '<p><code>' + escapeHtml(id) + '</code> is not in the knowledge base. It may have been renamed or not built yet.</p>', true);
      }
      return notice('Could not load the card', '<p>' + escapeHtml(e.message) + '</p>', true);
    }
    if (token !== state.token) return;

    var card = full.card, links = full.links;
    var kind = kindOf(card);

    // Breadcrumbs from parent chain.
    var trail = [{ text: 'Course map', href: '#' }];
    var parentId = card.parent || card.unit;
    if (parentId && parentId !== card.id) trail.push({ text: titleOf(parentId), href: cardHref(parentId) });
    trail.push({ text: card.title || card.id });
    setCrumbs(trail);

    var out = '<div class="card-wrap">';
    if (banner) out += banner;
    out += '<div class="kind-label">' + escapeHtml(kind || 'card') + '</div>';
    out += '<h1 class="card-title">' + escapeHtml(card.title || card.id) + '</h1>';
    if (card.description) out += '<p class="card-desc">' + escapeHtml(card.description) + '</p>';
    out += statusBadge(card);

    if (kind === 'unit') {
      out += '<div class="section"><h2>Equation sheet</h2><div class="chips">' +
        '<a class="chip" href="#unit=' + encodeURIComponent(unitSlug(card.id)) + '&view=equations">All equations in this unit</a></div></div>';
    }

    out += objectivesBlock(links.objectives || card.objectives);

    var prereq = asList(links.prerequisites);
    var next = asList(links.precedes);
    if (prereq.length) out += chipList(prereq, 'Usually comes before this');
    if (next.length) out += chipList(next, 'Usually comes after this');

    // Children (units → topics, topics → leaves) from the index we already hold,
    // plus anything the API resolved for us.
    var kids = childrenOf(card.id).sort(byPriority);
    if (Array.isArray(full.card.children)) {
      full.card.children.forEach(function (c) {
        if (c && c.id && !kids.some(function (k) { return k.id === c.id; })) kids.push(c);
      });
    }
    if (kids.length) {
      var kidsLabel = kind === 'unit' ? 'Topics' : kind === 'course' ? 'Units' : 'In this card';
      out += '<div class="section"><h2>' + kidsLabel + '</h2><ul class="list">' +
        kids.map(function (k) {
          return '<li><a class="li-title" style="text-decoration:none" href="' + escapeHtml(cardHref(k.id)) + '">' +
            escapeHtml(k.title || k.id) + '</a>' +
            (k.description ? '<div class="li-sub">' + escapeHtml(k.description) + '</div>' : '') + '</li>';
        }).join('') + '</ul></div>';
    }

    if (card.body) out += '<div class="section"><h2>Notes</h2><div class="md">' + renderMarkdown(card.body) + '</div></div>';

    if (kind === 'eq' || kind === 'equation') {
      var tex = texOf(full);
      if (tex) out += '<div class="section"><h2>Equation</h2><div class="eq"><div class="eq-math">' + renderTex(tex, true) + '</div>' + assumptionsBlock(full) + '</div></div>';
      else out += assumptionsBlock(full);
      var sym = asList(links.symbols).map(function (s) { return typeof s === 'string' ? s : (s && (s.symbol || s.id)) || ''; }).filter(Boolean);
      if (sym.length) out += '<div class="section"><h2>Symbols</h2><div class="chips">' + sym.map(function (s) { return '<span class="chip">' + escapeHtml(s) + '</span>'; }).join('') + '</div></div>';
    }

    out += '<div id="eqSlot"></div>';
    out += linkedList(asList(links.misconceptions), 'Where people go wrong');
    out += linkedList(asList(links.examples), 'Worked examples');
    out += linkedList(asList(links.items), 'Practice items');
    out += sourcesBlock(full.sources);
    out += '</div>';
    pane.innerHTML = out;
    pane.scrollTop = 0;
    renderTree();

    // Equations are separate cards; fetch and render them in place.
    var eqIds = asList(links.equations).map(idOf).filter(Boolean);
    if (eqIds.length) {
      var slot = $('eqSlot');
      if (slot) slot.innerHTML = '<div class="section"><h2>Equations used here</h2><p class="chip-note">Loading…</p></div>';
      var fulls = await Promise.all(eqIds.map(function (eid) {
        return loadCard(eid).catch(function () { return null; });
      }));
      if (token !== state.token) return;
      slot = $('eqSlot');
      if (!slot) return;
      slot.innerHTML = '<div class="section"><h2>Equations used here</h2>' +
        fulls.map(function (f, i) {
          if (!f) return '<div class="eq"><div class="eq-head"><span class="eq-title">' + escapeHtml(titleOf(eqIds[i])) + '</span></div>' +
            '<div class="li-sub">This equation card could not be loaded.</div></div>';
          return equationBlock(f, {});
        }).join('') + '</div>';
    }
  }

  async function renderUnitEquations(rawUnit) {
    var token = ++state.token;
    var unitId = resolveUnitId(rawUnit);
    var unit = state.byId[unitId];
    setCrumbs([{ text: 'Course map', href: '#' },
      { text: unit ? (unit.title || unitId) : unitId, href: cardHref(unitId) },
      { text: 'Equation sheet' }]);

    if (!unit) {
      return notice('Unknown unit', '<p>No unit card matches <code>' + escapeHtml(String(rawUnit)) + '</code>.</p>', true);
    }
    pane.innerHTML = '<div class="card-wrap"><p class="chip-note">Collecting equations…</p></div>';

    // Every topic in the unit, then every equation those topics use.
    var topics = state.cards.filter(function (c) {
      return kindOf(c) === 'topic' && (c.parent === unitId || c.unit === unitId);
    }).sort(byPriority);

    var eqIds = [];
    var seen = Object.create(null);
    var pushEq = function (id) { if (id && !seen[id]) { seen[id] = true; eqIds.push(id); } };

    // Equation cards that declare this unit directly.
    state.cards.forEach(function (c) {
      if ((kindOf(c) === 'eq' || kindOf(c) === 'equation') && (c.unit === unitId || c.parent === unitId)) pushEq(c.id);
    });

    var topicFulls = await Promise.all([unitId].concat(topics.map(function (t) { return t.id; })).map(function (tid) {
      return loadCard(tid).catch(function () { return null; });
    }));
    if (token !== state.token) return;
    topicFulls.forEach(function (f) {
      if (!f) return;
      asList(f.links.equations).map(idOf).filter(Boolean).forEach(pushEq);
    });

    if (!eqIds.length) {
      return notice('No equations in this unit yet',
        '<p>No equation cards are linked to <strong>' + escapeHtml(unit.title || unitId) + '</strong> yet. ' +
        'Equations appear here as soon as the cards for this unit list them.</p>');
    }

    var fulls = await Promise.all(eqIds.map(function (id) { return loadCard(id).catch(function () { return null; }); }));
    if (token !== state.token) return;

    pane.innerHTML = '<div class="card-wrap">' +
      '<div class="kind-label">Equation sheet</div>' +
      '<h1 class="card-title">' + escapeHtml(unit.title || unitId) + '</h1>' +
      '<p class="card-desc">Every equation the cards in this unit use, with the assumptions each one needs. ' +
      'Generated from the cards — it is only as right as they are.</p>' +
      fulls.map(function (f, i) {
        if (!f) return '<div class="eq"><div class="eq-head"><span class="eq-title">' + escapeHtml(titleOf(eqIds[i])) + '</span></div>' +
          '<div class="li-sub">This equation card could not be loaded.</div></div>';
        return equationBlock(f, {});
      }).join('') +
      '</div>';
    pane.scrollTop = 0;
    renderTree();
  }

  /* ---------------- routing ---------------- */

  function parseHash() {
    var raw = String(location.hash || '').replace(/^#/, '');
    var params = Object.create(null);
    raw.split('&').forEach(function (part) {
      if (!part) return;
      var i = part.indexOf('=');
      var k = i === -1 ? part : part.slice(0, i);
      var v = i === -1 ? '' : part.slice(i + 1);
      try { params[decodeURIComponent(k)] = decodeURIComponent(v); }
      catch (e) { params[k] = v; }
    });
    if (params.card) return { view: 'card', id: params.card };
    if (params.unit) return { view: params.view === 'equations' ? 'equations' : 'card', unit: params.unit, id: resolveUnitId(params.unit) };
    return { view: 'home' };
  }

  async function render() {
    if (!state.loaded) return;
    if (!state.cards.length) { renderTree(); return emptyState(); }
    renderTree();
    var r = state.route;
    if (r.view === 'equations') return renderUnitEquations(r.unit);
    if (r.view === 'card' && r.id) return renderCard(r.id);
    return renderHome();
  }

  function onHashChange() {
    state.route = parseHash();
    closeRail();
    render();
  }

  /* ---------------- rail open/close (mobile) ---------------- */

  function openRail() { app.classList.add('rail-open'); }
  function closeRail() { app.classList.remove('rail-open'); }
  $('openRail').addEventListener('click', openRail);
  $('closeRail').addEventListener('click', closeRail);
  $('backdrop').addEventListener('click', closeRail);

  var searchTimer = null;
  search.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.query = search.value.trim();
      renderTree();
    }, 90);
  });

  window.addEventListener('hashchange', onHashChange);

  /* ---------------- boot ---------------- */

  (async function boot() {
    tree.innerHTML = '<div class="tree-empty">Loading…</div>';
    pane.innerHTML = '<div class="card-wrap"><p class="chip-note">Loading the course map…</p></div>';
    try {
      await loadIndex(false);
    } catch (e) {
      if (isPasscodeError(e)) return;
      tree.innerHTML = '<div class="tree-empty">Unavailable</div>';
      return notice('Could not load the course map', '<p>' + escapeHtml(e.message) + '</p>' +
        '<p>The <code>/api/kb</code> route must be deployed for this page to work.</p>', true);
    }
    state.route = parseHash();
    render();
  })();
})();
