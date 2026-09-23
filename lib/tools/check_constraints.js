import { checkConstraints } from '../constraints.js';

export function status() {
  return 'Checking the physics';
}

export default async function run(args) {
  return checkConstraints(args || {});
}
