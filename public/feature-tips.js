(function () {
  'use strict';
  const DAY = 24 * 60 * 60 * 1000;
  const $ = (id) => document.getElementById(id);
  let options, storageKey, preferences = {}, timer, shownThisVisit = false, current;
  const definitions = [
    {
      id: 'attachment', target: 'attBtn', title: 'Show Kelvin your working', action: 'Attach your work',
      text: 'A photo of your calculations helps Kelvin see the steps you tried. Add what you expected and where you got stuck.',
      matches: (draft) => /\b(my work|my solution|my calculation|handwritten|screenshot|check my|check this)\b/i.test(draft),
      available: () => !window.KelvinAttachments?.hasPending(),
    },
    {
      id: 'voice', target: 'micBtn', title: 'Talk through your reasoning', action: 'Try voice input',
      text: 'Explain what you tried, why you chose that equation, and where you got stuck. Kelvin can use those details to guide its response. Review the transcript before sending.',
      matches: (draft) => draft.trim().length >= 12,
      available: () => window.KelvinVoice?.available(),
    },
    {
      id: 'whiteboard', target: 'whiteboardBtn', title: 'See and hear the explanation', action: 'Use the whiteboard',
      text: 'Try a narrated whiteboard to follow the explanation alongside diagrams and equations. Select it, then send your question when you’re ready.',
      matches: (draft) => /\b(explain|visualize|diagram|understand|cycle|confused)\b/i.test(draft),
      available: () => $('whiteboardBtn').getAttribute('aria-pressed') !== 'true',
    },
  ];
  function save() { try { localStorage.setItem(storageKey, JSON.stringify(preferences)); } catch {} }
  function hide(restoreFocus = false) {
    clearTimeout(timer);
    const hadFocus = $('featureTip').contains(document.activeElement);
    $('featureTip').hidden = true;
    current = null;
    if (restoreFocus && hadFocus) $('input').focus();
  }
  function blocked() {
    return !options || options.blocked() || document.hidden || window.KelvinVoice?.active()
      || Array.from(document.querySelectorAll('[aria-modal="true"]')).some((el) => el.getClientRects().length);
  }
  function consider() {
    if (shownThisVisit || preferences.disabled || blocked() || Date.now() - (preferences.lastShown || 0) < DAY) return;
    const draft = $('input').value;
    if (document.activeElement !== $('input') || draft.trim().length < 12) return;
    const tip = definitions.find((item) => !preferences.seen?.[item.id] && item.matches(draft)
      && item.available() && !$(item.target).disabled);
    if (!tip) return;
    current = tip;
    shownThisVisit = true;
    preferences.lastShown = Date.now();
    preferences.seen = { ...preferences.seen, [tip.id]: true };
    save();
    $('featureTipTitle').textContent = tip.title;
    $('featureTipText').textContent = tip.text;
    $('featureTipTry').textContent = tip.action;
    $('featureTip').hidden = false;
  }
  window.KelvinTips = {
    hide,
    init(config) {
      options = config;
      storageKey = 'kelvin:feature-tips:v1:' + config.userId;
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
        if (saved && typeof saved === 'object' && !Array.isArray(saved)) preferences = saved;
      } catch {}
      $('input').addEventListener('input', () => {
        clearTimeout(timer);
        if (!$('input').value.trim()) hide();
        timer = setTimeout(consider, 2200);
      });
      $('featureTipDismiss').addEventListener('click', () => hide(true));
      $('featureTipDisable').addEventListener('click', () => { preferences.disabled = true; save(); hide(true); });
      $('featureTipTry').addEventListener('click', () => {
        const tip = current;
        const canUse = tip && !blocked() && tip.available() && !$(tip.target).disabled;
        hide(true);
        if (canUse) $(tip.target).click();
      });
      document.addEventListener('keydown', (event) => { if (event.key === 'Escape') hide(true); });
      document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
      const used = (id) => {
        preferences.seen = { ...preferences.seen, [id]: true };
        save();
        hide(true);
      };
      $('attBtn').addEventListener('click', () => used('attachment'));
      $('whiteboardBtn').addEventListener('click', () => used('whiteboard'));
      document.addEventListener('kelvin:feature-used', (event) => used(event.detail));
    },
  };
})();
