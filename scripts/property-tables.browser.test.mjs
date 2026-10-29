// Real property-table viewer and standalone tab against installed course scans and stubbed chat APIs.
// This test does not OCR, transcribe, infer, or regenerate any source-table number.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'data', 'property-table-ui');
fs.mkdirSync(output, { recursive: true });
const manifestPath = path.join(root, 'public', 'property-tables', 'manifest.json');
assert.ok(fs.existsSync(manifestPath), 'Install the course-table scans with scripts/import-property-tables.py before running this browser suite.');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let sentMessages = 0;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://test');
  const json = (value) => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
  if (url.pathname === '/api/me') return json({ user: { id: 'test', name: 'Table reviewer' }, profile: { onboarded: true, default_style: 'office-hours' } });
  if (url.pathname === '/api/styles') return json([{ id: 'office-hours', name: 'Guided tutor', available: true, default: true }]);
  if (url.pathname === '/api/me/usage') return json({ percent: 0, state: 'normal' });
  if (url.pathname === '/api/conversations') return json(req.method === 'POST' ? { id: 'chat', title: 'Property lookup' } : [{ id: 'chat', title: 'Property lookup' }]);
  if (url.pathname === '/api/conversations/chat') return json({ id: 'chat', messages: [{ role: 'assistant', content: 'Find the saturated-liquid and saturated-vapor enthalpies in the supplied reference table. Keep the state, phase, and units with each value.' }] });
  if (url.pathname.endsWith('/messages')) { sentMessages++; return json({}); }
  if (url.pathname.startsWith('/api/')) return json({});
  const file = path.resolve(root, 'public', '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(path.join(root, 'public') + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.png': 'image/png', '.pdf': 'application/pdf', '.woff2': 'font/woff2' }[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;

async function checkViewer(page) {
  await page.goto(origin + '/property-tables.html');
  await page.locator('#viewer').waitFor({ state: 'visible' });
  await page.locator('#propertyTable[data-image-status="loaded"]').waitFor();
  const grid = page.locator('#propertyTable');
  const cells = grid.locator('button.scan-cell');
  assert.ok(await cells.count() > 10, 'source scan has individual numeric targets');
  assert.equal(await grid.getAttribute('role'), 'grid');
  assert.equal(await grid.locator('button.scan-cell[tabindex="0"]').count(), 1, 'one entry point avoids hundreds of tab stops');
  assert.ok(await grid.getAttribute('data-page-id'));
  assert.ok(await grid.getAttribute('data-section-id'));
  assert.equal(await page.locator('#useInChat').isVisible(), false, 'standalone lookup cannot send to a nonexistent parent chat');
  const geometry = await grid.evaluate((el) => {
    const b = el.getBoundingClientRect(), cell = el.querySelector('button.scan-cell'), r = cell.getBoundingClientRect();
    return { grid: { x: b.x, y: b.y, w: b.width, h: b.height }, cell: { x: r.x, y: r.y, w: r.width, h: r.height },
      crop: ['cropX','cropY','cropWidth','cropHeight'].map((k) => Number(el.dataset[k])),
      source: ['x','y','width','height'].map((k) => Number(cell.dataset[k])) };
  });
  const [x, y, w, h] = geometry.crop, [cx, cy, cw, ch] = geometry.source;
  assert.ok([x,y,w,h,cx,cy,cw,ch].every(Number.isFinite) && w > 0 && h > 0, 'scan target coordinates are explicit source pixels');
  for (const [actual, expected, label] of [
    [geometry.cell.x, geometry.grid.x + (cx - x) / w * geometry.grid.w, 'horizontal position'],
    [geometry.cell.y, geometry.grid.y + (cy - y) / h * geometry.grid.h, 'vertical position'],
    [geometry.cell.w, cw / w * geometry.grid.w, 'width'],
    [geometry.cell.h, ch / h * geometry.grid.h, 'height'],
  ]) assert.ok(Math.abs(actual - expected) <= 2, `numeric target ${label} matches original scan crop`);
  const a = cells.first(), b = cells.nth(1);
  await a.hover();
  assert.equal(await page.locator('#cellValue').textContent(), 'Source value', 'untranscribed source cells never invent a numeric text value');
  assert.equal(await a.evaluate((el) => el.classList.contains('is-selected')), true);
  assert.equal(await page.locator('#rowBand').isVisible(), true);
  assert.equal(await page.locator('#columnBand').isVisible(), true);
  assert.ok((await page.locator('#cellProperty').textContent()).trim().length > 0);
  assert.ok((await page.locator('#cellSource').textContent()).trim().length > 0);
  assert.ok(await page.locator('#cellCrop image').getAttribute('href'));
  assert.equal(await page.locator('#cellCrop image').getAttribute('href'), await page.locator('.scan-image image').getAttribute('href'), 'magnifier reuses the exact original scan');
  assert.deepEqual((await page.locator('#cellCrop svg').getAttribute('viewBox')).split(/\s+/).map(Number), [cx, cy, cw, ch], 'magnifier clips exactly the selected source rectangle');
  for (const selector of ['#cellCrop svg', '#rowCrop svg']) {
    const clipped = await page.locator(selector).evaluate((svg) => {
      const image = svg.querySelector('image'), attr = image.getAttribute('clip-path') || image.parentElement.getAttribute('clip-path');
      const id = attr?.match(/url\(["']?#([^)'"\s]+)["']?\)/)?.[1];
      const clip = id && document.getElementById(id), rect = clip?.querySelector('rect');
      return rect ? { bounds: ['x', 'y', 'width', 'height'].map((key) => Number(rect.getAttribute(key))), viewBox: svg.getAttribute('viewBox').split(/\s+/).map(Number) } : null;
    });
    assert.ok(clipped, 'magnifier image has an explicit clipping rectangle, preventing SVG letterbox bleed');
    assert.deepEqual(clipped.bounds, clipped.viewBox, 'only the selected row/column crop can appear in the magnifier');
  }
  await a.click();
  const pinned = await page.locator('#cellContext').textContent();
  await b.hover();
  assert.equal(await page.locator('#cellContext').textContent(), pinned, 'hover cannot overwrite the pinned lookup');
  assert.match(await page.locator('#pinStatus').textContent(), /pinned/i);
  await page.locator('#clearPin').click();
  await a.focus();
  await a.press('ArrowRight');
  assert.equal(await grid.evaluate((el) => document.activeElement.dataset.column), '1');
  await page.keyboard.press('ArrowDown');
  assert.equal(await grid.evaluate((el) => document.activeElement.dataset.row), '1');
  await page.keyboard.press('Home');
  assert.equal(await grid.evaluate((el) => document.activeElement.dataset.column), '0');
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#pinStatus').textContent(), /pinned/i);
  await page.keyboard.press('Escape');
  assert.ok(!/pinned/i.test(await page.locator('#pinStatus').textContent()));
  await a.click();
  await page.screenshot({ path: path.join(output, 'desktop-cell.png'), fullPage: true });
  await grid.locator('button[data-row="27"][data-column="2"]').click();
  assert.equal(await page.locator('#cellValue').textContent(), '0.0010035');
  await page.locator('#cellCrop').screenshot({ path: path.join(output, 'verified-specific-volume-crop.png') });
  const beforeZoom = (await grid.boundingBox()).width;
  await page.locator('#tableZoom').selectOption('1.5');
  assert.ok(Math.abs((await grid.boundingBox()).width / beforeZoom - 1.5) < .02, 'zoom enlarges source pixels and overlay targets together');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.locator('#tableZoom').selectOption('1');
  console.log('ok  exact scan coordinates/crop, per-number pointer/focus, row/column context, pin stability and keyboard navigation');
}

async function checkVerifiedGuide(page) {
  const dataset = manifest.datasets.find((d) => d.id === 'saturation');
  const sourcePage = dataset.pages.find((p) => p.id === 'saturation-1');
  const section = sourcePage.sections.find((s) => s.id === 'd1-p1');
  const fixture = section.verifiedCells.find((cell) => cell.rowId === 'r28' && cell.columnKey === 'hf');
  assert.equal(fixture.value, '112.56', 'known manually reviewed fixture remains source-accurate');
  const row = section.rows.findIndex((r) => r.id === fixture.rowId), column = section.columns.findIndex((c) => c.key === fixture.columnKey);
  const target = page.locator(`#propertyTable button[data-row="${row}"][data-column="${column}"]`);
  await target.click();
  assert.equal(await page.locator('#cellValue').textContent(), '112.56');
  assert.equal(await page.locator('#cellUnit').textContent(), 'kJ/kg');
  assert.match(await page.locator('#cellProperty').textContent(), /saturated liquid/i);
  assert.match(await page.locator('#cellContext').textContent(), /300 K/);
  assert.match(await page.locator('#cellSource').textContent(), /SaturationTables\.pdf.*PDF page 1/);
  assert.equal(await target.getAttribute('data-verified'), 'true');
  await page.locator('#cellCrop').screenshot({ path: path.join(output, 'verified-enthalpy-crop.png') });
  assert.equal(await page.locator('#guidePointer').isVisible(), false, 'guide never starts automatically');
  await page.locator('#guideStart').click();
  assert.equal(await page.locator('#guidePrevious').isDisabled(), true);
  for (let step = 0; step < 4; step++) {
    assert.equal(await page.locator('#guidePointer').getAttribute('data-step'), String(step));
    assert.equal(await page.locator('#guideCount').textContent(), `${step + 1} / 4`);
    assert.equal(await page.locator('.guide-target').count(), 1);
    if (step < 3) await page.locator('#guideNext').click();
  }
  assert.equal(await page.locator('#guideNext').isDisabled(), true);
  assert.match(await page.locator('#guideInstruction').textContent(), /112\.56 kJ\/kg/);
  assert.equal(await target.evaluate((el) => el.classList.contains('guide-target')), true, 'last guide step targets the selected numerical intersection');
  const pointerAligned = () => {
    const pointer = document.querySelector('#guidePointer'), target = document.querySelector('.guide-target');
    if (!pointer || pointer.hidden || !target) return false;
    const rect = target.getBoundingClientRect();
    // Check the visible fingertip after SVG/CSS transforms, not just the marker box's offsets.
    const svg = pointer.querySelector('svg'), point = svg.createSVGPoint(); point.x = 20; point.y = 5;
    const tip = point.matrixTransform(svg.getScreenCTM());
    return Math.abs(tip.y - (rect.top + rect.height / 2)) < 4 && tip.x >= rect.left - 12 && tip.x <= rect.left + 12;
  };
  await page.waitForFunction(pointerAligned);
  await page.locator('#tableScroll').evaluate((el) => { el.scrollTop += 15; });
  await page.waitForFunction(pointerAligned);
  await page.setViewportSize({ width: 1380, height: 1000 });
  await page.waitForFunction(pointerAligned);
  await page.screenshot({ path: path.join(output, 'guided-verified-cell.png'), fullPage: true });
  await page.locator('#guidePrevious').click();
  assert.equal(await page.locator('#guidePointer').getAttribute('data-step'), '2');
  await page.locator('#guideReplay').click();
  assert.equal(await page.locator('#guidePointer').getAttribute('data-step'), '0');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('#guidePointer').evaluate((el) => getComputedStyle(el).transitionDuration), '0s');
  await page.screenshot({ path: path.join(output, 'reduced-motion-guide.png'), fullPage: true });
  const secondPage = dataset.pages[1].id;
  await page.locator('#tableSelect').selectOption(secondPage);
  await page.locator('#propertyTable[data-image-status="loaded"]').waitFor();
  assert.equal(await page.locator('#guidePointer').isVisible(), false, 'switching source page clears stale guide targets');
  assert.ok(!/pinned/i.test(await page.locator('#pinStatus').textContent()));
  assert.equal(await page.evaluate(() => KelvinPropertyTables.selectCell({ rowId: 'does-not-exist', columnKey: 'missing' })), false);
  assert.equal(await page.evaluate(() => KelvinPropertyTables.selectCell({ datasetId: 'does-not-exist', rowId: 'r1', columnKey: 'P' })), false);
  assert.equal(await page.locator('#tableSelect').inputValue(), secondPage, 'invalid target cannot silently switch to an unrelated table');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1500, height: 1000 });
  console.log('ok  verified value/units/phase, manual four-step guide, pointer scroll/resize, replay/reduced-motion and stale-state clearing');
}

