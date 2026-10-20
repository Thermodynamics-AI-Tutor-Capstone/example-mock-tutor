// Local equation drafting. Only insertion into the ordinary message shares the equation.
(function () {
  const $ = (id) => document.getElementById(id);
  const source = $('equationSource'), input = $('input'), panel = $('equationPanel');
  if (!source || !input || !panel) return;
  const toggle = $('equationToggle'), preview = $('equationPreview'), status = $('equationStatus');
  const insert = $('equationInsert');
  const groups = window.KelvinThermoSymbols;
  const search = $('equationSearch');
  let category = 'Common';
  const options = { throwOnError: true, trust: false, maxExpand: 200, maxSize: 20 };
  let messageRange = [0, 0], equationRange = [0, 0];
  function rememberMessage() { messageRange = [input.selectionStart, input.selectionEnd]; }
  function rememberEquation() { equationRange = [source.selectionStart, source.selectionEnd]; }
  for (const event of ['select', 'keyup', 'click', 'input', 'blur']) {
    input.addEventListener(event, rememberMessage);
    source.addEventListener(event, rememberEquation);
  }
  function updatePreview() {
    preview.replaceChildren();
    insert.disabled = true;
    status.textContent = '';
    if (!source.value.trim()) return;
    if (source.value.length > 4000) {
      status.textContent = 'This equation is too long. Split it into smaller equations.';
      return;
    }
    try {
      window.katex.render(source.value, preview, { ...options, displayMode: true });
      insert.disabled = false;
    } catch {
      preview.replaceChildren();
      status.textContent = 'Keep editing—check paired braces and fill in the equation before inserting.';
    }
  }
  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      document.dispatchEvent(new CustomEvent('kelvin:feature-used', { detail: 'equation' }));
      search.focus({ preventScroll: true });
      panel.scrollTop = 0;
    } else toggle.focus();
  }
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  $('equationClose').addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    // Enter edits the equation; it must never submit the chat form.
    if (event.key === 'Enter' && event.target === source) event.stopPropagation();
    if (event.key === 'Enter' && event.target === search) event.preventDefault();
  });
  source.addEventListener('input', updatePreview);
  function addSymbol(tex, placeholder) {
    const [start, end] = equationRange;
    // Spaces delimit TeX commands: clicking rho followed by T must not create \rhoT.
    const before = source.value.slice(0, start);
    const prefix = before && !/\s$/.test(before) ? ' ' : '';
    const token = prefix + tex + ' ';
    source.setRangeText(token, start, end, 'end');
    source.focus();
    if (placeholder) {
      const braced = tex.indexOf('{' + placeholder + '}');
      const from = start + prefix.length + (braced >= 0 ? braced + 1 : tex.indexOf(placeholder));
      source.setSelectionRange(from, from + placeholder.length);
    }
    rememberEquation();
    updatePreview();
  }
  function showCategory(name) {
    category = name;
    const query = search.value.trim().toLowerCase();
    for (const button of $('equationCategories').children) {
      button.setAttribute('aria-pressed', String(!query && button.textContent === name));
    }
    $('equationSymbols').replaceChildren();
    const entries = query
      ? [...new Map(Object.values(groups).flat().map((entry) => [entry[0], entry])).values()]
        .filter(([label, tex, , meaning]) => [label, tex, meaning || ''].join(' ').toLowerCase().includes(query))
      : groups[name];
    if (!entries.length) {
      const empty = document.createElement('p');
      empty.className = 'equation-help';
      empty.textContent = 'No matching quantity. Try another name, or type it in your equation.';
      $('equationSymbols').append(empty);
    }
    for (const [label, tex, placeholder, meaning] of entries) {
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
    button.addEventListener('click', () => { search.value = ''; showCategory(name); });
    $('equationCategories').append(button);
  }
  search.addEventListener('input', () => showCategory(category));
  $('equationClear').addEventListener('click', () => {
    source.value = '';
    equationRange = [0, 0];
    updatePreview();
    source.focus();
  });
  insert.addEventListener('click', () => {
    if (insert.disabled) return;
    const start = Math.min(messageRange[0], input.value.length);
    const end = Math.min(messageRange[1], input.value.length);
    const before = input.value.slice(0, start), after = input.value.slice(end);
    const text = (before && !/\n$/.test(before) ? '\n' : '') +
      '\\[' + source.value.trim() + '\\]' + (after && !/^\n/.test(after) ? '\n' : '');
    input.setRangeText(text, start, end, 'end');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    source.value = '';
    equationRange = [0, 0];
    updatePreview();
    setOpen(false);
    input.focus();
    rememberMessage();
  });
  // Keep student prose literal while rendering only delimited equations, including chat history.
  window.KelvinEquations = {
    renderMessage(element, content) {
      const pattern = /\\\[([\s\S]+?)\\\]/g;
      let end = 0;
      for (const match of content.matchAll(pattern)) {
        element.append(document.createTextNode(content.slice(end, match.index)));
        const equation = document.createElement('span');
        equation.className = 'user-equation';
        try { window.katex.render(match[1], equation, { ...options, displayMode: true }); }
        catch { equation.textContent = match[0]; }
        element.append(equation);
        end = match.index + match[0].length;
      }
      element.append(document.createTextNode(content.slice(end)));
    },
  };
  showCategory('Common');
})();
