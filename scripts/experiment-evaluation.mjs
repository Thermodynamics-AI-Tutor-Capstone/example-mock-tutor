// Independent, deterministic comparison. Never checks out or writes main; never calls a model.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = '52b0d6d42eff108316fadcb76ae5638aa0fec9dd';
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
assert.equal(git('rev-parse', 'origin/main'), base, 'Review a changed main baseline before changing this fixed comparison');
const output = path.join(root, 'data', 'experiment-evaluation');
const baseline = path.join(output, base);
fs.mkdirSync(baseline, { recursive: true });
const archive = path.join(output, 'baseline.tar');
execFileSync('git', ['archive', '--format=tar', '--output=' + archive, base, 'lib', 'agent', 'public', 'package.json'], { cwd: root });
execFileSync('tar', ['-xf', archive, '-C', baseline]);
const source = (dir, file) => fs.existsSync(path.join(dir, file)) ? fs.readFileSync(path.join(dir, file), 'utf8') : '';
const versions = [['main', baseline], ['experiment', root]];
const report = { baselineCommit: base, experimentHead: git('rev-parse', 'HEAD'), workingTreeIncluded: true, evaluatedAt: new Date().toISOString(), rubric: { 0: 'Absent or conflicts with the requested behavior', 1: 'Partial support or only instructional/static evidence', 2: 'Behavior demonstrated by a deterministic scenario' }, versions: {}, liveModelQuality: 'Unmeasured: no live model calls', studentLearning: 'Unmeasured: requires independent student outcomes' };