async function checkMissingData() {
  const page = await browser.newPage();
  await page.route('**/property-tables/manifest.json', (route) => route.fulfill({ status: 404, body: 'Not installed' }));
  await page.goto(origin + '/property-tables.html');
  await page.locator('#loadStatus.error').waitFor();
  assert.equal(await page.locator('#viewer').isVisible(), false, 'missing course assets never show a fabricated table');
  assert.equal(await page.locator('button.scan-cell').count(), 0);
  assert.match(await page.locator('#loadStatus').textContent(), /install|unavailable|missing|load|reference/i);
  assert.equal(await page.locator('#retryLoad').isVisible(), true, 'missing-data state offers a retry');
  await page.screenshot({ path: path.join(output, 'missing-data.png'), fullPage: true });
  await page.close();
  console.log('ok  missing manifest explains unavailable source data without invented numbers');
}

async function checkLibrary(page) {
  let pages = 0;
  for (const dataset of manifest.datasets) {
    await page.locator('#datasetSelect').selectOption(dataset.id);
    assert.equal(await page.locator('#tableSelect option').count(), dataset.pages.length);
    for (const sourcePage of dataset.pages) {
      await page.locator('#tableSelect').selectOption(sourcePage.id);
      for (const section of sourcePage.sections) {
        if (sourcePage.sections.length > 1) await page.locator('#groupSelect').selectOption(section.id);
        await page.locator('#propertyTable[data-image-status="loaded"]').waitFor();
        assert.equal(await page.locator('#propertyTable button.scan-cell').count(), section.rows.length * section.columns.length);
        assert.equal(await page.locator('#propertyTable').getAttribute('data-section-id'), section.id);
        assert.equal(new URL(await page.locator('.scan-image image').getAttribute('href')).pathname, sourcePage.image);
      }
      pages++;
    }
  }
  assert.equal(pages, 20, 'all supplied saturation, compressed-liquid and superheated source pages are reachable');
  console.log('ok  all 20 source pages and every pressure/section group load with their own exact scans and cell overlays');
}

