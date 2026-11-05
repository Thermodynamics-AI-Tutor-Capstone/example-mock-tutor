const API = 'https://kelvin-mcp.vercel.app';
const resource = `${API}/dashboard-data`;
const proxy = action => `/api/kelvin?action=${action}`;
const app = document.querySelector('#app');
const signout = document.querySelector('#signout');
const demo = {
  instructor: { name: 'Demo Professor' },
  trends: { suppressed: false, students: 6, events: 21,
    topics: [{ id: 'topic:m7-07-entropy', count: 7 }, { id: 'topic:m5-04-energy-conservation', count: 6 }, { id: 'topic:m4-03-phase-decision-tree', count: 5 }],
    misconceptions: [{ id: 'misc:m15-adiabatic-implies-isentropic', count: 5 }, { id: 'misc:m01-heat-energy-temperature-conflated', count: 5 }] },
  students: ['Student A','Student B','Student C','Student D','Student E','Student F'].map((name,i) => ({ id: `demo-${i+1}`, name }))
};
const demoRecords = {
  'demo-1': [{ at: '2026-11-02T15:00:00Z', statement: 'I practiced entropy balances and still need to sort out where entropy generation goes.', topics: ['topic:m7-07-entropy'], misconceptions: [], classificationStatus: 'classified' }],
  'demo-2': [{ at: '2026-11-02T18:30:00Z', statement: 'I worked through a turbine energy balance and mixed up inlet and outlet signs.', topics: ['topic:m5-04-energy-conservation'], misconceptions: [], classificationStatus: 'classified' }],
  'demo-3': [{ at: '2026-11-03T14:20:00Z', statement: 'I am trying to tell saturated mixture states from superheated vapor states.', topics: ['topic:m4-03-phase-decision-tree'], misconceptions: [], classificationStatus: 'classified' }]
};
const state = { mode: null, summary: null, access: null, refresh: null, clientId: null };
const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
const shortName = id => id.replace(/^(topic|misc):/, '').replace(/^m\d+(?:-\d+)?-/, '').replaceAll('-', ' ');
const store = () => { sessionStorage.setItem('kelvin-dashboard-session', JSON.stringify({ mode: state.mode, access: state.access, refresh: state.refresh, clientId: state.clientId })); };
const saved = () => { try { return JSON.parse(sessionStorage.getItem('kelvin-dashboard-session') || '{}'); } catch { return {}; } };
function logout() { sessionStorage.removeItem('kelvin-dashboard-session'); sessionStorage.removeItem('kelvin-oauth-pending'); state.mode = null; state.summary = null; state.access = null; state.refresh = null; renderLogin(); }
signout.addEventListener('click', logout);

