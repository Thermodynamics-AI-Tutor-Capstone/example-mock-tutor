// The read-only page behind a share link (/share?t=<token>). No account needed: it reads
// /api/share/<token> (lib/share.js), which returns only the anonymized messages.
(function () {
  const $ = (id) => document.getElementById(id);
  const token = new URLSearchParams(location.search).get('t') || '';

  function fail(message) {
    $('title').textContent = 'This link isn’t available';
    $('note').textContent = message;
    document.title = 'Shared chat — Kelvin AI';
  }

  // Diagrams are computed by the server from the property tables, through this share's own endpoint.
  async function api(method, path, body) {
    if (path !== '/api/properties/diagram') throw new Error('Not available on a shared page.');
    const r = await fetch(`/api/share/${encodeURIComponent(token)}/diagram`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => null);
    if (!r.ok) throw new Error((data && data.error) || `Request failed (${r.status})`);
    return data;
  }

  function figures(el) {
    if (!el.querySelector('pre > code.language-mermaid, pre > code.language-kelvin-diagram, pre > code.language-kelvin-board')) return;
    const draw = () => window.KelvinFigures.render(el, { api });
    if (window.KelvinFigures) return draw();
    const s = document.createElement('script');
    s.src = '/figures.js';
    s.onload = draw;
    document.head.appendChild(s);
  }

  async function load() {
    if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return fail('The link is incomplete. Check that it was copied in full.');
    let r;
    try {
      r = await fetch(`/api/share/${encodeURIComponent(token)}`);
    } catch (e) {
      return fail('Could not reach Kelvin AI. Try again in a moment.');
    }
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) return fail(r.status === 404 ? 'It may have been turned off by the person who shared it.' : 'Something went wrong loading it. Try again in a moment.');
    const title = data.title || 'Untitled chat';
    $('title').textContent = title;
    document.title = `${title} — Kelvin AI`;
    $('note').textContent = `${data.messages.filter((m) => m.role === 'user').length} student messages`;
    const thread = $('thread');
    for (const m of data.messages) {
      const row = document.createElement('div');
      row.className = `msg ${m.role}`;
      const who = document.createElement('div');
      who.className = 'share-who';
      who.textContent = m.role === 'user' ? 'Student' : 'Kelvin';
      row.append(who);
      if (m.role === 'user') {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = m.content;
        row.append(bubble);
      } else {
        const body = document.createElement('div');
        body.className = 'md';
        body.innerHTML = window.KelvinMarkdown.render(m.content);
        row.append(body);
        figures(body);
      }
      thread.append(row);
    }
  }

  load();
})();
