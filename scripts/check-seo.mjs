import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

export function checkMetadata({root,out,siteURL}) {
  const seo=JSON.parse(fs.readFileSync(path.join(root,'content/seo.json'),'utf8'));
  const pages=[],titles=[],descriptions=[];
  assert.deepEqual(Object.keys(seo.uk).sort(),Object.keys(seo.en).sort(),'SEO language parity');
  for(const lang of ['uk','en'])for(const [slug,metadata] of Object.entries(seo[lang])){
    const pagePath=`/${lang}/${slug==='home'?'':slug+'/'}`;
    const html=fs.readFileSync(path.join(out,pagePath.slice(1),'index.html'),'utf8');
    const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    assert.equal(title,escape(metadata.title),`Wrong page title: ${pagePath}`);
    assert.equal(description,escape(metadata.description),`Wrong meta description: ${pagePath}`);
    assert.ok(metadata.title.length>=15&&metadata.title.length<=95,`Title length: ${pagePath}`);
    assert.ok(metadata.description.length>=70&&metadata.description.length<=200,`Description length: ${pagePath}`);
    assert.ok(html.includes(`<meta property="og:description" content="${description}">`),`OG description mismatch: ${pagePath}`);
    assert.ok(html.includes(`<link rel="canonical" href="${siteURL}${pagePath}">`),`Canonical mismatch: ${pagePath}`);
    for(const other of ['uk','en'])assert.ok(html.includes(`<link rel="alternate" hreflang="${other}" href="${siteURL}/${other}/${slug==='home'?'':slug+'/'}">`),`Hreflang mismatch: ${pagePath}`);
    pages.push(siteURL+pagePath);titles.push(title);descriptions.push(description);
  }
  assert.equal(new Set(titles).size,titles.length,'Duplicate page titles');
  assert.equal(new Set(descriptions).size,descriptions.length,'Duplicate meta descriptions');
  const sitemap=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8');
  assert.ok(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.equal(new Set(locations).size,locations.length,'Duplicate sitemap URLs');
  assert.deepEqual([...locations].sort(),pages.sort(),'Sitemap and generated language pages differ');
  assert.ok(fs.readFileSync(path.join(out,'robots.txt'),'utf8').includes(`Sitemap: ${siteURL}/sitemap.xml`));
  for(const lang of ['uk','en']){
    const main=fs.readFileSync(path.join(out,lang,'icon-history/index.html'),'utf8').match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
    assert.ok(main.includes('/assets/photos/icon-original-960.webp'),'Original icon must be present in main content');
    assert.ok(!main.includes('/assets/brand/'),'A branding reconstruction must not replace the documentary icon');
  }
  return {pages:pages.length,uniqueTitles:titles.length,uniqueDescriptions:descriptions.length,sitemapURLs:locations.length};
}
