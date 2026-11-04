import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')), hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const p=read('content/route-provenance.json'),d=read(p.routeAsset),location=read('content/location.json');
assert.equal(hash(p.routeAsset),p.sha256);
assert.equal(hash(p.welcomePhoto.file),p.welcomePhoto.sha256);
assert.equal(p.welcomePhoto.sha256,'9b55db46a57f293227c18253f16acba082ce0231726f83700ddbb1af7c413852');
assert.equal(d.route.coordinates.length,538);
assert.equal(d.route.distanceMeters,31554);
assert.deepEqual(d.route.stops.map(s=>s.id),['mukachevo','serednie','kybliary']);
assert.deepEqual(d.route.stops.at(-1).coordinate,[location.longitude,location.latitude]);
assert.equal(d.route.connectorIsRoad,false);
assert.ok(d.route.destinationSnapDistanceMeters>24&&d.route.destinationSnapDistanceMeters<26);
assert.ok(d.route.stops[1].progress>.65&&d.route.stops[1].progress<.71);
assert.equal(d.route.cumulativeMeters.length,538);
assert.ok(d.route.cumulativeMeters.every((n,i,a)=>i===0||n>=a[i-1]));
assert.equal(Object.values(d.roads).reduce((n,ways)=>n+ways.length,0),1771);
assert.equal(Object.values(d.roads).flat().reduce((n,way)=>n+way.length,0),4144);
for(const lang of ['uk','en']){
 const html=fs.readFileSync(`dist/${lang}/index.html`,'utf8');
 assert.ok(html.includes(`data-route="/assets/maps/zakarpattia-route.json?v=${p.sha256.slice(0,12)}"`));
 assert.ok(html.includes('OpenStreetMap contributors, ODbL'));
 assert.ok(html.includes('data-arrival="false"'));
 assert.equal((html.match(/src="\/assets\/photos\/welcome-gate-1600.webp"/g)||[]).length,1);
}
assert.equal(hash('dist/'+p.welcomePhoto.file),p.welcomePhoto.sha256);
assert.equal(hash('dist/'+p.routeAsset),p.sha256);
console.log(JSON.stringify({result:'PASS',route:'Mukachevo → Serednie → Kybliary',roadWays:p.roadWays,roadPoints:p.roadPoints,routePoints:p.routePoints,distanceMeters:p.routeDistanceMeters,connectorMeters:p.destinationSnapDistanceMeters,photo:'Original bytes preserved; displayed only at arrival',sha256:p.welcomePhoto.sha256},null,2));
