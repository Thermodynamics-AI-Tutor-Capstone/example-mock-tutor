// Tutor Studio moves the original live figure, preserving speech, graphs and streamed state.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const app = $('app'), workspace = $('studioWorkspace'), content = $('studioBoardContent');
  const thread = $('thread'), scroll = $('studioBoardScroll'), toggle = $('workspaceToggle');
  const seen = new WeakSet();
  let active = null, queued = false, demoVersion = 0, boardLoader;
  let expanded = !matchMedia('(max-width: 1100px)').matches;
  function setExpanded(value) {
    expanded = value; workspace.hidden = !value;
    app.classList.toggle('workspace-open', value);
    toggle.textContent = value ? 'Hide workspace' : 'Show workspace';
    toggle.setAttribute('aria-expanded', String(value));
    if (!value) window.KelvinNarration?.pauseAll();
  }
  toggle.onclick = () => setExpanded(!expanded);
  setExpanded(expanded);
  function restore() {
    if (!active) return;
    if (active.owner?.isConnected && active.placeholder.isConnected) {
      active.placeholder.replaceWith(active.figure);
      const button = document.createElement('button');
      button.className = 'studio-reopen'; button.type = 'button'; button.textContent = 'Open in workspace ↗';
      button.onclick = () => { button.remove(); promote(activeForButton.figure, activeForButton.owner, true); };
      const activeForButton = active;
      active.figure.before(button);
    }
    active = null;
  }
  function promote(figure, owner, focus = false) {
    if (active?.figure === figure) { setExpanded(true); if (focus) scroll.focus(); return; }
    demoVersion++;
    window.KelvinNarration?.pauseAll();
    restore();
    const placeholder = document.createElement('button');
    placeholder.type = 'button'; placeholder.className = 'studio-figure-link';
    placeholder.textContent = '↗ View this explanation in our workspace';
    placeholder.setAttribute('aria-controls', 'studioWorkspace');
    placeholder.onclick = () => { setExpanded(true); scroll.focus(); scroll.scrollTo(0, 0); };
    figure.replaceWith(placeholder);
    content.replaceChildren(figure);
    active = { figure, owner, placeholder };
    seen.add(figure);
    $('studioWelcome').hidden = true;
    $('workspaceStatus').textContent = 'From your conversation';
    scroll.scrollTop = 0;
    // On narrow screens, preserve reading position; the chat link opens the workspace.
    if (!matchMedia('(max-width: 1100px)').matches || focus) setExpanded(true);
    if (focus) scroll.focus();
  }
  function sync() {
    queued = false;
    if (active && !active.owner.isConnected) {
      window.KelvinNarration?.pauseAll(); active = null; demoVersion++;
      content.replaceChildren(); $('studioWelcome').hidden = false;
      $('workspaceStatus').textContent = 'Ready when you are';
    }
    // setMarkdown temporarily returns the figure to its message to include it in the reuse map.
    if (active && active.figure.closest('.md') === active.owner) {
      active.figure.replaceWith(active.placeholder); content.replaceChildren(active.figure);
    }
    const candidates = [...thread.querySelectorAll('.md figure[data-kfig]')].filter(figure => !seen.has(figure));
    for (const figure of candidates) seen.add(figure);
    const latest = candidates.at(-1);
    if (latest) promote(latest, latest.closest('.md'));
  }
  new MutationObserver(() => {
    if (!queued) { queued = true; requestAnimationFrame(sync); }
  }).observe(thread, { childList: true, subtree: true });
  window.KelvinStudio = {
    reclaim(owner) {
      if (active?.owner === owner && active.placeholder.isConnected) active.placeholder.replaceWith(active.figure);
    },
  };
  async function demo() {
    if (location.hash === '#/learn') { location.hash = '#/'; window.KelvinLearn?.hide(); }
    app.classList.remove('mobile-open');
    setExpanded(true); window.KelvinNarration?.pauseAll();
    restore();
    const version = ++demoVersion;
    $('studioWelcome').hidden = true;
    $('workspaceStatus').textContent = 'Practice example · not your problem';
    content.textContent = 'Preparing the example…';
    try {
      if (!window.KelvinBoard && !boardLoader) boardLoader = new Promise((resolve, reject) => {
        const script = document.createElement('script'); script.src = '/board.js';
        script.onload = resolve; script.onerror = reject; document.head.append(script);
      }).catch(error => { boardLoader = null; throw error; });
      const [spec] = await Promise.all([fetch('/studio-demo.json').then(r => { if (!r.ok) throw new Error(); return r.json(); }), boardLoader]);
      if (version !== demoVersion) return;
      const figure = document.createElement('figure'); figure.className = 'kfig studio-demo-figure';
      figure.innerHTML = window.KelvinBoard.render(spec);
      content.replaceChildren(figure);
      window.KelvinNarration.mount(figure, spec);
      scroll.scrollTop = 0; scroll.focus();
    } catch {
      if (version !== demoVersion) return;
      content.textContent = 'The example could not load. Select “Watch a quick example” to try again.';
    }
  }
  $('studioDemo').onclick = demo; $('workspaceDemo').onclick = demo;
})();
