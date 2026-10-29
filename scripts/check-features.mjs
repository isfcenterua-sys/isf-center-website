import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
export function checkFeatures({root,out}) {
  const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name),'utf8'));
  const location=read('location.json'),stories=read('stories.json'),people=read('people.json');
  const blocks=stories.filter(s=>s.ownerSpiritualBlock);
  assert.equal(blocks.length,7,'Exactly seven owner-supplied spiritual blocks');
  assert.equal(location.source,'https://maps.app.goo.gl/tkxzgF4XDRbVpCXZ9');
  assert.equal(location.placeDataId,'0x47390f0003d6df63:0x66c98597db21c08e');
  assert.equal(location.latitude,48.606734);assert.equal(location.longitude,22.5548433);
  const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  for(const lang of ['uk','en']){
    const names=['','about/','mission/','values/','spiritual-life/','day-in-the-community/','icon-history/','community-life/','activities/','gallery/','news/','support/','contacts/'];
    for(const name of names){
      const html=fs.readFileSync(path.join(out,lang,name,'index.html'),'utf8');
      assert.equal((html.match(/class="find-us section"/g)||[]).length,1,'One map per page');
      assert.ok(html.includes('src="'+escape(location.embed[lang])+'"'),'Official matching map embed');
      assert.ok(html.includes('href="'+location.source+'"'),'Original directions link');
      assert.ok(location.embed[lang].startsWith('https://www.google.com/maps/embed?pb='));
      assert.ok(decodeURIComponent(location.embed[lang]).includes(location.placeDataId));
      assert.ok(html.includes('loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen'));
      assert.ok(html.includes('favicon.ico?v=')&&html.includes('favicon.svg?v=')&&html.includes('apple-touch-icon.png?v='));
      assert.ok(html.includes('class="brand-approved"')&&html.includes('class="footer-legal-name"'));
      for(const brand of ['whatsapp','viber','telegram'])assert.ok(html.includes(`/assets/icons/${brand}.svg`));
    }
    for(const block of blocks){
      const main=fs.readFileSync(path.join(out,lang,block.section,'index.html'),'utf8').match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
      assert.ok(main.includes(`id="story-${block.id}"`),'Spiritual block is in its intended section');
      for(const text of [block.title[lang],block.summary[lang],block.meaning[lang]])assert.ok(main.includes(escape(text)),`Missing complete owner text: ${block.id}/${lang}`);
    }
    const home=fs.readFileSync(path.join(out,lang,'index.html'),'utf8');
    assert.match(home,/<div class="wrap split intro-community reveal">[\s\S]*?community-chapel-960\.webp/);
    const life=fs.readFileSync(path.join(out,lang,'community-life/index.html'),'utf8');
    assert.ok(life.includes('id="nature-and-everyday-life"')&&life.includes('bell-tower-sunset-960.webp')&&life.includes('autumn-courtyard-960.webp'));
  }
  for(const person of people){assert.equal(person.portrait.processing,'original-crop-no-retouch');assert.ok(fs.existsSync(path.join(out,person.portrait.src)));}
  const headers=fs.readFileSync(path.join(out,'_headers'),'utf8');assert.ok(headers.includes('frame-src https://www.google.com;'));
  for(const name of ['favicon.ico','favicon.svg','apple-touch-icon.png'])assert.ok(fs.existsSync(path.join(out,'assets',name)));
  return {ownerSpiritualBlocks:blocks.length,teamPeople:people.length,maps:26,originalMapPin:location.placeDataId};
}
