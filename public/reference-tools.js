// Equation references open as a static snapshot; figures remain in the conversation.
(() => {
  'use strict';
  const trigger = document.getElementById('importantEquationsBtn');
  const thread = document.getElementById('thread');
  if (!trigger || !thread) return;
  trigger.onclick = () => {
    const popup = window.open('about:blank','_blank');
    if (!popup) return;
    popup.opener = null;
    const doc = popup.document; doc.title = 'KELVIN — Important equations';
    const meta = doc.createElement('meta'); meta.name = 'viewport'; meta.content = 'width=device-width, initial-scale=1';
    const css = doc.createElement('link'); css.rel = 'stylesheet'; css.href = new URL('/vendor/katex/katex.min.css',location.href).href;
    const style = doc.createElement('style'); style.textContent = 'body{font:17px/1.6 system-ui;background:#f3f7fd;color:#001e44;max-width:1000px;margin:24px auto;padding:20px}article{background:white;border:1px solid #cddced;border-radius:12px;padding:20px;margin:18px 0}.katex-display{overflow:auto}p{color:#526782}';
    doc.head.append(meta,css,style);
    const title = doc.createElement('h1'); title.textContent = 'Important equations';
    const note = doc.createElement('p'); note.textContent = 'Displayed equations from this conversation. This read-only snapshot does not update. Open Important equations again for a fresh reference; check each equation’s assumptions and units.';
    doc.body.append(title,note);
    const equations = new Map();
    for (const annotation of thread.querySelectorAll('.msg.assistant .katex-display annotation[encoding="application/x-tex"]')) {
      const tex = annotation.textContent.trim(); if (!tex || tex.length > 3000) continue;
      const step = annotation.closest('.kboard-step');
      const preceding = annotation.closest('p,li,blockquote')?.previousElementSibling;
      const context = step?.querySelector('.kboard-note')?.textContent || (preceding && /assum|steady|adiabatic|neglect|constant|closed system/i.test(preceding.textContent) ? preceding.textContent.slice(0,360) : '');
      const item = {tex, label:step?.querySelector('strong')?.textContent || 'Equation from the conversation', context};
      if (!equations.has(tex) || step) equations.set(tex,item);
    }
    if (!equations.size) { const empty = doc.createElement('p'); empty.textContent = 'No displayed equations are available in this conversation yet.'; doc.body.append(empty); }
    for (const item of equations.values()) {
      const card = doc.createElement('article'); const label = doc.createElement('strong'); label.textContent = item.label;
      const math = doc.createElement('div');
      if (window.katex) window.katex.render(item.tex,math,{displayMode:true,throwOnError:false,trust:false,strict:'ignore'}); else math.textContent = item.tex;
      card.append(label,math);
      if (item.context) { const context = doc.createElement('p'); context.textContent = item.context; card.append(context); }
      doc.body.append(card);
    }
  };
})();
