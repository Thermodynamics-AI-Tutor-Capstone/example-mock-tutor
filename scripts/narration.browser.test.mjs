// Optional real-browser checks. Install playwright locally, or set PLAYWRIGHT_MODULE to its
// index.mjs file. No credentials or paid API: the fixture serves a silent WAV as a voice clip.
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
let available = false, audioRequests = 0, postedMessage = '', pendingStream;
const wav = Buffer.alloc(44 + 8000 * 4 * 2);
wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(8000, 24); wav.writeUInt32LE(16000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
wav.write('data', 36); wav.writeUInt32LE(wav.length - 44, 40);
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
  if (url.pathname === '/api/whiteboard/voice') return json({ available });
  if (url.pathname.startsWith('/api/whiteboard/') && url.pathname.includes('/audio/')) {
    audioRequests++;
    if (!available) return json({ error: 'Voice is not set up yet. You can still read the captions and use Next step.' }, 503);
    res.writeHead(200, { 'Content-Type': 'audio/wav' }); res.end(wav); return;
  }
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
    const NativeAudio = window.Audio;
    window.testClips = [];
    window.Audio = function (...args) { const audio = new NativeAudio(...args); window.testClips.push(audio); return audio; };
  });
  await page.goto(origin + '/#/c/chat');
  await page.getByRole('button', { name: 'Play narration', exact: true }).waitFor();
  await page.getByText('Voice is not set up yet. Use Next step and the captions.').waitFor();
  assert.equal(audioRequests, 0, 'loading history must not generate audio');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  assert.equal(await page.locator('[data-board-target="node:turbine"]').evaluate((el) => el.style.opacity), '1');
  assert.equal(await page.locator('[data-board-target="node:inlet"]').evaluate((el) => el.style.opacity), '0');
  await page.getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.getByText('Voice is not set up yet. You can still read the captions and use Next step.').waitFor();
  await page.getByText('Read full transcript', { exact: true }).click();
  assert.equal(await page.locator('.knarration-transcript li').count(), 3);
  const output = path.join(root, 'data', 'narration-ui');
  fs.mkdirSync(output, { recursive: true });
  await page.screenshot({ path: path.join(output, 'desktop-no-key.png'), fullPage: true });
  console.log('ok  history, no autoplay, missing-key fallback, manual reveal, transcript');

  available = true;
  await page.reload();
  await page.getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).waitFor();
  await page.waitForFunction(() => window.testClips.at(-1).currentTime > .1);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const pausedAt = await page.evaluate(() => window.testClips.at(-1).currentTime);
  const pausedDrawing = await page.locator('[data-board-target="node:turbine"]').evaluate((el) => el.style.clipPath);
  await page.waitForTimeout(250);
  assert.equal(await page.evaluate(() => window.testClips.at(-1).currentTime), pausedAt);
  assert.equal(await page.locator('[data-board-target="node:turbine"]').evaluate((el) => el.style.clipPath), pausedDrawing);
  await page.getByLabel('Position in current spoken step').evaluate((el) => { el.value = '800'; el.dispatchEvent(new Event('input')); });
  await page.waitForFunction(() => window.testClips.at(-1).currentTime > 3);
  assert.equal(await page.locator('[data-board-target="step:0"]').evaluate((el) => el.style.clipPath), 'inset(0px 0% 0px 0px)');
  await page.getByLabel('Narration speed').selectOption('2');
  await page.getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.waitForFunction(() => window.testClips.at(-1).playbackRate === 2);
  await page.getByText('Step 2 of 3 · Listening', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  const beforeReplay = audioRequests;
  await page.getByRole('button', { name: 'Replay step', exact: true }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).waitFor();
  assert.equal(audioRequests, beforeReplay, 'within-player replay must reuse the object URL');
  await page.getByRole('button', { name: 'New chat', exact: true }).click();
  await page.waitForFunction(() => window.testClips.every((clip) => clip.paused));
  console.log('ok  real audio clock, pause, seek, speed, sequential clips, replay cache, navigation cleanup');

  await page.goto(origin + '/#/c/chat');
  await page.getByRole('button', { name: 'Explain on whiteboard', exact: true }).click();
  await page.locator('#input').fill('Explain a turbine');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await page.locator('.knarration').nth(1).waitFor();
  assert.match(postedMessage, /narrated whiteboard/);
  await page.locator('.knarration').nth(1).getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.locator('.knarration').nth(1).getByRole('button', { name: 'Pause', exact: true }).waitFor();
  const count = await page.evaluate(() => window.testClips.length);
  pendingStream();
  await page.getByRole('button', { name: 'Send', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.testClips.length), count);
  assert.equal(await page.evaluate(() => window.testClips.at(-1).paused), false, 'streamed text must preserve playback');
  await page.locator('.knarration').nth(0).getByRole('button', { name: 'Play narration', exact: true }).click();
  await page.locator('.knarration').nth(0).getByRole('button', { name: 'Pause', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.testClips.filter((clip) => !clip.paused).length), 1);
  console.log('ok  composer request, streamed board reuse, only one narration playing');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.reload();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await page.screenshot({ path: path.join(output, 'mobile-dark.png'), fullPage: true });
  await page.setViewportSize({ width: 1280, height: 1050 });
  await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'light' });
  await page.screenshot({ path: path.join(output, 'desktop-complete.png'), fullPage: true });
  assert.deepEqual(errors, []);
  console.log('ok  mobile, dark mode, reduced motion, no JavaScript errors');
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
