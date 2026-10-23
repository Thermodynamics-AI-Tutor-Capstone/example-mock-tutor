/* Shared, instance-local player for server-calculated thermodynamic SVG diagrams. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const mounts = new WeakMap();
  let serial = 0;
  const properties = { T: 'T (°C)', P: 'P (kPa)', x: 'Quality x (0–1)', v: 'v (m³/kg)', u: 'u (kJ/kg)', h: 'h (kJ/kg)', s: 's (kJ/kg·K)' };
  const diagramNames = { Pv: 'Pressure–volume', Ts: 'Temperature–entropy', Ph: 'Pressure–enthalpy', Hs: 'Enthalpy–entropy', PT: 'Pressure–temperature', Tv: 'Temperature–volume' };
  const pathNames = { isobaric: 'Constant pressure', isentropic: 'Constant entropy', isothermal: 'Constant temperature', isochoric: 'Constant volume', isenthalpic: 'Constant enthalpy', straight: 'Straight connection (guide)' };
  function node(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function button(text, action) { const b = node('button', '', text); b.type = 'button'; b.addEventListener('click', action); return b; }
  function css() {
    if (document.querySelector('link[href="/grapher.css"]')) return;
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/grapher.css'; document.head.append(l);
  }

  // SVG is data, never HTML. Drop executable, external-resource and animation nodes/attributes,
  // and scope every identifier/reference before insertion (including Matplotlib glyph <use>s).
  function safeSvg(markup, prefix) {
    if (typeof markup !== 'string' || markup.length > 5e6) throw new Error('The diagram response is missing or too large. Try fewer states.');
    const parsed = new DOMParser().parseFromString(markup, 'image/svg+xml');
    const svg = parsed.documentElement;
    if (svg.localName !== 'svg' || parsed.querySelector('parsererror')) throw new Error('The server returned an unreadable diagram. Generate it again.');
    const tags = new Set(['svg', 'g', 'defs', 'path', 'polyline', 'polygon', 'line', 'rect', 'circle', 'ellipse', 'text', 'tspan', 'title', 'desc', 'clipPath', 'marker', 'use']);
    const attrs = new Set(['id','viewBox','width','height','x','y','x1','x2','y1','y2','cx','cy','r','rx','ry','d','points','transform','fill','fill-opacity','fill-rule','stroke','stroke-width','stroke-opacity','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-dasharray','stroke-dashoffset','opacity','clip-path','clip-rule','clipPathUnits','marker-start','marker-mid','marker-end','markerWidth','markerHeight','refX','refY','orient','markerUnits','preserveAspectRatio','font-size','font-family','font-weight','font-style','text-anchor','dominant-baseline','dx','dy','lengthAdjust','textLength','vector-effect','role','aria-label','aria-labelledby','aria-describedby']);
    const styleKeys = new Set(['fill','fill-opacity','fill-rule','stroke','stroke-width','stroke-opacity','stroke-linecap','stroke-linejoin','stroke-miterlimit','stroke-dasharray','stroke-dashoffset','opacity','font-size','font-family','font-weight','font-style','text-anchor']);
    const safeValue = v => !/javascript:|data:|https?:|@import|expression\(|[<>]/i.test(v) && !/url\(\s*(?!#[\w:.-]+\s*\))/i.test(v);
    for (const el of [svg, ...svg.querySelectorAll('*')]) {
      if (!tags.has(el.localName) || el.namespaceURI !== NS) { el.remove(); continue; }
      for (const attr of [...el.attributes]) {
        const name = attr.name, value = attr.value;
        if (name === 'xmlns' || name === 'xmlns:xlink') { el.removeAttribute(name); continue; }
        if (name === 'href' || name === 'xlink:href') {
          if (!/^#[\w:.-]+$/.test(value)) el.removeAttribute(name);
        } else if (name === 'style') {
          const allowed = value.split(';').map(s => s.split(':')).filter(([k, ...v]) => styleKeys.has(k.trim()) && safeValue(v.join(':'))).map(([k, ...v]) => `${k.trim()}:${v.join(':').trim()}`).join(';');
          if (allowed) el.setAttribute('style', allowed); else el.removeAttribute('style');
        } else if (!attrs.has(name) || !safeValue(value)) el.removeAttribute(name);
      }
    }
    const ids = new Map();
    for (const el of [svg, ...svg.querySelectorAll('[id]')]) {
      if (!el.id) continue;
      const old = el.id;
      if (ids.has(old)) throw new Error('The diagram contains duplicate identifiers. Generate it again.');
      const scoped = prefix + '-' + ids.size; ids.set(old, scoped); el.id = scoped;
    }
    for (const el of [svg, ...svg.querySelectorAll('*')]) {
      for (const attr of [...el.attributes]) {
        if (attr.name === 'href' || attr.name === 'xlink:href') {
          const target = ids.get(attr.value.slice(1));
          if (target) el.setAttribute(attr.name, '#' + target); else el.removeAttribute(attr.name);
        } else if (attr.name === 'aria-labelledby' || attr.name === 'aria-describedby') {
          el.setAttribute(attr.name, attr.value.split(/\s+/).map(id => ids.get(id)).filter(Boolean).join(' '));
        } else if (attr.value.includes('url(')) {
          el.setAttribute(attr.name, attr.value.replace(/url\(\s*#([\w:.-]+)\s*\)/g, (_, id) => ids.has(id) ? `url(#${ids.get(id)})` : 'none'));
        }
      }
    }
    const imported = document.importNode(svg, true);
    imported.setAttribute('role', 'img');
    return { svg: imported, ids };
  }

  async function request(spec, opts, signal) {
    if (opts.api) return opts.api('POST', '/api/grapher/render', spec);
    const response = await (opts.apiFetch || fetch)('/api/grapher/render', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(spec), signal });
    let data;
    try { data = await response.json(); } catch { throw new Error('The server did not return a diagram. Try again shortly.'); }
    if (!response.ok) {
      const error = new Error(typeof data.error === 'string' ? data.error : data.message || `Could not generate the diagram (${response.status}).`);
      error.status = response.status; throw error;
    }
    return data;
  }

  function errorView(container, error) {
    const box = node('div', 'kgr-error'); box.setAttribute('role', 'alert');
    box.append(node('p', '', error.message || 'Could not generate this diagram. Check the state values and try again.'));
    if (error.status === 401 || error.status === 403 || /unauth|sign.?in|not.?logged|authentication/i.test(error.message || '')) {
      const a = node('a', '', 'Sign in to generate a diagram'); a.href = '/dev-login?next=%2Fgrapher.html'; box.append(a);
    } else box.append(node('p', '', 'Check that each state has two different, independent properties and that process endpoints satisfy the selected constraint.'));
    container.replaceChildren(box);
  }

  function valuesTable(states) {
    const wrap = node('div', 'kgr-values'), table = node('table'), head = node('tr');
    table.append(node('caption', '', 'Calculated state values'));
    const cols = ['T','P','v','h','s','x'];
    ['State', ...cols.map(k => properties[k])].forEach(t => head.append(node('th', '', t)));
    const thead = node('thead'); thead.append(head); table.append(thead);
    const body = node('tbody');
    for (const state of states || []) {
      const p = state.state || state.properties || state, row = node('tr');
      row.append(node('th', '', state.label || p.label || '—'));
      for (const key of cols) { const v = p[key]; row.append(node('td', '', Number.isFinite(v) ? Number(v.toPrecision(6)).toLocaleString('en-US', { maximumSignificantDigits: 6 }) : '—')); }
      body.append(row);
    }
    table.append(body); wrap.append(table); return wrap;
  }

  async function mount(container, spec, opts = {}) {
    css(); mounts.get(container)?.destroy();
    const abort = new AbortController();
    let disposed = false, raf = 0, playing = false, index = -1, progress = 0, last = null, speed = 1;
    let media, mediaListener;
    const destroy = () => { disposed = true; playing = false; abort.abort(); cancelAnimationFrame(raf); media?.removeEventListener('change', mediaListener); };
    const controller = { destroy };
    mounts.set(container, controller);
    container.replaceChildren(node('div', 'kgr-loading', 'Calculating your diagram…'));
    try {
      const result = await request(spec, opts, abort.signal);
      if (disposed) return controller;
      if (!Array.isArray(result.steps) || !result.steps.length || result.steps.length > 120) throw new Error('This diagram has no drawing steps. Generate it again.');
      const steps = result.steps;
      const prefix = 'kgr-' + (++serial);
      const { svg, ids } = safeSvg(result.svg, prefix);
      const player = node('section', 'kgr-player'); player.dataset.grapher = prefix;
      const title = result.spec?.title || spec.title || `${diagramNames[spec.type] || spec.type} diagram`;
      svg.setAttribute('aria-label', title);
      player.append(node('h2', '', title));
      const axisInfo = Object.entries(result.axes || {}).map(([key, axis]) => typeof axis === 'object' ? `${key}: ${axis.label || axis.key || key}${axis.unit ? ` (${axis.unit})` : ''}${axis.log || axis.scale === 'log' ? ' · logarithmic scale' : ''}` : '').filter(Boolean);
      player.append(node('p', 'kgr-meta', [spec.fluid, ...axisInfo].join(' | ')));
      const controls = node('div', 'kgr-controls'); controls.setAttribute('aria-label', 'Drawing playback');
      const play = button('Play', () => { if (playing) pause(); else start(); }); play.className = 'kgr-primary'; play.dataset.action = 'play';
      const back = button('Back', () => jump(index - 1)); back.dataset.action = 'back';
      const next = button('Next', () => jump(index >= 0 && progress < 1 ? index : index + 1)); next.dataset.action = 'next';
      const restart = button('Restart', () => jump(-1)); restart.dataset.action = 'restart';
      const speedLabel = node('label', '', 'Speed'), speedSelect = node('select'); speedSelect.setAttribute('aria-label', 'Drawing speed');
      for (const rate of [0.5,1,1.5,2]) { const o = node('option', '', rate + '×'); o.value = rate; speedSelect.append(o); }
      speedSelect.value = '1'; speedSelect.addEventListener('change', () => { speed = Number(speedSelect.value); }); speedLabel.append(speedSelect);
      controls.append(play, back, next, restart, speedLabel); player.append(controls);
      const motion = node('p', 'kgr-motion-note'); player.append(motion);
      player.append(node('p', 'kgr-scroll-hint', 'Swipe across the graph to read the complete diagram and labels.'));
      const plot = node('div', 'kgr-plot'); plot.tabIndex = 0; plot.setAttribute('aria-label', 'Thermodynamic diagram; scroll horizontally on a narrow screen'); plot.append(svg); player.append(plot);
      const details = node('details', 'kgr-details'); details.open = opts.detailsOpen !== false;
      const summary = node('summary', '', 'Drawing checklist'), count = node('span', 'kgr-step-count'); summary.append(count); details.append(summary);
      const current = node('div', 'kgr-current'); current.setAttribute('role', 'status'); current.setAttribute('aria-live', 'polite');
      const currentText = node('span'), bar = node('div', 'kgr-progress'), fill = node('span'); bar.setAttribute('aria-hidden', 'true'); bar.append(fill); current.append(currentText, bar); details.append(current);
      const list = node('ol', 'kgr-steps'), stepItems = [];
      steps.forEach((step, n) => { const li = node('li'), b = button('', () => jump(n)), content = node('span'); b.dataset.step = n; content.append(node('strong', '', step.title || `Step ${n + 1}`), node('small', '', step.text || '')); b.append(content); li.append(b); list.append(li); stepItems.push({ li, b }); });
      details.append(list, valuesTable(result.states));
      details.append(node('p', 'kgr-review', 'Final review: check axis names and units, phase regions, critical-point label, state values, and process direction against your problem. A schematic or construction checklist does not guarantee exam marks.'));
      player.append(details);
      if (result.warnings?.length) { const warnings = node('div', 'kgr-warnings'); warnings.append(node('strong', '', 'Check these details')); for (const w of result.warnings) warnings.append(node('p', '', typeof w === 'string' ? w : w.message || String(w))); player.append(warnings); }
      if (result.source) player.append(node('p', 'kgr-source', typeof result.source === 'string' ? result.source : result.source.label || result.source.name || 'Calculated from the configured property data.'));
      container.replaceChildren(player);

      // Animate reveal masks instead of overwriting dash patterns: a dashed process remains dashed.
      let defs = svg.querySelector('defs'); if (!defs) { defs = document.createElementNS(NS, 'defs'); svg.prepend(defs); }
      const groups = [], strokes = [], seen = new Set();
      steps.forEach((step, stepIndex) => {
        for (const target of step.targets || []) {
          const scoped = ids.get(target), el = scoped && svg.querySelector('[id="' + scoped + '"]');
          if (!el || seen.has(el)) continue;
          seen.add(el); groups.push({ el, stepIndex, opacity: el.style.opacity });
          const geometry = [...(el.matches('path,polyline,line,polygon') ? [el] : []), ...el.querySelectorAll('path,polyline,line,polygon')];
          for (const shape of geometry) {
            if (shape.closest('defs,marker,clipPath') || strokes.some(s => s.shape === shape)) continue;
            if (getComputedStyle(shape).stroke === 'none') continue;
            let length; try { length = shape.getTotalLength(); } catch { continue; }
            if (!(length > 0)) continue;
            const mask = document.createElementNS(NS, 'mask'), reveal = shape.cloneNode(false), maskId = `${prefix}-reveal-${strokes.length}`;
            mask.id = maskId; mask.setAttribute('maskUnits', 'userSpaceOnUse'); mask.setAttribute('x', '-100000'); mask.setAttribute('y', '-100000'); mask.setAttribute('width', '200000'); mask.setAttribute('height', '200000');
            for (const attr of [...reveal.attributes]) if (!['d','points','x1','x2','y1','y2'].includes(attr.name)) reveal.removeAttribute(attr.name);
            reveal.setAttribute('fill', 'none'); reveal.setAttribute('stroke', 'white'); reveal.setAttribute('stroke-width', String(Math.max(3, parseFloat(getComputedStyle(shape).strokeWidth) + 2 || 3))); reveal.setAttribute('stroke-linecap', 'round'); reveal.setAttribute('stroke-linejoin', 'round'); reveal.setAttribute('stroke-dasharray', `${length} ${length}`);
            mask.append(reveal); defs.append(mask);
            strokes.push({ shape, reveal, maskId, length, stepIndex });
          }
        }
      });
      media = window.matchMedia('(prefers-reduced-motion: reduce)');
      const duration = opts.stepDuration || 1800;
      function paint() {
        for (const g of groups) g.el.style.opacity = g.stepIndex <= index ? (g.opacity || '1') : '0';
        for (const s of strokes) {
          const amount = s.stepIndex < index ? 1 : s.stepIndex === index ? progress : 0;
          if (amount >= 1) s.shape.removeAttribute('mask'); else { s.shape.setAttribute('mask', `url(#${s.maskId})`); s.reveal.setAttribute('stroke-dashoffset', String(s.length * (1 - amount))); }
        }
        player.dataset.step = String(index); player.dataset.progress = String(progress); player.dataset.playing = String(playing);
        fill.style.width = (progress * 100) + '%';
      }
      function status() {
        play.textContent = playing ? 'Pause' : 'Play'; play.setAttribute('aria-pressed', String(playing)); play.disabled = media.matches;
        back.disabled = index < 0; restart.disabled = index < 0; next.disabled = index === steps.length - 1 && progress >= 1;
        count.textContent = index < 0 ? `${steps.length} steps · ready` : `${index + 1} of ${steps.length}${progress >= 1 && index === steps.length - 1 ? ' · complete' : ''}`;
        const message = index < 0 ? 'Press Play to watch the construction, or Next to draw one step.' : `${steps[index].title}. ${steps[index].text || ''}`;
        if (currentText.textContent !== message) currentText.textContent = message;
        stepItems.forEach(({ li, b }, n) => { if (n === index) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); li.dataset.complete = String(n < index || n === index && progress >= 1); });
        motion.hidden = !media.matches; motion.textContent = media.matches ? 'Reduced motion is on. Use Next, Back, or a checklist step to draw without animation.' : '';
        paint();
      }
      function pause() { playing = false; last = null; cancelAnimationFrame(raf); status(); }
      function jump(n) { if (disposed) return; pause(); index = Math.max(-1, Math.min(steps.length - 1, n)); progress = index < 0 ? 0 : 1; status(); }
      function frame(time) {
        if (disposed || !playing) return;
        if (!container.isConnected) { destroy(); return; }
        const delta = last == null ? 0 : Math.min(80, time - last); last = time;
        progress = Math.min(1, progress + delta * speed / duration); paint();
        if (progress >= 1) {
          if (index === steps.length - 1) { pause(); return; }
          index++; progress = 0; status();
        }
        raf = requestAnimationFrame(frame);
      }
      function start() {
        if (disposed || media.matches) return;
        if (index === steps.length - 1 && progress >= 1) { index = -1; progress = 0; }
        if (index < 0 || progress >= 1) { index++; progress = 0; }
        playing = true; last = null; status(); raf = requestAnimationFrame(frame);
      }
      mediaListener = () => { if (media.matches) { pause(); if (index >= 0) progress = 1; } status(); };
      media.addEventListener('change', mediaListener);
      Object.assign(controller, { play: start, pause, next: () => jump(index >= 0 && progress < 1 ? index : index + 1), back: () => jump(index - 1), restart: () => jump(-1), data: result });
      status(); return controller;
    } catch (error) {
      if (!disposed) { errorView(container, error); controller.error = error; }
      return controller;
    }
  }

  function standalone() {
    const form = document.getElementById('grapher-form'); if (!form) return;
    const states = document.getElementById('grapher-states'), processes = document.getElementById('grapher-processes'), output = document.getElementById('grapher-output');
    const status = document.getElementById('grapher-form-status'), generate = document.getElementById('grapher-generate');
    function field(label, element) { const l = node('label', '', label); l.append(element); return l; }
    function input(value, label, type = 'text') { const el = node('input'); el.type = type; el.value = value; el.required = true; el.setAttribute('aria-label', label); if (type === 'number') el.step = 'any'; return el; }
    function select(options, value, label) { const el = node('select'); el.setAttribute('aria-label', label); Object.entries(options).forEach(([v, t]) => { const o = node('option', '', t); o.value = v; el.append(o); }); el.value = value; return el; }
    function addState(data = { label: String(states.children.length + 1), P: '', T: '' }) {
      if (states.children.length >= 12) { status.textContent = 'Use at most 12 states per diagram.'; return; }
      const row = node('div', 'kgr-state-row'), keys = Object.keys(data).filter(k => k !== 'label');
      const label = input(data.label, 'State label'); label.maxLength = 24; label.dataset.field = 'label'; row.append(field('Label', label));
      [0,1].forEach((n) => { const k = keys[n] || (n ? 'T' : 'P'), property = select(properties, k, `Property ${n + 1}`), value = input(data[k] ?? '', `Value ${n + 1}`, 'number'); property.dataset.field = 'property'; value.dataset.field = 'value'; row.append(field(`Property ${n + 1}`, property), field('Value', value)); });
      const remove = button('Remove', () => { row.remove(); }); remove.className = 'kgr-remove'; remove.setAttribute('aria-label', 'Remove state'); row.append(remove); states.append(row);
    }
    function addProcess(data = {}) {
      if (processes.children.length >= 20) { status.textContent = 'Use at most 20 processes per diagram.'; return; }
      const row = node('div', 'kgr-process-row');
      row.append(field('From label', input(data.from || '', 'Process from state')), field('To label', input(data.to || '', 'Process to state')), field('Constraint', select(pathNames, data.path || 'isobaric', 'Process constraint')));
      const remove = button('Remove', () => row.remove()); remove.className = 'kgr-remove'; remove.setAttribute('aria-label', 'Remove process'); row.append(remove); processes.append(row);
    }
    document.getElementById('grapher-add-state').addEventListener('click', () => addState());
    document.getElementById('grapher-add-process').addEventListener('click', () => addProcess());
    document.getElementById('grapher-sample').addEventListener('click', () => { states.replaceChildren(); processes.replaceChildren(); document.getElementById('grapher-fluid').value = 'water'; addState({ label: '1', P: 100, x: 0 }); addState({ label: '2', P: 100, x: 1 }); addProcess({ from: '1', to: '2', path: 'isobaric' }); status.textContent = 'Example loaded: water boiling at 100 kPa. Select a diagram and generate.'; });
    addState({ label: '1', P: '', T: '' }); addState({ label: '2', P: '', T: '' });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.setAttribute('role', 'status');
      try {
        const spec = { type: document.getElementById('grapher-type').value, fluid: document.getElementById('grapher-fluid').value, states: [], processes: [] }, labels = new Set();
        for (const row of states.children) {
          const label = row.querySelector('[data-field="label"]').value.trim(), keys = [...row.querySelectorAll('[data-field="property"]')].map(el => el.value), values = [...row.querySelectorAll('[data-field="value"]')].map(el => el.value);
          if (!label || labels.has(label)) throw new Error('Give every state a different, nonempty label.');
          if (keys[0] === keys[1]) throw new Error(`State ${label}: choose two different properties.`);
          if (values.some(v => !v.trim() || !Number.isFinite(Number(v)))) throw new Error(`State ${label}: enter a number for both properties.`);
          labels.add(label); spec.states.push({ label, [keys[0]]: Number(values[0]), [keys[1]]: Number(values[1]) });
        }
        if (!spec.states.length) throw new Error('Add at least one state before generating a diagram.');
        for (const row of processes.children) { const inputs = row.querySelectorAll('input'), from = inputs[0].value.trim(), to = inputs[1].value.trim(); if (!labels.has(from) || !labels.has(to)) throw new Error('Every process must connect labels present in the state list.'); spec.processes.push({ from, to, path: row.querySelector('select').value }); }
        generate.disabled = true; status.textContent = 'Calculating the state properties and drawing steps…';
        const player = await mount(output, spec);
        status.textContent = player.error ? 'Could not generate this diagram. See the message below.' : 'Diagram ready. Follow the drawing checklist below.';
      } catch (error) { status.textContent = error.message; status.setAttribute('role', 'alert'); }
      finally { generate.disabled = false; }
    });
  }
  window.KelvinGrapher = { mount };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', standalone, { once: true }); else standalone();
})();
