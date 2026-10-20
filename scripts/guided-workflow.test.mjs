import assert from 'node:assert/strict';
import { applyPolicy, policySection } from '../lib/policy.js';
import { loadStyles, listStyles, resolveStyleId } from '../lib/styles.js';
import { cardCitations, sourceLink, safeSourceUrl } from '../lib/course-profile.js';
import { whiteboardSection, presentationAllowsTool } from '../lib/presentation.js';
import openCard from '../lib/tools/open_card.js';
import updateState from '../lib/tools/update_tutoring_state.js';

const read = {
  provider: 'jev', intent: { label: 'wants_answer' }, showsWork: 0,
  completeAttempt: 0, wantsAnswer: 1, frustration: { score: 3 }, givingUp: 0.9,
  misconceptions: [{ id: 'misc:test', title: 'Possible sign confusion', p: 0.65 }],
};
assert.equal(listStyles().length, 1);
assert.equal(listStyles()[0].name, 'Guided tutor');
for (const old of ['pinpointer', 'probe', 'work-it-through', 'practice', 'teach-kelvin']) assert.equal(resolveStyleId(old), 'office-hours');
for (const style of loadStyles().styles.filter((s) => s.enabled)) {
  assert.equal(style.state.guidedWorkflow, true, style.id);
  let state = { problem: 'compressor', status: 'working', attempts: 0, completeAttempt: false };
  for (let i = 0; i < 4; i++) {
    const result = applyPolicy({ style, state, read });
    state = result.state;
    assert.equal(result.turn.ceiling, 6, 'a request for help must never be gated on attempts');
    assert.equal(state.status, 'working', 'frustration must not automatically park the problem');
    assert.equal(result.turn.completeAttempt, false, 'help does not manufacture independent work');
    const prompt = policySection({ style, state, turn: result.turn });
    assert.doesNotMatch(prompt, /locked —|Before teaching, ask|Ask for the same step again/);
    assert.match(prompt, /explain and work the next useful step/i);
  }
  let saved;
  await updateState({ problem_status: 'finished' }, {
    style, state, turn: { guidedWorkflow: true, ceiling: 6, completeAttempt: false },
    saveState: async (s) => { saved = s; },
  });
  assert.equal(saved.status, 'finished');
  assert.equal(saved.completeAttempt, false);
}
console.log('ok guided help is available across all enabled styles, including repeated frustrated requests');

assert.equal(presentationAllowsTool('show_on_board', false), false);
assert.equal(presentationAllowsTool('explain_on_whiteboard', false), false);
assert.equal(presentationAllowsTool('calculate', false), true);
assert.equal(presentationAllowsTool('explain_on_whiteboard', true), true);
assert.match(whiteboardSection(true), /Audio is optional/);
assert.match(whiteboardSection(false), /Whiteboard is OFF/);
console.log('ok display preference independently gates the two whiteboard tools');

const source = { path: 'lectures/First law.pdf', slides: [8] };
const profile = { sourceLinks: { [source.path]: 'https://canvas.example.edu/courses/300/files/42?wrap=1' } };
assert.equal(sourceLink(source, profile), profile.sourceLinks[source.path]);
assert.equal(sourceLink(source, {}, ''), null, 'no guessed GitHub link for an unhosted slide');
assert.equal(sourceLink(source, {}, 'https://materials.example.edu/me300'), 'https://materials.example.edu/me300/lectures/First%20law.pdf');
assert.equal(sourceLink({ path: '../secret.pdf' }, {}, 'https://materials.example.edu'), null);
assert.equal(safeSourceUrl('javascript:alert(1)'), null);
assert.equal(safeSourceUrl('https://user:password@example.edu/secret'), null);
const card = { id: 'topic:first-law', title: 'First law', sources: [source] };
const citation = cardCitations(card, profile);
assert.equal(citation.citationUrl, '/browse#card=topic%3Afirst-law');
assert.deepEqual(citation.sourceLinks[0].slides, [8]);
assert.equal(cardCitations(card, { sourceLinks: {} }).sourceLinks.length, 0);
const opened = await openCard({ id: card.id }, { knowledge: { openCard: () => card }, emit: () => {} });
assert.equal(opened.citationUrl, citation.citationUrl);
assert.equal(opened.sources[0].path, source.path);
console.log('ok citation links preserve provenance and expose only configured HTTPS destinations');
