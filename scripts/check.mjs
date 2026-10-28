import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
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
 if(!f.endsWith('.html')) continue;
 if(/^google[0-9a-f]+\.html$/.test(f)){assert.equal(fs.readFileSync(path.join(out,f),'utf8').trim(),'google-site-verification: '+f);continue;}
 pages++;
 const html=fs.readFileSync(path.join(out,f),'utf8');
 assert.match(html,/<html lang="(uk|en)">/);
 assert.match(html,/<title>[^<]+<\/title>/);
 if(!['index.html','404.html'].includes(f)){
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`One H1: ${f}`);
  assert.match(html,/<meta name="description" content="[^"]+"/);
  assert.match(html,/hreflang="uk"/);assert.match(html,/hreflang="en"/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`Duplicate IDs: ${f}`);
 }
 for(const m of html.matchAll(/(?:href|src|data-full)="([^"<>]+)"/g))if(!/^(?:https?:|mailto:|tel:|viber:|tg:|data:)/.test(m[1]))resolve(f,m[1]);
 for(const m of html.matchAll(/srcset="([^"]+)"/g))for(const source of m[1].split(','))resolve(f,source.trim().split(' ')[0]);
 assert.ok(!/nau-website|nobility|Unsplash|Lorem ipsum|TODO|undefined/.test(html),`Unwanted source content: ${f}`);
 assert.ok(!/Ізюм|Изюм|Izium|Izyum|2002|присни|уві сні|in a dream/.test(html),`Unconfirmed icon narrative was published: ${f}`);
 if(!['index.html','404.html'].includes(f)){
  assert.ok(html.includes('class="brand-logo"'),`Missing supplied brand image: ${f}`);
  const header=html.match(/<header[\s\S]*?<\/header>/)[0];
  assert.ok(header.includes('class="brand-full-name"'),`Missing full legal name beside supplied icon: ${f}`);
  assert.ok(html.includes('class="footer-legal-name"'),`Missing complete legal name in footer: ${f}`);
  for(const href of ['tel:+380957332967','mailto:isf.center.ua@gmail.com','https://wa.me/380957332967','viber://chat?number=%2B380957332967','https://t.me/+380957332967'])assert.ok(html.includes(`href="${href}"`),`Missing official footer contact ${href}: ${f}`);
  for(const match of html.matchAll(/href="tel:([^\"]+)"/g))assert.equal(match[1],'+380957332967',`Unconfirmed phone on ${f}`);
 }
 if(/(?:^|[\\/])about[\\/]index\.html$/.test(f)){
  assert.equal((html.match(/class="interactive-card person-card"/g)||[]).length,3,`Exactly three confirmed team members: ${f}`);
 }
 if(/(?:^|[\\/])contacts[\\/]index\.html$/.test(f))assert.ok(html.includes('mailto:isf.center.ua@gmail.com'),`Missing confirmed email: ${f}`);
}
for(const f of files.filter(f=>f.endsWith('.css'))){const css=fs.readFileSync(path.join(out,f),'utf8');for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))if(!m[1].startsWith('data:'))resolve(f,m[1]);}
const photos=JSON.parse(fs.readFileSync(path.join(root,'content/photos.json'),'utf8'));
for(const p of photos.filter(p=>p.publish)){
 assert.equal(p.publicationStatus,'approved',`Unapproved publication: ${p.id}`);
 for(const l of ['uk','en'])assert.ok(p.alt[l]?.trim(),`Missing ${l} alt: ${p.id}`);
 for(const w of [640,960,1920])assert.ok(fs.existsSync(path.join(out,`assets/photos/${p.id}-${w}.webp`)));
}
assert.ok(!files.some(f=>/\.(nef|pdf|docx|csv)$/i.test(f)), 'Private source material in deployment');
assert.ok(!files.some(f=>f.includes('prayer-requests')), 'Private image with a visible telephone must not be deployed');
const translations=JSON.parse(fs.readFileSync(path.join(root,'content/translations.json'),'utf8'));
const editorial=JSON.parse(fs.readFileSync(path.join(root,'content/editorial.json'),'utf8'));
function shape(value){return Array.isArray(value)?value.map(shape):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,shape(value[k])])):typeof value;}
assert.deepEqual(shape(translations.uk),shape(translations.en),'Interface translation parity');
assert.deepEqual(shape(editorial.uk),shape(editorial.en),'Editorial translation parity');
assert.equal(editorial.missionStatus,'confirmed','Mission wording requires owner agreement');
for(const key of ['historyEvents','dayStages','activities'])assert.deepEqual(editorial.uk[key].map(x=>x.date||x.photo||null),editorial.en[key].map(x=>x.date||x.photo||null),`Different content in language versions: ${key}`);
const documents=JSON.parse(fs.readFileSync(path.join(root,'content/public-documents.json'),'utf8'));
for(const document of documents){assert.equal(document.ownerApproved,true);const body=fs.readFileSync(path.join(out,document.path));assert.equal(createHash('sha256').update(body).digest('hex'),document.sha256,'Supplied certificate was changed');}
const people=JSON.parse(fs.readFileSync(path.join(root,'content/people.json'),'utf8'));assert.equal(people.length,3);
assert.deepEqual(people.map(p=>p.photo),['bishop-vitalii','archimandrite-mykola','mother-mariia']);
const stories=JSON.parse(fs.readFileSync(path.join(root,'content/stories.json'),'utf8'));
for(const lang of ['uk','en']){
 assert.equal(new Set(stories.map(s=>s.summary[lang])).size,stories.length,'Repeated activity summary');
 assert.equal(new Set(stories.map(s=>s.meaning[lang])).size,stories.length,'Repeated spiritual explanation');
 for(const story of stories){assert.ok(story.title[lang]&&story.summary[lang]&&story.meaning[lang]&&story.details[lang].length);assert.equal(story.status,'confirmed');assert.equal(story.kind,'activity');assert.equal(story.date,null,'No dates may be invented for undated activity photographs');}
}
for(const lang of ['uk','en']){
 const home=fs.readFileSync(path.join(out,lang,'index.html'),'utf8');
 assert.ok(home.includes('monastery-hero-1920.webp'),'Required real hero photograph missing');
 const icon=fs.readFileSync(path.join(out,lang,'icon-history/index.html'),'utf8');
 assert.ok(icon.includes('icon-original-1920.webp'),'Required original icon photograph missing');
 assert.ok(!icon.includes('isf-mother-of-god')||icon.includes('icon-original'),'Brand image must not replace documentary icon');
}
assert.equal(fs.readFileSync(path.join(root,'public/google696019cf5de45d47.html'),'utf8'),fs.readFileSync(path.join(out,'google696019cf5de45d47.html'),'utf8'));
assert.equal(fs.readFileSync(path.join(out,'assets/google-verification.txt'),'utf8'),fs.readFileSync(path.join(out,'google696019cf5de45d47.html'),'utf8'));
assert.ok(fs.readFileSync(path.join(out,'_redirects'),'utf8').includes('/google696019cf5de45d47.html /assets/google-verification.txt 200'));

console.log(JSON.stringify({result:'PASS',htmlPages:pages,internalReferences:links,approvedPhotos:photos.filter(p=>p.publish).length,files:files.length},null,2));