for (const [name, dir] of versions) {
  const policy = await import(pathToFileURL(path.join(dir, 'lib/policy.js')));
  const styles = await import(pathToFileURL(path.join(dir, 'lib/styles.js')));
  const model = await import(pathToFileURL(path.join(dir, 'lib/student-model.js')));
  const active = styles.loadStyles().styles.filter((style) => style.enabled);
  const style = active.find((entry) => entry.id === 'office-hours');
  assert.ok(style);
  const cases = ['fact', 'wants_answer', 'stuck_on_problem'].map((intent) => {
    const read = { provider: 'jev', intent: { label: intent }, showsWork: 0, completeAttempt: 0, wantsAnswer: 1, frustration: { score: 3 }, givingUp: .9, misconceptions: [] };
    let state = { problem: 'Calculate 150 divided by 5 in the current solution', status: 'working', attempts: 0, completeAttempt: false };
    const observations = [];
    for (let turn = 0; turn < 4; turn++) {
      const result = policy.applyPolicy({ style, state, read });
      state = result.state;
      observations.push({ ceiling: result.turn.ceiling, status: state.status, answerDirectly: result.turn.answerDirectly, completeAttempt: state.completeAttempt });
    }
    return { classifierIntent: intent, observations };
  });
  const at = '2026-10-21T12:00:00.000Z';
  const evidence = (ref, correct, independent) => ({ kind: 'practice_result', ref, created_at: at, data: { correct, independent } });
  const profileA = [evidence('algebra', true, true), evidence('algebra', true, true), evidence('algebra', true, true), evidence('energy-balance', false, true)];
  const profileB = [evidence('energy-balance', true, true), evidence('energy-balance', true, true), evidence('energy-balance', true, true), evidence('algebra', false, true)];
  const fold = (rows) => model.foldStudentModel(rows, { now: new Date(at) });
  const a = fold(profileA), b = fold(profileB);
  assert.equal(a.kcs.algebra.mastered, true);
  assert.equal(a.kcs['energy-balance'].mastered, false);
  assert.equal(b.kcs.algebra.mastered, false);
  assert.equal(b.kcs['energy-balance'].mastered, true);
  const assisted = fold(Array.from({ length: 5 }, () => evidence('algebra', true, false)));
  assert.equal(assisted.kcs.algebra.mastered, false, 'guided success must not manufacture independent mastery');
  const reset = fold([...profileA, { kind: 'practice_reset', ref: 'algebra', created_at: at, data: {} }]);
  assert.equal(reset.kcs.algebra, undefined);

  const window = {};
  vm.runInNewContext(source(dir, 'public/board.js'), { window, document: { getElementById: () => true } });
  const spec = { version: 1, kind: 'solution', title: 'Same piston problem', nodes: [{ id: 'piston', kind: 'component', label: 'Piston-cylinder', x: 50, y: 50, illustration: 'piston-cylinder', contents: 'gas', surroundings: 'air', boundary: 'closed-system' }], arrows: [], steps: [{ label: 'Boundary work', latex: 'W=\\int P\\,dV', note: 'Track the moving boundary.' }] };
  const rendered = window.KelvinBoard.render(spec);
  fs.writeFileSync(path.join(output, name + '-board.html'), rendered);
  const item = {
    activeStyles: active.map((entry) => entry.id),
    policyScenarios: cases,
    directInsertionPalette: Boolean(source(dir, 'public/equation-editor.js').includes('input.setRangeText')),
    richProblemPreview: Boolean(source(dir, 'public/problem-preview.js').includes('KelvinProblemPreview')),
    renderedApparatus: rendered.includes('data-illustration="piston-cylinder"'),
    renderedSurroundings: rendered.includes('surrounded by air'),
    pairedDiagramEquations: rendered.includes('kboard-paired'),
    wordBoundaryHandler: source(dir, 'public/narration.js').includes('speech.onboundary'),
    topicProfiles: { algebraStrong: a.kcs, energyStrong: b.kcs, assistedOnly: assisted.kcs, resetCleared: !reset.kcs.algebra },
  };
  report.versions[name] = item;
}
assert.ok(report.versions.experiment.policyScenarios.every((scenario) => scenario.observations.every((turn) => turn.ceiling === 6 && turn.status === 'working' && turn.completeAttempt === false)));
assert.equal(report.versions.experiment.renderedApparatus, true);
assert.equal(report.versions.main.renderedApparatus, false);
if (fs.existsSync(path.join(root, 'lib/student-skills.js'))) {
  const { foldSkillObservations, skillAdaptationSection } = await import('../lib/student-skills.js');
  const now = new Date('2026-10-21T12:00:00Z');
  let serial = 0;
  const observation = (ref, outcome, independence = 'independent', confidence = 'high', date = now.toISOString()) => ({
    kind: 'skill_observation', ref, created_at: date, conversation_id: 'authored-session', source: 'tutor',
    data: { messageId: String(++serial), outcome, independence, confidence, quote: 'Authored evidence fixture', rationale: 'A deterministic scenario, not an observed student.' },
  });
  const fold = (rows) => foldSkillObservations(rows, { now });
  const algebraStrong = fold([...Array.from({ length: 3 }, () => observation('algebra-ratios', 'success')), ...Array.from({ length: 2 }, () => observation('energy-balance', 'needs_support'))]);
  const physicsStrong = fold([...Array.from({ length: 2 }, () => observation('algebra-ratios', 'needs_support')), ...Array.from({ length: 3 }, () => observation('energy-balance', 'success'))]);
  assert.equal(algebraStrong['algebra-ratios'].status, 'demonstrated_independently');
  assert.equal(algebraStrong['energy-balance'].status, 'targeted_support');
  assert.equal(physicsStrong['algebra-ratios'].status, 'targeted_support');
  assert.equal(physicsStrong['energy-balance'].status, 'demonstrated_independently');
  const history = [observation('energy-balance', 'needs_support')];
  const stages = [fold(history)['energy-balance'].status];
  history.push(observation('energy-balance', 'needs_support'));
  stages.push(fold(history)['energy-balance'].status);
  history.push(observation('energy-balance', 'success'));
  stages.push(fold(history)['energy-balance'].status);
  history.push(...Array.from({ length: 4 }, () => observation('energy-balance', 'success')));
  stages.push(fold(history)['energy-balance'].status);
  assert.deepEqual(stages, ['emerging_support', 'targeted_support', 'mixed', 'demonstrated_independently']);
  const assisted = fold(Array.from({ length: 6 }, () => observation('energy-balance', 'success', 'assisted')));
  assert.equal(assisted['energy-balance'].status, 'assisted_practice');
  const uncertain = fold([observation('energy-balance', 'needs_support', 'unknown', 'low')]);
  assert.equal(uncertain['energy-balance'].status, 'uncertain');
  const old = fold([observation('energy-balance', 'success', 'independent', 'high', '2026-09-01T12:00:00Z')]);
  assert.equal(old['energy-balance'].stale, true);
  const duplicated = observation('mass-balance', 'success');
  assert.equal(fold([duplicated, duplicated])['mass-balance'].totalObservations, 1);
  assert.equal(fold([...history, { kind: 'skill_reset', ref: 'energy-balance' }])['energy-balance'], undefined);
  for (const skills of [{}, algebraStrong, physicsStrong, assisted, uncertain, old]) {
    const instructions = skillAdaptationSection(skills);
    assert.match(instructions, /never gate progress/);
    assert.match(instructions, /Respect current requests for detail, visuals or pace/);
    assert.match(instructions, /no fixed learning-style labels/);
  }
  report.adaptationScenarios = { stages, algebraStrong: Object.fromEntries(Object.entries(algebraStrong).map(([key, value]) => [key, value.status])), physicsStrong: Object.fromEntries(Object.entries(physicsStrong).map(([key, value]) => [key, value.status])), assisted: assisted['energy-balance'].status, uncertain: uncertain['energy-balance'].status, staleFlag: old['energy-balance'].stale, resetAndDeduplication: 'passed', explanationPreference: 'Instruction checked; actual model compliance unmeasured' };
}
fs.writeFileSync(path.join(output, 'comparison.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log('Evidence saved to ' + output + '; main was read only. No live AI or learning-outcome claims.');
