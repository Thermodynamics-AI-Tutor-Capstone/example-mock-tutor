(function () {
  'use strict';
  let options = {}, panel, sessionHost, topics = [], loading, selected = '', caseId = '', session = null, busy = false, pageActive = false;
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const button = (label, action, primary = false) => {
    const element = node('button', 'self-check-button' + (primary ? ' self-check-primary' : ''), label);
    element.type = 'button'; element.addEventListener('click', action); return element;
  };
  const blocked = () => busy || Boolean(options.blocked?.());
  function announce(text, error = false) {
    const target = panel?.querySelector('.self-check-status');
    if (target) { target.textContent = text; target.setAttribute('role', error ? 'alert' : 'status'); }
  }
  function topicFromHash() {
    const requested = new URLSearchParams(location.hash.split('?')[1] || '').get('topic');
    const aliases = { 'system-boundary': 'energy-balance', 'process-assumptions': 'energy-balance', 'property-tables': 'state-properties' };
    return aliases[requested] || requested;
  }
  function renderCases() {
    const slot = panel.querySelector('.self-check-case'); slot.replaceChildren();
    const topic = topics.find((item) => item.id === selected);
    if (!topic) return;
    if (!topic.cases.some((item) => item.id === caseId)) caseId = topic.cases[0].id;
    const tabs = node('div', 'self-check-cases'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', 'Choose a case');
    topic.cases.forEach((item, index) => {
      const choice = button(index === 0 ? 'First case' : 'Another context', () => { caseId = item.id; renderCases(); });
      choice.setAttribute('aria-pressed', String(caseId === item.id)); tabs.append(choice);
    });
    const question = node('p', 'self-check-question', topic.cases.find((item) => item.id === caseId).question);
    const start = button('Start this self-check', startCheck, true); start.disabled = blocked();
    const hint = node('p', 'self-check-note', 'Your own explanation comes first. You can ask for help at any time.');
    slot.append(tabs, question, start, hint);
  }
  function render() {
    panel.replaceChildren();
    const header = node('header', 'self-check-heading');
    header.append(node('p', 'self-check-eyebrow', 'KELVIN · Practice'), node('h1', '', 'Check my understanding'),
      node('p', '', 'Try explaining a concept, get feedback, and see what to practice next.'));
    const grid = node('div', 'self-check-topics'); grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', 'Choose a concept');
    topics.forEach((topic) => {
      const choice = button('', () => {
        selected = topic.id; caseId = topic.cases[0].id;
        for (const peer of grid.querySelectorAll('button')) peer.setAttribute('aria-pressed', String(peer.dataset.topic === selected));
        renderCases();
      });
      choice.classList.add('self-check-topic'); choice.dataset.topic = topic.id;
      choice.setAttribute('aria-pressed', String(topic.id === selected));
      choice.append(node('strong', '', topic.title), node('span', '', topic.description)); grid.append(choice);
    });
    const detail = node('section', 'self-check-case'); detail.setAttribute('aria-label', 'Self-check question');
    const status = node('p', 'self-check-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    const footer = node('p', 'self-check-note', 'Practice is not a course grade. About Me can show evidence from your reasoning, including whether you used help.');
    const about = node('a', 'self-check-profile-link', 'View About Me'); about.href = '#/about-me';
    panel.append(header, grid, detail, status, footer, about); renderCases();
  }
  async function startCheck() {
    if (blocked()) { announce('Wait for KELVIN to finish the current reply, then start your self-check.'); return; }
    busy = true; renderCases(); announce('Opening your self-check…');
    try {
      const conversation = await options.api('POST', '/api/conversations', { selfCheck: selected, selfCheckCase: caseId });
      if (!conversation?.id) throw new Error('KELVIN did not return a conversation. Please try again.');
      await options.onOpenConversation?.(conversation);
      if (!options.onOpenConversation) location.hash = '#/c/' + conversation.id;
    } catch (error) { announce(error.message || 'Could not start the self-check. Please try again.', true); }
    finally { setBusy(false); if (pageActive) renderCases(); }
  }
  async function show() {
    pageActive = true; panel.hidden = false; options.onShow?.();
    if (!topics.length) {
      panel.replaceChildren(node('p', 'self-check-status', 'Loading self-check topics…'));
      try {
        loading ||= options.api('GET', '/api/self-check').finally(() => { loading = null; });
        const data = await loading;
        topics = (data?.topics || []).filter((item) => item.id && Array.isArray(item.cases) && item.cases.length);
        if (!topics.length) throw new Error('No self-check topics are available yet.');
      } catch (error) {
        if (!pageActive) return;
        const status = node('p', 'self-check-status', error.message || 'Could not load self-check topics.'); status.setAttribute('role', 'alert');
        panel.replaceChildren(status, button('Try again', show)); return;
      }
    }
    if (!pageActive) return;
    const requested = topicFromHash();
    if (topics.some((item) => item.id === requested)) selected = requested;
    if (!topics.some((item) => item.id === selected)) selected = topics[0].id;
    render();
  }
  async function sendAction(action) {
    if (blocked() || !session?.active || !options.onSend) return;
    const content = action === 'hint' ? 'Please give me a hint for this self-check.'
      : action === 'explain' ? 'Please explain this self-check with the reasoning.'
      : 'Finish this self-check and briefly summarize what my attempt showed and what I could practice next.';
    busy = true; renderSession();
    try { await options.onSend(content, { selfCheckAction: action, preserveDraft: true }); }
    catch (error) {
      const message = node('p', 'self-check-session-error', error.message || 'Could not send. Try again.'); message.setAttribute('role', 'alert'); sessionHost.append(message);
    } finally { busy = false; setBusy(false); }
  }
  function renderSession() {
    if (!sessionHost) return;
    sessionHost.replaceChildren(); sessionHost.hidden = !session?.active;
    if (!session?.active) return;
    const label = node('div', 'self-check-session-label');
    label.append(node('strong', '', 'Self-check · ' + session.title), node('span', '', session.assisted ? 'Practicing with support'
      : session.attempted ? 'Follow-up after your first attempt' : 'Try your own reasoning; help is available'));
    const actions = node('div', 'self-check-session-actions');
    actions.append(button('Give me a hint', () => sendAction('hint')), button('Explain it', () => sendAction('explain')),
      button('Finish self-check', () => sendAction('finish')));
    const profile = node('a', 'self-check-profile-link', 'About Me'); profile.href = '#/about-me'; actions.append(profile);
    sessionHost.append(label, actions); setBusy(busy);
  }
  function setBusy(value) {
    busy = Boolean(value);
    sessionHost?.querySelectorAll('button').forEach((element) => { element.disabled = blocked(); });
    panel?.querySelector('.self-check-primary')?.toggleAttribute('disabled', blocked());
  }
  window.KelvinSelfCheck = {
    init(config) {
      options = config || {}; panel = options.panel || document.getElementById('selfCheckPanel'); sessionHost = options.sessionHost || document.getElementById('selfCheckSession');
      if (!panel || typeof options.api !== 'function') throw new Error('Self-check requires a panel and the authenticated API helper.');
      panel.classList.add('self-check-panel'); panel.hidden = true;
      if (sessionHost) { sessionHost.classList.add('self-check-session'); sessionHost.hidden = true; }
    },
    route() {
      if (!panel || !/^#\/self-check(?:\?|$)/.test(location.hash)) return false;
      show(); return true;
    },
    hide() { pageActive = false; if (panel) panel.hidden = true; },
    active: () => pageActive,
    setConversation(conversation) { session = conversation?.selfCheck || null; renderSession(); },
    handleEvent(event) {
      if (event?.type !== 'self_check') return false;
      session = event.selfCheck || null; renderSession(); return true;
    },
    setBusy,
  };
})();
