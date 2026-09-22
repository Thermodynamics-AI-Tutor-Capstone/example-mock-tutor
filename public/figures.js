// Draws the figures in Kelvin's replies. Loaded on demand by app.js the first time a reply
// contains one, so a chat without figures never pays for it.
//
// Two kinds of fenced block:
//   ```mermaid          — a Mermaid diagram (cycle sketches, concept maps), drawn by the Mermaid
//                         library, which is fetched only when the first one appears.
//   ```kelvin-diagram   — a property diagram. The block holds only the request (fluid, diagram
//                         type, states, processes); the server computes the saturation dome and
//                         every curve from the property tables and this file draws the SVG. So a
//                         saved reply redraws from the same tables rather than from stored pixels.
//
// Rendering is idempotent and cached by block text: app.js re-renders the whole reply on every
// streamed token, and a finished figure is put straight back without redrawing or refetching.
(function () {
  const cache = new Map();
  const pending = new Map();
  let mermaidPromise = null;
  let uid = 0;

  const CSS = `
.kfig { margin: 14px 0; }
.kfig svg { display: block; width: 100%; height: auto; }
.kfig figcaption { color: var(--text2); font-size: 12px; line-height: 1.5; margin-top: 8px; }
.kfig figcaption b { font-weight: 600; color: var(--text); }
.kfig-note { color: var(--text2); font-size: 13px; border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; }
.kfig-error { color: var(--error-text); background: var(--error-bg); border: 1px solid var(--error-border); border-radius: 12px; padding: 12px 14px; font-size: 13px; }
.kfig-mermaid { text-align: center; }
.kfig-mermaid svg { margin: 0 auto; }
`;

  function injectCss() {
    if (document.getElementById('kelvin-figure-css')) return;
    const el = document.createElement('style');
    el.id = 'kelvin-figure-css';
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return 'f' + (h >>> 0).toString(36);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---- property diagrams -----------------------------------------------------------------------

  const COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#0891b2'];

  function fmt(v) {
    const a = Math.abs(v);
    if (a === 0) return '0';
    if (a >= 100000 || a < 0.001) return v.toExponential(0).replace('e+', 'e');
    if (a >= 100) return String(Math.round(v));
    if (a >= 10) return String(Math.round(v * 10) / 10);
    if (a >= 1) return String(Math.round(v * 100) / 100);
    return String(Number(v.toPrecision(2)));
  }

  function linearTicks(min, max) {
    const step0 = (max - min) / 6;
    const mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const norm = step0 / mag;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const out = [];
    for (let t = Math.ceil(min / step) * step; t <= max + step * 1e-6; t += step) out.push(Math.round(t / step) * step);
    return out;
  }

  function logTicks(min, max) {
    const out = [];
    const lo = Math.floor(Math.log10(min));
    const hi = Math.ceil(Math.log10(max));
    const few = hi - lo <= 3;
    for (let d = lo; d <= hi; d++) {
      for (const m of few ? [1, 2, 5] : [1]) {
        const v = m * Math.pow(10, d);
        if (v >= min * 0.999 && v <= max * 1.001) out.push(v);
      }
    }
    return out;
  }

  function svgFor(d) {
    const W = 680;
    const H = 470;
    const m = { l: 68, r: 28, t: 14, b: 54 };
    const ok = (p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]) && (!d.axes.x.log || p[0] > 0) && (!d.axes.y.log || p[1] > 0);
    // The axes are chosen around the states and their processes. The dome and the constant-pressure
    // lines are then drawn as far as they reach, and clipped: a saturation dome that runs down to
    // very cold liquid would otherwise squeeze the cycle into a corner.
    const core = [];
    for (const s of d.states) core.push(s.xy);
    for (const p of d.paths) for (const q of p.points) core.push(q);
    const extra = [];
    for (const i of d.isobars) for (const q of i.points) extra.push(q);
    for (const q of d.dome.liquid) extra.push(q);
    for (const q of d.dome.vapor) extra.push(q);
    if (ok(d.critical)) extra.push(d.critical);
    const inner = core.filter(ok);
    if (inner.length < 1) return '<div class="kfig-error">Nothing to draw on this diagram.</div>';

    const box = (list, i, log) => [Math.min(...list.map((p) => p[i])), Math.max(...list.map((p) => p[i]))];
    const grow = ([lo, hi], f, log) => {
      if (log) {
        const r = Math.pow(hi / lo, f) || 1 + f;
        return [lo / r, hi * r];
      }
      const pad = (hi - lo) * f || Math.max(1, Math.abs(hi) * f);
      return [lo - pad, hi + pad];
    };
    const roomX = grow(box(inner, 0, d.axes.x.log), 0.6, d.axes.x.log);
    const roomY = grow(box(inner, 1, d.axes.y.log), 0.6, d.axes.y.log);
    const near = extra.filter((p) => ok(p) && p[0] >= roomX[0] && p[0] <= roomX[1] && p[1] >= roomY[0] && p[1] <= roomY[1]);
    const pts = inner.concat(near);
    const [x0, x1] = grow(box(pts, 0, d.axes.x.log), 0.04, d.axes.x.log);
    const [y0, y1] = grow(box(pts, 1, d.axes.y.log), 0.04, d.axes.y.log);
    const sx = (v) => (d.axes.x.log ? m.l + ((Math.log10(v) - Math.log10(x0)) / (Math.log10(x1) - Math.log10(x0))) * (W - m.l - m.r) : m.l + ((v - x0) / (x1 - x0)) * (W - m.l - m.r));
    const sy = (v) => (d.axes.y.log ? H - m.b - ((Math.log10(v) - Math.log10(y0)) / (Math.log10(y1) - Math.log10(y0))) * (H - m.t - m.b) : H - m.b - ((v - y0) / (y1 - y0)) * (H - m.t - m.b));
    const line = (points) => points.filter(ok).map((p) => `${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(' ');

    const out = [];
    out.push(`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(d.title)}" font-family="inherit">`);
    out.push('<defs>');
    COLORS.forEach((c, i) => out.push(`<marker id="kfa${uid}-${i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z" fill="${c}"/></marker>`));
    out.push(`<clipPath id="kfc${uid}"><rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}"/></clipPath>`);
    out.push('</defs>');

    // grid and axes
    const xt = d.axes.x.log ? logTicks(x0, x1) : linearTicks(x0, x1);
    const yt = d.axes.y.log ? logTicks(y0, y1) : linearTicks(y0, y1);
    for (const t of xt) out.push(`<line x1="${sx(t).toFixed(1)}" y1="${m.t}" x2="${sx(t).toFixed(1)}" y2="${H - m.b}" stroke="var(--border)" stroke-width="1"/><text x="${sx(t).toFixed(1)}" y="${H - m.b + 18}" text-anchor="middle" font-size="12" fill="var(--text2)">${fmt(t)}</text>`);
    for (const t of yt) out.push(`<line x1="${m.l}" y1="${sy(t).toFixed(1)}" x2="${W - m.r}" y2="${sy(t).toFixed(1)}" stroke="var(--border)" stroke-width="1"/><text x="${m.l - 8}" y="${(sy(t) + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="var(--text2)">${fmt(t)}</text>`);
    out.push(`<rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}" fill="none" stroke="var(--text2)" stroke-width="1.2"/>`);
    out.push(`<text x="${(m.l + (W - m.r)) / 2}" y="${H - 14}" text-anchor="middle" font-size="13" fill="var(--text2)">${esc(d.axes.x.label)} (${esc(d.axes.x.unit)})</text>`);
    out.push(`<text x="16" y="${(m.t + (H - m.b)) / 2}" text-anchor="middle" font-size="13" fill="var(--text2)" transform="rotate(-90 16 ${(m.t + (H - m.b)) / 2})">${esc(d.axes.y.label)} (${esc(d.axes.y.unit)})</text>`);

    // saturation dome
    out.push(`<g clip-path="url(#kfc${uid})">`);
    const domePts = d.dome.liquid.concat(d.dome.vapor.slice().reverse());
    out.push(`<polyline points="${line(domePts)}" fill="var(--bubble)" stroke="var(--text2)" stroke-width="1.6" stroke-linejoin="round"/>`);
    if (ok(d.critical)) out.push(`<circle cx="${sx(d.critical[0]).toFixed(1)}" cy="${sy(d.critical[1]).toFixed(1)}" r="3" fill="var(--text2)"/>`);

    // constant-pressure lines
    for (const iso of d.isobars) {
      const pl = line(iso.points);
      if (!pl) continue;
      out.push(`<polyline points="${pl}" fill="none" stroke="var(--text2)" stroke-width="1" stroke-dasharray="1 3" opacity="0.8"/>`);
      const last = iso.points.filter(ok).at(-1);
      if (last) out.push(`<text x="${(sx(last[0]) - 4).toFixed(1)}" y="${(sy(last[1]) - 5).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--text2)">${esc(iso.label)}</text>`);
    }

    // processes
    d.paths.forEach((p, i) => {
      const c = COLORS[i % COLORS.length];
      const pl = line(p.points);
      if (!pl) return;
      out.push(`<polyline points="${pl}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"${p.dashed ? ' stroke-dasharray="6 4"' : ''} marker-end="url(#kfa${uid}-${i % COLORS.length})"/>`);
    });

    out.push('</g>');

    // states
    for (const s of d.states) {
      if (!ok(s.xy)) continue;
      const x = sx(s.xy[0]);
      const y = sy(s.xy[1]);
      out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="var(--bg)" stroke="var(--text)" stroke-width="2"/>`);
      const left = x > W - m.r - 60;
      out.push(`<text x="${(x + (left ? -9 : 9)).toFixed(1)}" y="${(y - 8).toFixed(1)}" text-anchor="${left ? 'end' : 'start'}" font-size="13" font-weight="600" fill="var(--text)">${esc(s.label)}</text>`);
    }
    out.push('</svg>');
    return out.join('');
  }

  function captionFor(d) {
    const bits = [];
    if (d.title) bits.push(`<b>${esc(d.title)}</b>`);
    const processes = d.paths.map((p, i) => `<span style="color:${COLORS[i % COLORS.length]}">${esc(p.from)}→${esc(p.to)}</span> ${esc(p.path)}`).join(' · ');
    if (processes) bits.push(processes);
    bits.push(`${esc(d.fluid)}; saturation dome and every curve computed from the property tables`);
    for (const p of d.problems || []) bits.push(`⚠ ${esc(p)}`);
    return `<figcaption>${bits.join('<br>')}</figcaption>`;
  }

  async function renderDiagram(spec, api) {
    const d = await api('POST', '/api/properties/diagram', spec);
    uid++;
    return svgFor(d) + captionFor(d);
  }

  // ---- mermaid ---------------------------------------------------------------------------------

  function loadMermaid() {
    if (mermaidPromise) return mermaidPromise;
    mermaidPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/vendor/mermaid.min.js';
      s.onload = () => {
        const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: dark ? 'dark' : 'default',
          fontFamily: getComputedStyle(document.body).fontFamily,
        });
        resolve(window.mermaid);
      };
      s.onerror = () => {
        mermaidPromise = null;
        reject(new Error('The diagram library could not be loaded.'));
      };
      document.head.appendChild(s);
    });
    return mermaidPromise;
  }

  async function renderMermaid(text) {
    const mermaid = await loadMermaid();
    await mermaid.parse(text);
    const { svg } = await mermaid.render('kmermaid-' + ++uid, text);
    return `<div class="kfig-mermaid">${svg}</div>`;
  }

  // ---- wiring ----------------------------------------------------------------------------------

  function fill(key, html) {
    const id = hash(key);
    document.querySelectorAll(`[data-kfig="${id}"]`).forEach((el) => {
      el.innerHTML = html;
    });
  }

  function start(kind, text, key, api) {
    if (pending.has(key)) return;
    const job = kind === 'mermaid' ? renderMermaid(text) : renderDiagram(JSON.parse(text), api);
    pending.set(
      key,
      job.then(
        (html) => {
          cache.set(key, html);
          pending.delete(key);
          fill(key, html);
        },
        (err) => {
          pending.delete(key);
          // A reply is still streaming in, so half-written diagram code is normal: show the code
          // itself rather than an error, and let the finished block replace it. Cached under this
          // text, so a re-render does not ask again; the completed block has a different key.
          const html = `<div class="kfig-note">${esc(err && err.message ? err.message : 'This diagram could not be drawn.')}</div><pre><code>${esc(text)}</code></pre>`;
          cache.set(key, html);
          fill(key, html);
        }
      )
    );
  }

  function render(root, opts) {
    injectCss();
    const api = opts && opts.api;
    const blocks = root.querySelectorAll('pre > code.language-mermaid, pre > code.language-kelvin-diagram');
    blocks.forEach((code) => {
      const kind = code.classList.contains('language-mermaid') ? 'mermaid' : 'diagram';
      const text = code.textContent.trim();
      const key = kind + '\n' + text;
      const pre = code.parentElement;
      const host = pre.parentElement && pre.parentElement.classList.contains('code-wrap') ? pre.parentElement : pre;
      const fig = document.createElement('figure');
      fig.className = 'kfig';
      fig.dataset.kfig = hash(key);
      host.replaceWith(fig);
      if (cache.has(key)) {
        fig.innerHTML = cache.get(key);
        return;
      }
      if (kind === 'diagram') {
        // Wait for the closing fence: the JSON is not parsable until the block is complete.
        try {
          JSON.parse(text);
        } catch (e) {
          fig.innerHTML = '<div class="kfig-note">Drawing the diagram…</div>';
          return;
        }
      }
      fig.innerHTML = `<div class="kfig-note">${kind === 'mermaid' ? 'Drawing the diagram…' : 'Reading the property tables…'}</div>`;
      start(kind, text, key, api);
    });
  }

  window.KelvinFigures = { render };
})();
