// A small, bounded board format. The model supplies labels and layout; it never supplies SVG or HTML.
const NODE_KINDS = new Set(['component', 'state', 'boundary', 'note']);
const ARROW_KINDS = new Set(['flow', 'heat', 'work', 'relationship']);
const BOARD_KINDS = new Set(['sketch', 'solution']);
const ID = /^[a-z][a-z0-9_-]{0,23}$/;

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function keys(value, allowed, name) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) throw new Error(`${name}.${key} is not supported`);
}

function line(value, name, max, { optional = false } = {}) {
  if (optional && value === undefined) return undefined;
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max || /[\r\n\u0000-\u001f]/.test(value)) {
    throw new Error(`${name} must be one line of 1–${max} characters`);
  }
  return value.trim();
}

function list(value, name, max) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > max) throw new Error(`${name} must be an array with at most ${max} items`);
  return value;
}

function labelFits(value) {
  const lines = [''];
  for (const word of value.split(/\s+/)) {
    const i = lines.length - 1;
    if (lines[i] && (lines[i] + ' ' + word).length > 19) lines.push(word);
    else lines[i] = (lines[i] + ' ' + word).trim();
  }
  return lines.length <= 3 && lines.every((part) => part.length <= 23);
}

export function validateBoard(args) {
  if (!object(args)) throw new Error('Board must be an object');
  keys(args, ['kind', 'title', 'nodes', 'arrows', 'steps'], 'board');
  if (!BOARD_KINDS.has(args.kind)) throw new Error('kind must be sketch or solution');
  const title = line(args.title, 'title', 90);
  const ids = new Set();
  const nodes = list(args.nodes, 'nodes', 8).map((node, i) => {
    if (!object(node)) throw new Error(`nodes[${i}] must be an object`);
    keys(node, ['id', 'label', 'kind', 'x', 'y'], `nodes[${i}]`);
    if (typeof node.id !== 'string' || !ID.test(node.id) || ids.has(node.id)) throw new Error(`nodes[${i}].id must be unique, lowercase, and start with a letter`);
    ids.add(node.id);
    const label = line(node.label, `nodes[${i}].label`, 48);
    if (!labelFits(label)) throw new Error(`nodes[${i}].label is too long to draw; use shorter words`);
    if (!NODE_KINDS.has(node.kind)) throw new Error(`nodes[${i}].kind is invalid`);
    if (!Number.isInteger(node.x) || node.x < 10 || node.x > 90 || !Number.isInteger(node.y) || node.y < 10 || node.y > 90) {
      throw new Error(`nodes[${i}] coordinates must be integers from 10 to 90`);
    }
    return { id: node.id, label, kind: node.kind, x: node.x, y: node.y };
  });
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    if (Math.abs(nodes[i].x - nodes[j].x) < 23 && Math.abs(nodes[i].y - nodes[j].y) < 22) {
      throw new Error(`nodes ${nodes[i].id} and ${nodes[j].id} overlap; move their coordinates apart`);
    }
  }
  const arrows = list(args.arrows, 'arrows', 12).map((arrow, i) => {
    if (!object(arrow)) throw new Error(`arrows[${i}] must be an object`);
    keys(arrow, ['from', 'to', 'label', 'kind'], `arrows[${i}]`);
    if (!ids.has(arrow.from) || !ids.has(arrow.to) || arrow.from === arrow.to) throw new Error(`arrows[${i}] must connect two different existing nodes`);
    if (!ARROW_KINDS.has(arrow.kind)) throw new Error(`arrows[${i}].kind is invalid`);
    return { from: arrow.from, to: arrow.to, label: line(arrow.label, `arrows[${i}].label`, 48, { optional: true }) || '', kind: arrow.kind };
  });
  const steps = list(args.steps, 'steps', 6).map((step, i) => {
    if (!object(step)) throw new Error(`steps[${i}] must be an object`);
    keys(step, ['label', 'latex', 'note'], `steps[${i}]`);
    return {
      label: line(step.label, `steps[${i}].label`, 36),
      latex: line(step.latex, `steps[${i}].latex`, 180, { optional: true }) || '',
      note: line(step.note, `steps[${i}].note`, 180, { optional: true }) || '',
    };
  });
  if (args.kind === 'sketch' && !nodes.length) throw new Error('A sketch needs at least one node');
  if (args.kind === 'solution' && !steps.length) throw new Error('A solution board needs at least one step');
  return { version: 1, kind: args.kind, title, nodes, arrows, steps };
}

export default async function run(args, ctx) {
  try {
    if (ctx?.boardShown) return { error: 'A board was already shown in this reply. Continue teaching from it.' };
    const board = validateBoard(args);
    if (ctx) ctx.boardShown = true;
    return {
      board,
      figure: '```kelvin-board\n' + JSON.stringify(board) + '\n```',
      how_to_show: 'The app has already shown this board to the student. Do not repeat the figure block. Continue with one short question about the next step.',
    };
  } catch (error) {
    return { error: error.message };
  }
}
