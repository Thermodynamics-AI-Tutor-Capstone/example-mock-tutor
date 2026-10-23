// Compare the same real chat UI and fixed reply across three CSS variants.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { startLayoutServer } from './layout-review-server.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'data/layout-review');
fs.mkdirSync(output, { recursive: true });
const { server, origin, sent } = await startLayoutServer();
const results = [];
const finalOnly = process.argv.includes('--final-only');
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  for (const variant of finalOnly ? ['final'] : ['baseline', 'fluid', 'readable']) {
    for (const width of finalOnly ? [1680, 390] : [1680, 960, 640, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
      await page.goto(`${origin}/?layout=${variant}#/c/layout-review`);
      await page.locator('.msg.assistant .md').waitFor();
      await page.locator('.kgr-player').waitFor();
      await page.locator('.kgr-player button[data-step="3"]').click();
      await page.locator('#input').fill('Keep this written solution draft. ');
      const toggle = page.locator('#equationToggle');
      await toggle.click();
      await page.getByRole('button', { name: 'Work rate', exact: true }).click();
      assert.match(await page.locator('#input').inputValue(), /\\dot\{W\}/);
      await page.getByRole('button', { name: 'States & cycles', exact: true }).click();
      await page.getByRole('button', { name: 'Inlet enthalpy', exact: true }).click();
      assert.match(await page.locator('#input').inputValue(), /h_\{\\mathrm\{in\}\}/);
      await page.getByRole('button', { name: 'Common', exact: true }).click();
      const metrics = await page.evaluate(() => {
        const box = selector => { const el = document.querySelector(selector); const r = el.getBoundingClientRect(); return { width: Math.round(r.width), height: Math.round(r.height), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, left: Math.round(r.left), right: Math.round(r.right) }; };
        const p = document.querySelector('.msg.assistant .md > p');
        const lineChars = new Map();
        const walk = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
        let text;
        while ((text = walk.nextNode())) for (let i = 0; i < text.length; i++) {
          const range = document.createRange(); range.setStart(text, i); range.setEnd(text, i + 1);
          const rect = range.getBoundingClientRect(); const y = Math.round(rect.top);
          if (rect.width) lineChars.set(y, (lineChars.get(y) || 0) + 1);
        }
        return { viewport: innerWidth, main: box('.main'), thread: box('.thread'), composer: box('#composer'), paragraph: box('.msg.assistant .md > p'), equationPanel: box('#equationPanel'), equationSymbols: box('#equationSymbols'), nav: box('.topbar'), graph: box('.kgr-player'), sampleLineCount: lineChars.size, maxCharactersOnSampleLine: Math.max(...lineChars.values()), pageOverflow: document.documentElement.scrollWidth > innerWidth, navOverflow: document.querySelector('.topbar').scrollWidth > document.querySelector('.topbar').clientWidth };
      });
      await page.locator('#scroller').evaluate(el => { el.scrollTop = 0; });
      await page.screenshot({ path: path.join(output, `${variant}-${width}.png`) });
      await page.locator('.kgr-player').screenshot({ path: path.join(output, `${variant}-${width}-graph.png`) });
      await page.locator('#input').press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
      const draft = await page.locator('#input').inputValue();
      await toggle.press('Enter');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator('#input').inputValue(), draft);
      await page.locator('#propertyTablesBtn').click();
      await page.locator('#propertyTableDock').waitFor({ state: 'visible' });
      await page.locator('#scroller').evaluate(el => { el.scrollTop = 0; });
      const dockMetrics = await page.evaluate(() => {
        const main = document.querySelector('.main'), composer = document.querySelector('#composer');
        return { mainDisplay: getComputedStyle(main).display, mainWidth: Math.round(main.getBoundingClientRect().width), composerWidth: Math.round(composer.getBoundingClientRect().width), pageOverflow: document.documentElement.scrollWidth > innerWidth, topbarOverflow: main.getBoundingClientRect().width > 0 && document.querySelector('.topbar').scrollWidth > document.querySelector('.topbar').clientWidth };
      });
      await page.screenshot({ path: path.join(output, `${variant}-${width}-dock.png`) });
      await page.locator('#closePropertyTables').press('Escape');
      assert.equal(await page.locator('#propertyTableDock').isVisible(), false);
      assert.equal(await page.locator('#input').inputValue(), draft);
      if (width <= 767) {
        await page.locator('#openSidebar').click();
        assert.equal(await page.locator('#app').evaluate(el => el.classList.contains('mobile-open')), true);
        await page.locator('#closeSidebar').click();
      } else {
        await page.locator('#closeSidebar').click();
        await page.locator('#openSidebar').click();
      }
      await page.locator('#checkWorkBtn').click();
      assert.equal(await page.locator('#checkWorkBtn').getAttribute('aria-pressed'), 'true');
      await page.locator('#input').fill('My written balance: Q - W = delta U.');
      await page.locator('#sendBtn').click();
      await page.getByText('Fixture received. No model was called.', { exact: true }).waitFor();
      assert.equal(sent.at(-1).checkWork, true);
      assert.equal(sent.at(-1).content, 'My written balance: Q - W = delta U.');
      await page.reload();
      await page.locator('.msg.assistant .md').waitFor();
      assert.equal(await page.locator('#checkWorkBtn').getAttribute('aria-pressed'), 'true');
      await page.locator('#checkWorkBtn').click();
      await page.locator('#input').fill('Explain the first law.');
      await page.locator('#sendBtn').click();
      await page.getByText('Fixture received. No model was called.', { exact: true }).waitFor();
      assert.equal(sent.at(-1).checkWork, false);
      if (variant !== 'baseline') {
        assert.equal(metrics.pageOverflow, false);
        assert.equal(metrics.navOverflow, false);
        assert.equal(dockMetrics.pageOverflow, false);
        assert.equal(dockMetrics.topbarOverflow, false);
        assert.ok(metrics.equationPanel.height < 180, 'Compact palette should not occupy several tile rows');
      }
      assert.deepEqual(errors, []);
      results.push({ variant, width, metrics, dockMetrics, functionalChecks: ['symbol insertion', 'category navigation', 'Escape closes palette', 'keyboard reopens palette', 'draft preserved', 'property dock open/close', 'sidebar toggle', 'explicit checkWork payload', 'mode preference after reload', 'switch off sends false'], sourceTables: 'Source scan assets absent from staging; dock positioning/close/draft retention tested, not table values.' });
      await page.close();
      console.log(`ok ${variant} ${width}: thread=${metrics.thread.width}, palette=${metrics.equationPanel.height}, max sampled line=${metrics.maxCharactersOnSampleLine}, navOverflow=${metrics.navOverflow}`);
    }
  }
} finally {
  fs.writeFileSync(path.join(output, finalOnly ? 'final-metrics.json' : 'metrics.json'), JSON.stringify({ generatedAt: new Date().toISOString(), note: 'Layout measurements and interaction checks only; no reading speed or learning outcomes were measured.', results }, null, 2));
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
