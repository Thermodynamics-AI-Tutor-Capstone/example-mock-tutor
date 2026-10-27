import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { startLayoutServer } from './layout-review-server.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const { server, origin } = await startLayoutServer();
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin);
    const kel = page.getByRole('button', { name: 'Make Kel dance' });
    await kel.waitFor();
    await page.waitForFunction(() => document.querySelector('.kel-companion').classList.contains('kel-hello'));
    assert.match(await page.locator('.kel-greeting').textContent(), /Hi, I'm Kel/);
    assert.notEqual(await kel.evaluate(el => getComputedStyle(el).animationName), 'none');
    const box = await kel.boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= width && box.y > 0 && box.y + box.height < 900);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (process.env.KEL_SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.KEL_SCREENSHOT_DIR}/kel-${width}.png` });
    await page.waitForFunction(() => !document.querySelector('.kel-companion').classList.contains('kel-hello'));
    assert.equal(await kel.evaluate(el => getComputedStyle(el).animationName), 'none');
    await kel.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.kel-companion').evaluate(el => el.classList.contains('kel-dancing')), true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await kel.evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('Kel: desktop/mobile greeting, finite dance, idle, keyboard replay, bounds and reduced motion passed.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
