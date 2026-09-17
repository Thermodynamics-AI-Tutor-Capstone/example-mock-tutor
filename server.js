import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(APP_DIR, 'public');
const NODE_MODULES = path.join(APP_DIR, 'node_modules');
const KATEX_DIR = path.join(NODE_MODULES, 'katex', 'dist');
const DATA_DIR = path.join(APP_DIR, 'data', 'conversations');
const SYSTEM_PROMPT_PATH = path.join(APP_DIR, 'system-prompt.md');
const DOTENV_PATH = path.join(APP_DIR, '.env');
const OPENCODE_AUTH_PATH = path.join(os.homedir(), '.local/share/opencode/auth.json');

const PORT = Number(process.env.PORT) || 3300;
const HOST = '127.0.0.1';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-pro';
const BASE_URL = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '');
const MAX_BODY = 1024 * 1024;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
};

function stripQuotes(v) {
  v = v.trim();
  if (v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
    return v.slice(1, -1);
  }
  return v;
}

function resolveKey() {
  if (process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY.trim()) {
    return { key: process.env.DEEPSEEK_API_KEY.trim(), source: 'env' };
  }
  try {
    const text = fs.readFileSync(DOTENV_PATH, 'utf8');
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim().replace(/^export\s+/, '');
      if (!line || line.startsWith('#')) continue;
      const m = line.match(/^DEEPSEEK_API_KEY\s*=\s*(.*)$/);
      if (m) {
        const v = stripQuotes(m[1]);
        if (v) return { key: v, source: 'dotenv' };
      }
    }
  } catch {}
  try {
    const obj = JSON.parse(fs.readFileSync(OPENCODE_AUTH_PATH, 'utf8'));
    const v = obj?.deepseek?.key;
    if (typeof v === 'string' && v.trim()) return { key: v.trim(), source: 'opencode' };
  } catch {}
  return { key: null, source: null };
}

const { key: API_KEY, source: KEY_SOURCE } = resolveKey();

async function loadSystemPrompt() {
  try {
    return await fsp.readFile(SYSTEM_PROMPT_PATH, 'utf8');
  } catch {
    return 'You are a helpful tutor for undergraduate engineering thermodynamics.';
  }
}

function convoPath(id) {
  return path.join(DATA_DIR, `${id}.json`);
}

async function readConvo(id) {
  if (!UUID_RE.test(id)) return null;
  try {
    return JSON.parse(await fsp.readFile(convoPath(id), 'utf8'));
  } catch {
    return null;
  }
}

async function saveConvo(convo) {
  const file = convoPath(convo.id);
  const tmp = `${file}.${crypto.randomUUID()}.tmp`;
  await fsp.writeFile(tmp, JSON.stringify(convo, null, 2));
  await fsp.rename(tmp, file);
}

function summary(c) {
  return { id: c.id, title: c.title, createdAt: c.createdAt, updatedAt: c.updatedAt };
}

