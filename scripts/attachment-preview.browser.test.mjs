// Actual attachment review UI, mocked extraction/storage, no model or student data.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const original = String.raw`## Piston and cylinder

A gas expands against **constant pressure**. The initial pressure is [?] kPa.

- Neglect kinetic energy.
- Find the work and final temperature.

| State | Pressure |
| --- | --- |
| 1 | 200 kPa |
| 2 | 180 kPa |

The mass is $m = 2$ kg and $T_1 = 300$ K.

$$W = \frac{120}{3} - 5$$

$$\dot{Q} - \dot{W} = \dot{m}(h_2-h_1)$$

An unusual equation: $\sqrt[3]{x+y}$.

Check [unreadable] against the original.`;
let attachment = { id: 'problem', name: 'problem.png', status: 'needs_review', source: 'extracted', markdown: original };
const saves = [], uploads = [], messages = [];
const originalImage = createCanvas(720, 600), ctx = originalImage.getContext('2d');
ctx.fillStyle = '#f8f5ed'; ctx.fillRect(0, 0, 720, 600);
ctx.fillStyle = '#273c4d'; ctx.font = 'bold 25px sans-serif'; ctx.fillText('Piston and cylinder — example problem', 28, 45);
ctx.font = '20px sans-serif';
for (const [i, line] of ['A gas expands against constant pressure.', 'Initial pressure: 200 kPa. Mass: 2 kg.', 'Initial temperature: 300 K.', 'Neglect kinetic energy.', 'Find the work and final temperature.', '', 'Check the extracted text before sending.'].entries()) ctx.fillText(line, 28, 90 + i * 35);
ctx.lineWidth = 4; ctx.strokeStyle = '#526d82'; ctx.strokeRect(230, 380, 200, 160);
ctx.fillStyle = '#d0e8f2'; ctx.fillRect(234, 432, 192, 104); ctx.fillStyle = '#9baab5'; ctx.fillRect(230, 408, 200, 24);
ctx.fillStyle = '#273c4d'; ctx.font = '20px sans-serif'; ctx.fillText('gas', 310, 490);
ctx.beginPath(); ctx.moveTo(330, 408); ctx.lineTo(330, 350); ctx.stroke();
const png = originalImage.toBuffer('image/png');
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://test');
  const json = (value) => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(value)); };
  if (url.pathname === '/api/me') return json({ user: { id: 'test', name: 'Test Student' }, profile: { onboarded: true, default_style: 'office-hours' } });
  if (url.pathname === '/api/styles') return json([{ id: 'office-hours', name: 'Guided tutor', available: true, default: true }]);
  if (url.pathname === '/api/me/usage') return json({ percent: 0, state: 'normal' });
  if (url.pathname === '/api/conversations') return json(req.method === 'POST' ? { id: 'chat', title: 'Preview test' } : [{ id: 'chat', title: 'Preview test' }]);
  if (url.pathname === '/api/conversations/chat') return json({ id: 'chat', messages: [], attachments: [] });
  if (url.pathname === '/api/attachments/problem/file') { res.writeHead(200, { 'Content-Type': 'image/png' }); res.end(png); return; }
  if (url.pathname === '/api/attachments' && req.method === 'POST') {
    for await (const chunk of req) {} uploads.push(url.searchParams.get('name'));
    return json(attachment);
  }
  if (url.pathname === '/api/attachments/problem') {
    if (req.method === 'PATCH') {
      let body = ''; for await (const chunk of req) body += chunk;
      const data = JSON.parse(body); saves.push(data);
      attachment = { ...attachment, markdown: data.markdown, status: 'confirmed', source: 'edited' };
    }
    return json(attachment);
  }
  if (url.pathname.endsWith('/messages')) { messages.push(true); return json({}); }
  if (url.pathname.startsWith('/api/')) return json({});
  const file = path.resolve(root, 'public', '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(path.join(root, 'public') + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.woff2': 'font/woff2' }[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const output = path.join(root, 'data', 'attachment-ui');
fs.mkdirSync(output, { recursive: true });
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(() => window.KelvinAttachments && document.querySelector('#attModal'));
  await page.evaluate(() => window.KelvinAttachments.openReview('problem'));
  const preview = page.locator('#attPreview');
  await preview.waitFor();
  assert.equal(await page.locator('#attEditor, #attModal textarea').count(), 0, 'no raw source editor');
  assert.equal(await preview.getAttribute('contenteditable'), 'true');
  assert.equal(await preview.locator('table td').count(), 4);
  assert.equal(await preview.locator('li').count(), 2);
  assert.equal(await preview.locator('.att-math-mfrac').count(), 1);
  assert.equal(await preview.locator('.att-math[contenteditable=false]').count(), 1, 'unsupported notation stays intact');
  await page.getByRole('button', { name: 'Looks right', exact: true }).click();
  assert.equal(saves[0].markdown, original, 'untouched source is byte-for-byte unchanged');
  console.log('ok  single formatted editor, original comparison, exact unchanged math/markup');

  await page.evaluate(() => window.KelvinAttachments.openReview('problem'));
  await preview.waitFor();
  await page.locator('#attNext').click();
  assert.equal(await page.evaluate(() => getSelection().toString()), '?');
  await page.keyboard.insertText('200');
  await page.locator('#attNext').click();
  assert.equal(await page.evaluate(() => getSelection().toString()), 'unreadable');
  await page.keyboard.insertText('the temperature');
  const replace = async (locator, value) => {
    await locator.evaluate((el) => {
      document.querySelector('#attPreview').focus();
      const r = document.createRange(); r.selectNodeContents(el);
      getSelection().removeAllRanges(); getSelection().addRange(r);
    });
    await page.keyboard.insertText(value);
  };
  await replace(preview.locator('.att-math-mfrac > :nth-child(2)'), '4');
  await replace(preview.locator('.att-math-msub > :nth-child(2)').first(), '2');
  await replace(preview.locator('.att-math-mo').filter({ hasText: '−' }).first(), '+');
  await replace(preview.locator('table td').nth(3), '190 kPa');
  assert.equal(await page.locator('#attDirty').isVisible(), true);
  assert.equal(await page.locator('#attNext').isDisabled(), true);
  await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true });
  await page.locator('#attConfirm').click();
  const edited = saves.at(-1).markdown;
  assert.match(edited, /\\frac\{120\}\{4\}\+5/);
  assert.match(edited, /\{T\}_\{2\}/);
  assert.match(edited, /190 kPa/);
  assert.match(edited, /\$\\sqrt\[3\]\{x\+y\}\$/);
  assert.match(edited, /\$\$\\dot\{Q\} - \\dot\{W\} = \\dot\{m\}\(h_2-h_1\)\$\$/);
  assert.match(edited, /- Neglect kinetic energy/);
  assert.match(edited, /\*\*constant pressure\*\*/);
  assert.ok(!edited.includes('[?]') && !edited.includes('[unreadable]'));
  await page.evaluate(() => window.KelvinAttachments.openReview('problem'));
  await preview.waitFor();
  assert.equal(await preview.locator('.katex-error').count(), 0);
  assert.equal(await preview.locator('.att-math-mfrac > :nth-child(2)').textContent(), '4');
  console.log('ok  in-place prose/value/sign/subscript/fraction/table edits, unsure navigation, save/reopen');

  await replace(preview.locator('.att-math-mfrac > :nth-child(2)'), '9');
  await page.keyboard.press('Control+z');
  assert.equal(await preview.locator('.att-math-mfrac > :nth-child(2)').textContent(), '4');
  assert.match(await preview.evaluate((el) => KelvinProblemPreview.markdown(el)), /\\frac\{120\}\{4\}/);
  await page.keyboard.press('Control+y');
  assert.equal(await preview.locator('.att-math-mfrac > :nth-child(2)').textContent(), '9');
  await preview.locator('.att-math[contenteditable=false]').click();
  await page.keyboard.insertText('cube root of x plus y');
  assert.equal(await preview.locator('.att-math[contenteditable=false]').count(), 0, 'unusual equation can be selected and replaced without source editing');
  const saveCount = saves.length;
  await page.locator('#attCancel').click();
  assert.equal(saves.length, saveCount, 'cancel does not save');
  await page.evaluate(() => window.KelvinAttachments.openReview('problem'));
  await preview.waitFor();
  assert.equal(await preview.locator('.att-math-mfrac > :nth-child(2)').textContent(), '4', 'cancel restores last saved equation');
  console.log('ok  native undo/redo preserves equation metadata; cancel discards unsaved edits');

  await preview.evaluate((el) => {
    el.focus();
    const range = document.createRange(); range.selectNode(el.querySelector('.att-math-mfrac').closest('.att-math'));
    getSelection().removeAllRanges(); getSelection().addRange(range);
    const clipboard = new DataTransfer();
    el.dispatchEvent(new ClipboardEvent('copy', { clipboardData: clipboard, bubbles: true, cancelable: true }));
    range.selectNodeContents(el); range.collapse(false);
    getSelection().removeAllRanges(); getSelection().addRange(range);
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: clipboard, bubbles: true, cancelable: true }));
  });
  assert.equal(await preview.locator('.att-math-mfrac').count(), 2, 'copy/paste retains editable fraction structure');
  assert.equal((await preview.evaluate((el) => KelvinProblemPreview.markdown(el))).match(/\\frac\{120\}\{4\}/g).length, 2);
  await page.keyboard.press('Control+z');
  assert.equal(await preview.locator('.att-math-mfrac').count(), 1, 'undo removes pasted math without damaging original');
  await preview.evaluate((el) => {
    el.focus(); const range = document.createRange(); range.selectNodeContents(el); range.collapse(false);
    getSelection().removeAllRanges(); getSelection().addRange(range);
    const clipboard = new DataTransfer();
    clipboard.setData('text/html', '<math><mfrac><mn>120</mn><mn>3</mn></mfrac></math>');
    clipboard.setData('text/plain', '120 / 3');
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: clipboard, bubbles: true, cancelable: true }));
  });
  assert.match(await preview.textContent(), /120 \/ 3/);
  assert.equal(await preview.locator('math').count(), 1, 'external MathML uses plain text, not malformed math DOM');
  console.log('ok  structured math copy/paste, native undo and foreign MathML plain-text fallback');

  // Exercise native paste interception, including hostile HTML and literal typed tags.
  await preview.evaluate((el) => {
    el.focus(); const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
    getSelection().removeAllRanges(); getSelection().addRange(r);
    const dt = new DataTransfer();
    dt.setData('text/html', '<p><b>Extra data</b>: 25 kPa<img src=x onerror="window.pwned=1"><script>window.pwned=1</script><a href="javascript:alert(1)">unsafe link</a><span data-problem-math="evil" data-tex="evil">tail</span></p>');
    dt.setData('text/plain', 'Extra data: 25 kPa');
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  assert.equal(await page.evaluate(() => window.pwned), undefined);
  assert.equal(await preview.locator('script, img, [onerror], [href^="javascript:"]').count(), 0);
  assert.equal(await preview.locator('[data-tex]').count(), 0);
  await page.locator('#attConfirm').click();
  assert.match(saves.at(-1).markdown, /\*\*Extra data\*\*/);
  assert.ok(!saves.at(-1).markdown.includes('javascript:'));
  await page.evaluate(() => window.KelvinAttachments.openReview('problem'));
  await preview.waitFor();
  assert.equal(await preview.locator('script, img, [onerror]').count(), 0);
  console.log('ok  sanitized rich paste and safe persistence');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark' });
  assert.equal(await page.locator('.att-pane-original').isVisible(), false);
  await page.getByRole('tab', { name: 'Original', exact: true }).click();
  assert.equal(await page.locator('#attOriginal img').isVisible(), true);
  await page.getByRole('tab', { name: 'What Kelvin reads', exact: true }).click();
  assert.equal(await preview.isVisible(), true);
  await page.screenshot({ path: path.join(output, 'mobile-dark.png'), fullPage: true });
  await page.locator('#attCancel').click();
  await page.locator('#input').fill('Please help with this problem.');
  await page.locator('#input').evaluate(async (el) => {
    const dt = new DataTransfer();
    const canvas = document.createElement('canvas'); canvas.width = 100; canvas.height = 100;
    canvas.getContext('2d').fillText('P = 200 kPa', 2, 20);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    dt.items.add(new File([blob], 'image.png', { type: 'image/png' }));
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  await page.waitForFunction(() => window.KelvinAttachments.hasPending());
  assert.equal(uploads.length, 1, 'screenshot paste still uploads');
  assert.match(uploads[0], /^screenshot-/);
  assert.equal(await page.locator('#input').inputValue(), 'Please help with this problem.');
  assert.equal(messages.length, 0, 'editing and saving never sends chat');
  assert.deepEqual(errors, []);
  console.log('ok  mobile comparison tabs, screenshot paste, draft preservation and no auto-send');
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
