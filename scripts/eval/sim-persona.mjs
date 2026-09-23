#!/usr/bin/env node
// Print one simulated student's entry. Usage: node scripts/eval/sim-persona.mjs 3 [eval/students-r2.yml]
import fs from 'node:fs';
import { parse, stringify } from 'yaml';
const n = Number(process.argv[2]);
const file = process.argv[3] ? new URL(`../../${process.argv[3]}`, import.meta.url) : new URL('../../eval/students.yml', import.meta.url);
const s = parse(fs.readFileSync(file, 'utf8')).students.find((x) => x.n === n);
if (!s) throw new Error(`no student ${n}`);
process.stdout.write(stringify(s));
