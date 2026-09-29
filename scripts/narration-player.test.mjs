import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { lessonInput } from './fixtures/narrated-lesson.mjs';

const window = { addEventListener() {} };
vm.runInNewContext(fs.readFileSync(new URL('../public/narration.js', import.meta.url), 'utf8'), {
  window, document: { body: {} }, MutationObserver: class { observe() {} },
});
const { phrases } = window.KelvinNarration;
for (const segment of lessonInput.segments) {
  const parts = JSON.parse(JSON.stringify(phrases(segment)));
  assert.equal(parts.map((p) => p.text).join(' '), segment.speech);
  assert.deepEqual(parts.flatMap((p) => p.targets), segment.cues.map((c) => c.target));
  assert.ok(parts.every((p) => p.text.trim()));
}
for (let wordCount = 1; wordCount <= 100; wordCount++) {
  const segment = {
    speech: Array.from({ length: wordCount }, (_, i) => `word${i}${i % 7 === 0 ? '.' : ''}`).join(' '),
    cues: Array.from({ length: 26 }, (_, i) => ({ at: i * .85 / 25, target: `item:${i}` })),
  };
  const parts = JSON.parse(JSON.stringify(phrases(segment)));
  assert.equal(parts.map((p) => p.text).join(' '), segment.speech, 'never drop/repeat speech at sentence or cue breaks');
  assert.deepEqual(parts.flatMap((p) => p.targets), segment.cues.map((c) => c.target), 'group coincident cues without dropping items');
  assert.ok(parts.every((p) => p.text.length > 0));
}
assert.equal(phrases({ speech: 'A sentence. Another sentence!', cues: [] }).length, 2);
assert.equal(phrases({ speech: '  A   short phrase. ', cues: [] })[0].text, 'A short phrase.');
console.log('ok  browser phrase segmentation preserves speech, cue order, coincident cues and sentence breaks');
