import { renderGrapher } from '../grapher.js';

// The local experimental server has a Python plotting runtime; hosted Node functions do not.
export function available() { return !process.env.VERCEL; }

export default async function run(args) {
  const result = await renderGrapher(args);
  return {
    figure: '```kelvin-grapher\n' + JSON.stringify(result.spec) + '\n```',
    how_to_show: 'The animated graph and ordered drawing checklist are automatically inserted in your reply. Do not copy the figure block or duplicate the checklist. Explain the key insight and any remaining uncertainties.',
    states: result.states,
    drawing_steps: result.steps.map(({ title, text }) => ({ title, text })),
    warnings: result.warnings,
    source: result.source,
  };
}
