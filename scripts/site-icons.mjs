import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

// One head fragment for the root redirect, both languages and the 404 page.
export function createSiteIcons({root,write}){
 const files=['favicon.ico','favicon-16x16.png','favicon-32x32.png','apple-touch-icon.png','android-chrome-192x192.png','android-chrome-512x512.png','android-maskable-512x512.png'];
 const hash=createHash('sha256');
 for(const file of files){const bytes=fs.readFileSync(path.join(root,'assets',file));hash.update(bytes);write(file,bytes);}
 const version=hash.digest('hex').slice(0,12);
 const icon=file=>`/${file}?v=${version}`;
 for(const lang of ['uk','en']){
  const manifest=JSON.stringify({id:'/',name:lang==='uk'?'ISF — Киблярська обитель':'ISF — Kybliary Community',short_name:'ISF',lang,dir:'ltr',start_url:`/${lang}/`,scope:'/',display:'standalone',background_color:'#F7F3E9',theme_color:'#183D2D',icons:[{src:icon('android-chrome-192x192.png'),sizes:'192x192',type:'image/png',purpose:'any'},{src:icon('android-chrome-512x512.png'),sizes:'512x512',type:'image/png',purpose:'any'},{src:icon('android-maskable-512x512.png'),sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,2)+'\n';
  write(`${lang}/site.webmanifest`,manifest);if(lang==='uk')write('site.webmanifest',manifest);
 }
 const head=lang=>`<meta name="theme-color" content="#183D2D"><meta name="application-name" content="ISF"><meta name="apple-mobile-web-app-title" content="ISF"><meta name="mobile-web-app-capable" content="yes"><meta name="msapplication-TileColor" content="#183D2D"><meta name="msapplication-TileImage" content="${icon('android-chrome-192x192.png')}"><link rel="icon" href="${icon('favicon.ico')}" sizes="16x16 32x32 48x48 64x64 128x128 256x256" type="image/x-icon"><link rel="shortcut icon" href="${icon('favicon.ico')}" type="image/x-icon"><link rel="icon" href="${icon('favicon-16x16.png')}" type="image/png" sizes="16x16"><link rel="icon" href="${icon('favicon-32x32.png')}" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="${icon('apple-touch-icon.png')}" sizes="180x180"><link rel="manifest" href="${lang==='en'?'/en':''}/site.webmanifest?v=${version}">`;
 return {head,version};
}
