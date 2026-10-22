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

const { speechClock } = window.KelvinNarration;
const clock = speechClock('Draw the turbine slowly.', 1, 0);
assert.ok(clock.progress(0) < .01);
assert.equal(clock.boundary({ name: 'sentence', charIndex: 0 }, 0), false);
assert.equal(clock.boundary({ name: 'word', charIndex: -1 }, 0), false);
assert.equal(clock.boundary({ name: 'word', charIndex: 0 }, 0), true);
const firstWord = clock.progress(400);
assert.equal(clock.progress(3000), firstWord, 'do not race through a slow pause before the next spoken word');
assert.ok(firstWord <= 4 / 24);
clock.boundary({ name: 'word', charIndex: 5, charLength: 0 }, 3000);
assert.equal(clock.progress(3000), firstWord, 'new word smoothly continues the pen rather than jumping');
assert.ok(clock.progress(3200) > firstWord);
assert.equal(clock.boundary({ name: 'word', charIndex: 0 }, 3300), false, 'ignore out-of-order boundaries');
clock.boundary({ name: 'word', charIndex: 17 }, 3400);
assert.ok(clock.progress(6000) < 1, 'wait for speech end even on the last word');
const slow = speechClock('One two three four five six.', .75, 0);
const fast = speechClock('One two three four five six.', 1.5, 0);
assert.ok(fast.progress(500) > slow.progress(500), 'fallback follows the selected speech rate');
assert.equal(slow.progress(90000), .9, 'missing word boundaries cannot complete a phrase early');
const delayed = speechClock('A boundary may arrive late.', 1, 0);
const alreadyDrawn = delayed.progress(900);
delayed.boundary({ name: 'word', charIndex: 0 }, 1000);
assert.ok(delayed.progress(1200) >= alreadyDrawn, 'late boundary must not erase drawing');
console.log('ok  speech-boundary interpolation, stalled speech, malformed events and bounded rate-aware fallback');
