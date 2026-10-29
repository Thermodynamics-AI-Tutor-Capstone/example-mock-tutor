// Exact source images are authoritative. Numeric text exists only for manually verified examples.
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const svgNS = 'http://www.w3.org/2000/svg';
  const embedded = window.parent !== window;
  const state = { manifest: null, dataset: null, page: null, section: null, selected: null, pinned: false, guide: -1, guideCell: null, crop: null };
  if (embedded) {
    document.documentElement.classList.add('embedded');
    for (const link of document.querySelectorAll('a[target="_top"]')) { link.removeAttribute('href'); link.removeAttribute('target'); link.setAttribute('aria-disabled', 'true'); }
    document.querySelector('.back-link').hidden = true;
  }
  let loadGeneration = 0, imageGeneration = 0, cropGeneration = 0, pointerFrame = null;
  const element = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text != null) el.textContent = text; return el; };
  const safeLocalUrl = (value) => { try { const url = new URL(value, location.origin); return url.origin === location.origin && url.pathname.startsWith('/property-tables/') ? url.href : null; } catch { return null; } };
  const number = (value) => Number.isFinite(value);
  const verified = (row, column) => state.section.verifiedCells?.find((cell) => cell.rowId === row.id && cell.columnKey === column.key && typeof cell.value === 'string');
  const sourceDescription = () => `${state.dataset.source.file} · PDF page ${state.page.number}${state.page.printedPage ? ` · printed p. ${state.page.printedPage}` : ''}`;
  const columnName = (column) => [column.label, column.phase].filter(Boolean).join(' · ');
  const pressureText = () => typeof state.section.pressure === 'object' && state.section.pressure !== null ? [state.section.pressure.value, state.section.pressure.unit].filter((part) => part != null).join(' ') : String(state.section.pressure || '');
  const phaseText = (row, column) => column.phase || row.phase || state.section.phase || '';
  const selectionText = (selection) => {
    if (!selection) return '';
    const { row, column, cell } = selection;
    const rowText = [cell?.rowLabel || row.label || `source row ${selection.rowIndex + 1}`, phaseText(row, column)].filter(Boolean).join(' · ');
    return (cell
      ? `${state.section.title}: ${rowText}; ${columnName(column)} (${column.symbol || column.key}) = ${cell.value}${column.unit ? ` ${column.unit}` : ''}. Source: ${sourceDescription()}.`
      : `Table reference: ${state.section.title}; ${rowText}; ${columnName(column)} (${column.symbol || column.key})${column.unit ? `, units ${column.unit}` : ''}. Source: ${sourceDescription()}. Numeric value not included; ask me to enter it if needed rather than infer it from this reference.`).slice(0, 1000);
  };
  function cropSvg(bounds, label) {
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', label);
    // A fixed inspector viewport can letterbox the viewBox. Explicitly clip the
    // original page so neighboring rows never appear inside that extra space.
    const defs = document.createElementNS(svgNS, 'defs');
    const clip = document.createElementNS(svgNS, 'clipPath');
    clip.id = `source-crop-${++cropGeneration}`; clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    const rect = document.createElementNS(svgNS, 'rect');
    for (const [key, value] of Object.entries(bounds)) rect.setAttribute(key, value);
    clip.append(rect); defs.append(clip);
    const image = document.createElementNS(svgNS, 'image');
    image.setAttribute('href', safeLocalUrl(state.page.image));
    image.setAttribute('width', state.page.width); image.setAttribute('height', state.page.height);
    image.setAttribute('clip-path', `url(#${clip.id})`);
    svg.append(defs, image); return svg;
  }
  function bounds(row, column) { return { x: column.left, y: row.top, width: column.right - column.left, height: row.bottom - row.top }; }
  function place(el, box) {
    const crop = state.crop;
    Object.assign(el.style, { left: `${(box.x - crop.x) / crop.width * 100}%`, top: `${(box.y - crop.y) / crop.height * 100}%`, width: `${box.width / crop.width * 100}%`, height: `${box.height / crop.height * 100}%` });
  }
  function describeSelection(rowIndex, columnIndex) {
    const row = state.section.rows[rowIndex], column = state.section.columns[columnIndex];
    return { rowIndex, columnIndex, row, column, cell: verified(row, column) || null };
  }
  function inspect(rowIndex, columnIndex, { pin = false, force = false } = {}) {
    if (state.pinned && !pin && !force) return;
    const selected = describeSelection(rowIndex, columnIndex);
    state.selected = selected;
    $('backToCell').hidden = false;
    if (pin) state.pinned = true;
    const { row, column, cell } = selected;
    for (const el of $('propertyTable').querySelectorAll('.scan-cell')) {
      const active = +el.dataset.row === rowIndex && +el.dataset.column === columnIndex;
      el.classList.toggle('is-selected', active); el.classList.toggle('is-pinned', active && state.pinned);
      el.setAttribute('aria-selected', String(active)); el.tabIndex = active ? 0 : -1;
    }
    const box = bounds(row, column), columns = state.section.columns;
    place($('rowBand'), { x: columns[0].left, y: row.top, width: columns.at(-1).right - columns[0].left, height: box.height });
    place($('columnBand'), { x: column.left, y: state.crop.y, width: box.width, height: state.crop.height });
    $('rowBand').hidden = $('columnBand').hidden = false;
    $('cellProperty').textContent = columnName(column);
    $('cellValue').textContent = cell ? cell.value : 'Source value';
    $('cellValue').parentElement.classList.toggle('unverified', !cell);
    $('cellUnit').textContent = column.unit || '';
    $('cellCrop').replaceChildren(cropSvg(box, cell ? `Source cell: ${cell.value} ${column.unit || ''}` : `Original printed value for ${columnName(column)}, source row ${rowIndex + 1}. Text transcription unavailable.`));
    $('cellCrop').hidden = false;
    $('valueVerification').textContent = cell ? 'Verified text equivalent · original cell shown below the value.' : 'Exact source crop. This number has not been transcribed; read it directly from the reference.';
    $('valueVerification').classList.toggle('verified', Boolean(cell));
    $('cellContext').replaceChildren();
    const context = [['Table', state.section.title], ['State row', cell?.rowLabel || row.label || `Row ${rowIndex + 1}`], ['Property', column.symbol || column.key], ['Units', column.unit || 'As printed']];
    if (state.section.pressure) context.splice(1, 0, ['Pressure group', pressureText()]);
    if (phaseText(row, column)) context.push(['Region', phaseText(row, column)]);
    for (const [label, value] of context) { const line = element('div', 'context-line'); line.append(element('span', '', label), element('strong', '', value)); $('cellContext').append(line); }
    $('rowCrop').replaceChildren(cropSvg(bounds(row, columns[0]), `State coordinate for source row ${rowIndex + 1}`));
    $('rowContext').hidden = false;
    $('cellSource').textContent = sourceDescription();
    $('pinStatus').textContent = state.pinned ? 'Pinned' : 'Following pointer';
    $('pinStatus').classList.toggle('pinned', state.pinned); $('clearPin').hidden = !state.pinned;
    $('useInChat').disabled = $('propertyTable').dataset.imageStatus !== 'loaded';
    $('useInChat').textContent = cell ? 'Use in chat ↗' : 'Use reference in chat ↗';
    if (pin) $('selectionStatus').textContent = `Pinned ${columnName(column)}, ${cell?.rowLabel || row.label || `row ${rowIndex + 1}`}${cell ? `: ${cell.value} ${column.unit || ''}` : '. Numeric value is shown as an original source crop.'}`;
    window.dispatchEvent(new CustomEvent('kelvin:property-cell', { detail: publicSelection() }));
  }
  function publicSelection() {
    if (!state.selected) return null;
    const { row, column, cell, rowIndex, columnIndex } = state.selected;
    return { datasetId: state.dataset.id, pageId: state.page.id, sectionId: state.section.id, rowId: row.id, columnKey: column.key, rowIndex, columnIndex, verified: Boolean(cell), value: cell?.value ?? null, unit: column.unit || null, phase: phaseText(row, column) || null, sourcePage: state.page.number, sourceFile: state.dataset.source.file, image: state.page.image, bounds: bounds(row, column), pinned: state.pinned, text: selectionText(state.selected) };
  }
  function unpin() { state.pinned = false; if (state.selected) inspect(state.selected.rowIndex, state.selected.columnIndex, { force: true }); $('selectionStatus').textContent = 'Unpinned. Hover or focus another cell to inspect it.'; }
  function fillSelect(select, entries) { select.replaceChildren(...entries.map(([value, label]) => { const option = element('option', '', label); option.value = value; return option; })); }
  function chooseDataset(id) {
    state.dataset = state.manifest.datasets.find((entry) => entry.id === id) || state.manifest.datasets[0];
    $('datasetSelect').value = state.dataset.id;
    fillSelect($('tableSelect'), state.dataset.pages.map((page) => [page.id, `Page ${page.number}${page.printedPage ? ` · printed ${page.printedPage}` : ''} — ${page.sections[0]?.title || state.dataset.title}`]));
    choosePage(state.dataset.pages[0].id);
  }
  function choosePage(id) {
    state.page = state.dataset.pages.find((page) => page.id === id) || state.dataset.pages[0];
    $('tableSelect').value = state.page.id;
    fillSelect($('groupSelect'), state.page.sections.map((section) => [section.id, section.title]));
    $('groupField').hidden = state.page.sections.length < 2;
    chooseSection(state.page.sections[0].id);
  }
  function chooseSection(id) {
    closeGuide(); state.pinned = false; state.selected = null;
    state.section = state.page.sections.find((section) => section.id === id) || state.page.sections[0];
    $('groupSelect').value = state.section.id; $('jumpStatus').textContent = ''; $('jumpValue').value = '';
    const { columns, rows } = state.section;
    const left = Math.max(0, Math.min(...columns.map((col) => col.left)) - 12), right = Math.min(state.page.width, Math.max(...columns.map((col) => col.right)) + 12);
    const top = Math.max(0, state.section.headerTop ?? rows[0].top - 140), bottom = Math.min(state.page.height, rows.at(-1).bottom + 12);
    state.crop = { x: left, y: top, width: right - left, height: bottom - top };
    $('tableKicker').textContent = `${state.dataset.title} · ${state.page.number} / ${state.dataset.pages.length}`;
    $('tableTitle').textContent = state.section.title;
    $('tableDescription').textContent = [state.section.phase, state.section.pressure ? `Pressure group: ${pressureText()}` : '', 'Original scan · hover a cell for a magnified reading'].filter(Boolean).join(' · ');
    $('rowCount').textContent = `${rows.length} rows · ${columns.length} columns`;
    $('jumpLabel').textContent = 'Go to source row'; $('jumpValue').min = '1'; $('jumpValue').max = String(rows.length); $('jumpValue').step = '1';
    $('tableSource').textContent = `PDF page ${state.page.number}${state.page.printedPage ? ` · printed p. ${state.page.printedPage}` : ''}`;
    const pdf = safeLocalUrl(state.dataset.source.url);
    $('sourceLink').setAttribute('aria-disabled', 'false');
    $('sourceLink').textContent = pdf ? 'Original PDF ↗' : 'Open source page ↗';
    $('sourceLink').href = pdf ? `${pdf}#page=${state.page.number}` : safeLocalUrl(state.page.image);
    const grid = $('propertyTable'); grid.replaceChildren();
    grid.dataset.pageId = state.page.id; grid.dataset.sectionId = state.section.id;
    for (const [key, value] of Object.entries(state.crop)) grid.dataset['crop' + key[0].toUpperCase() + key.slice(1)] = String(value);
    grid.setAttribute('aria-rowcount', rows.length); grid.setAttribute('aria-colcount', columns.length);
    grid.setAttribute('aria-label', `${state.section.title}, source page ${state.page.number}. Original numeric values are images.`);
    const image = cropSvg(state.crop, `${state.section.title}, complete source table section`); image.classList.add('scan-image'); grid.append(image);
    for (const name of ['row', 'column']) { const band = element('div', `scan-band ${name}-band`); band.id = name + 'Band'; band.hidden = true; band.setAttribute('aria-hidden', 'true'); grid.append(band); }
    const headers = element('div'); headers.setAttribute('role', 'row');
    columns.forEach((column, columnIndex) => { const label = element('span', 'column-target', `${columnName(column)} (${column.symbol || column.key}), ${column.unit || 'units as printed'}`); label.dataset.column = columnIndex; label.setAttribute('role', 'columnheader'); label.setAttribute('aria-label', label.textContent); label.textContent = ''; place(label, { x: column.left, y: top, width: column.right - column.left, height: rows[0].top - top }); headers.append(label); }); grid.append(headers);
    rows.forEach((row, rowIndex) => {
      const wrapper = element('div'); wrapper.setAttribute('role', 'row'); wrapper.setAttribute('aria-rowindex', rowIndex + 1);
      columns.forEach((column, columnIndex) => {
        const button = element('button', 'scan-cell'); button.type = 'button'; button.setAttribute('role', 'gridcell'); button.setAttribute('aria-colindex', columnIndex + 1); button.tabIndex = -1;
        const cell = verified(row, column); button.dataset.row = rowIndex; button.dataset.column = columnIndex; button.dataset.verified = String(Boolean(cell));
        const box = bounds(row, column); for (const [key, value] of Object.entries(box)) button.dataset[key] = String(value); place(button, box);
        button.setAttribute('aria-label', `${columnName(column)}: ${cell ? cell.value + ' ' + (column.unit || '') : 'source image value, no text transcription'}; ${cell?.rowLabel || row.label || `row ${rowIndex + 1}`}; ${phaseText(row, column)}; PDF page ${state.page.number}`);
        button.addEventListener('mouseenter', () => { if (state.guide < 0) inspect(rowIndex, columnIndex); });
        button.addEventListener('focus', () => { if (state.guide < 0) inspect(rowIndex, columnIndex); });
        button.addEventListener('click', (event) => { closeGuide(); inspect(rowIndex, columnIndex, { pin: true }); if (event.pointerType === 'touch') document.querySelector('.inspector').scrollIntoView({ block: 'nearest', behavior: 'instant' }); });
        button.addEventListener('keydown', (event) => navigateCell(event, rowIndex, columnIndex));
        wrapper.append(button);
      }); grid.append(wrapper);
    });
    const token = ++imageGeneration, probe = new Image();
    probe.addEventListener('error', () => { if (token === imageGeneration) $('backToCell').hidden = true; });
    probe.onload = () => { if (token === imageGeneration) { grid.dataset.imageStatus = 'loaded'; grid.setAttribute('aria-busy', 'false'); grid.querySelectorAll('button').forEach((button) => { button.disabled = false; }); $('useInChat').disabled = !state.selected; } };
    probe.onerror = () => { if (token !== imageGeneration) return; grid.dataset.imageStatus = 'error'; grid.setAttribute('aria-busy', 'false'); grid.replaceChildren(element('p', 'scan-error', 'This source page could not load. Choose another page or reload after the course-table assets are installed.')); state.selected = null; state.pinned = false; $('cellCrop').hidden = true; $('rowContext').hidden = true; $('cellValue').textContent = 'Unavailable'; $('cellUnit').textContent = ''; $('cellProperty').textContent = 'Source image could not load'; $('cellContext').replaceChildren(); $('valueVerification').textContent = 'No value can be selected until the original source image is available.'; $('pinStatus').textContent = 'Unavailable'; $('clearPin').hidden = true; $('useInChat').disabled = true; closeGuide(); };
    grid.setAttribute('aria-busy', 'true'); grid.querySelectorAll('button').forEach((button) => { button.disabled = true; });
    grid.dataset.imageStatus = 'loading'; probe.src = safeLocalUrl(state.page.image);
    const demo = state.section.verifiedCells?.find((cell) => !['T', 'P'].includes(cell.columnKey)) || state.section.verifiedCells?.[0];
    const rowIndex = demo ? rows.findIndex((row) => row.id === demo.rowId) : 0;
    const columnIndex = demo ? columns.findIndex((column) => column.key === demo.columnKey) : Math.min(1, columns.length - 1);
    inspect(Math.max(0, rowIndex), Math.max(0, columnIndex), { force: true });
    $('tableScroll').scrollTo(0, 0);
  }
  function cellElement(row, column) { return $('propertyTable').querySelector(`.scan-cell[data-row="${row}"][data-column="${column}"]`); }
  function navigateCell(event, row, column) {
    const key = event.key;
    if (key === 'Escape') { event.preventDefault(); closeGuide(); unpin(); return; }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
    event.preventDefault(); closeGuide();
    const rows = state.section.rows.length, columns = state.section.columns.length;
    if (key === 'ArrowUp') row--; if (key === 'ArrowDown') row++; if (key === 'ArrowLeft') column--; if (key === 'ArrowRight') column++;
    if (key === 'Home') { column = 0; if (event.ctrlKey) row = 0; } if (key === 'End') { column = columns - 1; if (event.ctrlKey) row = rows - 1; }
    const target = cellElement(Math.max(0, Math.min(rows - 1, row)), Math.max(0, Math.min(columns - 1, column)));
    for (const cell of $('propertyTable').querySelectorAll('.scan-cell')) cell.tabIndex = cell === target ? 0 : -1;
    target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function closeGuide() {
    state.guide = -1; state.guideCell = null; $('guidePointer').hidden = true;
    $('guidePlayback').hidden = true; $('guideStart').hidden = false; $('guideDescription').hidden = false;
    document.querySelectorAll('.guide-target').forEach((node) => node.classList.remove('guide-target'));
  }
  function guideTarget() {
    const cell = state.guideCell;
    if (!cell) return null;
    return [$('groupField').hidden ? $('tableSelect') : $('groupSelect'), cellElement(cell.rowIndex, 0), $('propertyTable').querySelector(`.column-target[data-column="${cell.columnIndex}"]`), cellElement(cell.rowIndex, cell.columnIndex)][state.guide];
  }
  function positionPointer() {
    pointerFrame = null;
    const target = guideTarget(); if (state.guide < 0 || !target) { $('guidePointer').hidden = true; return; }
    let box = target.getBoundingClientRect();
    if (target.closest('#propertyTable')) {
      const clip = $('tableScroll').getBoundingClientRect();
      const left = Math.max(box.left, clip.left), right = Math.min(box.right, clip.right), top = Math.max(box.top, clip.top), bottom = Math.min(box.bottom, clip.bottom);
      if (right <= left || bottom <= top) { $('guidePointer').hidden = true; return; }
      box = { left, right, top, bottom, width: right - left, height: bottom - top };
    }
    const visible = box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth;
    $('guidePointer').hidden = !visible;
    if (!visible) return;
    // The rotated finger tip lies about (35, 12) inside the marker box.
    // Keep it just outside the selected cell, level with the numeric row.
    $('guidePointer').style.left = `${Math.max(3, Math.min(innerWidth - 46, box.left - 38))}px`;
    $('guidePointer').style.top = `${Math.max(4, Math.min(innerHeight - 50, box.top + box.height / 2 - 12))}px`;
  }
  function showGuide(step) {
    if (!state.selected || $('propertyTable').dataset.imageStatus === 'error') return;
    if (state.guide < 0) state.guideCell = { ...state.selected };
    state.guide = Math.max(0, Math.min(3, step));
    const { row, column, cell, rowIndex } = state.guideCell;
    const rowLabel = cell?.rowLabel || row.label || `source row ${rowIndex + 1}`;
    const instructions = [
      `Start with ${state.section.title}.${phaseText(row, column) ? ` This cell is in the ${phaseText(row, column)} region.` : ''} Check that the table and state region match your problem; the page title alone does not establish the state.`,
      `Locate ${rowLabel}. Follow the printed state coordinate across this row. Use the magnified source crop to check the digits.`,
      `Now follow the ${columnName(column)} column (${column.symbol || column.key}). Read its heading and units: ${column.unit || 'as printed in the source'}.`,
      cell ? `The intersection gives ${cell.value} ${column.unit || ''}. This example has a verified text equivalent. Carry the value, units and state together into your equation.` : `The intersection is the property value. Read the enlarged original cell; this cell has no verified text equivalent. Keep the source page and units with your notes.`,
    ];
    $('guideStart').hidden = true; $('guideDescription').hidden = true; $('guidePlayback').hidden = false;
    $('guideInstruction').textContent = instructions[state.guide]; $('guideCount').textContent = `${state.guide + 1} / 4`;
    $('guidePrevious').disabled = state.guide === 0; $('guideNext').disabled = state.guide === 3;
    [...document.querySelectorAll('.guide-stages li')].forEach((el, i) => { el.classList.toggle('active', i === state.guide); el.classList.toggle('done', i < state.guide); if (i === state.guide) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); });
    document.querySelectorAll('.guide-target').forEach((node) => node.classList.remove('guide-target'));
    const target = guideTarget(); target?.classList.add('guide-target'); target?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    $('pointerNumber').textContent = state.guide + 1; $('guidePointer').dataset.step = state.guide;
    positionPointer();
  }
  function validateManifest(manifest) {
    if (manifest?.version !== 1 || manifest.mode !== 'source-scans' || !Array.isArray(manifest.datasets) || !manifest.datasets.length) throw new Error('The installed table manifest is not supported.');
    for (const dataset of manifest.datasets) {
      if (!dataset.id || !dataset.title || !dataset.source?.file || !dataset.pages?.length) throw new Error('The table manifest is incomplete.');
      for (const page of dataset.pages) {
        if (!page.id || !number(page.width) || !number(page.height) || page.width <= 0 || page.height <= 0 || !safeLocalUrl(page.image) || !page.sections?.length) throw new Error('A source page is incomplete.');
        for (const section of page.sections) {
          if (!section.id || !section.title || !section.columns?.length || !section.rows?.length) throw new Error('A source table section is incomplete.');
          for (const col of section.columns) if (!col.key || !number(col.left) || !number(col.right) || col.left < 0 || col.right > page.width || col.right <= col.left) throw new Error('A column lies outside its source image.');
          for (const row of section.rows) if (!row.id || !number(row.top) || !number(row.bottom) || row.top < 0 || row.bottom > page.height || row.bottom <= row.top) throw new Error('A row lies outside its source image.');
        }
      }
    }
    return manifest;
  }
  async function load() {
    const token = ++loadGeneration;
    ++imageGeneration; closeGuide(); state.selected = null; state.pinned = false; state.manifest = null;
    $('backToCell').hidden = true;
    $('viewer').hidden = true; $('loadStatus').hidden = false; $('loadStatus').classList.remove('error'); $('loadStatus').textContent = 'Loading the reference library…';
    window.KelvinPropertyReference?.hide();
    try {
      const response = await fetch('/property-tables/manifest.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(response.status === 404 ? 'These course tables have not been installed on this deployment.' : 'The course-table library could not be loaded.');
      const manifest = validateManifest(await response.json()); if (token !== loadGeneration) return;
      state.manifest = manifest;
      fillSelect($('datasetSelect'), manifest.datasets.map((dataset) => [dataset.id, dataset.title]));
      chooseDataset(manifest.datasets[0].id); $('viewer').hidden = false; $('loadStatus').hidden = true;
    } catch (error) {
      if (token !== loadGeneration) return;
      $('loadStatus').classList.add('error'); $('loadStatus').replaceChildren(element('div', '', error.message || 'The course tables could not be loaded.'));
      const retry = element('button', 'primary-button', 'Try again'); retry.type = 'button'; retry.id = 'retryLoad'; retry.addEventListener('click', load); $('loadStatus').append(retry);
      window.KelvinPropertyReference?.show($('numericReference'));
    }
  }
  $('datasetSelect').addEventListener('change', () => chooseDataset($('datasetSelect').value));
  $('tableSelect').addEventListener('change', () => choosePage($('tableSelect').value));
  $('groupSelect').addEventListener('change', () => chooseSection($('groupSelect').value));
  $('tableZoom').addEventListener('change', () => { const zoom = Number($('tableZoom').value); $('propertyTable').style.width = `${zoom * 100}%`; $('propertyTable').style.minWidth = `${620 * zoom}px`; schedulePointer(); });
  $('clearPin').addEventListener('click', unpin);
  $('backToCell').addEventListener('click', () => {
    if (!state.selected) return;
    const target = cellElement(state.selected.rowIndex, state.selected.columnIndex);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
  });
  $('jumpForm').addEventListener('submit', (event) => { event.preventDefault(); const row = Number($('jumpValue').value) - 1; if (!Number.isInteger(row) || row < 0 || row >= state.section.rows.length) { $('jumpStatus').textContent = `Enter a source row from 1 to ${state.section.rows.length}.`; return; } closeGuide(); inspect(row, state.selected?.columnIndex || 0, { pin: true }); const target = cellElement(row, state.selected.columnIndex); target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'center', inline: 'nearest' }); $('jumpStatus').textContent = `Source row ${row + 1} selected. This is a row position, not a temperature or pressure calculation.`; });
  $('guideStart').addEventListener('click', () => showGuide(0)); $('guidePrevious').addEventListener('click', () => showGuide(state.guide - 1)); $('guideNext').addEventListener('click', () => showGuide(state.guide + 1)); $('guideReplay').addEventListener('click', () => showGuide(0)); $('guideClose').addEventListener('click', closeGuide);
  $('useInChat').hidden = !embedded;
  $('useInChat').addEventListener('click', () => { if (!embedded || !state.selected) return; window.parent.postMessage({ type: 'kelvin:property-table-selection', text: selectionText(state.selected) }, location.origin); $('selectionStatus').textContent = 'Reference added to your chat draft. Nothing was sent.'; });
  const schedulePointer = () => { if (pointerFrame === null) pointerFrame = requestAnimationFrame(positionPointer); };
  window.addEventListener('resize', schedulePointer); window.addEventListener('scroll', schedulePointer, true);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeGuide(); if (state.selected) unpin(); } });
  function applyTheme(theme) { document.documentElement.dataset.theme = theme; $('themeToggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} appearance`); }
  let theme; try { theme = localStorage.getItem('kelvin-property-theme'); } catch {}
  applyTheme(theme === 'dark' || theme === 'light' ? theme : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  $('themeToggle').addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(next); try { localStorage.setItem('kelvin-property-theme', next); } catch {} });
  window.KelvinPropertyTables = { getSelection: publicSelection, selectCell({ datasetId, pageId, sectionId, rowId, columnKey, pin = true }) {
    if (!state.manifest) return false;
    const dataset = datasetId ? state.manifest.datasets.find((entry) => entry.id === datasetId) : state.dataset;
    if (!dataset) return false;
    const page = pageId ? dataset.pages.find((entry) => entry.id === pageId) : dataset.id === state.dataset.id ? state.page : dataset.pages[0];
    if (!page) return false;
    const section = sectionId ? page.sections.find((entry) => entry.id === sectionId) : page.id === state.page.id ? state.section : page.sections[0];
    if (!section) return false;
    const row = section.rows.findIndex((entry) => entry.id === rowId), column = section.columns.findIndex((entry) => entry.key === columnKey);
    if (row < 0 || column < 0) return false;
    if (dataset.id !== state.dataset.id) chooseDataset(dataset.id);
    if (page.id !== state.page.id) choosePage(page.id);
    if (section.id !== state.section.id) chooseSection(section.id);
    if ($('propertyTable').dataset.imageStatus === 'error') return false;
    inspect(row, column, { pin, force: true }); return true;
  }, closeGuide, reload: load };
  load();
})();
