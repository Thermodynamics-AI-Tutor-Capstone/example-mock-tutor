// Symbol tiles write directly into the ordinary message. Nothing is sent until Send.
(function () {
  const $ = (id) => document.getElementById(id);
  const input = $('input'), panel = $('equationPanel'), toggle = $('equationToggle');
  if (!input || !panel || !toggle) return;
  const groups = window.KelvinThermoSymbols;
  const options = { throwOnError: true, trust: false, maxExpand: 200, maxSize: 20 };
  let messageRange = [input.selectionStart, input.selectionEnd];
  function rememberMessage() { messageRange = [input.selectionStart, input.selectionEnd]; }
  for (const event of ['select', 'keyup', 'click', 'input', 'blur']) input.addEventListener(event, rememberMessage);
  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      document.dispatchEvent(new CustomEvent('kelvin:feature-used', { detail: 'equation' }));
      panel.scrollTop = 0;
      $('equationCategories').querySelector('[aria-pressed="true"]')?.focus({ preventScroll: true });
    } else toggle.focus();
  }
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  // The same toggle closes the compact palette; Escape also works after insertion.
  for (const target of [panel, input]) target.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); setOpen(false); }
  });
  function equations(content) {
    return [...content.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)];
  }
  function addSymbol(tex, placeholder) {
    let start = Math.min(messageRange[0], input.value.length);
    let end = Math.min(messageRange[1], input.value.length);
    // Insert inside existing math, including a cursor just after its closing delimiter.
    // This keeps repeated clicks together and prevents nested TeX delimiters.
    const existing = equations(input.value).find((match) =>
      start >= match.index + 2 && end <= match.index + match[0].length - 2);
    const adjacent = !existing && start === end && equations(input.value).find((match) =>
      start === match.index + match[0].length);
    if (adjacent) start = end = start - 2;
    const math = existing || adjacent;
    const before = input.value.slice(math ? math.index + 2 : start, start);
    const prefix = before && !/\s$/.test(before) ? ' ' : '';
    const opening = math ? '' : '\\(';
    const closing = math ? '' : '\\)';
    const token = opening + prefix + tex + ' ' + closing;
    input.setRangeText(token, start, end, 'end');
    const texStart = start + opening.length + prefix.length;
    let cursor = texStart + tex.length + 1;
    if (placeholder) {
      const braced = tex.indexOf('{' + placeholder + '}');
      const index = braced >= 0 ? braced + 1 : tex.indexOf(placeholder);
      if (index >= 0) {
        cursor = texStart + index;
        input.setSelectionRange(cursor, cursor + placeholder.length);
      } else input.setSelectionRange(cursor, cursor);
    } else input.setSelectionRange(cursor, cursor);
    input.focus({ preventScroll: true });
    input.dispatchEvent(new Event('input', { bubbles: true }));
    rememberMessage();
  }
  function showCategory(name) {
    for (const button of $('equationCategories').children) button.setAttribute('aria-pressed', String(button.textContent === name));
    $('equationSymbols').replaceChildren();
    $('equationSymbols').setAttribute('aria-label', name + ' thermodynamics symbols');
    for (const [label, tex, placeholder, meaning] of groups[name]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', label);
      button.title = meaning ? label + ' — ' + meaning : label;
      if (meaning) button.setAttribute('aria-description', meaning);
      const symbol = document.createElement('span');
      symbol.setAttribute('aria-hidden', 'true');
      window.katex.render(tex, symbol, options);
      const caption = document.createElement('span');
      caption.className = 'symbol-name';
      caption.textContent = label;
      button.append(symbol, caption);
      button.addEventListener('click', () => addSymbol(tex, placeholder));
      $('equationSymbols').append(button);
    }
  }
  for (const name of Object.keys(groups)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name;
    button.addEventListener('click', () => showCategory(name));
    $('equationCategories').append(button);
  }
  // Preserve literal prose; render new inline math and older display equations in history.
  window.KelvinEquations = {
    renderMessage(element, content) {
      let end = 0;
      for (const match of equations(content)) {
        element.append(document.createTextNode(content.slice(end, match.index)));
        const equation = document.createElement('span');
        const displayMode = match[2] !== undefined;
        equation.className = displayMode ? 'user-equation' : 'user-equation-inline';
        try { window.katex.render(match[1] ?? match[2], equation, { ...options, displayMode }); }
        catch { equation.textContent = match[0]; }
        element.append(equation);
        end = match.index + match[0].length;
      }
      element.append(document.createTextNode(content.slice(end)));
    },
  };
  showCategory('Common');
})();
