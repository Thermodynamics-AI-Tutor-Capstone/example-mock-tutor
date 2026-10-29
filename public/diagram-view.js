// Compact diagrams with an optional larger view. Move the original SVG so live
// reveal state, marker references, IDs and event handlers are never duplicated.
(() => {
  'use strict';
  if (window.KelvinDiagramView) return;
  const seen = new WeakSet();
  let queued = false, active = null, scrollHost = null;
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(() => requestAnimationFrame(fitDiagrams)) : {observe(){},unobserve(){}};
  const css = document.createElement('style');
  css.textContent = `
.kdiagram-actions { display:flex; justify-content:flex-end; margin:0 0 5px; }
.kdiagram-expand { font:inherit; font-size:11px; padding:5px 9px; min-height:30px; color:#1e407c; background:#eef5fd; border:1px solid #c7d8ed; border-radius:7px; cursor:pointer; }
.kdiagram-dialog { box-sizing:border-box; width:min(1120px,calc(100vw - 28px)); max-height:calc(100dvh - 28px); padding:0; border:1px solid #b9cde6; border-radius:14px; background:#fbfdff; color:#001e44; box-shadow:0 18px 70px #001e4440; }
.kdiagram-dialog::backdrop { background:#001e4480; }
.kdiagram-dialog header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:12px 16px; border-bottom:1px solid #d1dfef; }
.kdiagram-dialog h2 { font:600 15px/1.4 system-ui,sans-serif; margin:0; flex:1; min-width:140px; }
.kdiagram-dialog button { font:500 12px/1.4 system-ui,sans-serif; padding:8px 11px; min-height:36px; border:1px solid #c7d8ed; border-radius:7px; background:#eef5fd; color:#1e407c; cursor:pointer; }
.kdiagram-dialog button:focus-visible,.kdiagram-expand:focus-visible { outline:2px solid #1e407c; outline-offset:3px; }
.kdiagram-view { overflow:auto; max-height:calc(100dvh - 125px); padding:12px; --bg:#fbfdff; --bubble:#eaf2fc; --text:#001e44; --text2:#526782; --border:#d1dfef; }
.kdiagram-view svg { display:block; width:100%!important; min-width:0!important; max-width:100%!important; height:auto!important; max-height:calc(100dvh - 150px)!important; margin:0 auto; background:#fbfdff; }
.kdiagram-view[data-zoom="true"] svg { width:var(--diagram-detail-width,1100px)!important; min-width:var(--diagram-detail-width,1100px)!important; max-width:none!important; max-height:none!important; }
.kdiagram-view[data-marker="true"] .kboard-node text,.kdiagram-view[data-marker="true"] .kboard-arrow-label { font-family:'Segoe Print','Bradley Hand','Comic Sans MS',cursive; }
@media(max-width:480px) { .kdiagram-dialog header { padding:10px; gap:7px; } .kdiagram-dialog h2 { flex-basis:100%; } .kdiagram-expand { min-height:36px; } }
`;
  document.head.append(css);

  function fitDiagrams() {
    const host = document.getElementById('studioBoardScroll');
    if (!host || host.clientHeight < 1) return;
    if (scrollHost !== host) { if (scrollHost) resize.unobserve(scrollHost); scrollHost = host; resize.observe(host); }
    const top = host.getBoundingClientRect().top;
    host.querySelectorAll('.kboard-canvas > svg,.kfig-mermaid > svg,.kfig-diagram > svg,.kgr-plot > svg').forEach(svg => {
      // Account for the controls, title and optional equation panel above the
      // drawing, instead of assuming every student's viewport has the same room.
      const before = svg.getBoundingClientRect().top - top + host.scrollTop;
      // In a crowded pane retain a complete overview; Expand diagram supplies
      // readable detail instead of letting a minimum height clip the drawing.
      const available = Math.max(64, Math.floor(host.clientHeight - before - 52));
      const value = available + 'px';
      if (svg.style.getPropertyValue('--diagram-fit-height') !== value) svg.style.setProperty('--diagram-fit-height', value);
    });
  }

  function expand(svg, trigger) {
    if (typeof HTMLDialogElement === 'undefined' || typeof HTMLDialogElement.prototype.showModal !== 'function') {
      const enlarged = svg.dataset.inlineExpanded !== 'true';
      svg.dataset.inlineExpanded = String(enlarged);
      if (enlarged) svg.style.setProperty('max-height', 'none', 'important'); else svg.style.removeProperty('max-height');
      trigger.textContent = enlarged ? 'Fit diagram' : 'Expand diagram';
      return;
    }
    if (active) active.dialog.close();
    window.KelvinNarration?.pauseAll();
    const player = svg.closest('.kgr-player');
    if (player?.dataset.playing === 'true') player.querySelector('[data-action="play"]')?.click();
    const marker = Boolean(svg.closest('.kboard-narrated'));
    const placeholder = document.createComment('Expanded diagram returns here');
    svg.before(placeholder);
    const dialog = document.createElement('dialog'); dialog.className = 'kdiagram-dialog';
    const header = document.createElement('header');
    const title = document.createElement('h2');
    title.textContent = svg.getAttribute('aria-label') || svg.querySelector('title')?.textContent || 'Diagram';
    const labelId = 'diagram-view-title'; title.id = labelId; dialog.setAttribute('aria-labelledby', labelId);
    const zoom = document.createElement('button'); zoom.type = 'button'; zoom.textContent = 'Enlarge labels'; zoom.setAttribute('aria-pressed', 'false');
    const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close';
    const view = document.createElement('div'); view.className = 'kdiagram-view'; view.dataset.marker = String(marker);
    view.style.setProperty('--diagram-detail-width', Math.max(900, svg.viewBox.baseVal.width * 1.5 || 1100) + 'px');
    zoom.onclick = () => { const on = view.dataset.zoom !== 'true'; view.dataset.zoom = String(on); zoom.setAttribute('aria-pressed', String(on)); zoom.textContent = on ? 'Fit diagram' : 'Enlarge labels'; };
    close.onclick = () => dialog.close();
    header.append(title, zoom, close); view.append(svg); dialog.append(header, view); document.body.append(dialog);
    active = { dialog, placeholder };
    dialog.addEventListener('close', () => {
      if (placeholder.isConnected) placeholder.replaceWith(svg);
      dialog.remove();
      if (active?.dialog === dialog) active = null;
      if (trigger.isConnected) trigger.focus({ preventScroll:true });
    }, { once:true });
    dialog.showModal(); close.focus();
  }

  function scan() {
    queued = false;
    if (active && !active.placeholder.isConnected) active.dialog.close();
    document.querySelectorAll('.kboard-canvas > svg, .kfig-mermaid > svg, .kfig-diagram > svg, .kgr-plot > svg').forEach(svg => {
      if (seen.has(svg)) return;
      seen.add(svg);
      const actions = document.createElement('div'); actions.className = 'kdiagram-actions';
      const button = document.createElement('button'); button.type = 'button'; button.className = 'kdiagram-expand'; button.textContent = 'Expand diagram';
      button.onclick = () => expand(svg, button); actions.append(button); svg.before(actions);
    });
    fitDiagrams();
  }
  new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(scan); } }).observe(document.body, { childList:true, subtree:true });
  window.KelvinDiagramView = { scan };
  window.addEventListener('resize', fitDiagrams);
  scan();
})();
