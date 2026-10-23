// Independent UI comparison by the Grapher reviewer. Local fixture server; no model calls.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { startLayoutServer } from './layout-review-server.mjs';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const out = path.resolve(import.meta.dirname, '../data/layout-review/independent'); fs.mkdirSync(out, { recursive: true });
const { server, origin, sent } = await startLayoutServer();
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXECUTABLE });
const observations = [], failures = [], errors = [];
try {
  for (const candidate of ['baseline','fluid','readable']) for (const width of [1680, 960, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 980 } });
    page.on('pageerror', e => errors.push({candidate,width,error:e.message}));
    await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    await page.goto(`${origin}/?layout=${candidate}#/c/layout-review`);
    await page.locator('.msg.assistant .kgr-player').waitFor();
    await page.locator('#input').fill('Keep my derivation: ');
    await page.locator('#equationToggle').click();
    await page.locator('#equationPanel').waitFor({ state: 'visible' });
    await page.evaluate(() => document.getElementById('scroller').scrollTop = 0);
    const metrics = await page.evaluate(() => {
      const rect = q => { const b=document.querySelector(q).getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom}; };
      const p=document.querySelector('.msg.assistant .md > p'), walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT), lines=new Map(); let n;
      while(n=walker.nextNode()) for(let i=0;i<n.length;i++){const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);const b=r.getBoundingClientRect();if(b.width){const y=Math.round(b.y);lines.set(y,(lines.get(y)||0)+1);}}
      return {thread:rect('.thread'),prose:rect('.msg.assistant .md > p'),toolbar:rect('#equationPanel'),scroller:rect('#scroller'),composer:rect('#composer'),topbar:rect('.topbar'),maxLineChars:Math.max(...lines.values()),bodyOverflow:document.documentElement.scrollWidth-innerWidth};
    });
    const checks = [];
    const check=(name,value)=>{checks.push({name,passed:!!value});if(!value)failures.push({candidate,width,name});};
    check('no document horizontal overflow',metrics.bodyOverflow<=0);
    check('composer remains within viewport',metrics.composer.right<=width+1 && metrics.composer.bottom<=981);
    await page.screenshot({ path:path.join(out,`${candidate}-${width}-toolbar.png`),fullPage:true });
    // Symbol insertion must preserve the existing draft and leave Send under user control.
    const sends=sent.length;
    await page.locator('#equationSymbols button[aria-label="Pressure"]').click();
    const draft=await page.locator('#input').inputValue();
    check('symbol inserted in draft',draft.startsWith('Keep my derivation: ')&&draft.includes('\\(P'));
    check('symbol did not auto-send',sent.length===sends);
    await page.locator('#input').press('Escape');
    check('Escape closes palette',await page.locator('#equationPanel').isHidden());
    await page.locator('#equationToggle').click();
    await page.locator('#equationCategories button').filter({hasText:'Properties'}).first().click();
    const first=page.locator('#equationSymbols button').first(); await first.focus(); await first.press('Enter');
    check('keyboard insertion', (await page.locator('#input').inputValue()).includes('c_p'));
    const withEquation=await page.locator('#input').inputValue();
    await page.locator('#input').press('Escape');
    await page.locator('#propertyTablesBtn').click();
    await page.locator('#propertyTableDock').waitFor({state:'visible'});
    const dock=await page.locator('#propertyTableDock').boundingBox();
    check('property dock within viewport',dock.x>=-1&&dock.x+dock.width<=width+1&&dock.y+dock.height<=981);
    await page.screenshot({path:path.join(out,`${candidate}-${width}-dock.png`),fullPage:true});
    await page.locator('#closePropertyTables').click();
    check('property dock preserves draft',await page.locator('#input').inputValue()===withEquation);
    await page.locator('#checkWorkBtn').click();
    check('check work toggles',await page.locator('#checkWorkBtn').getAttribute('aria-pressed')==='true');
    await page.locator('#sendBtn').click();
    await page.waitForFunction(()=>document.querySelector('.msg.assistant:last-of-type')?.textContent.includes('Fixture received'));
    check('check-work reaches submission',sent.at(-1)?.checkWork===true);
    observations.push({candidate,width,...metrics,checks});
    console.log(candidate,width,JSON.stringify({thread:metrics.thread.width,prose:metrics.prose.width,maxLineChars:metrics.maxLineChars,toolbar:metrics.toolbar.height,scroller:metrics.scroller.height,failures:checks.filter(c=>!c.passed)}));
    await page.close();
  }
  fs.writeFileSync(path.join(out,'review.json'),JSON.stringify({observations,failures,errors},null,2));
  assert.deepEqual(failures,[]); assert.deepEqual(errors,[]);
  console.log('Independent layout interaction checks passed');
} finally {await browser.close(); await new Promise(resolve=>server.close(resolve));}
