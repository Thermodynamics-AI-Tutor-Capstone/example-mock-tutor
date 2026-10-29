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
const illustratedInput = structuredClone(lessonInput);
Object.assign(illustratedInput.board.nodes[1], { illustration: 'turbine', surroundings: 'air', boundary: 'control-volume' });
const saved = validateLesson(illustratedInput);
const board = { ...saved.board, lesson: { id: '11111111-1111-4111-8111-111111111111', segments: saved.segments } };
const content = '```kelvin-board\n' + JSON.stringify(board) + '\n```\n\nWhich words justify steady state?';
let audioRequests = 0, postedMessage = '', postedWhiteboard = null, pendingStream;
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://test');
  const json = (value, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
  if (url.pathname === '/api/me') return json({ user: { id: 'test', name: 'Test Student' }, profile: { onboarded: true, default_style: 'office-hours' } });
  if (url.pathname === '/api/styles') return json([{ id: 'office-hours', name: 'Guided tutor', available: true, default: true }]);
  if (url.pathname === '/api/me/usage') return json({ percent: 0, state: 'normal' });
  if (url.pathname === '/api/conversations') return json([{ id: 'chat', title: 'Turbine explanation', style: 'office-hours' }]);
  if (url.pathname === '/api/conversations/chat') return json({ id: 'chat', title: 'Turbine explanation', style: 'office-hours', messages: [{ role: 'assistant', content }] });
  if (url.pathname === '/api/conversations/chat/messages') {
    let body = ''; for await (const chunk of req) body += chunk;
    postedMessage = JSON.parse(body).content;
    postedWhiteboard = JSON.parse(body).whiteboard;
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    if (!postedWhiteboard) {
      res.end('data: {"type":"delta","content":"Continue with the energy balance in chat."}\n\ndata: {"type":"done"}\n\n');
      return;
    }
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
    const mark = { voiceURI: 'mark-en', name: 'Microsoft Mark - English (United States)', lang: 'en-US', localService: true };
    const markOther = { voiceURI: 'mark-de', name: 'Mark German', lang: 'de-DE', localService: true };
    const nearMatch = { voiceURI: 'remark-en', name: 'Remark Voice', lang: 'en-US', localService: false };
    const synth = new EventTarget();
    synth.getVoices = () => window.testSpeech.delayedVoices ? [] : window.testSpeech.voices;
    synth.speak = (utterance) => { active = utterance; history.push(utterance); if (!window.testSpeech.holdStart) setTimeout(() => { if (active === utterance) utterance.onstart?.(); }, 0); };
    synth.cancel = () => { const old = active; active = null; setTimeout(() => old?.onerror?.({ error: 'canceled' }), 0); };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: class { constructor(text) { this.text = text; } } });
    window.testSpeech = { history, delayedVoices: false, holdStart: false, mark, markOther,
      voices: new URLSearchParams(location.search).get('voices') === 'mark' ? [markOther, remote, local, mark] : [nearMatch, remote, local],
      boundary(charIndex, name = 'word') { active?.onboundary?.({ charIndex, name }); },
      start() { active?.onstart?.(); },
      finish() { const old = active; active = null; old?.onend?.(); },
      fail() { active?.onerror?.({ error: 'synthesis-failed' }); },
      get active() { return active; },
      voicesChanged() { synth.dispatchEvent(new Event('voiceschanged')); },
    };
  });
  await page.goto(origin + '/#/c/chat');
  assert.equal(await page.locator('#stylePicker').isVisible(), false, 'single tutor has no style picker');
  await page.getByRole('button', { name: 'Play narration', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => testSpeech.history.length), 0, 'no autoplay from history');
  assert.equal(await page.getByLabel('Narration voice').inputValue(), 'local-en', 'prefer local English voice');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  assert.equal(await page.locator('[data-board-target="node:turbine"]').evaluate((el) => el.style.opacity), '1');
  assert.equal(await page.locator('[data-board-target="node:inlet"]').evaluate((el) => el.style.opacity), '0');
  await page.getByText('Read full transcript', { exact: true }).click();
  assert.equal(await page.locator('.knarration-transcript li').count(), 3);
  console.log('ok  no autoplay, local voice preferred, manual reveal, transcript');

  await page.evaluate(() => { testSpeech.voices.push(testSpeech.markOther, testSpeech.mark); testSpeech.voicesChanged(); });
  assert.equal(await page.getByLabel('Narration voice').inputValue(), 'mark-en', 'English Mark arriving late replaces an automatic fallback');
  await page.getByText('Voice & speed', { exact: true }).click();
  await page.getByLabel('Narration voice').selectOption('remote-en');
  await page.evaluate(() => testSpeech.voicesChanged());
  assert.equal(await page.getByLabel('Narration voice').inputValue(), 'remote-en', 'explicit non-Mark choice survives voiceschanged');
  await page.evaluate(() => { testSpeech.delayedVoices = true; testSpeech.voicesChanged(); });
  assert.equal(await page.getByLabel('Narration voice').inputValue(), '', 'temporarily unavailable choice uses device default');
  await page.evaluate(() => { testSpeech.delayedVoices = false; testSpeech.voicesChanged(); });
  assert.equal(await page.getByLabel('Narration voice').inputValue(), 'remote-en', 'explicit voice is restored after the list returns');
  await page.evaluate(() => { testSpeech.voices = testSpeech.voices.filter(v => !/^mark-/.test(v.voiceURI)); testSpeech.voicesChanged(); });
  await page.getByLabel('Narration voice').selectOption('');
  await page.evaluate(() => { testSpeech.voices.push(testSpeech.mark); testSpeech.voicesChanged(); });
  assert.equal(await page.getByLabel('Narration voice').inputValue(), '', 'explicit Device default is not replaced by late Mark');
  await page.goto(origin + '/?voices=mark#/c/chat');
  await page.getByRole('button', { name: 'Play narration', exact: true }).waitFor();
  assert.equal(await page.getByLabel('Narration voice').inputValue(), 'mark-en', 'Mark is preferred on first mount, with English ahead of other languages');
  assert.equal(await page.evaluate(() => testSpeech.history.length), 0, 'voice discovery does not autoplay');
  assert.equal(await page.evaluate((spec) => {
    const host = document.createElement('figure'); document.body.append(host);
    host.innerHTML = KelvinBoard.render(spec);
    const root = host.querySelector('.kboard'), embed = document.createElement('div'), viewport = document.createElement('div');
    embed.className = 'kboard-embed'; viewport.className = 'kboard-scroll'; root.before(embed); embed.append(viewport); viewport.append(root);
    const player = KelvinNarration.mount(host, spec);
    const controls = host.querySelector('.knarration');
    const outside = controls.parentElement === host && controls.nextElementSibling === embed;
    player.dispose(); host.remove(); return outside;
  }, board), true, 'controls mount outside an already wrapped board viewport');
  await page.goto(origin + '/#/c/chat');
  await page.getByRole('button', { name: 'Play narration', exact: true }).waitFor();
  assert.equal(await page.getByLabel('Narration voice').inputValue(), 'local-en', 'absent Mark falls back; a substring such as Remark does not match');
  console.log('ok  Mark present/late/absent, whole-word match, explicit/default overrides and prewrapped control insertion');

  await page.reload();
  await page.getByRole('button', { name: 'Play narration', exact: true }).waitFor();
  assert.equal(await page.getByLabel('Narration speed').inputValue(), '0.9', 'default to a slightly slower tutor pace');
  await page.evaluate(() => { testSpeech.holdStart = true; });
  await page.getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.waitForTimeout(350);
  const progress = () => page.locator('[data-board-target="node:turbine"]').evaluate((el) => Number(el.dataset.drawProgress));
  assert.equal(await progress(), 0, 'queued voice delay never draws early');
  await page.evaluate(() => { testSpeech.start(); testSpeech.boundary(0); });
  await page.waitForTimeout(500);
  const firstWord = await progress();
  await page.waitForTimeout(500);
  assert.equal(await progress(), firstWord, 'drawing waits when the next spoken word is delayed');
  assert.ok(firstWord > 0 && firstWord < .25);
  assert.equal(await page.locator('[data-board-target="step:0"]').evaluate((el) => el.style.opacity), '0', 'future equations wait for their phrase');
  await page.evaluate(() => testSpeech.boundary(6));
  await page.waitForTimeout(200);
  assert.ok(await progress() > firstWord, 'word event advances the pen');
  const lastWord = await page.evaluate(() => testSpeech.active.text.lastIndexOf(' ') + 1);
  await page.evaluate((at) => testSpeech.boundary(at), lastWord);
  await page.waitForTimeout(800);
  assert.ok(await progress() < 1, 'last word still waits for utterance completion');
  await page.evaluate(() => testSpeech.finish());
  assert.equal(await progress(), 1);
  const boundary = page.locator('.kboard-apparatus rect[stroke-dasharray]');
  assert.equal(await boundary.getAttribute('stroke-dasharray'), '6 4', 'system boundary remains dashed');
  assert.equal(await boundary.evaluate((el) => el.style.strokeDasharray), '');

  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.evaluate(() => { testSpeech.holdStart = false; });
  await page.getByRole('button', { name: 'Replay step', exact: true }).click();
  await page.getByText('Step 3 of 3 · Listening', { exact: true }).waitFor();
  await page.evaluate(() => testSpeech.finish());
  await page.getByText('Step 3 of 3 · Listening', { exact: true }).waitFor();
  await page.evaluate(() => testSpeech.boundary(0));
  await page.waitForTimeout(500);
  const equation = page.locator('[data-board-target="step:1"]');
  const equationProgress = await equation.evaluate((el) => Number(el.dataset.drawProgress));
  assert.ok(equationProgress > 0 && equationProgress < 1, 'equation writing follows its spoken phrase');
  assert.ok(await equation.locator('.katex').count() > 0, 'math remains legible KaTeX rather than an image');
  await page.waitForTimeout(350);
  assert.equal(await equation.evaluate((el) => Number(el.dataset.drawProgress)), equationProgress, 'equation waits with delayed speech');
  await page.evaluate(() => testSpeech.finish());
  assert.equal(await equation.evaluate((el) => Number(el.dataset.drawProgress)), 1);

  await page.reload();
  await page.getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.getByText('Step 1 of 3 · Listening', { exact: true }).waitFor();
  await page.waitForTimeout(2200);
  assert.ok(await progress() > 0 && await progress() < 1, 'no-boundary voice uses speech-paced fallback, not the former 1.8s cap');
  assert.equal(await page.locator('.kboard-marker').evaluate((el) => el.hidden), false, 'pen remains visible while outlining apparatus');
  const parts = await page.locator('.kboard-apparatus [stroke]').evaluateAll((els) => els.map((el) => ({ opacity: el.style.opacity, fill: Number(el.style.fillOpacity) })));
  assert.ok(parts.some((part) => part.fill < 1) && parts.some((part) => part.fill === 1), 'illustration is drawn in parts instead of appearing all at once');
  await page.evaluate(() => testSpeech.finish());
  assert.equal(await progress(), 1);
  console.log('ok  delayed voice, word boundaries, smooth progress, slower pace, no-boundary fallback and sequential apparatus strokes');

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
  const pausedDrawing = await progress();
  await page.waitForTimeout(150);
  assert.equal(await progress(), pausedDrawing);
  assert.equal(await page.evaluate(() => testSpeech.active), null);
  await page.getByRole('button', { name: 'Resume phrase', exact: true }).click();
  await page.getByText('Step 1 of 3 · Listening', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => testSpeech.history[0].text === testSpeech.history[1].text), true);
  await page.getByText('Voice & speed', { exact: true }).click();
  await page.getByLabel('Narration speed').selectOption('2');
  await page.waitForFunction(() => testSpeech.active?.rate === 2);
  // Force a stale callback after changing speed: it must not advance the replacement phrase.
  await page.evaluate(() => testSpeech.history[0].onend());
  await page.evaluate(() => testSpeech.history[0].onboundary?.({ name: 'word', charIndex: 30 }));
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
  await page.getByRole('switch', { name: 'Whiteboard', exact: true }).click();
  await page.locator('#input').fill('Explain a turbine');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll('#thread .knarration').length === 2);
  await page.locator('#thread .knarration').last().waitFor();
  await page.locator('#thread .knarration').first().waitFor();
  assert.equal(postedMessage, 'Explain a turbine', 'display preference must not pollute student text');
  assert.equal(postedWhiteboard, true);
  await page.locator('#thread .knarration').last().getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.locator('#thread .knarration').last().getByRole('button', { name: 'Pause', exact: true }).waitFor();
  const count = await page.evaluate(() => testSpeech.history.length);
  pendingStream();
  await page.getByRole('button', { name: 'Send', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => testSpeech.history.length), count, 'streaming must preserve player');
  assert.equal(await page.evaluate(() => Boolean(testSpeech.active)), true);
  await page.locator('#thread .knarration').first().getByRole('button', { name: 'Play narration', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Pause', exact: true }).count(), 1);
  await page.locator('#thread .knarration').last().getByRole('button', { name: 'Next step', exact: true }).click();
  assert.equal(await page.evaluate(() => Boolean(testSpeech.active)), true, 'inactive player must not cancel active speech');
  console.log('ok  composer, streaming reuse, one active voice, independent manual controls');

  assert.equal(await page.getByRole('switch', { name: 'Whiteboard' }).getAttribute('aria-checked'), 'true');
  await page.getByRole('button', { name: 'New chat', exact: true }).click();
  assert.equal(await page.getByRole('switch', { name: 'Whiteboard' }).getAttribute('aria-checked'), 'true');
  await page.goto(origin + '/#/c/chat');
  await page.reload();
  assert.equal(await page.getByRole('switch', { name: 'Whiteboard' }).getAttribute('aria-checked'), 'true');
  await page.getByRole('switch', { name: 'Whiteboard' }).click();
  await page.locator('#input').fill('Continue in chat');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.getByText('Continue with the energy balance in chat.', { exact: true }).waitFor();
  assert.equal(postedWhiteboard, false);
  await page.reload();
  assert.equal(await page.getByRole('switch', { name: 'Whiteboard' }).getAttribute('aria-checked'), 'false');
  console.log('ok  persistent switch survives sends, new chats and reload; Off sends ordinary chat preference');

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
