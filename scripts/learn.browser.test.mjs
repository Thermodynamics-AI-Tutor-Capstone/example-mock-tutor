// Browser regression checks: offline server, no credentials or external services.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createDemoServer } from './demo-server.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const server = createDemoServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const output = path.resolve('data/ui-review'); fs.mkdirSync(output, { recursive: true });
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  // A focused tutorial test can run before the root integrates the beta shell.
  // Existing real navigation is used unchanged when present.
  await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('learnLink')) return;
    for (const [id, label, hash] of [['aboutMeLink','About Me','#/about-me'],['selfCheckLink','Check My Understanding','#/self-check']]) {
      if (document.getElementById(id)) continue;
      const link = document.createElement('a'); link.id=id; link.className='sb-row'; link.href=hash; link.textContent=label;
      document.getElementById('learnLink').after(link);
    }
  }));
  const errors = []; let posts = 0;
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', req => { if (req.method() === 'POST') posts++; });
  await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  await page.goto(origin);
  await page.locator('#learnWelcome').waitFor();
  await page.locator('#input').fill('Keep my draft and my assumptions.');
  await page.locator('#learnLink').click();
  await page.locator('#learnPanel').waitFor();
  assert.equal(await page.locator('[data-lesson]').count(),8);
  assert.equal(await page.locator('#learnProgress').getAttribute('max'),'8');
  assert.equal(await page.locator('#demoSeek').getAttribute('max'),'80');
  assert.equal(await page.locator('#demoTime').textContent(),'0:00 / 1:20');
  assert.equal(await page.locator('[data-chapter="7"] small').textContent(),'1:10');
  await page.locator('[data-chapter="7"]').click();
  assert.equal(await page.locator('#demoChapter').textContent(),'08 / 08');
  assert.equal(await page.locator('#demoTime').textContent(),'1:10 / 1:20');
  await page.locator('#demoSeek').fill('80');
  assert.equal(await page.locator('#demoTime').textContent(),'1:20 / 1:20');
  assert.equal(await page.locator('#demoPlay').getAttribute('aria-label'),'Replay walkthrough');
  await page.locator('[data-chapter="0"]').click();
  await page.screenshot({ path: path.join(output, 'learn-desktop.png') });
  assert.equal(await page.locator('#chatMain').isVisible(), false);
  await page.locator('#demoPlay').click();
  await page.waitForFunction(() => Number(document.querySelector('#demoSeek').value) > 0.3);
  await page.locator('[data-chapter="2"]').click();
  assert.match(await page.locator('#demoLabel').textContent(), /whiteboard/i);
  await page.locator('#demoPlay').click();
  await page.locator('#startTour').click();
  await page.locator('#learnTour[open]').waitFor();
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.querySelector('#learnTour').contains(document.activeElement)), true);
  await page.screenshot({ path: path.join(output, 'tour-desktop.png') });
  await page.locator('#tourNext').click();
  assert.match(await page.locator('#tourTitle').textContent(), /Show your work/);
  await page.locator('#tourBack').click();
  await page.keyboard.press('Escape');
  await page.locator('#learnPanel').waitFor();
  assert.match(await page.locator('#learnProgressText').textContent(), /1 of 8/);
  await page.locator('#learnReturn').click();
  await page.locator('#input').waitFor();
  assert.equal(await page.locator('#input').inputValue(), 'Keep my draft and my assumptions.');
  assert.equal(posts, 0, 'watching and touring never send messages or uploads');
  await page.locator('#sendBtn').click();
  await page.locator('.msg.assistant').waitFor();
  await page.waitForFunction(() => !document.querySelector('#sendBtn').classList.contains('stop'));
  const chatHash = new URL(page.url()).hash;
  await page.locator('#input').fill('My follow-up stays here.');
  await page.locator('#learnLink').click();
  await page.locator('.conv-item .t').click();
  await page.locator('#input').waitFor();
  assert.equal(new URL(page.url()).hash, chatHash);
  assert.equal(await page.locator('#input').inputValue(), 'My follow-up stays here.');
  const beforeFeatureTours = posts;
  for (const [index, id, hash] of [[6,'aboutMeLink','#/about-me'],[7,'selfCheckLink','#/self-check']]) {
    await page.goto(origin + '/#/learn');
    await page.locator('#learnPanel').waitFor();
    await page.evaluate(() => document.getElementById('app').classList.add('collapsed'));
    await page.locator(`[data-lesson="${index}"]`).click();
    assert.equal(await page.locator('#'+id).isVisible(),true);
    const target = await page.locator('#'+id).boundingBox();
    assert.ok(target.x>=0 && target.x+target.width<=1440,'collapsed desktop sidebar opens for feature target');
    await page.locator('#tourTry').click();
    assert.equal(await page.evaluate(() => document.activeElement.id),id);
    assert.equal(await page.locator('#'+id).getAttribute('href'),hash);
    assert.equal(new URL(page.url()).hash,chatHash,'tour Find preserves the conversation route');
    assert.equal(await page.locator('#input').inputValue(),'My follow-up stays here.');
  }
  assert.equal(posts,beforeFeatureTours,'new beta tour steps do not submit profile or answers');
  const width = await page.locator('#thread').evaluate(el => el.getBoundingClientRect().width);
  assert.ok(width > 500, 'messages fill their conversation pane');
  await page.locator('#workspaceToggle').click();
  assert.ok(await page.locator('#thread').evaluate(el => el.clientWidth) > 1100, 'hiding the workspace expands chat');
  await page.locator('#learnLink').click();
  await page.reload();
  await page.locator('#learnPanel').waitFor();
  assert.match(await page.locator('#learnProgressText').textContent(), /3 of 8/);
  await page.locator('#startTour').click();
  assert.match(await page.locator('#tourTitle').textContent(), /Show your work/);
  for (let i = 1; i < 8; i++) await page.locator('#tourNext').click();
  await page.locator('#learnPanel').waitFor();
  assert.match(await page.locator('#learnProgressText').textContent(), /8 of 8/);
  await page.locator('[data-lesson="3"]').click();
  assert.equal(await page.locator('#tourAvailability').isVisible(), true);
  await page.locator('#tourTry').click();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'input');
  await page.locator('#learnLink').click();
  await page.locator('#newChatBtn').click();
  assert.equal(await page.locator('#learnPanel').isVisible(), false);
  assert.equal(await page.locator('#learnWelcome').isVisible(), false);
  console.log('ok: learning route, player, keyboard, draft preservation, progress, replay, unavailable voice, no tutorial API writes');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/#/learn');
  await page.locator('#learnPanel').waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: path.join(output, 'learn-mobile.png') });
  await page.locator('[data-lesson="2"]').click();
  const ring = await page.locator('#tourSpotlight').boundingBox();
  const card = await page.locator('#tourCard').boundingBox();
  assert.ok(ring.x >= 0 && ring.x + ring.width <= 390 && card.x >= 0 && card.x + card.width <= 390);
  assert.ok(card.y + card.height <= ring.y || ring.y + ring.height <= card.y, 'mobile card does not cover highlighted control');
  await page.screenshot({ path: path.join(output, 'tour-mobile.png') });
  await page.keyboard.press('Escape');
  for (const [index,id] of [[6,'aboutMeLink'],[7,'selfCheckLink']]) {
    await page.locator(`[data-lesson="${index}"]`).click();
    const target = await page.locator('#'+id).boundingBox();
    const ring = await page.locator('#tourSpotlight').boundingBox();
    const card = await page.locator('#tourCard').boundingBox();
    assert.ok(target.x>=0 && target.x+target.width<=390 && target.y>=0 && target.y+target.height<=844,'mobile sidebar target is on screen');
    assert.ok(card.y+card.height<=ring.y || ring.y+ring.height<=card.y,'sidebar tour card leaves highlighted navigation visible');
    await page.screenshot({path:path.join(output,`tour-mobile-${id}.png`)});
    await page.keyboard.press('Escape');
    await page.locator('#learnPanel').waitFor();
    assert.equal(await page.locator('#app').evaluate(el=>el.classList.contains('mobile-open')),false);
  }
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.screenshot({ path: path.join(output, 'learn-dark.png') });
  console.log('ok: mobile layout, spotlight clearance, dark appearance, reduced motion');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.route('**/api/conversations/graph', route => route.fulfill({ json: { id: 'graph', title: 'Graph check', style: 'office-hours', messages: [{ role: 'assistant', content: '```mermaid\nflowchart LR\n A[Energy in] --> B[Turbine]\n B --> C[Energy out]\n```' }] } }));
  let failRenderer = true, failLibrary = true;
  await page.route('**/figures.js', route => { if (failRenderer) { failRenderer = false; return route.abort(); } return route.continue(); });
  await page.route('**/vendor/mermaid.min.js', route => { if (failLibrary) { failLibrary = false; return route.abort(); } return route.continue(); });
  await page.goto(origin + '/#/c/graph');
  await page.getByRole('button', { name: 'Retry diagram', exact: true }).click();
  await page.locator('.kfig-retry').waitFor();
  assert.equal(await page.locator('.kfig pre').isVisible(), false, 'raw code is collapsed on failure');
  await page.locator('.kfig-retry').click();
  await page.locator('.kfig svg').waitFor();
  await page.screenshot({ path: path.join(output, 'diagram-recovered.png') });
  assert.deepEqual(errors, []);
  console.log('ok: failed renderer and failed Mermaid load both recover without resending the message');
  let diagramAttempts = 0;
  await page.route('**/api/conversations/property', route => route.fulfill({ json: { id: 'property', title: 'Property diagram', style: 'office-hours', messages: [{ role: 'assistant', content: '```kelvin-diagram\n{"fluid":"water","diagram":"Ts"}\n```' }] } }));
  await page.route('**/api/properties/diagram', route => {
    diagramAttempts++;
    return route.fulfill(diagramAttempts === 1 ? { status: 503, json: { error: 'Temporary diagram service failure' } } : { json: {
      title: 'Test property diagram', fluid: 'water', axes: { x: { label: 'Entropy', unit: 'kJ/kg K' }, y: { label: 'Temperature', unit: 'K' } },
      states: [{ label: '1', xy: [1, 300] }, { label: '2', xy: [2, 400] }],
      paths: [{ from: '1', to: '2', path: 'test path', points: [[1, 300], [2, 400]] }],
      isobars: [], dome: { liquid: [], vapor: [] }, problems: [],
    } });
  });
  await page.goto(origin + '/#/c/property');
  await page.locator('.kfig-retry').click();
  await page.locator('.kfig svg').waitFor();
  assert.equal(diagramAttempts, 2);
  assert.deepEqual(errors, []);
  console.log('ok: property graph API failures recover with Retry diagram');
} finally {
  await browser?.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
}