async function checkMissingImage() {
  const page = await browser.newPage();
  const dataset = manifest.datasets.find((d) => d.id === 'saturation'), sourcePage = dataset.pages[0];
  await page.route('**' + sourcePage.image, (route) => route.fulfill({ status: 404, body: 'Missing source page' }));
  await page.goto(origin + '/property-tables.html');
  await page.locator('#propertyTable[data-image-status="error"]').waitFor();
  assert.equal(await page.locator('button.scan-cell').count(), 0, 'no active targets float over a missing source page');
  assert.equal(await page.locator('#cellValue').textContent(), 'Unavailable');
  assert.equal(await page.locator('#cellCrop').isVisible(), false);
  assert.equal(await page.locator('#useInChat').isDisabled(), true);
  assert.equal(await page.evaluate(() => KelvinPropertyTables.getSelection()), null);
  await page.locator('#guideStart').click();
  assert.equal(await page.locator('#guidePointer').isVisible(), false, 'guide cannot point to a missing source cell');
  await page.screenshot({ path: path.join(output, 'missing-source-page.png'), fullPage: true });
  await page.locator('#tableSelect').selectOption(dataset.pages[1].id);
  await page.locator('#propertyTable[data-image-status="loaded"]').waitFor();
  await page.locator('button.scan-cell').first().click();
  assert.ok(await page.evaluate(() => KelvinPropertyTables.getSelection()), 'another installed page recovers normal selection');
  await page.close();
  console.log('ok  missing source image clears values/selection, disables guide/insertion and recovers on another page');
}

