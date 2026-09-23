#!/usr/bin/env node
// Talk to Kelvin as a simulated student, over the real HTTP API, so the conversation lands in that
// student's chat history. The student (a person or an agent role-playing one) decides every message;
// this script only signs in, sends, and prints Kelvin's reply.
//
// It never prints what Kelvin decided (Jev's read, the style reasons, the audit): the role-player
// must not see the grader's view, or the students stop being realistic. Those are pulled afterwards
// by scripts/eval/sim-collect.mjs.
//
// Each message can carry --truth, the role-player's own account of what the student is really doing
// (their intent, which misconception is in play, whether they finished an attempt). It is never sent
// to Kelvin; it is logged locally as the answer key for scoring the read.
//
// Usage:
//   node scripts/eval/sim-chat.mjs --student 3 --new                    → prints a new conversation id
//   node scripts/eval/sim-chat.mjs --student 3 --conv <id> [--truth '<json>'] <<'EOF'
//   the student's message
//   EOF
//
// Env: EVAL_BASE_URL (default production), SIM_PASSWORD, SIM_RUN (log folder name, default "sims").
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
for (const line of fs.existsSync(path.join(APP_DIR, '.env')) ? fs.readFileSync(path.join(APP_DIR, '.env'), 'utf8').split('\n') : []) {
  const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : null;
};
const student = Number(arg('student'));
if (!Number.isInteger(student) || student < 0) fail('--student <n> is required (0 = the kelvin-eval account)');
const BASE = (process.env.EVAL_BASE_URL || 'https://thermo-tutor-mock.vercel.app').replace(/\/+$/, '');
const EMAIL = student === 0 ? process.env.EVAL_EMAIL : `test${student}@tutor.test`;
const PASSWORD = student === 0 ? process.env.EVAL_PASSWORD : process.env.SIM_PASSWORD;
if (!PASSWORD) fail('SIM_PASSWORD is not set (put it in .env)');
const RUN_DIR = path.join(APP_DIR, 'data', 'sim-runs', process.env.SIM_RUN || 'sims');
const COOKIE_FILE = path.join(APP_DIR, 'data', 'sim-runs', '.cookies', student === 0 ? 'eval' : `test${student}`);
fs.mkdirSync(path.dirname(COOKIE_FILE), { recursive: true });
fs.mkdirSync(RUN_DIR, { recursive: true });

function fail(msg) {
  console.error(`sim-chat: ${msg}`);
  process.exit(2);
}

async function signIn() {
  const r = await fetch(`${BASE}/api/auth/sign-in/email`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: BASE },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!r.ok) fail(`sign-in failed for ${EMAIL}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  const cookie = r.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
  fs.writeFileSync(COOKIE_FILE, cookie, { mode: 0o600 });
  return cookie;
}

let cookie = fs.existsSync(COOKIE_FILE) ? fs.readFileSync(COOKIE_FILE, 'utf8').trim() : '';
async function api(method, url, body, { stream = false } = {}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    if (!cookie) cookie = await signIn();
    const r = await fetch(`${BASE}${url}`, {
      method,
      headers: { cookie, 'content-type': 'application/json', origin: BASE },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 401 && attempt === 0) {
      cookie = '';
      continue;
    }
    if (!r.ok) fail(`${method} ${url}: ${r.status} ${(await r.text()).slice(0, 300)}`);
    return stream ? r : r.status === 204 ? null : r.json();
  }
}

if (args.includes('--new')) {
  const c = await api('POST', '/api/conversations', {});
  console.log(c.id);
  process.exit(0);
}

const conv = arg('conv');
if (!conv) fail('--conv <id> or --new is required');
let truth = null;
if (arg('truth')) {
  try {
    truth = JSON.parse(arg('truth'));
  } catch (e) {
    fail(`--truth is not valid JSON: ${e.message}`);
  }
}
const message = fs.readFileSync(0, 'utf8').replace(/\s+$/, '');
if (!message.trim()) fail('the message (stdin) is empty');

const started = Date.now();
const res = await api('POST', `/api/conversations/${conv}/messages`, { content: message }, { stream: true });
const decoder = new TextDecoder();
let buf = '';
let reply = '';
let style = null;
let error = null;
for await (const chunk of res.body) {
  buf += decoder.decode(chunk, { stream: true });
  let i;
  while ((i = buf.indexOf('\n\n')) >= 0) {
    const frame = buf.slice(0, i);
    buf = buf.slice(i + 2);
    const data = frame.split('\n').filter((l) => l.startsWith('data: ')).map((l) => l.slice(6)).join('');
    if (!data) continue;
    let ev;
    try {
      ev = JSON.parse(data);
    } catch {
      continue;
    }
    if (ev.type === 'delta') reply += ev.content;
    else if (ev.type === 'style') style = ev.name || ev.id;
    else if (ev.type === 'error') error = ev.message;
  }
}
const seconds = Math.round((Date.now() - started) / 100) / 10;
fs.appendFileSync(
  path.join(RUN_DIR, `student${student}.jsonl`),
  JSON.stringify({ at: new Date().toISOString(), student, email: EMAIL, conv, message, truth, reply, style, error, seconds }) + '\n'
);
if (error) console.log(`[Kelvin error: ${error}]`);
console.log(reply || '(no reply)');
