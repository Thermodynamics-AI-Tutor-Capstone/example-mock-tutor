// Real chat layout with authored teaching examples; no model calls or student data.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { illustrationBoards, illustratedLessonInput } from './fixtures/illustrated-boards.mjs';
import { validateBoard, ILLUSTRATIONS } from '../lib/tools/show_on_board.js';
import { validateLesson } from '../lib/whiteboard.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lesson = validateLesson(illustratedLessonInput);
const boards = illustrationBoards.map(validateBoard);
boards.push({ ...lesson.board, lesson: { id: '11111111-1111-4111-8111-111111111111', segments: lesson.segments } });
const content = boards.map((board) => '```kelvin-board\n' + JSON.stringify(board) + '\n```').join('\n\n');
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://test');
  const json = (value) => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
  if (url.pathname === '/api/me') return json({ user: { id: 'test', name: 'Sample reviewer' }, profile: { onboarded: true, default_style: 'office-hours' } });
  if (url.pathname === '/api/styles') return json([{ id: 'office-hours', name: 'Guided tutor', available: true, default: true }]);
  if (url.pathname === '/api/me/usage') return json({ percent: 0, state: 'normal' });
  if (url.pathname === '/api/conversations') return json([{ id: 'examples', title: 'Illustration examples' }]);
  if (url.pathname === '/api/conversations/examples') return json({ id: 'examples', messages: [{ role: 'assistant', content }] });
  if (url.pathname.startsWith('/api/')) return json({});
  const file = path.resolve(root, 'public', '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(path.join(root, 'public') + path.sep) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2' }[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/#/c/examples`);
  await page.locator('.kboard').nth(4).waitFor();
  assert.equal(await page.locator('.kboard').count(), 5);
  assert.equal(await page.locator('.katex-error').count(), 0);
  const first = page.locator('.kboard').first();
  const diagram = await first.locator('.kboard-diagram').boundingBox();
  const equations = await first.locator('.kboard-steps').boundingBox();
  assert.ok(equations.x >= diagram.x + diagram.width, 'actual chat shows diagram and equations side by side');
  const cropped = await page.locator('.kboard:not(.kboard-narrated) svg').evaluateAll((svgs) => svgs.flatMap((svg) => {
    const frame = svg.getBoundingClientRect();
    return [...svg.querySelectorAll('.kboard-node')].filter((node) => {
      const box = node.getBoundingClientRect();
      return box.left < frame.left - 1 || box.top < frame.top - 1 || box.right > frame.right + 1 || box.bottom > frame.bottom + 1;
    }).map((node) => node.dataset.boardTarget);
  }));
  assert.deepEqual(cropped, [], 'apparatus, surroundings, labels and boundaries fit the SVG');
  const output = path.join(root, 'data', 'illustration-ui');
  fs.mkdirSync(output, { recursive: true });
  await first.screenshot({ path: path.join(output, 'piston-equations.png') });
  await page.locator('.kboard').nth(1).screenshot({ path: path.join(output, 'hose-nozzle.png') });
  await page.locator('.kboard').nth(2).screenshot({ path: path.join(output, 'submerged-solid.png') });
  await page.locator('.kboard').nth(3).screenshot({ path: path.join(output, 'refrigerator.png') });
  const narrated = page.locator('.kboard-narrated');
  for (let i = 0; i < lesson.segments.length; i++) await narrated.getByRole('button', { name: 'Next step', exact: true }).click();
  assert.equal(await narrated.locator('[data-board-target]').evaluateAll((els) => els.every((el) => el.style.opacity === '1')), true);
  await narrated.screenshot({ path: path.join(output, 'narrated-piston.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'mobile page has no horizontal overflow');
  const mobileDiagram = await first.locator('.kboard-diagram').boundingBox();
  const mobileEquations = await first.locator('.kboard-steps').boundingBox();
  assert.ok(mobileEquations.y >= mobileDiagram.y + mobileDiagram.height, 'narrow layouts stack equations after drawing');
  await first.screenshot({ path: path.join(output, 'mobile-piston.png') });
  // Every supported apparatus must render as real authored geometry, including the less common ones.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate((types) => {
    const gallery = document.createElement('div'); gallery.id = 'apparatus-gallery';
    gallery.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:white;padding:16px;position:relative;z-index:10';
    for (const type of types) {
      const item = document.createElement('div');
      item.innerHTML = KelvinBoard.render({ version: 1, kind: 'sketch', title: type, nodes: [{ id: 'device', kind: 'component', label: type.replaceAll('-', ' '), x: 50, y: 50, illustration: type }], arrows: [], steps: [] });
      item.querySelector('svg').style.minWidth = '0';
      gallery.append(item);
    }
    document.body.replaceChildren(gallery);
  }, ILLUSTRATIONS);
  assert.equal(await page.locator('[data-illustration]').count(), ILLUSTRATIONS.length);
  await page.screenshot({ path: path.join(output, 'apparatus-gallery.png'), fullPage: true });
  assert.deepEqual(errors, []);
  console.log('ok  actual chat paired layout, unclipped apparatus, manual narration, mobile, and all apparatus variants');
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
