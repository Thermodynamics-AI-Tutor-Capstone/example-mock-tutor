// Optional real-browser checks. Install playwright locally, or set PLAYWRIGHT_MODULE to its
// index.mjs file. Uses a controllable browser speech stub: no credentials or paid API.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lessonInput } from './fixtures/narrated-lesson.mjs';
import { validateLesson } from '../lib/whiteboard.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const saved = validateLesson(lessonInput);
const board = { ...saved.board, lesson: { id: '11111111-1111-4111-8111-111111111111', segments: saved.segments } };
const content = '```kelvin-board\n' + JSON.stringify(board) + '\n```\n\nWhich words justify steady state?';
let audioRequests = 0, postedMessage = '', pendingStream;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://test');
  const json = (value, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
  if (url.pathname === '/api/me') return json({ user: { id: 'test', name: 'Test Student' }, profile: { onboarded: true, default_style: 'office-hours' } });
  if (url.pathname === '/api/styles') return json([{ id: 'office-hours', name: 'Coach', available: true, default: true }]);
  if (url.pathname === '/api/conversations') return json([{ id: 'chat', title: 'Turbine explanation', style: 'office-hours' }]);
  if (url.pathname === '/api/conversations/chat') return json({ id: 'chat', title: 'Turbine explanation', style: 'office-hours', messages: [{ role: 'assistant', content }] });
  if (url.pathname === '/api/conversations/chat/messages') {
    let body = ''; for await (const chunk of req) body += chunk;
    postedMessage = JSON.parse(body).content;
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    res.write('data: ' + JSON.stringify({ type: 'delta', content: '```kelvin-board\n' + JSON.stringify(board) + '\n```\n\n' }) + '\n\n');
    pendingStream = () => { res.end('data: ' + JSON.stringify({ type: 'delta', content: 'Which words justify steady state?' }) + '\n\ndata: {"type":"done"}\n\n'); };
    return;
  }
  if (url.pathname.startsWith('/api/whiteboard/')) { audioRequests++; return json({ error: 'Speech API must not be used' }, 500); }
  if (url.pathname.startsWith('/api/')) return json({});
  const file = path.resolve(root, 'public', '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(path.join(root, 'public') + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2' };
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1050 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    let active = null;
    const history = [];
    const local = { voiceURI: 'local-en', name: 'Local English', lang: 'en-US', localService: true };
    const remote = { voiceURI: 'remote-en', name: 'Browser English', lang: 'en-US', localService: false };
    const synth = new EventTarget();
    synth.getVoices = () => window.testSpeech.delayedVoices ? [] : [remote, local];
    synth.speak = (utterance) => { active = utterance; history.push(utterance); if (!window.testSpeech.holdStart) setTimeout(() => { if (active === utterance) utterance.onstart?.(); }, 0); };
    synth.cancel = () => { const old = active; active = null; setTimeout(() => old?.onerror?.({ error: 'canceled' }), 0); };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: class { constructor(text) { this.text = text; } } });
    window.testSpeech = { history, delayedVoices: false, holdStart: false,
      finish() { const old = active; active = null; old?.onend?.(); },
      fail() { active?.onerror?.({ error: 'synthesis-failed' }); },
      get active() { return active; },
      voicesChanged() { synth.dispatchEvent(new Event('voiceschanged')); },
    };
  });
  await page.goto(origin + '/#/c/chat');
  await page.getByRole('button', { name: 'Play narration', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => testSpeech.history.length), 0, 'no autoplay from history');
  assert.equal(await page.getByLabel('Narration voice').inputValue(), 'local-en', 'prefer local English voice');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  assert.equal(await page.locator('[data-board-target="node:turbine"]').evaluate((el) => el.style.opacity), '1');
  assert.equal(await page.locator('[data-board-target="node:inlet"]').evaluate((el) => el.style.opacity), '0');
  await page.getByText('Read full transcript', { exact: true }).click();
  assert.equal(await page.locator('.knarration-transcript li').count(), 3);
  console.log('ok  no autoplay, local voice preferred, manual reveal, transcript');

  await page.reload();
  await page.getByRole('button', { name: 'Play narration', exact: true }).waitFor();
  await page.evaluate(() => { testSpeech.delayedVoices = true; testSpeech.voicesChanged(); testSpeech.holdStart = true; });
  assert.equal(await page.getByLabel('Narration voice').locator('option').count(), 1);
  await page.evaluate(() => { testSpeech.delayedVoices = false; testSpeech.voicesChanged(); });
  assert.equal(await page.getByLabel('Narration voice').inputValue(), 'local-en');
  await page.getByRole('button', { name: 'Play narration', exact: true }).click();
  assert.equal(await page.locator('[data-board-target="node:turbine"]').evaluate((el) => el.style.opacity), '0', 'do not draw before speech starts');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.evaluate(() => { testSpeech.history[0].onstart(); testSpeech.holdStart = false; });
  assert.equal(await page.locator('.kboard-marker').evaluate((el) => el.hidden), true, 'ignore canceled start event');
  await page.reload();
  await page.getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.getByText('Step 1 of 3 · Listening', { exact: true }).waitFor();
  await page.waitForFunction(() => !document.querySelector('.kboard-marker').hidden);
  const output = path.join(root, 'data', 'narration-ui');
  fs.mkdirSync(output, { recursive: true });
  await page.screenshot({ path: path.join(output, 'marker-drawing.png'), fullPage: true });
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const pausedDrawing = await page.locator('.kboard-marker-outline').nth(1).evaluate((el) => el.style.strokeDashoffset);
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.kboard-marker-outline').nth(1).evaluate((el) => el.style.strokeDashoffset), pausedDrawing);
  assert.equal(await page.evaluate(() => testSpeech.active), null);
  await page.getByRole('button', { name: 'Resume phrase', exact: true }).click();
  await page.getByText('Step 1 of 3 · Listening', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => testSpeech.history[0].text === testSpeech.history[1].text), true);
  await page.getByLabel('Narration speed').selectOption('2');
  await page.waitForFunction(() => testSpeech.active?.rate === 2);
  // Force a stale callback after changing speed: it must not advance the replacement phrase.
  await page.evaluate(() => testSpeech.history[0].onend());
  assert.equal(await page.evaluate(() => testSpeech.active.rate), 2);
  await page.getByLabel('Narration voice').selectOption('remote-en');
  await page.waitForFunction(() => testSpeech.active?.voice.voiceURI === 'remote-en');
  for (let i = 0; i < 30; i++) {
    if (await page.getByText('Explanation complete. Replay a step or continue the conversation.', { exact: true }).isVisible()) break;
    await page.evaluate(() => testSpeech.finish());
  }
  await page.getByText('Explanation complete. Replay a step or continue the conversation.', { exact: true }).waitFor();
  assert.equal(await page.locator('[data-board-target]').evaluateAll((els) => els.every((el) => el.style.opacity === '1')), true);
  assert.equal(await page.locator('[data-board-target="step:0"]').evaluate((el) => getComputedStyle(el).color) === await page.locator('[data-board-target="step:1"]').evaluate((el) => getComputedStyle(el).color), false);
  await page.screenshot({ path: path.join(output, 'desktop-complete.png'), fullPage: true });
  await page.getByRole('button', { name: 'Replay step', exact: true }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).waitFor();
  await page.evaluate(() => testSpeech.fail());
  await page.getByText('This browser voice could not speak. Choose another voice and press Play, or use Next step to read.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.getByRole('button', { name: 'New chat', exact: true }).click();
  await page.waitForFunction(() => testSpeech.active === null);
  console.log('ok  marker drawing, pause, phrase resume, speed, voice, stale callbacks, completion, errors, navigation');

  await page.goto(origin + '/#/c/chat');
  await page.getByRole('button', { name: 'Explain on whiteboard', exact: true }).click();
  await page.locator('#input').fill('Explain a turbine');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.locator('.knarration').nth(1).waitFor();
  assert.match(postedMessage, /narrated whiteboard/);
  await page.locator('.knarration').nth(1).getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.locator('.knarration').nth(1).getByRole('button', { name: 'Pause', exact: true }).waitFor();
  const count = await page.evaluate(() => testSpeech.history.length);
  pendingStream();
  await page.getByRole('button', { name: 'Send', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => testSpeech.history.length), count, 'streaming must preserve player');
  assert.equal(await page.evaluate(() => Boolean(testSpeech.active)), true);
  await page.locator('.knarration').nth(0).getByRole('button', { name: 'Play narration', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Pause', exact: true }).count(), 1);
  await page.locator('.knarration').nth(1).getByRole('button', { name: 'Next step', exact: true }).click();
  assert.equal(await page.evaluate(() => Boolean(testSpeech.active)), true, 'inactive player must not cancel active speech');
  console.log('ok  composer, streaming reuse, one active voice, independent manual controls');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.reload();
  await page.getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.getByText('Step 1 of 3 · Listening', { exact: true }).waitFor();
  assert.equal(await page.locator('.kboard-marker').evaluate((el) => el.hidden), true);
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.screenshot({ path: path.join(output, 'mobile-dark.png'), fullPage: true });
  const unsupported = await browser.newPage();
  await unsupported.addInitScript(() => Object.defineProperty(window, 'speechSynthesis', { value: undefined }));
  await unsupported.goto(origin + '/#/c/chat');
  await unsupported.getByText('Speech is unavailable in this browser. Use Next step and the captions.', { exact: true }).waitFor();
  assert.equal(await unsupported.getByRole('button', { name: 'Play narration', exact: true }).isDisabled(), true);
  await unsupported.getByRole('button', { name: 'Next step', exact: true }).click();
  assert.equal(await unsupported.getByRole('button', { name: 'Replay step', exact: true }).isDisabled(), true);
  assert.equal(audioRequests, 0, 'no speech capability or paid audio requests');
  assert.deepEqual(errors, []);
  console.log('ok  mobile, dark mode, reduced motion, unsupported browser, zero speech API requests');

} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
