import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
// Always use a fresh embedded test DB, never a configured class or development database.
delete process.env.DATABASE_URL; delete process.env.POSTGRES_URL; delete process.env.VERCEL;
process.env.PGLITE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kelvin-skills-'));
const { query, closeDb, ensureSchema } = await import('../lib/db.js');
const { foldStudentModel, loadStudentModel, studentModelSection, emptyModel } = await import('../lib/student-model.js');
const { foldSkillObservations, skillAdaptationSection } = await import('../lib/student-skills.js');
const { studentBaselineSection } = await import('../lib/student-baseline.js');
const { applyLearningEdit, studentDocument } = await import('../lib/learning.js');
const { default: record } = await import('../lib/tools/record_skill_observation.js');
const { loadStyles } = await import('../lib/styles.js');
const { applyPolicy } = await import('../lib/policy.js');
const now = new Date('2026-10-21T12:00:00Z');
const event = (id, outcome = 'success', independence = 'independent', ref = 'energy-balance', confidence = 'high') => ({
  kind: 'skill_observation', ref, source: 'tutor', conversation_id: 'chat-' + id,
  created_at: '2026-10-20T12:00:00Z', data: { messageId: String(id), outcome, independence, confidence,
    quote: 'I chose a closed system, so no mass crosses the boundary.', rationale: 'The student justified the boundary and retained the appropriate energy terms.' },
});
const strength = [1,2,3].map((id) => event(id));
assert.equal(foldSkillObservations(strength, {now})['energy-balance'].status, 'demonstrated_independently');
assert.equal(foldSkillObservations([...strength,event(4,'needs_support')], {now})['energy-balance'].status, 'mixed');
const recovery = [...strength,event(4,'needs_support'),...[5,6,7,8,9].map((id) => event(id))];
assert.equal(foldSkillObservations(recovery, {now})['energy-balance'].status, 'demonstrated_independently', 'new evidence revises old difficulty');
assert.equal(foldSkillObservations([event(1,'success','assisted'),event(2,'success','assisted')], {now})['energy-balance'].status, 'assisted_practice');
assert.equal(foldSkillObservations([event(1,'needs_support','unknown','energy-balance','low')], {now})['energy-balance'].status, 'uncertain');
assert.equal(foldSkillObservations([event(1),event(1),event(1)], {now})['energy-balance'].totalObservations, 1, 'duplicate messages do not build strength');
assert.deepEqual(foldStudentModel(strength, {now}).kcs, {}, 'skill observations never inflate BKT');
const contrasting = foldStudentModel([...strength,event(4,'needs_support','independent','units-dimensions'),event(5,'needs_support','independent','units-dimensions')], {now});
assert.equal(contrasting.skills['units-dimensions'].status, 'targeted_support');
assert.equal(contrasting.skills['energy-balance'].status, 'demonstrated_independently');
assert.match(skillAdaptationSection(contrasting.skills), /Units and dimensional consistency: recent work suggests targeted support/);
assert.match(skillAdaptationSection(contrasting.skills), /Energy conservation and term selection: demonstrated independently/);
assert.equal(foldSkillObservations(strength, {now:new Date('2027-01-01')})['energy-balance'].stale, true);
assert.deepEqual(foldSkillObservations([...strength,{kind:'skill_reset',ref:'energy-balance'}], {now}), {});
const baseline = studentBaselineSection();
assert.match(baseline, /not observed student evidence/);
assert.match(baseline, /PHYS 212.*not a direct/);
assert.deepEqual(emptyModel().skills, {});
const context = studentModelSection(contrasting);
assert.match(context, /simple arithmetic.*directly/);
assert.match(context, /missing dot or harmless shorthand is not evidence of weakness/);
assert.doesNotMatch(context, /Confirm one with the student before relying/);
assert.match(studentDocument(contrasting), /Starting point, not an assessment/);
const guided = loadStyles().styles.find((s) => s.id === 'office-hours');
const { turn } = applyPolicy({ style: guided, state:{}, read: {provider:'none',intent:{label:'fact'},misconceptions:[]} });
assert.equal(turn.ceiling, guided.state.maxRung, 'observations introduce no help gate');
console.log('ok  topic-specific strengths/support, contradictions/recovery, assistance, uncertainty, stale/reset, prior separation and no gate');

