// Student-owned view of the existing learning ledger. The application owns navigation.
(function () {
  let root, options = {}, sequence = 0, visible = false, editing = false;
  const el = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  };
  const day = (date) => date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date unavailable';
  const action = (label, fn, secondary = false) => {
    const button = el('button', 'am-button' + (secondary ? ' am-button-secondary' : ''), label);
    button.type = 'button'; button.addEventListener('click', fn); return button;
  };
  function practice(topic) {
    if (typeof options.onPractice === 'function') options.onPractice(topic);
    else location.hash = '#/self-check' + (topic ? '?topic=' + encodeURIComponent(topic) : '');
  }
  function feedback(kind, message) {
    const target = root.querySelector(kind === 'error' ? '.am-error' : '.am-status');
    target.textContent = message;
  }
  async function edit(body, button) {
    if (editing) return;
    editing = true;
    root.querySelectorAll('button, input, textarea').forEach((control) => { control.disabled = true; });
    feedback('error', ''); feedback('status', 'Saving your update…');
    const current = sequence;
    try {
      const response = await window.KelvinAccount.call('/api/me/learning', { method: 'POST', body: JSON.stringify(body) });
      if (!response.ok) throw new Error(response.data?.error || 'Your update could not be saved. Try again.');
      if (current !== sequence || !visible) return;
      render(response.data?.profile);
      feedback('status', body.action === 'reset_skill' ? 'Observations reset. New work can build a fresh picture; your chats are still available.'
        : body.action === 'dismiss_misconception' ? 'This pattern has been removed from the current profile.' : 'Your note has been updated.');
      root.querySelector('.am-heading').focus({ preventScroll: true });
    } catch (error) { if (current === sequence && visible) feedback('error', error.message); }
    finally {
      editing = false; button.disabled = false;
      root?.querySelectorAll('button, input, textarea').forEach((control) => { control.disabled = false; });
      if (root?.querySelector('.am-status')?.textContent === 'Saving your update…') feedback('status', '');
    }
  }
  function evidenceList(evidence) {
    const list = el('ol', 'am-evidence');
    for (const item of [...evidence].reverse()) {
      const row = el('li');
      row.append(el('p', 'am-meta', `${day(item.at)} · ${item.sourceLabel} · ${item.independence === 'independent' ? 'Independent work' : item.independence === 'assisted' ? 'With assistance' : 'Assistance unknown'}`));
      if (item.quote) row.append(el('blockquote', '', item.quote));
      if (item.rationale) row.append(el('p', '', item.rationale));
      row.append(el('p', 'am-meta', `Evidence confidence: ${item.confidence || 'unknown'}${item.knowledgeType ? ' · ' + item.knowledgeType + ' knowledge' : ' · Knowledge dimension not recorded'}`));
      if (item.conversationId && /^[a-zA-Z0-9-]+$/.test(item.conversationId)) {
        const link = el('a', 'am-link', 'Open this conversation');
        link.href = '#/c/' + encodeURIComponent(item.conversationId); row.append(link);
      }
      list.append(row);
    }
    return list;
  }
  function topicCard(topic) {
    const card = el('article', 'am-topic');
    const head = el('div', 'am-topic-head');
    head.append(el('h3', '', topic.label), el('span', 'am-state am-state-' + topic.state, topic.statusLabel));
    card.append(head, el('p', 'am-meta', `${topic.confidence} · ${day(topic.lastEvidenceAt)}${topic.stale ? ' · Older evidence—worth checking again' : ''}`));
    const dimensions = el('dl', 'am-dimensions');
    for (const dimension of topic.dimensions || []) {
      const group = el('div');
      group.append(el('dt', '', dimension.name), el('dd', '', dimension.statusLabel));
      dimensions.append(group);
    }
    card.append(dimensions);
    const details = el('details', 'am-details');
    details.append(el('summary', '', `Why KELVIN thinks this · ${topic.evidence.length} observation${topic.evidence.length === 1 ? '' : 's'}`));
    if (topic.unclassifiedCount) details.append(el('p', 'am-meta', 'Some earlier observations do not identify a knowledge dimension. They remain unclassified.'));
    details.append(evidenceList(topic.evidence)); card.append(details);
    const actions = el('div', 'am-actions');
    actions.append(action('Check my understanding', () => practice(topic.ref)));
    const reset = action('Reset observations', () => edit({ action: 'reset_skill', ref: topic.ref }, reset), true);
    actions.append(reset); card.append(actions); return card;
  }
  function section(title, subtitle) {
    const group = el('section', 'am-section'); group.append(el('h2', '', title));
    if (subtitle) group.append(el('p', 'am-section-note', subtitle));
    return group;
  }
  function render(profile) {
    const body = root.querySelector('.am-content'); body.replaceChildren();
    if (!profile || profile.version !== 1) {
      body.append(el('p', '', 'The learning profile is not available yet. Please refresh after the beta update finishes.'));
      return;
    }
    const topics = profile.topics || [];
    if (!topics.length) {
      const empty = section('Let’s build your learning picture', 'Start with a short self-check or work through a problem with KELVIN. Your own reasoning supplies the evidence.');
      empty.append(el('p', '', 'No strengths or difficulties are assumed from your course, your questions, or a worked solution KELVIN showed you.'), action('Check my understanding', () => practice()));
      body.append(empty);
    } else {
      const strengths = topics.filter((t) => profile.strengths.includes(t.ref));
      const working = topics.filter((t) => !profile.strengths.includes(t.ref));
      for (const [title, description, group] of [
        ['Strengths you have shown', 'Independent evidence in these topics. Each observation remains open to revision.', strengths],
        ['Your next learning opportunities', 'Help used, mixed evidence and older observations guide what to practise next.', working],
      ]) {
        if (!group.length) continue;
        const area = section(title, description), grid = el('div', 'am-topic-grid');
        group.forEach((t) => grid.append(topicCard(t))); area.append(grid); body.append(area);
      }
    }
    if (profile.misconceptions?.length) {
      const area = section('Patterns to revisit', 'These are interpretations of specific work. You can tell KELVIN when an observation does not fit.');
      for (const pattern of profile.misconceptions) {
        const item = el('article', 'am-record');
        item.append(el('h3', '', pattern.label), el('p', 'am-state', pattern.statusLabel),
          el('p', 'am-meta', `${pattern.sourceLabel} · ${day(pattern.at)}${pattern.stale ? ' · Older evidence' : ''}`));
        if (pattern.quote) item.append(el('blockquote', '', pattern.quote));
        item.append(el('p', 'am-meta', pattern.evidenceNote));
        const dismiss = action('This doesn’t fit', () => edit({ action: 'dismiss_misconception', ref: pattern.ref }, dismiss), true);
        item.append(dismiss); area.append(item);
      }
      body.append(area);
    }
    if (profile.practice?.length) {
      const area = section('Practice you have done', 'Completing guided practice and demonstrating independent understanding are recorded separately.');
      const list = el('ul', 'am-practice');
      for (const item of profile.practice) list.append(el('li', '', `${item.label}: ${item.attempts} recorded attempt${item.attempts === 1 ? '' : 's'}, ${item.independentAttempts} marked independent · ${day(item.lastPracticedAt)}`));
      area.append(list); body.append(area);
    }
    const notes = section('What you want KELVIN to know', 'Your notes are self-reports. They help KELVIN understand your goals without becoming an assessment.');
    for (const note of profile.notes || []) {
      const item = el('article', 'am-record');
      item.append(el('h3', '', note.label), el('p', '', note.note || 'No additional note.'), el('p', 'am-meta', `${note.sourceLabel} · ${day(note.at)}${note.stale ? ' · Older note' : ''}`));
      const remove = action('Remove note', () => edit({ action: 'remove_note', ref: note.ref }, remove), true);
      item.append(remove); notes.append(item);
    }
    const form = el('form', 'am-note-form');
    const aboutLabel = el('label', '', 'Topic or goal'), about = el('input'); about.id = 'am-note-about'; about.name = 'about'; about.required = true; about.maxLength = 120; aboutLabel.htmlFor = about.id;
    const noteLabel = el('label', '', 'What would help you?'), note = el('textarea'); note.id = 'am-note-text'; note.name = 'note'; note.rows = 3; note.required = true; note.maxLength = 300; noteLabel.htmlFor = note.id;
    const save = el('button', 'am-button', 'Save my note'); save.type = 'submit';
    form.append(aboutLabel, about, noteLabel, note, save);
    form.addEventListener('submit', (e) => { e.preventDefault(); if (!form.reportValidity()) return; edit({ action: 'add_note', about: about.value, note: note.value, belief: 'unknown' }, save); });
    notes.append(form); body.append(notes);
  }
  async function refresh() {
    if (!root) return;
    const current = ++sequence;
    root.setAttribute('aria-busy', 'true'); feedback('error', ''); feedback('status', 'Loading your learning profile…');
    // Clear old content before reading the account-scoped response, including on failed reloads.
    root.querySelector('.am-content').replaceChildren();
    try {
      const response = await window.KelvinAccount.call('/api/me/learning');
      if (!response.ok) throw new Error(response.status === 401 ? 'Sign in to see your learning profile.' : response.data?.error || 'Could not load your profile. Try again.');
      if (current === sequence && visible) { render(response.data?.profile); feedback('status', ''); }
    } catch (error) { if (current === sequence && visible) { feedback('error', error.message); feedback('status', ''); } }
    finally { if (current === sequence) root.setAttribute('aria-busy', 'false'); }
  }
  window.KelvinAboutMe = {
    init(config = {}) {
      options = config; root = config.panel || document.getElementById('aboutMePanel');
      if (!root) return false;
      root.classList.add('about-me-panel'); root.replaceChildren(); root.hidden = true;
      const wrapper = el('div', 'am-wrapper'), header = el('header', 'am-header');
      const title = el('h1', 'am-heading', 'About Me'); title.tabIndex = -1;
      const text = el('div'); text.append(el('p', 'am-eyebrow', 'KELVIN · Your learning profile'), title,
        el('p', 'am-lede', 'What your work is showing, where support may help, and what to try next.'));
      header.append(text, action('Refresh profile', refresh, true));
      const status = el('p', 'am-status'); status.setAttribute('role', 'status');
      const error = el('p', 'am-error'); error.setAttribute('role', 'alert');
      const explanation = el('details', 'am-guide');
      explanation.append(el('summary', '', 'How to read this profile'), el('p', '', 'KELVIN looks for evidence of recognizing situations, explaining ideas, carrying out steps, and planning a solution. These dimensions can develop differently within each topic.'),
        el('p', '', '“Not enough evidence” means KELVIN has not observed enough yet. Confidence describes the observation, not your ability. Verbal and pictorial representations are ways to connect ideas, not learning-style rankings.'));
      wrapper.append(header, explanation, status, error, el('div', 'am-content')); root.append(wrapper); return true;
    },
    show({ focus = true } = {}) { if (!root) return; visible = true; root.hidden = false; if (focus) root.querySelector('.am-heading').focus({ preventScroll: true }); return refresh(); },
    hide() { visible = false; sequence++; if (root) { root.hidden = true; root.setAttribute('aria-busy', 'false'); } },
    refresh,
  };
})();
