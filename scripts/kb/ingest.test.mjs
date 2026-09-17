#!/usr/bin/env node
// Unit tests for the two mechanisms the design says must not ship untested:
// the kb:auto no-clobber rule, and the precedes/transitive-reduction + equation-dedup
// logic that decides what a card links to. No network, no API key, no fixtures.
//
// Run with: npm run kb:test
import assert from 'node:assert/strict';
import {
  AUTO_BLOCK_OUTCOME as O,
  applyAutoBlock,
  applyFrontmatterField,
  findAutoBlocks,
  renderAutoBlock,
} from './ingest-common.mjs';
import { proposePrecedes, transitiveReduction, normalizeLatex, equationKey, relaxedEquationKey } from './write-cards.mjs';
import { findAutoBlocks as kbFind } from '../../lib/kb.js';

const GEN = 'deepseek-v4-pro@entities@v1';
let n = 0;
const t = (name, fn) => { fn(); n++; console.log('  ok', name); };

console.log('kb:auto no-clobber');

t('a brand new block is written', () => {
  const r = applyAutoBlock('', 'summary', 'First draft.', GEN, { anchor: 'What this covers' });
  assert.equal(r.outcome, O.WRITTEN);
  assert.match(r.body, /## What this covers/);
  assert.match(r.body, /kb:auto start field=summary hash=sha256:[0-9a-f]{64} gen=deepseek-v4-pro@entities@v1/);
});

t('regenerating identical content is a no-op (zero-line diff)', () => {
  const a = applyAutoBlock('', 'summary', 'First draft.', GEN).body;
  const b = applyAutoBlock(a, 'summary', 'First draft.', GEN);
  assert.equal(b.outcome, O.UNCHANGED);
  assert.equal(b.body, a);
});

t('an untouched block is overwritten by new content', () => {
  const a = applyAutoBlock('', 'summary', 'First draft.', GEN).body;
  const b = applyAutoBlock(a, 'summary', 'Second draft.', GEN);
  assert.equal(b.outcome, O.WRITTEN);
  assert.match(b.body, /Second draft\./);
  assert.doesNotMatch(b.body, /First draft\./);
});

t('A HUMAN EDIT IS NEVER OVERWRITTEN', () => {
  const a = applyAutoBlock('', 'summary', 'First draft.', GEN).body;
  const edited = a.replace('First draft.', 'First draft, corrected by an instructor.');
  const b = applyAutoBlock(edited, 'summary', 'Second draft.', GEN);
  assert.equal(b.outcome, O.SKIPPED_HUMAN_EDITED);
  assert.equal(b.body, edited, 'the body must come back byte-identical');
  assert.equal(b.proposal, 'Second draft.', 'the proposal is carried to the PR body instead');
  assert.match(b.body, /corrected by an instructor/);
});

t('deleting the markers pins the text for ever', () => {
  const pinned = '## What this covers\n\nHand-written, markers removed.\n';
  const b = applyAutoBlock(pinned, 'summary', 'Second draft.', GEN, { previouslyWritten: true });
  assert.equal(b.outcome, O.SKIPPED_PINNED);
  assert.equal(b.body, pinned);
});

t('whitespace reflow around a block is NOT mistaken for an edit', () => {
  const a = applyAutoBlock('', 'summary', 'First draft.', GEN).body;
  const reflowed = a.replace('-->\nFirst draft.\n<!--', '-->\n\nFirst draft.\n\n<!--');
  const b = applyAutoBlock(reflowed, 'summary', 'Second draft.', GEN);
  assert.equal(b.outcome, O.WRITTEN, 'trim-normalised hashing should still match');
});

t('CRLF line endings are NOT mistaken for an edit', () => {
  const a = applyAutoBlock('', 'summary', 'Line one.\nLine two.', GEN).body;
  const b = applyAutoBlock(a.replace(/\n/g, '\r\n'), 'summary', 'Line three.', GEN);
  assert.equal(b.outcome, O.WRITTEN);
});

t('two blocks in one body are independent', () => {
  let body = applyAutoBlock('', 'summary', 'S1', GEN).body;
  body = applyAutoBlock(body, 'objectives_body', 'O1', GEN).body;
  const edited = body.replace('S1', 'S1 edited by a human');
  const r1 = applyAutoBlock(edited, 'summary', 'S2', GEN);
  assert.equal(r1.outcome, O.SKIPPED_HUMAN_EDITED);
  const r2 = applyAutoBlock(r1.body, 'objectives_body', 'O2', GEN);
  assert.equal(r2.outcome, O.WRITTEN, 'an untouched sibling block still regenerates');
  assert.match(r2.body, /S1 edited by a human/);
  assert.match(r2.body, /O2/);
});

t('lib/kb.js agrees with the writer about what counts as edited', () => {
  const body = applyAutoBlock('', 'summary', 'Shared hash check.', GEN).body;
  const [block] = kbFind(body);
  assert.equal(block.field, 'summary');
  assert.equal(block.edited, false, 'the compiler must not see a fresh write as a human edit');
  const [edited] = kbFind(body.replace('Shared hash check.', 'tampered'));
  assert.equal(edited.edited, true);
});

t('a block with no declared hash is treated as human-owned', () => {
  const body = '<!-- kb:auto start field=summary gen=x@y -->\nmystery\n<!-- kb:auto end -->';
  const r = applyAutoBlock(body, 'summary', 'new', GEN);
  assert.equal(r.outcome, O.SKIPPED_HUMAN_EDITED);
});

console.log('frontmatter no-clobber');

t('a generated description is replaceable; a hand-edited one is not', () => {
  let fm = {};
  let r = applyFrontmatterField(fm, 'description', 'Auto one.');
  assert.equal(r.outcome, O.WRITTEN);
  fm = r.frontmatter;
  r = applyFrontmatterField(fm, 'description', 'Auto two.');
  assert.equal(r.outcome, O.WRITTEN);
  fm = r.frontmatter;
  fm.description = 'An instructor wrote this.';
  r = applyFrontmatterField(fm, 'description', 'Auto three.');
  assert.equal(r.outcome, O.SKIPPED_HUMAN_EDITED);
  assert.equal(r.frontmatter.description, 'An instructor wrote this.');
});

t('a hand-authored field with no recorded hash is left alone', () => {
  const fm = { description: 'Written by hand before the pipeline ever ran.' };
  const r = applyFrontmatterField(fm, 'description', 'Auto.');
  assert.equal(r.outcome, O.SKIPPED_HUMAN_EDITED);
  assert.equal(r.frontmatter.description, 'Written by hand before the pipeline ever ran.');
});

console.log('precedes / transitive reduction');

t('a strict lecture order reduces to the consecutive chain', () => {
  const edges = proposePrecedes([
    { id: 'topic:c', lecture: 3 }, { id: 'topic:a', lecture: 1 }, { id: 'topic:b', lecture: 2 }, { id: 'topic:d', lecture: 4 },
  ]);
  assert.deepEqual(edges.map((e) => e.join('->')).sort(), ['topic:a->topic:b', 'topic:b->topic:c', 'topic:c->topic:d']);
});

t('topics without a lecture number produce no edge', () => {
  assert.deepEqual(proposePrecedes([{ id: 'topic:a', lecture: null }, { id: 'topic:b', lecture: null }]), []);
});

t('ties at the same lecture do not order each other', () => {
  const edges = proposePrecedes([
    { id: 'topic:a', lecture: 1 }, { id: 'topic:b1', lecture: 2 }, { id: 'topic:b2', lecture: 2 }, { id: 'topic:c', lecture: 3 },
  ]).map((e) => e.join('->')).sort();
  assert.ok(!edges.includes('topic:b1->topic:b2'));
  assert.deepEqual(edges, ['topic:a->topic:b1', 'topic:a->topic:b2', 'topic:b1->topic:c', 'topic:b2->topic:c']);
});

t('an explicitly redundant edge is dropped', () => {
  const kept = transitiveReduction([['a', 'b'], ['b', 'c'], ['a', 'c']]).map((e) => e.join('->'));
  assert.deepEqual(kept.sort(), ['a->b', 'b->c']);
});

console.log('equation dedup');

t('layout-only differences collapse to one key (the real duplicate case)', () => {
  // The same equation restated on a later slide: different spacing, $ wrapping,
  // \\left/\\right sizing and \\mathrm{}. This is what actually happens in a deck.
  const a = 'S_2 - S_1 = \\int \\frac{\\delta Q}{T_b} + \\sigma';
  const b = '$S_2-S_1=\\left\\int\\frac{\\mathrm{\\delta} Q}{T_b}\\right+\\,\\sigma$';
  assert.equal(normalizeLatex(a), normalizeLatex(b));
  assert.equal(equationKey(a), equationKey(b));
});

t('a real parenthesis difference is NOT silently merged', () => {
  // Grouping is meaning, so the strict key keeps these apart. They surface as a
  // "possible duplicate" warning in the PR body for a human to judge.
  const a = 'S_2-S_1 = \\int \\frac{\\delta Q}{T_b} + \\sigma';
  const b = 'S_2-S_1 = (\\int \\frac{\\delta Q}{T_b}) + \\sigma';
  assert.notEqual(equationKey(a), equationKey(b), 'grouping must not be normalised away');
  assert.equal(relaxedEquationKey(a), relaxedEquationKey(b), 'but the relaxed key must flag them');
});

t('case is NEVER folded: S (entropy) is not s (specific entropy)', () => {
  assert.notEqual(equationKey('S = m s'), equationKey('s = m S'));
  assert.notEqual(normalizeLatex('\\Delta S'), normalizeLatex('\\Delta s'));
});

console.log(`\n${n} assertions passed.`);
