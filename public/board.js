// Renders the bounded JSON made by show_on_board. No model-authored SVG, HTML, or JavaScript is used.
(function () {
  let serial = 0;
  const colors = { flow: '#2563eb', heat: '#dc2626', work: '#d97706', relationship: '#64748b' };
  const fills = { component: '#dbeafe', state: '#dcfce7', boundary: '#fef3c7', note: '#f1f5f9' };
  const css = `
.kboard { border: 1px solid var(--border); border-radius: 12px; padding: 14px; background: var(--bubble); }
.kboard-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.kboard-hint { color: var(--text2); font-size: 11px; margin-top: 7px; }
.kboard-canvas { overflow-x: auto; }
.kboard svg { display: block; width: 100%; min-width: 580px; height: auto; }
.kboard-steps { display: grid; gap: 8px; margin: 8px 0 0; padding: 0; list-style: none; }
.kboard-step { border-top: 1px solid var(--border); padding-top: 8px; color: var(--text); font-size: 13px; }
.kboard-step strong { display: block; margin-bottom: 3px; }
.kboard-step .katex-display { margin: 5px 0; overflow-x: auto; overflow-y: hidden; }
.kboard-note { color: var(--text2); line-height: 1.5; }
.kboard-live .kboard-node, .kboard-live .kboard-step, .kboard-live .kboard-arrow-label { opacity: 0; animation: kboard-appear .35s ease forwards; animation-delay: var(--delay); }
.kboard-live .kboard-arrow { stroke-dasharray: 750; stroke-dashoffset: 750; animation: kboard-draw .65s ease forwards; animation-delay: var(--delay); }
@keyframes kboard-appear { to { opacity: 1; } }
@keyframes kboard-draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
  .kboard-live .kboard-node, .kboard-live .kboard-step, .kboard-live .kboard-arrow-label { opacity: 1; animation: none; }
  .kboard-live .kboard-arrow { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
}
`;

  function injectCss() {
    if (document.getElementById('kelvin-board-css')) return;
    const style = document.createElement('style');
    style.id = 'kelvin-board-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function plain(value, max) {
    return typeof value === 'string' && value.trim().length > 0 && value.length <= max && !/[\r\n\u0000-\u001f]/.test(value);
  }

  function labelLines(text) {
    const lines = [''];
    for (const word of text.split(/\s+/)) {
      const i = lines.length - 1;
      if (lines[i] && (lines[i] + ' ' + word).length > 19) lines.push(word);
      else lines[i] = (lines[i] + ' ' + word).trim();
    }
    if (lines.length > 3 || lines.some((line) => line.length > 23)) throw new Error('A board label is too long to draw.');
    return lines;
  }

  function checked(spec) {
    if (!spec || spec.version !== 1 || !['sketch', 'solution'].includes(spec.kind) || !plain(spec.title, 90) ||
        !Array.isArray(spec.nodes) || spec.nodes.length > 8 || !Array.isArray(spec.arrows) || spec.arrows.length > 12 ||
        !Array.isArray(spec.steps) || spec.steps.length > 6) throw new Error('Invalid teaching board.');
    const nodes = new Map();
    for (const node of spec.nodes) {
      if (!node || typeof node.id !== 'string' || !/^[a-z][a-z0-9_-]{0,23}$/.test(node.id) || nodes.has(node.id) || !plain(node.label, 48) ||
          !Object.hasOwn(fills, node.kind) || !Number.isInteger(node.x) || !Number.isInteger(node.y) ||
          node.x < 10 || node.x > 90 || node.y < 10 || node.y > 90) throw new Error('Invalid teaching board node.');
      labelLines(node.label);
      nodes.set(node.id, { ...node, px: 86 + (node.x - 10) * 6.35, py: 55 + (node.y - 10) * 3.5 });
    }
    if (spec.kind === 'sketch' && !nodes.size) throw new Error('The sketch has no nodes.');
    if (spec.kind === 'solution' && !spec.steps.length) throw new Error('The solution board has no steps.');
    for (const arrow of spec.arrows) {
      if (!arrow || !nodes.has(arrow.from) || !nodes.has(arrow.to) || arrow.from === arrow.to ||
          !Object.hasOwn(colors, arrow.kind) || typeof arrow.label !== 'string' || arrow.label.length > 48 ||
          /[\r\n\u0000-\u001f]/.test(arrow.label)) throw new Error('Invalid teaching board arrow.');
    }
    for (const step of spec.steps) {
      if (!step || !plain(step.label, 36) || typeof step.latex !== 'string' || step.latex.length > 180 ||
          typeof step.note !== 'string' || step.note.length > 180 || /[\r\n\u0000-\u001f]/.test(step.latex + step.note)) {
        throw new Error('Invalid teaching board step.');
      }
    }
    return nodes;
  }

  function render(spec, { animate = false } = {}) {
    injectCss();
    const nodes = checked(spec);
    const id = 'kb' + ++serial;
    const out = [`<div class="kboard${animate ? ' kboard-live' : ''}"><div class="kboard-title">${esc(spec.title)}</div>`];
    if (nodes.size) {
      const ys = [...nodes.values()].map((node) => node.py);
      const top = Math.max(0, Math.min(...ys) - 66);
      const bottom = Math.min(390, Math.max(...ys) + 66);
      out.push(`<div class="kboard-canvas"><svg viewBox="0 ${top.toFixed(1)} 680 ${(bottom - top).toFixed(1)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title ${id}-desc" font-family="inherit">`);
      const summary = `Schematic, not to scale. Components: ${spec.nodes.map((node) => node.label).join(', ')}. Connections: ${spec.arrows.map((arrow) => `${nodes.get(arrow.from).label} to ${nodes.get(arrow.to).label}${arrow.label ? `, ${arrow.label}` : ''}`).join('; ') || 'none'}.`;
      out.push(`<title id="${id}-title">${esc(spec.title)}</title><desc id="${id}-desc">${esc(summary)}</desc>`);
      out.push('<defs>');
      for (const [kind, color] of Object.entries(colors)) {
        out.push(`<marker id="${id}-${kind}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9 z" fill="${color}"/></marker>`);
      }
      out.push('</defs>');
      for (const [i, arrow] of spec.arrows.entries()) {
        const a = nodes.get(arrow.from), b = nodes.get(arrow.to);
        const dx = b.px - a.px, dy = b.py - a.py;
        const distance = Math.hypot(dx, dy);
        const ux = dx / distance, uy = dy / distance;
        const edge = (node, direction) => {
          const scale = 1 / Math.max(Math.abs(ux) / 76, Math.abs(uy) / 34);
          return [node.px + direction * ux * scale, node.py + direction * uy * scale];
        };
        const [x1, y1] = edge(a, 1), [x2, y2] = edge(b, -1);
        const delay = (nodes.size * .24 + i * .34).toFixed(2);
        out.push(`<line class="kboard-arrow" style="--delay:${delay}s" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${colors[arrow.kind]}" stroke-width="2.4" marker-end="url(#${id}-${arrow.kind})"/>`);
        if (arrow.label) out.push(`<text class="kboard-arrow-label" style="--delay:${(Number(delay) + .3).toFixed(2)}s" x="${((x1 + x2) / 2).toFixed(1)}" y="${((y1 + y2) / 2 - 8).toFixed(1)}" text-anchor="middle" font-size="12" fill="${colors[arrow.kind]}" stroke="var(--bubble)" stroke-width="4" paint-order="stroke">${esc(arrow.label)}</text>`);
      }
      for (const [i, node] of [...nodes.values()].entries()) {
        const lines = labelLines(node.label);
        out.push(`<g class="kboard-node" style="--delay:${(i * .24).toFixed(2)}s"><rect x="${(node.px - 76).toFixed(1)}" y="${(node.py - 34).toFixed(1)}" width="152" height="68" rx="10" fill="${fills[node.kind]}" stroke="var(--text2)" stroke-width="1.4"/>`);
        out.push(`<text x="${node.px.toFixed(1)}" y="${(node.py - (lines.length - 1) * 8).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="600" fill="#172033">`);
        lines.forEach((line, index) => out.push(`<tspan x="${node.px.toFixed(1)}" dy="${index ? 16 : 0}">${esc(line)}</tspan>`));
        out.push('</text></g>');
      }
      out.push('</svg></div><div class="kboard-hint">Schematic — positions are not to scale. Swipe sideways on a narrow screen.</div>');
    }
    if (spec.steps.length) {
      out.push('<ol class="kboard-steps">');
      for (const [i, step] of spec.steps.entries()) {
        const delay = (nodes.size * .24 + spec.arrows.length * .34 + i * .38).toFixed(2);
        out.push(`<li class="kboard-step" style="--delay:${delay}s"><strong>${esc(step.label)}</strong>`);
        if (step.latex) {
          try { out.push(katex.renderToString(step.latex, { displayMode: true, throwOnError: false, trust: false })); }
          catch { out.push(`<code>${esc(step.latex)}</code>`); }
        }
        if (step.note) out.push(`<div class="kboard-note">${esc(step.note)}</div>`);
        out.push('</li>');
      }
      out.push('</ol>');
    }
    out.push('</div>');
    return out.join('');
  }

  window.KelvinBoard = { render };
})();