try {
  await ensureSchema();
  const userA = 'skill-test-a', userB = 'skill-test-b';
  const conversationA = randomUUID(), conversationA2 = randomUUID(), conversationB = randomUUID();
  for (const [id,user] of [[conversationA,userA],[conversationA2,userA],[conversationB,userB]]) await query('INSERT INTO conversations (id,title,user_id) VALUES ($1,$2,$3)',[id,'Skill test',user]);
  const own = 'I chose a closed system because no mass crosses the boundary.';
  async function message(conversation, content = own, role = 'user') {
    return (await query('INSERT INTO messages (conversation_id,role,content) VALUES ($1,$2,$3) RETURNING id',[conversation,role,content])).rows[0].id;
  }
  const baseArgs = {skill:'system-boundary',outcome:'success',independence:'independent',confidence:'high',evidence_kind:'reasoning',quote:own,rationale:'Correctly justified the closed-system boundary from the absence of mass transfer.'};
  const ctx = (id,conversationId=conversationA,userId=userA) => ({userId,conversationId,userMessageId:id,read:{provider:'jev',showsWork:.9},turn:{attemptCounted:true}});
  const id1 = await message(conversationA);
  const first = ctx(id1);
  assert.equal((await record(baseArgs,first)).ok, true);
  assert.match((await record(baseArgs,first)).error,/Already observed/);
  assert.equal((await record(baseArgs,ctx(id1))).ok, false, 'new request context still cannot duplicate persisted evidence');
  assert.match((await record({...baseArgs,skill:'energy-balance',quote:'This quote was invented.'},ctx(id1))).error,/current student message/);
  assert.match((await record(baseArgs,ctx(id1,conversationA,userB))).error,/current student message/, 'cannot attribute another user’s message');
  assert.match((await record({...baseArgs,skill:'not-a-skill'},ctx(id1))).error,/supported/);
  assert.match((await record({...baseArgs,evidence_kind:'typo'},ctx(id1))).error,/not notation/);
  assert.match((await record(baseArgs,{...ctx(id1),read:{provider:'jev',showsWork:.1},turn:{attemptCounted:false}})).error,/not a skill assessment/);
  assert.deepEqual((await loadStudentModel(userB)).skills, {});
  const id2 = await message(conversationA2);
  await record(baseArgs,ctx(id2,conversationA2));
  assert.equal((await loadStudentModel(userA)).skills['system-boundary'].totalObservations,2,'evidence crosses conversations for same student');
  const capped=ctx(await message(conversationA));
  for (const skill of ['system-boundary','energy-balance','mass-balance']) assert.equal((await record({...baseArgs,skill},capped)).ok,true);
  assert.match((await record({...baseArgs,skill:'units-dimensions'},capped)).error,/At most three/);
  assert.equal((await record({...baseArgs,skill:'units-dimensions'},ctx(capped.userMessageId))).ok,false,'persisted turn cap survives request retry');
  await message(conversationA2,own,'assistant');
  const copiedId = await message(conversationA2);
  const copied = await record(baseArgs,ctx(copiedId,conversationA2));
  assert.equal(copied.observation.independence,'assisted','repeating a tutor step is never independent');
  await closeDb();
  assert.ok((await loadStudentModel(userA)).skills['system-boundary'],'stored evidence survives DB close/reopen');
  await query('UPDATE conversations SET deleted_at=now() WHERE id=$1',[conversationA2]);
  const active = (await loadStudentModel(userA)).skills['system-boundary'];
  assert.equal(active.observations.some((o)=>o.conversationId===conversationA2),false,'deleted chat evidence stops counting');
  const reset = await applyLearningEdit(userA,{action:'reset_skill',ref:'system-boundary'});
  assert.equal(reset.model.skills['system-boundary'],undefined);
  await assert.rejects(applyLearningEdit(userB,{action:'reset_skill',ref:'energy-balance'}),/not in your record/);
  const newId = await message(conversationA);
  await record(baseArgs,ctx(newId));
  assert.equal((await loadStudentModel(userA)).skills['system-boundary'].totalObservations,1,'fresh observations can revise a reset record');
  console.log('ok  persisted quotes/ownership, turn dedup/cap, cross-chat continuity, assisted copy guard, restart, deletion, reset and user isolation');
} finally { await closeDb(); }
