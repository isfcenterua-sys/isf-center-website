import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const pngs={'favicon-16x16.png':16,'favicon-32x32.png':32,'apple-touch-icon.png':180,'android-chrome-192x192.png':192,'android-chrome-512x512.png':512,'android-maskable-512x512.png':512};
for(const [name,size] of Object.entries(pngs)){
 const bytes=fs.readFileSync(path.join(root,name));assert.equal(bytes.subarray(1,4).toString(),'PNG');assert.equal(bytes.readUInt32BE(16),size);assert.equal(bytes.readUInt32BE(20),size);assert.deepEqual(bytes,fs.readFileSync(path.join(root,'assets',name)));
}
const ico=fs.readFileSync(path.join(root,'favicon.ico'));assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),6);
const sizes=Array.from({length:6},(_,i)=>ico[6+i*16]||256);assert.deepEqual(sizes,[16,32,48,64,128,256]);
const pages=fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html')&&!f.startsWith('google'));
let count=0;
for(const file of pages){
 const html=fs.readFileSync(path.join(root,file),'utf8');if(!html.includes('<head>'))continue;
 const head=html.split('</head>')[0];if(file.startsWith('assets'))continue;
 for(const name of ['favicon.ico?v=','favicon-16x16.png?v=','favicon-32x32.png?v=','apple-touch-icon.png?v=','rel="shortcut icon"','rel="manifest"','name="theme-color"'])assert.ok(head.includes(name),file+' → '+name);
 assert.ok(!head.includes('favicon.svg'),file+' selects the retired monogram');count++;
}
assert.equal(count,42);
for(const [file,lang] of [['site.webmanifest','uk'],['uk/site.webmanifest','uk'],['en/site.webmanifest','en']]){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));assert.equal(manifest.lang,lang);assert.equal(manifest.start_url,`/${lang}/`);assert.equal(manifest.scope,'/');assert.equal(manifest.theme_color,'#183D2D');assert.equal(manifest.icons.length,3);assert.ok(manifest.icons.some(i=>i.purpose==='maskable'));
 for(const icon of manifest.icons)assert.ok(fs.existsSync(path.join(root,icon.src.split('?')[0])));
}
console.log(JSON.stringify({result:'PASS',pages:count,pngSizes:[16,32,180,192,512],icoSizes:sizes,manifests:3,legacySVGSelected:false},null,2));
