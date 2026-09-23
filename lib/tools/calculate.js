import { create, all } from 'mathjs';

// Exact arithmetic with units, so no number the tutor states comes from next-token prediction
// (Khan Academy's lesson: an LLM "generates a probable next number rather than executing a correct
// calculation"). mathjs has no access to JavaScript; the functions its security guide lists as risky
// (import, createUnit, nested evaluate/parse/compile, symbolic manipulation) are disabled anyway.
const math = create(all);
// Keep the real evaluator before the expression-level copies are disabled below.
const evaluate = math.evaluate.bind(math);
const refuse = (name) => () => {
  throw new Error(`${name} is disabled`);
};
math.import(
  { import: refuse('import'), createUnit: refuse('createUnit'), evaluate: refuse('evaluate'), parse: refuse('parse'), compile: refuse('compile'), simplify: refuse('simplify'), derivative: refuse('derivative'), resolve: refuse('resolve'), reviver: refuse('reviver') },
  { override: true }
);

const MAX_CHARS = 300;

function show(value) {
  if (value === undefined || value === null) return { result: String(value) };
  if (typeof value === 'number') return { result: math.format(value, { precision: 6 }), value };
  if (value && value.isUnit) return { result: value.format({ precision: 6 }), value: value.toNumber(), unit: value.formatUnits() };
  if (typeof value === 'boolean') return { result: String(value) };
  return { result: math.format(value, { precision: 6 }) };
}

export function status() {
  return 'Calculating';
}

export default async function run(args) {
  const list = (Array.isArray(args.expressions) ? args.expressions : [args.expression]).filter((e) => typeof e === 'string' && e.trim()).slice(0, 12);
  if (!list.length) return { error: 'Give at least one expression.' };
  const scope = new Map();
  const results = list.map((expr) => {
    if (expr.length > MAX_CHARS) return { expr: expr.slice(0, 60) + '…', error: `longer than ${MAX_CHARS} characters; split it into steps` };
    try {
      return { expr, ...show(evaluate(expr, scope)) };
    } catch (e) {
      return { expr, error: e.message };
    }
  });
  return { results };
}