async function checkMobile() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(origin + '/#/c/chat');
  const draft = 'Check the source table before replying.';
  const input = page.locator('#input');
  await input.fill(draft);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile tutor has no document overflow');
  const clipped = await page.locator('.topbar-right button, .topbar-right a').evaluateAll((els) => els.filter((el) => {
    const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map((el) => el.id || el.textContent));
  assert.deepEqual(clipped, [], 'mobile topbar controls remain visible before opening tables');
  const chatUrl = page.url();
  const [tables] = await Promise.all([context.waitForEvent('page'), page.locator('#propertyTablesBtn').tap()]);
  await tables.locator('#viewer').waitFor({ state: 'visible' });
  await tables.locator('#propertyTable[data-image-status="loaded"]').waitFor();
  assert.equal(new URL(tables.url()).pathname, '/property-tables.html');
  assert.equal(await tables.evaluate(() => window.opener), null, 'standalone tab has no opener access');
  const cell = tables.locator('#propertyTable button.scan-cell').first();
  await cell.tap();
  assert.match(await tables.locator('#pinStatus').textContent(), /pinned/i, 'one touch pins a numeric crop without relying on hover');
  assert.equal(await tables.locator('#cellCrop').evaluate((el) => { const b = el.getBoundingClientRect(); return b.top >= 0 && b.bottom <= innerHeight; }), true, 'touch selection brings the magnified number into view');
  assert.equal(await tables.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'scan overflow is contained inside its scroller');
  await tables.locator('#backToCell').tap();
  assert.equal(await cell.evaluate((el) => el === document.activeElement), true, 'return from magnifier restores the selected cell focus');
  assert.match(await tables.locator('#pinStatus').textContent(), /pinned/i, 'return to source keeps the pinned selection');
  await cell.tap();
  assert.equal(await tables.locator('#useInChat').isVisible(), false, 'standalone tab has no embedded chat insertion control');
  await tables.screenshot({ path: path.join(output, 'mobile-property-tab.png'), fullPage: true });
  await tables.close();
  await page.bringToFront();
  assert.equal(page.url(), chatUrl, 'opening and closing the reference tab keeps the chat route');
  assert.equal(await input.inputValue(), draft, 'source selection in another tab preserves the original draft');
  assert.equal(sentMessages, 0);
  await input.focus();
  assert.equal(await input.evaluate((el) => el === document.activeElement), true);
  await page.screenshot({ path: path.join(output, 'mobile-return-to-chat.png'), fullPage: true });
  const [reopened] = await Promise.all([context.waitForEvent('page'), page.locator('#propertyTablesBtn').tap()]);
  await reopened.locator('#viewer').waitFor({ state: 'visible' });
  await reopened.close();
  assert.equal(await input.inputValue(), draft, 'reopening the standalone reference preserves the draft');
  await context.close();
  console.log('ok  mobile standalone tab, first-touch selection, contained scan scrolling and preserved chat route/draft');
}

async function checkStandaloneTab(page) {
  await page.goto(origin + '/#/c/chat');
  const input = page.locator('#input');
  await input.fill('Before SELECT after');
  await input.evaluate((el) => { el.focus(); el.setSelectionRange(7, 13); });
  const link = page.locator('#propertyTablesBtn');
  assert.equal(await link.evaluate((el) => el.tagName), 'A');
  assert.equal(await link.getAttribute('href'), '/property-tables.html');
  assert.equal(await link.getAttribute('target'), '_blank');
  assert.match(await link.getAttribute('rel'), /\bnoopener\b/);
  const chatUrl = page.url();
  const [tables] = await Promise.all([page.context().waitForEvent('page'), link.click()]);
  await tables.locator('#viewer').waitFor({ state: 'visible' });
  await tables.locator('#propertyTable[data-image-status="loaded"]').waitFor();
  assert.equal(new URL(tables.url()).pathname, '/property-tables.html');
  assert.equal(await tables.evaluate(() => window.opener), null);
  assert.equal(await page.locator('#propertyTableDock, #propertyTableFrame').count(), 0, 'chat has no table dock or embedded table frame');
  assert.equal(page.url(), chatUrl, 'reference navigation does not replace the original chat');
  assert.equal(await input.inputValue(), 'Before SELECT after', 'opening a reference tab preserves the draft');
  const draft = await input.inputValue();
  await page.evaluate(() => {
    const data = { type: 'kelvin:property-table-selection', text: 'UNTRUSTED' };
    dispatchEvent(new MessageEvent('message', { origin: 'https://untrusted.invalid', source: window, data }));
    dispatchEvent(new MessageEvent('message', { origin: location.origin, source: window, data }));
  });
  assert.equal(await input.inputValue(), draft, 'standalone reference messages cannot mutate the chat draft');
  await tables.locator('#propertyTable button[data-row="27"][data-column="6"]').click();
  assert.equal(await tables.locator('#cellValue').textContent(), '112.56');
  assert.equal(await tables.locator('#cellUnit').textContent(), 'kJ/kg');
  assert.equal(await tables.locator('#useInChat').isVisible(), false);
  assert.equal(await input.inputValue(), draft, 'reading a verified value in another tab does not change the draft');
  assert.equal(sentMessages, 0, 'opening and reading the reference never submits a chat message');
  await tables.screenshot({ path: path.join(output, 'standalone-property-tab.png'), fullPage: true });
  await tables.close();
  await page.bringToFront();
  assert.equal(page.url(), chatUrl);
  assert.equal(await input.inputValue(), draft);
  await input.focus();
  assert.equal(await input.evaluate((el) => el === document.activeElement), true, 'the preserved chat composer remains usable after returning');
  await page.screenshot({ path: path.join(output, 'chat-after-property-tab.png'), fullPage: true });
  console.log('ok  standalone property tab, verified source lookup, noopener, no embedded workspace, preserved draft/route and no automatic send');
}

try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await checkViewer(page);
  await checkVerifiedGuide(page);
  await checkLibrary(page);
  await checkStandaloneTab(page);
  await checkMobile();
  await checkMissingData();
  await checkMissingImage();
  assert.deepEqual(errors, []);
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
