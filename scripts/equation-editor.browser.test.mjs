// Real composer and renderer with a local API stub; no model calls or student data.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const messages = [];
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://test');
  const json = (value) => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
  if (url.pathname === '/api/me') return json({ user: { id: 'test', name: 'Test Student' }, profile: { onboarded: true, default_style: 'office-hours' } });
  if (url.pathname === '/api/styles') return json([{ id: 'office-hours', name: 'Guided tutor', available: true, default: true }]);
  if (url.pathname === '/api/me/usage') return json({ percent: 0, state: 'normal' });
  if (url.pathname === '/api/conversations') return json(req.method === 'POST' ? { id: 'chat', title: 'Equation test' } : [{ id: 'chat', title: 'Equation test' }]);
  if (url.pathname === '/api/conversations/chat') return json({ id: 'chat', messages: messages.map((content) => ({ role: 'user', content })) });
  if (url.pathname === '/api/conversations/chat/messages') {
    let body = ''; for await (const chunk of req) body += chunk;
    messages.push(JSON.parse(body).content);
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    res.end('data: {"type":"delta","content":"Equation received."}\n\ndata: {"type":"done"}\n\n');
    return;
  }
  if (url.pathname.startsWith('/api/')) return json({});
  const file = path.resolve(root, 'public', '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(path.join(root, 'public') + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2' }[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const output = path.join(root, 'data', 'equation-ui');
fs.mkdirSync(output, { recursive: true });
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(origin);
  const toggle = page.locator('#equationToggle');
  const input = page.locator('#input');
  await input.fill('Check this: REPLACE please');
  await input.evaluate((el) => { el.focus(); el.setSelectionRange(12, 19); el.dispatchEvent(new Event('select')); });
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('#equationPanel input, #equationPanel textarea, #equationPreview, #equationInsert').count(), 0,
    'palette contains only categories and tiles, no search or second editing surface');
  await page.getByRole('button', { name: 'Work rate', exact: true }).click();
  assert.equal(await input.inputValue(), 'Check this: \\(\\dot{W} \\) please', 'tile directly replaces selected prose');
  assert.equal(await input.evaluate((el) => document.activeElement === el), true, 'insertion returns focus to chat');
  await page.getByRole('button', { name: 'Equals', exact: true }).click();
  await page.getByRole('button', { name: 'Mass flow rate', exact: true }).click();
  await input.pressSequentially('(h_1-h_2)');
  const expected = 'Check this: \\(\\dot{W} = \\dot{m} (h_1-h_2)\\) please';
  assert.equal(await input.inputValue(), expected, 'repeated tiles and typing extend one equation');
  assert.equal(messages.length, 0, 'symbol clicks never submit');
  await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true });
  await input.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await toggle.evaluate((el) => document.activeElement === el), true);
  await toggle.click();
  assert.equal(await input.inputValue(), expected, 'closing/reopening preserves normal draft');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.getByText('Equation received.', { exact: true }).waitFor();
  assert.equal(messages[0], expected, 'API receives complete math delimiters and unchanged prose');
  assert.equal(await page.locator('.msg.user .katex').count(), 1);
  await page.reload();
  await page.locator('.msg.user .katex').waitFor();
  console.log('ok  direct cursor insertion, single equation, draft persistence, no submit, payload and history');

  await toggle.click();
  await input.fill('');
  await page.getByRole('button', { name: 'Fraction', exact: true }).click();
  await input.pressSequentially('120');
  assert.equal(await input.inputValue(), '\\(\\frac{120}{b} \\)', 'fraction selects numerator, not the a in frac');
  await input.fill('\\[\\rho\\]');
  await input.evaluate((el) => { el.setSelectionRange(el.value.length, el.value.length); el.dispatchEvent(new Event('select')); });
  await page.getByRole('button', { name: 'Temperature', exact: true }).click();
  assert.equal(await input.inputValue(), '\\[\\rho T \\]', 'insertion after existing block math preserves command boundaries');
  await input.fill('\\(P = x\\)');
  await input.evaluate((el) => { el.setSelectionRange(6, 7); el.dispatchEvent(new Event('select')); });
  await page.getByRole('button', { name: 'Density', exact: true }).click();
  assert.equal(await input.inputValue(), '\\(P = \\rho \\)', 'replacement inside math does not nest delimiters');
  for (const category of ['Properties', 'More properties', 'Structure', 'States & cycles', 'Common']) {
    await page.getByRole('button', { name: category, exact: true }).click();
    assert.equal(await page.locator('#equationSymbols .katex-error').count(), 0);
  }
  await page.getByRole('button', { name: 'Common', exact: true }).press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  await page.evaluate(() => {
    const box = document.createElement('div');
    window.KelvinEquations.renderMessage(box, '<img src=x onerror=alert(1)> \\[P = 1\\] \\(\\href{javascript:alert(1)}{x}\\) \\(\\frac{\\)');
    if (box.querySelector('img, a')) throw new Error('Untrusted message created active content');
    if (!box.querySelector('.user-equation .katex')) throw new Error('Legacy block equation did not render');
    if (!box.textContent.includes('\\frac{')) throw new Error('Incomplete math must fall back to literal text');
  });
  console.log('ok  template selection, existing math edits, palettes, keyboard dismissal and safe fallback');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await input.fill('');
  await toggle.click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const panelRect = await page.locator('#equationPanel').boundingBox();
  const inputRect = await input.boundingBox();
  assert.ok(panelRect.y + panelRect.height <= inputRect.y, 'panel opens above message input');
  await page.getByRole('button', { name: 'Heat rate', exact: true }).click();
  assert.equal(await input.inputValue(), '\\(\\dot{Q} \\)');
  await page.screenshot({ path: path.join(output, 'mobile-dark.png'), fullPage: true });
  assert.equal(messages.length, 1, 'mobile insertion never submits');
  assert.deepEqual(errors, []);
  console.log('ok  mobile layout, palette above input, direct insertion and zero browser errors');

  const tipPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await tipPage.goto(origin);
  await tipPage.clock.install();
  await tipPage.locator('#input').fill('Can you explain entropy?');
  await tipPage.clock.runFor(2300);
  await tipPage.getByText('Type equations faster', { exact: true }).waitFor();
  await tipPage.screenshot({ path: path.join(output, 'equation-tip.png'), fullPage: true });
  await tipPage.locator('#featureTipTry').click();
  assert.equal(await tipPage.locator('#equationPanel').isVisible(), true, 'Try it opens editor');
  assert.equal(await tipPage.locator('#featureTip').isVisible(), false);
  assert.equal(await tipPage.evaluate(() => JSON.parse(localStorage.getItem('kelvin:feature-tips:v1:test')).seen.equation), true);
  await tipPage.close();

  const dismissPage = await browser.newPage();
  await dismissPage.goto(origin);
  await dismissPage.clock.install();
  await dismissPage.locator('#input').fill('x=3');
  await dismissPage.clock.runFor(2300);
  await dismissPage.locator('#featureTipDismiss').click();
  // Lift the daily throttle to verify the equation-specific dismissal survives reload.
  await dismissPage.evaluate(() => {
    const key = 'kelvin:feature-tips:v1:test', prefs = JSON.parse(localStorage.getItem(key));
    prefs.lastShown = 0; localStorage.setItem(key, JSON.stringify(prefs));
  });
  await dismissPage.reload();
  await dismissPage.locator('#input').fill('x=3');
  await dismissPage.clock.runFor(2300);
  assert.equal(await dismissPage.locator('#featureTip').isVisible(), false, 'dismissed equation tip stays dismissed');
  await dismissPage.close();
  console.log('ok  contextual equation tip, Try it action, short formulas and persistent dismissal');
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
