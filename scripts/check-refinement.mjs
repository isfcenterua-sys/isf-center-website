import fs from 'node:fs';import assert from 'node:assert/strict';
const photos=JSON.parse(fs.readFileSync('content/photos.json','utf8'));
assert.equal(photos.length,48);assert.equal(photos.filter(p=>p.showcase!==false).length,46);
for(const id of ['bedroom','bedroom-secondary']){assert.equal(photos.find(p=>p.id===id).showcase,false);assert.ok(fs.existsSync(`assets/photos/${id}-1920.webp`));}
for(const lang of ['uk','en']){
 assert.ok(!fs.existsSync(`dist/${lang}/news/index.html`));
 const pages=fs.readdirSync(`dist/${lang}`,{recursive:true}).filter(p=>p.endsWith('index.html'));
 for(const page of pages){const html=fs.readFileSync(`dist/${lang}/${page}`,'utf8');assert.ok(!html.includes(`href="/${lang}/news/`),page);assert.ok(!html.includes('source-photo-bedroom'),page);assert.ok(html.includes('class="nav-group"'),page);}
 const gallery=fs.readFileSync(`dist/${lang}/gallery/index.html`,'utf8');assert.equal((gallery.match(/ data-photo-card/g)||[]).length,46);assert.equal((gallery.match(/data-photo-description="/g)||[]).length,46);
 assert.equal((gallery.match(/class="text-link card-read-more"/g)||[]).length,46);
 const spiritual=fs.readFileSync(`dist/${lang}/spiritual-life/index.html`,'utf8');assert.ok(spiritual.includes('id="spiritual-oversight"'));assert.ok(spiritual.includes(lang==='uk'?'Єпископ Віктор Веряскін':'Bishop Viktor Veriaskin'));
 const home=fs.readFileSync(`dist/${lang}/index.html`,'utf8');assert.ok(home.includes('preview-terrace-fellowship'));assert.ok(home.includes('src="/assets/photos/community-table.webp"'));assert.ok(home.includes('data-team-coverflow'));
}
assert.ok(!fs.readFileSync('dist/sitemap.xml','utf8').includes('/news/'));
const styles=fs.readFileSync('assets/structure.css','utf8');assert.ok(styles.includes('object-fit:cover'));assert.ok(!/\b(?:html|body)\s*\{[^}]*overflow-x\s*:\s*hidden/.test(styles));
console.log(JSON.stringify({result:'PASS',publicPages:40,photosRetained:48,galleryPhotos:46,archivedRooms:2,newsDisabled:true,spiritualOversight:'Owner-confirmed UA/EN'},null,2));
