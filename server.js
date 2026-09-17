import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(APP_DIR, 'public');
const DOTENV_PATH = path.join(APP_DIR, '.env');
const OPENCODE_AUTH_PATH = path.join(os.homedir(), '.local/share/opencode/auth.json');
const HOST = '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function stripQuotes(v) {
  v = v.trim();
  if (v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
    return v.slice(1, -1);
  }
  return v;
}

function loadDotenv() {
  const loaded = new Set();
  let text;
  try {
    text = fs.readFileSync(DOTENV_PATH, 'utf8');
  } catch {
    return loaded;
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim().replace(/^export\s+/, '');
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const [, name, value] = m;
    if (process.env[name]) continue;
    process.env[name] = stripQuotes(value);
    loaded.add(name);
  }
  return loaded;
}

function resolveKey(dotenvKeys, envVar) {
  const fromEnv = (process.env[envVar] || '').trim();
  if (fromEnv) return { key: fromEnv, source: dotenvKeys.has(envVar) ? 'dotenv' : 'env' };
  try {
    const obj = JSON.parse(fs.readFileSync(OPENCODE_AUTH_PATH, 'utf8'));
    const v = obj?.deepseek?.key;
    if (typeof v === 'string' && v.trim()) return { key: v.trim(), source: 'opencode' };
  } catch {}
  return { key: null, source: null };
}

const dotenvKeys = loadDotenv();

const { handle, configure } = await import('./lib/app.js');
const { llmConfig } = await import('./lib/agent.js');
const { listSkills } = await import('./lib/skills.js');
const { loadKnowledge } = await import('./lib/knowledge.js');
const llm = llmConfig();
const resolvedKey = resolveKey(dotenvKeys, llm.apiKeyEnvVar);
const { ensureSchema, closeDb, dbKind } = await import('./lib/db.js');
const { copyVendor, vendorReady } = await import('./scripts/copy-vendor.mjs');

configure({ resolveKey: () => resolvedKey });

const PORT = Number(process.env.PORT) || 3300;

function sendText(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

async function serveStatic(res, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  } catch {
    return sendText(res, 400, 'Bad path');
  }
  if (decoded.includes('\0')) return sendText(res, 400, 'Bad path');
  const root = path.resolve(PUBLIC_DIR);
  let full = path.resolve(root, '.' + path.sep + decoded);
  if (!full.startsWith(root + path.sep)) return sendText(res, 404, 'Not found');
  // Vercel serves public/browse.html at /browse by default; match that locally so links
  // written as /browse work in both places.
  if (!path.extname(full)) {
    try {
      const withHtml = full + '.html';
      if ((await fsp.stat(withHtml)).isFile()) full = withHtml;
    } catch { /* fall through to the 404 below */ }
  }
  try {
    const stat = await fsp.stat(full);
    if (!stat.isFile()) throw new Error('not a file');
    const type = MIME[path.extname(full).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Cache-Control': 'no-cache' });
    fs.createReadStream(full).pipe(res);
  } catch {
    sendText(res, 404, 'Not found');
  }
}

const server = http.createServer(async (req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url, `http://${HOST}`).pathname;
  } catch {
    return sendText(res, 400, 'Bad request');
  }
  try {
    if (pathname === '/api' || pathname.startsWith('/api/')) return await handle(req, res);
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendText(res, 405, 'Method not allowed');
    return await serveStatic(res, pathname);
  } catch (e) {
    console.error('Request error:', e.message);
    if (!res.headersSent) sendText(res, 500, 'Internal server error');
    else if (!res.writableEnded) res.end();
  }
});

if (!vendorReady()) {
  try {
    copyVendor();
  } catch (e) {
    console.error(`Vendor assets missing and could not be copied: ${e.message}`);
  }
}

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received, closing database`);
  setTimeout(() => process.exit(0), 3000).unref();
  server.close();
  await closeDb();
  process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

console.log('Indexing course materials…');
const [skills, knowledge] = await Promise.all([
  listSkills(),
  loadKnowledge().catch((e) => {
    console.error(`Course materials not loaded: ${e.message}`);
    return null;
  }),
]);

server.listen(PORT, HOST, () => {
  console.log(`Kelvin AI running at http://${HOST}:${PORT}`);
  console.log(`Model: ${llm.model} (${llm.provider})`);
  console.log(`API key source: ${resolvedKey.source ?? `none (set ${llm.apiKeyEnvVar})`}`);
  console.log(`Skills: ${skills.length}${skills.length ? ` (${skills.map((s) => s.name).join(', ')})` : ''}`);
  console.log(
    knowledge
      ? `Knowledge files: ${knowledge.fileCount} indexed, ${knowledge.skippedCount} skipped`
      : 'Knowledge files: 0 (index failed to load)'
  );
  console.log(`Database: ${dbKind()}`);
  console.log(`Passcode gate: ${process.env.APP_PASSCODE ? 'on' : 'off'}`);
  ensureSchema().then(
    () => console.log('Database schema ready'),
    (e) => console.error(`Database not ready: ${e.message}`)
  );
});
