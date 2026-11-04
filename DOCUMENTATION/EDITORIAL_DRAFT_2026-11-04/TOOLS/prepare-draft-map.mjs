import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
import {build} from './draft-map-tools/node_modules/esbuild/lib/main.js';
import {feature} from './draft-map-tools/node_modules/topojson-client/src/index.js';
import {geoArea,geoContains,geoCentroid,geoOrthographic,geoPath} from './draft-map-tools/node_modules/d3-geo/src/index.js';
const out='site/assets/maps';fs.mkdirSync(out,{recursive:true});
const topo=JSON.parse(fs.readFileSync('draft-map-tools/node_modules/world-atlas/land-110m.json','utf8'));
const land=feature(topo,topo.objects.land);
const roundCoordinates=value=>Array.isArray(value)?value.map(roundCoordinates):+value.toFixed(3);
for(const f of land.features||[land])f.geometry.coordinates=roundCoordinates(f.geometry.coordinates);
const ukraine=JSON.parse(fs.readFileSync('draft-map-data/ADM0.geojson','utf8')).features[0];
const region=JSON.parse(fs.readFileSync('draft-map-data/ADM1.geojson','utf8')).features.find(f=>f.properties.shapeISO==='UA-21');
function distance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1];if(!dx&&!dy)return Math.hypot(p[0]-a[0],p[1]-a[1]);const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)}
function simplify(points,tolerance){if(points.length<=2)return points;let maximum=0,index=0;for(let i=1;i<points.length-1;i++){const d=distance(points[i],points[0],points.at(-1));if(d>maximum){maximum=d;index=i}}return maximum>tolerance?[...simplify(points.slice(0,index+1),tolerance).slice(0,-1),...simplify(points.slice(index),tolerance)]:[points[0],points.at(-1)];}
function prepare(f,tolerance){const g=structuredClone(f.geometry);const polygons=g.type==='MultiPolygon'?g.coordinates:[g.coordinates];for(const poly of polygons)for(let i=0;i<poly.length;i++){const ring=simplify(poly[i],tolerance);poly[i]=ring.length>=4?ring:poly[i];poly[i]=poly[i].map(p=>p.map(x=>+x.toFixed(5)));}
 const result={type:'Feature',properties:{name:f.properties.shapeName},geometry:g};if(geoArea(result)>Math.PI*2)for(const poly of polygons)for(const ring of poly)ring.reverse();return result;}
const data={land,ukraine:prepare(ukraine,.012),region:prepare(region,.002)};
const location=JSON.parse(fs.readFileSync('site/content/location.json','utf8'));const point=[location.longitude,location.latitude];
if(!geoContains(data.region,point)||!geoContains(data.ukraine,point)||!geoContains(data.ukraine,[34,45.3]))throw Error('Geometry verification failed: location or Crimea not included');
fs.writeFileSync(out+'/journey-geometry.json',JSON.stringify(data));
const projection=geoOrthographic().rotate([-12,-25]).scale(205).translate([400,245]);
const svgPath=geoPath(projection).digits(1)(data.land);
fs.writeFileSync(out+'/journey-globe.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 490"><defs><radialGradient id="o" cx="35%" cy="30%"><stop stop-color="#284e40"/><stop offset="1" stop-color="#0d291f"/></radialGradient></defs><circle cx="400" cy="245" r="215" fill="none" stroke="#b9a478" stroke-opacity=".2"/><circle cx="400" cy="245" r="205" fill="url(#o)" stroke="#b9a478" stroke-opacity=".6"/><path d="${svgPath}" fill="#587260" stroke="#bcb793" stroke-opacity=".35" stroke-width=".5"/></svg>`);
fs.writeFileSync('draft-map-tools/engine-entry.js',"export {geoOrthographic,geoPath,geoGraticule10,geoCentroid,geoDistance} from 'd3-geo';");
await build({entryPoints:['draft-map-tools/engine-entry.js'],outfile:out+'/geo-engine.js',bundle:true,minify:true,format:'esm',target:['es2020'],legalComments:'inline'});
const notices=[];for(const pkg of ['d3-geo','d3-array','internmap','world-atlas']){const p=path.resolve('draft-map-tools/node_modules',pkg,'LICENSE');if(fs.existsSync(p))notices.push(pkg+'\n'+fs.readFileSync(p,'utf8'));}
// Resolve transitive license files through the package's own dependency directory.
for(const pkg of ['d3-array','internmap']){const matches=fs.readdirSync('draft-map-tools/node_modules/.pnpm').filter(n=>n.startsWith(pkg+'@'));for(const dir of matches){const p=`draft-map-tools/node_modules/.pnpm/${dir}/node_modules/${pkg}/LICENSE`;if(fs.existsSync(p))notices.push(pkg+'\n'+fs.readFileSync(p,'utf8'));}}
fs.writeFileSync(out+'/NOTICE.txt',`Map geometry: Natural Earth land via world-atlas 2.0.2 (public domain). https://www.naturalearthdata.com/about/terms-of-use/\nUkraine and Zakarpattia: geoBoundaries gbOpen, boundary year 2017, source OpenStreetMap/Wambacher, ODbL 1.0. https://www.openstreetmap.org/copyright https://opendatacommons.org/licenses/odbl/1-0/\nDerived geometry simplified and rounded for display; source metadata and reproducible processing are documented in content/map-prototype-sources.json. No street routing or terrain elevation data.\n\n`+notices.join('\n\n'));
const metadata={created:'2026-11-04',land:{source:'https://github.com/topojson/world-atlas',version:'2.0.2',license:'Public domain'},ukraine:JSON.parse(fs.readFileSync('draft-map-data/ADM0-source.json','utf8')),region:JSON.parse(fs.readFileSync('draft-map-data/ADM1-source.json','utf8')),adaptations:{landRoundingDecimals:3,ukraineToleranceDegrees:.012,regionToleranceDegrees:.002,roundingDecimals:5,projectionWinding:'D3 spherical polygon convention'},target:{...location,coordinateSource:'Existing content/location.json, unchanged'},verification:{pointWithinUkraine:true,pointWithinZakarpattia:true,crimeaWithinUkraine:true},assets:{}};
for(const file of fs.readdirSync(out)){const bytes=fs.readFileSync(out+'/'+file);metadata.assets[file]={bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};}
fs.writeFileSync('site/content/map-prototype-sources.json',JSON.stringify(metadata,null,2)+'\n');console.log(JSON.stringify({ukraineCenter:geoCentroid(data.ukraine),regionCenter:geoCentroid(data.region),assets:metadata.assets},null,2));
