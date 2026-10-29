import assert from 'node:assert/strict';
import http from 'node:http';
import { propertyReference } from '../lib/property-reference.js';
import { state } from '../lib/properties.js';
delete process.env.KELVIN_LOCAL_DEV;
process.env.NEON_AUTH_BASE_URL = 'https://property-reference.test';
const { handle } = await import('../lib/app.js');
const realFetch = globalThis.fetch;
globalThis.fetch = async (url) => { assert.ok(String(url).startsWith(process.env.NEON_AUTH_BASE_URL)); return Response.json({ user: { id: 'property-reader', email: 'reader@example.test' } }); };
for (const [fluid, properties] of [['water',{P:1000,T:300}],['r134a',{P:500,x:.5}],['water',{T:100,x:0}]]) {
  const found = propertyReference({fluid,properties}); assert.deepEqual(found.state,state(fluid,properties)); assert.match(found.source,/CoolProp/); assert.equal(found.units.P,'kPa'); assert.equal(found.units.T,'°C');
}
for (const body of [null,{}, {fluid:'constructor',properties:{P:100,T:20}}, {fluid:'__proto__',properties:{P:100,T:20}}, {fluid:'air',properties:{P:100,T:20}}, {fluid:'water',properties:{P:'100',T:20}}, {fluid:'water',properties:{P:NaN,T:20}}, {fluid:'water',properties:{P:100,T:20,x:1}}, {fluid:'water',properties:{P:100,secret:20}}, {fluid:'water',properties:{P:-10,T:20}}, {fluid:'water',properties:{P:100,T:100000}}, {fluid:'water',properties:{P:100,x:2}}, {fluid:'water',properties:{h:100,s:1}}]) assert.ok(propertyReference(body).error,JSON.stringify(body));
const sat = state('water',{P:100,x:0}); assert.match(propertyReference({fluid:'water',properties:{P:100,T:sat.T}}).error,/don't fix the state/);
const server = http.createServer(handle); await new Promise((resolve)=>server.listen(0,'127.0.0.1',resolve));
try {
  const url=`http://127.0.0.1:${server.address().port}/api/properties/lookup`;
  assert.equal((await realFetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({fluid:'water',properties:{P:1000,T:300}})})).status,401);
  assert.equal((await realFetch(url,{headers:{cookie:'session_token=property-test'}})).status,405);
  const valid=await realFetch(url,{method:'POST',headers:{cookie:'session_token=property-test','content-type':'application/json'},body:JSON.stringify({fluid:'water',properties:{P:1000,T:300}})});
  assert.equal(valid.status,200); assert.equal((await valid.json()).state.phase,'superheated vapor');
  const invalid=await realFetch(url,{method:'POST',headers:{cookie:'session_token=property-test','content-type':'application/json'},body:JSON.stringify({fluid:'water',properties:{P:1000,T:100000}})});
  assert.equal(invalid.status,400); assert.match((await invalid.json()).error,/outside/);
  console.log('ok  water/R134a delegate exactly to existing tables, units/provenance, ambiguous saturation, validation/range errors, auth and methods');
} finally {globalThis.fetch=realFetch;server.closeAllConnections();await new Promise((resolve)=>server.close(resolve));}
