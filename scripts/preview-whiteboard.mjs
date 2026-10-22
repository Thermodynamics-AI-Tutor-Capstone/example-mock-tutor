// Local, authored examples for evaluating illustration and browser narration without a model key.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { illustrationBoards, illustratedLessonInput } from './fixtures/illustrated-boards.mjs';
import { validateBoard } from '../lib/tools/show_on_board.js';
import { validateLesson } from '../lib/whiteboard.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lesson = validateLesson(illustratedLessonInput);
const boards = [{ ...lesson.board, lesson: { id: '11111111-1111-4111-8111-111111111111', segments: lesson.segments } }, ...illustrationBoards.slice(1).map(validateBoard)];
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Kelvin — whiteboard examples</title><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/narration.css">
<style>:root{--border:#d8dde2;--bubble:#fffef9;--bg:#fff;--text:#253243;--text2:#536173;--hover:#eef1f5;--send-bg:#2458b4;--send-fg:#fff}*{box-sizing:border-box}body{font:16px/1.5 system-ui,sans-serif;background:#f2f5f8;color:var(--text);margin:0;padding:24px}main{max-width:1160px;margin:auto}h1{font-size:25px;margin:0}header{margin-bottom:24px}header p{max-width:820px}button,select{font:inherit;cursor:pointer}.example{margin-bottom:24px}a{color:#2458b4}@media(max-width:600px){body{padding:12px}}</style></head><body><main>
<header><h1>Whiteboard examples</h1><p>Authored sample lessons for reviewing Kelvin’s illustrations and drawing pace. These are examples, not live AI answers. Press <b>Play narration</b> on the piston lesson to try the pen and device voice, or use <b>Next step</b> to reveal it silently.</p><a href="http://127.0.0.1:3301/">Return to the local tutor</a></header>
<div id="examples"></div></main><script src="/vendor/katex/katex.min.js"></script><script src="/board.js"></script><script src="/narration.js"></script>
<script>const boards=${JSON.stringify(boards).replaceAll('<', '\\u003c')};for(const board of boards){const wrapper=document.createElement('section');wrapper.className='example';wrapper.innerHTML=KelvinBoard.render(board);document.getElementById('examples').append(wrapper);if(board.lesson)KelvinNarration.mount(wrapper,board);}</script></body></html>`;
const allowed = new Map([
  ['/board.js', ['public/board.js', 'text/javascript']],
  ['/narration.js', ['public/narration.js', 'text/javascript']],
  ['/narration.css', ['public/narration.css', 'text/css']],
  ['/vendor/katex/katex.min.js', ['public/vendor/katex/katex.min.js', 'text/javascript']],
  ['/vendor/katex/katex.min.css', ['public/vendor/katex/katex.min.css', 'text/css']],
]);
const port = Number(process.env.WHITEBOARD_PREVIEW_PORT || 3302);
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.writeHead(405); return res.end(); }
  if (url.pathname === '/') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); return res.end(html); }
  let asset = allowed.get(url.pathname);
  if (/^\/vendor\/katex\/fonts\/[A-Za-z0-9_-]+\.(woff2?|ttf)$/.test(url.pathname)) asset = ['public' + url.pathname, 'font/woff2'];
  const file = asset && path.join(root, asset[0]);
  if (!file || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type', asset[1]); fs.createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`Authored whiteboard examples: http://127.0.0.1:${port}/ (no model API)`));

