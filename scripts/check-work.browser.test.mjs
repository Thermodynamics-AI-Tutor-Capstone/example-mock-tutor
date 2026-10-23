// Pre-save validation recovery in the real composer; local API fixture, no model calls.
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { startLayoutServer } from './layout-review-server.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const { server, origin, sent } = await startLayoutServer();
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  await page.goto(`${origin}/?layout=final#/c/layout-review`);
  await page.locator('.msg.assistant .md').waitFor();
  await page.locator('#checkWorkBtn').click();
  const original = 'Original solution: Q - W = delta U.';
  await page.locator('#input').fill(original);
  await page.evaluate(() => window.KelvinAttachments.setPending([{ id: 'old-work', name: 'solution.png', mime: 'image/png', kind: 'vision', status: 'confirmed', source: 'edited', uncertain: 1 }]));
  let requestReady;
  const ready = new Promise(resolve => { requestReady = resolve; });
  let pendingRoute;
  let rejectFirst = true;
  let savedError = false;
  await page.route('**/api/conversations/layout-review/messages', async route => {
    if (rejectFirst) { rejectFirst = false; pendingRoute = route; requestReady(); return; }
    if (savedError) {
      return route.fulfill({ status: 200, contentType: 'text/event-stream', body: 'data: {"type":"delta","content":"Saved partial reply."}\n\ndata: {"type":"error","message":"Some steps remain unclear.","code":"work_unreadable","messageId":99}\n\n' });
    }
    return route.continue();
  });
  await page.locator('#sendBtn').click();
  await ready;
  await page.locator('#input').fill('A new note typed while waiting.');
  await page.evaluate(() => window.KelvinAttachments.setPending([{ id: 'new-notes', name: 'notes.txt', mime: 'text/plain', kind: 'text', status: 'ready', source: 'extracted' }]));
  await pendingRoute.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ error: 'An upload has no readable working. Edit it before retrying.', code: 'work_unreadable' }) });
  await page.getByRole('button', { name: 'Send', exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelector('#checkWorkHint').textContent.includes('back in the composer'));
  assert.equal(await page.locator('#input').inputValue(), original + '\n\nA new note typed while waiting.');
  assert.deepEqual(await page.evaluate(() => window.KelvinAttachments.pendingIds()), ['old-work', 'new-notes']);
  assert.equal(await page.locator('#attTray .att-chip').count(), 2);
  assert.equal(await page.locator('.msg.user').count(), 1, 'unsaved optimistic user row removed');
  assert.equal(await page.locator('.msg.assistant').count(), 1, 'empty error assistant row removed');
  assert.equal(sent.length, 0, 'fixture did not save the rejected request');
  console.log('ok  pre-save422 restores original draft/files and merges concurrent draft/new upload without duplicate rows');

  await page.locator('#sendBtn').click();
  await page.getByText('Fixture received. No model was called.', { exact: true }).waitFor();
  assert.equal(sent.length, 1);
  assert.equal(sent[0].content, original + '\n\nA new note typed while waiting.');
  assert.deepEqual(sent[0].attachments, ['old-work', 'new-notes']);
  assert.equal(sent[0].checkWork, true);
  assert.equal(await page.locator('.msg.user').count(), 2);
  assert.equal(await page.locator('.msg.assistant').count(), 2);
  assert.equal(await page.locator('#attTray').isVisible(), false);
  console.log('ok  retry sends one complete restored request and clears only the successfully submitted tray');

  savedError = true;
  await page.locator('#input').fill('A saved follow-up solution.');
  await page.locator('#sendBtn').click();
  await page.getByText('Some steps remain unclear.', { exact: true }).waitFor();
  assert.equal(await page.locator('.msg.user').count(), 3);
  assert.equal(await page.locator('.msg.assistant').count(), 3);
  assert.equal(await page.locator('#input').inputValue(), '');
  assert.equal(await page.locator('.msg.assistant').last().getByText('Saved partial reply.', { exact: true }).count(), 1);
  console.log('ok  a server-saved streaming error keeps its saved message and does not restore it as unsent');
  assert.deepEqual(errors, []);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
