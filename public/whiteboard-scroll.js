// Keep page scrolling natural; students explicitly enter the embedded board to explore it.
(() => {
  'use strict';
  let queued = false, serial = 0;
  function scan() {
    queued = false;
    document.querySelectorAll('.kboard').forEach(board => {
      if (board.closest('.kboard-embed')) return;
      const embed = document.createElement('section'); embed.className = 'kboard-embed';
      const heading = document.createElement('div'); heading.className = 'kboard-scroll-heading';
      const toggle = document.createElement('button'); toggle.type = 'button';
      const hint = document.createElement('span'); hint.id = 'board-scroll-hint-' + ++serial;
      const viewport = document.createElement('div'); viewport.className = 'kboard-scroll'; viewport.id = 'board-scroll-' + serial;
      viewport.setAttribute('role','region'); viewport.setAttribute('aria-label','Scrollable whiteboard'); viewport.setAttribute('aria-describedby',hint.id);
      toggle.setAttribute('aria-controls',viewport.id);
      function mode(active, focus = false) {
        viewport.dataset.scrollMode = active ? 'board' : 'page'; viewport.tabIndex = active ? 0 : -1;
        toggle.setAttribute('aria-pressed',String(active)); toggle.textContent = active ? 'Scroll page' : 'Scroll board';
        hint.textContent = active ? 'Scroll inside the board. Press Esc or choose Scroll page to continue the conversation.' : 'Page scrolling is on. Choose Scroll board to explore the drawing and steps.';
        if (focus) (active ? viewport : toggle).focus({preventScroll:true});
      }
      toggle.onclick = () => mode(viewport.dataset.scrollMode !== 'board',true);
      viewport.addEventListener('keydown',event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); mode(false,true); } });
      viewport.addEventListener('focusout',event => { if (!embed.contains(event.relatedTarget)) mode(false); });
      heading.append(toggle,hint); embed.append(heading,viewport);
      board.replaceWith(embed); viewport.append(board); mode(false);
    });
  }
  new MutationObserver(() => { if (!queued) { queued = true; queueMicrotask(scan); } }).observe(document.body,{childList:true,subtree:true});
  scan();
})();
