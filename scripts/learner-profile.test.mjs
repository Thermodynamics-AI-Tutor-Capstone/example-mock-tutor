import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { randomUUID } from 'node:crypto';
for (const key of ['DATABASE_URL', 'POSTGRES_URL', 'VERCEL', 'OPENROUTER_API_KEY', 'DEEPSEEK_API_KEY']) delete process.env[key];
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-profile-'));
process.env.NEON_AUTH_BASE_URL = 'https://auth.profile.test';
globalThis.fetch = async (url, options = {}) => {
  if (String(url).startsWith(process.env.NEON_AUTH_BASE_URL)) {
    const id = /session_token=(profile-[ab])/.exec(options.headers?.cookie || '')?.[1];
    return Response.json(id ? { user: { id, name: id, email: id + '@example.test' } } : null);
  }
  throw new Error('External network disabled in learner profile tests.');
};
const { foldStudentModel, recordEvidence } = await import('../lib/student-model.js');
const { learnerProfile } = await import('../lib/learner-profile.js');
const { ensureSchema, query, closeDb } = await import('../lib/db.js');
const { handle } = await import('../lib/app.js');
const { default: recordSkill } = await import('../lib/tools/record_skill_observation.js');
const stamp = new Date().toISOString();
const row = (id, overrides = {}) => ({ kind: 'skill_observation', ref: 'energy-balance', source: 'tutor', created_at: stamp,
  data: { messageId: String(id), outcome: 'success', independence: 'independent', confidence: 'high',
    quote: 'The energy balance retains the shaft work term.', rationale: 'The student identified the physical term.', ...overrides } });
const evidence = [row(1, {knowledgeType: 'conceptual'}), row(2, {knowledgeType: 'procedural', independence: 'assisted'}), row(3)];
let profile = learnerProfile(foldStudentModel(evidence), {}, evidence);
assert.equal(profile.topics[0].label, 'Energy conservation and term selection');
const dimensions = Object.fromEntries(profile.topics[0].dimensions.map((d) => [d.id, d]));
assert.equal(dimensions.conceptual.state, 'independent');
assert.equal(dimensions.procedural.state, 'assisted');
assert.equal(dimensions.strategic.state, 'unknown');
assert.equal(dimensions.situational.state, 'unknown');
assert.equal(profile.topics[0].unclassifiedCount, 1, 'legacy evidence is not silently classified');
assert.doesNotMatch(JSON.stringify(profile), /pKnown|mastered|percent|grade/);
const contradictory = [...evidence, row(4, {knowledgeType:'conceptual', outcome:'needs_support'})];
profile = learnerProfile(foldStudentModel(contradictory), {}, contradictory);
assert.equal(profile.topics[0].state, 'mixed');
assert.equal(profile.strengths.length, 0);
assert.equal(profile.nextPractice[0], 'energy-balance');
const low = [row(10, {knowledgeType:'strategic', confidence:'low', outcome:'needs_support'})];
assert.equal(learnerProfile(foldStudentModel(low)).topics[0].state, 'unknown');
const old = learnerProfile(foldStudentModel(evidence, {now:new Date('2030-01-01')}));
assert.equal(old.strengths.length, 0, 'old success is not a current strength');
const dimensionAge = learnerProfile(foldStudentModel(evidence), {}, evidence, {now:new Date('2030-01-01')});
assert.equal(dimensionAge.topics[0].dimensions.find((d)=>d.id==='conceptual').statusLabel,'Older evidence—check again');
const repaired = [{kind:'misconception_repaired', ref:'adiabatic', source:'student',created_at:stamp,data:{by:'student'}}];
assert.equal(learnerProfile(foldStudentModel(repaired),{},repaired).misconceptions[0].statusLabel,'You marked this resolved');
console.log('ok  explicit dimensions, assistance, unknown legacy data, conflicting/old evidence and self-report provenance');

