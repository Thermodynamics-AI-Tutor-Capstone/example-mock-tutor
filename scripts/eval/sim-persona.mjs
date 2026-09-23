#!/usr/bin/env node
// Print one simulated student's entry from eval/students.yml. Usage: node scripts/eval/sim-persona.mjs 3
import fs from 'node:fs';
import { parse, stringify } from 'yaml';
const n = Number(process.argv[2]);
const s = parse(fs.readFileSync(new URL('../../eval/students.yml', import.meta.url), 'utf8')).students.find((x) => x.n === n);
if (!s) throw new Error(`no student ${n}`);
process.stdout.write(stringify(s));
