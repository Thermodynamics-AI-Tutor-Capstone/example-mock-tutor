import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { foldStudentModel } from '../lib/student-model.js';
import { learnerProfile } from '../lib/learner-profile.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE?pathToFileURL(process.env.PLAYWRIGHT_MODULE).href:'playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const at=new Date().toISOString();
const rows=[
  {kind:'skill_observation',ref:'energy-balance',source:'tutor',created_at:at,conversation_id:'abc-123',data:{messageId:'1',outcome:'success',independence:'independent',confidence:'high',knowledgeType:'conceptual',quote:'I retained shaft work because energy crosses the boundary.',rationale:'Connected the term to the physical system.'}},
  {kind:'skill_observation',ref:'property-tables',source:'tutor',created_at:at,conversation_id:'abc-123',data:{messageId:'2',outcome:'success',independence:'assisted',confidence:'high',knowledgeType:'procedural',quote:'With that hint, I used the superheated table at the given pressure.',rationale:'Completed the table lookup after a prompt.'}},
  {kind:'misconception_signal',ref:'adiabatic-isentropic',source:'jev',probability:.7,created_at:at,data:{quote:'I assumed insulation alone made entropy constant.'}},
];
const fixture={profile:learnerProfile(foldStudentModel(rows),{'adiabatic-isentropic':'Adiabatic and isentropic conditions'},rows)};
const empty={profile:learnerProfile(foldStudentModel([]))};
const browser=await chromium.launch({headless:true,...(process.env.CHROME_EXECUTABLE?{executablePath:process.env.CHROME_EXECUTABLE}:{})});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1080}});
  const errors=[];page.on('pageerror',(e)=>errors.push(e.message));
  await page.setContent('<html><body style="margin:0;font:16px system-ui"><section id="aboutMePanel" style="height:100vh"></section></body></html>');
  await page.addStyleTag({path:path.join(root,'public/about-me.css')});
  await page.evaluate(({fixture,empty})=>{
    window.fixture=fixture;window.empty=empty;window.view=structuredClone(fixture);window.posted=[];window.fail=false;window.getFail=false;window.practiceTopics=[];
    window.KelvinAccount={async call(url,options){
      if(options?.method==='POST'){
        posted.push(JSON.parse(options.body));
        if(fail)return {ok:false,data:{error:'Update failed. Please try again.'}};
        if(posted.at(-1).action==='reset_skill')view=structuredClone(empty);
      }
      if(getFail)return {ok:false,status:503,data:{error:'Profile temporarily unavailable.'}};
      return {ok:true,data:structuredClone(view)};
    }};
  },{fixture,empty});
  await page.addScriptTag({path:path.join(root,'public/about-me.js')});
  await page.evaluate(()=>{KelvinAboutMe.init({panel:document.getElementById('aboutMePanel'),onPractice:(topic)=>practiceTopics.push(topic||null)});return KelvinAboutMe.show();});
  await page.getByRole('heading',{name:'Strengths you have shown'}).waitFor();
  await page.getByRole('heading',{name:'Your next learning opportunities'}).waitFor();
  assert.equal(await page.getByText('Not enough evidence',{exact:true}).count(),6);
  await page.locator('.am-details summary').first().click();
  await page.getByText('I retained shaft work because energy crosses the boundary.',{exact:true}).waitFor();
  assert.equal(await page.getByRole('link',{name:'Open this conversation'}).getAttribute('href'),'#/c/abc-123');
  await page.getByRole('button',{name:'Check my understanding'}).first().click();
  assert.deepEqual(await page.evaluate(()=>practiceTopics),['energy-balance']);
  const out=path.join(root,'data','learner-profile-review');fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,'about-me-desktop.png')});
  await page.setViewportSize({width:320,height:800});
  await page.emulateMedia({colorScheme:'dark'});
  assert.ok(await page.locator('#aboutMePanel').evaluate((el)=>el.scrollWidth<=el.clientWidth+1),'no phone horizontal overflow');
  await page.screenshot({path:path.join(out,'about-me-mobile-dark.png')});
  await page.evaluate(()=>{fail=true;});
  await page.getByRole('button',{name:'Reset observations'}).first().click();
  await page.getByRole('alert').getByText('Update failed. Please try again.').waitFor();
  assert.equal(await page.getByRole('button',{name:'Reset observations'}).first().isEnabled(),true);
  await page.evaluate(()=>{fail=false;});
  await page.getByRole('button',{name:'Reset observations'}).first().click();
  await page.getByRole('heading',{name:'Let’s build your learning picture'}).waitFor();
  assert.equal(await page.locator('.am-heading').evaluate((el)=>el===document.activeElement),true,'focus survives correction rerender');
  await page.getByLabel('Topic or goal').fill('Entropy');
  await page.getByLabel('What would help you?').fill('Connect diagrams to equations.');
  await page.getByRole('button',{name:'Save my note'}).click();
  assert.deepEqual((await page.evaluate(()=>posted)).at(-1),{action:'add_note',about:'Entropy',note:'Connect diagrams to equations.',belief:'unknown'});
  await page.evaluate(()=>{view=structuredClone(fixture);view.profile.notes=[{ref:'x',label:'<img src=x onerror="window.pwned=true">',note:'<script>window.pwned=true</script>',sourceLabel:'Your note',at:new Date().toISOString()}];return KelvinAboutMe.refresh();});
  assert.equal(await page.locator('.am-content img,.am-content script').count(),0,'student content renders as text');
  assert.equal(await page.evaluate(()=>window.pwned),undefined);
  await page.getByRole('button',{name:'This doesn’t fit'}).click();
  assert.deepEqual((await page.evaluate(()=>posted)).at(-1),{action:'dismiss_misconception',ref:'adiabatic-isentropic'});
  await page.evaluate(()=>{getFail=true;return KelvinAboutMe.refresh();});
  await page.getByRole('alert').getByText('Profile temporarily unavailable.').waitFor();
  assert.equal(await page.locator('.am-topic').count(),0,'failed reload does not retain old account data');
  await page.evaluate(()=>{getFail=false;return KelvinAboutMe.refresh();});
  await page.getByRole('heading',{name:'Strengths you have shown'}).waitFor();
  await page.evaluate(()=>{window.pendingResolve=null;KelvinAccount.call=()=>new Promise((resolve)=>pendingResolve=resolve);KelvinAboutMe.refresh();KelvinAboutMe.hide();pendingResolve({ok:true,data:empty});});
  assert.equal(await page.locator('#aboutMePanel').isVisible(),false,'late response cannot reopen hidden panel');
  assert.deepEqual(errors,[]);
  console.log('ok  evidence details, practice routing, mobile/dark layout, correction errors/focus, self-report notes, safe text, refresh and hidden-request race');
  console.log('Screenshots: '+out);
} finally {await browser.close();}
