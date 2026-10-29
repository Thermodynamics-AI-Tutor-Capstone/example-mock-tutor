// Component checks with a fixture host. The integrated app wiring is checked by the release agent.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { selfCheckCatalog } from '../lib/self-check.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let failCatalog = true, created = [];
const fixture = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>html{color-scheme:light dark}body{margin:0;font:16px/1.5 system-ui}main{max-width:1200px;margin:auto}textarea{box-sizing:border-box;width:100%;font:inherit;padding:12px}</style><link rel="stylesheet" href="/self-check.css"></head><body><main><section id="selfCheckPanel"></section><section id="selfCheckSession"></section><textarea aria-label="Chat draft">An unfinished draft stays here.</textarea></main><script src="/self-check.js"></script><script>
window.sent=[];window.busy=false;window.failSend=false;
KelvinSelfCheck.init({api:async(method,url,body)=>{const response=await fetch(url,{method,headers:{'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok)throw new Error(data.error);return data;},blocked:()=>window.busy,
onOpenConversation:async(conversation)=>{KelvinSelfCheck.hide();KelvinSelfCheck.setConversation(conversation);location.hash='#/c/'+conversation.id;},
onSend:async(content,options)=>{if(window.failSend)throw new Error('Fixture connection failed; try again.');window.sent.push({content,options});KelvinSelfCheck.handleEvent({type:'self_check',selfCheck:{topicId:'entropy-balance',caseId:'insulated-turbine',title:'Separate entropy transfer and generation',active:options.selfCheckAction!=='finish',assisted:options.selfCheckAction!=='finish',attempted:false}});}});
KelvinSelfCheck.route();window.addEventListener('hashchange',()=>{if(!KelvinSelfCheck.route())KelvinSelfCheck.hide();});
</script></body></html>`;
const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://fixture').pathname;
  const json = (value, status = 200) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)); };
  if (pathname === '/api/self-check') { if (failCatalog) { failCatalog = false; return json({ error: 'Topics could not load. Try again.' }, 503); } return json({ topics: selfCheckCatalog() }); }
  if (pathname === '/api/conversations') {
    let raw = ''; for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw); created.push(body); const topic = selfCheckCatalog().find((item) => item.id === body.selfCheck);
    return json({ id: 'self-check-conversation', selfCheck: { topicId: topic.id, title: topic.title, caseId: body.selfCheckCase, active: true, assisted: false, attempted: false } }, 201);
  }
  if (pathname === '/') { res.writeHead(200, { 'content-type': 'text/html' }); res.end(fixture); return; }
  if (['/self-check.js','/self-check.css'].includes(pathname)) { res.writeHead(200, { 'content-type': pathname.endsWith('js') ? 'text/javascript' : 'text/css' }); res.end(fs.readFileSync(path.join(root, 'public', pathname))); return; }
  res.writeHead(404); res.end();
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } }); const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  await page.goto(origin + '/#/self-check?topic=entropy-balance');
  await page.getByRole('alert').filter({hasText:'Topics could not load'}).waitFor();
  await page.getByRole('button', {name:'Try again',exact:true}).click();
  await page.getByRole('heading', {name:'Check my understanding'}).waitFor();
  await page.getByRole('button', {name:'Separate entropy transfer and generation'}).waitFor();
  assert.match(await page.locator('.self-check-question').textContent(), /insulated turbine/i);
  await page.getByRole('button', {name:'Another context',exact:true}).focus(); await page.keyboard.press('Enter');
  assert.match(await page.locator('.self-check-question').textContent(), /paddle wheel/i);
  assert.equal(created.length, 0, 'Selecting a topic or case never submits an answer');
  await page.getByRole('button', {name:'First case',exact:true}).click();
  const output = path.join(root, 'data', 'self-check-ui'); fs.mkdirSync(output, {recursive:true});
  await page.screenshot({path:path.join(output,'desktop.png'),fullPage:true});
  await page.getByRole('button', {name:'Start this self-check',exact:true}).click();
  await page.getByRole('button', {name:'Give me a hint',exact:true}).waitFor();
  assert.deepEqual(created, [{selfCheck:'entropy-balance',selfCheckCase:'insulated-turbine'}]);
  assert.equal(await page.getByLabel('Chat draft').inputValue(),'An unfinished draft stays here.');
  await page.getByRole('button', {name:'Give me a hint',exact:true}).click();
  await page.getByText('Practicing with support',{exact:true}).waitFor();
  assert.deepEqual(await page.evaluate(()=>sent[0].options),{selfCheckAction:'hint',preserveDraft:true});
  await page.getByRole('button', {name:'Explain it',exact:true}).click();
  assert.equal(await page.evaluate(()=>sent[1].options.selfCheckAction),'explain');
  await page.evaluate(()=>{window.failSend=true;});
  await page.getByRole('button', {name:'Explain it',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'Fixture connection failed'}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Explain it',exact:true}).isEnabled(),true);
  await page.evaluate(()=>{window.failSend=false;window.busy=true;KelvinSelfCheck.setBusy(false);});
  assert.equal(await page.getByRole('button',{name:'Give me a hint',exact:true}).isDisabled(),true);
  await page.evaluate(()=>{window.busy=false;KelvinSelfCheck.setBusy(false);});
  await page.getByRole('button', {name:'Finish self-check',exact:true}).click();
  assert.equal(await page.locator('#selfCheckSession').isVisible(),false);
  await page.goto(origin + '/#/self-check?topic=property-tables');
  assert.match(await page.locator('.self-check-question').textContent(),/saturation temperature/);
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);
  await page.screenshot({path:path.join(output,'mobile.png'),fullPage:true});
  await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
  await page.screenshot({path:path.join(output,'mobile-dark.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('ok  load recovery, topic links, keyboard cases, no auto-submit, persisted draft contract, help/finish actions, busy/error states, mobile and dark UI');
} finally { await browser?.close(); server.closeAllConnections(); await new Promise((resolve)=>server.close(resolve)); }
