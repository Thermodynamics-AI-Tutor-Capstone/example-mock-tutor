// Optional full-app offline browser checks. Set PLAYWRIGHT_MODULE to index.mjs and
// CHROME_EXECUTABLE when Playwright or its browser is not installed locally.
// All APIs and microphone capture are mocked; no credentials or paid calls.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'data', 'voice-ui');
fs.mkdirSync(output, { recursive: true });
let available = true, requests = 0, sent = 0, responseMode = 'ok', pending;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://test');
  const json = (body, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (url.pathname === '/api/me') return json({ user: { id: 'voice-test', name: 'Test Student' }, profile: { onboarded: true, default_style: 'office-hours' } });
  if (url.pathname === '/api/styles') return json([{ id: 'office-hours', name: 'Coach', available: true, default: true }]);
  if (url.pathname === '/api/conversations') return json([{ id: 'chat', title: 'Energy balance', style: 'office-hours' }]);
  if (url.pathname === '/api/conversations/chat') return json({ id: 'chat', title: 'Energy balance', style: 'office-hours', messages: [{ role: 'assistant', content: 'Tell me how you approached the energy balance.' }] });
  if (url.pathname.endsWith('/messages')) { sent++; return json({}); }
  if (url.pathname === '/api/dictation' && req.method === 'GET') return json({ available, model: 'gpt-4o-mini-transcribe', maxSeconds: 120, maxBytes: 3 * 1024 * 1024 });
  if (url.pathname === '/api/dictation') {
    requests++;
    const chunks = []; for await (const chunk of req) chunks.push(chunk);
    assert.ok(Buffer.concat(chunks).length, 'audio request has content');
    assert.match(req.headers['content-type'], /^audio\//);
    if (responseMode === 'hold') { pending = () => json({ text: 'stale transcript' }); return; }
    if (responseMode === 'error') return json({ error: 'Transcription is temporarily unavailable.' }, 503);
    if (responseMode === 'empty') return json({ text: '' });
    return json({ text: 'I assumed steady flow at 300 kilopascals.' });
  }
  if (url.pathname.startsWith('/api/')) return json({});
  const file = path.resolve(root, 'public', '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(path.join(root, 'public') + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2' })[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  async function newPage({ unsupported = false, preferences = null, mobile = false } = {}) {
    const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 950 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    await page.addInitScript(({ unsupported, preferences }) => {
      if (preferences && !sessionStorage.getItem('tips-seeded')) {
        localStorage.setItem('kelvin:feature-tips:v1:voice-test', JSON.stringify(preferences));
        sessionStorage.setItem('tips-seeded', 'yes');
      }
      const test = window.testMic = { mode: 'ok', tracks: [], recorders: [], requests: 0 };
      const acquire = () => { const track = { stopped: false, stop() { this.stopped = true; } }; test.tracks.push(track); return { getTracks: () => [track] }; };
      Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: unsupported ? undefined : { getUserMedia() {
        test.requests++;
        if (test.mode === 'denied') return Promise.reject(new DOMException('Denied', 'NotAllowedError'));
        if (test.mode === 'hold') return new Promise(resolve => { test.resolvePermission = () => resolve(acquire()); });
        return Promise.resolve(acquire());
      } } });
      window.MediaRecorder = class {
        static isTypeSupported(type) { return type.startsWith('audio/webm'); }
        constructor(stream, options) { this.state = 'inactive'; this.mimeType = options.mimeType; test.recorders.push(this); }
        start() { this.state = 'recording'; }
        stop() { if (this.state !== 'recording') return; this.state = 'inactive'; const emit = () => {
          this.ondataavailable?.({ data: new Blob(['offline mock audio'], { type: this.mimeType }) }); this.onstop?.();
        }; if (test.holdStop) test.finishStop = emit; else queueMicrotask(emit); }
      };
    }, { unsupported, preferences });
    await page.goto(origin + '/#/c/chat');
    await page.locator('#input').waitFor();
    await page.waitForFunction(() => window.KelvinVoice && window.KelvinTips);
    if (!unsupported && available) await page.waitForFunction(() => !document.querySelector('#micBtn').disabled);
    return page;
  }
  const page = await newPage();
  await page.locator('#input').fill('My initial draft.');
  await page.locator('#micBtn').click();
  await page.waitForFunction(() => document.querySelector('#micBtn').getAttribute('aria-pressed') === 'true');
  assert.equal(await page.locator('#sendBtn').isDisabled(), true, 'no send while recording');
  await page.locator('#input').fill('My initial draft. Extra detail.');
  await page.screenshot({ path: path.join(output, 'desktop-recording.png'), fullPage: true });
  await page.locator('#micBtn').click();
  await page.waitForFunction(() => document.querySelector('#input').value.includes('300 kilopascals'));
  assert.equal(await page.locator('#input').inputValue(), 'My initial draft. Extra detail. I assumed steady flow at 300 kilopascals.');
  assert.match(await page.locator('#voiceMessage').textContent(), /review|check/i);
  assert.equal(sent, 0, 'transcript never auto-sends');
  assert.equal(await page.evaluate(() => testMic.tracks.every(track => track.stopped)), true);
  console.log('ok  preserve typed draft, append editable transcript, review prompt, stop tracks, no auto-send');

  await page.evaluate(() => { testMic.holdStop = true; });
  const recordersBefore = await page.evaluate(() => testMic.recorders.length);
  await page.locator('#micBtn').click();
  await page.evaluate(() => { document.querySelector('#micBtn').click(); document.querySelector('#micBtn').click(); });
  assert.equal(await page.locator('#micBtn').isDisabled(), true, 'stop is disabled until recorder completes');
  assert.equal(await page.evaluate(() => testMic.recorders.length), recordersBefore + 1, 'double stop cannot start a second recording');
  await page.evaluate(() => { testMic.holdStop = false; testMic.finishStop(); });
  await page.waitForFunction(() => !KelvinVoice.active());
  await page.locator('#micBtn').click();
  await page.evaluate(() => testMic.recorders.at(-1).onerror());
  await page.waitForFunction(() => document.querySelector('#voiceMessage').textContent.includes('Recording failed'));
  assert.equal(await page.evaluate(() => testMic.tracks.every(track => track.stopped)), true);
  console.log('ok  delayed recorder stop, double stop, recorder errors');

  const beforeCancel = requests;
  await page.evaluate(() => { testMic.mode = 'hold'; });
  await page.locator('#micBtn').click();
  await page.locator('#voiceCancel').click();
  await page.evaluate(() => testMic.resolvePermission());
  await page.waitForFunction(() => testMic.tracks.every(track => track.stopped));
  assert.equal(requests, beforeCancel, 'cancel permission before audio upload');
  assert.equal(await page.evaluate(() => KelvinVoice.active()), false);
  await page.evaluate(() => { testMic.mode = 'denied'; });
  await page.locator('#micBtn').click();
  await page.waitForFunction(() => document.querySelector('#voiceMessage').textContent.includes('denied'));
  assert.match(await page.locator('#input').inputValue(), /Extra detail/);
  await page.evaluate(() => { testMic.mode = 'ok'; });
  for (const mode of ['error', 'empty']) {
    responseMode = mode;
    await page.locator('#micBtn').click(); await page.locator('#micBtn').click();
    await page.waitForFunction(() => !KelvinVoice.active());
    assert.match(await page.locator('#voiceMessage').textContent(), mode === 'error' ? /unavailable/ : /No speech/);
  }
  console.log('ok  permission cancellation/denial, server errors, empty transcript preserve draft');

  responseMode = 'hold';
  await page.locator('#micBtn').click(); await page.locator('#micBtn').click();
  while (!pending) await new Promise(resolve => setTimeout(resolve, 10));
  await page.locator('#input').fill('Edited while transcription was pending.');
  pending(); pending = null;
  await page.waitForFunction(() => !KelvinVoice.active());
  assert.equal(await page.locator('#input').inputValue(), 'Edited while transcription was pending. stale transcript', 'append to latest draft after request');
  const draft = await page.locator('#input').inputValue();
  await page.locator('#micBtn').click(); await page.locator('#micBtn').click();
  await page.waitForFunction(() => document.querySelector('#voiceMessage').textContent.includes('Turning'));
  while (!pending) await new Promise(resolve => setTimeout(resolve, 10));
  await page.locator('#voiceCancel').click(); pending(); pending = null;
  await page.waitForTimeout(100);
  assert.equal(await page.locator('#input').inputValue(), draft, 'cancel ignores stale transcript');
  await page.locator('#micBtn').click(); await page.locator('#micBtn').click();
  while (!pending) await new Promise(resolve => setTimeout(resolve, 10));
  await page.locator('#newChatBtn').click(); pending(); pending = null;
  await page.waitForTimeout(100);
  assert.equal(await page.locator('#input').inputValue(), draft, 'navigation ignores stale transcript');
  assert.equal(await page.evaluate(() => KelvinVoice.active()), false);
  responseMode = 'ok';
  console.log('ok  cancel and navigation suppress late transcription');


  const holdPage = await newPage();
  await holdPage.locator('#input').fill('Steady-flow energy balance.');
  await holdPage.keyboard.down('Control'); await holdPage.keyboard.down('Shift'); await holdPage.keyboard.down('Space');
  await holdPage.waitForFunction(() => document.querySelector('#micBtn').getAttribute('aria-pressed') === 'true');
  assert.equal(await holdPage.locator('#voiceStop').isVisible(), true);
  await holdPage.waitForFunction(() => document.querySelector('#voiceClock').textContent.startsWith('0:01'));
  await holdPage.keyboard.up('Space'); await holdPage.keyboard.up('Shift'); await holdPage.keyboard.up('Control');
  await holdPage.waitForFunction(() => !KelvinVoice.active());
  assert.equal(await holdPage.locator('#input').inputValue(), 'Steady-flow energy balance. I assumed steady flow at 300 kilopascals.');
  const holdRequests = requests;
  await holdPage.evaluate(() => { testMic.mode = 'hold'; });
  await holdPage.keyboard.down('Control'); await holdPage.keyboard.down('Shift'); await holdPage.keyboard.down('Space');
  await holdPage.waitForFunction(() => Boolean(testMic.resolvePermission));
  await holdPage.keyboard.up('Space'); await holdPage.keyboard.up('Shift'); await holdPage.keyboard.up('Control');
  await holdPage.evaluate(() => testMic.resolvePermission());
  await holdPage.waitForFunction(() => testMic.tracks.every(track => track.stopped));
  assert.equal(requests, holdRequests, 'releasing before permission cancels without uploading');
  assert.equal(await holdPage.evaluate(() => KelvinVoice.active()), false);
  await holdPage.evaluate(() => { testMic.mode = 'ok'; });
  await holdPage.locator('#micBtn').click();
  await holdPage.keyboard.press('Escape');
  assert.equal(await holdPage.evaluate(() => KelvinVoice.active()), false);
  assert.equal(requests, holdRequests, 'Escape discards without uploading');
  await holdPage.locator('#micBtn').click();
  await holdPage.locator('#voiceStop').click();
  await holdPage.waitForFunction(() => !KelvinVoice.active());
  assert.equal(requests, holdRequests + 1, 'explicit Stop transcribes');
  await holdPage.locator('#input').focus();
  await holdPage.keyboard.down('Control'); await holdPage.keyboard.down('Shift'); await holdPage.keyboard.down('Space');
  await holdPage.waitForFunction(() => document.querySelector('#micBtn').getAttribute('aria-pressed') === 'true');
  await holdPage.evaluate(() => window.dispatchEvent(new Event('blur')));
  await holdPage.keyboard.up('Space'); await holdPage.keyboard.up('Shift'); await holdPage.keyboard.up('Control');
  assert.equal(await holdPage.evaluate(() => KelvinVoice.active()), false);
  assert.equal(requests, holdRequests + 1, 'losing focus during a hold discards audio');
  assert.equal(await holdPage.evaluate(() => testMic.tracks.every(track => track.stopped)), true);
  console.log('ok  hold-to-dictate shortcut, elapsed timer, early release, Escape, explicit Stop, blur cancel');

  const tipPage = await newPage();
  await tipPage.locator('#input').fill('I used the energy balance equation');
  await tipPage.locator('#featureTip').waitFor({ state: 'visible' });
  assert.equal(await tipPage.evaluate(() => document.activeElement.id), 'input', 'tip does not steal focus');
  await tipPage.screenshot({ path: path.join(output, 'desktop-tip.png'), fullPage: true });
  await tipPage.locator('#featureTipTry').click();
  await tipPage.waitForFunction(() => KelvinVoice.active());
  assert.equal(await tipPage.locator('#featureTip').isVisible(), false);
  await tipPage.locator('#voiceCancel').click();
  await tipPage.reload();
  await tipPage.locator('#input').fill('Check my solution please');
  await tipPage.waitForTimeout(2400);
  assert.equal(await tipPage.locator('#featureTip').isVisible(), false, 'daily cooldown survives reload');
  const dismissPage = await newPage();
  await dismissPage.locator('#input').fill('Check my calculations please');
  await dismissPage.locator('#featureTip').waitFor({ state: 'visible' });
  await dismissPage.locator('#featureTipDismiss').click();
  assert.equal(await dismissPage.locator('#featureTip').isVisible(), false);
  await dismissPage.locator('#input').fill('I used another equation now');
  await dismissPage.waitForTimeout(2400);
  assert.equal(await dismissPage.locator('#featureTip').isVisible(), false, 'at most one tip per visit');
  const escapePage = await newPage();
  await escapePage.locator('#input').fill('I used the energy balance equation');
  await escapePage.locator('#featureTip').waitFor({ state: 'visible' });
  await escapePage.locator('#featureTipTry').focus();
  await escapePage.keyboard.press('Escape');
  assert.equal(await escapePage.locator('#featureTip').isVisible(), false);
  assert.equal(await escapePage.evaluate(() => document.activeElement.id), 'input');
  const disablePage = await newPage();
  await disablePage.locator('#input').fill('I used the energy balance equation');
  await disablePage.locator('#featureTip').waitFor({ state: 'visible' });
  await disablePage.locator('#featureTipDisable').click();
  await disablePage.evaluate(() => { const key = 'kelvin:feature-tips:v1:voice-test'; const prefs = JSON.parse(localStorage.getItem(key)); prefs.lastShown = 0; prefs.seen = {}; localStorage.setItem(key, JSON.stringify(prefs)); });
  await disablePage.reload();
  await disablePage.locator('#input').fill('Check my solution please');
  await disablePage.waitForTimeout(2400);
  assert.equal(await disablePage.locator('#featureTip').isVisible(), false, 'disable persists beyond cooldown');
  console.log('ok  contextual tip action, focus, dismissal, persisted opt-out, daily cooldown');

  const unsupported = await newPage({ unsupported: true });
  assert.equal(await unsupported.locator('#micBtn').isDisabled(), true);
  await unsupported.locator('#input').fill('I used the energy balance equation');
  await unsupported.waitForTimeout(2400);
  assert.equal(await unsupported.locator('#featureTip').isVisible(), false, 'never promote unavailable microphone');
  available = false;
  const unconfigured = await newPage();
  await unconfigured.waitForFunction(() => document.querySelector('#micBtn').title.includes('not configured'));
  assert.equal(await unconfigured.locator('#micBtn').isDisabled(), true);
  available = true;
  const mobile = await newPage({ mobile: true });
  await mobile.locator('#input').fill('I used the energy balance equation');
  await mobile.locator('#featureTip').waitFor({ state: 'visible' });
  await mobile.screenshot({ path: path.join(output, 'mobile-tip.png'), fullPage: true });
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile has no horizontal overflow');
  await mobile.locator('#featureTipTry').click();
  await mobile.waitForFunction(() => document.querySelector('#micBtn').getAttribute('aria-pressed') === 'true');
  await mobile.screenshot({ path: path.join(output, 'mobile-recording.png'), fullPage: true });
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.locator('#voiceCancel').click();
  assert.equal(sent, 0);
  assert.deepEqual(errors, []);
  console.log('ok  unavailable browser/server microphone, mobile tip/recording layout, no browser errors');
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}

