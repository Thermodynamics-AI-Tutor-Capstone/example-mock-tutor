// Local layout-only harness: real chat/assets with fixed illustrative messages and stub APIs.
// It does not submit student data or call a model. Physics is not evaluated by this fixture.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const variants = new Set(['baseline', 'fluid', 'readable']);
const graphSpec = { fluid: 'water', type: 'Pv', states: [{ label: '1', P: 100, x: 0 }, { label: '2', P: 100, x: 1 }], processes: [{ from: '1', to: '2', path: 'isobaric' }] };
export const sampleReply = `### Check the boundary and assumptions
Treat the turbine as a steady-flow control volume with one inlet and one outlet. The problem explicitly states that heat transfer, kinetic-energy change and potential-energy change are negligible. Keep those assumptions beside the balance so that each omitted term has a reason. The property values below are supplied illustrative data for this layout fixture, not newly looked-up steam-table values.

1. **Write the energy balance.** Use work out of the control volume as positive. Carry the units through the substitution so the final result can be checked independently.
2. **Use the given enthalpies.** The inlet and outlet labels must match the property values. A correct numerical result does not by itself show that a state was identified correctly.
3. **Check the sign and units.** The enthalpy decreases through this illustrative turbine. The balance therefore gives positive work output under the stated sign convention.

$$\\dot{Q}-\\dot{W}=\\dot{m}\\left[(h_2-h_1)+\\frac{V_2^2-V_1^2}{2}+g(z_2-z_1)\\right]$$

| State | Supplied enthalpy (kJ/kg) | Mass flow (kg/s) | Reason for using this row |
| --- | ---: | ---: | --- |
| Inlet | 3240 | 2 | The problem identifies this as the upstream state |
| Outlet | 2600 | 2 | The same steady mass flow leaves the control volume |

$$\\dot{W}_{out}=(2\\,\\mathrm{kg/s})(3240-2600)\\,\\mathrm{kJ/kg}=1280\\,\\mathrm{kW}$$

Which assumption allows you to remove the heat-transfer term?

### Diagram layout fixture
The drawing below exercises the graph viewer and its controls only; it is not a computed result for the turbine above.

\`\`\`kelvin-grapher
${JSON.stringify(graphSpec)}
\`\`\``;

function graphFixture(spec) {
  return { spec, source: 'Offline layout fixture; not a property calculation', warnings: ['Illustrative UI fixture only.'],
    axes: { x: { label: 'Specific volume', unit: 'm³/kg', log: true }, y: { label: 'Pressure', unit: 'kPa' } },
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><g id="axes"><path d="M60 20V335H600" stroke="#304a43" fill="none"/><text x="230" y="380">Specific volume v (m³/kg)</text><text x="65" y="18">Pressure P (kPa)</text></g><g id="boundary"><path d="M110 310Q300 -160 550 310" stroke="#718b81" fill="none" stroke-width="2"/></g><g id="state-0"><circle cx="160" cy="250" r="5" fill="#167258"/><text x="145" y="235">1</text></g><g id="process-0"><path d="M160 250H495" stroke="#167258" stroke-width="3"/><text x="265" y="235">Constant pressure</text></g></svg>',
    states: [{ label: '1', P: 100, T: 99.6, v: 0.00104, h: 417.5, s: 1.302, x: 0 }, { label: '2', P: 100, T: 99.6, v: 1.694, h: 2675, s: 7.359, x: 1 }],
    steps: [
      { id: 'step-0', kind: 'axes', title: 'Label the axes', text: 'Pressure versus specific volume; layout fixture.', targets: ['axes'] },
      { id: 'step-1', kind: 'boundary', title: 'Draw the boundary', text: 'Illustrative phase boundary.', targets: ['boundary'] },
      { id: 'step-2', kind: 'state', title: 'Locate the state', text: 'Illustrative state marker.', targets: ['state-0'] },
      { id: 'step-3', kind: 'process', title: 'Connect the states', text: 'Illustrative process line.', targets: ['process-0'] },
    ] };
}