async function listConvos() {
  let names = [];
  try {
    names = await fsp.readdir(DATA_DIR);
  } catch {
    return [];
  }
  const out = [];
  for (const name of names) {
    if (!name.endsWith('.json')) continue;
    const id = name.slice(0, -5);
    const c = await readConvo(id);
    if (c) out.push(summary(c));
  }
  out.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
  return out;
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(data) });
  res.end(data);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    let failed = false;
    req.on('data', (chunk) => {
      if (failed) return;
      size += chunk.length;
      if (size > MAX_BODY) {
        failed = true;
        const err = new Error('Request body too large');
        err.status = 413;
        reject(err);
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (failed) return;
      const text = Buffer.concat(chunks).toString('utf8');
      if (!text.trim()) return resolve({});
      try {
        resolve(JSON.parse(text));
      } catch {
        const err = new Error('Invalid JSON body');
        err.status = 400;
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function makeTitle(content) {
  const collapsed = content.replace(/\s+/g, ' ').trim();
  const chars = Array.from(collapsed);
  if (chars.length <= 50) return collapsed || 'New chat';
  return chars.slice(0, 50).join('').trimEnd() + '…';
}

async function serveFile(res, root, relPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(relPath);
  } catch {
    return sendJson(res, 400, { error: 'Bad path' });
  }
  if (decoded.includes('\0')) return sendJson(res, 400, { error: 'Bad path' });
  const rootResolved = path.resolve(root);
  const full = path.resolve(rootResolved, '.' + path.sep + decoded);
  if (full !== rootResolved && !full.startsWith(rootResolved + path.sep)) {
    return sendJson(res, 404, { error: 'Not found' });
  }
  try {
    const stat = await fsp.stat(full);
    if (!stat.isFile()) throw new Error('not a file');
    const type = MIME[path.extname(full).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Cache-Control': 'no-cache' });
    fs.createReadStream(full).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

async function handleHealth(res) {
  const body = { ok: true, model: MODEL, keySource: KEY_SOURCE, models: [] };
  if (!API_KEY) {
    body.modelsError = 'No DeepSeek API key configured';
    return sendJson(res, 200, body);
  }
  try {
    const r = await fetch(`${BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      body.modelsError = `DeepSeek /models returned ${r.status}: ${text.slice(0, 500)}`;
    } else {
      const j = await r.json();
      body.models = Array.isArray(j?.data) ? j.data.map((m) => m.id).filter(Boolean) : [];
    }
  } catch (e) {
    body.modelsError = `DeepSeek /models request failed: ${e.message}`;
  }
  sendJson(res, 200, body);
}

function upstreamMessages(systemPrompt, messages) {
  const out = [{ role: 'system', content: systemPrompt }];
  for (const m of messages) {
    const last = out[out.length - 1];
    if (last.role === m.role) last.content += '\n\n' + m.content;
    else out.push({ role: m.role, content: m.content });
  }
  return out;
}

function upstreamErrorDetail(status, text) {
  let detail = text.slice(0, 500);
  try {
    const msg = JSON.parse(text)?.error?.message;
    if (typeof msg === 'string' && msg) detail = msg.slice(0, 500);
  } catch {}
  if (status === 401) detail += ' (the DeepSeek API key was rejected)';
  if (status === 402) detail += ' (the DeepSeek account needs a top-up at platform.deepseek.com)';
  return `DeepSeek returned ${status}: ${detail}`;
}

async function handleMessage(req, res, id) {
  const convo = await readConvo(id);
  if (!convo) return sendJson(res, 404, { error: 'Conversation not found' });
  const body = await readJsonBody(req);
  const content = typeof body.content === 'string' ? body.content : '';
  if (!content.trim()) return sendJson(res, 400, { error: 'content must be a non-empty string' });

  const now = new Date().toISOString();
  const isFirstUser = !convo.messages.some((m) => m.role === 'user');
  convo.messages.push({ role: 'user', content, createdAt: now });
  convo.updatedAt = now;
  let titled = false;
  if (convo.title === 'New chat' && isFirstUser) {
    convo.title = makeTitle(content);
    titled = true;
  }
  await saveConvo(convo);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  let finished = false;
  let clientGone = false;
  const controller = new AbortController();
  const send = (obj) => {
    if (clientGone || res.writableEnded) return;
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
  };
  res.on('close', () => {
    if (!finished) {
      clientGone = true;
      controller.abort();
    }
  });

  if (titled) send({ type: 'title', title: convo.title });

  if (!API_KEY) {
    finished = true;
    send({
      type: 'error',
      message:
        'No DeepSeek API key found. Set DEEPSEEK_API_KEY in the environment, or add a DEEPSEEK_API_KEY=... line to .env in the app folder, then restart the server.',
    });
    return res.end();
  }

  let accumulated = '';
  let errorMessage = null;
  try {
    const systemPrompt = await loadSystemPrompt();
    const upstream = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}`, Accept: 'text/event-stream' },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: upstreamMessages(systemPrompt, convo.messages),
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      errorMessage = upstreamErrorDetail(upstream.status, text);
    } else if (!upstream.body) {
      errorMessage = 'DeepSeek returned an empty response body';
    } else {
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;
      for await (const chunk of upstream.body) {
        buffer += decoder.decode(chunk, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, idx).replace(/\r$/, '');
          buffer = buffer.slice(idx + 1);
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          if (payload === '[DONE]') {
            done = true;
            break;
          }
          let parsed;
          try {
            parsed = JSON.parse(payload);
          } catch {
            continue;
          }
          if (parsed?.error) {
            errorMessage = `DeepSeek stream error: ${JSON.stringify(parsed.error).slice(0, 500)}`;
            done = true;
            break;
          }
          const delta = parsed?.choices?.[0]?.delta?.content;
          if (typeof delta === 'string' && delta.length) {
            accumulated += delta;
            send({ type: 'delta', content: delta });
          }
        }
        if (done) break;
      }
    }
  } catch (e) {
    if (!clientGone) errorMessage = `DeepSeek request failed: ${e.message}`;
  }

  finished = true;
  if (accumulated) {
    const t = new Date().toISOString();
    convo.messages.push({ role: 'assistant', content: accumulated, createdAt: t });
    convo.updatedAt = t;
    try {
      await saveConvo(convo);
    } catch (e) {
      console.error('Failed to save conversation:', e.message);
    }
  }
  if (clientGone) return;
  if (errorMessage) send({ type: 'error', message: errorMessage });
  else send({ type: 'done' });
  res.end();
}

async function handleApi(req, res, pathname) {
  const method = req.method;
  if (pathname === '/api/health' && method === 'GET') return handleHealth(res);

  if (pathname === '/api/conversations') {
    if (method === 'GET') return sendJson(res, 200, await listConvos());
    if (method === 'POST') {
      const now = new Date().toISOString();
      const convo = { id: crypto.randomUUID(), title: 'New chat', createdAt: now, updatedAt: now, messages: [] };
      await saveConvo(convo);
      return sendJson(res, 201, convo);
    }
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const m = pathname.match(/^\/api\/conversations\/([^/]+)(\/messages)?$/);
  if (m) {
    const id = m[1];
    if (!UUID_RE.test(id)) return sendJson(res, 404, { error: 'Conversation not found' });
    if (m[2]) {
      if (method === 'POST') return handleMessage(req, res, id);
      return sendJson(res, 405, { error: 'Method not allowed' });
    }
    if (method === 'GET') {
      const c = await readConvo(id);
      return c ? sendJson(res, 200, c) : sendJson(res, 404, { error: 'Conversation not found' });
    }
    if (method === 'PATCH') {
      const c = await readConvo(id);
      if (!c) return sendJson(res, 404, { error: 'Conversation not found' });
      const body = await readJsonBody(req);
      const title = typeof body.title === 'string' ? body.title.replace(/\s+/g, ' ').trim() : '';
      if (!title) return sendJson(res, 400, { error: 'title must be a non-empty string' });
      c.title = title.slice(0, 200);
      c.updatedAt = new Date().toISOString();
      await saveConvo(c);
      return sendJson(res, 200, summary(c));
    }
    if (method === 'DELETE') {
      try {
        await fsp.unlink(convoPath(id));
      } catch (e) {
        if (e.code === 'ENOENT') return sendJson(res, 404, { error: 'Conversation not found' });
        throw e;
      }
      res.writeHead(204);
      return res.end();
    }
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  return sendJson(res, 404, { error: 'Not found' });
}

const server = http.createServer(async (req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url, `http://${HOST}`).pathname;
  } catch {
    return sendJson(res, 400, { error: 'Bad request' });
  }
  try {
    if (pathname === '/api' || pathname.startsWith('/api/')) return await handleApi(req, res, pathname);
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { error: 'Method not allowed' });
    if (pathname === '/' || pathname === '/index.html') return await serveFile(res, PUBLIC_DIR, 'index.html');
    if (pathname === '/style.css') return await serveFile(res, PUBLIC_DIR, 'style.css');
    if (pathname === '/app.js') return await serveFile(res, PUBLIC_DIR, 'app.js');
    if (pathname === '/vendor/marked.umd.js') return await serveFile(res, path.join(NODE_MODULES, 'marked', 'lib'), 'marked.umd.js');
    if (pathname === '/vendor/purify.min.js') return await serveFile(res, path.join(NODE_MODULES, 'dompurify', 'dist'), 'purify.min.js');
    if (pathname.startsWith('/vendor/katex/')) return await serveFile(res, KATEX_DIR, pathname.slice('/vendor/katex/'.length));
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  } catch (e) {
    console.error('Request error:', e.message);
    if (!res.headersSent) sendJson(res, e.status || 500, { error: e.status ? e.message : 'Internal server error' });
    else if (!res.writableEnded) res.end();
  }
});

await fsp.mkdir(DATA_DIR, { recursive: true });

server.listen(PORT, HOST, () => {
  console.log(`Thermo tutor mock running at http://${HOST}:${PORT}`);
  console.log(`Model: ${MODEL}`);
  console.log(`API key source: ${KEY_SOURCE ?? 'none (set DEEPSEEK_API_KEY)'}`);
});
