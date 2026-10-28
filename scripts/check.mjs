import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'dist');
const files=fs.readdirSync(out,{recursive:true}).filter(f=>fs.statSync(path.join(out,f)).isFile());
let links=0,pages=0;
const resolve=(from,ref)=>{
 const uri=new URL(ref,'https://local.test/'+from.replaceAll('\\','/'));
 let target=decodeURIComponent(uri.pathname).slice(1);if(target.endsWith('/'))target+='index.html';
 assert.ok(fs.existsSync(path.join(out,target)),`Missing asset or page: ${from} → ${ref}`);
 if(uri.hash){const content=fs.readFileSync(path.join(out,target),'utf8');assert.ok(content.includes(`id="${uri.hash.slice(1)}"`),`Missing fragment: ${ref}`);}
 links++;
};
for(const f of files){
 if(!f.endsWith('.html')) continue;pages++;
 const html=fs.readFileSync(path.join(out,f),'utf8');
 assert.match(html,/<html lang="(uk|en)">/);
 assert.match(html,/<title>[^<]+<\/title>/);
 if(!['index.html','404.html'].includes(f)){
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`One H1: ${f}`);
  assert.match(html,/<meta name="description" content="[^"]+"/);
  assert.match(html,/hreflang="uk"/);assert.match(html,/hreflang="en"/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`Duplicate IDs: ${f}`);
 }
 for(const m of html.matchAll(/(?:href|src|data-full)="([^"<>]+)"/g))if(!/^(?:https?:|mailto:|tel:|data:)/.test(m[1]))resolve(f,m[1]);
 for(const m of html.matchAll(/srcset="([^"]+)"/g))for(const source of m[1].split(','))resolve(f,source.trim().split(' ')[0]);
 assert.ok(!/nau-website|nobility|Unsplash|Lorem ipsum|TODO|undefined/.test(html),`Unwanted source content: ${f}`);
}
for(const f of files.filter(f=>f.endsWith('.css'))){const css=fs.readFileSync(path.join(out,f),'utf8');for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))if(!m[1].startsWith('data:'))resolve(f,m[1]);}
const photos=JSON.parse(fs.readFileSync(path.join(root,'content/photos.json'),'utf8'));
for(const p of photos.filter(p=>p.publish)){
 assert.equal(p.publicationStatus,'approved',`Unapproved publication: ${p.id}`);
 for(const l of ['uk','en'])assert.ok(p.alt[l]?.trim(),`Missing ${l} alt: ${p.id}`);
 for(const w of [640,960,1600])assert.ok(fs.existsSync(path.join(out,`assets/photos/${p.id}-${w}.webp`)));
}
assert.ok(!files.some(f=>/\.(nef|pdf|docx|csv)$/i.test(f)), 'Private source material in deployment');
console.log(JSON.stringify({result:'PASS',htmlPages:pages,internalReferences:links,approvedPhotos:photos.filter(p=>p.publish).length,files:files.length},null,2));
