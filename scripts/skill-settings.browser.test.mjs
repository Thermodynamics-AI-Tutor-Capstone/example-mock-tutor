// Settings correction workflow with an isolated API double, never real student records.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage();
  await page.setContent('<html><head></head><body><button id="open">Settings</button></body></html>');
  await page.addScriptTag({ path: path.join(root, 'public/vendor/marked.umd.js') });
  await page.addScriptTag({ path: path.join(root, 'public/vendor/purify.min.js') });
  await page.evaluate(() => {
    const view = { markdown: '# What Kelvin knows\n\nTargeted support: energy balance.', model: { skills: { energy_balance: { label: 'Energy balance' } } } };
    window.posted = []; window.failReset = true;
    window.KelvinAccount = {
      me: async () => ({ user: { id: 'test' }, profile: { display_name: 'Tester', default_style: 'office-hours' } }),
      async call(url, options) {
        if (url === '/api/styles') return { ok: true, data: [{ id: 'office-hours', name: 'Guided tutor', available: true }] };
        if (options?.method === 'POST') {
          posted.push(JSON.parse(options.body));
          if (failReset) return { ok: false, data: { error: 'Please try again.' } };
          view.model.skills = {}; view.markdown = '# What Kelvin knows\n\nNo skill observations yet.';
        }
        return { ok: true, data: view };
      },
    };
  });
  await page.addScriptTag({ path: path.join(root, 'public/settings.js') });
  await page.evaluate(() => KelvinSettings.open({ tab: 'learning' }));
  await page.getByLabel('Skill assessment to reset').waitFor();
  assert.equal(await page.getByLabel('Skill assessment to reset').inputValue(), 'energy_balance');
  await page.getByRole('button', { name: 'Reset this skill assessment' }).click();
  await page.getByText('Please try again.', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Skill assessment to reset').isVisible(), true, 'failed reset retains assessment');
  assert.equal(await page.getByRole('button', { name: 'Reset this skill assessment' }).isEnabled(), true);
  await page.evaluate(() => { failReset = false; });
  await page.getByRole('button', { name: 'Reset this skill assessment' }).click();
  await page.getByText('Skill assessment reset. Kelvin can learn from your next work.').waitFor();
  assert.equal(await page.getByLabel('Skill assessment to reset').isVisible(), false);
  assert.deepEqual(await page.evaluate(() => posted), [
    { action: 'reset_skill', ref: 'energy_balance' }, { action: 'reset_skill', ref: 'energy_balance' },
  ]);
  assert.equal(await page.getByRole('tab', { name: 'What Kelvin knows' }).evaluate((el) => document.activeElement === el), true, 'focus survives removing the last reset control');
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.evaluate(() => KelvinSettings.open({ tab: 'learning' }));
  await page.getByText('No skill observations yet.', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Skill assessment to reset').isVisible(), false);
  console.log('ok  skill reset payload, error recovery, refresh, keyboard focus, and reopen');
} finally { await browser.close(); }
