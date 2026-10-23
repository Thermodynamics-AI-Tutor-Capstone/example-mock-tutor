// Local/private source assets are intentionally absent from the public repository.
// Run after scripts/import-property-tables.py to verify the installed dataset.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'public/property-tables/manifest.json');
if (!fs.existsSync(file)) { console.log('SKIP private property-table asset checks: run the importer with the three course PDFs first.'); process.exit(0); }
const data=JSON.parse(fs.readFileSync(file,'utf8'));
assert.equal(data.mode,'source-scans');
assert.equal(data.fluid,'Water (H₂O)');
const expectedPages={saturation:5,subcooled:3,superheated:12};
const pressureUnits=['kPa','MPa','kPa','MPa','MPa'];
let pages=0,sections=0,rows=0,cells=0,verified=0,boundaryVapor=0,boundaryLiquid=0,supercritical=0;
const ids=new Set();
for(const dataset of data.datasets) {
 assert.equal(dataset.pages.length,expectedPages[dataset.id]);
 assert.equal(dataset.source.pageCount,dataset.pages.length);
 assert.match(dataset.source.sha256,/^[a-f0-9]{64}$/);
 for(const [index,page] of dataset.pages.entries()) {
  pages++;assert.equal(page.number,index+1);assert.ok(!ids.has(page.id));ids.add(page.id);
  assert.match(page.image,/^\/property-tables\/images\/[a-z]+-\d+\.png$/);
  const png=fs.readFileSync(path.join(root,'public',page.image));
  assert.equal(png.readUInt32BE(16),page.width);assert.equal(png.readUInt32BE(20),page.height);
  assert.equal(crypto.createHash('sha256').update(png).digest('hex'),page.sha256,'image differs from its source manifest');
  for(const section of page.sections) {
   sections++;assert.ok(section.headerTop>=0&&section.headerTop<section.rows[0].top);
   assert.equal(section.columns.length,dataset.id==='saturation'?10:7);
   for(const [i,col] of section.columns.entries()) {
    assert.ok(col.left>=0&&col.right<=page.width&&col.left<col.right);
    if(i)assert.equal(col.left,section.columns[i-1].right,'columns must meet without overlap or gaps');
    assert.ok(col.unit&&col.symbol&&col.label);
   }
   if(dataset.id==='saturation')assert.equal(section.columns.find(c=>c.key==='P').unit,pressureUnits[index]);
   for(const [i,row] of section.rows.entries()) {
    rows++;cells+=section.columns.length;
    assert.ok(row.top>=0&&row.bottom<=page.height&&row.bottom-row.top>=15);
    if(i)assert.equal(row.top,section.rows[i-1].bottom,'row boundaries must not overlap or skip');
    assert.equal(row.id,'r'+(i+1));assert.equal(row.values,undefined,'unverified numbers must stay in source image');
   }
   if(section.kind==='supercritical') {supercritical++;assert.ok(Number(section.pressure.value)>22.064);assert.equal(section.rows[0].phase,undefined);}
   if(dataset.id==='superheated'&&Number(section.pressure.value)<22.064) {boundaryVapor++;assert.equal(section.rows[0].phase,'saturated vapor (boundary)');}
   if(dataset.id==='subcooled'&&Number(section.pressure.value)<=20) {boundaryLiquid++;assert.equal(section.rows.at(-1).phase,'saturated liquid (boundary)');}
   if(dataset.id==='subcooled'&&Number(section.pressure.value)>20)assert.equal(section.rows.at(-1).phase,undefined);
   for(const entry of section.verifiedCells) {
    verified++;assert.ok(section.rows.some(r=>r.id===entry.rowId));assert.ok(section.columns.some(c=>c.key===entry.columnKey));
    assert.match(entry.value,/^-?\d+(?:\.\d+)?$/);assert.equal(entry.verification,'manual source-page review');
   }
  }
 }
}
assert.deepEqual([pages,sections,rows,cells,verified],[20,35,1011,7830,34]);
assert.deepEqual([boundaryVapor,boundaryLiquid,supercritical],[21,4,3]);
function example(id,page,key) {return data.datasets.find(d=>d.id===id).pages[page-1].sections[0].verifiedCells.find(c=>c.columnKey===key).value;}
assert.equal(example('saturation',1,'P'),'3.536900');assert.equal(example('saturation',1,'hg'),'2549.9');
assert.equal(example('saturation',3,'hf'),'417.50');assert.equal(example('saturation',3,'T'),'372.76');
assert.equal(example('subcooled',1,'h'),'117.2');assert.equal(example('superheated',1,'h'),'2739.0');
console.log(`ok ${pages} source pages, ${sections} sections, ${rows} rows, ${cells} cell regions, ${verified} reviewed numbers; source/image hashes, units, geometry and phase boundaries`);