function renderLogin(message = '') {
  signout.classList.add('hidden');
  app.innerHTML = `<div class="login-layout"><section><p class="eyebrow">Professor view</p><h1>See where the class is getting stuck.</h1><p class="lead">Kelvin brings together the ME 300 topics students chose to save. Start with the demo, or sign in with an instructor account to see live records students have shared.</p></section><section class="login-card"><h2>Open the dashboard</h2><p class="muted">Use the demo account to explore the layout with sample data.</p><form id="demo-form"><label for="username">Username</label><input id="username" name="username" autocomplete="username" required><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required><div class="login-actions"><button class="button full" type="submit">View demo</button><div class="divider">or</div><button class="button secondary full" id="live-login" type="button">Sign in as an instructor</button></div><p class="hint">Demo account: username / password. It contains sample records only.</p><p class="error" id="login-error"></p></form></section></div>`;
  if (message) document.querySelector('#login-error').textContent = message;
  document.querySelector('#demo-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('username') !== 'username' || data.get('password') !== 'password') {
      document.querySelector('#login-error').textContent = 'Use username / password for the demo.'; return;
    }
    state.mode = 'demo'; state.summary = demo; store(); renderDashboard();
  });
  document.querySelector('#live-login').addEventListener('click', () => startInstructorLogin().catch(err => renderLogin(`Could not start sign-in: ${err.message}`)));
}
async function startInstructorLogin() {
  let clientId = localStorage.getItem('kelvin-dashboard-client-id');
  if (!clientId) {
    const response = await fetch(proxy('register'), { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ client_name: 'Kelvin professor dashboard', redirect_uris: [location.origin + '/'],
        grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'], token_endpoint_auth_method: 'none' }) });
    if (!response.ok) throw new Error('The Kelvin authorization server did not register this dashboard.');
    clientId = (await response.json()).client_id;
    localStorage.setItem('kelvin-dashboard-client-id', clientId);
  }
  const verifier = randomUrlSafe(32), stateValue = randomUrlSafe(24);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = urlSafe(new Uint8Array(digest));
  sessionStorage.setItem('kelvin-oauth-pending', JSON.stringify({ verifier, stateValue, clientId }));
  const url = new URL(`${API}/authorize`);
  for (const [key,value] of Object.entries({ response_type: 'code', client_id: clientId, redirect_uri: location.origin + '/',
    code_challenge: challenge, code_challenge_method: 'S256', scope: 'mcp:tools', state: stateValue, resource })) url.searchParams.set(key, value);
  location.assign(url.href);
}
function urlSafe(bytes) { return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,''); }
function randomUrlSafe(length) { const bytes = new Uint8Array(length); crypto.getRandomValues(bytes); return urlSafe(bytes); }
async function completeInstructorLogin() {
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  if (!code) return false;
  const pending = JSON.parse(sessionStorage.getItem('kelvin-oauth-pending') || 'null');
  history.replaceState(null, '', '/');
  if (!pending || params.get('state') !== pending.stateValue) throw new Error('Sign-in did not match this browser session.');
  const response = await fetch(proxy('token'), { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', client_id: pending.clientId, code,
      code_verifier: pending.verifier, redirect_uri: location.origin + '/', resource }) });
  sessionStorage.removeItem('kelvin-oauth-pending');
  if (!response.ok) throw new Error('Kelvin could not finish sign-in. Please try again.');
  const tokens = await response.json();
  state.mode = 'live'; state.access = tokens.access_token; state.refresh = tokens.refresh_token; state.clientId = pending.clientId; store();
  await loadLive(); return true;
}
async function refreshAccess() {
  if (!state.refresh) throw new Error('Your sign-in expired. Please sign in again.');
  const response = await fetch(proxy('token'), { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', client_id: state.clientId, refresh_token: state.refresh, resource }) });
  if (!response.ok) throw new Error('Your sign-in expired. Please sign in again.');
  const tokens = await response.json(); state.access = tokens.access_token; state.refresh = tokens.refresh_token; store();
}
async function liveGet(studentId) {
  const url = new URL(proxy('data'), location.origin);
  if (studentId) url.searchParams.set('student_id', studentId);
  let response = await fetch(url, { headers: { Authorization: `Bearer ${state.access}` } });
  if (response.status === 401) { await refreshAccess(); response = await fetch(url, { headers: { Authorization: `Bearer ${state.access}` } }); }
  if (!response.ok) throw new Error(response.status === 403 ? 'This account does not have instructor access.' : 'Kelvin could not load the live course data.');
  return response.json();
}
async function loadLive() { app.innerHTML = '<p class="loading">Loading course insights…</p>'; state.summary = await liveGet(); renderDashboard(); }
function addBars(parent, items, type) {
  if (!items?.length) { parent.append(el('p','muted','No shared records in this category yet.')); return; }
  const max = Math.max(...items.map(x => x.count));
  const bars = el('div','bars');
  for (const item of items) {
    const row = el('div'); const label = el('div','bar-label');
    label.append(el('span','',shortName(item.id)),el('span','',String(item.count)));
    const bar = el('progress',type); bar.max = max; bar.value = item.count;
    row.append(label,bar); bars.append(row);
  }
  parent.append(bars);
}
function renderDashboard() {
  signout.classList.remove('hidden');
  const data = state.summary, trends = data.trends;
  app.innerHTML = '';
  const hero = el('div','hero'); const heading = el('div');
  heading.append(el('p','eyebrow','ME 300 · course insights'),el('h1','',`Welcome, ${data.instructor.name}.`),
    el('p','lead','See which topics students saved, then open a student record if they chose to share it.'));
  hero.append(heading,el('span',`badge ${state.mode === 'demo' ? 'demo' : ''}`,state.mode === 'demo' ? 'Demo data' : 'Live course data'));
  app.append(hero);
  if (state.mode === 'demo') app.append(el('p','notice','This is a sample dashboard. The names and records here are made up.'));
  else app.append(el('p','notice','Students enter their own names. Kelvin has not verified their identities.'));
  const stats = el('div','stats');
  for (const [label,value] of [['Students with records',trends.students],['Saved reflections',trends.events],['Students sharing by name',data.students.length]]) {
    const stat=el('div','stat'); stat.append(el('span','',label),el('strong','',String(value))); stats.append(stat);
  }
  app.append(stats);
  const grid=el('div','grid'), left=el('div'), right=el('div');
  const topics=el('section','panel'); topics.append(el('h2','','Topics students worked on'));
  if (trends.suppressed) topics.append(el('p','muted',`Trends appear after at least ${trends.minimumStudents} students save reflections.`));
  else addBars(topics,trends.topics,'topic'); left.append(topics);
  const misconceptions=el('section','panel'); misconceptions.append(el('h2','','Misconceptions to revisit'));
  if (trends.suppressed) misconceptions.append(el('p','muted','There are not enough student records to show a class trend yet.'));
  else addBars(misconceptions,trends.misconceptions,'misconception'); left.append(misconceptions);
  const students=el('section','panel'); students.append(el('h2','','Students who chose to share'));
  if (!data.students.length) students.append(el('p','muted','No students have enabled named sharing yet.'));
  else { const list=el('div','student-list'); for (const student of data.students) {
    const button=el('button','student-row'); button.type='button'; button.append(el('span','',student.name),el('span','','View →'));
    button.addEventListener('click',() => showStudent(student).catch(err => renderError(err.message))); list.append(button);
  } students.append(list); } right.append(students);
  grid.append(left,right); app.append(grid);
}
function renderError(message) { const notice=el('p','notice',message); app.prepend(notice); }
async function showStudent(student) {
  app.innerHTML='<p class="loading">Loading student record…</p>';
  const data = state.mode === 'demo' ? { student, total: (demoRecords[student.id] || []).length, recent: demoRecords[student.id] || [] } : await liveGet(student.id);
  app.innerHTML=''; const back=el('button','quiet back','← Back to course'); back.addEventListener('click',renderDashboard); app.append(back);
  app.append(el('p','eyebrow','Student record'),el('h1','',student.name),el('p','lead',`${data.total} reflection${data.total===1?'':'s'} saved through Kelvin.`));
  const panel=el('section','panel'); panel.append(el('h2','','Recent reflections'));
  if (!data.recent.length) panel.append(el('p','muted','No saved reflections yet.'));
  for (const record of data.recent) {
    const row=el('div','record'); row.append(el('div','record-meta',new Date(record.at).toLocaleDateString() + ` · ${record.classificationStatus || 'pending'}`),
      el('p','',record.statement),el('p','muted',record.summary || 'Topic classification is pending.'));
    if (record.topics?.length) row.append(el('p','muted',`Topics: ${record.topics.map(shortName).join(', ')}`));
    panel.append(row);
  }
  app.append(panel);
}
async function boot() {
  try { if (await completeInstructorLogin()) return; } catch (error) { renderLogin(error.message); return; }
  Object.assign(state,saved());
  if (state.mode === 'demo') { state.summary=demo; renderDashboard(); }
  else if (state.mode === 'live' && state.access) { try { await loadLive(); } catch (error) { logout(); renderLogin(error.message); } }
  else renderLogin();
}
boot();
