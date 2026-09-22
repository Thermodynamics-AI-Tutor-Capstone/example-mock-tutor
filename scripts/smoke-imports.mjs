#!/usr/bin/env node
// Loads every server module the way the live function does. `node --check` only parses one file;
// this catches a module that imports a file which isn't committed, or a missing export — the
// failure that broke main in eef1fcf. No network, no API key, no database connection.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  'api/handler.js',
  ...fs.readdirSync(path.join(APP_DIR, 'lib')).filter((f) => f.endsWith('.js')).map((f) => `lib/${f}`),
  ...fs.readdirSync(path.join(APP_DIR, 'lib', 'tools')).filter((f) => f.endsWith('.js')).map((f) => `lib/tools/${f}`),
];
let failed = 0;
for (const rel of targets) {
  try {
    await import(pathToFileURL(path.join(APP_DIR, rel)).href);
  } catch (e) {
    failed++;
    console.error(`✗ ${rel}: ${e.message.split('\n')[0]}`);
  }
}
console.log(failed ? `Imports: FAILED (${failed} of ${targets.length})` : `Imports: ok — ${targets.length} modules load`);
process.exit(failed ? 1 : 0);
