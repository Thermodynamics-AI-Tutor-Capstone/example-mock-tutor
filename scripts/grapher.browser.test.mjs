// Browser behavior checks use an offline SVG/API fixture, not a live model or property solver.
// The separate grapher engine tests verify thermodynamics and actual Python output.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'data', 'grapher-ui');
fs.mkdirSync(output, { recursive: true });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 640 420">
<defs><clipPath id="plot-clip"><rect x="55" y="20" width="530" height="330"/></clipPath><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#136d5d"/></marker><path id="glyph" d="M0 0L5 0L5 8L0 8Z"/></defs>
<g id="axes"><path d="M55 20V350H585" fill="none" stroke="#253e39" stroke-width="2"/><text x="300" y="395">Specific volume v (m³/kg), logarithmic scale</text><use xlink:href="#glyph" x="35" y="20"/></g>
<g id="boundary" clip-path="url(#plot-clip)"><path d="M80 330C150 250 190 75 300 45C410 75 470 250 560 330" fill="none" stroke="#73877e" stroke-width="2"/><text x="240" y="210">Liquid + vapor</text><text x="270" y="32">Critical point</text></g>
<g id="state-0"><circle cx="130" cy="290" r="5" fill="#136d5d"/><text x="110" y="278">1</text></g>
<g id="process-0" clip-path="url(#plot-clip)"><path d="M130 290L495 290" fill="none" stroke="#136d5d" stroke-width="3" stroke-dasharray="6 4" marker-end="url(#arrow)"/><text x="245" y="276">P = 100 kPa</text></g>
<script>window.grapherXss=true</script><foreignObject><div>unsafe</div></foreignObject><image href="https://invalid.example/track"/><use href="javascript:alert(1)"/>
</svg>`;
function fixture(spec) {
  return { spec, svg, axes: { x: { label: 'Specific volume', unit: 'm³/kg', log: true }, y: { label: 'Pressure', unit: 'kPa' } }, source: 'Offline UI test fixture', states: [{ label: '1', P: 100, T: 99.6, v: 0.00104, h: 417.5, s: 1.302, x: 0 }, { label: '2', P: 100, T: 99.6, v: 1.694, h: 2675, s: 7.359, x: 1 }], warnings: [], steps: [
    { id: 'step-0', kind: 'axes', title: 'Label the axes', text: 'Label pressure in kPa and specific volume in m³/kg; the volume axis is logarithmic.', targets: ['axes'] },
    { id: 'step-1', kind: 'boundary', title: 'Draw the phase boundary', text: 'Identify the liquid, two-phase and vapor regions and the critical point.', targets: ['boundary'] },
    { id: 'step-2', kind: 'state', title: 'Locate state 1', text: 'At P = 100 kPa and x = 0, mark saturated liquid.', targets: ['state-0'] },
    { id: 'step-3', kind: 'process', title: 'Connect the states', text: 'Draw the constant-pressure path from 1 to 2 at 100 kPa.', targets: ['process-0'] },
  ] };
}
let mode = 'ok'; const requests = [], errors = [], external = [];
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://test');
  const json = (data, code = 200) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); };
  if (url.pathname === '/api/grapher/render') {
    const chunks = []; for await (const chunk of req) chunks.push(chunk);
    const spec = JSON.parse(Buffer.concat(chunks).toString()); requests.push(spec);
    if (mode === 'auth') return json({ error: 'Sign in before generating a diagram.' }, 401);
    if (mode === 'error') return json({ error: 'State 2: the isobaric endpoint pressures do not agree.' }, 400);
    return json(fixture(spec));
  }
  const file = path.resolve(root, 'public', '.' + (url.pathname === '/' ? '/grapher.html' : url.pathname));
  if (!file.startsWith(path.join(root, 'public') + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html' })[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  async function pageFor(options = {}) {
    const p = await browser.newPage({ viewport: { width: 1280, height: 980 }, ...options });
    p.on('pageerror', e => errors.push(e.message));
    await p.route('**/*', route => { if (route.request().url().startsWith(origin)) return route.continue(); external.push(route.request().url()); return route.abort(); });
    await p.goto(origin + '/grapher.html'); return p;
  }
  const page = await pageFor();
  await page.locator('#grapher-sample').click();
  for (const type of ['Pv','Ts','Ph','Hs','PT','Tv']) {
    await page.locator('#grapher-type').selectOption(type);
    await page.locator('#grapher-generate').click();
    await page.locator('.kgr-player').waitFor();
    await page.waitForFunction(() => !document.querySelector('#grapher-generate').disabled);
    assert.equal(requests.at(-1).type, type);
    assert.equal(requests.at(-1).states[0].P, 100);
    assert.equal(requests.at(-1).states[1].x, 1);
  }
  console.log('ok six diagram selections and editable labeled sample requests');
  const player = page.locator('.kgr-player');
  assert.equal(await player.locator('script,foreignObject,image').count(), 0);
  assert.equal(await page.evaluate(() => window.grapherXss), undefined);
  assert.equal(await player.locator('use[href^="javascript:"]').count(), 0);
  assert.equal(await player.locator('details').getAttribute('open'), '');
  assert.match(await player.locator('.kgr-meta').textContent(), /logarithmic/);
  await player.locator('[data-action="play"]').click();
  await page.waitForFunction(() => { const p = document.querySelector('.kgr-player'); return +p.dataset.progress > .25 && +p.dataset.progress < .8; });
  await player.locator('[data-action="play"]').click();
  const halfway = await player.evaluate(el => ({ progress: +el.dataset.progress, index: +el.dataset.step, playing: el.dataset.playing, offset: +el.querySelector('mask path').getAttribute('stroke-dashoffset'), dash: +el.querySelector('mask path').getAttribute('stroke-dasharray').split(' ')[0] }));
  assert.ok(halfway.progress > 0 && halfway.progress < 1);
  assert.ok(halfway.offset > 0 && halfway.offset < halfway.dash, 'literal halfway stroke mask');
  assert.equal(halfway.playing, 'false');
  await page.waitForTimeout(160);
  assert.equal(await player.getAttribute('data-progress'), String(halfway.progress), 'pause freezes the stroke');
  await page.screenshot({ path: path.join(output, 'halfway-paused.png'), fullPage: true });
  await player.locator('[data-action="next"]').click();
  assert.equal(await player.getAttribute('data-step'), '0');
  assert.equal(await player.getAttribute('data-progress'), '1');
  await player.locator('[data-action="next"]').click();
  assert.equal(await player.getAttribute('data-step'), '1');
  assert.match(await player.locator('.kgr-current').textContent(), /phase boundary/);
  await player.locator('[data-action="back"]').click();
  assert.equal(await player.getAttribute('data-step'), '0');
  await player.locator('[data-action="restart"]').click();
  assert.equal(await player.getAttribute('data-step'), '-1');
  await player.locator('button[data-step="3"]').click();
  assert.equal(await player.getAttribute('data-step'), '3');
  assert.equal(await player.locator('path[stroke-dasharray="6 4"]').count(), 1, 'dashed process style preserved');
  assert.equal(await player.locator('[data-action="next"]').isDisabled(), true);
  await player.locator('summary').click();
  assert.equal(await player.locator('details').getAttribute('open'), null);
  await player.locator('summary').click();
  await player.locator('[aria-label="Drawing speed"]').selectOption('2');
  await player.locator('[data-action="restart"]').click();
  await player.locator('[data-action="play"]').click();
  await page.waitForFunction(() => +document.querySelector('.kgr-player').dataset.step >= 1, { timeout: 4000 });
  await player.locator('[data-action="play"]').click();
  console.log('ok halfway line drawing, pause, next/back/restart, speed, checklist synchronization and dashed paths');

  await page.evaluate(async (data) => {
    const host = document.createElement('div'); host.id = 'two-graphs'; document.body.append(host);
    for (let i = 0; i < 2; i++) { const child = document.createElement('div'); host.append(child); await KelvinGrapher.mount(child, data.spec, { api: async () => data }); }
  }, fixture({ fluid: 'water', type: 'Pv' }));
  assert.equal(await page.evaluate(() => { const ids = [...document.querySelectorAll('.kgr-player [id]')].map(e => e.id); return ids.length === new Set(ids).size; }), true);
  assert.equal(await page.evaluate(() => [...document.querySelectorAll('.kgr-player svg')].every(svg => [...svg.querySelectorAll('*')].every(el => [...el.attributes].every(a => { const m = a.value.match(/^url\(#([^)]*)\)$/); return !m || !!svg.querySelector('[id="' + m[1] + '"]'); })))), true);
  assert.equal(await page.locator('#two-graphs svg use').evaluateAll(uses => uses.filter(u => u.getAttribute('href') || u.getAttribute('xlink:href')).every(u => (u.getAttribute('href') || u.getAttribute('xlink:href')).startsWith('#kgr-'))), true);
  console.log('ok multiple mounts, scoped SVG identifiers/clip paths/markers/glyph references, hostile SVG stripped');

  await page.addScriptTag({ url: origin + '/figures.js' });
  await page.evaluate(async (data) => {
    const host = document.createElement('div'); host.id = 'chat-graph'; const pre = document.createElement('pre'), code = document.createElement('code'); code.className = 'language-kelvin-grapher'; code.textContent = JSON.stringify(data.spec); pre.append(code); host.append(pre); document.body.append(host); KelvinFigures.render(host, { api: async () => data });
  }, fixture({ fluid: 'water', type: 'Ts' }));
  await page.locator('#chat-graph .kgr-player').waitFor();
  assert.equal(await page.locator('#chat-graph pre').count(), 0);
  console.log('ok chat fenced-block integration');

  const before = requests.length;
  await page.locator('.kgr-state-row').first().locator('select').nth(1).selectOption('P');
  await page.locator('#grapher-generate').click();
  assert.match(await page.locator('#grapher-form-status').textContent(), /two different properties/);
  assert.equal(requests.length, before, 'invalid duplicate properties never sent');
  await page.locator('#grapher-sample').click();
  mode = 'error'; await page.locator('#grapher-generate').click();
  await page.locator('#grapher-output .kgr-error').waitFor();
  assert.match(await page.locator('#grapher-output').textContent(), /endpoint pressures/);
  mode = 'auth'; await page.locator('#grapher-generate').click();
  await page.locator('#grapher-output a[href^="/dev-login"]').waitFor();
  mode = 'ok';
  console.log('ok client validation, actionable server error and authentication link');

  const reduced = await pageFor({ reducedMotion: 'reduce' });
  await reduced.locator('#grapher-sample').click(); await reduced.locator('#grapher-generate').click();
  await reduced.locator('.kgr-player').waitFor();
  assert.equal(await reduced.locator('[data-action="play"]').isDisabled(), true);
  await reduced.locator('[data-action="next"]').click();
  assert.equal(await reduced.locator('.kgr-player').getAttribute('data-progress'), '1');
  assert.match(await reduced.locator('.kgr-motion-note').textContent(), /Reduced motion/);
  const mobile = await pageFor({ viewport: { width: 390, height: 844 } });
  await mobile.locator('#grapher-sample').click(); await mobile.locator('#grapher-generate').click();
  await mobile.locator('.kgr-player').waitFor();
  await mobile.locator('button[data-step="3"]').click();
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no page overflow on mobile');
  assert.ok(await mobile.locator('.kgr-plot').evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'the complete default graph fits without horizontal hunting');
  await mobile.getByRole('button', { name:'Expand diagram', exact:true }).click();
  await mobile.getByRole('button', { name:'Enlarge labels', exact:true }).click();
  assert.ok(await mobile.locator('.kdiagram-view').evaluate(el => el.scrollWidth > el.clientWidth), 'large labels remain inspectable in the optional expanded view');
  await mobile.keyboard.press('Escape');
  assert.equal(await mobile.locator('.kgr-player').getAttribute('data-step'), '3', 'expanding preserves the drawing step');
  await mobile.screenshot({ path: path.join(output, 'mobile-complete.png'), fullPage: true });
  console.log('ok reduced-motion manual controls and mobile layout');
  for (const type of ['Pv', 'PT', 'Hs']) {
    const samplePath = path.join(root, 'data', `grapher-sample-${type}.json`);
    if (!fs.existsSync(samplePath)) continue;
    const data = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
    const actual = await pageFor();
    await actual.evaluate(async data => {
      const form = document.getElementById('grapher-form'); form.remove();
      window.actualPlayer = await KelvinGrapher.mount(document.getElementById('grapher-output'), data.spec, { api: async () => data });
    }, data);
    assert.equal(await actual.locator('.kgr-error').count(), 0, 'real Python SVG accepted');
    await actual.locator(`button[data-step="${data.steps.length - 1}"]`).click();
    assert.equal(await actual.locator('.kgr-plot svg').count(), 1);
    assert.match(await actual.locator('.kgr-plot svg').textContent(), /Critical point/);
    assert.match(await actual.locator('.kgr-plot svg').textContent(), /kPa/);
    assert.doesNotMatch(await actual.locator('.kgr-plot svg').textContent(), /mathdefault|\$\\|\{10\^/);
    assert.ok(await actual.locator('.kgr-plot svg text').evaluateAll(nodes => nodes.some(el => parseFloat(getComputedStyle(el).fontSize) < 11)), 'Matplotlib font-size styles retained');
    await actual.screenshot({ path: path.join(output, `actual-${type}-complete.png`), fullPage: true });
    await actual.locator('[data-action="restart"]').click();
    await actual.locator('button[data-step="1"]').click();
    await actual.locator('[data-action="play"]').click();
    await actual.waitForFunction(() => { const p = document.querySelector('.kgr-player'); return +p.dataset.step === 2 && +p.dataset.progress > .3 && +p.dataset.progress < .8; });
    await actual.locator('[data-action="play"]').click();
    assert.ok(await actual.locator('.kgr-plot svg [mask]').count() > 0, 'actual boundary has a partial-drawing mask');
    await actual.screenshot({ path: path.join(output, `actual-${type}-halfway.png`), fullPage: true });
    if (type === 'Pv') {
      await actual.setViewportSize({ width: 390, height: 844 });
      await actual.locator(`button[data-step="${data.steps.length - 1}"]`).click();
      assert.equal(await actual.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await actual.screenshot({ path: path.join(output, 'actual-Pv-mobile.png'), fullPage: true });
    }
    await actual.close();
    console.log(`ok actual Python ${type} SVG, font styles, phase annotations and boundary animation`);
  }
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log('All grapher browser checks passed');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
