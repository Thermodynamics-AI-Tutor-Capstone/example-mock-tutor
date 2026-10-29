import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createDemoServer } from './demo-server.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const server = createDemoServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const out = path.resolve('data/compact-diagrams'); fs.mkdirSync(out, { recursive:true });
const spec = JSON.parse(fs.readFileSync('public/studio-demo.json', 'utf8'));
const diagram = { title:'Water T–s diagram', fluid:'water', axes:{x:{label:'Entropy',unit:'kJ/kg K'},y:{label:'Temperature',unit:'K'}}, states:[{label:'1',xy:[1,300]},{label:'2',xy:[6,500]}], paths:[{from:'1',to:'2',path:'straight',points:[[1,300],[6,500]]}], isobars:[], dome:{liquid:[],vapor:[]}, problems:[] };
const examples = {
  board:'```kelvin-board\n'+JSON.stringify(spec)+'\n```',
  property:'```kelvin-diagram\n{"fluid":"water","diagram":"Ts"}\n```',
  mermaid:'```mermaid\n%%{init: {"theme":"dark"}}%%\nflowchart TD\n A[Choose the system] --> B[Identify mass crossings]\n B --> C[Write the energy balance]\n C --> D[Justify assumptions]\n D --> E[Check units and signs]\n```',
};
let browser;
try {
  browser = await chromium.launch({ headless:true, ...(process.env.CHROME_EXECUTABLE ? {executablePath:process.env.CHROME_EXECUTABLE} : {}) });
  const page = await browser.newPage({ viewport:{width:1366,height:768}, colorScheme:'light', reducedMotion:'reduce' });
  const errors=[]; page.on('pageerror', error=>errors.push(error.message));
  await page.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
  await page.route('**/api/conversations/check-*',route=> {
    const kind=route.request().url().split('check-')[1];
    return route.fulfill({json:{id:'check-'+kind,title:kind,style:'office-hours',messages:[{role:'assistant',content:examples[kind]}]}});
  });
  await page.route('**/api/properties/diagram',route=>route.fulfill({json:diagram}));
  for (const kind of Object.keys(examples)) {
    await page.goto(origin+'/#/c/check-'+kind);
    await page.locator('#workspaceOpen').click();
    await page.locator('#studioBoardContent svg').waitFor();
    await page.locator('#studioBoardContent .kdiagram-expand').waitFor();
    if(kind==='board') for(let i=0;i<3;i++) await page.getByRole('button',{name:'Next step',exact:true}).click();
    const bounds=await page.locator('#studioBoardContent svg').evaluate(svg=> {
      const r=svg.getBoundingClientRect(), host=document.getElementById('studioBoardScroll').getBoundingClientRect();
      return {x:r.x,right:r.right,y:r.y,bottom:r.bottom,height:r.height,host:{x:host.x,right:host.right,y:host.y,bottom:host.bottom},minWidth:getComputedStyle(svg).minWidth};
    });
    assert.ok(bounds.x>=bounds.host.x && bounds.right<=bounds.host.right,kind+' fits workspace width');
    assert.ok(bounds.height<=380,kind+' default is compact');
    assert.ok(bounds.y>=bounds.host.y && bounds.bottom<=bounds.host.bottom,kind+' complete drawing visible without scrolling');
    await page.evaluate(()=> {const strip=document.createElement('div');strip.id='equation-space-test';strip.style.cssText='flex:0 0 150px';document.getElementById('studioBoardScroll').before(strip);});
    await page.waitForFunction(()=> {const svg=document.querySelector('#studioBoardContent svg'),host=document.getElementById('studioBoardScroll');return svg.getBoundingClientRect().bottom<=host.getBoundingClientRect().bottom;});
    await page.evaluate(()=>document.getElementById('equation-space-test').remove());
    assert.equal(await page.locator('#studioBoardContent .code-wrap').count(),0,'rendered diagram has no terminal code panel');
    await page.screenshot({path:path.join(out,kind+'-desktop.png')});
    const before=await page.locator('#studioBoardContent svg').evaluate(svg=> {window.originalDiagram=svg;return [...svg.querySelectorAll('[id]')].map(e=>e.id);});
    await page.getByRole('button',{name:'Expand diagram',exact:true}).click();
    await page.locator('.kdiagram-dialog[open]').waitFor();
    assert.equal(await page.locator('.kdiagram-dialog svg').evaluate(svg=>svg===window.originalDiagram),true,'viewer moves original SVG');
    assert.equal(await page.evaluate(()=> {const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length===new Set(ids).size;}),true,'expanded view has unique IDs');
    await page.getByRole('button',{name:'Enlarge labels',exact:true}).click();
    assert.equal(await page.locator('.kdiagram-view').getAttribute('data-zoom'),'true');
    await page.getByRole('button',{name:'Fit diagram',exact:true}).click();
    await page.keyboard.press('Escape');
    await page.locator('.kdiagram-dialog').waitFor({state:'detached'});
    assert.equal(await page.locator('.kdiagram-dialog').count(),0);
    assert.equal(await page.locator('#studioBoardContent svg').evaluate(svg=>svg===window.originalDiagram),true,'close restores original SVG');
    assert.deepEqual(await page.locator('#studioBoardContent svg').evaluate(svg=>[...svg.querySelectorAll('[id]')].map(e=>e.id)),before);
    assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Expand diagram','keyboard focus returns');
  }
  await page.emulateMedia({colorScheme:'dark'});
  await page.reload();
  await page.locator('#workspaceOpen').click();
  await page.locator('.kfig-mermaid svg').waitFor();
  const palette=await page.locator('.kfig-mermaid').evaluate(el=>({paper:getComputedStyle(el).backgroundColor,node:getComputedStyle(el.querySelector('.node rect')).fill,label:getComputedStyle(el.querySelector('.nodeLabel')).color}));
  assert.equal(palette.paper,'rgb(251, 253, 255)');
  assert.equal(palette.node,'rgb(234, 242, 252)','diagram-authored dark directive cannot override paper palette');
  assert.equal(palette.label,'rgb(0, 30, 68)');
  await page.screenshot({path:path.join(out,'mermaid-dark.png')});
  await page.setViewportSize({width:390,height:844});
  await page.goto(origin+'/#/c/check-board');
  await page.locator('.studio-figure-link').click();
  await page.locator('.kdiagram-expand').waitFor();
  const fit=await page.locator('.kboard-canvas').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,svg:el.querySelector('svg').getBoundingClientRect().width}));
  assert.ok(fit.scroll<=fit.width+1 && fit.svg<=fit.width+1,'mobile diagram no longer forces horizontal pan');
  await page.getByRole('button',{name:'Expand diagram',exact:true}).click();
  await page.screenshot({path:path.join(out,'board-mobile-expanded.png')});
  await page.getByRole('button',{name:'Close',exact:true}).click();
  await page.locator('.kdiagram-dialog').waitFor({state:'detached'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.getByRole('button',{name:'Expand diagram',exact:true}).click();
  await page.evaluate(()=>{location.hash='#/';});
  await page.locator('.kdiagram-dialog').waitFor({state:'detached'});
  assert.equal(await page.locator('#studioBoardContent svg').count(),0,'navigating away closes the viewer without reviving an old drawing');
  assert.deepEqual(errors,[]);
  console.log('ok compact complete diagrams, light paper in both themes, forced-dark Mermaid recovery, original-SVG expansion, labels zoom, Escape/focus restoration, and mobile fit');
} finally {await browser?.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
