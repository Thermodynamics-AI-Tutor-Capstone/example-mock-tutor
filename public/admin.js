// The read-only admin dashboard (/admin). Data comes from /api/admin/* (lib/admin.js), which answers
// only for admins and never returns names or emails. Everything is fetched on page load and on each
// tab change; nothing is live. Every chart has a table view under it.
(function () {
  const $ = (id) => document.getElementById(id);
  const view = $('view');
  const TABS = {
    overview: 'Overview',
    students: 'Students',
    conversations: 'Conversations',
    misconceptions: 'Misconceptions',
    tutoring: 'Tutoring decisions',
    usage: 'Cost & usage',
    evals: 'Evals',
  };
  const GROUP_KEY = 'kelvin-admin-group';
  let group = 'all';
  try { group = sessionStorage.getItem(GROUP_KEY) || 'all'; } catch (e) {}
  const RANGE_KEY = 'kelvin-admin-range';
  const RANGES = [['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['6m', 'Last 6 months']];
  let range = '30d';
  try { range = sessionStorage.getItem(RANGE_KEY) || '30d'; } catch (e) {}
  if (!RANGES.some(([k]) => k === range)) range = '30d';
  let charts = [];
  let pending = [];
  let renderSeq = 0;

  // ── helpers ──────────────────────────────────────────────────────────────────────────────────
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const SERIES = () => [css('--s1'), css('--s2'), css('--s3'), css('--s4'), css('--s5')];
  const CATEGORY = { real: 0, test: 1, eval: 2 };
  const CATEGORY_LABEL = { real: 'Real', test: 'Test', eval: 'Eval' };
  const catColor = (c) => SERIES()[CATEGORY[c] ?? 0];

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) el.append(kid instanceof Node ? kid : String(kid));
    return el;
  }
  const fmt = (n, d = 0) => (n === null || n === undefined || Number.isNaN(n) ? '—' : Number(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }));
  const usd = (n, d = 2) => (n === null || n === undefined ? '—' : '$' + fmt(n, d));
  const pct = (n) => (n === null || n === undefined ? '—' : fmt(n, 0) + '%');
  const asDate = (d) => (/^\d{4}-\d{2}-\d{2}$/.test(String(d)) ? new Date(`${d}T12:00:00`) : new Date(d));
  const day = (d) => (d ? asDate(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
  const when = (d) => (d ? new Date(d).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—');
  const md = (text) => window.DOMPurify.sanitize(window.marked.parse(String(text || '')));
  const shorten = (s, n) => (String(s).length > n ? String(s).slice(0, n - 1) + '…' : String(s));
  const pretty = (id) => String(id || '').replace(/^(misc|topic|eq):/, '').replace(/^m\d+-/, '').replace(/[-_]+/g, ' ').replace(/^./, (c) => c.toUpperCase());

  function chip(text, cls, color) {
    return h('span', { class: 'chip' + (cls ? ' ' + cls : '') }, color ? h('span', { class: 'dot', style: `background:${color}` }) : null, text);
  }
  const catChip = (c) => chip(CATEGORY_LABEL[c] || c, '', catColor(c));

  function tile(k, v, s) {
    return h('div', { class: 'tile' }, h('div', { class: 'k' }, k), h('div', { class: 'v' }, v), s ? h('div', { class: 's' }, s) : null);
  }

  function table(head, rows, opts = {}) {
    const t = h('table', {},
      h('thead', {}, h('tr', {}, head.map((c) => h('th', { class: c.num ? 'num' : null }, c.label || c)))),
      h('tbody', {}, rows.map((r) => {
        const tr = h('tr', { class: opts.onRow ? 'clickable' : null, tabindex: opts.onRow ? '0' : null },
          r.cells.map((cell, i) => h('td', { class: [head[i].num ? 'num' : '', head[i].wrap ? 'wrap' : ''].join(' ').trim() || null }, cell)));
        if (opts.onRow) {
          tr.addEventListener('click', () => opts.onRow(r));
          tr.addEventListener('keydown', (e) => { if (e.key === 'Enter') opts.onRow(r); });
        }
        return tr;
      }))
    );
    return opts.bare ? t : h('div', { class: 'table-wrap' }, t);
  }

  // The 7 days / 30 days / 6 months switch. Shared by the activity chart and the misconceptions tab.
  function rangeControl(onChange) {
    const seg = h('div', { class: 'seg small', role: 'radiogroup', 'aria-label': 'Time window' });
    const paint = () => seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.range === range)));
    for (const [k, label] of RANGES) {
      seg.append(h('button', {
        type: 'button', role: 'radio', 'data-range': k,
        onclick: () => {
          if (k === range) return;
          range = k;
          try { sessionStorage.setItem(RANGE_KEY, range); } catch (e) {}
          paint();
          onChange();
        },
      }, label));
    }
    paint();
    return seg;
  }

  // One over-time chart on the Overview: a headline for the window, the chart, and its table. update()
  // swaps in a new window's data and the chart morphs in place.
  function seriesCard(spec, first) {
    const headline = h('div', { class: 'headline' });
    const caption = h('div', { class: 'caption' });
    const sub = h('p', { class: 'sub' });
    const tableHolder = h('div', {});
    const canvas = h('canvas', { role: 'img', 'aria-label': spec.title });
    let chart = null;
    const labelOf = (a, b) => (a.unit === 'week' ? `Wk of ${b.bucket.slice(5)}` : b.bucket.slice(5));
    const datasets = (a) => spec.series(a).map((x, i) => (spec.type === 'line'
      ? { label: x.label, data: x.values, borderColor: x.color, backgroundColor: x.color + '38', borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, tension: 0.25, fill: i === 0 ? 'origin' : '-1' }
      : bar(x.label, x.values, x.color, { borderColor: css('--card'), borderWidth: { top: 2 } })));
    function update(a) {
      headline.textContent = spec.headline(a);
      caption.textContent = spec.caption(a);
      sub.textContent = `${spec.sub(a)}${a.unit === 'week' ? ' One point per week (weeks start Monday).' : ' One point per day.'}`;
      const series = spec.series(a);
      tableHolder.replaceChildren(table(
        [{ label: a.unit === 'week' ? 'Week of' : 'Day' }, ...series.map((x) => ({ label: x.label, num: true }))],
        a.buckets.map((b, j) => ({ cells: [b.bucket, ...series.map((x) => spec.format(x.values[j]))] })),
        { bare: true }
      ));
      const labels = a.buckets.map((b) => labelOf(a, b));
      if (!chart) return { labels, datasets: datasets(a) };
      chart.data.labels = labels;
      datasets(a).forEach((d, i) => { chart.data.datasets[i].data = d.data; });
      chart.update();
      return null;
    }
    const data = update(first);
    pending.push(() => {
      const tick = spec.tick ? { callback: spec.tick } : { precision: 0 };
      chart = new window.Chart(canvas, {
        type: spec.type || 'bar',
        data,
        options: baseOptions({
          animation: { duration: 450, easing: 'easeOutCubic' },
          interaction: { mode: 'index', intersect: false },
          scales: { x: { stacked: true, ticks: { autoSkip: true, maxRotation: 0 } }, y: { stacked: true, beginAtZero: true, ticks: tick } },
          plugins: { legend: { display: data.datasets.length > 1 }, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${spec.format(c.parsed.y)}` } } },
        }),
      });
      charts.push(chart);
    });
    const card = h('div', { class: 'card' },
      h('h3', {}, spec.title),
      h('div', { class: 'headline-row' }, headline, caption),
      sub,
      h('div', { class: 'chart-box' }, canvas),
      h('details', { class: 'as-table' }, h('summary', {}, 'Show as table'), tableHolder)
    );
    card.update = update;
    return card;
  }

  // A chart card: title, one-line explanation, the chart, and the same numbers as a table.
  function chartCard({ title, sub, height, config, head, rows }) {
    const canvas = h('canvas', { role: 'img', 'aria-label': title });
    const card = h('div', { class: 'card' },
      h('h3', {}, title),
      sub ? h('p', { class: 'sub' }, sub) : null,
      h('div', { class: 'chart-box' + (height ? ' ' + height : '') }, canvas),
      head ? h('details', { class: 'as-table' }, h('summary', {}, 'Show as table'), table(head, rows.map((cells) => ({ cells })), { bare: true })) : null
    );
    pending.push(() => charts.push(new window.Chart(canvas, config)));
    return card;
  }

  function baseOptions(extra = {}) {
    const text2 = css('--text2');
    const grid = css('--grid');
    const scale = (o = {}) => Object.assign({ grid: { color: grid, drawTicks: false }, border: { display: false }, ticks: { color: text2, padding: 6 } }, o);
    const o = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'nearest', intersect: false },
      plugins: {
        legend: { display: false, labels: { color: text2, boxWidth: 10, boxHeight: 10, useBorderRadius: true, borderRadius: 2 } },
        tooltip: { backgroundColor: css('--card'), titleColor: css('--text'), bodyColor: css('--text'), borderColor: css('--border'), borderWidth: 1, padding: 10, boxPadding: 4 },
      },
      scales: { x: scale({ grid: { display: false } }), y: scale() },
    };
    return deepMerge(o, extra);
  }
  function deepMerge(a, b) {
    for (const [k, v] of Object.entries(b)) {
      if (v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object') deepMerge(a[k], v);
      else a[k] = v;
    }
    return a;
  }
  const bar = (label, data, color, extra = {}) => Object.assign({ label, data, backgroundColor: color, borderRadius: 4, borderSkipped: 'start', maxBarThickness: 32 }, extra);

  function hbarCard({ title, sub, items, label, color, valueLabel = 'Count', max = 12 }) {
    const top = items.slice(0, max);
    return chartCard({
      title, sub, height: top.length > 7 ? 'tall' : null,
      config: {
        type: 'bar',
        data: { labels: top.map((x) => shorten(x.label, 38)), datasets: [bar(label || valueLabel, top.map((x) => x.n), color || css('--s1'))] },
        options: baseOptions({ indexAxis: 'y', scales: { x: { grid: { display: true } }, y: { grid: { display: false } } }, plugins: { tooltip: { callbacks: { title: (ctx) => top[ctx[0].dataIndex].label } } } }),
      },
      head: [{ label: 'Item' }, { label: valueLabel, num: true }],
      rows: items.map((x) => [x.label, fmt(x.n)]),
    });
  }

  // 95% interval whiskers for line datasets that carry a `ci` array ([lo, hi] per point).
  const whiskers = {
    id: 'whiskers',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      chart.data.datasets.forEach((ds, i) => {
        if (!ds.ci || !chart.isDatasetVisible(i)) return;
        const meta = chart.getDatasetMeta(i);
        const y = chart.scales[meta.yAxisID];
        ctx.save();
        ctx.strokeStyle = ds.borderColor;
        ctx.lineWidth = 1.5;
        meta.data.forEach((pt, j) => {
          const ci = ds.ci[j];
          if (!ci) return;
          const top = y.getPixelForValue(ci[1]);
          const bottom = y.getPixelForValue(ci[0]);
          ctx.beginPath();
          ctx.moveTo(pt.x, top); ctx.lineTo(pt.x, bottom);
          ctx.moveTo(pt.x - 5, top); ctx.lineTo(pt.x + 5, top);
          ctx.moveTo(pt.x - 5, bottom); ctx.lineTo(pt.x + 5, bottom);
          ctx.stroke();
        });
        ctx.restore();
      });
    },
  };

  async function api(path) {
    const sep = path.includes('?') ? '&' : '?';
    const r = await window.KelvinAccount.call(`/api/admin/${path}${sep}group=${encodeURIComponent(group)}`);
    if (r.status === 401) {
      location.replace('/login?next=' + encodeURIComponent('/admin' + location.hash));
      throw new Error('Sign in first.');
    }
    if (!r.ok) throw new Error((r.data && r.data.error) || `Request failed (${r.status})`);
    return r.data;
  }

  // ── routing ──────────────────────────────────────────────────────────────────────────────────
  function route() {
    const [tab, id] = location.hash.replace(/^#/, '').split('/');
    return { tab: TABS[tab] ? tab : 'overview', id: id ? decodeURIComponent(id) : null };
  }

  async function render() {
    const seq = ++renderSeq;
    const { tab, id } = route();
    charts.forEach((c) => c.destroy());
    charts = [];
    pending = [];
    document.querySelectorAll('#tabs a').forEach((a) => { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    $('title').textContent = TABS[tab];
    $('groupFilter').hidden = tab === 'evals';
    document.querySelectorAll('#groupFilter button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.group === group)));
    $('app').classList.remove('rail-open');
    view.replaceChildren(h('p', { class: 'empty' }, 'Loading…'));
    try {
      const node = await PAGES[tab](id);
      if (seq !== renderSeq) return;
      view.replaceChildren(node);
      pending.splice(0).forEach((draw) => draw());
      window.scrollTo(0, 0);
    } catch (err) {
      if (seq !== renderSeq) return;
      view.replaceChildren(h('p', { class: 'empty error' }, err.message || String(err)));
    }
  }

  const groupNote = () => (group === 'all' ? 'All students' : `${CATEGORY_LABEL[group]} students only`);

  // ── pages ────────────────────────────────────────────────────────────────────────────────────
  const PAGES = {
    async overview() {
      const [o, evals, act] = await Promise.all([api('overview'), api('evals'), api(`activity?range=${range}`)]);
      const cats = ['real', 'test', 'eval'].filter((c) => group === 'all' || c === group);
      const byKind = (key) => (a) => cats.map((c) => ({ label: CATEGORY_LABEL[c], color: catColor(c), values: a.buckets.map((b) => b[key][c]) }));
      const win = (a) => a.label.toLowerCase();
      const count = (v) => fmt(v);
      const cards = [
        seriesCard({
          title: 'Students', type: 'line', series: byKind('students'), format: count,
          headline: (a) => fmt(a.totals.students),
          caption: (a) => `in total · ${fmt(a.totals.newStudents)} new in the ${win(a)}`,
          sub: (a) => `Total signed up over time, stacked by kind of account.${a.totals.deactivated ? ` Includes ${a.totals.deactivated} deactivated.` : ''}`,
        }, act),
        seriesCard({
          title: 'Active students', series: byKind('active'), format: count,
          headline: (a) => fmt(a.totals.activeStudents),
          caption: (a) => `sent a message in the ${win(a)}`,
          sub: () => 'Students who sent at least one message.',
        }, act),
        seriesCard({
          title: 'New chats', series: byKind('chats'), format: count,
          headline: (a) => fmt(a.totals.chats),
          caption: (a) => `started in the ${win(a)}`,
          sub: () => 'Chats started, including ones the student later deleted.',
        }, act),
        seriesCard({
          title: 'Student messages', series: byKind('messages'), format: count,
          headline: (a) => fmt(a.totals.messages),
          caption: (a) => `sent in the ${win(a)}${a.totals.chats ? ` · ${fmt(a.totals.messages / a.totals.chats, 1)} per new chat` : ''}`,
          sub: () => 'Messages students sent to Kelvin.',
        }, act),
        seriesCard({
          title: 'Model cost',
          series: (a) => [
            { label: 'DeepSeek', color: SERIES()[0], values: a.buckets.map((b) => b.cost.deepseek) },
            { label: 'Jev (OpenRouter)', color: SERIES()[1], values: a.buckets.map((b) => b.cost.openrouter) },
          ],
          format: (v) => usd(v, v && v < 1 ? 3 : 2), tick: (v) => '$' + v,
          headline: (a) => usd(a.totals.cost),
          caption: (a) => `spent in the ${win(a)}${a.totals.messages ? ` · ${usd(a.totals.cost / a.totals.messages, 3)} per student message` : ''}`,
          sub: () => `From the usage log, by provider.${group === 'all' ? ' Includes offline scripts.' : ''}`,
        }, act),
      ];
      const control = rangeControl(async () => {
        view.classList.add('refreshing');
        try {
          const a = await api(`activity?range=${range}`);
          cards.forEach((c) => c.update(a));
        } catch (err) {
          view.prepend(h('p', { class: 'error' }, err.message));
        } finally {
          view.classList.remove('refreshing');
        }
      });
      const latest = evals.runs.at(-1);
      return h('div', {},
        h('div', { class: 'toolbar' }, control, h('span', { class: 'note' }, 'Every chart below follows this window.')),
        h('p', { class: 'lede' }, `${groupNote()}. Real = signed-up students; Test = the simulated-student accounts used in eval rounds; Eval = the eval account and synthetic eval users. Admins are never counted. Deleted chats and deactivated accounts are included.`),
        h('div', { class: 'grid2' },
          ...cards,
          hbarCard({ title: 'Tutoring styles used', sub: 'All time. Which style handled each student turn.', items: o.styles.map((x) => ({ label: x.style, n: x.n })), valueLabel: 'Turns' })
        ),
        latest ? latestEvalCard(latest) : null
      );
    },

    async students(key) {
      if (key) return studentPage(key);
      const { students } = await api('students');
      if (!students.length) return h('p', { class: 'empty' }, 'No students in this group yet.');
      return h('div', {},
        h('p', { class: 'lede' }, `${groupNote()}, labelled by sign-up order. Click a student for what Kelvin knows about them and their chats. Names and emails are never shown.`),
        table(
          [{ label: 'Student' }, { label: 'Kind' }, { label: 'Status' }, { label: 'Chats', num: true }, { label: 'Deleted', num: true }, { label: 'Messages', num: true }, { label: 'Open misconceptions', num: true }, { label: 'Fixed', num: true }, { label: 'Notes', num: true }, { label: 'Joined' }, { label: 'Last active' }],
          students.map((s) => ({ key: s.key, cells: [s.label, catChip(s.category), s.deactivated ? chip('Deactivated', 'bad') : chip('Active', 'ok'), fmt(s.chats), fmt(s.deletedChats), fmt(s.messages), fmt(s.openMisconceptions), fmt(s.fixedMisconceptions), fmt(s.notes), day(s.createdAt), when(s.lastActive)] })),
          { onRow: (r) => { location.hash = `students/${r.key}`; } }
        )
      );
    },

    async conversations(id) {
      if (id) return conversationPage(id);
      const { conversations } = await api('conversations');
      if (!conversations.length) return h('p', { class: 'empty' }, 'No chats in this group yet.');
      const search = h('input', { type: 'search', placeholder: 'Filter by title or student', 'aria-label': 'Filter chats' });
      const deletedOnly = h('select', { 'aria-label': 'Deleted chats' }, h('option', { value: 'all' }, 'All chats'), h('option', { value: 'live' }, 'Visible to the student'), h('option', { value: 'deleted' }, 'Deleted by the student'));
      const holder = h('div', {});
      const draw = () => {
        const q = search.value.trim().toLowerCase();
        const list = conversations.filter((c) => (!q || `${c.title} ${c.student}`.toLowerCase().includes(q)) && (deletedOnly.value === 'all' || (deletedOnly.value === 'deleted') === c.deleted));
        holder.replaceChildren(
          h('p', { class: 'note' }, `${fmt(list.length)} of ${fmt(conversations.length)} chats`),
          table(
            [{ label: 'Title', wrap: true }, { label: 'Student' }, { label: 'Kind' }, { label: 'Style' }, { label: 'Messages', num: true }, { label: 'Started' }, { label: 'Last message' }, { label: '' }],
            list.slice(0, 400).map((c) => ({ id: c.id, cells: [c.title || 'Untitled', c.student || '—', catChip(c.category), c.style || '—', fmt(c.messages), day(c.createdAt), when(c.updatedAt), c.deleted ? chip('Deleted', 'warn') : ''] })),
            { onRow: (r) => { location.hash = `conversations/${r.id}`; } }
          )
        );
      };
      search.addEventListener('input', draw);
      deletedOnly.addEventListener('change', draw);
      draw();
      return h('div', {}, h('div', { class: 'toolbar' }, search, deletedOnly), holder);
    },

    async misconceptions() {
      const { misconceptions } = await api(`misconceptions?range=${range}`);
      const windowLabel = RANGES.find(([k]) => k === range)[1].toLowerCase();
      const control = h('div', { class: 'toolbar' }, rangeControl(render), h('span', { class: 'note' }, 'Counts only evidence from this window.'));
      if (!misconceptions.length) return h('div', {}, control, h('p', { class: 'empty' }, `No misconception evidence in this group in the ${windowLabel}.`));
      const sum = (k) => misconceptions.reduce((s, m) => s + m[k], 0);
      return h('div', {},
        control,
        h('p', { class: 'lede' }, `${groupNote()}, ${windowLabel}. From the student-model ledger: a signal is a reader flag at 60% or more; confirmed means Kelvin diagnosed it in the conversation; fixed means the student passed a re-test.`),
        h('div', { class: 'tiles' },
          tile('Misconceptions seen', fmt(misconceptions.length)),
          tile('Signals', fmt(sum('signals'))),
          tile('Confirmed', fmt(sum('confirmed'))),
          tile('Fixed', fmt(sum('repaired'))),
          tile('Dismissed by a student', fmt(sum('dismissed')))
        ),
        h('div', { style: 'margin-top:16px' },
          chartCard({
            title: 'Students showing each misconception',
            sub: 'Top 12 by number of students. Hover a bar for the full name.',
            height: 'tall',
            config: (() => {
              const top = misconceptions.slice(0, 12);
              return {
                type: 'bar',
                data: { labels: top.map((m) => shorten(m.title, 44)), datasets: [bar('Students', top.map((m) => m.students), css('--s1')), bar('Fixed', top.map((m) => m.repaired), css('--s3'))] },
                options: baseOptions({ indexAxis: 'y', scales: { x: { grid: { display: true }, ticks: { precision: 0 } }, y: { grid: { display: false } } }, plugins: { legend: { display: true }, tooltip: { callbacks: { title: (ctx) => top[ctx[0].dataIndex].title } } } }),
              };
            })(),
          })
        ),
        h('h2', { class: 'section-title' }, 'All misconceptions'),
        table(
          [{ label: 'Misconception', wrap: true }, { label: 'Students', num: true }, { label: 'Signals', num: true }, { label: 'Confirmed', num: true }, { label: 'Fixed', num: true }, { label: 'Dismissed', num: true }],
          misconceptions.map((m) => ({ cells: [m.title, fmt(m.students), fmt(m.signals), fmt(m.confirmed), fmt(m.repaired), fmt(m.dismissed)] }))
        )
      );
    },

    async tutoring() {
      const t = await api('tutoring');
      if (!t.turns) return h('p', { class: 'empty' }, 'No tutoring decisions logged for this group yet.');
      const list = (xs) => xs.map((x) => ({ label: x.k, n: x.n }));
      return h('div', {},
        h('p', { class: 'lede' }, `${groupNote()}. Every student turn is read (by Jev, or the DeepSeek backup when Jev is off), routed to a style, given a help ceiling, and checked by an audit after the reply.`),
        h('div', { class: 'tiles' },
          tile('Student turns read', fmt(t.turns)),
          tile('Replies audited', fmt(t.audited), t.turns ? `${pct((100 * t.audited) / t.turns)} of turns` : null),
          tile('Median read time', t.readLatencyMedianMs === null ? '—' : `${fmt(t.readLatencyMedianMs / 1000, 1)} s`)
        ),
        h('div', { class: 'grid2', style: 'margin-top:16px' },
          hbarCard({ title: 'Who read the turn', items: list(t.readers), valueLabel: 'Turns' }),
          hbarCard({ title: 'Style chosen', items: list(t.styles), valueLabel: 'Turns' }),
          chartCard({
            title: 'Help ceiling',
            sub: '0 = hints only … higher = more of the answer allowed. Set by the server, not the model.',
            config: { type: 'bar', data: { labels: t.ceilings.map((c) => c.k), datasets: [bar('Turns', t.ceilings.map((c) => c.n), css('--s1'))] }, options: baseOptions() },
            head: [{ label: 'Ceiling' }, { label: 'Turns', num: true }],
            rows: t.ceilings.map((c) => [c.k, fmt(c.n)]),
          }),
          hbarCard({ title: 'Audit flags on replies', sub: 'What the post-reply audit caught.', items: list(t.auditFlags), valueLabel: 'Replies', color: css('--s2') }),
          hbarCard({ title: 'Tools allowed per turn', items: list(t.tools), valueLabel: 'Turns' })
        )
      );
    },

    async usage() {
      const u = await api('usage');
      const t = u.totals;
      const s = SERIES();
      return h('div', {},
        h('p', { class: 'lede' }, `${groupNote()}${group === 'all' ? ', plus calls with no student (offline scripts and the knowledge-base pipeline)' : ''}. Costs are logged per call from each provider's reported usage (DeepSeek directly; Jev through OpenRouter).`),
        h('div', { class: 'tiles' },
          tile('Total cost', usd(t.usd)),
          tile('Model calls', fmt(t.calls), `${fmt(t.failed)} failed`),
          tile('Prompt cache hits', pct(t.cacheHitRate), 'share of DeepSeek input tokens')
        ),
        u.perDay.length
          ? h('div', { style: 'margin-top:16px' }, chartCard({
            title: 'Cost per day',
            sub: 'Stacked by provider.',
            config: {
              type: 'bar',
              data: { labels: u.perDay.map((d) => d.day.slice(5)), datasets: [bar('DeepSeek', u.perDay.map((d) => d.deepseek), s[0], { borderColor: css('--card'), borderWidth: { top: 2 } }), bar('Jev (OpenRouter)', u.perDay.map((d) => d.openrouter), s[1], { borderColor: css('--card'), borderWidth: { top: 2 } })] },
              options: baseOptions({ scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: (v) => '$' + v } } }, plugins: { legend: { display: true }, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: $${c.parsed.y.toFixed(3)}` } } } }),
            },
            head: [{ label: 'Day' }, { label: 'DeepSeek', num: true }, { label: 'Jev', num: true }],
            rows: u.perDay.map((d) => [d.day, usd(d.deepseek, 3), usd(d.openrouter, 3)]),
          }))
          : null,
        h('h2', { class: 'section-title' }, 'By model and purpose'),
        u.byPurpose.length
          ? table(
            [{ label: 'Provider' }, { label: 'Model' }, { label: 'Purpose' }, { label: 'Calls', num: true }, { label: 'Cost', num: true }, { label: 'Input tokens', num: true }, { label: 'Cached', num: true }, { label: 'Output tokens', num: true }, { label: 'Median time', num: true }],
            u.byPurpose.map((r) => ({ cells: [r.provider, r.model, r.purpose, fmt(r.calls), usd(r.usd, 3), fmt(r.promptTokens), fmt(r.cachedTokens), fmt(r.completionTokens), r.medianMs === null ? '—' : `${fmt(r.medianMs / 1000, 1)} s`] }))
          )
          : h('p', { class: 'empty' }, 'No usage logged for this group yet.')
      );
    },

    async evals(id) {
      const { runs } = await api('evals');
      if (!runs.length) return h('p', { class: 'empty' }, 'No eval results committed yet (eval/results/).');
      const current = runs.find((r) => r.id === id) || runs.at(-1);
      const detail = await api(`evals/${encodeURIComponent(current.id)}`);
      return h('div', {},
        h('p', { class: 'lede' }, 'Each round sends simulated students (Claude agents playing ME 300 personas with hidden misconceptions) to the live tutor. Two reviewer agents, acting as instructors, grade every chat and check numbers against the property engine. Results are committed to eval/results/ and appear here after deploy.'),
        h('div', { class: 'callout' }, 'Read with care: each round is 10 simulated students and about 30 chats, so the intervals are wide. No real students are involved, and nothing here measures learning. Round 1 used different personas from rounds 2 and 3.'),
        evalTrends(runs),
        evalRunDetail(detail, runs)
      );
    },
  };

  // ── drill-downs ──────────────────────────────────────────────────────────────────────────────
  async function studentPage(key) {
    const s = await api(`students/${encodeURIComponent(key)}`);
    return h('div', {},
      h('a', { class: 'back', href: '#students' }, '← All students'),
      h('div', { class: 'toolbar' }, h('strong', {}, s.label), catChip(s.category), s.deactivated ? chip('Deactivated', 'bad') : chip('Active', 'ok'), h('span', { class: 'note' }, `Joined ${day(s.createdAt)}`)),
      h('div', { class: 'grid2' },
        h('div', {}, h('h2', { class: 'section-title', style: 'margin-top:0' }, 'What Kelvin knows'), h('div', { class: 'doc', html: md(s.document) })),
        h('div', {},
          h('h2', { class: 'section-title', style: 'margin-top:0' }, `Chats (${s.conversations.length})`),
          s.conversations.length
            ? table(
              [{ label: 'Title', wrap: true }, { label: 'Style' }, { label: 'Msgs', num: true }, { label: 'Last message' }, { label: '' }],
              s.conversations.map((c) => ({ id: c.id, cells: [c.title || 'Untitled', c.style || '—', fmt(c.messages), when(c.updatedAt), c.deleted ? chip('Deleted', 'warn') : ''] })),
              { onRow: (r) => { location.hash = `conversations/${r.id}`; } }
            )
            : h('p', { class: 'empty' }, 'No chats.')
        )
      )
    );
  }

  async function conversationPage(id) {
    const c = await api(`conversations/${encodeURIComponent(id)}`);
    const total = c.cost.reduce((s, r) => s + r.usd, 0);
    return h('div', {},
      h('a', { class: 'back', href: '#conversations' }, '← All chats'),
      h('div', { class: 'toolbar' },
        h('strong', {}, c.title || 'Untitled'),
        h('a', { href: `#students/${c.studentKey}`, class: 'note' }, c.student),
        catChip(c.category),
        c.deleted ? chip('Deleted by the student', 'warn') : null,
        h('span', { class: 'note' }, `Model cost ${usd(total, 3)}`)
      ),
      c.referenceSolutions.length
        ? h('details', { class: 'card', style: 'margin-bottom:16px' },
          h('summary', {}, `Reference solutions (${c.referenceSolutions.length}), solved out of sight before tutoring`),
          c.referenceSolutions.map((r) => h('div', { class: 'note', style: 'margin-top:8px' },
            r.ok ? `Solved in ${fmt(r.latencyMs / 1000, 1)} s: ` : `Failed: ${r.error || 'unknown'}`,
            r.answers.map((a) => `${a.quantity || a.name || ''} = ${a.value ?? ''} ${a.unit || ''}`.trim()).join(' · ')
          )))
        : null,
      h('div', { class: 'transcript' }, c.messages.map((m) => h('div', { class: `msg ${m.role}` },
        h('div', { class: 'who' }, `${m.role === 'user' ? c.student : 'Kelvin'} · ${when(m.at)}`),
        h('div', { class: 'body', html: md(m.content) }),
        m.decision ? h('div', { class: 'decision' },
          h('span', {}, `Read by ${m.decision.reader}`),
          h('span', {}, `intent: ${m.decision.intent || '—'}`),
          h('span', {}, `style: ${m.decision.style || '—'}`),
          h('span', {}, `ceiling: ${m.decision.ceiling ?? '—'}`),
          m.decision.misconceptions.length ? h('span', {}, `flags: ${m.decision.misconceptions.map((x) => `${x.title || pretty(x.id)} (${Math.round(x.p * 100)}%)`).join(', ')}`) : null,
          m.decision.auditFlags.length ? h('span', {}, `audit: ${m.decision.auditFlags.join(', ')}`) : null
        ) : null
      ))),
      c.cost.length
        ? h('div', {}, h('h2', { class: 'section-title' }, 'Model calls in this chat'), table([{ label: 'Provider' }, { label: 'Purpose' }, { label: 'Calls', num: true }, { label: 'Cost', num: true }], c.cost.map((r) => ({ cells: [r.provider, r.purpose, fmt(r.calls), usd(r.usd, 4)] }))))
        : null
    );
  }

  function latestEvalCard(r) {
    const s = r.summary;
    return h('div', { style: 'margin-top:16px' },
      h('h2', { class: 'section-title' }, `Latest eval: ${r.label} (${day(r.date)})`),
      h('div', { class: 'tiles' },
        tile('Helpfulness', `${fmt(s.helpfulness.mean, 2)} / 5`, s.helpfulness.ci95 ? `95% CI ${s.helpfulness.ci95.join('–')}` : null),
        tile('Accuracy errors', fmt(s.accuracyErrors), `${fmt(s.accuracyErrorsPer100Replies, 1)} per 100 replies`),
        tile('Misconceptions addressed', pct(s.misconceptionCaughtRate), `${s.misconceptionCaught} of ${s.misconceptionChats} chats`),
        tile('Run cost', r.cost && r.cost.total !== null ? usd(r.cost.total) : '—', r.cost && r.cost.total !== null ? `${r.counts.messages} student messages` : 'not measured')
      ),
      h('p', { class: 'note' }, h('a', { href: `#evals/${r.id}` }, 'Open the eval dashboard →'))
    );
  }

  // ── evals ────────────────────────────────────────────────────────────────────────────────────
  function evalTrends(runs) {
    const s = SERIES();
    const labels = runs.map((r) => r.label);
    const line = (label, pick, color) => ({
      label, data: runs.map((r) => pick(r)?.mean ?? null), ci: runs.map((r) => pick(r)?.ci95 ?? null),
      borderColor: color, backgroundColor: color, borderWidth: 2, pointRadius: 5, pointHoverRadius: 7, pointBorderColor: css('--card'), pointBorderWidth: 2, spanGaps: true,
    });
    const single = (title, sub, values, fmtV, color, extra = {}) => chartCard({
      title, sub, height: 'short',
      config: { type: 'bar', data: { labels, datasets: [bar(title, values, color || s[0])] }, options: baseOptions(deepMerge({ plugins: { tooltip: { callbacks: { label: (c) => fmtV(c.parsed.y) } } } }, extra)) },
      head: [{ label: 'Run' }, { label: title, num: true }],
      rows: runs.map((r, i) => [r.label, values[i] === null ? 'not measured' : fmtV(values[i])]),
    });
    return h('div', {},
      h('h2', { class: 'section-title' }, 'Across rounds'),
      h('div', { class: 'grid2' },
        chartCard({
          title: 'Reviewer grades, 1–5',
          sub: 'Mean per chat with a 95% bootstrap interval. Thoroughness was added in round 2.',
          config: {
            type: 'line',
            data: { labels, datasets: [line('Helpfulness', (r) => r.summary.helpfulness, s[0]), line('Thoroughness', (r) => r.summary.thoroughness, s[1])] },
            options: baseOptions({ scales: { y: { min: 1, max: 5, ticks: { stepSize: 1 } } }, plugins: { legend: { display: true }, tooltip: { callbacks: { label: (c) => { const ci = c.dataset.ci[c.dataIndex]; return `${c.dataset.label}: ${c.parsed.y.toFixed(2)}${ci ? ` (95% CI ${ci[0]}–${ci[1]})` : ''}`; } } } } }),
            plugins: [whiskers],
          },
          head: [{ label: 'Run' }, { label: 'Helpfulness', num: true }, { label: '95% CI', num: true }, { label: 'Thoroughness', num: true }, { label: '95% CI', num: true }],
          rows: runs.map((r) => [r.label, fmt(r.summary.helpfulness.mean, 2), (r.summary.helpfulness.ci95 || []).join('–'), r.summary.thoroughness ? fmt(r.summary.thoroughness.mean, 2) : '—', r.summary.thoroughness ? (r.summary.thoroughness.ci95 || []).join('–') : '—']),
        }),
        chartCard({
          title: 'Speed',
          sub: 'Seconds from a student message to the end of the reply.',
          config: {
            type: 'bar',
            data: { labels, datasets: [bar('Median', runs.map((r) => r.latency?.medianS ?? null), s[0]), bar('90th percentile', runs.map((r) => r.latency?.p90S ?? null), s[1])] },
            options: baseOptions({ plugins: { legend: { display: true }, tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y.toFixed(1)} s` } } }, scales: { y: { ticks: { callback: (v) => v + ' s' } } } }),
          },
          head: [{ label: 'Run' }, { label: 'Median', num: true }, { label: '90th pct', num: true }, { label: 'Slowest', num: true }],
          rows: runs.map((r) => [r.label, fmt(r.latency?.medianS, 1) + ' s', fmt(r.latency?.p90S, 1) + ' s', fmt(r.latency?.maxS, 1) + ' s']),
        })
      ),
      h('div', { class: 'grid3', style: 'margin-top:16px' },
        single('Accuracy errors per 100 replies', 'Physics or number errors the reviewers found. Lower is better.', runs.map((r) => r.summary.accuracyErrorsPer100Replies), (v) => fmt(v, 1), s[1]),
        single('Misconceptions addressed', 'Of chats where the student showed one, how often Kelvin dealt with it.', runs.map((r) => r.summary.misconceptionCaughtRate), pct, s[2], { scales: { y: { min: 0, max: 100, ticks: { callback: (v) => v + '%' } } } }),
        single('Run cost', 'DeepSeek + Jev, from the usage log. Claude students and reviewers not included.', runs.map((r) => (r.cost && r.cost.total !== null ? r.cost.total : null)), (v) => usd(v), s[3], { scales: { y: { ticks: { callback: (v) => '$' + v } } } })
      ),
      h('h2', { class: 'section-title' }, 'Round-by-round table'),
      table(
        [{ label: 'Run' }, { label: 'Date' }, { label: 'What the tutor had', wrap: true }, { label: 'Chats', num: true }, { label: 'Helpful', num: true }, { label: 'Thorough', num: true }, { label: 'Errors', num: true }, { label: 'Answer given early', num: true }, { label: 'Style fit', num: true }, { label: 'Cost', num: true }],
        runs.map((r) => ({ id: r.id, cells: [r.label, day(r.date), r.harness || '—', fmt(r.counts.chats), fmt(r.summary.helpfulness.mean, 2), r.summary.thoroughness ? fmt(r.summary.thoroughness.mean, 2) : '—', fmt(r.summary.accuracyErrors), `${r.summary.giveaways.clear} clear, ${r.summary.giveaways.mild} mild`, pct(r.summary.styleFit), r.cost && r.cost.total !== null ? usd(r.cost.total) : 'not measured'] })),
        { onRow: (row) => { location.hash = `evals/${row.id}`; } }
      )
    );
  }

  function evalRunDetail(d, runs) {
    const s = SERIES();
    const picker = h('select', { 'aria-label': 'Eval round', onchange: (e) => { location.hash = `evals/${e.target.value}`; } },
      runs.map((r) => h('option', { value: r.id, selected: r.id === d.id }, `${r.label} · ${day(r.date)}`)));
    const sm = d.summary;
    const ps = d.perStudent;
    return h('div', {},
      h('h2', { class: 'section-title', style: 'margin-top:40px' }, 'One round in detail'),
      h('div', { class: 'toolbar' }, picker, d.findings ? h('span', { class: 'note' }, `Write-up: ${d.findings}`) : null),
      d.harness ? h('p', { class: 'note' }, d.harness) : null,
      h('div', { class: 'tiles' },
        tile('Chats graded', fmt(d.counts.reviewedChats), `${fmt(d.counts.students)} students · ${fmt(d.counts.messages)} messages`),
        tile('Helpfulness', `${fmt(sm.helpfulness.mean, 2)} / 5`, sm.helpfulness.ci95 ? `95% CI ${sm.helpfulness.ci95.join('–')}` : null),
        tile('Thoroughness', sm.thoroughness ? `${fmt(sm.thoroughness.mean, 2)} / 5` : '—', sm.thoroughness && sm.thoroughness.ci95 ? `95% CI ${sm.thoroughness.ci95.join('–')}` : 'not graded this round'),
        tile('Accuracy errors', fmt(sm.accuracyErrors), `${fmt(sm.accuracyErrorsPer100Replies, 1)} per 100 replies`),
        tile('Answer given too early', `${sm.giveaways.clear} clear`, `${sm.giveaways.mild} mild`),
        tile('Misconceptions addressed', pct(sm.misconceptionCaughtRate), `${sm.misconceptionCaught} of ${sm.misconceptionChats} chats`),
        tile('Style fit', pct(sm.styleFit), sm.styleFit === null ? 'no style labels this round' : 'turns routed to the style the student needed'),
        tile('Cost', d.cost && d.cost.total !== null ? usd(d.cost.total) : '—', d.cost ? d.cost.note || `DeepSeek ${usd(d.cost.deepseek, 2)} · Jev ${usd(d.cost.jev, 2)}` : 'not measured')
      ),
      h('div', { class: 'grid2', style: 'margin-top:16px' },
        chartCard({
          title: 'Grades by student',
          sub: 'Mean over each student’s three chats. Students differ in persona and hidden misconceptions.',
          config: {
            type: 'bar',
            data: { labels: ps.map((p) => p.student.replace('Student ', 'S')), datasets: [bar('Helpfulness', ps.map((p) => p.helpfulness), s[0]), ...(sm.thoroughness ? [bar('Thoroughness', ps.map((p) => p.thoroughness), s[1])] : [])] },
            options: baseOptions({ scales: { y: { min: 0, max: 5 } }, plugins: { legend: { display: Boolean(sm.thoroughness) } } }),
          },
          head: [{ label: 'Student' }, { label: 'Hidden misconceptions' }, { label: 'Helpful', num: true }, { label: 'Thorough', num: true }, { label: 'Errors', num: true }, { label: 'Addressed', num: true }],
          rows: ps.map((p) => [p.student, p.misconceptions.map(pretty).join(', '), fmt(p.helpfulness, 2), fmt(p.thoroughness, 2), fmt(p.accuracyErrors), `${p.misconceptionCaught}/${p.misconceptionChats}`]),
        }),
        chartCard({
          title: 'Accuracy errors by student',
          sub: 'Reviewer-found errors summed over each student’s chats.',
          config: { type: 'bar', data: { labels: ps.map((p) => p.student.replace('Student ', 'S')), datasets: [bar('Errors', ps.map((p) => p.accuracyErrors), s[1])] }, options: baseOptions({ scales: { y: { ticks: { precision: 0 } } } }) },
          head: [{ label: 'Student' }, { label: 'Errors', num: true }],
          rows: ps.map((p) => [p.student, fmt(p.accuracyErrors)]),
        })
      ),
      d.styleConfusion ? confusionCard(d.styleConfusion) : null,
      Object.keys(d.readers || {}).length ? readersCard(d.readers) : null,
      h('h2', { class: 'section-title' }, `Errors the reviewers found (${d.errors.length} chats)`),
      d.errors.length
        ? table(
          [{ label: 'Student' }, { label: 'Chat', num: true }, { label: 'Errors', num: true }, { label: 'Reviewer note', wrap: true }],
          d.errors.map((e) => ({ conv: e.conv, cells: [e.student, fmt(e.chat), fmt(e.errors), e.note || '—'] })),
          { onRow: (r) => { location.hash = `conversations/${r.conv}`; } }
        )
        : h('p', { class: 'empty' }, 'None.'),
      h('h2', { class: 'section-title' }, 'Every graded chat'),
      h('p', { class: 'note' }, 'Click a row to read the conversation with Kelvin’s decisions inline.'),
      table(
        [{ label: 'Student' }, { label: 'Chat', num: true }, { label: 'Helpful', num: true }, { label: 'Thorough', num: true }, { label: 'Errors', num: true }, { label: 'Answer early' }, { label: 'Misconception' }],
        d.chats.map((c) => ({ conv: c.conv, cells: [c.student, fmt(c.chat), fmt(c.helpfulness), c.thoroughness === null ? '—' : fmt(c.thoroughness), fmt(c.accuracyErrors), c.giveaway === 'none' ? 'no' : c.giveaway || '—', !c.misconception || !c.misconception.shown ? 'none shown' : `addressed: ${c.misconception.addressed}`] })),
        { onRow: (r) => { location.hash = `conversations/${r.conv}`; } }
      )
    );
  }

  function confusionCard(m) {
    const wanted = Object.keys(m).sort();
    const got = [...new Set(wanted.concat(...wanted.map((w) => Object.keys(m[w]))))].sort();
    const max = Math.max(1, ...wanted.flatMap((w) => got.map((g) => m[w][g] || 0)));
    const rgb = css('--heat');
    const t = h('table', { class: 'heat' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Student needed ↓ / Kelvin used →'), got.map((g) => h('th', { class: 'num' }, g)), h('th', { class: 'num' }, 'Fit'))),
      h('tbody', {}, wanted.map((w) => {
        const row = got.map((g) => m[w][g] || 0);
        const total = row.reduce((a, b) => a + b, 0);
        return h('tr', {}, h('th', {}, w), row.map((n, i) => h('td', { class: 'cell' + (got[i] === w ? ' diag' : ''), style: `background: rgba(${rgb}, ${(0.08 + 0.72 * (n / max)).toFixed(2)})`, title: `${w} → ${got[i]}: ${n} turns` }, n ? fmt(n) : '·')), h('td', { class: 'num' }, pct(total ? (100 * (m[w][w] || 0)) / total : null)));
      }))
    );
    return h('div', { class: 'card', style: 'margin-top:16px' },
      h('h3', {}, 'Style fit: which style the student needed vs the one Kelvin used'),
      h('p', { class: 'sub' }, 'Per student turn. The outlined diagonal is a fit. The student agents labelled the style they needed; old style names are mapped onto the three current ones.'),
      h('div', { class: 'table-wrap' }, t)
    );
  }

  function readersCard(readers) {
    const names = Object.keys(readers);
    const pr = (x) => (x ? `${pct(x.recall)} / ${pct(x.precision)}` : '—');
    return h('div', { style: 'margin-top:16px' },
      h('h2', { class: 'section-title' }, 'How well each reader read the student'),
      h('p', { class: 'note' }, 'Every student message was replayed through each reader and scored against the label the student agent wrote. Recall / precision; a false flag is a misconception flagged on a message that had none.'),
      table(
        [{ label: 'Reader' }, { label: 'Intent right', num: true }, { label: 'Wants the answer', num: true }, { label: 'Shows work', num: true }, { label: 'Complete attempt', num: true }, { label: 'Misconception', num: true }, { label: 'False flags', num: true }, { label: 'Replay cost', num: true }],
        names.map((n) => {
          const r = readers[n];
          return { cells: [n, pct(r.intent), pr(r.wantsAnswer), pr(r.showsWork), pr(r.completeAttempt), r.misconceptionRecall === null ? '—' : `${pct(r.misconceptionRecall)} / ${pct(r.misconceptionPrecision)}`, pct(r.falseFlagRate), r.costUsd === null ? '—' : usd(r.costUsd, 3)] };
        })
      )
    );
  }

  // ── start ────────────────────────────────────────────────────────────────────────────────────
  $('groupFilter').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-group]');
    if (!b || b.dataset.group === group) return;
    group = b.dataset.group;
    try { sessionStorage.setItem(GROUP_KEY, group); } catch (err) {}
    const { tab, id } = route();
    if (id && tab !== 'evals') location.hash = tab;
    else render();
  });
  $('openRail').addEventListener('click', () => $('app').classList.add('rail-open'));
  $('closeRail').addEventListener('click', () => $('app').classList.remove('rail-open'));
  $('backdrop').addEventListener('click', () => $('app').classList.remove('rail-open'));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', render);

  (async () => {
    const me = await window.KelvinAccount.me();
    if (!me) {
      location.replace('/login?next=' + encodeURIComponent('/admin' + location.hash));
      return;
    }
    if (!me.profile || !me.profile.is_admin) {
      $('groupFilter').hidden = true;
      $('title').textContent = 'Admins only';
      view.replaceChildren(h('p', { class: 'empty' }, 'This page is for the team’s admin accounts. ', h('a', { href: '/' }, 'Back to chat')));
      return;
    }
    window.Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    window.Chart.defaults.font.size = 12;
    window.addEventListener('hashchange', render);
    render();
  })();
})();
