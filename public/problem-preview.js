// Formatted editing for uploaded problems. Markdown/TeX remain internal storage formats.
(function () {
  'use strict';
  // IDs survive the browser's native copy/undo cloning; clipboard HTML cannot supply IDs.
  const originals = new Map();
  const clipboardType = 'application/x-kelvin-problem';
  const tags = new Set(['math', 'semantics', 'mrow', 'mi', 'mn', 'mo', 'mtext', 'mspace',
    'mfrac', 'msub', 'msup', 'msubsup', 'msqrt', 'mover', 'munder', 'munderover', 'mstyle',
    'mtable', 'mtr', 'mtd', 'annotation']);
  const characters = { 'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ', 'δ': '\\delta ', 'Δ': '\\Delta ',
    'ε': '\\epsilon ', 'η': '\\eta ', 'θ': '\\theta ', 'λ': '\\lambda ', 'μ': '\\mu ', 'ν': '\\nu ',
    'π': '\\pi ', 'ρ': '\\rho ', 'σ': '\\sigma ', 'τ': '\\tau ', 'φ': '\\phi ', 'ω': '\\omega ',
    'Ω': '\\Omega ', 'Σ': '\\Sigma ', '∑': '\\sum ', '∫': '\\int ', '∞': '\\infty ',
    '≤': '\\le ', '≥': '\\ge ', '≠': '\\ne ', '≈': '\\approx ', '×': '\\times ', '·': '\\cdot ',
    '−': '-', '→': '\\to ', '∂': '\\partial ', '°': '^\\circ ', '\u0307': '\\cdot ', '˙': '\\cdot ' };

  function field(node) {
    if (node.localName === 'annotation') return document.createTextNode('');
    const el = document.createElement('span');
    el.className = 'att-math-' + node.localName;
    if (node.getAttribute('mathvariant') === 'normal') el.classList.add('att-math-roman');
    if (['mi', 'mn', 'mo', 'mtext'].includes(node.localName)) el.textContent = node.textContent;
    else if (node.localName === 'mspace') el.textContent = ' ';
    else for (const child of node.children) el.appendChild(field(child));
    return el;
  }
  function mathText(text) {
    return Array.from(text).map((c) => characters[c] || (/[%&#{}$\\]/.test(c) ? '\\' + c : c)).join('');
  }
  function tex(node) {
    if (node.nodeType === Node.TEXT_NODE) return mathText(node.textContent);
    const p = Array.from(node.childNodes).map(tex), c = node.classList;
    if (c.contains('att-math-mfrac')) return `\\frac{${p[0] || ''}}{${p[1] || ''}}`;
    if (c.contains('att-math-msub')) return `{${p[0] || ''}}_{${p[1] || ''}}`;
    if (c.contains('att-math-msup')) return `{${p[0] || ''}}^{${p[1] || ''}}`;
    if (c.contains('att-math-msubsup')) return `{${p[0] || ''}}_{${p[1] || ''}}^{${p[2] || ''}}`;
    if (c.contains('att-math-msqrt')) return `\\sqrt{${p.join('')}}`;
    if (c.contains('att-math-mover')) return `\\overset{${p[1] || ''}}{${p[0] || ''}}`;
    if (c.contains('att-math-munder')) return `\\underset{${p[1] || ''}}{${p[0] || ''}}`;
    if (c.contains('att-math-munderover')) return `\\overset{${p[2] || ''}}{\\underset{${p[1] || ''}}{${p[0] || ''}}}`;
    if (c.contains('att-math-mtable')) return `\\begin{matrix}${p.join(' \\\\ ')}\\end{matrix}`;
    if (c.contains('att-math-mtr')) return p.join(' & ');
    if (c.contains('att-math-mtext')) return `\\text{${p.join('')}}`;
    if (c.contains('att-math-roman')) return `\\mathrm{${p.join('')}}`;
    return p.join('');
  }

  function prepare(root, reset = true) {
    if (reset) originals.clear();
    for (const el of root.querySelectorAll('[data-problem-math]')) el.removeAttribute('data-problem-math');
    for (const rendered of root.querySelectorAll('.katex')) {
      const annotation = rendered.querySelector('annotation[encoding="application/x-tex"]');
      const math = rendered.querySelector('math');
      if (!annotation || !math) continue;
      const display = Boolean(rendered.closest('.katex-display'));
      const supported = Array.from(math.querySelectorAll('*')).every((n) => tags.has(n.localName)
        && (!n.hasAttribute('mathvariant') || ['normal', 'italic'].includes(n.getAttribute('mathvariant'))));
      const equation = document.createElement('span');
      equation.className = 'att-math' + (display ? ' att-math-display' : '');
      equation.setAttribute('aria-label', 'Equation');
      if (supported) equation.appendChild(field(math));
      else {
        // Unusual notation stays intact and can be selected and replaced with ordinary text.
        equation.appendChild(rendered.cloneNode(true));
        equation.contentEditable = 'false';
        equation.title = 'Select this equation to replace it';
      }
      equation.dataset.problemMath = crypto.randomUUID();
      originals.set(equation.dataset.problemMath, { tex: annotation.textContent, display, baseline: tex(equation) });
      (display ? rendered.closest('.katex-display') : rendered).replaceWith(equation);
    }
  }

  function markdown(root) {
    const escape = (s) => s.replace(/([\\`*_\[\]<>])/g, '\\$1');
    function read(node) {
      if (node.nodeType === Node.TEXT_NODE) return escape(node.textContent.replace(/\u00a0/g, ' '));
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const math = originals.get(node.getAttribute('data-problem-math'));
      if (math) {
        const value = tex(node);
        const source = value === math.baseline ? math.tex : value;
        return math.display ? `\n\n$$${source}$$\n\n` : `$${source}$`;
      }
      const text = Array.from(node.childNodes).map(read).join(''), tag = node.localName;
      if (tag === 'br') return '\n';
      if (tag === 'mark' && node.classList.contains('unsure')) return text === '?' ? '[?]' : text === 'unreadable' ? '[unreadable]' : text;
      if (tag === 'strong' || tag === 'b') return `**${text}**`;
      if (tag === 'em' || tag === 'i') return `*${text}*`;
      if (tag === 's' || tag === 'del') return `~~${text}~~`;
      if (tag === 'sub' || tag === 'sup') return `<${tag}>${text}</${tag}>`;
      if (/^h[1-6]$/.test(tag)) return '\n\n' + '#'.repeat(Number(tag[1])) + ' ' + text.trim() + '\n\n';
      if (tag === 'pre') return '\n\n```\n' + node.textContent.replace(/```/g, '` ` `') + '\n```\n\n';
      if (tag === 'code') return '`' + node.textContent.replace(/`/g, '\\`') + '`';
      if (tag === 'blockquote') return '\n\n' + text.trim().split('\n').map((line) => '> ' + line).join('\n') + '\n\n';
      if (tag === 'li') return (node.parentElement.localName === 'ol' ? String(Array.from(node.parentElement.children).indexOf(node) + 1) + '. ' : '- ') + text.trim().replace(/\n/g, '\n  ') + '\n';
      if (tag === 'ul' || tag === 'ol') return '\n\n' + text + '\n';
      if (tag === 'table') {
        const rows = Array.from(node.querySelectorAll('tr')).map((tr) => Array.from(tr.children).map((cell) => read(cell).trim().replace(/\|/g, '\\|').replace(/\n/g, '<br>')));
        if (!rows.length) return '';
        const width = Math.max(...rows.map((r) => r.length));
        const row = (r) => '| ' + Array.from({ length: width }, (_, i) => r[i] || '').join(' | ') + ' |';
        return '\n\n' + [row(rows[0]), row(Array(width).fill('---')), ...rows.slice(1).map(row)].join('\n') + '\n\n';
      }
      if (tag === 'a') {
        const href = node.getAttribute('href') || '';
        return /^(https?:\/\/|mailto:)/i.test(href) ? `[${text}](${href.replace(/[()\s]/g, encodeURIComponent)})` : text;
      }
      if (tag === 'hr') return '\n\n---\n\n';
      if (tag === 'p' || tag === 'div') return '\n' + text + '\n';
      return text;
    }
    return Array.from(root.childNodes).map(read).join('').replace(/\n{3,}/g, '\n\n').trim();
  }

  function copy(event) {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed || !event.clipboardData) return;
    const source = markdown(selection.getRangeAt(0).cloneContents());
    event.preventDefault();
    event.clipboardData.setData('text/plain', source);
    event.clipboardData.setData(clipboardType, source);
  }

  function paste(event) {
    event.preventDefault();
    const clip = event.clipboardData;
    if (!clip) return;
    const ownSource = clip.getData(clipboardType);
    if (ownSource) {
      const fragment = document.createElement('div');
      fragment.innerHTML = window.KelvinMarkdown.render(ownSource, { breaks: true });
      prepare(fragment, false);
      document.execCommand('insertHTML', false, fragment.innerHTML);
      return;
    }
    const html = clip.getData('text/html'), text = clip.getData('text/plain');
    // Stripping a foreign fraction's layout can turn 120/3 into 1203, or duplicate
    // KaTeX's visual + accessibility layers. Preserve clipboard text instead.
    if (/<(?:math|mfrac|msub|msup|annotation)\b|class\s*=\s*["'][^"']*(?:katex|att-math)/i.test(html)) {
      if (text) document.execCommand('insertText', false, text);
      return text ? 'Pasted this equation as plain text. Check its fractions and symbols before saving.'
        : 'This equation could not be pasted. Try copying its plain text.';
    }
    const clean = html ? DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'div', 'span', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'sub', 'sup', 'hr'],
      ALLOWED_ATTR: ['href'], ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false,
    }) : null;
    // Browser editing commands retain the caret and native undo history. Only sanitized HTML
    // or literal text can reach these commands; clipboard classes cannot forge math metadata.
    if (clean) document.execCommand('insertHTML', false, clean);
    else if (text) document.execCommand('insertText', false, text);
  }
  window.KelvinProblemPreview = { prepare, markdown, paste, copy };
})();