const server = http.createServer((req,res)=>handle(req,res));
await new Promise((resolve)=>server.listen(0,'127.0.0.1',resolve));
const base = `http://127.0.0.1:${server.address().port}`;
function call(id, method='GET', body) {
  return new Promise((resolve,reject)=>{
    const req=http.request(base+'/api/me/learning',{method,headers:{'content-type':'application/json',...(id?{cookie:`__Secure-neon-auth.session_token=${id}`}:{})}},(res)=>{
      let text='';res.on('data',(c)=>text+=c);res.on('end',()=>resolve({status:res.statusCode,data:JSON.parse(text)}));
    });req.on('error',reject);req.end(body?JSON.stringify(body):undefined);
  });
}
try {
  await ensureSchema();
  for(const id of ['profile-a','profile-b']) await query('INSERT INTO user_profiles (user_id,email,display_name,onboarded_at) VALUES ($1,$2,$1,now())',[id,id+'@example.test']);
  const chat = randomUUID();
  await query('INSERT INTO conversations (id,title,user_id) VALUES ($1,$2,$3)',[chat,'Profile test','profile-a']);
  await recordEvidence('profile-a',chat,evidence.map((row)=>({...row,data:{...row.data,messageId:String(100+Number(row.data.messageId))}})));
  assert.equal((await call(null)).status,401,'profile endpoint requires authentication');
  const own=await call('profile-a');
  assert.equal(own.status,200);assert.equal(own.data.profile.topics.length,1);
  assert.ok(own.data.model && own.data.markdown && own.data.tutorMarkdown,'existing settings contract retained');
  assert.equal((await call('profile-b')).data.profile.topics.length,0,'other account cannot read these observations');
  assert.equal((await call('profile-b','POST',{action:'reset_skill',ref:'energy-balance'})).status,404,'cannot reset another student’s observations');
  const reset=await call('profile-a','POST',{action:'reset_skill',ref:'energy-balance'});
  assert.equal(reset.status,200);assert.equal(reset.data.profile.topics.length,0);
  const notes=await call('profile-a','POST',{action:'add_note',about:'Entropy',belief:'unknown',note:'Please connect equations to diagrams.'});
  assert.equal(notes.data.profile.notes[0].sourceLabel,'Your note');
  assert.equal(notes.data.profile.strengths.length,0,'self-report creates no demonstrated strength');
  const quote='I retained shaft work because energy crosses that boundary.';
  async function ctx(selfCheck) {
    const {rows}=await query("INSERT INTO messages (conversation_id,role,content) VALUES ($1,'user',$2) RETURNING id",[chat,quote]);
    return {userId:'profile-a',conversationId:chat,userMessageId:rows[0].id,read:{provider:'none'},turn:{selfCheck}};
  }
  const args={skill:'energy-balance',outcome:'success',independence:'independent',confidence:'high',evidence_kind:'reasoning',knowledge_type:'conceptual',quote,rationale:'The student connects work transfer to the system boundary.'};
  assert.match((await recordSkill({...args,knowledge_type:'visual-learner'},await ctx())).error,/supported knowledge type/);
  assert.match((await recordSkill(args,await ctx({recordable:false,independence:'independent'}))).error,/no new answer/);
  const assisted=await recordSkill(args,await ctx({recordable:true,independence:'assisted'}));
  assert.equal(assisted.observation.independence,'assisted');
  assert.equal(assisted.observation.knowledgeType,'conceptual');
  const uncertain=await recordSkill(args,await ctx({recordable:true,independence:'unknown'}));
  assert.equal(uncertain.observation.independence,'unknown');
  const after = (await call('profile-a')).data.profile;
  assert.equal(after.topics[0].dimensions.find((d)=>d.id==='conceptual').state,'assisted','hinted self-check cannot become an independent strength');
  await query('UPDATE conversations SET deleted_at=now() WHERE id=$1',[chat]);
  assert.equal((await call('profile-a')).data.profile.topics.length,0,'deleted conversation evidence stops counting');
  console.log('ok  authenticated account isolation, correction/reset, independent/assisted self-check boundaries and deleted evidence');
} finally { await new Promise((resolve)=>server.close(resolve));await closeDb(); }
