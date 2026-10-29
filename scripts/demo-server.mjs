// Offline UI preview only. Never imported by server.js or the deployed API.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { copyVendor, vendorReady } from './copy-vendor.mjs';
import { selfCheckCatalog, selfCheckCase } from '../lib/self-check-cases.js';
import { propertyReference } from '../lib/property-reference.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/png' };
const sample = 'This is a **local preview with a scripted response**. In the full app, Kelvin would use your reasoning to guide the next question.\n\nWhich assumption would you check first?';
export function createDemoServer() {
  const conversations = new Map();
  let counter = 0;
  const profile = { onboarded: true, display_name: 'Demo student', default_style: 'office-hours', jev_enabled: false };
  return http.createServer(async (req, res) => {
    const json = (data, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      const route = url.pathname;
      if (route.startsWith('/api/')) {
        let body = '', size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 65536) return json({ error: 'Uploads are unavailable in the local preview. Use the full app to attach files.' }, 413);
          body += chunk;
        }
        const data = body ? JSON.parse(body) : {};
        if (route === '/api/me' && req.method === 'GET') return json({ user: { id: 'local-demo', name: 'Demo student', email: 'demo@localhost' }, profile });
        if (route === '/api/me/profile' && req.method === 'PUT') { Object.assign(profile, data); return json(profile); }
        if (route === '/api/me/learning') {
          if (req.method !== 'GET') return json({ error: 'Learning notes and evidence need the full app. This offline preview does not save a student profile.' }, 503);
          return json({ markdown: 'Local preview. No student learning data is stored.',
            profile: { version: 1, topics: [], misconceptions: [], notes: [], practice: [], strengths: [], nextPractice: [], evidenceCount: 0, latestDate: null } });
        }
        if (route === '/api/properties/lookup') {
          if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
          const result = propertyReference(data);
          return json(result, result.error ? 400 : 200);
        }
        if (route === '/api/self-check' && req.method === 'GET') return json({ topics: selfCheckCatalog() });
        if (route === '/api/me/usage') return json({ percent: 0, state: 'normal' });
        if (route === '/api/health') return json({ demo: true, externalCalls: false });
        if (route === '/api/dictation' && req.method === 'GET') return json({ available: false });
        if (route === '/api/styles') return json([
          { id: 'office-hours', icon: '○', name: 'Coach', description: 'Work through the next step with guiding questions.', available: true, default: true },
          { id: 'worked-example', icon: '▱', name: 'Worked example', description: 'Follow a related example, then try your own problem.', available: true },
        ]);
        if (route === '/api/kb') return json({ l0: '# Local preview\n\nThe full app loads your course knowledge here. Use Back to chat to return to the tutorial.', cards: [], courseFiles: 0 });
        if (route === '/api/conversations' && req.method === 'GET') return json([...conversations.values()].map(({ messages, ...conversation }) => conversation));
        if (route === '/api/conversations' && req.method === 'POST') {
          const conversation = { id: 'demo-' + ++counter, title: 'Practice conversation', style: data.style || 'office-hours', createdAt: new Date().toISOString(), messages: [] };
          if (data.selfCheck) {
            const { topic, item } = selfCheckCase(data.selfCheck, data.selfCheckCase);
            conversation.title = 'Self-check · ' + topic.title;
            conversation.selfCheck = { topicId: topic.id, caseId: item.id, title: topic.title, question: item.question, active: true, assisted: false, attempted: false };
            conversation.messages.push({ role: 'assistant', content: `**Check my understanding: ${topic.title}**\n\n${item.question}\n\nLocal preview: replies are scripted and no learning evidence is saved.` });
          }
          conversations.set(conversation.id, conversation); return json(conversation);
        }
        const match = route.match(/^\/api\/conversations\/([^/]+)(\/messages)?$/);
        if (match) {
          const conversation = conversations.get(match[1]);
          if (!conversation) return json({ error: 'This preview conversation no longer exists. Start a new chat.' }, 404);
          if (match[2] && req.method === 'POST') {
            let reply = sample;
            if (conversation.selfCheck?.active) {
              const session = conversation.selfCheck;
              const { item } = selfCheckCase(session.topicId, session.caseId);
              const action = data.selfCheckAction;
              if (action && !['answer', 'hint', 'explain', 'finish'].includes(action)) return json({ error: 'Unknown self-check action.' }, 400);
              if (action === 'hint' || action === 'explain') session.assisted = true;
              else if (action === 'finish') session.active = false;
              else session.attempted = true;
              const feedback = action === 'hint' ? item.hint : action === 'explain' ? item.focus
                : action === 'finish' ? 'This preview self-check is finished. No assessment or mastery was recorded.'
                : 'Your response is visible in the conversation. The full app uses the configured tutor to assess your reasoning; this preview does not grade it.';
              reply = '**Local preview — scripted response.**\n\n' + feedback;
            }
            conversation.messages.push({ role: 'user', content: String(data.content || '') }, { role: 'assistant', content: reply });
            res.writeHead(200, { 'Content-Type': 'text/event-stream' });
            const event = conversation.selfCheck ? 'data: ' + JSON.stringify({ type: 'self_check', selfCheck: conversation.selfCheck }) + '\n\n' : '';
            return res.end(event + 'data: ' + JSON.stringify({ type: 'delta', content: reply }) + '\n\ndata: {"type":"done"}\n\n');
          }
          if (req.method === 'DELETE') { conversations.delete(conversation.id); return json({ ok: true }); }
          if (req.method === 'PATCH') { conversation.style = data.style || conversation.style; return json(conversation); }
          if (req.method === 'GET') return json(conversation);
        }
        return json({ error: 'This feature needs the full app. This local preview has no accounts, uploads, microphone transcription, or AI calls.' }, 503);
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') return json({ error: 'Method not allowed' }, 405);
      const decoded = decodeURIComponent(route);
      let file = path.resolve(root, '.' + (decoded === '/' ? '/index.html' : decoded));
      if (!file.startsWith(root + path.sep)) return json({ error: 'Not found' }, 404);
      if (!path.extname(file)) file += '.html';
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return json({ error: 'Not found' }, 404);
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store');
      if (req.method === 'HEAD') return res.end();
      if (file.endsWith('index.html')) return res.end(fs.readFileSync(file, 'utf8').replace('</body>', '<div class="demo-mode-banner">Local preview · scripted replies · uploads & microphone unavailable · nothing is sent to an AI service</div></body>'));
      fs.createReadStream(file).pipe(res);
    } catch {
      if (!res.headersSent) json({ error: 'Invalid preview request' }, 400);
      else res.end();
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (!vendorReady()) copyVendor();
  const port = Number(process.env.PORT) || 3301;
  const server = createDemoServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`KELVIN local preview: http://127.0.0.1:${port}/#/learn\nNo credentials, database, or external API calls. Ctrl+C to stop.`));
}