export async function startLayoutServer(port = 0) {
  const sent = [];
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://layout.test');
    const json = (value, status = 200) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)); };
    const readBody = async () => { let text = ''; for await (const chunk of req) text += chunk; return JSON.parse(text || '{}'); };
    if (url.pathname === '/api/me') return json({ user: { id: 'layout-student', name: 'Layout reviewer' }, profile: { onboarded: true, default_style: 'office-hours' } });
    if (url.pathname === '/api/styles') return json([{ id: 'office-hours', name: 'Guided tutor', available: true, default: true }]);
    if (url.pathname === '/api/me/usage') return json({ percent: 0, state: 'normal' });
    if (url.pathname === '/api/dictation') return json({ available: false });
    if (url.pathname === '/api/conversations') return json(req.method === 'POST' ? { id: 'layout-review', title: 'Turbine work · layout fixture' } : [{ id: 'layout-review', title: 'Turbine work · layout fixture' }]);
    if (url.pathname === '/api/conversations/layout-review') return json({ id: 'layout-review', title: 'Turbine work · layout fixture', pendingAttachments: [], messages: [{ id: 1, role: 'user', content: 'Please review my turbine balance and show the units clearly.', checkWork: true }, { id: 2, role: 'assistant', content: sampleReply }] });
    if (url.pathname === '/api/conversations/layout-review/messages') {
      sent.push(await readBody()); res.writeHead(200, { 'content-type': 'text/event-stream' });
      res.end('data: {"type":"delta","content":"Fixture received. No model was called."}\n\ndata: {"type":"done"}\n\n'); return;
    }
    if (url.pathname === '/api/grapher/render') return json(graphFixture(await readBody()));
    if (url.pathname.startsWith('/api/')) return json({});
    if (url.pathname === '/layout-review/sent') return json(sent);
    if (url.pathname.startsWith('/layout-review/')) {
      const filename = path.basename(url.pathname);
      if (!['baseline.css', 'fluid.css', 'readable.css', 'common.css'].includes(filename)) return json({ error: 'Not found' }, 404);
      res.writeHead(200, { 'content-type': 'text/css' }); res.end(fs.readFileSync(path.join(root, 'scripts/fixtures/layout-review', filename))); return;
    }
    const relative = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
    let file = path.resolve(root, 'public', '.' + relative);
    if (!file.startsWith(path.join(root, 'public') + path.sep)) return json({ error: 'Not found' }, 404);
    // Vendor assets are generated locally, not included in the experiment source snapshot.
    if (!fs.existsSync(file) && relative.startsWith('/vendor/')) file = path.resolve(root, '..', 'public', '.' + relative);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return json({ error: 'Local asset unavailable' }, 404);
    const ext = path.extname(file);
    res.writeHead(200, { 'content-type': { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }[ext] || 'application/octet-stream' });
    if (relative === '/index.html') {
      if (url.searchParams.get('layout') === 'final') { res.end(fs.readFileSync(file, 'utf8')); return; }
      const variant = variants.has(url.searchParams.get('layout')) ? url.searchParams.get('layout') : 'baseline';
      // Keep variants independent even if the reviewed candidate has been applied to the app.
      const html = fs.readFileSync(file, 'utf8').replace('<link rel="stylesheet" href="/chat-layout.css">', '');
      res.end(html.replace('</head>', `<link rel="stylesheet" href="/layout-review/${variant}.css"></head>`)); return;
    }
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  return { server, origin: `http://127.0.0.1:${server.address().port}`, sent };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { origin } = await startLayoutServer(Number(process.env.LAYOUT_REVIEW_PORT) || 0);
  console.log(JSON.stringify({ origin, candidates: [...variants].map((name) => `${origin}/?layout=${name}#/c/layout-review`) }));
}
