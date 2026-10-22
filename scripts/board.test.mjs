#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { validateBoard, default as showOnBoard } from '../lib/tools/show_on_board.js';

const input = {
  kind: 'sketch',
  title: 'Turbine control volume',
  nodes: [
    { id: 'inlet', label: 'Inlet', kind: 'state', x: 15, y: 50 },
    { id: 'turbine', label: 'Turbine', kind: 'component', x: 50, y: 50 },
    { id: 'outlet', label: 'Outlet', kind: 'state', x: 85, y: 50 },
  ],
  arrows: [
    { from: 'inlet', to: 'turbine', label: 'mass in', kind: 'flow' },
    { from: 'turbine', to: 'outlet', label: 'mass out', kind: 'flow' },
  ],
  steps: [{ label: 'Known', latex: '\\dot m_{in}=\\dot m_{out}', note: 'Steady state.' }],
};

const ctx = {};
const result = await showOnBoard(input, ctx);
assert.equal(result.board.version, 1);
assert.equal(result.board.nodes.length, 3);
assert.match(result.figure, /^```kelvin-board\n/);
assert.deepEqual(JSON.parse(result.figure.split('\n')[1]), result.board);
assert.match((await showOnBoard(input, ctx)).error, /already shown/);

assert.throws(() => validateBoard({ ...input, arrows: [{ from: 'inlet', to: 'missing', kind: 'flow' }] }), /existing nodes/);
assert.throws(() => validateBoard({ ...input, nodes: [input.nodes[0], { ...input.nodes[1], x: 16 }] }), /overlap/);
assert.throws(() => validateBoard({ ...input, title: 'A'.repeat(91) }), /1–90/);
assert.throws(() => validateBoard({ ...input, nodes: [{ ...input.nodes[0], label: 'unbrokenwordthatisfartoolongtodraw' }] }), /too long to draw/);
assert.throws(() => validateBoard({ ...input, html: '<script>' }), /not supported/);

const head = { appendChild() {} };
const window = {};
const document = { getElementById() { return null; }, createElement() { return {}; }, head };
const katex = { renderToString(tex) { return `<span class="math">${tex}</span>`; } };
vm.runInNewContext(fs.readFileSync(new URL('../public/board.js', import.meta.url), 'utf8'), { window, document, katex });
const live = window.KelvinBoard.render(result.board, { animate: true });
assert.match(live, /kboard-live/);
assert.match(live, /kboard-arrow/);
assert.match(live, /mass in/);
assert.match(live, /Steady state/);
assert.doesNotMatch(window.KelvinBoard.render(result.board), /kboard-live/);
const unsafe = { ...result.board, title: '<img src=x onerror=alert(1)>' };
assert.match(window.KelvinBoard.render(unsafe), /&lt;img/);
assert.doesNotMatch(window.KelvinBoard.render(unsafe), /<img/);
assert.throws(() => window.KelvinBoard.render({ ...result.board, arrows: [{ from: 'inlet', to: 'outlet', label: '', kind: '__proto__' }] }), /Invalid teaching board arrow/);

console.log('Board tool and renderer: ok');

// Keep authored apparatus, tool contracts, escaping, and legacy node targets in agreement.
const { ILLUSTRATIONS } = await import('../lib/tools/show_on_board.js');
const { illustrationBoards } = await import('./fixtures/illustrated-boards.mjs');
const YAML = await import('yaml');
for (const file of ['show_on_board', 'explain_on_whiteboard']) {
  const schema = YAML.parse(fs.readFileSync(new URL(`../agent/tools/${file}.yml`, import.meta.url), 'utf8')).parameters;
  const board = file === 'show_on_board' ? schema : schema.properties.board;
  assert.deepEqual(board.properties.nodes.items.properties.illustration.enum, ILLUSTRATIONS);
}
for (const illustration of ILLUSTRATIONS) {
  const board = validateBoard({ kind: 'sketch', title: illustration, nodes: [{ id: 'device', kind: 'component', label: 'Apparatus', x: 50, y: 50, illustration, surroundings: 'water', boundary: 'control-volume' }] });
  const html = window.KelvinBoard.render(board);
  assert.match(html, new RegExp(`data-illustration="${illustration}"`));
  assert.match(html, /data-board-target="node:device"/);
  assert.match(html, /surrounded by water/);
  assert.match(html, /Schematic/);
  assert.doesNotMatch(html, /<image|<script|foreignObject/);
}
for (const input of illustrationBoards) {
  const html = window.KelvinBoard.render(validateBoard(input));
  assert.match(html, /kboard-layout kboard-paired/);
  assert.match(html, /kboard-apparatus/);
}
const single = { kind: 'sketch', title: 'Invalid illustration', nodes: [{ id: 'device', label: 'Device', kind: 'component', x: 50, y: 50, illustration: 'hose' }] };
assert.throws(() => validateBoard({ ...single, nodes: [{ ...single.nodes[0], illustration: '<script>' }] }), /illustration is invalid/);
assert.throws(() => validateBoard({ ...single, nodes: [{ ...single.nodes[0], contents: 'gas' }] }), /Contents are supported/);
assert.throws(() => validateBoard({ ...single, nodes: [{ ...single.nodes[0], illustration: undefined, surroundings: 'air' }] }), /need an illustration/);
assert.throws(() => validateBoard({ ...single, nodes: [single.nodes[0], { ...single.nodes[0], id: 'other', y: 80 }] }), /overlap/);
assert.throws(() => window.KelvinBoard.render({ ...validateBoard(single), nodes: [{ ...single.nodes[0], surroundings: 'url(evil)' }] }), /Invalid illustration detail/);
console.log('Illustrated apparatus, bounded details, layout and schema parity: ok');
