// Same authored scenario through actual main/experiment browser code; no live model/OCR claims.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lessonInput } from './fixtures/narrated-lesson.mjs';
import { validateLesson } from '../lib/whiteboard.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'data/experiment-evaluation');
const report = JSON.parse(fs.readFileSync(path.join(output, 'comparison.json'), 'utf8'));
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const lesson = structuredClone(lessonInput);
Object.assign(lesson.board.nodes[1], { illustration: 'turbine', surroundings: 'air', boundary: 'control-volume' });
const saved = validateLesson(lesson);
const board = { ...saved.board, lesson: { id: '11111111-1111-4111-8111-111111111111', segments: saved.segments } };
const content = '```kelvin-board\n' + JSON.stringify(board) + '\n```';
const results = {};
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  for (const [name, dir] of [['main', path.join(output, report.baselineCommit)], ['experiment', root]]) {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://test');
      const json = (value) => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
      if (url.pathname === '/api/me') return json({ user: { id: 'reviewer', name: 'Evaluation fixture' }, profile: { onboarded: true, default_style: 'office-hours' } });
      if (url.pathname === '/api/styles') return json(report.versions[name].activeStyles.map((id) => ({ id, name: id, available: true, default: id === 'office-hours' })));
      if (url.pathname === '/api/me/usage') return json({ state: 'normal', percent: 0 });
      if (url.pathname === '/api/conversations') return json([{ id: 'compare', title: 'Same turbine example' }]);
      if (url.pathname === '/api/conversations/compare') return json({ id: 'compare', messages: [{ role: 'assistant', content }] });
      if (url.pathname === '/api/attachments/problem') return json({ id: 'problem', name: 'problem.png', status: 'needs_review', source: 'extracted', markdown: 'A turbine receives steam at $P_1=200$ kPa.\n\n$$W=\\frac{120}{3}$$' });
      if (url.pathname.startsWith('/api/')) return json({});
      const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      let file = path.resolve(dir, 'public', relative);
      if (!file.startsWith(path.join(dir, 'public') + path.sep)) { res.writeHead(404); return res.end(); }
      // Vendor files are generated, untracked assets. Serve the same pinned installed assets to both.
      if (!fs.existsSync(file) && relative.startsWith('vendor/')) file = path.join(root, 'public', relative);
      if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html' }[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      const synth = new EventTarget();
      synth.getVoices = () => [];
      synth.speak = (speech) => { window.evalSpeech = speech; setTimeout(() => speech.onstart?.(), 0); };
      synth.cancel = () => { window.evalSpeech = null; };
      Object.defineProperty(window, 'speechSynthesis', { value: synth });
      Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: class { constructor(text) { this.text = text; } } });
    });
    try {
      await page.goto(`http://127.0.0.1:${server.address().port}/#/c/compare`);
      await page.getByRole('button', { name: 'Play narration', exact: true }).waitFor();
      const row = results[name] = { symbolToggle: await page.locator('#equationToggle').count(), illustratedApparatus: await page.locator('.kboard-apparatus').count() };
      await page.getByRole('button', { name: 'Play narration', exact: true }).click();
      await page.getByText('Step 1 of 3 · Listening', { exact: true }).waitFor();
      await page.waitForTimeout(2200);
      row.noBoundaryProgressAt2200ms = await page.locator('[data-board-target="node:turbine"]').evaluate((node) => {
        if (node.dataset.drawProgress) return Number(node.dataset.drawProgress);
        const line = node.querySelector('.kboard-marker-outline');
        return 1 - Number(line.style.strokeDashoffset) / line.getTotalLength();
      });
      row.speechStillActive = await page.evaluate(() => Boolean(window.evalSpeech));
      await page.screenshot({ path: path.join(output, name + '-during-speech.png'), fullPage: true });
      for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Next step', exact: true }).click();
      const diagram = await page.locator('.kboard-canvas').boundingBox();
      const steps = await page.locator('.kboard-steps').boundingBox();
      row.equationsBesideDiagram = steps.x > diagram.x + diagram.width - 5;
      await page.screenshot({ path: path.join(output, name + '-complete.png'), fullPage: true });
      await page.evaluate(() => KelvinAttachments.openReview('problem'));
      await page.locator('#attPreview').waitFor();
      row.previewEditable = await page.locator('#attPreview').getAttribute('contenteditable') === 'true';
      row.rawEditorVisible = await page.locator('#attEditor').isVisible();
      await page.screenshot({ path: path.join(output, name + '-problem-preview.png'), fullPage: true });
      assert.deepEqual(errors, []);
    } finally {
      await page.close();
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
  }
  assert.equal(results.main.symbolToggle, 0);
  assert.equal(results.experiment.symbolToggle, 1);
  assert.equal(results.main.illustratedApparatus, 0);
  assert.equal(results.experiment.illustratedApparatus, 1);
  assert.equal(results.main.noBoundaryProgressAt2200ms, 1);
  assert.ok(results.experiment.noBoundaryProgressAt2200ms < 1);
  assert.equal(results.main.equationsBesideDiagram, false);
  assert.equal(results.experiment.equationsBesideDiagram, true);
  assert.equal(results.main.previewEditable, false);
  assert.equal(results.experiment.previewEditable, true);
  fs.writeFileSync(path.join(output, 'browser-comparison.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
