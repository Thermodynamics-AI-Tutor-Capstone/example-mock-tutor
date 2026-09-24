// Settings, as a modal over the chat. Built on first open and reused; the form is the same one the
// old /settings page had, plus the capstone's testing switches. Needs /account.js and
// /account.css. Usage: KelvinSettings.open({ opener, onSaved(profile) }).
(function () {
  const FIELDS = ['display_name', 'course_number', 'section', 'professor', 'semester', 'year', 'major', 'default_style'];
  const SWITCHES = { use_jev: true, show_decisions: false };

  const TEMPLATE = `
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
      <div class="modal-head">
        <h2 id="settingsTitle" class="modal-title">Settings</h2>
        <button type="button" class="icon-btn modal-close" data-close aria-label="Close settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <div class="set-tabs" role="tablist" aria-label="Settings sections">
        <button type="button" role="tab" class="set-tab" data-tab="profile" aria-selected="true">Profile</button>
        <button type="button" role="tab" class="set-tab" data-tab="learning" aria-selected="false">What Kelvin knows</button>
      </div>
      <div class="modal-body set-learning" data-panel="learning" hidden>
        <p class="acct-note set-learning-intro">What Kelvin has worked out about you from your chats. It uses this to decide what to check first. If something is wrong, correct it here. Your corrections are kept, and Kelvin sees them from your next message.</p>
        <div class="set-learning-error acct-error" role="alert"></div>
        <div class="set-learning-body"></div>
      </div>
      <form class="modal-body acct-form" data-panel="profile" novalidate>
        <div class="acct-section">Account</div>
        <div class="acct-field"><label for="set_email">Email</label><input id="set_email" readonly></div>
        <div class="acct-field"><label for="set_display_name">Name</label><input id="set_display_name" maxlength="120" required></div>
        <div class="acct-section">Course <span class="opt">(optional)</span></div>
        <div class="acct-row">
          <div class="acct-field"><label for="set_course_number">Course number</label><input id="set_course_number" placeholder="ME 300" maxlength="120"></div>
          <div class="acct-field"><label for="set_section">Section</label><input id="set_section" maxlength="120"></div>
        </div>
        <div class="acct-field"><label for="set_professor">Professor</label><input id="set_professor" maxlength="120"></div>
        <div class="acct-row">
          <div class="acct-field"><label for="set_semester">Semester</label><input id="set_semester" placeholder="Fall 2026" maxlength="120"></div>
          <div class="acct-field"><label for="set_year">Year</label>
            <select id="set_year"><option value="">—</option><option>First-year</option><option>Sophomore</option><option>Junior</option><option>Senior</option><option>Graduate</option><option>Other</option></select>
          </div>
        </div>
        <div class="acct-field"><label for="set_major">Major</label><input id="set_major" maxlength="120"></div>
        <div class="acct-section">Tutoring</div>
        <div class="acct-field"><label for="set_default_style">Default teaching style for new chats</label><select id="set_default_style"></select></div>
        <div class="acct-section">Testing <span class="opt">(capstone team)</span></div>
        <label class="acct-toggle" for="set_use_jev">
          <span class="acct-toggle-text"><span class="acct-toggle-name">Use Jev</span><span class="acct-toggle-desc">Jev is a fast decision model that reads each message before Kelvin answers: whether you showed your own work, which misconception your words point to, how much help you've earned, which teaching style fits. Turn it off to see Kelvin run on its backup instead: a DeepSeek model answers the same questions (keyword rules only if that fails too), and Kelvin picks its own teaching style.</span></span>
          <input id="set_use_jev" type="checkbox" role="switch">
          <span class="acct-toggle-track" aria-hidden="true"></span>
        </label>
        <div class="acct-field"><label for="set_style_router">Who picks the teaching style (in Auto)</label>
          <select id="set_style_router">
            <option value="jev">Jev picks</option>
            <option value="skills">Kelvin picks (skills)</option>
          </select>
          <p class="acct-toggle-desc set-router-note">With Jev off, Kelvin always picks.</p>
        </div>
        <label class="acct-toggle" for="set_show_decisions">
          <span class="acct-toggle-text"><span class="acct-toggle-name">Show Kelvin's decisions</span><span class="acct-toggle-desc">Above each reply, show what was decided before Kelvin answered, and whether Jev or the keyword rules decided it. Useful for demos.</span></span>
          <input id="set_show_decisions" type="checkbox" role="switch">
          <span class="acct-toggle-track" aria-hidden="true"></span>
        </label>
        <div class="set-error acct-error" role="alert"></div>
        <div class="set-ok acct-ok" role="status"></div>
        <button class="set-submit acct-btn" type="submit" disabled>Save changes</button>
        <div class="acct-section">Account</div>
        <button class="set-delete acct-btn acct-btn-danger" type="button">Delete account</button>
        <p class="acct-note">Kelvin AI is a capstone prototype and part of a Penn State research study. It stores your account email, the profile fields above, your chats and uploads, and notes Kelvin makes about what you've learned. The capstone team can see all of them. Deleting a chat hides it from you and stops it counting toward what Kelvin thinks you know, but the team keeps a copy; deleting your account signs you out and closes it, and the team keeps your data. Messages you send, and any course material Kelvin reads to answer you, are sent to DeepSeek's API to generate replies. While "Use Jev" is on, your messages and Kelvin's replies are also sent to TypeSafe's Jev model through OpenRouter.</p>
      </form>
    </div>`;

  let root = null;
  let opener = null;
  let onSaved = null;

  const $ = (id) => document.getElementById(id);

  function build() {
    root = document.createElement('div');
    root.className = 'modal-backdrop';
    root.hidden = true;
    root.innerHTML = TEMPLATE;
    document.body.appendChild(root);
    root.addEventListener('mousedown', (e) => {
      if (e.target === root) close();
    });
    root.querySelector('[data-close]').addEventListener('click', close);
    root.addEventListener('keydown', onKey);
    root.querySelector('form').addEventListener('submit', save);
    for (const tab of root.querySelectorAll('.set-tab')) tab.addEventListener('click', () => showTab(tab.dataset.tab));
    $('set_use_jev').addEventListener('change', syncRouter);
    const del = root.querySelector('.set-delete');
    del.addEventListener('click', async () => {
      if (!del.dataset.armed) {
        del.dataset.armed = '1';
        del.textContent = 'Click again to delete your account';
        return;
      }
      del.disabled = true;
      try {
        await window.KelvinAccount.deleteAccount();
      } catch (err) {
        message('error', err.message);
        del.disabled = false;
      }
    });
  }

  // ---- Tabs ----
  function showTab(name) {
    for (const tab of root.querySelectorAll('.set-tab')) tab.setAttribute('aria-selected', String(tab.dataset.tab === name));
    for (const panel of root.querySelectorAll('[data-panel]')) panel.hidden = panel.dataset.panel !== name;
    if (name === 'learning') loadLearning();
  }

  // ---- What Kelvin knows (GET/POST /api/me/learning) ----
  const STATUS_WORDS = { suspected: 'Suspected', likely: 'Likely', confirmed: 'Confirmed', repaired: 'Fixed', relapsed: 'Came back' };
  const BELIEF_WORDS = { solid: 'Solid', shaky: 'Shaky', misconception: 'Misconception', unknown: 'Not sure yet' };
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  };
  const day = (d) => (d ? String(d).slice(0, 10) : '');

  async function loadLearning() {
    const body = root.querySelector('.set-learning-body');
    root.querySelector('.set-learning-error').textContent = '';
    body.textContent = 'Loading…';
    const r = await window.KelvinAccount.call('/api/me/learning');
    if (!r.ok) {
      body.textContent = '';
      root.querySelector('.set-learning-error').textContent = (r.data && r.data.error) || 'Could not load (' + r.status + ').';
      return;
    }
    renderLearning(r.data);
  }

  async function learningEdit(payload) {
    root.querySelector('.set-learning-error').textContent = '';
    const r = await window.KelvinAccount.call('/api/me/learning', { method: 'POST', body: JSON.stringify(payload) });
    if (!r.ok) {
      root.querySelector('.set-learning-error').textContent = (r.data && r.data.error) || 'Could not save (' + r.status + ').';
      return;
    }
    renderLearning(r.data);
  }

  function beliefSelect(value) {
    const s = el('select', 'set-belief');
    for (const [v, w] of Object.entries(BELIEF_WORDS)) {
      const o = el('option', null, w);
      o.value = v;
      if (v === value) o.selected = true;
      s.appendChild(o);
    }
    return s;
  }

  function renderLearning(view) {
    const body = root.querySelector('.set-learning-body');
    body.textContent = '';
    const m = view.model || {};
    const titles = view.titles || {};
    const name = (ref) => titles[ref] || String(ref).replace(/^(misc|topic|eq|student):/, '');

    // Misconceptions
    body.appendChild(el('div', 'acct-section', 'Misconceptions Kelvin noticed'));
    const miscs = Object.values(m.misconceptions || {}).sort((a, b) => String(b.lastEvidenceAt).localeCompare(String(a.lastEvidenceAt)));
    if (!miscs.length) body.appendChild(el('p', 'set-learning-empty', 'None recorded.'));
    for (const x of miscs) {
      const item = el('div', 'set-learning-item');
      const head = el('div', 'set-learning-head');
      head.appendChild(el('span', 'set-learning-title', name(x.ref)));
      head.appendChild(el('span', 'set-badge set-badge-' + x.status, STATUS_WORDS[x.status] || x.status));
      item.appendChild(head);
      const meta = [x.signals ? x.signals + ' sign' + (x.signals === 1 ? '' : 's') : '', x.lastEvidenceAt ? 'last seen ' + day(x.lastEvidenceAt) : '', x.stale ? 'old' : ''].filter(Boolean).join(' · ');
      if (meta) item.appendChild(el('div', 'set-learning-meta', meta));
      if (x.lastQuote) item.appendChild(el('div', 'set-learning-quote', '“' + x.lastQuote + '”'));
      const actions = el('div', 'set-learning-actions');
      const dismiss = el('button', 'acct-btn secondary set-small', "That's not me");
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => learningEdit({ action: 'dismiss_misconception', ref: x.ref }));
      actions.appendChild(dismiss);
      if (x.status !== 'repaired') {
        const fixed = el('button', 'acct-btn secondary set-small', "I've got this now");
        fixed.type = 'button';
        fixed.addEventListener('click', () => learningEdit({ action: 'repair_misconception', ref: x.ref }));
        actions.appendChild(fixed);
      }
      item.appendChild(actions);
      body.appendChild(item);
    }

    // Notes (hypotheses), editable
    body.appendChild(el('div', 'acct-section', 'Notes about what you know'));
    const notes = [...(m.hypotheses || [])].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    if (!notes.length) body.appendChild(el('p', 'set-learning-empty', 'None yet.'));
    for (const h of notes) {
      const item = el('div', 'set-learning-item');
      const head = el('div', 'set-learning-head');
      head.appendChild(el('span', 'set-learning-title', name(h.about)));
      head.appendChild(el('span', 'set-learning-meta', (h.source === 'student' ? 'by you' : 'by Kelvin') + ' · ' + day(h.updatedAt) + (h.stale ? ' · old' : '')));
      item.appendChild(head);
      const belief = beliefSelect(h.belief);
      const note = el('textarea', 'set-note');
      note.rows = 2;
      note.maxLength = 300;
      note.value = h.note || '';
      item.appendChild(belief);
      item.appendChild(note);
      const actions = el('div', 'set-learning-actions');
      const save = el('button', 'acct-btn secondary set-small', 'Save');
      save.type = 'button';
      save.addEventListener('click', () => learningEdit({ action: 'edit_note', ref: h.ref || h.about, belief: belief.value, note: note.value }));
      const remove = el('button', 'acct-btn secondary set-small', 'Remove');
      remove.type = 'button';
      remove.addEventListener('click', () => learningEdit({ action: 'remove_note', ref: h.ref || h.about }));
      actions.appendChild(save);
      actions.appendChild(remove);
      item.appendChild(actions);
      body.appendChild(item);
    }
    const add = el('div', 'set-learning-item set-learning-add');
    add.appendChild(el('div', 'set-learning-title', 'Add a note of your own'));
    const about = el('input', 'set-about');
    about.placeholder = 'Topic, e.g. steam tables';
    about.maxLength = 120;
    const addBelief = beliefSelect('solid');
    const addNote = el('textarea', 'set-note');
    addNote.rows = 2;
    addNote.maxLength = 300;
    addNote.placeholder = 'Optional: anything Kelvin should know';
    const addBtn = el('button', 'acct-btn secondary set-small', 'Add note');
    addBtn.type = 'button';
    addBtn.addEventListener('click', () => learningEdit({ action: 'add_note', about: about.value, belief: addBelief.value, note: addNote.value }));
    add.appendChild(about);
    add.appendChild(addBelief);
    add.appendChild(addNote);
    add.appendChild(addBtn);
    body.appendChild(add);

    // Practice
    body.appendChild(el('div', 'acct-section', 'Practice record'));
    const kcs = Object.values(m.kcs || {});
    if (!kcs.length) body.appendChild(el('p', 'set-learning-empty', 'No practice recorded yet.'));
    for (const k of kcs) {
      const item = el('div', 'set-learning-item');
      const head = el('div', 'set-learning-head');
      head.appendChild(el('span', 'set-learning-title', name(k.ref)));
      head.appendChild(el('span', 'set-badge ' + (k.mastered ? 'set-badge-repaired' : 'set-badge-likely'), k.mastered ? 'Mastered' : 'Practising'));
      item.appendChild(head);
      item.appendChild(el('div', 'set-learning-meta', k.correct + ' of ' + k.attempts + ' right · streak ' + k.streak + ' · estimated ' + Math.round(k.pKnown * 100) + '% known' + (k.lastPracticedAt ? ' · ' + day(k.lastPracticedAt) : '')));
      const actions = el('div', 'set-learning-actions');
      const reset = el('button', 'acct-btn secondary set-small', 'Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => learningEdit({ action: 'reset_practice', ref: k.ref }));
      actions.appendChild(reset);
      item.appendChild(actions);
      body.appendChild(item);
    }

    // The exact text the tutor is given
    body.appendChild(el('div', 'acct-section', 'Exactly what Kelvin sees'));
    body.appendChild(el('p', 'acct-note', 'This is the Markdown that goes into Kelvin\'s instructions with every message you send. It is built from everything above, so it changes when you correct something.'));
    body.appendChild(el('pre', 'set-learning-md', view.markdown || ''));
  }

  // Without Jev only Kelvin can pick the style, so the choice is shown but locked.
  function syncRouter() {
    const jevOn = $('set_use_jev').checked;
    $('set_style_router').disabled = !jevOn;
    root.querySelector('.set-router-note').hidden = jevOn;
  }

  function focusables() {
    return Array.from(root.querySelectorAll('button, input:not([readonly]), select, [href]')).filter((el) => !el.disabled && el.offsetParent !== null);
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function message(kind, text) {
    root.querySelector('.set-error').textContent = kind === 'error' ? text : '';
    root.querySelector('.set-ok').textContent = kind === 'ok' ? text : '';
  }

  async function load() {
    const A = window.KelvinAccount;
    const submit = root.querySelector('.set-submit');
    submit.disabled = true;
    message(null, '');
    const [me, styles] = await Promise.all([A.me(), A.call('/api/styles')]);
    if (!me) {
      location.replace('/login?next=' + encodeURIComponent('/?settings=1'));
      return;
    }
    const sel = $('set_default_style');
    sel.innerHTML = '';
    for (const s of styles.ok ? styles.data : []) {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = (s.icon ? s.icon + ' ' : '') + s.name + (s.available ? '' : ' (unavailable)');
      o.disabled = !s.available;
      sel.appendChild(o);
    }
    $('set_email').value = me.user.email || '';
    const p = me.profile || {};
    for (const f of FIELDS) $('set_' + f).value = p[f] || '';
    if (!p.default_style || !sel.querySelector('option[value="' + p.default_style + '"]')) sel.value = 'auto';
    for (const [f, fallback] of Object.entries(SWITCHES)) $('set_' + f).checked = typeof p[f] === 'boolean' ? p[f] : fallback;
    $('set_style_router').value = p.style_router === 'skills' ? 'skills' : 'jev';
    syncRouter();
    submit.disabled = false;
  }

  async function save(e) {
    e.preventDefault();
    message(null, '');
    const body = {};
    for (const f of FIELDS) body[f] = $('set_' + f).value.trim();
    for (const f of Object.keys(SWITCHES)) body[f] = $('set_' + f).checked;
    body.style_router = $('set_style_router').value;
    if (!body.display_name) {
      message('error', 'Please enter your name.');
      return;
    }
    const submit = root.querySelector('.set-submit');
    submit.disabled = true;
    try {
      const saved = await window.KelvinAccount.saveProfile(body);
      try { localStorage.setItem('kelvinStyle', body.default_style); } catch (x) {}
      message('ok', 'Saved.');
      if (onSaved) onSaved(saved && saved.profile ? saved.profile : null);
    } catch (err) {
      message('error', err.message);
    }
    submit.disabled = false;
  }

  function open(opts) {
    const o = opts || {};
    if (!root) build();
    opener = o.opener || document.activeElement;
    onSaved = o.onSaved || null;
    root.hidden = false;
    showTab(o.tab === 'learning' ? 'learning' : 'profile');
    for (const b of root.querySelectorAll('.modal-body')) b.scrollTop = 0;
    load().then(() => {
      if (!root.hidden && !root.querySelector('[data-panel="profile"]').hidden) $('set_display_name').focus();
    });
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    message(null, '');
    const del = root.querySelector('.set-delete');
    delete del.dataset.armed;
    del.textContent = 'Delete account';
    if (opener && typeof opener.focus === 'function') opener.focus();
  }

  window.KelvinSettings = { open, close };
})();
