// Renders the bounded JSON made by show_on_board. No model-authored SVG, HTML, or JavaScript is used.
(function () {
  let serial = 0;
  const colors = { flow: '#2563eb', heat: '#dc2626', work: '#d97706', relationship: '#64748b' };
  const fills = { component: '#dbeafe', state: '#dcfce7', boundary: '#fef3c7', note: '#f1f5f9' };
  const illustrations = ['piston-cylinder', 'rigid-tank', 'turbine', 'compressor', 'pump', 'nozzle', 'diffuser', 'heat-exchanger', 'refrigerator', 'hose', 'valve', 'mixing-chamber', 'boiler', 'condenser', 'immersed-object'];
  const detailOptions = { illustration: illustrations, surroundings: ['air', 'water', 'gas'], contents: ['gas', 'liquid', 'two-phase'], boundary: ['closed-system', 'control-volume'] };
  const css = `
.kboard { border: 1px solid var(--border); border-radius: 12px; padding: 14px; background: var(--bubble); }
.kboard-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.kboard-hint { color: var(--text2); font-size: 13px; margin-top: 7px; }
.kboard { container-type: inline-size; }
@media (min-width: 1100px) { .thread:has(.kboard-illustrated) { max-width: 1160px; } }
.kboard-layout { display: grid; gap: 12px; min-width: 0; }
.kboard-diagram, .kboard-steps { min-width: 0; }
.kboard-canvas { overflow:hidden; background:#fbfdff; border-radius:9px; --bg:#fbfdff; --bubble:#eaf2fc; --text:#001e44; --text2:#526782; --border:#d1dfef; }
.kboard-illustrated .kboard-canvas { background:#fbfdff; }
.kboard-illustrated .kboard-hint { line-height: 1.5; }
.kboard-layout.kboard-paired { grid-template-columns:minmax(0,1fr); }
.kboard svg { display:block; width:100%; min-width:0; max-width:1000px; max-height:min(70dvh,560px); height:auto; margin:0 auto; }
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
    if (typeof document.querySelector === 'function' && !window.KelvinDiagramView && !document.querySelector('script[data-diagram-view]')) {
      const viewer = document.createElement('script'); viewer.src = '/diagram-view.js'; viewer.dataset.diagramView = 'true';
      viewer.onerror = () => viewer.remove(); document.head.append(viewer);
    }
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
      for (const [key, values] of Object.entries(detailOptions)) {
        if (node[key] !== undefined && !values.includes(node[key])) throw new Error('Invalid illustration detail.');
      }
      if (!node.illustration && Object.keys(detailOptions).some((key) => node[key] !== undefined)) throw new Error('Illustration details need an apparatus.');
      if (node.contents && !['piston-cylinder', 'rigid-tank', 'mixing-chamber', 'boiler', 'condenser'].includes(node.illustration)) throw new Error('Invalid apparatus contents.');
      labelLines(node.label);
      nodes.set(node.id, { ...node, px: 86 + (node.x - 10) * 6.35, py: spec.nodes.some((n) => n.illustration) ? 80 + (node.y - 10) * 4.75 : 55 + (node.y - 10) * 3.5 });
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


  // Authored, bounded SVG primitives: no model-generated markup or external assets.
  // All decorative paths remain inside the node target so existing speech cues reveal them together.
  function apparatus(node) {
    const ink = '#364b62', metal = '#d6e0e8', water = '#bde9f8', gas = '#ffe8b7';
    const parts = [];
    const path = (d, fill = 'none', stroke = ink, width = 2) => '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + width + '" stroke-linecap="round" stroke-linejoin="round"/>';
    const ellipse = (x, y, rx, ry, fill = metal) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" stroke="' + ink + '" stroke-width="2"/>';
    const dots = (color) => [-24, 0, 24].map((x, i) => '<circle cx="' + x + '" cy="' + (i % 2 ? 11 : -7) + '" r="2.5" fill="' + color + '"/>').join('');
    if (node.surroundings) {
      parts.push('<rect x="-82" y="-62" width="164" height="118" rx="12" fill="' + (node.surroundings === 'water' ? '#e0f5ff' : node.surroundings === 'gas' ? '#fff6df' : '#f0f6fc') + '"/>');
      if (node.surroundings === 'water') {
        for (const y of [-54, 45]) parts.push(path('M-76,' + y + ' q9,-5 18,0 t18,0 t18,0 t18,0 t18,0 t18,0 t18,0 t18,0', 'none', '#69bad8', 1.5));
      } else {
        for (const x of [-75, 73]) for (const y of [-35, -5, 25]) parts.push('<circle cx="' + x + '" cy="' + y + '" r="1.7" fill="#8b9eac"/>');
      }
      parts.push('<text x="-76" y="-46" font-size="9" fill="#496477">' + node.surroundings + '</text>');
    }
    const vesselContents = () => {
      if (!node.contents) return '';
      const liquid = node.contents !== 'gas';
      let result = '<rect x="-40" y="-24" width="80" height="48" fill="' + (liquid ? water : gas) + '" stroke="none"/>';
      if (node.contents === 'two-phase') result += '<path d="M-40,-24 H40 V0 Q20,-5 0,0 T-40,0 Z" fill="' + gas + '"/>';
      if (node.contents !== 'liquid') result += dots('#b88a36');
      return result;
    };
    switch (node.illustration) {
      case 'piston-cylinder':
        parts.push(path('M-49,-37 L-49,35 Q0,44 49,35 L49,-37', '#f3f6f8'));
        parts.push(vesselContents());
        parts.push(path('M-41,-23 H41 V-12 H-41 Z', metal), path('M-5,-23 V-48 H5 V-23', metal));
        parts.push(path('M-49,35 L-57,43 H57 L49,35', metal), path('M-40,26 H40', 'none', '#8d9eac', 1));
        break;
      case 'rigid-tank': case 'boiler': case 'condenser': case 'mixing-chamber':
        parts.push(path('M-47,-28 V27 C-47,44 47,44 47,27 V-28', '#f3f6f8'));
        parts.push(vesselContents(), ellipse(0, -28, 47, 11), path('M-47,26 C-47,43 47,43 47,26', 'none', '#8092a4'));
        if (node.illustration === 'mixing-chamber') parts.push(path('M-67,-16 H-47 M-67,13 H-47 M47,0 H67', 'none', '#3985aa', 7));
        if (node.illustration === 'boiler' || node.illustration === 'condenser') parts.push(path('M-65,3 H-27 Q-39,-14 -23,-14 H23 Q39,-14 27,3 H-23 Q-39,20 -23,20 H65', 'none', '#b17246', 4));
        break;
      case 'turbine': case 'compressor': {
        const turbine = node.illustration === 'turbine';
        parts.push(path(turbine ? 'M-46,-19 L40,-39 V39 L-46,19 Z' : 'M-46,-39 L40,-19 V19 L-46,39 Z', metal));
        parts.push(path('M-64,0 H-46 M40,0 H65', 'none', '#3985aa', 7));
        parts.push(path('M-20,-17 L-8,17 M-3,-22 L9,22 M14,-28 L26,28', 'none', '#8799a9', 3));
        parts.push(path('M-7,0 H60 M55,0 V-51', 'none', ink, 4));
        break;
      }
      case 'pump':
        parts.push(path('M-63,8 H-32 M16,-26 V-45 H62', 'none', '#9ab4c7', 13), ellipse(0, 0, 33, 31));
        parts.push(path('M0,0 Q-27,-22 -19,13 M0,0 Q31,-8 16,-24 M0,0 Q-5,32 23,15', 'none', '#5b7d96', 4));
        parts.push(path('M-26,24 L-34,40 H34 L26,24', metal));
        break;
      case 'nozzle': case 'diffuser': {
        const nozzle = node.illustration === 'nozzle';
        parts.push(path(nozzle ? 'M-53,-29 L51,-11 V11 L-53,29 Z' : 'M-53,-11 L51,-29 V29 L-53,11 Z', metal));
        parts.push(path(nozzle ? 'M-45,-15 L47,-5 M-45,15 L47,5' : 'M-45,-5 L47,-15 M-45,5 L47,15', 'none', '#83b6ca', 2));
        parts.push(ellipse(51, 0, 6, nozzle ? 11 : 29, '#edf8fb'));
        break;
      }
      case 'hose':
        parts.push(path('M-59,23 C-27,39 -35,-32 0,-26 S22,28 53,10', 'none', '#395e78', 22));
        parts.push(path('M-59,19 C-27,35 -35,-36 0,-30 S22,24 53,6', 'none', '#9dc2d7', 10));
        parts.push(ellipse(-59, 22, 7, 11, '#c8e8f6'), ellipse(53, 10, 8, 11, '#203e53'), ellipse(53, 10, 4, 7, '#bce8fa'));
        break;
      case 'heat-exchanger':
        parts.push(path('M-56,-28 H48 L58,-18 V28 H-48 L-56,20 Z', '#e8f0f5'));
        parts.push(path('M-70,-12 H33 Q48,-12 48,0 T33,12 H-70', 'none', '#b8704a', 6));
        parts.push(path('M-18,-45 V-28 M19,28 V45', 'none', '#3d87ae', 8));
        parts.push(path('M-38,-22 V22 M-10,-22 V22 M18,-22 V22', 'none', '#8fa8b8', 1.5));
        break;
      case 'refrigerator':
        parts.push(path('M-40,-42 H26 L44,-29 V39 L26,46 H-40 Z', metal), path('M26,-42 V46 M26,-12 H-40', 'none', '#8294a5'));
        parts.push(path('M-33,-35 H17 V-18 H-33 Z M-33,-4 H17 V37 H-33 Z', '#def2fb'));
        parts.push(path('M31,-25 l8,5 -8,5 8,5 -8,5 8,5 -8,5 8,5 -8,5', 'none', '#b76c43', 2.5));
        parts.push(path('M-26,21 H9 M-26,8 H9', 'none', '#80b1c6', 2), ellipse(34, 34, 6, 5, '#667c90'));
        break;
      case 'valve':
        parts.push(path('M-62,0 H-37 M37,0 H62', 'none', '#7c99af', 9));
        parts.push(path('M-37,-20 L37,20 V-20 L-37,20 Z', metal), path('M0,0 V-35 M-18,-35 H18', 'none', ink, 4));
        break;
      case 'immersed-object':
        parts.push(path('M-37,-21 L12,-34 L40,-15 V29 L-10,40 L-37,20 Z', '#e4b79b'));
        parts.push(path('M-37,-21 L-10,-3 L40,-15 M-10,-3 V40', 'none', '#996d50'));
        break;
    }
    if (node.boundary) {
      parts.push('<rect x="-70" y="-57" width="140" height="106" rx="14" fill="none" stroke="#8552ae" stroke-width="1.8" stroke-dasharray="6 4"/>');
      parts.push('<text x="0" y="-63" text-anchor="middle" font-size="10" fill="#744494">' + (node.boundary === 'control-volume' ? 'Control volume' : 'Closed system') + '</text>');
    }
    return '<g class="kboard-apparatus" data-illustration="' + node.illustration + '" transform="translate(' + node.px + ',' + (node.py - 12) + ')">' + parts.join('') + '</g>';
  }

  function render(spec, { animate = false } = {}) {
    injectCss();
    const nodes = checked(spec);
    const id = 'kb' + ++serial;
    const illustrated = [...nodes.values()].some((node) => node.illustration);
    const marker = Boolean(spec.lesson);
    const inks = marker ? { flow: '#2458b4', heat: '#c03236', work: '#98500e', relationship: '#7345aa' } : colors;
    const nodeInks = { component: '#2458b4', state: '#207148', boundary: '#7345aa', note: '#303b48' };
    const stepInks = ['#2458b4', '#207148', '#7345aa', '#c03236'];
    const out = [`<div class="kboard${animate ? ' kboard-live' : ''}${illustrated ? ' kboard-illustrated' : ''}"><div class="kboard-title">${esc(spec.title)}</div><div class="kboard-layout${nodes.size && spec.steps.length ? ' kboard-paired' : ''}">`];
    if (nodes.size) {
      const ys = [...nodes.values()].map((node) => node.py);
      const top = Math.max(0, Math.min(...ys) - (illustrated ? 88 : 66));
      const bottom = Math.min(illustrated ? 560 : 390, Math.max(...ys) + (illustrated ? 96 : 66));
      out.push(`<div class="kboard-diagram"><div class="kboard-canvas"><svg viewBox="0 ${top.toFixed(1)} 680 ${(bottom - top).toFixed(1)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title ${id}-desc" font-family="inherit">`);
      const summary = `Schematic, not to scale. Components: ${spec.nodes.map((node) => node.label + (node.illustration ? ', ' + node.illustration.replaceAll('-', ' ') : '') + (node.surroundings ? ', surrounded by ' + node.surroundings : '') + (node.contents ? ', containing ' + node.contents : '') + (node.boundary ? ', ' + node.boundary.replaceAll('-', ' ') + ' boundary' : '')).join('; ')}. Connections: ${spec.arrows.map((arrow) => `${nodes.get(arrow.from).label} to ${nodes.get(arrow.to).label}${arrow.label ? `, ${arrow.label}` : ''}`).join('; ') || 'none'}.`;
      out.push(`<title id="${id}-title">${esc(spec.title)}</title><desc id="${id}-desc">${esc(summary)}</desc>`);
      out.push('<defs>');
      for (const [kind, color] of Object.entries(inks)) {
        out.push(`<marker id="${id}-${kind}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9 z" fill="${color}"/></marker>`);
      }
      out.push('</defs>');
      for (const [i, arrow] of spec.arrows.entries()) {
        const a = nodes.get(arrow.from), b = nodes.get(arrow.to);
        const dx = b.px - a.px, dy = b.py - a.py;
        const distance = Math.hypot(dx, dy);
        const ux = dx / distance, uy = dy / distance;
        const edge = (node, direction) => {
          const scale = 1 / Math.max(Math.abs(ux) / (node.illustration ? 86 : 76), Math.abs(uy) / (node.illustration ? 62 : 34));
          return [node.px + direction * ux * scale, node.py + direction * uy * scale];
        };
        const [x1, y1] = edge(a, 1), [x2, y2] = edge(b, -1);
        const delay = (nodes.size * .24 + i * .34).toFixed(2);
        out.push(`<path class="kboard-arrow" data-board-target="arrow:${i}" style="--delay:${delay}s" d="M${x1.toFixed(1)},${y1.toFixed(1)} Q${((x1 + x2) / 2).toFixed(1)},${((y1 + y2) / 2 + (marker ? 2 : 0)).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="${inks[arrow.kind]}" stroke-width="${marker ? 3.2 : 2.4}" marker-end="url(#${id}-${arrow.kind})"/>`);
        if (arrow.label) out.push(`<text class="kboard-arrow-label" data-board-target="arrow:${i}" style="--delay:${(Number(delay) + .3).toFixed(2)}s" x="${((x1 + x2) / 2).toFixed(1)}" y="${((y1 + y2) / 2 - 8).toFixed(1)}" text-anchor="middle" font-size="12" fill="${inks[arrow.kind]}" stroke="${marker ? '#fffef9' : 'var(--bubble)'}" stroke-width="4" paint-order="stroke">${esc(arrow.label)}</text>`);
      }
      for (const [i, node] of [...nodes.values()].entries()) {
        const lines = labelLines(node.label);
        out.push(`<g class="kboard-node" data-board-target="node:${esc(node.id)}" style="--delay:${(i * .24).toFixed(2)}s">`);
        if (node.illustration) out.push(apparatus(node));
        else if (marker) {
          const x = node.px - 76, y = node.py - 34;
          // Slightly bowed edges and round joins suggest a dry-erase sketch without distorting labels.
          out.push(`<path class="kboard-marker-outline" d="M${x + 10},${y} Q${x + 77},${y - 1.5} ${x + 142},${y + 1} Q${x + 153},${y} ${x + 152},${y + 11} L${x + 151},${y + 57} Q${x + 153},${y + 69} ${x + 142},${y + 68} Q${x + 74},${y + 70} ${x + 10},${y + 67} Q${x - 1},${y + 68} ${x},${y + 57} L${x + 1},${y + 11} Q${x},${y - 1} ${x + 10},${y}" fill="none" stroke="${nodeInks[node.kind]}" stroke-width="3.2"/>`);
        } else out.push(`<rect x="${(node.px - 76).toFixed(1)}" y="${(node.py - 34).toFixed(1)}" width="152" height="68" rx="10" fill="${fills[node.kind]}" stroke="var(--text2)" stroke-width="1.4"/>`);
        out.push(`<text x="${node.px.toFixed(1)}" y="${(node.illustration ? node.py + 52 : node.py - (lines.length - 1) * 8).toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="600" fill="${marker ? nodeInks[node.kind] : '#172033'}">`);
        lines.forEach((line, index) => out.push(`<tspan x="${node.px.toFixed(1)}" dy="${index ? 16 : 0}">${esc(line)}</tspan>`));
        out.push('</text></g>');
      }
      out.push('</svg></div><div class="kboard-hint">Schematic — not to scale. Expand for larger labels. Colors identify features, not temperature or phase.</div></div>');
    }
    if (spec.steps.length) {
      out.push('<ol class="kboard-steps">');
      for (const [i, step] of spec.steps.entries()) {
        const delay = (nodes.size * .24 + spec.arrows.length * .34 + i * .38).toFixed(2);
        out.push(`<li class="kboard-step" data-board-target="step:${i}" style="--delay:${delay}s${marker ? ';--step-ink:' + stepInks[i % stepInks.length] : ''}"><strong>${esc(step.label)}</strong>`);
        if (step.latex) {
          try { out.push(katex.renderToString(step.latex, { displayMode: true, throwOnError: false, trust: false })); }
          catch { out.push(`<code>${esc(step.latex)}</code>`); }
        }
        if (step.note) out.push(`<div class="kboard-note">${esc(step.note)}</div>`);
        out.push('</li>');
      }
      out.push('</ol>');
    }
    out.push('</div></div>');
    return out.join('');
  }

  window.KelvinBoard = { render };
})();
