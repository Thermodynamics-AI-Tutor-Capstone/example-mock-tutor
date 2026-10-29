(function () {
  'use strict';
  let panel, result = null, requestId = 0;
  const units = { P: 'kPa', T: '°C', x: '0–1', h: 'kJ/kg', s: 'kJ/(kg·K)', v: 'm³/kg', u: 'kJ/kg' };
  const names = { P: 'Pressure', T: 'Temperature', x: 'Quality', h: 'Enthalpy', s: 'Entropy', v: 'Specific volume', u: 'Internal energy' };
  const pairs = ['P,T','P,x','T,x','P,h','P,s','P,v','P,u','T,v','T,s'];
  const make = (tag, text, className) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; if (className) el.className = className; return el; };
  function show(host) {
    panel = host; if (!panel) return; panel.hidden = false;
    if (panel.childElementCount) return;
    panel.classList.add('property-reference');
    panel.append(make('h2', 'Numeric property reference'), make('p', 'Source-page scans are unavailable here. Look up a state using KELVIN’s installed interpolated property data.', 'pr-note'));
    const form = make('form'); form.id = 'propertyReferenceForm';
    const fluidLabel = make('label', 'Fluid'); const fluid = make('select'); fluid.id = 'prFluid';
    for (const [id, text] of [['water','Water'],['r134a','R-134a']]) { const o = make('option', text); o.value = id; fluid.append(o); } fluidLabel.append(fluid);
    const pairLabel = make('label', 'Known properties'); const pair = make('select'); pair.id = 'prPair';
    for (const item of pairs) { const o = make('option', item.split(',').map((key) => key + ' · ' + names[key]).join(' + ')); o.value = item; pair.append(o); } pairLabel.append(pair);
    const inputs = make('div', undefined, 'pr-inputs'); inputs.id = 'prInputs';
    const submit = make('button', 'Look up state', 'pr-submit'); submit.type = 'submit';
    form.append(fluidLabel, pairLabel, inputs, submit); panel.append(form);
    const status = make('p', '', 'pr-status'); status.id = 'prStatus'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    const output = make('section'); output.id = 'prResult'; output.hidden = true; output.setAttribute('aria-label', 'Looked-up state'); panel.append(status, output);
    const invalidate = () => { ++requestId; result = null; output.hidden = true; status.textContent = ''; submit.disabled = false; };
    const renderInputs = () => { invalidate(); inputs.replaceChildren(); for (const key of pair.value.split(',')) { const label = make('label', `${names[key]} ${key} (${units[key]})`); const input = make('input'); input.type = 'number'; input.step = 'any'; input.required = true; input.dataset.property = key; input.setAttribute('aria-label', `${names[key]} (${units[key]})`); input.inputMode = 'decimal'; if (key === 'x') { input.min = '0'; input.max = '1'; } label.append(input); inputs.append(label); } };
    pair.addEventListener('change', renderInputs); fluid.addEventListener('change', invalidate); inputs.addEventListener('input', invalidate); renderInputs();
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); const token = ++requestId; result = null; output.hidden = true; submit.disabled = true; status.setAttribute('role', 'status'); status.textContent = 'Looking up the state…';
      const properties = {}; inputs.querySelectorAll('input').forEach((input) => { properties[input.dataset.property] = input.valueAsNumber; });
      try {
        const response = await fetch('/api/properties/lookup', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fluid: fluid.value, properties }) });
        const data = await response.json();
        if (!response.ok) throw new Error(response.status === 401 ? 'Sign in to KELVIN to use the numeric reference.' : data.error || 'The state lookup is unavailable. Please try again.');
        if (data.kind !== 'interpolated-property-reference' || !data.state || !data.units || !data.source) throw new Error('The lookup did not return a complete numeric reference.');
        if (token !== requestId) return;
        result = data; renderResult(output); status.textContent = 'State found. Review the units, phase and source below.';
      } catch (error) { if (token === requestId) { status.setAttribute('role', 'alert'); status.textContent = error.message || 'Could not look up the state.'; } }
      finally { if (token === requestId) submit.disabled = false; }
    });
  }
  function renderResult(output) {
    output.replaceChildren(make('h3', result.fluid + ' · ' + result.state.phase));
    const table = make('table'); const head = make('thead'); const hr = make('tr'); for (const text of ['Property','Value','Unit']) hr.append(make('th', text)); head.append(hr); const body = make('tbody');
    for (const key of ['P','T','x','v','u','h','s']) { const value = result.state[key]; if (value === null || value === undefined) continue; const row = make('tr'); row.append(make('th', `${names[key]} (${key})`), make('td', String(value)), make('td', result.units[key])); body.append(row); }
    table.append(head, body); output.append(table, make('p', result.source, 'pr-note'), make('p', result.note, 'pr-note'));
    for (const note of result.state.notes || []) output.append(make('p', note, 'pr-note'));
    if (window.parent !== window) {
      const use = make('button', 'Use in chat', 'pr-submit'); use.type = 'button';
      use.addEventListener('click', () => {
        if (!result) return;
        const values = ['P','T','x','v','u','h','s'].filter((key) => result.state[key] !== null && result.state[key] !== undefined).map((key) => `${key} = ${result.state[key]} ${result.units[key]}`).join('; ');
        const text = `${result.fluid}, ${result.state.phase}: ${values}. ${result.source} Numeric interpolated reference, not a course-table scan.`;
        window.parent.postMessage({ type: 'kelvin:property-table-selection', text: text.slice(0, 1000) }, location.origin);
        document.getElementById('prStatus').textContent = 'Reference added to your chat draft. Nothing was sent.';
      }); output.append(use);
    }
    output.hidden = false;
  }
  window.KelvinPropertyReference = { show, hide() { ++requestId; if (panel) { panel.hidden = true; const submit = panel.querySelector('button[type=submit]'); if (submit) submit.disabled = false; } } };
})();
