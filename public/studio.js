// The companion's practice example is separate from the student's conversation.
(() => {
  'use strict';
  const trigger = document.getElementById('studioDemo');
  if (!trigger) return;
  let active = null;
  const loads = new Map();
  function load(src, ready) {
    if (ready()) return Promise.resolve();
    if (!loads.has(src)) loads.set(src, new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = src;
      script.onload = resolve; script.onerror = reject; document.head.append(script);
    }).catch(error => { loads.delete(src); throw error; }));
    return loads.get(src);
  }
  trigger.onclick = async () => {
    if (active) return;
    document.getElementById('app').classList.remove('mobile-open');
    window.KelvinNarration?.pauseAll();
    const dialog = document.createElement('dialog'); dialog.className = 'studio-example-dialog';
    dialog.setAttribute('aria-labelledby','studioExampleTitle');
    const header = document.createElement('header');
    const title = document.createElement('h2'); title.id = 'studioExampleTitle'; title.textContent = 'Practice example · not your problem';
    const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close example'; close.onclick = () => dialog.close();
    const content = document.createElement('div'); content.className = 'studio-example-content'; content.textContent = 'Preparing the example…';
    header.append(title,close); dialog.append(header,content); document.body.append(dialog); active = dialog;
    dialog.addEventListener('close', () => { window.KelvinNarration?.pauseAll(); dialog.remove(); if (active === dialog) active = null; trigger.focus({preventScroll:true}); }, {once:true});
    dialog.showModal(); close.focus();
    try {
      const [spec] = await Promise.all([
        fetch('/studio-demo.json').then(response => { if (!response.ok) throw new Error('Example unavailable'); return response.json(); }),
        load('/board.js', () => !!window.KelvinBoard),
        load('/diagram-view.js', () => !!window.KelvinDiagramView),
      ]);
      if (active !== dialog) return;
      const figure = document.createElement('figure'); figure.className = 'kfig studio-demo-figure';
      figure.innerHTML = window.KelvinBoard.render(spec); content.replaceChildren(figure);
      window.KelvinNarration.mount(figure,spec);
    } catch {
      if (active === dialog) content.textContent = 'The example could not load. Close this example and choose Watch a quick example to retry.';
    }
  };
})();
