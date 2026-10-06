// Renders Kelvin's Markdown: GFM, KaTeX math ($…$, $$…$$, \(…\), \[…\]) and DOMPurify. Shared by the
// chat (app.js), the admin dashboard and the share page. Needs marked, DOMPurify and KaTeX loaded.
(function () {
  const PURIFY_CFG = {
    ADD_TAGS: ['semantics', 'annotation', 'math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'msqrt', 'mtext', 'mspace', 'mover', 'munder', 'mtable', 'mtr', 'mtd', 'mstyle', 'mpadded', 'mphantom', 'menclose', 'mroot', 'msubsup', 'munderover'],
    ADD_ATTR: ['encoding', 'aria-hidden', 'xmlns', 'mathvariant', 'stretchy', 'fence', 'separator', 'lspace', 'rspace', 'columnalign', 'rowspacing', 'columnspacing', 'displaystyle', 'scriptlevel', 'accent', 'accentunder', 'minsize', 'maxsize', 'width', 'height', 'depth', 'voffset'],
  };

  function renderMarkdown(text, opts) {
    const codes = [];
    const maths = [];
    let s = String(text || '');

    s = s.replace(/```[\s\S]*?(?:```|$)/g, (m) => {
      codes.push(m);
      return 'CODETOKEN' + (codes.length - 1) + 'END';
    });
    s = s.replace(/`[^`\n]+`/g, (m) => {
      codes.push(m);
      return 'CODETOKEN' + (codes.length - 1) + 'END';
    });

    const addMath = (tex, display) => {
      maths.push({ tex, display });
      return 'MATHTOKEN' + (maths.length - 1) + 'END';
    };
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => addMath(t, true));
    s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => addMath(t, true));
    s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => addMath(t, false));
    s = s.replace(/(?<!\\)\$(?=[^\s$])([^$\n]*?[^\s\\$])\$(?!\d)/g, (_, t) => addMath(t, false));

    const restoreCode = (str) => str.replace(/CODETOKEN(\d+)END/g, (_, i) => codes[+i]);
    s = restoreCode(s);

    let html;
    try {
      html = marked.parse(s, { gfm: true, breaks: Boolean(opts && opts.breaks) });
    } catch (e) {
      html = '<p>' + escapeHtml(s) + '</p>';
    }

    html = html.replace(/MATHTOKEN(\d+)END/g, (_, i) => {
      const m = maths[+i];
      if (!m) return '';
      const tex = restoreCode(m.tex);
      try {
        return katex.renderToString(tex, { displayMode: m.display, throwOnError: false });
      } catch (e) {
        return escapeHtml(m.display ? '$$' + tex + '$$' : '$' + tex + '$');
      }
    });

    return DOMPurify.sanitize(html, PURIFY_CFG);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  window.KelvinMarkdown = { render: renderMarkdown, escapeHtml };
})();
